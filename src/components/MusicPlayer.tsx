import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Music,
  Heart,
  Clock,
  Repeat
} from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Progress } from './ui/progress';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { MusicTrack } from '@/lib/api';

interface MusicPlayerProps {
  track?: MusicTrack;
  onTrackEnd?: () => void;
}

export function MusicPlayer({ track, onTrackEnd }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [loop, setLoop] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (track?.url) {
      // Reset player state when track changes
      setIsPlaying(false);
      setCurrentTime(0);
      
      // Create new audio element
      if (!audioRef.current) {
        audioRef.current = new Audio();
        setupAudioListeners();
      }
      
      // Update audio source
      audioRef.current.src = track.url;
      audioRef.current.load();
      
      // Auto-play new track after a small delay
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(e => console.error('Unable to auto-play:', e));
          setIsPlaying(true);
        }
      }, 300);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [track]);
  
  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const setupAudioListeners = () => {
    if (!audioRef.current) return;
    
    // Update time display
    audioRef.current.addEventListener('timeupdate', () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    });
    
    // Handle track ending
    audioRef.current.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
      
      if (loop && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.error('Loop play error:', e));
        setIsPlaying(true);
      } else if (onTrackEnd) {
        onTrackEnd();
      }
    });
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !track) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error('Play error:', e));
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const handleSeek = (newValue: number[]) => {
    if (audioRef.current && track) {
      const seekTime = (newValue[0] / 100) * track.duration;
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const toggleLoop = () => {
    setLoop(!loop);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Calculate progress percentage
  const progress = track ? (currentTime / track.duration) * 100 : 0;
  
  if (!track) {
    return (
      <Card className="w-full bg-muted/30 border-accent/20">
        <CardContent className="p-6 flex items-center justify-center">
          <div className="flex flex-col items-center text-muted-foreground">
            <Music size={36} strokeWidth={1} />
            <p className="mt-2">Select a track to play</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full bg-background border-accent/20">
      <CardContent className="p-4 pb-2">
        <div className="flex items-center gap-4">
          {/* Track Image */}
          <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0 bg-muted">
            <img 
              src={track.coverImage} 
              alt={track.title} 
              className="h-full w-full object-cover"
            />
          </div>
          
          {/* Track Info */}
          <div className="flex flex-col flex-grow min-w-0">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-medium text-base truncate mr-2">{track.title}</h3>
              <div className="flex items-center space-x-1">
                {track.frequency && (
                  <Badge variant="outline" className="bg-primary/10 text-xs">
                    {track.frequency} Hz
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs capitalize">
                  {track.category}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
            
            {/* Benefits */}
            <div className="flex flex-wrap gap-1 mt-1">
              {track.benefits.slice(0, 2).map((benefit, i) => (
                <Badge variant="secondary" className="text-xs" key={i}>
                  {benefit}
                </Badge>
              ))}
              {track.benefits.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{track.benefits.length - 2}
                </Badge>
              )}
            </div>
            
            {/* Spotify badge if applicable */}
            {track.source === 'spotify' && (
              <a 
                href={track.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center mt-1 text-xs text-green-500 hover:text-green-600"
              >
                <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,0C5.4,0,0,5.4,0,12s5.4,12,12,12s12-5.4,12-12S18.6,0,12,0z M17.5,17.3c-0.2,0.3-0.6,0.4-0.9,0.2c-2.5-1.5-5.6-1.9-9.3-1c-0.3,0.1-0.7-0.1-0.8-0.5c-0.1-0.3,0.1-0.7,0.5-0.8c4-0.9,7.5-0.5,10.3,1.2C17.6,16.6,17.7,17,17.5,17.3z M18.9,14c-0.3,0.4-0.8,0.5-1.2,0.2c-2.8-1.7-7.1-2.2-10.4-1.2c-0.4,0.1-0.9-0.1-1-0.5c-0.1-0.4,0.1-0.9,0.5-1c3.8-1.1,8.5-0.6,11.7,1.4C19,13.1,19.2,13.6,18.9,14z M19,10.5c-3.4-2-9-2.2-12.2-1.2c-0.5,0.2-1.1-0.1-1.3-0.6c-0.2-0.5,0.1-1.1,0.6-1.3c3.7-1.1,9.9-0.9,13.8,1.4c0.5,0.3,0.6,0.9,0.4,1.4C20,10.6,19.5,10.8,19,10.5z"/>
                </svg>
                Listen on Spotify
              </a>
            )}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4 px-1">
          <Slider
            value={[progress]}
            min={0}
            max={100}
            step={0.1}
            onValueChange={handleSeek}
            className="my-1"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(track.duration)}</span>
          </div>
        </div>
        
        {/* Playback Controls */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </Button>
            <Slider
              value={[volume]}
              min={0}
              max={100}
              step={1}
              onValueChange={(val) => setVolume(val[0])}
              className="w-24 mx-2"
            />
          </div>
          
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
              <SkipBack size={18} />
            </Button>
            
            <Button
              variant="default"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={togglePlayPause}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </Button>
            
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
              <SkipForward size={18} />
            </Button>
          </div>
          
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 ${loop ? 'text-primary' : ''}`}
              onClick={toggleLoop}
            >
              <Repeat size={18} />
            </Button>
            
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Heart size={18} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MusicPlayer;
