# Personal Promotion Page

개인 홍보 페이지를 만들고 관리할 수 있는 React 기반 웹 애플리케이션입니다.

## 📸 데모 화면

### 🔐 로그인 화면
![로그인 화면](../DemoPicture/LoginPage.png)
- **회원가입/로그인**: 이메일, 비밀번호, 이름, 닉네임으로 계정 생성
- **닉네임 검증**: 실시간 닉네임 중복 확인 및 유효성 검사
- **자동 리다이렉트**: 회원가입 완료 후 개인 페이지로 자동 이동

### 🏠 메인 페이지 (1) - 환영 섹션
![메인 페이지 1](../DemoPicture/MainPage(1).png)
- **개인화된 환영 메시지**: "안녕하세요! 저는 {닉네임}입니다"
- **소개 문구**: 사용자가 작성한 자기소개 텍스트
- **편집 기능**: 소유자만 클릭하여 텍스트 수정 가능
- **테마 색상**: 사용자가 설정한 색상으로 텍스트 스타일링

### 🏠 메인 페이지 (2) - 프로필 섹션
![메인 페이지 2](../DemoPicture/MainPage(2).png)
- **프로필 이미지**: 원형 프로필 사진 (배경 제거 옵션)
- **이미지 업로드**: 드래그 앤 드롭 또는 클릭으로 업로드
- **편집 안내**: 소유자에게만 표시되는 편집 가이드
- **반응형 레이아웃**: 데스크톱/모바일 최적화

### 🏠 메인 페이지 (3) - 섹션 관리
![메인 페이지 3](../DemoPicture/MainPage(3).png)
- **강점 카드**: 3D 플립 애니메이션으로 상세 설명 표시
- **소셜 링크**: 다양한 플랫폼 아이콘과 외부 링크
- **커스텀 섹션**: 사용자가 직접 생성한 추가 섹션
- **섹션 순서**: 드래그 앤 드롭으로 섹션 순서 변경

## 🚀 주요 기능

### 🔐 인증 시스템
- **기본 페이지**: `https://promotion-page-2025.web.app`로 접속
- **회원가입**: 이메일, 비밀번호, 이름, 닉네임으로 계정 생성
- **로그인**: 이메일/비밀번호로 로그인
- **개인 페이지**: `https://promotion-page-2025.web.app/{닉네임}` 형태의 개인 URL

### 🎨 테마 커스터마이징
- **이미지 색상 추출**: 업로드한 이미지에서 주요 색상 3가지를 자동 추출
- **색상 선택**: RGB 값 직접 입력 또는 색상 팔레트에서 선택
- **실시간 적용**: 선택한 색상이 즉시 페이지에 반영

### 📝 텍스트 편집
- **폰트 설정**: 다양한 폰트 선택 가능
- **스타일링**: 글자 크기, 굵기, 색상, 정렬 방식 설정
- **배경색**: 텍스트 배경색 커스터마이징

### 🖼️ 이미지 관리
- **배경 제거**: 업로드한 이미지의 배경을 자동으로 제거 (누끼 효과)
- **원본 옵션**: 배경 제거 없이 원본 이미지 사용 가능
- **프로필 이미지**: 개인 프로필 사진으로 설정
- **Firebase Storage 연동**: 이미지를 안전하게 클라우드에 저장
- **자동 이미지 관리**: 기존 이미지 자동 삭제로 저장 공간 최적화
- **캐시 최적화**: 1년간 유효한 캐시 설정으로 로딩 속도 향상

### 💪 강점 카드
- **플립 카드**: 마우스 호버 시 카드가 뒤집히며 상세 설명 표시
- **3D 효과**: CSS 3D 변환을 활용한 부드러운 애니메이션
- **추가/삭제**: 소유자만 강점 카드 관리 가능

### 🔗 소셜 링크
- **다양한 플랫폼**: YouTube, Instagram, Twitter, GitHub, 네이버 카페, 치지직 등
- **아이콘 선택**: 각 플랫폼별 맞춤 아이콘 또는 커스텀 아이콘
- **외부 링크**: 새 탭에서 소셜 미디어 페이지 열기

