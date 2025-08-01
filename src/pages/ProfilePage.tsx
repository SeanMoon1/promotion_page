import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ProfileData } from '../types/auth';
import StrengthsSection from '../components/StrengthsSection';
import SocialLinksSection from '../components/SocialLinksSection';
import { IndividualCustomSection, CustomSectionAdder } from '../components/CustomSection';
import SectionManager from '../components/SectionManager';
import ColorPicker from '../components/ColorPicker';
import ImageUploader from '../components/ImageUploader';
import TextEditor from '../components/TextEditor';
import { useModal } from '../hooks';
import { LogOut, Settings, User, Edit3 } from 'lucide-react';

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

  // 테마 변경 시 배경색 업데이트를 위한 useEffect
  useEffect(() => {
    if (profileData) {
      // 강제로 리렌더링을 위한 상태 업데이트
      setProfileData({ ...profileData });
    }
  }, [profileData?.theme]);

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
    if (!isOwner || !profileData) return;

    try {
      // 커스텀 섹션이 추가되고 섹션 순서에 없으면 자동으로 추가
      if (updates.customSections && updates.customSections.length > 0) {
        const currentOrder = profileData.sectionOrder || [];
        if (!currentOrder.includes('customSections')) {
          updates.sectionOrder = [...currentOrder, 'customSections'];
          updates.showCustomSections = true;
        }
      }
      
      const updatedData = { ...profileData, ...updates } as ProfileData;
      await updateProfileData(updatedData);
      setProfileData(updatedData);
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
    }
  };

  if (!profileData) {
    return null;
  }

  const themeStyles = {
    '--primary-color': profileData.theme.primaryColor.hex,
    '--secondary-color': profileData.theme.secondaryColor.hex,
    '--accent-color': profileData.theme.accentColor.hex,
  } as React.CSSProperties;

  // 테마 색상을 사용한 동적 배경 스타일
  const backgroundStyle = {
    background: `linear-gradient(135deg, ${profileData.theme.primaryColor.hex}15, ${profileData.theme.secondaryColor.hex}15, ${profileData.theme.accentColor.hex}15)`,
  } as React.CSSProperties;

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

  return (
    <div className="min-h-screen" style={{ ...backgroundStyle, ...themeStyles }}>
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
                  <SectionManager
                    profileData={profileData}
                    isOwner={isOwner}
                    onUpdate={handleProfileUpdate}
                  />
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
                    <User className="w-4 h-4 mr-2" />
                    소개 텍스트 편집
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 환영 섹션 */}
        <div className="text-center mb-16 relative">
          {isOwner && (
            <div className="absolute top-0 right-0 flex items-center space-x-2">
              <button
                onClick={textEditorModal.toggle}
                className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                title="환영 메시지 편집"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <div 
            className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6"
            style={{ 
              background: `linear-gradient(135deg, ${profileData.theme.primaryColor.hex}, ${profileData.theme.secondaryColor.hex})`
            }}
          >
            <span className="text-white text-4xl">👋</span>
          </div>
          
          <h1 
            className={`text-6xl font-bold mb-4 ${isOwner ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
            style={{ 
              color: profileData.theme.primaryColor.hex
            }}
            onClick={isOwner ? textEditorModal.toggle : undefined}
            title={isOwner ? '환영 메시지 편집' : undefined}
          >
            안녕하세요!
          </h1>
          
          <h2 
            className={`text-4xl font-bold text-gray-800 mb-6 ${isOwner ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
            onClick={isOwner ? textEditorModal.toggle : undefined}
            title={isOwner ? '닉네임 편집' : undefined}
          >
            저는 <span style={{ color: profileData.theme.primaryColor.hex }}>{profileData.nickname}</span>입니다
          </h2>
          
          <p 
            className={`text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed ${isOwner ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
            onClick={isOwner ? textEditorModal.toggle : undefined}
            title={isOwner ? '소개 문구 편집' : undefined}
          >
            {profileData.description}
          </p>
        </div>

        {/* 프로필 카드 섹션 */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16">
          <div className="flex flex-col lg:flex-row">
            {/* 이미지 섹션 */}
            <div 
              className="lg:w-1/3 p-12 flex justify-center items-center"
              style={{ 
                background: `linear-gradient(135deg, ${profileData.theme.primaryColor.hex}10, ${profileData.theme.secondaryColor.hex}10)`
              }}
            >
              <div className="relative">
                {profileData.image ? (
                  <div className="w-80 h-80 rounded-full overflow-hidden border-8 border-white shadow-2xl">
                    <img
                      src={profileData.image}
                      alt={profileData.name}
                      className="w-full h-full object-cover"
                    />
                    {isOwner && (
                      <button
                        onClick={imageUploaderModal.toggle}
                        className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center"
                        title="이미지 변경"
                      >
                        <div className="text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <User className="w-8 h-8" />
                        </div>
                      </button>
                    )}
                  </div>
                ) : (
                  <div 
                    className={`w-80 h-80 rounded-full flex items-center justify-center text-gray-400 border-8 border-dashed border-gray-300 bg-white shadow-2xl ${isOwner ? 'cursor-pointer hover:border-gray-400 hover:text-gray-600 transition-colors' : ''}`}
                    onClick={isOwner ? imageUploaderModal.toggle : undefined}
                    title={isOwner ? '이미지 업로드' : '프로필 이미지'}
                  >
                    <div className="text-center">
                      <div className="text-8xl mb-4">👤</div>
                      <p className="text-lg font-medium">
                        {isOwner ? '이미지를 업로드하세요' : '프로필 이미지'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 정보 섹션 */}
            <div className="lg:w-2/3 p-12 flex flex-col justify-center">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-5xl font-bold text-gray-900">
                    {profileData.name}
                  </h3>
                  {isOwner && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={textEditorModal.toggle}
                        className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="프로필 편집"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <div 
                  className="w-24 h-2 rounded-full mb-8"
                  style={{ 
                    background: `linear-gradient(135deg, ${profileData.theme.primaryColor.hex}, ${profileData.theme.secondaryColor.hex})`
                  }}
                ></div>
              </div>

              <div className="prose prose-xl max-w-none">
                <p className="text-gray-700 leading-relaxed text-xl">
                  {profileData.description}
                </p>
              </div>

              {isOwner && (
                <div 
                  className="mt-8 p-6 rounded-2xl border"
                  style={{ 
                    background: `linear-gradient(135deg, ${profileData.theme.primaryColor.hex}10, ${profileData.theme.secondaryColor.hex}10)`,
                    borderColor: `${profileData.theme.primaryColor.hex}30`
                  }}
                >
                  <div className="flex items-center mb-4">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                      style={{ backgroundColor: profileData.theme.primaryColor.hex }}
                    >
                      <span className="text-white text-sm">💡</span>
                    </div>
                    <h4 
                      className="text-lg font-semibold"
                      style={{ color: profileData.theme.primaryColor.hex }}
                    >
                      페이지 편집 안내
                    </h4>
                  </div>
                  <p 
                    className="leading-relaxed"
                    style={{ color: profileData.theme.primaryColor.hex }}
                  >
                    상단의 버튼들을 사용하여 테마 색상, 프로필 이미지, 소개 텍스트를 자유롭게 편집할 수 있습니다.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 섹션들을 순서에 따라 렌더링 */}
        {profileData.sectionOrder?.map((sectionType) => {
          switch (sectionType) {
            case 'strengths':
              return profileData.showStrengths !== false ? (
                <div key="strengths" className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16">
                  <StrengthsSection
                    strengths={profileData.strengths || []}
                    strengthsTitle={profileData.strengthsTitle || '나의 강점'}
                    isOwner={isOwner}
                    theme={profileData.theme}
                    onUpdate={(updates) => handleProfileUpdate(updates)}
                  />
                </div>
              ) : null;
            
            case 'socialLinks':
              return profileData.showSocialLinks !== false ? (
                <div key="socialLinks" className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16">
                  <SocialLinksSection
                    socialLinks={profileData.socialLinks || []}
                    isOwner={isOwner}
                    onUpdate={(updates) => handleProfileUpdate(updates)}
                  />
                </div>
              ) : null;
            
            default:
              // 커스텀 섹션 처리
              if (sectionType.startsWith('custom_')) {
                const sectionId = sectionType;
                const section = (profileData.customSections || []).find(s => s.sectionId === sectionId);
                
                if (section && profileData.showCustomSections === true) {
                  return (
                    <div key={sectionId} className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16">
                      <IndividualCustomSection
                        section={section}
                        isOwner={isOwner}
                        onUpdate={(updatedSection) => {
                          const newSections = (profileData.customSections || []).map(s => 
                            s.sectionId === sectionId ? updatedSection : s
                          );
                          handleProfileUpdate({ customSections: newSections });
                        }}
                        onRemove={(sectionId) => {
                          const newSections = (profileData.customSections || []).filter(s => s.sectionId !== sectionId);
                          const newOrder = (profileData.sectionOrder || []).filter(id => id !== sectionId);
                          handleProfileUpdate({ 
                            customSections: newSections,
                            sectionOrder: newOrder
                          });
                        }}
                      />
                    </div>
                  );
                }
              }
              return null;
          }
        })}

        {/* 커스텀 섹션 추가 (소유자만) */}
        {isOwner && profileData.showCustomSections === true && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16">
            <CustomSectionAdder
              isOwner={isOwner}
              onAdd={(newSection) => {
                const updatedSections = [...(profileData.customSections || []), newSection];
                const updatedOrder = [...(profileData.sectionOrder || []), newSection.sectionId];
                handleProfileUpdate({ 
                  customSections: updatedSections,
                  sectionOrder: updatedOrder
                });
              }}
            />
          </div>
        )}

        {/* 기본 섹션들이 sectionOrder에 없으면 기본값으로 표시 */}
        {(!profileData.sectionOrder || profileData.sectionOrder.length === 0) && (
          <>
            {profileData.showStrengths !== false && (
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16">
                <StrengthsSection
                  strengths={profileData.strengths || []}
                  strengthsTitle={profileData.strengthsTitle || '나의 강점'}
                  isOwner={isOwner}
                  theme={profileData.theme}
                  onUpdate={(updates) => handleProfileUpdate(updates)}
                />
              </div>
            )}
            
            {profileData.showSocialLinks !== false && (
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16">
                <SocialLinksSection
                  socialLinks={profileData.socialLinks || []}
                  isOwner={isOwner}
                  onUpdate={(updates) => handleProfileUpdate(updates)}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* 모달들 */}
      {isOwner && (
        <>
          {colorPickerModal.isOpen && (
            <ColorPicker 
              onClose={colorPickerModal.close}
              profileData={profileData}
              onUpdate={handleProfileUpdate}
            />
          )}
          {imageUploaderModal.isOpen && (
            <ImageUploader 
              onClose={imageUploaderModal.close}
              profileData={profileData}
              onUpdate={handleProfileUpdate}
            />
          )}
          {textEditorModal.isOpen && (
            <TextEditor
              onClose={textEditorModal.close}
              profileData={profileData}
              onUpdate={handleProfileUpdate}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ProfilePage; 