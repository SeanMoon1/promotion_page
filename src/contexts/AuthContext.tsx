import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../utils/firebase';
import { User, AuthState, LoginCredentials, SignupCredentials, ProfileData } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  getProfileData: (nickname: string) => Promise<ProfileData | null>;
  updateProfileData: (data: Partial<ProfileData>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // Firebase Auth 상태 변경 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Firestore에서 사용자 정보 가져오기
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setState({
              user: {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: userData.displayName,
                nickname: userData.nickname,
                photoURL: firebaseUser.photoURL || undefined,
                createdAt: userData.createdAt instanceof Timestamp ? userData.createdAt.toDate() : userData.createdAt,
              },
              loading: false,
              error: null,
            });
          } else {
            // 사용자 문서가 없는 경우 (회원가입 직후)
            setState({
              user: {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || '',
                nickname: '', // 임시로 빈 값 설정
                photoURL: firebaseUser.photoURL || undefined,
                createdAt: new Date(),
              },
              loading: false,
              error: null,
            });
          }
        } else {
          setState({
            user: null,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setState({
          user: null,
          loading: false,
          error: '사용자 정보를 불러오는 중 오류가 발생했습니다.',
        });
      }
    });

    return unsubscribe;
  }, []);

  // 로그인
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.message || '로그인에 실패했습니다.' 
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // 회원가입
  const signup = useCallback(async (credentials: SignupCredentials) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // 닉네임 중복 체크
      try {
        const nicknameDoc = await getDoc(doc(db, 'profiles', credentials.nickname));
        if (nicknameDoc.exists()) {
          throw new Error('이미 사용 중인 닉네임입니다.');
        }
      } catch (error: any) {
        if (error.message.includes('닉네임')) {
          throw error;
        }
        console.error('닉네임 중복 체크 실패:', error);
        throw new Error('닉네임 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
      
      // Firebase Auth로 사용자 생성
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        credentials.email, 
        credentials.password
      );

      // 사용자 프로필 업데이트
      await updateProfile(userCredential.user, {
        displayName: credentials.displayName,
      });

      // Firestore에 사용자 정보 저장
      const userData = {
        uid: userCredential.user.uid,
        email: credentials.email,
        displayName: credentials.displayName,
        nickname: credentials.nickname,
        createdAt: new Date(),
      };

      try {
        await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      } catch (error: any) {
        console.error('사용자 정보 저장 실패:', error);
        throw new Error('사용자 정보 저장 중 오류가 발생했습니다.');
      }

      // 기본 프로필 데이터 생성
      const defaultProfileData: ProfileData = {
        uid: userCredential.user.uid,
        nickname: credentials.nickname,
        pageTitle: `${credentials.displayName}의 홍보 페이지`,
        name: credentials.displayName,
        image: '',
        description: '자신을 소개하는 문구를 작성해보세요!',
        strengths: [],
        strengthsTitle: '나의 강점',
        socialLinks: [],
        customSections: [],
        showStrengths: true,
        showSocialLinks: true,
        showCustomSections: false,
        sectionOrder: ['strengths', 'socialLinks'],
        theme: {
          primaryColor: { r: 59, g: 130, b: 246, hex: '#3b82f6' },
          secondaryColor: { r: 147, g: 51, b: 234, hex: '#9333ea' },
          accentColor: { r: 236, g: 72, b: 153, hex: '#ec4899' },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      try {
        await setDoc(doc(db, 'profiles', credentials.nickname), defaultProfileData);
      } catch (error: any) {
        console.error('프로필 데이터 저장 실패:', error);
        throw new Error('프로필 데이터 저장 중 오류가 발생했습니다.');
      }

      // 회원가입 성공 후 사용자 상태 즉시 업데이트
      setState({
        user: {
          uid: userCredential.user.uid,
          email: credentials.email,
          displayName: credentials.displayName,
          nickname: credentials.nickname,
          photoURL: userCredential.user.photoURL || undefined,
          createdAt: new Date(),
        },
        loading: false,
        error: null,
      });

    } catch (error: any) {
      console.error('회원가입 실패:', error);
      setState(prev => ({ 
        ...prev, 
        error: error.message || '회원가입에 실패했습니다.' 
      }));
      throw error;
    }
  }, []);

  // 로그아웃
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.message || '로그아웃에 실패했습니다.' 
      }));
    }
  }, []);

  // 사용자 프로필 업데이트
  const updateUserProfile = useCallback(async (data: Partial<User>) => {
    if (!state.user) return;

    try {
      await updateDoc(doc(db, 'users', state.user.uid), data);
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.message || '프로필 업데이트에 실패했습니다.' 
      }));
    }
  }, [state.user]);

  // 프로필 데이터 가져오기
  const getProfileData = useCallback(async (nickname: string): Promise<ProfileData | null> => {
    try {
      const profileDoc = await getDoc(doc(db, 'profiles', nickname));
      if (profileDoc.exists()) {
        const data = profileDoc.data() as any;
        
        // 데이터 검증 및 기본값 설정
        const validatedData: ProfileData = {
          uid: data.uid || '',
          nickname: data.nickname || '',
          pageTitle: data.pageTitle || '',
          name: data.name || '',
          image: data.image || '',
          description: data.description || '',
          strengths: Array.isArray(data.strengths) ? data.strengths : [],
          strengthsTitle: data.strengthsTitle || '나의 강점',
          socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : [],
          customSections: Array.isArray(data.customSections) ? data.customSections : [],
          showStrengths: data.showStrengths !== false,
          showSocialLinks: data.showSocialLinks !== false,
          showCustomSections: data.showCustomSections === true,
          sectionOrder: Array.isArray(data.sectionOrder) ? data.sectionOrder : ['strengths', 'socialLinks'],
          theme: data.theme || {
            primaryColor: { r: 59, g: 130, b: 246, hex: '#3b82f6' },
            secondaryColor: { r: 147, g: 51, b: 234, hex: '#9333ea' },
            accentColor: { r: 236, g: 72, b: 153, hex: '#ec4899' },
          },
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt || new Date(),
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt || new Date(),
        };
        
        return validatedData;
      }
      return null;
    } catch (error) {
      console.error('프로필 데이터 가져오기 실패:', error);
      return null;
    }
  }, []);

  // 프로필 데이터 업데이트
  const updateProfileData = useCallback(async (data: Partial<ProfileData>) => {
    if (!state.user) return;

    try {
      const profileRef = doc(db, 'profiles', state.user.nickname);
      await updateDoc(profileRef, {
        ...data,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.message || '프로필 업데이트에 실패했습니다.' 
      }));
    }
  }, [state.user]);

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    updateUserProfile,
    getProfileData,
    updateProfileData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 