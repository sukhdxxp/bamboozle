import axios from "axios";
import { firebaseAuth } from "../lib/data/firebase";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  async function (config) {
    const token = await firebaseAuth.currentUser?.getIdToken();
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosInstance;
