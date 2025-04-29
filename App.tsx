import { Switch, Route, Router as WouterRouter } from "wouter";
import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import Dashboard from "@/pages/Dashboard";
import Governance from "@/pages/Governance";
import Resources from "@/pages/Resources";
import Feedback from "@/pages/Feedback";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 md:ml-64 transition-all duration-300 flex flex-col">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/governance" component={Governance} />
          <Route path="/resources" component={Resources} />
          <Route path="/feedback" component={Feedback} />
          <Route component={NotFound} />
        </Switch>
        <Footer />
      </div>
    </div>
  );
}

// Get the base path for GitHub Pages deployments
const getBasePath = () => {
  // Use "/ai-regulations-matrix" as the base path in production (GitHub Pages)
  const isProd = import.meta.env.PROD;
  return isProd ? '/ai-regulations-matrix' : '';
};

// Custom hook for GitHub Pages base path
const useBasePath = () => {
  const [basePath, setBasePath] = useState('');
  
  useEffect(() => {
    setBasePath(getBasePath());
  }, []);
  
  return basePath;
};

function App() {
  const basePath = useBasePath();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <WouterRouter base={basePath}>
          <Router />
        </WouterRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
