import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import CreateArticle from "@/pages/create-article";
import ManageArticles from "@/pages/manage-articles";
import RSSFeed from "@/pages/rss-feed";
import Navbar from "@/components/navbar";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/create" component={CreateArticle} />
      <Route path="/manage" component={ManageArticles} />
      <Route path="/rss" component={RSSFeed} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-full bg-gray-50 font-inter">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Router />
          </main>
          <footer className="bg-white border-t border-gray-200 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center text-brand-slate">
                <p>&copy; 2024 NewsHub. Bản quyền thuộc về hệ thống quản lý tin tức.</p>
                <div className="mt-2 flex justify-center space-x-4 text-sm">
                  <a href="#" className="hover:text-brand-blue transition-colors duration-200">Chính sách bảo mật</a>
                  <a href="#" className="hover:text-brand-blue transition-colors duration-200">Điều khoản sử dụng</a>
                  <a href="#" className="hover:text-brand-blue transition-colors duration-200">Liên hệ</a>
                  <a href="/api/rss.xml" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue transition-colors duration-200">
                    RSS Feed (.xml)
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
