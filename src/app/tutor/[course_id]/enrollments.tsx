import {
  useCourseEnrollments,
  type CourseEnrollment,
} from '@/services/enrollments';
import { ScrollView, Text, View } from '@/tw';
import { Image } from '@/tw/image';
import { useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { Users } from 'lucide-react-native';
import { ActivityIndicator } from 'react-native';

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function EnrollmentRow({ enrollment }: { enrollment: CourseEnrollment }) {
  const profile = enrollment.profile;

  return (
    <View className="flex-row items-center gap-3 py-3 border-b border-border">
      <Image
        source={profile?.avatar_url ?? 'https://via.placeholder.com/40'}
        className="w-10 h-10 rounded-full object-cover"
      />
      <View className="flex-1">
        <Text className="text-[14px] font-semibold text-text-main">
          {profile?.name ?? 'Unknown user'}
        </Text>
        <Text className="text-[12px] text-text-muted">
          Enrolled {formatDate(enrollment.enrolled_at)}
        </Text>
      </View>
    </View>
  );
}

export default function EnrollmentsScreen() {
  const { course_id } = useLocalSearchParams<{ course_id: string }>();
  const { data: enrollments, isLoading } = useCourseEnrollments(course_id);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerTitle: 'Enrollments' }} />

      {!enrollments || enrollments.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Users size={48} color="#d1d5db" />
          <Text className="text-[18px] font-bold text-text-main mt-4 mb-2">
            No enrollments yet
          </Text>
          <Text className="text-[14px] text-text-muted text-center">
            Students who enroll in this course will appear here.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerClassName="px-6 pt-4 pb-24"
        >
          {/* Summary */}
          <View className="bg-gray-50 p-4 rounded-xl border border-border mb-6 flex-row items-center gap-3">
            <Users size={24} color="#2563EB" />
            <View>
              <Text className="text-[20px] font-bold text-text-main">
                {enrollments.length}
              </Text>
              <Text className="text-[12px] text-text-muted">
                Total {enrollments.length === 1 ? 'student' : 'students'}{' '}
                enrolled
              </Text>
            </View>
          </View>

          {/* List */}
          {enrollments.map((enrollment) => (
            <EnrollmentRow key={enrollment.id} enrollment={enrollment} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
