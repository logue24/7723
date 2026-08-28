"use strict";

/* ============================================================
   CONFIG — sửa dòng dưới thành URL Worker của bạn sau khi deploy
   ============================================================ */
const API_BASE = "https://REPLACE-WITH-YOUR-WORKER.workers.dev";

const MAX_FILE_SIZE = 1288490188; // 1.2 GiB — phải khớp với worker
const MAX_FILES = 50;

/* ============================================================
   I18N
   ============================================================ */
const I18N = {
  vi: {
    "nav.send": "Gửi", "nav.receive": "Nhận",
    "send.tabFile": "Tệp", "send.tabText": "Văn bản",
    "send.dropTitle": "Kéo thả tệp vào đây",
    "send.dropSub": "hoặc bấm để chọn · tối đa 1.2GB/tệp",
    "send.textPlaceholder": "Nhập văn bản cần gửi...",
    "send.lines": "dòng", "send.chars": "ký tự",
    "send.generate": "Tạo mã",
    "send.codeLabel": "Mã", "send.expiresIn": "Hết hạn sau",
    "send.copyCode": "Sao chép mã", "send.copyLink": "Sao chép liên kết",
    "send.newCode": "Tạo mã khác",
    "receive.camHint": "Bấm nút bên dưới để bật camera",
    "receive.camStart": "Bật camera", "receive.camStop": "Tắt camera",
    "receive.orManual": "hoặc nhập mã",
    "receive.confirm": "Xác nhận",
    "receive.looking": "Đang tra cứu mã...",
    "receive.selectAll": "Chọn tất cả",
    "receive.downloadSelected": "Tải về đã chọn",
    "receive.scanAnother": "Quét mã khác",
    "footer.tagline": "QRelay · chuyển dữ liệu qua mã QR",
    "errors.fileTooLarge": "Tệp \"{name}\" vượt quá 1.2GB",
    "errors.tooManyFiles": "Chỉ được chọn tối đa 50 tệp",
    "errors.emptyText": "Vui lòng nhập văn bản",
    "errors.codeNotFound": "Không tìm thấy mã này hoặc đã hết hạn",
    "errors.network": "Lỗi kết nối, vui lòng thử lại",
    "errors.cameraDenied": "Không có quyền truy cập camera",
    "errors.cameraUnavailable": "Thiết bị không hỗ trợ camera",
    "errors.invalidCode": "Vui lòng nhập đủ 6 số",
    "progress.creatingCode": "Đang tạo mã...",
    "progress.uploading": "Đang tải lên {done}/{total}",
    "receive.fileSummary": "{n} tệp · {size}",
    "copied": "Đã sao chép!",
  },
  en: {
    "nav.send": "Send", "nav.receive": "Receive",
    "send.tabFile": "File", "send.tabText": "Text",
    "send.dropTitle": "Drag files here",
    "send.dropSub": "or tap to choose · up to 1.2GB per file",
    "send.textPlaceholder": "Type the text to send...",
    "send.lines": "lines", "send.chars": "chars",
    "send.generate": "Generate code",
    "send.codeLabel": "Code", "send.expiresIn": "Expires in",
    "send.copyCode": "Copy code", "send.copyLink": "Copy link",
    "send.newCode": "New code",
    "receive.camHint": "Tap the button below to turn on the camera",
    "receive.camStart": "Turn on camera", "receive.camStop": "Turn off camera",
    "receive.orManual": "or enter code",
    "receive.confirm": "Confirm",
    "receive.looking": "Looking up code...",
    "receive.selectAll": "Select all",
    "receive.downloadSelected": "Download selected",
    "receive.scanAnother": "Scan another",
    "footer.tagline": "QRelay · transfer data with a QR code",
    "errors.fileTooLarge": "\"{name}\" is larger than 1.2GB",
    "errors.tooManyFiles": "You can select up to 50 files",
    "errors.emptyText": "Please enter some text",
    "errors.codeNotFound": "Code not found or expired",
    "errors.network": "Connection error, please try again",
    "errors.cameraDenied": "Camera access was denied",
    "errors.cameraUnavailable": "This device has no camera",
    "errors.invalidCode": "Please enter all 6 digits",
    "progress.creatingCode": "Creating code...",
    "progress.uploading": "Uploading {done}/{total}",
    "receive.fileSummary": "{n} files · {size}",
    "copied": "Copied!",
  },
  ko: {
    "nav.send": "보내기", "nav.receive": "받기",
    "send.tabFile": "파일", "send.tabText": "텍스트",
    "send.dropTitle": "파일을 여기로 끌어오세요",
    "send.dropSub": "또는 탭하여 선택 · 파일당 최대 1.2GB",
    "send.textPlaceholder": "보낼 텍스트를 입력하세요...",
    "send.lines": "줄", "send.chars": "자",
    "send.generate": "코드 생성",
    "send.codeLabel": "코드", "send.expiresIn": "만료까지",
    "send.copyCode": "코드 복사", "send.copyLink": "링크 복사",
    "send.newCode": "새 코드",
    "receive.camHint": "아래 버튼을 눌러 카메라를 켜세요",
    "receive.camStart": "카메라 켜기", "receive.camStop": "카메라 끄기",
    "receive.orManual": "또는 코드 입력",
    "receive.confirm": "확인",
    "receive.looking": "코드 조회 중...",
    "receive.selectAll": "전체 선택",
    "receive.downloadSelected": "선택 항목 다운로드",
    "receive.scanAnother": "다시 스캔",
    "footer.tagline": "QRelay · QR 코드로 데이터 전송",
    "errors.fileTooLarge": "\"{name}\" 파일이 1.2GB를 초과합니다",
    "errors.tooManyFiles": "최대 50개까지 선택할 수 있습니다",
    "errors.emptyText": "텍스트를 입력해 주세요",
    "errors.codeNotFound": "코드를 찾을 수 없거나 만료되었습니다",
    "errors.network": "연결 오류, 다시 시도해 주세요",
    "errors.cameraDenied": "카메라 접근 권한이 없습니다",
    "errors.cameraUnavailable": "이 기기에는 카메라가 없습니다",
    "errors.invalidCode": "6자리를 모두 입력해 주세요",
    "progress.creatingCode": "코드 생성 중...",
    "progress.uploading": "업로드 중 {done}/{total}",
    "receive.fileSummary": "파일 {n}개 · {size}",
    "copied": "복사됨!",
  },
  ja: {
    "nav.send": "送信", "nav.receive": "受信",
    "send.tabFile": "ファイル", "send.tabText": "テキスト",
    "send.dropTitle": "ここにファイルをドラッグ",
    "send.dropSub": "またはタップして選択 · ファイルごとに最大1.2GB",
    "send.textPlaceholder": "送信するテキストを入力...",
    "send.lines": "行", "send.chars": "文字",
    "send.generate": "コードを生成",
    "send.codeLabel": "コード", "send.expiresIn": "有効期限まで",
    "send.copyCode": "コードをコピー", "send.copyLink": "リンクをコピー",
    "send.newCode": "新しいコード",
    "receive.camHint": "下のボタンをタップしてカメラを起動",
    "receive.camStart": "カメラを起動", "receive.camStop": "カメラを停止",
    "receive.orManual": "またはコードを入力",
    "receive.confirm": "確認",
    "receive.looking": "コードを確認中...",
    "receive.selectAll": "すべて選択",
    "receive.downloadSelected": "選択項目をダウンロード",
    "receive.scanAnother": "もう一度スキャン",
    "footer.tagline": "QRelay · QRコードでデータを転送",
    "errors.fileTooLarge": "「{name}」は1.2GBを超えています",
    "errors.tooManyFiles": "選択できるのは最大50ファイルまでです",
    "errors.emptyText": "テキストを入力してください",
    "errors.codeNotFound": "コードが見つからないか、期限切れです",
    "errors.network": "接続エラーです。もう一度お試しください",
    "errors.cameraDenied": "カメラへのアクセスが許可されていません",
    "errors.cameraUnavailable": "この端末にはカメラがありません",
    "errors.invalidCode": "6桁すべて入力してください",
    "progress.creatingCode": "コードを作成中...",
    "progress.uploading": "アップロード中 {done}/{total}",
    "receive.fileSummary": "{n}件 · {size}",
    "copied": "コピーしました！",
  },
  zh: {
    "nav.send": "发送", "nav.receive": "接收",
    "send.tabFile": "文件", "send.tabText": "文本",
    "send.dropTitle": "将文件拖到此处",
    "send.dropSub": "或点击选择 · 每个文件最大1.2GB",
    "send.textPlaceholder": "输入要发送的文本...",
    "send.lines": "行", "send.chars": "字符",
    "send.generate": "生成代码",
    "send.codeLabel": "代码", "send.expiresIn": "剩余有效期",
    "send.copyCode": "复制代码", "send.copyLink": "复制链接",
    "send.newCode": "生成新代码",
    "receive.camHint": "点击下方按钮开启摄像头",
    "receive.camStart": "开启摄像头", "receive.camStop": "关闭摄像头",
    "receive.orManual": "或输入代码",
    "receive.confirm": "确认",
    "receive.looking": "正在查找代码...",
    "receive.selectAll": "全选",
    "receive.downloadSelected": "下载所选",
    "receive.scanAnother": "重新扫描",
    "footer.tagline": "QRelay · 通过二维码传输数据",
    "errors.fileTooLarge": "文件“{name}”超过1.2GB",
    "errors.tooManyFiles": "最多只能选择50个文件",
    "errors.emptyText": "请输入文本",
    "errors.codeNotFound": "找不到该代码或已过期",
    "errors.network": "连接错误，请重试",
    "errors.cameraDenied": "摄像头访问权限被拒绝",
    "errors.cameraUnavailable": "此设备没有摄像头",
    "errors.invalidCode": "请输入完整的6位数字",
    "progress.creatingCode": "正在生成代码...",
    "progress.uploading": "正在上传 {done}/{total}",
    "receive.fileSummary": "{n}个文件 · {size}",
    "copied": "已复制！",
  },
};

