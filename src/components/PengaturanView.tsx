import React, { useState } from 'react';
import {
  Settings,
  Store,
  FileText,
  Cloud,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
  FileSpreadsheet,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { AppSettings, CloudConfig } from '../types';
import { SyncService } from '../services/syncService';

interface PengaturanViewProps {
  settings: AppSettings;
  cloudConfig: CloudConfig;
  onSaveSettings: (settings: AppSettings) => void;
  onSaveCloudConfig: (cfg: CloudConfig) => void;
  onForceSync: () => Promise<void>;
  onResetDatabase: () => void;
  isSyncing: boolean;
}

export const PengaturanView: React.FC<PengaturanViewProps> = ({
  settings,
  cloudConfig,
  onSaveSettings,
  onSaveCloudConfig,
  onForceSync,
  onResetDatabase,
  isSyncing,
}) => {
  const [formSettings, setFormSettings] = useState<AppSettings>(settings);
  const [formCloud, setFormCloud] = useState<CloudConfig>(cloudConfig);
  const [saveAlert, setSaveAlert] = useState(false);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formSettings);
    onSaveCloudConfig(formCloud);
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 3000);
  };

  const handleAddSyarat = () => {
    setFormSettings({
      ...formSettings,
      syaratKetentuan: [...formSettings.syaratKetentuan, 'Syarat baru penyewaan'],
    });
  };

  const handleUpdateSyarat = (idx: number, text: string) => {
    const updated = [...formSettings.syaratKetentuan];
    updated[idx] = text;
    setFormSettings({ ...formSettings, syaratKetentuan: updated });
  };

  const handleDeleteSyarat = (idx: number) => {
    setFormSettings({
      ...formSettings,
      syaratKetentuan: formSettings.syaratKetentuan.filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-slate-100 text-slate-800">
              <Settings className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase font-bold tracking-wider text-slate-600">
              Konfigurasi Global &bull; HD Pohon
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900 mt-1">
            Pengaturan Sistem &amp; Profil Usaha
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola identitas usaha dekorasi, template surat jalan, integrasi Google Cloud, serta cadangan database.
          </p>
        </div>

        {saveAlert && (
          <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Pengaturan Berhasil Disimpan!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* Section 1: Profil Usaha */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Store className="w-5 h-5 text-teal-800" />
            <h3 className="font-serif font-bold text-slate-900 text-base">Profil &amp; Kontak Bisnis</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Usaha / Brand *</label>
              <input
                type="text"
                required
                value={formSettings.namaBisnis}
                onChange={(e) => setFormSettings({ ...formSettings, namaBisnis: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tagline Bisnis</label>
              <input
                type="text"
                value={formSettings.tagline}
                onChange={(e) => setFormSettings({ ...formSettings, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">No WhatsApp Reservasi *</label>
              <input
                type="text"
                required
                value={formSettings.noWhatsapp}
                onChange={(e) => setFormSettings({ ...formSettings, noWhatsapp: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Bisnis</label>
              <input
                type="email"
                value={formSettings.emailBisnis}
                onChange={(e) => setFormSettings({ ...formSettings, emailBisnis: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Alamat Gudang &amp; Workshop</label>
              <input
                type="text"
                value={formSettings.alamatGudang}
                onChange={(e) => setFormSettings({ ...formSettings, alamatGudang: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Jam Operasional Pelayanan</label>
              <input
                type="text"
                value={formSettings.jamOperasional}
                onChange={(e) => setFormSettings({ ...formSettings, jamOperasional: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Syarat & Ketentuan Surat Jalan */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-800" />
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-base">Syarat &amp; Ketentuan Sewa</h3>
                <p className="text-[11px] text-slate-400">Dicetak otomatis pada Surat Jalan resmi untuk ditandatangani WO/Penyewa</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddSyarat}
              className="px-3 py-1.5 bg-teal-50 text-teal-800 font-bold rounded-xl text-xs hover:bg-teal-100 cursor-pointer"
            >
              + Tambah Poin
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {formSettings.syaratKetentuan.map((s, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="font-bold text-slate-400 w-5">{idx + 1}.</span>
                <input
                  type="text"
                  value={s}
                  onChange={(e) => handleUpdateSyarat(idx, e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteSyarat(idx)}
                  className="p-2 text-rose-500 hover:text-rose-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Integrasi Google Cloud IDs */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-emerald-700" />
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-base">Parameter Google Drive &amp; Spreadsheet</h3>
                <p className="text-[11px] text-slate-400">ID Google Spreadsheet dan Folder Drive resmi yang terhubung</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onForceSync}
              disabled={isSyncing}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sinkron Sekarang</span>
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Google Spreadsheet ID (9 Sheet Otomatis) *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  value={formCloud.spreadsheetId}
                  onChange={(e) => setFormCloud({ ...formCloud, spreadsheetId: e.target.value })}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
                />
                <a
                  href={`https://docs.google.com/spreadsheets/d/${formCloud.spreadsheetId}/edit`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl flex items-center gap-1"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Folder Drive Foto Pohon ID *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={formCloud.folderPohonId}
                    onChange={(e) => setFormCloud({ ...formCloud, folderPohonId: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
                  />
                  <a
                    href={`https://drive.google.com/drive/folders/${formCloud.folderPohonId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl flex items-center gap-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Folder Drive Data Barang ID *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={formCloud.folderBarangId}
                    onChange={(e) => setFormCloud({ ...formCloud, folderBarangId: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
                  />
                  <a
                    href={`https://drive.google.com/drive/folders/${formCloud.folderBarangId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl flex items-center gap-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="px-8 py-3.5 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-2xl text-xs shadow-lg shadow-teal-900/25 transition cursor-pointer flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Simpan Semua Perubahan Pengaturan</span>
          </button>
        </div>
      </form>

      {/* Section 4: Data Management & Reset */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-serif font-bold text-slate-900 text-base">Cadangan &amp; Pemulihan Data</h3>
        <p className="text-xs text-slate-500">
          Unduh berkas pencadangan lengkap dalam format JSON terenkripsi untuk keamanan arsip jangka panjang.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => SyncService.exportDatabaseJson()}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Cadangan JSON</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('PERINGATAN: Apakah Anda yakin ingin mereset seluruh database lokal ke data default HD Pohon?')) {
                onResetDatabase();
              }
            }}
            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition ml-auto"
          >
            Reset Database ke Default Pabrik
          </button>
        </div>
      </div>
    </div>
  );
};
