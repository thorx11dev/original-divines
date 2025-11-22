'use client';

import { useState } from 'react';

export const CalculatorView = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

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
    const baseClasses = 'h-[60px] md:h-[70px] text-[18px] md:text-[20px] font-bold uppercase rounded-lg transition-all duration-300';
    const variantClasses = {
      default: 'bg-white border border-border text-foreground hover:bg-grey-10',
      operation: 'bg-secondary text-secondary-foreground hover:bg-grey-20',
      equals: 'bg-primary text-primary-foreground hover:opacity-90',
      clear: 'bg-destructive text-destructive-foreground hover:opacity-90',
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
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-[400px] px-[20px] py-[120px]">
        <div className="mb-[24px]">
          <h1 className="text-[28px] md:text-[32px] font-bold text-foreground leading-tight uppercase text-center">
            Calculator
          </h1>
        </div>

        <div className="bg-white rounded-lg border border-border p-[20px] md:p-[24px]">
          {/* Display */}
          <div className="mb-[20px] p-[20px] bg-background rounded-lg border border-border">
            <div className="text-right">
              {operation && previousValue !== null && (
                <div className="text-[14px] text-grey-40 mb-[4px]">
                  {previousValue} {operation}
                </div>
              )}
              <div className="text-[32px] md:text-[36px] font-bold text-foreground break-all">
                {display}
              </div>
            </div>
          </div>

          {/* Calculator Grid */}
          <div className="grid grid-cols-4 gap-[12px]">
            {/* Row 1 */}
            <Button onClick={handleClear} variant="clear" className="col-span-2">
              C
            </Button>
            <Button onClick={handleBackspace} variant="operation">
              ←
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
              -
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
      </div>
    </div>
  );
};