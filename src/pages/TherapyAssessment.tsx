import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import RecommendedMusic from '@/components/RecommendedMusic';
import Header from '@/components/Header';

// Define the question structure
interface Question {
  id: number;
  text: string;
  category: 'mental' | 'physical' | 'impact';
}

// Define the mental health questions
const questions: Question[] = [
  { id: 1, text: "Little interest or pleasure in doing things", category: 'mental' },
  { id: 2, text: "Feeling down, depressed, or hopeless", category: 'mental' },
  { id: 3, text: "Trouble falling or staying asleep, or sleeping too much", category: 'mental' },
  { id: 4, text: "Feeling tired or having little energy", category: 'mental' },
  { id: 5, text: "Poor appetite or overeating", category: 'mental' },
  { id: 6, text: "Feeling bad about yourself, or that you are a failure or let others down", category: 'mental' },
  { id: 7, text: "Trouble concentrating on things like reading or watching TV", category: 'mental' },
  { id: 8, text: "Moving or speaking slowly, or being unusually fidgety or restless", category: 'mental' },
  { id: 9, text: "Thoughts that you'd be better off dead or of hurting yourself", category: 'mental' },
  { id: 10, text: "Headaches, tension, or pressure in the head", category: 'physical' },
  { id: 11, text: "Unexplained muscle aches or body pain", category: 'physical' },
  { id: 12, text: "Stomachaches, indigestion, or nausea", category: 'physical' },
  { id: 13, text: "Racing heart or chest tightness (not due to physical exertion)", category: 'physical' },
  { id: 14, text: "Shortness of breath or trouble breathing", category: 'physical' },
  { id: 15, text: "Dizziness or feeling faint", category: 'physical' },
  { id: 16, text: "Sweating, shaking, or trembling without physical cause", category: 'physical' },
  { id: 17, text: "Feeling exhausted even after resting or sleeping", category: 'physical' },
  { id: 18, text: "Clenching your jaw or grinding your teeth", category: 'physical' },
  { id: 19, text: "If you checked any problems, how difficult have these made your daily life (work, home, relationships)?", category: 'impact' }
];

// Define available answers
const answers = [
  { value: '0', label: 'Not at all', mentalScore: 0, physicalScore: 0 },
  { value: '1', label: 'Several days', mentalScore: 1, physicalScore: 1 },
  { value: '2', label: 'More than half the days', mentalScore: 2, physicalScore: 2 },
  { value: '3', label: 'Nearly every day', mentalScore: 3, physicalScore: 3 }
];

const impactAnswers = [
  { value: '0', label: 'Not difficult at all' },
  { value: '1', label: 'Somewhat difficult' },
  { value: '2', label: 'Very difficult' },
  { value: '3', label: 'Extremely difficult' }
];

