import { useRouter } from 'expo-router';
import { ChevronLeft, Star } from 'lucide-react-native';
import { View, Text, Pressable, ScrollView } from '@/tw';
import { Image } from '@/tw/image';

const avatarSarah = require('@/assets/images/onboarding/testimonial-sarah.png');
const avatarMarcus = require('@/assets/images/onboarding/testimonial-marcus.png');

const TESTIMONIALS = [
  {
    id: '1',
    quote: '"The UI/UX course was a game-changer. I landed my first design job just 2 months after finishing the curriculum."',
    name: 'Sarah Jenkins',
    role: 'Junior Product Designer',
    avatar: avatarSarah,
    hasShadow: true,
  },
  {
    id: '2',
    quote: '"Incredible depth in the Python for Data Science module. The interactive quizzes really helped me practice."',
    name: 'Marcus Zhao',
    role: 'Data Analyst',
    avatar: avatarMarcus,
    hasShadow: false,
  },
];

function Stars() {
  return (
    <View className="flex-row items-center gap-1 mb-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={16} color="#FACC15" fill="#FACC15" />
      ))}
    </View>
  );
}

export default function TestimonialsScreen() {
  const router = useRouter();

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
            <View className="h-full bg-primary w-[66.6%] rounded-full" />
          </View>
        </View>
        <Text className="text-[13px] font-semibold text-text-muted w-10 text-right">4/6</Text>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-6">
        <View className="mb-8 mt-4">
          <Text className="text-[28px] font-bold text-text-main leading-tight mb-3">
            Loved by thousands
          </Text>
          <Text className="text-[16px] text-text-muted">
            Hear from real students who transformed their careers with us.
          </Text>
        </View>

        <View className="gap-4 pb-6">
          {TESTIMONIALS.map((t) => (
            <View
              key={t.id}
              className={`p-6 border border-border rounded-2xl bg-white ${t.hasShadow ? 'shadow-sm' : ''}`}
            >
              <Stars />
              <Text className="text-[16px] text-text-main italic leading-relaxed mb-4">
                {t.quote}
              </Text>
              <View className="flex-row items-center gap-3">
                <Image source={t.avatar} className="w-10 h-10 rounded-full object-cover" />
                <View>
                  <Text className="text-[14px] font-bold text-text-main">{t.name}</Text>
                  <Text className="text-[12px] text-text-muted">{t.role}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="p-8 bg-white border-t border-border">
        <Pressable
          onPress={() => router.push('/onboarding/paywall')}
          className="w-full bg-primary py-4 rounded-2xl items-center active:scale-[0.98]"
        >
          <Text className="text-white font-semibold text-base">Next</Text>
        </Pressable>
      </View>
    </View>
  );
}
