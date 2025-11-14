import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import CTSCustomizer from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CTSCustomizer />
  </React.StrictMode>
);
