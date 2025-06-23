'use client';

import { useState } from 'react';

export default function InteractiveFlower() {
  const [isColored, setIsColored] = useState(false);

  const handleClick = () => {
    setIsColored(!isColored);
  };

  return (
    <div 
      className="cursor-pointer transition-all duration-1000 ease-in-out transform hover:scale-105"
      onClick={handleClick}
    >
      <svg 
        viewBox="0 0 800 600" 
        className="w-64 h-auto md:w-80 lg:w-96 max-w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Leaves */}
        <path 
          d="M150 450 Q200 400 250 450 Q200 500 150 450" 
          className={`transition-all duration-1000 ease-in-out ${
            isColored ? 'fill-green-500' : 'fill-gray-400'
          }`}
        />
        <path 
          d="M550 450 Q600 400 650 450 Q600 500 550 450" 
          className={`transition-all duration-1000 ease-in-out delay-100 ${
            isColored ? 'fill-green-500' : 'fill-gray-400'
          }`}
        />
        <path 
          d="M200 380 Q250 330 300 380 Q250 430 200 380" 
          className={`transition-all duration-1000 ease-in-out delay-200 ${
            isColored ? 'fill-green-500' : 'fill-gray-400'
          }`}
        />
        <path 
          d="M500 380 Q550 330 600 380 Q550 430 500 380" 
          className={`transition-all duration-1000 ease-in-out delay-300 ${
            isColored ? 'fill-green-500' : 'fill-gray-400'
          }`}
        />
        <path 
          d="M250 320 Q300 270 350 320 Q300 370 250 320" 
          className={`transition-all duration-1000 ease-in-out delay-400 ${
            isColored ? 'fill-green-500' : 'fill-gray-400'
          }`}
        />
        <path 
          d="M450 320 Q500 270 550 320 Q500 370 450 320" 
          className={`transition-all duration-1000 ease-in-out delay-500 ${
            isColored ? 'fill-green-500' : 'fill-gray-400'
          }`}
        />
        
        {/* Main Flower Petals - Back petals */}
        <ellipse 
          cx="320" 
          cy="180" 
          rx="80" 
          ry="140" 
          transform="rotate(-30 320 180)" 
          className={`transition-all duration-1000 ease-in-out delay-600 ${
            isColored ? 'fill-pink-400' : 'fill-gray-300'
          }`}
        />
        <ellipse 
          cx="480" 
          cy="180" 
          rx="80" 
          ry="140" 
          transform="rotate(30 480 180)" 
          className={`transition-all duration-1000 ease-in-out delay-700 ${
            isColored ? 'fill-pink-400' : 'fill-gray-300'
          }`}
        />
        
        {/* Side petals */}
        <ellipse 
          cx="220" 
          cy="280" 
          rx="70" 
          ry="130" 
          transform="rotate(-60 220 280)" 
          className={`transition-all duration-1000 ease-in-out delay-800 ${
            isColored ? 'fill-pink-300' : 'fill-gray-300'
          }`}
        />
        <ellipse 
          cx="580" 
          cy="280" 
          rx="70" 
          ry="130" 
          transform="rotate(60 580 280)" 
          className={`transition-all duration-1000 ease-in-out delay-900 ${
            isColored ? 'fill-pink-300' : 'fill-gray-300'
          }`}
        />
        
        {/* Front petals */}
        <ellipse 
          cx="300" 
          cy="350" 
          rx="75" 
          ry="135" 
          transform="rotate(-20 300 350)" 
          className={`transition-all duration-1000 ease-in-out delay-1000 ${
            isColored ? 'fill-pink-200' : 'fill-gray-200'
          }`}
        />
        <ellipse 
          cx="500" 
          cy="350" 
          rx="75" 
          ry="135" 
          transform="rotate(20 500 350)" 
          className={`transition-all duration-1000 ease-in-out delay-1100 ${
            isColored ? 'fill-pink-200' : 'fill-gray-200'
          }`}
        />
        
        {/* Center petal */}
        <ellipse 
          cx="400" 
          cy="300" 
          rx="70" 
          ry="120" 
          className={`transition-all duration-1000 ease-in-out delay-1200 ${
            isColored ? 'fill-pink-100' : 'fill-gray-100'
          }`}
        />
        
        {/* Smaller lily */}
        <ellipse 
          cx="480" 
          cy="120" 
          rx="40" 
          ry="70" 
          transform="rotate(15 480 120)" 
          className={`transition-all duration-1000 ease-in-out delay-1300 ${
            isColored ? 'fill-pink-400' : 'fill-gray-300'
          }`}
        />
        <ellipse 
          cx="520" 
          cy="140" 
          rx="35" 
          ry="65" 
          transform="rotate(45 520 140)" 
          className={`transition-all duration-1000 ease-in-out delay-1400 ${
            isColored ? 'fill-pink-300' : 'fill-gray-300'
          }`}
        />
        <ellipse 
          cx="540" 
          cy="180" 
          rx="30" 
          ry="60" 
          transform="rotate(75 540 180)" 
          className={`transition-all duration-1000 ease-in-out delay-1500 ${
            isColored ? 'fill-pink-200' : 'fill-gray-200'
          }`}
        />
        
        {/* Flower centers */}
        <circle 
          cx="400" 
          cy="300" 
          r="15" 
          className={`transition-all duration-1000 ease-in-out delay-1600 ${
            isColored ? 'fill-yellow-400' : 'fill-gray-400'
          }`}
        />
        <circle 
          cx="400" 
          cy="300" 
          r="8" 
          className={`transition-all duration-1000 ease-in-out delay-1700 ${
            isColored ? 'fill-yellow-500' : 'fill-gray-500'
          }`}
        />
        <circle 
          cx="515" 
          cy="145" 
          r="8" 
          className={`transition-all duration-1000 ease-in-out delay-1800 ${
            isColored ? 'fill-yellow-400' : 'fill-gray-400'
          }`}
        />
        <circle 
          cx="515" 
          cy="145" 
          r="4" 
          className={`transition-all duration-1000 ease-in-out delay-1900 ${
            isColored ? 'fill-yellow-500' : 'fill-gray-500'
          }`}
        />
        
        {/* Petal details (stamens) */}
        <line 
          x1="400" 
          y1="285" 
          x2="385" 
          y2="270" 
          strokeWidth="2" 
          className={`transition-all duration-1000 ease-in-out delay-2000 ${
            isColored ? 'stroke-yellow-400' : 'stroke-gray-400'
          }`}
        />
        <line 
          x1="400" 
          y1="285" 
          x2="415" 
          y2="270" 
          strokeWidth="2" 
          className={`transition-all duration-1000 ease-in-out delay-2100 ${
            isColored ? 'stroke-yellow-400' : 'stroke-gray-400'
          }`}
        />
        <line 
          x1="400" 
          y1="285" 
          x2="400" 
          y2="265" 
          strokeWidth="2" 
          className={`transition-all duration-1000 ease-in-out delay-2200 ${
            isColored ? 'stroke-yellow-400' : 'stroke-gray-400'
          }`}
        />
        <circle 
          cx="385" 
          cy="270" 
          r="3" 
          className={`transition-all duration-1000 ease-in-out delay-2300 ${
            isColored ? 'fill-yellow-400' : 'fill-gray-400'
          }`}
        />
        <circle 
          cx="415" 
          cy="270" 
          r="3" 
          className={`transition-all duration-1000 ease-in-out delay-2400 ${
            isColored ? 'fill-yellow-400' : 'fill-gray-400'
          }`}
        />
        <circle 
          cx="400" 
          cy="265" 
          r="3" 
          className={`transition-all duration-1000 ease-in-out delay-2500 ${
            isColored ? 'fill-yellow-400' : 'fill-gray-400'
          }`}
        />
      </svg>
      
      <p className="text-sm text-gray-500 mt-2 text-center">
        {isColored ? 'Click to see grayscale' : 'Click to bloom with color'}
      </p>
    </div>
  );
}
