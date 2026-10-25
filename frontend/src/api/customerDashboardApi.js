import API from "./axios";

// Customer Dashboard Summary
export const getDashboardSummary = (customerId) =>
    API.get(`/customer/dashboard/${customerId}`);