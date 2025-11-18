// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  UtensilsCrossed,
  Car,
  Home,
  ShoppingBag,
  Heart,
  Dumbbell,
  Plus,
  Wallet,
  Crown,
  TrendingUp,
  AlertCircle,
  LogOut,
} from 'lucide-react';
import { getUserProfile, clearUserProfile } from '@/lib/storage';
import { UserProfile, CategoryName } from '@/types/budget';
import { useToast } from '@/hooks/use-toast';

const categoryIcons: Record<CategoryName, any> = {
  food: UtensilsCrossed,
  travel: Car,
  shelter: Home,
  quickCommerce: ShoppingBag,
  healthcare: Heart,
  gyms: Dumbbell,
};

const categoryColors: Record<CategoryName, string> = {
  food: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
  travel: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
  shelter: 'from-green-500/20 to-green-600/20 border-green-500/30',
  quickCommerce: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
  healthcare: 'from-red-500/20 to-red-600/20 border-red-500/30',
  gyms: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30',
};

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [greeting, setGreeting] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userProfile = getUserProfile();
    if (!userProfile) {
      navigate('/onboarding');
      return;
    }
    setProfile(userProfile);

    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, [navigate]);

  if (!profile) return null;

  const totalSpent = profile.transactions
    .filter((t) => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);
  const remaining = profile.monthlyBudget.total - totalSpent;
  const percentageUsed = (totalSpent / profile.monthlyBudget.total) * 100;

  const categorySpent = Object.entries(profile.monthlyBudget.categories).map(([key, budget]) => {
    const spent = profile.transactions
      .filter((t) => t.type === 'debit' && t.category === key)
      .reduce((sum, t) => sum + t.amount, 0);
    return { category: key as CategoryName, budget, spent, remaining: budget - spent };
  });

  const handleLogout = () => {
    const ok = window.confirm('Are you sure you want to log out? This will clear your saved profile.');
    if (!ok) return;
    clearUserProfile();
    setProfile(null);
    toast({
      title: 'Logged out',
      description: 'You have been logged out and returned to the landing page.',
    });
    // navigate to landing page (Index)
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Wallet className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">SpendSmart AI</h1>
              <p className="text-xs text-muted-foreground">Your Financial Companion</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/subscription')}
              className="border-primary/30"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="border-transparent text-destructive"
              title="Log out"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Greeting */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold mb-2">
            {greeting}, {profile.name.split(' ')[0]} 👋
          </h2>
          <p className="text-muted-foreground">How can I help you save money today?</p>
        </div>

        {/* Budget Overview */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-card to-secondary/20 border-border animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Monthly Budget</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/wallet')}
              className="text-primary"
            >
              View Details
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
              <p className="text-3xl font-bold text-foreground">₹{profile.monthlyBudget.total.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Spent</p>
              <p className="text-3xl font-bold text-destructive">₹{totalSpent.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Remaining</p>
              <p className="text-3xl font-bold text-primary">₹{remaining.toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Budget Used</span>
              <span className="font-medium">{percentageUsed.toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  percentageUsed > 80 ? 'bg-destructive' : 'bg-primary'
                }`}
                style={{ width: `${Math.min(percentageUsed, 100)}%` }}
              />
            </div>
          </div>

          {percentageUsed > 80 && (
            <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">Budget Alert</p>
                <p className="text-xs text-muted-foreground mt-1">
                  You've used {percentageUsed.toFixed(0)}% of your monthly budget. Consider reducing
                  spending.
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Category Tiles */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {(Object.keys(categoryIcons) as CategoryName[]).map((category, index) => {
              const Icon = categoryIcons[category];
              const categoryData = categorySpent.find((c) => c.category === category);
              const percentUsed = categoryData
                ? (categoryData.spent / categoryData.budget) * 100
                : 0;

              return (
                <Card
                  key={category}
                  className={`p-6 cursor-pointer hover:shadow-glow transition-all duration-300 group bg-gradient-to-br ${categoryColors[category]} animate-fade-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => navigate(`/compare/${category}`)}
                >
                  <Icon className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold capitalize mb-2">{category.replace('quickCommerce', 'Quick Commerce')}</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Spent</span>
                      <span>₹{categoryData?.spent.toLocaleString() || 0}</span>
                    </div>
                    <div className="h-1.5 bg-background/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${Math.min(percentUsed, 100)}%` }}
                      />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 hover:shadow-card transition-all">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold">₹{Math.floor(totalSpent / profile.transactions.filter(t => t.type === 'debit').length || 0)}</span>
            </div>
            <p className="text-sm text-muted-foreground">Avg Transaction</p>
          </Card>

          <Card className="p-6 hover:shadow-card transition-all">
            <div className="flex items-center justify-between mb-2">
              <Wallet className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold">₹{profile.walletBalance.toLocaleString()}</span>
            </div>
            <p className="text-sm text-muted-foreground">Wallet Balance</p>
          </Card>

          <Card className="p-6 hover:shadow-card transition-all">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold">{profile.transactions.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Total Transactions</p>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/wallet')}
              className="text-primary"
            >
              View All
            </Button>
          </div>

          {profile.transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No transactions yet</p>
              <Button onClick={() => navigate('/wallet')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {profile.transactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {(() => {
                      const Icon = categoryIcons[transaction.category];
                      return Icon ? <Icon className="w-5 h-5 text-primary" /> : null;
                    })()}
                    <div>
                      <p className="font-medium">{transaction.vendor}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {transaction.category.replace('quickCommerce', 'Quick Commerce')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        transaction.type === 'debit' ? 'text-destructive' : 'text-primary'
                      }`}
                    >
                      {transaction.type === 'debit' ? '-' : '+'}₹{transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
