import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { shelterOptions } from '@/lib/mockData';
import { getUserProfile, addTransaction } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

export default function CompareShelter() {
  const [searchLocation, setSearchLocation] = useState('Koramangala');
  const navigate = useNavigate();
  const { toast } = useToast();

  const openListing = (platform, title, location) => {
    const q = encodeURIComponent(`${platform} ${title} ${location}`);
    window.open(`https://www.google.com/search?q=${q}`, '_blank', 'noopener,noreferrer');
  };

  const handleRent = (opt) => {
    const profile = getUserProfile();
    const amount = Number(opt.rent || 0);

    if (!profile) {
      toast({ title: 'Not signed in', description: 'Please finish onboarding first.', variant: 'destructive' });
      navigate('/onboarding');
      return;
    }

    if (profile.walletBalance < amount) {
      toast({ title: 'Insufficient Balance', description: `You need ₹${amount} but have ₹${profile.walletBalance}. Top up your wallet.`, variant: 'destructive' });
      return;
    }

    const confirmed = window.confirm(`Confirm renting "${opt.title}" for ₹${amount}?`);
    if (!confirmed) return;

    addTransaction({
      amount,
      category: 'shelter',
      vendor: opt.platform + ' - ' + opt.title,
      description: `Rented via CompareShelter`,
      timestamp: new Date(),
      type: 'debit',
    });

    toast({ title: 'Rented', description: `₹${amount} deducted for ${opt.title}` });
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
              <h1 className="text-xl font-bold">Shelter Comparison</h1>
              <p className="text-sm text-muted-foreground">Compare rentals & PG options</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="p-6 mb-8 animate-fade-in">
          <div className="space-y-4">
            <div>
              <Label htmlFor="location">Search Location</Label>
              <Input id="location" value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} placeholder="City / locality (e.g., Koramangala)" className="mt-2" />
            </div>
            <Button className="w-full" size="lg">Search Listings</Button>
          </div>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Listings near {searchLocation}</h2>

          {shelterOptions.map((opt, idx) => (
            <Card key={opt.id} className="p-6 hover:shadow-glow transition-all duration-300 animate-fade-in" style={{ animationDelay: `${idx * 0.07}s` }}>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold">{opt.title}</h3>
                    <Badge variant="outline">{opt.platform}</Badge>
                    {opt.tags?.map((t) => <Badge key={t} className="bg-primary/90 text-primary-foreground">{t}</Badge>)}
                  </div>
                  <p className="text-sm text-muted-foreground">Distance: {opt.distance}</p>

                  <div className="mt-3 grid grid-cols-3 gap-4">
                    <div><p className="text-xs text-muted-foreground">Rent</p><p className="font-semibold">₹{opt.rent}</p></div>
                    <div><p className="text-xs text-muted-foreground">Deposit</p><p className="font-semibold">₹{opt.deposit}</p></div>
                    <div><p className="text-xs text-muted-foreground">Rating</p><p className="font-semibold">{opt.rating}</p></div>
                  </div>

                  <div className="mt-3 text-sm text-muted-foreground">
                    <p className="font-medium mb-1">Amenities</p>
                    <div className="flex gap-2 flex-wrap">
                      {opt.amenities?.map((a) => <Badge key={a} className="bg-secondary/10 text-secondary-foreground">{a}</Badge>)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <Button size="lg" className="w-full md:w-auto" onClick={() => openListing(opt.platform, opt.title, searchLocation)}>
                    <ExternalLink className="w-4 h-4 mr-2" />Open {opt.platform}
                  </Button>

                  <Button variant="outline" size="lg" className="w-full md:w-auto" onClick={() => handleRent(opt)}>
                    Rent - ₹{opt.rent}
                  </Button>

                  <Button variant="outline" size="lg" className="w-full md:w-auto" onClick={() => { alert(`Contacting listing owner for "${opt.title}" (demo).`); }}>
                    Contact
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
