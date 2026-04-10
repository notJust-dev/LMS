import {
  useLesson,
  useLessonVideoUrl,
  useUpdateLesson,
  useUploadLessonVideo,
} from '@/services/lessons';
import { Pressable, ScrollView, Text, TextInput, View } from '@/tw';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Upload, Video } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function EditLessonScreen() {
  const { course_id, lesson_id } = useLocalSearchParams<{
    course_id: string;
    lesson_id: string;
  }>();
  const { data: lesson, isLoading } = useLesson(lesson_id);
  const updateLesson = useUpdateLesson(course_id);
  const uploadVideo = useUploadLessonVideo();
  const { data: signedVideoUrl } = useLessonVideoUrl(
    lesson?.video_url ?? null
  );

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (lesson && !initialized) {
      setTitle(lesson.title);
      setDescription(lesson.description ?? '');
      setDuration(lesson.duration ? String(Math.floor(lesson.duration / 60)) : '');
      setIsLocked(lesson.is_locked);
      setInitialized(true);
    }
  }, [lesson, initialized]);

  const videoUrl = signedVideoUrl ?? null;
  const player = useVideoPlayer(videoUrl);

  if (isLoading || !lesson) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  function handleSave() {
    const durationInSeconds = Math.round(parseFloat(duration || '0') * 60);

    updateLesson.mutate(
      {
        id: lesson_id,
        title: title.trim(),
        description: description.trim() || null,
        duration: durationInSeconds,
        is_locked: isLocked,
      },
      {
        onSuccess: () => Alert.alert('Saved', 'Lesson updated.'),
        onError: (err) => Alert.alert('Error', err.message),
      }
    );
  }

  async function handlePickVideo() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      quality: 1,
    });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];

    uploadVideo.mutate(
      {
        lessonId: lesson_id,
        file: {
          uri: asset.uri,
          type: asset.mimeType ?? 'video/mp4',
          name: `${lesson_id}.mp4`,
        },
      },
      {
        onSuccess: (path) => {
          updateLesson.mutate(
            { id: lesson_id, video_url: path },
            {
              onSuccess: () => Alert.alert('Success', 'Video uploaded.'),
              onError: (err) => Alert.alert('Error', err.message),
            }
          );
        },
        onError: (err) => Alert.alert('Upload Error', err.message),
      }
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen options={{ headerTitle: lesson.title }} />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="px-6 pt-4 pb-24"
        keyboardShouldPersistTaps="handled"
      >
        {/* Video preview / upload */}
        <View className="mb-6">
          <Text className="text-[14px] font-semibold text-text-main mb-2">
            Video
          </Text>
          {videoUrl ? (
            <View className="rounded-xl overflow-hidden mb-3">
              <VideoView
                player={player}
                nativeControls
                contentFit="contain"
                style={{
                  width: '100%',
                  aspectRatio: 16 / 9,
                  backgroundColor: 'black',
                }}
              />
            </View>
          ) : (
            <View className="aspect-video bg-gray-100 rounded-xl items-center justify-center mb-3">
              <Video size={32} color="#d1d5db" />
              <Text className="text-[13px] text-text-muted mt-2">
                No video uploaded
              </Text>
            </View>
          )}
          <Pressable
            onPress={handlePickVideo}
            disabled={uploadVideo.isPending}
            className="flex-row items-center justify-center gap-2 py-3 border border-primary rounded-xl active:opacity-80"
          >
            {uploadVideo.isPending ? (
              <ActivityIndicator size="small" color="#2563EB" />
            ) : (
              <Upload size={18} color="#2563EB" />
            )}
            <Text className="text-primary font-semibold text-[14px]">
              {uploadVideo.isPending
                ? 'Uploading...'
                : videoUrl
                  ? 'Replace Video'
                  : 'Upload Video'}
            </Text>
          </Pressable>
        </View>

        {/* Title */}
        <View className="mb-5">
          <Text className="text-[14px] font-semibold text-text-main mb-2">
            Lesson Title
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Lesson title"
            className="border border-border rounded-xl px-4 py-3 text-[15px] text-text-main"
            placeholderTextColor="#94a3b8"
          />
        </View>

        {/* Description */}
        <View className="mb-5">
          <Text className="text-[14px] font-semibold text-text-main mb-2">
            Description
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="What is this lesson about?"
            multiline
            numberOfLines={4}
            className="border border-border rounded-xl px-4 py-3 text-[15px] text-text-main min-h-[120px]"
            placeholderTextColor="#94a3b8"
            textAlignVertical="top"
          />
        </View>

        {/* Duration */}
        <View className="mb-5">
          <Text className="text-[14px] font-semibold text-text-main mb-2">
            Duration (minutes)
          </Text>
          <TextInput
            value={duration}
            onChangeText={setDuration}
            placeholder="e.g. 12"
            keyboardType="decimal-pad"
            className="border border-border rounded-xl px-4 py-3 text-[15px] text-text-main"
            placeholderTextColor="#94a3b8"
          />
        </View>

        {/* Locked toggle */}
        <View className="mb-8">
          <Pressable
            onPress={() => setIsLocked((prev) => !prev)}
            className="flex-row items-center justify-between p-4 border border-border rounded-xl"
          >
            <View>
              <Text className="text-[14px] font-semibold text-text-main">
                Locked
              </Text>
              <Text className="text-[12px] text-text-muted">
                Require enrollment to access this lesson
              </Text>
            </View>
            <View
              className={`w-12 h-7 rounded-full justify-center px-0.5 ${isLocked ? 'bg-primary' : 'bg-gray-300'
                }`}
            >
              <View
                className={`w-6 h-6 bg-white rounded-full shadow-sm ${isLocked ? 'self-end' : 'self-start'
                  }`}
              />
            </View>
          </Pressable>
        </View>

        {/* Save */}
        <Pressable
          onPress={handleSave}
          disabled={!title.trim() || updateLesson.isPending}
          className={`w-full py-4 rounded-2xl items-center active:scale-[0.98] ${title.trim() && !updateLesson.isPending
              ? 'bg-primary'
              : 'bg-gray-300'
            }`}
        >
          <Text className="text-white font-bold text-[16px]">
            {updateLesson.isPending ? 'Saving...' : 'Save Changes'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
