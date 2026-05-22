# Backend Smart WMS 3.0.0

Backend cung cấp REST API cho toàn bộ hệ thống quản lý kho, xác thực người dùng, thống kê, thông báo và sao lưu dữ liệu.

## Stack

- Node.js
- Express 5
- Sequelize
- MySQL
- JWT + cookie
- bcrypt / bcryptjs
- speakeasy + qrcode
- multer

## Cấu trúc chính

```text
backend/
|-- src/
|   |-- config/
|   |-- controller/
|   |-- middleware/
|   |-- migrations/
|   |-- models/
|   |-- routers/
|   `-- services/
|-- public/
|-- backups/
|-- .env.example
`-- package.json
```

## Biến môi trường

Tạo `backend/.env` từ `.env.example`:

```env
PORT=3001
NODE_ENV=development
DB_DEV_USERNAME=root
DB_DEV_PASSWORD=
DB_DEV_NAME=httt
DB_DEV_HOST=127.0.0.1
DB_DEV_DIALECT=mysql
JWT_SECRET=your_secret
```

## Khởi động

```bash
cd backend
npm install
npx sequelize-cli db:migrate
npm start
```

## Route modules

Tất cả endpoint dùng prefix `/api/v1`:

- `/user`
- `/products`
- `/shipper`
- `/orders`
- `/customer`
- `/suppliers`
- `/import-receipt`
- `/import-detail`
- `/export-receipt`
- `/export-detail`
- `/inventory`
- `/stock`
- `/statistics`
- `/notifications`
- `/2fa`
- `/pin`
- `/backup`

## Tính năng backend nổi bật

- Đăng nhập, refresh token, logout.
- Quản lý session và thu hồi thiết bị.
- 2FA bằng Authenticator app.
- Security PIN 6 chữ số.
- CRUD sản phẩm, đơn hàng, khách hàng, nhà cung cấp, shipper.
- Quản lý nhập kho, xuất kho, tồn kho và inventory log.
- Kiểm tra kết nối DB.
- Export SQL và backup JSON.

## Lệnh thường dùng

```bash
npm start
npx sequelize-cli db:migrate
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:seed:all
```
