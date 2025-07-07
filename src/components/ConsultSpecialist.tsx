
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

const ConsultSpecialist = () => {
  const specialists = [
    {
      name: "Dr. Priya Sharma",
      specialty: "Music Therapy & Psychology",
      experience: "15+ years",
      languages: "Hindi, English, Marathi",
      rating: 4.9
    },
    {
      name: "Dr. Arjun Mehta", 
      specialty: "Psychiatry & Raga Therapy",
      experience: "12+ years",
      languages: "Hindi, English, Gujarati",
      rating: 4.8
    },
    {
      name: "Dr. Kavitha Nair",
      specialty: "Clinical Psychology",
      experience: "10+ years", 
      languages: "Hindi, English, Tamil, Malayalam",
      rating: 4.9
    }
  ];

  return (
    <section id="consult" className="py-20 bg-gradient-to-br from-muted to-accent/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Consult a Specialist
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indian-gold to-indian-saffron mx-auto mb-8"></div>
          <p className="text-xl text-tertiary max-w-3xl mx-auto">
            Connect with licensed psychiatrists and psychologists specialized in music therapy and Indian wellness practices.
          </p>
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg inline-block">
            <p className="text-sm text-yellow-800 font-medium">
              🔒 Login required to book appointments • UPI/Card payments accepted
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {specialists.map((specialist, index) => (
            <Card key={index} className="border-accent/30 hover:border-primary/50 transition-all duration-300 transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-primary">{specialist.name}</CardTitle>
                <CardDescription className="text-secondary font-medium">
                  {specialist.specialty}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-tertiary">Experience:</span>
                    <span className="text-primary font-medium">{specialist.experience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-tertiary">Languages:</span>
                    <span className="text-primary font-medium">{specialist.languages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-tertiary">Rating:</span>
                    <span className="text-primary font-medium">⭐ {specialist.rating}/5</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white">
                  Book Consultation
                </Button>
                <p className="text-xs text-tertiary text-center">
                  ₹500-1500 per session • Insurance may cover
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConsultSpecialist;
