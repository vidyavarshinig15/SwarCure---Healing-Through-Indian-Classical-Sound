import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Calendar, 
  CheckCircle, 
  Clock, 
  X, 
  Info, 
  AlertTriangle, 
  Music, 
  Users,
  MapPin
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Define notification types
interface NotificationBase {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  type: 'reminder' | 'info' | 'warning' | 'success' | 'event';
  action?: {
    label: string;
    url: string;
  };
}

interface ReminderNotification extends NotificationBase {
  type: 'reminder';
  therapy: string;
  recommendedTime: string;
}

interface EventNotification extends NotificationBase {
  type: 'event';
  date: Date;
  location: string;
  organizer: string;
  meetingLink?: string;
}

interface InfoNotification extends NotificationBase {
  type: 'info';
}

interface WarningNotification extends NotificationBase {
  type: 'warning';
}

interface SuccessNotification extends NotificationBase {
  type: 'success';
}

type Notification = ReminderNotification | EventNotification | InfoNotification | WarningNotification | SuccessNotification;

// Sample notifications
const sampleNotifications: Notification[] = [
  {
    id: '1',
    title: 'Therapy Session Reminder',
    description: 'You haven\'t completed your evening therapy session yet.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    type: 'reminder',
    therapy: 'Raag Bhairavi for Anxiety',
    recommendedTime: 'Evening Session',
    action: {
      label: 'Start Session',
      url: '/music-search'
    }
  },
  {
    id: '2',
    title: 'New Workshop Available',
    description: 'Join our workshop on "Healing through Indian Classical Music" next week.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    read: false,
    type: 'event',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
    location: 'SwarCure Center, Mumbai',
    organizer: 'Dr. Anjali Sharma',
    action: {
      label: 'View Details',
      url: '/workshops'
    }
  },
  {
    id: '3',
    title: 'Doctor Appointment Confirmed',
    description: 'Your appointment with Dr. Rajesh Patel has been confirmed.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    type: 'success',
    action: {
      label: 'View Appointment',
      url: '/appointments'
    }
  },
  {
    id: '4',
    title: 'Virtual Sound Healing Event',
    description: 'Join our online sound meditation session with expert healers.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    read: true,
    type: 'event',
    date: new Date(Date.now() + 1000 * 60 * 60 * 72), // 3 days from now
    location: 'Virtual Event (Zoom)',
    organizer: 'SwarCure Team',
    meetingLink: 'https://zoom.us/j/123456789',
    action: {
      label: 'Join Event',
      url: 'https://zoom.us/j/123456789'
    }
  },
  {
    id: '5',
    title: 'Assessment Reminder',
    description: 'It\'s time for your monthly wellness assessment to track your progress.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    read: true,
    type: 'info',
    action: {
      label: 'Take Assessment',
      url: '/therapy-assessment'
    }
  }
];

// Define the component props
interface NotificationSystemProps {
  fullPage?: boolean;
}

export default function NotificationSystem({ fullPage = false }: NotificationSystemProps) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [open, setOpen] = useState(false);

  // Calculate unread count
  useEffect(() => {
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadCount(count);
  }, [notifications]);

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Remove notification
  const removeNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };

  // Mark notification as read and handle action
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read if unread
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Navigate to action URL if provided
    if (notification.action) {
      navigate(notification.action.url);
    }
    
    // Close dropdown
    setOpen(false);
  };

  // Handle action button click
  const handleAction = (notification: Notification) => {
    if (notification.action) {
      navigate(notification.action.url);
    }
  };

  // Render full page mode
  if (fullPage) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-medium">All Notifications</h2>
          </div>
          {notifications.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
            >
              Mark All Read
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No notifications</h3>
            <p className="text-muted-foreground">You're all caught up!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notifications.map(notification => (
              <Card 
                key={notification.id} 
                className={cn(
                  "cursor-pointer",
                  !notification.read && "border-primary"
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {notification.type === 'reminder' && <Clock className="h-4 w-4 text-blue-500" />}
                      {notification.type === 'info' && <Info className="h-4 w-4 text-blue-500" />}
                      {notification.type === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                      {notification.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {notification.type === 'event' && <Calendar className="h-4 w-4 text-violet-500" />}
                      
                      <CardTitle className={cn(
                        "text-base",
                        !notification.read && "font-semibold text-primary"
                      )}>
                        {notification.title}
                      </CardTitle>
                    </div>
                    
                    <Badge 
                      variant={notification.read ? "outline" : "default"}
                      className="text-[10px] h-5 ml-2"
                    >
                      {notification.read ? 'Read' : 'New'}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs text-muted-foreground mt-1">
                    {format(notification.timestamp, 'MMMM d, yyyy • h:mm a')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-sm">{notification.description}</p>
                  
                  {/* Type-specific content */}
                  {notification.type === 'reminder' && (
                    <div className="flex items-center gap-1 mt-2">
                      <Music className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{(notification as ReminderNotification).therapy}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({(notification as ReminderNotification).recommendedTime})
                      </span>
                    </div>
                  )}
                  
                  {notification.type === 'event' && (
                    <div className="space-y-1 mt-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {format((notification as EventNotification).date, 'MMMM d, yyyy • h:mm a')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {(notification as EventNotification).location}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {(notification as EventNotification).organizer}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {notification.action && (
                    <Button 
                      variant="link" 
                      className="h-auto p-0 text-xs font-medium mt-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(notification);
                      }}
                    >
                      {notification.action.label}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Standard dropdown mode
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-auto text-xs py-1 px-2"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No notifications
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.map((notification) => (
              <div key={notification.id} className="relative">
                <DropdownMenuItem
                  className={`p-3 cursor-pointer ${notification.read ? 'opacity-70' : 'bg-muted/40'}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      {notification.type === 'reminder' && <Clock className="h-4 w-4 text-blue-500" />}
                      {notification.type === 'info' && <Info className="h-4 w-4 text-blue-500" />}
                      {notification.type === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                      {notification.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {notification.type === 'event' && <Calendar className="h-4 w-4 text-violet-500" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <p className={`text-sm font-medium ${!notification.read ? 'text-primary' : ''}`}>
                          {notification.title}
                        </p>
                        <span className="text-xs text-muted-foreground ml-2">
                          {format(notification.timestamp, 'h:mm a')}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {notification.description}
                      </p>
                      
                      {/* Type-specific content */}
                      {notification.type === 'reminder' && (
                        <div className="flex items-center gap-1 mt-1">
                          <Music className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">{notification.therapy}</span>
                        </div>
                      )}
                      
                      {notification.type === 'event' && (
                        <div className="space-y-1 mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">
                              {format(notification.date, 'MMMM d, yyyy • h:mm a')}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">{notification.organizer}</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Action button */}
                      {notification.action && (
                        <Button 
                          variant="link" 
                          className="h-auto p-0 text-xs font-medium mt-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(notification);
                          }}
                        >
                          {notification.action.label}
                        </Button>
                      )}
                    </div>
                  </div>
                </DropdownMenuItem>
                <button 
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted text-muted-foreground"
                  onClick={(e) => {
                    e.stopPropagation(); 
                    removeNotification(notification.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="justify-center text-center text-xs text-muted-foreground"
          onClick={() => navigate('/notifications')}
        >
          View All Notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
