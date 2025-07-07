import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ekaCareApi, abdmApi, authApi } from '../lib/api';
import { Box, Button, Typography, CircularProgress, Alert, Paper, Grid, Dialog, TextField } from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import LinkIcon from '@mui/icons-material/Link';
import MedicationIcon from '@mui/icons-material/Medication';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloudDoneIcon from '@mui/icons-material/CloudDone';

interface EkaCareIntegrationProps {
  userId: string;
  isLoggedIn: boolean;
}

const EkaCareIntegration: React.FC<EkaCareIntegrationProps> = ({ userId, isLoggedIn }) => {
  const navigate = useNavigate();
  const [integrationStatus, setIntegrationStatus] = useState<'not-connected' | 'connecting' | 'connected'>('not-connected');
  const [abhaId, setAbhaId] = useState('');
  const [abhaNumber, setAbhaNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [healthRecords, setHealthRecords] = useState<any[]>([]);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is already connected to ekaCare
    if (isLoggedIn) {
      setLoading(true);
      authApi.getCurrentUser()
        .then(user => {
          setCurrentUser(user);
          if (user.ekaConnected && user.ekaCareId) {
            setIntegrationStatus('connected');
            loadHealthData(user.abhaId || '');
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching user data:", err);
          setLoading(false);
        });
    }
  }, [isLoggedIn, userId]);

  const loadHealthData = async (abhaIdToUse: string) => {
    if (!abhaIdToUse) return;
    
    try {
      setLoading(true);
      // First check if the user already has an ekaCare account with this ABHA ID
      const checkResult = await ekaCareApi.checkAbhaInEkaCare(abhaIdToUse);
      
      if (checkResult.exists && checkResult.ekaCareId) {
        // If exists, fetch records from ekaCare directly
        const records = await ekaCareApi.getHealthRecords(checkResult.ekaCareId);
        setHealthRecords(Array.isArray(records) ? records : []);
      } else {
        // Otherwise fallback to ABDM records
        const records = await abdmApi.getHealthRecords(abhaIdToUse);
        setHealthRecords(Array.isArray(records) ? records : []);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading health records:", error);
      setLoading(false);
    }
  };

  const handleLinkAbha = async () => {
    if (!abhaId || !abhaNumber) {
      setError('Please provide both ABHA ID and ABHA Number');
      return;
    }

    try {
      setLoading(true);
      setIntegrationStatus('connecting');
      
      // First link with ABDM
      await abdmApi.linkAbhaId(userId, abhaId, abhaNumber);
      
      // For more secure OAuth flow, redirect to ekaCare authorization page
      const oauthUrl = ekaCareApi.getOAuthAuthorizationUrl();
      
      // Save ABHA ID to associate with the ekaCare account after OAuth callback
      localStorage.setItem('pendingAbhaId', abhaId);
      localStorage.setItem('pendingAbhaNumber', abhaNumber);
      
      // Redirect to ekaCare authorization page
      // In a real implementation, this would redirect to ekaCare's OAuth page
      // For the demo, we'll simulate the process
      
      // Mock implementation - simulate successful ekaCare connection
      const userEmail = localStorage.getItem('userEmail') || '';
      const authResult = await ekaCareApi.authenticate(userId, { email: userEmail, password: '' });
      const ekaCareId = authResult.ekaCareId;
      
      // Link the ABHA ID with ekaCare
      await ekaCareApi.linkAbhaWithEkaCare(abhaId, ekaCareId);
      
      // Update the user's profile
      await authApi.updateProfile({
        ekaConnected: true,
        ekaCareId: ekaCareId,
        abhaId: abhaId
      });
      
      setIntegrationStatus('connected');
      setSuccess('Successfully linked your ABHA ID with ekaCare!');
      
      // Refresh user data
      const user = await authApi.getCurrentUser();
      setCurrentUser(user);
      
      // Load health records
      await loadHealthData(abhaId);
      
      // Remove pending ABHA data
      localStorage.removeItem('pendingAbhaId');
      localStorage.removeItem('pendingAbhaNumber');
      
    } catch (error) {
      console.error("Error linking ABHA ID:", error);
      setError('Failed to link your ABHA ID. Please try again.');
      setIntegrationStatus('not-connected');
    } finally {
      setLoading(false);
      setShowLinkDialog(false);
    }
  };

  const handleBookAppointment = async () => {
    // Check for ekaCare integration first
    if (integrationStatus !== 'connected') {
      setShowLinkDialog(true);
      return;
    }

    // Navigate to appointment booking with ekaCare flag
    navigate('/appointments/booking?useEkaCare=true');
  };

  if (loading && !currentUser) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, backgroundColor: '#f8f9ff' }}>
        <Box display="flex" alignItems="center" mb={2}>
          <HealthAndSafetyIcon sx={{ mr: 1, color: '#4a6da7' }} fontSize="large" />
          <Typography variant="h5" component="h2" fontWeight="500">
            ekaCare Health Integration
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {integrationStatus === 'connected' ? (
          <>
            <Alert 
              severity="success" 
              icon={<CloudDoneIcon />}
              sx={{ mb: 3 }}
            >
              Your account is successfully integrated with ekaCare
            </Alert>
            
            <Typography variant="body1" gutterBottom>
              ABHA ID: <strong>{currentUser?.abhaId || 'Not available'}</strong>
            </Typography>
            
            <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
              ekaCare ID: <strong>{currentUser?.ekaCareId || 'Not available'}</strong>
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  startIcon={<MedicationIcon />}
                  onClick={handleBookAppointment}
                >
                  Book ekaCare Appointment
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  fullWidth
                  startIcon={<AccessTimeIcon />}
                  onClick={() => navigate('/health-records')}
                >
                  View Health Records
                </Button>
              </Grid>
            </Grid>
            
            {healthRecords.length > 0 ? (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Recent Health Records
                </Typography>
                {healthRecords.slice(0, 2).map((record, index) => (
                  <Paper key={index} sx={{ p: 2, mb: 2, backgroundColor: 'white' }}>
                    <Typography variant="subtitle1" fontWeight="500">
                      {record.recordType === 'prescription' ? 'Prescription' : 
                       record.recordType === 'labReport' ? 'Lab Report' : 
                       record.recordType === 'wellness' ? 'Wellness Record' : 'Health Record'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {record.date} • {record.facilityName}
                    </Typography>
                    <Typography variant="body2" mt={1}>
                      {record.description}
                    </Typography>
                    {record.doctorName && (
                      <Typography variant="body2" color="text.secondary">
                        Doctor: {record.doctorName}
                      </Typography>
                    )}
                  </Paper>
                ))}
                {healthRecords.length > 2 && (
                  <Button 
                    variant="text" 
                    onClick={() => navigate('/health-records')}
                  >
                    View all {healthRecords.length} records
                  </Button>
                )}
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                No health records found. Records will appear here after your first consultation.
              </Typography>
            )}
          </>
        ) : (
          <Box>
            <Typography variant="body1" paragraph>
              Connect your ABHA ID with ekaCare to access your health records, schedule appointments, and get personalized sound therapy recommendations.
            </Typography>
            
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<LinkIcon />}
              onClick={() => setShowLinkDialog(true)}
              disabled={loading || integrationStatus === 'connecting'}
            >
              {loading ? <CircularProgress size={24} /> : 'Connect with ekaCare'}
            </Button>
          </Box>
        )}
      </Paper>
      
      <Dialog open={showLinkDialog} onClose={() => setShowLinkDialog(false)}>
        <Box sx={{ p: 3, width: { xs: '100%', sm: '400px' } }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Link your ABHA ID with ekaCare
          </Typography>
          
          <TextField
            label="ABHA ID"
            fullWidth
            margin="normal"
            value={abhaId}
            onChange={(e) => setAbhaId(e.target.value)}
            placeholder="e.g., 12-3456-7890-1234"
            disabled={loading}
          />
          
          <TextField
            label="ABHA Number"
            fullWidth
            margin="normal"
            value={abhaNumber}
            onChange={(e) => setAbhaNumber(e.target.value)}
            placeholder="e.g., 1234567890"
            disabled={loading}
          />
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              onClick={() => setShowLinkDialog(false)} 
              disabled={loading}
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleLinkAbha}
              disabled={loading || !abhaId || !abhaNumber}
            >
              {loading ? <CircularProgress size={24} /> : 'Link ABHA ID'}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default EkaCareIntegration;
