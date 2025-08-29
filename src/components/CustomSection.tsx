import React, { useState, useCallback } from 'react';
import { Edit3, Trash2, Type, Image, Video, Loader2, Plus, X } from 'lucide-react';
import { CustomSection } from '../types/auth';
import { storage } from '../utils/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// 로딩 스피너 컴포넌트
const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; text?: string }> = ({ 
  size = 'md', 
  text = '업로드 중...' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full`}></div>
        <div className={`${sizeClasses[size]} border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0`}></div>
      </div>
      {text && (
        <p className="text-sm text-gray-600 font-medium">{text}</p>
      )}
    </div>
  );
};

interface IndividualCustomSectionProps {
  section: CustomSection;
  isOwner: boolean;
  onUpdate: (section: CustomSection) => void;
  onRemove: (sectionId: string) => void;
}

const IndividualCustomSection: React.FC<IndividualCustomSectionProps> = ({
  section,
  isOwner,
  onUpdate,
  onRemove
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(section.title);
  const [content, setContent] = useState(section.content);
  const [images, setImages] = useState<string[]>(section.images || []);
  const [videos, setVideos] = useState<string[]>(section.videos || []);
  const [isUploading, setIsUploading] = useState(false);

  const handleSave = useCallback(() => {
    if (title.trim() && content.trim()) {
      const updatedSection = {
        ...section,
        title: title.trim(),
        content: content.trim(),
        images: section.type === 'image' ? images : undefined,
        videos: section.type === 'video' ? videos : undefined,
      };

      onUpdate(updatedSection);
      setIsEditing(false);
    }
  }, [title, content, images, videos, section, onUpdate]);

  const handleCancel = useCallback(() => {
    setTitle(section.title);
    setContent(section.content);
    setImages(section.images || []);
    setVideos(section.videos || []);
    setIsEditing(false);
  }, [section]);

  const handleImageUpload = useCallback(async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `custom-sections/${section.sectionId}/images/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      const newImages = [...images, downloadURL];
      setImages(newImages);
      
      // 업로드 완료 후 즉시 섹션 업데이트
      const updatedSection = {
        ...section,
        images: newImages,
      };
      onUpdate(updatedSection);
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  }, [images, section, onUpdate]);

  const handleVideoUpload = useCallback(async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `custom-sections/${section.sectionId}/videos/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      const newVideos = [...videos, downloadURL];
      setVideos(newVideos);
      
      // 업로드 완료 후 즉시 섹션 업데이트
      const updatedSection = {
        ...section,
        videos: newVideos,
      };
      onUpdate(updatedSection);
    } catch (error) {
      console.error('동영상 업로드 실패:', error);
      alert('동영상 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  }, [videos, section, onUpdate]);

  const handleImageDelete = useCallback(async (imageUrl: string, index: number) => {
    try {
      // Firebase Storage에서 파일 삭제
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
      
      // 로컬 상태에서 제거
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
      
      // 섹션 업데이트
      const updatedSection = {
        ...section,
        images: newImages,
      };
      onUpdate(updatedSection);
    } catch (error) {
      console.error('이미지 삭제 실패:', error);
      alert('이미지 삭제에 실패했습니다.');
    }
  }, [images, section, onUpdate]);

  const handleVideoDelete = useCallback(async (videoUrl: string, index: number) => {
    try {
      // Firebase Storage에서 파일 삭제
      const videoRef = ref(storage, videoUrl);
      await deleteObject(videoRef);
      
      // 로컬 상태에서 제거
      const newVideos = videos.filter((_, i) => i !== index);
      setVideos(newVideos);
      
      // 섹션 업데이트
      const updatedSection = {
        ...section,
        videos: newVideos,
      };
      onUpdate(updatedSection);
    } catch (error) {
      console.error('동영상 삭제 실패:', error);
      alert('동영상 삭제에 실패했습니다.');
    }
  }, [videos, section, onUpdate]);

  const handleImageClick = useCallback(() => {
    if (!isOwner) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleImageUpload(file);
    };
    input.click();
  }, [isOwner, handleImageUpload]);

  const handleVideoClick = useCallback(() => {
    if (!isOwner) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleVideoUpload(file);
    };
    input.click();
  }, [isOwner, handleVideoUpload]);

  if (isEditing) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">섹션 제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="섹션 제목"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">섹션 내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="섹션 내용을 입력하세요"
              rows={6}
            />
          </div>

          {/* 이미지 섹션인 경우 이미지 업로드 */}
          {section.type === 'image' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">이미지</label>
              <div className="space-y-4">
                {/* 기존 이미지들 표시 */}
                {images.length > 0 && (
                  <div>
                    {images.length === 1 ? (
                      // 이미지가 하나일 때 중앙 배치
                      <div className="flex justify-center">
                        <div className="relative group">
                          <img 
                            src={images[0]} 
                            alt="이미지 1" 
                            className="max-w-full h-auto rounded-lg"
                            style={{ maxHeight: '300px' }}
                          />
                          <button
                            onClick={() => handleImageDelete(images[0], 0)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            title="삭제"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      // 이미지가 여러 개일 때 그리드 배치
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((imageUrl, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={imageUrl} 
                              alt={`이미지 ${index + 1}`} 
                              className="w-full h-auto rounded-lg object-contain"
                              style={{ minHeight: '100px', maxHeight: '200px' }}
                            />
                            <button
                              onClick={() => handleImageDelete(imageUrl, index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              title="삭제"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {/* 이미지 추가 버튼 */}
                <button
                  type="button"
                  onClick={handleImageClick}
                  disabled={isUploading}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  {isUploading ? '업로드 중...' : '이미지 추가'}
                </button>
              </div>
            </div>
          )}

          {/* 동영상 섹션인 경우 동영상 업로드 */}
          {section.type === 'video' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">동영상</label>
              <div className="space-y-4">
                {/* 기존 동영상들 표시 */}
                {videos.length > 0 && (
                  <div>
                    {videos.length === 1 ? (
                      // 동영상이 하나일 때 중앙 배치
                      <div className="flex justify-center">
                        <div className="relative group">
                          <video 
                            src={videos[0]} 
                            className="max-w-full h-auto rounded-lg"
                            style={{ maxHeight: '300px' }}
                          />
                          <button
                            onClick={() => handleVideoDelete(videos[0], 0)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            title="삭제"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      // 동영상이 여러 개일 때 그리드 배치
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {videos.map((videoUrl, index) => (
                          <div key={index} className="relative group">
                            <video 
                              src={videoUrl} 
                              className="w-full h-auto rounded-lg object-contain"
                              style={{ minHeight: '100px', maxHeight: '200px' }}
                            />
                            <button
                              onClick={() => handleVideoDelete(videoUrl, index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              title="삭제"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {/* 동영상 추가 버튼 */}
                <button
                  type="button"
                  onClick={handleVideoClick}
                  disabled={isUploading}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  {isUploading ? '업로드 중...' : '동영상 추가'}
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex space-x-3 mt-6">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            저장
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
          >
            취소
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-4xl font-bold text-gray-900 text-center flex-1">{section.title}</h3>
          {isOwner && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                title="편집"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onRemove(section.sectionId)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                title="삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        
        {/* 섹션 타입 표시 */}
        <div className="flex justify-center mt-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            section.type === 'text' ? 'bg-blue-100 text-blue-800' :
            section.type === 'image' ? 'bg-green-100 text-green-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {section.type === 'text' && <Type className="w-3 h-3 mr-1" />}
            {section.type === 'image' && <Image className="w-3 h-3 mr-1" />}
            {section.type === 'video' && <Video className="w-3 h-3 mr-1" />}
            {section.type === 'text' ? '텍스트' : section.type === 'image' ? '이미지' : '동영상'}
          </span>
        </div>
      </div>

      {/* 이미지 섹션인 경우 이미지들 표시 */}
      {section.type === 'image' && images && images.length > 0 && (
        <div className="mb-6">
          {images.length === 1 ? (
            // 이미지가 하나일 때 중앙 배치
            <div className="flex justify-center">
              <div className="relative group">
                <img 
                  src={images[0]} 
                  alt={`${section.title} 이미지`}
                  className="max-w-full h-auto rounded-lg shadow-lg"
                  style={{ maxHeight: '400px' }}
                />
                {isOwner && (
                  <button
                    onClick={() => handleImageDelete(images[0], 0)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="삭제"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            // 이미지가 여러 개일 때 그리드 배치
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={imageUrl} 
                    alt={`${section.title} 이미지 ${index + 1}`}
                    className="w-full h-auto rounded-lg shadow-lg object-contain"
                    style={{ minHeight: '200px', maxHeight: '400px' }}
                  />
                  {isOwner && (
                    <button
                      onClick={() => handleImageDelete(imageUrl, index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="삭제"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 동영상 섹션인 경우 동영상들 표시 */}
      {section.type === 'video' && videos && videos.length > 0 && (
        <div className="mb-6">
          {videos.length === 1 ? (
            // 동영상이 하나일 때 중앙 배치
            <div className="flex justify-center">
              <div className="relative group">
                <video 
                  src={videos[0]} 
                  controls
                  className="max-w-full h-auto rounded-lg shadow-lg"
                  style={{ maxHeight: '400px' }}
                >
                  브라우저가 동영상을 지원하지 않습니다.
                </video>
                {isOwner && (
                  <button
                    onClick={() => handleVideoDelete(videos[0], 0)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="삭제"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            // 동영상이 여러 개일 때 그리드 배치
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((videoUrl, index) => (
                <div key={index} className="relative group">
                  <video 
                    src={videoUrl} 
                    controls
                    className="w-full h-auto rounded-lg shadow-lg object-contain"
                    style={{ minHeight: '200px', maxHeight: '400px' }}
                  >
                    브라우저가 동영상을 지원하지 않습니다.
                  </video>
                  {isOwner && (
                    <button
                      onClick={() => handleVideoDelete(videoUrl, index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="삭제"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 내용 표시 */}
      <div className="prose prose-lg max-w-none text-center">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{section.content}</p>
      </div>

      {/* 이미지/동영상 추가 버튼 (소유자만) */}
      {isOwner && (
        <div className="mt-6 flex justify-center space-x-4">
          {section.type === 'image' && (
            <button
              onClick={handleImageClick}
              disabled={isUploading}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              {isUploading ? '업로드 중...' : '이미지 추가'}
            </button>
          )}
          {section.type === 'video' && (
            <button
              onClick={handleVideoClick}
              disabled={isUploading}
              className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              {isUploading ? '업로드 중...' : '동영상 추가'}
            </button>
          )}
        </div>
      )}

      {/* 업로드 중 로딩 오버레이 */}
      {isUploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl">
            <LoadingSpinner size="lg" text="미디어 업로드 중..." />
          </div>
        </div>
      )}
    </div>
  );
};

// 커스텀 섹션 추가 컴포넌트
interface CustomSectionAdderProps {
  isOwner: boolean;
  onAdd: (section: CustomSection) => void;
}

const CustomSectionAdder: React.FC<CustomSectionAdderProps> = ({ isOwner, onAdd }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sectionType, setSectionType] = useState<'text' | 'image' | 'video'>('text');

  const handleAdd = useCallback(() => {
    if (title.trim() && content.trim()) {
      const newSection: CustomSection = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        order: Date.now(),
        sectionId: `custom_${Date.now()}`,
        type: sectionType,
      };

      onAdd(newSection);
      setTitle('');
      setContent('');
      setSectionType('text');
      setIsAdding(false);
    }
  }, [title, content, sectionType, onAdd]);

  const handleCancel = useCallback(() => {
    setTitle('');
    setContent('');
    setSectionType('text');
    setIsAdding(false);
  }, []);

  if (!isOwner) return null;

  if (isAdding) {
    return (
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-6 text-gray-900">새로운 커스텀 섹션</h3>
        
        <div className="space-y-4">
          {/* 섹션 타입 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">섹션 타입</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSectionType('text')}
                className={`p-3 border rounded-lg flex flex-col items-center transition-colors ${
                  sectionType === 'text' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Type className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">텍스트</span>
              </button>
              <button
                type="button"
                onClick={() => setSectionType('image')}
                className={`p-3 border rounded-lg flex flex-col items-center transition-colors ${
                  sectionType === 'image' 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Image className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">이미지</span>
              </button>
              <button
                type="button"
                onClick={() => setSectionType('video')}
                className={`p-3 border rounded-lg flex flex-col items-center transition-colors ${
                  sectionType === 'video' 
                    ? 'border-purple-500 bg-purple-50 text-purple-700' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Video className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">동영상</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">섹션 제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="섹션 제목"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">섹션 내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="섹션 내용을 입력하세요"
              rows={6}
            />
          </div>
        </div>
        
        <div className="flex space-x-3 mt-6">
          <button
            onClick={handleAdd}
            className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            추가
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
          >
            취소
          </button>
        </div>
      </div>
    );
  }

  return (
    <AddSectionButton onClick={() => setIsAdding(true)} />
  );
};

const AddSectionButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors duration-200 bg-gray-50 hover:bg-gray-100"
  >
    <Plus className="w-8 h-8 mb-2" />
    <span className="text-sm font-medium">커스텀 섹션 추가</span>
  </button>
);

export { IndividualCustomSection, CustomSectionAdder }; 