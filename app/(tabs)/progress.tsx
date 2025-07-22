// app/(tabs)/progress.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, Text, View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

interface Session {
    id: number;
    userId?: string; // Adicionado para consistência, embora não seja usado para carregar
    date: string;
    repetitions: number;
    totalDuration: number; // em segundos
}

export default function ProgressScreen() {
    const { user } = useAuth(); // Get user from auth context
    const [sessions, setSessions] = useState<Session[]>([]);

    const loadSessions = useCallback(async () => {
        if (!user?.id) {
            setSessions([]); // Limpa sessões se não houver usuário logado
            return;
        }

        try {
            const storageKey = `kegel_sessions_${user.id}`; // User-specific key
            const existingSessions = await AsyncStorage.getItem(storageKey);
            if (existingSessions) {
                const parsedSessions: Session[] = JSON.parse(existingSessions);
                // Ordenar sessões por data, as mais recentes primeiro
                setSessions(parsedSessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            } else {
                setSessions([]);
            }
        } catch (error) {
            console.error('Erro ao carregar sessões:', error);
            // Opcionalmente, mostrar um alerta ao usuário
        }
    }, [user?.id]); // Recarrega quando o ID do usuário muda

    // Carregar sessões quando o componente é montado e quando ele entra em foco
    useFocusEffect(
        useCallback(() => {
            loadSessions();
            return () => {
                // Limpeza opcional se necessário
            };
        }, [loadSessions])
    );

    const renderSessionItem = ({ item }: { item: Session }) => {
        const sessionDate = new Date(item.date).toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
        const minutes = Math.floor(item.totalDuration / 60);
        const seconds = item.totalDuration % 60;
        const durationString = `${minutes}m ${seconds}s`;

        return (
            <View style={styles.sessionItem}>
                <Text style={styles.sessionDate}>{sessionDate}</Text>
                <Text style={styles.sessionDetails}>Repetições: {item.repetitions}</Text>
                <Text style={styles.sessionDetails}>Duração: {durationString}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Seu Progresso</Text>
                {sessions.length === 0 ? (
                    <Text style={styles.noDataText}>Nenhuma sessão de exercício registrada ainda.</Text>
                ) : (
                    <FlatList
                        data={sessions}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderSessionItem}
                        contentContainerStyle={styles.listContent}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#e2e8f0',
        marginBottom: 30,
    },
    noDataText: {
        fontSize: 18,
        color: '#94a3b8',
        textAlign: 'center',
        marginTop: 50,
    },
    listContent: {
        paddingBottom: 20, // Adiciona um pouco de preenchimento na parte inferior da lista
    },
    sessionItem: {
        backgroundColor: '#1e293b', // Fundo escuro ligeiramente mais claro para os itens
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        width: '100%',
        maxWidth: 400, // Limita a largura para telas maiores
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    sessionDate: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#e2e8f0',
        marginBottom: 5,
    },
    sessionDetails: {
        fontSize: 16,
        color: '#94a3b8',
    },
});
