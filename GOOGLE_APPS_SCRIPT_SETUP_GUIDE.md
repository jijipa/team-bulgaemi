# Google Apps Script 이미지 업로드 기능 설정 가이드 📸

## 🎯 목표
기존 Google Apps Script에 이미지 업로드 기능을 추가합니다.

---

## 📍 Step 1: Google Apps Script 열기

1. **Google Sheets** 파일 열기 (JJFC 데이터가 있는 시트)
2. 상단 메뉴에서 **확장 프로그램** → **Apps Script** 클릭
3. 새 탭에서 Apps Script 에디터가 열립니다

---

## 📍 Step 2: 기존 코드 확인

현재 코드는 아마 이런 구조일 겁니다:

```javascript
function doGet(e) {
  const action = e.parameter.action;
  const callback = e.parameter.callback;
  
  // getMatches 액션
  if (action === "getMatches") {
    // ... 매치 데이터 불러오기 코드
  }
  
  // registerMatch 액션
  if (action === "registerMatch") {
    // ... 매치 등록 코드
  }
  
  // saveMatchScore 액션
  if (action === "saveMatchScore") {
    // ... 득점 저장 코드
  }
  
  // 기타 다른 액션들...
}
```

---

## 📍 Step 3: 새 코드 추가 위치 찾기

**마지막 `if` 블록 다음**에 추가하면 됩니다!

```javascript
function doGet(e) {
  const action = e.parameter.action;
  const callback = e.parameter.callback;
  
  // 기존 액션들...
  if (action === "getMatches") { ... }
  if (action === "registerMatch") { ... }
  if (action === "saveMatchScore") { ... }
  
  // ✅ 여기부터 새 코드를 추가하세요! ✅
  
  // ⬇️⬇️⬇️ 아래 코드를 복사해서 붙여넣기 ⬇️⬇️⬇️
  
}
```

---

## 📍 Step 4: 복사할 코드 (전체)

아래 코드를 **전체 복사**하세요:

```javascript
  // ✅ 이미지 업로드 (Google Drive)
  if (action === "uploadImage") {
    try {
      const fileName = e.parameter.fileName;
      const mimeType = e.parameter.mimeType;
      const base64Data = e.parameter.data;
      
      Logger.log("📤 이미지 업로드 시작: " + fileName);
      
      // Base64 디코딩
      const blob = Utilities.newBlob(
        Utilities.base64Decode(base64Data),
        mimeType,
        fileName
      );
      
      // Google Drive에 업로드 (루트 폴더)
      const file = DriveApp.createFile(blob);
      
      Logger.log("✅ Drive 업로드 완료: " + file.getName());
      
      // 파일 공유 설정: 링크 있는 모든 사용자가 볼 수 있도록
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      
      // 이미지 URL 생성
      const fileId = file.getId();
      const imageUrl = "https://drive.google.com/uc?export=view&id=" + fileId;
      
      Logger.log("🔗 이미지 URL: " + imageUrl);
      
      const result = {
        success: true,
        url: imageUrl,
        fileId: fileId
      };
      
      return ContentService.createTextOutput(
        callback + "(" + JSON.stringify(result) + ")"
      ).setMimeType(ContentService.MimeType.JAVASCRIPT);
      
    } catch (error) {
      Logger.log("❌ 업로드 에러: " + error.toString());
      
      const result = {
        success: false,
        message: "이미지 업로드 실패: " + error.toString()
      };
      
      return ContentService.createTextOutput(
        callback + "(" + JSON.stringify(result) + ")"
      ).setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
  }
  
  // ✅ 매치 이미지 URL 업데이트 (Google Sheets)
  if (action === "updateMatchImage") {
    try {
      const matchId = e.parameter.matchId;
      const imageUrl = e.parameter.imageUrl;
      
      Logger.log("📝 매치 이미지 업데이트: " + matchId);
      
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Matches");
      const data = sheet.getDataRange().getValues();
      
      // 헤더 행 찾기
      const headers = data[0];
      const idColIndex = headers.indexOf("id") >= 0 ? headers.indexOf("id") : headers.indexOf("경기ID");
      const imageUrlColIndex = headers.indexOf("imageUrl") >= 0 ? headers.indexOf("imageUrl") : -1;
      
      // imageUrl 컬럼이 없으면 추가
      if (imageUrlColIndex === -1) {
        sheet.getRange(1, headers.length + 1).setValue("imageUrl");
        Logger.log("✅ imageUrl 컬럼 추가됨");
      }
      
      const finalImageUrlColIndex = imageUrlColIndex >= 0 ? imageUrlColIndex : headers.length;
      
      // 매치 ID로 행 찾기
      for (let i = 1; i < data.length; i++) {
        if (data[i][idColIndex] == matchId) {
          // imageUrl 컬럼 업데이트
          sheet.getRange(i + 1, finalImageUrlColIndex + 1).setValue(imageUrl);
          
          Logger.log("✅ 이미지 URL 업데이트 완료: Row " + (i + 1));
          
          const result = {
            success: true,
            message: "이미지 URL 업데이트 완료"
          };
          
          return ContentService.createTextOutput(
            callback + "(" + JSON.stringify(result) + ")"
          ).setMimeType(ContentService.MimeType.JAVASCRIPT);
        }
      }
      
      // 매치를 찾지 못한 경우
      Logger.log("⚠️ 매치 ID를 찾을 수 없음: " + matchId);
      
      const result = {
        success: false,
        message: "매치 ID를 찾을 수 없습니다: " + matchId
      };
      
      return ContentService.createTextOutput(
        callback + "(" + JSON.stringify(result) + ")"
      ).setMimeType(ContentService.MimeType.JAVASCRIPT);
      
    } catch (error) {
      Logger.log("❌ 업데이트 에러: " + error.toString());
      
      const result = {
        success: false,
        message: "이미지 URL 업데이트 실패: " + error.toString()
      };
      
      return ContentService.createTextOutput(
        callback + "(" + JSON.stringify(result) + ")"
      ).setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
  }
```

