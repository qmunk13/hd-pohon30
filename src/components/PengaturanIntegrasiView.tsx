import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  FolderOpen, 
  ExternalLink, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Code2, 
  Sparkles, 
  Link2,
  Database,
  ArrowDownToLine,
  ArrowUpFromLine,
  Info
} from 'lucide-react';
import { GoogleWorkspaceConfig } from '../types';
import { AppDataService } from '../services/api';

interface PengaturanIntegrasiViewProps {
  onDataSynced?: () => void;
  onOpenCodeModal?: () => void;
  onShowToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const PengaturanIntegrasiView: React.FC<PengaturanIntegrasiViewProps> = ({
  onDataSynced,
  onOpenCodeModal,
  onShowToast
}) => {
  const [config, setConfig] = useState<GoogleWorkspaceConfig>(() => AppDataService.getWorkspaceConfig());
  const [formConfig, setFormConfig] = useState<GoogleWorkspaceConfig>(config);
  
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  
  const [pulling, setPulling] = useState(false);
  const [pullResult, setPullResult] = useState<{ success: boolean; message: string } | null>(null);
  
  const [pushing, setPushing] = useState(false);
  const [pushResult, setPushResult] = useState<{ success: boolean; message: string } | null>(null);
  
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail) {
        setConfig(e.detail);
        setFormConfig(e.detail);
      }
    };
    window.addEventListener('workspace_config_updated', handleUpdate);
    return () => window.removeEventListener('workspace_config_updated', handleUpdate);
  }, []);

  const handleCopy = (text: string, idName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(idName);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = AppDataService.setWorkspaceConfig(formConfig);
    setConfig(updated);
    setSaveSuccess(true);
    if (onShowToast) onShowToast('Konfigurasi Google Spreadsheet & Drive berhasil disimpan!', 'success');
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetDefault = () => {
    const def = {
      spreadsheetId: '1M15FoyygajEcUDbbRQK_nrW0W1qBxd46JeHdcenDnjE',
      folderPohonId: '14qGshMKouuEzGwOJUha5gzWDiSkvMKgK',
      folderBarangId: '10ve5r-OnR_dM-_aR_yFQ9tifSJj2Ik-b',
      webAppUrl: formConfig.webAppUrl || ''
    };
    setFormConfig({
      ...formConfig,
      ...def,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${def.spreadsheetId}/edit`,
      folderPohonUrl: `https://drive.google.com/drive/folders/${def.folderPohonId}`,
      folderBarangUrl: `https://drive.google.com/drive/folders/${def.folderBarangId}`
    });
  };

  const handleTestConnection = async () => {
    const url = formConfig.webAppUrl.trim();
    if (!url) {
      setTestResult({
        success: false,
        message: 'Masukkan URL Web App Google Apps Script terlebih dahulu.'
      });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const res = await AppDataService.testGasConnection(url);
      setTestResult(res);
      if (res.success) {
        AppDataService.setWorkspaceConfig({ webAppUrl: url });
        if (onShowToast) onShowToast('Koneksi ke Google Apps Script berhasil terhubung!', 'success');
      }
    } finally {
      setTesting(false);
    }
  };

  const handlePullData = async () => {
    if (!formConfig.webAppUrl.trim()) {
      setPullResult({
        success: false,
        message: 'Masukkan URL Web App terlebih dahulu sebelum menarik data.'
      });
      return;
    }
    setPulling(true);
    setPullResult(null);
    try {
      const res = await AppDataService.pullFromGoogleSheets();
      setPullResult(res);
      if (res.success) {
        if (onShowToast) onShowToast('Berhasil menarik data terbaru dari Google Spreadsheet!', 'success');
        if (onDataSynced) onDataSynced();
      }
    } finally {
      setPulling(false);
    }
  };

  const handlePushData = async () => {
    if (!formConfig.webAppUrl.trim()) {
      setPushResult({
        success: false,
        message: 'Masukkan URL Web App terlebih dahulu sebelum mengirim data.'
      });
      return;
    }
    setPushing(true);
    setPushResult(null);
    try {
      const res = await AppDataService.pushAllToGoogleSheets();
      setPushResult(res);
      if (res.success) {
        if (onShowToast) onShowToast('Berhasil mengekspor semua data ke Google Spreadsheet!', 'success');
      }
    } finally {
      setPushing(false);
    }
  };

  const isConnected = !!config.webAppUrl.trim();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase font-bold tracking-wider text-teal-800">
              Integrasi Google Workspace & Drive
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900 mt-1">
            Pengaturan Manual Spreadsheet &amp; Folder Drive
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola dan ganti SPREADSHEET_ID, FOLDER_ID_POHON, dan FOLDER_ID_BARANG kapan saja secara manual.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isConnected ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Spreadsheet Terhubung
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Menunggu URL Web App
            </span>
          )}
          {onOpenCodeModal && (
            <button
              onClick={onOpenCodeModal}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5 text-teal-400" />
              <span>Lihat Code.gs</span>
            </button>
          )}
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Pengaturan Spreadsheet ID & Folder ID berhasil disimpan dan langsung aktif!</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Card: 3 Parameter Utama Google Workspace */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-teal-700" />
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-base">
                  3 Parameter Utama Google Workspace
                </h3>
                <p className="text-[11px] text-slate-400">
                  Ubah ID di bawah ini jika Anda mengganti file Spreadsheet atau Folder Google Drive
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetDefault}
              className="text-xs text-teal-700 hover:text-teal-900 font-semibold underline cursor-pointer"
            >
              Kembalikan ke ID Resmi
            </button>
          </div>

          <div className="space-y-5 text-xs">
            {/* 1. SPREADSHEET_ID */}
            <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-mono text-[11px]">1</span>
                  <span>SPREADSHEET_ID (Database Utama)</span>
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(formConfig.spreadsheetId, 'ss')}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition"
                    title="Salin SPREADSHEET_ID"
                  >
                    {copiedId === 'ss' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href={formConfig.spreadsheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 hover:border-teal-500 rounded-lg text-teal-700 font-bold transition text-[11px]"
                  >
                    <span>Buka Spreadsheet</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <input
                type="text"
                required
                value={formConfig.spreadsheetId}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormConfig({
                    ...formConfig,
                    spreadsheetId: val,
                    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${val.trim()}/edit`
                  });
                }}
                placeholder="Contoh: 1M15FoyygajEcUDbbRQK_nrW0W1qBxd46JeHdcenDnjE"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-slate-800 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400">
                URL langsung: <a href={formConfig.spreadsheetUrl} target="_blank" rel="noreferrer" className="text-teal-600 underline font-mono break-all">{formConfig.spreadsheetUrl}</a>
              </p>
            </div>

            {/* 2. FOLDER_ID_POHON */}
            <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[11px]">2</span>
                  <span>FOLDER_ID_POHON (Folder Foto &amp; Katalog Pohon)</span>
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(formConfig.folderPohonId, 'phn')}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition"
                    title="Salin FOLDER_ID_POHON"
                  >
                    {copiedId === 'phn' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href={formConfig.folderPohonUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 hover:border-emerald-500 rounded-lg text-emerald-700 font-bold transition text-[11px]"
                  >
                    <span>Buka Folder Drive</span>
                    <FolderOpen className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <input
                type="text"
                required
                value={formConfig.folderPohonId}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormConfig({
                    ...formConfig,
                    folderPohonId: val,
                    folderPohonUrl: `https://drive.google.com/drive/folders/${val.trim()}`
                  });
                }}
                placeholder="Contoh: 14qGshMKouuEzGwOJUha5gzWDiSkvMKgK"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400">
                URL langsung: <a href={formConfig.folderPohonUrl} target="_blank" rel="noreferrer" className="text-emerald-600 underline font-mono break-all">{formConfig.folderPohonUrl}</a>
              </p>
            </div>

            {/* 3. FOLDER_ID_BARANG */}
            <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-mono text-[11px]">3</span>
                  <span>FOLDER_ID_BARANG (Folder Foto &amp; Master Barang)</span>
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(formConfig.folderBarangId, 'brg')}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition"
                    title="Salin FOLDER_ID_BARANG"
                  >
                    {copiedId === 'brg' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href={formConfig.folderBarangUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 hover:border-sky-500 rounded-lg text-sky-700 font-bold transition text-[11px]"
                  >
                    <span>Buka Folder Drive</span>
                    <FolderOpen className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <input
                type="text"
                required
                value={formConfig.folderBarangId}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormConfig({
                    ...formConfig,
                    folderBarangId: val,
                    folderBarangUrl: `https://drive.google.com/drive/folders/${val.trim()}`
                  });
                }}
                placeholder="Contoh: 10ve5r-OnR_dM-_aR_yFQ9tifSJj2Ik-b"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-slate-800 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400">
                URL langsung: <a href={formConfig.folderBarangUrl} target="_blank" rel="noreferrer" className="text-sky-600 underline font-mono break-all">{formConfig.folderBarangUrl}</a>
              </p>
            </div>
          </div>
        </div>

        {/* Card: URL Deployment Web App Apps Script */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Link2 className="w-5 h-5 text-indigo-700" />
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-base">
                  URL Web App Google Apps Script (GAS)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Dihasilkan saat Anda klik Deploy &gt; New Deployment &gt; Web app di script.google.com
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={formConfig.webAppUrl}
                onChange={(e) => setFormConfig({ ...formConfig, webAppUrl: e.target.value })}
                placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-800 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing || !formConfig.webAppUrl.trim()}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                <span>{testing ? 'Menguji...' : 'Uji Koneksi'}</span>
              </button>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  testResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium'
                    : 'bg-rose-50 border-rose-200 text-rose-800 font-medium'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button: Save Configuration */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Semua Perubahan ID &amp; Link</span>
          </button>
        </div>
      </form>

      {/* Card: Operasi Sinkronisasi Langsung */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-850 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-teal-400">
            Sinkronisasi Data Dua Arah
          </span>
          <h3 className="text-lg sm:text-xl font-serif font-bold text-white mt-1">
            Tarik &amp; Ekspor Data Langsung ke Spreadsheet
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Gunakan tombol di bawah ini untuk menyinkronkan seluruh database lokal dengan Google Spreadsheet secara instan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Button: Pull From Spreadsheet */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-teal-400">
              <ArrowDownToLine className="w-5 h-5" />
              <h4 className="font-bold text-sm text-white">Tarik Data dari Spreadsheet (Pull)</h4>
            </div>
            <p className="text-xs text-slate-300">
              Mengambil seluruh data terbaru dari sheet KATALOG_POHON, MASTER_BARANG, PELANGGAN, SUPPLIER, dan USERS ke aplikasi.
            </p>
            <button
              type="button"
              onClick={handlePullData}
              disabled={pulling || !config.webAppUrl.trim()}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${pulling ? 'animate-spin' : ''}`} />
              <span>{pulling ? 'Menarik Data...' : '📥 Tarik Data Sekarang (Pull)'}</span>
            </button>
            {pullResult && (
              <div className={`p-2.5 rounded-lg text-xs ${pullResult.success ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' : 'bg-rose-950/80 text-rose-300 border border-rose-800'}`}>
                {pullResult.message}
              </div>
            )}
          </div>

          {/* Button: Push All To Spreadsheet */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-sky-400">
              <ArrowUpFromLine className="w-5 h-5" />
              <h4 className="font-bold text-sm text-white">Ekspor Data ke Spreadsheet (Push)</h4>
            </div>
            <p className="text-xs text-slate-300">
              Mengirimkan seluruh data lokal saat ini ke Google Spreadsheet untuk backup dan pembaharuan sheet otomatis.
            </p>
            <button
              type="button"
              onClick={handlePushData}
              disabled={pushing || !config.webAppUrl.trim()}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${pushing ? 'animate-spin' : ''}`} />
              <span>{pushing ? 'Mengirim Data...' : '📤 Ekspor Data Sekarang (Push)'}</span>
            </button>
            {pushResult && (
              <div className={`p-2.5 rounded-lg text-xs ${pushResult.success ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' : 'bg-rose-950/80 text-rose-300 border border-rose-800'}`}>
                {pushResult.message}
              </div>
            )}
          </div>
        </div>

        {/* Petunjuk Singkat */}
        <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/60 text-xs text-slate-300 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-white">
            <Info className="w-4 h-4 text-teal-400" />
            <span>Cara Menghubungkan Google Apps Script:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1">
            <li>Buka Spreadsheet Anda di: <a href={config.spreadsheetUrl} target="_blank" rel="noreferrer" className="text-teal-400 underline font-mono">{config.spreadsheetId}</a></li>
            <li>Klik menu <b>Ekstensi &gt; Apps Script</b> di Google Spreadsheet.</li>
            <li>Tempelkan isi file <b className="text-white">Code.gs</b> ke editor Apps Script.</li>
            <li>Klik tombol <b>Terapkan (Deploy) &gt; Penerapan Baru (New Deployment)</b>, pilih jenis <b>Aplikasi Web (Web App)</b>.</li>
            <li>Set <i>Akses (Who has access)</i> ke <b>Siapa Saja (Anyone)</b>, lalu salin URL Web App dan tempelkan ke kolom URL di atas.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
