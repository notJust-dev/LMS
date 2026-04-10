import { useClerk, useUser, useUserProfileModal } from '@clerk/expo';
import { ScrollView, View, Text, Pressable } from '@/tw';
import { Image } from '@/tw/image';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { presentUserProfile } = useUserProfileModal();
  const router = useRouter();
  const isTutor = user?.publicMetadata?.role === 'tutor';

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" className="flex-1">
      <View className="p-4 gap-4">
        <View className="flex-row items-center p-4 bg-gray-100 rounded-xl gap-3" style={{ borderCurve: 'continuous' }}>
          {user?.imageUrl && (
            <Image source={{ uri: user.imageUrl }} className="w-12 h-12 rounded-full" />
          )}
          <View>
            <Text selectable className="text-lg font-semibold">
              {user?.firstName || 'User'} {user?.lastName || ''}
            </Text>
            <Text selectable className="text-sm text-gray-500">
              {user?.emailAddresses[0]?.emailAddress}
            </Text>
          </View>
        </View>

        {isTutor && (
          <Pressable className="bg-primary p-4 rounded-xl items-center active:opacity-80" style={{ borderCurve: 'continuous' }} onPress={() => router.push('/tutor')}>
            <Text className="text-white text-base font-semibold">Manage Courses</Text>
          </Pressable>
        )}

        <Pressable className="bg-blue-500 p-4 rounded-xl items-center active:opacity-80" style={{ borderCurve: 'continuous' }} onPress={presentUserProfile}>
          <Text className="text-white text-base font-semibold">Manage Profile</Text>
        </Pressable>

        <Pressable className="bg-gray-500 p-4 rounded-xl items-center active:opacity-80" style={{ borderCurve: 'continuous' }} onPress={() => signOut()}>
          <Text className="text-white text-base font-semibold">Sign Out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
