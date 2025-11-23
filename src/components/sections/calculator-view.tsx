'use client';

import { useState, useEffect } from 'react';

export const CalculatorView = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleNumberClick = (num: string) => {
    if (shouldResetDisplay) {
      setDisplay(num);
      setShouldResetDisplay(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperationClick = (op: string) => {
    const currentValue = parseFloat(display);
    
    if (previousValue !== null && operation && !shouldResetDisplay) {
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    } else {
      setPreviousValue(currentValue);
    }
    
    setOperation(op);
    setShouldResetDisplay(true);
  };

  const calculate = (prev: number, current: number, op: string): number => {
    switch (op) {
      case '+':
        return prev + current;
      case '-':
        return prev - current;
      case '×':
        return prev * current;
      case '÷':
        return prev / current;
      default:
        return current;
    }
  };

  const handleEquals = () => {
    if (previousValue !== null && operation) {
      const currentValue = parseFloat(display);
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setShouldResetDisplay(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(false);
  };

  const handleDecimal = () => {
    if (shouldResetDisplay) {
      setDisplay('0.');
      setShouldResetDisplay(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const Button = ({ 
    children, 
    onClick, 
    className = '', 
    variant = 'default' 
  }: { 
    children: React.ReactNode; 
    onClick: () => void; 
    className?: string; 
    variant?: 'default' | 'operation' | 'equals' | 'clear';
  }) => {
    const baseClasses = 'h-[70px] md:h-[80px] text-[20px] md:text-[24px] font-bold uppercase rounded-lg transition-all duration-300 hover:scale-105 active:scale-95';
    const variantClasses = {
      default: 'bg-white border-2 border-border text-foreground hover:border-grey-40 shadow-sm',
      operation: 'bg-gradient-to-b from-secondary to-grey-10 text-foreground hover:from-grey-10 hover:to-secondary shadow-md',
      equals: 'bg-gradient-to-b from-primary to-black text-primary-foreground hover:from-black hover:to-primary shadow-lg',
      clear: 'bg-gradient-to-b from-destructive to-red-600 text-destructive-foreground hover:from-red-600 hover:to-destructive shadow-lg',
    };

    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-grey-10 to-background flex items-center justify-center px-[20px]">
      <div 
        className="w-full max-w-[480px] py-[120px] transition-all duration-800 ease-expo-out"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.95)'
        }}
      >
        {/* Title */}
        <div className="mb-[32px] text-center">
          <h1 className="text-[36px] md:text-[44px] font-bold text-foreground leading-tight uppercase mb-[8px] bg-gradient-to-r from-primary via-grey-60 to-primary bg-clip-text text-transparent">
            Calculator
          </h1>
          <p className="text-[12px] text-grey-40 uppercase tracking-wider">Professional Computing Tool</p>
        </div>

        <div className="bg-white rounded-2xl border-2 border-border p-[24px] md:p-[32px] shadow-2xl">
          {/* Display */}
          <div className="mb-[24px] p-[24px] bg-gradient-to-br from-background to-grey-10 rounded-xl border-2 border-border shadow-inner">
            <div className="text-right">
              {operation && previousValue !== null && (
                <div className="text-[14px] md:text-[16px] text-grey-40 mb-[8px] font-medium">
                  {previousValue} {operation}
                </div>
              )}
              <div className="text-[40px] md:text-[48px] font-bold text-foreground break-all leading-tight min-h-[60px] flex items-center justify-end">
                {display}
              </div>
            </div>
          </div>

          {/* Calculator Grid */}
          <div className="grid grid-cols-4 gap-[12px] md:gap-[16px]">
            {/* Row 1 */}
            <Button onClick={handleClear} variant="clear" className="col-span-2">
              AC
            </Button>
            <Button onClick={handleBackspace} variant="operation">
              ⌫
            </Button>
            <Button onClick={() => handleOperationClick('÷')} variant="operation">
              ÷
            </Button>

            {/* Row 2 */}
            <Button onClick={() => handleNumberClick('7')}>7</Button>
            <Button onClick={() => handleNumberClick('8')}>8</Button>
            <Button onClick={() => handleNumberClick('9')}>9</Button>
            <Button onClick={() => handleOperationClick('×')} variant="operation">
              ×
            </Button>

            {/* Row 3 */}
            <Button onClick={() => handleNumberClick('4')}>4</Button>
            <Button onClick={() => handleNumberClick('5')}>5</Button>
            <Button onClick={() => handleNumberClick('6')}>6</Button>
            <Button onClick={() => handleOperationClick('-')} variant="operation">
              −
            </Button>

            {/* Row 4 */}
            <Button onClick={() => handleNumberClick('1')}>1</Button>
            <Button onClick={() => handleNumberClick('2')}>2</Button>
            <Button onClick={() => handleNumberClick('3')}>3</Button>
            <Button onClick={() => handleOperationClick('+')} variant="operation">
              +
            </Button>

            {/* Row 5 */}
            <Button onClick={() => handleNumberClick('0')} className="col-span-2">
              0
            </Button>
            <Button onClick={handleDecimal}>.</Button>
            <Button onClick={handleEquals} variant="equals">
              =
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-[24px] text-center">
          <p className="text-[10px] text-grey-40 uppercase tracking-wider">
            Powered by DAMSO.COM
          </p>
        </div>
      </div>
    </div>
  );
};