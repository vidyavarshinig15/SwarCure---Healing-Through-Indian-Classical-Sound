import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, MapPin, Clock, Users, Phone, Mail, ExternalLink, Calendar, Check as CheckIcon } from 'lucide-react';
import { format } from 'date-fns';

// Workshop interface
interface Workshop {
  id: string;
  title: string;
  description: string;
  date: Date;
  duration: string;
  location: {
    type: 'online' | 'in-person';
    venue?: string;
    address?: string;
    meetingLink?: string;
    platform?: string;
  };
  host: {
    name: string;
    title: string;
    organization: string;
    image: string;
  };
  topics: string[];
  price: string | 'Free';
  category: 'therapeutic' | 'educational' | 'interactive' | 'community';
  capacity: number;
  spotsLeft: number;
  contactPhone: string;
  contactEmail: string;
}

// Sample workshops
const workshops: Workshop[] = [
  {
    id: 'w1',
    title: 'Healing Ragas: Introduction to Sound Therapy',
    description: 'Learn about the healing properties of Indian classical ragas and how they can help with anxiety, stress, and other mental health concerns. This workshop includes live demonstrations and interactive sessions where you can experience the power of sound therapy firsthand.',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
    duration: '2 hours',
    location: {
      type: 'in-person',
      venue: 'SwarCure Wellness Center',
      address: '123 Healing Road, Andheri West, Mumbai, Maharashtra 400053'
    },
    host: {
      name: 'Dr. Anjali Sharma',
      title: 'Music Therapist',
      organization: 'SwarCure Foundation',
      image: 'https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg'
    },
    topics: ['Introduction to Sound Healing', 'Raga Therapy Basics', 'Practical Applications', 'Live Demonstrations'],
    price: '₹1,200',
    category: 'educational',
    capacity: 40,
    spotsLeft: 15,
    contactPhone: '+91 98765 43210',
    contactEmail: 'workshops@swarcure.com'
  },
  {
    id: 'w2',
    title: 'Virtual Sound Bath: Deep Relaxation Session',
    description: 'Join us for a virtual sound bath session using traditional Indian instruments and healing frequencies. Experience deep relaxation and stress relief from the comfort of your home through this guided meditation and sound healing session.',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days from now
    duration: '90 minutes',
    location: {
      type: 'online',
      platform: 'Zoom',
      meetingLink: 'https://zoom.us/j/123456789'
    },
    host: {
      name: 'Priya Nair',
      title: 'Sound Healer',
      organization: 'Harmony Healing',
      image: 'https://img.freepik.com/free-photo/young-beautiful-successful-female-doctor-with-stethoscope-portrait_186202-1506.jpg'
    },
    topics: ['Sound Bath Experience', 'Guided Meditation', 'Breathing Techniques', 'Healing Frequencies'],
    price: '₹800',
    category: 'therapeutic',
    capacity: 100,
    spotsLeft: 42,
    contactPhone: '+91 87654 32109',
    contactEmail: 'priya@swarcure.com'
  },
  {
    id: 'w3',
    title: 'Community Healing Circle: Group Sound Therapy',
    description: 'Experience the power of community healing through group sound therapy sessions. This workshop brings people together to share experiences and support each other while experiencing the healing properties of traditional Indian music.',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), // 14 days from now
    duration: '3 hours',
    location: {
      type: 'in-person',
      venue: 'Community Wellness Center',
      address: '456 Harmony Street, Bandra, Mumbai, Maharashtra 400050'
    },
    host: {
      name: 'Rajesh Patel',
      title: 'Community Therapist',
      organization: 'SwarCure Outreach',
      image: 'https://img.freepik.com/free-photo/portrait-smiling-male-doctor_171337-1532.jpg'
    },
    topics: ['Group Healing', 'Community Support', 'Shared Experiences', 'Sound Therapy Basics'],
    price: '₹500',
    category: 'community',
    capacity: 30,
    spotsLeft: 8,
    contactPhone: '+91 76543 21098',
    contactEmail: 'community@swarcure.com'
  },
  {
    id: 'w4',
    title: 'Fundamentals of Raga Therapy for Self-Practice',
    description: 'Learn how to incorporate raga therapy into your daily routine for ongoing mental wellness. This workshop focuses on practical techniques you can use at home to maintain balance and reduce stress through sound.',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), // 10 days from now
    duration: '2 hours',
    location: {
      type: 'online',
      platform: 'Google Meet',
      meetingLink: 'https://meet.google.com/abc-defg-hij'
    },
    host: {
      name: 'Dr. Sanjay Kumar',
      title: 'Raga Therapist',
      organization: 'Institute of Sound Healing',
      image: 'https://img.freepik.com/free-photo/young-handsome-physician-medical-robe-with-stethoscope_1303-17818.jpg'
    },
    topics: ['Daily Practice Techniques', 'Instrument Selection', 'Time-specific Ragas', 'Self-assessment Methods'],
    price: 'Free',
    category: 'educational',
    capacity: 200,
    spotsLeft: 75,
    contactPhone: '+91 65432 10987',
    contactEmail: 'education@swarcure.com'
  }
];

