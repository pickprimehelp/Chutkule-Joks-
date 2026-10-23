export type CategoryId =
  | 'funny_jokes'
  | 'motivational_quotes'
  | 'morning_quotes'
  | 'daily_inspirational'
  | 'night_quotes'
  | 'love_shayari'
  | 'dosti_friendship'
  | 'school_office'
  | 'attitude_swag';

export interface CategoryTheme {
  id: CategoryId;
  name: string;
  hindiName: string;
  tagline: string;
  icon: string;
  baseColor: string; // Tailwind color name e.g. amber
  gradient: string; // Tailwind gradient classes
  activeBorder: string;
  glowColor: string;
  badgeBg: string;
  accentHex: string;
  secondaryHex: string;
  cardGradients: [string, string, string];
}

export interface Item {
  id: string;
  categoryId: CategoryId;
  text: string;
  authorOrCharacter?: string;
  likes: number;
  tags: string[];
  isFeatured?: boolean;
}

export type ThemeMode = 'dark' | 'light' | 'amoled';

export interface NotificationSettings {
  enabled: boolean;
  time: string; // '08:00'
  lastNotificationDate?: string;
  category: CategoryId | 'all';
}

