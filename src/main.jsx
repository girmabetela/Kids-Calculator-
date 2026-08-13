import React from "react";
import ReactDOM from "react-dom/client";
import KidsCalculator from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <KidsCalculator />
  </React.StrictMode>
);

// Register Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => {
        console.log("Kids Calculator Service Worker registered!");
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}
