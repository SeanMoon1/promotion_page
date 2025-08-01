import React from 'react';

interface ProfileSectionProps {
  name: string;
  image: string;
  description: string;
  isOwner: boolean;
  onUpdate?: (updates: { name?: string; image?: string; description?: string }) => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  name,
  image,
  description,
  isOwner,
  onUpdate
}) => {
  return (
    <section className="mb-16">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* 이미지 섹션 */}
            <div className="lg:w-1/3 p-8 flex justify-center items-center">
              <div className="relative">
                {image ? (
                  <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={image}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-64 h-64 rounded-full flex items-center justify-center text-gray-400 border-4 border-dashed border-gray-300 bg-gray-50">
                    <div className="text-center">
                      <div className="text-6xl mb-2">👤</div>
                      <p className="text-sm">
                        {isOwner ? '이미지를 업로드하세요' : '이미지 없음'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 정보 섹션 */}
            <div className="lg:w-2/3 p-8">
              <div className="mb-6">
                <h2 className="text-4xl font-bold mb-4 text-gray-900">
                  {name}
                </h2>
                <div className="w-20 h-1 rounded-full mb-6 bg-blue-500"></div>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 leading-relaxed text-lg">
                  {description}
                </p>
              </div>

              {isOwner && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    💡 이 페이지의 소유자입니다. 상단의 버튼들을 사용하여 페이지를 편집할 수 있습니다.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection; 