let currentLang = "vi";

function t(key, vars) {
  const dict = I18N[currentLang] || I18N.vi;
  let str = dict[key] || I18N.vi[key] || key;
  if (vars) {
    Object.keys(vars).forEach((k) => { str = str.replace("{" + k + "}", vars[k]); });
  }
  return str;
}

function applyLanguage(lang) {
  if (!I18N[lang]) lang = "vi";
  currentLang = lang;
  try { localStorage.setItem("qrelay_lang", lang); } catch (e) {}
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph")));
  });
  document.querySelectorAll(".lang-chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.lang === lang);
  });
  updateCameraButtonLabel();
}

function detectInitialLang() {
  let saved = null;
  try { saved = localStorage.getItem("qrelay_lang"); } catch (e) {}
  if (saved && I18N[saved]) return saved;
  const nav = (navigator.language || "vi").toLowerCase();
  if (nav.startsWith("en")) return "en";
  if (nav.startsWith("ko")) return "ko";
  if (nav.startsWith("ja")) return "ja";
  if (nav.startsWith("zh")) return "zh";
  return "vi";
}

/* ============================================================
   DOM refs
   ============================================================ */
const $ = (id) => document.getElementById(id);

const tabSend = $("tab-send"), tabReceive = $("tab-receive");
const panelSend = $("panel-send"), panelReceive = $("panel-receive");
const subtabFile = $("subtab-file"), subtabText = $("subtab-text");
const sendFileView = $("send-file-view"), sendTextView = $("send-text-view");