### 🔒 권한 관리
- **소유자 전용 편집**: 로그인한 사용자만 자신의 페이지 편집 가능
- **공개 접근**: 누구나 링크로 다른 사용자의 페이지 확인 가능
- **실시간 권한 확인**: 페이지 소유자 여부에 따른 UI 변경
- **저장 상태 관리**: 변경사항 저장 상태를 실시간으로 표시
- **안전한 페이지 이탈**: 저장되지 않은 변경사항이 있을 때 확인 대화상자 표시

## 🛠️ 기술 스택

### Frontend
- **React 18**: 최신 React 기능과 Hooks 활용
- **TypeScript**: 타입 안전성과 개발 생산성 향상
- **Tailwind CSS**: 유틸리티 퍼스트 CSS 프레임워크
- **DaisyUI**: Tailwind CSS 기반 컴포넌트 라이브러리

### Backend & Database
- **Firebase Authentication**: 사용자 인증 및 계정 관리
- **Firestore**: 실시간 NoSQL 데이터베이스
- **Firebase Storage**: 이미지 및 파일 저장
- **보안 규칙**: 사용자별 접근 권한 및 데이터 보호
- **실시간 동기화**: 변경사항이 즉시 모든 사용자에게 반영

### 라우팅 & 상태 관리
- **React Router DOM**: 클라이언트 사이드 라우팅
- **React Context API**: 전역 상태 관리 (테마, 인증, 프로필)

### 커스텀 Hooks
- **useModal**: 모달 상태 관리
- **useLocalStorage**: 로컬 스토리지 훅
- **useDebounce**: 디바운스 기능
- **useImageProcessing**: 이미지 처리 및 색상 추출
- **useTextEditor**: 텍스트 스타일링 관리
- **useFlipCard**: 3D 플립 카드 애니메이션
- **useForm**: 폼 상태 관리
- **useProfile**: 프로필 데이터 및 저장 상태 관리

### UI/UX 라이브러리
- **Lucide React**: 아이콘 라이브러리
- **React Dropzone**: 드래그 앤 드롭 파일 업로드
- **React Color**: 색상 선택 컴포넌트

## 📁 프로젝트 구조

```
promotion_page/
├── public/                 # 정적 파일
│   ├── index.html         # 메인 HTML 파일
│   ├── manifest.json      # PWA 매니페스트
│   └── favicon.ico       # 파비콘
├── src/
│   ├── components/        # 재사용 가능한 컴포넌트
│   │   ├── AuthForms.tsx # 로그인/회원가입 폼
│   │   ├── ColorPicker.tsx # 색상 선택 컴포넌트
│   │   ├── ImageUploader.tsx # 이미지 업로드
│   │   ├── ProfileSection.tsx # 프로필 섹션
│   │   ├── SocialLinksSection.tsx # 소셜 링크
│   │   ├── StrengthsSection.tsx # 강점 카드
│   │   └── TextEditor.tsx # 텍스트 편집기
│   ├── contexts/          # React Context
│   │   ├── AuthContext.tsx # 인증 상태 관리
│   │   └── ThemeContext.tsx # 테마 상태 관리
│   ├── hooks/             # 커스텀 React Hooks
│   │   ├── useModal.ts    # 모달 관리
│   │   ├── useLocalStorage.ts # 로컬 스토리지
│   │   ├── useDebounce.ts # 디바운스
│   │   ├── useImageProcessing.ts # 이미지 처리
│   │   ├── useTextEditor.ts # 텍스트 편집
│   │   ├── useFlipCard.ts # 플립 카드
│   │   ├── useForm.ts     # 폼 관리
│   │   └── index.ts       # Hooks 배럴 익스포트
│   ├── pages/             # 페이지 컴포넌트
│   │   ├── AuthPage.tsx   # 인증 페이지
│   │   └── ProfilePage.tsx # 개인 프로필 페이지
│   ├── types/             # TypeScript 타입 정의
│   │   └── auth.ts        # 인증 관련 타입
│   ├── utils/             # 유틸리티 함수
│   │   └── firebase.ts    # Firebase 설정
│   ├── App.tsx            # 메인 앱 컴포넌트
│   └── index.tsx          # 앱 진입점
├── firebase.json          # Firebase 호스팅 설정
├── .firebaserc            # Firebase 프로젝트 설정
└── package.json           # 프로젝트 의존성
```

