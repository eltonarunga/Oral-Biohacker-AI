import { type Chat } from "@google/genai";

export type Page = 'dashboard' | 'plan' | 'symptom-checker' | 'education' | 'find-dentist' | 'smile-design-studio' | 'profile';

export interface UserProfile {
  id: string;
  name: string;
  salivaPH: number;
  geneticRisk: 'Low' | 'Medium' | 'High';
  bruxism: 'None' | 'Mild' | 'Moderate' | 'Severe';
  lifestyle: string;
  goals: string;
  // New fields for profile page
  avatarUrl: string;
  bio: string;
  joinDate: string;
  email: string;
  phone: string;
  gender: 'Female' | 'Male' | 'Other';
  dateOfBirth: string;
  height: number; // cm
  weight: number; // kg
  bloodType: string;
}

export interface PersonalizedPlan {
  supplements: { name: string; dosage: string; reason: string; }[];
  routines: { name: string; frequency: string; instructions: string; }[];
  nutrition: { recommendation: string; reason: string; }[];
  alerts: { marker: string; status: 'Good' | 'Fair' | 'Poor'; advice: string; }[];
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface SymptomCheckerState {
    chat: Chat | null;
    history: ChatMessage[];
    isLoading: boolean;
}

export interface ProfileData {
    plan: PersonalizedPlan | null;
    isPlanLoading: boolean;
    planError: string | null;
    symptomCheckerState: SymptomCheckerState;
    habitStreak: number;
    lastLoggedDate: string | null;
    habits: Habit[];
}

export interface Dentist {
    name: string;
    address: string;
    phone: string;
}

export interface GroundingChunk {
    web: {
        uri: string;
        title: string;
    }
}

export interface SmileDesignResult {
    image: string | null; // base64 string
    text: string | null;
}

export interface Habit {
  id: string;
  name: string;
  time: 'Morning' | 'Evening';
  completed: boolean;
  icon: string; // Material Symbols icon name
}