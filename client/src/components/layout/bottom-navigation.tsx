import { Link, useLocation } from "wouter";
import { Home, TrendingUp, Grid3X3, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNavigation() {
  const [location] = useLocation();

  const navItems = [
    { name: "Início", href: "/", icon: Home },
    { name: "Trending", href: "/trending", icon: TrendingUp },
    { name: "Categorias", href: "/categories", icon: Grid3X3 },
    { name: "Buscar", href: "/search", icon: Search },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <>
      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
        <div className="flex items-center justify-around py-2 px-4 safe-area-pb">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center py-2 px-3 rounded-lg transition-colors min-w-0",
                  active 
                    ? "text-primary bg-red-50" 
                    : "text-gray-600 hover:text-primary"
                )}
                data-testid={`bottom-nav-${item.name.toLowerCase()}`}
              >
                <Icon className={cn("h-5 w-5", active && "text-primary")} />
                <span className={cn(
                  "text-xs font-medium mt-1 truncate",
                  active ? "text-primary" : "text-gray-600"
                )}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Side Navigation for Desktop */}
      <nav className="hidden md:block fixed left-4 top-1/2 transform -translate-y-1/2 z-50">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-center p-3 rounded-xl transition-all duration-200 group relative",
                    active 
                      ? "bg-primary text-white shadow-md" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                  )}
                  data-testid={`desktop-nav-${item.name.toLowerCase()}`}
                >
                  <Icon className="h-5 w-5" />
                  
                  {/* Tooltip */}
                  <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    {item.name}
                    <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}