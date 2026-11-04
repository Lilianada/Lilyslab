import React from 'react';
import Calculator from '@/components/playground/Calculator';

const CalculatorPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] pt-16 flex items-center justify-center p-4">
      <Calculator />
    </div>
  );
};

export default CalculatorPage;
