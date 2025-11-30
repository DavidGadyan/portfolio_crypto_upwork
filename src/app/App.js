// src/app/App.js

import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import withRouter from "../hooks/withRouter";
import AppRoutes from "./routes";
import Headermain from "../header";
import "./App.css"; // keep if you need other styles
import { sendPageview } from "../analytics"; // <-- GA helper

// Sends a GA pageview on every route change
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    const pagePath = location.pathname + location.search;
    sendPageview(pagePath);
  }, [location]);

  return null;
}

// Scrolls to top on every route change
function _ScrollToTop(props) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return props.children;
}

const ScrollToTop = withRouter(_ScrollToTop);

export default function App() {
  return (
    // For GitHub Pages, this will be "/portfolio_app"
    <Router basename={process.env.PUBLIC_URL}>
      <ScrollToTop>
        {/* Track GA4 pageviews */}
        <AnalyticsTracker />

        {/* Your layout */}
        <Headermain />
        <AppRoutes />
      </ScrollToTop>
    </Router>
  );
}
