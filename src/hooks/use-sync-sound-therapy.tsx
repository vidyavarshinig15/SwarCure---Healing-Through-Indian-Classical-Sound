import { useState, useEffect } from 'react';
import { ekaCareApi, authApi } from '../lib/api';

/**
 * Custom hook for syncing SwarCure sound therapy data with ekaCare
 */
export const useSyncSoundTherapy = () => {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Function to sync data
  const syncTherapyData = async (therapySessions: any[] = [], vitalStats: any = {}) => {
    if (!therapySessions.length) {
      return;
    }
    
    try {
      setSyncStatus('syncing');
      setError(null);
      
      // Get current user
      const userData = await authApi.getCurrentUser();
      
      // Check if user has ekaCare connected
      if (!userData.ekaConnected || !userData.ekaCareId) {
        throw new Error('No ekaCare account connected');
      }
      
      // Format therapy data for ekaCare
      const formattedTherapySessions = therapySessions.map(session => ({
        id: session.id,
        trackName: session.name || session.trackName,
        raagType: session.raag || session.raagType || 'Unknown',
        duration: session.duration || 0,
        date: session.date || new Date().toISOString().split('T')[0],
        timeOfDay: session.timeOfDay || 'evening',
        effectivenessRating: session.rating || session.effectivenessRating,
        symptoms: session.symptoms || [],
        notes: session.notes || ''
      }));
      
      // Sync with ekaCare
      await ekaCareApi.syncSoundTherapyWithEkaCare(userData.ekaCareId, {
        sessions: formattedTherapySessions,
        vitalStats
      });
      
      // Update state
      setSyncStatus('success');
      setLastSyncTime(new Date());
      
      // Store last sync time in localStorage
      localStorage.setItem('lastEkaCareSyncTime', new Date().toISOString());
      
    } catch (err) {
      console.error('Error syncing therapy data with ekaCare:', err);
      setSyncStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to sync with ekaCare');
    }
  };
  
  // Auto-sync effect if needed
  useEffect(() => {
    // Get last sync time from localStorage
    const lastSyncTimeStr = localStorage.getItem('lastEkaCareSyncTime');
    
    if (lastSyncTimeStr) {
      setLastSyncTime(new Date(lastSyncTimeStr));
    }
  }, []);
  
  return {
    syncStatus,
    lastSyncTime,
    error,
    syncTherapyData
  };
};

export default useSyncSoundTherapy;
