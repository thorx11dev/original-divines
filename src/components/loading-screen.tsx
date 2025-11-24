'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export const LoadingScreen = () => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Show loading screen immediately
    setIsLoading(true);
    setProgress(0);

    let progressInterval: NodeJS.Timeout;
    let completeTimeout: NodeJS.Timeout;

    // Smooth progress animation
    progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90; // Stop at 90% until page is ready
        }
        // Faster initial progress, slower as it approaches completion
        const increment = prev < 50 ? 15 : prev < 80 ? 8 : 3;
        return Math.min(prev + increment, 90);
      });
    }, 80);

    // Wait for page to be interactive
    const checkPageReady = () => {
      if (document.readyState === 'complete') {
        // Complete the progress
        setProgress(100);
        
        // Hide loading screen after brief delay
        completeTimeout = setTimeout(() => {
          setIsLoading(false);
          
          // Remove from DOM after fade out
          setTimeout(() => {
            setShouldRender(false);
          }, 500);
        }, 200);
      } else {
        // Check again
        setTimeout(checkPageReady, 50);
      }
    };

    // Start checking when progress reaches 90%
    const readyCheckTimeout = setTimeout(() => {
      checkPageReady();
    }, 800);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(completeTimeout);
      clearTimeout(readyCheckTimeout);
    };
  }, [pathname]);

  if (!shouldRender) return null;

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
          {progress < 100 ? `Loading... ${Math.round(progress)}%` : 'Ready!'}
        </div>
      </div>
    </div>
  );
};