
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Headphones } from 'lucide-react';

const SoundCollections = () => {
  const collections = [
    {
      title: "Relaxation",
      description: "Soothing ragas to calm your mind and release tension",
      color: "from-blue-400 to-blue-600",
      tracks: ["Raga Yaman", "Bhairavi Meditation", "Peaceful Sitar"]
    },
    {
      title: "Sleep",
      description: "Gentle melodies to guide you into restful slumber",
      color: "from-purple-400 to-purple-600",
      tracks: ["Night Ragas", "Flute Dreams", "Temple Bells"]
    },
    {
      title: "Energy",
      description: "Uplifting compositions to boost your vitality",
      color: "from-orange-400 to-red-500",
      tracks: ["Morning Ragas", "Tabla Rhythms", "Energizing Mantras"]
    }
  ];

  return (
    <section id="collections" className="py-20 bg-gradient-to-br from-muted to-accent/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Explore Sound Collections
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indian-gold to-indian-saffron mx-auto mb-8"></div>
          <p className="text-xl text-tertiary max-w-3xl mx-auto">
            Discover curated collections of Indian classical music designed for specific wellness needs. 
            Each track is carefully selected for its therapeutic properties.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <Card key={index} className="border-accent/30 hover:border-primary/50 transition-all duration-300 transform hover:scale-105 overflow-hidden">
              <div className={`h-48 bg-gradient-to-br ${collection.color} relative`}>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold">{collection.title}</h3>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse-soft">
                    <Headphones className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-tertiary mb-4">{collection.description}</p>
                <div className="space-y-2 mb-6">
                  {collection.tracks.map((track, trackIndex) => (
                    <div key={trackIndex} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-sm text-primary">{track}</span>
                      <Button size="sm" variant="ghost" className="text-secondary hover:text-primary">
                        <Headphones className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white">
                  Listen to Collection
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SoundCollections;
