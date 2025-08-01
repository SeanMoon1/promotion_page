import React, { useState } from 'react';
import { X, Palette, Image } from 'lucide-react';
import { ProfileData } from '../types/auth';
import { useTheme } from '../contexts/ThemeContext';

interface ColorPickerProps {
  onClose: () => void;
  profileData: ProfileData;
  onUpdate: (data: Partial<ProfileData>) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onClose, profileData, onUpdate }) => {
  const { extractColorsFromImage } = useTheme();
  const [selectedColorType, setSelectedColorType] = useState<'primary' | 'secondary' | 'accent'>('primary');
  const [rgbValues, setRgbValues] = useState({ r: 0, g: 0, b: 0 });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // 현재 테마 색상들
  const primaryColor = profileData.theme.primaryColor;
  const secondaryColor = profileData.theme.secondaryColor;
  const accentColor = profileData.theme.accentColor;

  const predefinedColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
    '#A9CCE3', '#F9E79F', '#D5A6BD', '#A2D9CE', '#FAD7A0'
  ];

  const getCurrentColor = () => {
    switch (selectedColorType) {
      case 'primary': return primaryColor;
      case 'secondary': return secondaryColor;
      case 'accent': return accentColor;
      default: return primaryColor;
    }
  };

  const setCurrentColor = (color: { r: number; g: number; b: number; hex: string }) => {
    const updates: Partial<ProfileData> = {
      theme: {
        ...profileData.theme,
        [selectedColorType === 'primary' ? 'primaryColor' : 
         selectedColorType === 'secondary' ? 'secondaryColor' : 'accentColor']: color
      }
    };
    onUpdate(updates);
  };

  const handleRgbChange = (field: 'r' | 'g' | 'b', value: string) => {
    const numValue = parseInt(value) || 0;
    const clampedValue = Math.max(0, Math.min(255, numValue));
    
    setRgbValues(prev => ({ ...prev, [field]: clampedValue }));
    
    const newColor = {
      ...rgbValues,
      [field]: clampedValue,
      hex: `#${(rgbValues.r || 0).toString(16).padStart(2, '0')}${(rgbValues.g || 0).toString(16).padStart(2, '0')}${(rgbValues.b || 0).toString(16).padStart(2, '0')}`
    };
    
    setCurrentColor(newColor);
  };

  const handleColorSelect = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    setCurrentColor({ r, g, b, hex });
    setRgbValues({ r, g, b });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      try {
        const colors = await extractColorsFromImage(file);
        if (colors && colors.length > 0) {
          setCurrentColor(colors[0]); // 첫 번째 색상을 현재 색상으로 설정
        } else {
          // 색상을 추출할 수 없는 경우 기본 색상으로 설정
          setCurrentColor({ r: 255, g: 0, b: 0, hex: '#FF0000' });
        }
      } catch (error) {
        console.error('이미지에서 색상을 추출하는데 실패했습니다:', error);
        // 오류 발생 시 기본 색상으로 설정
        setCurrentColor({ r: 255, g: 0, b: 0, hex: '#FF0000' });
      }
    }
  };

  const currentColor = getCurrentColor();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Palette className="mr-2" />
              색상 설정
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* 색상 타입 선택 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">색상 타입 선택</h3>
            <div className="flex space-x-2">
              {[
                { key: 'primary', label: '주요 색상', color: primaryColor },
                { key: 'secondary', label: '보조 색상', color: secondaryColor },
                { key: 'accent', label: '강조 색상', color: accentColor }
              ].map(({ key, label, color }) => (
                <button
                  key={key}
                  onClick={() => setSelectedColorType(key as any)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    selectedColorType === key 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color.hex }}
                    ></div>
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 현재 선택된 색상 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">현재 색상</h3>
            <div className="flex items-center space-x-4">
              <div 
                className="w-16 h-16 rounded-lg border-2 border-gray-200"
                style={{ backgroundColor: currentColor.hex }}
              ></div>
              <div>
                <p className="font-mono text-lg">{currentColor.hex}</p>
                <p className="text-sm text-gray-600">
                  RGB({currentColor.r}, {currentColor.g}, {currentColor.b})
                </p>
              </div>
            </div>
          </div>

          {/* RGB 값 입력 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">RGB 값 직접 입력</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Red', field: 'r' as const, color: '#FF0000' },
                { label: 'Green', field: 'g' as const, color: '#00FF00' },
                { label: 'Blue', field: 'b' as const, color: '#0000FF' }
              ].map(({ label, field, color }) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-2">{label}</label>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color }}
                    ></div>
                    <input
                      type="number"
                      min="0"
                      max="255"
                      value={currentColor[field]}
                      onChange={(e) => handleRgbChange(field, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 색상 팔레트 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">색상 팔레트</h3>
            <div className="grid grid-cols-10 gap-2">
              {predefinedColors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => handleColorSelect(color)}
                  className="w-8 h-8 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors"
                  style={{ backgroundColor: color }}
                  title={color}
                ></button>
              ))}
            </div>
          </div>

          {/* 이미지에서 색상 추출 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Image className="mr-2" />
              이미지에서 색상 추출
            </h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Image className="text-gray-500" size={24} />
                </div>
                <span className="text-sm text-gray-600">
                  이미지를 업로드하여 주요 색상 3가지를 자동으로 추출합니다
                </span>
              </label>
              {imageFile && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ {imageFile.name}에서 색상을 추출했습니다
                </p>
              )}
            </div>
          </div>

          {/* 미리보기 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">색상 미리보기</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: '주요 색상', color: primaryColor },
                { label: '보조 색상', color: secondaryColor },
                { label: '강조 색상', color: accentColor }
              ].map(({ label, color }) => (
                <div key={label} className="text-center">
                  <div 
                    className="w-full h-16 rounded-lg mb-2"
                    style={{ backgroundColor: color.hex }}
                  ></div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-gray-500">{color.hex}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker; 