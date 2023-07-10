import axios from "axios";
import { firebaseAuth } from "@/lib/data/firebase";
import { useRouter } from "next/router";

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

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      window.location.href = "/login";
    }
    return error;
  }
);

export default axiosInstance;