const dropzone = $("dropzone"), fileInput = $("file-input");
const fileListEl = $("file-list"), fileTotalEl = $("file-total");
const textInput = $("text-input"), lineCountEl = $("line-count"), charCountEl = $("char-count");
const btnGenerate = $("btn-generate");
const sendProgress = $("send-progress"), progressFill = $("progress-fill"), progressLabel = $("progress-label");
const sendErrorEl = $("send-error");
const sendResult = $("send-result"), resultCodeEl = $("result-code"), resultExpiryEl = $("result-expiry");
const qrCanvas = $("qr-canvas");
const btnCopyCode = $("btn-copy-code"), btnCopyLink = $("btn-copy-link"), btnNewSend = $("btn-new-send");

const viewfinder = $("viewfinder"), qrVideo = $("qr-video"), scanLineEl = $("scan-line");
const btnCameraToggle = $("btn-camera-toggle"), btnTorch = $("btn-torch");
const codeBoxes = [...document.querySelectorAll(".code-box")];
const btnConfirmCode = $("btn-confirm-code");
const receiveErrorEl = $("receive-error"), receiveLoadingEl = $("receive-loading");
const receiveResult = $("receive-result");
const receiveTextView = $("receive-text-view"), receiveTextContent = $("receive-text-content");
const receiveLineCount = $("receive-line-count"), receiveCharCount = $("receive-char-count");
const btnCopyReceivedText = $("btn-copy-received-text");
const receiveFileView = $("receive-file-view"), selectAllCheckbox = $("select-all");
const fileSummaryEl = $("file-summary"), fileManifestEl = $("file-manifest");
const btnDownloadSelected = $("btn-download-selected"), btnNewReceive = $("btn-new-receive");

