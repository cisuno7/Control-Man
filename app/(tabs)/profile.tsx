// app/(tabs)/profile.tsx
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { router } from 'expo-router';
import { LogOut, User, Mail } from 'lucide-react-native';

export default function ProfileScreen() {
    const { user, signOut } = useAuth();

    const handleSignOut = async () => {
        Alert.alert(
            'Sair da conta',
            'Tem certeza que deseja sair?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sair',
                    style: 'destructive',
                    onPress: async () => {
                        await signOut();
                        router.replace('/(auth)/sign-in');
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.container}>
                    <Text style={styles.title}>
                        Perfil
                    </Text>

                    <View style={styles.profileCard}>
                        <View style={styles.avatarContainer}>
                            <User size={60} color="#3b82f6" />
                        </View>

                        <View style={styles.userInfo}>
                            <View style={styles.infoRow}>
                                <Mail size={20} color="#94a3b8" />
                                <Text style={styles.infoText}>{user?.email}</Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                        <LogOut size={20} color="#ef4444" />
                        <Text style={styles.signOutText}>Sair da conta</Text>
                    </TouchableOpacity>
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
        marginBottom: 40,
    },
    profileCard: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#334155',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    userInfo: {
        width: '100%',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#334155',
        borderRadius: 8,
        marginBottom: 8,
    },
    infoText: {
        fontSize: 16,
        color: '#e2e8f0',
        marginLeft: 12,
        flex: 1,
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ef4444',
        width: '100%',
        maxWidth: 400,
        justifyContent: 'center',
    },
    signOutText: {
        fontSize: 16,
        color: '#ef4444',
        fontWeight: '600',
        marginLeft: 8,
    },
});
