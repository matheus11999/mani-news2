import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/layout/header";
import InstallPrompt from "@/components/pwa/install-prompt";
import Home from "@/pages/home";
import Article from "@/pages/article";
import Categories from "@/pages/categories";
import Search from "@/pages/search";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/article/:slug" component={Article} />
      <Route path="/categories" component={Categories} />
      <Route path="/categories/:slug" component={Categories} />
      <Route path="/search" component={Search} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="pt-16">
            <Router />
          </main>
          <InstallPrompt />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
