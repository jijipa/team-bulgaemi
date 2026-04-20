# 🔧 이미지 업로드 에러 수정

## ❌ 발생한 문제

1. **OKLCH 색상 파싱 에러**: 이미지 처리 중 OKLCH 색상 함수를 파싱할 수 없음
2. **JSONP 요청 실패**: URL이 너무 길어서 GET 요청 실패 (Base64 이미지 데이터가 URL 파라미터로 전송됨)

## ✅ 해결 방법

### 1단계: Google Apps Script 업데이트

`/UPDATED_GOOGLE_APPS_SCRIPT_V2.js` 파일의 내용을 복사하여 Google Apps Script에 붙여넣기:

1. Google Sheets → **확장 프로그램** → **Apps Script**
2. 기존 코드를 **모두 삭제**
3. `/UPDATED_GOOGLE_APPS_SCRIPT_V2.js` 내용을 **붙여넣기**
4. **저장** (Ctrl+S)

### 2단계: 재배포

1. **배포** → **배포 관리**
2. 기존 배포의 **✏️ (수정)** 클릭
3. **버전**: "새 버전" 선택
4. **설명**: "이미지 업로드 POST 방식으로 변경"
5. **배포** 클릭

### 3단계: 앱 새로고침

- 브라우저에서 **Ctrl+Shift+R** (강력 새로고침)

## 🎯 주요 변경사항

### Google Apps Script

**변경 전:**
- GET 요청으로 Base64 데이터를 URL 파라미터로 전송
- URL 길이 제한으로 인한 실패

**변경 후:**
- POST 요청으로 Base64 데이터를 본문에 전송
- `UploadCache` 시트에 업로드 결과 저장
- GET 요청으로 업로드 결과 조회

### 프론트엔드 (`googleDrive.ts`)

**변경 전:**
- JSONP로 Base64 데이터를 청크로 분할하여 GET 요청
- URL 길이 제한 문제

**변경 후:**
- FormData로 POST 요청
- JSONP로 업로드 결과 조회
- 이미지 압축 품질 향상 (0.8 → 0.85)
- 최대 이미지 크기 증가 (1024 → 1280)

## 🗂️ 새로운 시트 구조

### UploadCache 시트 (자동 생성)

| fileName | imageUrl | timestamp |
|----------|----------|-----------|
| match-123.jpg | https://drive.google.com/... | 2025-01-14T... |

이 시트는 업로드 결과를 임시 저장하는 캐시로 사용됩니다.

## 📝 참고사항

- **no-cors 모드**: Google Apps Script는 CORS를 지원하지 않으므로 `mode: 'no-cors'`를 사용합니다
- **결과 조회**: POST 요청 후 별도의 GET 요청으로 업로드 결과를 확인합니다
- **캐시 정리**: UploadCache 시트는 주기적으로 정리하는 것을 권장합니다

## 🧪 테스트

1. 매치 리스트 → **더보기(...)**
2. **매치 이미지 변경** 클릭
3. 이미지 선택
4. 업로드 진행 확인
5. 성공 메시지 확인

## ⚠️ 문제 해결

### 여전히 에러가 발생하는 경우

1. **Google Apps Script 로그 확인**:
   - Apps Script 에디터 → **보기** → **로그**
   - 에러 메시지 확인

2. **브라우저 콘솔 확인** (F12):
   - Console 탭에서 에러 메시지 확인

3. **권한 재승인**:
   - Apps Script에서 **doGet** 함수 실행
   - 권한 재승인

4. **캐시 삭제**:
   - 브라우저 캐시 삭제 (Ctrl+Shift+Delete)
   - 시크릿 모드로 테스트
