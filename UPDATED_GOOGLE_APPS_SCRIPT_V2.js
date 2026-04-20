/**
 * ⚽ 축구 경기 관리 시스템 - Google Apps Script (V2 - POST 지원)
 * 
 * 📊 시트 구조:
 * 1. Matches: 경기 상세 정보 (Match 데이터)
 * 2. Scores: 선수별 득점/도움 기록 (Score 데이터)
 * 3. Players: 선수 마스터 정보 (Player 데이터)
 * 4. UploadCache: 이미지 업로드 결과 임시 저장
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
    // ========== 이미지 업로드 결과 조회 ==========
    else if (action === "getUploadResult") {
      result = getUploadResult(e.parameter.fileName);
    }
    // ========== 청크 업로드 처리 ==========
    else if (action === "uploadChunk") {
      result = uploadChunk(e.parameter);
    }
    else if (action === "finalizeUpload") {
      result = finalizeUpload(e.parameter);
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
    // POST body에서 파라미터 읽기
    const params = e.parameter || {};
    const postData = e.postData;
    
    Logger.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    Logger.log("📥 POST 요청 받음");
    Logger.log("📥 Content-Type: " + (postData ? postData.type : "없음"));
    Logger.log("📥 파라미터 키: " + Object.keys(params).join(", "));
    Logger.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    const action = params.action;
    
    if (action === "saveMatch") {
      const dataString = params.data;
      const match = JSON.parse(dataString);
      return saveMatch(match);
    } 
    else if (action === "updateMatch") {
      const dataString = params.data;
      const matchUpdate = JSON.parse(dataString);
      return updateMatch(matchUpdate);
    }
    else if (action === "saveScores") {
      const dataString = params.data;
      const scores = JSON.parse(dataString);
      return saveScores(scores);
    }
    else if (action === "savePlayers") {
      const dataString = params.data;
      const players = JSON.parse(dataString);
      return savePlayers(players);
    }
    // ========== 이미지 업로드 처리 ==========
    else if (action === "uploadImage") {
      Logger.log("🖼️ 이미지 업로드 액션 감지");
      Logger.log("  - fileName: " + params.fileName);
      Logger.log("  - mimeType: " + params.mimeType);
      Logger.log("  - data 길이: " + (params.data ? params.data.length : 0));
      return uploadImageToDrive(params);
    }
    // ========== 이미지 업로드 끝 ==========
    else {
      Logger.log("⚠️ 알 수 없는 액션: " + action);
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
 * 🔄 매치 업데이트 (스코어, 완료 상태, 이미지 URL)
 */
