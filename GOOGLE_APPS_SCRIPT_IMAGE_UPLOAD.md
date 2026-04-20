# Google Apps Script - 이미지 업로드 기능

매치 카드 배경 이미지를 Google Drive에 업로드하고 Google Sheets에 저장하는 기능을 추가하는 방법입니다.

## 📋 Google Apps Script 코드

기존 Apps Script 파일에 아래 코드를 추가하세요:

```javascript
// 기존 doGet 함수에 추가
function doGet(e) {
  const action = e.parameter.action;
  const callback = e.parameter.callback;
  
  // 기존 액션들...
  
  // ✅ 새로 추가: 이미지 업로드
  if (action === "uploadImage") {
    try {
      const fileName = e.parameter.fileName;
      const mimeType = e.parameter.mimeType;
      const base64Data = e.parameter.data;
      
      // Base64 디코딩
      const blob = Utilities.newBlob(
        Utilities.base64Decode(base64Data),
        mimeType,
        fileName
      );
      
      // Google Drive에 업로드 (루트 폴더)
      // 특정 폴더에 업로드하려면: DriveApp.getFolderById("폴더ID").createFile(blob)
      const file = DriveApp.createFile(blob);
      
      // 파일 공유 설정: 링크 있는 모든 사용자가 볼 수 있도록
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      
      // 이미지 URL 생성
      const fileId = file.getId();
      const imageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
      
      const result = {
        success: true,
        url: imageUrl,
        fileId: fileId
      };
      
      return ContentService.createTextOutput(
        callback + "(" + JSON.stringify(result) + ")"
      ).setMimeType(ContentService.MimeType.JAVASCRIPT);
      
    } catch (error) {
      const result = {
        success: false,
        message: "이미지 업로드 실패: " + error.toString()
      };
      
      return ContentService.createTextOutput(
        callback + "(" + JSON.stringify(result) + ")"
      ).setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
  }
  
  // ✅ 새로 추가: 매치 이미지 URL 업데이트
  if (action === "updateMatchImage") {
    try {
      const matchId = e.parameter.matchId;
      const imageUrl = e.parameter.imageUrl;
      
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Matches");
      const data = sheet.getDataRange().getValues();
      
      // 헤더 행 찾기
      const headers = data[0];
      const idColIndex = headers.indexOf("id") !== -1 ? headers.indexOf("id") : 0;
      const imageUrlColIndex = headers.indexOf("imageUrl") !== -1 ? headers.indexOf("imageUrl") : 7;
      
      // 매치 ID로 행 찾기
      for (let i = 1; i < data.length; i++) {
        if (data[i][idColIndex] == matchId) {
          // imageUrl 컬럼 업데이트
          sheet.getRange(i + 1, imageUrlColIndex + 1).setValue(imageUrl);
          
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
      const result = {
        success: false,
        message: "매치 ID를 찾을 수 없습니다: " + matchId
      };
      
      return ContentService.createTextOutput(
        callback + "(" + JSON.stringify(result) + ")"
      ).setMimeType(ContentService.MimeType.JAVASCRIPT);
      
    } catch (error) {
      const result = {
        success: false,
        message: "이미지 URL 업데이트 실패: " + error.toString()
      };
      
      return ContentService.createTextOutput(
        callback + "(" + JSON.stringify(result) + ")"
      ).setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
  }
  
  // 기존 코드...
}
```

## 🔧 Google Sheets 설정

**Matches** 시트에 `imageUrl` 컬럼이 있는지 확인하세요:

| id | matchDate | opponentName | ourScore | opponentScore | imageUrl |
|----|-----------|--------------|----------|---------------|----------|
| 1  | 2026-02-05| FC United   | 3        | 1             | https://drive.google.com/uc?export=view&id=... |

## 📁 Google Drive 폴더 지정 (선택사항)

특정 폴더에 이미지를 업로드하려면:

1. Google Drive에서 폴더 생성 (예: "JJFC 매치 이미지")
2. 폴더 URL에서 ID 복사:
   ```
   https://drive.google.com/drive/folders/YOUR_FOLDER_ID_HERE
   ```
3. Apps Script 코드 수정:
   ```javascript
   // 변경 전
   const file = DriveApp.createFile(blob);
   
   // 변경 후
   const folder = DriveApp.getFolderById("YOUR_FOLDER_ID_HERE");
   const file = folder.createFile(blob);
   ```

## ✅ 배포

1. Apps Script 에디터에서 **배포 > 웹 앱으로 배포** 클릭
2. **새 배포** 클릭
3. **설명**: "이미지 업로드 기능 추가"
4. **다음 사용자로 실행**: "나"
5. **액세스 권한**: "모든 사용자"
6. **배포** 클릭
7. 새 웹 앱 URL이 생성되면 `/src/app/App.tsx`의 `GOOGLE_SCRIPT_URL`에 붙여넣기

## 🎯 사용 방법

1. 매치 리스트에서 득점이 입력된 매치의 **더보기 버튼(...)** 클릭
2. **"매치 이미지 변경"** 선택
3. 휴대폰 사진첩에서 이미지 선택
4. 자동으로 Google Drive에 업로드 후 Google Sheets에 저장됨
5. 모든 팀원이 동일한 이미지 확인 가능!

## 🔍 트러블슈팅

### 이미지가 업로드되지 않는 경우

1. **용량 확인**: 10MB 이하인지 확인
2. **권한 확인**: Apps Script에서 Drive API 권한 승인
3. **배포 확인**: 웹 앱 배포가 최신 버전인지 확인
4. **콘솔 확인**: 브라우저 개발자 도구(F12) → Console 탭에서 에러 메시지 확인

### 이미지가 보이지 않는 경우

1. Google Drive 파일 공유 설정 확인
2. 이미지 URL이 올바른 형식인지 확인:
   ```
   https://drive.google.com/uc?export=view&id=파일ID
   ```
