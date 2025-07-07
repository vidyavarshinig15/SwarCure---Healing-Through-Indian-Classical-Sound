import React from 'react';
import Header from '@/components/Header';
import NotificationSystem from '@/components/NotificationSystem';

export default function NotificationsPage() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Notifications</h1>
          <p className="text-muted-foreground">View all your therapy reminders and event notifications</p>
        </div>
        <NotificationSystem fullPage={true} />
      </div>
    </>
  );
}
