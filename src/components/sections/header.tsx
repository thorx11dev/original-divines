"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface HeaderProps {
  productName?: string;
  isVisible?: boolean;
}

const Header = ({ productName = "", isVisible = true }: HeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const isProductPage = pathname?.startsWith('/products/');
  const needsBackButton = pathname && ['/history', '/location', '/cart', '/checkout', '/calculator'].some(path => pathname.startsWith(path));

  const handleBack = () => {
    router.push('/');
  };

  return (
    <header 
      className="fixed top-0 left-0 z-[100] w-full p-[40px] transition-opacity duration-800 ease-expo-out"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div className="flex h-[44px] min-h-[44px] items-center justify-between rounded-lg bg-white px-[10px] md:px-[20px]">
        {(isProductPage || needsBackButton) ? (
          <button
            onClick={handleBack}
            className="group pointer-events-auto relative inline-flex items-center gap-[8px] cursor-pointer appearance-none overflow-clip focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-4 disabled:pointer-events-none"
          >
            <ArrowLeft className="w-[16px] h-[16px] text-black" />
            <div className="text-12px pt-[4px] font-bold uppercase text-black">
              Back
            </div>
          </button>
        ) : (
          <Link
            href="/"
            className="group pointer-events-auto relative inline-block cursor-pointer appearance-none items-center overflow-clip focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-4 disabled:pointer-events-none"
          >
            <div className="text-12px pt-[4px] font-bold uppercase text-black">
              DAMSO.COM
            </div>
          </Link>
        )}
        <div className="flex items-center gap-[16px]">
          {productName && (
            <div className="text-12px pt-[4px] font-bold uppercase text-grey-40">{productName}</div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;