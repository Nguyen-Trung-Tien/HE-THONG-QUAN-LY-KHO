"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Notifications", [
      {
        userId: 1, // Assuming admin user ID is 1
        title: "🚀 Chào mừng đến với Smart WMS v3.5.0!",
        message: "Phiên bản v3.5.0 mang đến hàng loạt cải tiến vượt trội: \n\n" +
                 "✅ **Lịch sử hoạt động:** Theo dõi mọi biến động kho bãi theo thời gian thực.\n" +
                 "✅ **Quản lý Xuất kho nâng cao:** Giao diện bento hiện đại, chọn nhiều mặt hàng, kiểm tra tồn kho tức thì.\n" +
                 "✅ **Bảo mật tối ưu:** Lưu trữ Avatar bằng Base64 (LONGTEXT), hỗ trợ 2FA và mã PIN.\n" +
                 "✅ **Dữ liệu thực:** Các biểu đồ thống kê hiện đã kết nối trực tiếp với Database.\n" +
                 "✅ **Trải nghiệm mượt mà:** Tối ưu hóa hiệu năng và thu gọn các phím điều hướng hệ thống.\n\n" +
                 "Khám phá ngay các tính năng mới trong bảng điều khiển của bạn!",
        type: "system",
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Notifications", null, {});
  },
};
