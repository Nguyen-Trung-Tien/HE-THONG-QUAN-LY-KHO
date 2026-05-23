import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, resetUser } from "../redux/slice/userSlice";
import { GetDetailUser, UpdateDetailUser, UserLogout, ChangePassword } from "../API/user/userApi";
import { getInventoryLogs } from "../API/inventory/inventoryAPI";
import { toast } from "react-toastify";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiShield,
  FiMapPin,
  FiSettings,
  FiCamera,
  FiLogOut,
  FiActivity,
  FiLock,
  FiClock,
  FiPackage,
  FiArrowUpRight,
  FiArrowDownLeft,
  FiArrowLeft,
  FiInfo,
  FiSave
} from "react-icons/fi";
import { arrayBufferToString } from "../utils/arrayBufferToString";
import { cn } from "../utils/cn";
import Input from "./common/Input";
import Button from "./common/Button";
import Card from "./common/Card";
import Badge from "./common/Badge";
import ConfirmModal from "./common/ConfirmModal";
import Modal from "./common/Modal";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activityLogs, setActivityLogs] = useState([]);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [user, setUser] = useState({
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    role: "",
    avatarBase64: "",
    status: "",
    gender: "",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);

  const fetchUser = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?.id;
      if (!userId) return;

      const res = await GetDetailUser(userId);
      if (res.errCode === 0 && res.users.length > 0) {
        const data = res.users[0];
        let avatarBase64 = "";
        
        // Handle image data (could be string or Buffer from legacy BLOB)
        if (typeof data.image === 'string') {
          avatarBase64 = data.image;
        } else if (data.image?.data?.length > 0) {
          avatarBase64 = arrayBufferToString(data.image.data);
        }

        const userData = {
          id: data.id,
          email: data.email || "",
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phoneNumber: data.phoneNumber || "",
          address: data.address || "",
          role: data.role || "",
          avatarBase64,
          status: data.status || "",
          gender: data.gender || "",
        };

        setUser(userData);
        setAvatarPreview(avatarBase64 || null);
        
        // Cập nhật Local Storage và Redux để đồng bộ toàn bộ app
        const currentLocal = JSON.parse(localStorage.getItem("user"));
        const updatedLocal = { ...currentLocal, ...userData };
        localStorage.setItem("user", JSON.stringify(updatedLocal));
        dispatch(login(updatedLocal));
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await UpdateDetailUser(user);
      if (res.errCode === 0) {
        toast.success("Cập nhật thông tin thành công!");
        await fetchUser();
      } else {
        toast.error(res.message || "Lỗi cập nhật!");
      }
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Lỗi cập nhật hệ thống!");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      setUser((prev) => ({ ...prev, avatarBase64: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = async () => {
    try {
      const result = await UserLogout();
      if (result?.errCode === 0) {
        localStorage.removeItem("user");
        dispatch(resetUser());
        toast.success("Đăng xuất thành công!");
        navigate("/sign-in");
      }
    } catch (error) {
      toast.error("Lỗi khi đăng xuất");
    } finally {
      setShowLogoutModal(false);
    }
  };

  const fetchActivityLogs = async () => {
    setLoading(true);
    try {
      const res = await getInventoryLogs({ userId: user.id });
      setActivityLogs(res || []);
      setShowActivityModal(true);
    } catch (err) {
      toast.error("Lỗi khi tải lịch sử hoạt động!");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu mới không khớp!");
      return;
    }
    setLoading(true);
    try {
      const res = await ChangePassword({
        id: user.id,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      if (res.errCode === 0) {
        toast.success("Đổi mật khẩu thành công!");
        setShowPasswordModal(false);
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(res.errMessage || "Lỗi đổi mật khẩu!");
      }
    } catch (err) {
      toast.error("Lỗi hệ thống!");
    } finally {
      setLoading(false);
    }
  };

  const controlItems = [
    { 
      icon: <FiActivity />, 
      label: "Hoạt động gần đây", 
      color: "text-primary",
      action: fetchActivityLogs
    },
    { 
      icon: <FiShield />, 
      label: "Bảo mật & Quyền riêng tư", 
      color: "text-success",
      action: () => setShowPasswordModal(true)
    },
    { 
      icon: <FiSettings />, 
      label: "Cấu hình hệ thống", 
      color: "text-info", 
      path: "/settings" 
    },
    { 
      icon: <FiLogOut />, 
      label: "Đăng xuất tài khoản", 
      color: "text-error", 
      action: () => setShowLogoutModal(true) 
    },
  ];

  return (
    <div className="flex flex-col gap-y-8 animate-in fade-in duration-700 pb-10">
      {/* Header Banner */}
      <div className="relative h-64 w-full rounded-[3rem] overflow-hidden shadow-soft-2xl border border-white/20 dark:border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-accent opacity-90 dark:opacity-80" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 z-10 p-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-all duration-300 border border-white/20 active:scale-90 shadow-lg group"
          title="Quay lại"
        >
          <FiArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Animated Orbs */}
        <div className="absolute top-10 right-20 size-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-10 left-10 w-48 h-48 bg-accent/20 rounded-full blur-3xl animate-bounce duration-[10000ms]" />

        <div className="absolute bottom-8 left-10 flex items-end gap-x-6">
          <div className="relative group">
            <div className="size-32 rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-dark-border shadow-2xl bg-bg-subtle dark:bg-dark-card relative transition-transform duration-500 group-hover:scale-105">
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar" className="size-full object-cover" />
              ) : (
                <div className="size-full flex items-center justify-center text-primary bg-primary/10 font-black text-3xl uppercase">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
              )}
              <label htmlFor="avatarInput" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-sm">
                <FiCamera size={24} className="text-white" />
              </label>
            </div>
            <input id="avatarInput" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div className="pb-2 text-white">
            <h1 className="text-3xl font-semibold tracking-tighter uppercase leading-none mb-2">
              {user.firstName} {user.lastName}
            </h1>
            <div className="flex items-center gap-x-3">
              <Badge variant="neutral" className="bg-white/20 border-white/30 text-white text-[10px] backdrop-blur-md">
                {user.role || "Thành viên"}
              </Badge>
              <div className="flex items-center text-white/80 text-xs font-bold tracking-tight">
                <FiMail className="mr-1.5" /> {user.email}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="flex flex-col gap-y-6">
          <Card title="Trung tâm điều khiển" className="shadow-soft-xl">
            <div className="flex flex-col gap-y-2">
              {controlItems.map((item, i) => (
                <button 
                  key={item.label} 
                  onClick={() => {
                    if (item.path) navigate(item.path);
                    if (item.action) item.action();
                  }}
                  className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-bg-subtle dark:hover:bg-white/[0.03] transition-all group text-left"
                >
                  <div className="flex items-center gap-x-3">
                    <span className={cn("size-5", item.color)}>{item.icon}</span>
                    <span className="text-[11px] font-black text-text-primary uppercase tracking-tighter">{item.label}</span>
                  </div>
                  <svg className="size-4 text-text-tertiary group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </Card>

          <div className="bg-gradient-to-br from-primary/10 to-accent/5 p-8 rounded-[2.5rem] border border-primary/10 dark:border-primary/5 relative overflow-hidden group shadow-soft-lg">
            <div className="absolute top-0 right-0 size-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">Thống kê cá nhân</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-dark-card p-4 rounded-2xl border border-primary/10 dark:border-dark-border/40 shadow-sm">
                <p className="text-[9px] font-black text-text-tertiary uppercase mb-1">Phiếu đã lập</p>
                <p className="text-xl font-black text-text-primary">128</p>
              </div>
              <div className="bg-white dark:bg-dark-card p-4 rounded-2xl border border-primary/10 dark:border-dark-border/40 shadow-sm">
                <p className="text-[9px] font-black text-text-tertiary uppercase mb-1">Đơn hàng xử lý</p>
                <p className="text-xl font-black text-text-primary">42</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Card title="Cập nhật hồ sơ" extra={<FiUser className="text-primary" />}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Họ"
                  value={user.firstName}
                  onChange={(e) => setUser(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Họ người dùng"
                />
                <Input
                  label="Tên"
                  value={user.lastName}
                  onChange={(e) => setUser(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Tên người dùng"
                />
                <Input
                  label="Số điện thoại"
                  value={user.phoneNumber}
                  onChange={(e) => setUser(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="09xx xxx xxx"
                />
                <Input
                  label="Email (Hệ thống)"
                  value={user.email}
                  disabled
                  placeholder="example@gmail.com"
                  leftIcon={<FiMail />}
                />
              </div>

              <div className="flex flex-col gap-y-1.5">
                <label className="text-[10px] font-black text-text-tertiary ml-2 uppercase tracking-widest flex items-center space-x-1">
                  <span>Địa chỉ cư trú hiện tại</span>
                  <div className="w-1 h-1 rounded-full bg-primary/40" />
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary transition-colors">
                    <FiMapPin />
                  </div>
                  <textarea
                    value={user.address}
                    onChange={(e) => setUser(prev => ({ ...prev, address: e.target.value }))}
                    rows="3"
                    className="w-full pl-12 pr-5 py-3.5 bg-bg-subtle/30 dark:bg-dark-card/40 border border-border/50 dark:border-dark-border/60 text-text-primary text-xs rounded-2xl outline-none transition-all duration-300 focus:bg-white dark:focus:bg-dark-card focus:border-primary focus:ring-4 focus:ring-primary/5 font-bold shadow-inner-sm resize-none"
                    placeholder="Nhập địa chỉ chi tiết…"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-border/40 dark:border-dark-border/40">
                <div className="flex items-center text-text-tertiary">
                   <FiShield className="mr-2 text-success" />
                   <span className="text-[10px] font-bold uppercase italic">* Dữ liệu được bảo mật toàn diện</span>
                </div>
                <Button
                  type="submit"
                  isLoading={loading}
                  className="h-12 px-10 shadow-primary/30 rounded-2xl"
                  leftIcon={<FiSave />}
                >
                  {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc chắn muốn rời khỏi hệ thống? Phiên làm việc hiện tại sẽ kết thúc."
        confirmText="Đăng xuất"
        variant="danger"
      />

      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Bảo mật tài khoản"
        size="sm"
      >
        <form onSubmit={handleChangePassword} className="flex flex-col gap-y-6 p-2">
          <div className="flex flex-col items-center mb-6">
            <div className="size-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-3 shadow-inner-sm">
              <FiLock size={32} />
            </div>
            <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest text-center max-w-[200px]">
              Vui lòng nhập mật khẩu hiện tại để xác minh danh tính
            </p>
          </div>
          
          <Input
            label="Mật khẩu hiện tại"
            type="password"
            required
            value={passwordData.oldPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
            placeholder="••••••••"
          />
          <Input
            label="Mật khẩu mới"
            type="password"
            required
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
            placeholder="••••••••"
          />
          <Input
            label="Xác nhận mật khẩu mới"
            type="password"
            required
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            placeholder="••••••••"
          />
          
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              type="button"
              className="flex-1 h-12 rounded-2xl"
              onClick={() => setShowPasswordModal(false)}
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              isLoading={loading}
              className="flex-1 h-12 rounded-2xl shadow-primary/30"
            >
              Cập nhật
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        title="Lịch sử hoạt động"
        size="md"
      >
        <div className="flex flex-col gap-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {activityLogs.length > 0 ? (
            activityLogs.map((log) => (
              <div key={log.id || log.createdAt} className="flex items-start gap-x-4 p-4 rounded-2xl bg-bg-subtle/30 dark:bg-white/[0.02] border border-border/40 dark:border-dark-border/40 hover:bg-white dark:hover:bg-dark-card transition-all group">
                <div className={cn(
                  "size-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110",
                  log.change_type === "IMPORT" ? "bg-success/10 text-success" : 
                  log.change_type === "EXPORT" ? "bg-error/10 text-error" : "bg-info/10 text-info"
                )}>
                  {log.change_type === "IMPORT" ? <FiArrowDownLeft size={20} /> : 
                   log.change_type === "EXPORT" ? <FiArrowUpRight size={20} /> : <FiClock size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-xs font-black text-text-primary uppercase tracking-tight truncate">
                      {log.stock?.product?.name || "Sản phẩm hệ thống"}
                    </h4>
                    <span className="text-[10px] font-bold text-text-tertiary whitespace-nowrap bg-bg-subtle dark:bg-white/5 px-2 py-0.5 rounded-lg">
                      {new Date(log.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <Badge variant={log.change_type === "IMPORT" ? "success" : log.change_type === "EXPORT" ? "error" : "info"} size="sm">
                      {log.change_type}
                    </Badge>
                    <span className="text-[11px] font-bold text-text-secondary">
                      Số lượng: <span className={cn(log.quantity > 0 ? "text-success" : "text-error")}>
                        {log.quantity > 0 ? `+${log.quantity}` : log.quantity}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 opacity-30">
              <FiPackage size={48} className="mx-auto mb-4" />
              <p className="text-xs font-black uppercase tracking-widest">Không có lịch sử hoạt động</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
