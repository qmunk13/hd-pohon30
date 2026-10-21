import {
  Pohon,
  Barang,
  Penyewaan,
  TransaksiMutasi,
  CloudConfig,
  SyncLogEntry,
  Supplier,
  Pelanggan,
  UserAccount,
  AppSettings,
  MasterDataLists,
} from '../types';
import {
  INITIAL_POHON,
  INITIAL_BARANG,
  INITIAL_PENYEWAAN,
  INITIAL_TRANSAKSI,
  DEFAULT_CLOUD_CONFIG,
  INITIAL_SUPPLIER,
  INITIAL_PELANGGAN,
  INITIAL_USERS,
  DEFAULT_APP_SETTINGS,
  INITIAL_MASTER_DATA,
} from '../data/initialData';

const STORAGE_KEYS = {
  POHON: 'hasan_dekor_pohon_v5',
  BARANG: 'hasan_dekor_barang_v5',
  SEWA: 'hasan_dekor_sewa_v5',
  TRANSAKSI: 'hasan_dekor_transaksi_v5',
  CONFIG: 'hasan_dekor_config_v5',
  SYNC_LOGS: 'hasan_dekor_sync_logs_v5',
  SUPPLIER: 'hasan_dekor_supplier_v5',
  PELANGGAN: 'hasan_dekor_pelanggan_v5',
  USERS: 'hasan_dekor_users_v5',
  SETTINGS: 'hasan_dekor_settings_v5',
  MASTER_DATA: 'hasan_dekor_master_data_v5',
};

