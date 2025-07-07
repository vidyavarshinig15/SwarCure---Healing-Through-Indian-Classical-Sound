import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Headphones, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { authApi } from '@/lib/api';

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Call login API
      await authApi.login(loginEmail, loginPassword);
      
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', loginEmail);
      
      toast({
        title: "Login successful",
        description: "Welcome back to SwarCure!",
      });
      
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupEmail || !signupPassword || !confirmPassword || !name) {
      setError('Please fill in all fields');
      return;
    }
    
    if (signupPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Call register API
      await authApi.register(signupEmail, signupPassword, name);
      
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', signupEmail);
      localStorage.setItem('userName', name);
      
      toast({
        title: "Registration successful",
        description: "Welcome to SwarCure! Your account has been created.",
      });
      
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again with a different email.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGuestAccess = () => {
    localStorage.setItem('isGuest', 'true');
    
    toast({
      title: "Guest access granted",
      description: "You can access basic features. Create an account for a personalized experience.",
      duration: 5000,
    });
    
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/60 via-accent/30 to-secondary/10 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/80 to-secondary/80 rounded-xl flex items-center justify-center shadow-md">
              <Headphones className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-3xl font-bold bg-gradient-to-r from-primary/90 to-secondary/90 bg-clip-text text-transparent">
                SwarCure
              </span>
              <div className="text-sm text-primary/60">Sound Therapy Platform</div>
            </div>
          </div>
        </div>
        
        <Card className="border-accent/20 shadow-md backdrop-blur-sm bg-white/90">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome to SwarCure</CardTitle>
            <CardDescription className="text-center">
              Healing through the power of Indian classical sound
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        placeholder="your@email.com" 
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input 
                        id="password" 
                        placeholder="••••••••" 
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        placeholder="Your Name" 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input 
                        id="signup-email" 
                        placeholder="your@email.com" 
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input 
                        id="signup-password" 
                        placeholder="••••••••" 
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input 
                        id="confirm-password" 
                        placeholder="••••••••" 
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex flex-col">
            <div className="relative w-full mb-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-muted-foreground">
                  Or continue as
                </span>
              </div>
            </div>
            
            <Button onClick={handleGuestAccess} variant="outline" className="w-full">
              Continue as Guest
            </Button>
            
            <p className="mt-4 text-xs text-center text-muted-foreground">
              Guest users can access basic features. Create an account for personalized therapy.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
