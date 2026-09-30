"""
gemini_service.py
-----------------
AI-Powered Customer Journey Friction Detection and Recovery Assistant
Person 3: Gemini + Recovery AI

Provides integration with Google Gemini using the official `google-genai` SDK.
Analyzes ML friction predictions and customer messages to generate structured
recovery actions and personalized communications.
"""

import os
import re
import json
import time
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

# Official Google GenAI SDK
from google import genai
from google.genai import types
from google.genai.errors import APIError

# Configure logger
logger = logging.getLogger("gemini_recovery")
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter("[%(levelname)s] %(name)s: %(message)s")
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)

# Load environment variables from potential .env locations
_module_dir = Path(__file__).parent.resolve()
_root_dir = _module_dir.parent.resolve()
_cwd = Path.cwd().resolve()

# Prioritize module .env, then current working dir, then parent root
for env_path in [_module_dir / ".env", _cwd / ".env", _root_dir / ".env"]:
    if env_path.is_file():
        load_dotenv(dotenv_path=env_path)
        break
else:
    load_dotenv()

# Supported friction types
SUPPORTED_FRICTION_TYPES = {
    "PAYMENT",
    "CART_ABANDONMENT",
    "PRODUCT_CONFUSION",
    "DELIVERY",
    "CUSTOMER_SUPPORT",
    "NEGATIVE_FEEDBACK",
    "OTHER",
}

# Supported Gemini Flash models
DEFAULT_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")

_CLIENT_INITIALIZED = False
_CLIENT_INSTANCE: Optional[genai.Client] = None


def get_gemini_client() -> Optional[genai.Client]:
    """
    Initializes and returns the official google-genai Client.
    Returns None if GEMINI_API_KEY is missing, empty, or placeholder.
    Safeguards against exposing API key in logs or exceptions.
    """
    global _CLIENT_INITIALIZED, _CLIENT_INSTANCE

    if _CLIENT_INITIALIZED:
        return _CLIENT_INSTANCE

    api_key = os.getenv("GEMINI_API_KEY", "").strip()

    # Check for empty or standard placeholder values
    if not api_key or api_key in {"your_gemini_api_key_here", "YOUR_GEMINI_API_KEY"}:
        logger.warning(
            "GEMINI_API_KEY not configured or set to placeholder in .env. "
            "Safe rule-based recovery fallback will be used."
        )
        _CLIENT_INITIALIZED = True
        _CLIENT_INSTANCE = None
        return None

    try:
        # Initialize client with official google-genai SDK
        _CLIENT_INSTANCE = genai.Client(api_key=api_key)
        _CLIENT_INITIALIZED = True
        return _CLIENT_INSTANCE
    except Exception as exc:
        # Never log API key
        logger.error(f"Failed to initialize google-genai Client: {exc.__class__.__name__}")
        _CLIENT_INITIALIZED = True
        _CLIENT_INSTANCE = None
        return None


def clean_and_parse_json(raw_text: str) -> Dict[str, str]:
    """
    Safely extracts and parses JSON from Gemini output.
    Handles potential markdown code fences (```json ... ```) and extra whitespace.
    """
    if not raw_text or not raw_text.strip():
        raise ValueError("Received empty response from Gemini.")

    text = raw_text.strip()

    # Safely strip markdown code blocks if present
    if "```" in text:
        match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text, re.IGNORECASE)
        if match:
            text = match.group(1).strip()
        else:
            text = text.replace("```json", "").replace("```", "").strip()

    # Extract JSON object between outer curly braces
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end >= start:
        text = text[start : end + 1]

    parsed = json.loads(text)

    if not isinstance(parsed, dict):
        raise ValueError(f"Expected a JSON dictionary, got {type(parsed).__name__}")

    # Validate and ensure required fields are present
    required_keys = ["cause", "explanation", "recovery_action", "customer_message"]
    for key in required_keys:
        if key not in parsed or parsed[key] is None:
            parsed[key] = ""
        else:
            parsed[key] = str(parsed[key]).strip()

    return parsed


