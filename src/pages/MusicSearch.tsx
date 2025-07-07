import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, PlayCircle, Clock, Music, Headphones, Volume1, Volume2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';

// Mock data for music playlists
const playlists = {
  anxiety: [
    { id: 1, title: 'Raag Bhimpalasi', description: 'Calming raga for anxiety relief', duration: '12:30', frequency: 'Low (432 Hz)', recommended: '15 min daily' },
    { id: 2, title: 'Raag Bageshri', description: 'Evening raga for relaxation', duration: '10:45', frequency: 'Medium (528 Hz)', recommended: '20 min before sleep' },
    { id: 3, title: 'Shanti Mantras', description: 'Peace chants with tanpura', duration: '15:20', frequency: 'Low (396 Hz)', recommended: '10 min, twice daily' },
  ],
  concentration: [
    { id: 4, title: 'Raag Ahir Bhairav', description: 'Morning raga for focus', duration: '14:15', frequency: 'Medium (528 Hz)', recommended: '20 min before work' },
    { id: 5, title: 'Raag Darbari', description: 'Deep focus raga', duration: '18:30', frequency: 'High (639 Hz)', recommended: '30 min sessions' },
    { id: 6, title: 'Saraswati Vandana', description: 'Invocation for knowledge', duration: '8:45', frequency: 'Medium (528 Hz)', recommended: '10 min before study' },
  ],
  stress: [
    { id: 7, title: 'Raag Malkauns', description: 'Night raga for stress relief', duration: '16:40', frequency: 'Low (396 Hz)', recommended: '15 min before sleep' },
    { id: 8, title: 'OM Chanting', description: 'Deep resonance meditation', duration: '10:00', frequency: 'Low (432 Hz)', recommended: '10 min, three times daily' },
    { id: 9, title: 'Raag Bhairavi', description: 'Morning relaxation', duration: '14:20', frequency: 'Medium (528 Hz)', recommended: '15 min at sunrise' },
  ],
  depression: [
    { id: 10, title: 'Raag Jog', description: 'Evening raga for mood elevation', duration: '15:10', frequency: 'Medium (528 Hz)', recommended: '15 min at sunset' },
    { id: 11, title: 'Raag Yaman', description: 'Uplifting evening raga', duration: '12:30', frequency: 'High (639 Hz)', recommended: '20 min before dinner' },
    { id: 12, title: 'Gayatri Mantra', description: 'Sacred chant for positivity', duration: '9:15', frequency: 'Medium (528 Hz)', recommended: '10 min daily' },
  ]
};

