export interface ProductItem {
  id: string;
  code: string;
  name: string;
  category: 'Pohon Besar' | 'Pohon Sedang' | 'Pohon Karakter' | 'Tanaman Tropis' | 'Properti & Bunga';
  height: string;
  widthSpread: string;
  trunkType: string;
  foliageType: string;
  stockTotal: number;
  stockAvailable: number;
  stockRented: number;
  status: 'Tersedia' | 'Sedang Dibooking' | 'Perawatan';
  imageUrl: string;
  description: string;
  highlights: string[];
  recommendedFor: string[];
  includedAccessories: string[];
  featured?: boolean;
}

export interface BookingServiceOptions {
  includeSetup: boolean; // Setting & bongkar pasang di venue
  includeLighting: boolean; // Fairy lights / spotlight LED pohon
  includeTransport: boolean; // Antar jemput khusus venue
}

export interface BookingOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  organizerName?: string;
  eventDate: string;
  returnDate: string;
  rentalDays: number;
  venueName: string;
  venueAddress: string;
  services: BookingServiceOptions;
  notes?: string;
  items: {
    productId: string;
    productCode: string;
    productName: string;
    quantity: number;
  }[];
  status: 'Menunggu Konfirmasi WA' | 'Dikonfirmasi' | 'Sedang Disewa' | 'Selesai' | 'Dibatalkan';
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  whatsappNumber: string; // format: 628xxxxxxxxxx
  displayPhone: string;
  email: string;
  workshopAddress: string;
  openingHours: string;
}
