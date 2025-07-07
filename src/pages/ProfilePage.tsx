import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, Avatar, Alert, CircularProgress, Divider } from '@mui/material';
import { Container } from '@mui/material';
import Layout from '../components/Layout';
import EkaCareIntegration from '../components/EkaCareIntegration';
import { authApi, ekaCareApi } from '../lib/api';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  
  useEffect(() => {
    loadUserProfile();
  }, []);
  
  const loadUserProfile = async () => {
    setLoading(true);
    try {
      const userData = await authApi.getCurrentUser();
      setUser(userData);
      
      // Initialize form data with user data
      let profileData = {
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        dateOfBirth: userData.dateOfBirth || '',
        address: userData.address || '',
        city: userData.city || '',
        state: userData.state || '',
        pincode: userData.pincode || '',
      };
      
      // If user has ekaCare connected, fetch enhanced profile data
      if (userData.ekaConnected && userData.ekaCareId) {
        try {
          const ekaProfile = await ekaCareApi.getPatientProfile(userData.ekaCareId);
          
          // Update profile with ekaCare data if available
          if (ekaProfile) {
            profileData = {
              ...profileData,
              name: ekaProfile.name || profileData.name,
              email: ekaProfile.email || profileData.email,
              phone: ekaProfile.contactNumber || profileData.phone,
              dateOfBirth: ekaProfile.dateOfBirth || profileData.dateOfBirth,
              address: ekaProfile.address || profileData.address,
              // Split address into components if possible
              city: profileData.city, // Keep existing city
              state: profileData.state, // Keep existing state
              pincode: profileData.pincode, // Keep existing pincode
            };
          }
        } catch (err) {
          console.error("Error fetching ekaCare profile:", err);
          // Continue with existing data
        }
      }
      
      setFormData(profileData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to load your profile. Please try again.');
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedUser = await authApi.updateProfile(formData);
      setUser(updatedUser);
      setSuccess('Profile updated successfully!');
      setError('');
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Layout title="Your Profile">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Profile
        </Typography>
        
        {loading && !user ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="300px">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                    {error}
                  </Alert>
                )}
                
                {success && (
                  <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
                    {success}
                  </Alert>
                )}
                
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  display="flex"
                  flexDirection="column"
                  gap={3}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Avatar
                        src={user?.profilePicture || ''}
                        alt={user?.name}
                        sx={{ width: 80, height: 80 }}
                      />
                    </Grid>
                    <Grid item xs>
                      <Typography variant="h5" gutterBottom>
                        {user?.name || 'User'}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {user?.email || ''}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  <Divider />
                  
                  <Typography variant="h6">Personal Information</Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="name"
                        label="Full Name"
                        fullWidth
                        variant="outlined"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="email"
                        label="Email"
                        fullWidth
                        variant="outlined"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="phone"
                        label="Phone Number"
                        fullWidth
                        variant="outlined"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="dateOfBirth"
                        label="Date of Birth"
                        type="date"
                        fullWidth
                        variant="outlined"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                  
                  <Typography variant="h6">Address</Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        name="address"
                        label="Address"
                        fullWidth
                        variant="outlined"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="city"
                        label="City"
                        fullWidth
                        variant="outlined"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="state"
                        label="State"
                        fullWidth
                        variant="outlined"
                        value={formData.state}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="pincode"
                        label="Pincode"
                        fullWidth
                        variant="outlined"
                        value={formData.pincode}
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </Grid>
                  
                  <Box display="flex" justifyContent="flex-end">
                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="primary" 
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              {user && (
                <EkaCareIntegration 
                  userId={user.id}
                  isLoggedIn={true}
                />
              )}
            </Grid>
          </Grid>
        )}
      </Container>
    </Layout>
  );
};

export default ProfilePage;
