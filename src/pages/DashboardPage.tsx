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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  User,
  Phone,
  Mail,
  Calendar,
  Stethoscope,
  FileText,
  Bell,
  Settings,
  Shield,
  CreditCard,
  Music,
  Sparkles,
  CheckCircle,
  Clock,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { authApi } from '@/lib/api';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Profile state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: true,
    appointments: true,
    reminders: true,
    promotions: false,
  });
  
  // Mock user progress data
  const [userProgress, setUserProgress] = useState({
    therapySessionsCompleted: 8,
    hoursListened: 24,
    lastActiveDate: new Date(),
    upcomingAppointments: 2,
    streak: 5,
  });

  const { toast } = useToast();
  
  useEffect(() => {
    loadUserData();
  }, []);
  
  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Get user data from the API/localStorage
      const userData = await authApi.getCurrentUser();
      const storedEmail = localStorage.getItem('userEmail') || '';
      const storedName = localStorage.getItem('userName') || '';
      
      setProfile({
        name: storedName || userData.name,
        email: storedEmail || userData.email,
        phone: '+91 98765 43210', // Mock data
        dateOfBirth: '1990-01-01',
        address: '123 Example Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
      });
    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your profile information.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSaving(true);
    
    try {
      // In a real app, this would send the updated profile to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      localStorage.setItem('userName', profile.name);
      localStorage.setItem('userEmail', profile.email);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile information has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update your profile.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleNotificationSettingChange = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    });
  };
  
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and view your sound therapy progress
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border-accent/20">
            <CardContent className="p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/80 to-secondary/80 flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-white">
                    {profile.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="font-medium text-lg">{profile.name}</h3>
                <p className="text-sm text-muted-foreground">Patient</p>
              </div>
              
              <nav className="space-y-2">
                <Button 
                  variant={activeTab === 'profile' ? 'default' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab('profile')}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button 
                  variant={activeTab === 'progress' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('progress')}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  My Progress
                </Button>
                <Button 
                  variant={activeTab === 'appointments' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('appointments')}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Appointments
                </Button>
                <Button 
                  variant={activeTab === 'notifications' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('notifications')}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </Button>
              </nav>
              
              <Separator className="my-4" />
              
              <nav className="space-y-2">
                <Button 
                  variant={activeTab === 'settings' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('settings')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </nav>
            </CardContent>
          </Card>
          
          {/* Quick actions card */}
          <Card className="border-accent/20 mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="/doctors">
                  <Stethoscope className="mr-2 h-4 w-4" />
                  Book Consultation
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="/music-search">
                  <Music className="mr-2 h-4 w-4" />
                  Explore Sound Collections
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="/prescriptions">
                  <FileText className="mr-2 h-4 w-4" />
                  View Prescriptions
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Manage your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {loading ? (
                  <div className="flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <form onSubmit={handleProfileUpdate}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input
                          id="dob"
                          type="date"
                          value={profile.dateOfBirth}
                          onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                        />
                      </div>
                      
                      <div className="col-span-1 md:col-span-2">
                        <h3 className="text-base font-medium mb-3">Address Information</h3>
                        <Separator className="mb-6" />
                      </div>
                      
                      <div className="space-y-2 col-span-1 md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={profile.address}
                          onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={profile.city}
                          onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={profile.state}
                          onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-1">
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input
                          id="pincode"
                          value={profile.pincode}
                          onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Button type="submit" disabled={saving}>
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          )}
          
          {/* Progress Tab */}
          {activeTab === 'progress' && (
            <div className="space-y-6">
              {/* Progress summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-accent/20">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        <Stethoscope className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold">{userProgress.therapySessionsCompleted}</h3>
                      <p className="text-sm text-muted-foreground">Sessions Completed</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-accent/20">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold">{userProgress.hoursListened}</h3>
                      <p className="text-sm text-muted-foreground">Hours of Sound Therapy</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-accent/20">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        <CheckCircle className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold">{userProgress.streak}</h3>
                      <p className="text-sm text-muted-foreground">Day Streak</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Recent progress */}
              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Track your sound therapy journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="space-y-4">
                      {/* Recent activities would go here */}
                      <div className="flex items-start gap-4">
                        <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
                          <Music className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Morning Raga Therapy Session</p>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(Date.now() - 86400000), 'MMM d, h:mm a')}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Completed a 20-minute session of Raga Bhairav for anxiety relief
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                          <Stethoscope className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Consultation with Dr. Sharma</p>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(Date.now() - 3 * 86400000), 'MMM d, h:mm a')}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Completed a 45-minute sound therapy consultation
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">New Prescription</p>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(Date.now() - 3 * 86400000), 'MMM d, h:mm a')}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Received a new sound therapy prescription from Dr. Sharma
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View All Activity</Button>
                </CardFooter>
              </Card>
            </div>
          )}
          
          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle>My Appointments</CardTitle>
                <CardDescription>View and manage your upcoming and past appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-primary/60" />
                  <h3 className="font-medium mb-1">Manage your appointments</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    View your upcoming consultations, reschedule, or cancel appointments
                  </p>
                  <Button asChild>
                    <a href="/appointments">Go to Appointments</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-base font-medium">Notification Channels</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <Label htmlFor="notifications-email" className="text-sm">
                          Email Notifications
                        </Label>
                      </div>
                      <Switch
                        id="notifications-email"
                        checked={notificationSettings.email}
                        onCheckedChange={() => handleNotificationSettingChange('email')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <Label htmlFor="notifications-sms" className="text-sm">
                          SMS Notifications
                        </Label>
                      </div>
                      <Switch
                        id="notifications-sms"
                        checked={notificationSettings.sms}
                        onCheckedChange={() => handleNotificationSettingChange('sms')}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-base font-medium">Notification Types</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notifications-appointments" className="text-sm">
                          Appointment Reminders
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Receive reminders about upcoming appointments
                        </p>
                      </div>
                      <Switch
                        id="notifications-appointments"
                        checked={notificationSettings.appointments}
                        onCheckedChange={() => handleNotificationSettingChange('appointments')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notifications-reminders" className="text-sm">
                          Therapy Reminders
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Get reminded about your daily sound therapy sessions
                        </p>
                      </div>
                      <Switch
                        id="notifications-reminders"
                        checked={notificationSettings.reminders}
                        onCheckedChange={() => handleNotificationSettingChange('reminders')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notifications-promotions" className="text-sm">
                          Promotions & Updates
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Receive information about new features and special offers
                        </p>
                      </div>
                      <Switch
                        id="notifications-promotions"
                        checked={notificationSettings.promotions}
                        onCheckedChange={() => handleNotificationSettingChange('promotions')}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => {
                  toast({
                    description: "Notification preferences updated",
                  });
                }}>
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-base font-medium">Security</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Change Password</p>
                        <p className="text-sm text-muted-foreground">
                          Update your account password
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Shield className="h-4 w-4 mr-2" />
                        Change
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Enable
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-base font-medium">Payment Methods</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Manage Payment Methods</p>
                        <p className="text-sm text-muted-foreground">
                          Update your saved payment methods
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Manage
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-base font-medium">Account Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="language" className="text-sm">
                          Language
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Choose your preferred language
                        </p>
                      </div>
                      <select 
                        id="language" 
                        className="rounded-md border border-input h-9 px-3 py-1 text-sm"
                      >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="mr">Marathi</option>
                        <option value="ta">Tamil</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="text-base font-medium text-red-600">Danger Zone</h3>
                  <div>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Account deletion requested",
                          description: "We have sent an email with instructions to delete your account.",
                          variant: "destructive",
                        });
                      }}
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
