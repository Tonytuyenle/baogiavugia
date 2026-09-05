const fs = require('fs');
const path = require('path');

const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, 'real_catalog_v4.json'), 'utf-8'));

// Aliases
const aliases = [
  { id: 'al-1', aliasCode: 'LK-30NC', targetCode: 'LK-30NC1', aliasType: 'OLD_CODE', notes: 'Mã nồi luộc gà 30 cũ chuyển sang LK-30NC1' },
  { id: 'al-2', aliasCode: 'LK-32NC', targetCode: 'LK-32NC1', aliasType: 'OLD_CODE', notes: 'Mã nồi luộc gà 32 cũ chuyển sang LK-32NC1' },
  { id: 'al-3', aliasCode: 'LK-2606', targetCode: 'LK-2606A', aliasType: 'OLD_CODE', notes: 'Mã chảo cạn cũ chuyển sang LK-2606A' },
  { id: 'al-4', aliasCode: 'LK-2202', targetCode: 'LK-2202A', aliasType: 'OLD_CODE', notes: 'Mã chảo cạn Titan vàng 22 cũ sang LK-2202A' },
  { id: 'al-5', aliasCode: 'LK3003', targetCode: 'LK-3003', aliasType: 'TYPO_COMMON', notes: 'Lỗi gõ thiếu gạch nối mã chảo cạn titanium 30cm' },
  { id: 'al-6', aliasCode: 'LK-2808S', targetCode: 'LK-2808S(VK)', aliasType: 'OLD_CODE', notes: 'Mã chảo sâu vung kính 28cm' },
  { id: 'al-7', aliasCode: 'TK-0318A', targetCode: 'TK-0318', aliasType: 'CODE_VARIANT', notes: 'Mã nồi táo Takin 18 tương đương' },
  { id: 'al-8', aliasCode: 'TK-036A', targetCode: 'TK-036', aliasType: 'CODE_VARIANT', notes: 'Bộ nồi Takin 3 món 5 đáy' },
  { id: 'al-9', aliasCode: 'LK-3020A', targetCode: 'LM-LK-3020A', aliasType: 'REPLACEMENT', notes: 'Mã nồi táo 20 Lock&King thế hệ mới' },
  { id: 'al-10', aliasCode: 'TK-036A-LM', targetCode: 'LM-TK-036A', aliasType: 'REPLACEMENT', notes: 'Mã bộ nồi Takin dòng cao cấp LM' }
];

const seedData = {
  products: catalog,
  aliases: aliases
};

