import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm, SignupForm } from '../components/AuthForms';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, UserPlus } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // 사용자 상태 변경 시 자동 리다이렉션
  useEffect(() => {
    if (user && user.nickname && !loading) {
      navigate(`/${user.nickname}`);
    }
  }, [user, loading, navigate]);

  const handleAuthSuccess = useCallback(() => {
    // 회원가입 성공 시 즉시 리다이렉션하지 않고, useEffect에서 처리
    console.log('인증 성공');
  }, []);

  const toggleMode = useCallback(() => {
    setIsLogin(!isLogin);
  }, [isLogin]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 로고 및 제목 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Promotion Page
          </h1>
          <p className="text-gray-600">
            나만의 홍보 페이지를 만들어보세요
          </p>
        </div>

        {/* 인증 폼 */}
        {isLogin ? (
          <LoginForm onSuccess={handleAuthSuccess} />
        ) : (
          <SignupForm onSuccess={handleAuthSuccess} />
        )}

        {/* 모드 전환 버튼 */}
        <div className="text-center mt-6">
          <button
            onClick={toggleMode}
            className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            {isLogin ? (
              <span className="flex items-center justify-center gap-2">
                <UserPlus className="w-4 h-4" />
                계정이 없으신가요? 회원가입
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <LogIn className="w-4 h-4" />
                이미 계정이 있으신가요? 로그인
              </span>
            )}
          </button>
        </div>

        {/* 기능 소개 */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white/50 rounded-lg backdrop-blur-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 text-xl">🎨</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">테마 커스터마이징</h3>
            <p className="text-sm text-gray-600">이미지에서 색상을 추출하여 개성 있는 디자인</p>
          </div>
          
          <div className="text-center p-4 bg-white/50 rounded-lg backdrop-blur-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 text-xl">📝</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">텍스트 편집</h3>
            <p className="text-sm text-gray-600">폰트, 색상, 크기 등 자유로운 텍스트 스타일링</p>
          </div>
          
          <div className="text-center p-4 bg-white/50 rounded-lg backdrop-blur-sm">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-pink-600 text-xl">🔗</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">소셜 링크</h3>
            <p className="text-sm text-gray-600">유튜브, 네이버 등 다양한 플랫폼 연결</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 