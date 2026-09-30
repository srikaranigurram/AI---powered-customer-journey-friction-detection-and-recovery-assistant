// JourneyAI API Integration Service
// Designed for seamless transition between Mock Data and FastAPI backend
// Person 4 Architecture: React Frontend -> FastAPI Backend -> ML & Gemini API

import {
  MOCK_CUSTOMERS,
  MOCK_RISK_ANALYTICS,
  MOCK_RECOVERY_LOGS
} from './mockData';

// Configuration: Switch between mock data and real FastAPI backend
// Configurable via environment variables (VITE_USE_MOCK and VITE_API_BASE_URL)
export const API_CONFIG = {
  USE_MOCK: import.meta.env.VITE_USE_MOCK !== 'false', // Defaults to true for frontend demo
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  TIMEOUT_MS: 8000
};

// Internal in-memory state for mock mutations during active session
let mockCustomersState = JSON.parse(JSON.stringify(MOCK_CUSTOMERS));
let mockRecoveryLogsState = JSON.parse(JSON.stringify(MOCK_RECOVERY_LOGS));

// Helper: Simulate network latency for demo calls
const simulateDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Normalizer: Adapts Person 1's ML output and FastAPI snake_case schemas
 * into frontend components seamlessly.
 *
 * Handles both:
 * 1. ML Schema: { customer_id, name, risk_score, risk_level, friction_type, evidence: [...], cart_value, status }
 * 2. Extended Frontend Schema: { id, name, riskScore, riskLevel, journey, ... }
 */
export function normalizeCustomer(raw) {
  if (!raw) return null;

  const id = raw.customer_id || raw.id || 'CUST-UNKNOWN';
  const name = raw.name || 'Anonymous Shopper';
  const riskScore = raw.risk_score !== undefined ? raw.risk_score : (raw.riskScore !== undefined ? raw.riskScore : 50);
  const riskLevel = (raw.risk_level || raw.riskLevel || 'LOW').toUpperCase();
  const frictionType = raw.friction_type || raw.frictionType || 'None (Healthy Flow)';
  const cartValue = Number(raw.cart_value !== undefined ? raw.cart_value : (raw.cartValue !== undefined ? raw.cartValue : 0));
  const status = raw.status || 'Pending Recovery';

  // Normalize Evidence (array of strings from ML vs object)
  let evidenceObj = {
    primaryFactor: frictionType,
    factors: [],
    impactScore: `Evaluated Risk: ${riskScore}%`
  };

  if (Array.isArray(raw.evidence)) {
    evidenceObj.factors = raw.evidence;
    evidenceObj.primaryFactor = raw.evidence[0] || frictionType;
  } else if (raw.evidence && typeof raw.evidence === 'object') {
    evidenceObj = {
      primaryFactor: raw.evidence.primaryFactor || raw.evidence.primary_factor || frictionType,
      factors: raw.evidence.factors || (Array.isArray(raw.evidence) ? raw.evidence : []),
      impactScore: raw.evidence.impactScore || raw.evidence.impact_score || `Risk: ${riskScore}%`
    };
  }

  // Fallback 6-Stage Journey Timeline if not supplied by backend
  const defaultJourney = [
    { step: "Product View", title: "Product Discovery", status: "completed", timestamp: "10:14 AM", duration: "3m 12s", details: "Viewed product specifications and verified compatibility." },
    { step: "Comparison", title: "Variant Comparison", status: "completed", timestamp: "10:17 AM", duration: "2m 45s", details: "Compared top alternatives and technical benchmarks." },
    { step: "Add to Cart", title: `Cart Total: $${cartValue.toFixed(2)}`, status: "completed", timestamp: "10:22 AM", duration: "45s", details: "Added item to cart and proceeded to checkout." },
    { step: "Checkout", title: "Shipping & Contact", status: frictionType.includes('Shipping') || frictionType.includes('Address') || frictionType.includes('Promo') ? "friction" : "completed", timestamp: "10:23 AM", duration: "1m 10s", details: "Checkout details entered." },
    { step: "Payment", title: "Payment Authorization", status: frictionType.includes('Payment') ? "friction" : (riskScore > 70 ? "friction" : "completed"), timestamp: "10:24 AM", duration: "4m 20s", details: frictionType.includes('Payment') ? "Payment tokenization friction detected." : "Standard payment stage." },
    { step: "Order/Abandonment", title: riskScore > 60 ? "Session Abandoned" : "Order Completed", status: riskScore > 60 ? "abandoned" : "completed", timestamp: "10:30 AM", duration: "Now", details: riskScore > 60 ? "Customer exited before final confirmation." : "Order confirmed." }
  ];

  // Normalized AI Insight
  const aiInsightObj = normalizeAIInsight(raw.aiInsight || raw.ai_insight || {
    customer_id: id,
    cause: evidenceObj.primaryFactor,
    explanation: `Telemetry signals indicate drop-off at the ${frictionType} stage. High buyer intent observed with basket value of $${cartValue.toFixed(2)}.`,
    recommended_recovery: `Send automated 1-Click Recovery link with personalized incentive via WhatsApp / Email.`,
    personalized_message: `Hi ${name.split(' ')[0]}, we noticed an issue completing your order. We've reserved your items—click here for 1-click checkout: https://shop.demo/r/${id}`
  });

  return {
    id,
    customer_id: id,
    name,
    email: raw.email || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    avatar: raw.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
    phone: raw.phone || "+1 (555) 019-2834",
    cartValue,
    cart_value: cartValue,
    currency: raw.currency || "USD",
    device: raw.device || "Mobile (iOS Safari)",
    location: raw.location || "United States",
    riskScore,
    risk_score: riskScore,
    riskLevel,
    risk_level: riskLevel,
    frictionType,
    friction_type: frictionType,
    frictionStage: raw.frictionStage || raw.friction_stage || (frictionType.includes('Payment') ? 'Payment' : frictionType.includes('Comparison') ? 'Comparison' : 'Checkout'),
    detectedAt: raw.detectedAt || raw.detected_at || "3 mins ago",
    status,
    evidence: evidenceObj,
    journey: raw.journey || defaultJourney,
    aiInsight: aiInsightObj,
    recovery: raw.recovery || {
      recommendedStrategy: aiInsightObj.recommendedRecovery,
      channel: "WhatsApp + Email",
      discountOffer: "Free Express Shipping",
      status: status === "Converted" ? "Converted" : status === "Triggered" ? "Triggered" : "Pending",
      history: []
    }
  };
}

