import React from 'react';
import { getAllDailyLogs } from '@/lib/daily-logs';
import DailyLogsClient from './DailyLogsClient';

export const metadata = {
  title: 'Daily Logs | Lily\'s Lab',
  description: 'Personal thoughts and digital explorations from Lily\'s Lab',
};

export default async function DailyLogsPage() {
  const logs = await getAllDailyLogs();
  
  return <DailyLogsClient logs={logs} />;
}
