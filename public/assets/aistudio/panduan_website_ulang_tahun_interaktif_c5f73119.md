# Panduan Pembuatan Website Ulang Tahun Interaktif dengan Firebase

Dokumen ini berisi kode lengkap dan panduan untuk membuat website kado ulang tahun interaktif. Kode ini menggunakan HTML, CSS, dan JavaScript murni dalam satu file, dan sudah dilengkapi dengan struktur integrasi Firebase.

## Langkah 1: Persiapan Firebase
Karena kamu ingin menggunakan Firebase untuk database (misalnya untuk menyimpan password atau pesan secara dinamis), ikuti langkah ini:
1. Buka [Firebase Console](https://console.firebase.google.com/).
2. Buat project baru (misal: "BirthdayGift").
3. Tambahkan aplikasi Web (`</>`) ke dalam project tersebut.
4. Salin objek `firebaseConfig` yang diberikan oleh Firebase.
5. Aktifkan **Firestore Database** (jika ingin menyimpan teks pesan/password) dan atur rules-nya ke `allow read;`.

## Langkah 2: Kode Lengkap (index.html)
Salin seluruh kode di bawah ini dan simpan sebagai file `index.html`. Ganti bagian `firebaseConfig` dengan milikmu, dan ubah tautan gambar/audio sesuai kebutuhanmu.

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Happy Birthday!</title>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --maroon: #8b0000;
            --beige: #f5f5dc;
            --white: #ffffff;
            --dark: #333333;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Poppins', sans-serif;
            background-color: var(--maroon);
            color: var(--dark);
            overflow: hidden; /* Mencegah scroll saat transisi */
        }

        .title-font {
            font-family: 'Dancing Script', cursive;
        }

        /* Container Utama */
        .page {
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: var(--beige);
            transition: opacity 0.8s ease-in-out;
            opacity: 0;
            pointer-events: none;
            z-index: 1;
        }

        .page.active {
            opacity: 1;
            pointer-events: auto;
            z-index: 10;
        }

        .page.bg-maroon {
            background-color: var(--maroon);
            color: var(--white);
        }

        /* Halaman 1: Login */
        .login-box {
            text-align: center;
            background: var(--white);
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .login-box h1 {
            color: var(--maroon);
            font-size: 3rem;
            margin-bottom: 20px;
        }
        .login-box input {
            padding: 12px;
            width: 80%;
            border: 2px solid var(--beige);
            border-radius: 8px;
            margin-bottom: 15px;
            font-size: 1rem;
            outline: none;
        }
        .login-box button {
            padding: 12px 25px;
            background-color: var(--maroon);
            color: var(--white);
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 600;
            transition: background 0.3s;
        }
        .login-box button:hover {
            background-color: #660000;
        }
        .error-msg {
            color: red;
            font-size: 0.9rem;
            margin-top: 10px;
            display: none;
        }

        /* Halaman 2: Envelope */
        .envelope-container {
            position: relative;
            text-align: center;
            cursor: pointer;
        }
        .envelope-container h1 {
            color: var(--maroon);
            font-size: 3.5rem;
            margin-bottom: 20px;
        }
        .envelope {
            width: 300px;
            height: 200px;
            background-color: #c92a2a;
            position: relative;
            margin: 0 auto;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        .envelope::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 0;
            height: 0;
            border-left: 150px solid transparent;
            border-right: 150px solid transparent;
            border-top: 100px solid #e03131;
            z-index: 3;
            transition: transform 1s ease-in-out;
            transform-origin: top;
        }
        .wax-seal {
            position: absolute;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            width: 40px;
            height: 40px;
            background-color: #ffd700; /* Gold */
            border-radius: 50%;
            z-index: 4;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            color: #b8860b;
        }
        .envelope-container.open .envelope::before {
            transform: rotateX(180deg);
            z-index: 1;
        }
        .envelope-container.open .wax-seal {
            opacity: 0;
            transition: opacity 0.5s;
        }
        .instruction {
            margin-top: 20px;
            font-size: 1.2rem;
            color: var(--dark);
            animation: pulse 1.5s infinite;
        }

        /* Halaman 3: Menu Utama */
        .menu-title {
            font-size: 3.5rem;
            margin-bottom: 40px;
        }
        .menu-grid {
            display: flex;
            gap: 30px;
            flex-wrap: wrap;
            justify-content: center;
        }
        .menu-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            transition: transform 0.3s;
        }
        .menu-item:hover {
            transform: translateY(-10px);
        }
        .menu-icon {
            width: 100px;
            height: 100px;
            background-color: var(--beige);
            border-radius: 15px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 3rem;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            margin-bottom: 15px;
        }
        .menu-item span {
            font-size: 1.2rem;
            font-weight: 600;
        }

        /* Halaman 4: Message */
        .paper {
            background-color: var(--beige);
            color: var(--dark);
            width: 80%;
            max-width: 600px;
            padding: 40px;
            border-radius: 5px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.3);
            font-size: 1.1rem;
            line-height: 1.6;
            position: relative;
            transform: rotate(-2deg);
        }
        .paper h2 {
            color: var(--maroon);
            margin-bottom: 20px;
        }

        /* Halaman 5: Flower */
        .flower-container {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .flower-img {
            width: 200px; /* Ganti dengan URL gambarmu */
            height: 300px;
            background-color: #ffd700; 
            border-radius: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 4rem;
            z-index: 2;
        }
        .pop-up-text {
            position: absolute;
            background: rgba(255, 255, 255, 0.9);
            color: var(--maroon);
            padding: 10px 15px;
            border-radius: 10px;
            font-weight: 600;
            font-size: 0.9rem;
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
        }
        .flower-container.show-text .pop-up-text {
            opacity: 1;
        }
        /* Posisi Pop-up Text */
        .p1 { top: 20%; left: 10%; }
        .p2 { top: 30%; right: 10%; }
        .p3 { bottom: 30%; left: 15%; }
        .p4 { bottom: 20%; right: 15%; }

        /* Halaman 6: Gallery & Music */
        .gallery-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
            margin-bottom: 40px;
        }
        .polaroid {
            background: var(--white);
            padding: 10px 10px 30px 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            transform: rotate(-5deg);
            transition: transform 0.3s;
        }
        .polaroid:nth-child(even) {
            transform: rotate(5deg);
        }
        .polaroid:hover {
            transform: scale(1.1) rotate(0deg);
            z-index: 10;
        }
        .polaroid img {
            width: 150px;
            height: 150px;
            object-fit: cover;
            background-color: #ccc; /* Placeholder */
        }
        
        .vinyl-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
        }
        .vinyl {
            width: 100px;
            height: 100px;
            background-color: #111;
            border-radius: 50%;
            border: 2px solid #333;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: transform 0.3s;
        }
        .vinyl::after {
            content: '';
            width: 30px;
            height: 30px;
            background-color: #d11a2a; /* Label tengah */
            border-radius: 50%;
        }
        .vinyl::before {
            content: '';
            position: absolute;
            width: 10px;
            height: 10px;
            background-color: var(--white);
            border-radius: 50%;
            z-index: 2;
        }
        .spin {
            animation: spinMusic 3s linear infinite;
        }
        @keyframes spinMusic {
            100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }

        .back-btn {
            position: absolute;
            bottom: 30px;
            padding: 10px 20px;
            background: var(--beige);
            color: var(--maroon);
            border: none;
            border-radius: 20px;
            font-weight: bold;
            cursor: pointer;
            z-index: 100;
        }
        
        /* Mobile Responsiveness */
        @media (max-width: 600px) {
            .menu-grid { flex-direction: column; align-items: center; gap: 15px;}
            .polaroid img { width: 100px; height: 100px; }
            .flower-img { width: 150px; height: 200px; }
            .pop-up-text { font-size: 0.7rem; }
        }
    </style>
