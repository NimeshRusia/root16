import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-primary opacity-10" />
      
      {/* Glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-4xl mx-auto text-center animate-fade-in">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          <span className="text-foreground">Ready to Transform</span>
          <br />
          <span className="bg-gradient-accent bg-clip-text text-transparent">Your Finances?</span>
        </h2>

        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Join thousands of users who have already taken control of their financial future. 
          Start your free 14-day trial today—no credit card required.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow group px-10 py-7 text-lg font-semibold"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-primary/30 hover:bg-primary/10 text-foreground px-10 py-7 text-lg font-semibold"
          >
            Schedule a Demo
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-8">
          ✓ Free 14-day trial  ✓ No credit card required  ✓ Cancel anytime
        </p>
      </div>
    </section>
  );
};
