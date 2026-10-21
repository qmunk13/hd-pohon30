import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Package, 
  Printer, 
  Search, 
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Boxes,
  RotateCcw,
  FileText
} from 'lucide-react';
import { Barang, PohonKatalog, Transaksi } from '../types';
import { toLusinPcs } from './DatabaseBarangView';
import { Pagination } from './Pagination';
import { ModalDetailRiwayatBarang } from './ModalDetailRiwayatBarang';

interface RekapValuasiViewProps {
  pohonList: PohonKatalog[];
  barangList: Barang[];
  transaksiList?: Transaksi[];
  onRefresh: () => void;
}

export const RekapValuasiView: React.FC<RekapValuasiViewProps> = ({
  pohonList,
  barangList,
  transaksiList = [],
  onRefresh
}) => {
  const [periode, setPeriode] = useState<'semua' | 'bulan' | 'tahun' | 'manual'>('semua');
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [tanggalSelesai, setTanggalSelesai] = useState('');
  const [filterKategori, setFilterKategori] = useState('SEMUA');
  const [filterJenis, setFilterJenis] = useState('SEMUA');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDetailBarang, setSelectedDetailBarang] = useState<any | null>(null);
  const pageSize = 20;

  // Categories & Jenis options (Jenis pintar tersaring sesuai Kategori terpilih)
  const categories = useMemo(() => {
    const raw = Array.from(new Set(barangList.map(b => b.kategori).filter(Boolean)));
    return ['SEMUA', ...raw];
  }, [barangList]);

  const jenisList = useMemo(() => {
    const pool = filterKategori === 'SEMUA'
      ? barangList
      : barangList.filter(b => (b.kategori || '').trim().toLowerCase() === filterKategori.trim().toLowerCase());
    const raw = Array.from(new Set(pool.map(b => b.jenis).filter(Boolean))) as string[];
    return ['SEMUA', ...raw];
  }, [barangList, filterKategori]);

  // Filter transaksi berdasarkan tanggal / periode jika diperlukan
  const filteredTransaksiByDate = useMemo(() => {
    if (periode === 'semua') return transaksiList;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return transaksiList.filter(t => {
      if (!t.waktu) return true;
      const tDate = new Date(t.waktu);
      if (isNaN(tDate.getTime())) return true;

      if (periode === 'bulan') {
        return tDate.getFullYear() === currentYear && tDate.getMonth() === currentMonth;
      }
      if (periode === 'tahun') {
        return tDate.getFullYear() === currentYear;
      }
      if (periode === 'manual') {
        if (tanggalMulai && tDate < new Date(tanggalMulai)) return false;
        if (tanggalSelesai) {
          const end = new Date(tanggalSelesai);
          end.setHours(23, 59, 59, 999);
          if (tDate > end) return false;
        }
        return true;
      }
      return true;
    });
  }, [transaksiList, periode, tanggalMulai, tanggalSelesai]);

  // Hitung mutasi per kode barang: Masuk, Keluar, Rusak, Hilang
  const mutasiPerBarang = useMemo(() => {
    const map = new Map<string, { masuk: number; keluar: number; rusak: number; hilang: number; kembali: number }>();

    filteredTransaksiByDate.forEach(t => {
      const code = (t.kode || t.kodeBarang || '').trim().toUpperCase();
      if (!code) return;

      if (!map.has(code)) {
        map.set(code, { masuk: 0, keluar: 0, rusak: 0, hilang: 0, kembali: 0 });
      }

      const item = map.get(code)!;
      const qty = Number(t.jumlah || 0);

      if (t.jenis === 'MASUK_SUPPLIER' || ((t.jenis as any) === 'PENYESUAIAN_OPNAME' && qty > 0)) {
        item.masuk += qty;
      } else if (t.jenis === 'KELUAR_SEWA') {
        item.keluar += qty;
      } else if (t.jenis === 'BARANG_RUSAK') {
        item.rusak += qty;
      } else if (t.jenis === 'BARANG_HILANG') {
        item.hilang += qty;
      } else if (t.jenis === 'KEMBALI_BAGUS') {
        item.kembali += qty;
      }
    });

    return map;
  }, [filteredTransaksiByDate]);

  // List barang dengan data mutasi terhitung
  const dataRekap = useMemo(() => {
    return barangList.map(b => {
      const code = (b.kode || '').trim().toUpperCase();
      const m = mutasiPerBarang.get(code) || { masuk: 0, keluar: 0, rusak: 0, hilang: 0, kembali: 0 };

      const masuk = m.masuk;
      const keluar = m.keluar;
      const rusak = m.rusak;
      const hilang = m.hilang;
      const tersedia = Number(b.stokTersedia || 0);
      const fisik = Number(b.stokTotal || 0);

      // Hitung Stok Awal: jika b.stokAwal ada gunakan itu, jika tidak gunakan formula keseimbangan
      // Stok Awal + Masuk - Keluar (yang belum kembali) - Rusak - Hilang = Tersedia
      const stokAwal = b.stokAwal !== undefined && b.stokAwal !== null
        ? Number(b.stokAwal)
        : Math.max(0, fisik - masuk + keluar);

      return {
        ...b,
        stokAwal,
        masuk,
        keluar,
        rusak,
        hilang,
        tersedia
      };
    });
  }, [barangList, mutasiPerBarang]);

  // Filtered barang list
  const filteredBarang = useMemo(() => {
    return dataRekap.filter(b => {
      const matchCat = filterKategori === 'SEMUA' || b.kategori === filterKategori;
      const matchJenis = filterJenis === 'SEMUA' || b.jenis === filterJenis;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch = !q || (
        b.kode.toLowerCase().includes(q) || 
        b.nama.toLowerCase().includes(q) ||
        (b.jenis || '').toLowerCase().includes(q)
      );
      return matchCat && matchJenis && matchSearch;
    });
  }, [dataRekap, filterKategori, filterJenis, searchQuery]);

  // Total Ringkasan Audit
  const totalSKU = filteredBarang.length;
  const grandStokAwal = filteredBarang.reduce((sum, b) => sum + b.stokAwal, 0);
  const grandMasuk = filteredBarang.reduce((sum, b) => sum + b.masuk, 0);
  const grandKeluar = filteredBarang.reduce((sum, b) => sum + b.keluar, 0);
  const grandRusak = filteredBarang.reduce((sum, b) => sum + b.rusak, 0);
  const grandHilang = filteredBarang.reduce((sum, b) => sum + b.hilang, 0);
  const grandTersedia = filteredBarang.reduce((sum, b) => sum + b.tersedia, 0);

  const lpAwal = toLusinPcs(grandStokAwal);
  const lpTersedia = toLusinPcs(grandTersedia);
  const lpKeluar = toLusinPcs(grandKeluar);

  // Pagination
  const totalPages = Math.ceil(filteredBarang.length / pageSize) || 1;
  const paginatedBarang = filteredBarang.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-teal-700 font-bold flex items-center gap-1.5">
            <Boxes className="w-4 h-4" />
            <span>Audit Mutasi Inventaris Gudang</span>
          </div>
          <h2 className="font-serif font-bold text-slate-900 text-xl sm:text-2xl mt-0.5">
            📋 Rekap Mutasi &amp; Stok Akhir Barang
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Rekapitulasi terperinci arus fisik barang: <b>Stok Awal, Masuk, Keluar, Rusak, Hilang,</b> dan <b>Tersedia</b> secara akurat dalam hitungan Pcs dan Lusin.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select 
            value={periode} 
            onChange={(e) => { setPeriode(e.target.value as any); setCurrentPage(1); }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
          >
            <option value="semua">Semua Periode (Akumulasi)</option>
            <option value="bulan">Bulan Ini</option>
            <option value="tahun">Tahun Ini</option>
            <option value="manual">Rentang Tanggal Khusus</option>
          </select>

          {periode === 'manual' && (
            <div className="flex items-center gap-1.5">
              <input 
                type="date" 
                value={tanggalMulai}
                onChange={(e) => { setTanggalMulai(e.target.value); setCurrentPage(1); }}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
              <span className="text-xs text-slate-400">-</span>
              <input 
                type="date" 
                value={tanggalSelesai}
                onChange={(e) => { setTanggalSelesai(e.target.value); setCurrentPage(1); }}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          )}

          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-teal-400" />
            <span>🖨️ Cetak / PDF Rekap</span>
          </button>
        </div>
      </div>

      {/* 6 Metrik Audit Fisik Barang (Tanpa Nilai Rupiah / Valuasi Sesuai Permintaan) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total SKU</div>
          <div className="text-xl font-bold font-serif text-slate-900">{totalSKU}</div>
          <div className="text-[10px] text-teal-700 font-semibold">{barangList.length} Barang Terdaftar</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-500">Stok Awal</div>
          <div className="text-xl font-bold font-serif text-slate-800">{grandStokAwal.toLocaleString('id-ID')} pcs</div>
          <div className="text-[10px] text-slate-400 font-medium">{lpAwal.lusin} Lsn + {lpAwal.pcs} Pcs</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-teal-100 bg-teal-50/30 shadow-2xs space-y-1">
          <div className="text-[10px] uppercase font-bold text-teal-800 flex items-center gap-1">
            <ArrowDownLeft className="w-3 h-3 text-teal-600" />
            <span>Masuk</span>
          </div>
          <div className="text-xl font-bold font-serif text-teal-900">{grandMasuk.toLocaleString('id-ID')} pcs</div>
          <div className="text-[10px] text-teal-700 font-medium">Dari Supplier / Opname</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-100 bg-amber-50/30 shadow-2xs space-y-1">
          <div className="text-[10px] uppercase font-bold text-amber-800 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3 text-amber-600" />
            <span>Keluar (Sewa)</span>
          </div>
          <div className="text-xl font-bold font-serif text-amber-900">{grandKeluar.toLocaleString('id-ID')} pcs</div>
          <div className="text-[10px] text-amber-700 font-medium">{lpKeluar.lusin} Lsn + {lpKeluar.pcs} Pcs</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-100 bg-rose-50/30 shadow-2xs space-y-1">
          <div className="text-[10px] uppercase font-bold text-rose-800 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            <span>Rusak &amp; Hilang</span>
          </div>
          <div className="text-xl font-bold font-serif text-rose-900">
            {(grandRusak + grandHilang).toLocaleString('id-ID')} pcs
          </div>
          <div className="text-[10px] text-rose-700 font-medium">
            Rsk: {grandRusak} &bull; Hlg: {grandHilang}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-2xs space-y-1">
          <div className="text-[10px] uppercase font-bold text-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Tersedia (Ready)</span>
          </div>
          <div className="text-xl font-bold font-serif text-emerald-900">{grandTersedia.toLocaleString('id-ID')} pcs</div>
          <div className="text-[10px] text-emerald-700 font-medium">{lpTersedia.lusin} Lsn + {lpTersedia.pcs} Pcs</div>
        </div>
      </div>

      {/* Filter Row: Kategori, Jenis & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Kategori:</span>
          </div>
          <select
            value={filterKategori}
            onChange={(e) => { 
              setFilterKategori(e.target.value); 
              setFilterJenis('SEMUA'); 
              setCurrentPage(1); 
            }}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
            <span>Jenis:</span>
          </div>
          <select
            value={filterJenis}
            onChange={(e) => { setFilterJenis(e.target.value); setCurrentPage(1); }}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
          >
            {jenisList.map(j => <option key={j} value={j}>{j}</option>)}
          </select>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kode, nama, jenis..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-teal-700"
          />
        </div>
      </div>

      {/* TABEL REKAP STOK AKHIR: KODE, KATEGORI, JENIS / NAMA BARANG, STOK AWAL, MASUK, KELUAR, RUSAK, HILANG, TERSEDIA */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[1080px]">
            <thead className="bg-slate-900 text-white text-[10px] uppercase font-semibold">
              <tr>
                <th className="p-3 w-28">Kode</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Jenis / Nama Barang</th>
                <th className="p-3 text-center bg-slate-800">Stok Awal</th>
                <th className="p-3 text-center bg-teal-950 text-teal-300">Masuk</th>
                <th className="p-3 text-center bg-amber-950 text-amber-300">Keluar</th>
                <th className="p-3 text-center bg-rose-950 text-rose-300">Rusak</th>
                <th className="p-3 text-center bg-red-950 text-red-300">Hilang</th>
                <th className="p-3 text-center bg-emerald-950 text-emerald-300">Tersedia</th>
                <th className="p-3 text-center bg-slate-800 text-slate-200 w-36">Aksi / Riwayat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredBarang.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-400 text-xs">
                    Tidak ada barang yang cocok dengan filter yang dipilih.
                  </td>
                </tr>
              ) : (
                paginatedBarang.map((b) => {
                  const lpAwalItem = toLusinPcs(b.stokAwal);
                  const lpTersediaItem = toLusinPcs(b.tersedia);

                  return (
                    <tr key={b.kode} className="hover:bg-slate-50 transition">
                      {/* 1. KODE */}
                      <td className="p-3 font-mono font-bold text-teal-800 whitespace-nowrap">
                        {b.kode}
                      </td>

                      {/* 2. KATEGORI */}
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold">
                          {b.kategori}
                        </span>
                      </td>

                      {/* 3. JENIS / NAMA BARANG */}
                      <td className="p-3">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">{b.nama}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {b.jenis && <span className="font-medium text-teal-700">{b.jenis} &bull; </span>}
                          <span>Rak: {b.lokasiRak || (b as any).lokasi || '-'}</span>
                          {(b as any).spesifikasi && <span> &bull; {(b as any).spesifikasi}</span>}
                        </div>
                      </td>

                      {/* 4. STOK AWAL */}
                      <td className="p-3 text-center font-semibold text-slate-700 bg-slate-50/50">
                        <div className="font-bold">{b.stokAwal}</div>
                        <div className="text-[9px] text-slate-400 font-mono">
                          {lpAwalItem.lusin}L+{lpAwalItem.pcs}P
                        </div>
                      </td>

                      {/* 5. MASUK */}
                      <td className="p-3 text-center font-bold text-teal-800 bg-teal-50/20">
                        {b.masuk > 0 ? (
                          <span className="inline-flex items-center gap-0.5 text-teal-700">
                            +{b.masuk}
                          </span>
                        ) : (
                          <span className="text-slate-300">0</span>
                        )}
                      </td>

                      {/* 6. KELUAR */}
                      <td className="p-3 text-center font-bold text-amber-800 bg-amber-50/20">
                        {b.keluar > 0 ? (
                          <span className="inline-flex items-center gap-0.5 text-amber-700">
                            -{b.keluar}
                          </span>
                        ) : (
                          <span className="text-slate-300">0</span>
                        )}
                      </td>

                      {/* 7. RUSAK */}
                      <td className="p-3 text-center font-bold text-rose-700 bg-rose-50/20">
                        {b.rusak > 0 ? (
                          <span className="px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[11px]">
                            {b.rusak}
                          </span>
                        ) : (
                          <span className="text-slate-300">0</span>
                        )}
                      </td>

                      {/* 8. HILANG */}
                      <td className="p-3 text-center font-bold text-red-800 bg-red-50/20">
                        {b.hilang > 0 ? (
                          <span className="px-1.5 py-0.5 rounded-md bg-red-100 text-red-900 text-[11px]">
                            {b.hilang}
                          </span>
                        ) : (
                          <span className="text-slate-300">0</span>
                        )}
                      </td>

                      {/* 9. TERSEDIA */}
                      <td className="p-3 text-center font-bold text-emerald-800 bg-emerald-50/30">
                        <div className="text-sm font-black text-emerald-700">{b.tersedia}</div>
                        <div className="text-[9px] text-emerald-600 font-mono">
                          {lpTersediaItem.lusin}L+{lpTersediaItem.pcs}P
                        </div>
                      </td>

                      {/* 10. AKSI / DETAIL RIWAYAT */}
                      <td className="p-3 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedDetailBarang(b)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold transition shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
                          title={`Lihat detail riwayat transaksi mutasi ${b.nama}`}
                        >
                          <FileText className="w-3.5 h-3.5 text-teal-600" />
                          <span>Detail Riwayat</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* Total Footer */}
            {filteredBarang.length > 0 && (
              <tfoot className="bg-slate-100 border-t-2 border-slate-300 text-xs font-bold text-slate-800">
                <tr>
                  <td colSpan={3} className="p-3 text-right uppercase text-[10px] tracking-wider text-slate-600">
                    Total Rekap ({filteredBarang.length} Item):
                  </td>
                  <td className="p-3 text-center font-bold text-slate-900 bg-slate-200/50">
                    {grandStokAwal}
                  </td>
                  <td className="p-3 text-center font-bold text-teal-800 bg-teal-100/50">
                    +{grandMasuk}
                  </td>
                  <td className="p-3 text-center font-bold text-amber-800 bg-amber-100/50">
                    -{grandKeluar}
                  </td>
                  <td className="p-3 text-center font-bold text-rose-800 bg-rose-100/50">
                    {grandRusak}
                  </td>
                  <td className="p-3 text-center font-bold text-red-800 bg-red-100/50">
                    {grandHilang}
                  </td>
                  <td className="p-3 text-center font-bold text-emerald-800 bg-emerald-100/60">
                    {grandTersedia}
                  </td>
                  <td className="p-3 text-center text-slate-400 font-mono text-[10px]">
                    -
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredBarang.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            itemName="barang rekap"
          />
        </div>
      </div>

      {/* Modal Detail Riwayat Transaksi Mutasi Barang */}
      {selectedDetailBarang && (
        <ModalDetailRiwayatBarang
          barang={selectedDetailBarang}
          transaksiList={transaksiList}
          onClose={() => setSelectedDetailBarang(null)}
        />
      )}

    </div>
  );
};
