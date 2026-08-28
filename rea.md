# Hướng dẫn triển khai QRelay

Dự án gồm **2 phần tách biệt**, triển khai ở 2 nơi khác nhau:

| Phần | Gồm | Triển khai ở |
|---|---|---|
| **Frontend** | `index.html`, `style.css`, `script.js` | GitHub Pages |
| **Backend** | `worker/` (4 file) | Cloudflare Workers + R2 |

GitHub Pages chỉ chạy được web tĩnh nên không thể chạy PHP/API thật — phần backend (tạo mã, lưu file, cấp link tải) chạy trên Cloudflare Worker, miễn phí, không giới hạn theo tài khoản cá nhân.

---

## Phần A — Deploy Backend (Cloudflare Worker + R2)

### A1. Chuẩn bị
- Tài khoản Cloudflare (miễn phí): https://dash.cloudflare.com/sign-up
- Cài Node.js nếu máy chưa có: https://nodejs.org (bản LTS)

### A2. Tạo R2 bucket
1. Vào Cloudflare Dashboard → **R2 Object Storage** → **Create bucket**
2. Đặt tên bucket: `qrelay-files` (hoặc tên khác, nhớ sửa lại trong `wrangler.toml`)
3. Vào bucket vừa tạo → tab **Settings** → mục **CORS Policy** → **Add CORS policy** → dán nguyên nội dung file `worker/cors.json` → Save.
   - Lưu ý: R2 hiện có thể yêu cầu xác minh thẻ để bật, nhưng dùng trong hạn mức miễn phí (10GB lưu trữ, không tính phí băng thông tải xuống) thì không bị tính tiền.

### A3. Tạo R2 API Token (để Worker ký link tải lên/xuống)
1. Ở trang R2 Object Storage → **Manage R2 API Tokens** → **Create API Token**
2. Quyền: **Object Read & Write**, giới hạn vào đúng bucket `qrelay-files`
3. Bấm Create → **lưu lại ngay** `Access Key ID` và `Secret Access Key` (chỉ hiện 1 lần)

### A4. Lấy Account ID
- Vào Dashboard → **Workers & Pages** → góc phải trang tổng quan có **Account ID** → copy lại

### A5. Cài đặt & deploy Worker
Mở terminal, vào thư mục `worker/`:

```bash
cd worker
npm install
```

Tạo KV namespace (nơi lưu mã + hạn dùng):

```bash
npx wrangler login
npx wrangler kv namespace create CODES
```

Lệnh trên in ra một `id`, ví dụ: `id = "abcd1234..."`. Mở `wrangler.toml`, dán id đó vào chỗ `PASTE_KV_NAMESPACE_ID_HERE`.

Sửa tiếp trong `wrangler.toml`:
- `R2_ACCOUNT_ID` → dán Account ID (bước A4)
- `R2_BUCKET_NAME` → tên bucket đã tạo (mặc định `qrelay-files`)

Set 2 secret (Access Key ID / Secret Access Key từ bước A3):

```bash
npx wrangler secret put R2_ACCESS_KEY_ID
npx wrangler secret put R2_SECRET_ACCESS_KEY
```

(gõ/dán giá trị khi được hỏi, rồi Enter)

Deploy:

```bash
npx wrangler deploy
```

Lệnh này in ra URL dạng `https://qrelay-api.<subdomain>.workers.dev` — **copy lại URL này**, sẽ dùng ở Phần B.

---

## Phần B — Deploy Frontend (GitHub Pages)

1. Mở file `script.js`, sửa dòng đầu tiên:
   ```js
   const API_BASE = "https://REPLACE-WITH-YOUR-WORKER.workers.dev";
   ```
   thành URL Worker thật ở bước A5 (bỏ dấu `/` ở cuối nếu có).
2. Tạo repo GitHub mới (ví dụ `qrelay`), đẩy 3 file `index.html`, `style.css`, `script.js` lên **thư mục gốc** của repo.
3. Vào **Settings → Pages** của repo → Source chọn **Deploy from a branch** → chọn nhánh `main`, thư mục `/ (root)` → Save.
4. Sau 1–2 phút, trang chạy tại `https://<username>.github.io/<repo>/`.

---

## Kiểm tra nhanh

- Mở trang trên điện thoại → tab **Gửi** → nhập ít văn bản → **Tạo mã** → phải hiện mã 6 số + QR.
- Mở trình duyệt khác (hoặc máy khác) → tab **Nhận** → bấm **Bật camera**, quét QR vừa tạo → phải tự điền mã và hiện lại văn bản.
- Thử gửi 1 tệp ảnh nhỏ trước khi thử tệp lớn, để chắc luồng upload/QR/CORS đã đúng.

## Ghi chú

- Mã hết hạn sau **24 giờ** (đổi `CODE_TTL_SECONDS` trong `worker/src/index.js` nếu muốn khác).
- Giới hạn **1.2GB/tệp** nằm ở cả `script.js` (`MAX_FILE_SIZE`) và `worker/src/index.js` — sửa cả hai nếu đổi.
- R2 free tier: 10GB lưu trữ/tháng. Nên vào R2 bucket → Settings → **Object lifecycle rules** → thêm rule tự xoá object sau 1–2 ngày, để dung lượng không đầy dần theo thời gian.
- Nếu đổi tên bucket hoặc tạo lại API token, nhớ cập nhật lại `wrangler.toml` / secrets rồi `npx wrangler deploy` lại.
