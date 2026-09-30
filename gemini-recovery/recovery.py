"""
recovery.py
-----------
AI-Powered Customer Journey Friction Detection and Recovery Assistant
Person 3: Gemini + Recovery AI

Core module providing `analyze_recovery(ml_result, customer_message)`
for Person 2's FastAPI backend and recovery workflows.
"""

from typing import Dict, Any, Optional
from gemini_service import (
    analyze_recovery,
    generate_recovery_plan,
    get_rule_based_fallback,
    SUPPORTED_FRICTION_TYPES,
)

__all__ = [
    "analyze_recovery",
    "generate_recovery_plan",
    "get_rule_based_fallback",
    "SUPPORTED_FRICTION_TYPES",
]