## 🚀 시작하기

### 1. 저장소 클론
```bash
git clone https://github.com/SeanMoon1/promotion_page.git
cd promotion_page
```

### 0. 사전 요구사항
- **Node.js**: 16.0.0 이상
- **npm**: 8.0.0 이상
- **Firebase 계정**: [Firebase Console](https://console.firebase.google.com/)에서 프로젝트 생성

### 2. 의존성 설치
```bash
npm install
```

### 3. Firebase 설정

#### 3.1 Firebase 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. 새 프로젝트 생성 (예: `promotion-page-2025`)
3. 웹 앱 추가

#### 3.2 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

#### 3.3 Firebase 서비스 활성화
1. **Authentication**: 이메일/비밀번호 로그인 활성화
2. **Firestore**: 데이터베이스 생성 (테스트 모드로 시작)
3. **Storage**: 파일 저장소 활성화

#### 3.4 Firebase CLI 설치 및 로그인
```bash
npm install -g firebase-tools
firebase login
firebase use your_project_id
```

#### 3.5 보안 규칙 설정
Firebase Console에서 다음 보안 규칙을 설정하세요:

**Firestore 규칙**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자 정보 - 본인만 읽기/쓰기 가능
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 프로필 데이터 - 모든 사용자가 읽기 가능, 소유자만 쓰기 가능
    match /profiles/{nickname} {
      allow read: if true; // 모든 사용자가 프로필을 볼 수 있음
      allow write: if request.auth != null && 
        (resource == null || resource.data.uid == request.auth.uid);
    }
  }
}
```

**Storage 규칙**:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 프로필 이미지 - 인증된 사용자만 업로드, 모든 사용자가 읽기 가능
    match /profile-images/{userId}/{allPaths=**} {
      allow read: if true; // 모든 사용자가 프로필 이미지를 볼 수 있음
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 커스텀 이미지 - 인증된 사용자만 업로드, 모든 사용자가 읽기 가능
    match /custom-images/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 기본 보안 - 다른 모든 경로는 기본적으로 차단
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

### 4. 개발 서버 실행
```bash
npm start
```

### 5. 프로덕션 빌드 및 배포
```bash
npm run build
firebase deploy
```

### 6. 보안 규칙 배포
```bash
# Firestore 보안 규칙 배포
firebase deploy --only firestore:rules

# Storage 보안 규칙 배포
firebase deploy --only storage
```

## 📖 사용법

### 회원가입 및 로그인
1. `https://promotion-page-2025.web.app` 접속
2. "회원가입" 클릭하여 계정 생성
3. 이메일, 비밀번호, 이름, 닉네임 입력
4. 회원가입 완료 후 자동으로 개인 페이지로 이동

### 개인 페이지 관리
- **URL 구조**: `https://promotion-page-2025.web.app/{닉네임}`
- **편집 기능**: 로그인한 소유자만 편집 가능
- **공개 접근**: 누구나 링크로 페이지 확인 가능

### 페이지 커스터마이징
1. **테마 설정**: 상단 헤더의 "테마 설정" 버튼
2. **이미지 업로드**: "이미지 업로드" 버튼으로 프로필 사진 설정
3. **텍스트 편집**: "텍스트 편집" 버튼으로 소개 문구 수정
4. **강점 추가**: 강점 섹션에서 새로운 강점 카드 추가
5. **소셜 링크**: 소셜 링크 섹션에서 외부 플랫폼 연결
6. **저장 관리**: "저장" 버튼으로 변경사항을 Firebase에 저장
7. **섹션 관리**: "섹션 관리" 버튼으로 페이지 구성 요소 순서 변경

## 🔧 커스터마이징

### 색상 테마 변경
- 이미지에서 자동 색상 추출
- RGB 값 직접 입력
- 색상 팔레트에서 선택

