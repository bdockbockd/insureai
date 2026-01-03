import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { InsuranceType, InsuranceFor, ExistingPlan } from "@/types/insurance";

interface WizardState {
  currentStep: number;
  insuranceType: InsuranceType | null;
  insuranceFor: InsuranceFor | null;
  age: number | null;
  gender: "male" | "female" | "other" | null;
  occupation: string;
  smoker: boolean;
  healthConditions: string[];
  budgetMin: number;
  budgetMax: number;
  existingPlans: ExistingPlan[];
  contactInfo: {
    fullName: string;
    email: string;
    phone: string;
    lineId: string;
    preferredContact: "email" | "phone" | "line";
  };
  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setInsuranceType: (type: InsuranceType) => void;
  setInsuranceFor: (forWhom: InsuranceFor) => void;
  setAge: (age: number) => void;
  setGender: (gender: "male" | "female" | "other") => void;
  setOccupation: (occupation: string) => void;
  setSmoker: (smoker: boolean) => void;
  setHealthConditions: (conditions: string[]) => void;
  setBudget: (min: number, max: number) => void;
  addExistingPlan: (plan: ExistingPlan) => void;
  removeExistingPlan: (id: string) => void;
  setContactInfo: (info: Partial<WizardState["contactInfo"]>) => void;
  reset: () => void;
}

const initialState = {
  currentStep: 0,
  insuranceType: null as InsuranceType | null,
  insuranceFor: null as InsuranceFor | null,
  age: null as number | null,
  gender: null as "male" | "female" | "other" | null,
  occupation: "",
  smoker: false,
  healthConditions: [] as string[],
  budgetMin: 500,
  budgetMax: 5000,
  existingPlans: [] as ExistingPlan[],
  contactInfo: {
    fullName: "",
    email: "",
    phone: "",
    lineId: "",
    preferredContact: "line" as const,
  },
};

export const useWizardStore = create<WizardState>()(
  persist(
    (set) => ({
      ...initialState,
      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
      prevStep: () => set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
      setInsuranceType: (type) => set({ insuranceType: type }),
      setInsuranceFor: (forWhom) => set({ insuranceFor: forWhom }),
      setAge: (age) => set({ age }),
      setGender: (gender) => set({ gender }),
      setOccupation: (occupation) => set({ occupation }),
      setSmoker: (smoker) => set({ smoker }),
      setHealthConditions: (conditions) => set({ healthConditions: conditions }),
      setBudget: (min, max) => set({ budgetMin: min, budgetMax: max }),
      addExistingPlan: (plan) =>
        set((state) => ({ existingPlans: [...state.existingPlans, plan] })),
      removeExistingPlan: (id) =>
        set((state) => ({
          existingPlans: state.existingPlans.filter((p) => p.id !== id),
        })),
      setContactInfo: (info) =>
        set((state) => ({
          contactInfo: { ...state.contactInfo, ...info },
        })),
      reset: () => set(initialState),
    }),
    {
      name: "insureai-wizard",
    }
  )
);
