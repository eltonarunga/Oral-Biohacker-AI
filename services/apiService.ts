import { UserProfile, PersonalizedPlan, Dentist, SmileDesignResult, ChatMessage, ProfileData, Habit, Goal } from '../types';

// ==================== HELPERS ====================

const getAuthToken = (): string | null => {
    return localStorage.getItem('oralBioAI_authToken');
};

const apiFetch = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    const token = getAuthToken();
    // FIX: The original headers object creation caused a type error because `options.headers`
    // can be a Headers object or a string[][], which cannot be spread into a Record<string, string>.
    // Using the `Headers` constructor is the correct and robust way to handle all `HeadersInit` types.
    const headers = new Headers(options.headers);

    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    try {
        const response = await fetch(`/api${url}`, { ...options, headers });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(errorData.message || `Request failed with status ${response.status}`);
        }
        return response.json() as Promise<T>;
    } catch (error) {
        console.error(`API call to ${url} failed:`, error);
        // Rethrow a consistent error format
        throw new Error(error instanceof Error ? error.message : 'An unknown network error occurred.');
    }
};

// ==================== AUTH API ====================

interface AuthResponse {
    token: string;
    user: UserProfile;
}

export const exchangeGoogleCredential = (credential: string): Promise<AuthResponse> => {
    return apiFetch('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ credential }),
    });
};

export const signUpWithEmail = (email: string, password: string): Promise<AuthResponse> => {
    return apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
};

export const signInWithEmail = (email: string, password: string): Promise<AuthResponse> => {
    return apiFetch('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
};

export const fetchUserProfile = (): Promise<{ user: UserProfile }> => {
    return apiFetch('/me');
};

// ==================== DATA API ====================

export const fetchProfileData = (): Promise<ProfileData> => {
    return apiFetch('/data');
};

export const updateUserProfile = (profile: UserProfile): Promise<{ success: boolean; user: UserProfile }> => {
    return apiFetch('/profile', {
        method: 'PUT',
        body: JSON.stringify(profile),
    });
};

export const toggleHabit = (habitId: string, date: string): Promise<{ habitHistory: Record<string, string[]> }> => {
    return apiFetch('/data/habit', {
        method: 'POST',
        body: JSON.stringify({ habitId, date }),
    });
};

export const updateGoals = (goals: Goal[]): Promise<{ goals: Goal[] }> => {
    return apiFetch('/data/goals', {
        method: 'PUT',
        body: JSON.stringify({ goals }),
    });
};

// ==================== AI FEATURES API ====================

export const generatePlan = (): Promise<{ plan: PersonalizedPlan }> => {
    return apiFetch('/ai/generate-plan', { method: 'POST' });
};

export interface SymptomCheckerResponse {
    text: string;
    sources: any[];
    suggestedReplies: string[];
}

export const sendMessageToChecker = (history: ChatMessage[]): Promise<SymptomCheckerResponse> => {
    return apiFetch('/ai/symptom-checker', {
        method: 'POST',
        body: JSON.stringify({ history }),
    });
};

export interface DentistSearchResult {
    dentists: Dentist[];
    sources: any[];
}

export const findDentists = (latitude: number, longitude: number): Promise<DentistSearchResult> => {
    return apiFetch('/ai/find-dentists', {
        method: 'POST',
        body: JSON.stringify({ latitude, longitude }),
    });
};

export const generateSmileDesign = (base64ImageData: string, mimeType: string): Promise<SmileDesignResult> => {
    return apiFetch('/ai/smile-design', {
        method: 'POST',
        body: JSON.stringify({ image: base64ImageData, mimeType }),
    });
};

// ==================== ACCOUNT MANAGEMENT API ====================

export const exportUserData = async (): Promise<void> => {
    const token = getAuthToken();
    const response = await fetch('/api/account/export', {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || 'Failed to export data.');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oralBioAI_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
};

export const deleteUserAccount = (): Promise<{ success: boolean }> => {
    return apiFetch('/account/delete', { method: 'DELETE' });
};
