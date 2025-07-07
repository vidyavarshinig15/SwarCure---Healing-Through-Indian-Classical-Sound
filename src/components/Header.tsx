import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Headphones, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Calendar, 
  Music, 
  BookOpen,
  Bell,
  Building2,
  Home,
  Stethoscope 
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import NotificationSystem from './NotificationSystem';
import { notificationsApi, authApi } from '@/lib/api';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [isGuest, setIsGuest] = useState(() => localStorage.getItem('isGuest') === 'true');
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || 'User');
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('userEmail') || '');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    // Check authentication status on component mount and when localStorage changes
    const checkAuth = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
      setIsGuest(localStorage.getItem('isGuest') === 'true');
      setUserName(localStorage.getItem('userName') || 'User');
      setUserEmail(localStorage.getItem('userEmail') || '');
    };
    
    checkAuth();
    
    // Load notifications if user is logged in
    if (isLoggedIn && !isGuest) {
      loadNotifications();
    }
    
    // Listen for storage events (e.g. login/logout in another tab)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [isLoggedIn, isGuest]);
  
  const loadNotifications = async () => {
    try {
      const notifs = await notificationsApi.getUserNotifications();
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.read).length);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };
  
  const handleLogout = async () => {
    try {
      await authApi.logout();
      
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback to basic logout if API fails
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('isGuest');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/login');
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path ? "text-primary font-medium" : "text-primary/80";
  };
  
  return (
    <header className="sticky top-0 w-full z-50 bg-white/95 backdrop-blur-lg border-b border-accent/10 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/80 to-secondary/80 rounded-xl flex items-center justify-center shadow-md">
              <Headphones className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary/90 to-secondary/90 bg-clip-text text-transparent">
                SwarCure
              </span>
              <div className="text-xs text-primary/60">Sound Therapy Platform</div>
            </div>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className={`${isActive('/')} hover:text-secondary transition-colors duration-300 flex items-center gap-1.5`}>
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link to="/music-search" className={`${isActive('/music-search')} hover:text-secondary transition-colors duration-300 flex items-center gap-1.5`}>
            <Music className="w-4 h-4" />
            Sound Collections
          </Link>
          {!isGuest && (
            <Link to="/therapy-assessment" className={`${isActive('/therapy-assessment')} hover:text-secondary transition-colors duration-300 flex items-center gap-1.5`}>
              <BookOpen className="w-4 h-4" />
              Personalized Therapy
            </Link>
          )}
          {isGuest && (
            <Link to="/login" className="text-primary/80 hover:text-secondary transition-colors duration-300 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span className="flex items-center">
                Personalized Therapy
                <Badge variant="outline" className="ml-2 text-xs py-0">Login Required</Badge>
              </span>
            </Link>
          )}
          <Link to="/doctors" className={`${isActive('/doctors')} hover:text-secondary transition-colors duration-300 flex items-center gap-1.5`}>
            <Stethoscope className="w-4 h-4" />
            Doctors
          </Link>
          <Link to="/workshops" className={`${isActive('/workshops')} hover:text-secondary transition-colors duration-300 flex items-center gap-1.5`}>
            <Building2 className="w-4 h-4" />
            Workshops
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          {!isGuest && isLoggedIn && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative" 
              onClick={() => navigate('/notifications')}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
          )}
          
          {/* User menu for logged in users */}
          {isLoggedIn && !isGuest ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full bg-primary/10 h-9 w-9">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium">{userName}</p>
                    <p className="text-xs text-muted-foreground">{userEmail}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/appointments')}>
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>My Appointments</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/notifications')}>
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <Badge variant="outline" className="ml-auto bg-primary/10 text-primary text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:block">
              {isGuest ? (
                <Button onClick={handleLogout} variant="outline" className="border-primary/60 text-primary/80 hover:bg-primary/10 hover:text-primary">
                  Exit Guest Mode
                </Button>
              ) : (
                <Button onClick={() => navigate('/login')} variant="outline" className="border-primary/60 text-primary/80 hover:bg-primary/10 hover:text-primary">
                  Login
                </Button>
              )}
            </div>
          )}
          
          
          {/* Mobile menu button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-lg font-medium">Menu</span>
                </div>
                
                <nav className="space-y-6 flex flex-col">
                  <Link to="/" className="text-lg font-medium text-primary flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Home
                  </Link>
                  <Link to="/music-search" className="text-lg font-medium text-primary flex items-center gap-2">
                    <Music className="w-5 h-5" />
                    Sound Collections
                  </Link>
                  {!isGuest && (
                    <Link to="/therapy-assessment" className="text-lg font-medium text-primary flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Personalized Therapy
                    </Link>
                  )}
                  <Link to="/doctors" className="text-lg font-medium text-primary flex items-center gap-2">
                    <Stethoscope className="w-5 h-5" />
                    Doctors
                  </Link>
                  <Link to="/workshops" className="text-lg font-medium text-primary flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Workshops
                  </Link>
                  
                  {/* Additional links for mobile */}
                  {isLoggedIn && !isGuest && (
                    <>
                      <div className="border-t pt-4 mt-2"></div>
                      <Link to="/dashboard" className="text-lg font-medium text-primary flex items-center gap-2">
                        <User className="w-5 h-5" />
                        My Profile
                      </Link>
                      <Link to="/appointments" className="text-lg font-medium text-primary flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        My Appointments
                      </Link>
                      <Link to="/notifications" className="text-lg font-medium text-primary flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Notifications
                        {unreadCount > 0 && (
                          <Badge className="bg-red-500 text-white ml-auto">{unreadCount}</Badge>
                        )}
                      </Link>
                    </>
                  )}
                </nav>
                
                <div className="mt-auto pt-6 border-t">
                  {isLoggedIn || isGuest ? (
                    <Button onClick={handleLogout} className="w-full">
                      {isGuest ? 'Exit Guest Mode' : 'Logout'}
                    </Button>
                  ) : (
                    <Button onClick={() => navigate('/login')} className="w-full">
                      Login
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
