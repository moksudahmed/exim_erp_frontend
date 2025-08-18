import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";

// Handle ResizeObserver errors gracefully
if (typeof window !== "undefined") {
  const resizeObserverErrors = [
    "ResizeObserver loop completed with undelivered notifications.",
    "ResizeObserver loop limit exceeded",
  ];

  const errorHandler = (e) => {
    if (resizeObserverErrors.includes(e.message)) {
      e.stopImmediatePropagation();
    }
  };

  const rejectionHandler = (e) => {
    if (resizeObserverErrors.includes(e.reason?.message)) {
      e.preventDefault();
    }
  };

  window.addEventListener("error", errorHandler);
  window.addEventListener("unhandledrejection", rejectionHandler);
}

// React 18 root API
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <App />
  </Router>
);
