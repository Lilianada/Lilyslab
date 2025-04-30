import React from 'react';
import Calculator from '@/components/playground/Calculator';

const CalculatorPage: React.FC = () => {
  return (
    <div className="overflow-y-auto mx-auto p-4 grid place-items-center w-full">
      <Calculator />
    </div>
  );
};

export default CalculatorPage;
