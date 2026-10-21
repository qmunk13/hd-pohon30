import React from 'react';
import { Printer, X, TreePine } from 'lucide-react';
import { Penyewaan, APP_LOGO } from '../types';

interface InvoiceModalProps {
  sewa: Penyewaan | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ sewa, onClose }) => {
  if (!sewa) return null;

  const tglSewaStr = sewa.tglSewa ? new Date(sewa.tglSewa).toLocaleDateString('id-ID', { dateStyle: 'long' }) : '-';
  const tglKembaliStr = sewa.tglKembali ? new Date(sewa.tglKembali).toLocaleDateString('id-ID', { dateStyle: 'long' }) : '-';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[95vh] overflow-y-auto p-6 sm:p-8 print-card">
        
        {/* Kontrol Modal (Hilang saat cetak) */}
        <div className="no-print flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Preview Cetak Surat Jalan / Bukti Sewa Dekorasi
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AREA FAKTUR BERSIH (PRINT-READY) */}
        <div className="space-y-6 text-slate-800">
          
          {/* Header Toko & Judul Surat Jalan */}
          <div className="flex justify-between items-start pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2.5">
                <img 
                  src={APP_LOGO} 
                  alt="HD-Pohon Logo" 
                  className="w-10 h-10 object-contain shadow-2xs shrink-0" 
                />
                <h1 className="text-xl font-serif font-bold text-slate-900">HD Pohon</h1>
              </div>
              <p className="text-xs text-slate-600 mt-1 font-medium">Rental Pohon & Perlengkapan Dekorasi Pelaminan</p>
              <p className="text-xs text-slate-500">Jl. Pangeran Tubagus Angke, Jakarta | WA: 0811-9500-890</p>
            </div>

            <div className="text-right">
              <div className="text-xs uppercase tracking-widest font-extrabold text-teal-800">
                SURAT JALAN & SEWA DEKORASI
              </div>
              <div className="font-mono font-bold text-base text-slate-900 mt-1">
                {sewa.noSewa}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Tanggal: {tglSewaStr}
              </div>
            </div>
          </div>

          {/* Info Penyewa & Durasi */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-slate-400 font-semibold uppercase text-[10px]">Penyewa / Wedding Organizer</div>
              <div className="font-bold text-slate-900 text-sm mt-0.5">{sewa.namaPelanggan}</div>
              <div className="text-slate-600 font-medium">{sewa.noTelepon}</div>
              <div className="text-slate-500 mt-1">{sewa.alamat || 'Lokasi acara belum dicantumkan'}</div>
            </div>

            <div className="text-right">
              <div className="text-slate-400 font-semibold uppercase text-[10px]">Jadwal Penggunaan</div>
              <div className="text-slate-700 mt-0.5">Tgl Kirim/Pinjam: <span className="font-semibold">{tglSewaStr}</span></div>
              <div className="text-slate-700">Tgl Rencana Kembali: <span className="font-semibold">{tglKembaliStr}</span></div>
              <div className="mt-1">
                Status: <span className="font-bold text-teal-700">{sewa.status}</span>
              </div>
            </div>
          </div>

          {/* Tabel Barang yang Disewa (Bunga, Daun, Properti, Aksesoris) */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 font-bold text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">No</th>
                  <th className="py-2.5 px-3">Kode & Nama Barang</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3 text-center">Qty Dikirim</th>
                  <th className="py-2.5 px-3 text-center">Satuan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sewa.items.map((it, idx) => (
                  <tr key={it.kode}>
                    <td className="py-2.5 px-3 text-center text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-800">{it.namaBarang}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{it.kode}</div>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-600">{it.kategori || 'Material'}</td>
                    <td className="py-2.5 px-3 text-center font-extrabold text-slate-900 text-sm">{it.qtySewa}</td>
                    <td className="py-2.5 px-3 text-center text-slate-600">{it.satuan || 'Unit'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 font-semibold text-slate-700 border-t border-slate-200">
                <tr>
                  <td colSpan={3} className="py-2.5 px-3 text-right">Total Kuantitas Barang:</td>
                  <td className="py-2.5 px-3 text-center font-bold text-teal-800 text-sm">{sewa.totalQty}</td>
                  <td className="py-2.5 px-3 text-center text-slate-500">Item</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Ketentuan Sewa & Kolom Tanda Tangan */}
          <div className="grid grid-cols-2 gap-6 pt-2 text-xs">
            <div>
              <div className="font-bold text-slate-700 mb-1">Ketentuan Penggunaan Barang:</div>
              <ul className="list-disc list-inside text-slate-500 space-y-0.5 text-[11px] leading-relaxed">
                <li>Barang dekorasi wajib dijaga kebersihan dan kelengkapannya.</li>
                <li>Dilarang menggunting atau merusak tangkai bunga & daun artifisial.</li>
                <li>Pengembalian barang akan diperiksa jumlah kondisi Bagus, Rusak, atau Hilang.</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 text-center text-xs">
              <div>
                <p className="text-slate-500">Penerima / Penyewa,</p>
                <div className="h-14"></div>
                <p className="font-bold text-slate-800">({sewa.namaPelanggan})</p>
              </div>
              <div>
                <p className="text-slate-500">HD Pohon,</p>
                <div className="h-14"></div>
                <p className="font-bold text-slate-800">(Petugas Pengirim)</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
