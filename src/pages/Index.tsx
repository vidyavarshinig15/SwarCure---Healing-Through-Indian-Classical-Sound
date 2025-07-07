import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Headphones, Mic, MicOff, User, Users, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import SoundCollections from '@/components/SoundCollections';
import HowItWorks from '@/components/HowItWorks';
import ConsultSpecialist from '@/components/ConsultSpecialist';
import Dashboard from '@/components/Dashboard';
import Community from '@/components/Community';
import Footer from '@/components/Footer';
import NotificationSystem from '@/components/NotificationSystem';

const Index = () => {
  const [isGuest, setIsGuest] = useState(() => localStorage.getItem('isGuest') === 'true');
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isGuest');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/60 via-accent/30 to-secondary/10">
      {/* Calmer Header */}
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-lg border-b border-accent/10 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/80 to-secondary/80 rounded-xl flex items-center justify-center shadow-md">
              <Headphones className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary/90 to-secondary/90 bg-clip-text text-transparent">
                SwarCure
              </span>
              <div className="text-xs text-primary/60">Sound Therapy Platform</div>
            </div>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="calm-text text-primary/80 hover:text-secondary/80 transition-colors duration-300">Home</Link>
            <a href="#about" className="calm-text text-primary/80 hover:text-secondary/80 transition-colors duration-300">About</a>
            <Link to="/music-search" className="calm-text text-primary/80 hover:text-secondary/80 transition-colors duration-300">Sound Collections</Link>
            {!isGuest && (
              <Link to="/therapy-assessment" className="calm-text text-primary/80 hover:text-secondary/80 transition-colors duration-300">Personalized Therapy</Link>
            )}
            {isGuest && (
              <Link to="/login" className="calm-text text-primary/80 hover:text-secondary/80 transition-colors duration-300">
                <span className="flex items-center">
                  Personalized Therapy
                  <Badge variant="outline" className="ml-2 text-xs py-0">Login Required</Badge>
                </span>
              </Link>
            )}
            <Link to="/doctors" className="calm-text text-primary/80 hover:text-secondary/80 transition-colors duration-300">Doctors</Link>
            <Link to="/workshops" className="calm-text text-primary/80 hover:text-secondary/80 transition-colors duration-300">Workshops</Link>
            <a href="#community" className="calm-text text-primary/80 hover:text-secondary/80 transition-colors duration-300">Community</a>
          </nav>
          <div className="flex items-center gap-4">
            {!isGuest && <NotificationSystem />}
            {isLoggedIn || isGuest ? (
              <Button onClick={handleLogout} variant="outline" className="border-primary/60 text-primary/80 hover:bg-primary/10 hover:text-primary calm-text rounded-xl">
                {isGuest ? 'Exit Guest Mode' : 'Logout'}
              </Button>
            ) : (
              <Button onClick={() => navigate('/login')} variant="outline" className="border-primary/60 text-primary/80 hover:bg-primary/10 hover:text-primary calm-text rounded-xl">
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content with better spacing */}
      <main className="pt-20">
        <Hero />
        <div className="space-y-16">
          <AboutSection />
          <div className="container mx-auto px-6 flex justify-center">
            <Button 
              onClick={() => navigate('/music-search')} 
              className="text-lg py-6 px-8"
            >
              Explore Sound Collections
            </Button>
          </div>
          <SoundCollections />
          <HowItWorks />
          <ConsultSpecialist />
          <div className="container mx-auto px-6 flex justify-center">
            {isGuest ? (
              <Button 
                onClick={() => navigate('/login')} 
                className="text-lg py-6 px-8"
              >
                Sign Up for Personalized Therapy
              </Button>
            ) : (
              <Button 
                onClick={() => navigate('/therapy-assessment')} 
                className="text-lg py-6 px-8"
              >
                Start Your Personalized Assessment
              </Button>
            )}
          </div>
          <Dashboard />
          <Community />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
