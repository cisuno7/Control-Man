// Em app/(tabs)/exercises.tsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';
import { Play, Pause, RotateCcw } from 'lucide-react-native';

// Parâmetros fixos do exercício para o MVP
const CONTRACTION_DURATION = 5; // segundos
const RELAXATION_DURATION = 5; // segundos
const TOTAL_REPETITIONS = 10;

type ExercisePhase = 'ready' | 'contract' | 'relax' | 'completed';

export default function ExercisesScreen() {
    const { user } = useAuth();
    const [currentPhase, setCurrentPhase] = useState<ExercisePhase>('ready');
    const [currentRepetition, setCurrentRepetition] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(CONTRACTION_DURATION);
    const [isRunning, setIsRunning] = useState(false);

    const intervalRef = useRef<number | null>(null); // Ref para o ID do setInterval
    const currentPhaseRef = useRef(currentPhase); // Ref para o estado currentPhase
    const currentRepetitionRef = useRef(currentRepetition); // Ref para o estado currentRepetition

    // Efeito para manter as refs atualizadas com os estados mais recentes
    useEffect(() => {
        currentPhaseRef.current = currentPhase;
    }, [currentPhase]);

    useEffect(() => {
        currentRepetitionRef.current = currentRepetition;
    }, [currentRepetition]);

    const saveExerciseSession = async () => {
        const sessionData = {
            id: Date.now(),
            userId: user?.id,
            date: new Date().toISOString(),
            repetitions: TOTAL_REPETITIONS,
            contractionDuration: CONTRACTION_DURATION,
            relaxationDuration: RELAXATION_DURATION,
        };

        try {
            const storageKey = `kegel_sessions_${user?.id}`;
            const existingSessions = await AsyncStorage.getItem(storageKey);
            let sessions = existingSessions ? JSON.parse(existingSessions) : [];
            sessions.push(sessionData);
            await AsyncStorage.setItem(storageKey, JSON.stringify(sessions));
            console.log('Sessão salva com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar sessão:', error);
        }
    };

    const playSound = async (type: 'start' | 'switch' | 'complete') => {
        try {
            console.log(`Som: ${type}`);
        } catch (error) {
            console.error('Erro ao reproduzir som:', error);
        }
    };

    const startTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        const newInterval = setInterval(() => {
            setTimeRemaining((prevTime) => {
                if (prevTime <= 1) {
                    // Use as refs para obter os valores mais recentes dos estados
                    const latestPhase = currentPhaseRef.current;
                    const latestRepetition = currentRepetitionRef.current;

                    let nextPhase: ExercisePhase = latestPhase;
                    let nextRepetition: number = latestRepetition;
                    let nextTime: number = prevTime; // Será sobrescrito
                    let shouldStop: boolean = false;

                    if (latestPhase === 'contract') {
                        nextPhase = 'relax';
                        nextTime = RELAXATION_DURATION;
                        playSound('switch');
                    } else if (latestPhase === 'relax') {
                        nextRepetition = latestRepetition + 1;
                        if (nextRepetition >= TOTAL_REPETITIONS) {
                            nextPhase = 'completed';
                            shouldStop = true;
                            playSound('complete');
                            saveExerciseSession();
                        } else {
                            nextPhase = 'contract';
                            nextTime = CONTRACTION_DURATION;
                            playSound('switch');
                        }
                    }

                    // Atualize os estados uma única vez com os valores calculados
                    setCurrentPhase(nextPhase);
                    setCurrentRepetition(nextRepetition);
                    setIsRunning(!shouldStop); // Atualiza isRunning com base em shouldStop

                    if (shouldStop) {
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                            intervalRef.current = null;
                        }
                    }

                    return nextTime; // Retorna o novo tempo para setTimeRemaining
                }
                return prevTime - 1; // Decrementa o tempo
            });
        }, 1000);

        intervalRef.current = newInterval;

    }, []); // Dependência vazia para que startTimer seja criada apenas uma vez

    const startExercise = () => {
        setCurrentPhase('contract');
        setCurrentRepetition(0);
        setTimeRemaining(CONTRACTION_DURATION);
        setIsRunning(true);
        playSound('start');
        startTimer();
    };

    const pauseExercise = () => {
        setIsRunning(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const resumeExercise = () => {
        setIsRunning(true);
        startTimer();
    };

    const resetExercise = () => {
        setCurrentPhase('ready');
        setCurrentRepetition(0);
        setTimeRemaining(CONTRACTION_DURATION);
        setIsRunning(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    useEffect(() => {
        // Limpa o intervalo quando o componente é desmontado
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, []); // Dependência vazia para rodar apenas na montagem/desmontagem

    const getPhaseText = () => {
        switch (currentPhase) {
            case 'ready':
                return 'Pronto para começar';
            case 'contract':
                return 'CONTRAIA';
            case 'relax':
                return 'RELAXE';
            case 'completed':
                return 'Exercício Completo!';
            default:
                return '';
        }
    };

    const getPhaseColor = () => {
        switch (currentPhase) {
            case 'contract':
                return '#ef4444'; // Vermelho
            case 'relax':
                return '#22c55e'; // Verde
            case 'completed':
                return '#3b82f6'; // Azul
            default:
                return '#94a3b8'; // Cinza
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.container}>
                    <Text style={styles.title}>Exercícios Kegel</Text>

                    <View style={styles.exerciseCard}>
                        <View style={styles.phaseContainer}>
                            <Text style={[styles.phaseText, { color: getPhaseColor() }]}>
                                {getPhaseText()}
                            </Text>

                            {(currentPhase === 'contract' || currentPhase === 'relax') && (
                                <View style={styles.timerContainer}>
                                    <Text style={styles.timerText}>{timeRemaining}</Text>
                                    <Text style={styles.timerLabel}>segundos</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.progressContainer}>
                            <Text style={styles.progressText}>
                                Repetição: {currentRepetition + 1} / {TOTAL_REPETITIONS}
                            </Text>
                            <View style={styles.progressBar}>
                                <View
                                    style={[
                                        styles.progressFill,
                                        { width: `${((currentRepetition) / TOTAL_REPETITIONS) * 100}%` }
                                    ]}
                                />
                            </View>
                        </View>

                        <View style={styles.controlsContainer}>
                            {currentPhase === 'ready' && (
                                <TouchableOpacity style={styles.startButton} onPress={startExercise}>
                                    <Play size={24} color="#fff" />
                                    <Text style={styles.buttonText}>Iniciar</Text>
                                </TouchableOpacity>
                            )}

                            {(currentPhase === 'contract' || currentPhase === 'relax') && (
                                <View style={styles.exerciseControls}>
                                    <TouchableOpacity
                                        style={styles.controlButton}
                                        onPress={isRunning ? pauseExercise : resumeExercise}
                                    >
                                        {isRunning ? (
                                            <Pause size={24} color="#fff" />
                                        ) : (
                                            <Play size={24} color="#fff" />
                                        )}
                                        <Text style={styles.buttonText}>
                                            {isRunning ? 'Pausar' : 'Continuar'}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.resetButton} onPress={resetExercise}>
                                        <RotateCcw size={24} color="#fff" />
                                        <Text style={styles.buttonText}>Reiniciar</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {currentPhase === 'completed' && (
                                <TouchableOpacity style={styles.startButton} onPress={resetExercise}>
                                    <RotateCcw size={24} color="#fff" />
                                    <Text style={styles.buttonText}>Novo Exercício</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    <View style={styles.instructionsCard}>
                        <Text style={styles.instructionsTitle}>Como fazer:</Text>
                        <Text style={styles.instructionText}>
                            • Durante a fase "CONTRAIA": Aperte os músculos do assoalho pélvico como se estivesse segurando a urina
                        </Text>
                        <Text style={styles.instructionText}>
                            • Durante a fase "RELAXE": Solte completamente os músculos
                        </Text>
                        <Text style={styles.instructionText}>
                            • Respire normalmente durante todo o exercício
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
    },
    container: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#e2e8f0',
        marginBottom: 30,
    },
    exerciseCard: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    phaseContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    phaseText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    timerContainer: {
        alignItems: 'center',
    },
    timerText: {
        fontSize: 64,
        fontWeight: 'bold',
        color: '#e2e8f0',
    },
    timerLabel: {
        fontSize: 16,
        color: '#94a3b8',
    },
    progressContainer: {
        marginBottom: 30,
    },
    progressText: {
        fontSize: 16,
        color: '#e2e8f0',
        textAlign: 'center',
        marginBottom: 10,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#334155',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#3b82f6',
        borderRadius: 4,
    },
    controlsContainer: {
        alignItems: 'center',
    },
    startButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3b82f6',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    exerciseControls: {
        flexDirection: 'row',
        gap: 16,
    },
    controlButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3b82f6',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#64748b',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    instructionsCard: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 20,
        width: '100%',
        maxWidth: 400,
    },
    instructionsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#e2e8f0',
        marginBottom: 12,
    },
    instructionText: {
        fontSize: 14,
        color: '#94a3b8',
        lineHeight: 20,
        marginBottom: 8,
    },
});
