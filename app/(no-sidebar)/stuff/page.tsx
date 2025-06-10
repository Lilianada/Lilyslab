"use client";

import { useState, useEffect } from "react";
import { User } from "lucide-react";

export default function StuffPage() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState("20:14");
  
  useEffect(() => {
    setMounted(true);
    
    // Update time every minute
    const interval = setInterval(() => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-auto border-b border-border">
        {/* Site Visitors Counter */}
        <div className="p-8 border-r border-border flex flex-col justify-between h-full">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-accent">
              <User size={18} />
              <span>You are visitor number</span>
            </div>
            
            <div className="flex">
              {/* Visitor Counter */}
              {[1, 3, 0, 8, 4].map((digit, i) => (
                <div key={i} className="w-12 h-16 mr-1 border border-accent/30 rounded flex items-center justify-center bg-accent/5 text-2xl font-mono">
                  {digit}
                </div>
              ))}
            </div>
            
            <p className="text-sm text-muted-foreground">Thank you for visiting my website!</p>
          </div>
        </div>
        
        {/* Personal Records */}
        <div className="p-8 border-r border-border">
          <h2 className="text-xl mb-4">Personal Records</h2>
          
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            <div className="text-sm">
              <span className="text-accent">▸</span> Deadlift: <span className="text-muted-foreground">140kg</span>
            </div>
            <div className="text-sm">
              <span className="text-accent">▸</span> Squat: <span className="text-muted-foreground">140kg</span>
            </div>
            <div className="text-sm">
              <span className="text-accent">▸</span> Hip Thrust: <span className="text-muted-foreground">220kg</span>
            </div>
            <div className="text-sm">
              <span className="text-accent">▸</span> Bench: <span className="text-muted-foreground">60kg</span>
            </div>
            <div className="text-sm">
              <span className="text-accent">▸</span> Leg Press: <span className="text-muted-foreground">200kg</span>
            </div>
            <div className="text-sm">
              <span className="text-accent">▸</span> Sumo Squat: <span className="text-muted-foreground">120kg</span>
            </div>
          </div>
        </div>
        
        {/* Personal Challenges */}
        <div className="p-8">
          <h2 className="text-xl mb-4">Challenges</h2>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="mt-1 mr-2 text-green-500">✓</div>
              <div>
                <p className="text-sm">75 Soft Challenge</p>
                <p className="text-xs text-muted-foreground">Completed on 2025-05-15</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mt-1 mr-2 text-green-500">✓</div>
              <div>
                <p className="text-sm">22 Days LinkedIn Posts</p>
                <p className="text-xs text-muted-foreground">Completed on 2025-04-22</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-auto border-b border-border">
        {/* Personal Info */}
        <div className="p-8 border-r border-border">
          <h2 className="text-xl mb-4">Odd Info</h2>
          
          <div className="space-y-4">
            <p className="text-sm">
              Long ago when I was a high school student, I freelanced.
            </p>
            
            <div className="text-sm">
              <span className="text-accent">▸</span> Flash ads programmer
            </div>
            <div className="text-sm">
              <span className="text-accent">▸</span> Powerpoint "engineer"
            </div>
          </div>
        </div>
        
        {/* Current Status */}
        <div className="p-8 border-r border-border flex flex-col items-center justify-center text-center">
          <div className="space-y-4">
            <p className="text-sm">right now, i'm eating.</p>
            <div className="text-center">
              <p className="text-sm">my local time is {currentTime}</p>
              <p className="text-[10px] text-muted-foreground mt-1">time goes here</p>
            </div>
          </div>
        </div>
        
        {/* Location */}
        <div className="p-8 flex flex-col justify-center items-center text-center">
          <p className="text-sm mb-2">
            I'm currently based in Sydney 🇦🇺
          </p>
          <p className="text-sm">
            I'm from the Philippines! 🇵🇭
          </p>
        </div>
      </div>
      
      {/* Third Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-auto border-b border-border">
        {/* Favorite Things */}
        <div className="p-8 border-r border-border">
          <h2 className="text-xl mb-4">Favorite Things</h2>
          
          <div className="space-y-3">
            <div className="text-sm">
              My favorite dessert is halo-halo 🍧
            </div>
          </div>
        </div>
        
        {/* Website Buttons */}
        <div className="p-8 border-r border-border">
          <h2 className="text-xl mb-4">Website Buttons</h2>
          <p className="text-sm mb-3">Feel free to use any of these to link to my site:</p>
          
          <div className="flex flex-wrap gap-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="space-y-2">
                <div className="w-[88px] h-[31px] bg-accent/10 border border-accent/30 rounded flex items-center justify-center text-xs">
                  Button {num}
                </div>
                
                <button 
                  onClick={() => navigator.clipboard.writeText(`<a href="https://lilyslab.dev"><img src="https://lilyslab.dev/buttons/button${num}.png" alt="Lily's Lab" width="88" height="31"></a>`)}
                  className="text-[10px] w-full py-1 bg-accent/10 hover:bg-accent/20 rounded text-accent transition-colors"
                >
                  Copy HTML
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Webrings */}
        <div className="p-8">
          <h2 className="text-xl mb-4">Webrings</h2>
          
          <p className="text-sm mb-3">I'm a member of 6 webrings:</p>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="text-sm">• Meta Ring</div>
            <div className="text-sm">• IndieWeb</div>
            <div className="text-sm">• CSS JOY</div>
            <div className="text-sm">• Bucketfish</div>
            <div className="text-sm">• GeekRing</div>
            <div className="text-sm">• Webmaster</div>
          </div>
        </div>
      </div>
      
      {/* Fourth Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-auto border-b border-border">
        {/* Education */}
        <div className="p-8 border-r border-border">
          <h2 className="text-xl mb-4">Education</h2>
          
          <div className="text-sm">
            <p className="mb-2">🎓 I studied computer science at the University of the Philippines!</p>
          </div>
        </div>
        
        {/* More to come */}
        <div className="p-8 border-r border-border flex items-center justify-center text-center">
          <p className="text-sm text-muted-foreground">More stuff coming soon...</p>
        </div>
        
        {/* More to come */}
        <div className="p-8 flex items-center justify-center text-center">
          <p className="text-sm text-muted-foreground">More stuff coming soon...</p>
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Last updated: 2025-06-10 10:14:50 UTC
        </p>
      </div>
    </div>
  );
}