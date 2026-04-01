import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { ThemeProvider } from "./ThemeContext";
import { AuthProvider } from "./AuthContext";
import { ToastProvider } from "./lib/Toast";
import {
  PaymentSuccessPage,
  PaymentFailurePage,
} from "./components/PaymentPages";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

// Check if the current path is a payment page (no query params needed)
const path = window.location.pathname;
const isPaymentPage =
  path === "/subscription/success" || path === "/subscription/cancel";

if (isPaymentPage) {
  // Render payment pages without any providers – they load instantly
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route
            path="/subscription/success"
            element={<PaymentSuccessPage />}
          />
          <Route path="/subscription/cancel" element={<PaymentFailurePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>,
  );
} else {
  // Normal app with all providers
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <ToastProvider>
              <AuthProvider>
                <App />
              </AuthProvider>
            </ToastProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>,
  );
}
