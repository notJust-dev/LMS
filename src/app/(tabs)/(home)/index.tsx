import { ScrollView, Text, View, Pressable } from '@/tw';
import { Image } from '@/tw/image';
import { useUser } from '@clerk/expo';
import { useCourses } from '@/services/courses';
import {
  Flame,
  Bell,
  PlayCircle,
  Star,
  Clock,
  Award,
  CheckCircle,
} from 'lucide-react-native';
import { FlatList } from 'react-native';
import type { Tables } from '@/lib/database.types';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning,';
  if (hour < 17) return 'Good afternoon,';
  return 'Good evening,';
}

function TopBar() {
  const { user } = useUser();
  const streakDays = 5;

  return (
    <View className="px-6 pt-4 pb-4 flex-row items-center justify-between">
      <View className="flex-row items-center gap-3">
        <Image
          source={user?.imageUrl}
          className="w-10 h-10 rounded-full object-cover border border-border"
        />
        <View>
          <Text className="text-[12px] text-text-muted font-medium">
            {getGreeting()}
          </Text>
          <Text className="text-[16px] font-bold text-text-main">
            {user?.firstName ?? 'Learner'}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-3">
        <View className="flex-row items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
          <Flame size={18} color="#f97316" fill="#f97316" />
          <Text className="text-[14px] font-bold text-orange-600">
            {streakDays}
          </Text>
        </View>
        <Pressable className="w-10 h-10 items-center justify-center bg-white border border-border rounded-xl active:scale-95">
          <Bell size={20} color="#0F172A" />
        </Pressable>
      </View>
    </View>
  );
}

function HeroContinueCard() {
  const progress = 65;
  const lessonsCompleted = 12;
  const totalLessons = 18;

  return (
    <View className="px-6 mt-2">
      <View className="bg-white rounded-[20px] border border-border overflow-hidden shadow-sm">
        <View className="p-5">
          <View className="flex-row items-center gap-2 mb-4">
            <View className="px-2.5 py-1 bg-blue-50 rounded-md">
              <Text className="text-primary text-[11px] font-bold uppercase tracking-wider">
                In Progress
              </Text>
            </View>
          </View>

          <Text className="text-[20px] font-bold text-text-main leading-tight mb-2">
            Mastering Figma: Advanced UI Design Systems
          </Text>
          <Text className="text-[14px] text-text-muted mb-5">
            by Alex Rivera &bull; {lessonsCompleted}/{totalLessons} Lessons
          </Text>

          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-[13px] font-semibold text-text-main">
                Course Progress
              </Text>
              <Text className="text-[13px] font-bold text-primary">
                {progress}%
              </Text>
            </View>
            <View className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <View
                className="h-full bg-primary rounded-full"
                style={{ width: `${progress}%` }}
              />
            </View>
          </View>

          <Pressable className="w-full bg-primary py-3.5 rounded-xl active:scale-[0.98] flex-row items-center justify-center gap-2">
            <PlayCircle size={20} color="#ffffff" />
            <Text className="text-white font-bold text-[16px]">
              Resume Lesson
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function CourseCard({ course }: { course: Tables<'courses'> }) {
  return (
    <Pressable className="w-[240px] bg-white border border-border rounded-2xl overflow-hidden active:scale-[0.98]">
      <View className="h-[140px] relative">
        <Image
          source={course.image_url ?? 'https://via.placeholder.com/240x140'}
          className="w-full h-full object-cover"
        />
        <View className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-lg flex-row items-center gap-1">
          <Star size={12} color="#facc15" fill="#facc15" />
          <Text className="text-[11px] font-bold">4.8</Text>
        </View>
      </View>
      <View className="p-4">
        <Text
          className="text-[15px] font-bold text-text-main mb-2"
          numberOfLines={2}
        >
          {course.title}
        </Text>
        <View className="flex-row items-center gap-2">
          <Clock size={14} color="#64748B" />
          <Text className="text-[12px] text-text-muted">24h total</Text>
        </View>
      </View>
    </Pressable>
  );
}

function RecommendedSection() {
  const { data: courses } = useCourses();

  return (
    <View className="mt-10">
      <View className="px-6 mb-4 flex-row items-center justify-between">
        <Text className="text-[18px] font-bold text-text-main">
          Recommended for you
        </Text>
        <Pressable>
          <Text className="text-[14px] font-semibold text-primary">
            See All
          </Text>
        </Pressable>
      </View>
      <FlatList
        data={courses ?? []}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
        renderItem={({ item }) => <CourseCard course={item} />}
      />
    </View>
  );
}

function LearningStats() {
  return (
    <View className="px-6 mt-8 mb-8">
      <View className="flex-row gap-4">
        <View className="flex-1 bg-white p-4 border border-border rounded-2xl shadow-sm">
          <Award size={24} color="#3b82f6" />
          <Text className="text-[20px] font-bold mt-2">12</Text>
          <Text className="text-[12px] text-text-muted">Certificates</Text>
        </View>
        <View className="flex-1 bg-white p-4 border border-border rounded-2xl shadow-sm">
          <CheckCircle size={24} color="#10b981" />
          <Text className="text-[20px] font-bold mt-2">48</Text>
          <Text className="text-[12px] text-text-muted">Lessons Done</Text>
        </View>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 bg-bg"
    >
      <TopBar />
      <HeroContinueCard />
      <RecommendedSection />
      <LearningStats />
    </ScrollView>
  );
}
