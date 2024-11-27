import React from 'react';
import { useLocation } from 'wouter';
import { Shield, Home, Calculator, TrendingUp, ShoppingCart } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

// Define menu items outside component to avoid recreation
const menuItems = [
  { icon: <Home className="w-5 h-5" />, label: 'Home', path: '/' },
  { icon: <Shield className="w-5 h-5" />, label: 'Security', path: '/security' },
  { icon: <Calculator className="w-5 h-5" />, label: 'Value Calc', path: '/value-calc' },
  { icon: <TrendingUp className="w-5 h-5" />, label: 'Supply', path: '/supply' },
  { icon: <ShoppingCart className="w-5 h-5" />, label: 'Buy ELA', path: '/buy-ela' },
];

const NavigationMenu: React.FC = () => {
  const [location, setLocation] = useLocation();
  const { setOpenMobile } = useSidebar();
  
  return (
    <>
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
                  setOpenMobile(false);
                }}
                data-active={location === item.path}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-4 md:py-3 text-base md:text-sm transition-all
                  ${location === item.path 
                    ? 'bg-accent text-accent-foreground font-medium' 
                    : 'hover:bg-accent/50 active:bg-accent/70'}`}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </div>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {/* Mobile Menu Trigger */}
        <div className="fixed top-3 left-3 z-50 md:hidden">
          <SidebarTrigger className="bg-background/95 hover:bg-accent/50 active:bg-accent/70 w-10 h-10 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm flex items-center justify-center touch-manipulation" />
        </div>
        
        <Sidebar collapsible="offcanvas">
          <NavigationMenu />
        </Sidebar>
        
        <main className="flex-1 overflow-auto pt-14 md:pt-0">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
