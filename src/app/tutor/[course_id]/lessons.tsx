import { useCourse, type CourseDetail } from '@/services/courses';
import {
  useCreateChapter,
  useDeleteChapter,
  useUpdateChapter,
} from '@/services/chapters';
import { useCreateLesson, useDeleteLesson } from '@/services/lessons';
import { Pressable, ScrollView, Text, TextInput, View } from '@/tw';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Stack } from 'expo-router/stack';
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Pencil,
  Play,
  Plus,
  Trash2,
  X,
} from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';

type ChapterWithLessons = CourseDetail['chapters'][number];

function LessonRow({
  lesson,
  courseId,
  onDelete,
}: {
  lesson: ChapterWithLessons['lessons'][number];
  courseId: string;
  onDelete: () => void;
}) {
  const router = useRouter();

  return (
    <View className="flex-row items-center gap-3 py-3 px-4">
      <GripVertical size={16} color="#d1d5db" />
      <View className="w-7 h-7 rounded-md bg-blue-100 items-center justify-center">
        <Play size={12} color="#2563EB" />
      </View>
      <Pressable
        onPress={() => router.push(`/tutor/${courseId}/lesson/${lesson.id}`)}
        className="flex-1"
      >
        <Text className="text-[14px] font-medium text-text-main">
          {lesson.title}
        </Text>
      </Pressable>
      <Pressable onPress={onDelete} className="p-1.5 active:opacity-60">
        <Trash2 size={16} color="#ef4444" />
      </Pressable>
    </View>
  );
}

