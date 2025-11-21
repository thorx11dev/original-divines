"use client";

import Link from "next/link";

interface HeaderProps {
  productName?: string;
}

const Header = ({ productName = "" }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 z-[100] w-full p-[40px]">
      <div className="flex h-[44px] min-h-[44px] items-center justify-between rounded-lg bg-white px-[10px] md:px-[20px]">
        <Link
          href="/"
          className="group pointer-events-auto relative inline-block cursor-pointer appearance-none items-center overflow-clip focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-4 disabled:pointer-events-none"
        >
          <div className="text-12px pt-[4px] font-bold uppercase text-black">
            DAMSO.COM
          </div>
        </Link>
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