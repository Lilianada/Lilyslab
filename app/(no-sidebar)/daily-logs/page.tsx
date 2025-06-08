import React from "react";
import { getAllDailyLogs, type DailyLog } from "@/lib/daily-logs";
import DailyLogsClient from "./DailyLogsClient";

// Define the display format for logs
export interface DisplayLog {
  date: string;
  mood: { emoji: string; label: string };
  body: string;
}

// Convert DailyLog to DisplayLog format
function convertToDisplayFormat(logs: DailyLog[]): DisplayLog[] {
  return logs.map(log => {
    // Extract emoji and create a label from the mood
    const emoji = log.mood || "📝";
    const label = getMoodLabel(emoji);
    
    return {
      date: log.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      mood: { emoji, label },
      body: log.content
    };
  });
}

// Helper function to get mood labels
function getMoodLabel(emoji: string): string {
  const moodMap: { [key: string]: string } = {
    "📚": "Studious",
    "🎯": "Focused", 
    "💭": "Thoughtful",
    "💡": "Inspired",
    "😔": "Reflective",
    "🌙": "Peaceful",
    "🌅": "Optimistic",
    "📝": "Reflective"
  };
  return moodMap[emoji] || "Contemplative";
}

export default async function DailyLogsPage() {
  // Fetch real data from markdown files
  const dailyLogs = await getAllDailyLogs();
  const logs = convertToDisplayFormat(dailyLogs);

  return <DailyLogsClient logs={logs} />;
}
