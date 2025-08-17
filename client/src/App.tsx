import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/layout/header";
import BottomNavigation from "@/components/layout/bottom-navigation";
import InstallPrompt from "@/components/pwa/install-prompt";
import Home from "@/pages/home";
import Article from "@/pages/article";
import Categories from "@/pages/categories";
import EmAlta from "@/pages/em-alta";
import Search from "@/pages/search";
import NotFound from "@/pages/not-found";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminArticles from "@/pages/admin/articles";
import AdminCategories from "@/pages/admin/categories";
import ArticleForm from "@/pages/admin/article-form";
import AdminSettings from "@/pages/admin/settings";

function Router() {
  return (
    <Switch>
      {/* Admin routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/articles" component={AdminArticles} />
      <Route path="/admin/articles/new" component={ArticleForm} />
      <Route path="/admin/articles/edit/:id" component={ArticleForm} />
      <Route path="/admin/categories" component={AdminCategories} />
      <Route path="/admin/settings" component={AdminSettings} />
      
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/article/:slug" component={Article} />
      <Route path="/categories" component={Categories} />
      <Route path="/categories/:slug" component={Categories} />
      <Route path="/em-alta" component={EmAlta} />
      <Route path="/search" component={Search} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {isAdminRoute ? (
          <Router />
        ) : (
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="pt-14 pb-20 md:pb-8 md:pl-20 lg:pl-24">
              <Router />
            </main>
            <BottomNavigation />
            <InstallPrompt />
          </div>
        )}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
