// ============================================================
//  KONFIGURASI DATA BAYI
//  ✏️ EDIT FILE INI SAJA UNTUK UPDATE DATA
//  Setelah bayi lahir, ubah nilai di bawah ini
// ============================================================

const CONFIG = {
    // ===== DATA PRIBADI BAYI =====
    baby: {
        // Nama lengkap
        name: 'Khalid Zayn Altair',
        
        // Nama panggilan (opsional)
        nickname: 'Khalid',
        
        // Tanggal lahir (isi setelah lahir)
        birthDate: '15 Juli 2026',
        birthDateHijri: '4 Safar 1448 H',
        
        // Waktu lahir
        birthTime: '09.00 WIB',
        birthTimeNote: 'pagi hari',
        
        // Berat dan panjang
        weight: '3.200 gram',
        weightDisplay: '',
        length: '49 cm',
        lengthNote: 'saat lahir',
        
        // Tempat lahir (opsional)
        birthPlace: 'Klinik Kehamilan Sehat Palem Semi',
        
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
        mapsLink: 'https://www.google.com/maps/dir//Shelby+Company+H28,+PH9G%2BH97,+Jl.+Raya+PLP+Curug,+Rancagong,+Curug,+Tangerang+Regency,+Banten+15820/@-6.2766717,106.570193,15z/data=!4m8!4m7!1m0!1m5!1m1!1s0x2e69fd0037c9544f:0x13944b613093738c!2m2!1d106.5759389!2d-6.2810649?entry=ttu&g_ep=EgoyMDI2MDcwNS4wIKXMDSoASAFQAw%3D%3D'
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
