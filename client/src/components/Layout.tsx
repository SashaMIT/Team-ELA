import React from 'react';
import { useLocation } from 'wouter';
import { Shield, Home, Calculator } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [location, setLocation] = useLocation();

  const menuItems = [
    { icon: <Home className="w-4 h-4" />, label: 'Home', path: '/' },
    { icon: <Shield className="w-4 h-4" />, label: 'Security', path: '/security' },
    { icon: <Calculator className="w-4 h-4" />, label: 'Value Calc', path: '/value-calc' },
  ];

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="flex flex-col items-center justify-center gap-4">
            <span className="text-lg font-semibold">
              Team ELA
            </span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <button
                    onClick={() => setLocation(item.path)}
                    data-active={location === item.path}
                    className="flex w-full items-center gap-1.5 rounded-md px-1.5 py-2 text-xs hover:bg-accent"
                  >
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </button>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