const tplManifestRow = $("tpl-manifest-row");
const tplSendFileRow = $("tpl-send-file-row");

let selectedFiles = [];
let countdownTimer = null;
let currentSendCode = "", currentSendLink = "";
let mediaStream = null, scanning = false, rafId = null, torchOn = false;
const scanCanvas = document.createElement("canvas");
const scanCtx = scanCanvas.getContext("2d", { willReadFrequently: true });

/* ============================================================
   Helpers
   ============================================================ */
function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const val = bytes / Math.pow(1024, i);
  return `${val.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function fileKind(mime, name) {
  mime = mime || "";
  const ext = (String(name).split(".").pop() || "").toLowerCase();
  if (mime.startsWith("image/")) return { type: "image", icon: "image" };
  if (mime.startsWith("video/")) return { type: "video", icon: "video" };
  if (mime.startsWith("audio/")) return { type: "audio", icon: "audio" };
  if (mime.startsWith("text/") || ["txt", "md", "json", "csv", "log", "xml", "html", "css", "js"].includes(ext)) {
    return { type: "text", icon: "file" };
  }
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return { type: "archive", icon: "archive" };
  return { type: "other", icon: "file" };
}

function showSendError(msg) { sendErrorEl.textContent = msg; sendErrorEl.hidden = false; }
function hideSendError() { sendErrorEl.hidden = true; }
function showReceiveError(msg) { receiveErrorEl.textContent = msg; receiveErrorEl.hidden = false; }
function hideReceiveError() { receiveErrorEl.hidden = true; }

function copyText(text, btn) {
  const done = () => flashCopied(btn);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  } else {
    fallbackCopy(text, done);
  }
}
function fallbackCopy(text, done) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand("copy"); done(); } catch (e) {}
  document.body.removeChild(ta);
}
function flashCopied(btn) {
  const span = btn.querySelector("span");
  const original = span.textContent;
  span.textContent = t("copied");
  setTimeout(() => { span.textContent = original; }, 1500);
}

/* ============================================================
   Mode / subtab switching
   ============================================================ */
function switchMode(mode) {
  const isSend = mode === "send";
  tabSend.classList.toggle("active", isSend);
  tabSend.setAttribute("aria-selected", String(isSend));
  tabReceive.classList.toggle("active", !isSend);
  tabReceive.setAttribute("aria-selected", String(!isSend));
  panelSend.hidden = !isSend;
  panelReceive.hidden = isSend;
  if (isSend) stopCamera();
}

function switchSubtab(sub) {
  const isFile = sub === "file";
  subtabFile.classList.toggle("active", isFile);
  subtabText.classList.toggle("active", !isFile);
  sendFileView.hidden = !isFile;
  sendTextView.hidden = isFile;
  updateGenerateButtonState();
}

function updateGenerateButtonState() {
  const isFile = !sendFileView.hidden;
  if (isFile) {
    btnGenerate.disabled = selectedFiles.length === 0;
  } else {
    btnGenerate.disabled = textInput.value.trim().length === 0;
  }
}

/* ============================================================
   Send — file selection
   ============================================================ */
function addFiles(newFiles) {
  hideSendError();
  for (const f of newFiles) {
    if (selectedFiles.length >= MAX_FILES) { showSendError(t("errors.tooManyFiles")); break; }
    if (f.size > MAX_FILE_SIZE) { showSendError(t("errors.fileTooLarge", { name: f.name })); continue; }
    selectedFiles.push(f);
  }
  renderFileList();
  updateGenerateButtonState();
}

function renderFileList() {
  fileListEl.innerHTML = "";
  fileListEl.hidden = selectedFiles.length === 0;
  fileTotalEl.hidden = selectedFiles.length === 0;
  let total = 0;
  selectedFiles.forEach((f, idx) => {
    total += f.size;
    const node = tplSendFileRow.content.cloneNode(true);
    node.querySelector(".row-name").textContent = f.name;
    node.querySelector(".row-size").textContent = formatBytes(f.size);
    node.querySelector(".row-icon use").setAttribute("href", "#icon-" + fileKind(f.type, f.name).icon);
    node.querySelector(".row-remove").addEventListener("click", () => {
      selectedFiles.splice(idx, 1);
      renderFileList();
      updateGenerateButtonState();
    });
    fileListEl.appendChild(node);
  });
  fileTotalEl.textContent = selectedFiles.length ? `${selectedFiles.length} · ${formatBytes(total)}` : "";
}

dropzone.addEventListener("click", (e) => {
  // label[for] already opens the input; avoid double-trigger if user clicks the input itself
});
fileInput.addEventListener("change", () => {
  addFiles([...fileInput.files]);
  fileInput.value = "";
});
["dragenter", "dragover"].forEach((evt) =>
  dropzone.addEventListener(evt, (e) => { e.preventDefault(); dropzone.classList.add("drag-over"); })
);
["dragleave", "drop"].forEach((evt) =>
  dropzone.addEventListener(evt, (e) => { e.preventDefault(); dropzone.classList.remove("drag-over"); })
);
dropzone.addEventListener("drop", (e) => {
  const dropped = [...((e.dataTransfer && e.dataTransfer.files) || [])];
  if (dropped.length) addFiles(dropped);
});

textInput.addEventListener("input", () => {
  const val = textInput.value;
  lineCountEl.textContent = val === "" ? 0 : val.split("\n").length;
  charCountEl.textContent = [...val].length;
  updateGenerateButtonState();
});

/* ============================================================
   Send — upload + code generation
   ============================================================ */
function uploadFile(url, file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.upload.onprogress = (e) => { if (e.lengthComputable) onProgress(e.loaded / e.total); };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error("upload_failed_" + xhr.status));
    };
    xhr.onerror = () => reject(new Error("upload_network_error"));
    xhr.send(file);
  });
}

async function doSendFiles() {
  hideSendError();
  btnGenerate.disabled = true;
  sendProgress.hidden = false;
  progressFill.style.width = "4%";
  progressLabel.textContent = t("progress.creatingCode");

  try {
    const res = await fetch(`${API_BASE}/api/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "file",
        files: selectedFiles.map((f) => ({ name: f.name, size: f.size, type: f.type || "application/octet-stream" })),
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "create_failed");

    const uploads = data.uploads || [];
    const perFileProgress = new Array(selectedFiles.length).fill(0);
    const totalBytes = selectedFiles.reduce((s, f) => s + f.size, 0);
    let doneCount = 0;

    const updateAggregate = () => {
      const doneBytes = selectedFiles.reduce((s, f, i) => s + f.size * perFileProgress[i], 0);
      const pct = totalBytes ? Math.round((doneBytes / totalBytes) * 100) : 0;
      progressFill.style.width = pct + "%";
      progressLabel.textContent = `${t("progress.uploading", { done: doneCount, total: selectedFiles.length })} (${pct}%)`;
    };

    for (let i = 0; i < selectedFiles.length; i++) {
      await uploadFile(uploads[i].url, selectedFiles[i], (frac) => {
        perFileProgress[i] = frac;
        updateAggregate();
      });
      perFileProgress[i] = 1;
      doneCount++;
      updateAggregate();
    }

    sendProgress.hidden = true;
    showSendResult(data.code, data.expiresIn);
  } catch (err) {
    sendProgress.hidden = true;
    btnGenerate.disabled = false;
    showSendError(t("errors.network"));
  }
}

