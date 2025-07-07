import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Doctor, doctorsApi, appointmentsApi, paymentApi } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  MapPin,
  Phone,
  Mail,
  Star,
  Stethoscope,
  Languages,
  Users,
  CreditCard,
  Check,
  Loader2,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

export default function AppointmentsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [consultationType, setConsultationType] = useState<'online' | 'in-person'>('online');
  const [symptoms, setSymptoms] = useState('');
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [openBooking, setOpenBooking] = useState(false);
  
  const { toast } = useToast();
  
  useEffect(() => {
    loadDoctors();
  }, []);
  
  const loadDoctors = async () => {
    try {
      setLoading(true);
      const data = await doctorsApi.getAllDoctors();
      setDoctors(data);
    } catch (error) {
      console.error('Error loading doctors:', error);
      toast({
        title: 'Error',
        description: 'Failed to load doctors. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };
  
  const handleDateSelect = async (date: Date | null) => {
    setBookingDate(date);
    setSelectedSlot("");
    
    if (date && selectedDoctor) {
      try {
        const formattedDate = format(date, 'yyyy-MM-dd');
        const slots = await doctorsApi.getAvailableSlots(selectedDoctor.id, formattedDate);
        setAvailableSlots(slots);
      } catch (error) {
        console.error('Error loading slots:', error);
        toast({
          title: 'Error',
          description: 'Failed to load available time slots.',
          variant: 'destructive',
        });
      }
    }
  };
  
  const handleBookAppointment = async () => {
    if (!selectedDoctor || !bookingDate || !selectedSlot) {
      toast({
        title: 'Missing information',
        description: 'Please complete all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsProcessingPayment(true);
    
    try {
      // Create appointment
      const appointmentData = {
        doctorId: selectedDoctor.id,
        date: bookingDate.toISOString(),
        timeSlot: selectedSlot,
        type: consultationType,
        symptoms,
      };
      
      const appointment = await appointmentsApi.bookAppointment(appointmentData);
      
      // Process payment
      await paymentApi.processPayment(
        appointment.id,
        selectedDoctor.consultationFee,
        'card' // Default payment method
      );
      
      setShowBookingSuccess(true);
      setOpenBooking(false);
      
      // Clear form
      setBookingDate(null);
      setSelectedSlot("");
      setSymptoms("");
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: 'Booking failed',
        description: 'There was an error processing your appointment.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Doctor Consultations</h1>
          <p className="text-muted-foreground mt-1">
            Book personalized sound therapy sessions with our experienced specialists
          </p>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showBookingSuccess} onOpenChange={setShowBookingSuccess}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex flex-col items-center justify-center text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-xl">Appointment Confirmed!</DialogTitle>
            <DialogDescription className="mt-2 mb-6">
              Your appointment has been successfully booked.
            </DialogDescription>
            
            {selectedDoctor && bookingDate && selectedSlot && (
              <div className="text-sm space-y-2 mb-6 text-left w-full bg-muted/50 p-4 rounded-lg">
                <p><span className="font-medium">Doctor:</span> {selectedDoctor.name}</p>
                <p>
                  <span className="font-medium">Date & Time:</span> {format(bookingDate, 'MMMM d, yyyy')} at {selectedSlot}
                </p>
                <p>
                  <span className="font-medium">Type:</span> {consultationType === 'online' ? 'Online Consultation' : 'In-person Visit'}
                </p>
              </div>
            )}
            
            <Button onClick={() => setShowBookingSuccess(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Doctors List */}
        <div className="md:col-span-2">
          <h2 className="text-lg font-medium mb-4">Our Sound Therapy Specialists</h2>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-full bg-slate-200"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-slate-200 rounded w-1/4 mb-2"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {doctors.map((doctor) => (
                <Card key={doctor.id} className="overflow-hidden border-accent/20">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-muted/30"
                      />
                      
                      <div className="flex-1 space-y-4">
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">{doctor.name}</h3>
                            <Badge variant="outline" className="bg-primary/10 text-primary">
                              ₹{doctor.consultationFee} per session
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">{doctor.specialization}</p>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {Array(5).fill(0).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${
                                i < Math.floor(doctor.rating) 
                                  ? 'text-yellow-400 fill-yellow-400' 
                                  : 'text-muted-foreground/30'
                              }`} 
                            />
                          ))}
                          <span className="text-sm ml-1">
                            {doctor.rating} ({doctor.ratingCount} reviews)
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Stethoscope className="w-4 h-4" />
                            <span>{doctor.experience} years experience</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Languages className="w-4 h-4" />
                            <span>{doctor.languages.join(', ')}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>Available: {doctor.availableDays.join(', ')}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            <span>{doctor.ratingCount}+ consultations</span>
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <Button 
                            className="w-full sm:w-auto"
                            onClick={() => {
                              handleDoctorSelect(doctor);
                              setOpenBooking(true);
                            }}
                          >
                            Book Consultation
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="md:col-span-1">
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle>Why Consult Our Specialists?</CardTitle>
              <CardDescription>Personalized sound therapy recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2">
                <div className="mt-1 bg-primary/10 p-1.5 rounded-full">
                  <Stethoscope className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Expert Guidance</h4>
                  <p className="text-sm text-muted-foreground">
                    Get personalized sound therapy routines designed for your specific needs
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="mt-1 bg-primary/10 p-1.5 rounded-full">
                  <Video className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Online Consultations</h4>
                  <p className="text-sm text-muted-foreground">
                    Connect with specialists from the comfort of your home
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="mt-1 bg-primary/10 p-1.5 rounded-full">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Regular Follow-ups</h4>
                  <p className="text-sm text-muted-foreground">
                    Track your progress and adjust your therapy as needed
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="mt-1 bg-primary/10 p-1.5 rounded-full">
                  <CreditCard className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Secure Payments</h4>
                  <p className="text-sm text-muted-foreground">
                    Simple and secure payment options for your consultations
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Card className="border-accent/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-sm">+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-sm">support@swarcure.com</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Booking Dialog */}
      <Dialog open={openBooking} onOpenChange={setOpenBooking}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Book Consultation with {selectedDoctor?.name}</DialogTitle>
            <DialogDescription>
              Fill in the details below to schedule your appointment
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="text-right">
                  Select Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal mt-1.5"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {bookingDate ? format(bookingDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={bookingDate}
                      onSelect={handleDateSelect}
                      initialFocus
                      disabled={(date) => 
                        date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                        !selectedDoctor?.availableDays.includes(
                          format(date, 'EEEE')
                        )
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label htmlFor="time">Select Time</Label>
                <Select 
                  value={selectedSlot} 
                  onValueChange={setSelectedSlot}
                  disabled={!bookingDate || availableSlots.length === 0}
                >
                  <SelectTrigger className="w-full mt-1.5">
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {availableSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label>Consultation Type</Label>
              <RadioGroup 
                value={consultationType} 
                onValueChange={(value) => setConsultationType(value as 'online' | 'in-person')}
                className="flex space-x-4 mt-1.5"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online" className="cursor-pointer flex items-center">
                    <Video className="w-4 h-4 mr-1.5" />
                    Online
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="in-person" id="in-person" />
                  <Label htmlFor="in-person" className="cursor-pointer flex items-center">
                    <MapPin className="w-4 h-4 mr-1.5" />
                    In-person
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label htmlFor="symptoms">Symptoms & Concerns</Label>
              <Textarea
                id="symptoms"
                placeholder="Please describe your symptoms or concerns..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="mt-1.5"
                rows={4}
              />
            </div>
            
            <Separator />
            
            {selectedDoctor && (
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="font-medium mb-1">Appointment Summary</p>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p>Doctor: {selectedDoctor.name}</p>
                  <p>Consultation Fee: ₹{selectedDoctor.consultationFee}</p>
                  {bookingDate && (
                    <p>Date: {format(bookingDate, 'PPP')}</p>
                  )}
                  {selectedSlot && (
                    <p>Time: {selectedSlot}</p>
                  )}
                  <p>Type: {consultationType === 'online' ? 'Online Consultation' : 'In-person Visit'}</p>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setOpenBooking(false)}
              disabled={isProcessingPayment}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBookAppointment}
              disabled={
                !selectedDoctor || 
                !bookingDate || 
                !selectedSlot || 
                isProcessingPayment
              }
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                'Confirm & Pay'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
