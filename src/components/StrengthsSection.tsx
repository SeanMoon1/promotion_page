import React, { useState, useCallback, useMemo } from 'react';
import { Plus, Trash2, Edit3 } from 'lucide-react';
import { Strength, Color } from '../types/auth';
import { useFlipCard } from '../hooks';

interface StrengthsSectionProps {
  strengths: Strength[];
  strengthsTitle: string;
  isOwner: boolean;
  theme?: {
    primaryColor: Color;
    secondaryColor: Color;
    accentColor: Color;
  };
  onUpdate?: (updates: Partial<{ strengths: Strength[]; strengthsTitle: string }>) => void;
}

const StrengthsSection: React.FC<StrengthsSectionProps> = ({
  strengths,
  strengthsTitle,
  isOwner,
  theme,
  onUpdate
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingStrength, setEditingStrength] = useState<Strength | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newStrength, setNewStrength] = useState({ title: '', description: '' });
  const [titleEdit, setTitleEdit] = useState(strengthsTitle);

  const handleAddStrength = useCallback(() => {
    if (newStrength.title.trim() && newStrength.description.trim()) {
      const strength = {
        id: Date.now().toString(),
        title: newStrength.title.trim(),
        description: newStrength.description.trim()
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

  const handleEditStrength = useCallback((strength: Strength) => {
    setEditingStrength(strength);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (editingStrength && editingStrength.title.trim() && editingStrength.description.trim()) {
      const updatedStrengths = strengths.map(strength => 
        strength.id === editingStrength.id ? editingStrength : strength
      );
      onUpdate?.({ strengths: updatedStrengths });
      setEditingStrength(null);
    }
  }, [editingStrength, strengths, onUpdate]);

  const handleCancelEdit = useCallback(() => {
    setEditingStrength(null);
  }, []);

  const handleTitleEdit = useCallback(() => {
    setIsEditingTitle(true);
  }, []);

  const handleTitleSave = useCallback(() => {
    if (titleEdit.trim()) {
      onUpdate?.({ strengthsTitle: titleEdit.trim() });
      setIsEditingTitle(false);
    }
  }, [titleEdit, onUpdate]);

  const handleTitleCancel = useCallback(() => {
    setTitleEdit(strengthsTitle);
    setIsEditingTitle(false);
  }, [strengthsTitle]);

  const handleCancelAdd = useCallback(() => {
    setNewStrength({ title: '', description: '' });
    setIsAdding(false);
  }, []);

  const strengthCards = useMemo(() => 
    (strengths || []).map(strength => (
      <StrengthCard
        key={strength.id}
        strength={strength}
        theme={theme}
        isOwner={isOwner}
        onRemove={isOwner ? handleRemoveStrength : undefined}
        onEdit={isOwner ? handleEditStrength : undefined}
      />
    )), [strengths, handleRemoveStrength, handleEditStrength, isOwner, theme]);

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
                  {strengthsTitle}
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
          <p className="text-gray-600 text-lg">마우스를 카드 위에 올리면 자세한 설명을 확인할 수 있습니다</p>
        </div>

        <div className="flex-1">
          {strengths.length === 0 && isOwner && (
            <div className="flex justify-center">
              {isAdding ? (
                <AddStrengthForm
                  newStrength={newStrength}
                  setNewStrength={setNewStrength}
                  onAdd={handleAddStrength}
                  onCancel={handleCancelAdd}
                />
              ) : (
                <AddStrengthButton onClick={() => setIsAdding(true)} />
              )}
            </div>
          )}
          
          {strengths.length === 1 && (
            <div className="flex justify-center">
              <div className="w-80">
                {strengthCards[0]}
              </div>
            </div>
          )}
          
          {strengths.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {strengthCards}
            </div>
          )}
          
          {strengths.length > 0 && isOwner && (
            <div className="flex justify-center mt-6">
              {isAdding ? (
                <AddStrengthForm
                  newStrength={newStrength}
                  setNewStrength={setNewStrength}
                  onAdd={handleAddStrength}
                  onCancel={handleCancelAdd}
                />
              ) : (
                <AddStrengthButton onClick={() => setIsAdding(true)} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* 편집 모달 */}
      {editingStrength && (
        <EditStrengthModal
          strength={editingStrength}
          setStrength={setEditingStrength}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
};

interface StrengthCardProps {
  strength: Strength;
  isOwner: boolean;
  theme?: {
    primaryColor: Color;
    secondaryColor: Color;
    accentColor: Color;
  };
  onRemove?: (id: string) => void;
  onEdit?: (strength: Strength) => void;
}

const StrengthCard: React.FC<StrengthCardProps> = ({ strength, isOwner, theme, onRemove, onEdit }) => {
  const { isFlipped, setFlipped } = useFlipCard();

  const handleMouseEnter = useCallback(() => {
    setFlipped(true);
  }, [setFlipped]);

  const handleMouseLeave = useCallback(() => {
    setFlipped(false);
  }, [setFlipped]);

  // 테마 색상이 있으면 사용, 없으면 기본값 사용
  const primaryColor = theme?.primaryColor.hex || '#3b82f6';
  const secondaryColor = theme?.secondaryColor.hex || '#9333ea';

  return (
    <div
      className="relative h-64 cursor-pointer transform-style-preserve-3d transition-transform duration-500"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
    >
      {/* 앞면 - 제목만 표시 */}
      <div className="absolute inset-0 backface-hidden">
        <div 
          className="h-full rounded-xl shadow-lg p-6 flex flex-col justify-center items-center text-center border border-gray-200 hover:shadow-xl transition-shadow duration-300"
          style={{ 
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
          }}
        >
          <div className="text-4xl mb-4">💪</div>
          <h3 className="text-xl font-bold text-white mb-2">{strength.title}</h3>
          
          {isOwner && (
            <div className="absolute top-2 right-2 flex space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(strength);
                }}
                className="p-1 text-white hover:text-blue-200 hover:bg-blue-500/20 rounded-full transition-colors"
                title="편집"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove?.(strength.id);
                }}
                className="p-1 text-white hover:text-red-200 hover:bg-red-500/20 rounded-full transition-colors"
                title="삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 뒷면 - 상세 내용 표시 */}
      <div className="absolute inset-0 backface-hidden rotate-y-180">
        <div 
          className="h-full rounded-xl shadow-lg p-6 flex flex-col justify-center items-center text-center text-white"
          style={{ 
            background: `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})`
          }}
        >
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-xl font-bold mb-2">{strength.title}</h3>
          <p className="text-sm opacity-90 leading-relaxed">{strength.description}</p>
          
          {isOwner && (
            <div className="absolute top-2 right-2 flex space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(strength);
                }}
                className="p-1 text-white hover:text-blue-200 hover:bg-blue-500/20 rounded-full transition-colors"
                title="편집"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove?.(strength.id);
                }}
                className="p-1 text-white hover:text-red-200 hover:bg-red-500/20 rounded-full transition-colors"
                title="삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
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
    className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
  >
    <Plus className="w-4 h-4 mr-2" />
    <span>강점 추가</span>
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
  <div className="h-64 w-[600px] bg-white rounded-xl shadow-lg p-8 border border-gray-200 mx-auto">
    <h3 className="text-xl font-semibold mb-6 text-gray-900">새로운 강점</h3>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
        <input
          type="text"
          value={newStrength.title}
          onChange={(e) => setNewStrength(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          placeholder="강점 제목"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
        <textarea
          value={newStrength.description}
          onChange={(e) => setNewStrength(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base resize-none"
          placeholder="강점에 대한 자세한 설명"
          rows={3}
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

interface EditStrengthModalProps {
  strength: Strength;
  setStrength: React.Dispatch<React.SetStateAction<Strength | null>>;
  onSave: () => void;
  onCancel: () => void;
}

const EditStrengthModal: React.FC<EditStrengthModalProps> = ({ 
  strength, 
  setStrength, 
  onSave, 
  onCancel 
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
      <h3 className="text-xl font-semibold mb-6 text-gray-900">강점 편집</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
          <input
            type="text"
            value={strength.title}
            onChange={(e) => setStrength(prev => prev ? { ...prev, title: e.target.value } : null)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            placeholder="강점 제목"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
          <textarea
            value={strength.description}
            onChange={(e) => setStrength(prev => prev ? { ...prev, description: e.target.value } : null)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base resize-none"
            placeholder="강점에 대한 자세한 설명"
            rows={4}
          />
        </div>
      </div>
      
      <div className="flex space-x-3 mt-6">
        <button
          onClick={onSave}
          className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          저장
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
        >
          취소
        </button>
      </div>
    </div>
  </div>
);

export default StrengthsSection; 