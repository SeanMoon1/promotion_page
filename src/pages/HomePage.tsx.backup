import React, { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useProfile } from '../contexts/ProfileContext';
import { useModal } from '../hooks';
import Header from '../components/Header';
import ProfileSection from '../components/ProfileSection';
import StrengthsSection from '../components/StrengthsSection';
import SocialLinksSection from '../components/SocialLinksSection';
import ColorPicker from '../components/ColorPicker';
import ImageUploader from '../components/ImageUploader';
import TextEditor from '../components/TextEditor';

const HomePage: React.FC = () => {
  const { primaryColor, secondaryColor, accentColor } = useTheme();
  const { profile } = useProfile();
  
  // Custom hooks for modal management
  const colorPickerModal = useModal();
  const imageUploaderModal = useModal();
  const textEditorModal = useModal();

  // Memoized theme styles to prevent unnecessary re-renders
  const themeStyles = useMemo(() => ({
    '--primary-color': primaryColor.hex,
    '--secondary-color': secondaryColor.hex,
    '--accent-color': accentColor.hex,
  } as React.CSSProperties), [primaryColor.hex, secondaryColor.hex, accentColor.hex]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50" style={themeStyles}>
      <Header 
        pageTitle={profile.pageTitle}
        onColorPickerToggle={colorPickerModal.toggle}
        onImageUploaderToggle={imageUploaderModal.toggle}
        onTextEditorToggle={textEditorModal.toggle}
      />
      
      <main className="container mx-auto px-4 py-8">
        <ProfileSection />
        <StrengthsSection />
        <SocialLinksSection />
      </main>

      {colorPickerModal.isOpen && (
        <ColorPicker onClose={colorPickerModal.close} />
      )}
      
      {imageUploaderModal.isOpen && (
        <ImageUploader onClose={imageUploaderModal.close} />
      )}
      
      {textEditorModal.isOpen && (
        <TextEditor onClose={textEditorModal.close} />
      )}
    </div>
  );
};

export default HomePage; 