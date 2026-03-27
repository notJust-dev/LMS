import { formatDuration, formatPrice } from '@/lib/format';
import { useCourse, type CourseDetail } from '@/services/courses';
import { Pressable, ScrollView, Text, View } from '@/tw';
import { Image } from '@/tw/image';
import { useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router/stack';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Layout,
  Lock,
  Play,
  Star,
} from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ChapterWithLessons = CourseDetail['chapters'][number];

function Chapter({
  chapter,
  index,
  isExpanded,
  onToggle,
}: {
  chapter: ChapterWithLessons;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const sorted = [...chapter.lessons].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <View className="mb-4 border border-border rounded-2xl overflow-hidden">
      <Pressable
        onPress={onToggle}
        className={`p-4 flex-row items-center justify-between ${isExpanded ? 'bg-gray-50' : 'bg-white'}`}
      >
        <Text className="text-[15px] font-bold text-text-main flex-1">
          {index + 1}. {chapter.title}
        </Text>
        {isExpanded ? (
          <ChevronUp size={20} color="#0F172A" />
        ) : (
          <ChevronDown size={20} color="#0F172A" />
        )}
      </Pressable>
      {isExpanded && (
        <View className="p-4 gap-4">
          {sorted.map((lesson) => (
            <View key={lesson.id} className="flex-row items-center gap-4">
              <View className="w-8 h-8 rounded-lg bg-blue-100 items-center justify-center">
                <Play size={14} color="#2563EB" />
              </View>
              <View className="flex-1">
                <Text className="text-[14px] font-medium text-text-main">
                  {lesson.title}
                </Text>
                <Text className="text-[12px] text-text-muted">
                  {formatDuration(lesson.duration)}
                </Text>
              </View>
              {lesson.is_locked && <Lock size={16} color="#d1d5db" />}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default function CourseDetailsScreen() {
  const { course_id } = useLocalSearchParams<{ course_id: string }>();
  const { data: course, isLoading } = useCourse(course_id);
  const insets = useSafeAreaInsets();
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  if (isLoading || !course) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  const chapters = [...course.chapters].sort(
    (a, b) => a.sort_order - b.sort_order
  );
  const instructor = course.instructor;
  const discount =
    course.original_price != null
      ? Math.round(
          ((course.original_price - course.price) / course.original_price) * 100
        )
      : null;

  // Expand first chapter by default
  if (expandedChapter === null && chapters.length > 0) {
    setExpandedChapter(chapters[0].id);
  }

  return (
    <View className="flex-1 bg-white">
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon="square.and.arrow.up"
          onPress={() => Alert.alert('Share')}
        />
      </Stack.Toolbar>

      <ScrollView className="flex-1">
        {/* Hero image */}
        <View className="h-[260px] w-full relative">
          <Image
            source={course.image_url ?? 'https://via.placeholder.com/800x400'}
            className="w-full h-full object-cover"
          />
          <View className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent" />
        </View>

        {/* Course info card */}
        <View className="px-6 -mt-10 relative z-10">
          <View className="bg-white rounded-2xl p-6 border border-border shadow-sm mb-8">
            <Text className="text-[24px] font-bold text-text-main leading-tight mb-4">
              {course.title}
            </Text>
            <View className="flex-row flex-wrap items-center gap-y-3 gap-x-4">
              <View className="flex-row items-center gap-1.5">
                <Star size={16} color="#2563EB" fill="#2563EB" />
                <Text className="text-[14px] font-bold text-text-main">
                  {course.rating}
                </Text>
                <Text className="text-[14px] text-text-muted">
                  ({course.review_count.toLocaleString()})
                </Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                <Clock size={16} color="#64748B" />
                <Text className="text-[14px] text-text-muted">
                  {formatDuration(course.total_duration)}
                </Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                <Layout size={16} color="#64748B" />
                <Text className="text-[14px] text-text-muted">
                  {course.lesson_count} Lessons
                </Text>
              </View>
            </View>
          </View>

          {/* About */}
          {course.description && (
            <View className="mb-8">
              <Text className="text-[18px] font-bold text-text-main mb-3">
                About this course
              </Text>
              <Text className="text-[15px] text-text-muted leading-relaxed">
                {course.description}
              </Text>
            </View>
          )}

          {/* Tutor */}
          {instructor && (
            <View className="mb-10">
              <Text className="text-[18px] font-bold text-text-main mb-3">
                The Tutor
              </Text>
              <View className="flex-row items-center gap-4 p-4 border border-border rounded-2xl bg-gray-50/50">
                <Image
                  source={instructor.avatar_url ?? 'https://via.placeholder.com/56'}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <View className="flex-1">
                  <Text className="font-bold text-[16px] text-text-main">
                    {instructor.name}
                  </Text>
                  {(instructor.role || instructor.company) && (
                    <Text className="text-[13px] text-text-muted">
                      {[instructor.role, instructor.company]
                        .filter(Boolean)
                        .join(' at ')}
                    </Text>
                  )}
                </View>
                <Pressable className="px-4 py-2 border border-primary rounded-xl active:scale-[0.95]">
                  <Text className="text-primary text-[13px] font-bold">
                    Follow
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Curriculum */}
          {chapters.length > 0 && (
            <View className="mb-10">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-[18px] font-bold text-text-main">
                  Curriculum
                </Text>
                <Text className="text-[14px] text-text-muted">
                  {chapters.length} Chapters
                </Text>
              </View>
              {chapters.map((chapter, i) => (
                <Chapter
                  key={chapter.id}
                  chapter={chapter}
                  index={i}
                  isExpanded={expandedChapter === chapter.id}
                  onToggle={() =>
                    setExpandedChapter((prev) =>
                      prev === chapter.id ? '' : chapter.id
                    )
                  }
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer CTA */}
      <View
        className="px-8 bg-white border-t border-border"
        style={{ paddingTop: 16, paddingBottom: insets.bottom + 16 }}
      >
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-[12px] text-text-muted">Full Access</Text>
            <Text className="text-[24px] font-bold text-text-main">
              {course.price === 0 ? 'Free' : formatPrice(course.price)}
            </Text>
          </View>
          {discount != null && (
            <View className="items-end">
              <Text className="line-through text-[14px] text-text-muted">
                {formatPrice(course.original_price!)}
              </Text>
              <Text className="text-[12px] font-bold text-green-600">
                Save {discount}%
              </Text>
            </View>
          )}
        </View>
        <Pressable className="w-full bg-primary py-4 rounded-2xl active:scale-[0.98] items-center shadow-sm">
          <Text className="text-white font-bold text-[16px]">
            Enroll in Course
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
