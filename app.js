const DB_KEY = "SIM_KEUANGAN_SEKOLAH_V1";

// Inisialisasi Database Dummy beserta Data Pengguna
let db = JSON.parse(localStorage.getItem(DB_KEY)) || {
    "Pengguna": [
        { username: "admin", password: "123", role: "admin", nama: "Administrator" },
        { username: "guru", password: "123", role: "guru", nama: "Bapak Budi (Guru)" }
    ],
    "Pendapatan": [
        { id: 1, tanggal: "2026-09-01", kategori: "Dana BOS", jumlah: 150000000, status: "Disetujui", keterangan: "Dana BOS Tahap III" },
        { id: 2, tanggal: "2026-09-05", kategori: "Sumbangan", jumlah: 50000000, status: "Disetujui", keterangan: "Sumbangan pendidikan" }
    ],
    "Pengeluaran": [
        { id: 1, tanggal: "2026-09-02", kategori: "Belanja Pegawai", jumlah: 80000000, status: "Disetujui", keterangan: "Honor tenaga pendidik" },
        { id: 2, tanggal: "2026-09-04", kategori: "Operasional", jumlah: 45000000, status: "Disetujui", keterangan: "Bayar listrik" }
    ]
};

// ================= FUNGSI BANTUAN =================
function rupiah(number) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(number||0));
}

function formatDate(date) {
    if(!date) return "-";
    return new Date(date).toLocaleDateString("id-ID");
}

function badge(status) {
    let cls = "badge-success";
    if(status === "Menunggu") cls = "badge-warning";
    return `<span class="badge ${cls}">${status||"-"}</span>`;
}

function total(data, key="jumlah") {
    return (data||[]).reduce((a,b) => a + Number(b[key]||0), 0);
}

// ================= OTENTIKASI & LOGIN =================
function handleLogin(event) {
    event.preventDefault();
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const errorMsg = document.getElementById("loginError");

    const validUser = db.Pengguna.find(u => u.username === user && u.password === pass);

    if (validUser) {
        // Simpan sesi user ke localStorage
        localStorage.setItem("currentUser", JSON.stringify(validUser));
        errorMsg.style.display = "none";
        checkAuth(); // Redirect ke halaman utama
    } else {
        errorMsg.style.display = "block";
    }
}

function logout() {
    localStorage.removeItem("currentUser");
    checkAuth();
}

function checkAuth() {
    const loggedInUser = JSON.parse(localStorage.getItem("currentUser"));
    const loginLayout = document.getElementById("login-layout");
    const appLayout = document.getElementById("app-layout");

    if (loggedInUser) {
        // Jika sudah login
        loginLayout.classList.add("hidden");
        appLayout.classList.remove("hidden");

        // Set nama dan role di topbar
        document.getElementById("userDisplayName").innerText = loggedInUser.nama;
        document.getElementById("userDisplayRole").innerText = loggedInUser.role.toUpperCase();

        // Atur tampilan berdasarkan Role
        if (loggedInUser.role === "guru") {
            document.body.classList.add("role-guru");
            loadDashboardGuru(loggedInUser);
        } else {
            document.body.classList.remove("role-guru");
            loadDashboard(); // Panggil dashboard Admin
        }
    } else {
        // Jika belum login
        loginLayout.classList.remove("hidden");
        appLayout.classList.add("hidden");
        document.body.classList.remove("role-guru");
    }
}

