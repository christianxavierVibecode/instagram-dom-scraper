(async () => {

    // =========================================================
    // KONFIGURASI
    // =========================================================

    // Mode scraping:
    // "reel" = mengambil URL Reels
    // "p"    = mengambil URL Postingan / Gambar
    const mode = "reel";

    // Username Instagram yang ingin diambil datanya.
    // Digunakan sebagai prefix URL agar hanya mengambil
    // postingan dari akun yang diinginkan.
    const username = "utdi_official";

    // URL dasar Instagram
    const baseUrl = "https://www.instagram.com";

    // Prefix URL berdasarkan username
    const prefix = `/${username}`;

    // Set digunakan untuk menyimpan URL.
    // Keuntungan Set:
    // - Tidak ada URL duplikat
    // - Data tetap tersimpan walaupun elemen <a>
    //   dihapus dari DOM oleh Instagram
    const links = new Set();


    // =========================================================
    // VALIDASI MODE
    // =========================================================

    if (mode !== "reel" && mode !== "p") {
        console.error(
            `Mode "${mode}" tidak valid. Gunakan "reel" atau "p".`
        );

        return;
    }


    // =========================================================
    // FUNGSI DELAY
    // =========================================================

    // Digunakan untuk memberi waktu kepada Instagram
    // untuk memuat konten baru setelah scrolling.
    const sleep = ms =>
        new Promise(resolve => setTimeout(resolve, ms));


    // =========================================================
    // FUNGSI MENGAMBIL URL
    // =========================================================

    const collectLinks = () => {

        /*
         * Kita hanya mengambil <a> yang:
         * 1. Memiliki role="link"
         * 2. href-nya diawali dengan prefix username
         *
         * Contoh:
         * /utdi_official/p/xxxxx/
         * /utdi_official/reel/xxxxx/
         */

        const anchors = document.querySelectorAll(
            `a[role="link"][href^="${prefix}/"]`
        );

        anchors.forEach(anchor => {

            const href = anchor.getAttribute("href");

            // Abaikan jika href kosong
            if (!href) {
                return;
            }


            // =================================================
            // MODE REEL
            // =================================================

            if (mode === "reel") {

                // Hanya mengambil URL yang memiliki /reel/
                if (href.includes("/reel/")) {

                    const fullUrl = `${baseUrl}${href}`;

                    links.add(fullUrl);
                }

            }


            // =================================================
            // MODE POSTINGAN
            // =================================================

            else if (mode === "p") {

                // Hanya mengambil URL yang memiliki /p/
                if (href.includes("/p/")) {

                    const fullUrl = `${baseUrl}${href}`;

                    links.add(fullUrl);
                }
            }

        });
    };


    // =========================================================
    // FUNGSI SCROLL
    // =========================================================

    const scrollPage = () => {

        /*
         * Scroll sebesar 80% tinggi viewport.
         *
         * Tidak langsung scroll ke document height karena
         * scrolling bertahap memberikan kesempatan kepada
         * Instagram untuk melakukan lazy-loading.
         */

        window.scrollBy({
            top: window.innerHeight * 0.8,
            behavior: "smooth"
        });
    };


    // =========================================================
    // PROSES SCRAPING
    // =========================================================

    let previousCount = 0;

    // Jumlah iterasi berturut-turut tanpa URL baru.
    let unchanged = 0;

    /*
     * Jika selama 15 iterasi tidak ada data baru,
     * scraper dianggap sudah mencapai akhir.
     */
    const maxUnchanged = 15;

    console.log("=================================");
    console.log("INSTAGRAM SCRAPER DIMULAI");
    console.log("=================================");
    console.log(`Username : ${username}`);
    console.log(`Mode     : ${mode}`);
    console.log("");


    // =========================================================
    // LOOP SCRAPING
    // =========================================================

    while (unchanged < maxUnchanged) {

        // Ambil URL yang saat ini tersedia di DOM
        collectLinks();

        // Scroll halaman untuk memicu loading konten berikutnya
        scrollPage();

        // Tunggu Instagram memuat konten
        await sleep(1500);

        // Ambil kembali URL setelah scrolling
        collectLinks();


        // Jumlah URL yang sudah berhasil dikumpulkan
        const currentCount = links.size;


        // Tampilkan progress
        console.log(
            `Data ditemukan: ${currentCount}`
        );


        // =====================================================
        // CEK APAKAH ADA DATA BARU
        // =====================================================

        if (currentCount === previousCount) {

            // Tidak ada URL baru
            unchanged++;

        } else {

            // Ada URL baru, reset counter
            unchanged = 0;

            previousCount = currentCount;
        }

    }


    // =========================================================
    // HASIL AKHIR
    // =========================================================

    const result = [...links];


    console.log("");
    console.log("=================================");
    console.log("SCRAPING SELESAI");
    console.log("=================================");

    console.log(`Mode         : ${mode}`);
    console.log(`Jumlah data  : ${result.length}`);

    console.log("");
    console.log("Hasil URL:");
    console.log(result);


    // =========================================================
    // EXPORT KE FILE TXT
    // =========================================================

    /*
     * Tidak menggunakan copy().
     *
     * copy() merupakan helper tertentu dari DevTools
     * dan tidak selalu tersedia pada konteks halaman Instagram.
     *
     * Sebagai gantinya kita membuat file TXT secara langsung.
     */

    const content = result.join("\n");

    const blob = new Blob(
        [content],
        {
            type: "text/plain;charset=utf-8"
        }
    );

    const downloadUrl = URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");

    downloadLink.href = downloadUrl;

    downloadLink.download =
        `instagram-${username}-${mode}-${result.length}.txt`;

    document.body.appendChild(downloadLink);

    downloadLink.click();

    downloadLink.remove();

    URL.revokeObjectURL(downloadUrl);


    // =========================================================
    // SELESAI
    // =========================================================

    console.log("");
    console.log(
        `✓ ${result.length} URL berhasil dikumpulkan.`
    );

    console.log(
        `✓ File TXT berhasil dibuat.`
    );

})();