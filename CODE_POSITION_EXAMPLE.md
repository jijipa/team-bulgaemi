# 📍 코드 추가 위치 (Before & After)

## ❌ BEFORE (기존 코드)

```javascript
function doGet(e) {
  const action = e.parameter.action;
  const callback = e.parameter.callback;
  
  // ========== 기존 액션 1 ==========
  if (action === "getMatches") {
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Matches");
      const data = sheet.getDataRange().getValues();
      
      const result = { success: true, matches: [...] };
      return ContentService.createTextOutput(
        callback + "(" + JSON.stringify(result) + ")"
      ).setMimeType(ContentService.MimeType.JAVASCRIPT);
    } catch (error) {
      const result = { success: false, message: error.toString() };
      return ContentService.createTextOutput(
        callback + "(" + JSON.stringify(result) + ")"
      ).setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
  }
  
  // ========== 기존 액션 2 ==========
  if (action === "registerMatch") {
    try {
      // ... 매치 등록 코드
    } catch (error) {
      // ... 에러 처리
    }
  }
  
  // ========== 기존 액션 3 ==========
  if (action === "saveMatchScore") {
    try {
      // ... 득점 저장 코드
    } catch (error) {
      // ... 에러 처리
    }
  }
  
  // ⬆️⬆️⬆️ 여기까지 기존 코드 ⬆️⬆️⬆️
  
  // 기본 응답
  const defaultResult = { success: false, message: "Unknown action" };
  return ContentService.createTextOutput(
    callback + "(" + JSON.stringify(defaultResult) + ")"
  ).setMimeType(ContentService.MimeType.JAVASCRIPT);
}
```

---

## ✅ AFTER (코드 추가 후)

```javascript
function doGet(e) {
  const action = e.parameter.action;
  const callback = e.parameter.callback;
  
  // ========== 기존 액션 1 ==========
  if (action === "getMatches") {
    // ... 기존 코드 그대로 유지
  }
  
  // ========== 기존 액션 2 ==========
  if (action === "registerMatch") {
    // ... 기존 코드 그대로 유지
  }
  
  // ========== 기존 액션 3 ==========
  if (action === "saveMatchScore") {
    // ... 기존 코드 그대로 유지
  }
  
  // ⬇️⬇️⬇️ 여기부터 새 코드 추가! ⬇️⬇️⬇️
  
  // ========== 🆕 새 액션 1: 이미지 업로드 ==========
  if (action === "uploadImage") {
    try {
      const fileName = e.parameter.fileName;
      const mimeType = e.parameter.mimeType;
      const base64Data = e.parameter.data;
      
      const blob = Utilities.newBlob(
        Utilities.base64Decode(base64Data),
        mimeType,
        fileName
      );
      
      const file = DriveApp.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      
      const fileId = file.getId();
      const imageUrl = "https://drive.google.com/uc?export=view&id=" + fileId;
      
      const result = { success: true, url: imageUrl, fileId: fileId };
      
      return ContentService.createTextOutput(
        callback + "(" + JSON.stringify(result) + ")"
      ).setMimeType(ContentService.MimeType.JAVASCRIPT);
      
    } catch (error) {
      const result = { success: false, message: "업로드 실패: " + error.toString() };
      return ContentService.createTextOutput(
        callback + "(" + JSON.stringify(result) + ")"
      ).setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
  }
  
  // ========== 🆕 새 액션 2: 이미지 URL 업데이트 ==========
  if (action === "updateMatchImage") {
    try {
      const matchId = e.parameter.matchId;
      const imageUrl = e.parameter.imageUrl;
      
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Matches");
      const data = sheet.getDataRange().getValues();
      
      const headers = data[0];
      const idColIndex = headers.indexOf("id") >= 0 ? headers.indexOf("id") : headers.indexOf("경기ID");
      let imageUrlColIndex = headers.indexOf("imageUrl");
      
      if (imageUrlColIndex === -1) {
        sheet.getRange(1, headers.length + 1).setValue("imageUrl");
        imageUrlColIndex = headers.length;
      }
      
      for (let i = 1; i < data.length; i++) {
        if (data[i][idColIndex] == matchId) {
          sheet.getRange(i + 1, imageUrlColIndex + 1).setValue(imageUrl);
          
          const result = { success: true, message: "업데이트 완료" };
          return ContentService.createTextOutput(
            callback + "(" + JSON.stringify(result) + ")"
          ).setMimeType(ContentService.MimeType.JAVASCRIPT);
        }
      }
      
      const result = { success: false, message: "매치 ID를 찾을 수 없음" };
      return ContentService.createTextOutput(
        callback + "(" + JSON.stringify(result) + ")"
      ).setMimeType(ContentService.MimeType.JAVASCRIPT);
      
    } catch (error) {
      const result = { success: false, message: "업데이트 실패: " + error.toString() };
      return ContentService.createTextOutput(
        callback + "(" + JSON.stringify(result) + ")"
      ).setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
  }
  
  // ⬆️⬆️⬆️ 여기까지 새 코드 추가! ⬆️⬆️⬆️
  
  // 기본 응답 (변경 없음)
  const defaultResult = { success: false, message: "Unknown action" };
  return ContentService.createTextOutput(
    callback + "(" + JSON.stringify(defaultResult) + ")"
  ).setMimeType(ContentService.MimeType.JAVASCRIPT);
}
```

---

## 🎯 핵심 포인트

### ✅ DO (이렇게 하세요!)

1. **기존 코드는 절대 건드리지 마세요!**
2. **마지막 `if` 블록 다음**에 새 코드 추가
3. **`doGet` 함수 안**에 추가 (함수 밖에 추가하면 안됨!)
4. **들여쓰기**를 기존 코드와 맞추세요

### ❌ DON'T (이러면 안됩니다!)

1. ❌ 기존 `if` 블록 안에 추가
2. ❌ `function doGet(e) { }` 밖에 추가
3. ❌ 기존 코드 삭제하거나 수정
4. ❌ 닫는 중괄호 `}` 개수가 안 맞음

---

## 🔍 체크리스트

코드 추가 후 확인하세요:

- [ ] 기존 액션들은 그대로 있나요?
- [ ] `uploadImage` 액션이 추가되었나요?
- [ ] `updateMatchImage` 액션이 추가되었나요?
- [ ] 모든 중괄호 `{ }`가 짝이 맞나요?
- [ ] 저장했나요? (💾)
- [ ] 재배포했나요?

---

## 💡 Tip: 중괄호 짝 확인하기

Apps Script 에디터에서:
- 중괄호 `{` 클릭 → 짝이 되는 `}`가 하이라이트됨
- 모든 `{`에 대응하는 `}`가 있어야 함!

---

## 🆘 도움이 필요하면

1. 전체 코드를 복사해서 보내주세요
2. 에러 메시지 캡처
3. Apps Script 로그 확인 (**보기** → **로그**)