/**
 * Normalizer: Adapts Gemini's response schema
 * React Frontend -> FastAPI -> Gemini API (No direct frontend API calls)
 *
 * Expected Schema:
 * {
 *   "customer_id": "CUST-8492",
 *   "cause": "...",
 *   "explanation": "...",
 *   "recommended_recovery": "...",
 *   "personalized_message": "..."
 * }
 */
export function normalizeAIInsight(raw) {
  if (!raw) return null;

  return {
    customerId: raw.customer_id || raw.customerId || 'CUST-UNKNOWN',
    likelyCause: raw.cause || raw.likely_cause || raw.likelyCause || 'Telemetry friction detected during checkout stage.',
    explanation: raw.explanation || 'Customer encountered friction before completing order confirmation.',
    recommendedRecovery: raw.recommended_recovery || raw.recommendedRecovery || 'Trigger 1-Click Alternate Payment link.',
    personalizedMessage: raw.personalized_message || raw.personalizedMessage || 'We saved your cart! Click here to complete your order in 1 tap.',
    confidenceScore: raw.confidence_score !== undefined ? raw.confidence_score : (raw.confidenceScore !== undefined ? raw.confidenceScore : 96),
    model: raw.model || 'Gemini 1.5 Pro',
    generatedAt: raw.generated_at || raw.generatedAt || 'Demo Mode'
  };
}

/**
 * 1. Fetch all customers with risk assessments & friction tags
 * FastAPI Endpoint: GET /api/customers
 */
