/**
 * ⚽ 축구 경기 관리 시스템 - Google Apps Script
 * 
 * 📊 시트 구조:
 * 1. Matches: 경기 상세 정보 (Match 데이터)
 * 2. Scores: 선수별 득점/도움 기록 (Score 데이터)
 * 3. Players: 선수 마스터 정보 (Player 데이터)
 */

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

/**
 * 🌐 GET 요청 처리 (데이터 읽기)
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    const callback = e.parameter.callback;
    
    let result;
    
    if (action === "getMatches") {
      result = getMatches();
    } else if (action === "getScores") {
      result = getScores(e.parameter.matchId);
    } else if (action === "getPlayers") {
      result = getPlayers();
    } 
    // ========== 🆕 이미지 업로드 기능 추가 ==========
    else if (action === "uploadImage") {
      result = uploadImageToDrive(e.parameter);
    } else if (action === "updateMatchImage") {
      result = updateMatchImage(e.parameter);
    }
    // ========== 이미지 업로드 기능 끝 ==========
    else {
      result = { success: false, message: "알 수 없는 action입니다." };
    }
    
    // JSONP 응답
    if (callback) {
      const jsonpResponse = callback + "(" + JSON.stringify(result) + ");";
      return ContentService.createTextOutput(jsonpResponse)
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    const errorResult = { success: false, message: error.toString() };
    
    if (e.parameter.callback) {
      const jsonpResponse = e.parameter.callback + "(" + JSON.stringify(errorResult) + ");";
      return ContentService.createTextOutput(jsonpResponse)
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    return ContentService.createTextOutput(JSON.stringify(errorResult))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 📮 POST 요청 처리 (데이터 쓰기)
 */
function doPost(e) {
  try {
    const action = e.parameter.action;
    const dataString = e.parameter.data;
    
    Logger.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    Logger.log("📥 POST 요청 받음");
    Logger.log("📥 액션: " + action);
    Logger.log("📥 데이터: " + dataString);
    Logger.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    if (action === "saveMatch") {
      const match = JSON.parse(dataString);
      return saveMatch(match);
    } 
    else if (action === "updateMatch") {
      const matchUpdate = JSON.parse(dataString);
      return updateMatch(matchUpdate);
    }
    else if (action === "saveScores") {
      const scores = JSON.parse(dataString);
      return saveScores(scores);
    }
    else if (action === "savePlayers") {
      const players = JSON.parse(dataString);
      return savePlayers(players);
    }
    else {
      return createResponse(false, "알 수 없는 action: " + action);
    }
  } catch (error) {
    Logger.log("❌ 에러 발생: " + error.toString());
    Logger.log("❌ Stack: " + error.stack);
    return createResponse(false, "에러: " + error.toString());
  }
}

/**
 * 📖 매치 데이터 읽기
 */
function getMatches() {
  const sheet = getOrCreateSheet("Matches", [
    "id", "matchType", "playerCount", "quarterCount", "quarterTime",
    "matchDate", "startTime", "endTime", "location", "locationLink",
    "opponentName", "isCompleted", "ourScore", "opponentScore", "createdAt", "imageUrl"
  ]);
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  const matches = rows.map(row => {
    const match = {};
    headers.forEach((header, index) => {
      match[header] = row[index];
    });
    return match;
  });
  
  Logger.log("✅ 매치 데이터 조회: " + matches.length + "개");
  return { success: true, message: "매치 데이터 조회 성공", matches };
}

/**
 * 📖 득점 데이터 읽기
 */
function getScores(matchId) {
  const sheet = getOrCreateSheet("Scores", [
    "id", "matchId", "playerId", "playerName", "playerNumber",
    "goals", "assists", "quarterData", "createdAt"
  ]);
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  let scores = rows.map(row => {
    const score = {};
    headers.forEach((header, index) => {
      if (header === "quarterData" && row[index]) {
        // JSON 문자열을 객체로 파싱
        try {
          score[header] = JSON.parse(row[index]);
        } catch (e) {
          score[header] = [];
        }
      } else {
        score[header] = row[index];
      }
    });
    return score;
  });
  
  // matchId 필터링
  if (matchId) {
    scores = scores.filter(s => s.matchId === matchId);
  }
  
  Logger.log("✅ 득점 데이터 조회: " + scores.length + "개");
  return { success: true, message: "득점 데이터 조회 성공", scores };
}

/**
 * 📖 선수 데이터 읽기
 */
function getPlayers() {
  const sheet = getOrCreateSheet("Players", [
    "id", "number", "name", "isMercenary", "createdAt"
  ]);
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  const players = rows.map(row => {
    const player = {};
    headers.forEach((header, index) => {
      player[header] = row[index];
    });
    return player;
  });
  
  Logger.log("✅ 선수 데이터 조회: " + players.length + "명");
  return { success: true, message: "선수 데이터 조회 성공", players };
}