---

## 📍 Step 5: 코드 붙여넣기

1. Apps Script 에디터로 돌아가기
2. **`doGet` 함수의 마지막 부분** (닫는 중괄호 `}` 바로 위)에 커서 놓기
3. 위에서 복사한 코드 **붙여넣기** (Ctrl+V 또는 Cmd+V)
4. **저장** 버튼 클릭 (💾 아이콘 또는 Ctrl+S)

### ✅ 완성된 코드 예시:

```javascript
function doGet(e) {
  const action = e.parameter.action;
  const callback = e.parameter.callback;
  
  // 기존 액션: getMatches
  if (action === "getMatches") {
    // ... 기존 코드
  }
  
  // 기존 액션: registerMatch
  if (action === "registerMatch") {
    // ... 기존 코드
  }
  
  // ✅ 새로 추가된 액션: uploadImage
  if (action === "uploadImage") {
    // ... 위에서 복사한 코드
  }
  
  // ✅ 새로 추가된 액션: updateMatchImage
  if (action === "updateMatchImage") {
    // ... 위에서 복사한 코드
  }
  
  // 기본 응답 (아무 액션도 매칭 안될 때)
  const defaultResult = {
    success: false,
    message: "알 수 없는 액션: " + action
  };
  
  return ContentService.createTextOutput(
    callback + "(" + JSON.stringify(defaultResult) + ")"
  ).setMimeType(ContentService.MimeType.JAVASCRIPT);
}
```

---

## 📍 Step 6: 권한 승인

코드를 저장하면 **권한 승인**이 필요합니다:

1. 상단 메뉴에서 **실행** → **doGet 함수 실행** (또는 재생 ▶️ 버튼 클릭)
2. "권한 필요" 팝업이 뜨면 **권한 검토** 클릭
3. Google 계정 선택
4. **"고급"** 클릭 → **"프로젝트 이름(안전하지 않음)으로 이동"** 클릭
5. **"허용"** 클릭

**필요한 권한:**
- ✅ Google Drive (파일 업로드)
- ✅ Google Sheets (데이터 읽기/쓰기)

---

## 📍 Step 7: 웹 앱 재배포

코드를 추가했으면 **반드시 재배포**해야 합니다!

1. 상단 오른쪽 **배포** 버튼 클릭 → **배포 관리** 선택
2. 기존 배포 옆 **연필 아이콘(✏️)** 클릭 (수정)
3. **버전**: "새 버전" 선택
4. **설명**: "이미지 업로드 기능 추가" 입력
5. **배포** 클릭
6. **완료!** (URL은 동일하게 유지됩니다)

---

## 📍 Step 8: Google Sheets 컬럼 확인

**Matches** 시트를 열고 맨 오른쪽에 `imageUrl` 컬럼이 있는지 확인하세요:

```
| id | matchDate  | opponentName | ourScore | opponentScore | imageUrl |
|----|------------|--------------|----------|---------------|----------|
| 1  | 2026-02-05 | FC United   | 3        | 1             |          |
```

**없으면 직접 추가:**
- 맨 오른쪽 빈 컬럼 헤더(A행)에 `imageUrl` 입력

또는 코드가 자동으로 추가해줍니다! (위 코드에 자동 추가 로직 포함됨)

---

## ✅ 테스트 방법

1. 앱 새로고침 (F5)
2. 매치 리스트로 이동
3. 득점이 입력된 매치의 **더보기 버튼(...)** 클릭
4. **"매치 이미지 변경"** 클릭
5. 사진 선택 → 업로드 완료!

---

## 🔍 문제 해결

### Q1: "권한이 없습니다" 에러
→ Step 6의 권한 승인을 다시 해보세요

### Q2: "업로드 실패" 에러
→ Apps Script 에디터 → 상단 메뉴 **보기** → **로그** 클릭해서 에러 메시지 확인

### Q3: 이미지가 보이지 않음
→ Google Drive에서 파일이 **"링크가 있는 모든 사용자"**로 공유되었는지 확인

### Q4: 재배포해도 안됨
→ 브라우저 캐시 삭제 또는 **시크릿 모드**에서 테스트

---

## 🎉 완료!

이제 팀원들과 매치 사진을 공유할 수 있습니다! 📸✨

혹시 막히는 부분이 있으면 **Apps Script 로그**를 확인하고 알려주세요!
