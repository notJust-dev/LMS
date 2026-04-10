import { formatDuration, formatPrice } from '@/lib/format';
import { useTutorCourses, type TutorCourse } from '@/services/courses';
import { Pressable, ScrollView, Text, View } from '@/tw';
import { Image } from '@/tw/image';
import { useRouter } from 'expo-router';
import { BookOpen, Clock, Plus, Star } from 'lucide-react-native';
import { ActivityIndicator } from 'react-native';

function CourseCard({ course }: { course: TutorCourse }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/tutor/${course.id}`)}
      className="bg-white border border-border rounded-2xl overflow-hidden active:scale-[0.98]"
    >
      <View className="flex-row">
        <Image
          source={course.image_url ?? 'https://via.placeholder.com/120x120'}
          className="w-[100px] h-[100px] object-cover"
        />
        <View className="flex-1 p-4 justify-center">
          <Text
            className="text-[15px] font-bold text-text-main mb-1"
            numberOfLines={2}
          >
            {course.title}
          </Text>
          <View className="flex-row items-center gap-3 mt-1">
            <View className="flex-row items-center gap-1">
              <BookOpen size={12} color="#64748B" />
              <Text className="text-[12px] text-text-muted">
                {course.lesson_count} lessons
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Clock size={12} color="#64748B" />
              <Text className="text-[12px] text-text-muted">
                {formatDuration(course.total_duration)}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-3 mt-2">
            <View className="flex-row items-center gap-1">
              <Star size={12} color="#facc15" fill="#facc15" />
              <Text className="text-[12px] text-text-muted">
                {course.rating}
              </Text>
            </View>
            <Text className="text-[12px] font-semibold text-primary">
              {course.price === 0 ? 'Free' : formatPrice(course.price)}
            </Text>
            {!course.is_published && (
              <View className="px-2 py-0.5 bg-yellow-50 rounded-md">
                <Text className="text-[10px] font-bold text-yellow-700 uppercase">
                  Draft
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function EmptyState() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center px-6 pt-20">
      <BookOpen size={48} color="#d1d5db" />
      <Text className="text-[18px] font-bold text-text-main mt-4 mb-2">
        No courses yet
      </Text>
      <Text className="text-[14px] text-text-muted text-center mb-6">
        Create your first course and start sharing your knowledge.
      </Text>
      <Pressable
        onPress={() => router.push('/tutor/create')}
        className="bg-primary px-6 py-3 rounded-xl active:scale-[0.98]"
      >
        <Text className="text-white font-bold text-[15px]">
          Create Course
        </Text>
      </Pressable>
    </View>
  );
}

export default function TutorCoursesScreen() {
  const { data: courses, isLoading } = useTutorCourses();
  const router = useRouter();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <View className="flex-1 bg-white">
        <EmptyState />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="px-6 pt-4 pb-24 gap-4"
      >
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </ScrollView>

      {/* Floating create button */}
      <Pressable
        onPress={() => router.push('/tutor/create')}
        className="absolute bottom-8 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg active:scale-[0.95]"
      >
        <Plus size={24} color="white" />
      </Pressable>
    </View>
  );
}