function updateMatch(matchUpdate) {
  const sheet = getOrCreateSheet("Matches", [
    "id", "matchType", "playerCount", "quarterCount", "quarterTime",
    "matchDate", "startTime", "endTime", "location", "locationLink",
    "opponentName", "isCompleted", "ourScore", "opponentScore", "createdAt", "imageUrl"
  ]);
  
  Logger.log("🔄 매치 업데이트 시작");
  Logger.log("  - 매치 ID: " + matchUpdate.matchId);
  
  const data = sheet.getDataRange().getValues();
  let found = false;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === matchUpdate.matchId) {
      if (matchUpdate.isCompleted !== undefined) {
        sheet.getRange(i + 1, 12).setValue(matchUpdate.isCompleted);
      }
      if (matchUpdate.ourScore !== undefined) {
        sheet.getRange(i + 1, 13).setValue(matchUpdate.ourScore);
      }
      if (matchUpdate.opponentScore !== undefined) {
        sheet.getRange(i + 1, 14).setValue(matchUpdate.opponentScore);
      }
      if (matchUpdate.imageUrl !== undefined) {
        sheet.getRange(i + 1, 16).setValue(matchUpdate.imageUrl);
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
  const existingIds = data.slice(1).map(row => row[0]);
  
  players.forEach(player => {
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

// ========== 이미지 업로드 기능 ==========

/**
 * 📁 전용 폴더 가져오기 또는 생성
 */
function getOrCreateImageFolder() {
  const folderName = "⚽ 축구 경기 이미지";
  
  // 기존 폴더 찾기
  const folders = DriveApp.getFoldersByName(folderName);
  
  if (folders.hasNext()) {
    const folder = folders.next();
    Logger.log("📁 기존 폴더 사용: " + folderName + " (ID: " + folder.getId() + ")");
    return folder;
  } else {
    // 새 폴더 생성
    const newFolder = DriveApp.createFolder(folderName);
    Logger.log("📁 새 폴더 생성: " + folderName + " (ID: " + newFolder.getId() + ")");
    return newFolder;
  }
}

/**
 * 📸 이미지를 Google Drive에 업로드 (POST 방식)
 */
function uploadImageToDrive(params) {
  try {
    const fileName = params.fileName;
    const mimeType = params.mimeType;
    const base64Data = params.data;
    
    Logger.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    Logger.log("📤 이미지 업로드 시작");
    Logger.log("  - 파일명: " + fileName);
    Logger.log("  - 타입: " + mimeType);
    Logger.log("  - 데이터 길이: " + (base64Data ? base64Data.length : 0));
    Logger.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    // 전용 폴더 가져오기
    const folder = getOrCreateImageFolder();
    
    // Base64 디코딩
    const blob = Utilities.newBlob(
      Utilities.base64Decode(base64Data),
      mimeType,
      fileName
    );
    
    Logger.log("✅ Base64 디코딩 완료");
    
    // 전용 폴더에 파일 생성
    const file = folder.createFile(blob);
    
    Logger.log("✅ Drive 업로드 완료: " + file.getName());
    Logger.log("📁 저장 위치: " + folder.getName());
    
    // 파일 공유 설정
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    Logger.log("✅ 공유 설정 완료");
    
    // 이미지 URL 생성
    const fileId = file.getId();
    const imageUrl = "https://drive.google.com/uc?export=view&id=" + fileId;
    
    Logger.log("✅ 이미지 URL 생성: " + imageUrl);
    Logger.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    // 캐시에 결과 저장
    saveUploadResult(fileName, imageUrl);
    
    return createResponse(true, "이미지 업로드 성공", {
      url: imageUrl,
      fileId: fileId
    });
    
  } catch (error) {
    Logger.log("❌ 이미지 업로드 에러: " + error.toString());
    Logger.log("❌ Stack: " + error.stack);
    
    return createResponse(false, "이미지 업로드 실패: " + error.toString());
  }
}

/**
 * 💾 업로드 결과 저장
 */
function saveUploadResult(fileName, imageUrl) {
  const sheet = getOrCreateSheet("UploadCache", [
    "fileName", "imageUrl", "timestamp"
  ]);
  
  const timestamp = new Date().toISOString();
  
  sheet.appendRow([
    fileName,
    imageUrl,
    timestamp
  ]);
  
  Logger.log("💾 업로드 결과 캐시 저장 완료");
}

/**
 * 📖 업로드 결과 조회
 */
function getUploadResult(fileName) {
  const sheet = getOrCreateSheet("UploadCache", [
    "fileName", "imageUrl", "timestamp"
  ]);
  
  const data = sheet.getDataRange().getValues();
  
  // 최근 결과 찾기 (역순 검색)
  for (let i = data.length - 1; i > 0; i--) {
    if (data[i][0] === fileName) {
      Logger.log("✅ 업로드 결과 찾음: " + data[i][1]);
      
      return {
        success: true,
        url: data[i][1],
        message: "업로드 결과 조회 성공"
      };
    }
  }
  
  Logger.log("⚠️ 업로드 결과를 찾을 수 없음: " + fileName);
  
  return {
    success: false,
    message: "업로드 결과를 찾을 수 없습니다."
  };
}

// ========== 청크 업로드 처리 ==========

/**
 * 📦 청크 데이터 저장
 */
function uploadChunk(params) {
  try {
    const uploadId = params.uploadId;
    const chunkIndex = parseInt(params.chunkIndex, 10);
    const totalChunks = parseInt(params.totalChunks, 10);
    const chunkData = params.data;
    
    Logger.log("📦 청크 저장: " + uploadId + " [" + chunkIndex + "/" + (totalChunks - 1) + "]");
    
    const sheet = getOrCreateSheet("ChunkCache", [
      "uploadId", "chunkIndex", "data", "timestamp"
    ]);
    
    const timestamp = new Date().toISOString();
    
    sheet.appendRow([
      uploadId,
      chunkIndex,
      chunkData,
      timestamp
    ]);
    
    Logger.log("✅ 청크 저장 완료");
    
    return {
      success: true,
      message: "청크 저장 완료"
    };
    
  } catch (error) {
    Logger.log("❌ 청크 저장 에러: " + error.toString());
    return {
      success: false,
      message: "청크 저장 실패: " + error.toString()
    };
  }
}

/**
 * 🎯 청크 조합 및 최종 업로드
 */
function finalizeUpload(params) {
  try {
    const uploadId = params.uploadId;
    const fileName = params.fileName;
    const mimeType = params.mimeType;
    
    Logger.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    Logger.log("🎯 최종 업로드 시작");
    Logger.log("  - 업로드 ID: " + uploadId);
    Logger.log("  - 파일명: " + fileName);
    Logger.log("  - 타입: " + mimeType);
    Logger.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    // 청크 데이터 조회
    const sheet = getOrCreateSheet("ChunkCache", [
      "uploadId", "chunkIndex", "data", "timestamp"
    ]);
    
    const data = sheet.getDataRange().getValues();
    const chunks = [];
    
    // 해당 uploadId의 청크 찾기
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === uploadId) {
        const chunkIndex = data[i][1];
        const chunkData = data[i][2];
        chunks.push({ index: chunkIndex, data: chunkData });
      }
    }
    
    Logger.log("📦 청크 개수: " + chunks.length);
    
    if (chunks.length === 0) {
      return {
        success: false,
        message: "청크 데이터를 찾을 수 없습니다."
      };
    }
    
    // 청크를 인덱스 순서대로 정렬
    chunks.sort(function(a, b) { return a.index - b.index; });
    
    // 모든 청크 데이터 조합
    let combinedData = "";
    for (let i = 0; i < chunks.length; i++) {
      combinedData += chunks[i].data;
    }
    
    Logger.log("✅ 데이터 조합 완료: " + combinedData.length + " characters");
    
    // 전용 폴더 가져오기
    const folder = getOrCreateImageFolder();
    
    // Base64 디코딩
    const blob = Utilities.newBlob(
      Utilities.base64Decode(combinedData),
      mimeType,
      fileName
    );
    
    Logger.log("✅ Base64 디코딩 완료");
    
    // 전용 폴더에 파일 생성
    const file = folder.createFile(blob);
    
    Logger.log("✅ Drive 업로드 완료: " + file.getName());
    Logger.log("📁 저장 위치: " + folder.getName());
    
    // 파일 공유 설정
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    Logger.log("✅ 공유 설정 완료");
    
    // 이미지 URL 생성
    const fileId = file.getId();
    const imageUrl = "https://drive.google.com/uc?export=view&id=" + fileId;
    
    Logger.log("✅ 이미지 URL 생성: " + imageUrl);
    
    // 청크 데이터 삭제 (정리)
    deleteChunksByUploadId(uploadId);
    
    Logger.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    return {
      success: true,
      url: imageUrl,
      fileId: fileId,
      message: "이미지 업로드 성공"
    };
    
  } catch (error) {
    Logger.log("❌ 최종 업로드 에러: " + error.toString());
    Logger.log("❌ Stack: " + error.stack);
    
    return {
      success: false,
      error: error.toString(),
      message: "이미지 업로드 실패: " + error.toString()
    };
  }
}

/**
 * 🗑️ 청크 데이터 삭제
 */
function deleteChunksByUploadId(uploadId) {
  try {
    const sheet = getOrCreateSheet("ChunkCache", [
      "uploadId", "chunkIndex", "data", "timestamp"
    ]);
    
    const data = sheet.getDataRange().getValues();
    const rowsToDelete = [];
    
    // 해당 uploadId의 행 번호 찾기 (역순)
    for (let i = data.length - 1; i > 0; i--) {
      if (data[i][0] === uploadId) {
        rowsToDelete.push(i + 1); // 1-based index
      }
    }
    
    // 행 삭제
    for (let i = 0; i < rowsToDelete.length; i++) {
      sheet.deleteRow(rowsToDelete[i]);
    }
    
    Logger.log("🗑️ 청크 데이터 삭제 완료: " + rowsToDelete.length + "개");
  } catch (error) {
    Logger.log("⚠️ 청크 삭제 실패: " + error.toString());
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
    Object.keys(data).forEach(key => {
      response[key] = data[key];
    });
  }
  
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}