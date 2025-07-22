import { useState, useEffect, useRef } from 'react';
import { TimerState } from '@/types';

export function useTimer() {
    const [timerState, setTimerState] = useState<TimerState>({
        isRunning: false,
        currentTime: 0,
        totalTime: 0,
        currentSet: 1,
        totalSets: 1,
        isResting: false,
    });

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startTimer = (duration: number, sets: number, restTime: number = 10) => {
        setTimerState({
            isRunning: true,
            currentTime: duration,
            totalTime: duration,
            currentSet: 1,
            totalSets: sets,
            isResting: false,
        });
    };

    const pauseTimer = () => {
        setTimerState(prev => ({ ...prev, isRunning: false }));
    };

    const resumeTimer = () => {
        setTimerState(prev => ({ ...prev, isRunning: true }));
    };

    const resetTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        setTimerState({
            isRunning: false,
            currentTime: 0,
            totalTime: 0,
            currentSet: 1,
            totalSets: 1,
            isResting: false,
        });
    };

    useEffect(() => {
        if (timerState.isRunning && timerState.currentTime > 0) {
            intervalRef.current = setInterval(() => {
                setTimerState(prev => ({
                    ...prev,
                    currentTime: prev.currentTime - 1,
                }));
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [timerState.isRunning, timerState.currentTime]);

    return {
        timerState,
        startTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
    };
}
