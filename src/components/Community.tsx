
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

const Community = () => {
  const events = [
    {
      title: "Virtual Bhajan Evening",
      date: "Dec 15, 2024",
      time: "7:00 PM IST",
      type: "Virtual",
      participants: 156
    },
    {
      title: "Healing Yoga & Meditation",
      date: "Dec 18, 2024", 
      time: "6:30 AM IST",
      type: "Local Gathering",
      participants: 24
    },
    {
      title: "Classical Music Therapy Workshop",
      date: "Dec 22, 2024",
      time: "4:00 PM IST", 
      type: "Online Workshop",
      participants: 89
    }
  ];

  return (
    <section id="community" className="py-20 bg-gradient-to-br from-muted to-accent/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Community & Events
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indian-gold to-indian-saffron mx-auto mb-8"></div>
          <p className="text-xl text-tertiary max-w-3xl mx-auto">
            Join our vibrant community of wellness seekers. Participate in local bhajan gatherings, 
            virtual healing concerts, and yoga sessions designed to enhance your spiritual journey.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {events.map((event, index) => (
            <Card key={index} className="border-accent/30 hover:border-primary/50 transition-all duration-300 transform hover:scale-105">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    event.type === 'Virtual' ? 'bg-blue-100 text-blue-800' :
                    event.type === 'Local Gathering' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {event.type}
                  </span>
                  <div className="flex items-center text-sm text-tertiary">
                    <Users className="w-4 h-4 mr-1" />
                    {event.participants}
                  </div>
                </div>
                <CardTitle className="text-primary">{event.title}</CardTitle>
                <CardDescription>
                  {event.date} • {event.time}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white">
                  Join Event
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-accent/30">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-4">Join Our Wellness Community</h3>
              <p className="text-tertiary mb-6">
                Connect with like-minded individuals on their healing journey. Share experiences, 
                learn from others, and grow together in a supportive environment.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-indian-gold rounded-full mr-3"></div>
                  <span className="text-tertiary">Monthly virtual satsangs</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-indian-saffron rounded-full mr-3"></div>
                  <span className="text-tertiary">Local healing circles</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-indian-copper rounded-full mr-3"></div>
                  <span className="text-tertiary">Expert-led workshops</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="w-16 h-16 text-white" />
              </div>
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white px-8 py-3">
                Join Community
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;
