
// ==================== CORE TYPES ====================

export type Page =
  | 'dashboard'
  | 'plan'
  | 'symptom-checker'
  | 'education'
  | 'find-dentist'
  | 'smile-design-studio'
  | 'profile'
  | 'habit-history'
  | 'diet-log'
  | 'habit-management'
  | 'ai-assistant'
  | 'image-generator'
  | 'image-editor'
  | 'image-analyzer'
  | 'voice-notes';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  bio: string;
  joinDate: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  dateOfBirth: string; // YYYY-MM-DD
  height: number; // in cm
  weight: number; // in kg
  bloodType: string;
  dietaryRestrictions: string;
  allergies: string;
  medications: string;
  doctorName: string;
  salivaPH: number;
  geneticRisk: 'Low' | 'Medium' | 'High';
  bruxism: 'None' | 'Mild' | 'Moderate' | 'Severe';
  lifestyle: string;
  goals: Goal[];
}

export interface Goal {
  id: string;
  text: string;
  isCompleted: boolean;
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  time: string; // e.g., "Morning, before breakfast"
  category: 'Clinically Proven' | 'Biohacking';
  icon: string; // Material Symbols icon name
}

// ==================== FEATURE-SPECIFIC TYPES ====================

export interface PersonalizedPlan {
  planRationale: string;
  alerts: {
    marker: string;
    status: 'Good' | 'Fair' | 'Poor';
    advice: string;
  }[];
  supplements: {
    name: string;
    dosage: string;
    reason: string;
  }[];
  nutrition: {
    recommendation: string;
    reason: string;
  }[];
  morningRoutines: {
    name: string;
    frequency: string;
    instructions: string;
  }[];
  eveningRoutines: {
    name: string;
    frequency: string;
    instructions: string;
  }[];
}

export interface SymptomCheckResult {
    possibleConditions: { name: string; likelihood: string }[];
    triageLevel: 'Self-Care' | 'See a Dentist Soon' | 'Urgent Dental Care Recommended';
    careRecommendations: string[];
    disclaimer: string;
}


// ==================== DIET LOG TYPES ====================

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';

export interface MealLogItem {
  id: string;
  text: string;
}

export interface DailyLog {
    Breakfast?: MealLogItem[];
    Lunch?: MealLogItem[];
    Dinner?: MealLogItem[];
    Snacks?: MealLogItem[];
    analysis?: string | null;
}

export type DailyDietLog = Record<string, DailyLog>; // Key is date string 'YYYY-MM-DD'


// ==================== API & SERVICE TYPES ====================

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
        reviewSnippets: {
            uri: string;
            text: string;
        }[];
    }[];
  };
}


export interface EducationalContentResult {
  text: string;
  sources: GroundingChunk[];
}

export interface Dentist {
    name: string;
    address: string;
    phone: string;
}

export interface DentistSearchResult {
    dentists: Dentist[];
    sources: GroundingChunk[];
}

export interface SmileDesignResult {
    image: string; // base64 encoded image
    text: string;
}

// ==================== AUTH TYPES ====================

export interface GoogleCredentialResponse {
  credential?: string;
}
