'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/sections/header';
import IpodNavigation from '@/components/sections/ipod-navigation';
import ProductCarousel from '@/components/sections/product-carousel';
import BackgroundLayer from '@/components/sections/background-layer';

export default function Home() {
  const [activeProductIndex, setActiveProductIndex] = useState(10);
  const [currentProductName, setCurrentProductName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragCurrentX = useRef(0);
  const dragAccumulator = useRef(0);
  const dragAreaRef = useRef<HTMLDivElement>(null);

  const totalProducts = 29;

  const navigateLeft = () => {
    setActiveProductIndex((prev) => (prev > 0 ? prev - 1 : totalProducts - 1));
  };

  const navigateRight = () => {
    setActiveProductIndex((prev) => (prev < totalProducts - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (!dragAreaRef.current?.contains(e.target as Node)) return;
      setIsDragging(true);
      dragStartX.current = e.clientX;
      dragCurrentX.current = e.clientX;
      document.body.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      dragCurrentX.current = e.clientX;
      const delta = dragCurrentX.current - dragStartX.current;
      dragAccumulator.current += delta;

      const threshold = 80;
      if (Math.abs(dragAccumulator.current) >= threshold) {
        if (dragAccumulator.current > 0) {
          navigateLeft();
        } else {
          navigateRight();
        }
        dragAccumulator.current = 0;
      }

      dragStartX.current = dragCurrentX.current;
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      setIsDragging(false);
      dragAccumulator.current = 0;
      document.body.style.cursor = '';
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!dragAreaRef.current?.contains(e.target as Node)) return;
      const touch = e.touches[0];
      setIsDragging(true);
      dragStartX.current = touch.clientX;
      dragCurrentX.current = touch.clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      dragCurrentX.current = touch.clientX;
      const delta = dragCurrentX.current - dragStartX.current;
      dragAccumulator.current += delta;

      const threshold = 80;
      if (Math.abs(dragAccumulator.current) >= threshold) {
        if (dragAccumulator.current > 0) {
          navigateLeft();
        } else {
          navigateRight();
        }
        dragAccumulator.current = 0;
      }

      dragStartX.current = dragCurrentX.current;
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;
      setIsDragging(false);
      dragAccumulator.current = 0;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateLeft();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateRight();
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDragging]);

  return (
    <>
      <BackgroundLayer />
      <main className="fixed inset-0 overflow-hidden">
        <div
          ref={dragAreaRef}
          className="absolute top-0 left-0 right-0 h-[40%] z-10 cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'none' }}
        />
        <ProductCarousel 
          activeIndex={activeProductIndex} 
          onProductChange={setCurrentProductName}
        />
      </main>
      <Header productName={currentProductName} />
      <IpodNavigation onNavigateLeft={navigateLeft} onNavigateRight={navigateRight} />
    </>
  );
}