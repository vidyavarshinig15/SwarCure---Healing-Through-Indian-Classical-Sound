import React from 'react';
import Header from '@/components/Header';
import DoctorConsultation from '@/components/DoctorConsultation';

export default function DoctorsPage() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Doctor Consultations</h1>
          <p className="text-muted-foreground">Book a session with our expert sound therapy practitioners</p>
        </div>
        <DoctorConsultation />
      </div>
    </>
  );
}
