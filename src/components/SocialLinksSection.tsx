import React, { useState, useCallback, useMemo } from "react";
import { useForm } from "../hooks";
import { Plus, Trash2, ExternalLink, Edit3, Play } from "lucide-react";
import { SocialLink } from "../types/auth";

interface SocialLinksSectionProps {
  socialLinks: SocialLink[];
  isOwner: boolean;
  onUpdate?: (updates: { socialLinks: SocialLink[] }) => void;
}

const SocialLinksSection: React.FC<SocialLinksSectionProps> = ({
  socialLinks,
  isOwner,
  onUpdate,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleEdit, setTitleEdit] = useState("소셜 링크");
  const [expandedYouTube, setExpandedYouTube] = useState<string | null>(null);

  const {
    values: newLink,
    handleChange,
    reset,
  } = useForm({
    platform: "",
    url: "",
    icon: "",
  });

  // YouTube 링크 감지 및 비디오 ID 추출 함수
  const extractYouTubeVideoId = useCallback((url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  }, []);

  // YouTube 임베드 URL 생성 함수
  const getYouTubeEmbedUrl = useCallback((videoId: string): string => {
    return `https://www.youtube.com/embed/${videoId}`;
  }, []);

  // YouTube 썸네일 URL 생성 함수
  const getYouTubeThumbnailUrl = useCallback((videoId: string): string => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }, []);

  const platformOptions = useMemo(
    () => [
      { value: "youtube", label: "YouTube", icon: "🎥" },
      { value: "instagram", label: "Instagram", icon: "📷" },
      { value: "twitter", label: "Twitter", icon: "🐦" },
      { value: "facebook", label: "Facebook", icon: "📘" },
      { value: "linkedin", label: "LinkedIn", icon: "💼" },
      { value: "github", label: "GitHub", icon: "💻" },
      { value: "blog", label: "블로그", icon: "📝" },
      { value: "portfolio", label: "포트폴리오", icon: "🎨" },
      { value: "naver-cafe", label: "네이버 카페", icon: "☕" },
      { value: "naver-chzzk", label: "네이버 치지직", icon: "🎮" },
      { value: "soop", label: "Soop", icon: "🎵" },
      { value: "custom", label: "커스텀", icon: "🔗" },
    ],
    []
  );

  const handleAddLink = useCallback(() => {
    if (newLink.platform && newLink.url) {
      // YouTube 링크 자동 감지
      const detectedVideoId = extractYouTubeVideoId(newLink.url);
      const finalPlatform = detectedVideoId ? "youtube" : newLink.platform;

      const socialLink: SocialLink = {
        id: Date.now().toString(),
        platform: finalPlatform,
        url: newLink.url,
        icon: newLink.icon || getSocialIcon(finalPlatform),
      };

      const updatedLinks = [...socialLinks, socialLink];
      onUpdate?.({ socialLinks: updatedLinks });

      reset();
      setIsAdding(false);
    }
  }, [newLink, socialLinks, onUpdate, reset, extractYouTubeVideoId]);

  const handleRemoveLink = useCallback(
    (id: string) => {
      const updatedLinks = socialLinks.filter((link) => link.id !== id);
      onUpdate?.({ socialLinks: updatedLinks });
    },
    [socialLinks, onUpdate]
  );

  const handleEditLink = useCallback((link: SocialLink) => {
    setEditingLink(link);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (editingLink && editingLink.platform && editingLink.url) {
      const updatedLinks = socialLinks.map((link) =>
        link.id === editingLink.id ? editingLink : link
      );
      onUpdate?.({ socialLinks: updatedLinks });
      setEditingLink(null);
    }
  }, [editingLink, socialLinks, onUpdate]);

  const handleCancelEdit = useCallback(() => {
    setEditingLink(null);
  }, []);

  const handleTitleEdit = useCallback(() => {
    setIsEditingTitle(true);
  }, []);

  const handleTitleSave = useCallback(() => {
    if (titleEdit.trim()) {
      setIsEditingTitle(false);
    }
  }, [titleEdit]);

  const handleTitleCancel = useCallback(() => {
    setTitleEdit("소셜 링크");
    setIsEditingTitle(false);
  }, []);

  const handleCancelAdd = useCallback(() => {
    reset();
    setIsAdding(false);
  }, [reset]);

  // URL 입력 시 YouTube 링크 자동 감지
  const handleUrlChange = useCallback(
    (value: string) => {
      handleChange("url", value);

      // YouTube 링크 감지 시 플랫폼 자동 설정
      const detectedVideoId = extractYouTubeVideoId(value);
      if (detectedVideoId && newLink.platform !== "youtube") {
        handleChange("platform", "youtube");
      }
    },
    [handleChange, extractYouTubeVideoId, newLink.platform]
  );

  const socialLinkCards = useMemo(
    () =>
      (socialLinks || []).map((link) => (
        <SocialLinkCard
          key={link.id}
          link={link}
          isOwner={isOwner}
          onRemove={isOwner ? handleRemoveLink : undefined}
          onEdit={isOwner ? handleEditLink : undefined}
        />
      )),
    [socialLinks, handleRemoveLink, handleEditLink, isOwner]
  );

  const getSocialIcon = useCallback(
    (platform: string): string => {
      const platformOption = platformOptions.find(
        (option) => option.value === platform
      );
      return platformOption?.icon || "🔗";
    },
    [platformOptions]
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            {isEditingTitle ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={titleEdit}
                  onChange={(e) => setTitleEdit(e.target.value)}
                  className="text-4xl font-bold text-gray-900 bg-transparent border-b-2 border-blue-500 focus:outline-none text-center"
                  placeholder="섹션 제목"
                />
                <button
                  onClick={handleTitleSave}
                  className="p-1 text-green-500 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                  title="저장"
                >
                  ✓
                </button>
                <button
                  onClick={handleTitleCancel}
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  title="취소"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <h2 className="text-4xl font-bold text-gray-900">
                  {titleEdit}
                </h2>
                {isOwner && (
                  <button
                    onClick={handleTitleEdit}
                    className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    title="제목 편집"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
          <p className="text-gray-600 text-lg">
            외부 플랫폼과의 연결을 관리하세요
          </p>
        </div>

        <div className="flex-1">
          {socialLinks.length === 0 && isOwner && (
            <div className="flex justify-center">
              {isAdding ? (
                <AddSocialLinkForm
                  newLink={newLink}
                  handleChange={handleChange}
                  handleUrlChange={handleUrlChange}
                  platformOptions={platformOptions}
                  onAdd={handleAddLink}
                  onCancel={handleCancelAdd}
                />
              ) : (
                <AddSocialLinkButton onClick={() => setIsAdding(true)} />
              )}
            </div>
          )}

          {socialLinks.length === 1 && (
            <div className="flex justify-center">
              <div className="w-64">{socialLinkCards[0]}</div>
            </div>
          )}

          {socialLinks.length > 1 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {socialLinkCards}
            </div>
          )}

          {socialLinks.length > 0 && isOwner && (
            <div className="flex justify-center mt-6">
              {isAdding ? (
                <AddSocialLinkForm
                  newLink={newLink}
                  handleChange={handleChange}
                  handleUrlChange={handleUrlChange}
                  platformOptions={platformOptions}
                  onAdd={handleAddLink}
                  onCancel={handleCancelAdd}
                />
              ) : (
                <AddSocialLinkButton onClick={() => setIsAdding(true)} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* 편집 모달 */}
      {editingLink && (
        <EditSocialLinkModal
          link={editingLink}
          setLink={setEditingLink}
          platformOptions={platformOptions}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
};

interface SocialLinkCardProps {
  link: SocialLink;
  onRemove?: (id: string) => void;
  onEdit?: (link: SocialLink) => void;
  isOwner: boolean;
}

const SocialLinkCard: React.FC<SocialLinkCardProps> = ({
  link,
  onRemove,
  onEdit,
  isOwner,
}) => {
  const [showEmbed, setShowEmbed] = useState(false);

  // YouTube 링크 감지 및 비디오 ID 추출 함수
  const extractYouTubeVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  };

  // YouTube 임베드 URL 생성 함수
  const getYouTubeEmbedUrl = (videoId: string): string => {
    return `https://www.youtube.com/embed/${videoId}`;
  };

  // YouTube 썸네일 URL 생성 함수
  const getYouTubeThumbnailUrl = (videoId: string): string => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  const videoId = extractYouTubeVideoId(link.url);
  const isYouTubeLink = videoId !== null;

  const handleCardClick = (e: React.MouseEvent) => {
    if (isYouTubeLink) {
      e.preventDefault();
      setShowEmbed(!showEmbed);
    }
  };

  return (
    <div className="relative group">
      {isYouTubeLink && showEmbed ? (
        <div className="block p-4 bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={getYouTubeEmbedUrl(videoId!)}
              title="YouTube video player"
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="mt-3 text-center">
            <h3 className="font-semibold text-gray-900 mb-1 capitalize">
              {link.platform.replace("-", " ")}
            </h3>
            <p className="text-sm text-gray-500 truncate">{link.url}</p>
          </div>
          <button
            onClick={() => setShowEmbed(false)}
            className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>
      ) : (
        <div
          onClick={handleCardClick}
          className={`block p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 ${
            isYouTubeLink ? "cursor-pointer" : ""
          }`}
        >
          {!isYouTubeLink && (
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 z-10"
              onClick={(e) => e.stopPropagation()}
            />
          )}
          <div className="text-center">
            {isYouTubeLink && videoId ? (
              <div className="relative mb-3">
                <img
                  src={getYouTubeThumbnailUrl(videoId)}
                  alt="YouTube thumbnail"
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-red-600 text-white rounded-full p-2">
                    <Play className="w-6 h-6" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-4xl mb-3">{link.icon}</div>
            )}
            <h3 className="font-semibold text-gray-900 mb-1 capitalize">
              {link.platform.replace("-", " ")}
            </h3>
            <p className="text-sm text-gray-500 truncate">{link.url}</p>
          </div>

          {isYouTubeLink && (
            <div className="absolute top-2 right-2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <Play className="w-4 h-4" />
            </div>
          )}
          {!isYouTubeLink && (
            <ExternalLink className="absolute top-2 right-2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      )}

      {onRemove && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove(link.id);
          }}
          className="absolute top-2 left-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
      {onEdit && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEdit(link);
          }}
          className="absolute top-2 right-2 p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

interface AddSocialLinkButtonProps {
  onClick: () => void;
}

const AddSocialLinkButton: React.FC<AddSocialLinkButtonProps> = ({
  onClick,
}) => (
  <button
    onClick={onClick}
    className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
  >
    <Plus className="w-4 h-4 mr-2" />
    <span>링크 추가</span>
  </button>
);

interface AddSocialLinkFormProps {
  newLink: { platform: string; url: string; icon: string };
  handleChange: (field: "platform" | "url" | "icon", value: string) => void;
  handleUrlChange: (value: string) => void;
  platformOptions: Array<{ value: string; label: string; icon: string }>;
  onAdd: () => void;
  onCancel: () => void;
}

const AddSocialLinkForm: React.FC<AddSocialLinkFormProps> = ({
  newLink,
  handleChange,
  handleUrlChange,
  platformOptions,
  onAdd,
  onCancel,
}) => (
  <div className="h-64 w-[600px] p-8 bg-white rounded-xl shadow-lg border border-gray-200 mx-auto">
    <h3 className="text-xl font-semibold mb-6 text-gray-900">새로운 링크</h3>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          플랫폼
        </label>
        <select
          value={newLink.platform}
          onChange={(e) => handleChange("platform", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
        >
          <option value="">플랫폼 선택</option>
          {platformOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.icon} {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL
        </label>
        <input
          type="url"
          value={newLink.url}
          onChange={(e) => handleUrlChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          아이콘 (선택사항)
        </label>
        <input
          type="text"
          value={newLink.icon}
          onChange={(e) => handleChange("icon", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          placeholder="🎥"
        />
      </div>
    </div>

    <div className="flex space-x-3 mt-6">
      <button
        onClick={onAdd}
        className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        추가
      </button>
      <button
        onClick={onCancel}
        className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
      >
        취소
      </button>
    </div>
  </div>
);

interface EditSocialLinkModalProps {
  link: SocialLink;
  setLink: React.Dispatch<React.SetStateAction<SocialLink | null>>;
  platformOptions: Array<{ value: string; label: string; icon: string }>;
  onSave: () => void;
  onCancel: () => void;
}

const EditSocialLinkModal: React.FC<EditSocialLinkModalProps> = ({
  link,
  setLink,
  platformOptions,
  onSave,
  onCancel,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">링크 편집</h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            플랫폼
          </label>
          <select
            value={link.platform}
            onChange={(e) =>
              setLink((prev) =>
                prev ? { ...prev, platform: e.target.value } : null
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          >
            <option value="">플랫폼 선택</option>
            {platformOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL
          </label>
          <input
            type="url"
            value={link.url}
            onChange={(e) =>
              setLink((prev) =>
                prev ? { ...prev, url: e.target.value } : null
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            placeholder="https://example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            아이콘 (선택사항)
          </label>
          <input
            type="text"
            value={link.icon}
            onChange={(e) =>
              setLink((prev) =>
                prev ? { ...prev, icon: e.target.value } : null
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            placeholder="🎥"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={onSave}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          저장
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
        >
          취소
        </button>
      </div>
    </div>
  </div>
);

export default SocialLinksSection;
