# 🎨 Smart WMS - Frontend Web Application

Giao diện quản trị kho hiện đại, trực quan và mạnh mẽ, được xây dựng bằng React 19 và các công nghệ mới nhất.

## 🚀 Công nghệ sử dụng

- **Framework:** React 19 + Vite (Next-generation frontend tool).
- **Styling:** Tailwind CSS (Modern CSS framework).
- **State:** Redux Toolkit & TanStack Query v5.
- **Navigation:** React Router 7.
- **Icons:** Lucide React & React Icons.
- **Charts:** Recharts & Chart.js.
- **Maps:** React Leaflet.

## ✨ Tính năng chính

- **Admin Dashboard:** Biểu đồ doanh thu, thống kê nhập xuất và cảnh báo kho.
- **Quản lý Hàng hóa:** Giao diện lưới/danh sách linh hoạt, tích hợp QR Code.
- **Quy trình Kho:** Luồng nghiệp vụ Nhập - Xuất - Chuyển kho mượt mà.
- **Hệ thống Cài đặt:**
    - Cấu hình 2FA và PIN bảo mật.
    - Đổi Theme (Light/Dark) và Ngôn ngữ.
    - Quản lý phiên đăng nhập (Sessions).
- **Hệ thống Thông báo:** Nhận thông tin vận hành tức thì.

## 📁 Cấu trúc nguồn

```text
src/
├── API/          # Cấu hình Axios, các hooks gọi API (TanStack Query).
├── assets/       # Hình ảnh, biểu tượng tĩnh.
├── auth/         # Logic xác thực, Guards (RequireAuth, RoleGuard).
├── components/   # Thư viện UI components tái sử dụng.
├── i18n/         # Cấu hình đa ngôn ngữ.
├── redux/        # Quản lý Global State.
└── utils/        # Hàm tiện ích xử lý dữ liệu.
```

## 🛠️ Phát triển & Build

### 1. Cấu hình
Tạo file `.env`:
```env
VITE_API_URL=http://localhost:3001
```

### 2. Chạy Local
```bash
# Cài đặt
npm install

# Chạy dev server
npm run dev
```

### 3. Build Production
```bash
npm run build
```

## 📱 Responsive & UI/UX
Ứng dụng được tối ưu hiển thị trên nhiều kích thước màn hình, từ Laptop đến Máy tính bảng. Trải nghiệm người dùng được đặt lên hàng đầu với các hiệu ứng chuyển cảnh mượt mà và thông báo (Toast) phản hồi tức thì.
