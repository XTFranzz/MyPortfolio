import React from "react";
import ReactDOM from "react-dom/client";
import { TechGlobeApp } from "./TechGlobeApp";

const rootEl = document.getElementById("tech-globe-root");

if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <TechGlobeApp />
    </React.StrictMode>
  );
}
