"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Clock, Bell, BellOff, RotateCcw, Timer, Play, Pause, Palette, Settings, ChevronUp, ChevronDown } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';

// Timer presets
const TIMER_PRESETS = [
  { name: "Pomodoro", minutes: 25, seconds: 0 },
  { name: "Short Break", minutes: 5, seconds: 0 },
  { name: "Long Break", minutes: 15, seconds: 0 },
  { name: "Quick Focus", minutes: 10, seconds: 0 },
  { name: "Custom", minutes: 0, seconds: 0 },
];

const DigitalClock: React.FC = () => {
  // State for current time display
  const [time, setTime] = useState<Date>(new Date());
  
  // Timer states
  const [isTimerMode, setIsTimerMode] = useState<boolean>(false);
  const [timerPreset, setTimerPreset] = useState<string>("Pomodoro");
  const [timerMinutes, setTimerMinutes] = useState<number>(25);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [remainingTime, setRemainingTime] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  
  // Settings
  const [alarmEnabled, setAlarmEnabled] = useState<boolean>(true);
  const [showControls, setShowControls] = useState<boolean>(true);
  
  // Available color themes with matching button colors
  const colorThemes = [
    { text: "text-foreground", accent: "bg-foreground", border: "border-foreground" },
    { text: "text-primary", accent: "bg-primary", border: "border-primary" },
    { text: "text-steelBlue", accent: "bg-steelBlue", border: "border-steelBlue" },
    { text: "text-peach", accent: "bg-peach", border: "border-peach" },
    { text: "text-lavender", accent: "bg-lavender", border: "border-lavender" },
    { text: "text-yellow", accent: "bg-yellow", border: "border-yellow" },
    { text: "text-pink", accent: "bg-pink", border: "border-pink" },
    { text: "text-cream", accent: "bg-cream", border: "border-cream" },
    { text: "text-lilac", accent: "bg-lilac", border: "border-lilac" },
    { text: "text-paleYellow", accent: "bg-paleYellow", border: "border-paleYellow" },
  ];
  
  // Current theme
  const [currentTheme, setCurrentTheme] = useState<number>(0);
  
  // Audio reference for alarm sound
  const alarmRef = useRef<HTMLAudioElement | null>(null);

  // Initialize alarm sound
  useEffect(() => {
    alarmRef.current = new Audio("/audio/alarm.mp3");
  }, []);

  // Clock update effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Timer countdown effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isRunning && remainingTime > 0) {
      intervalId = setInterval(() => {
        setRemainingTime(prev => prev - 1);
      }, 1000);
    } else if (isRunning && remainingTime === 0) {
      setIsRunning(false);
      if (alarmEnabled && alarmRef.current) {
        alarmRef.current.play();
      }
    }
    
    return () => clearInterval(intervalId);
  }, [isRunning, remainingTime, alarmEnabled]);

  // Format time for display
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  // Format timer for display
  const formatTimer = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle timer preset change
  const handlePresetChange = (value: string) => {
    setTimerPreset(value);
    
    if (value !== "Custom") {
      const preset = TIMER_PRESETS.find(p => p.name === value);
      if (preset) {
        setTimerMinutes(preset.minutes);
        setTimerSeconds(preset.seconds);
        setRemainingTime(preset.minutes * 60 + preset.seconds);
      }
    }
  };

  // Handle custom timer input
  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setTimerMinutes(value);
    setRemainingTime(value * 60 + timerSeconds);
    
    // If changing custom values, switch to custom preset
    if (timerPreset !== "Custom") {
      setTimerPreset("Custom");
    }
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setTimerSeconds(value);
    setRemainingTime(timerMinutes * 60 + value);
    
    // If changing custom values, switch to custom preset
    if (timerPreset !== "Custom") {
      setTimerPreset("Custom");
    }
  };

  // Start/pause timer
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  // Reset timer
  const resetTimer = () => {
    setIsRunning(false);
    if (timerPreset !== "Custom") {
      const preset = TIMER_PRESETS.find(p => p.name === timerPreset);
      if (preset) {
        setRemainingTime(preset.minutes * 60 + preset.seconds);
      }
    } else {
      setRemainingTime(timerMinutes * 60 + timerSeconds);
    }
  };

  // Toggle between clock and timer modes
  const toggleMode = () => {
    setIsTimerMode(!isTimerMode);
  };

  // Cycle through color themes
  const cycleColorTheme = () => {
    const nextIndex = (currentTheme + 1) % colorThemes.length;
    setCurrentTheme(nextIndex);
  };
  
  // Get current theme colors
  const getThemeText = () => colorThemes[currentTheme].text;
  const getThemeAccent = () => colorThemes[currentTheme].accent;
  const getThemeBorder = () => colorThemes[currentTheme].border;
  
  // Toggle controls visibility
  const toggleControls = () => {
    setShowControls(!showControls);
  };
  
  // Format clock display text
  const getDisplayText = () => {
    if (isTimerMode) {
      return formatTimer(remainingTime);
    } else {
      return formatTime(time);
    }
  };

  return (
    <div 
      id="digital-clock-container"
      className="flex flex-col items-center justify-center w-full mx-auto transition-colors relative "
    >
      {/* Digital Clock Display - Fixed position */}
      <div className="w-full text-center pb-8 pt-8 mb-8 relative">
        <h1 
          className={cn(
            "font-mono font-bold text-9xl md:text-[17rem] lg:text-[15rem] tracking-tight transition-colors",
            getThemeText()
          )}
        >
          {getDisplayText()}
        </h1>
        
        {/* Mode toggle buttons positioned above the clock */}
        <div className="absolute top-0 left-0 right-0 flex justify-center space-x-4 mb-4">
          <Button
            variant={isTimerMode ? "outline" : "default"}
            size="icon"
            onClick={() => {
              setIsTimerMode(false);
              setShowControls(true);
            }}
            className={cn(
              "h-8 w-8",
              !isTimerMode && getThemeAccent()
            )}
          >
            <Clock className="h-4 w-4" />
          </Button>
          <Button
            variant={isTimerMode ? "default" : "outline"}
            size="icon"
            onClick={() => {
              setIsTimerMode(true);
              setShowControls(true);
            }}
            className={cn(
              "h-8 w-8",
              isTimerMode && getThemeAccent()
            )}
          >
            <Timer className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Controls toggle button */}
       { isTimerMode && (
        
        <div className="absolute bottom-0 left-0 right-0 flex justify-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleControls}
            className="h-6 rounded-full"
          >
            {showControls ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>)}
      </div>

      {/* Controls - Absolute position to prevent moving the clock */}
      {showControls && (
        <div className="w-full max-w-2xl grid grid-cols-4 md:grid-cols-7 gap-3 text-base transition-opacity duration-300">

        {isTimerMode && (
          <>
            {/* Timer Type Selector */}
            <div className="col-span-2 md:col-span-1">
              <Select value={timerPreset} onValueChange={handlePresetChange}>
                <SelectTrigger id="timer-type" className="h-9">
                  <SelectValue placeholder="Select timer" />
                </SelectTrigger>
                <SelectContent>
                  {TIMER_PRESETS.map((preset) => (
                    <SelectItem key={preset.name} value={preset.name}>
                      {preset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Minutes and Seconds Input */}
            <div className="col-span-2 md:col-span-2">
              <div className="flex items-center space-x-1">
                <Input
                  id="minutes"
                  type="number"
                  min="0"
                  max="99"
                  value={timerMinutes}
                  onChange={handleMinutesChange}
                  className="h-9 w-full"
                  placeholder="Min"
                />
                <span>:</span>
                <Input
                  id="seconds"
                  type="number"
                  min="0"
                  max="59"
                  value={timerSeconds}
                  onChange={handleSecondsChange}
                  className="h-9 w-full"
                  placeholder="Sec"
                />
              </div>
            </div>

            {/* Timer Controls */}
            <div className="col-span-1">
              <Button 
                onClick={toggleTimer}
                size="icon"
                className={cn(
                  "h-9 w-full",
                  getThemeAccent()
                )}
              >
                {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
            
            {/* Reset Button */}
            <div className="col-span-1">
              <Button 
                onClick={resetTimer} 
                variant="outline"
                size="icon"
                className="h-9 w-full"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            {/* Sound Toggle */}
            <div className="col-span-1">
              <Button
                variant={alarmEnabled ? "default" : "outline"}
                size="icon"
                onClick={() => setAlarmEnabled(!alarmEnabled)}
                className={cn(
                  "h-9 w-full",
                  alarmEnabled && getThemeAccent(),
                  !alarmEnabled && getThemeBorder()
                )}
              >
                {alarmEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              </Button>
            </div>
            
            {/* Color Theme Button */}
            <div className="col-span-1">
              <Button 
                variant="outline" 
                size="icon"
                onClick={cycleColorTheme}
                className={cn(
                  "h-9 w-full",
                  getThemeBorder()
                )}
              >
                <Palette className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
      )}
    </div>
  );
};

export default DigitalClock;
