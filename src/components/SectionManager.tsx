import React, { useState, useCallback } from 'react';
import { Settings, ChevronUp, ChevronDown, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import { ProfileData } from '../types/auth';

interface SectionManagerProps {
  profileData: ProfileData;
  isOwner: boolean;
  onUpdate: (updates: Partial<ProfileData>) => void;
}

const SectionManager: React.FC<SectionManagerProps> = ({
  profileData,
  isOwner,
  onUpdate
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleSection = useCallback((sectionType: 'showStrengths' | 'showSocialLinks' | 'showCustomSections') => {
    const newValue = !profileData[sectionType];
    const updates: Partial<ProfileData> = { [sectionType]: newValue };
    
    // 섹션 순서도 함께 업데이트
    let currentOrder = [...(profileData.sectionOrder || [])];
    
    if (sectionType === 'showCustomSections') {
      if (newValue && !currentOrder.includes('customSections')) {
        currentOrder.push('customSections');
      } else if (!newValue) {
        currentOrder = currentOrder.filter(section => section !== 'customSections');
      }
    } else if (sectionType === 'showStrengths') {
      if (newValue && !currentOrder.includes('strengths')) {
        currentOrder.push('strengths');
      } else if (!newValue) {
        currentOrder = currentOrder.filter(section => section !== 'strengths');
      }
    } else if (sectionType === 'showSocialLinks') {
      if (newValue && !currentOrder.includes('socialLinks')) {
        currentOrder.push('socialLinks');
      } else if (!newValue) {
        currentOrder = currentOrder.filter(section => section !== 'socialLinks');
      }
    }
    
    updates.sectionOrder = currentOrder;
    onUpdate(updates);
  }, [profileData, onUpdate]);

  const handleMoveSection = useCallback((sectionType: string, direction: 'up' | 'down') => {
    const currentOrder = [...(profileData.sectionOrder || [])];
    const currentIndex = currentOrder.indexOf(sectionType);
    
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= currentOrder.length) return;
    
    [currentOrder[currentIndex], currentOrder[newIndex]] = 
    [currentOrder[newIndex], currentOrder[currentIndex]];
    
    onUpdate({ sectionOrder: currentOrder });
  }, [profileData.sectionOrder, onUpdate]);

  const handleAddCustomSection = useCallback(() => {
    const currentOrder = [...(profileData.sectionOrder || [])];
    const newSectionId = `custom_${Date.now()}`;
    
    if (!currentOrder.includes(newSectionId)) {
      currentOrder.push(newSectionId);
      onUpdate({ 
        sectionOrder: currentOrder,
        showCustomSections: true 
      });
    }
  }, [profileData.sectionOrder, onUpdate]);

  const handleRemoveSection = useCallback((sectionType: string) => {
    console.log('Removing section:', sectionType); // 디버깅용 로그
    
    const currentOrder = [...(profileData.sectionOrder || [])];
    const newOrder = currentOrder.filter(section => section !== sectionType);
    
    const updates: Partial<ProfileData> = { sectionOrder: newOrder };
    
    if (sectionType === 'strengths') {
      updates.showStrengths = false;
    } else if (sectionType === 'socialLinks') {
      updates.showSocialLinks = false;
    } else if (sectionType && sectionType.startsWith('custom_')) {
      // 개별 커스텀 섹션 삭제
      console.log('Removing custom section with ID:', sectionType); // 디버깅용 로그
      const updatedSections = (profileData.customSections || []).filter(s => {
        // sectionId가 있는 경우 sectionId로 비교, 없는 경우 id로 비교
        const sectionIdentifier = s.sectionId || s.id;
        return sectionIdentifier !== sectionType;
      });
      console.log('Updated sections:', updatedSections); // 디버깅용 로그
      updates.customSections = updatedSections;
    }
    
    console.log('Final updates:', updates); // 디버깅용 로그
    onUpdate(updates);
  }, [profileData.sectionOrder, profileData.customSections, onUpdate]);

  if (!isOwner) return null;

  // 기본 섹션들
  const baseSections = [
    { 
      type: 'strengths', 
      label: '나의 강점', 
      visible: profileData.showStrengths !== false,
      canRemove: true
    },
    { 
      type: 'socialLinks', 
      label: '소셜 링크', 
      visible: profileData.showSocialLinks !== false,
      canRemove: true
    }
  ];

  // 커스텀 섹션들
  const customSections = (profileData.customSections || [])
    .filter(section => section.sectionId && section.title) // 유효한 섹션만 필터링
    .map(section => ({
      type: section.sectionId,
      label: section.title,
      visible: profileData.showCustomSections === true,
      canRemove: true
    }));

  const allSections = [...baseSections, ...customSections];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Settings className="w-4 h-4 mr-2" />
        섹션 관리
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">섹션 관리</h3>
            
            <div className="space-y-3">
              {allSections.map((section) => {
                const orderIndex = profileData.sectionOrder?.indexOf(section.type) ?? -1;
                
                return (
                  <div key={section.type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleToggleSection(section.type as any)}
                        className={`p-1 rounded ${section.visible ? 'text-green-600' : 'text-gray-400'}`}
                        title={section.visible ? '숨기기' : '보이기'}
                      >
                        {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      
                      <span className={`text-sm font-medium ${section.visible ? 'text-gray-900' : 'text-gray-500'}`}>
                        {section.label}
                      </span>
                    </div>

                    {section.visible && (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleMoveSection(section.type, 'up')}
                          disabled={orderIndex <= 0}
                          className={`p-1 rounded ${orderIndex > 0 ? 'text-gray-600 hover:text-gray-800' : 'text-gray-300'}`}
                          title="위로 이동"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoveSection(section.type, 'down')}
                          disabled={orderIndex >= (profileData.sectionOrder?.length || 0) - 1}
                          className={`p-1 rounded ${orderIndex < (profileData.sectionOrder?.length || 0) - 1 ? 'text-gray-600 hover:text-gray-800' : 'text-gray-300'}`}
                          title="아래로 이동"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        {section.canRemove && (
                          <button
                            onClick={() => handleRemoveSection(section.type)}
                            className="p-1 text-red-500 hover:text-red-700 rounded"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* 커스텀 섹션 추가 버튼 */}
              <div className="pt-3 border-t border-gray-200">
                <button
                  onClick={handleAddCustomSection}
                  className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  커스텀 섹션 추가
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionManager; 