async function doSendText() {
  hideSendError();
  const text = textInput.value;
  if (!text.trim()) { showSendError(t("errors.emptyText")); return; }
  btnGenerate.disabled = true;
  sendProgress.hidden = false;
  progressFill.style.width = "50%";
  progressLabel.textContent = t("progress.creatingCode");

  try {
    const res = await fetch(`${API_BASE}/api/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "text", text }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "create_failed");
    sendProgress.hidden = true;
    showSendResult(data.code, data.expiresIn);
  } catch (err) {
    sendProgress.hidden = true;
    btnGenerate.disabled = false;
    showSendError(t("errors.network"));
  }
}

btnGenerate.addEventListener("click", () => {
  const isFile = !sendFileView.hidden;
  if (isFile) doSendFiles(); else doSendText();
});

function showSendResult(code, expiresIn) {
  sendResult.hidden = false;
  resultCodeEl.textContent = code.slice(0, 3) + " " + code.slice(3);
  currentSendCode = code;
  currentSendLink = `${location.origin}${location.pathname}?code=${code}`;
  if (window.QRCode && qrCanvas) {
    QRCode.toCanvas(qrCanvas, currentSendLink, { width: 150, margin: 1, color: { dark: "#0b0d10", light: "#f4efe6" } }, function () {});
  }
  startCountdown(expiresIn);
}

function startCountdown(seconds) {
  let remaining = Math.floor(seconds);
  clearInterval(countdownTimer);
  const pad = (n) => String(n).padStart(2, "0");
  function tick() {
    if (remaining < 0) { clearInterval(countdownTimer); return; }
    const h = Math.floor(remaining / 3600), m = Math.floor((remaining % 3600) / 60), s = remaining % 60;
    resultExpiryEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
    remaining--;
  }
  tick();
  countdownTimer = setInterval(tick, 1000);
}

btnCopyCode.addEventListener("click", () => copyText(currentSendCode, btnCopyCode));
btnCopyLink.addEventListener("click", () => copyText(currentSendLink, btnCopyLink));
btnNewSend.addEventListener("click", () => {
  selectedFiles = [];
  renderFileList();
  textInput.value = "";
  textInput.dispatchEvent(new Event("input"));
  sendResult.hidden = true;
  clearInterval(countdownTimer);
  updateGenerateButtonState();
});

/* ============================================================
   Receive — camera + jsQR scanning
   ============================================================ */
function updateCameraButtonLabel() {
  const span = btnCameraToggle.querySelector("span");
  span.textContent = scanning ? t("receive.camStop") : t("receive.camStart");
}

async function startCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showReceiveError(t("errors.cameraUnavailable"));
    return;
  }
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
      audio: false,
    });
  } catch (err) {
    showReceiveError(err && err.name === "NotAllowedError" ? t("errors.cameraDenied") : t("errors.cameraUnavailable"));
    return;
  }
  hideReceiveError();
  qrVideo.srcObject = mediaStream;
  qrVideo.classList.add("live");
  viewfinder.classList.add("active");
  scanLineEl.hidden = false;
  try { await qrVideo.play(); } catch (e) {}
  scanning = true;
  updateCameraButtonLabel();
  checkTorchSupport();
  if (typeof jsQR === "undefined") {
    showReceiveError(t("errors.cameraUnavailable"));
    stopCamera();
    return;
  }
  rafId = requestAnimationFrame(scanLoop);
}

function stopCamera() {
  scanning = false;
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;
  if (mediaStream) {
    mediaStream.getTracks().forEach((tr) => tr.stop());
    mediaStream = null;
  }
  qrVideo.classList.remove("live");
  viewfinder.classList.remove("active");
  scanLineEl.hidden = true;
  btnTorch.hidden = true;
  torchOn = false;
  updateCameraButtonLabel();
}

function scanLoop() {
  if (!scanning) return;
  if (qrVideo.readyState === qrVideo.HAVE_ENOUGH_DATA && qrVideo.videoWidth) {
    scanCanvas.width = qrVideo.videoWidth;
    scanCanvas.height = qrVideo.videoHeight;
    scanCtx.drawImage(qrVideo, 0, 0, scanCanvas.width, scanCanvas.height);
    const imgData = scanCtx.getImageData(0, 0, scanCanvas.width, scanCanvas.height);
    const result = jsQR(imgData.data, imgData.width, imgData.height);
    if (result && result.data) {
      onQrDetected(result.data);
      return;
    }
  }
  rafId = requestAnimationFrame(scanLoop);
}

function extractCodeFromText(text) {
  try {
    const u = new URL(text);
    const c = u.searchParams.get("code");
    if (c && /^\d{6}$/.test(c)) return c;
  } catch (e) {}
  const m = String(text).match(/\d{6}/);
  return m ? m[0] : null;
}

function onQrDetected(text) {
  stopCamera();
  const code = extractCodeFromText(text);
  if (code) {
    fillCodeBoxes(code);
    lookupCode(code);
  } else {
    showReceiveError(t("errors.invalidCode"));
  }
}

function checkTorchSupport() {
  try {
    const track = mediaStream.getVideoTracks()[0];
    const caps = track.getCapabilities ? track.getCapabilities() : {};
    btnTorch.hidden = !caps.torch;
  } catch (e) {
    btnTorch.hidden = true;
  }
}

btnTorch.addEventListener("click", async () => {
  if (!mediaStream) return;
  const track = mediaStream.getVideoTracks()[0];
  torchOn = !torchOn;
  try { await track.applyConstraints({ advanced: [{ torch: torchOn }] }); } catch (e) {}
});

btnCameraToggle.addEventListener("click", () => { scanning ? stopCamera() : startCamera(); });

/* ============================================================
   Receive — manual code boxes
   ============================================================ */
codeBoxes.forEach((box, i) => {
  box.addEventListener("input", () => {
    box.value = box.value.replace(/[^0-9]/g, "").slice(0, 1);
    if (box.value && i < codeBoxes.length - 1) codeBoxes[i + 1].focus();
  });
  box.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && !box.value && i > 0) codeBoxes[i - 1].focus();
  });
  box.addEventListener("paste", (e) => {
    e.preventDefault();
    const paste = ((e.clipboardData || window.clipboardData).getData("text") || "").replace(/[^0-9]/g, "");
    for (let j = 0; j < codeBoxes.length; j++) codeBoxes[j].value = paste[j] || "";
    codeBoxes[Math.min(paste.length, codeBoxes.length - 1)].focus();
  });
});

function fillCodeBoxes(code) {
  for (let i = 0; i < codeBoxes.length; i++) codeBoxes[i].value = code[i] || "";
}
function readCode() { return codeBoxes.map((b) => b.value).join(""); }

btnConfirmCode.addEventListener("click", () => {
  const code = readCode();
  if (!/^\d{6}$/.test(code)) { showReceiveError(t("errors.invalidCode")); return; }
  lookupCode(code);
});

/* ============================================================
   Receive — lookup + render
   ============================================================ */
async function lookupCode(code) {
  hideReceiveError();
  receiveResult.hidden = true;
  receiveLoadingEl.hidden = false;
  try {
    const res = await fetch(`${API_BASE}/api/info?code=${encodeURIComponent(code)}`);
    receiveLoadingEl.hidden = true;
    if (!res.ok) { showReceiveError(t("errors.codeNotFound")); return; }
    const data = await res.json();
    renderReceiveResult(data);
  } catch (err) {
    receiveLoadingEl.hidden = true;
    showReceiveError(t("errors.network"));
  }
}

function renderReceiveResult(data) {
  receiveResult.hidden = false;
  if (data.kind === "text") {
    receiveTextView.hidden = false;
    receiveFileView.hidden = true;
    receiveTextContent.textContent = data.text;
    const lines = data.text === "" ? 0 : data.text.split("\n").length;
    receiveLineCount.textContent = lines;
    receiveCharCount.textContent = [...data.text].length;
  } else {
    receiveTextView.hidden = true;
    receiveFileView.hidden = false;
    renderManifest(data.files || []);
  }
}

function updateDownloadBtnState() {
  const anyChecked = [...fileManifestEl.querySelectorAll(".row-check")].some((c) => c.checked);
  btnDownloadSelected.disabled = !anyChecked;
}

function renderManifest(files) {
  fileManifestEl.innerHTML = "";
  let total = 0;
  files.forEach((f) => {
    total += f.size;
    const node = tplManifestRow.content.cloneNode(true);
    const checkbox = node.querySelector(".row-check");
    checkbox.checked = true;
    node.querySelector(".row-name").textContent = f.name;
    node.querySelector(".row-size").textContent = formatBytes(f.size);
    const link = node.querySelector(".row-download");
    link.href = f.url;
    link.setAttribute("download", f.name);

    const kind = fileKind(f.type, f.name);
    node.querySelector(".row-icon use").setAttribute("href", "#icon-" + kind.icon);

    const previewEl = node.querySelector(".row-preview");
    if (kind.type === "image") {
      const img = document.createElement("img");
      img.src = f.url; img.loading = "lazy"; img.alt = f.name;
      previewEl.appendChild(img);
    } else if (kind.type === "video") {
      const v = document.createElement("video");
      v.src = f.url; v.controls = true; v.preload = "none";
      previewEl.appendChild(v);
    } else if (kind.type === "audio") {
      const a = document.createElement("audio");
      a.src = f.url; a.controls = true; a.preload = "none"; a.style.width = "100%";
      previewEl.appendChild(a);
    } else if (kind.type === "text" && f.size < 20000) {
      const snip = document.createElement("div");
      snip.className = "text-snip";
      snip.textContent = "...";
      previewEl.appendChild(snip);
      fetch(f.url).then((r) => r.text()).then((txt) => { snip.textContent = txt.slice(0, 500); }).catch(() => snip.remove());
    }

    fileManifestEl.appendChild(node);
  });
  fileSummaryEl.textContent = t("receive.fileSummary", { n: files.length, size: formatBytes(total) });
  selectAllCheckbox.checked = true;
  updateDownloadBtnState();
}

selectAllCheckbox.addEventListener("change", () => {
  fileManifestEl.querySelectorAll(".row-check").forEach((c) => { c.checked = selectAllCheckbox.checked; });
  updateDownloadBtnState();
});
fileManifestEl.addEventListener("change", (e) => {
  if (e.target.classList.contains("row-check")) {
    const all = [...fileManifestEl.querySelectorAll(".row-check")];
    selectAllCheckbox.checked = all.length > 0 && all.every((c) => c.checked);
    updateDownloadBtnState();
  }
});

btnDownloadSelected.addEventListener("click", () => {
  const rows = [...fileManifestEl.querySelectorAll(".manifest-row")];
  const selected = rows.filter((r) => r.querySelector(".row-check").checked);
  selected.forEach((row, i) => {
    setTimeout(() => { row.querySelector(".row-download").click(); }, i * 350);
  });
});

btnCopyReceivedText.addEventListener("click", () => copyText(receiveTextContent.textContent, btnCopyReceivedText));

btnNewReceive.addEventListener("click", () => {
  receiveResult.hidden = true;
  hideReceiveError();
  codeBoxes.forEach((b) => (b.value = ""));
  codeBoxes[0].focus();
  history.replaceState({}, "", location.pathname);
});

/* ============================================================
   Nav wiring + init
   ============================================================ */
tabSend.addEventListener("click", () => switchMode("send"));
tabReceive.addEventListener("click", () => switchMode("receive"));
subtabFile.addEventListener("click", () => switchSubtab("file"));
subtabText.addEventListener("click", () => switchSubtab("text"));
document.querySelectorAll(".lang-chip").forEach((chip) => {
  chip.addEventListener("click", () => applyLanguage(chip.dataset.lang));
});

function init() {
  applyLanguage(detectInitialLang());
  switchMode("send");
  switchSubtab("file");
  renderFileList();
  updateGenerateButtonState();

  const params = new URLSearchParams(location.search);
  const urlCode = params.get("code");
  if (urlCode && /^\d{6}$/.test(urlCode)) {
    switchMode("receive");
    fillCodeBoxes(urlCode);
    lookupCode(urlCode);
  }
}

document.addEventListener("DOMContentLoaded", init);
window.addEventListener("pagehide", stopCamera);
