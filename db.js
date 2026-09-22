const DB_KEY = "SIM_KEUANGAN_SEKOLAH_V1";

// Database Dummy
let db = JSON.parse(localStorage.getItem(DB_KEY)) || {
    profile: {
        nama: "SD GIM BEKASI", npsn: "12345678", nss: "10101010",
        alamat: "Jl. Pendidikan No. 10, Bekasi", kepala: "Drs. Ahmad Wijaya",
        bendahara: "Siti Aminah, S.Pd", telepon: "021-1234567", email: "info@sdgim.sch.id"
    },
    "Tahun Anggaran": [{ id: 1, tahun: "2026", status: "Aktif" }],
    "Pengguna": [
        { id: 1, nama: "Administrator", username: "admin", password: "123", role: "admin", status: "Aktif" },
        { id: 2, nama: "Bapak Budi", username: "guru", password: "123", role: "guru", status: "Aktif" }
    ],
    "Hak Akses": [
        { id: 1, nama: "Admin", keterangan: "Akses seluruh sistem keuangan" },
        { id: 2, nama: "Guru", keterangan: "Akses portal informasi guru" }
    ],
    "Pendapatan": [{ id: 1, tanggal: "2026-09-01", kategori: "Dana BOS", jumlah: 150000000, status: "Disetujui", keterangan: "Dana BOS Tahap III" }],
    "Pengeluaran": [{ id: 1, tanggal: "2026-09-02", kategori: "Belanja Pegawai", jumlah: 80000000, status: "Disetujui", keterangan: "Honor pendidik" }]
};

function saveDB() {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// Fungsi Otentikasi Global
function checkAuth(requireRole = null) {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
        window.location.href = "index.html"; // Lempar ke login jika belum login
        return null;
    }
    if (requireRole && user.role !== requireRole) {
        window.location.href = "dashboard.html"; // Lempar ke beranda jika akses ditolak
    }
    return user;
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

// Utilitas Global
function rupiah(number) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(number||0)); }
function formatDate(date) { return date ? new Date(date).toLocaleDateString("id-ID") : "-"; }
function badge(status) {
    let cls = "badge-info"; // Default warna biru
    
    // Status hijau
    if (status === "Disetujui" || status === "Aktif" || status === "Sesuai" || status === "Tersedia") {
        cls = "badge-success";
    } 
    // Status merah (Termasuk Tidak Aktif)
    else if (status === "Ditolak" || status === "Tidak Aktif" || status === "Nonaktif") {
        cls = "badge-danger"; 
    } 
    // Status kuning
    else if (status === "Menunggu") {
        cls = "badge-warning";
    }
    
    return `<span class="badge ${cls}">${status || "-"}</span>`;
}
function total(data, key="jumlah") { return (data||[]).reduce((a,b) => a + Number(b[key]||0), 0); }
function toast(message) {
    const t = document.getElementById("toast");
    if(t) { t.innerText = message; t.style.display = "block"; setTimeout(() => t.style.display = "none", 2500); }
}
// ================= NAVIGASI SIDEBAR GLOBAL =================
function toggleMenu(id) {
    const el = document.getElementById(id);
    if(el) el.classList.toggle("open");
}

function navigateMenu(page, target) {
    // Simpan target menu ke memori sementara, lalu pindah halaman
    sessionStorage.setItem("targetMenu", target);
    window.location.href = page;
}