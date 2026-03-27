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
import { Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CHAPTERS = [
  {
    id: '1',
    title: '1. Design System Fundamentals',
    lessons: [
      { id: '1-1', title: 'Introduction to Systems', duration: '08:45' },
      { id: '1-2', title: 'Typography Architecture', duration: '12:20' },
    ],
  },
  {
    id: '2',
    title: '2. Advanced Auto-Layout',
    lessons: [
      { id: '2-1', title: 'Nested Auto-Layout', duration: '10:15' },
      { id: '2-2', title: 'Responsive Frames', duration: '14:30' },
    ],
  },
  {
    id: '3',
    title: '3. Variables & Tokens',
    lessons: [
      { id: '3-1', title: 'Color Variables', duration: '09:00' },
      { id: '3-2', title: 'Spacing Tokens', duration: '11:40' },
    ],
  },
  {
    id: '4',
    title: '4. Advanced Prototyping',
    lessons: [
      { id: '4-1', title: 'Smart Animate', duration: '13:10' },
      { id: '4-2', title: 'Interactive Components', duration: '15:00' },
    ],
  },
];

function Chapter({
  chapter,
  isExpanded,
  onToggle,
}: {
  chapter: (typeof CHAPTERS)[number];
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <View className="mb-4 border border-border rounded-2xl overflow-hidden">
      <Pressable
        onPress={onToggle}
        className={`p-4 flex-row items-center justify-between ${isExpanded ? 'bg-gray-50' : 'bg-white'}`}
      >
        <Text className="text-[15px] font-bold text-text-main flex-1">
          {chapter.title}
        </Text>
        {isExpanded ? (
          <ChevronUp size={20} color="#0F172A" />
        ) : (
          <ChevronDown size={20} color="#0F172A" />
        )}
      </Pressable>
      {isExpanded && (
        <View className="p-4 gap-4">
          {chapter.lessons.map((lesson) => (
            <View key={lesson.id} className="flex-row items-center gap-4">
              <View className="w-8 h-8 rounded-lg bg-blue-100 items-center justify-center">
                <Play size={14} color="#2563EB" />
              </View>
              <View className="flex-1">
                <Text className="text-[14px] font-medium text-text-main">
                  {lesson.title}
                </Text>
                <Text className="text-[12px] text-text-muted">
                  {lesson.duration}
                </Text>
              </View>
              <Lock size={16} color="#d1d5db" />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default function CourseDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [expandedChapter, setExpandedChapter] = useState('1');

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
            source="https://media.screensdesign.com/gasset/468b0f74-6a18-453c-8f93-deef613939cd.png"
            className="w-full h-full object-cover"
          />
          <View className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        </View>

        {/* Course info card */}
        <View className="px-6 -mt-10 relative z-10">
          <View className="bg-white rounded-2xl p-6 border border-border shadow-sm mb-8">
            <Text className="text-[24px] font-bold text-text-main leading-tight mb-4">
              Mastering Figma: Advanced UI Design Systems
            </Text>
            <View className="flex-row flex-wrap items-center gap-y-3 gap-x-4">
              <View className="flex-row items-center gap-1.5">
                <Star size={16} color="#2563EB" fill="#2563EB" />
                <Text className="text-[14px] font-bold text-text-main">
                  4.9
                </Text>
                <Text className="text-[14px] text-text-muted">(2.4k)</Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                <Clock size={16} color="#64748B" />
                <Text className="text-[14px] text-text-muted">18h 30m</Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                <Layout size={16} color="#64748B" />
                <Text className="text-[14px] text-text-muted">42 Lessons</Text>
              </View>
            </View>
          </View>

          {/* About */}
          <View className="mb-8">
            <Text className="text-[18px] font-bold text-text-main mb-3">
              About this course
            </Text>
            <Text className="text-[15px] text-text-muted leading-relaxed">
              Learn how to create scalable design systems from scratch using
              Figma's advanced features like variables, auto-layout 5.0, and
              advanced prototyping. Perfect for intermediate designers looking to
              level up.
            </Text>
          </View>

          {/* Tutor */}
          <View className="mb-10">
            <Text className="text-[18px] font-bold text-text-main mb-3">
              The Tutor
            </Text>
            <View className="flex-row items-center gap-4 p-4 border border-border rounded-2xl bg-gray-50/50">
              <Image
                source="https://media.screensdesign.com/gasset/97fc7324-c4da-46d8-bb28-b8c305b847df.png"
                className="w-14 h-14 rounded-full object-cover"
              />
              <View className="flex-1">
                <Text className="font-bold text-[16px] text-text-main">
                  Alex Rivera
                </Text>
                <Text className="text-[13px] text-text-muted">
                  Senior Design Lead at ScreenFlow
                </Text>
              </View>
              <Pressable className="px-4 py-2 border border-primary rounded-xl active:scale-[0.95]">
                <Text className="text-primary text-[13px] font-bold">
                  Follow
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Curriculum */}
          <View className="mb-10">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-[18px] font-bold text-text-main">
                Curriculum
              </Text>
              <Text className="text-[14px] text-text-muted">
                {CHAPTERS.length} Chapters
              </Text>
            </View>
            {CHAPTERS.map((chapter) => (
              <Chapter
                key={chapter.id}
                chapter={chapter}
                isExpanded={expandedChapter === chapter.id}
                onToggle={() =>
                  setExpandedChapter((prev) =>
                    prev === chapter.id ? '' : chapter.id
                  )
                }
              />
            ))}
          </View>
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
              $49.00
            </Text>
          </View>
          <View className="items-end">
            <Text className="line-through text-[14px] text-text-muted">
              $120.00
            </Text>
            <Text className="text-[12px] font-bold text-green-600">
              Save 60%
            </Text>
          </View>
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