export default function TherapyAssessment() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [showRecommendedMusic, setShowRecommendedMusic] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<any>(null);
  
  const questionsPerPage = 5;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = Math.min(startIndex + questionsPerPage, questions.length);
  const currentQuestions = questions.slice(startIndex, endIndex);
  
  const progress = (currentPage / totalPages) * 100;
  
  const handleAnswer = (questionId: number, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    } else {
      // Calculate results
      setShowResults(true);
      window.scrollTo(0, 0);
    }
  };
  
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const isCurrentPageComplete = () => {
    return currentQuestions.every(q => responses[q.id]);
  };

  const calculateResults = () => {
    let mentalScore = 0;
    let physicalScore = 0;
    let impactScore = 0;
    
    // Calculate mental health score (PHQ-9)
    for (let i = 1; i <= 9; i++) {
      mentalScore += parseInt(responses[i] || '0');
    }
    
    // Calculate physical symptoms score
    for (let i = 10; i <= 18; i++) {
      physicalScore += parseInt(responses[i] || '0');
    }
    
    // Get impact score
    impactScore = parseInt(responses[19] || '0');
    
    return {
      mentalScore,
      mentalSeverity: interpretMentalScore(mentalScore),
      physicalScore,
      physicalSeverity: interpretPhysicalScore(physicalScore),
      impactScore,
      impactSeverity: interpretImpactScore(impactScore),
      recommendedTherapy: recommendTherapy(mentalScore, physicalScore)
    };
  };
  
  const interpretMentalScore = (score: number) => {
    if (score < 5) return { level: 'Minimal', description: 'You are experiencing minimal depressive symptoms.' };
    if (score < 10) return { level: 'Mild', description: 'You are experiencing mild depressive symptoms.' };
    if (score < 15) return { level: 'Moderate', description: 'You are experiencing moderate depressive symptoms.' };
    if (score < 20) return { level: 'Moderately Severe', description: 'You are experiencing moderately severe depressive symptoms.' };
    return { level: 'Severe', description: 'You are experiencing severe depressive symptoms.' };
  };
  
  const interpretPhysicalScore = (score: number) => {
    if (score < 9) return { level: 'Minimal', description: 'Your physical symptoms are minimal.' };
    if (score < 18) return { level: 'Mild', description: 'You have mild physical symptoms.' };
    return { level: 'Significant', description: 'Your physical symptoms are significant.' };
  };
  
  const interpretImpactScore = (score: number) => {
    if (score === 0) return { level: 'None', description: 'No impact on daily functioning.' };
    if (score === 1) return { level: 'Mild', description: 'Mild impact on daily functioning.' };
    if (score === 2) return { level: 'Moderate', description: 'Moderate impact on daily functioning.' };
    return { level: 'Severe', description: 'Severe impact on daily functioning.' };
  };
  
  const recommendTherapy = (mentalScore: number, physicalScore: number) => {
    const totalScore = mentalScore + physicalScore;
    
    if (totalScore < 10) {
      return {
        ragas: ['Raag Bhimpalasi (Morning)', 'Raag Desh (Evening)'],
        frequencies: ['432 Hz (Alpha waves - relaxation)'],
        duration: '15 minutes daily',
        description: 'Gentle ragas for maintaining mental wellness and relaxation.',
        condition: 'anxiety',
        severity: 'mild'
      };
    }
    if (totalScore < 20) {
      return {
        ragas: ['Raag Bhairav (Morning)', 'Raag Bhimpalasi (Afternoon)', 'Raag Darbari (Night)'],
        frequencies: ['432 Hz (Alpha waves)', '528 Hz (Transformation)'],
        duration: '20 minutes, twice daily',
        description: 'Moderate intensity ragas for stress reduction and mood enhancement.',
        condition: mentalScore > physicalScore ? 'depression' : 'stress',
        severity: 'moderate'
      };
    }
    return {
      ragas: ['Raag Ahir Bhairav (Dawn)', 'Raag Bhupali (Evening)', 'Raag Darbari (Night)'],
      frequencies: ['396 Hz (Root chakra)', '528 Hz (Heart chakra)', '639 Hz (Third eye)'],
      duration: '30 minutes, twice daily',
      description: 'Intensive raga therapy for significant symptoms, with multi-frequency sessions.',
      condition: mentalScore > physicalScore ? 'depression' : 'stress',
      severity: 'severe'
    };
  };
  
  const results = calculateResults();
  
  // Save progress data for a therapy session
  const handleLogProgress = () => {
    const today = new Date();
    const newEntry = {
      date: today.toISOString(),
      duration: parseInt(results.recommendedTherapy.duration.split(' ')[0]),
      completed: true,
      therapy: selectedTrack.title || `Therapy for ${results.recommendedTherapy.condition}`
    };
    
    const existingData = JSON.parse(localStorage.getItem('therapyProgress') || '[]');
    localStorage.setItem('therapyProgress', JSON.stringify([...existingData, newEntry]));
  };
  
  // Handle track selection
  const handleTrackSelected = (track: any) => {
    setSelectedTrack(track);
  };
  
  const handleStartTherapy = () => {
    // In a real app, you would save the assessment results to the user's profile
    localStorage.setItem('assessmentResults', JSON.stringify(results));
    setShowRecommendedMusic(true);
  };
  
  const handleStartJourney = () => {
    navigate('/music-search');
  };
  
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Personalized Therapy Assessment</h1>
          <p className="text-muted-foreground">
            Your responses will help us create a tailored sound therapy plan
          </p>
        </div>
        
        {!showResults ? (
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  {currentPage === totalPages && currentQuestions[0].category === 'impact'
                    ? 'Functional Impact'
                    : currentQuestions[0].category === 'mental'
                    ? 'Mental Health'
                    : 'Physical Symptoms'}
                </CardTitle>
                <Badge className="bg-primary/20 text-primary border-none px-2">
                  Page {currentPage} of {totalPages}
                </Badge>
              </div>
              <CardDescription>
                For each statement below, select how often you've been bothered by the problem in the last 2 weeks.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Progress value={progress} className="mb-6" />
              
              <div className="space-y-8">
                {currentQuestions.map((question) => (
                  <div key={question.id} className="space-y-4">
                    <div className="flex items-start">
                      <span className="bg-primary/10 text-primary text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">
                        {question.id}
                      </span>
                      <p className="font-medium">{question.text}</p>
                    </div>
                    
                    <RadioGroup
                      value={responses[question.id] || ''}
                      onValueChange={(value) => handleAnswer(question.id, value)}
                      className="grid grid-cols-2 sm:grid-cols-4 gap-2"
                    >
                      {(question.category === 'impact' ? impactAnswers : answers).map((answer) => (
                        <div key={answer.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={answer.value} id={`q${question.id}-${answer.value}`} />
                          <Label htmlFor={`q${question.id}-${answer.value}`} className="text-sm cursor-pointer">
                            {answer.label} {question.category !== 'impact' && `(${answer.value})`}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!isCurrentPageComplete()}
              >
                {currentPage === totalPages ? 'View Results' : 'Next'}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="space-y-6">
            {!showRecommendedMusic ? (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Your Assessment Results</CardTitle>
                  <CardDescription>
                    Based on your responses, we've created a personalized sound therapy recommendation
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-primary/5 p-4 rounded-lg">
                        <h3 className="font-medium mb-1">Mental Health</h3>
                        <div className="text-3xl font-bold">{results.mentalScore}/27</div>
                        <div className="text-sm font-medium text-primary mt-1">{results.mentalSeverity.level}</div>
                        <p className="text-xs text-muted-foreground mt-2">{results.mentalSeverity.description}</p>
                      </div>
                      
                      <div className="bg-secondary/5 p-4 rounded-lg">
                        <h3 className="font-medium mb-1">Physical Symptoms</h3>
                        <div className="text-3xl font-bold">{results.physicalScore}/27</div>
                        <div className="text-sm font-medium text-secondary mt-1">{results.physicalSeverity.level}</div>
                        <p className="text-xs text-muted-foreground mt-2">{results.physicalSeverity.description}</p>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-lg">
                        <h3 className="font-medium mb-1">Functional Impact</h3>
                        <div className="text-3xl font-bold">{results.impactScore}/3</div>
                        <div className="text-sm font-medium mt-1">{results.impactSeverity.level}</div>
                        <p className="text-xs text-muted-foreground mt-2">{results.impactSeverity.description}</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-muted pt-6">
                      <h3 className="font-medium text-lg mb-4">Your Personalized Sound Therapy Plan</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium">Recommended Ragas:</h4>
                          <ul className="list-disc list-inside text-sm pl-2 text-muted-foreground">
                            {results.recommendedTherapy.ragas.map((raga, index) => (
                              <li key={index}>{raga}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium">Beneficial Frequencies:</h4>
                          <ul className="list-disc list-inside text-sm pl-2 text-muted-foreground">
                            {results.recommendedTherapy.frequencies.map((freq, index) => (
                              <li key={index}>{freq}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium">Recommended Duration:</h4>
                          <p className="text-sm text-muted-foreground">{results.recommendedTherapy.duration}</p>
                        </div>
                        
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h4 className="text-sm font-medium">Therapy Description:</h4>
                          <p className="text-sm text-muted-foreground">{results.recommendedTherapy.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-6">
                  <Button onClick={handleStartTherapy} className="w-full">
                    Start Your Therapy Journey
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="space-y-6">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Recommended Music for {results.recommendedTherapy.condition.charAt(0).toUpperCase() + results.recommendedTherapy.condition.slice(1)}</CardTitle>
                    <CardDescription>
                      Listen to these specially curated tracks to help with your symptoms
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-0">
                    <RecommendedMusic 
                      condition={results.recommendedTherapy.condition} 
                      severity={results.recommendedTherapy.severity}
                      onTrackSelected={handleTrackSelected}
                      onLogProgress={handleLogProgress}
                    />
                  </CardContent>
                  <CardFooter className="pt-6">
                    <Button onClick={handleStartJourney} className="w-full">
                      Continue to Music Library
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-yellow-700 text-sm">
              <div className="font-medium">Important Note</div>
              <p>This assessment is not a substitute for professional medical advice. If you're experiencing severe symptoms, please consult a healthcare provider.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
