# Instagram URL Scraper

Script JavaScript sederhana untuk mengambil URL **Reels** dan **Post** dari sebuah akun Instagram langsung melalui Developer Tools / browser, tanpa memerlukan library scraping besar atau autentikasi Instagram.

## Latar Belakang

Ketika membutuhkan daftar URL Reels atau postingan dari sebuah akun Instagram, penggunaan tools scraping yang besar sering kali terasa berlebihan. Beberapa tools juga memerlukan konfigurasi tambahan atau autentikasi.

Project ini dibuat sebagai solusi sederhana untuk kebutuhan tersebut: script dijalankan langsung di browser melalui **Developer Tools**, kemudian URL konten yang sedang dimuat di halaman Instagram dikumpulkan secara otomatis.

> **Catatan:** Script ini ditujukan untuk kebutuhan scraping ringan dari data yang tersedia pada halaman yang sedang dibuka. Gunakan secara bertanggung jawab dan patuhi Terms of Use serta kebijakan Instagram.

## Solusi

Project ini menggunakan JavaScript yang dijalankan langsung pada halaman Instagram melalui Developer Tools.

Secara umum:

1. Buka halaman profil Instagram yang ingin diproses.
2. Buka Developer Tools → Console.
3. Masukkan script.
4. Tentukan mode `reel` atau `p`.
5. Script melakukan scrolling dan mengumpulkan URL yang muncul pada DOM.
6. URL yang sudah ditemukan disimpan menggunakan `Set` sehingga duplikat tidak dimasukkan.
7. Setelah scraping selesai, hasil ditampilkan di Console dan diekspor ke file `.txt`.

Pendekatan ini tidak membutuhkan:

- Instagram username/password.
- Session atau cookie yang disalin ke tool lain.
- Library scraping eksternal.
- Server/backend.
- API Instagram.

## Struktur URL yang Di-scraping

Script memanfaatkan atribut `role="link"` dan nilai `href` pada elemen `<a>` yang tersedia di DOM Instagram.

### Reels

Contoh URL Reels:

```html
<a
    role="link"
    href="/utdi_official/reel/C3rEieeSKIr/"
>
```

URL yang dihasilkan:

```text
https://www.instagram.com/utdi_official/reel/C3rEieeSKIr/
```

Script mencari URL yang mengandung:

```text
/reel/
```

### Postingan / Gambar

Contoh URL postingan:

```html
<a
    role="link"
    href="/utdi_official/p/DakCQX3EgXI/"
>
```

URL yang dihasilkan:

```text
https://www.instagram.com/utdi_official/p/DakCQX3EgXI/
```

Script mencari URL yang mengandung:

```text
/p/
```

### Selector DOM

Selector dasar yang digunakan:

```javascript
a[role="link"][href^="/utdi_official/"]
```

Kemudian URL difilter berdasarkan mode:

```javascript
if (mode === "reel") {
    // hanya URL /reel/
}

else if (mode === "p") {
    // hanya URL /p/
}
```

> Struktur DOM Instagram dapat berubah sewaktu-waktu. Jika Instagram mengubah atribut atau struktur elemen yang digunakan, selector pada script mungkin perlu diperbarui.

## Bagaimana Ini Bekerja

### 1. Menentukan mode

Variable `mode` menentukan jenis data yang akan dikumpulkan:

```javascript
const mode = "reel";
```

Gunakan:

```javascript
const mode = "reel";
```

untuk Reels, atau:

```javascript
const mode = "p";
```

untuk postingan.

### 2. Menentukan username

Username target disimpan dalam variable:

```javascript
const username = "utdi_official";
```

Variable tersebut digunakan untuk membatasi URL yang diproses.

### 3. Mencari elemen pada DOM

Script mencari seluruh elemen `<a>` yang memenuhi selector:

```javascript
a[role="link"][href^="/utdi_official/"]
```

Kemudian mengambil nilai:

```javascript
a.getAttribute("href")
```

### 4. Memfilter berdasarkan mode

Jika mode adalah `reel`, hanya URL yang mengandung `/reel/` yang disimpan.

Jika mode adalah `p`, hanya URL yang mengandung `/p/` yang disimpan.

### 5. Menggunakan `Set`

URL disimpan dalam:

```javascript
const links = new Set();
```

Hal ini penting karena Instagram menggunakan dynamic loading / virtualized DOM. Elemen yang sudah pernah muncul dapat dihapus dari DOM ketika pengguna melakukan scrolling lebih jauh.

