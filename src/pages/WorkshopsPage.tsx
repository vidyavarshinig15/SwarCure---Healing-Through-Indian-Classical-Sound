import React from 'react';
import Header from '@/components/Header';
import Workshops from '@/components/Workshops';

export default function WorkshopsPage() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Workshops & Events</h1>
          <p className="text-muted-foreground">Join our educational and therapeutic events</p>
        </div>
        <Workshops />
      </div>
    </>
  );
}
