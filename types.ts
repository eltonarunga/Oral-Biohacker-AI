import { type Chat } from "@google/genai";

export type Page = 'dashboard' | 'plan' | 'symptom-checker' | 'education' | 'find-dentist' | 'smile-design-studio' | 'profile' | 'habit-history';

export interface Goal {
  id: string;
  text: string;
  isCompleted: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  authProviderId?: string; // e.g., 'google-12345'
  salivaPH: number;
  geneticRisk: 'Low' | 'Medium' | 'High';
  bruxism: 'None' | 'Mild' | 'Moderate' | 'Severe';
  lifestyle: string;
  goals: Goal[];
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
  // New health fields
  dietaryRestrictions: string;
  allergies: string;
  medications: string;
  doctorName: string;
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
    sources?: GroundingChunk[];
}

export interface SymptomCheckerState {
    chat: Chat | null;
    history: ChatMessage[];
    isLoading: boolean;
    suggestedReplies: string[];
}

export interface ProfileData {
    plan: PersonalizedPlan | null;
    isPlanLoading: boolean;
    planError: string | null;
    symptomCheckerState: SymptomCheckerState;
    habits: Habit[];
    habitHistory: Record<string, string[]>; // key is 'YYYY-MM-DD', value is array of completed habit IDs
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
  icon: string; // Material Symbols icon name
  category: 'Clinically Proven' | 'Biohacking';
}