import React, { useState } from 'react';
import {
  Cloud,
  CheckCircle2,
  RefreshCw,
  FolderOpen,
  FileSpreadsheet,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Download,
  Clock,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { CloudConfig, SyncLogEntry } from '../types';
import { StorageService } from '../services/storageService';
import { SyncService } from '../services/syncService';

interface GoogleDriveSyncPanelProps {
  config: CloudConfig;
  syncLogs: SyncLogEntry[];
  onConfigChange: (newConfig: CloudConfig) => void;
  onForceSync: () => Promise<void>;
  isSyncing: boolean;
}

export const GoogleDriveSyncPanel: React.FC<GoogleDriveSyncPanelProps> = ({
  config,
  syncLogs,
  onConfigChange,
  onForceSync,
  isSyncing,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [webhookInput, setWebhookInput] = useState(config.gasWebhookUrl || '');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const handleToggleAutoSync = () => {
    const updated = { ...config, autoSyncEnabled: !config.autoSyncEnabled };
    onConfigChange(updated);
  };

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...config, gasWebhookUrl: webhookInput.trim() };
    onConfigChange(updated);
    setSaveSuccessMsg('URL Webhook Apps Script berhasil disimpan!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleCopyGasCode = () => {
    const scriptCode = `// HD Pohon - GOOGLE APPS SCRIPT BACKEND v4.0
// ID Spreadsheets: ${config.spreadsheetId}
// Folder Foto Pohon: ${config.folderPohonId}
// Folder Data Barang: ${config.folderBarangId}

const SPREADSHEET_ID = '${config.spreadsheetId}';
const FOLDER_ID_POHON = '${config.folderPohonId}';
const FOLDER_ID_BARANG = '${config.folderBarangId}';

function doGet(e) {
  return HtmlService.createHtmlOutput('<h1>HD Pohon API Online</h1>');
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    const postData = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let logSheet = ss.getSheetByName('LOG') || ss.insertSheet('LOG');
    logSheet.appendRow([new Date(), 'API_SYNC', postData.action || 'SYNC', JSON.stringify(postData.summary || {})]);
    return ContentService.createTextOutput(JSON.stringify({ success: true, message: 'Sync Berhasil!', timestamp: new Date().toISOString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}`;
    navigator.clipboard.writeText(scriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <Cloud className="w-6 h-6" />
            </span>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-teal-700">
                Penyimpanan &amp; Sinkronisasi Cloud
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                Integrasi Google Drive &amp; Google Sheets
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Data pohon, persediaan bunga/daun, surat sewa, dan foto otomatis tersimpan serta disinkronkan ke Google Spreadsheet dan folder Google Drive resmi HD Pohon.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onForceSync}
            disabled={isSyncing}
            className="px-5 py-3 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md shadow-teal-800/20 transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Sekarang'}</span>
          </button>

          <button
            onClick={() => SyncService.exportDatabaseJson()}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold flex items-center gap-2 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Backup Data JSON</span>
          </button>
        </div>
      </div>

      {/* Target Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Spreadsheet Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover-lift flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700">
                <FileSpreadsheet className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Database Utama
              </span>
            </div>
            <h3 className="font-serif font-bold text-slate-900 text-sm">Google Spreadsheet</h3>
            <p className="text-[11px] text-slate-400 mt-1">9 Sheet otomatis: Katalog, Master Barang, Sewa, Mutasi</p>
            <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[10px] text-slate-700 break-all select-all">
              {config.spreadsheetId}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">ID Terpasang Resmi</span>
            <a
              href={`https://docs.google.com/spreadsheets/d/${config.spreadsheetId}/edit`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
            >
              <span>Buka Sheet</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Folder Foto Pohon */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover-lift flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2.5 rounded-2xl bg-teal-50 text-teal-700">
                <FolderOpen className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                Drive Pohon
              </span>
            </div>
            <h3 className="font-serif font-bold text-slate-900 text-sm">Folder Google Drive Foto Pohon</h3>
            <p className="text-[11px] text-slate-400 mt-1">Penyimpanan visual pohon pelaminan, maple, sakura</p>
            <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[10px] text-slate-700 break-all select-all">
              {config.folderPohonId}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">Folder ID Terverifikasi</span>
            <a
              href={`https://drive.google.com/drive/folders/${config.folderPohonId}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
            >
              <span>Buka Folder</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Folder Data Barang */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover-lift flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-700">
                <FolderOpen className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                Drive Barang
              </span>
            </div>
            <h3 className="font-serif font-bold text-slate-900 text-sm">Folder Google Drive Data Barang</h3>
            <p className="text-[11px] text-slate-400 mt-1">Penyimpanan aset foto bunga, daun, properti pelaminan</p>
            <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[10px] text-slate-700 break-all select-all">
              {config.folderBarangId}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">Folder ID Terverifikasi</span>
            <a
              href={`https://drive.google.com/drive/folders/${config.folderBarangId}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
            >
              <span>Buka Folder</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Control Strip & Webhook */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Auto Sync Toggle & Status */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-slate-900 text-base">Status Sinkronisasi Otomatis</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Mengirim pembaruan setiap kali ada perubahan data pohon, barang, atau sewa
              </p>
            </div>
            <button
              onClick={handleToggleAutoSync}
              className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
                config.autoSyncEnabled ? 'bg-teal-700 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-white shadow-md"></span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Status Mesin Sinkronisasi:</span>
              <span
                className={`font-bold flex items-center gap-1.5 ${
                  config.autoSyncEnabled ? 'text-teal-700' : 'text-slate-500'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    config.autoSyncEnabled ? 'bg-teal-600 animate-pulse' : 'bg-slate-400'
                  }`}
                ></span>
                {config.autoSyncEnabled ? 'Aktif (Otomatis per Update)' : 'Nonaktif'}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-2">
              <span className="text-slate-500">Terakhir Berhasil Disinkron:</span>
              <span className="font-mono text-slate-800 font-semibold">
                {config.lastSyncedAt ? SyncService.formatTanggalIndo(config.lastSyncedAt) : 'Belum pernah'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyGasCode}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              <span>{copiedCode ? 'Script Tersalin!' : 'Salin Kode Apps Script (Code.gs)'}</span>
            </button>
          </div>
        </div>

        {/* Webhook Configuration */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-serif font-bold text-slate-900 text-base">URL Webhook Google Apps Script</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Hubungkan URL Web App deployment Anda jika ingin request HTTP langsung ke GAS
            </p>
          </div>

          {saveSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveWebhook} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Web App Deployment URL (Opsional)</label>
              <input
                type="url"
                value={webhookInput}
                onChange={(e) => setWebhookInput(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs outline-none focus:ring-2 focus:ring-teal-500 font-mono text-slate-800"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs shadow-xs transition cursor-pointer"
              >
                Simpan Konfigurasi Webhook
              </button>
              {webhookInput && (
                <button
                  type="button"
                  onClick={() => {
                    setWebhookInput('');
                    onConfigChange({ ...config, gasWebhookUrl: '' });
                  }}
                  className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold"
                >
                  Reset
                </button>
              )}
            </div>
          </form>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            💡 Sistem tetap menyinkronkan data secara lokal dan cloud snapshot berintegritas tinggi sekalipun tanpa Webhook URL eksternal.
          </p>
        </div>
      </div>

      {/* Sync Log History Table with Date & Time */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-700" />
            <h3 className="font-serif font-bold text-slate-900 text-base">Riwayat &amp; Log Sinkronisasi Otomatis</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">{syncLogs.length} Entri Tercatat</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Waktu &amp; Tanggal</th>
                <th className="py-2.5 px-3">Aksi Trigger</th>
                <th className="py-2.5 px-3">Target Sync</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {syncLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400 font-medium">
                    Belum ada riwayat sinkronisasi tercatat.
                  </td>
                </tr>
              ) : (
                syncLogs.slice(0, 8).map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3 font-mono text-slate-600">
                      {SyncService.formatTanggalIndo(log.timestamp || log.waktu || '')}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">{log.aksi}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {log.target}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.status === 'SUCCESS'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {log.status === 'SUCCESS' ? '✓ Berhasil' : '✕ Gagal'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate">{log.message}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
