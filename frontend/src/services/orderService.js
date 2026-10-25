import axios from "axios";
import { API_BASE_URL } from "../config";

const API = `${API_BASE_URL}/api/orders`;

export const reserveMedicine = async (data) => {

    return await axios.post(

        `${API}/reserve`,

        data

    );

};

export const getCustomerOrders = async (customerId) => {

    return await axios.get(

        `${API}/customer/${customerId}`

    );

};

export const getVendorOrders = async (vendorId) => {

    return await axios.get(
        `${API}/vendor/${vendorId}`
    );

};