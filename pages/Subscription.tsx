import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, Crown, Zap, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: 0,
    icon: Sparkles,
    popular: false,
    features: [
      'Basic comparisons across 2 platforms',
      'Manual transaction tracking',
      'Budget alerts',
      'Up to 50 transactions/month',
      'Basic spending insights',
      'Email support',
    ],
    limitations: ['Limited platform access', 'No AI recommendations', 'No price alerts'],
  },
  {
    name: 'Pro',
    price: 299,
    icon: Zap,
    popular: true,
    features: [
      'All Free features',
      'Comparisons across 5+ platforms',
      'AI-powered recommendations',
      'Unlimited transactions',
      'Advanced spending predictions',
      '3 premium suggestions/day',
      'Auto-apply coupons',
      'Price drop alerts',
      'Priority email support',
    ],
    limitations: [],
  },
  {
    name: 'Premium',
    price: 599,
    icon: Crown,
    popular: false,
    features: [
      'All Pro features',
      'Unlimited platform access',
      'Real-time API integrations',
      'Unlimited AI suggestions',
      'Personalized ML insights',
      'Shelter negotiation assistant',
      'Transaction auto-categorization',
      'Custom budget rules',
      'Dedicated phone support',
      'Early access to new features',
    ],
    limitations: [],
  },
];

export default function Subscription() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Choose Your Plan</h1>
              <p className="text-sm text-muted-foreground">Unlock more savings with premium features</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-accent bg-clip-text text-transparent">Simple, Transparent Pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works best for you. All plans include core budget tracking.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <Card
                key={plan.name}
                className={`p-8 relative animate-fade-in ${
                  plan.popular
                    ? 'border-primary shadow-glow bg-gradient-to-b from-card to-primary/5'
                    : 'border-border'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}

                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">₹{plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.popular
                      ? 'bg-primary hover:bg-primary/90'
                      : 'bg-secondary hover:bg-secondary/90'
                  }`}
                  size="lg"
                >
                  {plan.price === 0 ? 'Current Plan' : 'Upgrade Now'}
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Feature Comparison */}
        <Card className="p-8 animate-fade-in">
          <h3 className="text-2xl font-bold mb-6 text-center">Feature Comparison</h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 font-semibold">Feature</th>
                  <th className="text-center py-4 font-semibold">Free</th>
                  <th className="text-center py-4 font-semibold">Pro</th>
                  <th className="text-center py-4 font-semibold">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { feature: 'Platform Comparisons', free: '2', pro: '5+', premium: 'Unlimited' },
                  { feature: 'Monthly Transactions', free: '50', pro: 'Unlimited', premium: 'Unlimited' },
                  { feature: 'AI Recommendations', free: '—', pro: '3/day', premium: 'Unlimited' },
                  { feature: 'Price Drop Alerts', free: '—', pro: '✓', premium: '✓' },
                  { feature: 'Auto Coupon Apply', free: '—', pro: '✓', premium: '✓' },
                  { feature: 'Negotiation Assistant', free: '—', pro: '—', premium: '✓' },
                  { feature: 'Custom Budget Rules', free: '—', pro: '—', premium: '✓' },
                  { feature: 'Priority Support', free: '—', pro: 'Email', premium: 'Phone + Email' },
                ].map((row) => (
                  <tr key={row.feature}>
                    <td className="py-4">{row.feature}</td>
                    <td className="text-center py-4">{row.free}</td>
                    <td className="text-center py-4">{row.pro}</td>
                    <td className="text-center py-4">{row.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* FAQ */}
        <div className="mt-12 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h3>

          <div className="space-y-4">
            {[
              {
                q: 'Can I switch plans anytime?',
                a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.',
              },
              {
                q: 'Is my payment information secure?',
                a: 'Absolutely. We use industry-standard encryption and never store your card details.',
              },
              {
                q: 'What happens if I cancel?',
                a: "You'll keep access to paid features until the end of your billing period, then automatically switch to Free.",
              },
              {
                q: 'Do you offer refunds?',
                a: 'Yes, we offer a 14-day money-back guarantee on all paid plans.',
              },
            ].map((faq) => (
              <Card key={faq.q} className="p-6 hover:shadow-card transition-all">
                <h4 className="font-semibold mb-2">{faq.q}</h4>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
