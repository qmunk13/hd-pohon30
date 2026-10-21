import React, { useState } from 'react';
import rawCodeGs from '../../gas/Code.gs?raw';
import rawIndexHtml from '../../gas/index.html?raw';
import {
  X,
  FileCode,
  FileSpreadsheet,
  FolderOpen,
  Copy,
  Check,
  Download,
  ExternalLink,
  Sparkles,
  HelpCircle,
  Terminal,
} from 'lucide-react';

interface GasScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  spreadsheetId: string;
  folderBarangId: string;
  folderPohonId: string;
}

export const GasScriptModal: React.FC<GasScriptModalProps> = ({
  isOpen,
  onClose,
  spreadsheetId,
  folderBarangId,
  folderPohonId,
}) => {
  const [activeTab, setActiveTab] = useState<'codegs' | 'indexhtml' | 'guide'>('codegs');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  // Substitute configured IDs dynamically into Code.gs and index.html
  const codeGsContent = rawCodeGs
    .replace(/1gSyz6gRB_O4E4_QJYPzOkd8NVylRZ4_efnjemeWLzM8/g, spreadsheetId)
    .replace(/1M15FoyygajEcUDbbRQK_nrW0W1qBxd46JeHdcenDnjE/g, spreadsheetId)
    .replace(/1UyXd9bssw2Sn-i57T51WnIFudcfwstzF/g, folderBarangId)
    .replace(/1r3kMLLGRncOQUbcaItDDfYV8Nyu7LSQN/g, folderPohonId);

  const indexHtmlContent = rawIndexHtml
    .replace(/1gSyz6gRB_O4E4_QJYPzOkd8NVylRZ4_efnjemeWLzM8/g, spreadsheetId)
    .replace(/1M15FoyygajEcUDbbRQK_nrW0W1qBxd46JeHdcenDnjE/g, spreadsheetId)
    .replace(/1UyXd9bssw2Sn-i57T51WnIFudcfwstzF/g, folderBarangId)
    .replace(/1r3kMLLGRncOQUbcaItDDfYV8Nyu7LSQN/g, folderPohonId);

  const guideContent = `## PANDUAN DEPLOYMENT GOOGLE APPS SCRIPT (KODE.GS)

Ikuti langkah cepat berikut untuk mengaktifkan integrasi Google Spreadsheet & Google Drive:

### 1. Buka Google Spreadsheet
Buka file Spreadsheet Hasan Dekor Pohon:
URL: https://docs.google.com/spreadsheets/d/${spreadsheetId}

### 2. Buka Extensions > Apps Script
Pada menu atas Google Spreadsheet, klik:
**Extensions (Ekstensi)** -> **Apps Script**.

### 3. Salin File \`Code.gs\`
1. Hapus isi fungsi \`myFunction()\` default.
2. Salin seluruh isi dari tab **Code.gs** pada modal ini.
3. Tempelkan ke editor Apps Script dan klik ikon **Simpan (Save)** 💾.

### 4. Tambahkan File \`index.html\`
1. Pada menu sebelah kiri (Files), klik tanda **+** -> pilih **HTML**.
2. Beri nama file: \`index\` (otomatis menjadi \`index.html\`).
3. Salin seluruh isi dari tab **index.html** pada modal ini.
4. Tempelkan dan klik **Simpan (Save)** 💾.

### 5. Deploy sebagai Web App
1. Klik tombol biru **Deploy** di kanan atas -> pilih **New deployment**.
2. Klik ikon gerigi (Select type) -> pilih **Web app**.
3. Konfigurasi:
   - **Description**: \`Hasan Dekor Pohon Backend v5.5 Enterprise\`
   - **Execute as**: \`Me (email anda)\`
   - **Who has access**: \`Anyone\` (Siapa saja, agar aplikasi frontend & web app bisa kirim data tanpa login manual).
4. Klik **Deploy**.
5. Berikan izin otorisasi Google jika diminta (*Review Permissions* -> Pilih akun -> *Advanced* -> *Go to project (unsafe)* -> *Allow*).

### 6. Hubungkan URL ke Aplikasi Ini
1. Salin **Web App URL** yang didapatkan (berakhir dengan \`/exec\`).
2. Masuk ke tab **⚙️ Pengaturan & Cloud** di Hasan Dekor Pohon.
3. Tempelkan URL pada kolom **Google Apps Script Webhook URL**.
4. Klik **Uji Koneksi** dan **Simpan Pengaturan**.
Selesai! Setiap pembaruan stok, sewa keluar, pengembalian, dan penambahan pohon akan tersinkronisasi otomatis ke Google Drive & Spreadsheet.`;

  const currentContent = activeTab === 'codegs' ? codeGsContent : activeTab === 'indexhtml' ? indexHtmlContent : guideContent;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-black text-white text-base sm:text-lg">
                Google Apps Script Backend Engine
              </h2>
              <p className="text-xs text-slate-400">
                Lengkap dengan Sheet Database_Barang_Bukan_Pohon, Master_Pohon, dan Drive Storage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 px-4 sm:px-6 pt-3 border-b border-slate-800/80 bg-slate-950/40 overflow-x-auto">
          <button
            onClick={() => setActiveTab('codegs')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'codegs'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Code.gs (Backend v5.0 Master &amp; CRUD)</span>
          </button>

          <button
            onClick={() => setActiveTab('indexhtml')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'indexhtml'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>index.html (Portal Publik &amp; Manajemen Gudang)</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'guide'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Panduan Pasang di Spreadsheet</span>
          </button>
        </div>

        {/* Notice Info Banner */}
        <div className="bg-emerald-950/30 border-b border-emerald-500/20 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>
              {activeTab === 'codegs'
                ? 'Ini adalah skrip backend utama (doPost, update baris per item, sinkronisasi 8 sheet & Google Drive).'
                : activeTab === 'indexhtml'
                ? 'File antarmuka Web App lengkap Hasan Dekor Pohon (Katalog Pohon, Database Barang, Sewa & Surat Jalan).'
                : 'Ikuti 6 langkah mudah berikut untuk mengaktifkan sinkronisasi otomatis.'}
            </span>
          </div>
          <span className="font-mono text-[11px] bg-slate-900 px-2.5 py-0.5 rounded-full border border-emerald-500/30 text-emerald-400">
            {currentContent.split('\n').length} Baris Kode
          </span>
        </div>

        {/* Action Bar */}
        <div className="p-3 sm:px-6 bg-slate-950/40 border-b border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              Sheet: <b>{spreadsheetId.slice(0, 12)}...</b>
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
              Barang: <b>{folderBarangId.slice(0, 10)}...</b>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Kode'}</span>
            </button>

            {activeTab === 'codegs' && (
              <button
                onClick={() => handleDownload('Code.gs', codeGsContent)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Code.gs</span>
              </button>
            )}

            {activeTab === 'indexhtml' && (
              <button
                onClick={() => handleDownload('index.html', indexHtmlContent)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh index.html</span>
              </button>
            )}

            <a
              href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Sheet</span>
            </a>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-950/80 font-mono text-xs text-slate-300 leading-relaxed">
          {activeTab === 'guide' ? (
            <div className="font-sans whitespace-pre-wrap leading-relaxed max-w-2xl mx-auto space-y-4 text-slate-200 text-sm">
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-300">
                <Sparkles className="w-5 h-5 shrink-0" />
                <span>
                  Skrip ini telah disesuaikan 100% dengan ID Spreadsheet dan Folder Drive Anda serta struktur sheet persis yang diminta.
                </span>
              </div>
              <div className="prose prose-invert">{guideContent}</div>
            </div>
          ) : (
            <pre className="whitespace-pre overflow-x-auto selection:bg-emerald-500 selection:text-slate-950">
              <code>{currentContent}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