/**
 * 💾 매치 저장 (완전한 정보)
 */
function saveMatch(match) {
  const sheet = getOrCreateSheet("Matches", [
    "id", "matchType", "playerCount", "quarterCount", "quarterTime",
    "matchDate", "startTime", "endTime", "location", "locationLink",
    "opponentName", "isCompleted", "ourScore", "opponentScore", "createdAt", "imageUrl"
  ]);
  
  const timestamp = new Date().toISOString();
  
  Logger.log("💾 매치 저장 시작");
  Logger.log("  - ID: " + match.id);
  Logger.log("  - 날짜: " + match.matchDate);
  Logger.log("  - 상대팀: " + match.opponentName);
  Logger.log("  - 장소: " + match.location);
  
  sheet.appendRow([
    match.id || "",
    match.matchType || "soccer",
    match.playerCount || "",
    match.quarterCount || "",
    match.quarterTime || "",
    match.matchDate || "",
    match.startTime || "",
    match.endTime || "",
    match.location || "",
    match.locationLink || "",
    match.opponentName || "",
    match.isCompleted || false,
    match.ourScore || 0,
    match.opponentScore || 0,
    match.createdAt || timestamp,
    match.imageUrl || ""
  ]);
  
  Logger.log("✅ 매치 저장 완료");
  return createResponse(true, "매치가 저장되었습니다.");
}

/**
 * 🔄 매치 업데이트 (스코어, 완료 상태)
 */
function updateMatch(matchUpdate) {
  const sheet = getOrCreateSheet("Matches", [
    "id", "matchType", "playerCount", "quarterCount", "quarterTime",
    "matchDate", "startTime", "endTime", "location", "locationLink",
    "opponentName", "isCompleted", "ourScore", "opponentScore", "createdAt", "imageUrl"
  ]);
  
  Logger.log("🔄 매치 업데이트 시작");
  Logger.log("  - 매치 ID: " + matchUpdate.matchId);
  Logger.log("  - 우리팀: " + matchUpdate.ourScore);
  Logger.log("  - 상대팀: " + matchUpdate.opponentScore);
  
  const data = sheet.getDataRange().getValues();
  let found = false;
  
  // ID로 매치 찾기 (첫 번째 컬럼)
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === matchUpdate.matchId) {
      // isCompleted (12번째 컬럼), ourScore (13번째), opponentScore (14번째)
      if (matchUpdate.isCompleted !== undefined) {
        sheet.getRange(i + 1, 12).setValue(matchUpdate.isCompleted);
      }
      if (matchUpdate.ourScore !== undefined) {
        sheet.getRange(i + 1, 13).setValue(matchUpdate.ourScore);
      }
      if (matchUpdate.opponentScore !== undefined) {
        sheet.getRange(i + 1, 14).setValue(matchUpdate.opponentScore);
      }
      found = true;
      Logger.log("✅ 매치 업데이트 완료 (행: " + (i + 1) + ")");
      break;
    }
  }
  
  if (!found) {
    Logger.log("⚠️ 매치를 찾을 수 없음: " + matchUpdate.matchId);
    return createResponse(false, "매치를 찾을 수 없습니다.");
  }
  
  return createResponse(true, "매치가 업데이트되었습니다.");
}

/**
 * 💾 득점 데이터 저장
 */
function saveScores(scores) {
  const sheet = getOrCreateSheet("Scores", [
    "id", "matchId", "playerId", "playerName", "playerNumber",
    "goals", "assists", "quarterData", "createdAt"
  ]);
  
  const timestamp = new Date().toISOString();
  
  Logger.log("💾 득점 데이터 저장 시작: " + scores.length + "명");
  
  scores.forEach(score => {
    Logger.log("  - " + score.playerName + " (번호: " + score.playerNumber + ")");
    Logger.log("    골: " + score.goals + ", 도움: " + score.assists);
    
    // quarterData를 JSON 문자열로 변환
    const quarterDataStr = score.quarterData ? JSON.stringify(score.quarterData) : "";
    
    sheet.appendRow([
      score.id || "",
      score.matchId || "",
      score.playerId || "",
      score.playerName || "",
      score.playerNumber || "",
      score.goals || 0,
      score.assists || 0,
      quarterDataStr,
      timestamp
    ]);
  });
  
  Logger.log("✅ 득점 데이터 저장 완료");
  return createResponse(true, "득점 데이터가 저장되었습니다.");
}

/**
 * 💾 선수 데이터 저장 (중복 체크)
 */