function ChapterSection({
  chapter,
  index,
  courseId,
}: {
  chapter: ChapterWithLessons;
  index: number;
  courseId: string;
}) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(chapter.title);
  const [addingLesson, setAddingLesson] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState('');

  const updateChapter = useUpdateChapter(courseId);
  const deleteChapter = useDeleteChapter(courseId);
  const createLesson = useCreateLesson(courseId);
  const deleteLesson = useDeleteLesson(courseId);

  const sortedLessons = [...chapter.lessons].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  function handleSaveTitle() {
    if (editTitle.trim()) {
      updateChapter.mutate({ id: chapter.id, title: editTitle.trim() });
    }
    setEditing(false);
  }

  function handleDeleteChapter() {
    Alert.alert(
      'Delete Chapter',
      `Delete "${chapter.title}" and all its lessons?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteChapter.mutate(chapter.id),
        },
      ]
    );
  }

  function handleAddLesson() {
    if (!newLessonTitle.trim()) return;
    createLesson.mutate(
      {
        chapter_id: chapter.id,
        title: newLessonTitle.trim(),
        sort_order: sortedLessons.length + 1,
      },
      {
        onSuccess: () => {
          setNewLessonTitle('');
          setAddingLesson(false);
        },
      }
    );
  }

  function handleDeleteLesson(lessonId: string, lessonTitle: string) {
    Alert.alert('Delete Lesson', `Delete "${lessonTitle}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteLesson.mutate(lessonId),
      },
    ]);
  }

  return (
    <View className="mb-4 border border-border rounded-2xl overflow-hidden">
      {/* Chapter header */}
      <View className="bg-gray-50 p-4 flex-row items-center gap-3">
        <GripVertical size={16} color="#d1d5db" />

        {editing ? (
          <View className="flex-1 flex-row items-center gap-2">
            <TextInput
              value={editTitle}
              onChangeText={setEditTitle}
              autoFocus
              className="flex-1 border border-border rounded-lg px-3 py-1.5 text-[14px] text-text-main bg-white"
              onSubmitEditing={handleSaveTitle}
            />
            <Pressable onPress={handleSaveTitle} className="p-1">
              <Text className="text-primary font-bold text-[13px]">Save</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setEditing(false);
                setEditTitle(chapter.title);
              }}
              className="p-1"
            >
              <X size={16} color="#64748B" />
            </Pressable>
          </View>
        ) : (
          <>
            <Pressable onPress={() => setExpanded(!expanded)} className="flex-1">
              <Text className="text-[15px] font-bold text-text-main">
                {index + 1}. {chapter.title}
              </Text>
              <Text className="text-[12px] text-text-muted mt-0.5">
                {sortedLessons.length}{' '}
                {sortedLessons.length === 1 ? 'lesson' : 'lessons'}
              </Text>
            </Pressable>
            <Pressable onPress={() => setEditing(true)} className="p-1.5 active:opacity-60">
              <Pencil size={16} color="#64748B" />
            </Pressable>
            <Pressable onPress={handleDeleteChapter} className="p-1.5 active:opacity-60">
              <Trash2 size={16} color="#ef4444" />
            </Pressable>
            <Pressable onPress={() => setExpanded(!expanded)} className="p-1.5">
              {expanded ? (
                <ChevronUp size={18} color="#64748B" />
              ) : (
                <ChevronDown size={18} color="#64748B" />
              )}
            </Pressable>
          </>
        )}
      </View>

      {/* Lessons */}
      {expanded && (
        <View>
          {sortedLessons.map((lesson) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              courseId={courseId}
              onDelete={() => handleDeleteLesson(lesson.id, lesson.title)}
            />
          ))}

          {/* Add lesson */}
          {addingLesson ? (
            <View className="px-4 py-3 flex-row items-center gap-2 border-t border-border">
              <TextInput
                value={newLessonTitle}
                onChangeText={setNewLessonTitle}
                autoFocus
                placeholder="Lesson title"
                className="flex-1 border border-border rounded-lg px-3 py-1.5 text-[14px] text-text-main"
                placeholderTextColor="#94a3b8"
                onSubmitEditing={handleAddLesson}
              />
              <Pressable
                onPress={handleAddLesson}
                disabled={createLesson.isPending}
                className="px-3 py-1.5 bg-primary rounded-lg active:opacity-80"
              >
                <Text className="text-white font-semibold text-[13px]">
                  {createLesson.isPending ? '...' : 'Add'}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setAddingLesson(false);
                  setNewLessonTitle('');
                }}
                className="p-1"
              >
                <X size={16} color="#64748B" />
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={() => setAddingLesson(true)}
              className="px-4 py-3 flex-row items-center gap-2 border-t border-border active:bg-gray-50"
            >
              <Plus size={16} color="#2563EB" />
              <Text className="text-primary text-[13px] font-semibold">
                Add Lesson
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

export default function ManageLessonsScreen() {
  const { course_id } = useLocalSearchParams<{ course_id: string }>();
  const { data: course, isLoading } = useCourse(course_id);

  const [addingChapter, setAddingChapter] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const createChapter = useCreateChapter(course_id);

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

  function handleAddChapter() {
    if (!newChapterTitle.trim()) return;
    createChapter.mutate(
      {
        title: newChapterTitle.trim(),
        sort_order: chapters.length + 1,
      },
      {
        onSuccess: () => {
          setNewChapterTitle('');
          setAddingChapter(false);
        },
      }
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerTitle: 'Manage Lessons' }} />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="px-6 pt-4 pb-24"
      >
        {chapters.length === 0 && !addingChapter && (
          <View className="items-center pt-20">
            <Text className="text-[16px] text-text-muted mb-2">
              No chapters yet
            </Text>
            <Text className="text-[13px] text-text-muted text-center mb-6">
              Start by adding your first chapter, then add lessons to it.
            </Text>
          </View>
        )}

        {chapters.map((chapter, i) => (
          <ChapterSection
            key={chapter.id}
            chapter={chapter}
            index={i}
            courseId={course_id}
          />
        ))}

        {/* Add chapter */}
        {addingChapter ? (
          <View className="flex-row items-center gap-2 mt-2">
            <TextInput
              value={newChapterTitle}
              onChangeText={setNewChapterTitle}
              autoFocus
              placeholder="Chapter title"
              className="flex-1 border border-border rounded-xl px-4 py-3 text-[15px] text-text-main"
              placeholderTextColor="#94a3b8"
              onSubmitEditing={handleAddChapter}
            />
            <Pressable
              onPress={handleAddChapter}
              disabled={createChapter.isPending}
              className="px-4 py-3 bg-primary rounded-xl active:opacity-80"
            >
              <Text className="text-white font-bold text-[14px]">
                {createChapter.isPending ? '...' : 'Add'}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setAddingChapter(false);
                setNewChapterTitle('');
              }}
              className="p-2"
            >
              <X size={20} color="#64748B" />
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={() => setAddingChapter(true)}
            className="mt-2 py-4 rounded-2xl border-2 border-dashed border-border items-center flex-row justify-center gap-2 active:bg-gray-50"
          >
            <Plus size={20} color="#2563EB" />
            <Text className="text-primary font-bold text-[15px]">
              Add Chapter
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}
