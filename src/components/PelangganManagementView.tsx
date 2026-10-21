import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Phone,
  MapPin,
  Sparkles,
  MessageCircle,
  ShoppingCart,
  Trash2,
  Crown,
  Edit2,
  Search,
  X,
  User,
} from 'lucide-react';
import { Pelanggan } from '../types';
import { SyncService } from '../services/syncService';
import { TablePagination } from './TablePagination';

interface PelangganManagementViewProps {
  pelangganList: Pelanggan[];
  onAddPelanggan: (pelanggan: Omit<Pelanggan, 'id' | 'createdAt'>) => void;
  onEditPelanggan: (pelanggan: Pelanggan) => void;
  onDeletePelanggan: (id: string) => void;
  onSelectForRental: (pelanggan: Pelanggan) => void;
}

export const PelangganManagementView: React.FC<PelangganManagementViewProps> = ({
  pelangganList,
  onAddPelanggan,
  onEditPelanggan,
  onDeletePelanggan,
  onSelectForRental,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPelanggan, setEditingPelanggan] = useState<Pelanggan | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTipe, setSelectedTipe] = useState('SEMUA');
  const [currentPage, setCurrentPage] = useState(1);

  // Add form states
  const [namaPelanggan, setNamaPelanggan] = useState('');
  const [tipe, setTipe] = useState<'Wedding Organizer' | 'Perias / MUA' | 'Hotel / Venue' | 'Klien Langsung'>('Wedding Organizer');
  const [kontakPic, setKontakPic] = useState('');
  const [noTelepon, setNoTelepon] = useState('');
  const [alamat, setAlamat] = useState('');
  const [statusMember, setStatusMember] = useState<'VIP' | 'REGULER' | 'BARU'>('VIP');
  const [catatan, setCatatan] = useState('');

  // Edit form states
  const [editNama, setEditNama] = useState('');
  const [editTipe, setEditTipe] = useState<'Wedding Organizer' | 'Perias / MUA' | 'Hotel / Venue' | 'Klien Langsung'>('Wedding Organizer');
  const [editPic, setEditPic] = useState('');
  const [editTelp, setEditTelp] = useState('');
  const [editAlamat, setEditAlamat] = useState('');
  const [editStatusMember, setEditStatusMember] = useState<'VIP' | 'REGULER' | 'BARU'>('VIP');
  const [editCatatan, setEditCatatan] = useState('');

  const filteredPelanggan = useMemo(() => {
    return pelangganList.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        (p.namaPelanggan || p.nama || '').toLowerCase().includes(q) ||
        (p.kodePelanggan || '').toLowerCase().includes(q) ||
        (p.kontakPic || '').toLowerCase().includes(q) ||
        (p.noTelepon || '').includes(q) ||
        (p.alamat || '').toLowerCase().includes(q);

      const matchTipe = selectedTipe === 'SEMUA' || (p.tipe || p.kategori) === selectedTipe;
      return matchSearch && matchTipe;
    });
  }, [pelangganList, searchQuery, selectedTipe]);

  const pageSize = 12;
  const paginatedPelanggan = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPelanggan.slice(start, start + pageSize);
  }, [filteredPelanggan, currentPage]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaPelanggan.trim() || !noTelepon.trim()) return;

    const prefix = tipe === 'Wedding Organizer' ? 'WO' : tipe === 'Hotel / Venue' ? 'HTL' : 'KLN';
    const kodePelanggan = `${prefix}-${Math.floor(100 + Math.random() * 900)}`;

    onAddPelanggan({
      kodePelanggan,
      namaPelanggan: namaPelanggan.trim(),
      tipe,
      kontakPic: kontakPic.trim() || namaPelanggan.trim(),
      noTelepon: noTelepon.trim(),
      alamat: alamat.trim() || 'Jakarta',
      totalTransaksiSewa: 1,
      statusMember,
      catatan: catatan.trim(),
    });

    setNamaPelanggan('');
    setKontakPic('');
    setNoTelepon('');
    setAlamat('');
    setCatatan('');
    setShowAddModal(false);
  };

  const openEditModal = (plg: Pelanggan) => {
    setEditingPelanggan(plg);
    setEditNama(plg.namaPelanggan || plg.nama || '');
    setEditTipe((plg.tipe as any) || (plg.kategori as any) || 'Wedding Organizer');
    setEditPic(plg.kontakPic || '');
    setEditTelp(plg.noTelepon || '');
    setEditAlamat(plg.alamat || '');
    setEditStatusMember((plg.statusMember as any) || 'REGULER');
    setEditCatatan(plg.catatan || '');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPelanggan || !editNama.trim() || !editTelp.trim()) return;

    onEditPelanggan({
      ...editingPelanggan,
      namaPelanggan: editNama.trim(),
      tipe: editTipe,
      kontakPic: editPic.trim(),
      noTelepon: editTelp.trim(),
      alamat: editAlamat.trim(),
      statusMember: editStatusMember,
      catatan: editCatatan.trim(),
    });

    setEditingPelanggan(null);
  };

  const getWaLink = (plg: Pelanggan) => {
    const text = `Halo ${plg.kontakPic || plg.namaPelanggan}, kami dari HD Pohon (Yogyakarta). Apakah ada agenda event pernikahan/acara mendatang yang membutuhkan rental pohon artifisial atau dekorasi panggung? Kami siap support!`;
    const cleanPhone = plg.noTelepon.replace(/\D/g, '').replace(/^0/, '62');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Users className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase font-bold tracking-wider text-teal-400">
              Kemitraan Wedding &amp; Event &bull; Sheet PELANGGAN
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-white mt-1">
            Database Pelanggan, WO &amp; Event Organizer
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar mitra Wedding Organizer, perias MUA, banquet hotel, perancang pameran, dan klien langsung HD Pohon.
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
              placeholder="Cari nama, WO, kontak..."
              className="pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 w-48 sm:w-60"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-teal-500/20 transition cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pelanggan</span>
          </button>
        </div>
      </div>

      {/* Filter Tipe Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {['SEMUA', 'Wedding Organizer', 'Perias / MUA', 'Hotel / Venue', 'Klien Langsung'].map((t) => (
          <button
            key={t}
            onClick={() => {
              setSelectedTipe(t);
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedTipe === t
                ? 'bg-teal-500 text-slate-950'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Cards of Customers (12 items per page) */}
      {paginatedPelanggan.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400 text-xs">
          Tidak ada pelanggan yang sesuai dengan pencarian atau filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedPelanggan.map((plg) => (
            <div
              key={plg.id}
              className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 shadow-md hover:border-slate-700 transition flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-teal-300 bg-teal-950/80 border border-teal-500/30 px-2.5 py-0.5 rounded-full">
                    {plg.kodePelanggan}
                  </span>
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        plg.statusMember === 'VIP'
                          ? 'text-amber-300 bg-amber-950/80 border border-amber-500/30'
                          : plg.statusMember === 'REGULER'
                          ? 'text-teal-300 bg-teal-950/80 border border-teal-500/30'
                          : 'text-slate-400 bg-slate-800'
                      }`}
                    >
                      {plg.statusMember === 'VIP' && '⭐ '}Member {plg.statusMember}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-base text-white group-hover:text-teal-300 transition-colors">
                    {plg.namaPelanggan}
                  </h3>
                  <div className="text-xs text-teal-400/90 font-medium mt-0.5">
                    {plg.tipe}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400 pt-1">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>PIC: <strong className="text-slate-200">{plg.kontakPic}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{plg.noTelepon}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{plg.alamat}</span>
                  </div>
                </div>

                {plg.catatan && (
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 italic">
                    &ldquo;{plg.catatan}&rdquo;
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(plg)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                    title="Edit Data Pelanggan"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus data pelanggan ${plg.namaPelanggan}?`)) {
                        onDeletePelanggan(plg.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-red-950/80 text-slate-400 hover:text-red-400 transition cursor-pointer"
                    title="Hapus Pelanggan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onSelectForRental(plg)}
                    className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1 transition cursor-pointer"
                    title="Buat Transaksi Sewa Baru untuk Pelanggan Ini"
                  >
                    <ShoppingCart className="w-3 h-3" />
                    <span>Sewa</span>
                  </button>
                  <a
                    href={getWaLink(plg)}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition cursor-pointer"
                    title="Kirim Pesan WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-slate-950" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination (12 items per page) */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden">
        <TablePagination
          currentPage={currentPage}
          totalItems={filteredPelanggan.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Modal Tambah Pelanggan */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-400" />
                Tambah Pelanggan / WO Baru
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
                  Nama Pelanggan / WO <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={namaPelanggan}
                  onChange={(e) => setNamaPelanggan(e.target.value)}
                  placeholder="Contoh: Aris Wedding Organizer"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Tipe Kemitraan
                  </label>
                  <select
                    value={tipe}
                    onChange={(e) => setTipe(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Wedding Organizer">Wedding Organizer</option>
                    <option value="Perias / MUA">Perias / MUA</option>
                    <option value="Hotel / Venue">Hotel / Venue</option>
                    <option value="Klien Langsung">Klien Langsung</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Status Member
                  </label>
                  <select
                    value={statusMember}
                    onChange={(e) => setStatusMember(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="VIP">VIP (Prioritas)</option>
                    <option value="REGULER">REGULER</option>
                    <option value="BARU">BARU</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Kontak PIC
                  </label>
                  <input
                    type="text"
                    value={kontakPic}
                    onChange={(e) => setKontakPic(e.target.value)}
                    placeholder="Mas Aris"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    No. WhatsApp / HP <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={noTelepon}
                    onChange={(e) => setNoTelepon(e.target.value)}
                    placeholder="08123456789"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Alamat Kantor / Domisili
                </label>
                <textarea
                  rows={2}
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  placeholder="Jl. Pangeran Tubagus Angke, Jakarta"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Catatan Khusus Klien
                </label>
                <input
                  type="text"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Langganan panggung pelaminan adat Jawa..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Simpan Pelanggan Baru
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

      {/* Modal Edit Pelanggan */}
      {editingPelanggan && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-teal-400" />
                Edit Data Pelanggan ({editingPelanggan.kodePelanggan})
              </h3>
              <button
                onClick={() => setEditingPelanggan(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Nama Pelanggan / WO <span className="text-red-400">*</span>
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
                    Tipe Kemitraan
                  </label>
                  <select
                    value={editTipe}
                    onChange={(e) => setEditTipe(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Wedding Organizer">Wedding Organizer</option>
                    <option value="Perias / MUA">Perias / MUA</option>
                    <option value="Hotel / Venue">Hotel / Venue</option>
                    <option value="Klien Langsung">Klien Langsung</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Status Member
                  </label>
                  <select
                    value={editStatusMember}
                    onChange={(e) => setEditStatusMember(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="VIP">VIP (Prioritas)</option>
                    <option value="REGULER">REGULER</option>
                    <option value="BARU">BARU</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Kontak PIC
                  </label>
                  <input
                    type="text"
                    value={editPic}
                    onChange={(e) => setEditPic(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    No. WhatsApp / HP <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editTelp}
                    onChange={(e) => setEditTelp(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Alamat Kantor / Domisili
                </label>
                <textarea
                  rows={2}
                  value={editAlamat}
                  onChange={(e) => setEditAlamat(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Catatan Khusus Klien
                </label>
                <input
                  type="text"
                  value={editCatatan}
                  onChange={(e) => setEditCatatan(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                />
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
                  onClick={() => setEditingPelanggan(null)}
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
