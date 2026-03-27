import { Pressable, Text, View } from '@/tw';
import { Image } from '@/tw/image';
import { useRouter } from 'expo-router';
import { Star } from 'lucide-react-native';

const heroImg = require('@/assets/images/onboarding/hero.png');
const avatar1 = require('@/assets/images/onboarding/avatar-1.png');
const avatar2 = require('@/assets/images/onboarding/avatar-2.png');
const avatar3 = require('@/assets/images/onboarding/avatar-3.png');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-bg">
      {/* Hero image */}
      <View className="relative h-[480px] w-full overflow-hidden">
        <Image
          source={heroImg}
          className="w-full h-full object-cover"
        />
        <View className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
      </View>

      {/* Content */}
      <View className="px-8 -mt-20 relative z-10">
        {/* Social proof pill */}
        <View className="flex-row items-center gap-2 bg-white border border-border rounded-full px-3 py-1.5 self-start mb-6 shadow-sm">
          <View className="flex-row">
            <Image
              source={avatar1}
              className="w-6 h-6 rounded-full border-2 border-white object-cover"
            />
            <Image
              source={avatar2}
              className="w-6 h-6 rounded-full border-2 border-white object-cover -ml-2"
            />
            <Image
              source={avatar3}
              className="w-6 h-6 rounded-full border-2 border-white object-cover -ml-2"
            />
          </View>
          <Text className="text-[13px] font-medium text-text-main">Join 500k+ learners</Text>
          <View className="ml-1 pl-2 border-l border-border flex-row items-center gap-1">
            <Star size={12} color="#FACC15" fill="#FACC15" />
            <Text className="text-[13px] font-bold text-text-main">4.9</Text>
          </View>
        </View>

        <Text className="mt-10 text-[34px] leading-tight font-bold text-text-main tracking-tight mb-4">
          Master new skills at your own pace.
        </Text>

        <Text className="text-[17px] leading-relaxed text-text-muted mb-10">
          Access expert-led video lessons, interactive quizzes, and industry-recognized certificates in one calm space.
        </Text>
      </View>

      {/* Footer */}
      <View className="p-8 bg-bg mt-auto">
        <Pressable
          onPress={() => router.push('/onboarding/goal')}
          className="w-full bg-primary py-4 rounded-2xl items-center active:scale-[0.98]"
        >
          <Text className="text-white font-semibold text-base">Get Started</Text>
        </Pressable>
        <Text className="text-center mt-4 text-[13px] text-text-muted">
          Already have an account? <Text className="text-primary font-semibold">Log In</Text>
        </Text>
      </View>
    </View>
  );
}
