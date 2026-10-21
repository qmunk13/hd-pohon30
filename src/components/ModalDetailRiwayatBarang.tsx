import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Printer, 
  ArrowDownLeft, 
  ArrowUpRight, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  History, 
  Boxes, 
  Search, 
  Filter, 
  Tag, 
  MapPin, 
  User, 
  Calendar,
  FileSpreadsheet
} from 'lucide-react';
import { Transaksi } from '../types';
import { formatDateTimeIndo } from '../utils/formatters';
import { toLusinPcs } from './DatabaseBarangView';

interface ModalDetailRiwayatBarangProps {
  barang: {
    kode: string;
    nama: string;
    kategori: string;
    jenis?: string;
    stokAwal: number;
    masuk: number;
    keluar: number;
    rusak: number;
    hilang: number;
    tersedia: number;
    satuan?: string;
    lokasiRak?: string;
    lokasi?: string;
    fotoUrl?: string;
    spesifikasi?: string;
    keterangan?: string;
    [key: string]: any;
  } | null;
  transaksiList: Transaksi[];
  onClose: () => void;
}

export const ModalDetailRiwayatBarang: React.FC<ModalDetailRiwayatBarangProps> = ({
  barang,
  transaksiList = [],
  onClose
}) => {
  const [filterJenis, setFilterJenis] = useState<string>('SEMUA');
  const [searchLog, setSearchLog] = useState<string>('');

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!barang) return null;

  const lpAwal = toLusinPcs(barang.stokAwal);
  const lpTersedia = toLusinPcs(barang.tersedia);
  const lpKeluar = toLusinPcs(barang.keluar);
  const lpMasuk = toLusinPcs(barang.masuk);

  // Filter mutations for this specific item
  const itemMutations = useMemo(() => {
    const targetCode = (barang.kode || '').trim().toUpperCase();
    const targetName = (barang.nama || '').trim().toLowerCase();

    const matched = transaksiList.filter(t => {
      const tCode = (t.kode || t.kodeBarang || '').trim().toUpperCase();
      const tName = (t.namaBarang || '').trim().toLowerCase();
      if (targetCode && tCode === targetCode) return true;
      if (targetName && tName === targetName) return true;
      return false;
    });

    // Sort descending by date/time (terbaru paling atas)
    return matched.sort((a, b) => {
      const timeA = new Date(a.tanggal || a.waktu || a.createdAt || 0).getTime();
      const timeB = new Date(b.tanggal || b.waktu || b.createdAt || 0).getTime();
      return timeB - timeA;
    });
  }, [barang, transaksiList]);

  // Filtered based on modal tabs & search input
  const filteredMutations = useMemo(() => {
    return itemMutations.filter(t => {
      // Filter jenis
      if (filterJenis !== 'SEMUA') {
        if (filterJenis === 'MASUK' && t.jenis !== 'MASUK_SUPPLIER' && t.jenis !== 'KEMBALI_BAGUS' && (t.jenis as any) !== 'PENYESUAIAN_OPNAME') {
          return false;
        }
        if (filterJenis === 'KELUAR' && t.jenis !== 'KELUAR_SEWA') {
          return false;
        }
        if (filterJenis === 'RUSAK_HILANG' && t.jenis !== 'BARANG_RUSAK' && t.jenis !== 'BARANG_HILANG') {
          return false;
        }
      }

      // Filter search text
      if (searchLog.trim()) {
        const q = searchLog.toLowerCase().trim();
        const matchQ = 
          (t.noRef || '').toLowerCase().includes(q) ||
          (t.namaPihak || '').toLowerCase().includes(q) ||
          (t.catatan || '').toLowerCase().includes(q) ||
          (t.user || '').toLowerCase().includes(q) ||
          (t.jenis || '').toLowerCase().includes(q);
        if (!matchQ) return false;
      }

      return true;
    });
  }, [itemMutations, filterJenis, searchLog]);

  const renderJenisBadge = (jenis: string) => {
    switch (jenis) {
      case 'MASUK_SUPPLIER':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
            <ArrowDownLeft className="w-3 h-3 text-teal-600" /> Masuk Supplier
          </span>
        );
      case 'KELUAR_SEWA':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
            <ArrowUpRight className="w-3 h-3 text-amber-600" /> Sewa Keluar
          </span>
        );
      case 'KEMBALI_BAGUS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <RotateCcw className="w-3 h-3 text-emerald-600" /> Kembali Bagus
          </span>
        );
      case 'BARANG_RUSAK':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-600" /> Rusak
          </span>
        );
      case 'BARANG_HILANG':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-900 border border-red-200">
            <AlertTriangle className="w-3 h-3 text-red-600" /> Hilang
          </span>
        );
      case 'PENYESUAIAN_OPNAME':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
            <Boxes className="w-3 h-3 text-purple-600" /> Penyesuaian Opname
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
            {jenis}
          </span>
        );
    }
  };

  const getQtyDelta = (t: Transaksi) => {
    const qty = Number(t.qty || t.jumlah || 0);
    const lp = toLusinPcs(qty);

    if (t.jenis === 'MASUK_SUPPLIER' || t.jenis === 'KEMBALI_BAGUS' || ((t.jenis as any) === 'PENYESUAIAN_OPNAME' && qty > 0)) {
      return (
        <div>
          <span className="font-bold text-teal-700 font-mono text-sm">+{qty} pcs</span>
          <div className="text-[10px] text-teal-600 font-mono">{lp.lusin}L + {lp.pcs}P</div>
        </div>
      );
    }
    if (t.jenis === 'KELUAR_SEWA') {
      return (
        <div>
          <span className="font-bold text-amber-700 font-mono text-sm">-{qty} pcs</span>
          <div className="text-[10px] text-amber-600 font-mono">{lp.lusin}L + {lp.pcs}P</div>
        </div>
      );
    }
    if (t.jenis === 'BARANG_RUSAK') {
      return (
        <div>
          <span className="font-bold text-rose-700 font-mono text-sm">-{qty} pcs</span>
          <div className="text-[10px] text-rose-500 font-mono">Rusak</div>
        </div>
      );
    }
    if (t.jenis === 'BARANG_HILANG') {
      return (
        <div>
          <span className="font-bold text-red-700 font-mono text-sm">-{qty} pcs</span>
          <div className="text-[10px] text-red-500 font-mono">Hilang</div>
        </div>
      );
    }

    return (
      <div>
        <span className="font-bold text-slate-700 font-mono text-sm">{qty} pcs</span>
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 text-teal-300 flex items-center justify-center shrink-0">
              <History className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded-md border border-teal-800">
                  {barang.kode}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                  {barang.kategori}
                </span>
                {barang.jenis && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-400">
                    {barang.jenis}
                  </span>
                )}
              </div>
              <h3 className="font-serif font-bold text-lg sm:text-xl text-white mt-1">
                {barang.nama}
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  Rak: <b className="text-slate-300">{barang.lokasiRak || barang.lokasi || '-'}</b>
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-slate-500" />
                  Satuan: <b className="text-slate-300">{barang.satuan || 'Pcs'}</b>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Cetak Laporan Mutasi Barang Ini"
            >
              <Printer className="w-4 h-4 text-teal-400" />
              <span>🖨️ Cetak Kartu</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Ringkasan 6 Posisi Mutasi Barang */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
            <Boxes className="w-3.5 h-3.5 text-teal-700" />
            <span>Rekap Posisi Fisik &amp; Keseimbangan Stok</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {/* 1. Stok Awal */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="text-[10px] font-bold uppercase text-slate-500">Stok Awal</div>
              <div className="text-lg font-serif font-bold text-slate-800 mt-0.5">{barang.stokAwal} pcs</div>
              <div className="text-[10px] text-slate-400 font-mono font-medium">
                {lpAwal.lusin}L + {lpAwal.pcs}P
              </div>
            </div>

            {/* 2. Masuk */}
            <div className="bg-white p-3 rounded-2xl border border-teal-200 bg-teal-50/20 shadow-2xs">
              <div className="text-[10px] font-bold uppercase text-teal-800 flex items-center gap-1">
                <ArrowDownLeft className="w-3 h-3 text-teal-600" />
                <span>Masuk</span>
              </div>
              <div className="text-lg font-serif font-bold text-teal-900 mt-0.5">+{barang.masuk} pcs</div>
              <div className="text-[10px] text-teal-700 font-mono font-medium">
                {lpMasuk.lusin}L + {lpMasuk.pcs}P
              </div>
            </div>

            {/* 3. Keluar */}
            <div className="bg-white p-3 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-2xs">
              <div className="text-[10px] font-bold uppercase text-amber-800 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-amber-600" />
                <span>Keluar (Sewa)</span>
              </div>
              <div className="text-lg font-serif font-bold text-amber-900 mt-0.5">-{barang.keluar} pcs</div>
              <div className="text-[10px] text-amber-700 font-mono font-medium">
                {lpKeluar.lusin}L + {lpKeluar.pcs}P
              </div>
            </div>

            {/* 4. Rusak */}
            <div className="bg-white p-3 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-2xs">
              <div className="text-[10px] font-bold uppercase text-rose-800 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-600" />
                <span>Rusak</span>
              </div>
              <div className="text-lg font-serif font-bold text-rose-900 mt-0.5">{barang.rusak} pcs</div>
              <div className="text-[10px] text-rose-700 font-medium">
                {barang.rusak > 0 ? 'Perlu Perbaikan' : 'Nol Rusak'}
              </div>
            </div>

            {/* 5. Hilang */}
            <div className="bg-white p-3 rounded-2xl border border-red-200 bg-red-50/20 shadow-2xs">
              <div className="text-[10px] font-bold uppercase text-red-800 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-red-600" />
                <span>Hilang</span>
              </div>
              <div className="text-lg font-serif font-bold text-red-900 mt-0.5">{barang.hilang} pcs</div>
              <div className="text-[10px] text-red-700 font-medium">
                {barang.hilang > 0 ? 'Klaim / Denda' : 'Nol Hilang'}
              </div>
            </div>

            {/* 6. Tersedia */}
            <div className="bg-white p-3 rounded-2xl border border-emerald-300 bg-emerald-50/40 shadow-2xs">
              <div className="text-[10px] font-bold uppercase text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Tersedia (Ready)</span>
              </div>
              <div className="text-lg font-serif font-bold text-emerald-900 mt-0.5">{barang.tersedia} pcs</div>
              <div className="text-[10px] text-emerald-700 font-mono font-semibold">
                {lpTersedia.lusin}L + {lpTersedia.pcs}P
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tab & Search Bar untuk Riwayat Mutasi */}
        <div className="px-5 py-3 border-b border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Filter Jenis Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilterJenis('SEMUA')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                filterJenis === 'SEMUA' 
                  ? 'bg-slate-900 text-white shadow-2xs' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              Semua Riwayat ({itemMutations.length})
            </button>
            <button
              onClick={() => setFilterJenis('MASUK')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                filterJenis === 'MASUK' 
                  ? 'bg-teal-700 text-white shadow-2xs' 
                  : 'bg-teal-50 hover:bg-teal-100 text-teal-800'
              }`}
            >
              Masuk / Pasokan
            </button>
            <button
              onClick={() => setFilterJenis('KELUAR')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                filterJenis === 'KELUAR' 
                  ? 'bg-amber-600 text-white shadow-2xs' 
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800'
              }`}
            >
              Keluar Sewa
            </button>
            <button
              onClick={() => setFilterJenis('RUSAK_HILANG')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                filterJenis === 'RUSAK_HILANG' 
                  ? 'bg-rose-700 text-white shadow-2xs' 
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-800'
              }`}
            >
              Rusak &amp; Hilang
            </button>
          </div>

          {/* Search Mutasi */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari No. Ref, mitra, catatan..."
              value={searchLog}
              onChange={(e) => setSearchLog(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-teal-700"
            />
          </div>
        </div>

        {/* Tabel Riwayat Terperinci */}
        <div className="flex-1 overflow-y-auto min-h-[260px] max-h-[50vh]">
          {filteredMutations.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl">
                📭
              </div>
              <h4 className="font-serif font-bold text-slate-800 text-sm">
                Belum Ada Catatan Mutasi Terdaftar
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchLog || filterJenis !== 'SEMUA' 
                  ? 'Tidak ada mutasi yang cocok dengan filter atau kata kunci pencarian.'
                  : `Seluruh pergerakan barang ${barang.nama} (sewa, pengembalian, penambahan stok, rusak, hilang) akan tercatat otomatis di sini.`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[760px]">
                <thead className="bg-slate-100 text-slate-700 text-[10px] uppercase font-bold sticky top-0 z-10 border-b border-slate-200">
                  <tr>
                    <th className="p-3 w-10 text-center">No</th>
                    <th className="p-3 w-36">Waktu &amp; Tanggal</th>
                    <th className="p-3 w-36">Jenis Mutasi</th>
                    <th className="p-3 text-center w-28 bg-slate-200/60">Perubahan (Qty)</th>
                    <th className="p-3 w-36">No. Ref / Surat Jalan</th>
                    <th className="p-3">Pihak / Mitra Terkait</th>
                    <th className="p-3">Catatan / Keterangan</th>
                    <th className="p-3 w-24 text-center">Petugas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredMutations.map((t, idx) => {
                    const tDate = t.tanggal || t.waktu || t.createdAt;

                    return (
                      <tr key={t.id || idx} className="hover:bg-slate-50 transition">
                        {/* No */}
                        <td className="p-3 text-center text-slate-400 font-mono text-[11px]">
                          {idx + 1}
                        </td>

                        {/* Tanggal & Waktu */}
                        <td className="p-3 whitespace-nowrap text-slate-700">
                          <div className="font-semibold">{formatDateTimeIndo(tDate)}</div>
                          <div className="text-[10px] text-slate-400">
                            {t.id ? `#${t.id.slice(-6)}` : '-'}
                          </div>
                        </td>

                        {/* Jenis Mutasi */}
                        <td className="p-3 whitespace-nowrap">
                          {renderJenisBadge(t.jenis)}
                        </td>

                        {/* Perubahan Qty */}
                        <td className="p-3 text-center bg-slate-50/60 whitespace-nowrap">
                          {getQtyDelta(t)}
                        </td>

                        {/* No. Ref */}
                        <td className="p-3 font-mono font-bold text-slate-800 whitespace-nowrap">
                          {t.noRef || t.noSewa || '-'}
                        </td>

                        {/* Pihak Terkait */}
                        <td className="p-3">
                          <div className="font-semibold text-slate-900">
                            {t.namaPihak || t.namaPelanggan || t.supplier || '-'}
                          </div>
                        </td>

                        {/* Catatan */}
                        <td className="p-3 text-slate-600 text-[11px] max-w-xs truncate" title={t.catatan || ''}>
                          {t.catatan || '-'}
                        </td>

                        {/* Petugas / User */}
                        <td className="p-3 text-center whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                            {t.user || 'ADMIN'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Modal */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 font-medium">
            Menampilkan <b className="text-slate-800">{filteredMutations.length}</b> dari <b className="text-slate-800">{itemMutations.length}</b> mutasi tercatat untuk barang ini.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 hover:bg-black text-white rounded-xl font-bold transition cursor-pointer shadow-xs"
            >
              Tutup Rincian
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
