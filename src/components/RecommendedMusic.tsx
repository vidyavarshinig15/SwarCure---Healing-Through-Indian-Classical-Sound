import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Youtube, Music, Clock, PlayCircle } from 'lucide-react';

// Sample music recommendations from different platforms
const musicRecommendations = {
  anxiety: {
    youtube: [
      { id: 'y1dbbrfekAM', title: 'Raag Bhimpalasi - Anxiety Relief', artist: 'Pandit Hariprasad Chaurasia', duration: '18:32', source: 'youtube' },
      { id: 'gMaB-fG4u4g', title: 'Indian Classical Flute Music for Anxiety', artist: 'Rakesh Chaurasia', duration: '12:24', source: 'youtube' },
      { id: 'cFWk0o3yGdY', title: 'OM Chanting @ 432Hz', artist: 'Meditative Mind', duration: '10:00', source: 'youtube' },
    ],
    spotify: [
      { id: '0KUK3KcL9tAXPxSGYB7WCL', title: 'Raag Bhairavi - Morning Meditation', artist: 'Ravi Shankar', duration: '15:20', source: 'spotify' },
      { id: '4ueJXHrE1Wo7ODV2tknFU8', title: 'Raag Bageshri', artist: 'Shivkumar Sharma', duration: '21:45', source: 'spotify' },
      { id: '6rtSYKJ7xvK5Qs8CYXyPQ3', title: 'Healing Mantras', artist: 'Deva Premal', duration: '8:42', source: 'spotify' },
    ],
    traditional: [
      { title: 'Raag Darbari Kanada', description: 'Classical night raga for deep relaxation and anxiety relief', duration: '~30 min', frequency: 'Low (396 Hz)', time: 'Before sleep' },
      { title: 'Raag Bageshri', description: 'Evening raga with calming effects on nervous system', duration: '~20 min', frequency: 'Medium (528 Hz)', time: 'Evening' },
      { title: 'Shanti Mantras with Tanpura', description: 'Peace chants with drone background', duration: '~15 min', frequency: 'Low (432 Hz)', time: 'Anytime' },
    ]
  },
  depression: {
    youtube: [
      { id: 'vJPP6_3jzV0', title: 'Raag Jog - Mood Elevation', artist: 'Pandit Jasraj', duration: '24:10', source: 'youtube' },
      { id: 'AjnR1hjeOGs', title: 'Morning Ragas for Positivity', artist: 'Shubha Mudgal', duration: '16:53', source: 'youtube' },
      { id: 'bJLDYw3i-tE', title: 'Healing Raga for Depression Relief', artist: 'Deobrat Mishra', duration: '19:28', source: 'youtube' },
    ],
    spotify: [
      { id: '6fO7kGXA1YNHyfj1B5zvNS', title: 'Raag Yaman - Evening Bliss', artist: 'Zakir Hussain', duration: '14:30', source: 'spotify' },
      { id: '3M8Er1VYkYP66lpn1faJcT', title: 'Raag Jog Therapy', artist: 'Hariprasad Chaurasia', duration: '22:18', source: 'spotify' },
      { id: '1SRwRLXg2ng8hnt6ME5yLx', title: 'Gayatri Mantra for Healing', artist: 'Various Artists', duration: '9:15', source: 'spotify' },
    ],
    traditional: [
      { title: 'Raag Basant', description: 'Spring raga for upliftment and renewal', duration: '~25 min', frequency: 'Medium (528 Hz)', time: 'Morning' },
      { title: 'Raag Kirwani', description: 'Mood elevating with stimulating patterns', duration: '~20 min', frequency: 'High (639 Hz)', time: 'Evening' },
      { title: 'Bhajan Collection', description: 'Traditional devotional songs for spiritual connection', duration: '~15 min each', frequency: 'Various', time: 'Morning/Evening' },
    ]
  },
  concentration: {
    youtube: [
      { id: 'pT1nS365XmU', title: 'Raag Ahir Bhairav - Focus Music', artist: 'Ustad Amjad Ali Khan', duration: '22:40', source: 'youtube' },
      { id: 'IPBvXjfPMOw', title: 'Study Music - Concentration Ragas', artist: 'Nikhil Banerjee', duration: '15:38', source: 'youtube' },
      { id: 'JeVQFTZxrEE', title: 'Saraswati Chant for Knowledge', artist: 'Uma Mohan', duration: '11:27', source: 'youtube' },
    ],
    spotify: [
      { id: '16qYlQ0TlRrh5S9ODFjnUj', title: 'Raag Ahir Bhairav - Morning Focus', artist: 'Pandit Vishwa Mohan Bhatt', duration: '18:45', source: 'spotify' },
      { id: '0UyCPx1gxHn5GJK5PRvC9L', title: 'Raag Bhairavi for Concentration', artist: 'Anoushka Shankar', duration: '16:30', source: 'spotify' },
      { id: '2cF5YSQWyq0zShs6ACDpTZ', title: 'Veena Meditation', artist: 'E. Gayathri', duration: '10:20', source: 'spotify' },
    ],
    traditional: [
      { title: 'Raag Ahir Bhairav', description: 'Morning raga for mental clarity and focus', duration: '~20 min', frequency: 'Medium (528 Hz)', time: 'Morning' },
      { title: 'Raag Marwa', description: 'Afternoon raga for deep concentration', duration: '~25 min', frequency: 'High (639 Hz)', time: 'Afternoon' },
      { title: 'Saraswati Stotram', description: 'Sanskrit verses honoring the goddess of knowledge', duration: '~10 min', frequency: 'Medium (528 Hz)', time: 'Before study' },
    ]
  },
  stress: {
    youtube: [
      { id: 'CRK5jJssFe8', title: 'Raag Malkauns - Deep Relaxation', artist: 'Ustad Vilayat Khan', duration: '26:18', source: 'youtube' },
      { id: 'GLl2wKiufpY', title: 'Stress Relief - Santoor Music', artist: 'Rahul Sharma', duration: '15:42', source: 'youtube' },
      { id: 'H3PoGq9R04U', title: 'Traditional Flute for Calm', artist: 'G.S. Sachdev', duration: '14:08', source: 'youtube' },
    ],
    spotify: [
      { id: '2AdmUZhhvO4c8Br3xiXKTO', title: 'Raag Bhairavi - Stress Relief', artist: 'Pandit Ronu Majumdar', duration: '17:30', source: 'spotify' },
      { id: '6pGxWvSE1fY9bx5Qvy1Ton', title: 'Raag Puriya Dhanashree', artist: 'Ustad Amjad Ali Khan', duration: '18:56', source: 'spotify' },
      { id: '5oDhPA5Iezla23RnKFaXyn', title: 'Sitar & Tabla Duet for Relaxation', artist: 'Anoushka Shankar & Zakir Hussain', duration: '12:18', source: 'spotify' },
    ],
    traditional: [
      { title: 'Raag Malkauns', description: 'Night raga for deep relaxation and unwinding', duration: '~30 min', frequency: 'Low (396 Hz)', time: 'Night' },
      { title: 'Raag Puriya', description: 'Evening raga with calming effect on nervous system', duration: '~25 min', frequency: 'Medium (528 Hz)', time: 'Evening' },
      { title: 'OM Dhyana', description: 'Meditative chanting with guided breathing', duration: '~15 min', frequency: 'Low (432 Hz)', time: 'Anytime' },
    ]
  }
};

