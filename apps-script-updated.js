/**
 * 📊 농구 경기 관리 시스템 - Google Apps Script
 * 
 * 시트 구조:
 * 1. Matches: 경기 정보 (날짜, 상대팀, 장소, 스코어 등)
 * 2. PlayerStats: 선수별 누적 통계 (골, 도움)
 * 3. RegisteredPlayers: 경기별 출전 명단 (어떤 선수가 어떤 경기에 참여했는지)
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    console.log("📥 수신된 데이터:", JSON.stringify(data, null, 2));
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    switch(data.action) {
      case "registerMatch":
        return registerMatch(ss, data.match);
      case "updateStats":
        return updateStats(ss, data.stats);
      case "registerPlayers":
        return registerPlayers(ss, data.players, data.matchId); // matchId 추가
      default:
        throw new Error("알 수 없는 action: " + data.action);
    }
  } catch (error) {
    console.error("❌ 오류 발생:", error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 1️⃣ 경기 등록
 */
function registerMatch(ss, match) {
  let sheet = ss.getSheetByName("Matches");
  
  // 시트가 없으면 생성
  if (!sheet) {
    sheet = ss.insertSheet("Matches");
    sheet.appendRow(["경기ID", "날짜", "상대팀", "장소", "시작시간", "종료시간", "쿼터수", "쿼터시간", "인원수", "우리점수", "상대점수", "결과", "등록일시"]);
    sheet.getRange(1, 1, 1, 13).setFontWeight("bold").setBackground("#f3f3f3");
  }
  
  // 데이터 추가
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
    match.ourScore || "",
    match.opponentScore || "",
    match.result || "",
    new Date().toLocaleString("ko-KR")
  ]);
  
  console.log("✅ 경기 등록 완료:", match.id);
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: "경기가 등록되었습니다."
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * 2️⃣ 선수 통계 업데이트 (누적)
 */
function updateStats(ss, stats) {
  let sheet = ss.getSheetByName("PlayerStats");
  
  // 시트가 없으면 생성
  if (!sheet) {
    sheet = ss.insertSheet("PlayerStats");
    sheet.appendRow(["이름", "골", "도움", "업데이트일시"]);
    sheet.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#f3f3f3");
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  // 통계 업데이트
  stats.forEach(stat => {
    const existingRowIndex = rows.findIndex(row => row[0] === stat.이름);
    
    if (existingRowIndex >= 0) {
      // 기존 선수 - 누적
      const currentGoals = rows[existingRowIndex][1] || 0;
      const currentAssists = rows[existingRowIndex][2] || 0;
      
      sheet.getRange(existingRowIndex + 2, 2).setValue(currentGoals + stat.골);
      sheet.getRange(existingRowIndex + 2, 3).setValue(currentAssists + stat.도움);
      sheet.getRange(existingRowIndex + 2, 4).setValue(new Date().toLocaleString("ko-KR"));
    } else {
      // 신규 선수
      sheet.appendRow([
        stat.이름,
        stat.골,
        stat.도움,
        new Date().toLocaleString("ko-KR")
      ]);
    }
  });
  
  console.log("✅ 통계 업데이트 완료");
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: "통계가 업데이트되었습니다."
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * 3️⃣ 경기별 출전 명단 등록
 * ⚠️ 골/도움은 기록하지 않음 (순수하게 "누가 참여했는지"만 기록)
 */
function registerPlayers(ss, players, matchId) {
  let sheet = ss.getSheetByName("RegisteredPlayers");
  
  // 시트가 없으면 생성
  if (!sheet) {
    sheet = ss.insertSheet("RegisteredPlayers");
    // ✅ 골/도움 컬럼 제거, 경기ID와 등록일시 추가
    sheet.appendRow(["경기ID", "번호", "이름", "등록일시"]);
    sheet.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#f3f3f3");
  }
  
  // 선수 명단 추가
  players.forEach(player => {
    sheet.appendRow([
      matchId || "N/A",
      player.번호 || "",
      player.이름 || "",
      new Date().toLocaleString("ko-KR")
    ]);
  });
  
  console.log("✅ 선수 명단 등록 완료:", players.length + "명");
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: players.length + "명의 선수가 등록되었습니다."
  })).setMimeType(ContentService.MimeType.JSON);
}
