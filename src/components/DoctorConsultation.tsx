import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CheckIcon, MapPin, Phone, Mail, Calendar as CalendarIcon, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Define doctor interface
interface Doctor {
  id: number;
  name: string;
  qualification: string;
  specialization: string;
  experience: string;
  image: string;
  location: string;
  address: string;
  contactPhone: string;
  contactEmail: string;
  bio: string;
  availableDays: string[];
  rating: number;
  consultationFee: string;
}

// Sample doctors data
const doctors: Doctor[] = [
  {
    id: 1,
    name: 'Dr. Anjali Sharma',
    qualification: 'MD (Psychiatry), PhD in Music Therapy',
    specialization: 'Mental Health & Sound Therapy',
    experience: '15+ years',
    image: 'https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg',
    location: 'Mumbai',
    address: '123 Wellness Center, Andheri West, Mumbai, Maharashtra 400053',
    contactPhone: '+91 98765 43210',
    contactEmail: 'dr.anjali@swarcure.com',
    bio: 'Dr. Anjali Sharma is a leading psychiatrist who combines traditional psychiatry with innovative sound and music therapy techniques. She has conducted extensive research on the healing effects of Indian classical ragas on various mental health conditions.',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    rating: 4.9,
    consultationFee: '₹1,500'
  },
  {
    id: 2,
    name: 'Dr. Rajesh Patel',
    qualification: 'MBBS, DPM, Advanced Certification in Sound Healing',
    specialization: 'Anxiety & Depression Management',
    experience: '12+ years',
    image: 'https://img.freepik.com/free-photo/portrait-smiling-male-doctor_171337-1532.jpg',
    location: 'Delhi',
    address: '456 Mind Wellness Clinic, Greater Kailash, New Delhi, 110048',
    contactPhone: '+91 87654 32109',
    contactEmail: 'dr.rajesh@swarcure.com',
    bio: 'Dr. Rajesh Patel specializes in treating anxiety and depression using a combination of conventional therapy and traditional Indian sound healing techniques. He has helped hundreds of patients achieve mental wellness through his integrated approach.',
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
    rating: 4.8,
    consultationFee: '₹1,800'
  },
  {
    id: 3,
    name: 'Dr. Priya Nair',
    qualification: 'MD (Psychology), Certified Music Therapist',
    specialization: 'Stress Management & Sound Therapy',
    experience: '10+ years',
    image: 'https://img.freepik.com/free-photo/young-beautiful-successful-female-doctor-with-stethoscope-portrait_186202-1506.jpg',
    location: 'Bangalore',
    address: '789 Harmony Health Center, Indiranagar, Bangalore, Karnataka 560038',
    contactPhone: '+91 76543 21098',
    contactEmail: 'dr.priya@swarcure.com',
    bio: 'Dr. Priya Nair combines her expertise in psychology with advanced training in music therapy. She focuses on stress-related disorders and insomnia, using specific ragas and frequencies to promote relaxation and healing.',
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Saturday'],
    rating: 4.7,
    consultationFee: '₹1,200'
  }
];

// Available time slots
const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
];

