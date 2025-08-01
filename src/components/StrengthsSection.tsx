import React, { useState, useCallback, useMemo } from 'react';
import { useProfile } from '../contexts/ProfileContext';
import { useTheme } from '../contexts/ThemeContext';
import { useFlipCard } from '../hooks';
import { Plus, Edit3, Trash2 } from 'lucide-react';

const StrengthsSection: React.FC = () => {
  const { profile, addStrength, removeStrength } = useProfile();
  const { primaryColor, secondaryColor } = useTheme();
  const [isAdding, setIsAdding] = useState(false);
  const [newStrength, setNewStrength] = useState({ title: '', shortDescription: '', detailedDescription: '' });

  const handleAddStrength = useCallback(() => {
    if (newStrength.title && newStrength.shortDescription && newStrength.detailedDescription) {
      addStrength({
        title: newStrength.title,
        shortDescription: newStrength.shortDescription,
        detailedDescription: newStrength.detailedDescription
      });
      setNewStrength({ title: '', shortDescription: '', detailedDescription: '' });
      setIsAdding(false);
    }
  }, [newStrength, addStrength]);

  const handleRemoveStrength = useCallback((id: string) => {
    removeStrength(id);
  }, [removeStrength]);

  const handleCancelAdd = useCallback(() => {
    setNewStrength({ title: '', shortDescription: '', detailedDescription: '' });
    setIsAdding(false);
  }, []);

  const strengthCards = useMemo(() => 
    profile.strengths.map(strength => (
      <StrengthCard
        key={strength.id}
        strength={strength}
        onRemove={handleRemoveStrength}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
      />
    )), [profile.strengths, handleRemoveStrength, primaryColor, secondaryColor]);

  return (
    <section className="mb-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4" style={{ color: primaryColor.hex }}>
            나의 강점
          </h2>
          <p className="text-gray-600">마우스를 카드 위에 올리면 자세한 설명을 확인할 수 있습니다</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strengthCards}
          
          {isAdding ? (
            <AddStrengthForm
              newStrength={newStrength}
              setNewStrength={setNewStrength}
              onAdd={handleAddStrength}
              onCancel={handleCancelAdd}
              primaryColor={primaryColor}
            />
          ) : (
            <AddStrengthButton
              onClick={() => setIsAdding(true)}
              primaryColor={primaryColor}
            />
          )}
        </div>
      </div>
    </section>
  );
};

interface StrengthCardProps {
  strength: {
    id: string;
    title: string;
    shortDescription: string;
    detailedDescription: string;
  };
  onRemove: (id: string) => void;
  primaryColor: { hex: string };
  secondaryColor: { hex: string };
}

const StrengthCard: React.FC<StrengthCardProps> = ({ strength, onRemove, primaryColor, secondaryColor }) => {
  const { isFlipped, setFlipped } = useFlipCard();

  const handleMouseEnter = useCallback(() => {
    setFlipped(true);
  }, [setFlipped]);

  const handleMouseLeave = useCallback(() => {
    setFlipped(false);
  }, [setFlipped]);

  const handleRemove = useCallback(() => {
    onRemove(strength.id);
  }, [onRemove, strength.id]);

  return (
    <div className="relative group">
      <div
        className={`relative w-full h-80 cursor-pointer transition-transform duration-500 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* 앞면 */}
        <div className="absolute inset-0 bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center text-center backface-hidden">
          <h3 className="text-xl font-bold mb-4" style={{ color: primaryColor.hex }}>
            {strength.title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {strength.shortDescription}
          </p>
          <div className="mt-4 text-sm text-gray-500">
            마우스를 올려보세요
          </div>
        </div>
        
        {/* 뒷면 */}
        <div className="absolute inset-0 bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center text-center backface-hidden rotate-y-180">
          <h3 className="text-xl font-bold mb-4" style={{ color: secondaryColor.hex }}>
            {strength.title}
          </h3>
          <p className="text-gray-600 leading-relaxed text-sm">
            {strength.detailedDescription}
          </p>
        </div>
      </div>
      
      {/* 삭제 버튼 */}
      <button
        onClick={handleRemove}
        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

interface AddStrengthButtonProps {
  onClick: () => void;
  primaryColor: { hex: string };
}

const AddStrengthButton: React.FC<AddStrengthButtonProps> = ({ onClick, primaryColor }) => (
  <button
    onClick={onClick}
    className="w-full h-80 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
    style={{ borderColor: primaryColor.hex }}
  >
    <Plus size={48} className="mb-4" />
    <span className="text-lg font-medium">강점 추가</span>
  </button>
);

interface AddStrengthFormProps {
  newStrength: { title: string; shortDescription: string; detailedDescription: string };
  setNewStrength: React.Dispatch<React.SetStateAction<{ title: string; shortDescription: string; detailedDescription: string }>>;
  onAdd: () => void;
  onCancel: () => void;
  primaryColor: { hex: string };
}

const AddStrengthForm: React.FC<AddStrengthFormProps> = ({ newStrength, setNewStrength, onAdd, onCancel, primaryColor }) => {
  const handleInputChange = useCallback((field: keyof typeof newStrength, value: string) => {
    setNewStrength(prev => ({ ...prev, [field]: value }));
  }, [setNewStrength]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onAdd();
  }, [onAdd]);

  return (
    <div className="w-full h-80 bg-white rounded-2xl shadow-xl p-6">
      <form onSubmit={handleSubmit} className="h-full flex flex-col">
        <h3 className="text-lg font-bold mb-4" style={{ color: primaryColor.hex }}>
          새로운 강점 추가
        </h3>
        
        <div className="flex-1 space-y-3">
          <input
            type="text"
            placeholder="강점 제목"
            value={newStrength.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          
          <textarea
            placeholder="간단한 설명 (앞면에 표시)"
            value={newStrength.shortDescription}
            onChange={(e) => handleInputChange('shortDescription', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={2}
            required
          />
          
          <textarea
            placeholder="자세한 설명 (뒷면에 표시)"
            value={newStrength.detailedDescription}
            onChange={(e) => handleInputChange('detailedDescription', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            required
          />
        </div>
        
        <div className="flex space-x-2 mt-4">
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

export default StrengthsSection; 