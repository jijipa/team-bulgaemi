# ⚡ 빠른 설정 가이드 (3분 완성!)

## 🎯 할 일: Google Apps Script에 코드 2개 추가하기

---

## 1️⃣ Apps Script 열기

Google Sheets → **확장 프로그램** → **Apps Script**

---

## 2️⃣ 코드 찾기

`doGet` 함수를 찾으세요. 이렇게 생겼을 겁니다:

```javascript
function doGet(e) {
  const action = e.parameter.action;
  const callback = e.parameter.callback;
  
  if (action === "getMatches") { ... }
  if (action === "registerMatch") { ... }
  // ... 기타 코드들
  
} // ← 이 닫는 중괄호 바로 위에 추가!
```

---

## 3️⃣ 코드 추가

**마지막 `}` 바로 위**에 아래 코드 복사 & 붙여넣기:

```javascript
  // ========== 이미지 업로드 기능 시작 ==========
  
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
  
  // ========== 이미지 업로드 기능 끝 ==========
```

---

## 4️⃣ 저장 & 재배포

1. **저장** (💾 아이콘)
2. **배포** → **배포 관리** → ✏️ 수정
3. **버전**: "새 버전" 선택
4. **설명**: "이미지 업로드 추가"
5. **배포** 클릭

---

## 5️⃣ 권한 승인 (처음만)

- "권한 필요" 뜨면 → **권한 검토**
- **고급** → **"프로젝트로 이동"** → **허용**

---

## ✅ 완료!

앱 새로고침하고 매치 리스트에서 **더보기(...) → 매치 이미지 변경** 테스트!

---

## 🆘 에러 해결

**업로드 안됨?**
→ Apps Script 에디터 → **보기** → **로그** 확인

**이미지 안보임?**
→ Sheets에 `imageUrl` 컬럼 있는지 확인

**재배포해도 안됨?**
→ 브라우저 캐시 삭제 (Ctrl+Shift+Delete)
