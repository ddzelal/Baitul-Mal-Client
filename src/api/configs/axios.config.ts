import { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from "axios";
import { getAuth } from "@/lib/auth.utils.ts";

const API_URL =
  import.meta.env.VITE_APP_API_URL ||
  "https://baitulmal-production.up.railway.app";

function authInterceptor(config: InternalAxiosRequestConfig) {
  const auth = getAuth();
  if (auth?.jwt) {
    config.headers.Authorization = `Bearer ${auth.jwt}`;
  }
  return config;
}

export function setupAxios(instance: AxiosInstance) {
  instance.defaults.baseURL = API_URL;
  instance.defaults.headers.Accept = "application/json";
  instance.interceptors.request.use(
    (config) => authInterceptor(config),
    (error: AxiosError) => Promise.reject(error)
  );
}