export default function Workshops() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [bookingWorkshop, setBookingWorkshop] = useState<Workshop | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  // Filter workshops by category
  const filteredWorkshops = activeTab === 'all' 
    ? workshops 
    : workshops.filter(workshop => workshop.category === activeTab);
  
  // Sort workshops by date
  const sortedWorkshops = [...filteredWorkshops].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  const handleBookWorkshop = (workshop: Workshop) => {
    setBookingWorkshop(workshop);
    setSelectedWorkshop(null);
  };
  
  const handleRegistration = () => {
    // In a real app, this would submit to your backend
    console.log({
      workshop: bookingWorkshop,
      name,
      email,
      phone
    });
    
    // Show success state
    setBookingSuccess(true);
    
    // Reset form after a delay
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingWorkshop(null);
      setName('');
      setEmail('');
      setPhone('');
    }, 5000);
  };
  
  const isFormComplete = name && email && phone;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Upcoming Workshops</h2>
          <p className="text-muted-foreground mt-1">
            Join our expert-led workshops to deepen your understanding of sound therapy
          </p>
        </div>
        <Tabs 
          defaultValue="all" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full md:w-auto"
        >
          <TabsList className="grid grid-cols-4 w-full md:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="therapeutic">Therapeutic</TabsTrigger>
            <TabsTrigger value="educational">Educational</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedWorkshops.map((workshop) => (
          <Card key={workshop.id} className="shadow-md h-full flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <Badge variant={
                  workshop.category === 'therapeutic' ? 'default' :
                  workshop.category === 'educational' ? 'secondary' :
                  workshop.category === 'interactive' ? 'outline' :
                  'destructive'
                }>
                  {workshop.category.charAt(0).toUpperCase() + workshop.category.slice(1)}
                </Badge>
                <Badge variant={workshop.price === 'Free' ? 'outline' : 'secondary'} className="ml-2">
                  {workshop.price}
                </Badge>
              </div>
              <CardTitle className="text-lg mt-2">{workshop.title}</CardTitle>
              <CardDescription className="line-clamp-2">{workshop.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-4 flex-1">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{format(workshop.date, 'MMMM d, yyyy')}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{workshop.duration}</span>
                </div>
                
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    {workshop.location.type === 'in-person' ? (
                      <span>{workshop.location.venue}</span>
                    ) : (
                      <span>Online ({workshop.location.platform})</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {workshop.spotsLeft} spot{workshop.spotsLeft !== 1 && 's'} left
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mt-4">
                  <img
                    src={workshop.host.image}
                    alt={workshop.host.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-xs">{workshop.host.name}</p>
                    <p className="text-xs text-muted-foreground">{workshop.host.title}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setSelectedWorkshop(workshop)}
              >
                Details
              </Button>
              <Button 
                className="flex-1"
                onClick={() => handleBookWorkshop(workshop)}
              >
                Register
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Workshop Details Dialog */}
      <Dialog open={!!selectedWorkshop} onOpenChange={() => setSelectedWorkshop(null)}>
        <DialogContent className="max-w-3xl overflow-y-auto max-h-[85vh]">
          {selectedWorkshop && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedWorkshop.title}</DialogTitle>
                <DialogDescription>
                  Hosted by {selectedWorkshop.host.name} • {format(selectedWorkshop.date, 'MMMM d, yyyy')}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                <div className="md:col-span-2">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">About this Workshop</h3>
                      <p className="text-sm text-muted-foreground">{selectedWorkshop.description}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Topics Covered</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedWorkshop.topics.map((topic, index) => (
                          <li key={index} className="text-sm text-muted-foreground">{topic}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-2">Host Information</h3>
                      <div className="flex items-start gap-3">
                        <img
                          src={selectedWorkshop.host.image}
                          alt={selectedWorkshop.host.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium">{selectedWorkshop.host.name}</p>
                          <p className="text-sm text-muted-foreground">{selectedWorkshop.host.title}</p>
                          <p className="text-sm text-muted-foreground">{selectedWorkshop.host.organization}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Event Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Date & Time</p>
                          <p className="text-sm text-muted-foreground">
                            {format(selectedWorkshop.date, 'EEEE, MMMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Duration</p>
                          <p className="text-sm text-muted-foreground">{selectedWorkshop.duration}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Location</p>
                          {selectedWorkshop.location.type === 'in-person' ? (
                            <>
                              <p className="text-sm text-muted-foreground">{selectedWorkshop.location.venue}</p>
                              <p className="text-sm text-muted-foreground">{selectedWorkshop.location.address}</p>
                            </>
                          ) : (
                            <>
                              <p className="text-sm text-muted-foreground">Online via {selectedWorkshop.location.platform}</p>
                              {selectedWorkshop.location.meetingLink && (
                                <a
                                  href={selectedWorkshop.location.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary flex items-center gap-1 mt-1"
                                >
                                  Meeting Link
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Capacity</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedWorkshop.spotsLeft} of {selectedWorkshop.capacity} spots remaining
                          </p>
                        </div>
                      </div>
                      
                      <div className="border-t pt-3 mt-3">
                        <p className="text-sm font-medium mb-2">Contact Information</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{selectedWorkshop.contactPhone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{selectedWorkshop.contactEmail}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full"
                        onClick={() => {
                          setSelectedWorkshop(null);
                          handleBookWorkshop(selectedWorkshop);
                        }}
                      >
                        Register Now • {selectedWorkshop.price}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Registration Dialog */}
      <Dialog open={!!bookingWorkshop} onOpenChange={() => !bookingSuccess && setBookingWorkshop(null)}>
        <DialogContent className="sm:max-w-[500px]">
          {bookingSuccess ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <CheckIcon className="h-8 w-8 text-primary" />
              </div>
              <DialogTitle>Registration Successful!</DialogTitle>
              <DialogDescription className="mt-2 mb-6">
                You've successfully registered for the workshop. A confirmation email has been sent to you.
              </DialogDescription>
              <div className="space-y-2 text-sm mb-6">
                <p className="font-medium">Workshop Details:</p>
                <p>{bookingWorkshop?.title}</p>
                <p>{format(bookingWorkshop?.date || new Date(), 'EEEE, MMMM d, yyyy')}</p>
                <p>
                  {bookingWorkshop?.location.type === 'in-person' 
                    ? bookingWorkshop.location.venue 
                    : `Online via ${bookingWorkshop?.location.platform}`
                  }
                </p>
              </div>
              <Button onClick={() => {
                setBookingSuccess(false);
                setBookingWorkshop(null);
              }}>
                Done
              </Button>
            </div>
          ) : bookingWorkshop && (
            <>
              <DialogHeader>
                <DialogTitle>Register for Workshop</DialogTitle>
                <DialogDescription>
                  Complete the form below to register for '{bookingWorkshop.title}'
                </DialogDescription>
              </DialogHeader>
              
              <div className="border rounded-md p-3 bg-muted/20 my-4">
                <div className="flex items-center gap-2 text-sm mb-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="font-medium">{format(bookingWorkshop.date, 'MMMM d, yyyy')}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {bookingWorkshop.price === 'Free' ? 'Free workshop' : `Registration fee: ${bookingWorkshop.price}`}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {bookingWorkshop.location.type === 'in-person' 
                    ? `Location: ${bookingWorkshop.location.venue}` 
                    : `Online via ${bookingWorkshop.location.platform}`
                  }
                </p>
              </div>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    autoComplete="name"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    autoComplete="email"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    autoComplete="tel"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setBookingWorkshop(null)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleRegistration}
                  disabled={!isFormComplete}
                >
                  Complete Registration
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
