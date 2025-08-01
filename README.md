# 🎨 Personal Promotion Page

개인 홍보 페이지를 만들고 관리할 수 있는 React 기반 웹 애플리케이션입니다. 이미지 업로드, 색상 추출, 텍스트 편집, 소셜 링크 관리 등 다양한 기능을 제공합니다.

## ✨ 주요 기능

### 🎨 테마 커스터마이징
- **이미지에서 색상 자동 추출**: 업로드한 이미지에서 주요 색상 3가지를 자동으로 추출하여 테마 색상으로 제안
- **수동 색상 선택**: RGB 값 직접 입력 또는 색상 팔레트에서 선택
- **실시간 미리보기**: 선택한 색상의 즉시 적용 및 미리보기

### 🖼️ 이미지 관리
- **배경 제거**: 업로드한 이미지의 배경을 자동으로 제거 (누끼 효과)
- **원본 이미지 옵션**: 배경 제거 없이 원본 이미지 사용 가능
- **드래그 앤 드롭**: 직관적인 파일 업로드 인터페이스

### 📝 텍스트 편집
- **다양한 폰트 옵션**: 폰트 종류, 크기, 굵기 선택
- **색상 및 배경**: 텍스트 색상과 배경색 커스터마이징
- **정렬 옵션**: 왼쪽, 가운데, 오른쪽, 양쪽 정렬
- **실시간 미리보기**: 변경사항을 즉시 확인

### 💪 강점 카드
- **플립 카드 효과**: 마우스 호버 시 카드가 뒤집히며 상세 설명 표시
- **짧은 설명**: 카드 앞면에 간단한 강점 요약
- **상세 설명**: 카드 뒷면에 자세한 강점 설명
- **추가/삭제**: 새로운 강점 추가 및 기존 강점 삭제

### 🔗 소셜 링크
- **다양한 플랫폼**: YouTube, Instagram, Twitter, GitHub, 네이버 카페, 치지직, Soop 등
- **아이콘 선택**: 플랫폼별 기본 아이콘 또는 사용자 정의 아이콘
- **외부 링크**: 클릭 시 새 탭에서 링크 열기
- **관리 기능**: 링크 추가, 수정, 삭제

### 🔥 Firebase 연동
- **데이터 저장**: 프로필 정보, 이미지, 설정 등을 Firebase에 저장
- **실시간 동기화**: 여러 기기에서 실시간으로 데이터 동기화
- **인증 시스템**: 사용자 인증 및 권한 관리

## 🛠️ 기술 스택

### Frontend
- **React 19.1.1**: 최신 React 버전으로 구축
- **TypeScript**: 타입 안전성 보장
- **Tailwind CSS**: 유틸리티 퍼스트 CSS 프레임워크
- **DaisyUI**: Tailwind CSS 기반 UI 컴포넌트 라이브러리

### Libraries
- **React Router DOM**: 클라이언트 사이드 라우팅
- **React Dropzone**: 드래그 앤 드롭 파일 업로드
- **React Color**: 색상 선택 컴포넌트
- **Lucide React**: 아이콘 라이브러리

### Backend & Storage
- **Firebase**: 백엔드 서비스 (Firestore, Storage, Auth)
- **Canvas API**: 이미지 처리 및 색상 추출

