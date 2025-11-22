"use client";

import { useState } from "react";
import Image from "next/image";

const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(" ");

const CartSVG = () => (
  <svg
    role="presentation"
    className="w-[24px]"
    viewBox="0 0 30 32"
    fill="none"
    stroke="white"
    strokeWidth="2"
  >
    <path d="M0 2H6.92308L10.3846 22H26.9231L30 7H9.23077"></path>
    <circle cx="12.9231" cy="26.0769" r="2.92308"></circle>
    <circle cx="24" cy="26.0769" r="2.92308"></circle>
  </svg>
);

const ArrowSVG = ({ className }: { className?: string }) => (
  <svg
    role="presentation"
    className={cn("w-full", className)}
    viewBox="0 0 12 17"
    fill="currentColor"
  >
    <path d="M4.94207 1.48694C5.15286 1.25821 5.4859 1.25821 5.69669 1.48694L11.8317 8.1278C11.9562 8.2625 12 8.44199 12 8.62791C12 8.81384 11.9562 8.99332 11.8317 9.12799L5.69669 15.769C5.4859 15.9977 5.15286 15.9977 4.94207 15.769L4.30331 15.0763C4.09252 14.8475 4.09252 14.4811 4.30331 14.2524L9.5841 8.62795L4.30331 3.00351C4.09252 2.77478 4.09252 2.40833 4.30331 2.1796L4.94207 1.48694Z" />
  </svg>
);

const CloseSVG = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    role="presentation"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    {...props}
  >
    <path
      d="M1.33398 22.666L22.6673 1.33268"
      strokeWidth="2"
    ></path>
    <path
      d="M1.33398 1.33398L22.6673 22.6673"
      strokeWidth="2"
    ></path>
  </svg>
);

interface IpodNavigationProps {
  onNavigateLeft?: () => void;
  onNavigateRight?: () => void;
}

export default function IpodNavigation({ onNavigateLeft, onNavigateRight }: IpodNavigationProps) {
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <div className="pointer-events-none fixed bottom-0 left-0 z-[100] flex w-full justify-center">
      <div className="pointer-events-auto relative mb-[24px] aspect-square w-[180px] select-none">
        {/* Menu floating above */}
        <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 z-10 -top-[52px] transition-all duration-500 ease-circ-out",
            isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          )}
        >
          <nav className="mb-[8px]">
            <div className="flex h-[44px] items-center justify-center gap-[20px] overflow-clip rounded-lg bg-grey-60 px-[16px]">
              <a
                aria-label="History"
                className="group rounded-sm px-[10px] py-[7px] font-bold text-[10px] uppercase leading-none text-white transition-colors delay-100 duration-300 hover:text-black"
                href="/"
              >
                History
              </a>
              <a
                aria-label="Calculator"
                className="group rounded-sm px-[10px] py-[7px] font-bold text-[10px] uppercase leading-none text-white transition-colors delay-100 duration-300 hover:text-black"
                href="/world"
              >
                Calculator
              </a>
              <a
                aria-label="Location"
                className="group rounded-sm px-[10px] py-[7px] font-bold text-[10px] uppercase leading-none text-white transition-colors delay-100 duration-300 hover:text-black"
                href="https://damso.com/billetterie"
              >
                Location
              </a>
              <button className="group relative py-[6px] pr-[8px]">
                <div className="relative flex h-[30px] w-[32px] items-end">
                  <CartSVG />
                  <div className="absolute top-0 right-0 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-grey-40 font-medium text-[10px] leading-none text-white">
                    <span>1</span>
                  </div>
                </div>
              </button>
            </div>
          </nav>
        </div>

        {/* Wheel gradient background */}
        <div className="absolute inset-1/2 z-[1] h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 overflow-clip rounded-full bg-gradient-to-b from-ipod-wheel-top to-ipod-wheel-bottom"></div>
        
        {/* Touch area overlay */}
        <div className="absolute inset-1/2 z-[2] h-full w-full -translate-x-1/2 -translate-y-1/2 touch-none overflow-clip rounded-full cursor-grab"></div>

        {/* Finger cursor indicator */}
        <div
          className={cn(
            "absolute inset-1/2 z-[3] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500",
            isMenuOpen ? "opacity-0" : "opacity-100"
          )}
        >
          <div className="absolute top-0 left-0 mt-[58px] -translate-x-1/2 -translate-y-1/2 aspect-square w-[50px] rounded-full">
            <Image
              alt="finger cursor"
              width={55}
              height={55}
              className="opacity-50"
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d84e69c1-cb1b-4be7-bf37-83acadc35453-damso-com/assets/images/images_1.png"
            />
          </div>
        </div>

        {/* Left/Right arrows */}
        <div className="pointer-events-none absolute inset-0 z-[4] flex items-center justify-between">
          <button 
            onClick={onNavigateLeft}
            className="group pointer-events-auto p-[6px] outline-none focus-visible:outline-2 focus-visible:outline-black"
            aria-label="Navigate left"
            disabled={!onNavigateLeft}
          >
            <div className="relative h-[30px] w-[30px] text-grey-20 transition-colors duration-300 group-hover:text-white">
              <ArrowSVG className="rotate-180" />
            </div>
          </button>
          <button 
            onClick={onNavigateRight}
            className="group pointer-events-auto p-[6px] outline-none focus-visible:outline-2 focus-visible:outline-black"
            aria-label="Navigate right"
            disabled={!onNavigateRight}
          >
            <div className="relative h-[30px] w-[30px] text-grey-20 transition-colors duration-300 group-hover:text-white">
              <ArrowSVG />
            </div>
          </button>
        </div>

        {/* Menu button on top */}
        <div className="pointer-events-none absolute inset-0 z-[5] flex items-start justify-center">
          <button
            onClick={() => setMenuOpen(!isMenuOpen)}
            className="group pointer-events-auto relative mt-[6px] overflow-clip px-[8px] py-[10px] font-bold text-[11px] uppercase leading-none outline-none"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <div
              className={cn(
                "px-[12px] text-grey-20 transition-all duration-300 group-hover:text-white",
                isMenuOpen ? "opacity-0" : "opacity-100"
              )}
            >
              <span>menu</span>
            </div>
            <div
              className={cn(
                "absolute inset-x-[8px] inset-y-0 mt-3 flex items-center justify-center transition-opacity duration-300",
                isMenuOpen ? "opacity-100" : "opacity-0"
              )}
            >
              <CloseSVG className="w-[26px] rotate-90 stroke-grey-20 group-hover:stroke-white" />
            </div>
          </button>
        </div>

        {/* Center button */}
        <div className="absolute inset-1/2 z-[6] h-[70px] w-[70px] -translate-x-1/2 -translate-y-1/2 overflow-clip rounded-full border border-black bg-ipod-dark-grey">
          <button
            onClick={() => setMenuOpen(!isMenuOpen)}
            className="group absolute inset-0 z-10 overflow-clip rounded-full outline-none transition-colors duration-500 ease-circ-out hover:bg-accent-grey-20-10 hover:duration-75 focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2"
            aria-label="Toggle menu"
          ></button>
        </div>
      </div>
    </div>
  );
}