export async function getCustomers() {
  if (API_CONFIG.USE_MOCK) {
    await simulateDelay(200);
    const normalized = mockCustomersState.map(normalizeCustomer);
    return {
      success: true,
      data: normalized,
      meta: {
        total: normalized.length,
        highRisk: normalized.filter(c => c.riskLevel === 'HIGH').length,
        source: 'mock'
      }
    };
  }

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/customers`);
    if (!response.ok) throw new Error(`FastAPI Error: ${response.statusText}`);
    const data = await response.json();
    const normalized = (Array.isArray(data) ? data : data.data || []).map(normalizeCustomer);
    return { success: true, data: normalized, meta: { source: 'fastapi' } };
  } catch (error) {
    console.warn('[JourneyAI API] Failed to fetch from FastAPI (backend may be offline), safely using mock data:', error);
    const normalized = mockCustomersState.map(normalizeCustomer);
    return { success: true, data: normalized, meta: { fallback: true } };
  }
}

/**
 * 2. Fetch specific customer details, journey steps, and friction evidence
 * FastAPI Endpoint: GET /api/customers/{customerId}
 */
export async function getCustomerDetails(customerId) {
  if (API_CONFIG.USE_MOCK) {
    await simulateDelay(150);
    const customer = mockCustomersState.find(c => (c.id === customerId || c.customer_id === customerId));
    if (!customer) {
      throw new Error(`Customer with ID ${customerId} not found.`);
    }
    return { success: true, data: normalizeCustomer(customer), meta: { source: 'mock' } };
  }

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/customers/${customerId}`);
    if (!response.ok) throw new Error(`FastAPI Error: ${response.statusText}`);
    const data = await response.json();
    return { success: true, data: normalizeCustomer(data), meta: { source: 'fastapi' } };
  } catch (error) {
    console.warn(`[JourneyAI API] Failed to fetch customer ${customerId} from FastAPI, using fallback mock:`, error);
    const fallbackCustomer = mockCustomersState.find(c => (c.id === customerId || c.customer_id === customerId));
    return { success: true, data: normalizeCustomer(fallbackCustomer), meta: { fallback: true } };
  }
}

/**
 * 3. Fetch aggregated dashboard risk analytics and metric counters
 * FastAPI Endpoint: GET /api/analytics/risk
 */
export async function getRiskAnalytics() {
  if (API_CONFIG.USE_MOCK) {
    await simulateDelay(200);
    return {
      success: true,
      data: {
        ...MOCK_RISK_ANALYTICS,
        highRiskCustomers: mockCustomersState.filter(c => c.riskLevel === 'HIGH').length,
        frictionsDetected: mockCustomersState.filter(c => c.frictionType && c.frictionType !== 'None (Healthy Flow)').length,
        recoverableCustomers: mockCustomersState.filter(c => c.status === 'Pending Recovery' || c.status === 'Pending').length
      },
      meta: { source: 'mock' }
    };
  }

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/analytics/risk`);
    if (!response.ok) throw new Error(`FastAPI Error: ${response.statusText}`);
    const data = await response.json();
    return { success: true, data, meta: { source: 'fastapi' } };
  } catch (error) {
    console.warn('[JourneyAI API] Failed to fetch risk analytics from FastAPI, using fallback mock:', error);
    return { success: true, data: MOCK_RISK_ANALYTICS, meta: { fallback: true } };
  }
}

/**
 * 4. Fetch friction categorization breakdown and drop-off analytics
 * FastAPI Endpoint: GET /api/analytics/friction
 */
export async function getFrictionAnalytics() {
  if (API_CONFIG.USE_MOCK) {
    await simulateDelay(150);
    return {
      success: true,
      data: {
        frictionTypes: MOCK_RISK_ANALYTICS.frictionTypes,
        funnelDropoffs: MOCK_RISK_ANALYTICS.funnelDropoffs
      },
      meta: { source: 'mock' }
    };
  }

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/analytics/friction`);
    if (!response.ok) throw new Error(`FastAPI Error: ${response.statusText}`);
    const data = await response.json();
    return { success: true, data, meta: { source: 'fastapi' } };
  } catch (error) {
    console.warn('[JourneyAI API] Failed to fetch friction analytics from FastAPI, using fallback mock:', error);
    return {
      success: true,
      data: {
        frictionTypes: MOCK_RISK_ANALYTICS.frictionTypes,
        funnelDropoffs: MOCK_RISK_ANALYTICS.funnelDropoffs
      },
      meta: { fallback: true }
    };
  }
}

/**
 * 5. Fetch Gemini AI diagnostics, root cause, and personalized recovery message
 * FastAPI Endpoint: GET /api/ai-insight/{customerId}
 *
 * NOTE: The React Frontend calls FastAPI, which securely interfaces with Gemini API.
 * Never invoke Gemini directly in the client browser.
 */