interface RecommendedMusicProps {
  condition: string;
  severity?: string; // Can be 'mild', 'moderate', 'severe'
  onTrackSelected: (track: any) => void;
  onLogProgress: () => void;
}

export default function RecommendedMusic({ 
  condition = 'anxiety', 
  severity = 'moderate',
  onTrackSelected,
  onLogProgress
}: RecommendedMusicProps) {
  const [activeTab, setActiveTab] = useState('youtube');
  const recommendations = musicRecommendations[condition as keyof typeof musicRecommendations] || musicRecommendations.anxiety;
  
  const handlePlay = (track: any) => {
    onTrackSelected(track);
    onLogProgress();
  };
  
  const getEmbedUrl = (track: any) => {
    if (track.source === 'youtube') {
      return `https://www.youtube.com/embed/${track.id}`;
    }
    if (track.source === 'spotify') {
      return `https://open.spotify.com/embed/track/${track.id}`;
    }
    return '';
  };
  
  const getExternalUrl = (track: any) => {
    if (track.source === 'youtube') {
      return `https://www.youtube.com/watch?v=${track.id}`;
    }
    if (track.source === 'spotify') {
      return `https://open.spotify.com/track/${track.id}`;
    }
    return '#';
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Recommended Music for {condition.charAt(0).toUpperCase() + condition.slice(1)}</span>
          <Badge variant={
            severity === 'mild' ? 'outline' : 
            severity === 'moderate' ? 'secondary' : 'destructive'
          }>
            {severity.charAt(0).toUpperCase() + severity.slice(1)} Symptoms
          </Badge>
        </CardTitle>
        <CardDescription>
          Listen to these specially curated tracks to help with your condition
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="youtube" className="flex items-center gap-1">
              <Youtube className="h-4 w-4" />
              YouTube
            </TabsTrigger>
            <TabsTrigger value="spotify" className="flex items-center gap-1">
              <Music className="h-4 w-4" />
              Spotify
            </TabsTrigger>
            <TabsTrigger value="traditional" className="flex items-center gap-1">
              <Music className="h-4 w-4" />
              Traditional
            </TabsTrigger>
          </TabsList>
          
          {/* YouTube Content */}
          <TabsContent value="youtube" className="space-y-4 pt-4">
            {recommendations.youtube.map((track, index) => (
              <div key={`youtube-${index}`} className="border rounded-lg p-4 hover:bg-accent/5 transition-colors">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">{track.title}</h3>
                    <p className="text-sm text-muted-foreground">{track.artist}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {track.duration}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handlePlay(track)}
                      className="rounded-full h-8 w-8 p-0"
                    >
                      <PlayCircle className="h-5 w-5" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      asChild
                      className="rounded-full h-8 w-8 p-0"
                    >
                      <a href={getExternalUrl(track)} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 aspect-video w-full rounded-md overflow-hidden">
                  <iframe 
                    src={getEmbedUrl(track)} 
                    title={track.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </div>
            ))}
          </TabsContent>
          
          {/* Spotify Content */}
          <TabsContent value="spotify" className="space-y-4 pt-4">
            {recommendations.spotify.map((track, index) => (
              <div key={`spotify-${index}`} className="border rounded-lg p-4 hover:bg-accent/5 transition-colors">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">{track.title}</h3>
                    <p className="text-sm text-muted-foreground">{track.artist}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {track.duration}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handlePlay(track)}
                      className="rounded-full h-8 w-8 p-0"
                    >
                      <PlayCircle className="h-5 w-5" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      asChild
                      className="rounded-full h-8 w-8 p-0"
                    >
                      <a href={getExternalUrl(track)} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 aspect-[4/1] w-full rounded-md overflow-hidden">
                  <iframe 
                    src={getEmbedUrl(track)} 
                    title={track.title}
                    allow="encrypted-media" 
                    className="w-full h-full"
                  ></iframe>
                </div>
              </div>
            ))}
          </TabsContent>
          
          {/* Traditional Content */}
          <TabsContent value="traditional" className="space-y-4 pt-4">
            {recommendations.traditional.map((track, index) => (
              <div key={`traditional-${index}`} className="border rounded-lg p-4 hover:bg-accent/5 transition-colors">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">{track.title}</h3>
                    <p className="text-sm text-muted-foreground">{track.description}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {track.duration}
                      </Badge>
                      <Badge variant="outline">
                        {track.frequency}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Best time: {track.time}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Button 
                      size="sm" 
                      onClick={() => handlePlay(track)}
                      className="rounded-full h-10 w-10 p-0"
                    >
                      <PlayCircle className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">About Traditional Ragas</h3>
              <p className="text-sm text-muted-foreground">
                These traditional ragas follow ancient Indian musical principles and have been used for centuries for their therapeutic properties. 
                For best results, try to listen in the recommended time of day and in a quiet environment.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-xs text-muted-foreground">
          Your listening progress will be tracked automatically to help maintain your therapy routine
        </p>
        <Button variant="outline" size="sm" asChild>
          <a href="#" onClick={() => onLogProgress()}>
            Log Progress Manually
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
