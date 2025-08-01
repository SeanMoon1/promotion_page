import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Color {
  r: number;
  g: number;
  b: number;
  hex: string;
}

interface ThemeContextType {
  primaryColor: Color;
  secondaryColor: Color;
  accentColor: Color;
  setPrimaryColor: (color: Color) => void;
  setSecondaryColor: (color: Color) => void;
  setAccentColor: (color: Color) => void;
  extractColorsFromImage: (imageFile: File) => Promise<Color[]>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [primaryColor, setPrimaryColor] = useState<Color>({
    r: 59, g: 130, b: 246, hex: '#3b82f6'
  });
  const [secondaryColor, setSecondaryColor] = useState<Color>({
    r: 147, g: 51, b: 234, hex: '#9333ea'
  });
  const [accentColor, setAccentColor] = useState<Color>({
    r: 34, g: 197, b: 94, hex: '#22c55e'
  });

  const extractColorsFromImage = async (imageFile: File): Promise<Color[]> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (!imageData) {
          resolve([]);
          return;
        }
        
        const data = imageData.data;
        const colorMap = new Map<string, number>();
        
        // 샘플링하여 색상 추출
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
          
          colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
        }
        
        // 가장 많이 나타나는 색상 3개 추출
        const sortedColors = Array.from(colorMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([hex]) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return { r, g, b, hex };
          });
        
        resolve(sortedColors);
      };
      
      img.src = URL.createObjectURL(imageFile);
    });
  };

  const value: ThemeContextType = {
    primaryColor,
    secondaryColor,
    accentColor,
    setPrimaryColor,
    setSecondaryColor,
    setAccentColor,
    extractColorsFromImage,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 