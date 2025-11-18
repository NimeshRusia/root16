// src/components/CompareFood.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, ExternalLink, Star, Clock, TrendingDown } from 'lucide-react';
import { foodOptions } from '@/lib/mockData';
import { getUserProfile, addTransaction } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

export default function CompareFood() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const filteredOptions = foodOptions.filter((option) =>
    option.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
    option.restaurant.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cuisines = [
    'Chinese',
    'Italian',
    'South Indian',
    'North Indian',
    'Continental',
    'Mexican',
    'Thai',
    'Lebanese',
  ];

  const handleOrder = (option) => {
    const profile = getUserProfile();
    const amount = Number(option.totalCost || option.price || 0);

    if (!profile) {
      toast({
        title: 'Not signed in',
        description: 'Please complete onboarding first.',
        variant: 'destructive',
      });
      navigate('/onboarding');
      return;
    }

    if (profile.walletBalance < amount) {
      toast({
        title: 'Insufficient Balance',
        description: `You need ₹${amount} but have ₹${profile.walletBalance}. Top up your wallet first.`,
        variant: 'destructive',
      });
      // Optionally navigate to wallet:
      // navigate('/wallet');
      return;
    }

    // Confirm with user (simple native confirm)
    const confirmed = window.confirm(`Confirm order from ${option.restaurant} for ₹${amount}?`);
    if (!confirmed) return;

    // Create transaction — storage.addTransaction will update wallet balance
    addTransaction({
      amount,
      category: 'food',
      vendor: option.restaurant,
      description: `Ordered via CompareFood (${option.platform})`,
      timestamp: new Date(),
      type: 'debit',
    });

    toast({
      title: 'Order placed',
      description: `₹${amount} deducted from wallet for ${option.restaurant}`,
    });

    // redirect to wallet page so user sees updated balance & transactions
    navigate('/wallet');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Food Comparison</h1>
              <p className="text-sm text-muted-foreground">Find the best deals on food delivery</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-8 animate-fade-in">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cuisine (e.g., Chinese, Italian, South Indian) or restaurant"
              className="pl-10 h-12 text-lg"
            />
          </div>

          <div className="flex gap-2 mt-4 flex-wrap">
            {cuisines.map((cuisine) => (
              <Button
                key={cuisine}
                variant={searchQuery === cuisine ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSearchQuery(cuisine)}
              >
                {cuisine}
              </Button>
            ))}
            <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')}>
              Clear
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {filteredOptions.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No results found for "{searchQuery}"</p>
              <Button onClick={() => setSearchQuery('Chinese')}>Try Chinese Cuisine</Button>
            </Card>
          ) : (
            filteredOptions.map((option, index) => (
              <Card
                key={option.id}
                className="p-6 hover:shadow-glow transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image */}
                  <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={option.imageUrl}
                      alt={option.restaurant}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      {option.tags.map((tag) => (
                        <Badge
                          key={tag}
                          className="bg-primary/90 text-primary-foreground backdrop-blur-sm"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{option.restaurant}</h3>
                        <p className="text-sm text-muted-foreground">{option.cuisine}</p>
                      </div>
                      <Badge variant="outline" className="text-lg font-bold px-3 py-1">
                        {option.platform}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Total Cost</p>
                        <p className="text-2xl font-bold text-primary">₹{option.totalCost}</p>
                        <p className="text-xs text-muted-foreground line-through">
                          ₹{option.price + option.deliveryFee + option.discount}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Delivery</p>
                          <p className="font-semibold">{option.deliveryTime}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">Rating</p>
                          <p className="font-semibold">{option.rating}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Discount</p>
                          <p className="font-semibold text-primary">₹{option.discount}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* Open in Zomato (or platform) */}
                      <Button
                        className="flex-1"
                        size="lg"
                        onClick={() => {
                          if (option.zomatoUrl) {
                            window.open(option.zomatoUrl, '_blank', 'noopener,noreferrer');
                          } else {
                            alert('No link available for this restaurant.');
                          }
                        }}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open in {option.platform}
                      </Button>

                      {/* Mark as Ordered -> deduct from wallet */}
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => handleOrder(option)}
                      >
                        Ordered - ₹{option.totalCost}
                      </Button>

                      <Button variant="outline" size="lg">
                        View Menu
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Tips */}
        <Card className="mt-8 p-6 bg-primary/5 border-primary/20">
          <h3 className="font-semibold mb-3">💡 Money-Saving Tips</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Order during off-peak hours for better discounts</li>
            <li>• Check both apps for exclusive coupons before ordering</li>
            <li>• Group orders with friends to save on delivery fees</li>
            <li>• Consider restaurants with lower delivery fees in your area</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
