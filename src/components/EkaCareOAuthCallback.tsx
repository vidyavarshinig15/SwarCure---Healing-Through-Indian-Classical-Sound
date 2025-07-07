import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ekaCareApi, authApi } from '../lib/api';
import { Box, Typography, CircularProgress, Alert, Paper } from '@mui/material';

/**
 * Component to handle ekaCare OAuth callback
 * This should be rendered at the OAuth redirect URL
 */
const EkaCareOAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [error, setError] = useState('');

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        // Get authorization code and state from URL
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        
        if (!code || !state) {
          throw new Error('Missing required OAuth parameters');
        }

        // Complete OAuth flow to get ekaCare tokens
        const authResult = await ekaCareApi.handleOAuthCallback(code, state);
        
        // Get current user
        const userId = localStorage.getItem('userId') || '';
        if (!userId) {
          throw new Error('User not logged in');
        }
        
        // Update user profile with ekaCare connection
        await authApi.updateProfile({
          ekaConnected: true,
          ekaCareId: authResult.ekaCareId
        });
        
        // Success!
        setStatus('success');
        
        // Redirect to profile page after 2 seconds
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError(err instanceof Error ? err.message : 'Failed to connect with ekaCare');
        setStatus('error');
      }
    };
    
    processOAuthCallback();
  }, [searchParams, navigate]);

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      p: 3,
      bgcolor: 'background.default'
    }}>
      <Paper sx={{ p: 4, maxWidth: 500, width: '100%', textAlign: 'center' }}>
        {status === 'processing' && (
          <>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6">
              Connecting to ekaCare...
            </Typography>
            <Typography color="text.secondary">
              Please wait while we complete your ekaCare integration.
            </Typography>
          </>
        )}
        
        {status === 'success' && (
          <>
            <Box mb={2} display="flex" justifyContent="center">
              <Box component="span" sx={{ 
                width: 60, 
                height: 60, 
                borderRadius: '50%', 
                bgcolor: 'success.main',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}>
                ✓
              </Box>
            </Box>
            <Typography variant="h6" color="success.main" gutterBottom>
              Successfully connected to ekaCare!
            </Typography>
            <Typography color="text.secondary">
              Your SwarCure account is now linked with ekaCare.
              You'll be redirected to your profile page shortly.
            </Typography>
          </>
        )}
        
        {status === 'error' && (
          <>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error || 'An error occurred while connecting to ekaCare.'}
            </Alert>
            <Typography variant="body1" gutterBottom>
              Unable to complete the ekaCare integration.
            </Typography>
            <Box mt={2}>
              <Typography 
                component="button"
                onClick={() => navigate('/profile')}
                sx={{ 
                  textDecoration: 'underline',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'primary.main',
                  fontSize: '1rem'
                }}
              >
                Return to profile
              </Typography>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default EkaCareOAuthCallback;
