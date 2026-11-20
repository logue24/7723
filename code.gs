const SHEET_NAME = 'Users';
const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('PopCat Click 🐱')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getSheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
}

function checkUsername(username) {
  username = String(username).trim().toLowerCase();
  if (!username) return { available: false, message: 'Tên không được để trống' };
  
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).toLowerCase() === username) {
      let suggest = username + Math.floor(Math.random() * 900 + 100);
      let tryCount = 0;
      while (tryCount < 20) {
        let exists = false;
        for (let j = 1; j < data.length; j++) {
          if (String(data[j][0]).toLowerCase() === suggest) {
            exists = true;
            break;
          }
        }
        if (!exists) break;
        suggest = username + Math.floor(Math.random() * 9000 + 1000);
        tryCount++;
      }
      return { available: false, message: 'Tên đã được sử dụng', suggest: suggest };
    }
  }
  return { available: true };
}

function register(username, nickname) {
  username = String(username).trim();
  nickname = String(nickname).trim() || username;
  
  if (!username) {
    return { success: false, message: 'Vui lòng nhập tên người dùng' };
  }
  
  const check = checkUsername(username);
  if (!check.available) {
    return { success: false, message: check.message, suggest: check.suggest };
  }
  
  const sheet = getSheet();
  sheet.appendRow([username, nickname, '', 0, new Date()]);
  
  return { 
    success: true, 
    user: { username, nickname, score: 0 }
  };
}

function login(username) {
  username = String(username).trim();
  if (!username) return { success: false, message: 'Nhập tên người dùng' };
  
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).toLowerCase() === username.toLowerCase()) {
      return {
        success: true,
        user: {
          username: data[i][0],
          nickname: data[i][1],
          score: Number(data[i][3]) || 0
        }
      };
    }
  }
  return { success: false, message: 'Không tìm thấy tài khoản' };
}

function updateScore(username, newScore) {
  username = String(username).trim();
  newScore = Math.max(0, Math.floor(Number(newScore) || 0));
  
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).toLowerCase() === username.toLowerCase()) {
      const current = Number(data[i][3]) || 0;
      if (newScore > current) {
        sheet.getRange(i + 1, 4).setValue(newScore);
        sheet.getRange(i + 1, 5).setValue(new Date());
      }
      return { success: true, score: Math.max(current, newScore) };
    }
  }
  return { success: false };
}

function getLeaderboard() {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  let list = [];
  
  for (let i = 1; i < data.length; i++) {
    list.push({
      username: data[i][0],
      nickname: data[i][1],
      score: Number(data[i][3]) || 0
    });
  }
  
  list.sort((a, b) => b.score - a.score);
  return list.slice(0, 100);
}

function getMyScore(username) {
  username = String(username).trim();
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).toLowerCase() === username.toLowerCase()) {
      return Number(data[i][3]) || 0;
    }
  }
  return 0;
}
