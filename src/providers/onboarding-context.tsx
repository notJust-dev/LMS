import { createContext, useContext, useState } from 'react';

type OnboardingState = {
  goal: string | null;
  setGoal: (goal: string) => void;
  interests: Set<string>;
  toggleInterest: (id: string) => void;
};

const OnboardingContext = createContext<OnboardingState | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [goal, setGoal] = useState<string | null>(null);
  const [interests, setInterests] = useState<Set<string>>(new Set());

  function toggleInterest(id: string) {
    setInterests((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <OnboardingContext.Provider value={{ goal, setGoal, interests, toggleInterest }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
}
