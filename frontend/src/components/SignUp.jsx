import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { SignUpUser } from "../API/user/userApi";

// Common Components
import Button from "./common/Button";
import Input from "./common/Input";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const access_token = useSelector((state) => state.user.access_token);

  if (access_token) {
    return <Navigate to="/" replace />;
  }

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      return setError("Vui lòng nhập đầy đủ thông tin!");
    }
    if (password !== confirmPassword) {
      return setError("Mật khẩu xác nhận không khớp!");
    }

    setIsLoading(true);
    setError("");

    try {
      const dataToSend = { email, password, confirmPassword };
      const data = await SignUpUser(dataToSend);
      if (data?.errCode === 0) {
        toast.success("Tạo tài khoản thành công!");
        navigate("/sign-in");
      } else {
        const failMsg = data.message || "Đăng ký thất bại";
        setError(failMsg);
        toast.error(failMsg);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Đăng ký thất bại.";
      toast.error(errorMsg);
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-bg-light/50 dark:bg-dark-bg min-h-screen flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-500">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-primary/10 dark:bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 dark:bg-accent/20 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="w-full max-w-md bg-white/70 dark:bg-dark-card/70 backdrop-blur-2xl shadow-soft-xl rounded-[2.5rem] p-10 border border-white/40 dark:border-dark-border/40 relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="flex flex-col items-center mb-10">
          <div className="size-20 bg-primary rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary/40 mb-6 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
            <svg
              className="size-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-semibold text-text-primary tracking-tighter text-center leading-tight">
            Tạo tài khoản <br />
          </h1>
          <p className="text-text-secondary mt-3 font-semibold tracking-tight text-center">
            Gia nhập đội ngũ Smart WMS
          </p>
        </div>

        <form
          className="flex flex-col gap-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignUp();
          }}
        >
          <Input
            label="Địa chỉ Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
            disabled={isLoading}
            leftIcon={
              <svg
                className="size-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            }
          />

          <div className="relative">
            <Input
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu…"
              required
              disabled={isLoading}
              leftIcon={
                <svg
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              }
              rightIcon={
                <button
                  type="button"
                  className="text-text-tertiary hover:text-primary transition-colors focus:outline-none"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ? (
                    <svg
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              }
            />
          </div>

          <div className="relative">
            <Input
              label="Xác nhận mật khẩu"
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu…"
              required
              disabled={isLoading}
              leftIcon={
                <svg
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              }
              rightIcon={
                <button
                  type="button"
                  className="text-text-tertiary hover:text-primary transition-colors focus:outline-none"
                  onClick={() => setShowConfirm(prev => !prev)}
                >
                  {showConfirm ? (
                    <svg
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              }
            />
          </div>

          {error && (
            <div className="text-error text-xs font-black bg-error/10 p-4 rounded-2xl border border-error/20 animate-shake">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full py-4 text-base font-black tracking-tight"
            size="lg"
            variant="primary"
            isLoading={isLoading}
          >
            Đăng ký tài khoản
          </Button>

          <p className="text-sm text-center text-text-secondary font-medium mt-6">
            Bạn đã có tài khoản?{" "}
            <span
              onClick={() => navigate("/sign-in")}
              className="text-primary font-black hover:text-primary-dark transition-colors cursor-pointer"
            >
              Đăng nhập ngay
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