export default function MusicSearch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFrequency, setSelectedFrequency] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [volume, setVolume] = useState([75]);
  const isGuest = localStorage.getItem('isGuest') === 'true';
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase();
    
    // Search through the playlists object
    if (playlists[query as keyof typeof playlists]) {
      let results = [...playlists[query as keyof typeof playlists]];
      
      // Filter by frequency if needed
      if (selectedFrequency !== 'all') {
        results = results.filter(track => 
          track.frequency.toLowerCase().includes(selectedFrequency.toLowerCase())
        );
      }
      
      setSearchResults(results);
    } else {
      // Search didn't match any category exactly
      setSearchResults([]);
    }
  };

  const playTrack = (track: any) => {
    setCurrentTrack(track);
  };

  const handleAccessPersonalizedTherapy = () => {
    if (isGuest) {
      navigate('/login');
    } else {
      navigate('/therapy-assessment');
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary mb-6">Sound Therapy Collection</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="mb-6 shadow-md">
              <CardHeader>
                <CardTitle>Find Your Healing Sound</CardTitle>
                <CardDescription>
                  Search for "anxiety", "concentration", "stress", or "depression"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                  <Input
                    placeholder="Search by condition..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </form>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge 
                    variant={selectedFrequency === 'all' ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedFrequency('all')}
                  >
                    All Frequencies
                  </Badge>
                  <Badge 
                    variant={selectedFrequency === 'low' ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedFrequency('low')}
                  >
                    Low (396-432 Hz)
                  </Badge>
                  <Badge 
                    variant={selectedFrequency === 'medium' ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedFrequency('medium')}
                  >
                    Medium (528 Hz)
                  </Badge>
                  <Badge 
                    variant={selectedFrequency === 'high' ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedFrequency('high')}
                  >
                    High (639+ Hz)
                  </Badge>
                </div>
                
                {searchResults.length > 0 ? (
                  <ul className="space-y-4">
                    {searchResults.map(track => (
                      <li key={track.id} className="border rounded-lg p-4 hover:bg-accent/5 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{track.title}</h3>
                            <p className="text-sm text-muted-foreground">{track.description}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {track.duration}
                              </Badge>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Music className="h-3 w-3" />
                                {track.frequency}
                              </Badge>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => playTrack(track)} 
                            className="rounded-full h-10 w-10 p-0"
                          >
                            <PlayCircle className="h-6 w-6" />
                          </Button>
                        </div>
                        <div className="mt-3 text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> 
                          Recommended: {track.recommended}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : searchQuery && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                    <p className="text-sm mt-2">Try searching for "anxiety", "concentration", "stress", or "depression"</p>
                  </div>
                )}
                
                {!searchQuery && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                    {['anxiety', 'concentration', 'stress', 'depression'].map(category => (
                      <Button 
                        key={category}
                        variant="outline" 
                        className="h-auto p-4 justify-start"
                        onClick={() => {
                          setSearchQuery(category);
                          const event = { preventDefault: () => {} } as React.FormEvent;
                          handleSearch(event);
                        }}
                      >
                        <div className="text-left">
                          <h3 className="font-medium capitalize">{category}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {category === 'anxiety' && 'Calming sounds to reduce worry'}
                            {category === 'concentration' && 'Focus-enhancing ragas'}
                            {category === 'stress' && 'Relaxing sounds for relief'}
                            {category === 'depression' && 'Uplifting melodies for mood'}
                          </p>
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Button 
              onClick={handleAccessPersonalizedTherapy}
              className="w-full mb-6"
            >
              {isGuest 
                ? "Create Account for Personalized Therapy" 
                : "Access Your Personalized Therapy"}
            </Button>
          </div>
          
          <div>
            <Card className="sticky top-4 shadow-md">
              <CardHeader>
                <CardTitle>Now Playing</CardTitle>
                <CardDescription>
                  {currentTrack ? 'Adjust volume and enjoy your therapy' : 'Select a track to start listening'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentTrack ? (
                  <div className="space-y-6">
                    <div className="flex justify-center">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/25 to-secondary/25 flex items-center justify-center">
                        <Headphones className="h-16 w-16 text-primary/70" />
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <h3 className="font-medium text-lg">{currentTrack.title}</h3>
                      <p className="text-sm text-muted-foreground">{currentTrack.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Volume</span>
                        <span className="text-sm">{volume}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Volume1 className="h-4 w-4 text-muted-foreground" />
                        <Slider 
                          defaultValue={volume}
                          max={100}
                          step={1}
                          onValueChange={setVolume}
                        />
                        <Volume2 className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <div className="p-3 bg-muted rounded-md">
                      <h4 className="font-medium text-sm mb-1">Recommendation</h4>
                      <p className="text-xs">
                        For best results, listen for {currentTrack.recommended.split(',')[0]} in a quiet environment. 
                        This {currentTrack.frequency} frequency can help with {searchQuery}.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Headphones className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No track selected</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Search and select a track to begin your therapy session
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="mt-6 shadow-md">
              <CardHeader>
                <CardTitle>Sound Therapy Benefits</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Ancient Indian ragas have specific healing properties</p>
                <p>• Different frequencies affect different energy centers</p>
                <p>• Regular practice can improve mental wellbeing</p>
                <p>• Create an account for personalized therapy plans</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
