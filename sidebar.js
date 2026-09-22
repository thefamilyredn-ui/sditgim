// sidebar.js - Template Sidebar Terpusat
function renderSidebar(activeMenu = '') {
    // 1. Ambil memori menu apa saja yang sedang terbuka
    let openMenus = JSON.parse(sessionStorage.getItem('openMenus')) || [];

    // 2. Fungsi untuk mengecek dan mempertahankan menu tetap terbuka antar halaman
    const checkOpen = (menuId, menuList) => {
        // Jika halaman saat ini berada di dalam menu ini, pastikan menu ini ikut tersimpan sebagai "terbuka"
        if (menuList.includes(activeMenu) && !openMenus.includes(menuId)) {
            openMenus.push(menuId);
            sessionStorage.setItem('openMenus', JSON.stringify(openMenus));
        }
        // Jika menu ada di daftar memori, berikan class 'open'
        return openMenus.includes(menuId) ? 'open' : '';
    };

    const sidebarHTML = `
        <div class="brand">
            <h2><i class="fa-solid fa-school"></i> SIMKU SD GIM</h2>
            <p>Sistem Informasi Keuangan Sekolah</p>
        </div>

        <div class="menu-item ${activeMenu === 'dashboard' ? 'active' : ''}" onclick="window.location.href='dashboard.html'" style="cursor:pointer;">
            <i class="fa-solid fa-chart-line"></i>
            <span>Dashboard</span>
        </div>

        <div class="menu-item" onclick="toggleMenu('masterMenu')">
            <i class="fa-solid fa-database"></i>
            <span>Master Data</span>
            <i class="fa-solid fa-chevron-down arrow"></i>
        </div>
        <div class="submenu ${checkOpen('masterMenu', ['Profil Sekolah', 'Tahun Anggaran', 'Pengguna', 'Hak Akses'])}" id="masterMenu">
            <div class="submenu-item" onclick="navigateMenu('master.html', 'Profil Sekolah')">Profil Sekolah</div>
            <div class="submenu-item" onclick="navigateMenu('master.html', 'Tahun Anggaran')">Tahun Anggaran</div>
            <div class="submenu-item" onclick="navigateMenu('master.html', 'Pengguna')">Pengguna</div>
            <div class="submenu-item" onclick="navigateMenu('master.html', 'Hak Akses')">Hak Akses</div>
        </div>

        <div class="menu-item" onclick="toggleMenu('budgetMenu')">
            <i class="fa-solid fa-wallet"></i>
            <span>Anggaran</span>
            <i class="fa-solid fa-chevron-down arrow"></i>
        </div>
        <div class="submenu ${checkOpen('budgetMenu', ['Rencana Anggaran', 'Rencana Pengeluaran', 'Realisasi'])}" id="budgetMenu">
            <div class="submenu-item" onclick="navigateMenu('anggaran.html', 'Rencana Anggaran')">Rencana Anggaran</div>
            <div class="submenu-item" onclick="navigateMenu('anggaran.html', 'Rencana Pengeluaran')">Rencana Pengeluaran</div>
            <div class="submenu-item" onclick="navigateMenu('anggaran.html', 'Realisasi')">Realisasi</div>
        </div>

        <div class="menu-item" onclick="toggleMenu('transactionMenu')">
            <i class="fa-solid fa-money-bill-transfer"></i>
            <span>Transaksi</span>
            <i class="fa-solid fa-chevron-down arrow"></i>
        </div>
        <div class="submenu ${checkOpen('transactionMenu', ['Pendapatan', 'Pengeluaran', 'Transfer Kas/Rekening'])}" id="transactionMenu">
            <div class="submenu-item" onclick="navigateMenu('transaksi.html', 'Pendapatan')">Pendapatan</div>
            <div class="submenu-item" onclick="navigateMenu('transaksi.html', 'Pengeluaran')">Pengeluaran</div>
            <div class="submenu-item" onclick="navigateMenu('transaksi.html', 'Transfer Kas/Rekening')">Transfer Kas/Rekening</div>
        </div>

        <div class="menu-item" onclick="toggleMenu('approvalMenu')">
            <i class="fa-solid fa-check-double"></i>
            <span>Approval</span>
            <i class="fa-solid fa-chevron-down arrow"></i>
        </div>
        <div class="submenu ${checkOpen('approvalMenu', ['Menunggu', 'Disetujui', 'Ditolak'])}" id="approvalMenu">
            <div class="submenu-item" onclick="navigateMenu('approval.html', 'Menunggu')">Menunggu Persetujuan</div>
            <div class="submenu-item" onclick="navigateMenu('approval.html', 'Disetujui')">Disetujui</div>
            <div class="submenu-item" onclick="navigateMenu('approval.html', 'Ditolak')">Ditolak</div>
        </div>

        <div class="menu-item" onclick="toggleMenu('reportMenu')">
            <i class="fa-solid fa-file-lines"></i>
            <span>Laporan</span>
            <i class="fa-solid fa-chevron-down arrow"></i>
        </div>
        <div class="submenu ${checkOpen('reportMenu', ['Laba/Rugi', 'Arus Kas', 'Buku Kas Umum'])}" id="reportMenu">
            <div class="submenu-item" onclick="navigateMenu('laporan.html', 'Laba/Rugi')">Laba/Rugi</div>
            <div class="submenu-item" onclick="navigateMenu('laporan.html', 'Arus Kas')">Arus Kas</div>
            <div class="submenu-item" onclick="navigateMenu('laporan.html', 'Buku Kas Umum')">Buku Kas Umum</div>
        </div>

        <div class="menu-item" onclick="toggleMenu('settingMenu')">
            <i class="fa-solid fa-gear"></i>
            <span>Pengaturan</span>
            <i class="fa-solid fa-chevron-down arrow"></i>
        </div>
        <div class="submenu ${checkOpen('settingMenu', ['Legger', 'Lisensi', 'Log Aktivitas'])}" id="settingMenu">
            <div class="submenu-item" onclick="navigateMenu('pengaturan.html', 'Legger')">Legger & Database</div>
            <div class="submenu-item" onclick="navigateMenu('pengaturan.html', 'Lisensi')">Lisensi & Sistem</div>
            <div class="submenu-item" onclick="navigateMenu('pengaturan.html', 'Log Aktivitas')">Log Aktivitas</div>
        </div>

        <div class="menu-item" onclick="logout()" style="cursor:pointer;">
            <i class="fa-solid fa-right-from-bracket"></i>
            <span>Logout</span>
        </div>
    `;

    const sidebarContainer = document.getElementById('sidebar');
    if (sidebarContainer) {
        sidebarContainer.innerHTML = sidebarHTML;
    }
}

function navigateMenu(page, targetName) {
    sessionStorage.setItem("targetMenu", targetName);
    window.location.href = page;
}

function toggleMenu(id) {
    const el = document.getElementById(id);
    el.classList.toggle("open");

    // 3. Rekam status buka/tutup ke memori saat menu diklik secara manual
    let openMenus = JSON.parse(sessionStorage.getItem('openMenus')) || [];
    if (el.classList.contains("open")) {
        // Jika dibuka, tambahkan ke memori
        if (!openMenus.includes(id)) openMenus.push(id);
    } else {
        // Jika ditutup manual, hapus dari memori
        openMenus = openMenus.filter(menuId => menuId !== id);
    }
    sessionStorage.setItem('openMenus', JSON.stringify(openMenus));
}