import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { FiLock, FiCheckCircle, FiShield } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axiosInstance from '../../API/utils/axiosInstance';

const PinSetupModal = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const handleNext = () => {
    if (pin.length !== 6) {
      toast.error("Mã PIN phải có 6 chữ số");
      return;
    }
    setStep(2);
  };

  const handleSave = async () => {
    if (pin !== confirmPin) {
      toast.error("Mã PIN xác nhận không khớp");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post('/pin/set', { pin });
      if (res.data.success) {
        toast.success("Thiết lập mã PIN bảo mật thành công!");
        setStep(3);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi thiết lập PIN");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPin('');
    setConfirmPin('');
    setStep(1);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={reset}
      title="Thiết lập Mã PIN Bảo mật"
      size="sm"
    >
      <div className="p-2 space-y-6">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-4">
              <FiLock size={32} />
            </div>
            <div>
              <h3 className="text-lg font-black text-text-primary uppercase tracking-tight">Tạo mã PIN mới</h3>
              <p className="text-xs text-text-secondary font-medium mt-2 leading-relaxed px-4">
                Mã PIN này sẽ được yêu cầu cho các thao tác quan trọng trong hệ thống.
              </p>
            </div>
            
            <div className="max-w-[200px] mx-auto">
               <Input 
                type="password" 
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="••••••"
                className="text-center text-2xl tracking-[0.5em] font-black h-16 bg-white border-primary shadow-lg shadow-primary/5"
                autoFocus
               />
            </div>

            <Button className="w-full h-12 rounded-2xl" onClick={handleNext}>Tiếp tục</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 text-center">
             <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-4">
              <FiShield size={32} />
            </div>
            <div>
              <h3 className="text-lg font-black text-text-primary uppercase tracking-tight">Xác nhận mã PIN</h3>
              <p className="text-xs text-text-secondary font-medium mt-2 leading-relaxed px-4">
                Vui lòng nhập lại mã PIN một lần nữa để đảm bảo tính chính xác.
              </p>
            </div>

            <div className="max-w-[200px] mx-auto">
               <Input 
                type="password" 
                maxLength={6}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="••••••"
                className="text-center text-2xl tracking-[0.5em] font-black h-16 bg-white border-primary shadow-lg shadow-primary/5"
                autoFocus
               />
            </div>

            <div className="flex gap-3 pt-4">
               <Button variant="outline" className="flex-1 h-12 rounded-2xl" onClick={() => setStep(1)}>Quay lại</Button>
               <Button className="flex-[2] h-12 rounded-2xl" onClick={handleSave} isLoading={loading}>Xác nhận & Lưu</Button>
            </div>
          </div>
        )}

        {step === 3 && (
           <div className="space-y-6 animate-in zoom-in duration-500 text-center py-6">
              <div className="w-20 h-20 bg-success/10 rounded-[2.5rem] flex items-center justify-center text-success mx-auto mb-4 shadow-xl shadow-success/10 border-4 border-success/5">
                <FiCheckCircle size={40} className="animate-in zoom-in spin-in-12 duration-700" />
              </div>
              <div>
                <h3 className="text-xl font-black text-text-primary uppercase tracking-tight">Thiết lập thành công!</h3>
                <p className="text-sm text-text-secondary font-semibold mt-2">
                  Mã PIN bảo mật của bạn đã được kích hoạt.
                </p>
              </div>
              <Button className="w-full h-12 rounded-2xl shadow-success/30" variant="success" onClick={onClose}>Đóng</Button>
           </div>
        )}
      </div>
    </Modal>
  );
};

export default PinSetupModal;
