'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const CalculatorView = () => {
  const router = useRouter();
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Team access tracking - track the full expression
  const [fullExpression, setFullExpression] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Check for team portal access code
  const checkTeamPortalAccess = (expression: string) => {
    // Check if expression matches: 9426+777= (NOT 007)
    const normalizedExpression = expression.replace(/\s/g, '');
    if (normalizedExpression === '9426+777=') {
      // Grant access and navigate with smooth transition
      setTimeout(() => {
        router.push('/team-portal');
      }, 300);
      return true;
    }
    return false;
  };

  const handleNumberClick = (num: string) => {
    if (shouldResetDisplay) {
      setDisplay(num);
      setShouldResetDisplay(false);
      setFullExpression(num);
    } else {
      const newDisplay = display === '0' ? num : display + num;
      setDisplay(newDisplay);
      setFullExpression(prev => prev + num);
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
    setFullExpression(prev => prev + op);
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
      
      // Build the complete expression with equals
      const completeExpression = fullExpression + '=';
      
      // Check for team portal access BEFORE showing result
      const accessGranted = checkTeamPortalAccess(completeExpression);
      
      if (!accessGranted) {
        // Normal calculator operation
        setDisplay(String(result));
        setPreviousValue(null);
        setOperation(null);
        setShouldResetDisplay(true);
        setFullExpression('');
      }
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(false);
    setFullExpression('');
  };

  const handleDecimal = () => {
    if (shouldResetDisplay) {
      setDisplay('0.');
      setShouldResetDisplay(false);
      setFullExpression(prev => prev + '0.');
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
      setFullExpression(prev => prev + '.');
    }
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
      setFullExpression(prev => prev.slice(0, -1));
    } else {
      setDisplay('0');
      setFullExpression(prev => prev.slice(0, -1));
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
    const baseClasses = 'h-[60px] text-[20px] font-bold rounded-lg transition-all duration-200 active:scale-95';
    const variantClasses = {
      default: 'bg-white border border-border text-foreground hover:bg-grey-10',
      operation: 'bg-grey-20 text-foreground hover:bg-grey-40 hover:text-white',
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
    <div className="fixed inset-0 bg-background flex items-center justify-center px-[20px] pt-[100px] pb-[20px]">
      <div 
        className="w-full max-w-[400px] transition-all duration-800 ease-expo-out"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.95)'
        }}
      >
        <div className="bg-white rounded-2xl border border-border p-[20px] shadow-lg">
          {/* Display */}
          <div className="mb-[20px] p-[20px] bg-background rounded-xl border border-border">
            <div className="text-right">
              {operation && previousValue !== null && (
                <div className="text-[14px] text-grey-40 mb-[4px] font-medium h-[20px]">
                  {previousValue} {operation}
                </div>
              )}
              <div className="text-[36px] font-bold text-foreground break-all leading-tight min-h-[50px] flex items-center justify-end">
                {display}
              </div>
            </div>
          </div>

          {/* Calculator Grid */}
          <div className="grid grid-cols-4 gap-[10px]">
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
      </div>
    </div>
  );
};