import API from "./axios";

export const getDashboard = (vendorId) =>
    API.get(`/reports/dashboard/${vendorId}`);

export const getMonthlyRevenue = (vendorId) =>
    API.get(`/reports/revenue/${vendorId}`);

export const getOrderStatus = (vendorId) =>
    API.get(`/reports/status/${vendorId}`);

export const getTopMedicines = (vendorId) =>
    API.get(`/reports/top-medicines/${vendorId}`);

export const getOrders = (vendorId) =>
    API.get(`/reports/orders/${vendorId}`);

export const getAiInsights = (vendorId) =>
    API.get(`/reports/ai-insights/${vendorId}`);