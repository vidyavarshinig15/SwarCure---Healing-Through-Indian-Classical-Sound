import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Phone,
  MessageSquare,
  MoreHorizontal,
  Users,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { appointmentsApi } from '@/lib/api';

interface VideoCallProps {
  appointmentId: string;
  doctorName: string;
  doctorImage: string;
  patientName: string;
  patientImage?: string;
  onEndCall?: () => void;
}

export function VideoCall({
  appointmentId,
  doctorName,
  doctorImage,
  patientName,
  patientImage,
  onEndCall
}: VideoCallProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{
    id: string;
    sender: 'doctor' | 'patient';
    text: string;
    time: string;
  }[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const [activeTab, setActiveTab] = useState<'chat' | 'notes'>('chat');
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Simulate connection process
    const connectCall = async () => {
      try {
        // In a real app, this would integrate with a WebRTC library
        // like Twilio Video, Daily.co, or WebRTC APIs directly
        
        // Simulate connection delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Get appointment details
        const appointment = await appointmentsApi.getAppointmentById(appointmentId);
        
        // Access user media (in a real app)
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          // This is simulated for the demo
          if (localVideoRef.current) {
            // In a real app, this would be real camera feed
            // For the demo, we'll just show a placeholder or mock video
            localVideoRef.current.srcObject = null;
            localVideoRef.current.poster = patientImage || '/placeholder.svg';
          }
          
          if (remoteVideoRef.current) {
            // In a real app, this would be the remote peer's video stream
            // For the demo, we'll just show a placeholder
            remoteVideoRef.current.srcObject = null;
            remoteVideoRef.current.poster = doctorImage;
          }
        }
        
        setIsConnected(true);
        
        // Start call timer
        timerRef.current = window.setInterval(() => {
          setCallDuration(prev => prev + 1);
        }, 1000);
        
        // Add a welcome message
        setChatMessages([
          {
            id: '1',
            sender: 'doctor',
            text: `Hello ${patientName}, welcome to our sound therapy consultation session. How are you feeling today?`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
        ]);
        
      } catch (error) {
        console.error('Error connecting to call:', error);
        // Handle connection error
      }
    };
    
    connectCall();
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [appointmentId, doctorImage, doctorName, patientImage, patientName]);
  
  const handleEndCall = async () => {
    try {
      // In a real app, this would properly close the WebRTC connection
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      setIsConnected(false);
      
      // Record call details
      await appointmentsApi.endAppointment(appointmentId, {
        duration: callDuration,
        endedBy: 'patient',
        notes: 'Call ended by patient'
      });
      
      // Notify parent component
      if (onEndCall) {
        onEndCall();
      }
    } catch (error) {
      console.error('Error ending call:', error);
    }
  };
  
  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    
    // In a real app, this would enable/disable the camera track
    if (localVideoRef.current) {
      // Simulate video being turned off
      localVideoRef.current.style.opacity = isVideoEnabled ? '0.2' : '1';
    }
  };
  
  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    // In a real app, this would mute/unmute the audio track
  };
  
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    
    setIsFullscreen(!isFullscreen);
  };
  
  const sendChatMessage = () => {
    if (!messageInput.trim()) return;
    
    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: 'patient' as const,
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    setMessageInput('');
    
    // Simulate doctor response after a delay
    setTimeout(() => {
      const responses = [
        "That's interesting. How does that sound therapy make you feel?",
        "Have you been practicing the exercises I suggested in our last session?",
        "I understand. Let's try a different frequency that might work better for your symptoms.",
        "The progress you're making with sound therapy is encouraging. Let's continue with this approach."
      ];
      
      const doctorResponse = {
        id: `msg-${Date.now()}`,
        sender: 'doctor' as const,
        text: responses[Math.floor(Math.random() * responses.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setChatMessages(prev => [...prev, doctorResponse]);
    }, 3000);
  };
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div 
      className="w-full h-full flex flex-col bg-background rounded-lg overflow-hidden border border-border"
      ref={containerRef}
    >
      {/* Call status bar */}
      <div className="bg-muted py-2 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? "success" : "outline"} className="px-2 py-0">
            {isConnected ? 'Connected' : 'Connecting...'}
          </Badge>
          <span className="text-sm font-medium">
            {formatDuration(callDuration)}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </Button>
        </div>
      </div>
      
      {/* Main call content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video area */}
        <div className="flex-1 relative bg-black">
          {/* Remote video (doctor) */}
          <video
            ref={remoteVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            poster={doctorImage}
          />
          
          {/* Doctor info overlay */}
          <div className="absolute top-4 left-4 flex items-center bg-black/50 px-3 py-1.5 rounded-full">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={doctorImage} alt={doctorName} />
              <AvatarFallback>{doctorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-white text-sm font-medium">{doctorName}</span>
          </div>
          
          {/* Local video (patient) */}
          <div className="absolute bottom-4 right-4 w-36 h-48 bg-muted rounded-lg overflow-hidden border-2 border-background shadow-lg">
            <video
              ref={localVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
              poster={patientImage || '/placeholder.svg'}
            />
            
            {!isVideoEnabled && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <VideoOff size={24} className="text-white/80" />
              </div>
            )}
            
            {!isAudioEnabled && (
              <div className="absolute bottom-2 left-2 bg-red-500 p-1 rounded-full">
                <MicOff size={12} className="text-white" />
              </div>
            )}
          </div>
          
          {/* Call controls */}
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3">
            <Button
              variant={isAudioEnabled ? "outline" : "destructive"}
              size="icon"
              className="h-12 w-12 rounded-full bg-muted/20 backdrop-blur"
              onClick={toggleAudio}
            >
              {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
            </Button>
            
            <Button
              variant="destructive"
              size="icon"
              className="h-14 w-14 rounded-full"
              onClick={handleEndCall}
            >
              <Phone size={24} className="rotate-135" />
            </Button>
            
            <Button
              variant={isVideoEnabled ? "outline" : "destructive"}
              size="icon"
              className="h-12 w-12 rounded-full bg-muted/20 backdrop-blur"
              onClick={toggleVideo}
            >
              {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
            </Button>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="w-80 border-l border-border flex flex-col bg-card">
          <Tabs defaultValue="chat" className="flex flex-col h-full">
            <TabsList className="w-full justify-start rounded-none border-b px-2 pt-2">
              <TabsTrigger 
                value="chat" 
                className="flex-1"
                onClick={() => setActiveTab('chat')}
              >
                <MessageSquare size={16} className="mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger 
                value="notes" 
                className="flex-1"
                onClick={() => setActiveTab('notes')}
              >
                <Users size={16} className="mr-2" />
                Session Notes
              </TabsTrigger>
            </TabsList>
            
            {/* Chat tab */}
            <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === 'patient' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.sender === 'doctor' && (
                        <Avatar className="h-8 w-8 mr-2 mt-1">
                          <AvatarImage src={doctorImage} alt={doctorName} />
                          <AvatarFallback>{doctorName.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div
                        className={`rounded-lg p-3 max-w-[80%] ${
                          message.sender === 'patient'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1 text-right">
                          {message.time}
                        </p>
                      </div>
                      
                      {message.sender === 'patient' && (
                        <Avatar className="h-8 w-8 ml-2 mt-1">
                          <AvatarImage src={patientImage} alt={patientName} />
                          <AvatarFallback>{patientName.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="p-3 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendChatMessage();
                      }
                    }}
                  />
                  <Button onClick={sendChatMessage}>Send</Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Notes tab */}
            <TabsContent value="notes" className="flex-1 p-4 m-0 overflow-auto">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Session Information</h3>
                  <div className="text-sm space-y-1">
                    <p><span className="text-muted-foreground">Date:</span> {new Date().toLocaleDateString()}</p>
                    <p><span className="text-muted-foreground">Time:</span> {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p><span className="text-muted-foreground">Doctor:</span> {doctorName}</p>
                    <p><span className="text-muted-foreground">Patient:</span> {patientName}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">Therapy Plan</h3>
                  <div className="text-sm space-y-2">
                    <p><span className="font-medium">Sound Frequency:</span> Daily 432Hz therapy sessions (15-20 minutes)</p>
                    <p><span className="font-medium">Raga Therapy:</span> Morning Raag Bhairav, Evening Raag Yaman</p>
                    <p><span className="font-medium">Meditation:</span> Guided sound meditation twice daily</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">Progress Notes</h3>
                  <p className="text-sm">Patient reports improved sleep quality and reduced anxiety levels since beginning sound therapy. Continue with current frequency recommendations and add evening Raag Malkauns for deeper relaxation response.</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Next Steps</h3>
                  <ul className="text-sm list-disc pl-5 space-y-1">
                    <li>Schedule follow-up appointment in 2 weeks</li>
                    <li>Increase frequency therapy to 30 minutes daily</li>
                    <li>Monitor changes in sleep patterns with provided journal</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default VideoCall;
