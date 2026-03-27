import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { View, Text, Pressable } from '@/tw';
import { Image } from '@/tw/image';

const insightImg = require('@/assets/images/onboarding/insight.png');

export default function InsightScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-bg">
      {/* Header */}
      <View className="px-6 pt-14 pb-6 flex-row items-center justify-between relative z-10">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center border border-border rounded-xl bg-white active:scale-[0.9]"
        >
          <ChevronLeft size={20} color="#0F172A" />
        </Pressable>
        <View className="flex-1 mx-8">
          <View className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <View className="h-full bg-primary w-[50%] rounded-full" />
          </View>
        </View>
        <Text className="text-[13px] font-semibold text-text-muted w-10 text-right">3/6</Text>
      </View>

      {/* Content */}
      <View className="flex-1 items-center px-8">
        <View className="mt-12 mb-10 w-full items-center">
          <Image
            source={insightImg}
            className="w-64 h-64 object-contain"
          />
        </View>

        <View className="px-4 py-1.5 bg-blue-100 rounded-full mb-6">
          <Text className="text-[13px] font-bold text-primary tracking-wider uppercase">
            Did you know?
          </Text>
        </View>

        <Text className="text-[30px] font-bold text-text-main leading-tight mb-4 text-center">
          Structured learning increases retention by 40%.
        </Text>

        <Text className="text-[17px] text-text-muted leading-relaxed text-center">
          Students who follow a guided curriculum are twice as likely to finish their courses and apply their new skills effectively.
        </Text>
      </View>

      {/* Footer */}
      <View className="p-8 bg-bg">
        <Pressable
          onPress={() => router.push('/onboarding/testimonials')}
          className="w-full bg-primary py-4 rounded-2xl items-center active:scale-[0.98]"
        >
          <Text className="text-white font-semibold text-base">Continue journey</Text>
        </Pressable>
      </View>
    </View>
  );
}
