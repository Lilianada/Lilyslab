"use client";
import React, { useEffect, useState } from 'react';

const colors = [
  '#FF3F3F', // Bright Red
  '#3185FC', // Royal Blue
  '#FFCC00', // Yellow
  '#FF9000', // Orange
  '#2AFEA2', // Mint Green
  '#F04DFF', // Hot Pink
];

export default function Loading() {
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [activeColor, setActiveColor] = useState(colors[0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingPercent(prev => {
        const next = prev + Math.random() * 15;
        return next >= 100 ? 100 : next;
      });
      
      setActiveColor(colors[Math.floor(Math.random() * colors.length)]);
    }, 250);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="daily-logs-brutalist min-h-screen flex flex-col items-center justify-center p-4 nitti-font">
      <div className="border-8 border-black p-8 bg-white rotate-1 w-full max-w-md relative">
        <div 
          className="absolute -top-2 -left-2 w-8 h-8 bg-black" 
          style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
        ></div>
        <div 
          className="absolute -bottom-2 -right-2 w-8 h-8 bg-black" 
          style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
        ></div>

        <h2 className="text-4xl font-bold uppercase mb-4 text-center">LOADING LOGS</h2>
        
        <div className="w-full border-4 border-black p-1 mb-4">
          <div 
            className="h-8 transition-all duration-300" 
            style={{ 
              width: `${loadingPercent}%`, 
              backgroundColor: activeColor
            }}
          ></div>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center">
          {colors.map((color, i) => (
            <div 
              key={i} 
              className="w-8 h-8 border-2 border-black" 
              style={{ 
                backgroundColor: color,
                animation: `pulse 1.5s infinite ${i * 0.2}s`
              }}
            ></div>
          ))}
        </div>
        
        <p className="text-center uppercase mt-4 text-sm">
          {loadingPercent < 100 ? (
            <>Fetching your logs ({Math.floor(loadingPercent)}%)</>
          ) : (
            <>Ready</>
          )}
        </p>
      </div>
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