def build_recovery_prompt(ml_result: Dict[str, Any], customer_message: str) -> str:
    """
    Constructs the prompt for Gemini Flash based on ML prediction and customer text.
    Enforces strict rules:
    - Return ONLY valid JSON
    - Never invent refunds, discounts, promo codes, delivery dates, or false promises
    - Ground all reasoning in the provided evidence and friction type
    """
    customer_id = ml_result.get("customer_id", "UNKNOWN")
    abandonment_risk = ml_result.get("abandonment_risk", 0.0)
    friction_type = ml_result.get("friction_type", "OTHER")
    important_factors: List[str] = ml_result.get("important_factors", [])

    factors_formatted = (
        "\n".join([f"- {f}" for f in important_factors])
        if important_factors
        else "- No specific factors recorded"
    )

    prompt = f"""You are an AI-Powered Customer Journey Recovery Assistant in an e-commerce platform.

Analyze the following customer journey friction evidence and generate a structured recovery plan.

### INPUT DATA:
- Customer ID: {customer_id}
- Friction Type: {friction_type}
- Abandonment Risk Score: {abandonment_risk} (scale 0.0 to 1.0)
- Machine Learning Important Factors (Evidence):
{factors_formatted}
- Customer Message / Feedback:
"{customer_message}"

### RECOVERY GUIDELINES BY FRICTION TYPE:
1. PAYMENT:
   - Possible causes: Payment failure, payment gateway timeout, payment processing issue.
   - Recommended recovery: Payment retry, alternative payment method, payment status verification.
   - Customer message: Empathetic acknowledgment of payment issue, clear guidance to retry or choose an alternative method.
2. CART_ABANDONMENT:
   - Possible causes: Purchase hesitation, checkout abandonment, cost concern if supported by evidence.
   - Recommended recovery: Cart reminder, product assistance, checkout assistance.
   - STRICT CONSTRAINT: Do NOT automatically promise discounts, coupons, or price drops unless explicitly verified in input.
3. PRODUCT_CONFUSION:
   - Possible causes: Uncertainty about product specifications, size uncertainty, feature comparison confusion.
   - Recommended recovery: Product comparison, specifications, FAQ, size guide, tailored product recommendation.
   - Customer message: Helpful clarification, links to size guide/specifications, offer for support.
4. DELIVERY:
   - Possible causes: Delivery delay, transit status concern, tracking issue.
   - Recommended recovery: Shipment tracking verification, customer support escalation.
   - STRICT CONSTRAINT: Never invent specific delivery dates or transit promises.
5. CUSTOMER_SUPPORT:
   - Possible causes: Unresolved support issue, delayed agent response.
   - Recommended recovery: Priority support follow-up, agent escalation.
6. NEGATIVE_FEEDBACK:
   - Possible causes: Dissatisfaction identified directly from the customer feedback.
   - Recommended recovery: Appropriate operational recovery action based only on provided information.
7. OTHER:
   - Cause and recovery based strictly on available evidence and customer text.

### STRICT OPERATIONAL CONSTRAINTS:
1. Return ONLY a single valid JSON object. Do not include markdown code fences, headers, or any commentary before or after.
2. The JSON object must contain EXACTLY these four string keys:
   - "cause": Concise identification of the friction cause.
   - "explanation": Clear, factual explanation grounded in the evidence.
   - "recovery_action": Practical internal or operational recovery action.
   - "customer_message": Short, polite, personalized customer message.
3. Never invent facts or customer information.
4. Never invent refunds, discounts, financial compensation, or delivery dates.
5. Base recommendations strictly on the actual friction type and evidence.

Return ONLY the JSON object:"""
    return prompt


