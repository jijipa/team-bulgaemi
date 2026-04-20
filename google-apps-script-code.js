// Google Apps Script 코드
// 이 코드를 Google Apps Script 에디터에 복사해서 사용하세요

function doPost(e) {
  try {
    // 디버깅을 위한 로깅
    Logger.log("=== doPost 호출됨 ===");
    Logger.log("e 객체: " + JSON.stringify(e));
    
    // e가 없거나 postData가 없는 경우 처리
    if (!e) {
      Logger.log("에러: e 객체가 없음");
      return createErrorResponse("요청 객체가 없습니다");
    }
    
    if (!e.postData) {
      Logger.log("에러: e.postData가 없음");
      Logger.log("e.parameter: " + JSON.stringify(e.parameter));
      Logger.log("e.parameters: " + JSON.stringify(e.parameters));
      return createErrorResponse("POST 데이터가 없습니다");
    }
    
    if (!e.postData.contents) {
      Logger.log("에러: e.postData.contents가 없음");
      Logger.log("e.postData: " + JSON.stringify(e.postData));
      return createErrorResponse("POST 데이터 내용이 없습니다");
    }
    
    const payload = JSON.parse(e.postData.contents);
    
    Logger.log("받은 데이터: " + JSON.stringify(payload));
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let result;
    
    if (payload.action === "registerMatch") {
      // 매치 등록
      Logger.log("매치 등록 시작");
      result = handleRegisterMatch(spreadsheet, payload.match);
      Logger.log("매치 등록 완료: " + JSON.stringify(result));
      return createSuccessResponse("매치 등록 완료", result);
      
    } else if (payload.action === "updateStats") {
      // 득점/도움 통계 업데이트
      Logger.log("통계 업데이트 시작");
      result = handleUpdateStats(spreadsheet, payload.stats);
      Logger.log("통계 업데이트 완료: " + JSON.stringify(result));
      return createSuccessResponse("통계 업데이트 완료", result);
      
    } else if (payload.action === "registerPlayers") {
      // 선수 등록 (기존 로직 유지)
      Logger.log("선수 등록 시작");
      result = handleRegisterPlayers(spreadsheet, payload.players);
      Logger.log("선수 등록 완료: " + JSON.stringify(result));
      return createSuccessResponse("선수 등록 완료", result);
      
    } else {
      Logger.log("알 수 없는 액션: " + (payload.action || "없음"));
      return createErrorResponse("알 수 없는 액션: " + (payload.action || "없음"));
    }
    
  } catch (error) {
    Logger.log("=== 에러 발생 ===");
    Logger.log("에러 메시지: " + error.message);
    Logger.log("에러 스택: " + error.stack);
    return createErrorResponse(error.toString());
  }
}

// 매치 등록 처리
function handleRegisterMatch(spreadsheet, match) {
  let sheet = spreadsheet.getSheetByName("Matches");
  if (!sheet) {
    sheet = spreadsheet.insertSheet("Matches");
    // 헤더 추가
    sheet.appendRow([
      "ID", "날짜", "상대팀", "장소", "시작시간", "종료시간", 
      "쿼터수", "쿼터시간", "인원수", "등록일시"
    ]);
    // 헤더 스타일
    sheet.getRange(1, 1, 1, 10).setFontWeight("bold").setBackground("#f3f3f3");
  }
  
  const now = new Date();
  const timestamp = Utilities.formatDate(now, "Asia/Seoul", "yyyy-MM-dd HH:mm:ss");
  
  sheet.appendRow([
    match.id || "",
    match.date || "",
    match.opponent || "",
    match.location || "",
    match.startTime || "",
    match.endTime || "",
    match.quarterCount || "",
    match.quarterTime || "",
    match.playerCount || "",
    timestamp
  ]);
  
  return { rowAdded: sheet.getLastRow(), matchId: match.id };
}

// 통계 업데이트 처리
function handleUpdateStats(spreadsheet, stats) {
  let sheet = spreadsheet.getSheetByName("PlayerStats");
  if (!sheet) {
    sheet = spreadsheet.insertSheet("PlayerStats");
    // 헤더 추가
    sheet.appendRow(["이름", "골", "도움", "업데이트일시"]);
    sheet.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#f3f3f3");
  }
  
  const now = new Date();
  const timestamp = Utilities.formatDate(now, "Asia/Seoul", "yyyy-MM-dd HH:mm:ss");
  
  const updatedPlayers = [];
  
  stats.forEach(stat => {
    // 기존 선수 찾기
    const data = sheet.getDataRange().getValues();
    let rowIndex = -1;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === stat.이름) {
        rowIndex = i + 1; // 시트는 1부터 시작
        break;
      }
    }
    
    if (rowIndex > 0) {
      // 기존 데이터 업데이트 (누적)
      const currentGoals = sheet.getRange(rowIndex, 2).getValue() || 0;
      const currentAssists = sheet.getRange(rowIndex, 3).getValue() || 0;
      
      sheet.getRange(rowIndex, 2).setValue(Number(currentGoals) + Number(stat.골));
      sheet.getRange(rowIndex, 3).setValue(Number(currentAssists) + Number(stat.도움));
      sheet.getRange(rowIndex, 4).setValue(timestamp);
      
      updatedPlayers.push({ name: stat.이름, action: "updated" });
    } else {
      // 새로운 선수 추가
      sheet.appendRow([stat.이름, stat.골, stat.도움, timestamp]);
      updatedPlayers.push({ name: stat.이름, action: "added" });
    }
  });
  
  return { updatedCount: updatedPlayers.length, players: updatedPlayers };
}

// 선수 등록 처리 (기존 로직)
function handleRegisterPlayers(spreadsheet, players) {
  let sheet = spreadsheet.getSheetByName("RegisteredPlayers");
  if (!sheet) {
    sheet = spreadsheet.insertSheet("RegisteredPlayers");
    sheet.appendRow(["번호", "이름", "골", "도움", "등록일시"]);
    sheet.getRange(1, 1, 1, 5).setFontWeight("bold").setBackground("#f3f3f3");
  }
  
  const now = new Date();
  const timestamp = Utilities.formatDate(now, "Asia/Seoul", "yyyy-MM-dd HH:mm:ss");
  
  players.forEach(player => {
    sheet.appendRow([
      player.번호 || "",
      player.이름 || "",
      player.골 || 0,
      player.도움 || 0,
      timestamp
    ]);
  });
  
  return { playersAdded: players.length };
}

// GET 요청 테스트용
function doGet(e) {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(JSON.stringify({ 
    success: true, 
    message: "Google Apps Script가 정상 작동 중입니다!",
    timestamp: new Date().toISOString()
  }));
  return output;
}

// 성공 응답 생성
function createSuccessResponse(message, data) {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(JSON.stringify({ success: true, message: message, data: data }));
  return output;
}

// 에러 응답 생성
function createErrorResponse(error) {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(JSON.stringify({ success: false, error: error }));
  return output;
}