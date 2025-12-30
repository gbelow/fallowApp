'use client'
import React, { createContext, useContext, useState, ReactNode } from "react";

export const skillsList = {
  strike: 10,
  block: 10,
  evasion: 10,
  reflex: 10,
  accuracy: 10,
  grapple: 10,
  sneak: 10,
  prestidigitation: 10,
  balance: 10,
  strength: 10,
  health: 10,
  swim: 10,
  climb: 10,
  knowledge: 10,
  spellcast: 10,
  detect: 10,
  sense: 10,
  explore: 10,
  will: 10,
  cunning: 10,
}

export type SkillsList = typeof skillsList
export type SkillsListKeys = keyof typeof skillsList

export type SkillsContextType = {
  skills: SkillsList;
  setSkills: React.Dispatch<React.SetStateAction<SkillsList>>;
  resetSkills: () => void
};

// 🔹 Create context
const SkillsContext = createContext<SkillsContextType | undefined>(undefined);

// 🔹 Provider
export const SkillsProvider = ({ children }: { children: ReactNode }) => {
  const [skills, setSkills] = useState<SkillsList>(skillsList);

  const resetSkills = () => setSkills(skillsList)

  return (
    <SkillsContext.Provider value={{ skills, setSkills, resetSkills }}>
      {children}
    </SkillsContext.Provider>
  );
};

// 🔹 Hook for easier usage
export const useSkills = () => {
  const context = useContext(SkillsContext);
  if (!context) {
    throw new Error("useSkills must be used inside SkillsProvider");
  }
  return context;
};