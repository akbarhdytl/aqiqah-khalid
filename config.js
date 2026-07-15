// ============================================================
//  KONFIGURASI DATA BAYI
//  ✏️ EDIT FILE INI SAJA UNTUK UPDATE DATA
//  Setelah bayi lahir, ubah nilai di bawah ini
// ============================================================

const CONFIG = {
    // ===== DATA PRIBADI BAYI =====
    baby: {
        // Nama lengkap
        name: 'Akbar Hidayatullah',
        
        // Nama panggilan (opsional)
        nickname: 'Akbar',
        
        // Tanggal lahir (isi setelah lahir)
        birthDate: '26 September 2025',
        birthDateHijri: '4 Rabiul Awal 1447 H',
        
        // Waktu lahir
        birthTime: '09.00 WIB',
        birthTimeNote: 'pagi hari',
        
        // Berat dan panjang
        weight: '3.200 gram',
        weightDisplay: '3,2 kg',
        length: '49 cm',
        lengthNote: 'saat lahir',
        
        // Tempat lahir (opsional)
        birthPlace: 'Klinik Kehamilan Sehat Palem Semik',
        
        // Urutan anak
        childOrder: 'Putra Pertama',
        
        // Doa untuk bayi (tampil di bagian makna nama)
        prayer: 'Semoga Allah SWT menjadikan Khalid Zayn Altair sebagai anak yang saleh, sehat, cerdas, berakhlak mulia, mencintai Al-Qur\'an, berbakti kepada orang tua, dan menjadi keberkahan bagi umat.'
    },

    // ===== DATA ORANG TUA =====
    parents: {
        father: 'Akbar Hidayatullah',
        mother: 'Nadira Syerlie Nurhaliza'
    },

    // ===== DATA ACARA =====
    event: {
        title: 'Tasyakuran Aqiqah',
        date: 'Minggu, 29 Juli 2026',
        time: '09.00 WIB',
        timeEnd: 'selesai',
        address: 'Jl. Raya PLP Curug<br />Komplek Pos 3 Blok H No. 28',
        mapsLink: 'https://share.google/XzUBRn385tcdnNJWS'
    },

    // ===== MAKNA NAMA =====
    nameMeaning: [
        {
            name: 'Khalid',
            meaning: 'Abadi',
            description: 'Kekal, langgeng, dan abadi dalam kebaikan.'
        },
        {
            name: 'Zayn',
            meaning: 'Keindahan',
            description: 'Perhiasan, keelokan, dan kemuliaan akhlak.'
        },
        {
            name: 'Altair',
            meaning: 'Bintang yang bersinar tinggi',
            description: 'Cahaya yang terang, petunjuk, dan inspirasi.'
        }
    ],

    // ===== REKENING =====
    bank: {
        name: 'Mandiri',
        accountNumber: '1760001853603',
        accountHolder: 'Akbar Hidayatullah'
    },

    // ===== META / SHARING (WhatsApp, Facebook, dll) =====
    meta: {
        // Base URL website (ganti dengan URL GitHub Pages Anda)
        baseUrl: 'https://akbarhdytl.github.io/aqiqah-khalid/',
        // Nama file thumbnail (taruh di folder yang sama)
        thumbnail: 'thumbnail.jpg',
        // Deskripsi singkat
        description: 'Undangan Tasyakuran Aqiqah putra pertama dari Akbar Hidayatullah & Nadira Syerlie Nurhaliza. Khalid Zayn Altair.'
    },

    // ===== GALERI =====
    // Daftar file gambar galeri (taruh di folder yang sama dengan index.html)
    gallery: [
        'gallery1.jpg',
        'gallery2.jpg',
        'gallery3.jpg',
        'gallery4.jpg',
        'gallery5.jpg',
        'gallery6.jpg'
    ]
};

// ============================================================
//  JANGAN UBAH KODE DI BAWAH INI
// ============================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
