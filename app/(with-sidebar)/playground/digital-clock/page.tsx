import React from 'react';
import DigitalClock from '@/components/playground/DigitalClock';

export const metadata = {
  title: "Digital Clock | Playground | Lilyslab",
  description: "A responsive digital clock with timer functionality and customizable settings.",
};

const DigitalClockPage: React.FC = () => {
  return (
    <div className=" animate-fade-in">
      <div className="max-w-3xl mx-auto sm:px-4 pt-16 pb-8">
        <header className="mb-8">
          <span className="text-2xl animate-spin">✳︎</span>
          <h1 className="mb-2 text-xl font-medium">Digital Clock</h1>
          <p className="text-sm text-muted-foreground">
            A responsive digital clock with timer functionality. Use it as a clock or switch to timer mode
            with customizable presets including Pomodoro timer.
          </p>
        </header>
        
        <div className="overflow-y-auto">
          <DigitalClock />
        </div>
      </div>
    </div>
  );
};

export default DigitalClockPage;
