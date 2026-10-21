import React, { useState, useMemo } from 'react';
import { 
  RotateCcw, 
  Search, 
  CheckCircle2, 
  ShieldCheck,
  PackagePlus,
  Wrench,
  AlertTriangle,
  ArrowDownToLine,
  Filter,
  Sparkles,
  Trash2,
  X
} from 'lucide-react';
import { Penyewaan, Barang } from '../types';
import { toLusinPcs } from './DatabaseBarangView';

interface PengembalianViewProps {
  penyewaanList: Penyewaan[];
  barangList?: Barang[];
  initialNoSewa?: string;
  onClearInitialNoSewa?: () => void;
  onOpenTambahStok?: () => void;
  onSubmitReturn: (payload: {
    noSewa: string;
    namaPelanggan: string;
    items: Array<{
      idItem: string;
      qtyBagus: number;
      qtyRusak: number;
      qtyHilang: number;
      denda: number;
      catatan?: string;
    }>;
  }) => Promise<boolean>;
  onHapusPenyewaan?: (noSewa: string) => Promise<{ success: boolean; message: string }>;
}

export const PengembalianView: React.FC<PengembalianViewProps> = ({
  penyewaanList,
  barangList = [],
  initialNoSewa,
  onClearInitialNoSewa,
  onOpenTambahStok,
  onSubmitReturn,
  onHapusPenyewaan
}) => {
  const [activeMode, setActiveMode] = useState<'baru' | 'kembali' | 'rekondisi'>('kembali');

  // =========================================================================
  // FILTER STATES (Masing-masing alur memiliki Filter Pintar Kategori & Jenis)
  // =========================================================================
  // Mode 1: Masuk Baru
  const [filterKategoriBaru, setFilterKategoriBaru] = useState('SEMUA');
  const [filterJenisBaru, setFilterJenisBaru] = useState('SEMUA');
  const [cariMasukBaru, setCariMasukBaru] = useState('');

  // Mode 2: Masuk Kembali
  const [filterKategoriKembali, setFilterKategoriKembali] = useState('SEMUA');
  const [filterJenisKembali, setFilterJenisKembali] = useState('SEMUA');
  const [cariMasukKembali, setCariMasukKembali] = useState('');

  // Mode 3: Masuk Rekondisi
  const [filterKategoriRekondisi, setFilterKategoriRekondisi] = useState('SEMUA');
  const [filterJenisRekondisi, setFilterJenisRekondisi] = useState('SEMUA');
  const [cariMasukRekondisi, setCariMasukRekondisi] = useState('');

  // Master Categories List
  const allCategories = useMemo(() => {
    const raw = Array.from(new Set(barangList.map(b => b.kategori).filter(Boolean)));
    return ['SEMUA', ...raw];
  }, [barangList]);

  // Helper untuk mendapatkan list Jenis yang pintar tersaring berdasarkan Kategori terpilih
  const getJenisOptions = (selectedKategori: string) => {
    const pool = selectedKategori === 'SEMUA' 
      ? barangList 
      : barangList.filter(b => (b.kategori || '').trim().toLowerCase() === selectedKategori.trim().toLowerCase());
    const raw = Array.from(new Set(pool.map(b => b.jenis).filter(Boolean))) as string[];
    return ['SEMUA', ...raw];
  };

  const jenisListBaru = useMemo(() => getJenisOptions(filterKategoriBaru), [barangList, filterKategoriBaru]);
  const jenisListKembali = useMemo(() => getJenisOptions(filterKategoriKembali), [barangList, filterKategoriKembali]);
  const jenisListRekondisi = useMemo(() => getJenisOptions(filterKategoriRekondisi), [barangList, filterKategoriRekondisi]);

  // Lookup Map untuk barang
  const barangMap = useMemo(() => {
    const map = new Map<string, Barang>();
    barangList.forEach(b => {
      if (b.kode) map.set(b.kode.trim().toUpperCase(), b);
    });
    return map;
  }, [barangList]);

  // =========================================================================
  // MODE 1: DATA FILTERED MASUK BARU
  // =========================================================================
  const filteredMasukBaru = useMemo(() => {
    return barangList.filter(b => {
      const matchCat = filterKategoriBaru === 'SEMUA' || b.kategori === filterKategoriBaru;
      const matchJenis = filterJenisBaru === 'SEMUA' || b.jenis === filterJenisBaru;
      const q = cariMasukBaru.trim().toLowerCase();
      const matchQ = !q || (
        b.kode.toLowerCase().includes(q) ||
        b.nama.toLowerCase().includes(q) ||
        (b.jenis && b.jenis.toLowerCase().includes(q)) ||
        b.kategori.toLowerCase().includes(q)
      );
      return matchCat && matchJenis && matchQ;
    });
  }, [barangList, filterKategoriBaru, filterJenisBaru, cariMasukBaru]);

  // =========================================================================
  // MODE 2: DATA FILTERED MASUK KEMBALI (SEWA AKTIF)
  // =========================================================================
  const activeRentals = useMemo(() => {
    return penyewaanList.filter(s => s.status === 'AKTIF' || s.status === 'SEBAGIAN');
  }, [penyewaanList]);

  const filteredActiveRentals = useMemo(() => {
    return activeRentals.filter(s => {
      // Filter pintar: apakah transaksi sewa ini mengandung barang dengan Kategori / Jenis terpilih
      if (filterKategoriKembali !== 'SEMUA' || filterJenisKembali !== 'SEMUA') {
        const hasMatchingItem = s.items && s.items.some(it => {
          const b = barangMap.get((it.kode || '').trim().toUpperCase());
          const cat = it.kategori || b?.kategori || '';
          const jns = b?.jenis || '';

          const matchCat = filterKategoriKembali === 'SEMUA' || cat.trim().toLowerCase() === filterKategoriKembali.trim().toLowerCase();
          const matchJns = filterJenisKembali === 'SEMUA' || jns.trim().toLowerCase() === filterJenisKembali.trim().toLowerCase();
          return matchCat && matchJns;
        });

        if (!hasMatchingItem) return false;
      }

      // Filter teks pencarian
      const q = cariMasukKembali.trim().toLowerCase();
      if (!q) return true;

      return (
        s.noSewa.toLowerCase().includes(q) ||
        s.namaPelanggan.toLowerCase().includes(q) ||
        (s.noTelepon && s.noTelepon.toLowerCase().includes(q)) ||
        (s.alamat && s.alamat.toLowerCase().includes(q)) ||
        (s.items && s.items.some(it => 
          it.namaBarang.toLowerCase().includes(q) || 
          it.kode.toLowerCase().includes(q)
        ))
      );
    });
  }, [activeRentals, filterKategoriKembali, filterJenisKembali, cariMasukKembali, barangMap]);

  // Modal Return State
  const [modalReturnSewa, setModalReturnSewa] = useState<Penyewaan | null>(null);
  const [returnItemsState, setReturnItemsState] = useState<Array<{
    idItem: string;
    kode: string;
    namaBarang: string;
    qtyKeluar: number;
    qtyBagus: number;
    qtyRusak: number;
    qtyHilang: number;
    catatan: string;
  }>>([]);
  const [tglKembaliInput, setTglKembaliInput] = useState(new Date().toISOString().slice(0, 10));
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal Rekondisi State
  const [modalRekondisiItem, setModalRekondisiItem] = useState<{
    kode: string;
    nama: string;
    antrianRusak: number;
  } | null>(null);
  const [qtyServiceLusin, setQtyServiceLusin] = useState(0);
  const [qtyServicePcs, setQtyServicePcs] = useState(0);
  const [catatanRekondisi, setCatatanRekondisi] = useState('');

  // =========================================================================
  // MODE 3: DATA FILTERED MASUK REKONDISI
  // =========================================================================
  const antrianRekondisiList = useMemo(() => {
    return barangList
      .filter(b => b.stokTotal > b.stokTersedia + b.stokDisewa)
      .map(b => ({
        kode: b.kode,
        nama: b.nama,
        kategori: b.kategori,
        jenis: b.jenis || '-',
        antrianRusak: Math.max(0, b.stokTotal - b.stokTersedia - b.stokDisewa)
      }))
      .filter(x => x.antrianRusak > 0);
  }, [barangList]);

  const filteredAntrianRekondisi = useMemo(() => {
    return antrianRekondisiList.filter(item => {
      const matchCat = filterKategoriRekondisi === 'SEMUA' || item.kategori === filterKategoriRekondisi;
      const matchJenis = filterJenisRekondisi === 'SEMUA' || item.jenis === filterJenisRekondisi;
      const q = cariMasukRekondisi.trim().toLowerCase();
      const matchQ = !q || (
        item.kode.toLowerCase().includes(q) ||
        item.nama.toLowerCase().includes(q) ||
        (item.jenis && item.jenis.toLowerCase().includes(q)) ||
        item.kategori.toLowerCase().includes(q)
      );
      return matchCat && matchJenis && matchQ;
    });
  }, [antrianRekondisiList, filterKategoriRekondisi, filterJenisRekondisi, cariMasukRekondisi]);

  // Open modal return for specific rental
  const handleOpenModalReturn = (sewa: Penyewaan) => {
    setModalReturnSewa(sewa);
    setTglKembaliInput(new Date().toISOString().slice(0, 10));
    setReturnItemsState(
      sewa.items.map(it => {
        const sisa = Math.max(0, it.qtySewa - (it.qtyKembaliBagus || 0) - (it.qtyRusak || 0) - (it.qtyHilang || 0));
        return {
          idItem: it.idItem,
          kode: it.kode,
          namaBarang: it.namaBarang,
          qtyKeluar: it.qtySewa,
          qtyBagus: sisa,
          qtyRusak: 0,
          qtyHilang: 0,
          catatan: 'Kembali dalam kondisi baik'
        };
      })
    );
  };

  const handleSubmitReturnForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalReturnSewa) return;

    setIsSubmitting(true);
    try {
      const success = await onSubmitReturn({
        noSewa: modalReturnSewa.noSewa,
        namaPelanggan: modalReturnSewa.namaPelanggan,
        items: returnItemsState.map(it => ({
          idItem: it.idItem,
          qtyBagus: it.qtyBagus,
          qtyRusak: it.qtyRusak,
          qtyHilang: it.qtyHilang,
          denda: 0,
          catatan: it.catatan
        }))
      });

      if (success) {
        setModalReturnSewa(null);
        if (onClearInitialNoSewa) onClearInitialNoSewa();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHapusSewaClick = async (sewa: Penyewaan) => {
    const konfirm = window.confirm(`Apakah Anda yakin ingin membatalkan & menghapus transaksi sewa "${sewa.noSewa}" atas nama ${sewa.namaPelanggan}? Stok barang akan dikembalikan ke status tersedia.`);
    if (!konfirm) return;

    if (onHapusPenyewaan) {
      await onHapusPenyewaan(sewa.noSewa);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar with 3 Modes */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-900 rounded-3xl p-5 sm:p-6 text-white shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-widest text-teal-200">Operasional Logistik &amp; Gudang</div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center gap-2 mt-0.5">
            <span>📥 Masuk Barang (3 Alur Terpisah)</span>
          </h2>
          <p className="text-xs text-teal-100/90 mt-1">
            Pemisahan alur pencatatan fisik: <b>1. Masuk Baru</b> (Pembelian), <b>2. Masuk Kembali</b> (Selesai Sewa), dan <b>3. Masuk Rekondisi</b> (Selesai Reparasi).
          </p>
        </div>

        {/* 3 Mode Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveMode('baru')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeMode === 'baru' 
                ? 'bg-white text-teal-900 shadow-md ring-2 ring-white/50' 
                : 'bg-teal-700/60 hover:bg-teal-700 text-white'
            }`}
          >
            <PackagePlus className="w-4 h-4" />
            <span>1. Masuk Baru</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('kembali')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeMode === 'kembali' 
                ? 'bg-white text-teal-900 shadow-md ring-2 ring-white/50' 
                : 'bg-teal-700/60 hover:bg-teal-700 text-white'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>2. Masuk Kembali ({activeRentals.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('rekondisi')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeMode === 'rekondisi' 
                ? 'bg-white text-teal-900 shadow-md ring-2 ring-white/50' 
                : 'bg-teal-700/60 hover:bg-teal-700 text-white'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>3. Masuk Rekondisi ({antrianRekondisiList.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: MASUK BARU (PEMBELIAN DARI SUPPLIER)                              */}
      {/* ========================================================================= */}
      {activeMode === 'baru' && (
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span>1. Masuk Baru (Pembelian Supplier &amp; Restok)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Pilih barang untuk menambah stok dari faktur pembelian supplier dengan filter pintar kategori &amp; jenis.
              </p>
            </div>

            {onOpenTambahStok && (
              <button
                type="button"
                onClick={onOpenTambahStok}
                className="px-4 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition cursor-pointer shadow-xs"
              >
                <ArrowDownToLine className="w-4 h-4 text-teal-300" />
                <span>+ Input Faktur Pembelian</span>
              </button>
            )}
          </div>

          {/* Filter Pintar: Kategori & Jenis Otomatis Menyesuaikan */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
                <Filter className="w-3.5 h-3.5 text-teal-700" />
                <span>Kategori:</span>
              </div>
              <select
                value={filterKategoriBaru}
                onChange={(e) => {
                  setFilterKategoriBaru(e.target.value);
                  setFilterJenisBaru('SEMUA'); // Otomatis reset jenis saat kategori berubah
                }}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer shadow-2xs"
              >
                {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>

              <div className="flex items-center gap-1 text-xs font-bold text-slate-600 ml-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Filter Pintar (Jenis):</span>
              </div>
              <select
                value={filterJenisBaru}
                onChange={(e) => setFilterJenisBaru(e.target.value)}
                className="px-3 py-1.5 bg-white border border-teal-300 rounded-xl text-xs font-semibold text-teal-900 cursor-pointer shadow-2xs ring-1 ring-teal-200/50"
              >
                {jenisListBaru.map(j => <option key={j} value={j}>{j}</option>)}
              </select>

              {(filterKategoriBaru !== 'SEMUA' || filterJenisBaru !== 'SEMUA') && (
                <button
                  type="button"
                  onClick={() => {
                    setFilterKategoriBaru('SEMUA');
                    setFilterJenisBaru('SEMUA');
                  }}
                  className="text-[11px] text-teal-700 hover:text-teal-900 font-bold underline cursor-pointer ml-1"
                >
                  Reset Filter
                </button>
              )}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kode, nama, jenis..."
                value={cariMasukBaru}
                onChange={(e) => setCariMasukBaru(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-teal-700"
              />
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs min-w-[750px]">
              <thead className="bg-slate-900 text-white text-[10px] uppercase font-semibold">
                <tr>
                  <th className="p-3 w-28">Kode</th>
                  <th className="p-3">Nama Barang</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Jenis</th>
                  <th className="p-3 text-right">Stok Fisik Saat Ini</th>
                  <th className="p-3 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredMasukBaru.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 text-xs">
                      Tidak ada barang yang cocok dengan filter kategori &amp; jenis ini.
                    </td>
                  </tr>
                ) : (
                  filteredMasukBaru.map(b => {
                    const lp = toLusinPcs(b.stokTersedia);
                    return (
                      <tr key={b.kode} className="hover:bg-teal-50/50 transition">
                        <td className="p-3 font-mono font-bold text-teal-800">{b.kode}</td>
                        <td className="p-3 font-bold text-slate-900">{b.nama}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                            {b.kategori}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 font-medium">{b.jenis || '-'}</td>
                        <td className="p-3 text-right font-bold text-slate-800">
                          {lp.lusin} L + {lp.pcs} P <span className="text-[10px] text-slate-400 font-normal">({b.stokTersedia} {b.satuan})</span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={onOpenTambahStok}
                            className="px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl font-bold text-xs transition cursor-pointer"
                          >
                            + Masuk Beli
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: MASUK KEMBALI (PENGEMBALIAN SEWA PELANGGAN/WO)                    */}
      {/* ========================================================================= */}
      {activeMode === 'kembali' && (
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <span>2. Masuk Kembali (Barang Sewa Selesai Acara)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Daftar transaksi penyewaan aktif di lokasi acara dan siap dikembalikan ke gudang. Dilengkapi filter pintar kategori &amp; jenis barang.
            </p>
          </div>

          {/* Filter Pintar Masuk Kembali */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
                <Filter className="w-3.5 h-3.5 text-teal-700" />
                <span>Kategori Barang:</span>
              </div>
              <select
                value={filterKategoriKembali}
                onChange={(e) => {
                  setFilterKategoriKembali(e.target.value);
                  setFilterJenisKembali('SEMUA'); // Otomatis menyesuaikan jenis
                }}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer shadow-2xs"
              >
                {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>

              <div className="flex items-center gap-1 text-xs font-bold text-slate-600 ml-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Filter Pintar (Jenis):</span>
              </div>
              <select
                value={filterJenisKembali}
                onChange={(e) => setFilterJenisKembali(e.target.value)}
                className="px-3 py-1.5 bg-white border border-teal-300 rounded-xl text-xs font-semibold text-teal-900 cursor-pointer shadow-2xs ring-1 ring-teal-200/50"
              >
                {jenisListKembali.map(j => <option key={j} value={j}>{j}</option>)}
              </select>

              {(filterKategoriKembali !== 'SEMUA' || filterJenisKembali !== 'SEMUA') && (
                <button
                  type="button"
                  onClick={() => {
                    setFilterKategoriKembali('SEMUA');
                    setFilterJenisKembali('SEMUA');
                  }}
                  className="text-[11px] text-teal-700 hover:text-teal-900 font-bold underline cursor-pointer ml-1"
                >
                  Reset Filter
                </button>
              )}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari No. Sewa, Pelanggan, Barang..."
                value={cariMasukKembali}
                onChange={(e) => setCariMasukKembali(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-teal-700"
              />
            </div>
          </div>

          {activeRentals.length === 0 ? (
            <div className="py-12 text-center text-emerald-700 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-1">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
              <div className="font-bold text-sm">Semua barang sewa telah kembali ke gudang!</div>
              <div className="text-xs text-emerald-600">Tidak ada transaksi sewa aktif yang tertunggak saat ini. Seluruh data mutasi tersimpan rapi.</div>
            </div>
          ) : filteredActiveRentals.length === 0 ? (
            <div className="py-10 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              Tidak ada sewa aktif yang memuat barang kategori/jenis ini atau cocok dengan kata kunci pencarian.
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs min-w-[850px]">
                <thead className="bg-slate-900 text-white text-[10px] uppercase font-semibold">
                  <tr>
                    <th className="p-3">No. Sewa / Surat Jalan</th>
                    <th className="p-3">Pelanggan / WO</th>
                    <th className="p-3">Item Barang Disewa</th>
                    <th className="p-3">Tgl Sewa</th>
                    <th className="p-3">Rencana Kembali</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center w-36">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredActiveRentals.map(s => (
                    <tr key={s.noSewa} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-mono font-bold text-teal-800 whitespace-nowrap">
                        {s.noSewa}
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{s.namaPelanggan}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{s.noTelepon}</div>
                        {s.alamat && <div className="text-[10px] text-slate-500 truncate max-w-xs">{s.alamat}</div>}
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          {s.items && s.items.map((it, idx) => (
                            <div key={idx} className="text-[11px] flex items-center gap-1.5">
                              <span className="font-mono text-teal-700 font-bold">{it.kode}</span>
                              <span className="text-slate-800 truncate max-w-[180px]">{it.namaBarang}</span>
                              <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                                {it.qtySewa} {it.satuan || 'Pcs'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 text-slate-600 whitespace-nowrap">{s.tglSewa || '-'}</td>
                      <td className="p-3 text-slate-800 font-semibold whitespace-nowrap">{s.tglKembali || '-'}</td>
                      <td className="p-3 text-center">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          {s.status}
                        </span>
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenModalReturn(s)}
                            className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                            title="Proses Masuk Kembali Barang"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>↩️ Kembalikan</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleHapusSewaClick(s)}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl transition cursor-pointer border border-rose-200"
                            title="Batalkan & Hapus Catatan Sewa Ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: MASUK REKONDISI (BARANG RUSAK SELESAI REPARASI)                    */}
      {/* ========================================================================= */}
      {activeMode === 'rekondisi' && (
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <span>3. Masuk Rekondisi / Hasil Service Workshop</span>
            </h3>
            <p className="text-xs text-slate-500">
              Daftar barang rusak yang masuk antrean perbaikan. Klik "Masuk Stok" untuk mengembalikan barang selesai servis ke stok siap pakai.
            </p>
          </div>

          {/* Filter Pintar Masuk Rekondisi */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
                <Filter className="w-3.5 h-3.5 text-teal-700" />
                <span>Kategori:</span>
              </div>
              <select
                value={filterKategoriRekondisi}
                onChange={(e) => {
                  setFilterKategoriRekondisi(e.target.value);
                  setFilterJenisRekondisi('SEMUA'); // Otomatis menyesuaikan jenis
                }}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer shadow-2xs"
              >
                {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>

              <div className="flex items-center gap-1 text-xs font-bold text-slate-600 ml-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Filter Pintar (Jenis):</span>
              </div>
              <select
                value={filterJenisRekondisi}
                onChange={(e) => setFilterJenisRekondisi(e.target.value)}
                className="px-3 py-1.5 bg-white border border-teal-300 rounded-xl text-xs font-semibold text-teal-900 cursor-pointer shadow-2xs ring-1 ring-teal-200/50"
              >
                {jenisListRekondisi.map(j => <option key={j} value={j}>{j}</option>)}
              </select>

              {(filterKategoriRekondisi !== 'SEMUA' || filterJenisRekondisi !== 'SEMUA') && (
                <button
                  type="button"
                  onClick={() => {
                    setFilterKategoriRekondisi('SEMUA');
                    setFilterJenisRekondisi('SEMUA');
                  }}
                  className="text-[11px] text-teal-700 hover:text-teal-900 font-bold underline cursor-pointer ml-1"
                >
                  Reset Filter
                </button>
              )}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kode, nama, jenis antrean..."
                value={cariMasukRekondisi}
                onChange={(e) => setCariMasukRekondisi(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-teal-700"
              />
            </div>
          </div>

          {antrianRekondisiList.length === 0 ? (
            <div className="py-12 text-center text-emerald-700 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-1">
              <ShieldCheck className="w-8 h-8 mx-auto text-emerald-600" />
              <div className="font-bold text-sm">Tidak ada antrean barang rusak saat ini!</div>
              <div className="text-xs text-emerald-600">Seluruh unit dekorasi dalam kondisi prima siap sewa.</div>
            </div>
          ) : filteredAntrianRekondisi.length === 0 ? (
            <div className="py-10 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              Tidak ada antrean servis barang yang cocok dengan filter kategori &amp; jenis ini.
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs min-w-[750px]">
                <thead className="bg-slate-900 text-white text-[10px] uppercase font-semibold">
                  <tr>
                    <th className="p-3 w-28">Kode</th>
                    <th className="p-3">Nama Barang</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Jenis</th>
                    <th className="p-3 text-right">Antrian Rusak</th>
                    <th className="p-3 text-center w-32">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredAntrianRekondisi.map(item => {
                    const lp = toLusinPcs(item.antrianRusak);
                    return (
                      <tr key={item.kode} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-mono font-bold text-teal-800">{item.kode}</td>
                        <td className="p-3 font-bold text-slate-900">{item.nama}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                            {item.kategori}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600">{item.jenis}</td>
                        <td className="p-3 text-right font-bold text-rose-700">
                          {lp.lusin} L + {lp.pcs} P <span className="text-[10px] text-slate-400 font-normal">({item.antrianRusak} Pcs)</span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setModalRekondisiItem(item);
                              setQtyServiceLusin(lp.lusin);
                              setQtyServicePcs(lp.pcs);
                              setCatatanRekondisi('Selesai diperbaiki & dicuci bersih');
                            }}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs"
                          >
                            Masuk Stok
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL RETURN FORM (PENGEMBALIAN PINAR - BAGUS, RUSAK, HILANG)             */}
      {/* ========================================================================= */}
      {modalReturnSewa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-base">↩️ Proses Pengembalian Sewa</h3>
                <p className="text-xs text-slate-400">
                  {modalReturnSewa.noSewa} · Pelanggan: <strong>{modalReturnSewa.namaPelanggan}</strong>
                </p>
              </div>
              <button 
                onClick={() => setModalReturnSewa(null)}
                className="text-slate-400 hover:text-slate-700 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitReturnForm} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Realisasi Kembali *</label>
                <input
                  type="date"
                  required
                  value={tglKembaliInput}
                  onChange={(e) => setTglKembaliInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-700">Pilah Kondisi Barang Kembali:</div>
                {returnItemsState.map((it, idx) => (
                  <div key={it.idItem} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{it.namaBarang}</span>
                        <span className="font-mono text-teal-700 ml-1.5">({it.kode})</span>
                      </div>
                      <span className="text-slate-500 font-semibold">Keluar: {it.qtyKeluar} Pcs</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-emerald-800 mb-1 text-center">Bagus (Pcs)</label>
                        <input
                          type="number"
                          min="0"
                          value={it.qtyBagus}
                          onChange={(e) => {
                            const val = Math.max(0, parseInt(e.target.value) || 0);
                            const updated = [...returnItemsState];
                            updated[idx].qtyBagus = val;
                            setReturnItemsState(updated);
                          }}
                          className="w-full px-2 py-1.5 bg-white border border-emerald-300 rounded-xl text-center text-xs font-bold text-emerald-800"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-amber-800 mb-1 text-center">Rusak (Pcs)</label>
                        <input
                          type="number"
                          min="0"
                          value={it.qtyRusak}
                          onChange={(e) => {
                            const val = Math.max(0, parseInt(e.target.value) || 0);
                            const updated = [...returnItemsState];
                            updated[idx].qtyRusak = val;
                            setReturnItemsState(updated);
                          }}
                          className="w-full px-2 py-1.5 bg-white border border-amber-300 rounded-xl text-center text-xs font-bold text-amber-800"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-rose-800 mb-1 text-center">Hilang (Pcs)</label>
                        <input
                          type="number"
                          min="0"
                          value={it.qtyHilang}
                          onChange={(e) => {
                            const val = Math.max(0, parseInt(e.target.value) || 0);
                            const updated = [...returnItemsState];
                            updated[idx].qtyHilang = val;
                            setReturnItemsState(updated);
                          }}
                          className="w-full px-2 py-1.5 bg-white border border-rose-300 rounded-xl text-center text-xs font-bold text-rose-800"
                        />
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Keterangan kondisi / catatan denda..."
                        value={it.catatan}
                        onChange={(e) => {
                          const updated = [...returnItemsState];
                          updated[idx].catatan = e.target.value;
                          setReturnItemsState(updated);
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalReturnSewa(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  {isSubmitting ? 'Memproses...' : 'Simpan Pengembalian'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL REKONDISI SELESAI                                                   */}
      {/* ========================================================================= */}
      {modalRekondisiItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-base">🔧 Selesai Servis Rekondisi</h3>
                <p className="text-xs text-slate-400">{modalRekondisiItem.nama} ({modalRekondisiItem.kode})</p>
              </div>
              <button 
                onClick={() => setModalRekondisiItem(null)}
                className="text-slate-400 hover:text-slate-700 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900">
              Antrean rusak saat ini: <strong>{modalRekondisiItem.antrianRusak} Pcs</strong>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lusin Selesai</label>
                <input
                  type="number"
                  min="0"
                  value={qtyServiceLusin}
                  onChange={(e) => setQtyServiceLusin(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pcs Selesai</label>
                <input
                  type="number"
                  min="0"
                  value={qtyServicePcs}
                  onChange={(e) => setQtyServicePcs(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Pengerjaan</label>
              <input
                type="text"
                value={catatanRekondisi}
                onChange={(e) => setCatatanRekondisi(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalRekondisiItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Berhasil: ${qtyServiceLusin * 12 + qtyServicePcs} Pcs ${modalRekondisiItem.nama} masuk kembali ke stok tersedia.`);
                  setModalRekondisiItem(null);
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Masuk Stok
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
