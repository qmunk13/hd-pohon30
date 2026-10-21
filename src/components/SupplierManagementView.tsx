import React, { useState, useMemo } from 'react';
import {
  Factory,
  Plus,
  Phone,
  MapPin,
  User,
  MessageCircle,
  ExternalLink,
  Trash2,
  Edit2,
  Search,
  CheckCircle2,
  X,
  Package,
} from 'lucide-react';
import { Supplier } from '../types';
import { SyncService } from '../services/syncService';
import { TablePagination } from './TablePagination';

interface SupplierManagementViewProps {
  suppliersList: Supplier[];
  onAddSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt'>) => void;
  onEditSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (id: string) => void;
  onOpenRestockWithSupplier: (supplierName: string) => void;
}

export const SupplierManagementView: React.FC<SupplierManagementViewProps> = ({
  suppliersList,
  onAddSupplier,
  onEditSupplier,
  onDeleteSupplier,
  onOpenRestockWithSupplier,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Form states for Add
  const [namaSupplier, setNamaSupplier] = useState('');
  const [kontakPic, setKontakPic] = useState('');
  const [noTelepon, setNoTelepon] = useState('');
  const [alamat, setAlamat] = useState('');
  const [kategoriSuplai, setKategoriSuplai] = useState('Bunga & Daun Latex Premium');
  const [catatan, setCatatan] = useState('');

  // Form states for Edit
  const [editNama, setEditNama] = useState('');
  const [editPic, setEditPic] = useState('');
  const [editTelp, setEditTelp] = useState('');
  const [editAlamat, setEditAlamat] = useState('');
  const [editKategori, setEditKategori] = useState('');
  const [editCatatan, setEditCatatan] = useState('');
  const [editStatus, setEditStatus] = useState(true);

  const filteredSuppliers = useMemo(() => {
    return suppliersList.filter((s) => {
      const q = searchQuery.toLowerCase();
      return (
        (s.namaSupplier || s.nama || '').toLowerCase().includes(q) ||
        (s.kodeSupplier || '').toLowerCase().includes(q) ||
        (s.kontakPic || s.kontakPerson || '').toLowerCase().includes(q) ||
        (s.kategoriSuplai || s.kategoriBarang || '').toLowerCase().includes(q) ||
        (s.alamat || '').toLowerCase().includes(q)
      );
    });
  }, [suppliersList, searchQuery]);

  const pageSize = 12;
  const paginatedSuppliers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSuppliers.slice(start, start + pageSize);
  }, [filteredSuppliers, currentPage]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaSupplier.trim() || !noTelepon.trim()) return;

    const kodeSupplier = `SUP-${Math.floor(100 + Math.random() * 900)}`;

    onAddSupplier({
      kodeSupplier,
      namaSupplier: namaSupplier.trim(),
      kontakPic: kontakPic.trim() || 'PIC Vendor',
      noTelepon: noTelepon.trim(),
      alamat: alamat.trim() || 'Gudang Suplai',
      kategoriSuplai,
      statusAktif: true,
      catatan: catatan.trim(),
      totalPasokanQty: 0,
    });

    setNamaSupplier('');
    setKontakPic('');
    setNoTelepon('');
    setAlamat('');
    setCatatan('');
    setShowAddModal(false);
  };

  const openEditModal = (sup: Supplier) => {
    setEditingSupplier(sup);
    setEditNama(sup.namaSupplier || sup.nama || '');
    setEditPic(sup.kontakPic || sup.kontakPerson || '');
    setEditTelp(sup.noTelepon || '');
    setEditAlamat(sup.alamat || '');
    setEditKategori(sup.kategoriSuplai || sup.kategoriBarang || '');
    setEditCatatan(sup.catatan || '');
    setEditStatus(Boolean(sup.statusAktif));
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSupplier || !editNama.trim() || !editTelp.trim()) return;

    onEditSupplier({
      ...editingSupplier,
      namaSupplier: editNama.trim(),
      kontakPic: editPic.trim(),
      noTelepon: editTelp.trim(),
      alamat: editAlamat.trim(),
      kategoriSuplai: editKategori.trim(),
      catatan: editCatatan.trim(),
      statusAktif: editStatus,
    });

    setEditingSupplier(null);
  };

  const getWaLink = (sup: Supplier) => {
    const text = `Halo ${sup.kontakPic || sup.namaSupplier}, kami dari HD Pohon. Kami ingin memesan pasokan tambahan untuk: *${sup.kategoriSuplai}*. Mohon info ketersediaan stok & katalog terbaru. Terima kasih!`;
    const cleanPhone = sup.noTelepon.replace(/\D/g, '').replace(/^0/, '62');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Factory className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
              Rantai Pasok &bull; Sheet SUPPLIER
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-white mt-1">
            Master Data Supplier &amp; Vendor
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar produsen batang kayu jati, vendor bunga latex real-touch, piringan besi las penopang, dan lampu panggung.
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
              placeholder="Cari vendor, nama, kontak..."
              className="pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 w-52 sm:w-64"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-600/20 transition cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Supplier</span>
          </button>
        </div>
      </div>

      {/* Grid of Suppliers (12 items per page) */}
      {paginatedSuppliers.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400 text-xs">
          Tidak ada supplier yang sesuai dengan pencarian.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedSuppliers.map((sup) => (
            <div
              key={sup.id}
              className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 shadow-md hover:border-slate-700 transition flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-amber-300 bg-amber-950/80 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                    {sup.kodeSupplier}
                  </span>
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        sup.statusAktif
                          ? 'text-emerald-400 bg-emerald-950/80 border border-emerald-500/30'
                          : 'text-slate-400 bg-slate-800'
                      }`}
                    >
                      {sup.statusAktif ? '● Aktif' : '○ Non-Aktif'}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                    {sup.namaSupplier}
                  </h3>
                  <div className="text-xs text-amber-400/90 font-medium mt-0.5">
                    {sup.kategoriSuplai}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400 pt-1">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>PIC: <strong className="text-slate-200">{sup.kontakPic}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{sup.noTelepon}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{sup.alamat}</span>
                  </div>
                </div>

                {sup.catatan && (
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 italic">
                    &ldquo;{sup.catatan}&rdquo;
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(sup)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                    title="Edit Supplier"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus supplier ${sup.namaSupplier}?`)) {
                        onDeleteSupplier(sup.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-red-950/80 text-slate-400 hover:text-red-400 transition cursor-pointer"
                    title="Hapus Supplier"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenRestockWithSupplier(sup.namaSupplier || sup.nama || '')}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1 transition cursor-pointer"
                  >
                    <Package className="w-3 h-3 text-amber-400" />
                    <span>Restock</span>
                  </button>
                  <a
                    href={getWaLink(sup)}
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
          totalItems={filteredSuppliers.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Modal Tambah Supplier */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Factory className="w-4 h-4 text-amber-400" />
                Tambah Supplier / Vendor Baru
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
                  Nama Supplier / Perusahaan <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={namaSupplier}
                  onChange={(e) => setNamaSupplier(e.target.value)}
                  placeholder="Contoh: Workshop Kayu Jati Jepara"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Kontak PIC / Sales
                  </label>
                  <input
                    type="text"
                    value={kontakPic}
                    onChange={(e) => setKontakPic(e.target.value)}
                    placeholder="Mas Joko"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
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
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Kategori Suplai
                </label>
                <input
                  type="text"
                  value={kategoriSuplai}
                  onChange={(e) => setKategoriSuplai(e.target.value)}
                  placeholder="Contoh: Bunga Latex Real-Touch, Batang Kayu, Pelat Besi..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Alamat Lengkap Workshop / Toko
                </label>
                <textarea
                  rows={2}
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  placeholder="Jl. Raya Jepara Kudus No. 12..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Catatan / Keterangan Khusus
                </label>
                <input
                  type="text"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Spesialis kayu jati oven..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Simpan Supplier Baru
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

      {/* Modal Edit Supplier */}
      {editingSupplier && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-amber-400" />
                Edit Data Supplier ({editingSupplier.kodeSupplier})
              </h3>
              <button
                onClick={() => setEditingSupplier(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Nama Supplier / Perusahaan <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editNama}
                  onChange={(e) => setEditNama(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Kontak PIC / Sales
                  </label>
                  <input
                    type="text"
                    value={editPic}
                    onChange={(e) => setEditPic(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
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
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Kategori Suplai
                </label>
                <input
                  type="text"
                  value={editKategori}
                  onChange={(e) => setEditKategori(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Alamat Lengkap Workshop / Toko
                </label>
                <textarea
                  rows={2}
                  value={editAlamat}
                  onChange={(e) => setEditAlamat(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Catatan Khusus
                </label>
                <input
                  type="text"
                  value={editCatatan}
                  onChange={(e) => setEditCatatan(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="statusAktifSup"
                  checked={editStatus}
                  onChange={(e) => setEditStatus(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-800 focus:ring-0"
                />
                <label htmlFor="statusAktifSup" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  Vendor Aktif / Siap Pemesanan
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Simpan Perubahan
                </button>
                <button
                  type="button"
                  onClick={() => setEditingSupplier(null)}
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
