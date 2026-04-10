import { formatDuration, formatPrice } from '@/lib/format';
import { useCourse } from '@/services/courses';
import { Pressable, ScrollView, Text, View } from '@/tw';
import { Image } from '@/tw/image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Stack } from 'expo-router/stack';
import {
  BookOpen,
  ChevronRight,
  Clock,
  DollarSign,
  Edit3,
  Eye,
  EyeOff,
  Layers,
  Star,
  Users,
} from 'lucide-react-native';
import { ActivityIndicator } from 'react-native';

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-1 bg-gray-50 p-4 rounded-xl border border-border">
      {icon}
      <Text className="text-[18px] font-bold text-text-main mt-2">{value}</Text>
      <Text className="text-[12px] text-text-muted">{label}</Text>
    </View>
  );
}

function ActionRow({
  icon,
  label,
  subtitle,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-4 p-4 bg-white border border-border rounded-xl active:bg-gray-50"
    >
      {icon}
      <View className="flex-1">
        <Text className="text-[15px] font-semibold text-text-main">
          {label}
        </Text>
        {subtitle && (
          <Text className="text-[12px] text-text-muted">{subtitle}</Text>
        )}
      </View>
      <ChevronRight size={18} color="#94a3b8" />
    </Pressable>
  );
}

export default function CourseDetailsScreen() {
  const { course_id } = useLocalSearchParams<{ course_id: string }>();
  const router = useRouter();
  const { data: course, isLoading } = useCourse(course_id);

  if (isLoading || !course) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  const chapters = course.chapters ?? [];
  const lessonCount = chapters.reduce(
    (sum, ch) => sum + ch.lessons.length,
    0
  );

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerTitle: course.title }} />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="pb-24"
      >
        {/* Hero image */}
        {course.image_url ? (
          <Image
            source={course.image_url}
            className="w-full aspect-video object-cover"
          />
        ) : (
          <View className="w-full aspect-video bg-gray-100 items-center justify-center">
            <Layers size={40} color="#d1d5db" />
          </View>
        )}

        <View className="px-6 pt-6">
          {/* Title & status */}
          <View className="flex-row items-start justify-between mb-2">
            <Text className="text-[22px] font-bold text-text-main flex-1 leading-tight">
              {course.title}
            </Text>
            <View
              className={`ml-3 px-3 py-1 rounded-full ${
                course.is_published ? 'bg-green-50' : 'bg-yellow-50'
              }`}
            >
              <Text
                className={`text-[11px] font-bold uppercase ${
                  course.is_published ? 'text-green-700' : 'text-yellow-700'
                }`}
              >
                {course.is_published ? 'Published' : 'Draft'}
              </Text>
            </View>
          </View>

          {/* Category */}
          {course.category && (
            <Text className="text-[13px] text-text-muted mb-4">
              {course.category}
            </Text>
          )}

          {/* Description */}
          {course.description && (
            <Text className="text-[14px] text-text-muted leading-relaxed mb-6">
              {course.description}
            </Text>
          )}

          {/* Stats */}
          <View className="flex-row gap-3 mb-6">
            <StatCard
              icon={<BookOpen size={20} color="#2563EB" />}
              label="Lessons"
              value={String(lessonCount)}
            />
            <StatCard
              icon={<Clock size={20} color="#2563EB" />}
              label="Duration"
              value={formatDuration(course.total_duration)}
            />
          </View>
          <View className="flex-row gap-3 mb-8">
            <StatCard
              icon={<Star size={20} color="#facc15" />}
              label="Rating"
              value={`${course.rating} (${course.review_count})`}
            />
            <StatCard
              icon={<DollarSign size={20} color="#10b981" />}
              label="Price"
              value={course.price === 0 ? 'Free' : formatPrice(course.price)}
            />
          </View>

          {/* Actions */}
          <Text className="text-[16px] font-bold text-text-main mb-3">
            Manage
          </Text>
          <View className="gap-3">
            <ActionRow
              icon={<Edit3 size={20} color="#2563EB" />}
              label="Edit Course"
              subtitle="Title, description, pricing, image"
              onPress={() => router.push(`/tutor/${course_id}/edit`)}
            />
            <ActionRow
              icon={<Layers size={20} color="#2563EB" />}
              label="Manage Lessons"
              subtitle={`${chapters.length} chapters · ${lessonCount} lessons`}
              onPress={() => router.push(`/tutor/${course_id}/lessons`)}
            />
            <ActionRow
              icon={<Users size={20} color="#2563EB" />}
              label="Enrollments"
              subtitle={`${course.review_count} students`}
              onPress={() => {}}
            />
            <ActionRow
              icon={
                course.is_published ? (
                  <EyeOff size={20} color="#64748B" />
                ) : (
                  <Eye size={20} color="#10b981" />
                )
              }
              label={course.is_published ? 'Unpublish Course' : 'Publish Course'}
              subtitle={
                course.is_published
                  ? 'Hide from students'
                  : 'Make visible to students'
              }
              onPress={() => {}}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
