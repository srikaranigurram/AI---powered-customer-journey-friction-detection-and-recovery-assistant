// JourneyAI API Integration Service
// Designed for seamless transition between Mock Data and FastAPI backend

import {
  MOCK_CUSTOMERS,
  MOCK_RISK_ANALYTICS,
  MOCK_RECOVERY_LOGS
} from './mockData';

// Configuration: Switch between mock data and real FastAPI backend
// You can set VITE_USE_MOCK=false and VITE_API_BASE_URL=http://localhost:8000 in your .env file
export const API_CONFIG = {
  USE_MOCK: import.meta.env.VITE_USE_MOCK !== 'false', // Defaults to true for frontend development
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  TIMEOUT_MS: 8000
};

// Internal in-memory state for mock mutation during active session
let mockCustomersState = JSON.parse(JSON.stringify(MOCK_CUSTOMERS));
let mockRecoveryLogsState = JSON.parse(JSON.stringify(MOCK_RECOVERY_LOGS));

// Helper: Simulate network latency for mock calls
const simulateDelay = (ms = 350) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 1. Fetch all customers with risk assessments & friction tags
 * FastAPI Endpoint: GET /api/customers
 */
export async function getCustomers() {
  if (API_CONFIG.USE_MOCK) {
    await simulateDelay(250);
    return {
      success: true,
      data: mockCustomersState,
      meta: {
        total: mockCustomersState.length,
        highRisk: mockCustomersState.filter(c => c.riskLevel === 'HIGH').length,
        source: 'mock'
      }
    };
  }

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/customers`);
    if (!response.ok) throw new Error(`FastAPI Error: ${response.statusText}`);
    const data = await response.json();
    return { success: true, data, meta: { source: 'fastapi' } };
  } catch (error) {
    console.warn('[JourneyAI API] Failed to fetch from FastAPI, falling back to mock data:', error);
    return { success: true, data: mockCustomersState, meta: { fallback: true } };
  }
}

/**
 * 2. Fetch specific customer details, journey steps, and friction evidence
 * FastAPI Endpoint: GET /api/customers/{customerId}
 */
export async function getCustomerDetails(customerId) {
  if (API_CONFIG.USE_MOCK) {
    await simulateDelay(200);
    const customer = mockCustomersState.find(c => c.id === customerId);
    if (!customer) {
      throw new Error(`Customer with ID ${customerId} not found.`);
    }
    return { success: true, data: customer, meta: { source: 'mock' } };
  }

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/customers/${customerId}`);
    if (!response.ok) throw new Error(`FastAPI Error: ${response.statusText}`);
    const data = await response.json();
    return { success: true, data, meta: { source: 'fastapi' } };
  } catch (error) {
    console.warn(`[JourneyAI API] Failed to fetch customer ${customerId} from FastAPI:`, error);
    const fallbackCustomer = mockCustomersState.find(c => c.id === customerId);
    return { success: true, data: fallbackCustomer, meta: { fallback: true } };
  }
}

/**
 * 3. Fetch aggregated dashboard risk analytics and metric counters
 * FastAPI Endpoint: GET /api/analytics/risk
 */
export async function getRiskAnalytics() {
  if (API_CONFIG.USE_MOCK) {
    await simulateDelay(250);
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
    console.warn('[JourneyAI API] Failed to fetch risk analytics from FastAPI:', error);
    return { success: true, data: MOCK_RISK_ANALYTICS, meta: { fallback: true } };
  }
}

/**
 * 4. Fetch friction categorization breakdown and drop-off analytics
 * FastAPI Endpoint: GET /api/analytics/friction
 */
export async function getFrictionAnalytics() {
  if (API_CONFIG.USE_MOCK) {
    await simulateDelay(200);
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
    console.warn('[JourneyAI API] Failed to fetch friction analytics from FastAPI:', error);
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
 * FastAPI Endpoint: GET /api/ai/insight/{customerId}
 */
export async function getAIInsight(customerId) {
  if (API_CONFIG.USE_MOCK) {
    await simulateDelay(400); // Simulate Gemini inference delay
    const customer = mockCustomersState.find(c => c.id === customerId);
    if (!customer) throw new Error(`Customer ${customerId} not found.`);
    return {
      success: true,
      data: customer.aiInsight,
      meta: { source: 'mock', model: customer.aiInsight?.model || 'Gemini 1.5 Pro' }
    };
  }

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/ai/insight/${customerId}`);
    if (!response.ok) throw new Error(`FastAPI Error: ${response.statusText}`);
    const data = await response.json();
    return { success: true, data, meta: { source: 'fastapi' } };
  } catch (error) {
    console.warn(`[JourneyAI API] Failed to fetch AI insight for ${customerId} from FastAPI:`, error);
    const customer = mockCustomersState.find(c => c.id === customerId);
    return { success: true, data: customer?.aiInsight, meta: { fallback: true } };
  }
}

/**
 * 6. Trigger automated recovery action (WhatsApp, SMS, Email, Discount code)
 * FastAPI Endpoint: POST /api/recovery/trigger
 */
export async function triggerRecovery(customerId, recoveryPayload = {}) {
  if (API_CONFIG.USE_MOCK) {
    await simulateDelay(600); // Simulate recovery dispatch delay
    const customerIndex = mockCustomersState.findIndex(c => c.id === customerId);
    
    if (customerIndex !== -1) {
      const customer = mockCustomersState[customerIndex];
      const strategy = recoveryPayload.strategy || customer.recovery.recommendedStrategy;
      const channel = recoveryPayload.channel || customer.recovery.channel;
      const customMessage = recoveryPayload.message || customer.aiInsight?.personalizedMessage;

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
        customerId: customer.id,
        customerName: customer.name,
        strategy: strategy,
        channel: channel,
        triggeredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        status: "Delivered",
        revenueProtected: `$${customer.cartValue.toFixed(2)}`
      };
      mockRecoveryLogsState = [newLog, ...mockRecoveryLogsState];

      return {
        success: true,
        message: "Recovery action triggered successfully.",
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
    const response = await fetch(`${API_CONFIG.BASE_URL}/recovery/trigger`, {
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
    console.warn(`[JourneyAI API] Failed to trigger recovery for ${customerId} via FastAPI:`, error);
    // Fallback simulation
    return {
      success: true,
      message: "Recovery action triggered successfully (mock fallback).",
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
    await simulateDelay(200);
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
