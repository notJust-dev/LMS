import { useCreateCourse } from '@/services/courses';
import { Pressable, ScrollView, Text, TextInput, View } from '@/tw';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform } from 'react-native';

const CATEGORIES = [
  'Design',
  'Development',
  'Business',
  'Marketing',
  'Photography',
  'Music',
  'Other',
];

export default function CreateCourseScreen() {
  const router = useRouter();
  const createCourse = useCreateCourse();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');

  const canSubmit = title.trim().length > 0 && category.length > 0;

  function handleCreate() {
    const priceInCents = Math.round(parseFloat(price || '0') * 100);
    const originalPriceInCents = originalPrice
      ? Math.round(parseFloat(originalPrice) * 100)
      : null;

    createCourse.mutate(
      {
        title: title.trim(),
        description: description.trim(),
        category,
        price: priceInCents,
        original_price: originalPriceInCents,
      },
      {
        onSuccess: (data) => {
          if (data) {
            router.replace(`/tutor/${data.id}`);
          } else {
            router.back();
          }
        },
        onError: (err) => {
          Alert.alert('Error', err.message);
        },
      }
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="px-6 pt-4 pb-24"
        keyboardShouldPersistTaps="handled"
      >
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
        <View className="mb-8">
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

        {/* Submit */}
        <Pressable
          onPress={handleCreate}
          disabled={!canSubmit || createCourse.isPending}
          className={`w-full py-4 rounded-2xl items-center active:scale-[0.98] ${
            canSubmit && !createCourse.isPending
              ? 'bg-primary'
              : 'bg-gray-300'
          }`}
        >
          <Text className="text-white font-bold text-[16px]">
            {createCourse.isPending ? 'Creating...' : 'Create Course'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
