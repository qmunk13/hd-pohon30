import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  X, 
  ExternalLink, 
  Database, 
  BookOpen, 
  Sparkles, 
  Link2, 
  CheckCircle2,
  Download,
  ShieldCheck,
  Smartphone,
  Printer
} from 'lucide-react';
import { AppDataService } from '../services/api';
import { GOOGLE_WORKSPACE_CONFIG } from '../types';

interface GasCodeModalProps {
  onClose: () => void;
}

export const GasCodeModal: React.FC<GasCodeModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'kodegs' | 'indexhtml' | 'panduan' | 'koneksi'>('kodegs');
  const [copiedKode, setCopiedKode] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(false);
  const [gasUrlInput, setGasUrlInput] = useState(AppDataService.getGasUrl());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [kodeGsContent, setKodeGsContent] = useState<string>('Memuat kode lengkap Kode.gs...');
  const [indexHtmlContent, setIndexHtmlContent] = useState<string>('Memuat kode lengkap Index.html...');
  const [kodeGsLines, setKodeGsLines] = useState<number>(0);
  const [indexHtmlLines, setIndexHtmlLines] = useState<number>(0);

  useEffect(() => {
    fetch('/Kode.gs')
      .then(res => res.text())
      .then(text => {
        setKodeGsContent(text);
        setKodeGsLines(text.split('\n').length);
      })
      .catch(() => {
        setKodeGsContent('Gagal memuat Kode.gs dari root server.');
      });

    fetch('/Index.html')
      .then(res => res.text())
      .then(text => {
        setIndexHtmlContent(text);
        setIndexHtmlLines(text.split('\n').length);
      })
      .catch(() => {
        setIndexHtmlContent('Gagal memuat Index.html dari root server.');
      });
  }, []);

  const copyToClipboard = (text: string, type: 'kode' | 'index') => {
    navigator.clipboard.writeText(text);
    if (type === 'kode') {
      setCopiedKode(true);
      setTimeout(() => setCopiedKode(false), 2000);
    } else {
      setCopiedIndex(true);
      setTimeout(() => setCopiedIndex(false), 2000);
    }
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSaveGasUrl = () => {
    AppDataService.setGasUrl(gasUrlInput);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-600 text-white shadow-md shadow-teal-600/20">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-serif font-bold text-slate-900">Kode Lengkap Google Apps Script & Frontend</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  100% Utuh & Tanpa Potongan
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Kedua file ini siap dipasang langsung di Google Apps Script dengan tampilan & fungsi yang sama persis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 bg-slate-50/50 overflow-x-auto">
          <button
            onClick={() => setActiveTab('kodegs')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'kodegs'
                ? 'bg-white text-teal-800 border-t-2 border-teal-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4 text-teal-600" />
            <span>1. Kode.gs ({kodeGsLines ? `${kodeGsLines.toLocaleString('id-ID')} Baris` : '1.228 Baris'})</span>
          </button>
          <button
            onClick={() => setActiveTab('indexhtml')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'indexhtml'
                ? 'bg-white text-teal-800 border-t-2 border-teal-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-4 h-4 text-teal-600" />
            <span>2. Index.html ({indexHtmlLines ? `${indexHtmlLines.toLocaleString('id-ID')} Baris` : '3.096 Baris'})</span>
          </button>
          <button
            onClick={() => setActiveTab('panduan')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'panduan'
                ? 'bg-white text-teal-800 border-t-2 border-teal-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>3. Panduan Setup 9 Sheet</span>
          </button>
          <button
            onClick={() => setActiveTab('koneksi')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'koneksi'
                ? 'bg-white text-teal-800 border-t-2 border-teal-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Link2 className="w-4 h-4 text-indigo-600" />
            <span>4. Hubungkan Web App URL</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-4">
          
          {/* Konfigurasi ID Terpasang Resmi */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Konfigurasi Google Workspace Terpasang di Kode.gs & Index.html</span>
              </span>
              <span className="text-[10px] font-bold text-teal-800 bg-white px-2.5 py-0.5 rounded-full border border-teal-200">
                Resmi Terhubung
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1 text-xs">
              <div className="bg-white p-3 rounded-xl border border-teal-100 flex flex-col justify-between shadow-2xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">📊 Database Spreadsheet</span>
                  <div className="font-mono font-bold text-teal-800 text-[11px] truncate mt-0.5" title={GOOGLE_WORKSPACE_CONFIG.spreadsheetId}>
                    {GOOGLE_WORKSPACE_CONFIG.spreadsheetId.slice(0, 20)}...
                  </div>
                </div>
                <a
                  href={GOOGLE_WORKSPACE_CONFIG.spreadsheetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 text-[10px] font-semibold text-teal-700 hover:underline flex items-center gap-1"
                >
                  <span>Buka Spreadsheet</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="bg-white p-3 rounded-xl border border-teal-100 flex flex-col justify-between shadow-2xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">🌳 Folder Gambar Pohon</span>
                  <div className="font-mono font-bold text-teal-800 text-[11px] truncate mt-0.5" title="1r3kMLLGRncOQUbcaItDDfYV8Nyu7LSQN">
                    1r3kMLLGRncOQUbcaItD...
                  </div>
                </div>
                <a
                  href="https://drive.google.com/drive/folders/1r3kMLLGRncOQUbcaItDDfYV8Nyu7LSQN"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 text-[10px] font-semibold text-teal-700 hover:underline flex items-center gap-1"
                >
                  <span>Buka Drive Folder</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="bg-white p-3 rounded-xl border border-teal-100 flex flex-col justify-between shadow-2xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">🌸 Folder Gambar Barang</span>
                  <div className="font-mono font-bold text-teal-800 text-[11px] truncate mt-0.5" title="1UyXd9bssw2Sn-i57T51WnIFudcfwstzF">
                    1UyXd9bssw2Sn-i57T51...
                  </div>
                </div>
                <a
                  href="https://drive.google.com/drive/folders/1UyXd9bssw2Sn-i57T51WnIFudcfwstzF"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 text-[10px] font-semibold text-teal-700 hover:underline flex items-center gap-1"
                >
                  <span>Buka Drive Folder</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* TAB 1: KODE.GS */}
          {activeTab === 'kodegs' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-teal-50/70 p-4 rounded-2xl border border-teal-200">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-teal-950 font-mono">Kode.gs</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-200 text-teal-900">
                      {kodeGsLines} baris • {(new Blob([kodeGsContent]).size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <p className="text-xs text-teal-800 mt-1">
                    Backend GAS lengkap: setup otomatis 9 sheet & header, otentikasi SHA-256, LockService real-time, getKatalogPohon, getDatabaseBarang, dan logika pengembalian pintar.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => downloadFile('Kode.gs', kodeGsContent)}
                    className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-slate-600" />
                    <span>Download .gs</span>
                  </button>
                  <button
                    onClick={() => copyToClipboard(kodeGsContent, 'kode')}
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedKode ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedKode ? 'Tersalin ke Clipboard!' : 'Salin Seluruh Kode.gs'}</span>
                  </button>
                </div>
              </div>

              {/* Code Viewer Container */}
              <div className="relative">
                <textarea
                  readOnly
                  value={kodeGsContent}
                  className="w-full h-96 p-4 font-mono text-[11px] leading-relaxed bg-slate-900 text-emerald-400 rounded-2xl border border-slate-800 shadow-inner focus:outline-none resize-none selection:bg-teal-600 selection:text-white"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <b>Keamanan Stok (LockService):</b> Kode ini telah dilengkapi <code>LockService.getScriptLock()</code> dengan timeout 20 detik pada fungsi sewa dan pengembalian untuk mencegah race condition atau pengurangan stok ganda.
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INDEX.HTML */}
          {activeTab === 'indexhtml' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-emerald-950 font-mono">Index.html</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900">
                      {indexHtmlLines} baris • {(new Blob([indexHtmlContent]).size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800 mt-1">
                    Frontend Single Page Application (SPA) mandiri: Portal Publik (Katalog Pohon tanpa harga), Database Gudang, Menu Samping (Sidebar & Drawer HP), Cetak Nota Invoice, dan SweetAlert2.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => downloadFile('Index.html', indexHtmlContent)}
                    className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-slate-600" />
                    <span>Download .html</span>
                  </button>
                  <button
                    onClick={() => copyToClipboard(indexHtmlContent, 'index')}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedIndex ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedIndex ? 'Tersalin ke Clipboard!' : 'Salin Seluruh Index.html'}</span>
                  </button>
                </div>
              </div>

              {/* Code Viewer Container */}
              <div className="relative">
                <textarea
                  readOnly
                  value={indexHtmlContent}
                  className="w-full h-96 p-4 font-mono text-[11px] leading-relaxed bg-slate-900 text-sky-300 rounded-2xl border border-slate-800 shadow-inner focus:outline-none resize-none selection:bg-teal-600 selection:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2">
                  <Smartphone className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <b>Navigasi Samping & Responsif HP:</b> Menggunakan sliding off-canvas drawer + bottom bar di HP, sehingga layar ponsel rapi dan tidak tumpang tindih.
                  </div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2">
                  <Printer className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <b>Cetak Nota & Surat Jalan Bersih:</b> Menggunakan <code>window.print()</code> dengan CSS khusus yang otomatis menyembunyikan sidebar dan navbar saat dicetak.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PANDUAN DEPLOY */}
          {activeTab === 'panduan' && (
            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
                <h4 className="font-bold text-teal-900 text-sm mb-1">1. Buat Google Spreadsheet Baru</h4>
                <p>Buka <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-teal-700 font-bold underline inline-flex items-center gap-1">sheets.new <ExternalLink className="w-3 h-3" /></a> di browser Anda dan beri nama: <b>Database Hasan Dekor Pohon</b>.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm mb-1">2. Pasang Kode di Apps Script</h4>
                <p>1. Di menu atas Google Sheet, klik <b>Extensions (Ekstensi)</b> &gt; <b>Apps Script</b>.</p>
                <p>2. Salin seluruh isi file <b>Kode.gs</b> ke file <code>Code.gs</code> di editor.</p>
                <p>3. Buat file baru: klik tanda <b>+</b> &gt; <b>HTML</b> &gt; beri nama <code>Index</code>.</p>
                <p>4. Tempel seluruh isi file <b>Index.html</b> ke dalam file <code>Index.html</code> tersebut, lalu klik <b>Save (Ctrl+S)</b>.</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <h4 className="font-bold text-emerald-900 text-sm mb-1">3. Inisialisasi Database Otomatis (9 Sheet & Header)</h4>
                <p className="mb-2">Pilih fungsi <code>setupDatabase</code> di dropdown toolbar atas Apps Script, lalu klik <b>Run (Jalankan)</b>. Fungsi ini otomatis membuat 9 sheet lengkap dengan header berwarna teal bold:</p>
                
                <div className="space-y-2 mt-2 font-mono text-[11px] bg-white p-3 rounded-xl border border-emerald-200 text-slate-700">
                  <div>
                    <span className="font-bold text-teal-800">1. KATALOG_POHON</span> (Tanpa Kolom Harga):<br/>
                    <code className="text-slate-600">[Kode Pohon, Nama Pohon Dekorasi, Kategori, Tinggi / Dimensi, Foto Pohon (URL), Status Ketersediaan, Keterangan]</code>
                  </div>
                  <div>
                    <span className="font-bold text-teal-800">2. MASTER_BARANG</span> (Barang Non-Pohon: Bunga, Daun, Properti, Aksesoris):<br/>
                    <code className="text-slate-600">[Kode Barang, Nama Barang / Material, Kategori, Foto Barang (URL), Stok Total, Stok Tersedia, Stok Disewa, Satuan, Lokasi Rak / Gudang, Keterangan, UpdatedAt]</code>
                    <p className="text-[10px] text-teal-700 mt-1 font-sans">
                      * Upload foto barang otomatis tersimpan ke Folder Drive <b>1UyXd9bssw2Sn-i57T51WnIFudcfwstzF</b> dan ditampilkan di list tabel barang.
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-teal-800">3. TRANSAKSI</span> (Log Mutasi Stok):<br/>
                    <code className="text-slate-600">[ID Transaksi, Tanggal, Jenis, Kode Barang, Nama Barang, Kategori, Qty, Satuan, No Ref / Sewa, Nama Pihak, Catatan, User, CreatedAt]</code>
                  </div>
                  <div>
                    <span className="font-bold text-teal-800">4. PENYEWAAN</span> (Header Sewa Keluar):<br/>
                    <code className="text-slate-600">[No Sewa, Tanggal Sewa, Tgl Rencana Kembali, Tgl Realisasi Kembali, Nama Pelanggan, No Telepon, Alamat / Lokasi Acara, Total Item, Total Qty, Status Sewa, User Kasir, Catatan, CreatedAt]</code>
                  </div>
                  <div>
                    <span className="font-bold text-teal-800">5. PENYEWAAN_ITEMS</span> (Rincian Bunga/Daun yang Disewa):<br/>
                    <code className="text-slate-600">[ID Item, No Sewa, Kode Barang, Nama Barang, Kategori, Qty Sewa, Satuan, Qty Kembali Bagus, Qty Rusak, Qty Hilang, Status Item, Biaya Denda, Catatan Kerusakan]</code>
                  </div>
                  <div>
                    <span className="font-bold text-teal-800">6. PELANGGAN</span>: <code className="text-slate-600">[ID Pelanggan, Nama Pelanggan, No HP / WA, Alamat, Instansi / WO, Catatan, Aktif, CreatedAt]</code>
                  </div>
                  <div>
                    <span className="font-bold text-teal-800">7. SUPPLIER</span>: <code className="text-slate-600">[ID Supplier, Nama Supplier, Kontak PIC, No Telepon, Alamat, Kategori Suplai, Aktif, CreatedAt]</code>
                  </div>
                  <div>
                    <span className="font-bold text-teal-800">8. USERS</span>: <code className="text-slate-600">[Username, PasswordHash, Nama Lengkap, Role, Aktif, CreatedAt]</code>
                  </div>
                  <div>
                    <span className="font-bold text-teal-800">9. LOG</span>: <code className="text-slate-600">[Waktu, User, Aksi, Detail]</code>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <h4 className="font-bold text-amber-900 text-sm mb-1">4. Deploy Menjadi Web App</h4>
                <p>Klik tombol biru <b>Deploy</b> &gt; <b>New deployment</b> &gt; pilih jenis <b>Web app</b>.</p>
                <p>Execute as: <b>Me (email Anda)</b>, Who has access: <b>Anyone (Siapa saja)</b>. Klik <b>Deploy</b> dan dapatkan link Web App publik Anda!</p>
              </div>
            </div>
          )}

          {/* TAB 4: KONEKSI WEB APP URL */}
          {activeTab === 'koneksi' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Hubungkan Live Google Spreadsheet Web App</h3>
                <p className="text-xs text-slate-500">
                  Masukkan Web App URL hasil deployment Google Apps Script Anda untuk menghubungkan UI ini langsung ke Google Spreadsheet asli Anda.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">Google Apps Script Web App URL</label>
                <input
                  type="url"
                  value={gasUrlInput}
                  onChange={e => setGasUrlInput(e.target.value)}
                  placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:border-teal-500"
                />
              </div>

              {savedSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Pengaturan Web App URL berhasil disimpan!</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleSaveGasUrl}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Simpan Konfigurasi URL
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs">
          <span className="text-slate-400">Hasan Dekor Pohon • GAS v4.0 Full-Stack</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
