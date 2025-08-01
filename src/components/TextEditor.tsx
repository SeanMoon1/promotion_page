import React, { useCallback, useState, useMemo } from 'react';
import { X, Type, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { ProfileData } from '../types/auth';

interface TextEditorProps {
  onClose: () => void;
  profileData: ProfileData;
  onUpdate: (data: Partial<ProfileData>) => void;
}

type EditSection = 'welcome' | 'profile' | 'strengths' | 'socialLinks' | 'custom';

const TextEditor: React.FC<TextEditorProps> = ({ onClose, profileData, onUpdate }) => {
  const [selectedSection, setSelectedSection] = useState<EditSection>('welcome');
  const [text, setText] = useState(profileData.description || '');
  const [pageTitle, setPageTitle] = useState(profileData.pageTitle || '');
  const [strengthsTitle, setStrengthsTitle] = useState(profileData.strengthsTitle || '나의 강점');
  const [customSectionTitle, setCustomSectionTitle] = useState('');
  const [customSectionContent, setCustomSectionContent] = useState('');
  const [selectedCustomSection, setSelectedCustomSection] = useState<string | null>(null);
  
  const [textStyle, setTextStyle] = useState({
    bold: false,
    italic: false,
    underline: false,
    textAlign: 'left' as 'left' | 'center' | 'right' | 'justify',
    color: '#000000',
    fontSize: '16px'
  });

  const handleSave = useCallback(() => {
    const updates: Partial<ProfileData> = {};
    
    switch (selectedSection) {
      case 'welcome':
        updates.description = text;
        break;
      case 'profile':
        updates.description = text;
        updates.pageTitle = pageTitle;
        break;
      case 'strengths':
        updates.strengthsTitle = strengthsTitle;
        break;
      case 'custom':
        if (selectedCustomSection) {
          const updatedSections = validCustomSections.map(section => 
            section.id === selectedCustomSection 
              ? { ...section, title: customSectionTitle, content: customSectionContent }
              : section
          );
          updates.customSections = updatedSections;
        }
        break;
    }
    
    onUpdate(updates);
    onClose();
  }, [selectedSection, text, pageTitle, strengthsTitle, customSectionTitle, customSectionContent, selectedCustomSection, profileData.customSections, onUpdate, onClose]);

  const handleReset = useCallback(() => {
    setText(profileData.description || '');
    setPageTitle(profileData.pageTitle || '');
    setStrengthsTitle(profileData.strengthsTitle || '나의 강점');
    setCustomSectionTitle('');
    setCustomSectionContent('');
    setSelectedCustomSection(null);
    setTextStyle({
      bold: false,
      italic: false,
      underline: false,
      textAlign: 'left',
      color: '#000000',
      fontSize: '16px'
    });
  }, [profileData]);

  const updateTextStyle = useCallback((property: keyof typeof textStyle, value: any) => {
    setTextStyle(prev => ({ ...prev, [property]: value }));
  }, []);

  const getTextStyle = useCallback(() => {
    return {
      fontWeight: textStyle.bold ? 'bold' : 'normal',
      fontStyle: textStyle.italic ? 'italic' : 'normal',
      textDecoration: textStyle.underline ? 'underline' : 'none',
      textAlign: textStyle.textAlign,
      color: textStyle.color,
      fontSize: textStyle.fontSize
    };
  }, [textStyle]);

  const handleCustomSectionSelect = useCallback((sectionId: string) => {
    const section = (profileData.customSections || []).find(s => s.id === sectionId);
    if (section) {
      setSelectedCustomSection(sectionId);
      setCustomSectionTitle(section.title);
      setCustomSectionContent(section.content);
    }
  }, [profileData.customSections]);

  // 삭제된 섹션을 제외한 유효한 커스텀 섹션들만 필터링
  const validCustomSections = useMemo(() => {
    const sectionOrder = profileData.sectionOrder || [];
    return (profileData.customSections || []).filter(section => 
      sectionOrder.includes(section.sectionId)
    );
  }, [profileData.customSections, profileData.sectionOrder]);

  const fontSizeOptions = [
    { value: '12px', label: '12px' },
    { value: '14px', label: '14px' },
    { value: '16px', label: '16px' },
    { value: '18px', label: '18px' },
    { value: '20px', label: '20px' },
    { value: '24px', label: '24px' },
    { value: '28px', label: '28px' },
    { value: '32px', label: '32px' }
  ];

  const colorOptions = [
    { value: '#000000', label: '검정' },
    { value: '#FFFFFF', label: '흰색' },
    { value: '#FF0000', label: '빨강' },
    { value: '#00FF00', label: '초록' },
    { value: '#0000FF', label: '파랑' },
    { value: '#FFFF00', label: '노랑' },
    { value: '#FF00FF', label: '마젠타' },
    { value: '#00FFFF', label: '시안' },
    { value: '#FFA500', label: '주황' },
    { value: '#800080', label: '보라' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">텍스트 편집</h2>
            
            {/* 섹션 선택 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">편집할 섹션:</span>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value as EditSection)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="welcome">환영 메시지</option>
                <option value="profile">프로필</option>
                <option value="strengths">나의 강점</option>
                <option value="socialLinks">외부 링크</option>
                {validCustomSections.map(section => (
                  <option key={section.id} value="custom">
                    {section.title}
                  </option>
                ))}
              </select>
              
              {/* 커스텀 섹션 선택 (custom이 선택된 경우) */}
              {selectedSection === 'custom' && (
                <select
                  value={selectedCustomSection || ''}
                  onChange={(e) => handleCustomSectionSelect(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">커스텀 섹션 선택</option>
                  {validCustomSections.map(section => (
                    <option key={section.id} value={section.id}>
                      {section.title}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 툴바 */}
        <div className="flex items-center space-x-2 p-4 border-b border-gray-200 bg-gray-50 overflow-x-auto">
          {/* 글꼴 스타일 */}
          <button
            onClick={() => updateTextStyle('bold', !textStyle.bold)}
            className={`p-2 rounded ${textStyle.bold ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} hover:bg-blue-100 transition-colors`}
            title="굵게"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => updateTextStyle('italic', !textStyle.italic)}
            className={`p-2 rounded ${textStyle.italic ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} hover:bg-blue-100 transition-colors`}
            title="기울임"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => updateTextStyle('underline', !textStyle.underline)}
            className={`p-2 rounded ${textStyle.underline ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} hover:bg-blue-100 transition-colors`}
            title="밑줄"
          >
            <Underline className="w-4 h-4" />
          </button>
          
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          
          {/* 텍스트 정렬 */}
          <button
            onClick={() => updateTextStyle('textAlign', 'left')}
            className={`p-2 rounded ${textStyle.textAlign === 'left' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} hover:bg-blue-100 transition-colors`}
            title="왼쪽 정렬"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => updateTextStyle('textAlign', 'center')}
            className={`p-2 rounded ${textStyle.textAlign === 'center' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} hover:bg-blue-100 transition-colors`}
            title="가운데 정렬"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => updateTextStyle('textAlign', 'right')}
            className={`p-2 rounded ${textStyle.textAlign === 'right' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} hover:bg-blue-100 transition-colors`}
            title="오른쪽 정렬"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => updateTextStyle('textAlign', 'justify')}
            className={`p-2 rounded ${textStyle.textAlign === 'justify' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} hover:bg-blue-100 transition-colors`}
            title="양쪽 정렬"
          >
            <AlignJustify className="w-4 h-4" />
          </button>
          
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          
          {/* 글자 크기 */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">크기:</span>
            <select
              value={textStyle.fontSize}
              onChange={(e) => updateTextStyle('fontSize', e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              {fontSizeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          
          {/* 색상 선택 */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">색상:</span>
            <div className="flex space-x-1">
              {colorOptions.slice(0, 5).map((color) => (
                <button
                  key={color.value}
                  onClick={() => updateTextStyle('color', color.value)}
                  className={`w-6 h-6 rounded border-2 ${textStyle.color === color.value ? 'border-blue-500' : 'border-gray-300'} hover:scale-110 transition-transform`}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
              ))}
            </div>
            <input
              type="color"
              value={textStyle.color}
              onChange={(e) => updateTextStyle('color', e.target.value)}
              className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
              title="커스텀 색상"
            />
          </div>
        </div>

        {/* 편집 영역 */}
        <div className="p-6 space-y-6">
          {selectedSection === 'welcome' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">소개 문구</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={getTextStyle()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="자신을 소개하는 문구를 작성해보세요!"
                rows={4}
              />
              <p className="text-sm text-gray-500 mt-2">
                이 문구는 환영 섹션의 소개 문구로 표시됩니다.
              </p>
            </div>
          )}

          {selectedSection === 'profile' && (
            <>
              {/* 페이지 제목 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">페이지 제목</label>
                <input
                  type="text"
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="페이지 제목을 입력하세요"
                />
              </div>

              {/* 소개 텍스트 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">소개 텍스트</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  style={getTextStyle()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="자신을 소개하는 문구를 작성해보세요!"
                  rows={8}
                />
              </div>
            </>
          )}

          {selectedSection === 'strengths' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">강점 섹션 제목</label>
              <input
                type="text"
                value={strengthsTitle}
                onChange={(e) => setStrengthsTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="강점 섹션의 제목을 입력하세요"
              />
            </div>
          )}

          {selectedSection === 'custom' && selectedCustomSection && (
            <>
              {/* 커스텀 섹션 제목 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">섹션 제목</label>
                <input
                  type="text"
                  value={customSectionTitle}
                  onChange={(e) => setCustomSectionTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="섹션 제목을 입력하세요"
                />
              </div>

              {/* 커스텀 섹션 내용 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">섹션 내용</label>
                <textarea
                  value={customSectionContent}
                  onChange={(e) => setCustomSectionContent(e.target.value)}
                  style={getTextStyle()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="섹션 내용을 입력하세요"
                  rows={8}
                />
              </div>
            </>
          )}

          {selectedSection === 'custom' && !selectedCustomSection && (
            <div className="text-center py-8 text-gray-500">
              <p>편집할 커스텀 섹션을 선택해주세요.</p>
            </div>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            초기화
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextEditor; 