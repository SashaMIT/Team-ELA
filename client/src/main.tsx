import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Switch, Route } from "wouter";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import SecurityPage from "./pages/SecurityPage";
import ValueCalcPage from "./pages/ValueCalcPage";
import SupplyPage from "./pages/SupplyPage";

import BuyElaPage from "./pages/BuyElaPage";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/security" component={SecurityPage} />
        <Route path="/value-calc" component={ValueCalcPage} />
        <Route path="/supply" component={SupplyPage} />
        
        <Route path="/buy-ela" component={BuyElaPage} />
        <Route>404 Page Not Found</Route>
      </Switch>
    </Layout>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  </StrictMode>,
);
