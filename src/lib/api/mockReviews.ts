import type { CustomerReview } from '@/types/api';

export const MOCK_REVIEWS: Record<string, CustomerReview[]> = {
  'prod-001': [
    {
      id: 'rev-001-1',
      productId: 'prod-001',
      authorName: 'Alya Sabrina',
      rating: 5,
      title: 'Bagus bangettt, bow nya rapi & bahannya lembut!',
      comment:
        'Awalnya ragu karena pre-order, tapi ternyata pas nyampe beneran melebihi ekspektasi! Bahannya soft faux leather yang ga kaku sama sekali. Jahitan pita di depannya rapi banget dan muat dompet lipat + iPhone 15 + lip product. Bakal langganan di Nevermind ♡',
      variantName: 'Vintage Cream · Regular Size',
      date: '18 September 2026',
      isVerifiedPurchase: true,
      helpfulCount: 28,
      images: [
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80',
        'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=500&q=80',
      ],
    },
    {
      id: 'rev-001-2',
      productId: 'prod-001',
      authorName: 'Clarissa Natalia',
      rating: 5,
      title: 'Cute coquette vibes, temen-temen pada nanyain beli di mana',
      comment:
        'Lucu parah! Warnanya vintage cream manis bgt ga terlalu putih. Packingannya safe banget ada dustbag dan bubble tebel. Pengiriman PO sekitar 16 hari sesuai estimasi lead time.',
      variantName: 'Vintage Cream · Bundle + Pearl Chain Strap',
      date: '14 September 2026',
      isVerifiedPurchase: true,
      helpfulCount: 19,
    },
    {
      id: 'rev-001-3',
      productId: 'prod-001',
      authorName: 'Nadia Putri',
      rating: 5,
      title: 'Packaging rapi, QC passed terbukti!',
      comment:
        'Suka banget sama transparansi harganya, udah include all-in tax & ongkir jadi ga kaget pas checkout. Talinya juga nyaman dipake seharian buat kuliah.',
      variantName: 'Blush Pink · Regular Size',
      date: '08 September 2026',
      isVerifiedPurchase: true,
      helpfulCount: 12,
    },
    {
      id: 'rev-001-4',
      productId: 'prod-001',
      authorName: 'Felicia Tan',
      rating: 4,
      title: 'Desain gemes, ukuran pas buat daily commute',
      comment:
        'Worth the price! Ukurannya pas buat daily carry. Rantai mutiaranya keliatan mewah ga terkesan murahan. Minus 1 bintang cuma karena nunggu PO nya agak lama, tapi barangnya 10/10.',
      variantName: 'Midnight Noir · Regular Size',
      date: '02 September 2026',
      isVerifiedPurchase: true,
      helpfulCount: 8,
    },
  ],

  'prod-002': [
    {
      id: 'rev-002-1',
      productId: 'prod-002',
      authorName: 'Kezia Aurelia',
      rating: 5,
      title: 'Chic chrome futuristic! Statement bag terbaik tahun ini',
      comment:
        'Metallic finishnya glowing parah pas kena lighting! Ga gampang baret dan quilted teksturnya empuk. Bisa dipanjangin jadi crossbody atau dipendekin jadi shoulder bag ala 90s aesthetic. Suka bgt bgt!',
      variantName: 'Metallic Chrome · Classic Shoulder',
      date: '22 September 2026',
      isVerifiedPurchase: true,
      helpfulCount: 34,
      images: [
        'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500&q=80',
      ],
    },
    {
      id: 'rev-002-2',
      productId: 'prod-002',
      authorName: 'Michelle Ang',
      rating: 5,
      title: 'Ready stock super cepat sampai, kualitas jamin mantap',
      comment:
        'Pesan hari Selasa, Kamis sore udah sampe Jakarta Barat. Kualitas hardware rantainya tebel dan kokoh, zippernya smooth. Worth every penny buat yang suka style Y2K cyberpunk!',
      variantName: 'Metallic Chrome · Crossbody (Long Strap)',
      date: '19 September 2026',
      isVerifiedPurchase: true,
      helpfulCount: 22,
    },
    {
      id: 'rev-002-3',
      productId: 'prod-002',
      authorName: 'Steffy Gunawan',
      rating: 4,
      title: 'Bagus bgt buat party & konser!',
      comment:
        'Dipake nonton konser kemarin dapet banyak compliment. Ringan dan muat powerbank mini plus dompet kartu. Recommended!',
      variantName: 'Cyber Aqua · Classic Shoulder',
      date: '11 September 2026',
      isVerifiedPurchase: true,
      helpfulCount: 15,
    },
  ],

  'prod-003': [
    {
      id: 'rev-003-1',
      productId: 'prod-003',
      authorName: 'Dinda Rahmawati',
      rating: 5,
      title: 'Jelly bag paling gemoy di reels! Warnanya seger bgt',
      comment:
        'Jelly materialnya tebel tapi fleksibel, ga gampang penyok atau lengket. Warna aquanya beneran aesthetic banget dipaduin sama outfit monokrom atau pastel.',
      variantName: 'Aqua Mist · Bundle + Y2K Keychain Charm',
      date: '15 September 2026',
      isVerifiedPurchase: true,
      helpfulCount: 16,
      images: [
        'https://images.unsplash.com/photo-1519183071298-a2962feb14f4?w=500&q=80',
      ],
    },
    {
      id: 'rev-003-2',
      productId: 'prod-003',
      authorName: 'Gracia Elena',
      rating: 4,
      title: 'Lucu & gemas buat photoshoot outdoor',
      comment:
        'Waterproof dan gampang dibersihin kalau kena tumpahan air/minuman. Keychain charm bawaannya super unyu!',
      variantName: 'Berry Jelly · Standard Bag',
      date: '05 September 2026',
      isVerifiedPurchase: true,
      helpfulCount: 9,
    },
  ],

  'prod-004': [
    {
      id: 'rev-004-1',
      productId: 'prod-004',
      authorName: 'Zahra Anindya',
      rating: 5,
      title: 'Baguette clutch elegan, bahan satin-like super chic',
      comment:
        'Warna pastel yellow-nya soft dan warm banget, ga mencolok. Jahitan rapi dan ada pocket kecil di bagian dalem buat selipin kartu. Cocok buat kondangan maupun brunch santai.',
      variantName: 'Lemon Pastel · With Silver Chain Strap',
      date: '20 September 2026',
      isVerifiedPurchase: true,
      helpfulCount: 25,
      images: [
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&q=80',
      ],
    },
    {
      id: 'rev-004-2',
      productId: 'prod-004',
      authorName: 'Vania Priscillia',
      rating: 5,
      title: 'Suka banget sama siluetnya!',
      comment:
        'Siluet baguette klasik yang ga pernah lekang oleh waktu. Bahan satin-like nya terasa halus di tangan. Pelayanan CS Nevermind ramah banget pas nanya update resi jastip.',
      variantName: 'Soft Ivory · Classic Clutch',
      date: '16 September 2026',
      isVerifiedPurchase: true,
      helpfulCount: 14,
    },
  ],

  'prod-005': [
    {
      id: 'rev-005-1',
      productId: 'prod-005',
      authorName: 'Tiara Andini',
      rating: 5,
      title: 'Bulu teddynya lembut banget! Plis restock warna lain',
      comment:
        'Ga nyesel ikut PO batch pertama sebelum sold out! Bulu teddy bearnya halus ga rontok sama sekali. Drawstring lock-nya kenceng dan muat banyak barang. Tolong restock lagi ya min!',
      variantName: 'Warm Bear Beige · Standard Bucket',
      date: '18 September 2026',
      isVerifiedPurchase: true,
      helpfulCount: 41,
      images: [
        'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=500&q=80',
      ],
    },
    {
      id: 'rev-005-2',
      productId: 'prod-005',
      authorName: 'Natasha W.',
      rating: 5,
      title: 'Cakep pol buat OOTD musim liburan',
      comment:
        'Anget dan empuk banget pas dipeluk haha. Temen-temen pada gemes liat tas ini. Pengiriman aman tanpa ada defect sama sekali.',
      variantName: 'Warm Bear Beige · Standard Bucket',
      date: '10 September 2026',
      isVerifiedPurchase: true,
      helpfulCount: 17,
    },
  ],

  'prod-006': [
    {
      id: 'rev-006-1',
      productId: 'prod-006',
      authorName: 'Rania Alatas',
      rating: 5,
      title: 'Vibe grunge Y2K dapet banget, material kokoh',
      comment:
        'Sling bag yang pas buat gaya streetwear. Hardware besi dan ritsletingnya mantep, ga seret. Talinya lebar jadi ga bikin pundak pegel.',
      variantName: 'Gunmetal Silver · Crossbody Strap',
      date: '12 September 2026',
      isVerifiedPurchase: true,
      helpfulCount: 18,
    },
  ],
};

// Generic fallback reviews for any other product IDs
export const DEFAULT_FALLBACK_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-default-1',
    productId: 'default',
    authorName: 'Siti Maharani',
    rating: 5,
    title: 'Kualitas mantap, real pict 100%!',
    comment:
      'Barang sampai dengan selamat, packaging sangat rapi dan bubble tebal. Bahan tasnya bagus banget persis dengan foto di katalog. Sangat puas belanja jastip di Nevermind!',
    variantName: 'Original Edition',
    date: '15 September 2026',
    isVerifiedPurchase: true,
    helpfulCount: 15,
  },
  {
    id: 'rev-default-2',
    productId: 'default',
    authorName: 'Bella Amanda',
    rating: 5,
    title: 'Pelayanan responsif & transparan',
    comment:
      'Suka banget sama estimasi pengirimannya yang akurat dan tanpa biaya tambahan tersembunyi. Jahitan rapi dan aksesoris tasnya berkilau mewah.',
    variantName: 'Standard Variant',
    date: '10 September 2026',
    isVerifiedPurchase: true,
    helpfulCount: 11,
  },
];
