import React from "react";
import ReactDOM from "react-dom/client";
import { HeroOrbit } from "./HeroOrbit";

const rootEl = document.getElementById("hero-orbit-root");

if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <HeroOrbit />
    </React.StrictMode>
  );
}
