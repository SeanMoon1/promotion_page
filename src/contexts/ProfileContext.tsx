import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Profile {
  name: string;
  image: string | null;
  description: string;
  strengths: Strength[];
  socialLinks: SocialLink[];
  pageTitle: string;
}

interface Strength {
  id: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

interface ProfileContextType {
  profile: Profile;
  updateProfile: (updates: Partial<Profile>) => void;
  addStrength: (strength: Omit<Strength, 'id'>) => void;
  removeStrength: (id: string) => void;
  updateStrength: (id: string, updates: Partial<Strength>) => void;
  addSocialLink: (link: Omit<SocialLink, 'id'>) => void;
  removeSocialLink: (id: string) => void;
  updateSocialLink: (id: string, updates: Partial<SocialLink>) => void;
  // 저장 관련 상태 추가
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  saveProfile: () => Promise<void>;
  clearUnsavedChanges: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<Profile>({
    name: '홍길동',
    image: null,
    description: '안녕하세요! 저는 열정적인 개발자입니다.',
    strengths: [
      {
        id: '1',
        title: '창의적 문제 해결',
        shortDescription: '창의적인 아이디어로 문제를 해결합니다',
        detailedDescription: '다양한 관점에서 문제를 분석하고, 혁신적인 해결책을 제시합니다. 새로운 기술과 방법론을 적극적으로 학습하고 적용하여 효율적인 솔루션을 제공합니다.'
      },
      {
        id: '2',
        title: '팀워크',
        shortDescription: '협력과 소통을 중시합니다',
        detailedDescription: '팀원들과의 원활한 소통을 통해 프로젝트의 성공을 이끌어냅니다. 다양한 의견을 수렴하고 조율하여 최적의 결과를 만들어냅니다.'
      },
      {
        id: '3',
        title: '지속적 학습',
        shortDescription: '끊임없이 새로운 것을 배웁니다',
        detailedDescription: '기술의 빠른 변화에 맞춰 지속적으로 새로운 기술과 트렌드를 학습합니다. 온라인 강의, 컨퍼런스, 오픈소스 프로젝트 참여 등을 통해 실력을 향상시킵니다.'
      }
    ],
    socialLinks: [
      {
        id: '1',
        platform: 'YouTube',
        url: 'https://youtube.com',
        icon: 'youtube'
      },
      {
        id: '2',
        platform: 'GitHub',
        url: 'https://github.com',
        icon: 'github'
      }
    ],
    pageTitle: '홍길동의 포트폴리오'
  });

  // 저장 관련 상태 추가
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const updateProfile = (updates: Partial<Profile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  const addStrength = (strength: Omit<Strength, 'id'>) => {
    const newStrength: Strength = {
      ...strength,
      id: Date.now().toString()
    };
    setProfile(prev => ({
      ...prev,
      strengths: [...prev.strengths, newStrength]
    }));
    setHasUnsavedChanges(true);
  };

  const removeStrength = (id: string) => {
    setProfile(prev => ({
      ...prev,
      strengths: prev.strengths.filter(s => s.id !== id)
    }));
    setHasUnsavedChanges(true);
  };

  const updateStrength = (id: string, updates: Partial<Strength>) => {
    setProfile(prev => ({
      ...prev,
      strengths: prev.strengths.map(s => 
        s.id === id ? { ...s, ...updates } : s
      )
    }));
    setHasUnsavedChanges(true);
  };

  const addSocialLink = (link: Omit<SocialLink, 'id'>) => {
    const newLink: SocialLink = {
      ...link,
      id: Date.now().toString()
    };
    setProfile(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, newLink]
    }));
    setHasUnsavedChanges(true);
  };

  const removeSocialLink = (id: string) => {
    setProfile(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter(s => s.id !== id)
    }));
    setHasUnsavedChanges(true);
  };

  const updateSocialLink = (id: string, updates: Partial<SocialLink>) => {
    setProfile(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map(s => 
        s.id === id ? { ...s, ...updates } : s
      )
    }));
    setHasUnsavedChanges(true);
  };

  // 저장 기능 (실제로는 AuthContext의 updateProfileData를 사용해야 함)
  const saveProfile = async () => {
    setIsSaving(true);
    try {
      // 여기서는 실제 저장 로직이 AuthContext에서 처리됨
      // 이 함수는 저장 상태만 관리
      await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 지연
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('저장 실패:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const clearUnsavedChanges = () => {
    setHasUnsavedChanges(false);
  };

  const value: ProfileContextType = {
    profile,
    updateProfile,
    addStrength,
    removeStrength,
    updateStrength,
    addSocialLink,
    removeSocialLink,
    updateSocialLink,
    hasUnsavedChanges,
    isSaving,
    saveProfile,
    clearUnsavedChanges,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}; 