export default function DoctorConsultation() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [date, setDate] = useState<Date>();
  const [timeSlot, setTimeSlot] = useState<string>('');
  const [consultationType, setConsultationType] = useState('online');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [concern, setConcern] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };
  
  const handleStartBooking = (doctor: Doctor) => {
    setBookingDoctor(doctor);
    setSelectedDoctor(null);
  };
  
  const handleBookAppointment = () => {
    // In a real app, you would send this to your backend
    console.log({
      doctor: bookingDoctor,
      date,
      timeSlot,
      consultationType,
      name,
      phone,
      email,
      concern
    });
    
    // For demo purposes, just show success
    setBookingSuccess(true);
    
    // Reset form
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingDoctor(null);
      setDate(undefined);
      setTimeSlot('');
      setConsultationType('online');
      setName('');
      setPhone('');
      setEmail('');
      setConcern('');
    }, 5000);
  };
  
  const isFormComplete = bookingDoctor && date && timeSlot && consultationType && name && phone && email;

  return (
    <div>
      {/* Doctor List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map(doctor => (
          <Card 
            key={doctor.id}
            className={cn(
              "shadow-md transition-all duration-200",
              selectedDoctor?.id === doctor.id ? "ring-2 ring-primary" : ""
            )}
          >
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{doctor.name}</CardTitle>
                  <CardDescription>{doctor.specialization}</CardDescription>
                </div>
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-muted">
                  <img 
                    src={doctor.image} 
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">{doctor.qualification}</Badge>
                <Badge variant="outline" className="text-xs">{doctor.experience}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{doctor.location}</p>
                    <p className="text-xs text-muted-foreground">{doctor.address}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{doctor.contactPhone}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{doctor.contactEmail}</span>
                </div>
                
                <div className="mt-3">
                  <p className="line-clamp-2 text-xs text-muted-foreground">{doctor.bio}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">
                  {doctor.consultationFee}
                </span>
                <span className="text-xs text-muted-foreground">per session</span>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDoctorSelect(doctor)}
                >
                  View Profile
                </Button>
                <Button 
                  size="sm"
                  onClick={() => handleStartBooking(doctor)}
                >
                  Book Now
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Doctor Profile Dialog */}
      <Dialog open={!!selectedDoctor} onOpenChange={() => setSelectedDoctor(null)}>
        <DialogContent className="max-w-3xl overflow-y-auto max-h-[85vh]">
          {selectedDoctor && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedDoctor.name}</DialogTitle>
                <DialogDescription>
                  {selectedDoctor.specialization} • {selectedDoctor.experience} Experience
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                <div className="md:col-span-1">
                  <div className="aspect-square rounded-md overflow-hidden">
                    <img 
                      src={selectedDoctor.image} 
                      alt={selectedDoctor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div>
                      <h3 className="text-sm font-medium">Qualifications</h3>
                      <p className="text-sm text-muted-foreground">{selectedDoctor.qualification}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium">Rating</h3>
                      <div className="flex items-center gap-1">
                        <span className="text-amber-500 text-sm">★★★★★</span>
                        <span className="text-sm">{selectedDoctor.rating}/5</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium">Consultation Fee</h3>
                      <p className="text-sm">{selectedDoctor.consultationFee} per session</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium">Available Days</h3>
                      <p className="text-sm text-muted-foreground">{selectedDoctor.availableDays.join(', ')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium">About</h3>
                      <p className="text-sm text-muted-foreground mt-1">{selectedDoctor.bio}</p>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h3 className="text-sm font-medium mb-2">Contact & Location</h3>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">{selectedDoctor.location}</p>
                            <p className="text-sm text-muted-foreground">{selectedDoctor.address}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{selectedDoctor.contactPhone}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{selectedDoctor.contactEmail}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h3 className="text-sm font-medium mb-2">Specializations</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{selectedDoctor.specialization}</Badge>
                        <Badge variant="outline">Sound Therapy</Badge>
                        <Badge variant="outline">Indian Classical Music</Badge>
                        <Badge variant="outline">Mental Wellness</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedDoctor(null)}
                >
                  Close
                </Button>
                <Button onClick={() => {
                  setSelectedDoctor(null);
                  handleStartBooking(selectedDoctor);
                }}>
                  Book Appointment
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Booking Dialog */}
      <Dialog open={!!bookingDoctor} onOpenChange={() => !bookingSuccess && setBookingDoctor(null)}>
        <DialogContent className="sm:max-w-[500px]">
          {bookingSuccess ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <CheckIcon className="h-8 w-8 text-primary" />
              </div>
              <DialogTitle>Booking Successful!</DialogTitle>
              <DialogDescription className="mt-2 mb-6">
                Your appointment has been successfully booked. An email confirmation has been sent to you.
              </DialogDescription>
              <p className="text-sm mb-6">
                <span className="font-medium">Appointment Details:</span><br />
                {bookingDoctor?.name}<br />
                {date && format(date, 'EEEE, MMMM d, yyyy')}<br />
                {timeSlot}<br />
                {consultationType === 'online' ? 'Online Consultation' : 'In-person Consultation'}
              </p>
              <Button onClick={() => {
                setBookingSuccess(false);
                setBookingDoctor(null);
              }}>
                Done
              </Button>
            </div>
          ) : bookingDoctor && (
            <>
              <DialogHeader>
                <DialogTitle>Book Appointment with {bookingDoctor.name}</DialogTitle>
                <DialogDescription>
                  Fill in your details to book a consultation
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={bookingDoctor.image} 
                    alt={bookingDoctor.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium">{bookingDoctor.name}</h3>
                    <p className="text-sm text-muted-foreground">{bookingDoctor.specialization}</p>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="date">Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => {
                          // Disable past dates and restrict to doctor's available days
                          const day = format(date, 'EEEE');
                          return (
                            date < new Date() || 
                            !bookingDoctor.availableDays.includes(day)
                          );
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="time">Select Time Slot</Label>
                  <Select value={timeSlot} onValueChange={setTimeSlot}>
                    <SelectTrigger id="time">
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label>Consultation Type</Label>
                  <RadioGroup 
                    defaultValue="online" 
                    value={consultationType}
                    onValueChange={setConsultationType}
                    className="flex gap-4"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="online" id="online" />
                      <Label htmlFor="online" className="cursor-pointer">Online</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="in-person" id="in-person" />
                      <Label htmlFor="in-person" className="cursor-pointer">In-person</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="concern">Primary Concern</Label>
                  <Input 
                    id="concern" 
                    value={concern} 
                    onChange={(e) => setConcern(e.target.value)}
                    placeholder="What is your main reason for consultation?"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setBookingDoctor(null)}
                >
                  Cancel
                </Button>
                <Button onClick={handleBookAppointment} disabled={!isFormComplete}>
                  Confirm Booking
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
