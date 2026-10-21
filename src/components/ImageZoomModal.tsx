import React from 'react';
import { X, ExternalLink, Download } from 'lucide-react';

interface ImageZoomModalProps {
  isOpen: boolean;
  imageUrl: string;
  title: string;
  subtitle?: string;
  onClose: () => void;
}

export const ImageZoomModal: React.FC<ImageZoomModalProps> = ({
  isOpen,
  imageUrl,
  title,
  subtitle,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full max-h-[92vh] flex flex-col items-center justify-center bg-slate-900/90 rounded-3xl p-4 sm:p-6 border border-slate-700/80 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex items-center justify-between pb-3 border-b border-slate-700/60 text-white mb-3">
          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-emerald-400">{title}</h3>
            {subtitle && <p className="text-xs text-slate-300 font-mono mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            <a
              href={imageUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              title="Buka Foto di Tab Baru"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-rose-900/60 text-rose-200 hover:bg-rose-800 transition flex items-center gap-1 text-xs font-bold"
            >
              <X className="w-4 h-4" />
              <span>Tutup</span>
            </button>
          </div>
        </div>

        <div className="w-full flex-1 flex items-center justify-center overflow-hidden rounded-2xl bg-black/40 p-2">
          <img
            src={imageUrl}
            alt={title}
            className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-lg transition-transform duration-300"
          />
        </div>

        <div className="w-full mt-3 pt-2 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
          <span>🌿 HD Pohon &bull; Visual Resolusi Tinggi</span>
          <span className="text-emerald-400 font-medium">Klik sembarang area luar untuk menutup</span>
        </div>
      </div>
    </div>
  );
};
