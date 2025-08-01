import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

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

export default app; 