export class StorageService {
  static getMasterData(): MasterDataLists {
    const raw = localStorage.getItem(STORAGE_KEYS.MASTER_DATA);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MASTER_DATA, JSON.stringify(INITIAL_MASTER_DATA));
      return INITIAL_MASTER_DATA;
    }
    try {
      return { ...INITIAL_MASTER_DATA, ...JSON.parse(raw) };
    } catch {
      return INITIAL_MASTER_DATA;
    }
  }

  static saveMasterData(data: MasterDataLists): void {
    localStorage.setItem(STORAGE_KEYS.MASTER_DATA, JSON.stringify(data));
  }

  static getPohon(): Pohon[] {
    const raw = localStorage.getItem(STORAGE_KEYS.POHON);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.POHON, JSON.stringify(INITIAL_POHON));
      return INITIAL_POHON;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_POHON;
    }
  }

  static savePohon(list: Pohon[]): void {
    localStorage.setItem(STORAGE_KEYS.POHON, JSON.stringify(list));
  }

  static getBarang(): Barang[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BARANG);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BARANG, JSON.stringify(INITIAL_BARANG));
      return INITIAL_BARANG;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_BARANG;
    }
  }

  static saveBarang(list: Barang[]): void {
    localStorage.setItem(STORAGE_KEYS.BARANG, JSON.stringify(list));
  }

  static getPenyewaan(): Penyewaan[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SEWA);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SEWA, JSON.stringify(INITIAL_PENYEWAAN));
      return INITIAL_PENYEWAAN;
    }
    try {
      const list: Penyewaan[] = JSON.parse(raw);
      const cleaned = list.filter(s => 
        s.namaPelanggan !== 'Aris Wedding Organizer' && 
        !s.noSewa.includes('20261016-1042') && 
        !s.noSewa.includes('20261017-7412')
      );
      if (cleaned.length !== list.length) {
        localStorage.setItem(STORAGE_KEYS.SEWA, JSON.stringify(cleaned));
      }
      return cleaned;
    } catch {
      return INITIAL_PENYEWAAN;
    }
  }

  static savePenyewaan(list: Penyewaan[]): void {
    localStorage.setItem(STORAGE_KEYS.SEWA, JSON.stringify(list));
  }

  static getTransaksi(): TransaksiMutasi[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSAKSI);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TRANSAKSI, JSON.stringify(INITIAL_TRANSAKSI));
      return INITIAL_TRANSAKSI;
    }
    try {
      const list: TransaksiMutasi[] = JSON.parse(raw);
      const cleaned = list.filter(t => 
        t.namaPihak !== 'Aris Wedding Organizer' && 
        !['trx-101', 'trx-102'].includes(t.id) &&
        !(t.noRef && (t.noRef.includes('20261016-1042') || t.noRef.includes('20261017-7412')))
      );
      if (cleaned.length !== list.length) {
        localStorage.setItem(STORAGE_KEYS.TRANSAKSI, JSON.stringify(cleaned));
      }
      return cleaned;
    } catch {
      return INITIAL_TRANSAKSI;
    }
  }

  static saveTransaksi(list: TransaksiMutasi[]): void {
    localStorage.setItem(STORAGE_KEYS.TRANSAKSI, JSON.stringify(list));
  }

  static getSuppliers(): Supplier[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SUPPLIER);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SUPPLIER, JSON.stringify(INITIAL_SUPPLIER));
      return INITIAL_SUPPLIER;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SUPPLIER;
    }
  }

  static saveSuppliers(list: Supplier[]): void {
    localStorage.setItem(STORAGE_KEYS.SUPPLIER, JSON.stringify(list));
  }

  static getPelanggan(): Pelanggan[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PELANGGAN);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PELANGGAN, JSON.stringify(INITIAL_PELANGGAN));
      return INITIAL_PELANGGAN;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_PELANGGAN;
    }
  }

  static savePelanggan(list: Pelanggan[]): void {
    localStorage.setItem(STORAGE_KEYS.PELANGGAN, JSON.stringify(list));
  }

  static getUsers(): UserAccount[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_USERS;
    }
  }

  static saveUsers(list: UserAccount[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(list));
  }

  static getSettings(): AppSettings {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_APP_SETTINGS));
      return DEFAULT_APP_SETTINGS;
    }
    try {
      return { ...DEFAULT_APP_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_APP_SETTINGS;
    }
  }

  static saveSettings(settings: AppSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  static getConfig(): CloudConfig {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(DEFAULT_CLOUD_CONFIG));
      return DEFAULT_CLOUD_CONFIG;
    }
    try {
      return { ...DEFAULT_CLOUD_CONFIG, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_CLOUD_CONFIG;
    }
  }

  static saveConfig(cfg: CloudConfig): void {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(cfg));
  }

  static getSyncLogs(): SyncLogEntry[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SYNC_LOGS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static addSyncLog(entry: Omit<SyncLogEntry, 'id' | 'timestamp'>): SyncLogEntry {
    const logs = this.getSyncLogs();
    const newEntry: SyncLogEntry = {
      aksi: entry.aksi || 'SYNC',
      ...entry,
      id: 'sync-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      timestamp: new Date().toISOString(),
    };
    logs.unshift(newEntry);
    localStorage.setItem(STORAGE_KEYS.SYNC_LOGS, JSON.stringify(logs.slice(0, 50)));
    return newEntry;
  }

  static resetToDefault(): void {
    localStorage.setItem(STORAGE_KEYS.POHON, JSON.stringify(INITIAL_POHON));
    localStorage.setItem(STORAGE_KEYS.BARANG, JSON.stringify(INITIAL_BARANG));
    localStorage.setItem(STORAGE_KEYS.SEWA, JSON.stringify(INITIAL_PENYEWAAN));
    localStorage.setItem(STORAGE_KEYS.TRANSAKSI, JSON.stringify(INITIAL_TRANSAKSI));
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(DEFAULT_CLOUD_CONFIG));
    localStorage.setItem(STORAGE_KEYS.SUPPLIER, JSON.stringify(INITIAL_SUPPLIER));
    localStorage.setItem(STORAGE_KEYS.PELANGGAN, JSON.stringify(INITIAL_PELANGGAN));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_APP_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.MASTER_DATA, JSON.stringify(INITIAL_MASTER_DATA));
  }
}
