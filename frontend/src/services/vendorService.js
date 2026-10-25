import axios from "axios";
import { API_BASE_URL } from "../config";

const API = `${API_BASE_URL}/api/vendor`;

export const getNearbyPharmacies = () => {
    return axios.get(`${API}/pharmacies/all`);
};