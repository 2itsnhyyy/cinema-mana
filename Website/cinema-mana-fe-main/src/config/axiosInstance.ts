// First we need to import axios.js
import axios from 'axios';
import AppVariables from './AppVariables';

const axiosInstance = axios.create({
  baseURL: AppVariables.apiUrl,
});

axiosInstance.interceptors.request.use(function (config) {
  let token = localStorage.getItem("token");
  config.headers["Authorization"] = "Bearer " + token;
  return config;
});
 

export default axiosInstance;