function savePlayers(players) {
  const sheet = getOrCreateSheet("Players", [
    "id", "number", "name", "isMercenary", "createdAt"
  ]);
  
  const timestamp = new Date().toISOString();
  
  Logger.log("💾 선수 데이터 저장 시작: " + players.length + "명");
  
  const data = sheet.getDataRange().getValues();
  const existingIds = data.slice(1).map(row => row[0]); // 기존 ID 목록
  
  players.forEach(player => {
    // 중복 체크
    if (existingIds.includes(player.id)) {
      Logger.log("  - " + player.name + " (이미 존재, 스킵)");
      return;
    }
    
    Logger.log("  - " + player.name + " (번호: " + player.number + ") 추가");
    
    sheet.appendRow([
      player.id || "",
      player.number || "",
      player.name || "",
      player.isMercenary || false,
      player.createdAt || timestamp
    ]);
  });
  
  Logger.log("✅ 선수 데이터 저장 완료");
  return createResponse(true, "선수 데이터가 저장되었습니다.");
}

// ========== 🆕 이미지 업로드 기능 ==========

// 청크 데이터를 임시로 저장할 캐시
var uploadCache = {};

/**
 * 📸 이미지를 Google Drive에 업로드 (청크 방식)
 */
function uploadImageToDrive(params) {
  try {
    const fileName = params.fileName;
    const mimeType = params.mimeType;
    const totalChunks = parseInt(params.totalChunks || "1");
    const chunk = parseInt(params.chunk || "0");
    const base64Data = params.data;
    
    Logger.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    Logger.log("📤 이미지 업로드 (청크 " + (chunk + 1) + "/" + totalChunks + ")");
    Logger.log("  - 파일명: " + fileName);
    Logger.log("  - 타입: " + mimeType);
    Logger.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    // 단일 청크인 경우
    if (totalChunks === 1) {
      const blob = Utilities.newBlob(
        Utilities.base64Decode(base64Data),
        mimeType,
        fileName
      );
      
      const file = DriveApp.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      
      const fileId = file.getId();
      const imageUrl = "https://drive.google.com/uc?export=view&id=" + fileId;
      
      Logger.log("✅ 단일 청크 업로드 완료");
      Logger.log("🔗 이미지 URL: " + imageUrl);
      
      const result = {
        success: true,
        url: imageUrl,
        fileId: fileId
      };
      
      return ContentService.createTextOutput(
        params.callback + "(" + JSON.stringify(result) + ")"
      ).setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    // 다중 청크 업로드 시작
    const uploadId = Utilities.getUuid();
    uploadCache[uploadId] = {
      fileName: fileName,
      mimeType: mimeType,
      totalChunks: totalChunks,
      chunks: [base64Data],
      timestamp: new Date()
    };
    
    Logger.log("✅ 첫 번째 청크 저장 완료");
    Logger.log("🆔 Upload ID: " + uploadId);
    
    const result = {
      success: true,
      uploadId: uploadId,
      message: "첫 번째 청크 업로드 완료"
    };
    
    return ContentService.createTextOutput(
      params.callback + "(" + JSON.stringify(result) + ")"
    ).setMimeType(ContentService.MimeType.JAVASCRIPT);
    
  } catch (error) {
    Logger.log("❌ 이미지 업로드 에러: " + error.toString());
    
    const result = {
      success: false,
      message: "이미지 업로드 실패: " + error.toString()
    };
    
    return ContentService.createTextOutput(
      params.callback + "(" + JSON.stringify(result) + ")"
    ).setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
}

/**
 * 📦 청크 추가 업로드
 */
function uploadChunk(params) {
  try {
    const uploadId = params.uploadId;
    const chunk = parseInt(params.chunk);
    const base64Data = params.data;
    
    Logger.log("📦 청크 " + (chunk + 1) + " 수신 (Upload ID: " + uploadId + ")");
    
    if (!uploadCache[uploadId]) {
      throw new Error("Upload ID를 찾을 수 없습니다: " + uploadId);
    }
    
    uploadCache[uploadId].chunks[chunk] = base64Data;
    
    Logger.log("✅ 청크 저장 완료");
    
    const result = {
      success: true,
      message: "청크 업로드 완료"
    };
    
    return ContentService.createTextOutput(
      params.callback + "(" + JSON.stringify(result) + ")"
    ).setMimeType(ContentService.MimeType.JAVASCRIPT);
    
  } catch (error) {
    Logger.log("❌ 청크 업로드 에러: " + error.toString());
    
    const result = {
      success: false,
      message: "청크 업로드 실패: " + error.toString()
    };
    
    return ContentService.createTextOutput(
      params.callback + "(" + JSON.stringify(result) + ")"
    ).setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
}

/**
 * ✅ 업로드 완료 처리
 */
function finalizeUpload(params) {
  try {
    const uploadId = params.uploadId;
    
    Logger.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    Logger.log("✅ 업로드 완료 처리 시작");
    Logger.log("🆔 Upload ID: " + uploadId);
    
    if (!uploadCache[uploadId]) {
      throw new Error("Upload ID를 찾을 수 없습니다: " + uploadId);
    }
    
    const uploadData = uploadCache[uploadId];
    const completeBase64 = uploadData.chunks.join("");
    
    Logger.log("📦 총 청크 수: " + uploadData.totalChunks);
    Logger.log("📏 전체 Base64 길이: " + completeBase64.length);
    
    // Base64 디코딩 및 파일 생성
    const blob = Utilities.newBlob(
      Utilities.base64Decode(completeBase64),
      uploadData.mimeType,
      uploadData.fileName
    );
    
    Logger.log("✅ Blob 생성 완료");
    
    // Google Drive에 업로드
    const file = DriveApp.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    const fileId = file.getId();
    const imageUrl = "https://drive.google.com/uc?export=view&id=" + fileId;
    
    // 캐시 정리
    delete uploadCache[uploadId];
    
    Logger.log("✅ Drive 업로드 완료");
    Logger.log("🔗 이미지 URL: " + imageUrl);
    Logger.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    const result = {
      success: true,
      url: imageUrl,
      fileId: fileId
    };
    
    return ContentService.createTextOutput(
      params.callback + "(" + JSON.stringify(result) + ")"
    ).setMimeType(ContentService.MimeType.JAVASCRIPT);
    
  } catch (error) {
    Logger.log("❌ 업로드 완료 처리 에러: " + error.toString());
    
    // 캐시 정리
    if (params.uploadId && uploadCache[params.uploadId]) {
      delete uploadCache[params.uploadId];
    }
    
    const result = {
      success: false,
      message: "업로드 완료 처리 실패: " + error.toString()
    };
    
    return ContentService.createTextOutput(
      params.callback + "(" + JSON.stringify(result) + ")"
    ).setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
}

/**
 * 🔄 매치 이미지 URL 업데이트
 */
function updateMatchImage(params) {
  try {
    const matchId = params.matchId;
    const imageUrl = params.imageUrl;
    
    Logger.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    Logger.log("📝 매치 이미지 URL 업데이트");
    Logger.log("  - 매치 ID: " + matchId);
    Logger.log("  - 이미지 URL: " + imageUrl);
    Logger.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    const sheet = getOrCreateSheet("Matches", [
      "id", "matchType", "playerCount", "quarterCount", "quarterTime",
      "matchDate", "startTime", "endTime", "location", "locationLink",
      "opponentName", "isCompleted", "ourScore", "opponentScore", "createdAt", "imageUrl"
    ]);
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // imageUrl 컬럼 인덱스 찾기
    let imageUrlColIndex = headers.indexOf("imageUrl");
    
    // imageUrl 컬럼이 없으면 추가
    if (imageUrlColIndex === -1) {
      Logger.log("⚠️ imageUrl 컬럼이 없음 - 새로 추가");
      sheet.getRange(1, headers.length + 1).setValue("imageUrl");
      imageUrlColIndex = headers.length;
    }
    
    // ID 컬럼 인덱스
    const idColIndex = headers.indexOf("id");
    
    // 매치 ID로 행 찾기
    let found = false;
    for (let i = 1; i < data.length; i++) {
      if (data[i][idColIndex] == matchId) {
        // imageUrl 업데이트
        sheet.getRange(i + 1, imageUrlColIndex + 1).setValue(imageUrl);
        
        Logger.log("✅ 이미지 URL 업데이트 완료 (행: " + (i + 1) + ")");
        Logger.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        
        found = true;
        break;
      }
    }
    
    if (!found) {
      Logger.log("⚠️ 매치 ID를 찾을 수 없음: " + matchId);
      Logger.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      
      return {
        success: false,
        message: "매치 ID를 찾을 수 없습니다: " + matchId
      };
    }
    
    return {
      success: true,
      message: "이미지 URL 업데이트 완료"
    };
    
  } catch (error) {
    Logger.log("❌ 이미지 URL 업데이트 에러: " + error.toString());
    Logger.log("❌ Stack: " + error.stack);
    Logger.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    return {
      success: false,
      message: "이미지 URL 업데이트 실패: " + error.toString()
    };
  }
}

// ========== 이미지 업로드 기능 끝 ==========

/**
 * 🛠️ 시트 가져오기 또는 생성
 */
function getOrCreateSheet(sheetName, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    Logger.log("📄 새 시트 생성: " + sheetName);
  }
  
  return sheet;
}

/**
 * 📤 JSON 응답 생성
 */
function createResponse(success, message, data = null) {
  const response = {
    success: success,
    message: message
  };
  
  if (data) {
    response.data = data;
  }
  
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}