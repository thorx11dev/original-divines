'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export const LoadingScreen = () => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previousPath, setPreviousPath] = useState(pathname);

  useEffect(() => {
    // Detect path change and show loading IMMEDIATELY
    if (pathname !== previousPath) {
      setIsLoading(true);
      setProgress(0);
      setPreviousPath(pathname);

      // Simulate loading progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);

      // Complete loading after progress reaches 100%
      const loadingTimeout = setTimeout(() => {
        setIsLoading(false);
      }, 1200);

      return () => {
        clearInterval(progressInterval);
        clearTimeout(loadingTimeout);
      };
    }
  }, [pathname, previousPath]);

  if (!isLoading && progress === 100) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background transition-opacity duration-500"
      style={{
        opacity: isLoading ? 1 : 0,
        pointerEvents: isLoading ? 'auto' : 'none',
      }}
    >
      <div className="text-center">
        {/* Logo/Brand */}
        <div className="mb-[32px]">
          <h1 className="text-[32px] md:text-[40px] font-bold text-foreground uppercase tracking-wider">
            Divines
          </h1>
        </div>

        {/* Loading Bar */}
        <div className="w-[280px] md:w-[400px] h-[4px] bg-grey-10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary via-grey-60 to-primary transition-all duration-300 ease-out"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        {/* Loading Text */}
        <div className="mt-[16px] text-[12px] text-grey-40 uppercase tracking-wider font-medium">
          Loading... {progress}%
        </div>
      </div>
    </div>
  );
};