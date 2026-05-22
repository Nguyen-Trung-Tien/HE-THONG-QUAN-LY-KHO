# Smart WMS 3.0.0

<div align="center">
  <img src="https://img.shields.io/badge/version-3.0.0-0f766e?style=for-the-badge" alt="Version 3.0.0" />
  <img src="https://img.shields.io/badge/status-active-16a34a?style=for-the-badge" alt="Status active" />
  <img src="https://img.shields.io/badge/backend-Node.js%20%2B%20Express-1f2937?style=for-the-badge" alt="Backend" />
  <img src="https://img.shields.io/badge/frontend-React%2019%20%2B%20Vite-2563eb?style=for-the-badge" alt="Frontend" />
  <img src="https://img.shields.io/badge/database-MySQL-1d4ed8?style=for-the-badge" alt="Database" />
</div>

Smart WMS là hệ thống quản lý kho hàng full-stack cho các nghiệp vụ nhập kho, xuất kho, tồn kho, đơn hàng, khách hàng, nhà cung cấp, shipper và quản trị nội bộ. Bản `3.0.0` tập trung hoàn thiện trải nghiệm quản trị: phân quyền rõ ràng hơn, quản lý phiên đăng nhập, bảo mật hai lớp, PIN bảo mật, thông báo nội bộ, cài đặt hệ thống và sao lưu dữ liệu.

## Tổng quan nhanh

- Frontend: React 19, Vite, Redux Toolkit, TanStack Query, Tailwind CSS, Recharts.
- Backend: Node.js, Express 5, Sequelize, JWT, cookie auth, bcrypt, speakeasy, qrcode.
- Database: MySQL, migration qua `sequelize-cli`.
- API base: `http://localhost:3001/api/v1`.

## Điểm mới ở phiên bản 3.0.0

- Thêm `2FA` bằng ứng dụng Authenticator.
- Thêm `Security PIN` cho luồng đăng nhập.
- Có trang `Settings` để đổi theme, ngôn ngữ, tên hệ thống và tùy chọn thông báo.
- Quản lý `sessions` để xem và thu hồi phiên đăng nhập từ xa.
- Bổ sung module `notifications`.
- Bổ sung module `backup` để kiểm tra kết nối DB, export SQL và backup JSON.
- Làm mới nhiều màn hình quản trị như dashboard, sidebar, header và các module nghiệp vụ.

## Phân hệ chính

- `Dashboard`
- `Products`
- `Inventory`
- `Import Receipt`
- `Export Receipt`
- `Orders`
- `Shippers`
- `Customers`
- `Suppliers`
- `Warehouse Management`
- `Users`
- `Notifications`
- `Settings`

## Kiến trúc hệ thống

```text
HE-THONG-QUAN-LY-KHO/
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |-- controller/
|   |   |-- middleware/
|   |   |-- migrations/
|   |   |-- models/
|   |   |-- routers/
|   |   `-- services/
|   |-- public/
|   |-- backups/
|   |-- .env.example
|   `-- package.json
|-- frontend/
|   |-- src/
|   |   |-- API/
|   |   |-- auth/
|   |   |-- components/
|   |   |-- i18n/
|   |   |-- redux/
|   |   `-- utils/
|   |-- public/
|   |-- .env.example
|   `-- package.json
`-- README.md
```

## API modules hiện có

Tất cả route backend được mount dưới `/api/v1`:

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

## Bảo mật và quản trị

- Access token và refresh token cho xác thực người dùng.
- `refresh_token` lưu trong `httpOnly cookie`.
- Vai trò truy cập có kiểm soát ở cả frontend và backend.
- Hỗ trợ `2FA`, `PIN 6 số`, đổi mật khẩu và quản lý phiên đăng nhập.
- Cấu hình thông báo, giao diện và tên hệ thống theo người dùng.

## Cài đặt nhanh

### 1. Yêu cầu

- Node.js `18+`
- MySQL `8+`
- npm

### 2. Backend

```bash
cd backend
npm install
copy .env.example .env
```

Thiết lập `backend/.env`:

```env
PORT=3001
DB_DEV_USERNAME=root
DB_DEV_PASSWORD=
DB_DEV_NAME=httt
DB_DEV_HOST=127.0.0.1
DB_DEV_DIALECT=mysql
JWT_SECRET=your_secret
```

Chạy backend:

```bash
npx sequelize-cli db:migrate
npm start
```

### 3. Frontend

```bash
cd frontend
npm install
copy .env.example .env
```

Thiết lập `frontend/.env`:

```env
VITE_API_URL=http://localhost:3001
```

Chạy frontend:

```bash
npm run dev
```

## Scripts thường dùng

### Backend

```bash
npm start
npx sequelize-cli db:migrate
npx sequelize-cli db:migrate:undo:all
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## README theo từng phần

- [README backend](./backend/README.md)
- [README frontend](./frontend/README.md)

## Hướng phát triển tiếp

- Bổ sung test cho auth flow và service layer.
- Chuẩn hóa response API và error handling.
- Bổ sung CI cho lint, build và migration check.
- Tách cấu hình production cho cookie, CORS và chính sách backup.

## Tác giả

- GitHub: `Nguyen-Trung-Tien/HE-THONG-QUAN-LY-KHO`
