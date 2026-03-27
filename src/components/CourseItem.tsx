import { formatDuration, formatPrice } from '@/lib/format';
import type { CourseWithInstructor } from '@/services/courses';
import { Pressable, Text, View } from '@/tw';
import { Image } from '@/tw/image';
import { useRouter } from 'expo-router';
import { Clock, Star, User } from 'lucide-react-native';

export function CourseItem({ course }: { course: CourseWithInstructor }) {
  const router = useRouter();

  return (
    <Pressable
      className="active:scale-[0.98]"
      onPress={() => router.push(`/course/${course.id}`)}
    >
      <Image
        source={course.image_url ?? 'https://via.placeholder.com/400x180'}
        className="w-full h-[180px] object-cover rounded-2xl border border-border mb-3"
      />
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-[18px] font-bold text-text-main leading-snug flex-1 mr-4">
          {course.title}
        </Text>
        <View className="flex-row items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-md">
          <Star size={12} color="#eab308" fill="#eab308" />
          <Text className="text-[12px] font-bold text-primary">
            {course.rating}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center gap-3">
        <View className="flex-row items-center gap-1">
          <User size={13} color="#64748B" />
          <Text className="text-[13px] text-text-muted">
            {course.instructor?.name ?? 'Instructor'}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Clock size={13} color="#64748B" />
          <Text className="text-[13px] text-text-muted">
            {formatDuration(course.total_duration)}
          </Text>
        </View>
      </View>
      <View className="mt-3 flex-row items-center justify-between">
        <Text className="text-[18px] font-bold text-text-main">
          {course.price === 0 ? 'Free' : formatPrice(course.price)}
        </Text>
        <Pressable>
          <Text className="text-[13px] font-bold text-primary">
            View Details
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}
