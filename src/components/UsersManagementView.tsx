import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  Plus,
  Shield,
  Mail,
  Phone,
  Trash2,
  Edit2,
  CheckCircle2,
  X,
  Search,
  Lock,
} from 'lucide-react';
import { UserAccount } from '../types';
import { SyncService } from '../services/syncService';
import { TablePagination } from './TablePagination';

interface UsersManagementViewProps {
  usersList: UserAccount[];
  onAddUser: (user: Omit<UserAccount, 'id' | 'createdAt'>) => void;
  onEditUser: (user: UserAccount) => void;
  onToggleUserStatus: (id: string) => void;
  onDeleteUser: (id: string) => void;
}

export const UsersManagementView: React.FC<UsersManagementViewProps> = ({
  usersList,
  onAddUser,
  onEditUser,
  onToggleUserStatus,
  onDeleteUser,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Add form states
  const [username, setUsername] = useState('');
  const [namaLengkap, setNamaLengkap] = useState('');
  const [role, setRole] = useState<'ADMINISTRATOR' | 'STAFF_GUDANG' | 'KASIR_RENTAL' | 'DRIVER_LOGISTIK'>('STAFF_GUDANG');
  const [email, setEmail] = useState('');
  const [noHp, setNoHp] = useState('');

  // Edit form states
  const [editNama, setEditNama] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editRole, setEditRole] = useState<'ADMINISTRATOR' | 'STAFF_GUDANG' | 'KASIR_RENTAL' | 'DRIVER_LOGISTIK'>('STAFF_GUDANG');
  const [editEmail, setEditEmail] = useState('');
  const [editNoHp, setEditNoHp] = useState('');
  const [editStatus, setEditStatus] = useState(true);

  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      const q = searchQuery.toLowerCase();
      return (
        (u.namaLengkap || '').toLowerCase().includes(q) ||
        (u.username || '').toLowerCase().includes(q) ||
        (u.role || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.noHp || '').includes(q)
      );
    });
  }, [usersList, searchQuery]);

  const pageSize = 12;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !namaLengkap.trim()) return;

    onAddUser({
      username: username.trim().toLowerCase(),
      namaLengkap: namaLengkap.trim(),
      role,
      email: email.trim() || `${username.toLowerCase()}@hasandekor.com`,
      noHp: noHp.trim() || '08123456789',
      statusAktif: true,
    });

    setUsername('');
    setNamaLengkap('');
    setEmail('');
    setNoHp('');
    setShowAddModal(false);
  };

  const openEditModal = (u: UserAccount) => {
    setEditingUser(u);
    setEditNama(u.namaLengkap || '');
    setEditUsername(u.username || '');
    setEditRole((u.role as any) || 'STAFF_GUDANG');
    setEditEmail(u.email || '');
    setEditNoHp(u.noHp || '');
    setEditStatus(Boolean(u.statusAktif));
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editNama.trim() || !editUsername.trim()) return;

    onEditUser({
      ...editingUser,
      namaLengkap: editNama.trim(),
      username: editUsername.trim().toLowerCase(),
      role: editRole,
      email: editEmail.trim(),
      noHp: editNoHp.trim(),
      statusAktif: editStatus,
    });

    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <UserCheck className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase font-bold tracking-wider text-teal-400">
              Manajemen Hak Akses &bull; Sheet USERS
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-white mt-1">
            Pengguna &amp; Staff Operasional
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelola akun petugas kasir, staff gudang, dan driver logistik yang bertugas mengantar pohon pelaminan &amp; event.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari nama, role, username..."
              className="pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 w-48 sm:w-60"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-teal-500/20 transition cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pengguna</span>
          </button>
        </div>
      </div>

      {/* Grid of Users (12 items per page) */}
      {paginatedUsers.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400 text-xs">
          Tidak ada pengguna yang sesuai dengan pencarian.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {paginatedUsers.map((u) => (
            <div
              key={u.id}
              className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 shadow-md hover:border-slate-700 transition flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl ${
                      u.role === 'ADMINISTRATOR'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : u.role === 'KASIR_RENTAL'
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                        : u.role === 'STAFF_GUDANG'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {u.role === 'ADMINISTRATOR' ? '👑' : u.role === 'KASIR_RENTAL' ? '💼' : u.role === 'STAFF_GUDANG' ? '📦' : '🚚'}
                  </span>

                  <button
                    onClick={() => onToggleUserStatus(u.id || '')}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition ${
                      u.statusAktif
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {u.statusAktif ? '● Aktif' : '○ Non-Aktif'}
                  </button>
                </div>

                <h3 className="font-bold text-base text-white group-hover:text-teal-300 transition-colors">
                  {u.namaLengkap}
                </h3>
                <div className="text-xs font-mono text-teal-400 mt-0.5">
                  @{u.username}
                </div>

                <div className="mt-2 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-950 border border-slate-800 text-slate-300">
                  {u.role.replace(/_/g, ' ')}
                </div>

                <div className="space-y-1.5 text-xs text-slate-400 pt-3 border-t border-slate-800/80 mt-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">{u.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{u.noHp}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">
                    Terdaftar: {SyncService.formatTanggalIndo(u.createdAt || '', false)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => openEditModal(u)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Edit</span>
                </button>

                {u.username !== 'admin' && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus akun user @${u.username}?`)) {
                        onDeleteUser(u.id || '');
                      }
                    }}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-red-950/80 text-slate-400 hover:text-red-400 transition cursor-pointer"
                    title="Hapus Akun Pengguna"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination (12 items per page) */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden">
        <TablePagination
          currentPage={currentPage}
          totalItems={filteredUsers.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Modal Tambah User */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-teal-400" />
                Tambah Pengguna / Staff Baru
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Nama Lengkap Staff <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Username Login <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="budisantoso"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Hak Akses / Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="STAFF_GUDANG">Staff Gudang</option>
                    <option value="KASIR_RENTAL">Kasir Rental</option>
                    <option value="DRIVER_LOGISTIK">Driver Logistik</option>
                    <option value="ADMINISTRATOR">Administrator</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="budi@hasandekor.com"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    No. Handphone / WA
                  </label>
                  <input
                    type="text"
                    value={noHp}
                    onChange={(e) => setNoHp(e.target.value)}
                    placeholder="085712340099"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Simpan Pengguna Baru
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit User */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-teal-400" />
                Edit Pengguna (@{editingUser.username})
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Nama Lengkap Staff <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editNama}
                  onChange={(e) => setEditNama(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Username Login <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Hak Akses / Role
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="STAFF_GUDANG">Staff Gudang</option>
                    <option value="KASIR_RENTAL">Kasir Rental</option>
                    <option value="DRIVER_LOGISTIK">Driver Logistik</option>
                    <option value="ADMINISTRATOR">Administrator</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    No. Handphone / WA
                  </label>
                  <input
                    type="text"
                    value={editNoHp}
                    onChange={(e) => setEditNoHp(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="statusAktifUser"
                  checked={editStatus}
                  onChange={(e) => setEditStatus(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-500 bg-slate-950 border-slate-800 focus:ring-0"
                />
                <label htmlFor="statusAktifUser" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  Akun Aktif (Dapat Login ke Sistem)
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Simpan Perubahan
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
