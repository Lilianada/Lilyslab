import React from 'react';
import Terminal from '@/components/playground/Terminal';

const TerminalPage: React.FC = () => {
  return (
    <div className="pt-12 max-h-screen h-[calc(100vh_-_5rem)] flex flex-col">
      <Terminal />
    </div>
  );
};

export default TerminalPage;
