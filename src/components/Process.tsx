import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  MessageSquare,
  Compass,
  Palette,
  Code,
  CheckCircle,
  Rocket,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { processSteps } from '../data/agencyData';

export const Process: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'MessageSquare': return <MessageSquare className="w-5 h-5" />;
      case 'Compass': return <Compass className="w-5 h-5" />;
      case 'Palette': return <Palette className="w-5 h-5" />;
      case 'Code': return <Code className="w-5 h-5" />;
      case 'CheckCircle': return <CheckCircle className="w-5 h-5" />;
      case 'Rocket': return <Rocket className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <section id="process" className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <span>Our Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Seamless 6-Step Workflow From <span className="text-sky-600">Concept to Delivery</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Our structured, transparent process ensures every project is executed smoothly, on schedule, and aligned with your expectations.
          </p>
        </div>

        {/* Process Timeline Bar */}
        <div className="hidden lg:grid grid-cols-6 gap-2 mb-12">
          {processSteps.map((step, idx) => (
            <button
              key={step.number}
              onClick={() => setActiveStep(idx)}
              className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between h-28 cursor-pointer ${
                activeStep === idx
                  ? 'bg-sky-500 text-white border-sky-500 shadow-lg shadow-sky-500/25 scale-105'
                  : 'bg-white text-slate-700 border-sky-100 hover:border-sky-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                  activeStep === idx ? 'bg-white/20 text-white' : 'bg-sky-50 text-sky-700'
                }`}>
                  {step.number}
                </span>
                <div className={activeStep === idx ? 'text-white' : 'text-sky-500'}>
                  {getStepIcon(step.icon)}
                </div>
              </div>
              <span className="font-bold text-sm tracking-tight">{step.title}</span>
            </button>
          ))}
        </div>

        {/* Grid View of all 6 steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              onClick={() => setActiveStep(index)}
              className={`rounded-2xl border p-6 transition-all duration-300 relative space-y-4 cursor-pointer ${
                activeStep === index
                  ? 'bg-white border-sky-400 shadow-xl ring-2 ring-sky-300/50'
                  : 'bg-white border-sky-100 shadow-xs hover:border-sky-300'
              }`}
            >
              {/* Step number bubble */}
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black bg-gradient-to-r from-sky-600 to-sky-400 bg-clip-text text-transparent">
                  {step.number}
                </span>
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                  {getStepIcon(step.icon)}
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                {step.title}
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                {step.desc}
              </p>

              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                {step.details.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <ChevronRight className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