// ================= DASHBOARD ADMIN (LENGKAP) =================
function loadDashboard() {
    document.getElementById("topTitle").innerText = "Dashboard Admin";

    const income = total(db["Pendapatan"]);
    const expense = total(db["Pengeluaran"]);
    const balance = income - expense;
    const recentTransactions = [
        ...db["Pendapatan"].map(x => ({...x, jenis: "Pendapatan"})),
        ...db["Pengeluaran"].map(x => ({...x, jenis: "Pengeluaran"}))
    ].sort((a,b) => new Date(b.tanggal) - new Date(a.tanggal)).slice(0, 5);

    document.getElementById("app").innerHTML = `
        <div class="page-header">
            <div>
                <h1>Ringkasan Keuangan Sekolah</h1>
                <p>Akses Penuh Administrator</p>
            </div>
        </div>

        <div class="cards">
            <div class="card">
                <div class="card-icon green"><i class="fa-solid fa-arrow-trend-up"></i></div>
                <div class="card-title">Total Pendapatan</div>
                <div class="card-value">${rupiah(income)}</div>
            </div>
            <div class="card">
                <div class="card-icon red"><i class="fa-solid fa-arrow-trend-down"></i></div>
                <div class="card-title">Total Pengeluaran</div>
                <div class="card-value">${rupiah(expense)}</div>
            </div>
            <div class="card">
                <div class="card-icon blue"><i class="fa-solid fa-wallet"></i></div>
                <div class="card-title">Surplus / Saldo</div>
                <div class="card-value">${rupiah(balance)}</div>
            </div>
        </div>

        <div class="box">
            <div class="box-title"><h3>Grafik Pendapatan & Pengeluaran Per Bulan</h3></div>
            <canvas id="monthlyChart" style="max-height: 300px;"></canvas>
        </div>

        <div class="box">
            <div class="box-title"><h3>Transaksi Terbaru</h3></div>
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr><th>Tanggal</th><th>Jenis</th><th>Keterangan</th><th>Jumlah</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                        ${recentTransactions.map(x => `
                            <tr>
                                <td>${formatDate(x.tanggal)}</td>
                                <td>${x.jenis}</td>
                                <td>${x.keterangan}</td>
                                <td>${rupiah(x.jumlah)}</td>
                                <td>${badge(x.status)}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    setTimeout(renderMonthlyChart, 100);
}

// ================= DASHBOARD GURU (KHUSUS) =================
function loadDashboardGuru(user) {
    document.getElementById("topTitle").innerText = "Beranda Guru";

    document.getElementById("app").innerHTML = `
        <div class="page-header">
            <div>
                <h1>Selamat Datang, ${user.nama}</h1>
                <p>Portal Informasi Guru SD GIM</p>
            </div>
        </div>

        <div class="cards">
            <div class="card">
                <div class="card-icon blue"><i class="fa-solid fa-bullhorn"></i></div>
                <div class="card-title">Pengumuman</div>
                <div class="card-value" style="font-size: 16px;">Tidak ada pengumuman baru</div>
            </div>
            <div class="card">
                <div class="card-icon green"><i class="fa-solid fa-money-check-dollar"></i></div>
                <div class="card-title">Informasi Honor Terakhir</div>
                <div class="card-value">Telah Ditransfer</div>
            </div>
        </div>

        <div class="box">
            <h3>Panduan Aplikasi</h3>
            <p style="margin-top: 10px; color: var(--muted); font-size: 14px; line-height: 1.6;">
                Bapak/Ibu guru, saat ini Anda berada di portal khusus pendidik. Melalui portal ini, Anda akan dapat memantau slip gaji, laporan kegiatan, dan pengumuman sekolah di pembaruan selanjutnya.
            </p>
        </div>
    `;
}

// ================= RENDER GRAFIK (Hanya dipanggil di Dashboard Admin) =================
function renderMonthlyChart() {
    const ctx = document.getElementById("monthlyChart");
    if(!ctx) return;

    let incomePerMonth = Array(12).fill(0);
    let expensePerMonth = Array(12).fill(0);

    db["Pendapatan"].forEach(item => { let d = new Date(item.tanggal); incomePerMonth[d.getMonth()] += Number(item.jumlah); });
    db["Pengeluaran"].forEach(item => { let d = new Date(item.tanggal); expensePerMonth[d.getMonth()] += Number(item.jumlah); });

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"],
            datasets: [
                { label: "Pendapatan", backgroundColor: "#198754", data: incomePerMonth },
                { label: "Pengeluaran", backgroundColor: "#dc3545", data: expensePerMonth }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// ================= JALANKAN SAAT HALAMAN DIMUAT =================
checkAuth();