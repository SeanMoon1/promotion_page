import React from 'react';
import { useProfile } from '../contexts/ProfileContext';
import { useTheme } from '../contexts/ThemeContext';

const ProfileSection: React.FC = () => {
  const { profile } = useProfile();
  const { primaryColor } = useTheme();

  return (
    <section className="mb-16">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* 이미지 섹션 */}
            <div className="lg:w-1/3 p-8 flex justify-center items-center">
              <div className="relative">
                {profile.image ? (
                  <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={profile.image}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div 
                    className="w-64 h-64 rounded-full flex items-center justify-center text-gray-400 border-4 border-dashed border-gray-300"
                    style={{ backgroundColor: `${primaryColor.hex}20` }}
                  >
                    <div className="text-center">
                      <div className="text-6xl mb-2">👤</div>
                      <p className="text-sm">이미지를 업로드하세요</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 정보 섹션 */}
            <div className="lg:w-2/3 p-8">
              <div className="mb-6">
                <h2 
                  className="text-4xl font-bold mb-4"
                  style={{ color: primaryColor.hex }}
                >
                  {profile.name}
                </h2>
                <div className="w-20 h-1 rounded-full mb-6" style={{ backgroundColor: primaryColor.hex }}></div>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 leading-relaxed text-lg">
                  {profile.description}
                </p>
              </div>

              {/* 소셜 링크 미리보기 */}
              {profile.socialLinks.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">연결하기</h3>
                  <div className="flex space-x-4">
                    {profile.socialLinks.slice(0, 3).map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                        style={{ color: primaryColor.hex }}
                      >
                        <span className="text-xl">{getSocialIcon(link.icon)}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const getSocialIcon = (icon: string): string => {
  const iconMap: { [key: string]: string } = {
    youtube: '📺',
    github: '🐙',
    instagram: '📷',
    twitter: '🐦',
    facebook: '📘',
    linkedin: '💼',
    tiktok: '🎵',
    twitch: '🎮',
    naver: '🟢',
    soop: '🍜',
    chzzk: '🎯'
  };
  return iconMap[icon.toLowerCase()] || '🔗';
};

export default ProfileSection; 