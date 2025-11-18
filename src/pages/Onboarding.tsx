import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowRight, Sparkles } from 'lucide-react';
import { z } from 'zod';
import { saveUserProfile } from '@/lib/storage';
import { UserProfile } from '@/types/budget';
import { useToast } from '@/hooks/use-toast';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
});

const budgetSchema = z.object({
  total: z.number().min(1000, 'Budget must be at least ₹1000'),
  food: z.number().min(0),
  travel: z.number().min(0),
  shelter: z.number().min(0),
  quickCommerce: z.number().min(0),
  healthcare: z.number().min(0),
  gyms: z.number().min(0),
  payCycleDay: z.number().min(1).max(31),
});

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Step 1: Profile
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Step 2: Budget
  const [totalBudget, setTotalBudget] = useState('50000');
  const [foodBudget, setFoodBudget] = useState('10000');
  const [travelBudget, setTravelBudget] = useState('5000');
  const [shelterBudget, setShelterBudget] = useState('20000');
  const [quickCommerceBudget, setQuickCommerceBudget] = useState('5000');
  const [healthcareBudget, setHealthcareBudget] = useState('5000');
  const [gymsBudget, setGymsBudget] = useState('2000');
  const [payCycleDay, setPayCycleDay] = useState('1');

  const handleProfileSubmit = () => {
    try {
      profileSchema.parse({ name, email, phone });
      setStep(2);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation Error',
          description: error.issues[0].message,
          variant: 'destructive',
        });
      }
    }
  };

  const handleBudgetSubmit = () => {
    try {
      const budgetData = {
        total: Number(totalBudget),
        food: Number(foodBudget),
        travel: Number(travelBudget),
        shelter: Number(shelterBudget),
        quickCommerce: Number(quickCommerceBudget),
        healthcare: Number(healthcareBudget),
        gyms: Number(gymsBudget),
        payCycleDay: Number(payCycleDay),
      };

      budgetSchema.parse(budgetData);

      const userProfile: UserProfile = {
        name,
        email,
        phone,
        monthlyBudget: {
          total: budgetData.total,
          categories: {
            food: budgetData.food,
            travel: budgetData.travel,
            shelter: budgetData.shelter,
            quickCommerce: budgetData.quickCommerce,
            healthcare: budgetData.healthcare,
            gyms: budgetData.gyms,
          },
          payCycleDay: budgetData.payCycleDay,
        },
        walletBalance: budgetData.total,
        transactions: [],
        subscriptionTier: 'free',
      };

      saveUserProfile(userProfile);
      toast({
        title: 'Welcome to SpendSmart AI! 🎉',
        description: 'Your profile has been created successfully.',
      });
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation Error',
          description: error.issues[0].message,
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 bg-card border-border shadow-card">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Getting Started</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {step === 1 ? 'Create Your Profile' : 'Set Your Budget'}
          </h1>
          <p className="text-muted-foreground">
            {step === 1
              ? 'Tell us about yourself to get started'
              : 'Define your monthly budget and category limits'}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex gap-2 mb-8">
          <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 1234567890"
                className="mt-2"
              />
            </div>

            <Button onClick={handleProfileSubmit} className="w-full" size="lg">
              Continue
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <Label htmlFor="total">Total Monthly Budget (₹)</Label>
              <Input
                id="total"
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                placeholder="50000"
                className="mt-2"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="food">Food Budget (₹)</Label>
                <Input
                  id="food"
                  type="number"
                  value={foodBudget}
                  onChange={(e) => setFoodBudget(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="travel">Travel Budget (₹)</Label>
                <Input
                  id="travel"
                  type="number"
                  value={travelBudget}
                  onChange={(e) => setTravelBudget(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="shelter">Shelter Budget (₹)</Label>
                <Input
                  id="shelter"
                  type="number"
                  value={shelterBudget}
                  onChange={(e) => setShelterBudget(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="quickCommerce">Quick Commerce Budget (₹)</Label>
                <Input
                  id="quickCommerce"
                  type="number"
                  value={quickCommerceBudget}
                  onChange={(e) => setQuickCommerceBudget(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="healthcare">Healthcare Budget (₹)</Label>
                <Input
                  id="healthcare"
                  type="number"
                  value={healthcareBudget}
                  onChange={(e) => setHealthcareBudget(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="gyms">Gyms Budget (₹)</Label>
                <Input
                  id="gyms"
                  type="number"
                  value={gymsBudget}
                  onChange={(e) => setGymsBudget(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="payCycle">Pay Cycle Day (1-31)</Label>
              <Input
                id="payCycle"
                type="number"
                min="1"
                max="31"
                value={payCycleDay}
                onChange={(e) => setPayCycleDay(e.target.value)}
                placeholder="1"
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Day of the month you receive your salary
              </p>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => setStep(1)} variant="outline" className="flex-1" size="lg">
                Back
              </Button>
              <Button onClick={handleBudgetSubmit} className="flex-1" size="lg">
                Complete Setup
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
