import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff,
  Volume2,
  X,
  Settings,
  Headphones,
  Waveform
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from './ui/dialog';
import { voiceAssistApi } from '@/lib/api';
import { useToast } from './ui/use-toast';
import { cn } from '@/lib/utils';

interface VoiceAssistantProps {
  position?: 'bottom-left' | 'bottom-right';
  className?: string;
}

export function VoiceAssistant({ 
  position = 'bottom-left',
  className
}: VoiceAssistantProps) {
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isEnabled, setIsEnabled] = useState(true);
  const [autoClose, setAutoClose] = useState(true);
  
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Create audio element for responses
  useEffect(() => {
    audioRef.current = new Audio();
    
    // Get user preference for voice assist
    const enabled = localStorage.getItem('voiceAssistEnabled');
    if (enabled !== null) {
      setIsEnabled(enabled === 'true');
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Update audio volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);
  
  // Save settings when they change
  useEffect(() => {
    localStorage.setItem('voiceAssistEnabled', isEnabled.toString());
  }, [isEnabled]);
  
  // Auto-close after response
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    
    if (response && autoClose) {
      timeout = setTimeout(() => {
        setIsActive(false);
        setTranscript('');
        setResponse('');
      }, 5000); // Close 5 seconds after response
    }
    
    return () => clearTimeout(timeout);
  }, [response, autoClose]);
  
  const handleVoiceInput = async () => {
    if (!isEnabled) return;
    
    setIsListening(true);
    setTranscript('');
    setResponse('');
    
    try {
      // In a real implementation, this would use the Web Speech API
      // For demo purposes, we'll simulate voice recognition with a timeout
      setTimeout(async () => {
        const queries = [
          "Play some relaxing music",
          "I need help with anxiety",
          "Book an appointment with a doctor",
          "What frequencies help with sleep?",
          "Tell me about sound therapy"
        ];
        const recognizedText = queries[Math.floor(Math.random() * queries.length)];
        
        setTranscript(recognizedText);
        setIsListening(false);
        
        // Process the voice command
        await processVoiceCommand(recognizedText);
      }, 2000);
      
      // In a real app, this would use the Web Speech API:
      /*
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error("Speech recognition not supported in this browser");
      }
      
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onresult = (event) => {
        const recognizedText = event.results[0][0].transcript;
        setTranscript(recognizedText);
        processVoiceCommand(recognizedText);
      };
      
      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        setResponse("Sorry, I couldn't understand that. Please try again.");
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
      */
      
    } catch (error) {
      console.error('Voice recognition error:', error);
      setIsListening(false);
      setResponse("Sorry, I couldn't access your microphone. Please check your permissions.");
      toast({
        title: "Microphone Error",
        description: "Could not access your microphone. Please check your browser permissions.",
        variant: "destructive"
      });
    }
  };
  
  const processVoiceCommand = async (text: string) => {
    try {
      // Call the voice assistant API
      const voiceResponse = await voiceAssistApi.getVoiceResponse(text);
      
      // Display the text response
      setResponse(voiceResponse.text);
      
      // Play audio if available
      if (voiceResponse.audioUrl && audioRef.current) {
        audioRef.current.src = voiceResponse.audioUrl;
        audioRef.current.play().catch(e => console.error('Audio playback error:', e));
      }
      
      // Handle any actions based on the response
      handleVoiceAction(voiceResponse.action, voiceResponse.actionData);
      
    } catch (error) {
      console.error('Error processing voice command:', error);
      setResponse("Sorry, I'm having trouble right now. Please try again later.");
    }
  };
  
  const handleVoiceAction = (action?: string, actionData?: any) => {
    if (!action) return;
    
    // Navigate or perform actions based on the command
    switch (action) {
      case 'navigate':
        if (actionData?.path) {
          toast({
            title: "Navigating",
            description: `Going to ${actionData.path}...`
          });
          // In a real app: window.location.href = actionData.path;
        }
        break;
        
      case 'play_music':
        if (actionData?.trackId) {
          toast({
            title: "Playing Music",
            description: "Starting your requested sound therapy track."
          });
          // In real app: integrate with music player component
        }
        break;
        
      case 'schedule_appointment':
        toast({
          title: "Scheduling Appointment",
          description: "Opening appointment scheduler..."
        });
        // In real app: navigate('/doctors/appointments')
        break;
        
      case 'search':
        if (actionData?.query) {
          toast({
            title: "Searching",
            description: `Searching for "${actionData.query}"`
          });
          // In real app: set search query and navigate to search page
        }
        break;
    }
  };
  
  const toggleActive = () => {
    if (!isEnabled) {
      toast({
        title: "Voice Assistant Disabled",
        description: "Voice assistance is currently disabled in settings."
      });
      return;
    }
    
    setIsActive(!isActive);
    
    if (!isActive) {
      // Reset state when opening
      setTranscript('');
      setResponse('');
    }
  };
  
  const positionClass = position === 'bottom-left' 
    ? 'left-6 bottom-6' 
    : 'right-24 bottom-6'; // Positioned to not overlap with chatbot
  
  return (
    <>
      {/* Voice Assistant Button */}
      <div className={cn("fixed z-40", positionClass, className)}>
        <Button
          className={cn(
            "h-14 w-14 rounded-full shadow-lg",
            isActive ? "bg-secondary hover:bg-secondary/90" : "bg-primary hover:bg-primary/90"
          )}
          onClick={toggleActive}
        >
          {isActive ? (
            <X size={24} />
          ) : (
            <Volume2 size={24} />
          )}
        </Button>
      </div>
      
      {/* Voice Assistant Panel */}
      {isActive && (
        <div className={cn(
          "fixed z-30 w-72 sm:w-80 shadow-xl rounded-lg overflow-hidden transition-all transform",
          position === 'bottom-left' ? 'left-6 bottom-24' : 'right-24 bottom-24'
        )}>
          <Card className="border-2 border-secondary/20">
            <CardContent className="p-0">
              {/* Header */}
              <div className="bg-secondary text-secondary-foreground py-3 px-4 flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Headphones className="h-5 w-5" />
                  <div>
                    <h3 className="font-semibold text-sm">Voice Assistant</h3>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-secondary-foreground hover:text-secondary-foreground/90 hover:bg-secondary/90 h-8 w-8"
                  onClick={() => setShowSettings(true)}
                >
                  <Settings size={16} />
                </Button>
              </div>
              
              {/* Voice Assistant Content */}
              <div className="py-6 px-4 flex flex-col items-center">
                {/* Voice Button */}
                <Button 
                  className={cn(
                    "h-20 w-20 rounded-full mb-4 relative",
                    isListening ? "bg-red-500 hover:bg-red-600" : "bg-secondary hover:bg-secondary/90"
                  )}
                  onClick={handleVoiceInput}
                  disabled={isListening}
                >
                  {isListening ? (
                    <>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <Waveform className="h-8 w-8" />
                    </>
                  ) : (
                    <Mic className="h-8 w-8" />
                  )}
                </Button>
                
                {/* Status Text */}
                <div className="text-center mb-4">
                  {isListening ? (
                    <p className="font-medium text-secondary animate-pulse">Listening...</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {transcript || response ? '' : 'Tap to speak'}
                    </p>
                  )}
                </div>
                
                {/* Transcript */}
                {transcript && (
                  <div className="bg-muted w-full rounded-md p-3 mb-3">
                    <p className="text-sm italic">"{transcript}"</p>
                  </div>
                )}
                
                {/* Response */}
                {response && (
                  <div className="bg-secondary/10 border border-secondary/20 w-full rounded-md p-3">
                    <p className="text-sm">{response}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Voice Assistant Settings</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="voice-enabled" className="flex flex-col">
                <span>Enable Voice Assistant</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Turn voice assistance on or off
                </span>
              </Label>
              <Switch 
                id="voice-enabled" 
                checked={isEnabled} 
                onCheckedChange={setIsEnabled} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-close" className="flex flex-col">
                <span>Auto-close After Response</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Automatically close the assistant after responding
                </span>
              </Label>
              <Switch 
                id="auto-close" 
                checked={autoClose} 
                onCheckedChange={setAutoClose} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Response Volume</Label>
                <span className="text-sm text-muted-foreground">{volume}%</span>
              </div>
              <Slider
                value={[volume]}
                min={0}
                max={100}
                step={5}
                onValueChange={value => setVolume(value[0])}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default VoiceAssistant;
