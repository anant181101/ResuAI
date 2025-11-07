import { CheckCircle2, FileText, Sparkles } from 'lucide-react';
import HeroSection from '../components/HeroSection.jsx';
import FeatureCard from '../components/FeatureCard.jsx';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <section className="container grid md:grid-cols-3 gap-6 py-10">
        <FeatureCard icon={CheckCircle2} title="3–5 Actionable Feedback" desc="Specific fixes to improve clarity, keywords, and impact." to="/upload" cta="Analyze Now" />
        <FeatureCard icon={FileText} title="ATS Breakdown" desc="Keywords, readability, format, and impact with a clear score." to="/upload" cta="Analyze Now" />
        <FeatureCard icon={Sparkles} title="JD Match" desc="Paste a JD to see matched and missing skills instantly." to="/upload" cta="Analyze Now" />
      </section>
    </div>
  );
}
