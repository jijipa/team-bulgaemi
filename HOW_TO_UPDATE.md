# 🚀 Google Apps Script 업데이트 방법

## ✅ 준비된 파일
`/UPDATED_GOOGLE_APPS_SCRIPT.js` 파일에 **이미지 업로드 기능이 모두 추가**되었습니다!

---

## 📋 업데이트 단계 (2분 완성!)

### 1️⃣ 파일 열기
- 프로젝트에서 `/UPDATED_GOOGLE_APPS_SCRIPT.js` 파일 열기
- **전체 선택** (Ctrl+A 또는 Cmd+A)
- **복사** (Ctrl+C 또는 Cmd+C)

### 2️⃣ Apps Script 열기
- Google Sheets → **확장 프로그램** → **Apps Script**

### 3️⃣ 코드 교체
- Apps Script 에디터에서 **기존 코드 전체 선택** (Ctrl+A)
- **붙여넣기** (Ctrl+V) - 복사한 새 코드로 덮어쓰기
- **저장** (💾 아이콘 또는 Ctrl+S)

### 4️⃣ 권한 승인 (처음만)
- 상단 **실행** → **doGet** 선택 후 ▶️ 클릭
- "권한 필요" 팝업 → **권한 검토**
- **고급** → **"프로젝트로 이동"** → **허용**

### 5️⃣ 재배포
- **배포** → **배포 관리**
- 기존 배포 옆 **✏️ (수정)** 클릭
- **버전**: "새 버전" 선택
- **설명**: "이미지 업로드 기능 추가"
- **배포** 클릭

### 6️⃣ 완료!
- 앱 새로고침 (F5)
- 매치 리스트 → 더보기(...) → **매치 이미지 변경** 테스트!

---

## 🎯 추가된 기능

### 1. `uploadImage` 액션
- 이미지를 Google Drive에 업로드
- 공개 링크 자동 생성
- Base64 데이터를 받아서 처리

### 2. `updateMatchImage` 액션
- Matches 시트에 imageUrl 업데이트
- imageUrl 컬럼이 없으면 자동 생성

### 3. Matches 시트 업데이트
- 기존 컬럼 + `imageUrl` 컬럼 추가됨
- 기존 데이터는 영향 없음

---

## 🔍 변경 사항 요약

### ✅ doGet 함수
```javascript
// 기존
if (action === "getMatches") { ... }
else if (action === "getScores") { ... }
else if (action === "getPlayers") { ... }

// ➕ 추가됨
else if (action === "uploadImage") {
  result = uploadImageToDrive(e.parameter);
}
else if (action === "updateMatchImage") {
  result = updateMatchImage(e.parameter);
}
```

### ✅ 새 함수 2개 추가
1. `uploadImageToDrive()` - Drive 업로드 처리
2. `updateMatchImage()` - Sheets 업데이트

### ✅ Matches 시트 헤더
```javascript
// 기존 (14개 컬럼)
["id", "matchType", ..., "createdAt"]

// 변경 (15개 컬럼)
["id", "matchType", ..., "createdAt", "imageUrl"]
```

---

## 🆘 문제 해결

### Q: "권한이 없습니다" 에러
→ 4단계의 권한 승인을 다시 진행하세요

### Q: "업로드 실패" 에러
→ Apps Script → **보기** → **로그** 확인

### Q: 이미지가 보이지 않음
→ Google Sheets에서 imageUrl 컬럼 값 확인

### Q: 재배포해도 변경 안됨
→ 브라우저 캐시 삭제 (Ctrl+Shift+Delete) 또는 시크릿 모드 테스트

---

## ✨ 완료!

이제 팀원들과 매치 사진을 공유할 수 있습니다! 📸

문제가 있으면 Apps Script 로그를 확인하고 알려주세요!
