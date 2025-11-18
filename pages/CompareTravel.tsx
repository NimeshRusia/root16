import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, ExternalLink, Star, Clock } from 'lucide-react';
import { rideOptions } from '@/lib/mockData';
import { getUserProfile, addTransaction } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

const UBER_FALLBACK_LINK =
  'https://m.uber.com/go/product-selection?drop%5B0%5D=%7B%22addressLine1%22%3A%22Kempegowda%20International%20Airport%20Bengaluru%22%2C%22addressLine2%22%3A%22Karnataka%22%2C%22id%22%3A%22ChIJZWJEdf4crjsRjkEpoelwbCk%22%2C%22source%22%3A%22SEARCH%22%2C%22latitude%22%3A13.198909%2C%22longitude%22%3A77.7068926%2C%22provider%22%3A%22google_places%22%7D&effect=&marketing_vistor_id=98eea85e-6b59-4878-8692-b6ba7ac06445&pickup=%7B%22addressLine1%22%3A%22Nish%207%20Apartments%22%2C%22addressLine2%22%3A%22Ashwatnagar%2C%20NO.%2C%2028%2C%201st%20Cross%20Rd%2C%20RMV%202nd%20Stage%2C%20Ashwath%20Nagar%2C%20R.M.V.%202nd%20Stage%2C%20Bengaluru%2C%20Karnataka%22%2C%22id%22%3A%22ChIJn6NrfsYXrjsRbgMzQmo91mY%22%2C%22source%22%3A%22SEARCH%22%2C%22latitude%22%3A13.0256998%2C%22longitude%22%3A77.5794183%2C%22provider%22%3A%22google_places%22%7D&uclick_id=73bc758b-c635-48fb-9973-7d579f28318d&vehicle=20030587';

export default function CompareTravel() {
  const [origin, setOrigin] = useState('Koramangala');
  const [destination, setDestination] = useState('HSR Layout');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBookRide = (option) => {
    const profile = getUserProfile();
    const amount = Number(option.estimatedFare || 0);

    if (!profile) {
      toast({
        title: 'Not signed in',
        description: 'Please finish onboarding first.',
        variant: 'destructive',
      });
      navigate('/onboarding');
      return;
    }

    if (profile.walletBalance < amount) {
      toast({
        title: 'Insufficient Balance',
        description: `You need ₹${amount} but have ₹${profile.walletBalance}. Top up your wallet.`,
        variant: 'destructive',
      });
      return;
    }

    const confirmed = window.confirm(`Confirm booking ${option.platform} (${option.vehicleType}) for ₹${amount}?`);
    if (!confirmed) return;

    addTransaction({
      amount,
      category: 'travel',
      vendor: `${option.platform} - ${option.vehicleType}`,
      description: `Booked via CompareTravel`,
      timestamp: new Date(),
      type: 'debit',
    });

    toast({
      title: 'Ride booked',
      description: `₹${amount} deducted for ${option.platform}.`,
    });

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
              <h1 className="text-xl font-bold">Travel Comparison</h1>
              <p className="text-sm text-muted-foreground">Compare ride fares across platforms</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="p-6 mb-8 animate-fade-in">
          <div className="space-y-4">
            <div>
              <Label htmlFor="origin">Pick-up Location</Label>
              <div className="relative mt-2">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <Input id="origin" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Enter pick-up location" className="pl-10" />
              </div>
            </div>

            <div>
              <Label htmlFor="destination">Drop Location</Label>
              <div className="relative mt-2">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-destructive" />
                <Input id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Enter drop location" className="pl-10" />
              </div>
            </div>

            <Button className="w-full" size="lg">Find Best Rides</Button>
          </div>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Available Rides</h2>

          {rideOptions.map((option, index) => {
            const hasPlatformUrl = Boolean(option.platformUrl);
            const canOpen = hasPlatformUrl || option.platform === 'Uber';
            const openUrl = () => {
              if (hasPlatformUrl && option.platformUrl) window.open(option.platformUrl, '_blank', 'noopener,noreferrer');
              else if (option.platform === 'Uber') window.open(UBER_FALLBACK_LINK, '_blank', 'noopener,noreferrer');
            };

            return (
              <Card key={option.id} className="p-6 hover:shadow-glow transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold">{option.platform}</h3>
                          <Badge variant="outline">{option.vehicleType}</Badge>
                          {option.tags?.map((tag) => <Badge key={tag} className="bg-primary/90 text-primary-foreground">{tag}</Badge>)}
                        </div>
                        <p className="text-sm text-muted-foreground">{origin} → {destination}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Estimated Fare</p>
                        <p className="text-2xl font-bold text-primary">₹{option.estimatedFare}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">ETA</p>
                          <p className="font-semibold">{option.eta}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">Rating</p>
                          <p className="font-semibold">{option.rating}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 w-full md:w-auto">
                    <Button className="w-full md:w-auto" size="lg" onClick={openUrl} disabled={!canOpen}>
                      <ExternalLink className="w-4 h-4 mr-2" />{canOpen ? `Open ${option.platform}` : `${option.platform} Link Unavailable`}
                    </Button>

                    <Button variant="outline" className="w-full md:w-auto" onClick={() => handleBookRide(option)}>
                      Book - ₹{option.estimatedFare}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
