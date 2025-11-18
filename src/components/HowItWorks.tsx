import { Wallet, Scan, Target, Rocket } from "lucide-react";

const steps = [
  {
    icon: Wallet,
    title: "Connect Your Accounts",
    description: "Securely link your bank accounts, credit cards, and financial accounts in seconds.",
    number: "01",
  },
  {
    icon: Scan,
    title: "AI Analyzes Everything",
    description: "Our AI automatically categorizes transactions and identifies spending patterns.",
    number: "02",
  },
  {
    icon: Target,
    title: "Get Personalized Insights",
    description: "Receive tailored recommendations and actionable insights to improve your finances.",
    number: "03",
  },
  {
    icon: Rocket,
    title: "Achieve Your Goals",
    description: "Track progress, optimize spending, and reach your financial goals faster than ever.",
    number: "04",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-foreground">Get Started in</span>
            <br />
            <span className="bg-gradient-accent bg-clip-text text-transparent">Four Simple Steps</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From setup to success in minutes. No complex configuration required.
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 -translate-y-1/2" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Number badge */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-glow">
                  {step.number}
                </div>

                {/* Content card */}
                <div className="pt-12 pb-8 px-6 text-center bg-card border border-border rounded-2xl hover:border-primary/50 transition-all duration-300 hover:shadow-card group">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
