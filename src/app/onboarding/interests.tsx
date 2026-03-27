import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ChevronLeft, PenTool, Code, Megaphone, TrendingUp, Database, Camera } from 'lucide-react-native';
import { View, Text, Pressable, ScrollView } from '@/tw';

const INTERESTS = [
  { id: 'design', icon: PenTool, label: 'UI/UX Design' },
  { id: 'dev', icon: Code, label: 'Development' },
  { id: 'marketing', icon: Megaphone, label: 'Marketing' },
  { id: 'business', icon: TrendingUp, label: 'Business' },
  { id: 'data', icon: Database, label: 'Data Science' },
  { id: 'photo', icon: Camera, label: 'Photography' },
] as const;

export default function InterestsScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 pt-14 pb-6 flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center border border-border rounded-xl active:scale-[0.9]"
        >
          <ChevronLeft size={20} color="#0F172A" />
        </Pressable>
        <View className="flex-1 mx-8">
          <View className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <View className="h-full bg-primary w-[33.3%] rounded-full" />
          </View>
        </View>
        <Text className="text-[13px] font-semibold text-text-muted w-10 text-right">2/6</Text>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-6">
        <View className="mb-8 mt-4">
          <Text className="text-[28px] font-bold text-text-main leading-tight mb-3">
            Choose your interests
          </Text>
          <Text className="text-[16px] text-text-muted">
            Pick at least 3 topics to help us personalize your learning path.
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-3 pb-6">
          {INTERESTS.map((interest) => {
            const Icon = interest.icon;
            const isActive = selected.has(interest.id);
            return (
              <Pressable
                key={interest.id}
                onPress={() => toggle(interest.id)}
                className={`p-4 rounded-2xl gap-3 active:scale-[0.95] w-[48%] ${
                  isActive ? 'border-2 border-primary bg-blue-50' : 'border border-border'
                }`}
              >
                <Icon size={24} color={isActive ? '#2563EB' : '#64748B'} />
                <Text className="font-semibold text-text-main">{interest.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="p-8 bg-white border-t border-border">
        <Pressable
          onPress={() => router.push('/onboarding/insight')}
          className="w-full bg-primary py-4 rounded-2xl items-center active:scale-[0.98]"
        >
          <Text className="text-white font-semibold text-base">Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}
