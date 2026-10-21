import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Printer, 
  Download, 
  Calendar, 
  RefreshCw,
  Tag
} from 'lucide-react';
import { Transaksi } from '../types';
import { Pagination } from './Pagination';
import { formatDateTimeIndo } from '../utils/formatters';

interface RiwayatViewProps {
  transaksiList: Transaksi[];
  onRefresh: () => void;
}

export const RiwayatView: React.FC<RiwayatViewProps> = ({
  transaksiList,
  onRefresh
}) => {
  const [filterJenis, setFilterJenis] = useState<string>('SEMUA');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const filterButtons = [
    { id: 'SEMUA', label: 'Semua Transaksi' },
    { id: 'KELUAR_SEWA', label: 'Sewa Keluar' },
    { id: 'KEMBALI_BAGUS', label: 'Kembali Bagus (+)' },
    { id: 'BARANG_RUSAK', label: 'Barang Rusak' },
    { id: 'BARANG_HILANG', label: 'Barang Hilang' },
    { id: 'MASUK_SUPPLIER', label: 'Masuk Supplier' }
  ];

  const filtered = transaksiList.filter(t => {
    const matchJenis = filterJenis === 'SEMUA' || t.jenis === filterJenis;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery = !q || (
      (t.kode || t.kodeBarang || '').toLowerCase().includes(q) ||
      t.namaBarang.toLowerCase().includes(q) ||
      (t.noRef || '').toLowerCase().includes(q) ||
      (t.namaPihak || '').toLowerCase().includes(q) ||
      (t.catatan || '').toLowerCase().includes(q)
    );
    return matchJenis && matchQuery;
  });

  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const exportCsv = () => {
    if (!filtered.length) {
      alert('Tidak ada data transaksi untuk diekspor.');
      return;
    }
    const headers = ['ID Transaksi', 'Tanggal', 'Jenis', 'Kode Barang', 'Nama Barang', 'Qty', 'No Ref / Sewa', 'Nama Pihak', 'Catatan', 'User'];
    const rows = filtered.map(t => [
      t.id,
      t.tanggal,
      t.jenis,
      t.kode || t.kodeBarang || '',
      `"${t.namaBarang.replace(/"/g, '""')}"`,
      t.qty,
      t.noRef || '',
      `"${(t.namaPihak || '').replace(/"/g, '""')}"`,
      `"${(t.catatan || '').replace(/"/g, '""')}"`,
      t.user || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Transaksi_HasanDekor_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Print Control */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-slate-900">Laporan Transaksi & Mutasi Stok</h2>
          <p className="text-xs text-slate-500">Rekam jejak barang masuk, sewa keluar, pengembalian bagus, serta kerusakan dan kehilangan</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
            title="Cetak Laporan Format Kertas"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Laporan</span>
          </button>
          <button
            onClick={exportCsv}
            className="px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-semibold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onRefresh}
            className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl transition cursor-pointer"
            title="Muat Ulang Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {filterButtons.map(btn => {
            const isActive = filterJenis === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => {
                  setFilterJenis(btn.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {btn.label}
              </button>
            );
          })}
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari transaksi berdasarkan kode barang, nama barang/pohon, nomor sewa, atau nama pelanggan..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 shadow-xs"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[850px]">
            <thead>
              <tr className="bg-slate-100/70 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-semibold">
                <th className="py-3 px-3">Tanggal</th>
                <th className="py-3 px-3">Jenis Transaksi</th>
                <th className="py-3 px-3">Kode & Nama Barang</th>
                <th className="py-3 px-2 text-right">Qty</th>
                <th className="py-3 px-3">No Ref / Sewa</th>
                <th className="py-3 px-3">Pelanggan / Pihak</th>
                <th className="py-3 px-3">Catatan</th>
                <th className="py-3 px-2 text-center">User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Tidak ada riwayat transaksi yang cocok.
                  </td>
                </tr>
              ) : (
                paginated.map(r => {
                  let badge = 'bg-slate-100 text-slate-700';
                  if (r.jenis === 'KELUAR_SEWA') badge = 'bg-amber-100 text-amber-800 font-bold';
                  else if (r.jenis === 'KEMBALI_BAGUS') badge = 'bg-emerald-100 text-emerald-800 font-bold';
                  else if (r.jenis === 'BARANG_RUSAK') badge = 'bg-rose-100 text-rose-800 font-bold';
                  else if (r.jenis === 'BARANG_HILANG') badge = 'bg-red-100 text-red-800 font-bold';
                  else if (r.jenis === 'MASUK_SUPPLIER') badge = 'bg-teal-100 text-teal-800 font-bold';

                  return (
                    <tr key={r.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {formatDateTimeIndo(r.tanggal)}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${badge}`}>
                          {r.jenis}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-800">{r.namaBarang}</div>
                        <div className="text-[10px] text-teal-700 font-mono">{r.kode}</div>
                      </td>
                      <td className="py-3 px-2 text-right font-extrabold text-slate-900 text-sm">
                        {r.qty}
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-teal-800 whitespace-nowrap">
                        {r.noRef || '-'}
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-medium">
                        {r.namaPihak || '-'}
                      </td>
                      <td className="py-3 px-3 text-slate-500 text-[11px] max-w-xs">
                        {r.catatan || '-'}
                      </td>
                      <td className="py-3 px-2 text-center text-slate-400 font-mono text-[11px]">
                        {r.user || '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Paginasi 12 List per Halaman */}
        <Pagination
          currentPage={currentPage}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          itemName="transaksi"
        />
      </div>

    </div>
  );
};
