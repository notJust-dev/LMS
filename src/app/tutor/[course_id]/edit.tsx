import {
  useCourse,
  useUpdateCourse,
  useUploadCourseImage,
} from '@/services/courses';
import { Pressable, ScrollView, Text, TextInput, View } from '@/tw';
import { Image } from '@/tw/image';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { Camera, Upload } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const CATEGORIES = [
  'Design',
  'Development',
  'Business',
  'Marketing',
  'Photography',
  'Music',
  'Other',
];

export default function EditCourseScreen() {
  const { course_id } = useLocalSearchParams<{ course_id: string }>();
  const { data: course, isLoading } = useCourse(course_id);
  const updateCourse = useUpdateCourse(course_id);
  const uploadImage = useUploadCourseImage();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (course && !initialized) {
      setTitle(course.title);
      setDescription(course.description ?? '');
      setCategory(course.category ?? '');
      setPrice(course.price ? (course.price / 100).toFixed(2) : '');
      setOriginalPrice(
        course.original_price ? (course.original_price / 100).toFixed(2) : ''
      );
      setIsPublished(course.is_published);
      setInitialized(true);
    }
  }, [course, initialized]);

  if (isLoading || !course) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  const canSubmit = title.trim().length > 0 && category.length > 0;

  function handleSave() {
    const priceInCents = Math.round(parseFloat(price || '0') * 100);
    const originalPriceInCents = originalPrice
      ? Math.round(parseFloat(originalPrice) * 100)
      : null;

    updateCourse.mutate(
      {
        title: title.trim(),
        description: description.trim() || null,
        category: category || null,
        price: priceInCents,
        original_price: originalPriceInCents,
        is_published: isPublished,
      },
      {
        onSuccess: () => {
          Alert.alert('Saved', 'Course updated successfully.');
        },
        onError: (err) => {
          Alert.alert('Error', err.message);
        },
      }
    );
  }

  async function handlePickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];

    uploadImage.mutate(
      {
        courseId: course_id,
        file: {
          uri: asset.uri,
          type: asset.mimeType ?? 'image/jpeg',
        },
      },
      {
        onSuccess: (publicUrl) => {
          updateCourse.mutate(
            { image_url: publicUrl },
            {
              onSuccess: () => Alert.alert('Success', 'Image uploaded.'),
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
      <Stack.Screen options={{ headerTitle: 'Edit Course' }} />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="px-6 pt-4 pb-24"
        keyboardShouldPersistTaps="handled"
      >
        {/* Course Image */}
        <View className="mb-6">
          <Text className="text-[14px] font-semibold text-text-main mb-2">
            Course Image
          </Text>
          {course.image_url ? (
            <View className="rounded-xl overflow-hidden mb-3">
              <Image
                source={course.image_url}
                className="w-full aspect-video object-cover"
              />
            </View>
          ) : (
            <View className="aspect-video bg-gray-100 rounded-xl items-center justify-center mb-3">
              <Camera size={32} color="#d1d5db" />
              <Text className="text-[13px] text-text-muted mt-2">
                No image uploaded
              </Text>
            </View>
          )}
          <Pressable
            onPress={handlePickImage}
            disabled={uploadImage.isPending}
            className="flex-row items-center justify-center gap-2 py-3 border border-primary rounded-xl active:opacity-80"
          >
            {uploadImage.isPending ? (
              <ActivityIndicator size="small" color="#2563EB" />
            ) : (
              <Upload size={18} color="#2563EB" />
            )}
            <Text className="text-primary font-semibold text-[14px]">
              {uploadImage.isPending
                ? 'Uploading...'
                : course.image_url
                  ? 'Change Image'
                  : 'Upload Image'}
            </Text>
          </Pressable>
        </View>

        {/* Title */}
        <View className="mb-5">
          <Text className="text-[14px] font-semibold text-text-main mb-2">
            Course Title *
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Mastering Figma for UI Design"
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
            placeholder="What will students learn?"
            multiline
            numberOfLines={4}
            className="border border-border rounded-xl px-4 py-3 text-[15px] text-text-main min-h-[120px]"
            placeholderTextColor="#94a3b8"
            textAlignVertical="top"
          />
        </View>

        {/* Category */}
        <View className="mb-5">
          <Text className="text-[14px] font-semibold text-text-main mb-2">
            Category *
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat}
                onPress={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl border ${
                  category === cat
                    ? 'bg-primary border-primary'
                    : 'bg-white border-border'
                } active:scale-[0.97]`}
              >
                <Text
                  className={`text-[13px] font-semibold ${
                    category === cat ? 'text-white' : 'text-text-muted'
                  }`}
                >
                  {cat}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Price */}
        <View className="mb-5">
          <Text className="text-[14px] font-semibold text-text-main mb-2">
            Price ($)
          </Text>
          <TextInput
            value={price}
            onChangeText={setPrice}
            placeholder="0.00 (free)"
            keyboardType="decimal-pad"
            className="border border-border rounded-xl px-4 py-3 text-[15px] text-text-main"
            placeholderTextColor="#94a3b8"
          />
        </View>

        {/* Original Price */}
        <View className="mb-5">
          <Text className="text-[14px] font-semibold text-text-main mb-2">
            Original Price ($)
          </Text>
          <Text className="text-[12px] text-text-muted mb-2">
            Set a higher original price to show a discount
          </Text>
          <TextInput
            value={originalPrice}
            onChangeText={setOriginalPrice}
            placeholder="Optional"
            keyboardType="decimal-pad"
            className="border border-border rounded-xl px-4 py-3 text-[15px] text-text-main"
            placeholderTextColor="#94a3b8"
          />
        </View>

        {/* Published toggle */}
        <View className="mb-8">
          <Pressable
            onPress={() => setIsPublished((prev) => !prev)}
            className="flex-row items-center justify-between p-4 border border-border rounded-xl"
          >
            <View>
              <Text className="text-[14px] font-semibold text-text-main">
                Published
              </Text>
              <Text className="text-[12px] text-text-muted">
                Make this course visible to students
              </Text>
            </View>
            <View
              className={`w-12 h-7 rounded-full justify-center px-0.5 ${
                isPublished ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <View
                className={`w-6 h-6 bg-white rounded-full shadow-sm ${
                  isPublished ? 'self-end' : 'self-start'
                }`}
              />
            </View>
          </Pressable>
        </View>

        {/* Save */}
        <Pressable
          onPress={handleSave}
          disabled={!canSubmit || updateCourse.isPending}
          className={`w-full py-4 rounded-2xl items-center active:scale-[0.98] ${
            canSubmit && !updateCourse.isPending ? 'bg-primary' : 'bg-gray-300'
          }`}
        >
          <Text className="text-white font-bold text-[16px]">
            {updateCourse.isPending ? 'Saving...' : 'Save Changes'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
