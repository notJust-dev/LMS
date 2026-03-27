import { useRouter } from 'expo-router';
import { ChevronLeft, Briefcase, GraduationCap, Palette, Award, CheckCircle } from 'lucide-react-native';
import { View, Text, Pressable, ScrollView } from '@/tw';
import { useOnboarding } from '@/providers/onboarding-context';

const GOALS = [
  { id: 'career', icon: Briefcase, title: 'Career Advancement', desc: 'Get promoted or learn new job skills' },
  { id: 'switch', icon: GraduationCap, title: 'Switch Career Path', desc: 'Start from zero in a new industry' },
  { id: 'personal', icon: Palette, title: 'Personal Growth', desc: 'Explore hobbies and creative interests' },
  { id: 'certs', icon: Award, title: 'Certifications', desc: 'Earn industry-recognized credentials' },
] as const;

export default function GoalScreen() {
  const router = useRouter();
  const { goal: selected, setGoal: setSelected } = useOnboarding();

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
            <View className="h-full bg-primary w-[16.6%] rounded-full" />
          </View>
        </View>
        <Text className="text-[13px] font-semibold text-text-muted w-10 text-right">1/6</Text>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-6">
        <View className="mb-8 mt-4">
          <Text className="text-[28px] font-bold text-text-main leading-tight mb-3">
            What's your primary goal?
          </Text>
          <Text className="text-[16px] text-text-muted">
            We'll customize your course recommendations based on your choice.
          </Text>
        </View>

        <View className="gap-4">
          {GOALS.map((goal) => {
            const Icon = goal.icon;
            const isActive = selected === goal.id;
            return (
              <Pressable
                key={goal.id}
                onPress={() => setSelected(goal.id)}
                className={`p-5 border rounded-2xl flex-row items-center gap-4 active:scale-[0.98] ${
                  isActive ? 'border-primary bg-blue-50' : 'border-border'
                }`}
              >
                <View className="w-12 h-12 rounded-xl bg-blue-50 items-center justify-center">
                  <Icon size={24} color="#2563EB" />
                </View>
                <View className="flex-1">
                  <Text className="text-[17px] font-semibold text-text-main">{goal.title}</Text>
                  <Text className="text-[14px] text-text-muted">{goal.desc}</Text>
                </View>
                {isActive && <CheckCircle size={24} color="#2563EB" />}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="p-8 bg-white border-t border-border">
        <Pressable
          onPress={() => router.push('/onboarding/interests')}
          className="w-full bg-primary py-4 rounded-2xl items-center active:scale-[0.98]"
        >
          <Text className="text-white font-semibold text-base">Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}
