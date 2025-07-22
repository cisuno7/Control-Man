import { useState, useEffect } from 'react';
import { UserProgress, ExerciseSession } from '@/types';
import { getStoredProgress, storeProgress } from '@/utils/storage';

export function useProgress() {
    const [progress, setProgress] = useState<UserProgress>({
        totalSessions: 0,
        totalTime: 0,
        currentStreak: 0,
        longestStreak: 0,
        weeklyGoal: 5,
        sessionsThisWeek: 0,
        level: 'beginner',
    });

    useEffect(() => {
        loadProgress();
    }, []);

    const loadProgress = async () => {
        try {
            const storedProgress = await getStoredProgress();
            if (storedProgress) {
                setProgress(storedProgress);
            }
        } catch (error) {
            console.error('Error loading progress:', error);
        }
    };

    const updateProgress = async (session: ExerciseSession) => {
        const newProgress = {
            ...progress,
            totalSessions: progress.totalSessions + 1,
            totalTime: progress.totalTime + Math.round(session.duration / 60),
            currentStreak: progress.currentStreak + 1,
            sessionsThisWeek: progress.sessionsThisWeek + 1,
        };

        if (newProgress.currentStreak > newProgress.longestStreak) {
            newProgress.longestStreak = newProgress.currentStreak;
        }

        // Determina o nível baseado no total de sessões
        if (newProgress.totalSessions >= 50) {
            newProgress.level = 'advanced';
        } else if (newProgress.totalSessions >= 20) {
            newProgress.level = 'intermediate';
        }

        setProgress(newProgress);
        await storeProgress(newProgress);
    };

    return {
        progress,
        updateProgress,
        loadProgress,
    };
}
