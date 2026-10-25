import axios from "axios";
import { API_BASE_URL } from "../config";

const API = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0"
    }
});

export default API;