
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            About SwarCure
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indian-gold to-indian-saffron mx-auto mb-8"></div>
          <p className="text-xl text-tertiary max-w-4xl mx-auto leading-relaxed">
            Empowering mental wellness in India with non-invasive, culturally rooted, AI-driven music healing. 
            We blend ancient wisdom of Indian classical music with modern AI technology to create personalized 
            therapeutic experiences that resonate with your soul.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-accent/30 hover:border-primary/50 transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Traditional Wisdom</h3>
              <p className="text-tertiary">
                Rooted in centuries-old Indian classical music traditions and raga therapy principles.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-accent/30 hover:border-primary/50 transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-tertiary rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">AI-Powered</h3>
              <p className="text-tertiary">
                Advanced algorithms analyze your mood and prescribe personalized healing soundscapes.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-accent/30 hover:border-primary/50 transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-tertiary to-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Culturally Sensitive</h3>
              <p className="text-tertiary">
                Designed specifically for Indian mental health needs with cultural understanding.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
