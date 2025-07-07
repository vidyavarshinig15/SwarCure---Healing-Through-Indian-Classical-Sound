
import React from 'react';
import { Button } from '@/components/ui/button';
import { Headphones, Mic } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-lotus-pattern">
      {/* Softer Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/80 via-accent/40 to-secondary/20"></div>
      
      {/* Softer Floating Elements */}
      <div className="absolute top-32 left-16 w-16 h-16 bg-indian-gold/10 rounded-full animate-float blur-sm"></div>
      <div className="absolute bottom-40 right-20 w-12 h-12 bg-indian-saffron/10 rounded-full animate-float blur-sm" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/4 right-1/3 w-8 h-8 bg-indian-copper/10 rounded-full animate-float blur-sm" style={{ animationDelay: '4s' }}></div>
      
      {/* Main Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6 animate-fade-in-up">
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/80 to-secondary/80 rounded-full mb-8 animate-pulse-soft shadow-lg">
            <Headphones className="w-10 h-10 text-white" />
          </div>
          
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary/90 via-secondary/90 to-tertiary/90 bg-clip-text text-transparent leading-relaxed">
            SwarCure
          </h1>
          <p className="text-xl md:text-2xl text-primary/80 font-medium mb-3">
            Healing Through Indian Classical Sound
          </p>
          <p className="text-base md:text-lg text-tertiary/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            AI-powered music wellness rooted in ancient traditions. Experience the gentle therapeutic power of ragas and classical melodies crafted for your inner peace and mental well-being.
          </p>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-primary/80 to-secondary/80 hover:from-secondary/80 hover:to-primary/80 text-white px-10 py-5 text-base rounded-2xl shadow-md transform hover:scale-102 transition-all duration-500"
          >
            <Headphones className="w-5 h-5 mr-3" />
            Listen Now
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-primary/60 text-primary/80 hover:bg-primary/10 hover:text-primary px-10 py-5 text-base rounded-2xl shadow-md transform hover:scale-102 transition-all duration-500"
          >
            <Mic className="w-5 h-5 mr-3" />
            Wellness Quiz
          </Button>
        </div>
        
        {/* Traditional Pattern with English blessing */}
        <div className="mt-16">
          <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-indian-gold/50 to-transparent mx-auto rounded-full mb-4"></div>
          <p className="text-sm text-primary/60 font-light">
            May all beings be happy and healthy
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
