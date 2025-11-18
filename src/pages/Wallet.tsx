import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowLeft, Plus, Wallet as WalletIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { getUserProfile, addTransaction, updateWalletBalance, saveUserProfile } from '@/lib/storage';
import { UserProfile, CategoryName } from '@/types/budget';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const transactionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
  vendor: z.string().min(1, 'Vendor is required'),
  description: z.string().optional(),
});

export default function Wallet() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isTopUpDialogOpen, setIsTopUpDialogOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [vendor, setVendor] = useState('');
  const [description, setDescription] = useState('');
  const [topUpAmount, setTopUpAmount] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    const userProfile = getUserProfile();
    if (!userProfile) {
      navigate('/onboarding');
      return;
    }
    setProfile(userProfile);
  };

  const handleAddTransaction = () => {
    try {
      transactionSchema.parse({
        amount: Number(amount),
        category,
        vendor,
        description,
      });

      addTransaction({
        amount: Number(amount),
        category: category as CategoryName,
        vendor,
        description: description || vendor,
        timestamp: new Date(),
        type: 'debit',
      });

      toast({
        title: 'Transaction Added',
        description: `₹${amount} spent on ${vendor}`,
      });

      setAmount('');
      setCategory('');
      setVendor('');
      setDescription('');
      setIsAddDialogOpen(false);
      loadProfile();
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

  const handleTopUp = () => {
    const topUp = Number(topUpAmount);
    if (topUp <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount',
        variant: 'destructive',
      });
      return;
    }

    updateWalletBalance(topUp);
    addTransaction({
      amount: topUp,
      category: 'food',
      vendor: 'Wallet Top-up',
      description: 'Manual wallet top-up',
      timestamp: new Date(),
      type: 'credit',
    });

    toast({
      title: 'Wallet Topped Up',
      description: `₹${topUp} added to your wallet`,
    });

    setTopUpAmount('');
    setIsTopUpDialogOpen(false);
    loadProfile();
  };

  if (!profile) return null;

  const totalSpent = profile.transactions
    .filter((t) => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Wallet & Transactions</h1>
              <p className="text-sm text-muted-foreground">Manage your finances</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Wallet Balance */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30 animate-fade-in">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <WalletIcon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
              <p className="text-4xl font-bold">₹{profile.walletBalance.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-background/50">
              <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-destructive">₹{totalSpent.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-lg bg-background/50">
              <p className="text-sm text-muted-foreground mb-1">Transactions</p>
              <p className="text-2xl font-bold">{profile.transactions.length}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => setIsTopUpDialogOpen(true)} className="flex-1" size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Top Up Wallet
            </Button>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </Card>

        {/* Transaction History */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Transaction History</h2>

          {profile.transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No transactions yet</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>Add Your First Transaction</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {profile.transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        transaction.type === 'debit'
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      {transaction.type === 'debit' ? (
                        <TrendingDown className="w-6 h-6" />
                      ) : (
                        <TrendingUp className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{transaction.vendor}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {transaction.category.replace('quickCommerce', 'Quick Commerce')} •{' '}
                        {new Date(transaction.timestamp).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-xl font-bold ${
                        transaction.type === 'debit' ? 'text-destructive' : 'text-primary'
                      }`}
                    >
                      {transaction.type === 'debit' ? '-' : '+'}₹{transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.timestamp).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Add Transaction Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogDescription>Record a new expense manually</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="shelter">Shelter</SelectItem>
                  <SelectItem value="quickCommerce">Quick Commerce</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="gyms">Gyms</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="vendor">Vendor / Place</Label>
              <Input
                id="vendor"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                placeholder="e.g., Zomato, Uber, Local Store"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a note"
                className="mt-2"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTransaction}>Add Transaction</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Top Up Dialog */}
      <Dialog open={isTopUpDialogOpen} onOpenChange={setIsTopUpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Top Up Wallet</DialogTitle>
            <DialogDescription>Add money to your demo wallet</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="topUpAmount">Amount (₹)</Label>
              <Input
                id="topUpAmount"
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                placeholder="Enter amount"
                className="mt-2"
              />
            </div>

            <div className="flex gap-2">
              {[1000, 5000, 10000, 20000].map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  size="sm"
                  onClick={() => setTopUpAmount(preset.toString())}
                >
                  ₹{preset}
                </Button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTopUpDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleTopUp}>Top Up</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
