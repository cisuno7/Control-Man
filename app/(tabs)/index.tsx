import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#e2e8f0', marginBottom: 20 }}>
            Bem-vindo ao Kegel App!
          </Text>
          <Text style={{ fontSize: 18, color: '#94a3b8', textAlign: 'center' }}>
            Sua jornada para fortalecer o assoalho pélvico começa aqui.
          </Text>
          {/* Adicione mais conteúdo aqui conforme necessário */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}