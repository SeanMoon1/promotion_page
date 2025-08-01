import React, { useState, useCallback, useMemo } from 'react';
import { Plus, Trash2, Edit3, ChevronUp, ChevronDown } from 'lucide-react';
import { CustomSection } from '../types/auth';

// 개별 커스텀 섹션 표시 컴포넌트
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

  const handleSave = useCallback(() => {
    if (title.trim() && content.trim()) {
      onUpdate({
        ...section,
        title: title.trim(),
        content: content.trim()
      });
      setIsEditing(false);
    }
  }, [title, content, section, onUpdate]);

  const handleCancel = useCallback(() => {
    setTitle(section.title);
    setContent(section.content);
    setIsEditing(false);
  }, [section]);

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
        <h3 className="text-4xl font-bold text-gray-900 text-center">{section.title}</h3>
        {isOwner && (
          <div className="flex items-center justify-center space-x-2 mt-4">
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
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{section.content}</p>
      </div>
    </div>
  );
};

// 커스텀 섹션 추가 컴포넌트
interface CustomSectionAdderProps {
  isOwner: boolean;
  onAdd: (section: CustomSection) => void;
}

const CustomSectionAdder: React.FC<CustomSectionAdderProps> = ({
  isOwner,
  onAdd
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleAdd = useCallback(() => {
    if (!title.trim()) {
      alert('섹션 제목을 입력해주세요.');
      return;
    }
    
    if (!content.trim()) {
      alert('섹션 내용을 입력해주세요.');
      return;
    }
    
    const section: CustomSection = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      order: 0,
      sectionId: `custom_${Date.now()}`
    };
    
    onAdd(section);
    setTitle('');
    setContent('');
    setIsAdding(false);
  }, [title, content, onAdd]);

  const handleCancel = useCallback(() => {
    setTitle('');
    setContent('');
    setIsAdding(false);
  }, []);

  if (!isOwner) return null;

  if (isAdding) {
    return (
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-6 text-gray-900">새로운 커스텀 섹션</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">섹션 제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              placeholder="섹션 제목을 입력하세요"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">섹션 내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base resize-none"
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
            섹션 추가
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
      <div className="text-center">
        <button
          onClick={() => setIsAdding(true)}
          className="h-32 w-full border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors duration-200 bg-gray-50 hover:bg-gray-100"
        >
          <Plus className="w-8 h-8 mb-2" />
          <span className="text-sm font-medium">커스텀 섹션 추가</span>
          <span className="text-xs text-gray-400 mt-1">클릭하여 새로운 섹션을 만드세요</span>
        </button>
      </div>
    </div>
  );
};

// 기존 컴포넌트들 (호환성을 위해 유지)
interface CustomSectionDisplayProps {
  sections: CustomSection[];
  isOwner: boolean;
  onUpdate: (sections: CustomSection[]) => void;
}

const CustomSectionDisplay: React.FC<CustomSectionDisplayProps> = ({
  sections,
  isOwner,
  onUpdate
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newSection, setNewSection] = useState({ title: '', content: '' });

  const handleAddSection = useCallback(() => {
    if (!newSection.title.trim()) {
      alert('섹션 제목을 입력해주세요.');
      return;
    }
    
    if (!newSection.content.trim()) {
      alert('섹션 내용을 입력해주세요.');
      return;
    }
    
    const section: CustomSection = {
      id: Date.now().toString(),
      title: newSection.title.trim(),
      content: newSection.content.trim(),
      order: sections.length,
      sectionId: `custom_${Date.now()}`
    };
    
    const updatedSections = [...sections, section];
    onUpdate(updatedSections);
    
    setNewSection({ title: '', content: '' });
    setIsAdding(false);
  }, [newSection, sections, onUpdate]);

  const handleRemoveSection = useCallback((id: string) => {
    const updatedSections = sections.filter(section => section.id !== id);
    onUpdate(updatedSections);
  }, [sections, onUpdate]);

  const handleUpdateSection = useCallback((id: string, updates: Partial<CustomSection>) => {
    const updatedSections = sections.map(section => 
      section.id === id ? { ...section, ...updates } : section
    );
    onUpdate(updatedSections);
    setEditingId(null);
  }, [sections, onUpdate]);

  const handleMoveSection = useCallback((id: string, direction: 'up' | 'down') => {
    const currentIndex = sections.findIndex(section => section.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const updatedSections = [...sections];
    [updatedSections[currentIndex], updatedSections[newIndex]] = 
    [updatedSections[newIndex], updatedSections[currentIndex]];

    // Update order numbers
    updatedSections.forEach((section, index) => {
      section.order = index;
    });

    onUpdate(updatedSections);
  }, [sections, onUpdate]);

  const handleCancelAdd = useCallback(() => {
    setNewSection({ title: '', content: '' });
    setIsAdding(false);
  }, []);

  const sortedSections = useMemo(() => {
    if (!Array.isArray(sections)) {
      return [];
    }
    return [...sections].sort((a, b) => a.order - b.order);
  }, [sections]);

  return (
    <div className="p-12">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4 text-gray-900">
          커스텀 섹션
        </h2>
        <p className="text-gray-600 text-lg">원하는 내용을 자유롭게 추가하세요</p>
      </div>

      <div className="space-y-6">
        {sortedSections.map((section) => (
          <div key={section.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {editingId === section.id ? (
              <SectionEditForm
                section={section}
                onSave={(updates) => handleUpdateSection(section.id, updates)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <SectionDisplay
                section={section}
                isOwner={isOwner}
                onEdit={() => setEditingId(section.id)}
                onRemove={() => handleRemoveSection(section.id)}
                onMoveUp={() => handleMoveSection(section.id, 'up')}
                onMoveDown={() => handleMoveSection(section.id, 'down')}
              />
            )}
          </div>
        ))}
        
        {isOwner && (
          isAdding ? (
            <AddSectionForm
              newSection={newSection}
              setNewSection={setNewSection}
              onAdd={handleAddSection}
              onCancel={handleCancelAdd}
            />
          ) : (
            <AddSectionButton onClick={() => setIsAdding(true)} />
          )
        )}
      </div>
    </div>
  );
};

// 기존 CustomSectionComponent는 섹션 추가 전용으로 사용
interface CustomSectionProps {
  sections: CustomSection[];
  isOwner: boolean;
  onUpdate: (sections: CustomSection[]) => void;
}

const CustomSectionComponent: React.FC<CustomSectionProps> = ({
  sections,
  isOwner,
  onUpdate
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newSection, setNewSection] = useState({ title: '', content: '' });

  const handleAddSection = useCallback(() => {
    if (!newSection.title.trim()) {
      alert('섹션 제목을 입력해주세요.');
      return;
    }
    
    if (!newSection.content.trim()) {
      alert('섹션 내용을 입력해주세요.');
      return;
    }
    
    const section: CustomSection = {
      id: Date.now().toString(),
      title: newSection.title.trim(),
      content: newSection.content.trim(),
      order: sections.length,
      sectionId: `custom_${Date.now()}`
    };
    
    const updatedSections = [...sections, section];
    onUpdate(updatedSections);
    
    setNewSection({ title: '', content: '' });
    setIsAdding(false);
  }, [newSection, sections, onUpdate]);

  const handleCancelAdd = useCallback(() => {
    setNewSection({ title: '', content: '' });
    setIsAdding(false);
  }, []);

  return (
    <div className="p-12">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4 text-gray-900">
          커스텀 섹션 추가
        </h2>
        <p className="text-gray-600 text-lg">새로운 섹션을 추가하세요</p>
      </div>

      <div className="space-y-6">
        {isOwner && (
          isAdding ? (
            <AddSectionForm
              newSection={newSection}
              setNewSection={setNewSection}
              onAdd={handleAddSection}
              onCancel={handleCancelAdd}
            />
          ) : (
            <AddSectionButton onClick={() => setIsAdding(true)} />
          )
        )}
      </div>
    </div>
  );
};

interface SectionDisplayProps {
  section: CustomSection;
  isOwner: boolean;
  onEdit: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const SectionDisplay: React.FC<SectionDisplayProps> = ({
  section,
  isOwner,
  onEdit,
  onRemove,
  onMoveUp,
  onMoveDown
}) => (
  <div className="p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-2xl font-bold text-gray-900">{section.title}</h3>
      {isOwner && (
        <div className="flex items-center space-x-2">
          <button
            onClick={onMoveUp}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="위로 이동"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={onMoveDown}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="아래로 이동"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            title="편집"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={onRemove}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            title="삭제"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
    <div className="prose prose-lg max-w-none">
      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{section.content}</p>
    </div>
  </div>
);

interface SectionEditFormProps {
  section: CustomSection;
  onSave: (updates: Partial<CustomSection>) => void;
  onCancel: () => void;
}

const SectionEditForm: React.FC<SectionEditFormProps> = ({
  section,
  onSave,
  onCancel
}) => {
  const [title, setTitle] = useState(section.title);
  const [content, setContent] = useState(section.content);

  const handleSave = useCallback(() => {
    if (title.trim() && content.trim()) {
      onSave({ title: title.trim(), content: content.trim() });
    }
  }, [title, content, onSave]);

  return (
    <div className="p-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            placeholder="섹션 제목"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
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
          onClick={handleSave}
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
  );
};

interface AddSectionButtonProps {
  onClick: () => void;
}

const AddSectionButton: React.FC<AddSectionButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="h-32 w-full border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors duration-200 bg-gray-50 hover:bg-gray-100"
  >
    <Plus className="w-8 h-8 mb-2" />
    <span className="text-sm font-medium">커스텀 섹션 추가</span>
    <span className="text-xs text-gray-400 mt-1">클릭하여 새로운 섹션을 만드세요</span>
  </button>
);

interface AddSectionFormProps {
  newSection: { title: string; content: string };
  setNewSection: React.Dispatch<React.SetStateAction<{ title: string; content: string }>>;
  onAdd: () => void;
  onCancel: () => void;
}

const AddSectionForm: React.FC<AddSectionFormProps> = ({ 
  newSection, 
  setNewSection, 
  onAdd, 
  onCancel 
}) => (
  <div className="w-full bg-white rounded-xl shadow-lg p-8 border border-gray-200">
    <h3 className="text-xl font-semibold mb-6 text-gray-900">새로운 커스텀 섹션</h3>
    
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">섹션 제목</label>
        <input
          type="text"
          value={newSection.title}
          onChange={(e) => setNewSection(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          placeholder="섹션 제목을 입력하세요"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">섹션 내용</label>
        <textarea
          value={newSection.content}
          onChange={(e) => setNewSection(prev => ({ ...prev, content: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base resize-none"
          placeholder="섹션 내용을 입력하세요"
          rows={6}
        />
      </div>
    </div>
    
    <div className="flex space-x-3 mt-6">
      <button
        onClick={onAdd}
        className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        섹션 추가
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

export { CustomSectionDisplay, IndividualCustomSection, CustomSectionAdder };
export default CustomSectionComponent; 