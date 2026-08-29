import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Phone, AlertCircle, CheckCircle2, Loader2, Info, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithIdentifier, signUpWithDetails, validateVietnamesePhone } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state (4 mandatory fields + 1 optional checkbox)
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [wantOpenShop, setWantOpenShop] = useState(false);

  // Status state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetForm();

    if (!loginIdentifier.trim() || !loginPassword) {
      setErrorMsg('Vui lòng nhập đầy đủ SĐT/Gmail và Mật khẩu.');
      return;
    }

    setLoading(true);
    const { error } = await signInWithIdentifier(loginIdentifier, loginPassword);
    setLoading(false);

    if (error) {
      if (error.message.includes('Invalid login credentials') || error.message.includes('Invalid credentials')) {
        setErrorMsg('Tài khoản (SĐT/Gmail) hoặc Mật khẩu không chính xác.');
      } else {
        setErrorMsg(error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      }
    } else {
      setSuccessMsg('Đăng nhập thành công!');
      setTimeout(() => {
        onClose();
        resetForm();
      }, 1000);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetForm();

    if (!regFullName.trim() || !regPhone.trim() || !regEmail.trim() || !regPassword) {
      setErrorMsg('Vui lòng điền đầy đủ cả 4 thông tin: Họ và Tên, SĐT, Gmail và Mật khẩu.');
      return;
    }

    const cleanPhone = regPhone.replace(/[\s\-\.]/g, '');
    if (!validateVietnamesePhone(cleanPhone)) {
      setErrorMsg('Số điện thoại phải đúng dạng số Việt Nam 10 chữ số (ví dụ: 0988123456 hoặc 0351234567).');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('Mật khẩu phải chứa ít nhất 6 ký tự.');
      return;
    }

    setLoading(true);
    const { error, applicationCreated } = await signUpWithDetails(
      regFullName,
      cleanPhone,
      regEmail,
      regPassword,
      wantOpenShop
    );
    setLoading(false);

    if (error) {
      setErrorMsg(error.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại.');
    } else {
      if (applicationCreated) {
        setSuccessMsg('Đăng ký tài khoản Buyer thành công! Hồ sơ Mở Shop của bạn đã được khởi tạo và đang chờ Admin phê duyệt (Admin Review).');
      } else {
        setSuccessMsg('Đăng ký tài khoản Người mua (Buyer) thành công! Đã xác minh SĐT & Gmail hợp lệ.');
      }
      setTimeout(() => {
        setActiveTab('login');
        setLoginIdentifier(cleanPhone);
        resetForm();
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative border border-gray-100 max-h-[90vh] flex flex-col min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
          <div className="flex gap-6">
            <button 
              type="button"
              onClick={() => { setActiveTab('login'); resetForm(); }} 
              className={`font-bold text-base pb-1 transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 font-extrabold'
                  : 'text-gray-400 hover:text-gray-600 border-b-2 border-transparent'
              }`}
            >
              Đăng nhập
            </button>
            <button 
              type="button"
              onClick={() => { setActiveTab('register'); resetForm(); }} 
              className={`font-bold text-base pb-1 transition-all cursor-pointer ${
                activeTab === 'register'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 font-extrabold'
                  : 'text-gray-400 hover:text-gray-600 border-b-2 border-transparent'
              }`}
            >
              Đăng ký tài khoản
            </button>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Status Alerts */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-start gap-2 break-words">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span className="leading-snug">{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-start gap-2 break-words">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span className="leading-snug">{successMsg}</span>
            </div>
          )}

          {/* Form Đăng nhập (SĐT hoặc Gmail) */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Số điện thoại hoặc Gmail *
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    required 
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="0988123456 hoặc user@gmail.com" 
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mật khẩu *</label>
                <div className="relative">
                  <input 
                    type="password" 
                    required 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-1.5 text-gray-600 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" /> 
                  <span>Ghi nhớ đăng nhập</span>
                </label>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Vui lòng liên hệ hỗ trợ hoặc đăng ký tài khoản mới bằng SĐT/Gmail.'); }} className="text-indigo-600 hover:underline font-medium">
                  Quên mật khẩu?
                </a>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl shadow-md shadow-indigo-200 transition text-sm flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang kiểm tra tài khoản...</span>
                  </>
                ) : (
                  <span>Đăng nhập</span>
                )}
              </button>

              {/* QUICK DEMO LOGIN ACCOUNTS PICKER */}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <span className="block text-[11px] font-black text-gray-500 uppercase tracking-wider text-center">
                  ⚡ Nút Đăng Nhập Nhanh Tài Khoản Thử Nghiệm (Demo Accounts)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginIdentifier('0988123456');
                      setLoginPassword('123456');
                      signInWithIdentifier('0988123456', '123456').then(() => {
                        setSuccessMsg('🎉 Đã đăng nhập thành công Tài khoản Demo Shop!');
                        setTimeout(() => { onClose(); resetForm(); }, 800);
                      });
                    }}
                    className="p-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-left cursor-pointer transition flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-1 font-black text-xs">
                      <Store className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>🏪 Demo Shop</span>
                    </div>
                    <span className="text-[10px] text-amber-800 font-bold block pt-0.5 truncate">0988123456</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginIdentifier('0367818343');
                      setLoginPassword('123456');
                      signInWithIdentifier('0367818343', '123456').then(() => {
                        setSuccessMsg('👑 Đã đăng nhập thành công Tài khoản Super Admin!');
                        setTimeout(() => { onClose(); resetForm(); }, 800);
                      });
                    }}
                    className="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-300 rounded-xl text-left cursor-pointer transition flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-1 font-black text-xs">
                      <UserIcon className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>👑 Admin Sàn</span>
                    </div>
                    <span className="text-[10px] text-indigo-800 font-bold block pt-0.5 truncate">0367818343</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginIdentifier('0911223344');
                      setLoginPassword('123456');
                      signInWithIdentifier('0911223344', '123456').then(() => {
                        setSuccessMsg('🆘 Đã đăng nhập thành công Trực Cứu Hộ 24/7!');
                        setTimeout(() => { onClose(); resetForm(); }, 800);
                      });
                    }}
                    className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300 rounded-xl text-left cursor-pointer transition flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-1 font-black text-xs">
                      <Phone className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>🆘 Trực 24/7</span>
                    </div>
                    <span className="text-[10px] text-rose-800 font-bold block pt-0.5 truncate">0911223344</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Form Đăng ký */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-[11px] text-indigo-800 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <span>Chỉ đăng ký thành công khi Số điện thoại và Gmail chưa từng tồn tại trên hệ thống.</span>
              </div>

              {/* 1. Họ và Tên */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Họ và Tên *</label>
                <div className="relative">
                  <input 
                    type="text" 
                    required 
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="Nguyễn Văn A" 
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* 2. Số điện thoại chuẩn Việt Nam */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Số điện thoại (Đúng định dạng Việt Nam) *
                </label>
                <div className="relative">
                  <input 
                    type="tel" 
                    required 
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="0988123456 hoặc 0351234567" 
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* 3. Gmail / Email */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Gmail / Email *</label>
                <div className="relative">
                  <input 
                    type="email" 
                    required 
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="user@gmail.com" 
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* 4. Mật khẩu */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mật khẩu *</label>
                <div className="relative">
                  <input 
                    type="password" 
                    required 
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự" 
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* PHẦN CUỐI FORM: "Bạn muốn đăng ký thêm?" -> ☐ Đăng ký mở Shop */}
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <label className="block text-xs font-extrabold text-gray-900">
                  Bạn muốn đăng ký thêm?
                </label>

                <div className={`p-3 rounded-xl border transition-all ${
                  wantOpenShop 
                    ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-100' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={wantOpenShop}
                      onChange={(e) => setWantOpenShop(e.target.checked)}
                      className="mt-0.5 rounded border-gray-300 text-amber-600 focus:ring-amber-500 w-4 h-4 shrink-0"
                    />
                    <div className="text-xs">
                      <span className="font-extrabold text-gray-900 flex items-center gap-1.5">
                        <Store className="w-4 h-4 text-amber-600 shrink-0" />
                        Đăng ký mở Shop (Merchant)
                      </span>
                      <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                        {wantOpenShop ? (
                          <strong className="text-amber-800 font-bold block">
                            Tạo hồ sơ mở Shop (Merchant Application) gửi Admin phê duyệt (Admin Review).
                          </strong>
                        ) : (
                          <span>Tài khoản khởi tạo: <strong>Người mua (Buyer)</strong>. Tích chọn nếu muốn đăng ký bán hàng.</span>
                        )}
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl shadow-md shadow-indigo-200 transition text-sm flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang khởi tạo tài khoản...</span>
                  </>
                ) : (
                  <span>Tạo tài khoản ngay</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
