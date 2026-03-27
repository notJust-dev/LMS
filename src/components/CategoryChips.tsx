import { Pressable, Text } from '@/tw';
import { ScrollView as RNScrollView } from 'react-native';

const CATEGORIES = [
  'All Courses',
  'Design',
  'Business',
  'Coding',
  'Marketing',
] as const;

export function CategoryChips({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (cat: string) => void;
}) {
  return (
    <RNScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 24, gap: 8, paddingVertical: 16 }}
    >
      {CATEGORIES.map((cat) => {
        const isActive = selected === cat;
        return (
          <Pressable
            key={cat}
            onPress={() => onSelect(cat)}
            className={
              isActive
                ? 'px-5 py-2.5 bg-primary rounded-full'
                : 'px-5 py-2.5 bg-gray-50 border border-border rounded-full active:bg-blue-50'
            }
          >
            <Text
              className={
                isActive
                  ? 'text-[14px] font-bold text-white'
                  : 'text-[14px] font-medium text-text-muted'
              }
            >
              {cat}
            </Text>
          </Pressable>
        );
      })}
    </RNScrollView>
  );
}