### 텍스트 스타일링
- 폰트 패밀리 선택
- 글자 크기 조정 (12px ~ 48px)
- 글자 굵기 설정 (normal, bold, bolder)
- 텍스트 색상 및 배경색 설정
- 정렬 방식 선택 (left, center, right, justify)

### 강점 카드 관리
- 제목과 상세 설명 입력
- 마우스 호버 시 3D 플립 애니메이션
- 소유자만 추가/삭제 가능

### 소셜 링크 설정
- 지원 플랫폼: YouTube, Instagram, Twitter, GitHub, 네이버 카페, 치지직 등
- 커스텀 아이콘 설정 가능
- URL 유효성 검사

## 🐛 문제 해결

### Firebase 설정 오류
- 환경 변수가 올바르게 설정되었는지 확인
- Firebase 프로젝트 ID가 정확한지 확인
- Authentication, Firestore, Storage 서비스가 활성화되었는지 확인
- 보안 규칙이 올바르게 배포되었는지 확인

### 저장 관련 문제
- **저장되지 않는 문제**: "저장" 버튼을 클릭했는지 확인
- **권한 오류**: 로그인 상태 및 사용자 인증 확인
- **네트워크 오류**: 인터넷 연결 상태 확인

### 이미지 업로드 문제
- **업로드 실패**: Firebase Storage 서비스 활성화 여부 확인
- **이미지 표시 안됨**: Storage 보안 규칙에서 읽기 권한 확인
- **용량 제한**: 이미지 파일 크기 확인 (권장: 5MB 이하)

### 빌드 오류
```bash
npm run build
```
빌드 전에 모든 TypeScript 오류를 수정하세요.

### 배포 오류
```bash
firebase deploy
```
Firebase CLI가 올바르게 설치되고 로그인되었는지 확인하세요.

## 🤝 기여하기

1. 이 저장소를 포크하세요
2. 기능 브랜치를 생성하세요 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/AmazingFeature`)
5. Pull Request를 생성하세요

## 🔒 보안 및 권한

### 데이터 보호
- **사용자 인증**: Firebase Authentication을 통한 안전한 로그인
- **권한 기반 접근**: 사용자별 데이터 접근 권한 제한
- **보안 규칙**: Firestore 및 Storage에 대한 세밀한 보안 정책

### 저장 및 동기화
- **실시간 저장**: 변경사항을 즉시 Firebase에 저장
- **상태 관리**: 저장되지 않은 변경사항 실시간 표시
- **안전한 이탈**: 저장되지 않은 변경사항이 있을 때 사용자 확인

### 이미지 보안
- **사용자별 폴더**: 각 사용자의 이미지를 독립적인 폴더에 저장
- **접근 제어**: 본인만 이미지 수정/삭제 가능
- **공개 읽기**: 모든 사용자가 업로드된 이미지 확인 가능

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해주세요.

---

**개발자**: [문승연] https://github.com/SeanMoon1/promotion_page  
**버전**: 0.1.0  
**최종 업데이트**: 2025년 8월 1일

## 📋 최근 업데이트 (v0.1.0)

### ✨ 새로운 기능
- **Firebase Storage 프로덕션 모드 연동**: 이미지 안전한 클라우드 저장
- **명시적 저장 시스템**: "저장" 버튼으로 변경사항 관리
- **실시간 저장 상태 표시**: 저장 진행 상황 및 결과 피드백
- **자동 이미지 관리**: 기존 이미지 자동 삭제 및 저장 공간 최적화

### 🔒 보안 강화
- **Storage 보안 규칙**: 사용자별 접근 권한 및 데이터 보호
- **Firestore 보안 규칙**: 프로필 데이터 읽기/쓰기 권한 세분화
- **권한 기반 접근 제어**: 인증된 사용자만 데이터 수정 가능

### 🚀 성능 최적화
- **캐시 최적화**: 1년간 유효한 이미지 캐시 설정
- **자동 이미지 정리**: 중복 이미지 자동 제거
- **저장 상태 관리**: 변경사항 추적 및 안전한 페이지 이탈 보호
