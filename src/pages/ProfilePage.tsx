import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ProfileData } from '../types/auth';
import Header from '../components/Header';
import ProfileSection from '../components/ProfileSection';
import StrengthsSection from '../components/StrengthsSection';
import SocialLinksSection from '../components/SocialLinksSection';
import ColorPicker from '../components/ColorPicker';
import ImageUploader from '../components/ImageUploader';
import TextEditor from '../components/TextEditor';
import { useModal } from '../hooks';
import { LogOut, Settings, User } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { nickname } = useParams<{ nickname: string }>();
  const { user, logout, getProfileData, updateProfileData } = useAuth();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 모달 상태 관리
  const colorPickerModal = useModal();
  const imageUploaderModal = useModal();
  const textEditorModal = useModal();

  // 현재 사용자가 페이지 소유자인지 확인
  const isOwner = useMemo(() => {
    return Boolean(user && nickname && user.nickname === nickname);
  }, [user, nickname]);

  // 프로필 데이터 로드
  useEffect(() => {
    const loadProfileData = async () => {
      if (!nickname) {
        setError('닉네임이 필요합니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getProfileData(nickname);
        
        if (data) {
          setProfileData(data);
          setError(null);
        } else {
          setError('페이지를 찾을 수 없습니다.');
        }
      } catch (err) {
        setError('페이지 로드에 실패했습니다.');
        console.error('Profile data load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [nickname, getProfileData]);

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // 프로필 데이터 업데이트
  const handleProfileUpdate = async (updates: Partial<ProfileData>) => {
    if (!isOwner) return;

    try {
      await updateProfileData(updates);
      setProfileData(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">페이지를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">페이지를 찾을 수 없습니다</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return null;
  }

  const themeStyles = {
    '--primary-color': profileData.theme.primaryColor.hex,
    '--secondary-color': profileData.theme.secondaryColor.hex,
    '--accent-color': profileData.theme.accentColor.hex,
  } as React.CSSProperties;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50" style={themeStyles}>
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* 페이지 제목 */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                {profileData.pageTitle}
              </h1>
              {isOwner && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  내 페이지
                </span>
              )}
            </div>

            {/* 액션 버튼들 */}
            <div className="flex items-center space-x-4">
              {isOwner ? (
                <>
                  <button
                    onClick={colorPickerModal.toggle}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    테마 설정
                  </button>
                  <button
                    onClick={imageUploaderModal.toggle}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4 mr-2" />
                    이미지 업로드
                  </button>
                  <button
                    onClick={textEditorModal.toggle}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    📝 텍스트 편집
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    로그아웃
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4 mr-2" />
                  내 페이지 만들기
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 프로필 섹션 */}
          <div className="lg:col-span-1">
            <ProfileSection
              name={profileData.name}
              image={profileData.image}
              description={profileData.description}
              isOwner={isOwner}
              onUpdate={(updates) => handleProfileUpdate(updates)}
            />
          </div>

          {/* 강점 및 소셜 링크 섹션 */}
          <div className="lg:col-span-2 space-y-8">
            <StrengthsSection
              strengths={profileData.strengths}
              isOwner={isOwner}
              onUpdate={(updates) => handleProfileUpdate(updates)}
            />
            
            <SocialLinksSection
              socialLinks={profileData.socialLinks}
              isOwner={isOwner}
              onUpdate={(updates) => handleProfileUpdate(updates)}
            />
          </div>
        </div>
      </main>

      {/* 모달들 */}
      {isOwner && (
        <>
          {colorPickerModal.isOpen && (
            <ColorPicker onClose={colorPickerModal.close} />
          )}
          {imageUploaderModal.isOpen && (
            <ImageUploader onClose={imageUploaderModal.close} />
          )}
          {textEditorModal.isOpen && (
            <TextEditor onClose={textEditorModal.close} />
          )}
        </>
      )}
    </div>
  );
};

export default ProfilePage; 