</head>
<body>

    <!-- 1. Halaman Login -->
    <div id="page-login" class="page active">
        <div class="login-box">
            <h1 class="title-font">Hello there!</h1>
            <p style="margin-bottom: 20px;">Masukkan password untuk membuka kado ini.</p>
            <input type="password" id="passwordInput" placeholder="Password...">
            <br>
            <button onclick="checkPassword()">Buka Kado</button>
            <div id="errorMsg" class="error-msg">Password salah, coba lagi ya!</div>
        </div>
    </div>

    <!-- 2. Halaman Envelope -->
    <div id="page-envelope" class="page">
        <div class="envelope-container" onclick="openEnvelope()">
            <h1 class="title-font">Happy Birthday!</h1>
            <div class="envelope">
                <div class="wax-seal">♥</div>
            </div>
            <p class="title-font instruction">Click the seal to open</p>
        </div>
    </div>

    <!-- 3. Halaman Menu Utama -->
    <div id="page-menu" class="page bg-maroon">
        <h1 class="title-font menu-title">These are for you</h1>
        <div class="menu-grid">
            <div class="menu-item" onclick="navTo('page-message')">
                <div class="menu-icon">✉️</div>
                <span>Message</span>
            </div>
            <div class="menu-item" onclick="navTo('page-flower')">
                <div class="menu-icon">💐</div>
                <span>Flower</span>
            </div>
            <div class="menu-item" onclick="navTo('page-gallery')">
                <div class="menu-icon">📸</div>
                <span>Gallery & Music</span>
            </div>
        </div>
    </div>

    <!-- 4. Halaman Message -->
    <div id="page-message" class="page bg-maroon">
        <div class="paper">
            <h2 class="title-font">To: [Nama]</h2>
            <p id="birthday-message">
                Happy birthday! Wishing you a day filled with laughter, good vibes, and all the little things that make you genuinely happy. You deserve to feel appreciated and celebrated—not just today, but every day.
                <br><br>
                Semoga di tahun ini, kamu selalu diberikan kesehatan, dilancarkan segala urusannya, dan bahagia selalu. I hope this little gift will make you smile!
            </p>
        </div>
        <button class="back-btn" onclick="navTo('page-menu')">Kembali</button>
    </div>

    <!-- 5. Halaman Flower -->
    <div id="page-flower" class="page bg-maroon">
        <div class="flower-container" id="flowerContainer" onclick="showFlowerText()">
            <!-- Ganti div ini dengan tag <img> jika punya gambar buket bunga -->
            <div class="flower-img">🌻</div>
            
            <div class="pop-up-text p1">You are kind!</div>
            <div class="pop-up-text p2">You are strong!</div>
            <div class="pop-up-text p3">You are thoughtful!</div>
            <div class="pop-up-text p4">You are unique!</div>
        </div>
        <p class="title-font" style="position:absolute; bottom: 80px;">Click the flower!</p>
        <button class="back-btn" onclick="navTo('page-menu')">Kembali</button>
    </div>

    <!-- 6. Halaman Gallery & Music -->
    <div id="page-gallery" class="page bg-maroon">
        <div class="gallery-container">
            <!-- Ganti src dengan URL foto aslimu -->
            <div class="polaroid"><img src="https://via.placeholder.com/150" alt="Foto 1"></div>
            <div class="polaroid"><img src="https://via.placeholder.com/150" alt="Foto 2"></div>
            <div class="polaroid"><img src="https://via.placeholder.com/150" alt="Foto 3"></div>
            <div class="polaroid"><img src="https://via.placeholder.com/150" alt="Foto 4"></div>
        </div>
        
        <div class="vinyl-container" onclick="toggleMusic()">
            <div class="vinyl" id="vinylRecord"></div>
            <p class="title-font" style="margin-top: 10px;">Click to listen to music</p>
        </div>
        
        <!-- Masukkan URL file musik mp3 kamu di atribut src -->
        <audio id="bgm" src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"></audio>
        
        <button class="back-btn" onclick="navTo('page-menu')">Kembali</button>
    </div>


    <!-- FIREBASE SDK (Modular Web Version 10) -->
    <script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
        import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

        // TODO: Ganti objek di bawah ini dengan firebaseConfig dari Firebase Console milikmu
        const firebaseConfig = {
            apiKey: "API_KEY_KAMU",
            authDomain: "PROJECT_ID.firebaseapp.com",
            projectId: "PROJECT_ID",
            storageBucket: "PROJECT_ID.appspot.com",
            messagingSenderId: "SENDER_ID",
            appId: "APP_ID"
        };

        let db;
        try {
            // Inisialisasi Firebase
            const app = initializeApp(firebaseConfig);
            db = getFirestore(app);
            console.log("Firebase berhasil diinisialisasi.");
        } catch (error) {
            console.warn("Firebase belum disetup atau config salah. Menggunakan mode lokal (tanpa database).");
        }

        // Fungsi Login yang terekspos ke window agar bisa dipanggil oleh button HTML
        window.checkPassword = async function() {
            const input = document.getElementById('passwordInput').value;
            const errorMsg = document.getElementById('errorMsg');
            
            // Default password lokal jika Firebase belum diatur
            let correctPassword = "happybirthday"; 

            // Coba ambil password dari Firestore (Opsional: Koleksi 'settings', Dokumen 'auth')
            if (db) {
                try {
                    const docRef = doc(db, "settings", "auth");
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        correctPassword = docSnap.data().password;
                    }
                } catch (e) {
                    console.log("Gagal membaca Firestore, menggunakan password default lokal.", e);
                }
            }

            if (input === correctPassword) {
                errorMsg.style.display = 'none';
                navTo('page-envelope');
            } else {
                errorMsg.style.display = 'block';
            }
        };
    </script>

    <!-- UI JAVASCRIPT LOKAL -->
    <script>
        // Navigasi antar halaman
        function navTo(targetPageId) {
            // Sembunyikan semua halaman
            const pages = document.querySelectorAll('.page');
            pages.forEach(page => {
                page.classList.remove('active');
            });
            
            // Tampilkan halaman target
            document.getElementById(targetPageId).classList.add('active');
        }

        // Animasi Amplop
        function openEnvelope() {
            const container = document.querySelector('.envelope-container');
            const instruction = document.querySelector('.instruction');
            
            container.classList.add('open');
            instruction.innerText = "Opening...";
            
            // Tunggu animasi buka amplop selesai, lalu pindah ke menu
            setTimeout(() => {
                navTo('page-menu');
            }, 2000); // delay 2 detik
        }

        // Animasi Teks Bunga
        function showFlowerText() {
            const container = document.getElementById('flowerContainer');
            container.classList.toggle('show-text');
        }

        // Kontrol Musik dan Piringan Hitam
        let isPlaying = false;
        function toggleMusic() {
            const audio = document.getElementById('bgm');
            const vinyl = document.getElementById('vinylRecord');
            
            if (isPlaying) {
                audio.pause();
                vinyl.classList.remove('spin');
            } else {
                audio.play();
                vinyl.classList.add('spin');
            }
            isPlaying = !isPlaying;
        }
    </script>
</body>
</html>
```