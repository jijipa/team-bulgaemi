import { Match, Score, Player } from "../types/data";

// Google Apps Script 웹훅 URL (환경변수로 관리 권장)
const WEBHOOK_URL =
  "YOUR_GOOGLE_APPS_SCRIPT_WEBHOOK_URL_HERE";

// 웹훅 데이터 타입
type WebhookPayload =
  | { type: "match"; data: Match }
  | { type: "score"; data: Score }
  | { type: "scores"; data: Score[] }
  | { type: "player"; data: Player };

// Google Sheets로 데이터 전송
export const sendToGoogleSheets = async (
  payload: WebhookPayload
): Promise<boolean> => {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("Failed to send data to Google Sheets:", response.status);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending data to Google Sheets:", error);
    return false;
  }
};

// 매치 저장 (LocalStorage + Google Sheets)
export const saveMatchWithBackup = async (match: Match): Promise<void> => {
  // LocalStorage에 즉시 저장
  const { addMatch } = await import("./storage");
  addMatch(match);

  // Google Sheets에 백업 (백그라운드)
  sendToGoogleSheets({ type: "match", data: match }).catch((error) => {
    console.error("Failed to backup match to Google Sheets:", error);
  });
};

// 득점 저장 (LocalStorage + Google Sheets)
export const saveScoresWithBackup = async (scores: Score[]): Promise<void> => {
  // LocalStorage에 즉시 저장
  const { addScores } = await import("./storage");
  addScores(scores);

  // Google Sheets에 백업 (백그라운드)
  sendToGoogleSheets({ type: "scores", data: scores }).catch((error) => {
    console.error("Failed to backup scores to Google Sheets:", error);
  });
};

// 선수 저장 (LocalStorage + Google Sheets)
export const savePlayerWithBackup = async (player: Player): Promise<void> => {
  // LocalStorage에 즉시 저장
  const { addPlayer } = await import("./storage");
  addPlayer(player);

  // Google Sheets에 백업 (백그라운드)
  sendToGoogleSheets({ type: "player", data: player }).catch((error) => {
    console.error("Failed to backup player to Google Sheets:", error);
  });
};

// Google Apps Script 샘플 코드 (참고용)
/*
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const payload = JSON.parse(e.postData.contents);
  
  if (payload.type === 'match') {
    const matchSheet = sheet.getSheetByName('Matches') || sheet.insertSheet('Matches');
    const match = payload.data;
    matchSheet.appendRow([
      match.id,
      match.matchType,
      match.playerCount,
      match.quarterCount,
      match.quarterTime,
      match.matchDate,
      match.startTime,
      match.endTime,
      match.location,
      match.locationLink || '',
      match.opponentName,
      match.isCompleted,
      match.ourScore || '',
      match.opponentScore || '',
      match.createdAt
    ]);
  } else if (payload.type === 'scores') {
    const scoreSheet = sheet.getSheetByName('Scores') || sheet.insertSheet('Scores');
    payload.data.forEach(score => {
      scoreSheet.appendRow([
        score.id,
        score.matchId,
        score.playerId,
        score.playerName,
        score.goals,
        score.assists
      ]);
    });
  } else if (payload.type === 'player') {
    const playerSheet = sheet.getSheetByName('Players') || sheet.insertSheet('Players');
    const player = payload.data;
    playerSheet.appendRow([
      player.id,
      player.name,
      player.isMercenary,
      player.createdAt
    ]);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
*/
