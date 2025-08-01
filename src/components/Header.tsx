import React, { useState, useCallback, useMemo } from 'react';
import { useProfile } from '../contexts/ProfileContext';
import { Palette, Image, Type, Settings } from 'lucide-react';

interface HeaderProps {
  pageTitle: string;
  onColorPickerToggle: () => void;
  onImageUploaderToggle: () => void;
  onTextEditorToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({
  pageTitle,
  onColorPickerToggle,
  onImageUploaderToggle,
  onTextEditorToggle
}) => {
  const { updateProfile } = useProfile();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(pageTitle);

  // Memoized action buttons to prevent unnecessary re-renders
  const actionButtons = useMemo(() => [
    {
      onClick: onColorPickerToggle,
      icon: Palette,
      label: '색상 설정',
      gradient: 'from-blue-500 to-purple-500',
      hoverGradient: 'from-blue-600 to-purple-600'
    },
    {
      onClick: onImageUploaderToggle,
      icon: Image,
      label: '이미지 업로드',
      gradient: 'from-green-500 to-teal-500',
      hoverGradient: 'from-green-600 to-teal-600'
    },
    {
      onClick: onTextEditorToggle,
      icon: Type,
      label: '텍스트 편집',
      gradient: 'from-orange-500 to-red-500',
      hoverGradient: 'from-orange-600 to-red-600'
    }
  ], [onColorPickerToggle, onImageUploaderToggle, onTextEditorToggle]);

  const handleTitleSave = useCallback(() => {
    updateProfile({ pageTitle: tempTitle });
    setIsEditingTitle(false);
  }, [tempTitle, updateProfile]);

  const handleTitleCancel = useCallback(() => {
    setTempTitle(pageTitle);
    setIsEditingTitle(false);
  }, [pageTitle]);

  const handleTitleEdit = useCallback(() => {
    setIsEditingTitle(true);
  }, []);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTempTitle(e.target.value);
  }, []);

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {isEditingTitle ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={tempTitle}
                  onChange={handleTitleChange}
                  className="text-2xl font-bold text-gray-800 border-b-2 border-blue-500 focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleTitleSave}
                  className="px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  저장
                </button>
                <button
                  onClick={handleTitleCancel}
                  className="px-2 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  취소
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-gray-800">{pageTitle}</h1>
                <button
                  onClick={handleTitleEdit}
                  className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Settings size={16} />
                </button>
              </div>
            )}
          </div>

          <nav className="flex items-center space-x-4">
            {actionButtons.map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
                className={`flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${button.gradient} text-white rounded-lg hover:${button.hoverGradient} transition-all duration-200`}
              >
                <button.icon size={20} />
                <span>{button.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 