def get_rule_based_fallback(
    ml_result: Dict[str, Any], customer_message: str
) -> Dict[str, str]:
    """
    Deterministic rule-based recovery generator.
    Guarantees the system operates reliably if Gemini API key is unavailable,
    quota is exceeded, or network issues occur during hackathon demos.
    """
    friction_type = str(ml_result.get("friction_type", "OTHER")).upper()

    fallbacks = {
        "PAYMENT": {
            "cause": "Payment processing issue",
            "explanation": "The customer appears to have experienced a payment problem during checkout.",
            "recovery_action": "Verify the payment status and offer an alternative payment method or payment retry.",
            "customer_message": "We're sorry about the issue with your payment. Please verify your payment status and retry using an available payment method.",
        },
        "CART_ABANDONMENT": {
            "cause": "Checkout abandonment and purchase hesitation",
            "explanation": "The customer added products to their cart but left before completing the checkout process.",
            "recovery_action": "Send a cart reminder and provide checkout assistance to help complete the order.",
            "customer_message": "We noticed items left in your cart. If you need any assistance completing your order, we are here to help.",
        },
        "PRODUCT_CONFUSION": {
            "cause": "Product specification and sizing uncertainty",
            "explanation": "The customer experienced uncertainty regarding product sizing or specifications.",
            "recovery_action": "Provide product comparison, detailed size guide, and product recommendations.",
            "customer_message": "We're happy to help you find the right fit! Please check our size guide and specifications, or let us know if you need more details.",
        },
        "DELIVERY": {
            "cause": "Delivery delay and tracking concern",
            "explanation": "The customer reported an issue with shipment arrival or tracking updates.",
            "recovery_action": "Verify shipment tracking information with the carrier and escalate to customer support if needed.",
            "customer_message": "We understand your concern regarding your delivery. We are verifying the latest tracking status and will ensure you receive an update.",
        },
        "CUSTOMER_SUPPORT": {
            "cause": "Unresolved customer support inquiry",
            "explanation": "The customer has an ongoing or unresolved support request requiring attention.",
            "recovery_action": "Escalate inquiry to customer care for immediate priority follow-up.",
            "customer_message": "We apologize for the inconvenience. A customer care representative is reviewing your inquiry and will follow up shortly.",
        },
        "NEGATIVE_FEEDBACK": {
            "cause": "Customer dissatisfaction with shopping experience",
            "explanation": "The customer encountered difficulties during their journey and expressed negative feedback.",
            "recovery_action": "Review customer journey friction points and initiate proactive customer support follow-up.",
            "customer_message": "We sincerely apologize that your experience was frustrating. We are reviewing your feedback to resolve your concerns and provide the assistance you need.",
        },
    }

    return fallbacks.get(
        friction_type,
        {
            "cause": "Customer journey friction detected",
            "explanation": "Journey friction indicators detected based on ML assessment and customer interaction.",
            "recovery_action": "Review session data and contact the customer with appropriate assistance.",
            "customer_message": "Thank you for reaching out. Please let us know how we can best assist you with your order.",
        },
    )


