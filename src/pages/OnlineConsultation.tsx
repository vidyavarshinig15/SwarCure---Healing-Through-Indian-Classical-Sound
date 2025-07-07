import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { appointmentsApi, doctorsApi } from '@/lib/api';
import { Loader2, Clock, Calendar, AlertCircle } from 'lucide-react';
import VideoCall from '@/components/VideoCall';

export default function OnlineConsultation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appointment, setAppointment] = useState<any | null>(null);
  const [doctor, setDoctor] = useState<any | null>(null);
  const [joining, setJoining] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  
  // Get appointment ID from URL
  const appointmentId = searchParams.get('id');
  const userName = localStorage.getItem('userName') || 'Patient';
  
  useEffect(() => {
    if (!appointmentId) {
      setError('No appointment ID provided');
      setLoading(false);
      return;
    }
    
    async function loadAppointment() {
      try {
        setLoading(true);
        
        // Load appointment details
        const appointmentData = await appointmentsApi.getAppointmentById(appointmentId);
        setAppointment(appointmentData);
        
        // Load doctor details
        const doctorData = await doctorsApi.getDoctorById(appointmentData.doctorId);
        setDoctor(doctorData);
        
      } catch (error) {
        console.error('Error loading appointment:', error);
        setError('Failed to load appointment details');
        toast({
          title: 'Error',
          description: 'Could not load appointment details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadAppointment();
  }, [appointmentId, toast]);
  
  const handleJoinCall = () => {
    setJoining(true);
    
    // Simulate joining delay
    setTimeout(() => {
      setInCall(true);
      setJoining(false);
    }, 2000);
  };
  
  const handleEndCall = () => {
    setInCall(false);
    setCallEnded(true);
    setShowFeedbackDialog(true);
  };
  
  const handleSubmitFeedback = async () => {
    try {
      // Submit feedback
      await appointmentsApi.submitFeedback(appointmentId, {
        rating,
        feedback,
      });
      
      toast({
        title: 'Thank you!',
        description: 'Your feedback has been submitted.',
      });
      
      // Close dialog and redirect
      setShowFeedbackDialog(false);
      navigate('/appointments');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit feedback',
        variant: 'destructive',
      });
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-3xl">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg text-muted-foreground">Loading your consultation...</p>
        </div>
      </div>
    );
  }
  
  if (error || !appointment || !doctor) {
    return (
      <div className="container mx-auto p-6 max-w-3xl">
        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center">
              <AlertCircle className="mr-2 h-5 w-5 text-destructive" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p>{error || 'Something went wrong'}</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate('/appointments')}>
              Back to Appointments
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (inCall) {
    return (
      <div className="container mx-auto p-6 max-w-6xl h-[85vh]">
        <VideoCall
          appointmentId={appointmentId!}
          doctorName={doctor.name}
          doctorImage={doctor.profileImage}
          patientName={userName}
          onEndCall={handleEndCall}
        />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Online Consultation</h1>
      
      <Card className="border-accent/20">
        <CardHeader>
          <CardTitle>Appointment with {doctor.name}</CardTitle>
          <CardDescription>
            {new Date(appointment.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
            {' '}at {appointment.time}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <img
              src={doctor.profileImage}
              alt={doctor.name}
              className="rounded-lg w-24 h-24 object-cover"
            />
            
            <div>
              <h3 className="font-medium text-lg">{doctor.name}</h3>
              <p className="text-muted-foreground">{doctor.specialization}</p>
              
              <div className="mt-3 space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-primary" />
                  {new Date(appointment.date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-2 text-primary" />
                  {appointment.time}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Consultation Details</h4>
            <p className="text-sm">
              {appointment.symptoms || 'No symptoms provided'}
            </p>
          </div>
          
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
            <h4 className="font-medium mb-2 text-primary">Instructions</h4>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Ensure you have a stable internet connection</li>
              <li>Find a quiet, private space for your session</li>
              <li>Test your microphone and camera before joining</li>
              <li>Have your last therapy recordings available if needed</li>
            </ul>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end">
          {callEnded ? (
            <Button variant="outline" onClick={() => navigate('/appointments')}>
              Back to Appointments
            </Button>
          ) : (
            <Button 
              onClick={handleJoinCall} 
              disabled={joining}
              className="w-full sm:w-auto"
            >
              {joining ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Joining...
                </>
              ) : (
                'Join Consultation'
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>How was your consultation?</DialogTitle>
            <DialogDescription>
              Please rate your experience with Dr. {doctor.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex justify-center space-x-1 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`text-2xl ${
                    rating >= star ? 'text-yellow-400' : 'text-muted'
                  }`}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>
            
            <textarea
              className="w-full min-h-[100px] p-2 border rounded-md"
              placeholder="Share your experience with the consultation..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            ></textarea>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => navigate('/appointments')}>
              Skip
            </Button>
            <Button onClick={handleSubmitFeedback} disabled={rating === 0}>
              Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
