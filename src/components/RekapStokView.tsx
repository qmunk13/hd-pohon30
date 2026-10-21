import React, { useState, useMemo } from 'react';
import {
  Package,
  Printer,
  Download,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  PieChart,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { Barang, TransaksiMutasi, Penyewaan, RekapStokItem } from '../types';
import { SyncService } from '../services/syncService';
import { TablePagination } from './TablePagination';

interface RekapStokViewProps {
  barangList: Barang[];
  transaksiList: TransaksiMutasi[];
  penyewaanList: Penyewaan[];
  onOpenSewa: () => void;
  onOpenRestock: (kode: string) => void;
}

export const RekapStokView: React.FC<RekapStokViewProps> = ({
  barangList,
  transaksiList,
  penyewaanList,
  onOpenSewa,
  onOpenRestock,
}) => {
  const [filterSearch, setFilterSearch] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [filterStatus, setFilterStatus] = useState<'' | 'AMAN' | 'MENIPIS' | 'KRITIS'>('');
  const [currentPage, setCurrentPage] = useState(1);

  // Perhitungan Rekap Stok Cerdas berdasarkan transaksi mutasi dan status terkini
  const rekapData: RekapStokItem[] = useMemo(() => {
    return barangList.map((b) => {
      const itemMutations = transaksiList.filter((m) => m.kodeBarang === b.kode);

      let masuk = 0;
      let keluar = 0;
      let kembali = 0;
      let rusak = 0;
      let hilang = 0;

      itemMutations.forEach((m) => {
        if (m.jenis === 'MASUK_SUPPLIER') masuk += m.qty;
        else if (m.jenis === 'KELUAR_SEWA') keluar += m.qty;
        else if (m.jenis === 'KEMBALI_BAGUS') kembali += m.qty;
        else if (m.jenis === 'BARANG_RUSAK') rusak += m.qty;
        else if (m.jenis === 'BARANG_HILANG') hilang += m.qty;
      });

      const stokAwal = Math.max(0, b.stokTotal - masuk + hilang);
      const stokTotalAkhir = b.stokTotal;
      const stokTersedia = b.stokTersedia;
      const sedangDisewa = b.stokDisewa;
      const nilaiSatuan = b.hargaBeliSatuan || 25000;
      const totalNilaiAset = stokTotalAkhir * nilaiSatuan;
      const minBatas = b.stokMinimum || 20;

      let statusStok: 'AMAN' | 'MENIPIS' | 'KRITIS' = 'AMAN';
      let rekomendasi = 'Ketersediaan aman untuk jadwal sewa normal.';

      if (stokTersedia === 0 && sedangDisewa > 0) {
        statusStok = 'KRITIS';
        rekomendasi = 'Stok gudang kosong! Seluruh unit sedang di lokasi acara.';
      } else if (stokTersedia <= minBatas) {
        statusStok = 'MENIPIS';
        rekomendasi = `Stok di bawah batas aman (${minBatas} ${b.satuan}). Segera restock dari supplier!`;
      } else if (rusak > 5) {
        rekomendasi = `${rusak} unit rusak perlu perbaikan oleh tim workshop.`;
      }

      return {
        kode: b.kode,
        nama: b.nama,
        kategori: b.kategori,
        satuan: b.satuan,
        stokAwal,
        stokMasuk: masuk,
        sewaKeluar: keluar,
        kembaliBagus: kembali,
        rusak,
        hilang,
        stokTotalAkhir,
        stokTersedia,
        sedangDisewa,
        nilaiSatuan,
        totalNilaiAset,
        statusStok,
        rekomendasi,
      };
    });
  }, [barangList, transaksiList]);

  const filteredRekap = useMemo(() => {
    return rekapData.filter((item) => {
      const matchSearch =
        item.nama.toLowerCase().includes(filterSearch.toLowerCase()) ||
        item.kode.toLowerCase().includes(filterSearch.toLowerCase());
      const matchKategori = !filterKategori || item.kategori === filterKategori;
      const matchStatus = !filterStatus || item.statusStok === filterStatus;
      return matchSearch && matchKategori && matchStatus;
    });
  }, [rekapData, filterSearch, filterKategori, filterStatus]);

  // Pagination 12 items per page
  const pageSize = 12;
  const paginatedRekap = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRekap.slice(start, start + pageSize);
  }, [filteredRekap, currentPage]);

  // Statistik Ringkasan
  const totalSku = rekapData.length;
  const totalFisik = rekapData.reduce((acc, curr) => acc + curr.stokTotalAkhir, 0);
  const totalTersedia = rekapData.reduce((acc, curr) => acc + curr.stokTersedia, 0);
  const totalDisewa = rekapData.reduce((acc, curr) => acc + curr.sedangDisewa, 0);
  const totalValuasi = rekapData.reduce((acc, curr) => acc + curr.totalNilaiAset, 0);
  const barangKritisCount = rekapData.filter((i) => i.statusStok === 'KRITIS' || i.statusStok === 'MENIPIS').length;
  const utilisasiPersen = totalFisik > 0 ? ((totalDisewa / totalFisik) * 100).toFixed(1) : '0';

  const formatTanggalAudit = SyncService.formatTanggalIndo(new Date(), true);

  const handleExportCsv = () => {
    const headers = [
      'Kode Barang',
      'Nama Barang',
      'Kategori',
      'Satuan',
      'Stok Awal',
      'Masuk Supplier',
      'Sewa Keluar',
      'Kembali Bagus',
      'Rusak',
      'Hilang',
      'Stok Total Akhir',
      'Stok Tersedia',
      'Sedang Disewa',
      'Nilai Satuan (Rp)',
      'Total Nilai Aset (Rp)',
      'Status',
      'Rekomendasi',
    ];

    const rows = filteredRekap.map((r) => [
      r.kode,
      `"${r.nama}"`,
      r.kategori,
      r.satuan,
      r.stokAwal,
      r.stokMasuk,
      r.sewaKeluar,
      r.kembaliBagus,
      r.rusak,
      r.hilang,
      r.stokTotalAkhir,
      r.stokTersedia,
      r.sedangDisewa,
      r.nilaiSatuan,
      r.totalNilaiAset,
      r.statusStok,
      `"${r.rekomendasi}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      `REKAP STOK AKHIR & VALUASI ASET GUDANG - HD Pohon\n` +
      `Tanggal Audit: ${formatTanggalAudit}\n\n` +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Stok_Hasan_Dekor_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Package className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
              Inventarisasi Terintegrasi &bull; Sheet REKAP_STOK
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-white mt-1">
            Rekap Stok Akhir &amp; Valuasi Aset Gudang
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Periode Audit Sinkron: <strong className="text-white">{formatTanggalAudit}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center gap-2 border border-slate-700 transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Rekap Stok Resmi</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Material</span>
          <div className="text-2xl font-black text-white mt-1">
            {totalSku} <span className="text-xs font-semibold text-slate-400">SKU</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-bold mt-0.5">Bunga, daun &amp; properti</div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Fisik Aset</span>
          <div className="text-2xl font-black text-white mt-1">
            {totalFisik} <span className="text-xs font-semibold text-slate-400">Unit</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Seluruh persediaan</div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Siap Pakai</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {totalTersedia} <span className="text-xs font-semibold text-slate-400">Unit</span>
          </div>
          <div className="text-[10px] text-emerald-300 font-semibold mt-0.5">Di rak gudang utama</div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Sedang Disewa</span>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {totalDisewa} <span className="text-xs font-semibold text-slate-400">Unit</span>
          </div>
          <div className="text-[10px] text-amber-300 font-semibold mt-0.5">Di lokasi event &amp; pelaminan</div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Rasio Utilisasi</span>
          <div className="text-2xl font-black text-cyan-400 mt-1">{utilisasiPersen}%</div>
          <div className="text-[10px] text-cyan-300 font-semibold mt-0.5">Efisiensi perputaran</div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Estimasi Valuasi</span>
          <div className="text-lg font-black text-emerald-400 mt-1 truncate">
            Rp{(totalValuasi / 1000000).toFixed(1)} Jt
          </div>
          <div className="text-[10px] text-emerald-300 font-bold mt-0.5">Nilai aset inventaris</div>
        </div>
      </div>

      {/* Warning Box if stock is low */}
      {barangKritisCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-lg shrink-0">
              ⚠️
            </span>
            <div>
              <h4 className="font-bold text-amber-300">
                Peringatan Logistik: Ada {barangKritisCount} Material Dekorasi Menipis / Kritis!
              </h4>
              <p className="text-amber-200/80 text-[11px] mt-0.5">
                Sebagian barang berada di bawah stok minimum atau sedang habis tersewa untuk jadwal acara mendatang.
              </p>
            </div>
          </div>

          <button
            onClick={() => setFilterStatus('MENIPIS')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-xs shrink-0 cursor-pointer transition"
          >
            Filter Kritis
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row items-center gap-3 text-xs">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={filterSearch}
            onChange={(e) => {
              setFilterSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari kode atau nama bunga / daun / properti..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
          />
        </div>

        <select
          value={filterKategori}
          onChange={(e) => {
            setFilterKategori(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white cursor-pointer outline-none w-full md:w-auto"
        >
          <option value="">Semua Kategori</option>
          <option value="Bunga & Daun Artifisial">Bunga &amp; Daun Artifisial</option>
          <option value="Besi & Rangka Penopang">Besi &amp; Rangka Penopang</option>
          <option value="Lampu & Kelistrikan">Lampu &amp; Kelistrikan</option>
          <option value="Kayu Batang & Pot Semen">Kayu Batang &amp; Pot Semen</option>
          <option value="Kain & Drapery Backdrop">Kain &amp; Drapery Backdrop</option>
          <option value="Aksesoris & Pelengkap">Aksesoris &amp; Pelengkap</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value as '' | 'AMAN' | 'MENIPIS' | 'KRITIS');
            setCurrentPage(1);
          }}
          className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white cursor-pointer outline-none w-full md:w-auto"
        >
          <option value="">Semua Status Stok</option>
          <option value="AMAN">Status: Aman</option>
          <option value="MENIPIS">Status: Menipis</option>
          <option value="KRITIS">Status: Kritis / Kosong</option>
        </select>
      </div>

      {/* Main Rekap Table (12 items per page) */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[11px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-bold min-w-[220px]">Barang &amp; Kode</th>
                <th className="py-3.5 px-3 font-bold text-center">Stok Awal</th>
                <th className="py-3.5 px-3 font-bold text-center text-emerald-400">+ Masuk</th>
                <th className="py-3.5 px-3 font-bold text-center text-amber-400">- Sewa</th>
                <th className="py-3.5 px-3 font-bold text-center text-teal-400">+ Kembali</th>
                <th className="py-3.5 px-3 font-bold text-center text-red-400">Rusak</th>
                <th className="py-3.5 px-3 font-bold text-center text-rose-400">Hilang</th>
                <th className="py-3.5 px-3 font-bold text-center bg-slate-900/80 text-white">Stok Akhir</th>
                <th className="py-3.5 px-3 font-bold text-center text-emerald-300">Tersedia</th>
                <th className="py-3.5 px-3 font-bold text-center text-amber-300">Disewa</th>
                <th className="py-3.5 px-4 font-bold text-right">Valuasi Aset</th>
                <th className="py-3.5 px-4 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {paginatedRekap.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-8 text-center text-slate-500">
                    Tidak ada material yang cocok dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                paginatedRekap.map((item) => (
                  <tr key={item.kode} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 min-w-[220px]">
                      <div className="font-bold text-white leading-snug">{item.nama}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                        <span className="text-emerald-400 font-bold">{item.kode}</span>
                        <span>&bull;</span>
                        <span>{item.kategori}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-400">{item.stokAwal}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-emerald-400">
                      {item.stokMasuk > 0 ? `+${item.stokMasuk}` : '-'}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-amber-400">
                      {item.sewaKeluar > 0 ? `-${item.sewaKeluar}` : '-'}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-teal-400">
                      {item.kembaliBagus > 0 ? `+${item.kembaliBagus}` : '-'}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-red-400">
                      {item.rusak > 0 ? item.rusak : '-'}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-rose-400">
                      {item.hilang > 0 ? item.hilang : '-'}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-black text-white bg-slate-950/40">
                      {item.stokTotalAkhir} <span className="text-[10px] text-slate-500 font-normal">{item.satuan}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-black text-emerald-400">
                      {item.stokTersedia}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-black text-amber-400">
                      {item.sedangDisewa}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white">
                      Rp{item.totalNilaiAset.toLocaleString('id-ID')}
                      <div className="text-[10px] text-slate-500 font-normal">
                        @Rp{(item.nilaiSatuan || 0).toLocaleString('id-ID')}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.statusStok === 'AMAN'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                            : item.statusStok === 'MENIPIS'
                            ? 'bg-amber-950/80 text-amber-400 border border-amber-500/30'
                            : 'bg-red-950/80 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {item.statusStok}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination (12 items per page) */}
        <TablePagination
          currentPage={currentPage}
          totalItems={filteredRekap.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};
