import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/expo';
import { X, Clock, Check } from 'lucide-react-native';
import { View, Text, Pressable, ScrollView } from '@/tw';
import { Image } from '@/tw/image';
import { useOnboarding } from '@/providers/onboarding-context';
import { useCreateProfile } from '@/services/profiles';

const paywallHero = require('@/assets/images/onboarding/paywall-hero.png');

const FEATURES = [
  'Unlimited access to 2,000+ courses',
  'Official certificates for every path',
  'Offline mode for learning anywhere',
];

function useCountdown(minutes: number) {
  const [seconds, setSeconds] = useState(minutes * 60 + 45);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function PaywallScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { goal, interests } = useOnboarding();
  const createProfile = useCreateProfile();
  const countdown = useCountdown(12);
  const [plan, setPlan] = useState<'annual' | 'monthly'>('annual');

  function handleSubscribe() {
    if (!user) return;
    createProfile.mutate(
      {
        id: user.id,
        name: user.fullName,
        onboarding_goal: goal,
        interests: [...interests],
        onboarding_completed: true,
      },
      { onSuccess: () => router.replace('/(tabs)/(home)') },
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Hero */}
        <View className="relative h-[240px] w-full">
          <Image
            source={paywallHero}
            className="w-full h-full object-cover"
          />
          <View className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
          <Pressable
            onPress={() => router.back()}
            className="absolute top-14 right-6 w-8 h-8 rounded-full bg-white/80 items-center justify-center"
          >
            <X size={20} color="#0F172A" />
          </Pressable>
        </View>

        <View className="px-6 -mt-6 relative z-10">
          {/* FOMO badge */}
          <View className="flex-row items-center gap-2 bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg mb-6 self-center">
            <Clock size={14} color="#EF4444" />
            <Text className="text-[13px] font-bold text-red-600">
              SPRING SALE: 40% OFF ends in {countdown}
            </Text>
          </View>

          <Text className="text-center text-[28px] font-bold text-text-main mb-8">
            Unlock your potential
          </Text>

          {/* Features */}
          <View className="gap-4 mb-10">
            {FEATURES.map((feature) => (
              <View key={feature} className="flex-row items-start gap-4">
                <View className="w-6 h-6 rounded-full bg-blue-100 items-center justify-center mt-0.5">
                  <Check size={14} color="#2563EB" />
                </View>
                <Text className="text-[16px] text-text-main font-medium flex-1">{feature}</Text>
              </View>
            ))}
          </View>

          {/* Pricing cards */}
          <View className="gap-3">
            {/* Annual */}
            <Pressable
              onPress={() => setPlan('annual')}
              className={`p-4 rounded-2xl flex-row justify-between items-center relative ${
                plan === 'annual' ? 'border-2 border-primary bg-blue-50' : 'border border-border'
              }`}
            >
              <View className="absolute -top-3 right-4 bg-primary px-3 py-1 rounded-full">
                <Text className="text-white text-[11px] font-bold uppercase">Best Value</Text>
              </View>
              <View>
                <Text className="font-bold text-[17px] text-text-main">Annual Access</Text>
                <Text className="text-[13px] text-text-muted">$99.99/year (Only $8.33/mo)</Text>
              </View>
              <Text className="text-[18px] font-bold text-primary">40% OFF</Text>
            </Pressable>

            {/* Monthly */}
            <Pressable
              onPress={() => setPlan('monthly')}
              className={`p-4 rounded-2xl flex-row justify-between items-center ${
                plan === 'monthly' ? 'border-2 border-primary bg-blue-50' : 'border border-border'
              }`}
            >
              <View>
                <Text className="font-bold text-[17px] text-text-main">Monthly Plan</Text>
                <Text className="text-[13px] text-text-muted">Cancel anytime</Text>
              </View>
              <Text className="text-[18px] font-bold text-text-main">$19.99/mo</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="p-8 bg-white border-t border-border">
        <Pressable
          onPress={handleSubscribe}
          disabled={createProfile.isPending}
          className="w-full bg-primary py-4 rounded-2xl items-center active:scale-[0.98] mb-4"
        >
          <Text className="text-white font-semibold text-base">Subscribe Now</Text>
        </Pressable>
        <Text className="text-center text-[12px] text-text-muted px-4">
          Secure payment. No hidden fees. Restore purchases.
        </Text>
      </View>
    </View>
  );
}
