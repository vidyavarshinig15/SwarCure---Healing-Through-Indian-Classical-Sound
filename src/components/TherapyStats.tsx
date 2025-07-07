import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Music, Award, Flame } from 'lucide-react';

// Define the progress entry interface
interface ProgressEntry {
  date: string; // ISO date string
  duration: number; // in minutes
  completed: boolean;
  therapy: string;
}

interface TherapyStatsProps {
  progressData: ProgressEntry[];
  recommendation: {
    frequency: string; // "daily", "twice daily", etc.
    duration: number; // in minutes
    condition: string;
  };
}

export default function TherapyStats({ progressData, recommendation }: TherapyStatsProps) {
  // Parse data for calculations
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  // Streaks calculation
  const calculateStreaks = () => {
    let currentStreak = 0;
    let maxStreak = 0;
    
    // Create a map of dates with completed sessions
    const completedDays = new Map<string, boolean>();
    
    progressData.forEach(entry => {
      if (entry.completed) {
        const dateStr = entry.date.split('T')[0];
        completedDays.set(dateStr, true);
      }
    });
    
    // Calculate current streak
    const dateIterator = new Date(today);
    while (completedDays.has(dateIterator.toISOString().split('T')[0])) {
      currentStreak++;
      dateIterator.setDate(dateIterator.getDate() - 1);
    }
    
    // Calculate max streak from history
    const dates = Array.from(completedDays.keys()).sort();
    let tempStreak = 1;
    
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i-1]);
      const currDate = new Date(dates[i]);
      const dayDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000));
      
      if (dayDiff === 1) {
        tempStreak++;
      } else {
        maxStreak = Math.max(maxStreak, tempStreak);
        tempStreak = 1;
      }
    }
    
    maxStreak = Math.max(maxStreak, tempStreak, currentStreak);
    
    return { currentStreak, maxStreak };
  };
  
  // Weekly compliance calculation
  const calculateWeeklyCompliance = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    let sessionsCompleted = 0;
    let sessionsRequired = 0;
    
    // Count sessions in the last 7 days
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const checkDateStr = checkDate.toISOString().split('T')[0];
      
      // Count completed sessions for this date
      const dayEntries = progressData.filter(entry => 
        entry.date.startsWith(checkDateStr) && entry.completed
      );
      sessionsCompleted += dayEntries.length;
      
      // Count required sessions based on recommendation frequency
      if (recommendation.frequency === 'daily') {
        sessionsRequired += 1;
      } else if (recommendation.frequency === 'twice daily') {
        sessionsRequired += 2;
      }
    }
    
    const complianceRate = sessionsRequired > 0 
      ? Math.round((sessionsCompleted / sessionsRequired) * 100) 
      : 0;
      
    return { sessionsCompleted, sessionsRequired, complianceRate };
  };
  
  // Today's progress calculation
  const calculateTodayProgress = () => {
    const todayEntries = progressData.filter(entry => entry.date.startsWith(todayStr));
    const todayCompleted = todayEntries.filter(entry => entry.completed).length;
    
    let sessionsRequired = 1;
    if (recommendation.frequency === 'twice daily') {
      sessionsRequired = 2;
    } else if (recommendation.frequency === 'three times daily') {
      sessionsRequired = 3;
    }
    
    const progress = Math.min(100, Math.round((todayCompleted / sessionsRequired) * 100));
    
    return { progress, todayCompleted, sessionsRequired };
  };
  
  const totalMinutes = progressData.reduce((total, entry) => total + entry.duration, 0);
  const { currentStreak, maxStreak } = calculateStreaks();
  const { complianceRate } = calculateWeeklyCompliance();
  const { progress, todayCompleted, sessionsRequired } = calculateTodayProgress();

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Your Therapy Progress</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            <Flame className="h-3 w-3 text-orange-500" />
            {currentStreak} Day Streak
          </Badge>
        </div>
        <CardDescription>
          Track your sound therapy progress and maintain your healing routine
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Today's Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Today's Sessions</h3>
            <span className="text-sm text-muted-foreground">{todayCompleted} of {sessionsRequired} completed</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-muted-foreground">
              {progress < 100 ? `${sessionsRequired - todayCompleted} session${(sessionsRequired - todayCompleted) !== 1 ? 's' : ''} remaining` : 'All done for today!'}
            </span>
            {progress === 100 && (
              <Badge variant="secondary" className="text-xs">
                Daily Goal Reached!
              </Badge>
            )}
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary/5 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-secondary" />
              <h3 className="text-sm font-medium">Total Therapy Time</h3>
            </div>
            <p className="mt-2 text-2xl font-bold">{totalMinutes} min</p>
            <p className="text-xs text-muted-foreground mt-1">
              Across {progressData.length} sessions
            </p>
          </div>
          
          <div className="bg-primary/5 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">Weekly Compliance</h3>
            </div>
            <p className="mt-2 text-2xl font-bold">{complianceRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              {complianceRate >= 80 ? 'Excellent adherence!' : 'Keep going!'}
            </p>
          </div>
        </div>
        
        {/* Weekly Calendar */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4" />
            <h3 className="text-sm font-medium">This Week's Sessions</h3>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center">
            {Array.from({ length: 7 }).map((_, index) => {
              const date = new Date();
              date.setDate(date.getDate() - (6 - index));
              const dateStr = date.toISOString().split('T')[0];
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
              const dayNum = date.getDate();
              
              const dayEntries = progressData.filter(entry => 
                entry.date.startsWith(dateStr) && entry.completed
              );
              
              const isCompleted = dayEntries.length > 0;
              const isToday = dateStr === todayStr;
              
              let bgClass = '';
              if (isToday) {
                bgClass = isCompleted ? 'bg-primary text-primary-foreground' : 'bg-primary/20 text-primary';
              } else {
                bgClass = isCompleted ? 'bg-secondary/20 text-secondary-foreground' : 'bg-muted';
              }
              
              return (
                <div 
                  key={index} 
                  className={`aspect-square rounded-md flex flex-col items-center justify-center ${bgClass}`}
                  title={`${date.toLocaleDateString()} - ${isCompleted ? 'Completed' : 'Not completed'}`}
                >
                  <div className="text-xs font-medium">{dayName}</div>
                  <div className="text-xs">{dayNum}</div>
                  {dayEntries.length > 1 && (
                    <div className="text-[10px] mt-0.5">{dayEntries.length}x</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Stats and Recommendations */}
        <div className="bg-muted/30 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Current Therapy</h3>
            <Badge variant="outline" className="text-xs">{recommendation.condition}</Badge>
          </div>
          <div className="space-y-1 text-sm">
            <p><span className="text-muted-foreground">Recommended duration:</span> {recommendation.duration} min</p>
            <p><span className="text-muted-foreground">Frequency:</span> {recommendation.frequency}</p>
            <p><span className="text-muted-foreground">Longest streak:</span> {maxStreak} days</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col border-t pt-4">
        <Button asChild variant="outline" size="sm" className="w-full">
          <a href="/music-search">
            <Music className="h-4 w-4 mr-2" />
            Find More Therapy Sounds
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
