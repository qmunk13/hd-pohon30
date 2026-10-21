import React, { useState } from 'react';
import { TreePine, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { UserAccount } from '../types';

interface LoginViewProps {
  onLogin: (username: string, password: string, remember: boolean) => Promise<{ success: boolean; message: string }>;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await onLogin(username.trim(), password, rememberMe);
      if (!res.success) {
        setErrorMsg(res.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const setPreset = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-100 via-teal-50/40 to-emerald-100/50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 sm:p-10 transition-all">
        
        {/* Brand Logo & Name */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-600/30 mb-4">
            <TreePine className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
            HD Pohon
          </h1>
          <p className="text-xs uppercase tracking-widest text-teal-700 font-semibold mt-1">
            Sistem Manajemen Stok & Sewa Dekorasi
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Masuk untuk mengelola katalog pohon artifisial, rental pelaminan, dan kontrol barang kembali
          </p>
        </div>

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin atau kasir"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 transition"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 border-slate-300"
              />
              <span>Ingat di browser ini</span>
            </label>
            <span className="text-[11px] text-teal-700 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Multi-User Role</span>
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-lg shadow-teal-600/25 hover:shadow-teal-600/35 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Memverifikasi...' : 'Masuk ke Sistem'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Fill Buttons */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="text-[11px] text-slate-400 text-center mb-2 font-medium">
            Akun Coba Demo:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPreset('admin', 'admin123')}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-semibold text-slate-700 transition cursor-pointer"
            >
              👑 Login Admin
            </button>
            <button
              type="button"
              onClick={() => setPreset('kasir', 'kasir123')}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-semibold text-slate-700 transition cursor-pointer"
            >
              🏷️ Login Staff Kasir
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[11px] text-slate-400">
            HD Pohon • Light Mode Google Spreadsheet Edition
          </p>
        </div>

      </div>
    </div>
  );
};
