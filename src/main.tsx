import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./config/i18n";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { setupAxios } from "@/api/configs/axios.config.ts";
import axios, { AxiosError } from "axios";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes/application.route.tsx";
import { Toaster } from "./components/ui/toaster";
import { toast } from "./hooks/use-toast";
import { ApiErrorResponse } from "./api/types/global.types";

setupAxios(axios);
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: unknown) => {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      toast({
        description:
          axiosError.response?.data?.Message || "An unknown error occurred",
        variant: "destructive",
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: unknown) => {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      toast({
        description:
          axiosError.response?.data?.Message || "An unknown error occurred",
        variant: "destructive",
      });
    },
  }),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey={"app_theme"}>
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
