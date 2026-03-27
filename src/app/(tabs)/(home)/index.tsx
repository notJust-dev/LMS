import { ScrollView, View, Text } from '@/tw';

export default function HomeScreen() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" className="flex-1">
      <View className="p-4 gap-4">
        <Text className="text-base text-gray-600">Welcome to your LMS</Text>
      </View>
    </ScrollView>
  );
}
