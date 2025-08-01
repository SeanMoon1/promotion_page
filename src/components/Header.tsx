import React, { useCallback, useMemo } from 'react';
import { Palette, Upload, Type } from 'lucide-react';
import { ProfileData } from '../types/auth';

interface HeaderProps {
  profileData: ProfileData;
  onUpdate: (data: Partial<ProfileData>) => void;
  onOpenColorPicker: () => void;
  onOpenImageUploader: () => void;
  onOpenTextEditor: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  profileData, 
  onUpdate, 
  onOpenColorPicker, 
  onOpenImageUploader, 
  onOpenTextEditor 
}) => {
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ pageTitle: e.target.value });
  }, [onUpdate]);

  const actionButtons = useMemo(() => [
    {
      onClick: onOpenColorPicker,
      icon: Palette,
      label: '색상 선택하기',
      className: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
    },
    {
      onClick: onOpenImageUploader,
      icon: Upload,
      label: '이미지 업로드',
      className: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
    },
    {
      onClick: onOpenTextEditor,
      icon: Type,
      label: '텍스트 편집',
      className: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
    }
  ], [onOpenColorPicker, onOpenImageUploader, onOpenTextEditor]);

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">{profileData.pageTitle}</h1>
          </div>

          <nav className="flex items-center space-x-4">
            {actionButtons.map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${button.className}`}
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