import React, { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoginCredentials, SignupCredentials } from '../types/auth';
import { Eye, EyeOff, User, Mail, Lock, UserPlus, Check, X } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';

interface AuthFormsProps {
  onSuccess?: () => void;
}

// 닉네임 중복 체크 함수
const checkNicknameAvailability = async (nickname: string): Promise<boolean> => {
  try {
    const nicknameDoc = await getDoc(doc(db, 'profiles', nickname));
    return !nicknameDoc.exists();
  } catch (error) {
    console.error('닉네임 중복 체크 실패:', error);
    // Firestore 연결 오류 시에도 사용 가능하다고 가정
    return true;
  }
};

export const LoginForm: React.FC<AuthFormsProps> = ({ onSuccess }) => {
  const { login, loading, error } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(credentials);
      onSuccess?.();
    } catch (error) {
      // 에러는 AuthContext에서 처리됨
    }
  }, [credentials, login, onSuccess]);

  const handleChange = useCallback((field: keyof LoginCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">로그인</h2>
          <p className="text-gray-600">홍보 페이지를 관리하려면 로그인하세요</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="email"
                type="email"
                value={credentials.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="이메일을 입력하세요"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="비밀번호를 입력하세요"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
};

export const SignupForm: React.FC<AuthFormsProps> = ({ onSuccess }) => {
  const { signup, loading, error } = useAuth();
  const [credentials, setCredentials] = useState<SignupCredentials>({
    email: '',
    password: '',
    displayName: '',
    nickname: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nicknameError, setNicknameError] = useState<string>('');
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean | null>(null);

  // 닉네임 유효성 검사
  const validateNickname = useCallback((nickname: string) => {
    if (nickname.length < 3) {
      return '닉네임은 3자 이상이어야 합니다.';
    }
    if (nickname.length > 20) {
      return '닉네임은 20자 이하여야 합니다.';
    }
    if (!/^[a-zA-Z0-9-]+$/.test(nickname)) {
      return '닉네임은 영문자, 숫자, 하이픈(-)만 사용 가능합니다.';
    }
    if (nickname.startsWith('-') || nickname.endsWith('-')) {
      return '닉네임은 하이픈(-)으로 시작하거나 끝날 수 없습니다.';
    }
    if (nickname.includes('--')) {
      return '닉네임에 연속된 하이픈(--)을 사용할 수 없습니다.';
    }
    return '';
  }, []);

  // 닉네임 중복 체크
  const checkAvailability = useCallback(async () => {
    const nickname = credentials.nickname.toLowerCase();
    const isAvailable = await checkNicknameAvailability(nickname);
    setIsNicknameAvailable(isAvailable);
    if (!isAvailable) {
      setNicknameError('이미 사용 중인 닉네임입니다.');
    } else {
      setNicknameError('');
    }
  }, [credentials.nickname]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 닉네임 유효성 검사
    const nicknameValidation = validateNickname(credentials.nickname);
    if (nicknameValidation) {
      setNicknameError(nicknameValidation);
      return;
    }

    // 닉네임 중복 체크
    const nickname = credentials.nickname.toLowerCase();
    const isAvailable = await checkNicknameAvailability(nickname);
    if (!isAvailable) {
      setNicknameError('이미 사용 중인 닉네임입니다.');
      return;
    }

    if (credentials.password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await signup(credentials);
      onSuccess?.();
    } catch (error) {
      // 에러는 AuthContext에서 처리됨
    }
  }, [credentials, confirmPassword, signup, onSuccess, validateNickname]);

  const handleChange = useCallback((field: keyof SignupCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    
    // 닉네임 변경 시 실시간 유효성 검사
    if (field === 'nickname') {
      const error = validateNickname(value);
      setNicknameError(error);
      setIsNicknameAvailable(null); // 닉네임 변경 시 중복 체크 상태 초기화
    }
  }, [validateNickname]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">회원가입</h2>
          <p className="text-gray-600">새로운 홍보 페이지를 만들어보세요</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
              이름
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="displayName"
                type="text"
                value={credentials.displayName}
                onChange={(e) => handleChange('displayName', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="실명을 입력하세요"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
              닉네임 (URL에 사용됨)
            </label>
            <div className="relative flex items-center">
              <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="nickname"
                type="text"
                value={credentials.nickname}
                onChange={(e) => handleChange('nickname', e.target.value.toLowerCase())}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  nicknameError || isNicknameAvailable === false ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="고유한 닉네임을 입력하세요"
                required
              />
              <button
                type="button"
                onClick={checkAvailability}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                title={isNicknameAvailable ? '사용 가능한 닉네임입니다.' : '이미 사용 중인 닉네임입니다.'}
              >
                {isNicknameAvailable === null ? (
                  <Check className="w-5 h-5" />
                ) : isNicknameAvailable ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <X className="w-5 h-5 text-red-500" />
                )}
              </button>
            </div>
            {nicknameError && (
              <p className="text-xs text-red-500 mt-1">{nicknameError}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              예: https://promotion-page-2025.web.app/{credentials.nickname || 'your-nickname'}
            </p>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="email"
                type="email"
                value={credentials.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="이메일을 입력하세요"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="비밀번호를 입력하세요"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호 확인
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="비밀번호를 다시 입력하세요"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-blue-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? '회원가입 중...' : '회원가입'}
          </button>
        </form>
      </div>
    </div>
  );
}; 