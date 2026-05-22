import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { FiSmartphone, FiShield, FiCheckCircle, FiCopy, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axiosInstance from '../../API/utils/axiosInstance';

const TwoFactorSetupModal = ({ isOpen, onClose, onSuccess }) => {
  const [step, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [otp, setOtp] = useState('');

  const fetchSetup = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/2fa/setup');
      if (res.data.success) {
        setQrCode(res.data.qrCode);
        setSecret(res.data.secret);
      }
    } catch (err) {
      toast.error("Không thể khởi tạo thiết lập 2FA");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSetup();
      setActiveStep(1);
    }
  }, [isOpen]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Vui lòng nhập mã OTP 6 chữ số");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post('/2fa/verify', { token: otp });
      if (res.data.success) {
        toast.success("Đã kích hoạt bảo mật 2 lớp thành công!");
        setActiveStep(3);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Mã xác thực không đúng");
    } finally {
      setLoading(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    toast.info("Đã sao chép mã bí mật");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thiết lập bảo mật 2 lớp (2FA)"
      size="md"
    >
      <div className="p-2 space-y-6">
        {/* Progress Tracker */}
        <div className="flex items-center justify-between px-10 relative">
           <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-border/40 -translate-y-1/2 z-0" />
           {[1, 2, 3].map((s) => (
             <div 
              key={s} 
              className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs z-10 transition-all duration-500 ${
                step >= s ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-bg-subtle text-text-tertiary"
              }`}
             >
               {step > s ? <FiCheckCircle /> : s}
             </div>
           ))}
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-4">
              <FiSmartphone size={32} />
            </div>
            <div>
              <h3 className="text-lg font-black text-text-primary uppercase tracking-tight">Quét mã QR</h3>
              <p className="text-xs text-text-secondary font-medium mt-2 leading-relaxed">
                Sử dụng ứng dụng xác thực (Google Authenticator, Microsoft Authenticator) để quét mã QR bên dưới.
              </p>
            </div>
            
            <div className="p-4 bg-white rounded-[2.5rem] border-4 border-primary/5 shadow-inner-lg inline-block mx-auto">
               {qrCode ? (
                 <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
               ) : (
                 <div className="w-48 h-48 flex items-center justify-center text-text-tertiary">
                    <FiRefreshCw className="animate-spin" size={24} />
                 </div>
               )}
            </div>

            <div className="p-4 rounded-2xl bg-bg-subtle/50 border border-border/40 text-left">
               <p className="text-[9px] font-black text-text-tertiary uppercase mb-2 ml-1">Hoặc nhập mã thủ công</p>
               <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-border/40 shadow-sm">
                  <code className="text-xs font-black text-primary tracking-widest">{secret}</code>
                  <button onClick={copySecret} className="text-text-tertiary hover:text-primary p-1">
                    <FiCopy size={16} />
                  </button>
               </div>
            </div>

            <Button className="w-full h-12 rounded-2xl" onClick={() => setActiveStep(2)}>Tôi đã quét xong</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 text-center">
             <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-4">
              <FiShield size={32} />
            </div>
            <div>
              <h3 className="text-lg font-black text-text-primary uppercase tracking-tight">Xác thực mã OTP</h3>
              <p className="text-xs text-text-secondary font-medium mt-2 leading-relaxed">
                Nhập mã 6 chữ số từ ứng dụng xác thực của bạn để hoàn tất thiết lập.
              </p>
            </div>

            <div className="max-w-[200px] mx-auto">
               <Input 
                type="text" 
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="000000"
                className="text-center text-2xl tracking-[0.5em] font-black h-16 bg-white border-primary shadow-lg shadow-primary/5"
               />
            </div>

            <div className="flex gap-3 pt-4">
               <Button variant="outline" className="flex-1 h-12 rounded-2xl" onClick={() => setActiveStep(1)}>Quay lại</Button>
               <Button className="flex-2 h-12 rounded-2xl px-10" onClick={handleVerify} isLoading={loading}>Xác nhận kích hoạt</Button>
            </div>
          </div>
        )}

        {step === 3 && (
           <div className="space-y-6 animate-in zoom-in duration-500 text-center py-6">
              <div className="w-20 h-20 bg-success/10 rounded-[2.5rem] flex items-center justify-center text-success mx-auto mb-4 shadow-xl shadow-success/10 border-4 border-success/5">
                <FiCheckCircle size={40} className="animate-in zoom-in spin-in-12 duration-700" />
              </div>
              <div>
                <h3 className="text-xl font-black text-text-primary uppercase tracking-tight">Thành công!</h3>
                <p className="text-sm text-text-secondary font-semibold mt-2">
                  Tài khoản của bạn đã được bảo vệ bởi lớp bảo mật thứ hai.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-success/5 border border-success/20 text-xs font-bold text-success/80 leading-relaxed italic">
                Từ giờ, bạn sẽ cần nhập mã OTP mỗi khi đăng nhập vào hệ thống. Hãy giữ ứng dụng xác thực của bạn an toàn.
              </div>
              <Button className="w-full h-12 rounded-2xl shadow-success/30" variant="success" onClick={onClose}>Hoàn tất</Button>
           </div>
        )}
      </div>
    </Modal>
  );
};

export default TwoFactorSetupModal;
