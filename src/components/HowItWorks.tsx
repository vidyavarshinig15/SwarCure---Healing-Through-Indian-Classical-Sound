
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Headphones, User, Users } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Mic className="w-8 h-8" />,
      title: "Mood Quiz",
      description: "Take our comprehensive wellness assessment to understand your current mental state and needs."
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "AI Playlist",
      description: "Our AI creates a personalized playlist of healing ragas and classical compositions tailored to you."
    },
    {
      icon: <User className="w-8 h-8" />,
      title: "Doctor Voice Prescription",
      description: "Licensed specialists provide voice-guided therapy sessions using our DocAssist and Voice2Rx APIs."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Progress Dashboard",
      description: "Track your wellness journey with detailed analytics and mood progression over time."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            How It Works
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indian-gold to-indian-saffron mx-auto mb-8"></div>
          <p className="text-xl text-tertiary max-w-3xl mx-auto">
            Our innovative platform combines ancient wisdom with modern technology to deliver personalized music therapy.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="border-accent/30 hover:border-primary/50 transition-all duration-300 transform hover:scale-105 h-full">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-6 flex items-center justify-center text-white">
                    {step.icon}
                  </div>
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-indian-gold rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-4">{step.title}</h3>
                  <p className="text-tertiary">{step.description}</p>
                </CardContent>
              </Card>
              
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-accent to-secondary transform -translate-y-1/2"></div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-tertiary mb-4">Powered by our advanced APIs:</p>
          <div className="flex justify-center space-x-6">
            <span className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-full text-sm font-semibold">
              DocAssist API
            </span>
            <span className="px-4 py-2 bg-gradient-to-r from-secondary to-tertiary text-white rounded-full text-sm font-semibold">
              Voice2Rx API
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
