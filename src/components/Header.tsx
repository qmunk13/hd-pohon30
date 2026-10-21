import React from 'react';
import { 
  TreePine, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  RotateCcw, 
  FileText, 
  Code2, 
  LogOut,
  ExternalLink,
  Flower2,
  Globe
} from 'lucide-react';
import { UserAccount } from '../types';

interface HeaderProps {
  currentTab: string;
  setTab: (tab: string) => void;
  user: UserAccount | null;
  onLogout: () => void;
  onOpenGasCode: () => void;
  onOpenPublicPortal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setTab,
  user,
  onLogout,
  onOpenGasCode,
  onOpenPublicPortal
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'katalog', label: 'Katalog Pohon', icon: TreePine },
    { id: 'database', label: 'Database Barang', icon: Flower2 },
    { id: 'sewa', label: 'Sewa Baru', icon: ShoppingCart },
    { id: 'kembali', label: 'Pengembalian Pintar', icon: RotateCcw },
    { id: 'riwayat', label: 'Laporan & Mutasi', icon: FileText }
  ];

  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setTab('dashboard')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-700 text-white flex items-center justify-center shadow-md shadow-teal-600/20">
              <TreePine className="w-6 h-6" />
            </div>
            <div>
              <div className="font-serif font-bold text-slate-900 text-base leading-tight tracking-tight flex items-center gap-1.5">
                <span>HD Pohon</span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-sans font-bold bg-teal-100 text-teal-800">Admin</span>
              </div>
              <div className="text-[11px] font-semibold tracking-wider text-teal-700 uppercase">
                Sistem Manajemen Stok & Sewa
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    isActive
                      ? 'text-teal-800 bg-teal-50 border border-teal-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action buttons & User profile */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* View Public Portal Button */}
            <button
              onClick={onOpenPublicPortal}
              title="Buka Halaman Portal Publik (Tanpa Login)"
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-emerald-200 transition cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Portal Publik</span>
            </button>

            {/* GAS Code Button */}
            <button
              onClick={onOpenGasCode}
              title="Lihat & Salin Kode Google Apps Script"
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden sm:inline">Kode GAS</span>
            </button>

            {/* Active User */}
            {user && (
              <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px]">{user.namaLengkap}</span>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={onLogout}
              title="Keluar"
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
