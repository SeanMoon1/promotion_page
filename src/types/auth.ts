export interface User {
  uid: string;
  email: string;
  displayName: string;
  nickname: string;
  photoURL?: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  displayName: string;
  nickname: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
  order: number;
  sectionId: string; // 고유한 섹션 ID
  type: 'text' | 'image' | 'video'; // 섹션 타입
  images?: string[]; // 이미지 URL 배열 (type이 'image'일 때)
  videos?: string[]; // 동영상 URL 배열 (type이 'video'일 때)
}

export interface ProfileData {
  uid: string;
  nickname: string;
  pageTitle: string;
  name: string;
  image: string;
  description: string;
  welcomeMessage: string;
  welcomeSubtitle: string;
  strengths: Strength[];
  strengthsTitle: string;
  socialLinks: SocialLink[];
  customSections: CustomSection[];
  showStrengths: boolean;
  showSocialLinks: boolean;
  showCustomSections: boolean;
  sectionOrder: string[]; // 'strengths', 'socialLinks', 'custom_1', 'custom_2' 등
  theme: {
    primaryColor: Color;
    secondaryColor: Color;
    accentColor: Color;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Strength {
  id: string;
  title: string;
  description: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

export interface Color {
  r: number;
  g: number;
  b: number;
  hex: string;
} 