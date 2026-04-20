/**
 * ⚽ 축구 경기 관리 시스템 - Google Apps Script
 * 
 * 📊 시트 구조:
 * 1. Matches: 경기 기본 정보
 * 2. PlayerStats: 선수별 누적 통계
 * 3. RegisteredPlayers: 경기별 출전 명단
 */

// 스프레드시트 ID (자동 감지)
const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

/**
 * 🌐 GET 요청 처리 (데이터 읽기)
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    const callback = e.parameter.callback; // JSONP callback
    
    let result;
    
    if (action === "getMatches") {
      result = getMatchesData();
    } else if (action === "getPlayerStats") {
      result = getPlayerStatsData();
    } else if (action === "getRegisteredPlayers") {
      result = getRegisteredPlayersData(e.parameter.matchId);
    } else {
      result = { success: false, message: "알 수 없는 action입니다." };
    }
    
    // JSONP 응답 (callback이 있으면 JSONP, 없으면 JSON)
    if (callback) {
      const jsonpResponse = callback + "(" + JSON.stringify(result) + ");";
      return ContentService.createTextOutput(jsonpResponse)
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    // 일반 JSON 응답
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
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    if (action === "registerMatch") {
      return registerMatch(data.match);
    } else if (action === "updateStats") {
      return updateStats(data.stats);
    } else if (action === "registerPlayers") {
      return registerPlayers(data.players, data.matchId);
    }

    return createResponse(false, "알 수 없는 action입니다.");
  } catch (error) {
    return createResponse(false, error.toString());
  }
}

/**
 * 📖 매치 데이터 읽기
 */
function getMatchesData() {
  const sheet = getOrCreateSheet("Matches", [
    "경기ID", "날짜", "상대팀", "장소", "시작시간", "종료시간", 
    "쿼터수", "쿼터시간", "출전인원", "우리팀득점", "상대팀득점", "등록일시"
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
  
  return { success: true, message: "매치 데이터 조회 성공", matches };
}

/**
 * 📖 선수 통계 읽기
 */
function getPlayerStatsData() {
  const sheet = getOrCreateSheet("PlayerStats", ["이름", "골", "도움", "최근업데이트"]);
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  const stats = rows.map(row => {
    const stat = {};
    headers.forEach((header, index) => {
      stat[header] = row[index];
    });
    return stat;
  });
  
  return { success: true, message: "선수 통계 조회 성공", stats };
}

/**
 * 📖 경기별 출전 선수 읽기
 */
function getRegisteredPlayersData(matchId) {
  const sheet = getOrCreateSheet("RegisteredPlayers", ["경기ID", "번호", "이름", "등록일시"]);
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  let players = rows.map(row => {
    const player = {};
    headers.forEach((header, index) => {
      player[header] = row[index];
    });
    return player;
  });
  
  // matchId가 제공되면 필터링
  if (matchId) {
    players = players.filter(p => p["경기ID"] === matchId);
  }
  
  return { success: true, message: "출전 선수 조회 성공", players };
}

/**
 * ⚽ 매치 등록
 */
function registerMatch(match) {
  const sheet = getOrCreateSheet("Matches", [
    "경기ID", "날짜", "상대팀", "장소", "시작시간", "종료시간", 
    "쿼터수", "쿼터시간", "출전인원", "우리팀득점", "상대팀득점", "등록일시"
  ]);

  const timestamp = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
  
  // 날짜 형식을 YYYY-MM-DD로만 저장 (시간 정보 제거)
  const dateOnly = match.date ? match.date.split("T")[0].split(" ")[0] : "N/A";
  
  sheet.appendRow([
    match.id || "N/A",
    dateOnly, // YYYY-MM-DD 형식만 저장
    match.opponent || "N/A",
    match.location || "N/A",
    match.startTime || "N/A",
    match.endTime || "N/A",
    match.quarterCount || 4,
    match.quarterTime || 10,
    match.playerCount || 0,
    match.ourScore || 0,
    match.opponentScore || 0,
    timestamp
  ]);

  return createResponse(true, "매치가 성공적으로 등록되었습니다.");
}

/**
 * 📊 선수 통계 업데이트
 */
function updateStats(stats) {
  const sheet = getOrCreateSheet("PlayerStats", ["이름", "골", "도움", "최근업데이트"]);
  
  const timestamp = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
  
  stats.forEach(stat => {
    const data = sheet.getDataRange().getValues();
    let found = false;
    
    // 기존 선수 찾기
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === stat.name) {
        // 기존 통계 업데이트 (누적)
        sheet.getRange(i + 1, 2).setValue(data[i][1] + (stat.goals || 0));
        sheet.getRange(i + 1, 3).setValue(data[i][2] + (stat.assists || 0));
        sheet.getRange(i + 1, 4).setValue(timestamp);
        found = true;
        break;
      }
    }
    
    // 신규 선수 추가
    if (!found) {
      sheet.appendRow([
        stat.name,
        stat.goals || 0,
        stat.assists || 0,
        timestamp
      ]);
    }
  });
  
  return createResponse(true, "선수 통계가 업데이트되었습니다.");
}

/**
 * 👥 경기별 출전 선수 등록
 */
function registerPlayers(players, matchId) {
  const sheet = getOrCreateSheet("RegisteredPlayers", ["경기ID", "번호", "이름", "등록일시"]);
  
  const timestamp = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
  
  players.forEach(player => {
    sheet.appendRow([
      matchId || "N/A",
      player.number || "N/A",
      player.name || "N/A",
      timestamp
    ]);
  });
  
  return createResponse(true, "출전 선수가 등록되었습니다.");
}

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
