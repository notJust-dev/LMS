import { ScrollView, Text, View } from '@/tw';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" className="flex-1">
      <View className="p-4 gap-4">
        <Text className="text-base text-gray-600">Hey to your LMS</Text>
        <Link href="/onboarding">Open onboarding</Link>
      </View>
    </ScrollView>
  );
}
