import React, { useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useImageProcessing } from '../hooks';
import { X, Upload, Image, RotateCcw, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { ProfileData } from '../types/auth';
import { storage } from '../utils/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useAuth } from '../contexts/AuthContext';

interface ImageUploaderProps {
  onClose: () => void;
  profileData: ProfileData;
  onUpdate: (data: Partial<ProfileData>) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onClose, profileData, onUpdate }) => {
  const { user } = useAuth();
  const {
    isProcessing,
    processedImage,
    extractedColors,
    processImage,
    reset
  } = useImageProcessing();

  const [removeBackground, setRemoveBackground] = useState(true);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setOriginalImage(URL.createObjectURL(file));
      processImage(file);
      setUploadStatus('idle');
      setUploadError(null);
    }
  }, [processImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    multiple: false
  });

  // Firebase Storage에 이미지 업로드
  const uploadImageToStorage = useCallback(async (imageBlob: Blob): Promise<string> => {
    if (!user?.uid) {
      throw new Error('사용자 인증이 필요합니다.');
    }

    try {
      // 기존 이미지가 있으면 삭제
      if (profileData.image && profileData.image.includes('firebase')) {
        try {
          const oldImageRef = ref(storage, profileData.image);
          await deleteObject(oldImageRef);
        } catch (error) {
          console.warn('기존 이미지 삭제 실패:', error);
        }
      }

      // 새 이미지 업로드
      const timestamp = Date.now();
      const imageName = `profile-${user.uid}-${timestamp}.jpg`;
      const imageRef = ref(storage, `profile-images/${user.uid}/${imageName}`);
      
      await uploadBytes(imageRef, imageBlob, {
        contentType: 'image/jpeg',
        cacheControl: 'public, max-age=31536000' // 1년 캐시
      });

      // 다운로드 URL 가져오기
      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
    } catch (error: any) {
      console.error('이미지 업로드 실패:', error);
      throw new Error(`이미지 업로드에 실패했습니다: ${error.message}`);
    }
  }, [user?.uid, profileData.image]);

  // Blob URL을 Blob 객체로 변환
  const urlToBlob = useCallback(async (url: string): Promise<Blob> => {
    const response = await fetch(url);
    return await response.blob();
  }, []);

  const handleApplyImage = useCallback(async () => {
    if (!processedImage) return;

    setUploading(true);
    setUploadStatus('idle');
    setUploadError(null);

    try {
      // 이미지를 Blob으로 변환
      const imageBlob = await urlToBlob(processedImage);
      
      // Firebase Storage에 업로드
      const downloadURL = await uploadImageToStorage(imageBlob);
      
      // 프로필 데이터 업데이트
      onUpdate({ image: downloadURL });
      
      setUploadStatus('success');
      
      // 성공 후 2초 뒤 모달 닫기
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error: any) {
      console.error('이미지 적용 실패:', error);
      setUploadStatus('error');
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  }, [processedImage, uploadImageToStorage, onUpdate, onClose, urlToBlob]);

  const handleReset = useCallback(() => {
    reset();
    setOriginalImage(null);
    setRemoveBackground(true);
    setUploadStatus('idle');
    setUploadError(null);
  }, [reset]);

  const handleToggleBackgroundRemoval = useCallback(() => {
    setRemoveBackground(prev => !prev);
  }, []);

  const dropzoneClasses = useMemo(() => {
    const baseClasses = "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200";
    if (isDragActive) {
      return `${baseClasses} border-blue-500 bg-blue-50`;
    }
    return `${baseClasses} border-gray-300 hover:border-gray-400`;
  }, [isDragActive]);

  const actionButtons = useMemo(() => [
    {
      onClick: handleReset,
      icon: RotateCcw,
      label: '초기화',
      className: 'bg-gray-500 hover:bg-gray-600',
      disabled: uploading
    },
    {
      onClick: onClose,
      icon: X,
      label: '취소',
      className: 'bg-red-500 hover:bg-red-600',
      disabled: uploading
    },
    {
      onClick: handleApplyImage,
      icon: uploading ? (uploadStatus === 'success' ? CheckCircle : Save) : Image,
      label: uploading 
        ? (uploadStatus === 'success' ? '완료!' : '업로드 중...')
        : '적용',
      className: uploadStatus === 'success' 
        ? 'bg-green-500 hover:bg-green-600' 
        : 'bg-blue-500 hover:bg-blue-600',
      disabled: !processedImage || uploading
    }
  ], [handleReset, onClose, handleApplyImage, processedImage, uploading, uploadStatus]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Image className="mr-2" />
              이미지 업로드
            </h2>
            <button
              onClick={onClose}
              disabled={uploading}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
            >
              <X size={24} />
            </button>
          </div>

          {/* 업로드 상태 표시 */}
          {uploadStatus === 'success' && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center text-green-800">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>이미지가 성공적으로 업로드되었습니다!</span>
              </div>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center text-red-800">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>업로드 실패: {uploadError}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 업로드 영역 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">이미지 업로드</h3>
              <div {...getRootProps()} className={dropzoneClasses}>
                <input {...getInputProps()} />
                <Upload size={48} className="mx-auto mb-4 text-gray-400" />
                {isDragActive ? (
                  <p className="text-blue-600 font-medium">파일을 여기에 놓으세요...</p>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">
                      이미지를 드래그하여 놓거나 클릭하여 선택하세요
                    </p>
                    <p className="text-sm text-gray-500">
                      JPG, PNG, GIF, BMP, WebP 파일 지원
                    </p>
                  </div>
                )}
              </div>

              {/* 옵션 설정 */}
              {originalImage && (
                <div className="mt-6">
                  <h4 className="text-md font-semibold mb-3">처리 옵션</h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={removeBackground}
                        onChange={handleToggleBackgroundRemoval}
                        className="rounded"
                        disabled={uploading}
                      />
                      <span className="text-sm">배경 제거 (누끼)</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Firebase Storage 정보 */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">Firebase Storage 연동</h4>
                <p className="text-xs text-blue-600">
                  이미지는 Firebase Storage에 안전하게 저장되며, 모든 사용자가 볼 수 있습니다.
                </p>
              </div>
            </div>

            {/* 미리보기 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">미리보기</h3>
              <div className="space-y-4">
                {(isProcessing || uploading) && (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-gray-600">
                      {uploading ? 'Firebase Storage에 업로드 중...' : '이미지 처리 중...'}
                    </span>
                  </div>
                )}

                {processedImage && !isProcessing && !uploading && (
                  <div className="space-y-4">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <h4 className="text-sm font-medium mb-2">처리된 이미지</h4>
                      <img
                        src={processedImage}
                        alt="처리된 이미지"
                        className="w-full h-48 object-cover rounded"
                      />
                    </div>

                    {extractedColors.length > 0 && (
                      <div className="bg-gray-100 rounded-lg p-4">
                        <h4 className="text-sm font-medium mb-2">추출된 색상</h4>
                        <div className="flex space-x-2">
                          {extractedColors.map((color, index) => (
                            <div
                              key={index}
                              className="w-8 h-8 rounded border border-gray-300"
                              style={{ backgroundColor: color.hex }}
                              title={`${color.hex} (R:${color.r}, G:${color.g}, B:${color.b})`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!processedImage && !isProcessing && !uploading && (
                  <div className="bg-gray-100 rounded-lg p-8 text-center">
                    <Image size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">이미지를 업로드하면 미리보기가 표시됩니다</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex justify-end space-x-3 mt-6">
            {actionButtons.map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
                disabled={button.disabled}
                className={`flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors ${
                  button.disabled ? 'opacity-50 cursor-not-allowed' : button.className
                }`}
              >
                <button.icon size={16} />
                <span>{button.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader; 