# Frontend Smart WMS 3.0.0

Frontend là ứng dụng quản trị kho chạy bằng React, phục vụ dashboard, quản lý dữ liệu nghiệp vụ, thông báo và cài đặt hệ thống.

## Stack

- React 19
- Vite
- Redux Toolkit
- TanStack Query
- Tailwind CSS
- React Router
- Recharts
- React Toastify
- Leaflet

## Cấu trúc chính

```text
frontend/
|-- src/
|   |-- API/
|   |-- auth/
|   |-- components/
|   |-- i18n/
|   |-- redux/
|   `-- utils/
|-- public/
|-- .env.example
`-- package.json
```

## Màn hình chính

- Dashboard
- Products
- Inventory
- Orders
- Shippers
- Customers
- Suppliers
- Warehouse Management
- Users
- Notifications
- Settings
- Sign In / Sign Up / Profile

## Tính năng nổi bật

- Giao diện quản trị responsive.
- Điều hướng có phân quyền bằng `RequireAuth` và `RoleGuard`.
- Hỗ trợ theme sáng/tối và ngôn ngữ.
- Trang cài đặt cho 2FA, PIN, mật khẩu, session và backup.
- Dashboard biểu đồ, cảnh báo tồn kho, cảnh báo hết hạn và thông báo nội bộ.

## Chạy local

Tạo file `frontend/.env`:

```env
VITE_API_URL=http://localhost:3001
```

Chạy dự án:

```bash
cd frontend
npm install
npm run dev
```

Build production:

```bash
npm run build
```
