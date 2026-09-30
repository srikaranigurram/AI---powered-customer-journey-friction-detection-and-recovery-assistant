import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  getCustomers,
  getCustomerDetails,
  getRiskAnalytics,
  getFrictionAnalytics,
  triggerRecovery,
  getRecoveryLogs,
  API_CONFIG,
  setApiMode
} from '../services/api';

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customers, setCustomers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [recoveryLogs, setRecoveryLogs] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [triggeringRecovery, setTriggeringRecovery] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [frictionFilter, setFrictionFilter] = useState('ALL');

  // Live Toast Notifications
  const [toasts, setToasts] = useState([]);

  // API Mode toggle state
  const [useMockData, setUseMockData] = useState(API_CONFIG.USE_MOCK);
  const [apiBaseUrl, setApiBaseUrl] = useState(API_CONFIG.BASE_URL);

  const addToast = useCallback((title, message, type = 'success', duration = 4000) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    const newToast = { id, title, message, type };
    setToasts(prev => [newToast, ...prev]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Fetch initial dashboard state
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [custRes, analyticsRes, logsRes] = await Promise.all([
        getCustomers(),
        getRiskAnalytics(),
        getRecoveryLogs()
      ]);

      if (custRes.success) setCustomers(custRes.data);
      if (analyticsRes.success) setAnalytics(analyticsRes.data);
      if (logsRes.success) setRecoveryLogs(logsRes.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      addToast('Error Loading Data', error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Handle customer selection for details
  const openCustomerDetails = useCallback(async (customerId) => {
    setSelectedCustomerId(customerId);
    setIsDetailOpen(true);
    setDetailLoading(true);
    try {
      const res = await getCustomerDetails(customerId);
      if (res.success) {
        setSelectedCustomer(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch customer details:', error);
      addToast('Error', 'Could not fetch customer details', 'error');
    } finally {
      setDetailLoading(false);
    }
  }, [addToast]);

  const closeCustomerDetails = useCallback(() => {
    setIsDetailOpen(false);
    setSelectedCustomerId(null);
    setSelectedCustomer(null);
  }, []);

  // Handle Recovery trigger
  const handleTriggerRecovery = useCallback(async (customerId, payload = {}) => {
    setTriggeringRecovery(true);
    try {
      const res = await triggerRecovery(customerId, payload);
      if (res.success) {
        // Trigger subtle celebration confetti
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.7 },
            colors: ['#6366f1', '#10B981', '#38BDF8', '#F59E0B']
          });
        } catch (e) {
          // ignore if canvas-confetti is not loaded
        }

        addToast(
          'Recovery Triggered',
          res.message || 'Recovery action triggered successfully.',
          'success'
        );

        // Update local customer list and current view
        await refreshData();
        if (selectedCustomerId === customerId) {
          const updatedDetail = await getCustomerDetails(customerId);
          if (updatedDetail.success) setSelectedCustomer(updatedDetail.data);
        }
        return true;
      }
    } catch (error) {
      console.error('Failed to trigger recovery:', error);
      addToast('Action Failed', error.message || 'Could not trigger recovery action', 'error');
      return false;
    } finally {
      setTriggeringRecovery(false);
    }
  }, [selectedCustomerId, refreshData, addToast]);

  // Toggle API Mode
  const handleToggleApiMode = (mock, baseUrl) => {
    setUseMockData(mock);
    if (baseUrl) setApiBaseUrl(baseUrl);
    setApiMode(mock, baseUrl);
    addToast(
      'API Source Switched',
      mock ? 'Switched to Mock JSON Dataset' : `Connecting to FastAPI (${baseUrl || apiBaseUrl})`,
      'info'
    );
    refreshData();
  };

  // Filtered customer list
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch =
      customer.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.frictionType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (customer.evidence?.primaryFactor || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk =
      riskFilter === 'ALL' || customer.riskLevel === riskFilter;

    const matchesFriction =
      frictionFilter === 'ALL' || customer.frictionType === frictionFilter;

    return matchesSearch && matchesRisk && matchesFriction;
  });

  return (
    <DashboardContext.Provider
      value={{
        activeTab,
        setActiveTab,
        customers,
        filteredCustomers,
        analytics,
        recoveryLogs,
        selectedCustomerId,
        selectedCustomer,
        isDetailOpen,
        isRecoveryModalOpen,
        setIsRecoveryModalOpen,
        openCustomerDetails,
        closeCustomerDetails,
        loading,
        detailLoading,
        triggeringRecovery,
        handleTriggerRecovery,
        searchQuery,
        setSearchQuery,
        riskFilter,
        setRiskFilter,
        frictionFilter,
        setFrictionFilter,
        toasts,
        addToast,
        removeToast,
        refreshData,
        useMockData,
        apiBaseUrl,
        handleToggleApiMode
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