Dengan `Set`, URL yang sudah ditemukan tetap tersimpan walaupun elemen HTML-nya kemudian tidak lagi berada di DOM.

### 6. Melakukan scrolling

Script melakukan scrolling bertahap:

```javascript
window.scrollBy({
    top: window.innerHeight * 0.8,
    behavior: "smooth"
});
```

Setelah scrolling, script menunggu halaman memuat konten baru lalu kembali melakukan pengumpulan URL.

### 7. Menentukan kapan selesai

Script membandingkan jumlah URL yang ditemukan pada setiap iterasi.

Jika tidak ada URL baru dalam beberapa iterasi berturut-turut, scraping dianggap selesai.

### 8. Export

Setelah proses selesai, URL dikumpulkan menjadi array dan diekspor ke file `.txt`.

Contoh:

```text
https://www.instagram.com/utdi_official/reel/C3rEieeSKIr/
https://www.instagram.com/utdi_official/reel/DM-WBR3pov_/
https://www.instagram.com/utdi_official/reel/ABC123xyz/
```

## Cara Menggunakan

### 1. Buka Instagram

Buka profil Instagram target melalui browser.

Contoh:

```text
https://www.instagram.com/utdi_official/
```

Pastikan halaman yang relevan sudah terbuka dan konten dapat dimuat.

### 2. Buka Developer Tools

Di Chrome:

- Tekan `F12`, atau
- `Ctrl + Shift + I`

Kemudian pilih tab:

```text
Console
```

### 3. Atur username

Pada script, ubah:

```javascript
const username = "utdi_official";
```

menjadi username target.

Contoh:

```javascript
const username = "akun_target";
```

### 4. Atur mode

Untuk mengambil Reels:

```javascript
const mode = "reel";
```

Untuk mengambil postingan:

```javascript
const mode = "p";
```

### 5. Jalankan script

Paste script ke Console lalu tekan `Enter`.

Script akan melakukan scrolling dan menampilkan progress:

```text
Data ditemukan: 25
Data ditemukan: 42
Data ditemukan: 67
Data ditemukan: 89
...
```

### 6. Hasil

Setelah proses selesai, Console akan menampilkan:

```text
=================================
SCRAPING SELESAI
=================================

Mode         : reel
Jumlah data  : 89
```

Script juga membuat file TXT dengan nama kurang lebih:

```text
instagram-utdi_official-reel-89.txt
```

Format setiap baris adalah satu URL Instagram.

## Format Output

Output berupa file `.txt`.

Contoh output Reels:

```text
https://www.instagram.com/utdi_official/reel/C3rEieeSKIr/
https://www.instagram.com/utdi_official/reel/DM-WBR3pov_/
https://www.instagram.com/utdi_official/reel/XYZ123abc/
```

Contoh output Postingan:

```text
https://www.instagram.com/utdi_official/p/DakCQX3EgXI/
https://www.instagram.com/utdi_official/p/ABC123xyz/
https://www.instagram.com/utdi_official/p/XYZ789abc/
```

Satu URL berada pada satu baris sehingga file dapat dengan mudah diproses kembali menggunakan script, spreadsheet, atau tools lainnya.

## Keterbatasan

Project ini bekerja berdasarkan elemen yang tersedia pada DOM halaman Instagram. Karena Instagram menggunakan dynamic loading dan dapat mengubah struktur HTML-nya, jumlah data yang berhasil dikumpulkan dapat bergantung pada kondisi halaman.

Beberapa faktor yang dapat memengaruhi hasil:

- Perubahan struktur DOM Instagram.
- Perubahan selector atau atribut HTML.
- Lazy loading konten.
- Virtualized DOM.
- Kecepatan koneksi.
- Throttling browser ketika tab berada di background.
- Perubahan mekanisme internal Instagram.

Jika selector Instagram berubah, bagian selector dan filtering pada script perlu disesuaikan.

## Privasi dan Autentikasi

Script ini dirancang untuk dijalankan langsung pada browser pengguna.

Script tidak meminta:

- Password Instagram.
- Access token.
- Cookie/session untuk dikirim ke server eksternal.
- Username/password untuk autentikasi tool pihak ketiga.

Script hanya membaca elemen DOM yang tersedia pada halaman browser tempat script dijalankan.

## Kontributor

- **anonymous user** — Initial project, scraping logic, DOM selector, scrolling mechanism, dan export result.

Pull request dan improvement dipersilakan.