### Custom Hooks
- `useModal`: 모달 상태 관리
- `useLocalStorage`: 로컬 스토리지 훅
- `useDebounce`: 디바운싱 훅
- `useImageProcessing`: 이미지 처리 훅
- `useTextEditor`: 텍스트 편집 훅
- `useFlipCard`: 3D 플립 카드 훅
- `useForm`: 폼 상태 관리 훅

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── ColorPicker.tsx     # 색상 선택 모달
│   ├── Header.tsx          # 헤더 컴포넌트
│   ├── ImageUploader.tsx   # 이미지 업로드 모달
│   ├── ProfileSection.tsx  # 프로필 섹션
│   ├── SocialLinksSection.tsx  # 소셜 링크 섹션
│   ├── StrengthsSection.tsx    # 강점 카드 섹션
│   └── TextEditor.tsx      # 텍스트 편집 모달
├── contexts/            # React Context API
│   ├── ProfileContext.tsx   # 프로필 데이터 관리
│   └── ThemeContext.tsx     # 테마 색상 관리
├── hooks/              # 커스텀 React 훅
│   ├── useModal.ts         # 모달 상태 관리
│   ├── useLocalStorage.ts  # 로컬 스토리지
│   ├── useDebounce.ts      # 디바운싱
│   ├── useImageProcessing.ts # 이미지 처리
│   ├── useTextEditor.ts    # 텍스트 편집
│   ├── useFlipCard.ts      # 플립 카드
│   ├── useForm.ts          # 폼 상태
│   └── index.ts            # 훅 내보내기
├── pages/              # 페이지 컴포넌트
│   └── HomePage.tsx        # 메인 페이지
├── utils/              # 유틸리티 함수
│   └── firebase.ts         # Firebase 설정
└── App.tsx             # 메인 앱 컴포넌트
```

## 🚀 시작하기

### 필수 요구사항
- Node.js 16.0.0 이상
- npm 또는 yarn

### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone [repository-url]
   cd promotion_page
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **개발 서버 실행**
   ```bash
   npm start
   ```

4. **브라우저에서 확인**
   - [http://localhost:3000](http://localhost:3000)에서 애플리케이션 확인

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 테스트 실행
npm test
```

## 🔧 Firebase 설정

1. **Firebase 프로젝트 생성**
   - [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성

2. **Firebase 설정 파일 생성**
   ```typescript
   // src/utils/firebase.ts
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

3. **Firestore 데이터베이스 설정**
   - Firestore 데이터베이스 생성
   - 보안 규칙 설정

## 🎯 사용법

### 1. 색상 설정
- 헤더의 "색상 선택하기" 버튼 클릭
- 이미지 업로드로 자동 색상 추출 또는 수동 색상 선택
- RGB 값 직접 입력 또는 색상 팔레트 사용

### 2. 이미지 업로드
- 헤더의 "이미지 업로드" 버튼 클릭
- 드래그 앤 드롭으로 이미지 업로드
- 배경 제거 옵션 선택

### 3. 텍스트 편집
- 헤더의 "텍스트 편집" 버튼 클릭
- 폰트, 크기, 색상, 배경색, 정렬 설정
- 실시간 미리보기로 결과 확인

### 4. 강점 추가
- 강점 섹션에서 "강점 추가" 버튼 클릭
- 제목, 짧은 설명, 상세 설명 입력
- 마우스 호버로 플립 카드 효과 확인

### 5. 소셜 링크 추가
- 소셜 링크 섹션에서 "링크 추가" 버튼 클릭
- 플랫폼 선택 및 URL 입력
- 아이콘 커스터마이징 (선택사항)

## 🎨 커스터마이징

### 색상 테마 변경
```typescript
// contexts/ThemeContext.tsx에서 기본 색상 수정
const [primaryColor, setPrimaryColor] = useState<Color>({
  r: 59, g: 130, b: 246, hex: '#3b82f6'
});
```

### 새로운 소셜 플랫폼 추가
```typescript
// components/SocialLinksSection.tsx의 platformOptions 배열에 추가
{ value: 'new-platform', label: '새 플랫폼', icon: '🎯' }
```

### 커스텀 훅 추가
```typescript
// hooks/ 디렉토리에 새 훅 파일 생성
export const useCustomHook = () => {
  // 훅 로직 구현
};
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해 주세요.

---

**개발자**: [문승연] https://github.com/SeanMoon1/promotion_page 
**버전**: 0.1.0  
**최종 업데이트**: 2025년 8월 1일
