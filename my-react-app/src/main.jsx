
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Auth0Provider } from '@auth0/auth0-react';
import React from 'react';

createRoot(document.getElementById("root")).render(

  <Auth0Provider
  domain="dev-cdwmdumqm7ri7jgj.us.auth0.com"
  clientId="3fpfVeUHLuaz7LMV1eHt0oetLMNg2030"
  authorizationParams={{
    redirect_uri: window.location.origin,
    audience: "https://epl-match-prediction-api/"
  }}>
    <App />
  </Auth0Provider>
 
);
