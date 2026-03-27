import { Pressable, ScrollView, Text, View } from '@/tw';
import { Image } from '@/tw/image';
import { Stack } from 'expo-router/stack';
import {
  ChevronRight,
  Download,
  FileText,
  Maximize,
  Play,
  Users,
} from 'lucide-react-native';
import { Alert } from 'react-native';

export default function LessonPlayerScreen() {
  return (
    <View className="flex-1 bg-white">
      <Stack.Toolbar>
        <Stack.Toolbar.Button
          icon="chevron.left"
          onPress={() => Alert.alert('Previous')}
        >
          Previous
        </Stack.Toolbar.Button>
        {/* <Stack.Toolbar.Spacer /> */}
        <Stack.Toolbar.Button
          icon="checkmark.circle"
          onPress={() => Alert.alert('Completed')}
        >
          Complete
        </Stack.Toolbar.Button>
        {/* <Stack.Toolbar.Spacer /> */}
        <Stack.Toolbar.Button
          icon="chevron.right"
          onPress={() => Alert.alert('Next')}
        >
          Next
        </Stack.Toolbar.Button>
      </Stack.Toolbar>

      {/* Video section - fixed at top */}
      <View className="w-full aspect-video bg-black relative">
        <Image
          source="https://media.screensdesign.com/gasset/224608e4-9973-41a8-9a76-eb0c71289243.png"
          className="w-full h-full object-cover opacity-80"
        />

        {/* Video controls overlay */}
        <View className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-[12px] font-medium text-white">
              08:24 / 12:45
            </Text>
            <Maximize size={20} color="white" />
          </View>
          <View className="h-1 w-full bg-white/30 rounded-full overflow-hidden">
            <View className="h-full bg-primary w-[65%] rounded-full" />
          </View>
        </View>

        {/* Play button overlay */}
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
            <View className="px-2 py-1 bg-blue-50 rounded-md">
              <Text className="text-primary text-[11px] font-bold uppercase tracking-wider">
                Chapter 01
              </Text>
            </View>
            <Text className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
              Lesson 04
            </Text>
          </View>
          <Text className="text-[24px] font-bold text-text-main leading-tight mb-4">
            Building Scalable Typography Systems in Figma
          </Text>
          <View className="flex-row items-center gap-6 py-4 border-y border-border">
            <View className="flex-row items-center gap-2">
              <Users size={16} color="#64748B" />
              <Text className="text-[13px] text-text-muted">
                1,240 students
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <FileText size={16} color="#64748B" />
              <Text className="text-[13px] text-text-muted">
                Resources included
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View>
          <Text className="text-[18px] font-bold text-text-main mb-3">
            Description
          </Text>
          <Text className="text-[15px] text-text-muted leading-relaxed mb-4">
            In this lesson, we explore the foundations of typography in UI
            design. You will learn how to set up vertical rhythm, choose
            harmonic scale ratios, and implement them using Figma variables for a
            truly scalable design system.
          </Text>
          <Text className="text-[15px] text-text-muted leading-relaxed mb-4">
            We will also cover the implementation of fluid typography and how to
            document these styles for developer handoff.
          </Text>

          {/* Resource download */}
          <View className="bg-gray-50 p-4 rounded-xl border border-border flex-row items-center justify-between">
            <View className="flex-row items-center gap-3 flex-1">
              <Download size={24} color="#2563EB" />
              <View>
                <Text className="text-[14px] font-bold text-text-main">
                  Typography_Scale.fig
                </Text>
                <Text className="text-[12px] text-text-muted">
                  1.4 MB - Figma File
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color="#64748B" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
