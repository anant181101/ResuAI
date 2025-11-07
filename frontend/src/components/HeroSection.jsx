import { motion } from 'framer-motion';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroIllustration from '../assets/illustrations/ai-hero.svg';

export default function HeroSection() {
  const [p, setP] = useState({ x: 0, y: 0 });
  return (
    <section
      className="container py-20 grid md:grid-cols-2 gap-10 items-center relative overflow-hidden"
      onMouseMove={(e)=>{
        const r = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        setP({ x, y });
      }}
    >
      <div
        className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl"
        style={{ transform: `translate3d(${p.x * 30}px, ${p.y * 30}px, 0)` }}
      />
      <div
        className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-tr from-accent/15 to-primary/15 blur-3xl"
        style={{ transform: `translate3d(${p.x * -20}px, ${p.y * -20}px, 0)` }}
      />
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight"
        >
          Land Your Next Role with an AI-Powered Resume
        </motion.h1>
        <p className="mt-6 text-lg text-gray-600">
          Upload your resume to get an ATS score, actionable improvements, and a polished LinkedIn bio.
        </p>
        <div className="mt-8 flex gap-4">
          <Link to="/upload" className="rounded-md bg-primary text-white px-6 py-3 hover:brightness-110">Get Started</Link>
          <Link to="/pricing" className="rounded-md border px-6 py-3 hover:bg-gray-50">See Pricing</Link>
        </div>
        <div className="mt-8 flex items-center gap-2 text-sm text-gray-500">
          <Sparkles className="h-4 w-4"/> Powered by OpenAI/Gemini
        </div>
      </div>
      <motion.img
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="w-full max-w-xl mx-auto"
        src={heroIllustration}
        alt="AI Illustration"
      />
    </section>
  );
}
