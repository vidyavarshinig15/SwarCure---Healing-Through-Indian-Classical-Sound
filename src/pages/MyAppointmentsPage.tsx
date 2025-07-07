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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Appointment, appointmentsApi, doctorsApi, prescriptionsApi } from '@/lib/api';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  AlertCircle,
  FileText,
  X,
  ExternalLink,
  User,
  Loader2
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [doctorDetails, setDoctorDetails] = useState<Record<string, any>>({});
  
  const { toast } = useToast();
  
  useEffect(() => {
    loadAppointments();
  }, []);
  
  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentsApi.getUserAppointments();
      setAppointments(data);
      
      // Fetch doctor details for each appointment
      const doctorIds = [...new Set(data.map(app => app.doctorId))];
      const doctorDetailsObj: Record<string, any> = {};
      
      for (const id of doctorIds) {
        try {
          const doctor = await doctorsApi.getDoctorById(id);
          doctorDetailsObj[id] = doctor;
        } catch (error) {
          console.error(`Failed to load doctor details for ID: ${id}`, error);
        }
      }
      
      setDoctorDetails(doctorDetailsObj);
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your appointments. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;
    
    setIsCancelling(true);
    
    try {
      await appointmentsApi.cancelAppointment(selectedAppointment.id);
      
      // Update local state
      setAppointments(appointments.map(app => 
        app.id === selectedAppointment.id ? { ...app, status: 'cancelled' } : app
      ));
      
      toast({
        title: 'Appointment cancelled',
        description: 'Your appointment has been successfully cancelled.',
      });
      
      setConfirmCancel(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel your appointment. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsCancelling(false);
    }
  };
  
  const filteredAppointments = appointments.filter(app => {
    const appointmentDate = new Date(app.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (activeTab === 'upcoming') {
      return appointmentDate >= today && app.status === 'scheduled';
    } else if (activeTab === 'past') {
      return appointmentDate < today || app.status === 'completed';
    } else { // cancelled
      return app.status === 'cancelled';
    }
  });

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Appointments</h1>
          <p className="text-muted-foreground mt-1">
            Manage your sound therapy consultations
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 max-w-md">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-slate-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/4 mb-2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredAppointments.length === 0 ? (
        <Card className="border-accent/20">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center">
            <Calendar className="h-12 w-12 text-muted-foreground/60 mb-3" />
            <h3 className="text-lg font-medium">No appointments found</h3>
            <p className="text-muted-foreground mt-1">
              {activeTab === 'upcoming' 
                ? "You don't have any upcoming appointments" 
                : activeTab === 'past'
                  ? "You don't have any past appointments"
                  : "You don't have any cancelled appointments"}
            </p>
            {activeTab === 'upcoming' && (
              <Button className="mt-4" variant="outline" onClick={() => window.location.href = '/doctors'}>
                Book a Consultation
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => {
            const doctor = doctorDetails[appointment.doctorId];
            const appointmentDate = new Date(appointment.date);
            
            return (
              <Card key={appointment.id} className="border-accent/20">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4 md:items-center">
                    {doctor && (
                      <div className="shrink-0">
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-muted"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 space-y-2">
                      <div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                          <h3 className="text-lg font-medium">
                            {doctor ? doctor.name : 'Doctor'}
                          </h3>
                          <Badge 
                            className={`self-start md:self-auto ${
                              appointment.status === 'scheduled' 
                                ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                                : appointment.status === 'completed' 
                                ? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                                : 'bg-red-100 text-red-800 hover:bg-red-100'
                            }`}
                          >
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </Badge>
                        </div>
                        
                        {doctor && (
                          <p className="text-sm text-muted-foreground">
                            {doctor.specialization}
                          </p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{format(appointmentDate, 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{appointment.timeSlot}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {appointment.type === 'online' ? (
                            <Video className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span>{appointment.type === 'online' ? 'Online Consultation' : 'In-person Visit'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {appointment.symptoms?.length > 30
                              ? `${appointment.symptoms.substring(0, 30)}...`
                              : appointment.symptoms || 'No symptoms specified'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-row md:flex-col gap-2 mt-2 md:mt-0 justify-end">
                      {appointment.status === 'scheduled' && (
                        <>
                          {appointment.type === 'online' && appointment.meetingLink && (
                            <Button variant="default" size="sm" className="md:w-full" asChild>
                              <a 
                                href={appointment.meetingLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center"
                              >
                                <Video className="h-4 w-4 mr-2" />
                                Join
                              </a>
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="md:w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setConfirmCancel(true);
                            }}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </>
                      )}
                      
                      {appointment.status === 'completed' && (
                        <Button variant="outline" size="sm" className="md:w-full" onClick={() => {
                          setSelectedAppointment(appointment);
                        }}>
                          <FileText className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      
      {/* Cancel Confirmation Dialog */}
      <Dialog open={confirmCancel} onOpenChange={setConfirmCancel}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="py-4">
              <div className="space-y-2 text-sm bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>
                    <span className="font-medium">Doctor:</span> {
                      doctorDetails[selectedAppointment.doctorId]?.name || 'Doctor'
                    }
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    <span className="font-medium">Date:</span> {
                      format(new Date(selectedAppointment.date), 'MMMM d, yyyy')
                    }
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    <span className="font-medium">Time:</span> {selectedAppointment.timeSlot}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 flex items-start gap-2 text-sm text-amber-600">
                <AlertCircle className="h-4 w-4 mt-0.5" />
                <p>
                  Cancellations made less than 24 hours before the appointment may incur a cancellation fee as per our policy.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmCancel(false)} disabled={isCancelling}>
              Keep Appointment
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancelAppointment}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Cancel Appointment'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Appointment Details Dialog */}
      <Dialog open={!!selectedAppointment && !confirmCancel} onOpenChange={(open) => !open && setSelectedAppointment(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              Summary of your consultation
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="py-4">
              <div className="flex items-center gap-4 mb-6">
                {doctorDetails[selectedAppointment.doctorId] && (
                  <img
                    src={doctorDetails[selectedAppointment.doctorId].image}
                    alt={doctorDetails[selectedAppointment.doctorId].name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-muted"
                  />
                )}
                <div>
                  <h3 className="font-medium">
                    {doctorDetails[selectedAppointment.doctorId]?.name || 'Doctor'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {doctorDetails[selectedAppointment.doctorId]?.specialization || 'Specialist'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium">Date & Time</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(selectedAppointment.date), 'MMMM d, yyyy')} at {selectedAppointment.timeSlot}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Consultation Type</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedAppointment.type === 'online' ? 'Online Consultation' : 'In-person Visit'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Status</h4>
                    <p className="text-sm">
                      <Badge 
                        className={`mt-1 ${
                          selectedAppointment.status === 'scheduled' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                            : selectedAppointment.status === 'completed' 
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                            : 'bg-red-100 text-red-800 hover:bg-red-100'
                        }`}
                      >
                        {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Payment Status</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedAppointment.paymentStatus.charAt(0).toUpperCase() + selectedAppointment.paymentStatus.slice(1)}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Symptoms & Concerns</h4>
                  <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                    {selectedAppointment.symptoms || 'No symptoms were specified for this appointment.'}
                  </p>
                </div>
                
                {selectedAppointment.notes && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Doctor's Notes</h4>
                    <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                      {selectedAppointment.notes}
                    </p>
                  </div>
                )}
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-3">Actions</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" size="sm" asChild>
                      <a href="/prescriptions">
                        <FileText className="h-4 w-4 mr-2" />
                        View Prescriptions
                      </a>
                    </Button>
                    
                    {selectedAppointment.type === 'online' && selectedAppointment.meetingLink && (
                      <Button size="sm" asChild>
                        <a 
                          href={selectedAppointment.meetingLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Join Meeting
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
