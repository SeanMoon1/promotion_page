import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, doc } from 'firebase/firestore';
import { getStorage, connectStorageEmulator, ref } from 'firebase/storage';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

// Firebase 설정 - .env 파일의 환경 변수 사용
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID
};

// 환경 변수 확인 및 오류 처리
const missingVars = [];
if (!firebaseConfig.apiKey) missingVars.push('REACT_APP_FIREBASE_APIKEY');
if (!firebaseConfig.authDomain) missingVars.push('REACT_APP_FIREBASE_AUTHDOMAIN');
if (!firebaseConfig.projectId) missingVars.push('REACT_APP_FIREBASE_PROJECTID');
if (!firebaseConfig.storageBucket) missingVars.push('REACT_APP_FIREBASE_STORAGEBUCKET');
if (!firebaseConfig.messagingSenderId) missingVars.push('REACT_APP_FIREBASE_MESSAGINGSENDERID');
if (!firebaseConfig.appId) missingVars.push('REACT_APP_FIREBASE_APPID');

if (missingVars.length > 0) {
  console.error('❌ Firebase 설정 오류: 다음 환경 변수가 누락되었습니다:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  
  throw new Error('Firebase 설정이 완료되지 않았습니다. 환경 변수를 확인하세요.');
}

// Firebase 앱 초기화
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase 앱이 성공적으로 초기화되었습니다.');
  console.log('📁 프로젝트 ID:', firebaseConfig.projectId);
  console.log('🗄️ Storage Bucket:', firebaseConfig.storageBucket);
} catch (error) {
  console.error('❌ Firebase 초기화 오류:', error);
  console.error('📝 Firebase 설정을 확인하세요.');
  throw error;
}

// Firestore 데이터베이스
export const db = getFirestore(app);

// Firebase Storage
export const storage = getStorage(app);

// Firebase Auth
export const auth = getAuth(app);

// 개발 환경에서 에뮬레이터 연결 (선택사항)
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_EMULATOR === 'true') {
  try {
    // Firestore 에뮬레이터 연결
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('🔧 Firestore 에뮬레이터에 연결되었습니다.');
    
    // Storage 에뮬레이터 연결
    connectStorageEmulator(storage, 'localhost', 9199);
    console.log('🔧 Storage 에뮬레이터에 연결되었습니다.');
    
    // Auth 에뮬레이터 연결
    connectAuthEmulator(auth, 'http://localhost:9099');
    console.log('🔧 Auth 에뮬레이터에 연결되었습니다.');
  } catch (error) {
    console.warn('⚠️ 에뮬레이터 연결 실패 (프로덕션 모드로 실행):', error);
  }
}

// Storage 연결 상태 확인
export const checkStorageConnection = async () => {
  try {
    // 간단한 Storage 참조 생성으로 연결 테스트
    const testRef = ref(storage, '_test');
    console.log('✅ Firebase Storage 연결 확인됨');
    return true;
  } catch (error) {
    console.error('❌ Firebase Storage 연결 실패:', error);
    return false;
  }
};

// Firestore 연결 상태 확인
export const checkFirestoreConnection = async () => {
  try {
    // 간단한 Firestore 참조 생성으로 연결 테스트
    const testRef = doc(db, '_test', 'test');
    console.log('✅ Firestore 연결 확인됨');
    return true;
  } catch (error) {
    console.error('❌ Firestore 연결 실패:', error);
    return false;
  }
};

// Firebase 전체 연결 상태 확인
export const checkFirebaseConnection = async () => {
  const storageConnected = await checkStorageConnection();
  const firestoreConnected = await checkFirestoreConnection();
  
  if (storageConnected && firestoreConnected) {
    console.log('🎉 Firebase 모든 서비스 연결 성공!');
    return true;
  } else {
    console.error('❌ Firebase 서비스 연결 실패');
    return false;
  }
};

export default app; 