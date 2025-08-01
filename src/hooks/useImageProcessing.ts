import { useState, useCallback } from 'react';
import { Color } from '../contexts/ThemeContext';

interface UseImageProcessingReturn {
  isProcessing: boolean;
  processedImage: string | null;
  extractedColors: Color[];
  processImage: (file: File) => Promise<void>;
  extractColorsFromImage: (file: File) => Promise<Color[]>;
  simulateBackgroundRemoval: (imageUrl: string) => Promise<string>;
  reset: () => void;
}

export const useImageProcessing = (): UseImageProcessingReturn => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<Color[]>([]);

  const extractColorsFromImage = useCallback(async (file: File): Promise<Color[]> => {
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
        
        // 샘플링하여 색상 추출 (성능 최적화)
        for (let i = 0; i < data.length; i += 16) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // 투명도가 낮은 픽셀 제외
          if (data[i + 3] < 128) continue;
          
          const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
          colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
        }
        
        // 가장 많이 나타나는 색상 3개 선택
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
      
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const simulateBackgroundRemoval = useCallback(async (imageUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 실제로는 AI 서비스를 사용해야 하지만, 여기서는 시뮬레이션
        resolve(imageUrl);
      }, 2000);
    });
  }, []);

  const processImage = useCallback(async (file: File) => {
    setIsProcessing(true);
    try {
      const colors = await extractColorsFromImage(file);
      setExtractedColors(colors);
      
      const imageUrl = URL.createObjectURL(file);
      const processedUrl = await simulateBackgroundRemoval(imageUrl);
      setProcessedImage(processedUrl);
    } catch (error) {
      console.error('Image processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [extractColorsFromImage, simulateBackgroundRemoval]);

  const reset = useCallback(() => {
    setProcessedImage(null);
    setExtractedColors([]);
    setIsProcessing(false);
  }, []);

  return {
    isProcessing,
    processedImage,
    extractedColors,
    processImage,
    extractColorsFromImage,
    simulateBackgroundRemoval,
    reset
  };
}; 