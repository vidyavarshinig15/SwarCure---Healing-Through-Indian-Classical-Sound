import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Stepper, 
  Step, 
  StepLabel,
  Button, 
  CircularProgress,
  Alert,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  MenuItem,
  FormLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  Divider
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { 
  doctorsApi, 
  appointmentsApi, 
  paymentApi, 
  ekaCareApi, 
  authApi 
} from '../lib/api';
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';

const BookAppointmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const useEkaCare = searchParams.get('useEkaCare') === 'true';
  
  // Step tracker
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Select Doctor', 'Choose Date & Time', 'Appointment Details', 'Payment'];
  
  // Data states
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(addDays(new Date(), 1));
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [appointmentType, setAppointmentType] = useState<'online' | 'in-person'>('online');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: ''
  });
  
  // EkaCare integration
  const [isEkaUser, setIsEkaUser] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [useEkaCarePayment, setUseEkaCarePayment] = useState(useEkaCare);
  const [showEkaCareDialog, setShowEkaCareDialog] = useState(false);
  
  useEffect(() => {
    loadDoctors();
    checkEkaCareIntegration();
  }, []);
  
  const checkEkaCareIntegration = async () => {
    try {
      const userData = await authApi.getCurrentUser();
      setUserInfo(userData);
      setIsEkaUser(!!userData.ekaConnected && !!userData.ekaCareId);
      
      if (useEkaCare && !userData.ekaConnected) {
        setShowEkaCareDialog(true);
      }
    } catch (error) {
      console.error("Error checking ekaCare integration:", error);
    }
  };
  
  const loadDoctors = async () => {
    setLoading(true);
    try {
      const doctorsList = await doctorsApi.getAllDoctors();
      setDoctors(doctorsList);
      setLoading(false);
    } catch (error) {
      console.error("Error loading doctors:", error);
      setError('Failed to load doctors. Please try again.');
      setLoading(false);
    }
  };
  
  const handleDoctorSelect = (doctor: any) => {
    setSelectedDoctor(doctor);
    setActiveStep(1);
    loadAvailableSlots();
  };
  
  const loadAvailableSlots = async () => {
    if (!selectedDoctor || !selectedDate) return;
    
    setLoading(true);
    try {
      const slots = await doctorsApi.getAvailableSlots(
        selectedDoctor.id, 
        selectedDate
      );
      setAvailableSlots(slots);
      setSelectedSlot(''); // Reset selected slot
      setLoading(false);
    } catch (error) {
      console.error("Error loading available slots:", error);
      setError('Failed to load available time slots. Please try again.');
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedDate]);
  
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setSelectedSlot('');
  };
  
  const handleNext = () => {
    if (activeStep === 1 && !selectedSlot) {
      setError('Please select a time slot');
      return;
    }
    
    if (activeStep === steps.length - 1) {
      handleBookAppointment();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setError('');
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setError('');
  };
  
  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedSlot) {
      setError('Missing required appointment information');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Convert date to string format
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      
      // Prepare appointment data
      const appointmentData = {
        doctorId: selectedDoctor.id,
        date: dateString,
        time: selectedSlot,
        type: appointmentType,
        symptoms: symptoms
      };
      
      let appointment;
      
      // Book with ekaCare if integrated and selected
      if (isEkaUser && useEkaCarePayment) {
        try {
          // Get current user to verify ekaCare connection
          const currentUser = await authApi.getCurrentUser();
          
          if (!currentUser.ekaConnected || !currentUser.ekaCareId) {
            throw new Error('EkaCare account not connected. Please connect your account first.');
          }
          
          // Book appointment through ekaCare
          appointment = await ekaCareApi.bookEkaCareAppointment({
            doctorId: selectedDoctor.id,
            patientId: currentUser.ekaCareId,
            date: dateString,
            time: selectedSlot,
            type: appointmentType,
            symptoms: symptoms
          });
          
          // Handle ekaCare payment flow - this will be handled by ekaCare
          // No need to process payment separately as it's managed by ekaCare
          
        } catch (ekaCareError) {
          console.error("EkaCare booking error:", ekaCareError);
          throw new Error(`EkaCare appointment booking failed: ${ekaCareError.message}`);
        }
      } else {
        // Regular appointment booking
        appointment = await appointmentsApi.bookAppointment(appointmentData);
        
        // Create and process payment
        const payment = await paymentApi.createPayment(
          appointment.id, 
          selectedDoctor.consultationFee
        );
        
        await paymentApi.processPayment(payment.id, cardDetails);
      }
      
      // Show success and redirect
      setSuccess(true);
      setTimeout(() => {
        navigate('/appointments');
      }, 2000);
    } catch (error) {
      console.error("Error booking appointment:", error);
      setError('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Render functions for each step
  const renderDoctorSelection = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select a Doctor
      </Typography>
      
      {doctors.length > 0 ? (
        <Grid container spacing={3}>
          {doctors.map((doctor) => (
            <Grid item xs={12} md={6} key={doctor.id}>
              <Paper
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { sm: 'center' },
                  cursor: 'pointer',
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }
                }}
                onClick={() => handleDoctorSelect(doctor)}
              >
                <Box
                  sx={{
                    width: { xs: '100%', sm: 100 },
                    height: { xs: 120, sm: 100 },
                    position: 'relative',
                    mb: { xs: 2, sm: 0 },
                    mr: { sm: 3 },
                    borderRadius: '50%',
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    component="img"
                    src={doctor.profileImage}
                    alt={doctor.name}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '50%'
                    }}
                  />
                </Box>
                
                <Box flex="1">
                  <Typography variant="h6">{doctor.name}</Typography>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    {doctor.specialization}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {doctor.experience} years experience • {doctor.languages.join(', ')}
                  </Typography>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle1" fontWeight="bold">
                      ₹{doctor.consultationFee}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDoctorSelect(doctor);
                      }}
                    >
                      Book Appointment
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box textAlign="center" p={4}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Typography>No doctors available at the moment.</Typography>
          )}
        </Box>
      )}
    </Box>
  );
  
  const renderDateTimeSelection = () => (
    <Box>
      <Box mb={3}>
        <Button 
          startIcon={'←'} 
          variant="text" 
          onClick={() => setActiveStep(0)}
          sx={{ mb: 2 }}
        >
          Change Doctor
        </Button>
        
        <Typography variant="h6" gutterBottom>
          Selected Doctor
        </Typography>
        
        {selectedDoctor && (
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box
              component="img"
              src={selectedDoctor.profileImage}
              alt={selectedDoctor.name}
              sx={{ width: 50, height: 50, borderRadius: '50%', mr: 2 }}
            />
            <Box>
              <Typography variant="subtitle1">{selectedDoctor.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedDoctor.specialization}
              </Typography>
            </Box>
          </Paper>
        )}
      </Box>
      
      <Typography variant="h6" gutterBottom>
        Select Date
      </Typography>
      
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Appointment Date"
          value={selectedDate}
          onChange={handleDateChange}
          disablePast
          sx={{ width: '100%', mb: 3 }}
        />
      </LocalizationProvider>
      
      <Typography variant="h6" gutterBottom>
        Available Time Slots
      </Typography>
      
      {loading ? (
        <Box textAlign="center" p={3}>
          <CircularProgress size={30} />
        </Box>
      ) : availableSlots.length > 0 ? (
        <Box>
          <RadioGroup
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
            sx={{ mb: 2 }}
          >
            <Grid container spacing={2}>
              {availableSlots.map((slot) => (
                <Grid item key={slot} xs={6} sm={4} md={3}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      border: selectedSlot === slot ? '2px solid' : '1px solid',
                      borderColor: selectedSlot === slot ? 'primary.main' : '#e0e0e0',
                      bgcolor: selectedSlot === slot ? 'primary.light' : 'background.paper',
                      color: selectedSlot === slot ? 'primary.contrastText' : 'text.primary',
                    }}
                  >
                    <FormControlLabel
                      value={slot}
                      control={<Radio sx={{ display: 'none' }} />}
                      label={slot}
                      sx={{ m: 0, width: '100%' }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </RadioGroup>
          
          {!selectedSlot && (
            <Typography color="error" variant="body2">
              Please select a time slot
            </Typography>
          )}
        </Box>
      ) : (
        <Box textAlign="center" p={3} border={1} borderColor="divider" borderRadius={1}>
          <Typography color="text.secondary">
            No available slots for the selected date. Please try another date.
          </Typography>
        </Box>
      )}
    </Box>
  );
  
  const renderAppointmentDetails = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Appointment Details
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Appointment Type</FormLabel>
              <RadioGroup
                row
                name="appointmentType"
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value as 'online' | 'in-person')}
              >
                <FormControlLabel 
                  value="online" 
                  control={<Radio />} 
                  label="Online Consultation" 
                />
                <FormControlLabel 
                  value="in-person" 
                  control={<Radio />} 
                  label="In-Person Visit" 
                  disabled={!selectedDoctor?.appointmentTypes.includes('in-person')}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Symptoms or Reason for Consultation"
              multiline
              rows={4}
              fullWidth
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Please describe your symptoms or reason for consultation"
            />
          </Grid>
        </Grid>
      </Paper>
      
      <Typography variant="h6" gutterBottom>
        Appointment Summary
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Doctor</Typography>
            <Typography variant="body1">{selectedDoctor?.name}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Specialization</Typography>
            <Typography variant="body1">{selectedDoctor?.specialization}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Date</Typography>
            <Typography variant="body1">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Time</Typography>
            <Typography variant="body1">{selectedSlot}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Consultation Type</Typography>
            <Typography variant="body1">
              {appointmentType === 'online' ? 'Online Consultation' : 'In-Person Visit'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Consultation Fee</Typography>
            <Typography variant="body1" fontWeight="bold">₹{selectedDoctor?.consultationFee}</Typography>
          </Grid>
        </Grid>
      </Paper>
      
      {isEkaUser && (
        <Box mt={3}>
          <FormControlLabel
            control={
              <Checkbox 
                checked={useEkaCarePayment}
                onChange={(e) => setUseEkaCarePayment(e.target.checked)}
              />
            }
            label="Use ekaCare integrated payment and appointment system"
          />
          <Typography variant="body2" color="text.secondary" pl={3.5}>
            Your appointment will be integrated with your ekaCare health records
          </Typography>
        </Box>
      )}
    </Box>
  );
  
  const renderPayment = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Payment Details
      </Typography>
      
      {useEkaCarePayment && isEkaUser ? (
        <Box>
          <Alert severity="info" sx={{ mb: 3 }}>
            Your payment will be processed through the ekaCare integrated payment system. You'll be redirected to complete the payment after confirmation.
          </Alert>
          
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Payment Summary
            </Typography>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Consultation Fee</Typography>
              <Typography>₹{selectedDoctor?.consultationFee}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Platform Fee</Typography>
              <Typography>₹0</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Taxes</Typography>
              <Typography>₹{Math.round(selectedDoctor?.consultationFee * 0.18)}</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="subtitle1" fontWeight="bold">Total</Typography>
              <Typography variant="subtitle1" fontWeight="bold">
                ₹{selectedDoctor?.consultationFee + Math.round(selectedDoctor?.consultationFee * 0.18)}
              </Typography>
            </Box>
          </Paper>
        </Box>
      ) : (
        <Box>
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend">Payment Method</FormLabel>
            <RadioGroup
              row
              name="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel value="card" control={<Radio />} label="Credit/Debit Card" />
              <FormControlLabel value="upi" control={<Radio />} label="UPI" />
              <FormControlLabel value="netbanking" control={<Radio />} label="Net Banking" />
            </RadioGroup>
          </FormControl>
          
          {paymentMethod === 'card' && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Card Number"
                    fullWidth
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={handleCardDetailsChange}
                    placeholder="1234 5678 9012 3456"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Expiry Date"
                    fullWidth
                    name="expiryDate"
                    value={cardDetails.expiryDate}
                    onChange={handleCardDetailsChange}
                    placeholder="MM/YY"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="CVV"
                    fullWidth
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleCardDetailsChange}
                    placeholder="123"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Cardholder Name"
                    fullWidth
                    name="name"
                    value={cardDetails.name}
                    onChange={handleCardDetailsChange}
                    placeholder="John Doe"
                  />
                </Grid>
              </Grid>
            </Paper>
          )}
          
          {paymentMethod === 'upi' && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <TextField
                label="UPI ID"
                fullWidth
                placeholder="yourname@upi"
              />
            </Paper>
          )}
          
          {paymentMethod === 'netbanking' && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <FormControl fullWidth>
                <TextField
                  select
                  label="Select Bank"
                  defaultValue=""
                >
                  <MenuItem value="sbi">State Bank of India</MenuItem>
                  <MenuItem value="hdfc">HDFC Bank</MenuItem>
                  <MenuItem value="icici">ICICI Bank</MenuItem>
                  <MenuItem value="axis">Axis Bank</MenuItem>
                  <MenuItem value="kotak">Kotak Mahindra Bank</MenuItem>
                </TextField>
              </FormControl>
            </Paper>
          )}
          
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Payment Summary
            </Typography>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Consultation Fee</Typography>
              <Typography>₹{selectedDoctor?.consultationFee}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Platform Fee</Typography>
              <Typography>₹0</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Taxes</Typography>
              <Typography>₹{Math.round(selectedDoctor?.consultationFee * 0.18)}</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="subtitle1" fontWeight="bold">Total</Typography>
              <Typography variant="subtitle1" fontWeight="bold">
                ₹{selectedDoctor?.consultationFee + Math.round(selectedDoctor?.consultationFee * 0.18)}
              </Typography>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
  
  // Dialog for ekaCare connection
  const renderEkaCareDialog = () => (
    <Dialog open={showEkaCareDialog} onClose={() => setShowEkaCareDialog(false)}>
      <DialogTitle>Connect with ekaCare</DialogTitle>
      <DialogContent>
        <Typography paragraph>
          To use ekaCare's integrated appointment booking and payment system, you need to connect your SwarCure account with ekaCare.
        </Typography>
        <Typography>
          Would you like to connect your account now? This will enhance your healthcare experience.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowEkaCareDialog(false)}>Not Now</Button>
        <Button 
          variant="contained" 
          onClick={() => {
            setShowEkaCareDialog(false);
            navigate('/profile');
          }}
        >
          Connect ekaCare
        </Button>
      </DialogActions>
    </Dialog>
  );
  
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderDoctorSelection();
      case 1:
        return renderDateTimeSelection();
      case 2:
        return renderAppointmentDetails();
      case 3:
        return renderPayment();
      default:
        return 'Unknown step';
    }
  };
  
  return (
    <Layout title="Book Appointment">
      <Container maxWidth="md" sx={{ py: 4 }}>
        {success ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" color="primary" gutterBottom>
              Appointment Booked Successfully!
            </Typography>
            <Typography paragraph>
              Your appointment has been scheduled. You will receive a confirmation via email and SMS soon.
            </Typography>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary" mt={2}>
              Redirecting to your appointments...
            </Typography>
          </Paper>
        ) : (
          <>
            <Typography variant="h4" component="h1" gutterBottom>
              Book an Appointment
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}
            
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            <Paper sx={{ p: 3, mb: 3 }}>
              {getStepContent(activeStep)}
            </Paper>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                disabled={activeStep === 0 || loading}
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={(activeStep === 1 && !selectedSlot) || loading}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : activeStep === steps.length - 1 ? (
                  'Book & Pay'
                ) : (
                  'Next'
                )}
              </Button>
            </Box>
            
            {renderEkaCareDialog()}
          </>
        )}
      </Container>
    </Layout>
  );
};

export default BookAppointmentPage;
