import React from 'react';
import { X, Printer, CheckCircle2, Calendar, MapPin, Phone, User } from 'lucide-react';
import { Penyewaan, APP_LOGO } from '../types';
import { SyncService } from '../services/syncService';

interface SuratJalanModalProps {
  isOpen: boolean;
  sewa: Penyewaan | null;
  onClose: () => void;
}

export const SuratJalanModal: React.FC<SuratJalanModalProps> = ({ isOpen, sewa, onClose }) => {
  if (!isOpen || !sewa) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Action Header (Hidden in Print) */}
        <div className="no-print bg-slate-900 text-white p-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📄</span>
            <div>
              <h3 className="font-bold text-sm">Surat Jalan & Bukti Sewa Resmi</h3>
              <p className="text-xs text-slate-400 font-mono">{sewa.noSewa}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Cetak PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-10 text-slate-800 text-xs bg-white">
          {/* Header Kop Surat */}
          <div className="border-b-2 border-slate-900 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img 
                src={APP_LOGO} 
                alt="HD-Pohon Logo" 
                className="w-14 h-14 object-contain shadow-xs shrink-0" 
              />
              <div>
                <h1 className="font-serif font-black text-xl text-slate-900 tracking-tight">
                  HD Pohon
                </h1>
                <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
                  Penyewaan Pohon Artifisial & Dekorasi Pelaminan Eksklusif
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Jl. Pangeran Tubagus Angke, Jakarta &bull; WA: 0811-9500-890
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200">
              <span className="inline-block px-3 py-1 bg-slate-100 rounded-lg font-mono font-bold text-xs text-slate-800 mb-1">
                {sewa.noSewa}
              </span>
              <div className="text-[11px] text-slate-500">
                Status:{' '}
                <span className="font-bold text-teal-800 uppercase">{sewa.status}</span>
              </div>
            </div>
          </div>

          <div className="text-center my-4">
            <h2 className="text-base sm:text-lg font-serif font-extrabold text-slate-900 uppercase tracking-wider underline underline-offset-4">
              SURAT JALAN &amp; BUKTI PEMINJAMAN BARANG
            </h2>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-slate-600">
                <User className="w-3.5 h-3.5 text-teal-700" />
                <span className="text-[11px] font-semibold">Penyewa / WO:</span>
                <span className="font-bold text-slate-900 text-xs">{sewa.namaPelanggan}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-teal-700" />
                <span className="text-[11px] font-semibold">Kontak / WA:</span>
                <span className="font-mono text-slate-800 font-bold">{sewa.noTelepon}</span>
              </div>
              <div className="flex items-start gap-2 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-semibold">Lokasi Acara: </span>
                  <span className="text-slate-800 font-medium">{sewa.alamatAcara}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-3.5 h-3.5 text-teal-700" />
                <span className="text-[11px] font-semibold">Tanggal Sewa Keluar:</span>
                <span className="font-bold text-slate-900">
                  {SyncService.formatTanggalIndo(sewa.tanggalSewa, false)} {sewa.jamSewa ? `(${sewa.jamSewa} WIB)` : ''}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                <span className="text-[11px] font-semibold text-amber-900">Batas Pengembalian:</span>
                <span className="font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                  {SyncService.formatTanggalIndo(sewa.tanggalRencanaKembali, false)}
                </span>
              </div>
              <div className="text-[11px] text-slate-600">
                <span className="font-semibold">Petugas Gudang:</span>{' '}
                <span className="font-medium text-slate-900">{sewa.userKasir}</span>
              </div>
            </div>
          </div>

          {/* Table Items */}
          <div className="mb-6 overflow-hidden border border-slate-300 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 font-bold text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-300">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center">No</th>
                  <th className="py-2.5 px-3">Kode Barang</th>
                  <th className="py-2.5 px-3">Nama Material Dekorasi</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3 text-center">Jumlah Disewa</th>
                  <th className="py-2.5 px-3 text-center">Satuan</th>
                  <th className="py-2.5 px-3 text-center">Kondisi Awal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {sewa.items.map((it, idx) => (
                  <tr key={it.idItem || idx}>
                    <td className="py-2.5 px-3 text-center font-medium text-slate-500">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-teal-800">{it.kode}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">{it.namaBarang}</td>
                    <td className="py-2.5 px-3 text-slate-600">{it.kategori}</td>
                    <td className="py-2.5 px-3 text-center font-black text-slate-900 text-sm">
                      {it.qtySewa}
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-600">{it.satuan}</td>
                    <td className="py-2.5 px-3 text-center text-emerald-700 font-semibold">
                      Baik &amp; Lengkap
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t border-slate-300">
                <tr>
                  <td colSpan={4} className="py-2.5 px-3 text-right">
                    Total Keseluruhan Barang:
                  </td>
                  <td className="py-2.5 px-3 text-center text-sm font-black text-teal-900">
                    {sewa.totalQty}
                  </td>
                  <td colSpan={2} className="py-2.5 px-3 text-slate-500 text-[10px]">
                    ({sewa.items.length} Macam Material)
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Catatan & Ketentuan */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[10px] text-slate-600 space-y-1 mb-8 leading-relaxed">
            <div className="font-bold text-slate-800 uppercase tracking-wide">Ketentuan &amp; Tanggung Jawab Penyewa:</div>
            <ol className="list-decimal pl-4 space-y-0.5">
              <li>Barang wajib dikembalikan paling lambat pada tanggal yang telah disepakati: <b>{SyncService.formatTanggalIndo(sewa.tanggalRencanaKembali, false)}</b>.</li>
              <li>Penyewa bertanggung jawab penuh atas keutuhan dan kebersihan material dekorasi selama di lokasi acara.</li>
              <li>Barang yang hilang atau rusak permanen wajib diganti rugi sesuai nilai aset per item yang tercatat pada master inventaris.</li>
            </ol>
          </div>

          {/* Tanda Tangan */}
          <div className="grid grid-cols-2 gap-8 text-center pt-2">
            <div>
              <p className="text-[11px] text-slate-500 mb-16">
                Sleman, {SyncService.formatTanggalPendek(sewa.tanggalSewa)}<br />
                <b>Yang Menyerahkan,</b><br />
                Petugas HD Pohon
              </p>
              <div className="border-t border-slate-400 w-44 mx-auto pt-1 font-bold text-slate-800">
                ( {sewa.userKasir} )
              </div>
            </div>

            <div>
              <p className="text-[11px] text-slate-500 mb-16">
                Mengetahui &amp; Menyetujui,<br />
                <b>Yang Menerima,</b><br />
                Penyewa / Wedding Organizer
              </p>
              <div className="border-t border-slate-400 w-44 mx-auto pt-1 font-bold text-slate-800">
                ( {sewa.namaPelanggan} )
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
