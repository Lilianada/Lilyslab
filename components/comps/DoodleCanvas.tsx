'use client';

import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button'; // Assuming you're using shadcn UI
import { toast } from 'sonner'; // For notifications
import { SaveIcon, RefreshCw, Download } from 'lucide-react';
import Link from 'next/link';

export default function DoodleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#FF6B6B');
  const [brushSize, setBrushSize] = useState(3);
  const [isSaving, setIsSaving] = useState(false);
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  
  const colors = ['#FF6B6B', '#4ECDC4', '#F9DC5C', '#45B7D1', '#E84855', '#9B5DE5', '#000000'];
  const brushSizes = [1, 3, 5, 8];
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set initial canvas styling
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = color;
    
    // Set canvas background to white
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = color;
  }, [color, brushSize]);
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get correct position for both mouse and touch
    let clientX, clientY;
    if ('touches' in e) {
      e.preventDefault(); // Prevent scrolling while drawing on touch devices
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get correct position for both mouse and touch
    let clientX, clientY;
    if ('touches' in e) {
      e.preventDefault(); // Prevent scrolling while drawing on touch devices
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
  };
  
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
  
  const handleSave = async () => {
    setShowNameInput(true);
  };
  
  const saveDoodle = async () => {
    if (!userName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      // Convert canvas to data URL
      const dataURL = canvas.toDataURL('image/png');
      
      // Send to API
      const response = await fetch('/api/doodles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: dataURL,
          name: userName,
          date: new Date().toISOString(),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save doodle');
      }
      
      toast.success('Your doodle has been saved to the Doodle Board!');
      clearCanvas();
      setShowNameInput(false);
      setUserName('');
    } catch (error) {
      console.error('Error saving doodle:', error);
      toast.error('Failed to save your doodle. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const downloadDoodle = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'my-doodle.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="w-full mb-3 flex flex-wrap gap-2 justify-center">
        <div className="flex space-x-1">
          {colors.map((c) => (
            <button
              key={c}
              className="w-6 h-6 border border-muted-foreground rounded-full transition-transform hover:scale-110"
              style={{ 
                backgroundColor: c, 
                outline: color === c ? '2px solid black' : 'none',
                boxShadow: color === c ? '0 0 0 2px white' : 'none'
              }}
              onClick={() => setColor(c)}
              aria-label={`Select color ${c}`}
            />
          ))}
        </div>
        
        <div className="flex space-x-1 ml-4">
          {brushSizes.map((size) => (
            <button
              key={size}
              className={`w-6 h-6 flex items-center justify-center rounded-full transition-transform hover:scale-110 ${brushSize === size ? 'bg-gray-200' : 'bg-white'} border border-gray-300`}
              onClick={() => setBrushSize(size)}
              aria-label={`Set brush size to ${size}`}
            >
              <div
                className="rounded-full bg-black"
                style={{ width: size, height: size }}
              ></div>
            </button>
          ))}
        </div>
      </div>

      <div className="relative border border-gray-200 rounded-md overflow-hidden">
        <canvas
          ref={canvasRef}
          width={300}
          height={180}
          className="bg-white cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        
        {showNameInput && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white p-4 rounded-md w-full max-w-xs">
              <h3 className="font-medium text-sm mb-2">Sign your artwork</h3>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your name"
                className="w-full border border-gray-300 rounded-md p-2 mb-3 text-sm"
                maxLength={20}
              />
              <div className="flex space-x-2">
                <button 
                  className="bg-codeRed text-white text-xs px-3 py-2 rounded-md hover:bg-red-700 flex-1"
                  onClick={saveDoodle}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save to Doodle Board'}
                </button>
                <button 
                  className="border border-gray-300 text-xs px-3 py-2 rounded-md hover:bg-gray-100"
                  onClick={() => setShowNameInput(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-center space-x-2 mt-3">
        <button 
          className="bg-gray-100 text-xs text-muted-foreground px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 flex items-center"
          onClick={clearCanvas}
        >
          <RefreshCw size={12} className="mr-1" /> Clear
        </button>
        <button 
          className="bg-gray-100 text-muted-foreground text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 flex items-center"
          onClick={downloadDoodle}
        >
          <Download size={12} className="mr-1" /> Save
        </button>
        <button 
          className="bg-codeRed text-white text-xs px-3 py-1 rounded hover:bg-red-700 flex items-center"
          onClick={handleSave}
        >
          <SaveIcon size={12} className="mr-1" /> Share
        </button>
      </div>
      
      <div className="mt-2 flex justify-between w-full">
        <p className="text-[10px] text-muted-foreground">Draw something fun!</p>
        <Link href="/doodle-board" className="text-[10px] text-codeRed hover:underline">
          View Doodle Board →
        </Link>
      </div>
    </div>
  );
}