import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Send, 
  Mic, 
  X, 
  ChevronDown, 
  Loader2, 
  Volume2,
  Music,
  Calendar,
  PhoneCall
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { chatbotApi, voiceAssistApi, musicApi } from '@/lib/api';
import { MusicTrack, ChatMessage, VoiceAssistResponse } from '@/lib/api';

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recommendedTracks, setRecommendedTracks] = useState<MusicTrack[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Load conversation history when the component mounts
  useEffect(() => {
    if (isOpen) {
      loadConversation();
    }
  }, [isOpen]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const loadConversation = async () => {
    try {
      const userId = localStorage.getItem('userId') || '1';
      const history = await chatbotApi.getConversation(userId);
      setMessages(history);
    } catch (error) {
      console.error('Error loading conversation:', error);
      // Show a welcome message if we couldn't load the conversation
      setMessages([
        {
          id: 'welcome',
          text: 'Hello! I\'m your SwarCure assistant. How can I help you with sound therapy today?',
          sender: 'bot',
          timestamp: new Date().toISOString(),
        }
      ]);
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsBotTyping(true);
    
    try {
      // Send message to the chatbot API
      const userId = localStorage.getItem('userId') || '1';
      const botResponse = await chatbotApi.sendMessage(userId, userMessage.text);
      
      // Add bot response to chat
      setMessages(prev => [...prev, botResponse]);
      
      // Check if we should recommend music based on the conversation
      if (
        userMessage.text.toLowerCase().includes('music') || 
        userMessage.text.toLowerCase().includes('therapy') || 
        userMessage.text.toLowerCase().includes('stress') ||
        userMessage.text.toLowerCase().includes('anxiety') ||
        userMessage.text.toLowerCase().includes('sleep')
      ) {
        const tracks = await musicApi.getRecommendedTracks(userId);
        setRecommendedTracks(tracks);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        text: 'Sorry, I\'m having trouble responding right now. Please try again later.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsBotTyping(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleVoiceInput = async () => {
    setIsListening(true);
    
    // In a real app, this would use the Web Speech API
    // For now, we'll simulate voice recognition with a timeout
    try {
      setTimeout(async () => {
        // Simulate recognized text
        const voiceTexts = [
          "I'm having trouble sleeping at night",
          "Can you recommend music for stress relief?",
          "I need help with anxiety"
        ];
        const randomText = voiceTexts[Math.floor(Math.random() * voiceTexts.length)];
        
        setInputValue(randomText);
        setIsListening(false);
        
        // Get voice response
        const response = await voiceAssistApi.getVoiceResponse(randomText);
        
        // Process the response
        if (response.action === 'play_music' && response.actionData?.trackId) {
          // In a real app, we would trigger music playback here
          console.log('Playing music:', response.actionData.trackId);
          
          // Simulate audio playback
          if (response.audioUrl) {
            const audio = new Audio(response.audioUrl);
            audio.play().catch(e => console.error('Audio playback error:', e));
          }
        }
      }, 2000);
    } catch (error) {
      console.error('Voice recognition error:', error);
      setIsListening(false);
    }
  };
  
  const playTrack = async (trackId: string) => {
    try {
      await musicApi.playTrack(trackId);
      
      // Add a message about the track being played
      setMessages(prev => [...prev, {
        id: `system-${Date.now()}`,
        text: '▶️ Playing your recommended track. Enjoy your sound therapy session.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
      }]);
      
      // In a real app, this would trigger actual playback
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };
  
  return (
    <>
      {/* Chat Icon (Fixed Position) */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          className={cn(
            "h-14 w-14 rounded-full shadow-lg",
            isOpen ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </Button>
      </div>
      
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 shadow-xl rounded-lg overflow-hidden transition-all">
          <Card className="border-2 border-primary/20">
            <CardHeader className="bg-primary text-white py-3 px-4 flex flex-row items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/logo.png" alt="SwarCure" />
                  <AvatarFallback className="bg-primary-foreground text-primary">SC</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-sm">SwarCure Assistant</h3>
                  <p className="text-xs opacity-90">Sound Therapy Expert</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:text-primary-foreground/90 hover:bg-primary/90"
                onClick={() => setIsOpen(false)}
              >
                <ChevronDown size={18} />
              </Button>
            </CardHeader>
            
            <CardContent className="p-0">
              <ScrollArea className="h-[350px] p-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex mb-4",
                      message.sender === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.sender !== 'user' && (
                      <Avatar className="h-8 w-8 mr-2 mt-1">
                        <AvatarImage src="/logo.png" alt="SwarCure" />
                        <AvatarFallback className="bg-primary text-primary-foreground">SC</AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div
                      className={cn(
                        "rounded-lg p-3 max-w-[75%]",
                        message.sender === 'user'
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    
                    {message.sender === 'user' && (
                      <Avatar className="h-8 w-8 ml-2 mt-1">
                        <AvatarImage src="/avatar.png" alt="You" />
                        <AvatarFallback className="bg-primary-foreground text-primary">U</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                
                {isBotTyping && (
                  <div className="flex justify-start mb-4">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src="/logo.png" alt="SwarCure" />
                      <AvatarFallback className="bg-primary text-primary-foreground">SC</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex items-center space-x-1">
                        <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                        <div className="h-2 w-2 bg-primary rounded-full animate-pulse delay-150"></div>
                        <div className="h-2 w-2 bg-primary rounded-full animate-pulse delay-300"></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {recommendedTracks.length > 0 && (
                  <div className="my-4 p-2 bg-muted/50 rounded-lg border border-border">
                    <h4 className="text-sm font-medium mb-2">Recommended Therapy Tracks</h4>
                    <div className="space-y-2">
                      {recommendedTracks.map(track => (
                        <div 
                          key={track.id}
                          className="flex items-center p-2 bg-background rounded-md hover:bg-muted cursor-pointer"
                          onClick={() => playTrack(track.id)}
                        >
                          <div className="h-10 w-10 mr-2 bg-muted rounded-md overflow-hidden">
                            <img 
                              src={track.coverImage} 
                              alt={track.title} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <h5 className="text-xs font-medium truncate">{track.title}</h5>
                            <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                          </div>
                          <Button size="icon" variant="ghost" className="h-7 w-7">
                            <Music size={14} />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex justify-end">
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => setRecommendedTracks([])}
                      >
                        Hide recommendations
                      </Button>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </ScrollArea>
            </CardContent>
            
            <CardFooter className="p-3 border-t bg-muted/30">
              <div className="flex items-center gap-2 w-full">
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "shrink-0 h-8 w-8", 
                    isListening && "animate-pulse bg-primary/20"
                  )}
                  onClick={handleVoiceInput}
                  disabled={isListening}
                >
                  {isListening ? <Loader2 size={16} className="animate-spin" /> : <Mic size={16} />}
                </Button>
                
                <Input
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                  disabled={isListening}
                />
                
                <Button
                  variant="default"
                  size="icon"
                  className="shrink-0 h-8 w-8"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isListening}
                >
                  <Send size={16} />
                </Button>
              </div>
              
              <div className="flex items-center justify-center w-full mt-2 space-x-2">
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  <Music size={14} className="mr-1" /> Music Therapy
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  <Calendar size={14} className="mr-1" /> Appointment
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  <PhoneCall size={14} className="mr-1" /> Consult Doctor
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}

export default ChatBot;

                size="icon" 
                disabled={!inputValue.trim() || isBotTyping || isListening}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      )}
    </>
  );
}

export default ChatBot;
