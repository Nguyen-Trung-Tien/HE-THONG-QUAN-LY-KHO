# ⚙️ Smart WMS - Backend API Server

Hệ thống Backend được xây dựng trên nền tảng Node.js bền bỉ, cung cấp toàn bộ REST API cho hệ thống quản lý kho, tích hợp các cơ chế bảo mật cấp doanh nghiệp.

## 🚀 Công nghệ lõi (Tech Stack)

- **Runtime:** Node.js (v18/v20)
- **Framework:** Express 5.x (Routing & Middleware)
- **ORM:** Sequelize (MySQL abstraction)
- **Security:**
  - JWT (JSON Web Tokens) với Access/Refresh token pattern.
  - bcryptjs cho mã hóa mật khẩu.
  - Speakeasy cho xác thực 2 lớp (TOTP).
- **Utilities:**
  - `cookie-parser`: Quản lý bảo mật cookie.
  - `multer`: Xử lý upload hình ảnh sản phẩm.
  - `ua-parser-js`: Phân tích thiết bị đăng nhập.

## 📁 Cấu trúc thư mục

```text
src/
├── config/       # Cấu hình kết nối DB, Sequelize, v.v.
├── controller/   # Logic điều khiển, nhận request & gọi service.
├── middleware/   # Auth guards, Role checks, File uploaders.
├── migrations/   # Script thay đổi cấu trúc Database.
├── models/       # Định nghĩa Schema bảng (User, Product, Stock...).
├── routers/      # Khai báo các Endpoint của hệ thống.
└── services/     # Logic nghiệp vụ chính (Business logic).
```

## 🛠️ Cài đặt & Triển khai

### 1. Biến môi trường (`.env`)
Tạo file `.env` từ mẫu:
```env
PORT=3001
NODE_ENV=development

# Database Configuration
DB_DEV_USERNAME=root
DB_DEV_PASSWORD=your_password
DB_DEV_NAME=httt
DB_DEV_HOST=127.0.0.1
DB_DEV_DIALECT=mysql

# Authentication
JWT_SECRET=super_secret_key_change_me
```

### 2. Khởi động
```bash
# Cài đặt thư viện
npm install

# Tạo cấu trúc database
npx sequelize-cli db:migrate

# Chạy server (Dev mode với nodemon)
npm start
```

## 📡 API Modules (Prefix: `/api/v1`)

Hệ thống chia làm nhiều module độc lập:
- **Hệ thống:** `/user`, `/notifications`, `/settings`, `/backup`.
- **Nghiệp vụ Kho:** `/products`, `/stock`, `/inventory`, `/import-receipt`, `/export-receipt`.
- **Đối tác:** `/customer`, `/suppliers`, `/shipper`, `/orders`.
- **Bảo mật:** `/2fa`, `/pin`.

## 🗄️ Database Scripts
- `npx sequelize-cli db:migrate`: Chạy migration mới.
- `npx sequelize-cli db:migrate:undo`: Hoàn tác migration gần nhất.
- `npx sequelize-cli db:seed:all`: Đổ dữ liệu mẫu (nếu có).
