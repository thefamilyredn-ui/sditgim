// sidebar.js - Template Sidebar Terpusat
function renderSidebar(activeMenu) {
    activeMenu = activeMenu || ''; 
    let openMenus = JSON.parse(sessionStorage.getItem('openMenus')) || [];

    const checkOpen = (menuId, menuList) => {
        if (menuList.includes(activeMenu) && !openMenus.includes(menuId)) {
            openMenus.push(menuId);
            sessionStorage.setItem('openMenus', JSON.stringify(openMenus));
        }
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

        <!-- Master Data -->
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

        <!-- Menu Anggaran -->
        <div class="menu-item" onclick="toggleMenu('budgetMenu')">
            <i class="fa-solid fa-wallet"></i>
            <span>Anggaran</span>
            <i class="fa-solid fa-chevron-down arrow"></i>
        </div>
        <div class="submenu ${checkOpen('budgetMenu', ['Pendapatan', 'Rencana Anggaran', 'Anggaran Kebutuhan Guru', 'Rencana Pengeluaran', 'Pemindahan Kas', 'Realisasi'])}" id="budgetMenu">
            <div class="submenu-item" onclick="navigateMenu('anggaran.html', 'Pendapatan')">Pendapatan</div>
            <div class="submenu-item" onclick="navigateMenu('anggaran.html', 'Rencana Anggaran')">Rencana Anggaran</div>
            <div class="submenu-item" onclick="navigateMenu('anggaran.html', 'Anggaran Kebutuhan Guru')">Anggaran Kebutuhan Guru</div>
            <div class="submenu-item" onclick="navigateMenu('anggaran.html', 'Rencana Pengeluaran')">Rencana Pengeluaran</div>
            <div class="submenu-item" onclick="navigateMenu('pemindahan-kas.html', 'Pemindahan Kas')">Pemindahan Kas</div>
            <div class="submenu-item" onclick="navigateMenu('anggaran.html', 'Realisasi')">Realisasi</div>
        </div>

        <!-- Approval -->
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

        <!-- Laporan -->
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

        <!-- Pengaturan -->
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
    if (!el) return;
    el.classList.toggle("open");

    let openMenus = JSON.parse(sessionStorage.getItem('openMenus')) || [];
    if (el.classList.contains("open")) {
        if (!openMenus.includes(id)) openMenus.push(id);
    } else {
        openMenus = openMenus.filter(menuId => menuId !== id);
    }
    sessionStorage.setItem('openMenus', JSON.stringify(openMenus));
}