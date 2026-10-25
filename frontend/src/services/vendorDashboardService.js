import axios from "axios";
import { API_BASE_URL } from "../config";

const API = `${API_BASE_URL}/api/vendor-dashboard`;

export const getDashboard = (vendorId) => {
    return axios.get(`${API}/${vendorId}`);
};