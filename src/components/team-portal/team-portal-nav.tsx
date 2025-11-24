'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Key, LogOut } from 'lucide-react';

export const TeamPortalNav = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/team-portal/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/team-portal/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/team-portal/products', label: 'Products', icon: Package },
    { href: '/team-portal/team-keys', label: 'Team Keys', icon: Key },
  ];

  return (
    <header className="fixed top-0 left-0 z-[100] w-full bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-[1600px] mx-auto px-[20px] md:px-[40px]">
        <div className="flex items-center justify-between h-[80px]">
          {/* Logo/Title */}
          <Link 
            href="/team-portal/dashboard"
            className="text-[18px] md:text-[20px] font-bold uppercase text-foreground hover:text-grey-40 transition-colors"
          >
            Team Portal
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-[8px] md:gap-[12px]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname?.startsWith(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-[6px] md:gap-[8px] px-[12px] md:px-[16px] py-[10px] rounded-lg text-[10px] md:text-[11px] font-bold uppercase transition-all duration-300 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-grey-10 text-foreground hover:bg-grey-20'
                  }`}
                >
                  <Icon className="w-[14px] h-[14px] md:w-[16px] md:h-[16px]" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
            
            {/* Exit Portal */}
            <Link
              href="/"
              className="flex items-center gap-[6px] md:gap-[8px] ml-[4px] md:ml-[8px] px-[12px] md:px-[16px] py-[10px] rounded-lg text-[10px] md:text-[11px] font-bold uppercase bg-destructive text-destructive-foreground hover:opacity-90 transition-all duration-300 shadow-md"
            >
              <LogOut className="w-[14px] h-[14px] md:w-[16px] md:h-[16px]" />
              <span className="hidden sm:inline">Exit</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};