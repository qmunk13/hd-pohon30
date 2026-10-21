import React, { useState } from 'react';
import { X, Lock, User, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';
import { UserSession, APP_LOGO } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: UserSession) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const u = username.trim().toLowerCase();
      const p = password.trim();

      if (u === 'admin' && p === 'admin123') {
        onLoginSuccess({
          username: 'admin',
          namaLengkap: 'Administrator HD Pohon',
          role: 'ADMINISTRATOR',
          isLoggedIn: true,
        });
        onClose();
      } else if (u === 'kasir' && p === 'kasir123') {
        onLoginSuccess({
          username: 'kasir',
          namaLengkap: 'Staff Rental HD Pohon',
          role: 'STAFF_GUDANG',
          isLoggedIn: true,
        });
        onClose();
      } else {
        setErrorMsg('Username atau password salah! Gunakan akun terdaftar di Sheet USERS.');
      }
      setIsLoading(false);
    }, 400);
  };

  const setDemo = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMsg('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-md p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <img 
            src={APP_LOGO} 
            alt="HD-Pohon Logo" 
            className="w-16 h-16 object-contain mx-auto mb-3 drop-shadow-md" 
          />
          <h3 className="text-xl font-serif font-bold text-slate-900">Masuk Portal</h3>
          <p className="text-xs text-slate-500 mt-1">
            Akses sistem manajemen stok pohon, sewa keluar, dan integrasi Google Drive
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Username Pengguna</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin / kasir"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="p-3 bg-teal-50/70 border border-teal-100 rounded-xl text-[11px] text-teal-900 space-y-1.5">
            <div className="font-bold flex items-center gap-1 text-teal-800">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Akun Demo Cepat (Sesuai Sheet USERS):</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDemo('admin', 'admin123')}
                className="px-2.5 py-1 bg-white border border-teal-200 rounded-lg text-teal-800 hover:bg-teal-100 font-semibold"
              >
                👤 Admin (admin123)
              </button>
              <button
                type="button"
                onClick={() => setDemo('kasir', 'kasir123')}
                className="px-2.5 py-1 bg-white border border-teal-200 rounded-lg text-teal-800 hover:bg-teal-100 font-semibold"
              >
                📦 Staff (kasir123)
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-800/20 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isLoading ? 'Memverifikasi...' : 'Masuk ke Sistem'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
