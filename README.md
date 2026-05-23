# 🚀 Smart WMS v3.5.0 — Enterprise Warehouse Management System

<div align="center">
  <img src="./public/home.png" alt="Smart WMS Dashboard" width="800" style="border-radius: 20px; shadow: 0 20px 50px rgba(0,0,0,0.3)" />

  <br />

  [![Version](https://img.shields.io/badge/Version-3.5.0-0f766e?style=for-the-badge&logo=github)](https://github.com/yourusername/he-thong-quan-ly-kho)
  [![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
  [![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql)](https://www.mysql.com/)
  [![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

  <p align="center">
    <strong>Giải pháp quản lý kho bãi thông minh, bảo mật và hiệu quả dành cho doanh nghiệp hiện đại.</strong>
  </p>
</div>

---

## 🌟 Tổng quan hệ thống

**Smart WMS** là hệ thống quản lý kho (Warehouse Management System) thế hệ mới, được thiết kế để tối ưu hóa mọi quy trình từ khâu nhập hàng, kiểm kê đến xuất hàng và phân phối. Với phiên bản **v3.5.0**, hệ thống đã đạt đến độ chín muồi về cả tính năng lẫn trải nghiệm người dùng.

## ✨ Điểm nổi bật trong phiên bản v3.5.0

### 📊 Thống kê & Báo cáo Thông minh
- **Dữ liệu thực tế:** Toàn bộ biểu đồ (Cơ cấu hàng hóa, Doanh thu, Tăng trưởng) hiện đã được kết nối trực tiếp với API backend, phản ánh chính xác tình trạng kho hàng theo thời gian thực.
- **Biểu đồ Bento:** Giao diện Dashboard được thiết kế theo phong cách Bento Grid hiện đại, giúp nắm bắt thông tin nhanh chóng.

### 📦 Quản lý Xuất kho Nâng cao
- **Đa mặt hàng:** Hỗ trợ tạo phiếu xuất với nhiều sản phẩm cùng lúc trong một giao diện duy nhất.
- **Kiểm tra tồn kho tức thì:** Tự động cảnh báo và chặn xuất hàng nếu số lượng trong kho không đủ.
- **Ghi log tự động:** Mỗi lần xuất kho đều được ghi lại vào lịch sử hoạt động với chi tiết số lượng trước và sau khi thay đổi.

### 🔒 Bảo mật Đa lớp (Enterprise Grade)
- **Xác thực 2 lớp (2FA):** Tích hợp Google Authenticator bảo vệ tài khoản tối đa.
- **Mã PIN bảo mật:** Lớp bảo vệ thứ hai cho các thao tác nhạy cảm.
- **Quản lý phiên:** Theo dõi và đăng xuất các thiết bị từ xa.
- **Base64 Avatar:** Hệ thống lưu trữ ảnh đại diện trực tiếp dưới dạng chuỗi Base64 (LONGTEXT), tăng tốc độ tải và tính toàn vẹn dữ liệu.

### 📜 Lịch sử hoạt động (Audit Trail)
- Theo dõi toàn bộ dòng tiền và hàng hóa chảy qua hệ thống.
- Nhật ký chi tiết: Ai đã làm gì, vào lúc nào, với sản phẩm nào, và số lượng thay đổi ra sao.

---

## 🛠️ Công nghệ sử dụng

### Frontend (Modern Stack)
- **React 19 & Vite:** Hiệu năng render vượt trội, thời gian build siêu tốc.
- **Redux Toolkit:** Quản lý trạng thái ứng dụng chuyên nghiệp.
- **Tailwind CSS v4:** Giao diện responsive, hiện đại và tùy biến cao.
- **Chart.js & Framer Motion:** Hình ảnh hóa dữ liệu sinh động và hiệu ứng mượt mà.

### Backend (Robust & Scalable)
- **Node.js & Express 5:** Xử lý logic nghiệp vụ mạnh mẽ, hỗ trợ async/await toàn diện.
- **Sequelize ORM:** Quản lý cơ sở dữ liệu MySQL thông qua các model, hỗ trợ Migrations và Transactions.
- **JWT & Bcrypt:** Bảo mật phiên làm việc và mã hóa mật khẩu an toàn.

---

## 🚀 Hướng dẫn cài đặt

### 1. Yêu cầu hệ thống
- Node.js (v18 trở lên)
- MySQL (v8.0 trở lên)

### 2. Cài đặt Backend
```bash
cd backend
npm install
cp .env.example .env # Cấu hình DB_URL và JWT_SECRET
npx sequelize-cli db:migrate
npm start
```

### 3. Cài đặt Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📸 Ảnh chụp màn hình

| Dashboard | Quản lý sản phẩm | Phiếu xuất kho |
| :---: | :---: | :---: |
| ![Dashboard](./public/home.png) | ![Products](./backend/public/image/banh-mochi.jpg) | ![Export](./public/archive.svg) |

---

## 📞 Liên hệ hỗ trợ

Nếu bạn gặp bất kỳ vấn đề gì hoặc muốn đóng góp cho dự án, vui lòng mở một **Issue** hoặc liên hệ qua email: `support@smartwms.pro`.

---

<div align="center">
  <p>Made with ❤️ by Group 0 — 2026</p>
</div>
