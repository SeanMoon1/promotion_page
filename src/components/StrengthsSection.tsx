import React, { useState, useCallback, useMemo } from 'react';
import { useFlipCard } from '../hooks';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { Strength } from '../types/auth';

interface StrengthsSectionProps {
  strengths: Strength[];
  isOwner: boolean;
  onUpdate?: (updates: { strengths: Strength[] }) => void;
}

const StrengthsSection: React.FC<StrengthsSectionProps> = ({
  strengths,
  isOwner,
  onUpdate
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newStrength, setNewStrength] = useState({ title: '', description: '' });

  const handleAddStrength = useCallback(() => {
    if (newStrength.title && newStrength.description) {
      const strength: Strength = {
        id: Date.now().toString(),
        title: newStrength.title,
        description: newStrength.description
      };
      
      const updatedStrengths = [...strengths, strength];
      onUpdate?.({ strengths: updatedStrengths });
      
      setNewStrength({ title: '', description: '' });
      setIsAdding(false);
    }
  }, [newStrength, strengths, onUpdate]);

  const handleRemoveStrength = useCallback((id: string) => {
    const updatedStrengths = strengths.filter(strength => strength.id !== id);
    onUpdate?.({ strengths: updatedStrengths });
  }, [strengths, onUpdate]);

  const handleCancelAdd = useCallback(() => {
    setNewStrength({ title: '', description: '' });
    setIsAdding(false);
  }, []);

  const strengthCards = useMemo(() => 
    strengths.map(strength => (
      <StrengthCard
        key={strength.id}
        strength={strength}
        onRemove={isOwner ? handleRemoveStrength : undefined}
      />
    )), [strengths, handleRemoveStrength, isOwner]);

  return (
    <section className="mb-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            나의 강점
          </h2>
          <p className="text-gray-600">마우스를 카드 위에 올리면 자세한 설명을 확인할 수 있습니다</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strengthCards}
          
          {isOwner && (
            isAdding ? (
              <AddStrengthForm
                newStrength={newStrength}
                setNewStrength={setNewStrength}
                onAdd={handleAddStrength}
                onCancel={handleCancelAdd}
              />
            ) : (
              <AddStrengthButton onClick={() => setIsAdding(true)} />
            )
          )}
        </div>
      </div>
    </section>
  );
};

interface StrengthCardProps {
  strength: Strength;
  onRemove?: (id: string) => void;
}

const StrengthCard: React.FC<StrengthCardProps> = ({ strength, onRemove }) => {
  const { isFlipped, setFlipped } = useFlipCard();

  const handleMouseEnter = useCallback(() => {
    setFlipped(true);
  }, [setFlipped]);

  const handleMouseLeave = useCallback(() => {
    setFlipped(false);
  }, [setFlipped]);

  return (
    <div
      className="relative h-64 cursor-pointer transform-style-preserve-3d transition-transform duration-500"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
    >
      {/* 앞면 */}
      <div className="absolute inset-0 backface-hidden">
        <div className="h-full bg-white rounded-xl shadow-lg p-6 flex flex-col justify-center items-center text-center border border-gray-200 hover:shadow-xl transition-shadow duration-300">
          <div className="text-4xl mb-4">💪</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{strength.title}</h3>
          <p className="text-gray-600 text-sm">{strength.description}</p>
          
          {onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(strength.id);
              }}
              className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 뒷면 */}
      <div className="absolute inset-0 backface-hidden rotate-y-180">
        <div className="h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 flex flex-col justify-center items-center text-center text-white">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-xl font-bold mb-2">{strength.title}</h3>
          <p className="text-sm opacity-90">{strength.description}</p>
        </div>
      </div>
    </div>
  );
};

interface AddStrengthButtonProps {
  onClick: () => void;
}

const AddStrengthButton: React.FC<AddStrengthButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="h-64 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors duration-200 bg-gray-50 hover:bg-gray-100"
  >
    <Plus className="w-8 h-8 mb-2" />
    <span className="text-sm font-medium">강점 추가</span>
  </button>
);

interface AddStrengthFormProps {
  newStrength: { title: string; description: string };
  setNewStrength: React.Dispatch<React.SetStateAction<{ title: string; description: string }>>;
  onAdd: () => void;
  onCancel: () => void;
}

const AddStrengthForm: React.FC<AddStrengthFormProps> = ({ 
  newStrength, 
  setNewStrength, 
  onAdd, 
  onCancel 
}) => (
  <div className="h-64 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
    <h3 className="text-lg font-semibold mb-4 text-gray-900">새로운 강점</h3>
    
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
        <input
          type="text"
          value={newStrength.title}
          onChange={(e) => setNewStrength(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="강점 제목"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
        <textarea
          value={newStrength.description}
          onChange={(e) => setNewStrength(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="강점에 대한 자세한 설명"
          rows={3}
        />
      </div>
    </div>
    
    <div className="flex space-x-2 mt-4">
      <button
        onClick={onAdd}
        className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
      >
        추가
      </button>
      <button
        onClick={onCancel}
        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
      >
        취소
      </button>
    </div>
  </div>
);

export default StrengthsSection; 