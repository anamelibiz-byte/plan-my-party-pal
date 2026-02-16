import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles, Users, Calendar, DollarSign, CheckCircle } from 'lucide-react';

const TUTORIAL_STEPS = [
  {
    title: 'Welcome to Plan My Party Pal! 🎉',
    description: 'Let\'s take a quick tour of everything you can do to plan the perfect party.',
    icon: Sparkles,
    iconColor: 'text-pink-500',
    bgColor: 'bg-pink-50',
  },
  {
    title: 'Create Your Party',
    description: 'Start by entering basic details: child\'s name, age, date, and budget. Pick from 60+ themes!',
    icon: Calendar,
    iconColor: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'Manage Your Guest List',
    description: 'Add guests, track RSVPs, and send invitations via email or SMS (Pro feature).',
    icon: Users,
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Track Your Budget',
    description: 'Set category budgets, track spending, and get visual analytics to stay on track.',
    icon: DollarSign,
    iconColor: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  {
    title: 'Build Your Timeline',
    description: 'Create a day-of timeline with tasks and reminders. Download as PDF (Pro feature).',
    icon: CheckCircle,
    iconColor: 'text-rose-500',
    bgColor: 'bg-rose-50',
  },
];

export default function OnboardingTutorial({ onClose, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('pp_onboarding_completed', 'true');
    if (onComplete) onComplete();
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('pp_onboarding_completed', 'true');
    onClose();
  };

  const step = TUTORIAL_STEPS[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 bg-black/60 z-[9998] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className={`${step.bgColor} p-6 relative`}>
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Skip tutorial"
          >
            <X size={24} />
          </button>

          <div className="flex items-center justify-center mb-4">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <Icon className={step.iconColor} size={48} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
            {step.title}
          </h2>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="text-gray-700 text-center text-lg leading-relaxed mb-8">
            {step.description}
          </p>

          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {TUTORIAL_STEPS.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-gradient-to-r from-pink-500 to-rose-500'
                    : index < currentStep
                    ? 'w-2 bg-pink-300'
                    : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                currentStep === 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft size={20} />
              Previous
            </button>

            {currentStep < TUTORIAL_STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all"
              >
                Next
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3 rounded-xl font-bold hover:shadow-xl transition-all"
              >
                Get Started! 🎉
              </button>
            )}
          </div>

          {/* Skip Link */}
          {currentStep < TUTORIAL_STEPS.length - 1 && (
            <div className="text-center mt-4">
              <button
                onClick={handleSkip}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Skip tutorial
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
