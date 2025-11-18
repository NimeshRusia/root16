// src/pages/CompareQuickCommerce.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, ShoppingBag } from 'lucide-react';
import { quickCommerceOptions } from '@/lib/mockData';
import { addTransaction } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

export default function CompareQuickCommerce() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const filtered = quickCommerceOptions.filter((item) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      (item.brand || '').toLowerCase().includes(q) ||
      (item.platform || '').toLowerCase().includes(q)
    );
  });

  const handleOpen = (url) => {
    if (!url) {
      toast({ title: 'No external link', description: 'This item is only available locally.' });
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOrder = (item) => {
    // Record a debit transaction — addTransaction will also update walletBalance in your storage util
    addTransaction({
      amount: item.totalCost || item.price,
      category: 'quickCommerce',
      vendor: `${item.platform} - ${item.title}`,
      description: `Ordered ${item.title}`,
      timestamp: new Date(),
      type: 'debit',
    });

    toast({
      title: 'Order recorded',
      description: `₹${item.totalCost || item.price} deducted for ${item.title}`,
    });
    // optional: go to wallet to see update
    navigate('/wallet');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Quick Commerce</h1>
            <p className="text-sm text-muted-foreground">Search groceries & quick items</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search e.g. tandoori sauce, milk, eggs..."
            className="h-12"
          />
        </div>

        {filtered.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No items found for "{query}"</p>
          </Card>
        ) : (
          filtered.map((item) => (
            <Card key={item.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={item.imageUrl} alt={item.title} className="w-20 h-20 object-cover rounded" />
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.brand} • {item.platform}</p>
                  <div className="mt-1 flex gap-2">
                    <Badge className="bg-primary/90 text-primary-foreground">{item.tags?.[0]}</Badge>
                    <span className="text-sm font-semibold">₹{item.totalCost}</span>
                    <span className="text-xs text-muted-foreground line-through">₹{item.price + item.deliveryFee}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button size="sm" variant="outline" onClick={() => handleOpen(item.platformUrl)}>
                  <ExternalLink className="w-4 h-4 mr-2" /> Open
                </Button>
                <Button size="sm" onClick={() => handleOrder(item)}>
                  <ShoppingBag className="w-4 h-4 mr-2" /> Order (Buy)
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