export async function getAIInsight(customerId) {
  if (API_CONFIG.USE_MOCK) {
    await simulateDelay(300);
    const customer = mockCustomersState.find(c => (c.id === customerId || c.customer_id === customerId));
    if (!customer) throw new Error(`Customer ${customerId} not found.`);
    return {
      success: true,
      data: normalizeAIInsight(customer.aiInsight),
      meta: { source: 'mock', model: 'Gemini 1.5 Pro (Simulated)' }
    };
  }

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/ai-insight/${customerId}`);
    if (!response.ok) throw new Error(`FastAPI Error: ${response.statusText}`);
    const data = await response.json();
    return { success: true, data: normalizeAIInsight(data), meta: { source: 'fastapi' } };
  } catch (error) {
    console.warn(`[JourneyAI API] Failed to fetch AI insight for ${customerId} from FastAPI, using fallback mock:`, error);
    const customer = mockCustomersState.find(c => (c.id === customerId || c.customer_id === customerId));
    return { success: true, data: normalizeAIInsight(customer?.aiInsight), meta: { fallback: true } };
  }
}

/**
 * 6. Trigger automated recovery action (WhatsApp, SMS, Email, Discount code)
 * FastAPI Endpoint: POST /api/recovery/{customerId}
 */
export async function triggerRecovery(customerId, recoveryPayload = {}) {
  if (API_CONFIG.USE_MOCK) {
    await simulateDelay(450); // Simulate recovery dispatch delay
    const customerIndex = mockCustomersState.findIndex(c => (c.id === customerId || c.customer_id === customerId));

    if (customerIndex !== -1) {
      const customer = mockCustomersState[customerIndex];
      const strategy = recoveryPayload.strategy || customer.recovery?.recommendedStrategy || '1-Click Alternate Payment Link';
      const channel = recoveryPayload.channel || customer.recovery?.channel || 'WhatsApp';
      const customMessage = recoveryPayload.message || customer.aiInsight?.personalizedMessage || 'Recovery message sent.';

      // Update customer state
      mockCustomersState[customerIndex] = {
        ...customer,
        status: "Triggered",
        recovery: {
          ...customer.recovery,
          status: "Triggered",
          lastTriggered: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          appliedStrategy: strategy,
          appliedChannel: channel,
          sentMessage: customMessage
        }
      };

      // Add to recovery logs
      const newLog = {
        id: `REC-${Date.now().toString().slice(-4)}`,
        customerId: customer.id || customer.customer_id,
        customerName: customer.name,
        strategy: strategy,
        channel: channel,
        triggeredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        status: "Delivered",
        revenueProtected: `$${Number(customer.cartValue || customer.cart_value || 0).toFixed(2)}`
      };
      mockRecoveryLogsState = [newLog, ...mockRecoveryLogsState];

      return {
        success: true,
        message: "Recovery action triggered successfully — Demo Mode",
        data: {
          logId: newLog.id,
          customerId: customer.id,
          channel: channel,
          status: "Delivered",
          customer: mockCustomersState[customerIndex]
        },
        meta: { source: 'mock' }
      };
    }
    throw new Error(`Customer ${customerId} not found.`);
  }

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/recovery/${customerId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId,
        ...recoveryPayload
      })
    });
    if (!response.ok) throw new Error(`FastAPI Error: ${response.statusText}`);
    const data = await response.json();
    return {
      success: true,
      message: data.message || "Recovery action triggered successfully.",
      data,
      meta: { source: 'fastapi' }
    };
  } catch (error) {
    console.warn(`[JourneyAI API] Failed to trigger recovery for ${customerId} via FastAPI, fallback simulation:`, error);
    return {
      success: true,
      message: "Recovery action triggered successfully — Demo Mode (Fallback)",
      data: { customerId, status: "Delivered" },
      meta: { fallback: true }
    };
  }
}

/**
 * 7. Fetch Recovery Action Logs
 * FastAPI Endpoint: GET /api/recovery/logs
 */
export async function getRecoveryLogs() {
  if (API_CONFIG.USE_MOCK) {
    await simulateDelay(150);
    return {
      success: true,
      data: mockRecoveryLogsState,
      meta: { source: 'mock' }
    };
  }

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/recovery/logs`);
    if (!response.ok) throw new Error(`FastAPI Error: ${response.statusText}`);
    const data = await response.json();
    return { success: true, data, meta: { source: 'fastapi' } };
  } catch (error) {
    console.warn('[JourneyAI API] Failed to fetch recovery logs from FastAPI:', error);
    return { success: true, data: mockRecoveryLogsState, meta: { fallback: true } };
  }
}

/**
 * Toggle Mock / Live API mode at runtime (useful for Hackathon demos)
 */
export function setApiMode(useMock = true, baseUrl = null) {
  API_CONFIG.USE_MOCK = useMock;
  if (baseUrl) {
    API_CONFIG.BASE_URL = baseUrl;
  }
  return API_CONFIG;
}
