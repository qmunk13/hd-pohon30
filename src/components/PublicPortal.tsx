import React, { useState } from 'react';
import { 
  TreePine, 
  Search, 
  Phone, 
  MapPin, 
  MessageCircle, 
  Sparkles, 
  LogIn, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Tag, 
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { PohonKatalog } from '../types';

interface PublicPortalProps {
  pohonList: PohonKatalog[];
  onOpenLogin: () => void;
}

export const PublicPortal: React.FC<PublicPortalProps> = ({
  pohonList,
  onOpenLogin
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState<string>('SEMUA');

  const categories = [
    'SEMUA',
    'Pohon Besar',
    'Pohon Sedang',
    'Pohon Karakter',
    'Tanaman Tropis'
  ];

  const filteredPohon = pohonList.filter(p => {
    const matchCat = selectedKategori === 'SEMUA' || p.kategori === selectedKategori;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery = !q || (
      p.nama.toLowerCase().includes(q) ||
      p.kode.toLowerCase().includes(q) ||
      p.keterangan.toLowerCase().includes(q)
    );
    return matchCat && matchQuery;
  });

  const generateWhatsAppLink = (namaPohon: string, kodePohon: string) => {
    const text = encodeURIComponent(
      `Halo HD Pohon, saya tertarik untuk menyewa dekorasi pohon: *${namaPohon}* (${kodePohon}). Apakah tersedia untuk jadwal acara kami?`
    );
    return `https://wa.me/628119500890?text=${text}`;
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Top Navbar Portal Publik */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-700 text-white flex items-center justify-center shadow-md shadow-teal-600/20">
                <TreePine className="w-6 h-6" />
              </div>
              <div>
                <span className="font-serif font-bold text-slate-900 text-base leading-tight tracking-tight block">
                  HD Pohon
                </span>
                <span className="text-[11px] font-semibold tracking-wider text-teal-700 uppercase">
                  Rental Pohon & Dekorasi Pelaminan
                </span>
              </div>
            </div>

            {/* Menu Links & Login Admin Button */}
            <div className="flex items-center gap-3 sm:gap-6">
              <a href="#katalog" className="hidden md:inline-block text-xs font-semibold text-slate-600 hover:text-teal-700 transition">
                Katalog Pohon
              </a>
              <a href="#tentang" className="hidden md:inline-block text-xs font-semibold text-slate-600 hover:text-teal-700 transition">
                Tentang Kami
              </a>
              <a href="#kontak" className="hidden md:inline-block text-xs font-semibold text-slate-600 hover:text-teal-700 transition">
                Kontak & Lokasi
              </a>

              {/* Login Button for Staff / Admin */}
              <button
                onClick={onOpenLogin}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk</span>
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/70 via-slate-50 to-slate-50 py-12 sm:py-20 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-4 border border-teal-200/80">
            <Sparkles className="w-3.5 h-3.5 text-teal-700" />
            <span>Katalog Eksklusif Sewa Pohon & Dekorasi</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight max-w-3xl mx-auto leading-tight">
            Penyewaan Pohon Artifisial & Properti Dekorasi Mewah
          </h1>

          <p className="text-slate-600 text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
            Menghadirkan keindahan alami pohon maple merah, beringin putih pelaminan, sakura mekar, dan palem tropis rimbun untuk pernikahan, photobooth, lamaran, dan event bergengsi.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <a
              href="#katalog"
              className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-teal-700/20 transition flex items-center gap-2"
            >
              <span>Jelajahi Koleksi Pohon</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/628119500890?text=Halo%20Hasan%20Dekor,%20saya%20ingin%20konsultasi%20sewa%20pohon%20dekorasi"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Konsultasi via WhatsApp</span>
            </a>
          </div>

          {/* Key Value Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto text-left">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">🌲</div>
              <div>
                <div className="text-xs font-bold text-slate-900">Pohon Semi-Natural</div>
                <div className="text-[11px] text-slate-400">Batang kayu asli & daun rimbun</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">🚚</div>
              <div>
                <div className="text-xs font-bold text-slate-900">Antar & Pasang</div>
                <div className="text-[11px] text-slate-400">Siap pasang di lokasi gedung</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">✨</div>
              <div>
                <div className="text-xs font-bold text-slate-900">Kualitas Prima</div>
                <div className="text-[11px] text-slate-400">Bersih, kokoh, dan terawat</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">💬</div>
              <div>
                <div className="text-xs font-bold text-slate-900">Konsultasi Ramah</div>
                <div className="text-[11px] text-slate-400">Tersedia via WA 24/7</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* KATALOG POHON & DEKORASI (JANGAN ADA HARGANYA - TANPA HARGA) */}
      {/* ========================================================================= */}
      <section id="katalog" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-teal-700 font-bold mb-1">Pilihan Koleksi</div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Katalog Pohon Dekorasi Eksklusif
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Lihat foto detail pohon dekorasi kami. Silakan hubungi kami untuk cek ketersediaan tanggal acara Anda.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-80 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari jenis pohon (maple, sakura, beringin)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 shadow-xs"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8">
          {categories.map(cat => {
            const isActive = selectedKategori === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedKategori(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat === 'SEMUA' ? 'Semua Koleksi' : cat}
              </button>
            );
          })}
        </div>

        {/* Product Grid - TANPA HARGA */}
        {filteredPohon.length === 0 ? (
          <div className="bg-white p-16 text-center rounded-2xl border border-slate-200 text-slate-400">
            Tidak ada koleksi pohon yang cocok dengan filter pencarian.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPohon.map(pohon => {
              const imgSrc = pohon.fotoUrl && pohon.fotoUrl.startsWith('http') ? pohon.fotoUrl : fallbackImage;
              const isTersedia = pohon.statusKetersediaan === 'Tersedia';

              return (
                <div
                  key={pohon.kode}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
                >
                  {/* Photo Display */}
                  <div className="relative h-64 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={imgSrc}
                      alt={pohon.nama}
                      onError={e => { (e.currentTarget as HTMLImageElement).src = fallbackImage; }}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-out"
                      loading="lazy"
                    />

                    {/* Category Tag */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-xl text-[10px] font-bold bg-white/95 backdrop-blur-xs text-slate-800 shadow-xs uppercase tracking-wider flex items-center gap-1">
                        <Tag className="w-3 h-3 text-teal-600" />
                        <span>{pohon.kategori}</span>
                      </span>
                    </div>

                    {/* Status Ketersediaan */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold shadow-xs ${
                        isTersedia
                          ? 'bg-emerald-100/95 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100/95 text-amber-800 border border-amber-200'
                      }`}>
                        {pohon.statusKetersediaan}
                      </span>
                    </div>
                  </div>

                  {/* Card Body - TANPA TAMPILAN HARGA */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] font-mono font-bold text-teal-700">{pohon.kode}</div>
                      <h3 className="font-serif font-bold text-slate-900 text-lg mt-1 group-hover:text-teal-700 transition">
                        {pohon.nama}
                      </h3>
                      
                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 font-medium">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700">
                          Tinggi: {pohon.tinggi}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                        {pohon.keterangan}
                      </p>
                    </div>

                    {/* WhatsApp Inquiry Button - TANPA MENAMPILKAN HARGA */}
                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <a
                        href={generateWhatsAppLink(pohon.nama, pohon.kode)}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Tanya Jadwal & Ketersediaan</span>
                      </a>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </section>

      {/* Info Section / Tentang Kami */}
      <section id="tentang" className="py-12 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs uppercase tracking-widest text-teal-700 font-bold">Tentang HD Pohon</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
                Dedikasi Keindahan Pohon & Rangkaian Flora Pelaminan
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                Kami spesialis penyewaan pohon artifisial skala besar, tanaman tropis pendukung, bunga premium, serta properti dekorasi untuk berbagai Wedding Organizer, perias pengantin, dan instansi di wilayah Jakarta dan sekitarnya.
              </p>

              <div className="mt-6 space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Koleksi pohon bervariasi dari 1.8M hingga 3.5 Meter</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Batang kayu natural kokoh dilengkapi alas penopang pelat besi aman</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Tersedia perlengkapan bunga latex, daun monstera, dan properti standing</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1519225433281-9f38b6dd961c?auto=format&fit=crop&w=800&q=80"
                alt="Dekorasi Pelaminan HD Pohon"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer & Kontak */}
      <footer id="kontak" className="bg-slate-900 text-slate-400 py-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-serif font-bold text-base mb-2">
              <TreePine className="w-5 h-5 text-teal-400" />
              <span>HD Pohon</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Rental Pohon Artifisial & Perlengkapan Dekorasi Pelaminan Terpercaya di Jakarta.
            </p>
          </div>

          <div>
            <div className="text-white font-bold text-xs uppercase tracking-wider mb-2">Kontak & Reservasi</div>
            <p className="text-slate-400">WhatsApp: +62 811-9500-890</p>
            <p className="text-slate-400">Email: info@hasandekor.com</p>
            <p className="text-slate-400 mt-1">Buka Setiap Hari: 08.00 - 21.00 WIB</p>
          </div>

          <div>
            <div className="text-white font-bold text-xs uppercase tracking-wider mb-2">Gudang & Workshop</div>
            <p className="text-slate-400 flex items-start gap-1.5">
              <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>Jl. Pangeran Tubagus Angke, Jakarta</span>
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500">
          <p>© 2026 HD Pohon. Seluruh hak cipta dilindungi.</p>
          <button onClick={onOpenLogin} className="hover:text-teal-400 transition cursor-pointer mt-2 sm:mt-0">
            Login Petugas Gudang & Admin
          </button>
        </div>
      </footer>

    </div>
  );
};
