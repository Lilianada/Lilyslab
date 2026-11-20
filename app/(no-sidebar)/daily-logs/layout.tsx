import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daily Logs',
  description: "Lilian Ada's daily logs: short notes on what each day held.",
  alternates: { canonical: '/daily-logs' },
};

export default function DailyLogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="daily-logs-layout">
      {children}
    </div>
  );
}
