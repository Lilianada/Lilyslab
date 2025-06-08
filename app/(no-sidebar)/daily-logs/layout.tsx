import React from 'react';

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
