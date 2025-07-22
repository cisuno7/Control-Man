import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProgress, ExerciseSession } from '@/types';

const PROGRESS_KEY = '@kegel_progress';
const SESSIONS_KEY = '@kegel_sessions';

export const storeProgress = async (progress: UserProgress): Promise<void> => {
    try {
        await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch (error) {
        console.error('Error storing progress:', error);
    }
};

export const getStoredProgress = async (): Promise<UserProgress | null> => {
    try {
        const stored = await AsyncStorage.getItem(PROGRESS_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.error('Error getting progress:', error);
        return null;
    }
};

export const storeSession = async (session: ExerciseSession): Promise<void> => {
    try {
        const existingSessions = await getStoredSessions();
        const updatedSessions = [...existingSessions, session];
        await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(updatedSessions));
    } catch (error) {
        console.error('Error storing session:', error);
    }
};

export const getStoredSessions = async (): Promise<ExerciseSession[]> => {
    try {
        const stored = await AsyncStorage.getItem(SESSIONS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error getting sessions:', error);
        return [];
    }
};
