import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "@/lib/storage";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const profile = getUserProfile();
    if (profile) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background font-['Inter']">
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
