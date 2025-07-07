import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Clock, Music, CheckCircle } from 'lucide-react';
import TherapyStats from './TherapyStats';

const Dashboard = () => {
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState([]);
  const [assessmentResults, setAssessmentResults] = useState(null);

  // Generate sample progress data if none exists
  const generateSampleProgressData = () => {
    const today = new Date();
    const data = [];

    // Generate 14 days of sample data (2 weeks)
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Skip some days to create realistic streaks
      if (i === 3 || i === 7) continue;
      
      // Add 1-2 sessions per day
      const sessionsPerDay = i % 3 === 0 ? 2 : 1;
      
      for (let j = 0; j < sessionsPerDay; j++) {
        data.push({
          date: date.toISOString(),
          duration: 15 + (j * 5), // 15 or 20 minutes
          completed: true,
          therapy: j === 0 ? 'Morning Raag Bhairav' : 'Evening Raag Yaman'
        });
      }
    }
    
    return data;
  };

  useEffect(() => {
    // Load saved progress data from localStorage
    const savedProgress = localStorage.getItem('therapyProgress');
    if (savedProgress) {
      setProgressData(JSON.parse(savedProgress));
    } else {
      // If no data, create sample progress data
      const sampleData = generateSampleProgressData();
      localStorage.setItem('therapyProgress', JSON.stringify(sampleData));
      setProgressData(sampleData);
    }

    // Load assessment results if available
    const savedResults = localStorage.getItem('assessmentResults');
    if (savedResults) {
      setAssessmentResults(JSON.parse(savedResults));
    }
  }, []);

  // Define recommendation based on assessment or default
  const recommendation = assessmentResults?.recommendedTherapy || {
    frequency: 'daily',
    duration: 20,
    condition: 'stress'
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Personalized Dashboard Preview
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indian-gold to-indian-saffron mx-auto mb-8"></div>
          <p className="text-xl text-tertiary max-w-3xl mx-auto">
            Track your wellness journey with comprehensive analytics and personalized insights.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-accent/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-primary">Mood Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-tertiary">Today</span>
                    <span className="text-green-600 font-medium">😌 Calm</span>
                  </div>
                  <div className="w-full h-2 bg-accent rounded-full">
                    <div className="w-3/4 h-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
                  </div>
                  <p className="text-xs text-tertiary">7-day improvement trend</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-accent/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-primary">Listening Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-secondary">2.5h</div>
                  <p className="text-sm text-tertiary">This week</p>
                  <div className="text-xs text-green-600">↗ +15% from last week</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-accent/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-primary">Current Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-secondary">5 days</div>
                  <p className="text-sm text-tertiary">Current streak</p>
                  <div className="text-xs text-tertiary">Best: 8 days</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-accent/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-primary">Minutes Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-secondary">30 min</div>
                  <p className="text-sm text-tertiary">Today's therapy</p>
                  <div className="text-xs text-green-600">Goal: 30 min ✓</div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <Card className="border-accent/30 col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle>Your Therapy Journey</CardTitle>
                <CardDescription>Track your consistency and progress</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Display TherapyStats here for registered users */}
                <div className="bg-accent/10 p-6 rounded-lg flex flex-col items-center justify-center min-h-[280px]">
                  <TherapyStats
                    progressData={progressData}
                    recommendation={{
                      frequency: recommendation.frequency,
                      duration: typeof recommendation.duration === 'number' ? 
                        recommendation.duration : 
                        parseInt(recommendation.duration?.split(' ')[0] || '20'),
                      condition: recommendation.condition
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-accent/30 col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Recommended For You</CardTitle>
                <CardDescription>Based on your profile and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-accent/10 rounded-lg">
                  <h3 className="font-medium mb-2">Morning Raga</h3>
                  <p className="text-sm text-tertiary mb-4">Start your day with energizing sounds</p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-tertiary">Raag Bhairav</div>
                    <Button variant="outline" size="sm" onClick={() => navigate('/music-search')}>
                      Listen Now
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 bg-accent/10 rounded-lg">
                  <h3 className="font-medium mb-2">Evening Relaxation</h3>
                  <p className="text-sm text-tertiary mb-4">Wind down with calming frequencies</p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-tertiary">Raag Yaman</div>
                    <Button variant="outline" size="sm" onClick={() => navigate('/music-search')}>
                      Listen Now
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 border border-dashed border-accent/50 rounded-lg">
                  <h3 className="font-medium mb-2">Retake Assessment</h3>
                  <p className="text-sm text-tertiary mb-4">Get updated recommendations for your current state</p>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => navigate('/therapy-assessment')}
                  >
                    Start Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
