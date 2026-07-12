import axios from "axios";

const api = axios.create({
    // baseURL : "http://localhost:5000",
    baseURL : "https://ai-csv-importer-backend-p0rt.onrender.com",
    withCredentials : true,
})

export default api;