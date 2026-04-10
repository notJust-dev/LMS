import { formatDuration } from '@/lib/format';
import { useCourse } from '@/services/courses';
import { useLesson } from '@/services/lessons';
import { Pressable, ScrollView, Text, View } from '@/tw';
import { Image } from '@/tw/image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Stack } from 'expo-router/stack';
import {
  ChevronRight,
  Download,
  FileText,
  Maximize,
  Play,
  Users,
} from 'lucide-react-native';
import { ActivityIndicator, Alert } from 'react-native';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function LessonPlayerScreen() {
  const { course_id, lesson_id } = useLocalSearchParams<{
    course_id: string;
    lesson_id: string;
  }>();
  const router = useRouter();
  const { data: lesson, isLoading } = useLesson(lesson_id);
  const { data: course } = useCourse(course_id);

  if (isLoading || !lesson) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  const chapter = lesson.chapter;
  const resources = [...lesson.resources].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  // Build a flat sorted list of all lesson IDs to find prev/next
  const allLessons = course
    ? [...course.chapters]
        .sort((a, b) => a.sort_order - b.sort_order)
        .flatMap((ch) =>
          [...ch.lessons].sort((a, b) => a.sort_order - b.sort_order)
        )
    : [];
  const currentIndex = allLessons.findIndex((l) => l.id === lesson_id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <View className="flex-1 bg-white">
      <Stack.Toolbar>
        {prevLesson ? (
          <Stack.Toolbar.Button
            icon="chevron.left"
            onPress={() =>
              router.replace(`/course/${course_id}/lesson/${prevLesson.id}`)
            }
          >
            Previous
          </Stack.Toolbar.Button>
        ) : (
          <Stack.Toolbar.Button icon="chevron.left" disabled>
            Previous
          </Stack.Toolbar.Button>
        )}
        <Stack.Toolbar.Button
          icon="checkmark.circle"
          onPress={() => Alert.alert('Completed')}
        >
          Complete
        </Stack.Toolbar.Button>
        {nextLesson ? (
          <Stack.Toolbar.Button
            icon="chevron.right"
            onPress={() =>
              router.replace(`/course/${course_id}/lesson/${nextLesson.id}`)
            }
          >
            Next
          </Stack.Toolbar.Button>
        ) : (
          <Stack.Toolbar.Button icon="chevron.right" disabled>
            Next
          </Stack.Toolbar.Button>
        )}
      </Stack.Toolbar>

      {/* Video section */}
      <View className="w-full aspect-video bg-black relative">
        <Image
          source={lesson.video_url ?? 'https://via.placeholder.com/800x450'}
          className="w-full h-full object-cover opacity-80"
        />

        <View className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-[12px] font-medium text-white">
              {formatDuration(lesson.duration)}
            </Text>
            <Maximize size={20} color="white" />
          </View>
          <View className="h-1 w-full bg-white/30 rounded-full overflow-hidden">
            <View className="h-full bg-primary w-[0%] rounded-full" />
          </View>
        </View>

        <View className="absolute inset-0 items-center justify-center">
          <Pressable className="w-16 h-16 bg-white/20 rounded-full items-center justify-center border border-white/30 active:scale-[0.9]">
            <Play size={30} color="white" fill="white" />
          </Pressable>
        </View>
      </View>

      {/* Scrollable content */}
      <ScrollView className="flex-1" contentContainerClassName="px-6 pt-8 pb-24">
        {/* Lesson header */}
        <View className="mb-6">
          <View className="flex-row items-center gap-2 mb-3">
            {chapter && (
              <View className="px-2 py-1 bg-blue-50 rounded-md">
                <Text className="text-primary text-[11px] font-bold uppercase tracking-wider">
                  {chapter.title}
                </Text>
              </View>
            )}
            <Text className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
              Lesson {lesson.sort_order}
            </Text>
          </View>
          <Text className="text-[24px] font-bold text-text-main leading-tight mb-4">
            {lesson.title}
          </Text>
          <View className="flex-row items-center gap-6 py-4 border-y border-border">
            <View className="flex-row items-center gap-2">
              <Users size={16} color="#64748B" />
              <Text className="text-[13px] text-text-muted">
                {chapter?.course?.review_count?.toLocaleString() ?? '0'} students
              </Text>
            </View>
            {resources.length > 0 && (
              <View className="flex-row items-center gap-2">
                <FileText size={16} color="#64748B" />
                <Text className="text-[13px] text-text-muted">
                  Resources included
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Description */}
        {lesson.description && (
          <View>
            <Text className="text-[18px] font-bold text-text-main mb-3">
              Description
            </Text>
            <Text className="text-[15px] text-text-muted leading-relaxed mb-4">
              {lesson.description}
            </Text>
          </View>
        )}

        {/* Resources */}
        {resources.length > 0 && (
          <View className="gap-3">
            {resources.map((resource) => (
              <View
                key={resource.id}
                className="bg-gray-50 p-4 rounded-xl border border-border flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-3 flex-1">
                  <Download size={24} color="#2563EB" />
                  <View>
                    <Text className="text-[14px] font-bold text-text-main">
                      {resource.file_name}
                    </Text>
                    <Text className="text-[12px] text-text-muted">
                      {formatFileSize(resource.file_size)} - {resource.file_type}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#64748B" />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
