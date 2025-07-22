export interface Exercise {
    id: string;
    name: string;
    description: string;
    duration: number; // em segundos
    repetitions: number;
    restTime: number; // tempo de descanso entre repetições
    level: 'beginner' | 'intermediate' | 'advanced';
    category: string;
}

export interface ExerciseSession {
    id: string;
    exerciseId: string;
    date: string;
    duration: number;
    completedSets: number;
    totalSets: number;
    rating?: number;
}

export interface UserProgress {
    totalSessions: number;
    totalTime: number; // em minutos
    currentStreak: number;
    longestStreak: number;
    weeklyGoal: number;
    sessionsThisWeek: number;
    level: 'beginner' | 'intermediate' | 'advanced';
}

export interface TimerState {
    isRunning: boolean;
    currentTime: number;
    totalTime: number;
    currentSet: number;
    totalSets: number;
    isResting: boolean;
}
