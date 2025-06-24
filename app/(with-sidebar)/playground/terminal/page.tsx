import React from 'react';
import Terminal from '@/components/playground/Terminal';

const TerminalPage: React.FC = () => {
  return (
    <div className="h-screen flex flex-col">
      <Terminal />
    </div>
  );
};

export default TerminalPage;
