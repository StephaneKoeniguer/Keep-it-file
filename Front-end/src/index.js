/* eslint-disable */
import React from "react";
import * as ReactDOMClient from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppFront from "./front/AppFront";
import AppBack from "./back/AppBack";
import { MaterialUIControllerProvider } from "./shared/context";
import { AuthProvider } from "./shared/context/AuthProvider";

const container = document.getElementById("root");

// Create a root.
const root = ReactDOMClient.createRoot(container);

root.render(
  <BrowserRouter>
    <AuthProvider>
      <MaterialUIControllerProvider>
        <AppBack />
        <AppFront />
      </MaterialUIControllerProvider>
    </AuthProvider>
  </BrowserRouter>
);
