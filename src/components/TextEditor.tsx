import React, { useCallback, useMemo } from 'react';
import { useProfile } from '../contexts/ProfileContext';
import { useTheme } from '../contexts/ThemeContext';
import { useTextEditor } from '../hooks';
import { X, Type, Bold, Italic, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';

interface TextEditorProps {
  onClose: () => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ onClose }) => {
  const { profile, updateProfile } = useProfile();
  const { primaryColor, secondaryColor, accentColor } = useTheme();
  
  const {
    textStyle,
    fontOptions,
    fontWeightOptions,
    textAlignOptions,
    updateStyle,
    applyStyle,
    getStyleString,
    getInlineStyle
  } = useTextEditor({
    onApply: (style) => {
      // 실제로는 프로필의 텍스트 스타일을 업데이트하는 로직을 구현
      console.log('적용된 스타일:', style);
      updateProfile({ description: profile.description }); // 임시로 프로필 업데이트
    }
  });

  const colorOptions = useMemo(() => [
    { value: '#000000', label: '검정' },
    { value: '#FFFFFF', label: '흰색' },
    { value: '#FF0000', label: '빨강' },
    { value: '#00FF00', label: '초록' },
    { value: '#0000FF', label: '파랑' },
    { value: '#FFFF00', label: '노랑' },
    { value: '#FF00FF', label: '마젠타' },
    { value: '#00FFFF', label: '시안' },
    { value: '#FFA500', label: '주황' },
    { value: '#800080', label: '보라' },
    { value: primaryColor.hex, label: '주요 색상' },
    { value: secondaryColor.hex, label: '보조 색상' },
    { value: accentColor.hex, label: '강조 색상' }
  ], [primaryColor.hex, secondaryColor.hex, accentColor.hex]);

  const backgroundColorOptions = useMemo(() => [
    { value: 'transparent', label: '투명' },
    { value: '#FFFFFF', label: '흰색' },
    { value: '#F3F4F6', label: '연한 회색' },
    { value: '#E5E7EB', label: '회색' },
    { value: '#FEF3C7', label: '연한 노랑' },
    { value: '#DBEAFE', label: '연한 파랑' },
    { value: '#D1FAE5', label: '연한 초록' },
    { value: '#FEE2E2', label: '연한 빨강' },
    { value: `${primaryColor.hex}20`, label: '주요 색상 (투명)' },
    { value: `${secondaryColor.hex}20`, label: '보조 색상 (투명)' },
    { value: `${accentColor.hex}20`, label: '강조 색상 (투명)' }
  ], [primaryColor.hex, secondaryColor.hex, accentColor.hex]);

  const handleApplyStyle = useCallback(() => {
    applyStyle();
    onClose();
  }, [applyStyle, onClose]);

  const handleStyleChange = useCallback((property: keyof typeof textStyle, value: string | number) => {
    updateStyle(property, value);
  }, [updateStyle]);

  const renderColorPalette = useCallback((options: typeof colorOptions, property: 'color' | 'backgroundColor') => (
    <div className="grid grid-cols-6 gap-2">
      {options.map(color => (
        <button
          key={color.value}
          onClick={() => handleStyleChange(property, color.value)}
          className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
          style={{ backgroundColor: color.value }}
          title={color.label}
        />
      ))}
    </div>
  ), [handleStyleChange]);

  const renderAlignmentButtons = useCallback(() => (
    <div className="flex space-x-2">
      {[
        { value: 'left', icon: AlignLeft, label: '왼쪽' },
        { value: 'center', icon: AlignCenter, label: '가운데' },
        { value: 'right', icon: AlignRight, label: '오른쪽' },
        { value: 'justify', icon: AlignJustify, label: '양쪽' }
      ].map(option => (
        <button
          key={option.value}
          onClick={() => handleStyleChange('textAlign', option.value)}
          className={`flex items-center space-x-1 px-3 py-2 rounded ${
            textStyle.textAlign === option.value
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <option.icon size={16} />
          <span className="text-sm">{option.label}</span>
        </button>
      ))}
    </div>
  ), [textStyle.textAlign, handleStyleChange]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Type className="mr-2" />
              텍스트 편집기
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 편집 패널 */}
            <div className="space-y-6">
              {/* 글꼴 설정 */}
              <div>
                <h3 className="text-lg font-semibold mb-3">글꼴 설정</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">글꼴</label>
                    <select
                      value={textStyle.fontFamily}
                      onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {fontOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">글자 크기</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="8"
                        max="72"
                        value={textStyle.fontSize}
                        onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm font-mono w-12">{textStyle.fontSize}px</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">글자 굵기</label>
                    <div className="flex space-x-2">
                      {fontWeightOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => handleStyleChange('fontWeight', option.value)}
                          className={`px-3 py-1 rounded text-sm ${
                            textStyle.fontWeight === option.value
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 색상 설정 */}
              <div>
                <h3 className="text-lg font-semibold mb-3">색상 설정</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">글자 색상</label>
                    {renderColorPalette(colorOptions, 'color')}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">배경 색상</label>
                    {renderColorPalette(backgroundColorOptions, 'backgroundColor')}
                  </div>
                </div>
              </div>

              {/* 정렬 설정 */}
              <div>
                <h3 className="text-lg font-semibold mb-3">정렬 설정</h3>
                {renderAlignmentButtons()}
              </div>

              {/* 스타일 버튼 */}
              <div>
                <h3 className="text-lg font-semibold mb-3">스타일</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStyleChange('fontStyle', textStyle.fontStyle === 'italic' ? 'normal' : 'italic')}
                    className={`flex items-center space-x-1 px-3 py-2 rounded ${
                      textStyle.fontStyle === 'italic'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Italic size={16} />
                    <span className="text-sm">기울임</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 미리보기 */}
            <div>
              <h3 className="text-lg font-semibold mb-3">미리보기</h3>
              <div className="border border-gray-200 rounded-lg p-6 min-h-[300px]">
                <div
                  className="prose max-w-none"
                  style={getInlineStyle()}
                >
                  <h2>안녕하세요!</h2>
                  <p>
                    이것은 텍스트 편집기의 미리보기입니다. 
                    왼쪽의 설정을 변경하면 이 텍스트의 스타일이 실시간으로 변경됩니다.
                  </p>
                  <p>
                    글꼴, 크기, 색상, 배경색, 정렬 등 모든 스타일을 자유롭게 조정할 수 있습니다.
                  </p>
                </div>
              </div>

              {/* CSS 코드 */}
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">CSS 코드</h4>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                  <code>{getStyleString()}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleApplyStyle}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              스타일 적용
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextEditor; 