'use client'

import React, { useState, useEffect, useCallback } from 'react';

type Operator = '+' | '-' | '×' | '÷' | null;

const Calculator: React.FC = () => {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [operator, setOperator] = useState<Operator>(null);
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);

  const handleNumberInput = useCallback((numStr: string): void => {
    // console.log('handleNumberInput:', numStr, 'Current Display:', displayValue, 'Waiting:', waitingForOperand);
    setDisplayValue((currentDisplay) => {
        if (waitingForOperand) {
            setWaitingForOperand(false);
            return numStr;
        }
        const newDisplayValue = currentDisplay === '0' && numStr !== '.' ? numStr : currentDisplay + numStr;
        if (newDisplayValue.length > 12) return currentDisplay; // Prevent exceeding limit
        return newDisplayValue;
    });
  }, [waitingForOperand]);

  const handleDecimal = useCallback((): void => {
    // console.log('handleDecimal', 'Current Display:', displayValue, 'Waiting:', waitingForOperand);
    setDisplayValue((currentDisplay) => {
        if (waitingForOperand) {
            setWaitingForOperand(false);
            return '0.';
        }
        if (!currentDisplay.includes('.')) {
            return currentDisplay + '.';
        }
        return currentDisplay;
    });
  }, [waitingForOperand]);

  const handleClear = useCallback((): void => {
    // console.log('handleClear');
    setDisplayValue('0');
    setOperator(null);
    setPreviousValue(null);
    setWaitingForOperand(false);
  }, []);

  const handlePercentage = useCallback((): void => {
    // console.log('handlePercentage', 'Current Display:', displayValue);
    try {
        setDisplayValue((currentDisplay) => {
            const currentValue = parseFloat(currentDisplay);
            if (isNaN(currentValue)) return 'Error';
            setWaitingForOperand(false); // Result is shown, not waiting
            return (currentValue / 100).toString();
        });
    } catch (error) {
        setDisplayValue('Error');
        console.error("Percentage Error:", error);
    }
  }, []);

 const performCalculation = (op: Operator, val1: number, val2: number): number | 'Error' => {
    try {
      switch (op) {
        case '+': return val1 + val2;
        case '-': return val1 - val2;
        case '×': return val1 * val2;
        case '÷':
          if (val2 === 0) return 'Error'; // Handle division by zero
          return val1 / val2;
        default: return val2;
      }
    } catch (error) {
        console.error("Calculation Error:", error);
        return 'Error';
    }
  };

  const handleOperatorInput = useCallback((nextOperator: Operator): void => {
    // console.log('handleOperatorInput:', nextOperator, 'Current Display:', displayValue, 'Prev Val:', previousValue, 'Op:', operator, 'Waiting:', waitingForOperand);
    if (nextOperator === null) return;

    const currentValue = parseFloat(displayValue);
    if (isNaN(currentValue)) {
        if (displayValue === 'Error') handleClear();
        return;
    }

    if (waitingForOperand) {
      setOperator(nextOperator); // Allow changing operator if waiting
      return;
    }

    if (previousValue !== null && operator) {
      const prev = parseFloat(previousValue);
      if (isNaN(prev)) {
          handleClear();
          return;
      }

      const result = performCalculation(operator, prev, currentValue);
      if (result === 'Error') {
        setDisplayValue('Error');
        setPreviousValue(null);
        setOperator(null);
        setWaitingForOperand(false);
      } else {
        const resultString = String(result);
        setDisplayValue(resultString);
        setPreviousValue(resultString);
      }
    } else {
      setPreviousValue(displayValue);
    }

    setOperator(nextOperator);
    setWaitingForOperand(true);
  }, [displayValue, operator, previousValue, waitingForOperand, handleClear]);

 const handleEquals = useCallback((): void => {
    // console.log('handleEquals', 'Current Display:', displayValue, 'Prev Val:', previousValue, 'Op:', operator, 'Waiting:', waitingForOperand);
    if (operator === null || previousValue === null || waitingForOperand) {
        return;
    }

    const currentValue = parseFloat(displayValue);
    const prev = parseFloat(previousValue);

    if (isNaN(currentValue) || isNaN(prev)) {
        setDisplayValue('Error');
        setPreviousValue(null);
        setOperator(null);
        setWaitingForOperand(false);
        return;
    }

    const result = performCalculation(operator, prev, currentValue);

    if (result === 'Error') {
      setDisplayValue('Error');
    } else {
      setDisplayValue(String(result));
    }

    setOperator(null);
    setPreviousValue(null);
    setWaitingForOperand(false);
 }, [displayValue, operator, previousValue, waitingForOperand]);

 // --- Keyboard Input Handler ---
 useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
        event.preventDefault(); // Prevent default browser actions for handled keys
        const { key } = event;

        if (/^[0-9]$/.test(key)) {
            handleNumberInput(key);
        } else if (key === '.') {
            handleDecimal();
        } else if (key === '+' || key === '-') {
            handleOperatorInput(key as Operator);
        } else if (key === '*') {
            handleOperatorInput('×');
        } else if (key === '/') {
            handleOperatorInput('÷');
        } else if (key === '%') {
            handlePercentage();
        } else if (key === 'Enter' || key === '=') {
            handleEquals();
        } else if (key === 'Backspace' || key === 'Delete') {
            handleClear(); // Or implement a backspace logic if preferred
        } else if (key === 'Escape') {
             handleClear();
        }
        // Add more key bindings if needed
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup listener on component unmount
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
 }, [handleNumberInput, handleDecimal, handleOperatorInput, handlePercentage, handleEquals, handleClear]); // Add all handlers used in the effect


  const getButtonLabel = (label: string): string => {
      // Map internal representation to visual label if needed
      if (label === '×') return '×';
      if (label === '÷') return '÷';
      // Map '01' to '1', '07' to '7' etc. for display, but keep internal value if needed for logic
      if (/^0[1-9]$/.test(label)) return label.substring(1);
      if (label === '00') return '00';
      if (label === '.') return '.';
      return label; // AC, %, =, +
  };

  // Component to render each button
  const CalculatorButton = ({
    label,
    onClick,
    className = '',
    colSpan = 1,
  }: {
    label: string;
    onClick: () => void;
    className?: string;
    colSpan?: number;
  }): React.ReactElement => (
    <button
      onClick={onClick}
      className={`
        rounded-full flex items-center justify-center
        text-lg font-sans focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400
        shadow-[inset_0_-3px_0px_rgba(0,0,0,0.15)] active:shadow-[inset_0_-1px_0px_rgba(0,0,0,0.15)] active:translate-y-px
        transition-all duration-75
        ${colSpan === 2 ? 'col-span-2' : ''}
        ${className}
      `}
      aria-label={`Calculator button ${label}`}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
    >
      {getButtonLabel(label)}
    </button>
  );

  // Button styles
  const lightGrayButton = 'bg-gray-200 text-gray-700 h-14 w-14 hover:bg-gray-300 font-medium';
  const darkGrayButton = 'bg-gray-300 text-gray-800 h-14 w-14 hover:bg-gray-400 font-medium'; // Slightly darker for AC/%
  const orangeButton = 'bg-orange-400 text-white h-14 w-14 hover:bg-orange-500 shadow-[inset_0_-3px_0px_rgba(0,0,0,0.2)] active:shadow-[inset_0_-1px_0px_rgba(0,0,0,0.2)] font-semibold';
  const wideButton = 'bg-gray-200 text-gray-700 h-14 hover:bg-gray-300 justify-start pl-6 rounded-[34px] font-medium'; // Oval shape


  return (
    <div className="relative w-[270px] bg-gradient-to-b from-gray-50 to-gray-100 p-4 rounded-[34px] shadow-lg border border-gray-300/50">
       {/* Optional 3D edge effect (subtle) */}
      <div className="absolute inset-0 rounded-[34px] border border-white opacity-30 pointer-events-none"></div>
       <div className="absolute -bottom-1 left-2 right-2 h-2.5 bg-orange-200/30 rounded-b-[34px] opacity-40 blur filter brightness-110"></div>


      {/* Display */}
      <div className="relative bg-[#E0E0E0] rounded-xl h-20 mb-5 flex items-center justify-end p-4 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.06)] border border-gray-300/60">
        {/* Operator Indicator */}
        {operator && (
            <span className="absolute top-2 right-3 text-gray-500 text-sm font-mono">
                {operator}
            </span>
        )}

        {/* Main Display Value */}
        <p className="text-5xl font-light text-right text-gray-800 truncate w-full pr-1" style={{ fontFamily: "'DSEG7Classic', 'Segment7', monospace", letterSpacing: '0.05em'}}> {/* Use a segmented font if available */}
          {displayValue}
        </p>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-4 gap-3">
        <CalculatorButton label='AC' onClick={handleClear} className={darkGrayButton} />
        {/* The button labels in the image seem decorative (01, 07 etc.) - I'll use the actual numbers for functionality */}
        <CalculatorButton label='%' onClick={handlePercentage} className={darkGrayButton} />
        {/* Need a button for +/- (sign change) - replacing '01' placeholder? Or maybe skip for simplicity? Let's skip for now based on image */}
         <CalculatorButton label='?' onClick={() => {}} className={darkGrayButton + ' opacity-0 pointer-events-none'} /> {/* Placeholder to fill grid */} 
        <CalculatorButton label='÷' onClick={() => handleOperatorInput('÷')} className={orangeButton} />

        <CalculatorButton label='7' onClick={() => handleNumberInput('7')} className={lightGrayButton} />
        <CalculatorButton label='8' onClick={() => handleNumberInput('8')} className={lightGrayButton} />
        <CalculatorButton label='9' onClick={() => handleNumberInput('9')} className={lightGrayButton} />
        <CalculatorButton label='×' onClick={() => handleOperatorInput('×')} className={orangeButton} />

        <CalculatorButton label='4' onClick={() => handleNumberInput('4')} className={lightGrayButton} />
        <CalculatorButton label='5' onClick={() => handleNumberInput('5')} className={lightGrayButton} />
        <CalculatorButton label='6' onClick={() => handleNumberInput('6')} className={lightGrayButton} />
        <CalculatorButton label='-' onClick={() => handleOperatorInput('-')} className={orangeButton} />

        <CalculatorButton label='1' onClick={() => handleNumberInput('1')} className={lightGrayButton} />
        <CalculatorButton label='2' onClick={() => handleNumberInput('2')} className={lightGrayButton} />
        <CalculatorButton label='3' onClick={() => handleNumberInput('3')} className={lightGrayButton} />
        <CalculatorButton label='+' onClick={() => handleOperatorInput('+')} className={orangeButton} />

        {/* Bottom Row */}
        <CalculatorButton label='00' onClick={() => handleNumberInput('00')} className={wideButton} colSpan={2}/>
        <CalculatorButton label='.' onClick={handleDecimal} className={lightGrayButton} />
        <CalculatorButton label='=' onClick={handleEquals} className={orangeButton} />
      </div>
    </div>
  );
};

export default Calculator; 