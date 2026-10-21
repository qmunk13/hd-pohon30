import { 
  Barang, 
  PohonKatalog, 
  Penyewaan, 
  Transaksi, 
  MasterDataItem, 
  Pelanggan, 
  Supplier, 
  UserAccount 
} from './types';
import { INITIAL_PRODUCTS } from './data/initialProducts';

export const INITIAL_POHON_KATALOG: PohonKatalog[] = INITIAL_PRODUCTS.map((p) => ({
  id: p.id,
  kode: p.code,
  nama: p.name,
  kategori: p.category,
  tinggi: p.height,
  fotoUrl: p.imageUrl,
  stokTotal: p.stockTotal,
  stokTersedia: p.stockAvailable,
  stokDisewa: p.stockRented,
  statusKetersediaan: p.status,
  keterangan: p.description,
  widthSpread: p.widthSpread,
  trunkType: p.trunkType,
  foliageType: p.foliageType,
  highlights: p.highlights,
  recommendedFor: p.recommendedFor,
  tanggalInput: '2026-01-15',
  updatedAt: new Date().toISOString()
}));

export const INITIAL_BARANG: Barang[] = [
  {
    id: 'brg-001',
    kode: 'STN-PLAT-01',
    nama: 'Plat Besi Dudukan Pohon Heavy Duty 60x60cm',
    kategori: 'Hardware & Base',
    jenis: 'Base Plate',
    stokTotal: 20,
    stokTersedia: 16,
    stokDisewa: 4,
    satuan: 'Unit',
    lokasiRak: 'Gudang Utama - Rak A1',
    keterangan: 'Plat stabilizer baja pemberat bawah pohon knockdown.',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'brg-002',
    kode: 'ACC-POT-RSC',
    nama: 'Cover Pot Kayu Rustic Finishing Natural Teak',
    kategori: 'Pot & Cover',
    jenis: 'Wooden Pot',
    stokTotal: 15,
    stokTersedia: 12,
    stokDisewa: 3,
    satuan: 'Pcs',
    lokasiRak: 'Gudang Utama - Rak B2',
    keterangan: 'Penutup pot base plat agar tampak natural estetik.',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'brg-003',
    kode: 'LGT-SPOT-WARM',
    nama: 'Spotlight LED 50W Warm White IP65',
    kategori: 'Lighting',
    jenis: 'Uplight Decor',
    stokTotal: 30,
    stokTersedia: 24,
    stokDisewa: 6,
    satuan: 'Unit',
    lokasiRak: 'Gudang Elektrik - Rak E1',
    keterangan: 'Sorot pohon bawah ke atas untuk efek megah pelaminan malam hari.',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'brg-004',
    kode: 'FLR-WIST-WHT',
    nama: 'Bunga Gantung Wisteria Putih Sulur 110cm',
    kategori: 'Daun & Bunga Artifisial',
    jenis: 'Juntaian Bunga',
    stokTotal: 120,
    stokTersedia: 100,
    stokDisewa: 20,
    satuan: 'Tangkai',
    lokasiRak: 'Rak Bunga - C3',
    keterangan: 'Aksesoris sulur tambahan untuk beringin putih pelaminan.',
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_MASTER_DATA: MasterDataItem[] = [
  { id: 'md-1', tipe: 'KATEGORI_POHON', nilai: 'Pohon Besar', keterangan: 'Tinggi > 2.5 Meter', updatedAt: new Date().toISOString() },
  { id: 'md-2', tipe: 'KATEGORI_POHON', nilai: 'Pohon Sedang', keterangan: 'Tinggi 1.8 - 2.5 Meter', updatedAt: new Date().toISOString() },
  { id: 'md-3', tipe: 'KATEGORI_POHON', nilai: 'Pohon Lorong Entrance', keterangan: 'Format gate melengkung', updatedAt: new Date().toISOString() },
  { id: 'md-4', tipe: 'KATEGORI_BARANG', nilai: 'Hardware & Base', keterangan: 'Plat dudukan & bracket', updatedAt: new Date().toISOString() },
  { id: 'md-5', tipe: 'KATEGORI_BARANG', nilai: 'Pot & Cover', keterangan: 'Cover pot kayu & fiberglass', updatedAt: new Date().toISOString() },
  { id: 'md-6', tipe: 'KATEGORI_BARANG', nilai: 'Lighting', keterangan: 'Lampu sorot panggung', updatedAt: new Date().toISOString() },
  { id: 'md-7', tipe: 'JENIS_BARANG', nilai: 'Base Plate', updatedAt: new Date().toISOString() },
  { id: 'md-8', tipe: 'JENIS_BARANG', nilai: 'Wooden Pot', updatedAt: new Date().toISOString() },
  { id: 'md-9', tipe: 'SATUAN', nilai: 'Unit', updatedAt: new Date().toISOString() },
  { id: 'md-10', tipe: 'SATUAN', nilai: 'Pcs', updatedAt: new Date().toISOString() },
  { id: 'md-11', tipe: 'SATUAN', nilai: 'Tangkai', updatedAt: new Date().toISOString() },
  { id: 'md-12', tipe: 'LOKASI_RAK', nilai: 'Gudang Utama - Rak A1', updatedAt: new Date().toISOString() },
  { id: 'md-13', tipe: 'LOKASI_RAK', nilai: 'Gudang Utama - Rak B2', updatedAt: new Date().toISOString() }
];

export const INITIAL_PELANGGAN: Pelanggan[] = [];

export const INITIAL_SUPPLIER: Supplier[] = [];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr-admin',
    username: 'admin',
    namaLengkap: 'Administrator HD-Pohon',
    role: 'ADMIN',
    status: 'AKTIF',
    noHp: '08119500890',
    email: 'hdpohon@gmail.com',
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_PENYEWAAN: Penyewaan[] = [];

export const INITIAL_TRANSAKSI: Transaksi[] = [];

