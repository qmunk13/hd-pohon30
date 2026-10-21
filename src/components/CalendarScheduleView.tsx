import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { Penyewaan } from '../types';
import { SyncService } from '../services/syncService';

interface CalendarScheduleViewProps {
  penyewaanList: Penyewaan[];
  onSelectSewa: (sewa: Penyewaan) => void;
  onOpenSewaForm: () => void;
}

export const CalendarScheduleView: React.FC<CalendarScheduleViewProps> = ({
  penyewaanList,
  onSelectSewa,
  onOpenSewaForm,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-17');
  const [filterMonth, setFilterMonth] = useState<string>('2026-10');

  // Days of current month (October 2026)
  const daysInOctober = Array.from({ length: 31 }, (_, i) => {
    const dayNum = i + 1;
    const formatted = `2026-10-${dayNum.toString().padStart(2, '0')}`;
    return formatted;
  });

  // Rentals active on selected date or matching
  const matchingRentals = penyewaanList.filter((sewa) => {
    const start = sewa.tanggalSewa;
    const end = sewa.tanggalRencanaKembali;
    return selectedDate >= start && selectedDate <= end;
  });

  const getDayRentalCount = (dateStr: string) => {
    return penyewaanList.filter((s) => dateStr >= s.tanggalSewa && dateStr <= s.tanggalRencanaKembali)
      .length;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-900 rounded-3xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-teal-900/15">
        <div>
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-[11px] font-bold uppercase tracking-wider text-teal-100 mb-2">
            📅 Jadwal Kalender Pemakaian &amp; Booking Pelaminan
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold">
            Kalender Agenda Sewa Dekorasi &amp; Pohon
          </h2>
          <p className="text-xs text-teal-100/90 mt-1 max-w-xl">
            Cek ketersediaan pohon dan barang dekorasi berdasarkan tanggal acara. Mencegah double-booking pada tanggal pernikahan klien WO.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSewaForm}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <span>+ Buat Sewa di Tanggal Ini</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Picker Matrix */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-700" />
              <h3 className="font-serif font-bold text-slate-900 text-base">Oktober 2026</h3>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block"></span> Ada Event/Sewa
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block ml-2"></span> Kosong
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <div>Min</div>
            <div>Sen</div>
            <div>Sel</div>
            <div>Rab</div>
            <div>Kam</div>
            <div>Jum</div>
            <div>Sab</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {/* October 2026 starts on Thursday (index 4) */}
            <div className="h-14 rounded-2xl bg-slate-50/50"></div>
            <div className="h-14 rounded-2xl bg-slate-50/50"></div>
            <div className="h-14 rounded-2xl bg-slate-50/50"></div>
            <div className="h-14 rounded-2xl bg-slate-50/50"></div>

            {daysInOctober.map((dateStr, idx) => {
              const day = idx + 1;
              const count = getDayRentalCount(dateStr);
              const isSelected = selectedDate === dateStr;
              const isToday = dateStr === '2026-10-17';

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => setSelectedDate(dateStr)}
                  className={`h-14 rounded-2xl p-1.5 flex flex-col justify-between items-center transition cursor-pointer relative border ${
                    isSelected
                      ? 'bg-teal-700 text-white border-teal-800 shadow-md ring-2 ring-teal-400/50'
                      : count > 0
                      ? 'bg-teal-50/80 text-teal-900 border-teal-200 hover:bg-teal-100'
                      : 'bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex w-full justify-between items-center px-1">
                    <span className="text-xs font-bold">{day}</span>
                    {isToday && (
                      <span className={`text-[8px] font-extrabold px-1 rounded ${isSelected ? 'bg-white text-teal-800' : 'bg-emerald-600 text-white'}`}>
                        HARI INI
                      </span>
                    )}
                  </div>

                  {count > 0 ? (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        isSelected ? 'bg-white text-teal-900' : 'bg-teal-700 text-white'
                      }`}
                    >
                      {count} Sewa
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-300">&bull;</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>💡 Klik salah satu tanggal untuk melihat rincian barang yang beroperasi di lapangan.</span>
            <span className="font-semibold text-teal-700">Tanggal Terpilih: {SyncService.formatTanggalPendek(selectedDate)}</span>
          </div>
        </div>

        {/* Side Details of Selected Date */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs h-full flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-teal-700">Agenda Tanggal</span>
                <h3 className="font-serif font-bold text-slate-900 text-base">
                  {SyncService.formatTanggalIndo(selectedDate, false)}
                </h3>
              </div>
              <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-bold">
                {matchingRentals.length} Penyewaan Aktif
              </span>
            </div>

            {matchingRentals.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-10 text-center text-slate-400">
                <Calendar className="w-12 h-12 text-slate-300 mb-2 stroke-[1.5]" />
                <p className="font-bold text-slate-700 text-sm">Tidak ada jadwal sewa di tanggal ini</p>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  Seluruh koleksi pohon dan properti dekorasi tersedia penuh di gudang utama untuk disewakan.
                </p>
                <button
                  onClick={onOpenSewaForm}
                  className="mt-4 px-4 py-2 bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold rounded-xl text-xs transition"
                >
                  + Jadwalkan Sewa Baru
                </button>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[480px] pr-1">
                {matchingRentals.map((sewa) => (
                  <div
                    key={sewa.noSewa}
                    onClick={() => onSelectSewa(sewa)}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-teal-400 hover:shadow-md transition bg-slate-50/60 hover:bg-white cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="font-mono text-[10px] font-bold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded">
                          {sewa.noSewa}
                        </span>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm mt-1 group-hover:text-teal-700 transition">
                          {sewa.namaPelanggan}
                        </h4>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          sewa.status === 'AKTIF'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {sewa.status}
                      </span>
                    </div>

                    {sewa.namaAcara && (
                      <p className="text-xs font-semibold text-slate-700 mb-2">
                        🎉 {sewa.namaAcara}
                      </p>
                    )}

                    <div className="space-y-1 text-[11px] text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{sewa.alamatAcara}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          Durasi:{' '}
                          <span className="font-semibold text-slate-800">
                            {SyncService.formatTanggalPendek(sewa.tanggalSewa)} s/d{' '}
                            {SyncService.formatTanggalPendek(sewa.tanggalRencanaKembali)}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                      <span className="font-bold text-teal-800">
                        {sewa.totalQty} Unit ({sewa.totalItem} Item)
                      </span>
                      <span className="text-teal-700 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                        <span>Lihat Surat Jalan</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
