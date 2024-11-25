import React from 'react';
import { useLocation } from 'wouter';
import { Shield, Home, Calculator, TrendingUp, Database, ShoppingCart, Menu } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [location, setLocation] = useLocation();

  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Home', path: '/' },
    { icon: <Shield className="w-5 h-5" />, label: 'Security', path: '/security' },
    { icon: <Calculator className="w-5 h-5" />, label: 'Value Calc', path: '/value-calc' },
    { icon: <TrendingUp className="w-5 h-5" />, label: 'Supply', path: '/supply' },
    { icon: <ShoppingCart className="w-5 h-5" />, label: 'Buy ELA', path: '/buy-ela' },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {/* Mobile Menu Trigger with Improved Touch Interaction */}
        <div className="fixed top-4 left-4 z-50 md:hidden">
          <SidebarTrigger className="bg-background/95 hover:bg-accent/50 active:bg-accent/70 w-12 h-12 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm flex items-center justify-center touch-manipulation active:scale-95 active:shadow-md" />
        </div>
        
        <Sidebar collapsible="offcanvas">
          <SidebarHeader className="flex flex-col items-center justify-center gap-4 p-4">
            <span className="text-lg font-semibold">
              Team ELA
            </span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <div
                    role="button"
                    onClick={() => {
                      setLocation(item.path);
                      if (window.innerWidth < 768) { // Close sidebar on mobile after navigation
                        const triggerButton = document.querySelector('[data-sidebar="trigger"]') as HTMLButtonElement;
                        triggerButton?.click();
                      }
                    }}
                    data-active={location === item.path}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-4 md:py-3 text-base md:text-sm transition-all
                      touch-manipulation active:scale-[0.98] select-none
                      ${location === item.path 
                        ? 'bg-accent text-accent-foreground font-medium shadow-sm' 
                        : 'hover:bg-accent/50 active:bg-accent/70'}`}
                  >
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        
        <main className="flex-1 overflow-auto pt-14 md:pt-0">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