// Generate HTML
const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Phần Mềm Quản Trị Giá Lock&King & Takin | 5 Tầng Giá & Lợi Nhuận Đại Lý</title>
  
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://unpkg.com/lucide@latest"></script>

  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
    body { font-family: 'Inter', sans-serif; background-color: #f8fafc; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #f1f5f9; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

    @media print {
      body * { visibility: hidden; }
      #printQuotationArea, #printQuotationArea * { visibility: visible; }
      #printQuotationArea { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 15px; background: white; }
      .no-print { display: none !important; }
      @page { size: A4; margin: 12mm; }
    }
  </style>
</head>
<body class="text-slate-800 antialiased min-h-screen flex flex-col">

  <!-- TOP ALERT BANNER -->
  <div id="topAlertBar" class="hidden bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs sm:text-sm font-medium px-4 py-2 flex items-center justify-between shadow-sm">
    <div class="flex items-center space-x-2">
      <i data-lucide="alert-triangle" class="w-4 h-4"></i>
      <span id="topAlertText">Cảnh báo</span>
    </div>
    <button onclick="closeTopAlert()" class="text-white hover:text-amber-100 font-bold ml-4">✕</button>
  </div>

  <div class="flex flex-1 overflow-hidden h-screen">
    
    <!-- SIDEBAR -->
    <aside class="w-64 bg-slate-900 text-slate-200 flex flex-col flex-shrink-0 z-20 shadow-xl select-none">
      
      <!-- LOGO -->
      <div class="p-4 border-b border-slate-800 flex items-center space-x-3 bg-slate-950/60">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-orange-500 flex items-center justify-center font-black text-white shadow-lg text-sm tracking-wider">
          LK
        </div>
        <div class="overflow-hidden">
          <h1 class="font-black text-sm tracking-tight text-white flex items-center gap-1">
            LOCK&KING <span class="text-orange-400">&</span> TAKIN
          </h1>
          <p class="text-[9px] text-sky-400 font-bold tracking-wider uppercase">Quản Trị Giá & Lợi Nhuận</p>
        </div>
      </div>

      <!-- NAV -->
      <nav class="flex-1 overflow-y-auto p-3 space-y-1 text-sm font-medium">
        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 mt-1">Tổng Quan & Danh Mục</div>
        
        <button onclick="navigateTab('dashboard')" id="nav-dashboard" class="nav-item w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition">
          <i data-lucide="layout-dashboard" class="w-4 h-4 text-sky-400"></i>
          <span>Bảng Tổng Quan</span>
        </button>

        <button onclick="navigateTab('products')" id="nav-products" class="nav-item w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition">
          <i data-lucide="package" class="w-4 h-4 text-emerald-400"></i>
          <span class="flex-1 text-left">Danh Mục (69 Model)</span>
          <span id="badgeProductCount" class="text-[10px] bg-slate-800 text-sky-300 px-2 py-0.5 rounded-full font-bold">69</span>
        </button>

        <button onclick="navigateTab('aliases')" id="nav-aliases" class="nav-item w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition">
          <i data-lucide="git-compare-arrows" class="w-4 h-4 text-amber-400"></i>
          <span class="flex-1 text-left">Mã Cũ & Chuyển Đổi</span>
          <span class="text-[10px] bg-amber-950/80 text-amber-300 border border-amber-800 px-1.5 py-0.5 rounded font-bold">10</span>
        </button>

        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 mt-3">Quản Trị Giá & Đối Chiếu</div>

        <button onclick="navigateTab('prices')" id="nav-prices" class="nav-item w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition">
          <i data-lucide="tags" class="w-4 h-4 text-indigo-400"></i>
          <span>So Sánh Giá & % Lợi Nhuận</span>
        </button>

        <button onclick="navigateTab('import')" id="nav-import" class="nav-item w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition">
          <i data-lucide="file-spreadsheet" class="w-4 h-4 text-purple-400"></i>
          <span class="flex-1 text-left">Nhập Giá Từ Excel</span>
        </button>

        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 mt-3">Báo Giá & Khách Hàng</div>

        <button onclick="navigateTab('customers')" id="nav-customers" class="nav-item w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition">
          <i data-lucide="users" class="w-4 h-4 text-cyan-400"></i>
          <span>Đại Lý Online & Offline</span>
        </button>

        <button onclick="navigateTab('new-quote')" id="nav-new-quote" class="nav-item w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition">
          <i data-lucide="file-plus-2" class="w-4 h-4 text-teal-400"></i>
          <span>Tạo Báo Giá Mới</span>
        </button>

        <button onclick="navigateTab('quotations')" id="nav-quotations" class="nav-item w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition">
          <i data-lucide="history" class="w-4 h-4 text-pink-400"></i>
          <span class="flex-1 text-left">Lịch Sử Báo Giá</span>
          <span id="badgeQuoteCount" class="text-[10px] bg-slate-800 text-pink-400 px-2 py-0.5 rounded-full font-bold">1</span>
        </button>

        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 mt-3">Hệ Thống</div>

        <button onclick="navigateTab('audit')" id="nav-audit" class="nav-item w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition">
          <i data-lucide="shield-alert" class="w-4 h-4 text-rose-400"></i>
          <span>Nhật Ký (Audit Log)</span>
        </button>

        <button onclick="navigateTab('settings')" id="nav-settings" class="nav-item w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition">
          <i data-lucide="settings" class="w-4 h-4 text-slate-400"></i>
          <span>Cấu Hình & Sao Lưu</span>
        </button>
      </nav>

      <!-- USER & ROLE SWITCHER -->
      <div class="p-3 border-t border-slate-800 bg-slate-950/70">
        <div class="flex items-center justify-between mb-2">
          <span class="text-[10px] font-bold uppercase text-slate-400">Vai Trò Đang Chọn:</span>
          <span id="currentRoleBadge" class="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">ADMIN</span>
        </div>
        <select id="roleSwitcher" onchange="switchRole(this.value)" class="w-full bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg p-1.5 focus:outline-none focus:border-sky-500">
          <option value="ADMIN">Quản Trị Viên (Admin - Full quyền)</option>
          <option value="SALES">Kinh Doanh (Ẩn giá nhập)</option>
          <option value="ACCOUNTANT">Kế Toán (Xem giá vốn & đối chiếu)</option>
          <option value="VIEWER">Chỉ Xem (Khóa sửa xóa)</option>
        </select>
        <p id="roleDesc" class="text-[10px] text-slate-400 mt-1.5 leading-tight">Toàn quyền sửa giá, duyệt Excel và xem giá vốn.</p>
      </div>
    </aside>

    <!-- MAIN -->
    <main class="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-y-auto">
      
      <!-- TOP HEADER -->
      <header class="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div class="flex-1 max-w-2xl relative">
          <div class="relative">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
            <input 
              type="text" 
              id="globalSearchInput"
              placeholder="Tra cứu 69 Model: Nhập mã chuẩn, mã cũ hoặc tên sản phẩm..."
              oninput="handleGlobalSearch(this.value)"
              class="w-full pl-9 pr-24 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            />
            <span class="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono">F2</span>
          </div>
          <div id="searchDropdown" class="hidden absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto divide-y divide-slate-100"></div>
        </div>

        <div class="flex items-center space-x-3 ml-4">
          <a href="bang_gia_so_sanh_gia_nhap_cu_moi.xlsx" download class="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 rounded-lg text-xs font-bold transition">
            <i data-lucide="file-spreadsheet" class="w-3.5 h-3.5"></i>
            <span>Tải Excel So Sánh Giá & LN Đại Lý</span>
          </a>

          <button onclick="openSystemResetConfirm()" class="text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100" title="Khôi phục dữ liệu gốc">
            <i data-lucide="refresh-cw" class="w-4 h-4"></i>
          </button>
        </div>
      </header>

      <!-- BODY -->
      <div class="p-6 flex-1">

        <!-- ================= TAB 1: DASHBOARD ================= -->
        <section id="tab-dashboard" class="tab-pane">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
            <div>
              <h2 class="text-xl font-black text-slate-900 flex items-center gap-2">
                Bảng Tổng Quan Giá & Lợi Nhuận Phân Phối
              </h2>
              <p class="text-xs text-slate-500 mt-0.5">Theo dõi chuỗi giá trị: Giá Vốn Nhập ➔ NPP Online/Offline ➔ Đại Lý Offline ➔ Giá Facebook</p>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="navigateTab('products')" class="px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5">
                <i data-lucide="package" class="w-3.5 h-3.5"></i> Xem Danh Mục 69 Model
              </button>
              <button onclick="navigateTab('new-quote')" class="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5">
                <i data-lucide="file-plus" class="w-3.5 h-3.5"></i> Lập Báo Giá Đại Lý
              </button>
            </div>
          </div>

          <!-- KPI CARDS -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tổng Số Model</p>
                <h3 class="text-2xl font-black text-slate-900 mt-1">69 <span class="text-xs font-semibold text-slate-500">model</span></h3>
                <span class="text-[10px] text-sky-600 font-bold flex items-center gap-1 mt-0.5">
                  <span class="w-2 h-2 rounded-full bg-sky-500"></span> 52 Lock&King | 17 Takin
                </span>
              </div>
              <div class="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <i data-lucide="package" class="w-6 h-6"></i>
              </div>
            </div>

            <div class="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-sm flex items-center justify-between">
              <div>
                <p class="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Model Giảm Giá Nhập</p>
                <h3 class="text-2xl font-black text-emerald-700 mt-1">17 <span class="text-xs font-semibold text-slate-500">model</span></h3>
                <span class="text-[10px] text-emerald-800 font-bold flex items-center gap-1 mt-0.5">
                  <i data-lucide="trending-down" class="w-3 h-3"></i> Giảm chi phí giá vốn xưởng
                </span>
              </div>
              <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <i data-lucide="arrow-down-right" class="w-6 h-6"></i>
              </div>
            </div>

            <div class="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/20 shadow-sm flex items-center justify-between">
              <div>
                <p class="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Model Tăng Giá Nhập</p>
                <h3 class="text-2xl font-black text-rose-700 mt-1">20 <span class="text-xs font-semibold text-slate-500">model</span></h3>
                <span class="text-[10px] text-rose-800 font-bold flex items-center gap-1 mt-0.5">
                  <i data-lucide="trending-up" class="w-3 h-3"></i> Tăng từ +3% đến +5.85%
                </span>
              </div>
              <div class="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <i data-lucide="arrow-up-right" class="w-6 h-6"></i>
              </div>
            </div>

            <div class="bg-white p-4 rounded-xl border border-indigo-200 bg-indigo-50/20 shadow-sm flex items-center justify-between">
              <div>
                <p class="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">Chính Sách Đại Lý</p>
                <h3 class="text-2xl font-black text-indigo-800 mt-1">+20% <span class="text-xs font-semibold text-slate-500">biên độ</span></h3>
                <span class="text-[10px] text-indigo-800 font-bold flex items-center gap-1 mt-0.5">
                  <i data-lucide="shield-check" class="w-3 h-3"></i> Giá ĐL Offline = NPP Offline x 1.2
                </span>
              </div>
              <div class="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <i data-lucide="percent" class="w-6 h-6"></i>
              </div>
            </div>
          </div>

          <!-- CHART & TOP CHANGES -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div class="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h4 class="font-black text-slate-900 text-sm">Biểu Đồ Chuỗi 5 Tầng Giá Sản Phẩm</h4>
                  <p class="text-xs text-slate-400">Vốn Mới ➔ NPP Online ➔ NPP Offline ➔ Đại Lý Offline ➔ Facebook</p>
                </div>
                <select id="chartProductSelect" onchange="renderPriceChart(this.value)" class="text-xs border border-slate-200 rounded-lg p-1.5 bg-slate-50 font-semibold text-slate-700">
                </select>
              </div>
              <div class="h-64 relative">
                <canvas id="priceTrendChart"></canvas>
              </div>
            </div>

            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <div class="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                <h4 class="font-black text-slate-900 text-sm flex items-center gap-1.5">
                  <i data-lucide="flame" class="w-4 h-4 text-rose-500"></i> Biến Động Vốn Lớn Nhất
                </h4>
                <span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">Hãng điều chỉnh</span>
              </div>
              <div id="topImportDiffList" class="flex-1 space-y-2.5 overflow-y-auto max-h-64">
              </div>
            </div>
          </div>
        </section>

        <!-- ================= TAB 2: PRODUCTS ================= -->
        <section id="tab-products" class="tab-pane hidden">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
            <div>
              <h2 class="text-xl font-black text-slate-900 flex items-center gap-2">
                Danh Mục 69 Model & Bảng Giá 5 Tầng
              </h2>
              <p class="text-xs text-slate-500 mt-0.5">Bao gồm Giá Nhập, Giá NPP Online/Offline, Giá Đại Lý Offline và Tỷ lệ % Lợi Nhuận</p>
            </div>
            <div class="flex items-center gap-2">
              <a href="bang_gia_so_sanh_gia_nhap_cu_moi.xlsx" download class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5">
                <i data-lucide="file-spreadsheet" class="w-3.5 h-3.5"></i> Tải Excel Bảng Giá
              </a>
            </div>
          </div>

          <!-- FILTERS -->
          <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div class="flex flex-wrap items-center gap-2 flex-1 min-w-[300px]">
              <div class="relative flex-1 min-w-[200px]">
                <i data-lucide="search" class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
                <input 
                  type="text" 
                  id="productFilterSearch" 
                  placeholder="Lọc Model, tên sản phẩm hoặc thông số..." 
                  oninput="renderProductTable()" 
                  class="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white"
                />
              </div>

              <select id="productFilterBrand" onchange="renderProductTable()" class="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 font-bold text-slate-700">
                <option value="">Tất Cả Thương Hiệu (69)</option>
                <option value="Lock&King">Lock&King (52)</option>
                <option value="Takin">Takin (17)</option>
              </select>

              <select id="productFilterCategory" onchange="renderProductTable()" class="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50">
                <option value="">Tất cả phân loại</option>
                <option value="CHẢO">Chảo & Quánh</option>
                <option value="NỒI & BỘ NỒI">Nồi & Bộ Nồi</option>
                <option value="NỒI TĂNG ÁP">Nồi Tăng Áp</option>
                <option value="ẤM & BÌNH">Ấm & Bình</option>
                <option value="ĐỒ ĐIỆN">Đồ Điện Gia Dụng</option>
              </select>
            </div>

            <div class="text-slate-500">
              Đang hiển thị: <strong id="productShowingCount" class="text-sky-700 font-bold">69</strong> sản phẩm
            </div>
          </div>

          <!-- TABLE -->
          <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-xs text-left">
                <thead class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                  <tr>
                    <th class="py-3 px-2 text-center">STT</th>
                    <th class="py-3 px-2.5">Model</th>
                    <th class="py-3 px-2">Hãng</th>
                    <th class="py-3 px-3">Tên Sản Phẩm</th>
                    
                    <!-- PROTECTED IMPORT PRICE COLUMNS -->
                    <th class="py-3 px-2.5 col-import-price text-right text-slate-500" title="Giá vốn nhập kho trước đây">Giá Nhập Cũ</th>
                    <th class="py-3 px-2.5 col-import-price text-right text-rose-700" title="Giá vốn nhập kho mới áp dụng">Giá Nhập Mới</th>
                    <th class="py-3 px-2 col-import-price text-center text-rose-800" title="Chênh lệch giá vốn">Biến Động</th>

                    <th class="py-3 px-2.5 text-right text-indigo-700" title="Giá giao cho tổng kho online">Giá NPP Online</th>
                    <th class="py-3 px-2.5 text-center text-indigo-800 bg-indigo-50/70" title="Cách tính chuẩn của hãng: (Giá Facebook - Giá NPP Online) / Giá Facebook">% LN NPP / FB</th>
                    <th class="py-3 px-2.5 text-right text-orange-700" title="Giá giao cho đại lý cửa hàng offline">Giá NPP Offline</th>
                    <th class="py-3 px-2.5 text-center text-amber-800 bg-amber-50/70" title="Chênh lệch: Giá NPP Offline - Giá NPP Online">Lệch Off - On</th>
                    <th class="py-3 px-2.5 text-right text-emerald-700 bg-emerald-50/70" title="Cách tính: Giá NPP Offline nhân 120% (thêm 20%)">Giá Đại Lý Offline</th>
                    <th class="py-3 px-2.5 text-center text-emerald-800 bg-emerald-50/70" title="Cách tính chuẩn của hãng: (Giá Facebook - Giá Đại Lý Offline) / Giá Facebook">% LN Đại Lý / FB</th>
                    <th class="py-3 px-2.5 text-right text-blue-700" title="Giá bán lẻ đề xuất trên Facebook">Giá Facebook</th>
                    <th class="py-3 px-2 text-center">Thông Số</th>
                    <th class="py-3 px-2 text-center">Báo Giá</th>
                  </tr>
                </thead>
                <tbody id="productTableTbody" class="divide-y divide-slate-100 font-medium"></tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- ================= TAB 3: ALIASES ================= -->
        <section id="tab-aliases" class="tab-pane hidden">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
            <div>
              <h2 class="text-xl font-black text-slate-900">Từ Điển Chuyển Đổi Mã Cũ Sang Mã Chuẩn</h2>
              <p class="text-xs text-slate-500 mt-0.5">Tự động nhận diện khi người dùng tra cứu hoặc nhập file Excel</p>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table class="w-full text-xs text-left">
              <thead class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                <tr>
                  <th class="py-3 px-4">Mã Cũ / Tên Nhầm</th>
                  <th class="py-3 px-4 text-center">Chuyển Sang</th>
                  <th class="py-3 px-4">Mã Chuẩn Hệ Thống</th>
                  <th class="py-3 px-4">Tên Sản Phẩm Chính Thức</th>
                  <th class="py-3 px-4">Hãng</th>
                  <th class="py-3 px-4">Ghi Chú Lý Do</th>
                  <th class="py-3 px-4 text-center">Trạng Thái</th>
                </tr>
              </thead>
              <tbody id="aliasTableTbody" class="divide-y divide-slate-100 font-medium"></tbody>
            </table>
          </div>
        </section>

        <!-- ================= TAB 4: PRICES ================= -->
        <section id="tab-prices" class="tab-pane hidden">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
            <div>
              <h2 class="text-xl font-black text-slate-900">Bảng Tra Cứu Từng Tầng Giá & % Tỷ Suất</h2>
              <p class="text-xs text-slate-500 mt-0.5">Lọc xem chi tiết theo từng loại giá hoặc tỷ lệ lợi nhuận của toàn bộ 69 model</p>
            </div>
          </div>

          <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div class="flex items-center gap-2 flex-1">
              <label class="font-bold text-slate-700">Chọn tầng giá / chỉ số:</label>
              <select id="priceTypeSelector" onchange="renderPriceTable()" class="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 font-bold text-slate-800">
                <option value="dealerOfflinePrice">Giá Đại Lý Offline (NPP Offline x 120%)</option>
                <option value="nppOnlineProfitRatio">% Lợi Nhuận NPP / FB: (FB - NPP Online) / FB</option>
                <option value="dealerProfitRatio">% Lợi Nhuận Đại Lý / FB: (FB - Giá Đại Lý) / FB</option>
                <option value="diffOnlineOffline">Chênh Lệch Giá Offline - Online (VNĐ)</option>
                <option value="nppOnlinePrice">Giá NPP Online</option>
                <option value="nppOfflinePrice">Giá NPP Offline</option>
                <option value="facebookPrice">Giá Bán Lẻ Facebook</option>
                <option value="tmdtPrice">Giá Sàn TMĐT (Shopee/TikTok)</option>
                <option value="retailPrice">Giá Bán Lẻ Niêm Yết Hãng</option>
                <option value="newImportPrice">Giá Nhập Mới (Vốn Hãng)</option>
                <option value="oldImportPrice">Giá Nhập Cũ (Đối chiếu)</option>
              </select>

              <input 
                type="text" 
                id="priceSearchInput" 
                placeholder="Tìm Model hoặc tên sản phẩm..." 
                oninput="renderPriceTable()" 
                class="pl-3 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs w-64 focus:bg-white"
              />
            </div>
          </div>

          <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table class="w-full text-xs text-left">
              <thead class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                <tr>
                  <th class="py-3 px-3 text-center">STT</th>
                  <th class="py-3 px-3">Model</th>
                  <th class="py-3 px-3">Tên Sản Phẩm</th>
                  <th class="py-3 px-3">Hãng</th>
                  <th class="py-3 px-3 text-right">Mức Giá / Tỷ Lệ %</th>
                  <th class="py-3 px-3 text-center">Trạng Thái</th>
                  <th class="py-3 px-3">Ngày Cập Nhật</th>
                  <th class="py-3 px-3 text-center">Thông Số</th>
                </tr>
              </thead>
              <tbody id="priceTableTbody" class="divide-y divide-slate-100 font-medium"></tbody>
            </table>
          </div>
        </section>

        <!-- ================= TAB 5: SMART EXCEL IMPORT ================= -->
        <section id="tab-import" class="tab-pane hidden">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
            <div>
              <h2 class="text-xl font-black text-slate-900">Nhập Bảng Giá Từ Excel / CSV</h2>
              <p class="text-xs text-slate-500 mt-0.5">Tải lên file cập nhật giá nhập hoặc giá bán để đối chiếu</p>
            </div>
            <a href="bang_gia_so_sanh_gia_nhap_cu_moi.xlsx" download class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <i data-lucide="download" class="w-3.5 h-3.5"></i> Tải File Excel Mẫu
            </a>
          </div>

          <div class="bg-white rounded-xl border border-dashed border-sky-300 p-8 text-center shadow-sm mb-6 hover:border-sky-500 transition cursor-pointer" onclick="document.getElementById('excelFileInput').click()">
            <input type="file" id="excelFileInput" accept=".xlsx, .xls, .csv" class="hidden" onchange="handleExcelUpload(event)">
            <div class="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-2 shadow-inner">
              <i data-lucide="file-spreadsheet" class="w-7 h-7"></i>
            </div>
            <h3 class="font-bold text-sm text-slate-800">Nhấp vào đây để tải lên file Excel hoặc CSV bảng giá</h3>
            <p class="text-xs text-slate-400 mt-0.5">Tự động kiểm tra tính hợp lệ và cảnh báo nếu có lệch giá bất thường</p>
          </div>

          <div id="importStagingArea" class="hidden space-y-4">
            <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div class="bg-white p-3 rounded-lg border border-slate-200 text-center">
                <span class="text-[10px] uppercase font-bold text-slate-400 block">Tổng Dòng</span>
                <span id="importStatTotal" class="text-xl font-black text-slate-800">0</span>
              </div>
              <div class="bg-white p-3 rounded-lg border border-emerald-200 bg-emerald-50/40 text-center">
                <span class="text-[10px] uppercase font-bold text-emerald-600 block">Hợp Lệ</span>
                <span id="importStatValid" class="text-xl font-black text-emerald-700">0</span>
              </div>
              <div class="bg-white p-3 rounded-lg border border-amber-200 bg-amber-50/40 text-center">
                <span class="text-[10px] uppercase font-bold text-amber-600 block">Cảnh Báo Vàng</span>
                <span id="importStatWarnings" class="text-xl font-black text-amber-700">0</span>
              </div>
              <div class="bg-white p-3 rounded-lg border border-rose-200 bg-rose-50/40 text-center">
                <span class="text-[10px] uppercase font-bold text-rose-600 block">Lỗi Chặn</span>
                <span id="importStatErrors" class="text-xl font-black text-rose-700">0</span>
              </div>
              <div class="bg-white p-3 rounded-lg border border-sky-200 bg-sky-50/40 text-center col-span-2 sm:col-span-1">
                <span class="text-[10px] uppercase font-bold text-sky-600 block">Mã Chuẩn Hóa</span>
                <span id="importStatMapped" class="text-xl font-black text-sky-700">0</span>
              </div>
            </div>

            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div class="text-xs">
                <span class="font-bold text-slate-800" id="importFileName">bang_gia.xlsx</span>
                <span class="text-slate-500 ml-2" id="importFileStatus">Đã chạy kiểm tra</span>
              </div>
              <div class="flex items-center gap-2">
                <button onclick="cancelImport()" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold">Hủy Bỏ</button>
                <button id="btnCommitImport" onclick="commitImportData()" class="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1">
                  <i data-lucide="check-check" class="w-4 h-4"></i> Phê Duyệt & Cập Nhật Bảng Giá
                </button>
              </div>
            </div>

            <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div class="overflow-x-auto max-h-96">
                <table class="w-full text-xs text-left">
                  <thead class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                    <tr>
                      <th class="py-2.5 px-3">Dòng</th>
                      <th class="py-2.5 px-3">Mã Nhập</th>
                      <th class="py-2.5 px-3">Mã Chuẩn Áp Dụng</th>
                      <th class="py-2.5 px-3">Tên Sản Phẩm</th>
                      <th class="py-2.5 px-3 text-right">Giá Cũ</th>
                      <th class="py-2.5 px-3 text-right">Giá Mới File</th>
                      <th class="py-2.5 px-3 text-center">Tỷ Lệ Lệch</th>
                      <th class="py-2.5 px-3 text-center">Trạng Thái</th>
                      <th class="py-2.5 px-3">Chi Tiết Kiểm Tra</th>
                    </tr>
                  </thead>
                  <tbody id="stagingTableTbody" class="divide-y divide-slate-100 font-medium"></tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <!-- ================= TAB 6: CUSTOMERS ================= -->
        <section id="tab-customers" class="tab-pane hidden">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
            <div>
              <h2 class="text-xl font-black text-slate-900">Danh Sách Đại Lý Online & Offline</h2>
              <p class="text-xs text-slate-500 mt-0.5">Mạng lưới phân phối đại lý vật lý và sàn online</p>
            </div>
            <button onclick="navigateTab('new-quote')" class="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5">
              <i data-lucide="file-plus" class="w-3.5 h-3.5"></i> Tạo Báo Giá Nhanh
            </button>
          </div>

          <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table class="w-full text-xs text-left">
              <thead class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                <tr>
                  <th class="py-3 px-3">Mã ĐL</th>
                  <th class="py-3 px-3">Tên Đối Tác / Đại Lý</th>
                  <th class="py-3 px-3">Phân Loại Nhóm</th>
                  <th class="py-3 px-3">Chính Sách Áp Dụng</th>
                  <th class="py-3 px-3">Điện Thoại</th>
                  <th class="py-3 px-3">Địa Chỉ</th>
                  <th class="py-3 px-3 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody id="customerTableTbody" class="divide-y divide-slate-100 font-medium"></tbody>
            </table>
          </div>
        </section>

        <!-- ================= TAB 7: NEW QUOTATION ================= -->
        <section id="tab-new-quote" class="tab-pane hidden">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
            <div>
              <h2 class="text-xl font-black text-slate-900">Lập Báo Giá Sản Phẩm Chuyên Nghiệp</h2>
              <p class="text-xs text-slate-500 mt-0.5">Hỗ trợ chọn tầng giá, chiết khấu, VAT, xuất PDF và in chuẩn A4</p>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="saveAndPreviewQuotation()" class="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5">
                <i data-lucide="printer" class="w-4 h-4"></i> Xem Trước Mẫu In A4 & Lưu
              </button>
            </div>
          </div>

          <!-- QUOTATION CONFIG -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            <div class="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 class="font-bold text-xs text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Thông Tin Khách Hàng & Chính Sách Giá</h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Chọn Đại Lý / Khách Hàng:</label>
                  <select id="quoteCustomerSelect" onchange="handleQuotationCustomerChange(this.value)" class="w-full border border-slate-200 rounded-lg p-2 bg-slate-50">
                    <option value="">-- Chọn khách hàng có sẵn --</option>
                  </select>
                </div>

                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Áp Dụng Tầng Giá:</label>
                  <select id="quotePriceTypeSelect" onchange="recalcQuotation()" class="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 font-bold text-sky-800">
                    <option value="dealerOfflinePrice" selected>Giá Đại Lý Offline (NPP Offline x 120%)</option>
                    <option value="nppOfflinePrice">Giá NPP Offline (Đại lý cửa hàng)</option>
                    <option value="nppOnlinePrice">Giá NPP Online (Tổng kho online)</option>
                    <option value="facebookPrice">Giá Facebook (Bán lẻ)</option>
                  </select>
                </div>

                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Tên Đơn Vị Nhận:</label>
                  <input type="text" id="quoteCustomerName" placeholder="Tên khách hàng hoặc công ty..." class="w-full border border-slate-200 rounded-lg p-2 bg-slate-50">
                </div>

                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Số Điện Thoại:</label>
                  <input type="text" id="quoteCustomerPhone" placeholder="09xx xxx xxx" class="w-full border border-slate-200 rounded-lg p-2 bg-slate-50">
                </div>

                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Thời Hạn Báo Giá:</label>
                  <input type="date" id="quoteValidUntil" class="w-full border border-slate-200 rounded-lg p-2 bg-slate-50">
                </div>

                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Mã Số Báo Giá:</label>
                  <input type="text" id="quoteCodeInput" readonly class="w-full border border-slate-200 rounded-lg p-2 bg-slate-100 font-mono font-bold text-sky-800">
                </div>
              </div>
            </div>

            <!-- TOTAL SUMMARY CARD -->
            <div class="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-xl shadow-lg flex flex-col justify-between">
              <div>
                <span class="text-[10px] uppercase font-bold text-sky-400 tracking-wider">Tóm Tắt Báo Giá</span>
                <div class="mt-4 space-y-2 text-xs">
                  <div class="flex justify-between text-slate-300">
                    <span>Tổng Tiền Hàng:</span>
                    <span id="quoteCalcSubtotal" class="font-mono font-bold text-white">0 đ</span>
                  </div>
                  <div class="flex justify-between text-slate-300">
                    <span>Chiết Khấu Đơn:</span>
                    <span id="quoteCalcDiscount" class="font-mono font-bold text-rose-300">-0 đ</span>
                  </div>
                  <div class="flex justify-between text-slate-300">
                    <span>Thuế VAT:</span>
                    <span id="quoteCalcVat" class="font-mono font-bold text-sky-300">+0 đ</span>
                  </div>
                  <div class="border-t border-slate-700 pt-2 flex justify-between items-baseline">
                    <span class="font-bold text-sm">Tổng Thanh Toán:</span>
                    <span id="quoteCalcTotal" class="font-mono font-black text-xl text-amber-400">0 đ</span>
                  </div>
                </div>
              </div>

              <div class="mt-4 pt-3 border-t border-slate-700 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Chính sách: Khóa giá 15 ngày</span>
                <span class="text-emerald-400 font-bold">Bảo hành 12 tháng</span>
              </div>
            </div>
          </div>

          <!-- ADD PRODUCT TO QUOTE -->
          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-4">
            <div class="flex flex-wrap items-center gap-3 text-xs">
              <div class="flex-1 min-w-[280px]">
                <label class="block font-semibold text-slate-700 mb-1">Chọn sản phẩm thêm vào báo giá:</label>
                <select id="addProductToQuoteSelect" class="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 font-bold text-slate-800">
                </select>
              </div>
              <div class="w-24">
                <label class="block font-semibold text-slate-700 mb-1">Số lượng:</label>
                <input type="number" id="addProductQty" value="1" min="1" class="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 font-bold text-center">
              </div>
              <div class="w-24">
                <label class="block font-semibold text-slate-700 mb-1">CK dòng (%):</label>
                <input type="number" id="addProductDiscount" value="0" min="0" max="100" class="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 font-bold text-center">
              </div>
              <div class="pt-5">
                <button onclick="addProductToQuotation()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow flex items-center gap-1">
                  <i data-lucide="plus" class="w-4 h-4"></i> Thêm Vào Báo Giá
                </button>
              </div>
            </div>
          </div>

          <!-- QUOTATION ITEMS TABLE -->
          <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
            <div class="p-3 bg-slate-100 border-b border-slate-200 font-bold text-xs text-slate-700 flex justify-between items-center">
              <span>Danh Sách Sản Phẩm Báo Giá</span>
              <span class="text-[11px] font-normal text-slate-500">Có thể sửa số lượng và chiết khấu trực tiếp trên từng dòng</span>
            </div>
            <table class="w-full text-xs text-left">
              <thead class="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px]">
                <tr>
                  <th class="py-2.5 px-3">Model</th>
                  <th class="py-2.5 px-3">Hãng</th>
                  <th class="py-2.5 px-3">Tên Sản Phẩm</th>
                  <th class="py-2.5 px-3 text-center">ĐVT</th>
                  <th class="py-2.5 px-3 text-right">Đơn Giá Áp Dụng</th>
                  <th class="py-2.5 px-3 text-center">Số Lượng</th>
                  <th class="py-2.5 px-3 text-center">CK Dòng (%)</th>
                  <th class="py-2.5 px-3 text-right">Thành Tiền</th>
                  <th class="py-2.5 px-3 text-center">Xóa</th>
                </tr>
              </thead>
              <tbody id="quoteItemsTbody" class="divide-y divide-slate-100 font-medium"></tbody>
            </table>
            <div id="emptyQuoteItemsNotice" class="p-8 text-center text-slate-400 text-xs">
              Chưa có sản phẩm nào. Hãy chọn sản phẩm ở ô trên và nhấn "Thêm Vào Báo Giá".
            </div>
          </div>

          <!-- DISCOUNT & VAT CONTROLS -->
          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Chiết khấu toàn đơn (%):</label>
              <input type="number" id="quoteDiscountRate" value="0" min="0" max="50" oninput="recalcQuotation()" class="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 font-bold">
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Thuế VAT (%):</label>
              <input type="number" id="quoteVatRate" value="10" min="0" max="10" oninput="recalcQuotation()" class="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 font-bold">
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Chi phí vận chuyển (VNĐ):</label>
              <input type="number" id="quoteShippingFee" value="0" min="0" step="10000" oninput="recalcQuotation()" class="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 font-bold">
            </div>
          </div>
        </section>

        <!-- ================= TAB 8: QUOTATIONS LIST ================= -->
        <section id="tab-quotations" class="tab-pane hidden">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
            <div>
              <h2 class="text-xl font-black text-slate-900">Lịch Sử Báo Giá Đã Lập</h2>
              <p class="text-xs text-slate-500 mt-0.5">Lưu trữ toàn bộ báo giá để theo dõi giá và in lại bất kỳ lúc nào</p>
            </div>
            <button onclick="navigateTab('new-quote')" class="px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5">
              <i data-lucide="plus" class="w-3.5 h-3.5"></i> Tạo Báo Giá Mới
            </button>
          </div>

          <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table class="w-full text-xs text-left">
              <thead class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                <tr>
                  <th class="py-3 px-3">Mã Báo Giá</th>
                  <th class="py-3 px-3">Khách Hàng / Đại Lý</th>
                  <th class="py-3 px-3">Chính Sách Giá</th>
                  <th class="py-3 px-3 text-right">Tổng Thanh Toán</th>
                  <th class="py-3 px-3">Ngày Lập</th>
                  <th class="py-3 px-3 text-center">Trạng Thái</th>
                  <th class="py-3 px-3 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody id="quotationListTbody" class="divide-y divide-slate-100 font-medium"></tbody>
            </table>
          </div>
        </section>

        <!-- ================= TAB 9: AUDIT LOG ================= -->
        <section id="tab-audit" class="tab-pane hidden">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
            <div>
              <h2 class="text-xl font-black text-slate-900">Nhật Ký Hoạt Động & Biến Động Giá (Audit Log)</h2>
              <p class="text-xs text-slate-500 mt-0.5">Ghi vết minh bạch: Ai thay đổi, mức giá cũ, mức giá mới và thời điểm thao tác</p>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table class="w-full text-xs text-left">
              <thead class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                <tr>
                  <th class="py-3 px-3">Thời Gian</th>
                  <th class="py-3 px-3">Người Dùng</th>
                  <th class="py-3 px-3">Hành Động</th>
                  <th class="py-3 px-3">Đối Tượng</th>
                  <th class="py-3 px-3">Giá Trị Cũ</th>
                  <th class="py-3 px-3">Giá Trị Mới</th>
                  <th class="py-3 px-3">Chi Tiết Thao Tác</th>
                </tr>
              </thead>
              <tbody id="auditTableTbody" class="divide-y divide-slate-100 font-medium"></tbody>
            </table>
          </div>
        </section>

        <!-- ================= TAB 10: SETTINGS ================= -->
        <section id="tab-settings" class="tab-pane hidden">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
            <div>
              <h2 class="text-xl font-black text-slate-900">Cấu Hình Tham Số & Sao Lưu Dữ Liệu</h2>
              <p class="text-xs text-slate-500 mt-0.5">Quản trị ngưỡng cảnh báo lệch giá và sao lưu file dữ liệu hệ thống</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 class="font-bold text-xs text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Tham Số Kiểm Soát</h3>
              
              <div class="space-y-3 text-xs">
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Ngưỡng cảnh báo lệch giá Excel (%):</label>
                  <input type="number" id="settingPriceThreshold" value="10" min="1" max="100" class="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 font-bold">
                  <p class="text-[10px] text-slate-400 mt-0.5">Bật cảnh báo màu vàng khi giá mới chênh lệch so với giá hiện tại vượt ngưỡng này.</p>
                </div>

                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Thuế VAT mặc định (%):</label>
                  <input type="number" id="settingDefaultVat" value="10" min="0" max="10" class="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 font-bold">
                </div>

                <div class="pt-2">
                  <button onclick="saveSettings()" class="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold text-xs shadow">
                    Lưu Cấu Hình
                  </button>
                </div>
              </div>
            </div>

            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 class="font-bold text-xs text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Sao Lưu & Phục Hồi</h3>
              
              <div class="space-y-3 text-xs">
                <p class="text-slate-600 leading-relaxed">
                  Dữ liệu được lưu trữ tự động trong trình duyệt của bạn (LocalStorage). Bạn có thể xuất toàn bộ dữ liệu 69 model thành tệp JSON an toàn.
                </p>

                <div class="flex flex-col gap-2 pt-2">
                  <button onclick="exportFullDatabaseJSON()" class="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-xs shadow flex items-center justify-center gap-1.5">
                    <i data-lucide="download" class="w-4 h-4"></i> Xuất File Sao Lưu (.JSON)
                  </button>
                  <button onclick="openSystemResetConfirm()" class="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5">
                    <i data-lucide="refresh-cw" class="w-4 h-4"></i> Khôi Phục Dữ Liệu Gốc 69 Model
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  </div>

  <!-- MODAL: DETAILED PRODUCT SPECS -->
  <div id="specsModal" class="hidden fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden">
      <div class="p-4 bg-slate-900 text-white flex items-center justify-between">
        <h3 id="specsModalTitle" class="font-bold text-sm">Thông Số Kỹ Thuật Chi Tiết</h3>
        <button onclick="closeSpecsModal()" class="text-slate-400 hover:text-white font-bold text-lg">✕</button>
      </div>
      <div class="p-5 text-xs space-y-3">
        <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg leading-relaxed text-slate-700" id="specsModalContent"></div>
      </div>
      <div class="p-3 bg-slate-100 border-t border-slate-200 flex justify-end">
        <button onclick="closeSpecsModal()" class="px-4 py-1.5 bg-slate-800 text-white rounded font-bold text-xs">Đóng</button>
      </div>
    </div>
  </div>

  <!-- MODAL: A4 PRINT & PDF PREVIEW -->
  <div id="quotationPreviewModal" class="hidden fixed inset-0 bg-slate-900/70 z-50 overflow-y-auto p-4 sm:p-6 flex items-start justify-center">
    <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden my-6">
      
      <div class="p-4 bg-slate-900 text-white flex items-center justify-between no-print">
        <div class="flex items-center space-x-2">
          <i data-lucide="file-check" class="w-5 h-5 text-emerald-400"></i>
          <span class="font-bold text-sm">Mẫu Báo Giá Khổ A4 Chuẩn | Lock&King Việt Nam</span>
        </div>
        <div class="flex items-center space-x-2">
          <button onclick="window.print()" class="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-bold text-xs flex items-center space-x-1 shadow">
            <i data-lucide="printer" class="w-3.5 h-3.5"></i>
            <span>In Bản Cứng / Lưu PDF</span>
          </button>
          <button onclick="exportQuotationToExcel()" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center space-x-1 shadow">
            <i data-lucide="file-spreadsheet" class="w-3.5 h-3.5"></i>
            <span>Xuất Excel</span>
          </button>
          <button onclick="closeQuotationPreviewModal()" class="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold text-xs">✕</button>
        </div>
      </div>

      <!-- PRINTABLE A4 CONTENT -->
      <div id="printQuotationArea" class="p-8 sm:p-10 bg-white text-slate-800">
      </div>

      <div class="p-3 bg-slate-100 border-t border-slate-200 flex justify-end no-print">
        <button onclick="closeQuotationPreviewModal()" class="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold text-xs">Đóng Cửa Sổ</button>
      </div>
    </div>
  </div>

  <!-- TOAST NOTIFICATION -->
  <div id="toastNotification" class="hidden fixed bottom-5 right-5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center space-x-3 text-xs border border-slate-700">
    <span id="toastIcon"></span>
    <span id="toastMessage" class="font-medium"></span>
  </div>

  <!-- JAVASCRIPT ENGINE -->
  <script>
    /* DATABASE STORAGE KEY (v5) */
    const STORAGE_KEY = 'LOCK_KING_PMS_DATA_v5_ACCURATE_MARGINS';

    /* USER & ROLE MANAGEMENT */
    const currentUser = {
      username: 'admin',
      fullName: 'Quản Trị Viên Hãng',
      role: 'ADMIN' // ADMIN, SALES, ACCOUNTANT, VIEWER
    };

    const systemSettings = {
      priceAlertThreshold: 10,
      defaultVatRate: 10,
      roundingRule: 1000
    };

    /* INITIAL SEED DATA */
    function getInitialData() {
      const seed = ${JSON.stringify(seedData)};
      return {
        products: seed.products,
        aliases: seed.aliases,
        customers: [
          { id: 'CUST-001', code: 'DL-01', name: 'Tổng Kho Gia Dụng Online Miền Bắc', groupName: 'Đại Lý Online Cấp 1', priceType: 'nppOnlinePrice', phone: '0912 345 678', address: 'Kho Gia Lâm, Hà Nội' },
          { id: 'CUST-002', code: 'DL-02', name: 'Đại Lý Điện Máy & Gia Dụng Cường Thịnh', groupName: 'Đại Lý Offline Cấp 1', priceType: 'dealerOfflinePrice', phone: '0988 776 655', address: 'Quận Cầu Giấy, Hà Nội' },
          { id: 'CUST-003', code: 'DL-03', name: 'Showroom Gia Dụng Lock&King Thái Hà', groupName: 'Cửa Hàng Bán Lẻ', priceType: 'facebookPrice', phone: '0904 112 233', address: 'Thái Hà, Đống Đa, Hà Nội' }
        ],
        quotations: [
          {
            code: 'BG-2026-001',
            customerName: 'Đại Lý Điện Máy & Gia Dụng Cường Thịnh',
            customerPhone: '0988 776 655',
            priceType: 'dealerOfflinePrice',
            createdAt: '2026-09-05T09:00:00Z',
            validUntil: '2026-09-20',
            status: 'SENT',
            subtotal: 10000000,
            discountRate: 0,
            discountAmount: 0,
            vatRate: 10,
            vatAmount: 1000000,
            shippingFee: 0,
            totalAmount: 11000000,
            items: [
              { productCode: 'LK-30NC1', productName: 'Nồi luộc gà Lock&King size 30', brand: 'Lock&King', unit: 'Cái', unitPrice: 496800, quantity: 10, discountRate: 0, lineTotal: 4968000 },
              { productCode: 'LK-336A', productName: 'Bộ nồi 3 Lock&King ( 18,20,24 )', brand: 'Lock&King', unit: 'Bộ', unitPrice: 648000, quantity: 10, discountRate: 0, lineTotal: 6480000 }
            ]
          }
        ],
        auditLogs: [
          {
            timestamp: new Date().toLocaleString('vi-VN'),
            userName: 'Admin',
            action: 'UPDATE_CALCULATED_MARGINS',
            entityType: 'CATALOG',
            details: 'Tích hợp 3 cột: % LN NPP Online (FB/NPP Online), Giá Đại Lý Offline (NPP Offline x 120%) và % LN Đại Lý (FB/Giá Đại Lý)',
            oldVal: 'Bản 5 tầng giá',
            newVal: 'Bản nâng cao tỷ suất sinh lời & giá đại lý offline'
          }
        ]
      };
    }

    function getDB() {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        const init = getInitialData();
        saveDB(init);
        return init;
      }
      try {
        return JSON.parse(stored);
      } catch (e) {
        const init = getInitialData();
        saveDB(init);
        return init;
      }
    }

    function saveDB(db) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    }

    function recordAuditLog(action, entityType, details, oldVal = '-', newVal = '-') {
      const db = getDB();
      db.auditLogs.unshift({
        timestamp: new Date().toLocaleString('vi-VN'),
        userName: currentUser.fullName + ' (' + currentUser.role + ')',
        action,
        entityType,
        details,
        oldVal: String(oldVal),
        newVal: String(newVal)
      });
      if (db.auditLogs.length > 500) db.auditLogs.pop();
      saveDB(db);
    }

    /* FORMATTERS */
    function formatVND(val) {
      if (val === null || val === undefined || isNaN(val)) return '0 đ';
      return new Intl.NumberFormat('vi-VN').format(Math.round(val)) + ' đ';
    }

    function showToast(msg, isSuccess = true) {
      const t = document.getElementById('toastNotification');
      const icon = document.getElementById('toastIcon');
      const text = document.getElementById('toastMessage');
      icon.innerHTML = isSuccess ? '<i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400"></i>' : '<i data-lucide="alert-circle" class="w-4 h-4 text-rose-400"></i>';
      text.innerText = msg;
      t.classList.remove('hidden');
      lucide.createIcons();
      setTimeout(() => t.classList.add('hidden'), 3500);
    }

    /* ROLE PERMISSIONS */
    function switchRole(role) {
      currentUser.role = role;
      document.getElementById('currentRoleBadge').innerText = role;
      const desc = document.getElementById('roleDesc');
      if (role === 'ADMIN') desc.innerText = 'Toàn quyền sửa giá, duyệt Excel và xem giá vốn.';
      else if (role === 'SALES') desc.innerText = 'Chỉ xem giá bán & lập báo giá. Đã ẩn hoàn toàn giá vốn.';
      else if (role === 'ACCOUNTANT') desc.innerText = 'Xem giá vốn, đối chiếu biến động giá & lịch sử.';
      else desc.innerText = 'Chỉ được xem dữ liệu tra cứu. Không thể sửa xóa hay duyệt giá.';

      applyRolePermissions();
      renderProductTable();
      renderDashboard();
      showToast('Đã chuyển sang vai trò: ' + role);
    }

    function applyRolePermissions() {
      const canViewImport = (currentUser.role === 'ADMIN' || currentUser.role === 'ACCOUNTANT');
      const importCols = document.querySelectorAll('.col-import-price');
      importCols.forEach(el => {
        el.style.display = canViewImport ? '' : 'none';
      });
    }

    /* NAVIGATION */
    function navigateTab(tabId) {
      document.querySelectorAll('.tab-pane').forEach(el => el.classList.add('hidden'));
      document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.remove('bg-slate-800', 'text-white', 'border-l-4', 'border-sky-500');
        el.classList.add('text-slate-300');
      });

      const target = document.getElementById('tab-' + tabId);
      if (target) target.classList.remove('hidden');

      const btn = document.getElementById('nav-' + tabId);
      if (btn) {
        btn.classList.add('bg-slate-800', 'text-white', 'border-l-4', 'border-sky-500');
        btn.classList.remove('text-slate-300');
      }

      if (tabId === 'dashboard') renderDashboard();
      else if (tabId === 'products') renderProductTable();
      else if (tabId === 'aliases') renderAliasTable();
      else if (tabId === 'prices') renderPriceTable();
      else if (tabId === 'customers') renderCustomerTable();
      else if (tabId === 'new-quote') initNewQuoteTab();
      else if (tabId === 'quotations') renderQuotationList();
      else if (tabId === 'audit') renderAuditTable();

      lucide.createIcons();
    }

    /* GLOBAL SEARCH & CODE NORMALIZATION */
    function handleGlobalSearch(query) {
      const dropdown = document.getElementById('searchDropdown');
      const q = (query || '').trim().toUpperCase();
      if (!q) {
        dropdown.classList.add('hidden');
        return;
      }

      const db = getDB();
      const canViewImport = (currentUser.role === 'ADMIN' || currentUser.role === 'ACCOUNTANT');

      // Check aliases first
      const matchedAlias = db.aliases.find(a => a.aliasCode.toUpperCase() === q || q.includes(a.aliasCode.toUpperCase()));
      let html = '';

      if (matchedAlias) {
        const canonical = db.products.find(p => p.canonicalCode === matchedAlias.targetCode);
        html += \`
          <div class="p-3 bg-amber-50 border-b border-amber-200 text-xs">
            <div class="flex items-center space-x-2 text-amber-800 font-bold mb-1">
              <i data-lucide="alert-triangle" class="w-4 h-4 text-amber-600"></i>
              <span>Cảnh Báo Chuyển Đổi Mã Cũ: "\${matchedAlias.aliasCode}" ➔ "\${matchedAlias.targetCode}"</span>
            </div>
            <p class="text-slate-600 text-[11px] mb-2">\${matchedAlias.notes}</p>
            \${canonical ? \`
              <button onclick="selectSearchProduct('\${canonical.canonicalCode}')" class="w-full text-left p-2 bg-white rounded border border-amber-300 hover:bg-amber-100 flex items-center justify-between">
                <div>
                  <span class="font-mono font-bold text-sky-800">\${canonical.canonicalCode}</span>
                  <span class="text-slate-700 ml-2 font-medium">\${canonical.name}</span>
                </div>
                <span class="text-indigo-700 font-mono font-bold">\${formatVND(canonical.nppOnlinePrice)}</span>
              </button>
            \` : ''}
          </div>
        \`;
      }

      const matchedProducts = db.products.filter(p => 
        p.canonicalCode.toUpperCase().includes(q) || 
        p.name.toUpperCase().includes(q) ||
        (p.specs || '').toUpperCase().includes(q)
      ).slice(0, 7);

      matchedProducts.forEach(p => {
        if (!matchedAlias || p.canonicalCode !== matchedAlias.targetCode) {
          html += \`
            <div onclick="selectSearchProduct('\${p.canonicalCode}')" class="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs transition">
              <div class="flex-1 min-w-0 pr-3">
                <div class="flex items-center space-x-2">
                  <span class="font-mono font-bold text-sky-800 bg-sky-50 border border-sky-200 px-1.5 py-0.5 rounded text-[11px]">\${p.canonicalCode}</span>
                  <span class="text-[10px] font-bold px-1.5 py-0.5 rounded \${p.brand === 'Lock&King' ? 'bg-sky-100 text-sky-900' : 'bg-orange-100 text-orange-900'}">\${p.brand}</span>
                  <span class="font-semibold text-slate-800 truncate">\${p.name}</span>
                </div>
                <div class="text-[11px] text-slate-500 mt-1">
                  NPP On: \${formatVND(p.nppOnlinePrice)} | NPP Off: \${formatVND(p.nppOfflinePrice)} | ĐL Off: <strong class="text-emerald-700">\${formatVND(p.dealerOfflinePrice)}</strong>
                  \${canViewImport ? \`<span class="text-rose-600 font-bold"> | Vốn Mới: \${formatVND(p.newImportPrice)}</span>\` : ''}
                </div>
              </div>
              <div class="text-right flex-shrink-0">
                <div class="font-mono font-bold text-blue-700">FB: \${formatVND(p.facebookPrice)}</div>
                <div class="text-[10px] text-emerald-700 font-bold">LN ĐL: \${p.dealerProfitRatio}</div>
              </div>
            </div>
          \`;
        }
      });

      dropdown.innerHTML = html;
      dropdown.classList.remove('hidden');
      lucide.createIcons();
    }

    function selectSearchProduct(code) {
      document.getElementById('searchDropdown').classList.add('hidden');
      document.getElementById('globalSearchInput').value = '';
      navigateTab('products');
      document.getElementById('productFilterSearch').value = code;
      renderProductTable();
    }

    document.addEventListener('click', (e) => {
      const sb = document.getElementById('globalSearchInput');
      const dd = document.getElementById('searchDropdown');
      if (sb && dd && !sb.contains(e.target) && !dd.contains(e.target)) dd.classList.add('hidden');
    });

    /* DASHBOARD */
    function renderDashboard() {
      const db = getDB();
      const select = document.getElementById('chartProductSelect');
      select.innerHTML = db.products.map(p => \`<option value="\${p.canonicalCode}">\${p.canonicalCode} - \${p.name.substring(0, 26)}</option>\`).join('');

      if (db.products.length > 0) renderPriceChart(db.products[0].canonicalCode);

      // Top import price changes
      const sortedByDiff = [...db.products]
        .filter(p => p.importPriceDiff !== 0)
        .sort((a, b) => Math.abs(b.importPriceDiff) - Math.abs(a.importPriceDiff));

      const container = document.getElementById('topImportDiffList');
      const canViewImport = (currentUser.role === 'ADMIN' || currentUser.role === 'ACCOUNTANT');

      if (!canViewImport) {
        container.innerHTML = '<div class="p-4 text-center text-xs text-slate-400">Bạn không có quyền xem thông tin giá vốn nhập.</div>';
        return;
      }

      container.innerHTML = sortedByDiff.slice(0, 7).map(p => {
        const isInc = p.importPriceDiff > 0;
        return \`
          <div class="p-2 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between text-xs">
            <div>
              <div class="flex items-center gap-1.5">
                <span class="font-mono font-bold text-slate-800">\${p.canonicalCode}</span>
                <span class="text-[9px] px-1 rounded \${p.brand === 'Lock&King' ? 'bg-sky-100 text-sky-800' : 'bg-orange-100 text-orange-800'} font-bold">\${p.brand}</span>
              </div>
              <div class="text-[10px] text-slate-500 truncate max-w-[140px]">\${p.name}</div>
            </div>
            <div class="text-right">
              <div class="font-mono font-bold text-slate-800">\${formatVND(p.newImportPrice)}</div>
              <span class="text-[10px] font-black \${isInc ? 'text-rose-600' : 'text-emerald-600'}">
                \${isInc ? '▲ +' : '▼ '}\${formatVND(p.importPriceDiff)} (\${p.importPriceDiffPct}%)
              </span>
            </div>
          </div>
        \`;
      }).join('');
    }

    let priceTrendChartInstance = null;
    function renderPriceChart(code) {
      const db = getDB();
      const p = db.products.find(prod => prod.canonicalCode === code);
      if (!p) return;

      const ctx = document.getElementById('priceTrendChart').getContext('2d');
      if (priceTrendChartInstance) priceTrendChartInstance.destroy();

      const canViewImport = (currentUser.role === 'ADMIN' || currentUser.role === 'ACCOUNTANT');
      const labels = canViewImport 
        ? ['Giá Vốn Mới', 'Giá NPP Online', 'Giá NPP Offline', 'Giá Đại Lý Offline', 'Giá Facebook']
        : ['Giá NPP Online', 'Giá NPP Offline', 'Giá Đại Lý Offline', 'Giá Facebook'];

      const data = canViewImport
        ? [p.newImportPrice, p.nppOnlinePrice, p.nppOfflinePrice, p.dealerOfflinePrice, p.facebookPrice]
        : [p.nppOnlinePrice, p.nppOfflinePrice, p.dealerOfflinePrice, p.facebookPrice];

      const colors = canViewImport
        ? ['#e11d48', '#6366f1', '#ea580c', '#10b981', '#0284c7']
        : ['#6366f1', '#ea580c', '#10b981', '#0284c7'];

      priceTrendChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: \`Chuỗi 5 tầng giá Model: \${p.canonicalCode} (\${p.brand})\`,
            data,
            backgroundColor: colors,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: (ctx) => \` \${formatVND(ctx.raw)}\`
              }
            }
          },
          scales: {
            y: {
              ticks: { callback: (val) => new Intl.NumberFormat('vi-VN').format(val) + ' đ', font: { size: 10 } }
            }
          }
        }
      });
    }

    /* PRODUCTS TABLE */
    function renderProductTable() {
      const db = getDB();
      const q = (document.getElementById('productFilterSearch').value || '').trim().toUpperCase();
      const brand = document.getElementById('productFilterBrand').value;
      const cat = document.getElementById('productFilterCategory').value;

      let filtered = db.products.filter(p => {
        const matchQ = !q || p.canonicalCode.toUpperCase().includes(q) || p.name.toUpperCase().includes(q) || (p.specs || '').toUpperCase().includes(q);
        const matchBrand = !brand || p.brand === brand;
        const matchCat = !cat || p.categoryName.toUpperCase().includes(cat.toUpperCase());
        return matchQ && matchBrand && matchCat;
      });

      document.getElementById('productShowingCount').innerText = filtered.length;
      const tbody = document.getElementById('productTableTbody');
      const canViewImport = (currentUser.role === 'ADMIN' || currentUser.role === 'ACCOUNTANT');

      applyRolePermissions();

      tbody.innerHTML = filtered.map(p => {
        const isLK = p.brand === 'Lock&King';
        const diff = p.importPriceDiff || 0;
        let diffBadge = '<span class="text-slate-400 text-[10px] font-mono">Giữ nguyên</span>';
        if (diff > 0) {
          diffBadge = \`<span class="text-[10px] font-bold text-rose-700 bg-rose-50 px-1 rounded">▲ +\${formatVND(diff)} (+\${p.importPriceDiffPct}%)</span>\`;
        } else if (diff < 0) {
          diffBadge = \`<span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded">▼ \${formatVND(diff)} (\${p.importPriceDiffPct}%)</span>\`;
        }

        return \`
          <tr class="hover:bg-slate-50/80 transition">
            <td class="py-2.5 px-2 text-center text-slate-400 font-mono">\${p.stt || '-'}</td>
            <td class="py-2.5 px-2.5">
              <span class="font-mono font-bold text-xs \${isLK ? 'text-sky-800 bg-sky-50 border-sky-200' : 'text-orange-800 bg-orange-50 border-orange-200'} border px-1.5 py-0.5 rounded">\${p.canonicalCode}</span>
            </td>
            <td class="py-2.5 px-2">
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded-full \${isLK ? 'bg-sky-100 text-sky-900' : 'bg-orange-100 text-orange-900'}">\${p.brand}</span>
            </td>
            <td class="py-2.5 px-3 font-bold text-slate-800 max-w-xs truncate">\${escapeHtml(p.name)}</td>
            
            <!-- PROTECTED IMPORT PRICES -->
            <td class="py-2.5 px-2.5 text-right font-mono text-slate-400 col-import-price" style="display: \${canViewImport ? '' : 'none'}">
              \${formatVND(p.oldImportPrice)}
            </td>
            <td class="py-2.5 px-2.5 text-right font-mono font-bold text-rose-700 col-import-price" style="display: \${canViewImport ? '' : 'none'}">
              \${formatVND(p.newImportPrice)}
            </td>
            <td class="py-2.5 px-2 text-center col-import-price" style="display: \${canViewImport ? '' : 'none'}">
              \${diffBadge}
            </td>

            <!-- NPP ONLINE -->
            <td class="py-2.5 px-2.5 text-right font-mono font-bold text-indigo-700">\${formatVND(p.nppOnlinePrice)}</td>
            
            <!-- % LN NPP ONLINE: (GIÁ FB - NPP ONLINE) / FB -->
            <td class="py-2.5 px-2.5 text-center bg-indigo-50/40">
              <span class="text-[11px] font-mono font-bold text-indigo-900 bg-indigo-100/70 border border-indigo-200 px-2 py-0.5 rounded" title="Cách tính: (Giá FB - Giá NPP Online) / Giá FB">\${p.nppOnlineProfitRatio || '0%'}</span>
            </td>

            <!-- NPP OFFLINE -->
            <td class="py-2.5 px-2.5 text-right font-mono font-bold text-orange-700">\${formatVND(p.nppOfflinePrice)}</td>
            
            <!-- CHÊNH LỆCH GIÁ ONLINE VS OFFLINE -->
            <td class="py-2.5 px-2.5 text-center bg-amber-50/40">
              \${(() => {
                const d = p.diffOnlineOffline || (p.nppOfflinePrice - p.nppOnlinePrice) || 0;
                if (d > 0) {
                  return \`<span class="text-[10px] font-mono font-bold text-amber-900 bg-amber-100/90 border border-amber-300 px-1.5 py-0.5 rounded" title="Offline cao hơn Online \${formatVND(d)}">+\${formatVND(d)} (+\${p.diffOnlineOfflinePct})</span>\`;
                } else if (d < 0) {
                  return \`<span class="text-[10px] font-mono font-bold text-rose-800 bg-rose-100/90 border border-rose-300 px-1.5 py-0.5 rounded">-\${formatVND(Math.abs(d))} (\${p.diffOnlineOfflinePct})</span>\`;
                }
                return '<span class="text-[10px] font-mono text-slate-400">0 đ</span>';
              })()}
            </td>

            <!-- GIÁ ĐẠI LÝ OFFLINE: NPP OFFLINE X 120% -->
            <td class="py-2.5 px-2.5 text-right font-mono font-bold text-emerald-700 bg-emerald-50/40" title="Cách tính: Giá NPP Offline x 120% (thêm 20%)">
              \${formatVND(p.dealerOfflinePrice)}
            </td>

            <!-- % LN ĐẠI LÝ: (GIÁ FB - GIÁ ĐẠI LÝ) / FB -->
            <td class="py-2.5 px-2.5 text-center bg-emerald-50/40">
              <span class="text-[11px] font-mono font-bold text-emerald-900 bg-emerald-100/70 border border-emerald-200 px-2 py-0.5 rounded" title="Cách tính: (Giá FB - Giá Đại Lý Offline) / Giá FB">\${p.dealerProfitRatio || '0%'}</span>
            </td>

            <!-- FACEBOOK PRICE -->
            <td class="py-2.5 px-2.5 text-right font-mono font-bold text-blue-700">\${formatVND(p.facebookPrice)}</td>

            <!-- SPECS BUTTON -->
            <td class="py-2.5 px-2 text-center">
              <button onclick="viewProductSpecs('\${p.canonicalCode}')" class="p-1 text-slate-500 hover:text-sky-600 rounded" title="Xem thông số kỹ thuật chi tiết">
                <i data-lucide="info" class="w-4 h-4"></i>
              </button>
            </td>

            <!-- QUICK QUOTE BUTTON -->
            <td class="py-2.5 px-2 text-center">
              <button onclick="quickQuoteProduct('\${p.canonicalCode}')" class="px-2 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded text-[11px] font-bold">
                Báo Giá
              </button>
            </td>
          </tr>
        \`;
      }).join('');

      lucide.createIcons();
    }

    function viewProductSpecs(code) {
      const db = getDB();
      const p = db.products.find(prod => prod.canonicalCode === code);
      if (!p) return;

      document.getElementById('specsModalTitle').innerText = \`Thông Số Kỹ Thuật: \${p.canonicalCode} - \${p.name}\`;
      document.getElementById('specsModalContent').innerHTML = \`
        <div class="space-y-3">
          <div class="flex items-center justify-between border-b pb-2">
            <span class="font-bold text-slate-900 text-sm">\${p.name}</span>
            <span class="text-xs px-2 py-0.5 font-bold rounded \${p.brand === 'Lock&King' ? 'bg-sky-100 text-sky-800' : 'bg-orange-100 text-orange-800'}">\${p.brand}</span>
          </div>
          <div class="text-slate-700 whitespace-pre-line leading-relaxed">\${escapeHtml(p.specs || 'Đang cập nhật thông số chi tiết từ nhà máy')}</div>
          <div class="bg-slate-100 p-2.5 rounded-lg grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-600">
            <div>Giá NPP Online: <strong class="text-indigo-700">\${formatVND(p.nppOnlinePrice)}</strong> (\${p.nppOnlineProfitRatio})</div>
            <div>Giá Đại Lý Offline: <strong class="text-emerald-700">\${formatVND(p.dealerOfflinePrice)}</strong> (\${p.dealerProfitRatio})</div>
            <div>Giá NPP Offline: <strong class="text-orange-700">\${formatVND(p.nppOfflinePrice)}</strong></div>
            <div>Giá Facebook: <strong class="text-blue-700">\${formatVND(p.facebookPrice)}</strong></div>
          </div>
        </div>
      \`;
      document.getElementById('specsModal').classList.remove('hidden');
    }

    function closeSpecsModal() {
      document.getElementById('specsModal').classList.add('hidden');
    }

    function quickQuoteProduct(code) {
      navigateTab('new-quote');
      const select = document.getElementById('addProductToQuoteSelect');
      const db = getDB();
      const p = db.products.find(prod => prod.canonicalCode === code);
      if (p) {
        select.value = p.canonicalCode;
        addProductToQuotation();
        showToast('Đã thêm ' + code + ' vào báo giá!');
      }
    }

    /* ALIASES */
    function renderAliasTable() {
      const db = getDB();
      const tbody = document.getElementById('aliasTableTbody');
      tbody.innerHTML = db.aliases.map(al => {
        const target = db.products.find(p => p.canonicalCode === al.targetCode);
        return \`
          <tr class="hover:bg-slate-50">
            <td class="py-3 px-4 font-mono font-bold text-xs bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded">\${al.aliasCode}</td>
            <td class="py-3 px-4 text-center font-bold text-slate-400">➔</td>
            <td class="py-3 px-4 font-mono font-bold text-xs bg-sky-50 text-sky-900 border border-sky-200 px-2 py-0.5 rounded">\${al.targetCode}</td>
            <td class="py-3 px-4 font-bold text-slate-800">\${target ? target.name : 'Model đích'}</td>
            <td class="py-3 px-4 font-bold text-slate-600">\${target ? target.brand : '-'}</td>
            <td class="py-3 px-4 text-slate-500">\${escapeHtml(al.notes)}</td>
            <td class="py-3 px-4 text-center">
              <span class="text-emerald-700 font-bold text-[10px]">Đang Áp Dụng</span>
            </td>
          </tr>
        \`;
      }).join('');
    }

    /* PRICE TABLE */
    function renderPriceTable() {
      const db = getDB();
      const key = document.getElementById('priceTypeSelector').value;
      const q = (document.getElementById('priceSearchInput').value || '').trim().toUpperCase();
      const tbody = document.getElementById('priceTableTbody');

      let filtered = db.products.filter(p => !q || p.canonicalCode.toUpperCase().includes(q) || p.name.toUpperCase().includes(q));

      tbody.innerHTML = filtered.map((p, idx) => {
        const curVal = p[key];
        const isRatio = typeof curVal === 'string' && curVal.includes('%');
        const displayVal = isRatio ? curVal : formatVND(curVal || 0);

        return \`
          <tr class="hover:bg-slate-50">
            <td class="py-3 px-3 text-slate-400 text-center">\${idx + 1}</td>
            <td class="py-3 px-3 font-mono font-bold text-sky-800">\${p.canonicalCode}</td>
            <td class="py-3 px-3 font-bold text-slate-800">\${escapeHtml(p.name)}</td>
            <td class="py-3 px-3 font-semibold text-slate-600">\${p.brand}</td>
            <td class="py-3 px-3 text-right font-mono font-bold text-sky-700 text-sm">\${displayVal}</td>
            <td class="py-3 px-3 text-center"><span class="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Hiệu Lực</span></td>
            <td class="py-3 px-3 font-mono text-slate-500 text-[11px]">\${p.updatedAt ? p.updatedAt.substring(0, 10) : '2026-09-05'}</td>
            <td class="py-3 px-3 text-center">
              <button onclick="viewProductSpecs('\${p.canonicalCode}')" class="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold">
                Thông Số
              </button>
            </td>
          </tr>
        \`;
      }).join('');
    }

    /* EXCEL IMPORT */
    function handleExcelUpload(e) {
      const file = e.target.files[0];
      if (!file) return;

      document.getElementById('importFileName').innerText = file.name;
      const reader = new FileReader();

      reader.onload = function(evt) {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        processStagingData(json);
      };

      reader.readAsArrayBuffer(file);
    }

    let stagingRecords = [];

    function processStagingData(rows) {
      if (!rows || rows.length < 2) {
        alert("File không có đủ dòng dữ liệu!");
        return;
      }

      const headers = rows[0].map(h => String(h || '').trim().toUpperCase());
      let colModel = headers.findIndex(h => h.includes('MODEL') || h.includes('MÃ'));
      let colPrice = headers.findIndex(h => h.includes('MỚI') || h.includes('GIÁ') || h.includes('PRICE'));
      let colName = headers.findIndex(h => h.includes('TÊN') || h.includes('NAME'));

      if (colModel === -1) colModel = 1;
      if (colPrice === -1) colPrice = headers.length - 1;

      const db = getDB();
      stagingRecords = [];
      let validCount = 0;
      let warnCount = 0;
      let errCount = 0;
      let mappedCount = 0;

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length === 0) continue;

        const rawCode = String(row[colModel] || '').trim();
        if (!rawCode) continue;

        let cleanCode = rawCode.toUpperCase().replace(/\\s+/g, '');
        let newPrice = parseFloat(String(row[colPrice] || '').replace(/[^\\d.]/g, '')) || 0;
        let pName = colName !== -1 && row[colName] ? String(row[colName]).trim() : '';

        // Check alias mapping
        let canonicalCode = cleanCode;
        let aliasNotes = '';
        const alias = db.aliases.find(a => a.aliasCode.toUpperCase() === cleanCode);
        if (alias) {
          canonicalCode = alias.targetCode;
          aliasNotes = 'Chuyển đổi từ mã: ' + alias.aliasCode;
          mappedCount++;
        }

        const existing = db.products.find(p => p.canonicalCode.toUpperCase() === canonicalCode);

        let status = 'VALID';
        let issues = [];

        if (!existing) {
          status = 'ERROR';
          issues.push('Mã sản phẩm chưa có trong danh mục 69 model');
          errCount++;
        } else {
          if (!pName) pName = existing.name;
          const oldP = existing.nppOnlinePrice || 0;

          if (newPrice <= 0) {
            status = 'ERROR';
            issues.push('Mức giá <= 0 VNĐ');
            errCount++;
          } else {
            const drift = oldP > 0 ? Math.abs((newPrice - oldP) / oldP) * 100 : 0;
            if (drift > systemSettings.priceAlertThreshold) {
              status = 'WARNING';
              issues.push('Lệch giá bất thường ' + drift.toFixed(1) + '% (ngưỡng ' + systemSettings.priceAlertThreshold + '%)');
              warnCount++;
            } else {
              validCount++;
            }
          }
        }

        stagingRecords.push({
          rowIdx: i + 1,
          rawCode,
          canonicalCode,
          name: pName,
          oldPrice: existing ? existing.nppOnlinePrice : 0,
          newPrice,
          driftPct: existing && existing.nppOnlinePrice > 0 ? (((newPrice - existing.nppOnlinePrice) / existing.nppOnlinePrice) * 100).toFixed(1) : '0',
          status,
          issues: issues.join('; '),
          aliasNotes
        });
      }

      document.getElementById('importStatTotal').innerText = stagingRecords.length;
      document.getElementById('importStatValid').innerText = validCount;
      document.getElementById('importStatWarnings').innerText = warnCount;
      document.getElementById('importStatErrors').innerText = errCount;
      document.getElementById('importStatMapped').innerText = mappedCount;

      const btnCommit = document.getElementById('btnCommitImport');
      if (errCount > 0) {
        btnCommit.disabled = true;
        btnCommit.classList.add('opacity-50', 'cursor-not-allowed');
      } else {
        btnCommit.disabled = false;
        btnCommit.classList.remove('opacity-50', 'cursor-not-allowed');
      }

      const tbody = document.getElementById('stagingTableTbody');
      tbody.innerHTML = stagingRecords.map(r => \`
        <tr class="hover:bg-slate-50">
          <td class="py-2.5 px-3 text-slate-400 font-mono">\${r.rowIdx}</td>
          <td class="py-2.5 px-3 font-mono font-bold text-slate-700">\${r.rawCode}</td>
          <td class="py-2.5 px-3 font-mono font-bold text-sky-800">\${r.canonicalCode} \${r.aliasNotes ? '<span class="text-[10px] text-amber-600 font-normal">(' + r.aliasNotes + ')</span>' : ''}</td>
          <td class="py-2.5 px-3 font-medium text-slate-800 truncate max-w-xs">\${escapeHtml(r.name)}</td>
          <td class="py-2.5 px-3 text-right font-mono text-slate-400">\${formatVND(r.oldPrice)}</td>
          <td class="py-2.5 px-3 text-right font-mono font-bold text-sky-700">\${formatVND(r.newPrice)}</td>
          <td class="py-2.5 px-3 text-center font-mono font-bold \${parseFloat(r.driftPct) > 0 ? 'text-rose-600' : 'text-emerald-600'}">\${r.driftPct}%</td>
          <td class="py-2.5 px-3 text-center">
            \${r.status === 'VALID' ? '<span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Hợp Lệ</span>' : 
              r.status === 'WARNING' ? '<span class="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">Cảnh Báo</span>' : 
              '<span class="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">Lỗi Chặn</span>'}
          </td>
          <td class="py-2.5 px-3 text-slate-600 text-[11px]">\${r.issues || 'Đạt tiêu chuẩn'}</td>
        </tr>
      \`).join('');

      document.getElementById('importStagingArea').classList.remove('hidden');
    }

    function cancelImport() {
      document.getElementById('importStagingArea').classList.add('hidden');
      document.getElementById('excelFileInput').value = '';
    }

    function commitImportData() {
      const db = getDB();
      let updatedCount = 0;

      stagingRecords.forEach(r => {
        if (r.status !== 'ERROR') {
          const p = db.products.find(prod => prod.canonicalCode.toUpperCase() === r.canonicalCode.toUpperCase());
          if (p) {
            p.nppOnlinePrice = r.newPrice;
            p.nppOnlineProfitRatio = p.facebookPrice > 0 ? (((p.facebookPrice - p.nppOnlinePrice) / p.facebookPrice) * 100).toFixed(1) + '%' : '0%';
            p.updatedAt = new Date().toISOString();
            updatedCount++;
          }
        }
      });

      saveDB(db);
      recordAuditLog('IMPORT_EXCEL', 'CATALOG', \`Phê duyệt cập nhật \${updatedCount} mức giá sản phẩm từ file Excel\`);
      showToast(\`Đã phê duyệt và cập nhật thành công \${updatedCount} sản phẩm!\`);
      cancelImport();
      navigateTab('products');
    }

    /* CUSTOMERS */
    function renderCustomerTable() {
      const db = getDB();
      const tbody = document.getElementById('customerTableTbody');
      tbody.innerHTML = db.customers.map(c => \`
        <tr class="hover:bg-slate-50">
          <td class="py-3 px-3 font-mono font-bold text-sky-800">\${c.code}</td>
          <td class="py-3 px-3 font-bold text-slate-800">\${escapeHtml(c.name)}</td>
          <td class="py-3 px-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">\${c.groupName}</span></td>
          <td class="py-3 px-3 font-semibold text-sky-700">\${c.priceType === 'dealerOfflinePrice' ? 'Giá Đại Lý Offline (NPP Offline x 120%)' : (c.priceType === 'nppOfflinePrice' ? 'Giá NPP Offline' : (c.priceType === 'nppOnlinePrice' ? 'Giá NPP Online' : 'Giá Bán Lẻ'))}</td>
          <td class="py-3 px-3 text-slate-600">\${c.phone}</td>
          <td class="py-3 px-3 text-slate-500">\${escapeHtml(c.address)}</td>
          <td class="py-3 px-3 text-center">
            <button onclick="quickQuoteCustomer('\${c.id}')" class="px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded text-xs font-bold">
              Lập Báo Giá
            </button>
          </td>
        </tr>
      \`).join('');
    }

    function quickQuoteCustomer(custId) {
      navigateTab('new-quote');
      document.getElementById('quoteCustomerSelect').value = custId;
      handleQuotationCustomerChange(custId);
    }

    /* QUOTATIONS ENGINE */
    let quotationDraft = {
      items: [],
      subtotal: 0,
      discountRate: 0,
      discountAmount: 0,
      vatRate: 10,
      vatAmount: 0,
      shippingFee: 0,
      totalAmount: 0
    };

    function initNewQuoteTab() {
      const db = getDB();
      
      // Customer select
      const custSelect = document.getElementById('quoteCustomerSelect');
      custSelect.innerHTML = '<option value="">-- Chọn khách hàng / đại lý --</option>' + 
        db.customers.map(c => \`<option value="\${c.id}">\${c.name} (\${c.groupName})</option>\`).join('');

      // Product select
      const prodSelect = document.getElementById('addProductToQuoteSelect');
      prodSelect.innerHTML = db.products.map(p => 
        \`<option value="\${p.canonicalCode}">[\${p.canonicalCode}] \${p.name} - \${p.brand} (ĐL Off: \${formatVND(p.dealerOfflinePrice)})</option>\`
      ).join('');

      // Code generator
      const nextNum = (db.quotations.length + 1).toString().padStart(3, '0');
      document.getElementById('quoteCodeInput').value = \`BG-2026-\${nextNum}\`;

      // Date
      const d = new Date();
      d.setDate(d.getDate() + 15);
      document.getElementById('quoteValidUntil').value = d.toISOString().substring(0, 10);

      recalcQuotation();
      renderQuotationItemsTable();
    }

    function handleQuotationCustomerChange(custId) {
      const db = getDB();
      const c = db.customers.find(cust => cust.id === custId);
      if (!c) return;

      document.getElementById('quoteCustomerName').value = c.name;
      document.getElementById('quoteCustomerPhone').value = c.phone;
      document.getElementById('quotePriceTypeSelect').value = c.priceType || 'dealerOfflinePrice';

      recalcQuotation();
    }

    function addProductToQuotation() {
      const code = document.getElementById('addProductToQuoteSelect').value;
      const qty = parseInt(document.getElementById('addProductQty').value) || 1;
      const discount = parseFloat(document.getElementById('addProductDiscount').value) || 0;
      const priceType = document.getElementById('quotePriceTypeSelect').value;

      const db = getDB();
      const prod = db.products.find(p => p.canonicalCode === code);
      if (!prod) return;

      const unitPrice = prod[priceType] || prod.dealerOfflinePrice || prod.nppOnlinePrice || 0;

      const existingIdx = quotationDraft.items.findIndex(it => it.productCode === code);
      if (existingIdx >= 0) {
        quotationDraft.items[existingIdx].quantity += qty;
        quotationDraft.items[existingIdx].discountRate = discount;
        quotationDraft.items[existingIdx].lineTotal = quotationDraft.items[existingIdx].quantity * unitPrice * (1 - (discount / 100));
      } else {
        quotationDraft.items.push({
          productCode: prod.canonicalCode,
          productName: prod.name,
          brand: prod.brand,
          unit: prod.unit || 'Cái',
          unitPrice: unitPrice,
          quantity: qty,
          discountRate: discount,
          lineTotal: qty * unitPrice * (1 - (discount / 100))
        });
      }

      document.getElementById('addProductQty').value = 1;
      recalcQuotation();
      renderQuotationItemsTable();
    }

    function removeQuotationItem(idx) {
      quotationDraft.items.splice(idx, 1);
      recalcQuotation();
      renderQuotationItemsTable();
    }

    function updateItemQuantity(idx, val) {
      const q = parseInt(val) || 1;
      quotationDraft.items[idx].quantity = q;
      quotationDraft.items[idx].lineTotal = q * quotationDraft.items[idx].unitPrice * (1 - (quotationDraft.items[idx].discountRate / 100));
      recalcQuotation();
      renderQuotationItemsTable();
    }

    function updateItemDiscount(idx, val) {
      const d = parseFloat(val) || 0;
      quotationDraft.items[idx].discountRate = d;
      quotationDraft.items[idx].lineTotal = quotationDraft.items[idx].quantity * quotationDraft.items[idx].unitPrice * (1 - (d / 100));
      recalcQuotation();
      renderQuotationItemsTable();
    }

    function recalcQuotation() {
      const priceType = document.getElementById('quotePriceTypeSelect').value;
      const db = getDB();

      let subtotal = 0;
      quotationDraft.items.forEach(item => {
        const prod = db.products.find(p => p.canonicalCode === item.productCode);
        if (prod) {
          item.unitPrice = prod[priceType] || prod.dealerOfflinePrice || item.unitPrice;
        }
        item.lineTotal = item.quantity * item.unitPrice * (1 - (item.discountRate / 100));
        subtotal += item.lineTotal;
      });

      const overallDiscountRate = parseFloat(document.getElementById('quoteDiscountRate').value) || 0;
      const discountAmount = subtotal * (overallDiscountRate / 100);
      const afterDiscount = subtotal - discountAmount;

      const vatRate = parseFloat(document.getElementById('quoteVatRate').value) || 0;
      const vatAmount = afterDiscount * (vatRate / 100);

      const shippingFee = parseFloat(document.getElementById('quoteShippingFee').value) || 0;
      let total = afterDiscount + vatAmount + shippingFee;

      if (systemSettings.roundingRule > 1) {
        total = Math.round(total / systemSettings.roundingRule) * systemSettings.roundingRule;
      }

      document.getElementById('quoteCalcSubtotal').innerText = formatVND(subtotal);
      document.getElementById('quoteCalcDiscount').innerText = '-' + formatVND(discountAmount);
      document.getElementById('quoteCalcVat').innerText = '+' + formatVND(vatAmount);
      document.getElementById('quoteCalcTotal').innerText = formatVND(total);

      quotationDraft.subtotal = subtotal;
      quotationDraft.discountRate = overallDiscountRate;
      quotationDraft.discountAmount = discountAmount;
      quotationDraft.vatRate = vatRate;
      quotationDraft.vatAmount = vatAmount;
      quotationDraft.shippingFee = shippingFee;
      quotationDraft.totalAmount = total;
    }

    function renderQuotationItemsTable() {
      const tbody = document.getElementById('quoteItemsTbody');
      const empty = document.getElementById('emptyQuoteItemsNotice');

      if (quotationDraft.items.length === 0) {
        tbody.innerHTML = '';
        empty.classList.remove('hidden');
        return;
      }

      empty.classList.add('hidden');
      tbody.innerHTML = quotationDraft.items.map((item, idx) => \`
        <tr class="hover:bg-slate-50">
          <td class="py-2.5 px-3 font-mono font-bold text-sky-800">\${item.productCode}</td>
          <td class="py-2.5 px-3 font-bold text-slate-600">\${item.brand}</td>
          <td class="py-2.5 px-3 font-bold text-slate-800">\${escapeHtml(item.productName)}</td>
          <td class="py-2.5 px-3 text-center text-slate-500">\${item.unit}</td>
          <td class="py-2.5 px-3 text-right font-mono font-semibold text-slate-700">\${formatVND(item.unitPrice)}</td>
          <td class="py-2.5 px-3 text-center">
            <input type="number" min="1" value="\${item.quantity}" onchange="updateItemQuantity(\${idx}, this.value)" class="w-16 text-center border border-slate-200 rounded py-1 font-bold">
          </td>
          <td class="py-2.5 px-3 text-center">
            <input type="number" min="0" max="100" value="\${item.discountRate}" onchange="updateItemDiscount(\${idx}, this.value)" class="w-12 text-center border border-slate-200 rounded py-1 font-bold text-rose-600">
          </td>
          <td class="py-2.5 px-3 text-right font-mono font-bold text-sky-700">\${formatVND(item.lineTotal)}</td>
          <td class="py-2.5 px-3 text-center">
            <button onclick="removeQuotationItem(\${idx})" class="text-rose-500 hover:text-rose-700 p-1 font-bold">✕</button>
          </td>
        </tr>
      \`).join('');
    }

    function saveAndPreviewQuotation() {
      if (quotationDraft.items.length === 0) {
        alert("Hãy thêm ít nhất 1 sản phẩm vào báo giá!");
        return;
      }

      const db = getDB();
      const code = document.getElementById('quoteCodeInput').value;
      const custName = document.getElementById('quoteCustomerName').value || 'Khách Hàng';
      const custPhone = document.getElementById('quoteCustomerPhone').value || '';
      const validUntil = document.getElementById('quoteValidUntil').value || '';

      const newQuote = {
        code,
        customerName: custName,
        customerPhone: custPhone,
        priceType: document.getElementById('quotePriceTypeSelect').value,
        createdAt: new Date().toISOString(),
        validUntil,
        status: 'OFFICIAL',
        subtotal: quotationDraft.subtotal,
        discountRate: quotationDraft.discountRate,
        discountAmount: quotationDraft.discountAmount,
        vatRate: quotationDraft.vatRate,
        vatAmount: quotationDraft.vatAmount,
        shippingFee: quotationDraft.shippingFee,
        totalAmount: quotationDraft.totalAmount,
        items: JSON.parse(JSON.stringify(quotationDraft.items))
      };

      db.quotations.unshift(newQuote);
      saveDB(db);

      recordAuditLog('CREATE_QUOTATION', 'QUOTATION', \`Lập báo giá \${code} cho \${custName} (\${formatVND(newQuote.totalAmount)})\`);
      openQuotationA4Preview(newQuote);
    }

    function openQuotationA4Preview(quote) {
      const area = document.getElementById('printQuotationArea');
      const itemsHtml = quote.items.map((it, idx) => \`
        <tr class="border-b border-slate-200 text-xs">
          <td class="py-2.5 px-3 text-center font-bold text-slate-500">\${idx + 1}</td>
          <td class="py-2.5 px-3 font-mono font-bold text-sky-900">\${it.productCode}</td>
          <td class="py-2.5 px-3 font-semibold text-slate-800">\${escapeHtml(it.productName)}</td>
          <td class="py-2.5 px-3 text-center text-slate-600">\${it.unit}</td>
          <td class="py-2.5 px-3 text-center font-bold text-slate-800">\${it.quantity}</td>
          <td class="py-2.5 px-3 text-right font-mono text-slate-700">\${formatVND(it.unitPrice)}</td>
          <td class="py-2.5 px-3 text-center font-semibold text-rose-600">\${it.discountRate > 0 ? it.discountRate + '%' : '-'}</td>
          <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-900">\${formatVND(it.lineTotal)}</td>
        </tr>
      \`).join('');

      let priceTypeName = 'GIÁ ĐẠI LÝ OFFLINE (NPP OFFLINE X 120%)';
      if (quote.priceType === 'nppOfflinePrice') priceTypeName = 'GIÁ NPP OFFLINE';
      else if (quote.priceType === 'nppOnlinePrice') priceTypeName = 'GIÁ NPP ONLINE';
      else if (quote.priceType === 'facebookPrice') priceTypeName = 'GIÁ BÁN LẺ FACEBOOK';

      area.innerHTML = \`
        <div class="flex justify-between items-start border-b-2 border-sky-800 pb-4 mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-sky-800 text-white rounded-xl flex items-center justify-center font-black text-xl shadow">
              LK
            </div>
            <div>
              <h1 class="text-base font-black text-sky-900 uppercase">CÔNG TY TNHH LOCK&KING VIỆT NAM</h1>
              <p class="text-[11px] text-slate-500">Thương hiệu phân phối độc quyền thiết bị gia dụng cao cấp Lock&King & Takin</p>
              <p class="text-[10px] text-slate-400">Hotline: 1900 8888 | Website: lockking.vn | MST: 0109988776</p>
            </div>
          </div>
          <div class="text-right text-xs">
            <span class="inline-block px-2.5 py-1 bg-sky-100 text-sky-900 font-mono font-bold rounded border border-sky-300">
              Số: \${quote.code}
            </span>
            <p class="text-slate-500 mt-1">Ngày lập: \${quote.createdAt.substring(0, 10)}</p>
            <p class="text-slate-500 font-semibold">Hiệu lực đến: \${quote.validUntil || '15 ngày'}</p>
          </div>
        </div>

        <div class="text-center my-4">
          <h2 class="text-xl font-black text-slate-900 tracking-wide uppercase">BẢNG BÁO GIÁ SẢN PHẨM CHÍNH HÃNG</h2>
          <p class="text-xs text-slate-500 italic mt-0.5">(Kính gửi Quý Khách Hàng / Quý Đại Lý Phân Phối)</p>
        </div>

        <div class="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4 text-xs grid grid-cols-2 gap-3">
          <div>
            <p class="text-slate-500">Đơn vị nhận báo giá: <strong class="text-slate-900 font-bold">\${escapeHtml(quote.customerName)}</strong></p>
            <p class="text-slate-500 mt-0.5">Số điện thoại liên hệ: <strong class="text-slate-800">\${quote.customerPhone || 'Theo hợp đồng'}</strong></p>
          </div>
          <div class="text-right">
            <p class="text-slate-500">Chính sách áp dụng: <span class="font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">\${priceTypeName}</span></p>
            <p class="text-slate-500 mt-0.5">Người lập báo giá: <span class="font-semibold text-slate-700">Nguyễn Văn Quản Lý (Lock&King)</span></p>
          </div>
        </div>

        <table class="w-full text-xs text-left border border-slate-200 mb-4">
          <thead class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
            <tr>
              <th class="py-2 px-3 text-center">STT</th>
              <th class="py-2 px-3">Mã Model</th>
              <th class="py-2 px-3">Tên Hàng Hóa Quy Cách</th>
              <th class="py-2 px-3 text-center">ĐVT</th>
              <th class="py-2 px-3 text-center">Số Lượng</th>
              <th class="py-2 px-3 text-right">Đơn Giá</th>
              <th class="py-2 px-3 text-center">CK</th>
              <th class="py-2 px-3 text-right">Thành Tiền</th>
            </tr>
          </thead>
          <tbody>
            \${itemsHtml}
          </tbody>
        </table>

        <!-- TOTAL BREAKDOWN -->
        <div class="flex justify-end mb-6">
          <div class="w-72 text-xs space-y-1.5 border border-slate-200 rounded-lg p-3 bg-slate-50/50">
            <div class="flex justify-between text-slate-600">
              <span>Cộng tiền hàng:</span>
              <span class="font-mono font-bold text-slate-800">\${formatVND(quote.subtotal)}</span>
            </div>
            \${quote.discountAmount > 0 ? \`
              <div class="flex justify-between text-rose-600">
                <span>Chiết khấu đơn (\${quote.discountRate}%):</span>
                <span class="font-mono font-bold">-\${formatVND(quote.discountAmount)}</span>
              </div>
            \` : ''}
            <div class="flex justify-between text-slate-600">
              <span>Thuế VAT (\${quote.vatRate}%):</span>
              <span class="font-mono font-bold text-slate-800">+\${formatVND(quote.vatAmount)}</span>
            </div>
            \${quote.shippingFee > 0 ? \`
              <div class="flex justify-between text-slate-600">
                <span>Phí vận chuyển:</span>
                <span class="font-mono font-bold text-slate-800">+\${formatVND(quote.shippingFee)}</span>
              </div>
            \` : ''}
            <div class="border-t-2 border-slate-800 pt-2 flex justify-between items-baseline">
              <span class="font-black text-slate-900 text-sm">TỔNG THANH TOÁN:</span>
              <span class="font-mono font-black text-sky-900 text-base">\${formatVND(quote.totalAmount)}</span>
            </div>
          </div>
        </div>

        <!-- TERMS & CONDITIONS -->
        <div class="border-t border-slate-200 pt-3 text-[11px] text-slate-600 space-y-1">
          <p class="font-bold text-slate-800">ĐIỀU KHOẢN THƯƠNG MẠI CHUNG:</p>
          <p>1. <strong>Bảo hành & Xuất xứ:</strong> Hàng mới 100% chính hãng Lock&King và Takin. Bảo hành chính hãng 12 tháng kể từ ngày giao nhận hàng.</p>
          <p>2. <strong>Thanh toán:</strong> Thanh toán 100% bằng chuyển khoản trước khi giao hàng hoặc theo thỏa thuận hợp đồng nguyên tắc.</p>
          <p>3. <strong>Thời gian giao hàng:</strong> Trong vòng 24 - 48 giờ kể từ khi xác nhận đơn hàng tại khu vực Hà Nội & TP.HCM.</p>
        </div>

        <!-- SIGNATURES -->
        <div class="grid grid-cols-3 gap-4 text-center text-xs mt-8 pt-4">
          <div>
            <p class="font-bold text-slate-800">NGƯỜI LẬP BÁO GIÁ</p>
            <p class="text-[10px] text-slate-400 italic">(Ký, ghi rõ họ tên)</p>
            <div class="h-16"></div>
            <p class="font-semibold text-slate-700">Nguyễn Văn Quản Lý</p>
          </div>
          <div>
            <p class="font-bold text-slate-800">KẾ TOÁN TRƯỞNG</p>
            <p class="text-[10px] text-slate-400 italic">(Ký, ghi rõ họ tên)</p>
            <div class="h-16"></div>
            <p class="font-semibold text-slate-700">Trần Thị Kiểm Soát</p>
          </div>
          <div>
            <p class="font-bold text-slate-800">GIÁM ĐỐC DUYỆT</p>
            <p class="text-[10px] text-slate-400 italic">(Ký tên & đóng dấu)</p>
            <div class="h-16"></div>
            <p class="font-semibold text-sky-900">Lock&King Việt Nam</p>
          </div>
        </div>
      \`;

      document.getElementById('quotationPreviewModal').classList.remove('hidden');
      lucide.createIcons();
    }

    function closeQuotationPreviewModal() {
      document.getElementById('quotationPreviewModal').classList.add('hidden');
    }

    function exportQuotationToExcel() {
      const area = document.getElementById('printQuotationArea');
      const table = area.querySelector('table');
      if (!table) return;

      const wb = XLSX.utils.table_to_book(table, { sheet: "BaoGiaLockKing" });
      XLSX.writeFile(wb, \`Bao_Gia_\${new Date().toISOString().substring(0,10)}.xlsx\`);
      showToast('Đã xuất file Excel báo giá thành công!');
    }

    /* QUOTATION LIST */
    function renderQuotationList() {
      const db = getDB();
      const tbody = document.getElementById('quotationListTbody');
      document.getElementById('badgeQuoteCount').innerText = db.quotations.length;

      tbody.innerHTML = db.quotations.map(q => \`
        <tr class="hover:bg-slate-50">
          <td class="py-3 px-3 font-mono font-bold text-sky-800">\${q.code}</td>
          <td class="py-3 px-3 font-bold text-slate-800">\${escapeHtml(q.customerName)}</td>
          <td class="py-3 px-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">\${q.priceType === 'dealerOfflinePrice' ? 'Giá ĐL Offline (x120%)' : (q.priceType === 'nppOfflinePrice' ? 'Giá NPP Offline' : 'Giá NPP Online')}</span></td>
          <td class="py-3 px-3 text-right font-mono font-bold text-slate-900">\${formatVND(q.totalAmount)}</td>
          <td class="py-3 px-3 font-mono text-slate-500 text-[11px]">\${q.createdAt.substring(0, 10)}</td>
          <td class="py-3 px-3 text-center"><span class="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Đã Duyệt</span></td>
          <td class="py-3 px-3 text-center">
            <button onclick="viewSavedQuotation('\${q.code}')" class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold text-xs">
              Xem & In A4
            </button>
          </td>
        </tr>
      \`).join('');
    }

    function viewSavedQuotation(code) {
      const db = getDB();
      const q = db.quotations.find(item => item.code === code);
      if (q) openQuotationA4Preview(q);
    }

    /* AUDIT LOG */
    function renderAuditTable() {
      const db = getDB();
      const tbody = document.getElementById('auditTableTbody');
      tbody.innerHTML = db.auditLogs.map(a => \`
        <tr class="hover:bg-slate-50">
          <td class="py-2.5 px-3 text-slate-400 font-mono text-[11px]">\${a.timestamp}</td>
          <td class="py-2.5 px-3 font-semibold text-slate-700">\${escapeHtml(a.userName)}</td>
          <td class="py-2.5 px-3"><span class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">\${a.action}</span></td>
          <td class="py-2.5 px-3 text-slate-600 font-medium">\${a.entityType}</td>
          <td class="py-2.5 px-3 font-mono text-[11px] text-slate-400 truncate max-w-xs">\${escapeHtml(a.oldVal)}</td>
          <td class="py-2.5 px-3 font-mono text-[11px] text-sky-800 font-bold truncate max-w-xs">\${escapeHtml(a.newVal)}</td>
          <td class="py-2.5 px-3 text-slate-700 text-xs">\${escapeHtml(a.details)}</td>
        </tr>
      \`).join('');
    }

    function saveSettings() {
      systemSettings.priceAlertThreshold = parseFloat(document.getElementById('settingPriceThreshold').value) || 10;
      systemSettings.defaultVatRate = parseFloat(document.getElementById('settingDefaultVat').value) || 10;
      showToast('Đã lưu cấu hình tham số hệ thống!');
    }

    function exportFullDatabaseJSON() {
      const db = getDB();
      const str = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
      const a = document.createElement('a');
      a.setAttribute("href", str);
      a.setAttribute("download", \`lockking_takin_backup_\${new Date().toISOString().substring(0,10)}.json\`);
      document.body.appendChild(a);
      a.click();
      a.remove();
      showToast('Đã xuất file sao lưu JSON an toàn!');
    }

    function openSystemResetConfirm() {
      if (confirm("Khôi phục toàn bộ danh mục 69 sản phẩm gốc kèm 5 tầng giá và tỷ suất lợi nhuận?")) {
        const init = getInitialData();
        saveDB(init);
        showToast("Đã khôi phục dữ liệu gốc!");
        navigateTab('dashboard');
      }
    }

    function escapeHtml(text) {
      if (!text) return '';
      const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
      return String(text).replace(/[&<>"']/g, m => map[m]);
    }

    window.addEventListener('DOMContentLoaded', () => {
      getDB();
      switchRole('ADMIN');
      navigateTab('dashboard');
      window.addEventListener('keydown', (e) => {
        if ((e.key === '/' || e.key === 'F2') && document.activeElement.tagName !== 'INPUT') {
          e.preventDefault();
          document.getElementById('globalSearchInput').focus();
        }
      });
    });
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf-8');
console.log('index.html v5 compiled successfully!');
