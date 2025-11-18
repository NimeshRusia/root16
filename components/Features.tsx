import { Brain, TrendingUp, Shield, Zap, PieChart, Bell } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Advanced machine learning analyzes your spending patterns and provides actionable recommendations to optimize your finances.",
  },
  {
    icon: TrendingUp,
    title: "Smart Predictions",
    description: "Forecast future expenses and income with high accuracy. Plan ahead and avoid financial surprises.",
  },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "Your data is encrypted with military-grade security. We never sell or share your information.",
  },
  {
    icon: Zap,
    title: "Instant Automation",
    description: "Automatically categorize transactions, detect subscriptions, and track recurring payments effortlessly.",
  },
  {
    icon: PieChart,
    title: "Visual Analytics",
    description: "Beautiful dashboards and reports that make understanding your finances simple and intuitive.",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Get notified about unusual spending, bill reminders, and savings opportunities in real-time.",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/20" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-foreground">Everything You Need to</span>
            <br />
            <span className="bg-gradient-accent bg-clip-text text-transparent">Master Your Money</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Powerful features designed to give you complete control over your financial life.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-8 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
