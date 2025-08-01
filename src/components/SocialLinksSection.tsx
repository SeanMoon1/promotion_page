import React, { useState, useCallback, useMemo } from 'react';
import { useProfile } from '../contexts/ProfileContext';
import { useTheme } from '../contexts/ThemeContext';
import { useForm } from '../hooks';
import { Plus, Trash2, ExternalLink } from 'lucide-react';

const SocialLinksSection: React.FC = () => {
  const { profile, addSocialLink, removeSocialLink } = useProfile();
  const { primaryColor } = useTheme();
  const [isAdding, setIsAdding] = useState(false);
  
  const { values: newLink, handleChange, reset } = useForm({
    platform: '',
    url: '',
    icon: ''
  });

  const platformOptions = useMemo(() => [
    { value: 'youtube', label: 'YouTube', icon: '🎥' },
    { value: 'instagram', label: 'Instagram', icon: '📷' },
    { value: 'twitter', label: 'Twitter', icon: '🐦' },
    { value: 'facebook', label: 'Facebook', icon: '📘' },
    { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
    { value: 'github', label: 'GitHub', icon: '💻' },
    { value: 'blog', label: '블로그', icon: '📝' },
    { value: 'portfolio', label: '포트폴리오', icon: '🎨' },
    { value: 'naver-cafe', label: '네이버 카페', icon: '☕' },
    { value: 'naver-chzzk', label: '네이버 치지직', icon: '🎮' },
    { value: 'soop', label: 'Soop', icon: '🎵' },
    { value: 'custom', label: '커스텀', icon: '🔗' }
  ], []);

  const handleAddLink = useCallback(() => {
    if (newLink.platform && newLink.url) {
      addSocialLink({
        platform: newLink.platform,
        url: newLink.url,
        icon: newLink.icon || getSocialIcon(newLink.platform)
      });
      reset();
      setIsAdding(false);
    }
  }, [newLink, addSocialLink, reset]);

  const handleRemoveLink = useCallback((id: string) => {
    removeSocialLink(id);
  }, [removeSocialLink]);

  const handleCancelAdd = useCallback(() => {
    reset();
    setIsAdding(false);
  }, [reset]);

  const socialLinks = useMemo(() => 
    profile.socialLinks.map(link => (
      <SocialLinkCard
        key={link.id}
        link={link}
        onRemove={handleRemoveLink}
        primaryColor={primaryColor}
      />
    )), [profile.socialLinks, handleRemoveLink, primaryColor]);

  const getSocialIcon = useCallback((platform: string): string => {
    const platformOption = platformOptions.find(option => option.value === platform);
    return platformOption?.icon || '🔗';
  }, [platformOptions]);

  return (
    <section className="mb-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4" style={{ color: primaryColor.hex }}>
            소셜 링크
          </h2>
          <p className="text-gray-600">외부 플랫폼과의 연결을 관리하세요</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {socialLinks}
          
          {isAdding ? (
            <AddSocialLinkForm
              newLink={newLink}
              handleChange={handleChange}
              platformOptions={platformOptions}
              onAdd={handleAddLink}
              onCancel={handleCancelAdd}
              primaryColor={primaryColor}
            />
          ) : (
            <AddSocialLinkButton
              onClick={() => setIsAdding(true)}
              primaryColor={primaryColor}
            />
          )}
        </div>
      </div>
    </section>
  );
};

interface SocialLinkCardProps {
  link: {
    id: string;
    platform: string;
    url: string;
    icon: string;
  };
  onRemove: (id: string) => void;
  primaryColor: { hex: string };
}

const SocialLinkCard: React.FC<SocialLinkCardProps> = ({ link, onRemove, primaryColor }) => {
  const handleRemove = useCallback(() => {
    onRemove(link.id);
  }, [onRemove, link.id]);

  const handleClick = useCallback(() => {
    window.open(link.url, '_blank');
  }, [link.url]);

  return (
    <div className="relative group">
      <button
        onClick={handleClick}
        className="w-full p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col items-center justify-center space-y-3 hover:scale-105"
        style={{ borderColor: primaryColor.hex }}
      >
        <div className="text-3xl">{link.icon}</div>
        <span className="text-sm font-medium text-gray-700 capitalize">
          {link.platform.replace('-', ' ')}
        </span>
        <ExternalLink size={16} className="text-gray-400" />
      </button>
      
      <button
        onClick={handleRemove}
        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
};

interface AddSocialLinkButtonProps {
  onClick: () => void;
  primaryColor: { hex: string };
}

const AddSocialLinkButton: React.FC<AddSocialLinkButtonProps> = ({ onClick, primaryColor }) => (
  <button
    onClick={onClick}
    className="w-full p-6 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center space-y-3 text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
    style={{ borderColor: primaryColor.hex }}
  >
    <Plus size={32} />
    <span className="text-sm font-medium">링크 추가</span>
  </button>
);

interface AddSocialLinkFormProps {
  newLink: { platform: string; url: string; icon: string };
  handleChange: (field: 'platform' | 'url' | 'icon', value: string) => void;
  platformOptions: Array<{ value: string; label: string; icon: string }>;
  onAdd: () => void;
  onCancel: () => void;
  primaryColor: { hex: string };
}

const AddSocialLinkForm: React.FC<AddSocialLinkFormProps> = ({ 
  newLink, 
  handleChange, 
  platformOptions, 
  onAdd, 
  onCancel, 
  primaryColor 
}) => {
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onAdd();
  }, [onAdd]);

  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-bold mb-4" style={{ color: primaryColor.hex }}>
          소셜 링크 추가
        </h3>
        
        <div>
          <label className="block text-sm font-medium mb-2">플랫폼</label>
          <select
            value={newLink.platform}
            onChange={(e) => handleChange('platform', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">플랫폼 선택</option>
            {platformOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">URL</label>
          <input
            type="url"
            placeholder="https://example.com"
            value={newLink.url}
            onChange={(e) => handleChange('url', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">아이콘 (선택사항)</label>
          <input
            type="text"
            placeholder="🔗"
            value={newLink.icon}
            onChange={(e) => handleChange('icon', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            추가
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default SocialLinksSection; 