def generate_recovery_plan(
    ml_result: Dict[str, Any], customer_message: str
) -> Dict[str, str]:
    """
    Communicates with Gemini to diagnose friction and generate recovery plan.
    Falls back gracefully to rule-based recovery if API key is not configured,
    or if API / parsing error occurs.
    """
    client = get_gemini_client()

    if client is None:
        return get_rule_based_fallback(ml_result, customer_message)

    prompt = build_recovery_prompt(ml_result, customer_message)
    model_name = os.getenv("GEMINI_MODEL", DEFAULT_MODEL)

    max_retries = 2
    retry_delay = 2.0

    for attempt in range(max_retries + 1):
        try:
            config = types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.2,
            )

            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=config,
            )

            if not response or not response.text:
                raise ValueError("Gemini returned empty response.")

            return clean_and_parse_json(response.text)

        except APIError as api_err:
            code = getattr(api_err, "code", None) or getattr(getattr(api_err, "response", None), "status_code", "UNKNOWN")
            status = getattr(api_err, "status", "UNKNOWN")
            is_transient = (
                code == 503
                or str(status).upper() == "UNAVAILABLE"
                or "503" in str(api_err)
                or "UNAVAILABLE" in str(api_err).upper()
            )

            if is_transient and attempt < max_retries:
                logger.warning(
                    f"Gemini API temporarily unavailable (503/UNAVAILABLE). "
                    f"Retrying in {retry_delay}s (attempt {attempt + 1}/{max_retries})..."
                )
                time.sleep(retry_delay)
                continue

            message = getattr(api_err, "message", "")
            details = getattr(api_err, "details", "")

            err_lines = [
                f"Gemini API error occurred: {api_err.__class__.__name__}",
                f"HTTP Status Code: {code}",
                f"Status: {status}",
                f"Message: {message}",
                f"Details: {details}",
            ]
            error_output = "\n".join(err_lines)

            api_key = os.getenv("GEMINI_API_KEY", "").strip()
            if api_key:
                error_output = error_output.replace(api_key, "[REDACTED_API_KEY]")
            error_output = re.sub(r"AIza[0-9A-Za-z-_]{35}", "[REDACTED_API_KEY]", error_output)

            logger.error(f"\n{error_output}")
            return get_rule_based_fallback(ml_result, customer_message)
        except Exception as exc:
            err_msg = f"Failed to generate recovery with Gemini: {exc.__class__.__name__}: {exc}"
            api_key = os.getenv("GEMINI_API_KEY", "").strip()
            if api_key:
                err_msg = err_msg.replace(api_key, "[REDACTED_API_KEY]")
            err_msg = re.sub(r"AIza[0-9A-Za-z-_]{35}", "[REDACTED_API_KEY]", err_msg)
            logger.error(err_msg)
            return get_rule_based_fallback(ml_result, customer_message)

    return get_rule_based_fallback(ml_result, customer_message)


def analyze_recovery(
    ml_result: Dict[str, Any], customer_message: Optional[str] = None
) -> Dict[str, Any]:
    """
    Main reusable recovery function for Person 3 module.
    Designed for seamless integration into Person 2's FastAPI backend:

        from gemini_service import analyze_recovery
        result = analyze_recovery(ml_result, customer_message)

    Args:
        ml_result: Dictionary containing Person 1 ML output:
                   - customer_id (str)
                   - abandonment_risk (float)
                   - friction_type (str)
                   - important_factors (list of str)
        customer_message: Customer review, chat message, or support ticket text.

    Returns:
        Dictionary with:
        {
            "customer_id": str,
            "friction_type": str,
            "abandonment_risk": float,
            "cause": str,
            "explanation": str,
            "recovery_action": str,
            "customer_message": str
        }
    """
    if ml_result is None or not isinstance(ml_result, dict):
        ml_result = {}

    # Extract customer message from parameter or dictionary fallback
    resolved_message = ""
    if customer_message is not None and str(customer_message).strip():
        resolved_message = str(customer_message).strip()
    elif "customer_message" in ml_result and str(ml_result["customer_message"]).strip():
        resolved_message = str(ml_result["customer_message"]).strip()

    customer_id = str(ml_result.get("customer_id", "UNKNOWN"))
    raw_friction = str(ml_result.get("friction_type", "OTHER")).upper().strip()
    friction_type = raw_friction if raw_friction in SUPPORTED_FRICTION_TYPES else "OTHER"

    try:
        abandonment_risk = round(float(ml_result.get("abandonment_risk", 0.0)), 4)
    except (ValueError, TypeError):
        abandonment_risk = 0.0

    important_factors = ml_result.get("important_factors", [])
    if not isinstance(important_factors, list):
        important_factors = [str(important_factors)] if important_factors else []

    sanitized_ml = {
        "customer_id": customer_id,
        "friction_type": friction_type,
        "abandonment_risk": abandonment_risk,
        "important_factors": important_factors,
    }

    recovery_plan = generate_recovery_plan(sanitized_ml, resolved_message)

    return {
        "customer_id": customer_id,
        "friction_type": friction_type,
        "abandonment_risk": abandonment_risk,
        "cause": recovery_plan.get("cause", ""),
        "explanation": recovery_plan.get("explanation", ""),
        "recovery_action": recovery_plan.get("recovery_action", ""),
        "customer_message": recovery_plan.get("customer_message", ""),
    }
