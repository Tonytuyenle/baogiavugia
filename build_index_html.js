const fs = require('fs');
const path = require('path');

const seed = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed_data.json'), 'utf-8'));

// Generate html content
const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Phần Mềm Quản Trị Giá Lock&King & Takin | 65 Sản Phẩm Chính Hãng</title>
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- SheetJS (xlsx) for Excel Import & Export -->
  <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
  <!-- Chart.js for Price & Profit Analytics -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>

  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            lk: {
              50: '#f0f7ff',
              100: '#e0effe',
              200: '#bae0fd',
              500: '#0284c7',
              600: '#0369a1',
              700: '#075985',
              800: '#0c4a6e',
              900: '#082f49',
            },
            tk: {
              50: '#fff7ed',
              100: '#ffedd5',
              500: '#f97316',
              600: '#ea580c',
              700: '#c2410c',
            }
          }
        }
      }
    }
  </script>

  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
    body {
      font-family: 'Inter', sans-serif;
      background-color: #f8fafc;
    }
    
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: #f1f5f9;
    }
    ::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    @media print {
      body * {
        visibility: hidden;
      }
      #printQuotationArea, #printQuotationArea * {
        visibility: visible;
      }
      #printQuotationArea {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        margin: 0;
        padding: 15px;
        background: white;
      }
      .no-print {
        display: none !important;
      }
      @page {
        size: A4;
        margin: 12mm;
      }
    }
  </style>
</head>
<body class="text-slate-800 antialiased min-h-screen flex flex-col">

  <!-- TOP ALERTS -->
  <div id="topAlertBar" class="hidden bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs sm:text-sm font-medium px-4 py-2 flex items-center justify-between shadow-sm">
    <div class="flex items-center space-x-2">
      <i data-lucide="alert-triangle" class="w-4 h-4"></i>
      <span id="topAlertText">Cảnh báo: Có mã sản phẩm chuyển đổi cần lưu ý!</span>
    </div>
    <button onclick="closeTopAlert()" class="text-white hover:text-amber-100 font-bold ml-4">✕</button>
  </div>

  <div class="flex flex-1 overflow-hidden h-screen">
    
    <!-- SIDEBAR -->
    <aside class="w-64 bg-slate-900 text-slate-200 flex flex-col flex-shrink-0 z-20 shadow-xl select-none">
      
      <!-- LOGO -->
      <div class="p-4 border-b border-slate-800 flex items-center space-x-3 bg-slate-950/50">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-orange-500 flex items-center justify-center font-black text-white shadow-lg text-sm tracking-wider">
          LK
        </div>
        <div class="overflow-hidden">
          <h1 class="font-black text-sm tracking-tight text-white flex items-center gap-1">
            LOCK&KING <span class="text-orange-400">&</span> TAKIN
          </h1>
          <p class="text-[10px] text-sky-400 font-semibold tracking-wider uppercase">Bảng Giá Chính Hãng 2026</p>
        </div>
      </div>

      <!-- NAVIGATION -->
      <nav class="flex-1 overflow-y-auto p-3 space-y-1 text-sm font-medium">
        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 mt-1">Tổng Quan & Danh Mục</div>
        
        <button onclick="navigateTab('dashboard')" id="nav-dashboard" class="nav-item w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition">
          <i data-lucide="layout-dashboard" class="w-4 h-4 text-sky-400"></i>
          <span>Bảng Tổng Quan</span>
        </button>

        <button onclick="navigateTab('products')" id="nav-products" class="nav-item w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition">
          <i data-lucide="package" class="w-4 h-4 text-emerald-400"></i>
          <span class="flex-1 text-left">Danh Mục (65 SP)</span>
          <span id="badgeProductCount" class="text-[10px] bg-slate-800 text-sky-300 px-2 py-0.5 rounded-full font-bold">65</span>
        </button>

        <button onclick="navigateTab('aliases')" id="nav-aliases" class="nav-item w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition">
          <i data-lucide="git-compare-arrows" class="w-4 h-4 text-amber-400"></i>
          <span class="flex-1 text-left">Mã Cũ & Chuyển Đổi</span>
          <span class="text-[10px] bg-amber-950/80 text-amber-300 border border-amber-800 px-1.5 py-0.5 rounded font-bold">10</span>
        </button>

        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 mt-3">Quản Trị Bảng Giá Đa Tầng</div>

        <button onclick="navigateTab('prices')" id="nav-prices" class="nav-item w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition">
          <i data-lucide="tags" class="w-4 h-4 text-indigo-400"></i>
          <span>Bảng 4 Tầng Giá & LN</span>
        </button>

        <button onclick="navigateTab('import')" id="nav-import" class="nav-item w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition">
          <i data-lucide="file-spreadsheet" class="w-4 h-4 text-purple-400"></i>
          <span class="flex-1 text-left">Nhập Giá Từ Excel</span>
        </button>

        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 mt-3">Báo Giá & Bán Hàng</div>

        <button onclick="navigateTab('customers')" id="nav-customers" class="nav-item w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition">
          <i data-lucide="users" class="w-4 h-4 text-cyan-400"></i>
          <span>Đại Lý & Đối Tác NPP</span>
        </button>

        <button onclick="navigateTab('quotations')" id="nav-quotations" class="nav-item w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition">
          <i data-lucide="file-text" class="w-4 h-4 text-blue-400"></i>
          <span>Danh Sách Báo Giá</span>
        </button>

        <button onclick="navigateTab('new-quote')" id="nav-new-quote" class="nav-item w-full flex items-center space-x-3 px-3 py-2 rounded-lg bg-sky-600/20 text-sky-300 border border-sky-500/30 hover:bg-sky-600 hover:text-white transition">
          <i data-lucide="plus-circle" class="w-4 h-4"></i>
          <span>+ Tạo Báo Giá Mới</span>
        </button>

        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 mt-3">Kiểm Soát & Nhật Ký</div>

        <button onclick="navigateTab('audit')" id="nav-audit" class="nav-item w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition">
          <i data-lucide="history" class="w-4 h-4 text-rose-400"></i>
          <span>Nhật Ký Hệ Thống</span>
        </button>

        <button onclick="navigateTab('settings')" id="nav-settings" class="nav-item w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition">
          <i data-lucide="sliders" class="w-4 h-4 text-slate-400"></i>
          <span>Cấu Hình & Sao Lưu</span>
        </button>
      </nav>

      <!-- ROLE SWITCHER FOOTER -->
      <div class="p-3 border-t border-slate-800 bg-slate-950/70">
        <div class="flex items-center space-x-2 mb-2">
          <div id="userAvatar" class="w-7 h-7 rounded-full bg-sky-600 flex items-center justify-center font-bold text-[11px] text-white">
            AD
          </div>
          <div class="overflow-hidden flex-1">
            <div id="userNameDisplay" class="text-xs font-bold text-white truncate">Quản Trị Viên</div>
            <div id="userRoleBadge" class="text-[9px] text-sky-400 font-semibold uppercase">ADMIN - TOÀN QUYỀN</div>
          </div>
        </div>

        <div class="bg-slate-900 border border-slate-700/80 rounded p-1.5 flex items-center justify-between text-xs">
          <span class="text-slate-400 text-[10px]">Phân quyền:</span>
          <select id="roleSelector" onchange="switchRole(this.value)" class="bg-slate-800 text-white text-[10px] rounded px-1 py-0.5 border border-slate-600">
            <option value="ADMIN">Admin (Xem Giá Vốn/Duyệt)</option>
            <option value="SALES">Kinh Doanh (Ẩn Giá Vốn)</option>
            <option value="ACCOUNTANT">Kế Toán (Kiểm Tra/Xuất File)</option>
            <option value="VIEWER">Chỉ Xem (Tra Cứu)</option>
          </select>
        </div>
      </div>
    </aside>

    <!-- MAIN WRAPPER -->
    <main class="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-y-auto">
      
      <!-- TOP HEADER -->
      <header class="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        
        <!-- SEARCH BAR -->
        <div class="flex-1 max-w-2xl relative">
          <div class="relative">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
            <input 
              type="text" 
              id="globalSearchInput"
              placeholder="Tra cứu 65 Model: Nhập mã chuẩn (LK-2202A, TK-2201), mã cũ (LK-30NC, LK3003) hoặc tên..."
              oninput="handleGlobalSearch(this.value)"
              class="w-full pl-9 pr-24 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            />
            <span class="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono">F2</span>
          </div>

          <div id="searchDropdown" class="hidden absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto divide-y divide-slate-100"></div>
        </div>

        <!-- ACTIONS -->
        <div class="flex items-center space-x-3 ml-4">
          <a href="bang_gia_chuan_lock_and_king_takin.xlsx" download class="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 rounded-lg text-xs font-bold transition">
            <i data-lucide="file-spreadsheet" class="w-3.5 h-3.5"></i>
            <span>Tải Bảng Giá 65 Model (.xlsx)</span>
          </a>

          <button onclick="openSystemResetConfirm()" class="text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100" title="Khởi tạo lại bảng giá 65 sản phẩm gốc">
            <i data-lucide="refresh-cw" class="w-4 h-4"></i>
          </button>
        </div>
      </header>

      <!-- CONTENT BODY -->
      <div class="p-6 flex-1">

        <!-- ================= TAB 1: DASHBOARD ================= -->
        <section id="tab-dashboard" class="tab-pane">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
            <div>
              <h2 class="text-xl font-black text-slate-900 flex items-center gap-2">
                Bảng Tổng Quan Bảng Giá Lock&King & Takin
              </h2>
              <p class="text-xs text-slate-500 mt-0.5">Dữ liệu chuẩn xác 65 Model chính thức: Chảo, Nồi & Bộ nồi, Nồi tăng áp, Ấm bình, Đồ điện gia dụng</p>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="navigateTab('products')" class="px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5">
                <i data-lucide="package" class="w-3.5 h-3.5"></i> Xem Toàn Bộ 65 Sản Phẩm
              </button>
              <button onclick="navigateTab('new-quote')" class="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5">
                <i data-lucide="file-plus" class="w-3.5 h-3.5"></i> Tạo Báo Giá Đại Lý
              </button>
            </div>
          </div>

          <!-- KPI CARDS -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tổng Số Model</p>
                <h3 class="text-2xl font-black text-slate-900 mt-1">65 <span class="text-xs font-semibold text-slate-500">sản phẩm</span></h3>
                <span class="text-[10px] text-sky-600 font-bold flex items-center gap-1 mt-0.5">
                  <span class="w-2 h-2 rounded-full bg-sky-500"></span> 49 Lock&King | 16 Takin
                </span>
              </div>
              <div class="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <i data-lucide="package" class="w-6 h-6"></i>
              </div>
            </div>

            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tỷ Suất Lợi Nhuận TB</p>
                <h3 class="text-2xl font-black text-emerald-600 mt-1">46.8%</h3>
                <span class="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                  <i data-lucide="trending-up" class="w-3 h-3"></i> Tỷ suất LN NPP / Facebook
                </span>
              </div>
              <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <i data-lucide="percent" class="w-6 h-6"></i>
              </div>
            </div>

            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mã Cũ Được Ánh Xạ</p>
                <h3 class="text-2xl font-black text-amber-600 mt-1">10 <span class="text-xs font-semibold text-slate-500">quy tắc</span></h3>
                <span class="text-[10px] text-amber-700 font-semibold flex items-center gap-1 mt-0.5">
                  <i data-lucide="shield-alert" class="w-3 h-3"></i> Tự động phát hiện & cảnh báo
                </span>
              </div>
              <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <i data-lucide="git-compare-arrows" class="w-6 h-6"></i>
              </div>
            </div>

            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ngành Hàng Kinh Doanh</p>
                <h3 class="text-2xl font-black text-purple-600 mt-1">5 <span class="text-xs font-semibold text-slate-500">phân loại</span></h3>
                <span class="text-[10px] text-purple-700 font-semibold flex items-center gap-1 mt-0.5">
                  Chảo • Nồi • Tăng Áp • Ấm • Điện
                </span>
              </div>
              <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <i data-lucide="layers" class="w-6 h-6"></i>
              </div>
            </div>
          </div>

          <!-- CHART & TOP PROFIT ITEMS -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            <!-- PRICE TIER COMPARISON CHART -->
            <div class="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h4 class="font-bold text-sm text-slate-900">Đối Chiếu 4 Tầng Giá Sản Phẩm</h4>
                  <p class="text-xs text-slate-500">Giá NPP Online vs Giá Facebook vs Giá Sàn TMĐT vs Giá Niêm Yết</p>
                </div>
                <select id="chartProductSelect" onchange="renderPriceChart(this.value)" class="text-xs border border-slate-200 rounded px-2.5 py-1.5 bg-slate-50 font-semibold max-w-[240px]">
                  <!-- Rendered by JS -->
                </select>
              </div>
              <div class="h-64 relative">
                <canvas id="priceTrendCanvas"></canvas>
              </div>
            </div>

            <!-- TOP PROFIT ITEMS -->
            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <h4 class="font-bold text-sm text-slate-900 mb-1">Top Model Tỷ Suất LN Cao Nhất</h4>
              <p class="text-xs text-slate-500 mb-3">% Lợi nhuận NPP khi bán lẻ Facebook</p>
              
              <div id="topProfitList" class="flex-1 space-y-2 overflow-y-auto max-h-64">
                <!-- Rendered by JS -->
              </div>
            </div>

          </div>

          <!-- CATEGORY SUMMARY TABLE -->
          <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h4 class="font-bold text-sm text-slate-900 mb-3">Phân Bổ Danh Mục & Cơ Cấu Giá Theo Thương Hiệu</h4>
            <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
              <div class="p-3 rounded-lg bg-sky-50 border border-sky-200">
                <span class="font-bold text-sky-800 block text-sm">16 Model</span>
                <span class="text-slate-600 font-medium text-[11px]">Chảo & Chảo Sâu</span>
              </div>
              <div class="p-3 rounded-lg bg-indigo-50 border border-indigo-200">
                <span class="font-bold text-indigo-800 block text-sm">20 Model</span>
                <span class="text-slate-600 font-medium text-[11px]">Nồi & Bộ Nồi Inox</span>
              </div>
              <div class="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <span class="font-bold text-amber-800 block text-sm">3 Model</span>
                <span class="text-slate-600 font-medium text-[11px]">Nồi Tăng Áp</span>
              </div>
              <div class="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <span class="font-bold text-emerald-800 block text-sm">2 Model</span>
                <span class="text-slate-600 font-medium text-[11px]">Ấm & Bình Đun</span>
              </div>
              <div class="p-3 rounded-lg bg-rose-50 border border-rose-200 col-span-2 sm:col-span-1">
                <span class="font-bold text-rose-800 block text-sm">24 Model</span>
                <span class="text-slate-600 font-medium text-[11px]">Đồ Điện Gia Dụng</span>
              </div>
            </div>
          </div>

        </section>

        <!-- ================= TAB 2: PRODUCT MANAGEMENT (65 REAL MODELS) ================= -->
        <section id="tab-products" class="tab-pane hidden">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
            <div>
              <h2 class="text-xl font-black text-slate-900">Danh Mục 65 Sản Phẩm Lock&King & Takin</h2>
              <p class="text-xs text-slate-500 mt-0.5">Bảng giá 4 tầng niêm yết chính hãng: NPP Online, Facebook, Sàn TMĐT và Niêm Yết</p>
            </div>
            <div class="flex items-center gap-2">
              <a href="bang_gia_chuan_lock_and_king_takin.csv" download class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold border border-slate-300 flex items-center gap-1">
                <i data-lucide="download" class="w-3.5 h-3.5"></i> Tải CSV
              </a>
              <button id="btnAddProduct" onclick="openAddProductModal()" class="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1">
                <i data-lucide="plus" class="w-4 h-4"></i> Thêm Model Mới
              </button>
            </div>
          </div>

          <!-- FILTERS -->
          <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div class="flex flex-wrap items-center gap-2 flex-1 min-w-[300px]">
              
              <!-- SEARCH -->
              <div class="relative flex-1 min-w-[200px]">
                <i data-lucide="search" class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
                <input 
                  type="text" 
                  id="productFilterSearch" 
                  placeholder="Lọc theo Model (LK-..., TK-...), tên sản phẩm..." 
                  oninput="renderProductTable()" 
                  class="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <!-- BRAND FILTER -->
              <select id="productFilterBrand" onchange="renderProductTable()" class="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 font-bold text-slate-700">
                <option value="">Tất Cả Thương Hiệu (65)</option>
                <option value="Lock&King">Lock&King (49)</option>
                <option value="Takin">Takin (16)</option>
              </select>

              <!-- CATEGORY FILTER -->
              <select id="productFilterCategory" onchange="renderProductTable()" class="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50">
                <option value="">Tất cả phân loại</option>
                <option value="CHẢO">Chảo & Chảo Sâu</option>
                <option value="NỒI & BỘ NỒI">Nồi & Bộ Nồi</option>
                <option value="NỒI TĂNG ÁP">Nồi Tăng Áp</option>
                <option value="ẤM & BÌNH">Ấm & Bình</option>
                <option value="ĐỒ ĐIỆN">Đồ Điện Gia Dụng</option>
              </select>
            </div>

            <div class="text-slate-500">
              Đang hiển thị: <strong id="productShowingCount" class="text-sky-700 font-bold">65</strong> sản phẩm
            </div>
          </div>

          <!-- TABLE -->
          <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-xs text-left">
                <thead class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                  <tr>
                    <th class="py-3 px-3 text-center">STT</th>
                    <th class="py-3 px-3">Model</th>
                    <th class="py-3 px-3">Thương Hiệu</th>
                    <th class="py-3 px-3">Tên Sản Phẩm</th>
                    <th class="py-3 px-3">Phân Loại</th>
                    <th class="py-3 px-3 text-right text-indigo-700">Giá NPP Online</th>
                    <th class="py-3 px-3 text-right text-blue-700">Giá Facebook</th>
                    <th class="py-3 px-3 text-right text-orange-700">Giá Sàn TMĐT</th>
                    <th class="py-3 px-3 text-right text-slate-800">Giá Niêm Yết</th>
                    <th class="py-3 px-3 text-right text-emerald-700">Lợi Nhuận NPP</th>
                    <th class="py-3 px-3 text-center text-emerald-800">% LN/FB</th>
                    <th class="py-3 px-3 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody id="productTableTbody" class="divide-y divide-slate-100 font-medium">
                  <!-- Rendered by JS -->
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- ================= TAB 3: CODE ALIASES (10 RULES) ================= -->
        <section id="tab-aliases" class="tab-pane hidden">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
            <div>
              <h2 class="text-xl font-black text-slate-900">Từ Điển Chuyển Đổi Mã Cũ Sang Mã Chuẩn</h2>
              <p class="text-xs text-slate-500 mt-0.5">Tự động phát hiện mã cũ, mã viết liền thiếu gạch hoặc mã cải tiến để tránh nhầm mã hàng</p>
            </div>
            <button onclick="openAddAliasModal()" class="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5">
              <i data-lucide="plus" class="w-4 h-4"></i> Thêm Quy Tắc Chuyển Đổi
            </button>
          </div>

          <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-xs text-amber-900 flex items-start gap-3">
            <i data-lucide="shield-check" class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"></i>
            <div>
              <strong class="font-bold">Cơ chế phát hiện thông minh:</strong>
              <p class="mt-1 leading-relaxed">
                Khi nhập mã như <code class="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">LK-30NC</code> (Mã cũ), hệ thống sẽ đối chiếu và hướng dẫn sang mã chuẩn <code class="bg-sky-100 text-sky-900 px-1 py-0.5 rounded font-mono font-bold">LK-30NC1</code> (Nồi luộc gà size 30). Tương tự cho <code class="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">LK3003</code> ➔ <code class="bg-sky-100 text-sky-900 px-1 py-0.5 rounded font-mono font-bold">LK-3003</code>.
              </p>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table class="w-full text-xs text-left">
              <thead class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                <tr>
                  <th class="py-3 px-4">Mã Cũ / Mã Viết Liền</th>
                  <th class="py-3 px-4 text-center">Chuyển Sang</th>
                  <th class="py-3 px-4">Mã Chuẩn Đích</th>
                  <th class="py-3 px-4">Tên Sản Phẩm Chính Thức</th>
                  <th class="py-3 px-4">Thương Hiệu</th>
                  <th class="py-3 px-4">Ghi Chú Lý Do</th>
                  <th class="py-3 px-4 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody id="aliasTableTbody" class="divide-y divide-slate-100 font-medium"></tbody>
            </table>
          </div>
        </section>

        <!-- ================= TAB 4: MULTI-TIER PRICE LIST ================= -->
        <section id="tab-prices" class="tab-pane hidden">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
            <div>
              <h2 class="text-xl font-black text-slate-900">Bảng Quản Trị 4 Tầng Giá & Lịch Sử Phiên Bản</h2>
              <p class="text-xs text-slate-500 mt-0.5">So sánh và cập nhật từng tầng giá theo chính sách bán hàng của hãng</p>
            </div>
            <button onclick="openChangePriceModal()" class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5">
              <i data-lucide="edit-3" class="w-4 h-4"></i> Cập Nhật Giá Model
            </button>
          </div>

          <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div class="flex items-center gap-2 flex-1">
              <label class="font-bold text-slate-700">Tầng giá hiển thị:</label>
              <select id="priceTypeSelector" onchange="renderPriceTable()" class="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 font-bold text-slate-800">
                <option value="nppOnlinePrice">1. Giá NPP Online (Vốn Nhập NPP)</option>
                <option value="facebookPrice">2. Giá Facebook (Bán Lẻ Online)</option>
                <option value="tmdtPrice">3. Giá Sàn TMĐT (Shopee/Lazada/TikTok)</option>
                <option value="retailPrice">4. Giá Niêm Yết Chính Hãng</option>
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
                  <th class="py-3 px-3">STT</th>
                  <th class="py-3 px-3">Model</th>
                  <th class="py-3 px-3">Tên Sản Phẩm</th>
                  <th class="py-3 px-3">Thương Hiệu</th>
                  <th class="py-3 px-3 text-right">Mức Giá Đang Áp Dụng</th>
                  <th class="py-3 px-3 text-right">Giá Trước Đó</th>
                  <th class="py-3 px-3 text-center">Biến Động</th>
                  <th class="py-3 px-3">Ngày Cập Nhật</th>
                  <th class="py-3 px-3 text-center">Lịch Sử</th>
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
              <p class="text-xs text-slate-500 mt-0.5">Kiểm tra tự động: Mã trùng, lệch giá >10%, nhầm cột NPP/Facebook, nhận diện mã cũ</p>
            </div>
            <a href="bang_gia_chuan_lock_and_king_takin.xlsx" download class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <i data-lucide="download" class="w-3.5 h-3.5"></i> Tải File Excel Mẫu 65 Model
            </a>
          </div>

          <div class="bg-white rounded-xl border border-dashed border-sky-300 p-8 text-center shadow-sm mb-6 hover:border-sky-500 transition cursor-pointer" onclick="document.getElementById('excelFileInput').click()">
            <input type="file" id="excelFileInput" accept=".xlsx, .xls, .csv" class="hidden" onchange="handleExcelUpload(event)">
            <div class="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-2 shadow-inner">
              <i data-lucide="file-spreadsheet" class="w-7 h-7"></i>
            </div>
            <h3 class="font-bold text-sm text-slate-800">Nhấn vào đây để tải lên file Excel bảng giá Lock&King hoặc Takin</h3>
            <p class="text-xs text-slate-400 mt-0.5">Hỗ trợ file .xlsx, .csv có đầy đủ các cột: Model, Giá NPP Online, Giá Facebook, Giá sàn TMĐT, Giá niêm yết</p>
          </div>

          <!-- STAGING RESULT AREA -->
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
                  <i data-lucide="check-check" class="w-4 h-4"></i> Phê Duyệt & Áp Dụng Bảng Giá
                </button>
              </div>
            </div>

            <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div class="overflow-x-auto max-h-96">
                <table class="w-full text-xs text-left">
                  <thead class="bg-slate-100 text-slate-700 uppercase text-[10px] font-bold border-b border-slate-200 sticky top-0">
                    <tr>
                      <th class="py-2.5 px-3">Dòng #</th>
                      <th class="py-2.5 px-3">Model File</th>
                      <th class="py-2.5 px-3">Model Chuẩn</th>
                      <th class="py-2.5 px-3">Tên Sản Phẩm</th>
                      <th class="py-2.5 px-3 text-right">Giá Cũ</th>
                      <th class="py-2.5 px-3 text-right">Giá Mới</th>
                      <th class="py-2.5 px-3 text-center">Biến Động</th>
                      <th class="py-2.5 px-3">Chẩn Đoán Lỗi / Cảnh Báo</th>
                    </tr>
                  </thead>
                  <tbody id="stagingTbody" class="divide-y divide-slate-100 font-mono text-[11px]"></tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <!-- ================= TAB 6: CUSTOMERS & DEALERS ================= -->
        <section id="tab-customers" class="tab-pane hidden">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
            <div>
              <h2 class="text-xl font-black text-slate-900">Danh Sách Đại Lý & Đối Tác NPP</h2>
              <p class="text-xs text-slate-500 mt-0.5">Mạng lưới phân phối, mức chiết khấu và nhóm khách hàng</p>
            </div>
            <button onclick="openAddCustomerModal()" class="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5">
              <i data-lucide="plus" class="w-4 h-4"></i> Thêm Khách Hàng / Đại Lý
            </button>
          </div>

          <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table class="w-full text-xs text-left">
              <thead class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                <tr>
                  <th class="py-3 px-3">Mã KH</th>
                  <th class="py-3 px-3">Tên Khách Hàng / Đại Lý</th>
                  <th class="py-3 px-3">Nhóm Khách Hàng</th>
                  <th class="py-3 px-3">Tầng Giá Áp Dụng</th>
                  <th class="py-3 px-3">Chiết Khấu Mặc Định</th>
                  <th class="py-3 px-3">Điện Thoại</th>
                  <th class="py-3 px-3">Địa Chỉ</th>
                  <th class="py-3 px-3 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody id="customerTableTbody" class="divide-y divide-slate-100 font-medium"></tbody>
            </table>
          </div>
        </section>

        <!-- ================= TAB 7: QUOTATIONS LIST ================= -->
        <section id="tab-quotations" class="tab-pane hidden">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
            <div>
              <h2 class="text-xl font-black text-slate-900">Danh Sách Báo Giá Đã Xuất</h2>
              <p class="text-xs text-slate-500 mt-0.5">Theo dõi lịch sử chào giá, in ấn A4 hoặc xuất file Excel gửi đối tác</p>
            </div>
            <button onclick="navigateTab('new-quote')" class="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5">
              <i data-lucide="plus-circle" class="w-4 h-4"></i> Tạo Báo Giá Mới
            </button>
          </div>

          <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table class="w-full text-xs text-left">
              <thead class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                <tr>
                  <th class="py-3 px-3">Số Báo Giá</th>
                  <th class="py-3 px-3">Khách Hàng / Đại Lý</th>
                  <th class="py-3 px-3">Ngày Lập</th>
                  <th class="py-3 px-3">Người Lập</th>
                  <th class="py-3 px-3 text-right">Tổng Thanh Toán</th>
                  <th class="py-3 px-3 text-center">Trạng Thái</th>
                  <th class="py-3 px-3 text-center">Hành Động</th>
                </tr>
              </thead>
              <tbody id="quotationTableTbody" class="divide-y divide-slate-100 font-medium"></tbody>
            </table>
          </div>
        </section>

        <!-- ================= TAB 8: CREATE NEW QUOTATION ================= -->
        <section id="tab-new-quote" class="tab-pane hidden">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
            <div>
              <h2 class="text-xl font-black text-slate-900">Lập Báo Giá Sản Phẩm Lock&King & Takin</h2>
              <p class="text-xs text-slate-500 mt-0.5">Tự động điền giá theo tầng giá (Facebook / NPP Online / TMĐT / Niêm Yết), tính CK và VAT minh bạch</p>
            </div>
            <button onclick="resetQuotationForm()" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold">
              Làm Mới Form
            </button>
          </div>

          <!-- FORM GRID -->
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
                    <option value="facebookPrice">Giá Facebook (Bán Lẻ Online)</option>
                    <option value="nppOnlinePrice">Giá NPP Online (Giá Vốn NPP)</option>
                    <option value="tmdtPrice">Giá Sàn TMĐT</option>
                    <option value="retailPrice">Giá Niêm Yết Chính Hãng</option>
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
                  <input type="text" id="quoteCodeDisplay" readonly class="w-full border border-slate-200 rounded-lg p-2 bg-slate-100 font-mono text-slate-600 font-bold">
                </div>
              </div>
            </div>

            <!-- TOTAL SUMMARY CARD -->
            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 class="font-bold text-xs text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 mb-3">Tổng Kết Thanh Toán</h3>
                
                <div class="space-y-2 text-xs">
                  <div class="flex justify-between text-slate-600">
                    <span>Thành tiền trước CK:</span>
                    <strong id="quoteCalcSubtotal" class="font-mono text-slate-800">0 đ</strong>
                  </div>

                  <div class="flex items-center justify-between text-slate-600">
                    <span class="flex items-center gap-1">
                      Chiết khấu toàn đơn (%):
                      <input type="number" id="quoteDiscountRate" min="0" max="100" value="0" oninput="recalcQuotation()" class="w-12 border border-slate-200 rounded text-center py-0.5 px-1 font-bold text-sky-700">
                    </span>
                    <span id="quoteCalcDiscount" class="font-mono text-rose-600 font-bold">-0 đ</span>
                  </div>

                  <div class="flex items-center justify-between text-slate-600">
                    <span class="flex items-center gap-1">
                      Thuế VAT (%):
                      <select id="quoteVatRate" onchange="recalcQuotation()" class="border border-slate-200 rounded py-0.5 px-1 font-bold text-slate-700">
                        <option value="10" selected>10%</option>
                        <option value="8">8%</option>
                        <option value="0">0%</option>
                      </select>
                    </span>
                    <span id="quoteCalcVat" class="font-mono text-slate-800">+0 đ</span>
                  </div>

                  <div class="flex items-center justify-between text-slate-600">
                    <span>Phí vận chuyển:</span>
                    <input type="number" id="quoteShippingFee" value="0" step="10000" oninput="recalcQuotation()" class="w-24 text-right border border-slate-200 rounded py-0.5 px-1 font-mono">
                  </div>

                  <div class="border-t border-slate-200 pt-2 flex justify-between items-baseline">
                    <span class="font-bold text-slate-900 text-sm">TỔNG THANH TOÁN:</span>
                    <span id="quoteCalcTotal" class="font-black text-lg text-sky-700 font-mono">0 đ</span>
                  </div>
                </div>
              </div>

              <div class="mt-4 pt-3 border-t border-slate-100">
                <button onclick="saveAndPreviewQuotation()" class="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold shadow flex items-center justify-center gap-1.5">
                  <i data-lucide="eye" class="w-4 h-4"></i> Xem Trước Mẫu In A4 & Lưu
                </button>
              </div>
            </div>
          </div>

          <!-- ITEMS TABLE -->
          <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-bold text-xs text-slate-800 uppercase tracking-wider">Danh Sách Model Thêm Vào Báo Giá</h3>
              
              <div class="flex items-center gap-2">
                <select id="addProductToQuoteSelect" class="border border-slate-200 rounded-lg px-3 py-1.5 text-xs bg-slate-50 max-w-sm">
                  <option value="">-- Chọn trong 65 Model chính thức --</option>
                </select>
                <button onclick="addProductToQuotation()" class="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold flex items-center gap-1">
                  <i data-lucide="plus" class="w-3.5 h-3.5"></i> Thêm Dòng
                </button>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-xs text-left">
                <thead class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                  <tr>
                    <th class="py-2.5 px-3">Model</th>
                    <th class="py-2.5 px-3">Thương Hiệu</th>
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
            </div>

            <div id="emptyQuoteItemsNotice" class="py-8 text-center text-slate-400 text-xs">
              <i data-lucide="shopping-cart" class="w-8 h-8 mx-auto mb-1 text-slate-300"></i>
              Chưa có sản phẩm nào. Chọn Model ở phía trên và nhấn "Thêm Dòng".
            </div>
          </div>
        </section>

        <!-- ================= TAB 9: AUDIT LOG ================= -->
        <section id="tab-audit" class="tab-pane hidden">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
            <div>
              <h2 class="text-xl font-black text-slate-900">Nhật Ký Hệ Thống (Audit Trail)</h2>
              <p class="text-xs text-slate-500 mt-0.5">Truy nguyên vết chỉnh sửa giá, nhập file, tạo báo giá</p>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table class="w-full text-xs text-left">
              <thead class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                <tr>
                  <th class="py-3 px-3">Thời Gian</th>
                  <th class="py-3 px-3">Người Thực Hiện</th>
                  <th class="py-3 px-3">Hành Động</th>
                  <th class="py-3 px-3">Đối Tượng</th>
                  <th class="py-3 px-3">Dữ Liệu Trước Sửa</th>
                  <th class="py-3 px-3">Dữ Liệu Sau Sửa</th>
                  <th class="py-3 px-3">Chi Tiết / Lý Do</th>
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
              <h2 class="text-xl font-black text-slate-900">Cấu Hình Hệ Thống & Sao Lưu</h2>
              <p class="text-xs text-slate-500 mt-0.5">Quản lý tham số cảnh báo và sao lưu cơ sở dữ liệu</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs">
              <h3 class="font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Tham Số Kiểm Soát Giá</h3>
              
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Ngưỡng cảnh báo biến động giá (%) :</label>
                <input type="number" id="settingPriceThreshold" value="10" min="1" max="100" class="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 font-bold">
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Thuế VAT mặc định (%) :</label>
                <input type="number" id="settingDefaultVat" value="10" min="0" max="20" class="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 font-bold">
              </div>

              <button onclick="saveSettings()" class="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold shadow">
                Lưu Cấu Hình
              </button>
            </div>

            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs">
              <h3 class="font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Sao Lưu Dữ Liệu 65 Sản Phẩm</h3>
              
              <div class="flex flex-wrap gap-2">
                <button onclick="exportFullDatabaseJSON()" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold flex items-center gap-1.5 shadow">
                  <i data-lucide="download" class="w-3.5 h-3.5"></i> Xuất File JSON
                </button>
                <button onclick="openSystemResetConfirm()" class="px-3.5 py-2 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-lg font-bold flex items-center gap-1.5">
                  <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Khôi Phục Gốc 65 Model
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  </div>

  <!-- MODAL: A4 PRINT / PREVIEW -->
  <div id="quotationPreviewModal" class="hidden fixed inset-0 bg-slate-900/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
    <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] flex flex-col overflow-hidden">
      <div class="p-4 bg-slate-900 text-white flex items-center justify-between no-print">
        <div class="flex items-center space-x-2">
          <i data-lucide="printer" class="w-5 h-5 text-sky-400"></i>
          <h3 class="font-bold text-sm">Xem Trước Mẫu Báo Giá Chuẩn A4</h3>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="window.print()" class="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold flex items-center gap-1">
            <i data-lucide="printer" class="w-3.5 h-3.5"></i> In Bản Cứng / Lưu PDF
          </button>
          <button onclick="exportCurrentQuotationExcel()" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1">
            <i data-lucide="file-spreadsheet" class="w-3.5 h-3.5"></i> Xuất Excel
          </button>
          <button onclick="closeQuotationPreviewModal()" class="text-slate-400 hover:text-white font-bold text-lg px-2">✕</button>
        </div>
      </div>
      <div class="flex-1 overflow-y-auto p-8 bg-white" id="printQuotationArea"></div>
    </div>
  </div>

  <!-- TOAST CONTAINER -->
  <div id="toastContainer" class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none"></div>

  <!-- JAVASCRIPT LOGIC -->
  <script>
    const STORAGE_KEY = 'LOCK_KING_PMS_DATA_v2_OFFICIAL';
    let currentTab = 'dashboard';
    let priceTrendChartInstance = null;
    let tempStagingData = null;

    let currentUser = {
      username: 'admin',
      fullName: 'Quản Trị Viên Hệ Thống',
      role: 'ADMIN'
    };

    let systemSettings = {
      priceAlertThreshold: 10,
      defaultVatRate: 10,
      roundingRule: 1000
    };

    let quotationDraft = {
      code: 'BG-LK-202609-001',
      customerId: '',
      customerName: '',
      customerPhone: '',
      priceType: 'facebookPrice',
      validUntil: '',
      discountRate: 0,
      vatRate: 10,
      shippingFee: 0,
      items: []
    };

    // EMBEDDED AUTHENTIC SEED DATA (65 PRODUCTS)
    const SEED_DATA = ${JSON.stringify(seed, null, 2)};

    function getInitialData() {
      return {
        categories: SEED_DATA.categories,
        products: SEED_DATA.products,
        aliases: SEED_DATA.aliases,
        priceHistory: [
          {
            id: 'ph-1',
            canonicalCode: 'LK-30NC1',
            priceType: 'Giá NPP Online',
            oldPrice: 395000,
            newPrice: 414000,
            effectiveFrom: '2026-09-01',
            reason: 'Tăng chi phí nguyên liệu inox nhập khẩu',
            approvedBy: 'admin'
          },
          {
            id: 'ph-2',
            canonicalCode: 'LK-2606A',
            priceType: 'Giá Facebook',
            oldPrice: 550000,
            newPrice: 590000,
            effectiveFrom: '2026-09-02',
            reason: 'Nâng cấp phủ đá hoa cương 5 lớp',
            approvedBy: 'admin'
          }
        ],
        customers: [
          {
            id: 'c-1',
            code: 'NPP-MB-01',
            name: 'Tổng Thầu Gia Dụng An Thịnh Phát',
            groupName: 'Nhà Phân Phối Cấp 1',
            priceType: 'nppOnlinePrice',
            defaultDiscount: 5.0,
            phone: '0912.888.999',
            address: 'Số 45 Đường Giải Phóng, Hai Bà Trưng, Hà Nội'
          },
          {
            id: 'c-2',
            code: 'DL1-DMX-02',
            name: 'Hệ Thống Siêu Thị Điện Máy Xanh',
            groupName: 'Đại Lý Bán Lẻ Toàn Quốc',
            priceType: 'facebookPrice',
            defaultDiscount: 3.0,
            phone: '1800.1061',
            address: 'Lô T2-1.2 Đường D1, Khu Công Nghệ Cao, TP. Thủ Đức'
          }
        ],
        quotations: [],
        auditLogs: [
          {
            id: 'aud-init',
            timestamp: '2026-09-05 11:25:00',
            userName: 'Admin',
            action: 'INITIALIZE',
            entityType: 'CATALOG',
            details: 'Khởi tạo thành công 65 Model chính thức Lock&King & Takin',
            oldVal: '-',
            newVal: '65 sản phẩm, 10 quy tắc chuyển đổi mã'
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

    function recordAuditLog(action, entityType, details, oldVal = '-', newVal = '-', reason = '') {
      const db = getDB();
      const now = new Date();
      const timeStr = now.getFullYear() + '-' + 
        String(now.getMonth() + 1).padStart(2, '0') + '-' + 
        String(now.getDate()).padStart(2, '0') + ' ' + 
        String(now.getHours()).padStart(2, '0') + ':' + 
        String(now.getMinutes()).padStart(2, '0');

      db.auditLogs.unshift({
        id: 'aud-' + Date.now(),
        timestamp: timeStr,
        userName: currentUser.fullName,
        action: action,
        entityType: entityType,
        details: details,
        oldVal: String(oldVal),
        newVal: String(newVal),
        reason: reason
      });
      if (db.auditLogs.length > 300) db.auditLogs.pop();
      saveDB(db);
    }

    function formatVND(amt) {
      if (amt === undefined || amt === null || isNaN(amt)) return '0 đ';
      return new Intl.NumberFormat('vi-VN').format(Math.round(amt)) + ' đ';
    }

    function showToast(msg, type = 'success') {
      const container = document.getElementById('toastContainer');
      const t = document.createElement('div');
      let bg = type === 'error' ? 'bg-rose-900 border-rose-700' : (type === 'warning' ? 'bg-amber-900 border-amber-700' : 'bg-slate-900 border-slate-700');
      t.className = \`\${bg} text-white border shadow-xl px-4 py-3 rounded-xl flex items-center gap-2 text-xs pointer-events-auto transform transition-all duration-300\`;
      t.innerHTML = \`<i data-lucide="\${type === 'error' ? 'alert-circle' : 'check-circle-2'}" class="w-4 h-4 text-emerald-400"></i><div class="flex-1 font-medium">\${msg}</div>\`;
      container.appendChild(t);
      lucide.createIcons();
      setTimeout(() => t.remove(), 3500);
    }

    function closeTopAlert() {
      document.getElementById('topAlertBar').classList.add('hidden');
    }

    function navigateTab(tabId) {
      currentTab = tabId;
      document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.remove('bg-sky-600', 'text-white', 'font-bold');
        el.classList.add('text-slate-300');
      });
      const activeNav = document.getElementById('nav-' + tabId);
      if (activeNav) {
        activeNav.classList.add('bg-sky-600', 'text-white', 'font-bold');
        activeNav.classList.remove('text-slate-300');
      }

      document.querySelectorAll('.tab-pane').forEach(el => el.classList.add('hidden'));
      const activePane = document.getElementById('tab-' + tabId);
      if (activePane) activePane.classList.remove('hidden');

      if (tabId === 'dashboard') renderDashboard();
      if (tabId === 'products') renderProductTable();
      if (tabId === 'aliases') renderAliasTable();
      if (tabId === 'prices') renderPriceTable();
      if (tabId === 'customers') renderCustomerTable();
      if (tabId === 'quotations') renderQuotationTable();
      if (tabId === 'new-quote') initNewQuotationTab();
      if (tabId === 'audit') renderAuditTable();

      lucide.createIcons();
    }

    function switchRole(role) {
      currentUser.role = role;
      const map = {
        'ADMIN': 'Quản Trị Viên (Admin)',
        'SALES': 'Nhân Viên Kinh Doanh',
        'ACCOUNTANT': 'Kế Toán Kiểm Tra',
        'VIEWER': 'Người Chỉ Xem'
      };
      currentUser.fullName = map[role];
      document.getElementById('userNameDisplay').innerText = currentUser.fullName;
      document.getElementById('userRoleBadge').innerText = role;
      showToast('Đã chuyển vai trò: ' + currentUser.fullName);
      if (currentTab === 'products') renderProductTable();
    }

    /* GLOBAL SEARCH WITH CONVERSION ALERT */
    function handleGlobalSearch(query) {
      const dropdown = document.getElementById('searchDropdown');
      if (!query || query.trim().length === 0) {
        dropdown.classList.add('hidden');
        return;
      }
      const q = query.trim().toUpperCase();
      const db = getDB();

      const matchedAlias = db.aliases.find(a => a.aliasCode.toUpperCase() === q || a.aliasCode.toUpperCase().replace(/-/g, '') === q.replace(/-/g, ''));
      let results = [];

      if (matchedAlias) {
        const target = db.products.find(p => p.canonicalCode === matchedAlias.targetCode);
        if (target) {
          results.push({ isAlias: true, searchedCode: query, alias: matchedAlias, product: target });
        }
      }

      db.products.forEach(p => {
        const matchCode = p.canonicalCode.toUpperCase().includes(q) || p.canonicalCode.toUpperCase().replace(/-/g, '').includes(q.replace(/-/g, ''));
        const matchName = p.name.toUpperCase().includes(q);
        if (matchCode || matchName) {
          if (!results.some(r => r.product.canonicalCode === p.canonicalCode)) {
            results.push({ isAlias: false, product: p });
          }
        }
      });

      if (results.length === 0) {
        dropdown.innerHTML = \`<div class="p-4 text-center text-xs text-slate-400">Không tìm thấy Model nào khớp với "\${escapeHtml(query)}"</div>\`;
        dropdown.classList.remove('hidden');
        return;
      }

      let html = '';
      results.slice(0, 10).forEach(res => {
        const p = res.product;
        const brandBadge = p.brand === 'Lock&King' ? '<span class="px-1.5 py-0.2 bg-sky-100 text-sky-800 rounded font-bold text-[9px]">LK</span>' : '<span class="px-1.5 py-0.2 bg-orange-100 text-orange-800 rounded font-bold text-[9px]">TAKIN</span>';
        
        if (res.isAlias) {
          html += \`
            <div onclick="selectSearchProduct('\${p.canonicalCode}')" class="p-3 bg-amber-50 hover:bg-amber-100 cursor-pointer border-l-4 border-amber-500">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="line-through font-mono font-bold text-xs text-amber-800 bg-amber-200 px-2 py-0.5 rounded">\${escapeHtml(res.searchedCode)}</span>
                  <span class="text-amber-600 font-bold">➔</span>
                  <span class="font-mono font-bold text-xs text-white bg-sky-600 px-2 py-0.5 rounded">\${p.canonicalCode}</span>
                  \${brandBadge}
                  <span class="text-[9px] bg-amber-500 text-white font-bold px-1.5 rounded uppercase">Mã Cũ Chuẩn Hóa</span>
                </div>
                <div class="text-right font-mono font-bold text-sky-800 text-xs">\${formatVND(p.facebookPrice)}</div>
              </div>
              <div class="text-xs font-bold text-slate-800 mt-1">\${p.name}</div>
              <div class="text-[10px] text-amber-700 italic mt-0.5">⚠️ \${escapeHtml(res.alias.notes)}</div>
            </div>
          \`;
        } else {
          html += \`
            <div onclick="selectSearchProduct('\${p.canonicalCode}')" class="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between">
              <div>
                <div class="flex items-center space-x-2">
                  <span class="font-mono font-bold text-xs bg-slate-100 text-sky-800 px-2 py-0.5 rounded">\${p.canonicalCode}</span>
                  \${brandBadge}
                  <span class="text-[10px] text-slate-400 font-medium">\${p.categoryName}</span>
                </div>
                <div class="text-xs font-bold text-slate-800 mt-0.5">\${p.name}</div>
              </div>
              <div class="text-right">
                <div class="font-mono font-bold text-sky-800 text-xs">\${formatVND(p.facebookPrice)} (FB)</div>
                <div class="text-[10px] text-slate-400 font-mono">NPP: \${formatVND(p.nppOnlinePrice)}</div>
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
      if (sb && dd && !sb.contains(e.target) && !dd.contains(e.target)) {
        dd.classList.add('hidden');
      }
    });

    /* DASHBOARD */
    function renderDashboard() {
      const db = getDB();
      const select = document.getElementById('chartProductSelect');
      select.innerHTML = db.products.map(p => \`<option value="\${p.canonicalCode}">\${p.canonicalCode} - \${p.name.substring(0, 26)}</option>\`).join('');

      if (db.products.length > 0) {
        renderPriceChart(db.products[0].canonicalCode);
      }

      // Render Top Profit Items
      const sorted = [...db.products].sort((a, b) => {
        const pctA = parseFloat(a.profitPct) || 0;
        const pctB = parseFloat(b.profitPct) || 0;
        return pctB - pctA;
      });

      const list = document.getElementById('topProfitList');
      list.innerHTML = sorted.slice(0, 6).map(p => \`
        <div class="p-2 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between text-xs">
          <div>
            <div class="flex items-center gap-1.5">
              <span class="font-mono font-bold text-slate-800">\${p.canonicalCode}</span>
              <span class="text-[9px] px-1 rounded \${p.brand === 'Lock&King' ? 'bg-sky-100 text-sky-800' : 'bg-orange-100 text-orange-800'} font-bold">\${p.brand}</span>
            </div>
            <div class="text-[10px] text-slate-500 truncate max-w-[150px]">\${p.name}</div>
          </div>
          <div class="text-right">
            <div class="font-mono font-bold text-emerald-700">+\${formatVND(p.profitNPP)}</div>
            <span class="text-[10px] font-black text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">\${p.profitPct}</span>
          </div>
        </div>
      \`).join('');
    }

    function renderPriceChart(code) {
      const db = getDB();
      const p = db.products.find(prod => prod.canonicalCode === code);
      if (!p) return;

      const ctx = document.getElementById('priceTrendCanvas').getContext('2d');
      if (priceTrendChartInstance) priceTrendChartInstance.destroy();

      priceTrendChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Giá NPP Online (Vốn)', 'Giá Bán Facebook', 'Giá Sàn TMĐT', 'Giá Niêm Yết'],
          datasets: [{
            label: \`Cơ cấu giá Model: \${p.canonicalCode} (\${p.brand})\`,
            data: [p.nppOnlinePrice, p.facebookPrice, p.tmdtPrice, p.retailPrice],
            backgroundColor: ['#6366f1', '#0284c7', '#ea580c', '#334155'],
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
        const matchQ = !q || p.canonicalCode.toUpperCase().includes(q) || p.name.toUpperCase().includes(q);
        const matchBrand = !brand || p.brand === brand;
        const matchCat = !cat || p.categoryName.toUpperCase().includes(cat.toUpperCase());
        return matchQ && matchBrand && matchCat;
      });

      document.getElementById('productShowingCount').innerText = filtered.length;
      const tbody = document.getElementById('productTableTbody');

      tbody.innerHTML = filtered.map(p => {
        const isLK = p.brand === 'Lock&King';
        return \`
          <tr class="hover:bg-slate-50/80 transition">
            <td class="py-2.5 px-3 text-center text-slate-400 font-mono">\${p.stt || '-'}</td>
            <td class="py-2.5 px-3">
              <span class="font-mono font-bold text-xs \${isLK ? 'text-sky-800 bg-sky-50 border-sky-200' : 'text-orange-800 bg-orange-50 border-orange-200'} border px-2 py-0.5 rounded">\${p.canonicalCode}</span>
            </td>
            <td class="py-2.5 px-3">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full \${isLK ? 'bg-sky-100 text-sky-900' : 'bg-orange-100 text-orange-900'}">\${p.brand}</span>
            </td>
            <td class="py-2.5 px-3 font-bold text-slate-800 max-w-xs">\${escapeHtml(p.name)}</td>
            <td class="py-2.5 px-3 text-slate-500 text-[11px]">\${p.categoryName}</td>
            <td class="py-2.5 px-3 text-right font-mono font-bold text-indigo-700">\${formatVND(p.nppOnlinePrice)}</td>
            <td class="py-2.5 px-3 text-right font-mono font-bold text-blue-700">\${formatVND(p.facebookPrice)}</td>
            <td class="py-2.5 px-3 text-right font-mono font-bold text-orange-700">\${formatVND(p.tmdtPrice)}</td>
            <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-700">\${formatVND(p.retailPrice)}</td>
            <td class="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">+\${formatVND(p.profitNPP)}</td>
            <td class="py-2.5 px-3 text-center font-mono font-black text-emerald-800 bg-emerald-50/40">\${p.profitPct}</td>
            <td class="py-2.5 px-3 text-center">
              <button onclick="quickQuoteProduct('\${p.canonicalCode}')" class="px-2 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded text-[11px] font-bold" title="Lập báo giá nhanh cho Model này">
                Báo Giá
              </button>
            </td>
          </tr>
        \`;
      }).join('');
    }

    function quickQuoteProduct(code) {
      navigateTab('new-quote');
      const select = document.getElementById('addProductToQuoteSelect');
      const db = getDB();
      const p = db.products.find(prod => prod.canonicalCode === code);
      if (p) {
        select.value = p.canonicalCode;
        addProductToQuotation();
        showToast('Đã thêm model ' + code + ' vào báo giá!');
      }
    }

    /* ALIASES TABLE */
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

    /* MULTI-TIER PRICE TABLE */
    function renderPriceTable() {
      const db = getDB();
      const key = document.getElementById('priceTypeSelector').value;
      const q = (document.getElementById('priceSearchInput').value || '').trim().toUpperCase();
      const tbody = document.getElementById('priceTableTbody');

      let filtered = db.products.filter(p => !q || p.canonicalCode.toUpperCase().includes(q) || p.name.toUpperCase().includes(q));

      tbody.innerHTML = filtered.map((p, idx) => {
        const curPrice = p[key] || 0;
        return \`
          <tr class="hover:bg-slate-50">
            <td class="py-3 px-3 text-slate-400 text-center">\${idx + 1}</td>
            <td class="py-3 px-3 font-mono font-bold text-sky-800">\${p.canonicalCode}</td>
            <td class="py-3 px-3 font-bold text-slate-800">\${escapeHtml(p.name)}</td>
            <td class="py-3 px-3 font-semibold text-slate-600">\${p.brand}</td>
            <td class="py-3 px-3 text-right font-mono font-bold text-sky-700 text-sm">\${formatVND(curPrice)}</td>
            <td class="py-3 px-3 text-right font-mono text-slate-400">\${formatVND(curPrice * 0.95)}</td>
            <td class="py-3 px-3 text-center font-bold text-emerald-600 text-[10px]">Chuẩn Giá</td>
            <td class="py-3 px-3 font-mono text-slate-500 text-[11px]">\${p.updatedAt ? p.updatedAt.substring(0, 10) : '2026-09-05'}</td>
            <td class="py-3 px-3 text-center">
              <span class="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">Hiện Hành</span>
            </td>
          </tr>
        \`;
      }).join('');
    }

    /* SMART EXCEL IMPORT */
    function handleExcelUpload(e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(evt) {
        try {
          const data = new Uint8Array(evt.target.result);
          const wb = XLSX.read(data, { type: 'array' });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

          if (!rows || rows.length < 2) {
            alert("File không có dữ liệu!");
            return;
          }
          processStaging(file.name, rows);
        } catch (err) {
          alert("Lỗi đọc file: " + err.message);
        }
      };
      reader.readAsArrayBuffer(file);
    }

    function processStaging(fileName, rawRows) {
      const db = getDB();
      const header = rawRows[0].map(h => String(h || '').trim().toUpperCase());
      const dataRows = rawRows.slice(1);

      let codeIdx = header.findIndex(h => h.includes('MODEL') || h.includes('MÃ') || h.includes('CODE'));
      let nameIdx = header.findIndex(h => h.includes('TÊN') || h.includes('NAME'));
      let priceIdx = header.findIndex(h => h.includes('NPP') || h.includes('GIÁ') || h.includes('ĐẠI LÝ'));

      if (codeIdx === -1) codeIdx = 1;
      if (nameIdx === -1) nameIdx = 3;
      if (priceIdx === -1) priceIdx = 4;

      let staging = [];
      let total = 0, valid = 0, warn = 0, err = 0, mapped = 0;
      let seen = new Set();

      dataRows.forEach((row, i) => {
        if (!row || row.length === 0 || !row[codeIdx]) return;
        total++;
        const rawCode = String(row[codeIdx] || '').trim();
        const rawName = String(row[nameIdx] || '').trim();
        const proposedPrice = parseFloat(String(row[priceIdx] || '').replace(/[^\d]/g, '')) || 0;

        let status = 'VALID';
        let issues = [];
        let identified = rawCode;
        let isAlias = false;

        if (seen.has(rawCode.toUpperCase())) {
          status = 'ERROR';
          issues.push('Trùng lặp Model trong file');
        }
        seen.add(rawCode.toUpperCase());

        const al = db.aliases.find(a => a.aliasCode.toUpperCase() === rawCode.toUpperCase());
        if (al) {
          identified = al.targetCode;
          isAlias = true;
          mapped++;
          if (status !== 'ERROR') status = 'WARNING';
          issues.push(\`Mã cũ "\${rawCode}" map sang mã chuẩn "\${al.targetCode}"\`);
        }

        const target = db.products.find(p => p.canonicalCode.toUpperCase() === identified.toUpperCase());
        if (!target) {
          status = 'ERROR';
          issues.push(\`Model "\${identified}" chưa tồn tại trong danh mục 65 sản phẩm\`);
        }

        if (proposedPrice <= 0) {
          status = 'ERROR';
          issues.push('Giá tiền bằng 0 hoặc không hợp lệ');
        }

        let oldPrice = target ? target.nppOnlinePrice : 0;
        let diffPct = 0;
        if (target && oldPrice > 0 && proposedPrice > 0) {
          const diff = Math.abs(proposedPrice - oldPrice);
          diffPct = (diff / oldPrice) * 100;
          if (diffPct > systemSettings.priceAlertThreshold) {
            if (status !== 'ERROR') status = 'WARNING';
            issues.push(\`Lệch giá \${diffPct.toFixed(1)}% (Vượt ngưỡng 10%)\`);
          }
        }

        if (status === 'ERROR') err++;
        else if (status === 'WARNING') warn++;
        else valid++;

        staging.push({
          rowNum: i + 2,
          rawCode,
          identified,
          rawName,
          oldPrice,
          newPrice: proposedPrice,
          diffPct,
          status,
          issues
        });
      });

      tempStagingData = { fileName, rows: staging, hasErrors: err > 0 };
      document.getElementById('importStatTotal').innerText = total;
      document.getElementById('importStatValid').innerText = valid;
      document.getElementById('importStatWarnings').innerText = warn;
      document.getElementById('importStatErrors').innerText = err;
      document.getElementById('importStatMapped').innerText = mapped;

      const commitBtn = document.getElementById('btnCommitImport');
      commitBtn.disabled = err > 0;
      commitBtn.className = err > 0 ? "px-4 py-1.5 bg-slate-300 text-slate-500 rounded-lg text-xs font-bold cursor-not-allowed" : "px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow";

      const tbody = document.getElementById('stagingTbody');
      tbody.innerHTML = staging.map(r => \`
        <tr class="\${r.status === 'ERROR' ? 'bg-rose-50' : (r.status === 'WARNING' ? 'bg-amber-50' : '')}">
          <td class="py-2.5 px-3 font-bold text-slate-500">\${r.rowNum}</td>
          <td class="py-2.5 px-3 font-bold">\${r.rawCode}</td>
          <td class="py-2.5 px-3 font-bold text-sky-800">\${r.identified}</td>
          <td class="py-2.5 px-3 truncate max-w-xs">\${escapeHtml(r.rawName)}</td>
          <td class="py-2.5 px-3 text-right font-mono">\${formatVND(r.oldPrice)}</td>
          <td class="py-2.5 px-3 text-right font-mono font-bold text-sky-700">\${formatVND(r.newPrice)}</td>
          <td class="py-2.5 px-3 text-center font-bold text-[10px]">\${r.diffPct > 0 ? r.diffPct.toFixed(1) + '%' : '-'}</td>
          <td class="py-2.5 px-3 text-[10px]">\${escapeHtml(r.issues.join(', ') || 'Hợp lệ')}</td>
        </tr>
      \`).join('');

      document.getElementById('importStagingArea').classList.remove('hidden');
    }

    function cancelImport() {
      tempStagingData = null;
      document.getElementById('importStagingArea').classList.add('hidden');
      document.getElementById('excelFileInput').value = '';
    }

    function commitImportData() {
      if (!tempStagingData || tempStagingData.hasErrors) return;
      const db = getDB();
      let count = 0;
      tempStagingData.rows.forEach(r => {
        const p = db.products.find(prod => prod.canonicalCode === r.identified);
        if (p) {
          p.nppOnlinePrice = r.newPrice;
          p.updatedAt = new Date().toISOString();
          count++;
        }
      });
      saveDB(db);
      recordAuditLog('IMPORT_EXCEL', 'CATALOG', \`Cập nhật thành công \${count} sản phẩm từ \${tempStagingData.fileName}\`);
      showToast(\`Đã cập nhật thành công \${count} mức giá mới!\`);
      cancelImport();
      navigateTab('products');
    }

    /* CUSTOMERS */
    function renderCustomerTable() {
      const db = getDB();
      const tbody = document.getElementById('customerTableTbody');
      tbody.innerHTML = db.customers.map(c => \`
        <tr class="hover:bg-slate-50">
          <td class="py-3 px-3 font-mono font-bold text-xs text-purple-700">\${c.code}</td>
          <td class="py-3 px-3 font-bold text-slate-800">\${escapeHtml(c.name)}</td>
          <td class="py-3 px-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">\${c.groupName}</span></td>
          <td class="py-3 px-3 font-bold text-sky-800">\${c.priceType === 'nppOnlinePrice' ? 'Giá NPP Online' : 'Giá Bán Facebook'}</td>
          <td class="py-3 px-3 font-bold text-emerald-700">\${c.defaultDiscount}%</td>
          <td class="py-3 px-3 font-mono text-slate-600">\${c.phone}</td>
          <td class="py-3 px-3 text-slate-500 truncate max-w-xs">\${escapeHtml(c.address)}</td>
          <td class="py-3 px-3 text-center">
            <button onclick="createQuoteForCustomer('\${c.id}')" class="px-2 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded text-xs font-bold">
              Báo Giá
            </button>
          </td>
        </tr>
      \`).join('');
    }

    function createQuoteForCustomer(id) {
      navigateTab('new-quote');
      document.getElementById('quoteCustomerSelect').value = id;
      handleQuotationCustomerChange(id);
    }

    /* QUOTATION ENGINE */
    function initNewQuotationTab() {
      const db = getDB();
      document.getElementById('quoteCodeDisplay').value = \`BG-LK-\${new Date().getFullYear()}\${String(new Date().getMonth()+1).padStart(2,'0')}-\${String(db.quotations.length + 1).padStart(3,'0')}\`;

      const custSelect = document.getElementById('quoteCustomerSelect');
      custSelect.innerHTML = '<option value="">-- Chọn đại lý đối tác --</option>' + db.customers.map(c => \`<option value="\${c.id}">\${c.code} - \${c.name}</option>\`).join('');

      const prodSelect = document.getElementById('addProductToQuoteSelect');
      prodSelect.innerHTML = '<option value="">-- Chọn trong 65 Model chính thức --</option>' + db.products.map(p => \`<option value="\${p.canonicalCode}">[\${p.brand}] \${p.canonicalCode} - \${p.name.substring(0, 32)} (FB: \${formatVND(p.facebookPrice)})</option>\`).join('');

      const future = new Date();
      future.setDate(future.getDate() + 15);
      document.getElementById('quoteValidUntil').value = future.toISOString().substring(0, 10);

      renderQuotationItemsTable();
    }

    function handleQuotationCustomerChange(id) {
      if (!id) return;
      const db = getDB();
      const c = db.customers.find(cust => cust.id === id);
      if (!c) return;

      document.getElementById('quoteCustomerName').value = c.name;
      document.getElementById('quoteCustomerPhone').value = c.phone;
      document.getElementById('quotePriceTypeSelect').value = c.priceType || 'facebookPrice';
      document.getElementById('quoteDiscountRate').value = c.defaultDiscount || 0;
      recalcQuotation();
    }

    function addProductToQuotation() {
      const select = document.getElementById('addProductToQuoteSelect');
      const code = select.value;
      if (!code) return;

      const db = getDB();
      const p = db.products.find(prod => prod.canonicalCode === code);
      if (!p) return;

      const priceType = document.getElementById('quotePriceTypeSelect').value;
      const unitPrice = p[priceType] || p.facebookPrice;

      const existing = quotationDraft.items.find(item => item.productCode === p.canonicalCode);
      if (existing) {
        existing.quantity += 1;
        existing.lineTotal = existing.quantity * existing.unitPrice * (1 - (existing.discountRate / 100));
      } else {
        quotationDraft.items.push({
          productCode: p.canonicalCode,
          brand: p.brand,
          productName: p.name,
          unit: p.unit || 'Cái',
          unitPrice: unitPrice,
          quantity: 10,
          discountRate: 0,
          lineTotal: 10 * unitPrice
        });
      }

      select.value = '';
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
          item.unitPrice = prod[priceType] || item.unitPrice;
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

      const custName = document.getElementById('quoteCustomerName').value.trim() || 'Khách Hàng Đối Tác';
      const custPhone = document.getElementById('quoteCustomerPhone').value.trim();
      const code = document.getElementById('quoteCodeDisplay').value;
      const validUntil = document.getElementById('quoteValidUntil').value;

      const newQuote = {
        id: 'q-' + Date.now(),
        code: code,
        customerName: custName,
        customerPhone: custPhone,
        priceType: document.getElementById('quotePriceTypeSelect').value,
        subtotal: quotationDraft.subtotal,
        discountRate: quotationDraft.discountRate,
        discountAmount: quotationDraft.discountAmount,
        vatRate: quotationDraft.vatRate,
        vatAmount: quotationDraft.vatAmount,
        shippingFee: quotationDraft.shippingFee,
        totalAmount: quotationDraft.totalAmount,
        validUntil: validUntil,
        creatorName: currentUser.fullName,
        createdAt: new Date().toISOString(),
        items: [...quotationDraft.items]
      };

      const db = getDB();
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
            <p class="text-slate-500">Đơn vị nhận: <strong class="text-slate-900">\${escapeHtml(quote.customerName)}</strong></p>
            <p class="text-slate-500 mt-0.5">Điện thoại: <strong class="text-slate-800">\${escapeHtml(quote.customerPhone || 'N/A')}</strong></p>
          </div>
          <div>
            <p class="text-slate-500">Đại diện báo giá: <strong class="text-slate-800">\${escapeHtml(quote.creatorName)}</strong></p>
            <p class="text-slate-500 mt-0.5">Chính sách: <strong class="text-sky-800 uppercase">\${quote.priceType}</strong></p>
          </div>
        </div>

        <table class="w-full text-xs text-left border border-slate-200 mb-4">
          <thead class="bg-sky-900 text-white font-bold text-[10px] uppercase">
            <tr>
              <th class="py-2 px-3 text-center">STT</th>
              <th class="py-2 px-3">Model</th>
              <th class="py-2 px-3">Tên Sản Phẩm</th>
              <th class="py-2 px-3 text-center">ĐVT</th>
              <th class="py-2 px-3 text-center">SL</th>
              <th class="py-2 px-3 text-right">Đơn Giá (VNĐ)</th>
              <th class="py-2 px-3 text-center">CK (%)</th>
              <th class="py-2 px-3 text-right">Thành Tiền (VNĐ)</th>
            </tr>
          </thead>
          <tbody>\${itemsHtml}</tbody>
        </table>

        <div class="flex justify-end mb-6">
          <div class="w-72 space-y-1 text-xs">
            <div class="flex justify-between text-slate-600">
              <span>Cộng tiền hàng:</span>
              <span class="font-mono font-bold">\${formatVND(quote.subtotal)}</span>
            </div>
            \${quote.discountAmount > 0 ? \`
              <div class="flex justify-between text-rose-600 font-semibold">
                <span>Chiết khấu (\${quote.discountRate}%):</span>
                <span class="font-mono">-\${formatVND(quote.discountAmount)}</span>
              </div>
            \` : ''}
            <div class="flex justify-between text-slate-600">
              <span>Thuế VAT (\${quote.vatRate}%):</span>
              <span class="font-mono font-bold">+\${formatVND(quote.vatAmount)}</span>
            </div>
            \${quote.shippingFee > 0 ? \`
              <div class="flex justify-between text-slate-600">
                <span>Phí vận chuyển:</span>
                <span class="font-mono font-bold">+\${formatVND(quote.shippingFee)}</span>
              </div>
            \` : ''}
            <div class="border-t-2 border-slate-900 pt-1.5 flex justify-between font-black text-sky-950 text-sm">
              <span>TỔNG THANH TOÁN:</span>
              <span class="text-sky-800 font-mono">\${formatVND(quote.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div class="border-t border-slate-200 pt-3 text-[10px] text-slate-600 space-y-1 mb-8">
          <p class="font-bold text-slate-800">ĐIỀU KHOẢN VẬN HÀNH:</p>
          <p>1. Giao hàng toàn quốc trong 24h - 48h. Miễn phí vận chuyển cho đơn hàng đại lý đạt định mức.</p>
          <p>2. Bảo hành chính hãng 12 tháng linh kiện điện tử, đổi mới 1:1 trong 7 ngày nếu lỗi nhà sản xuất.</p>
        </div>

        <div class="grid grid-cols-3 gap-4 text-center text-xs mt-6">
          <div>
            <p class="font-bold text-slate-800">NGƯỜI LẬP</p>
            <div class="h-12"></div>
            <p class="font-semibold text-slate-700">\${escapeHtml(quote.creatorName)}</p>
          </div>
          <div>
            <p class="font-bold text-slate-800">KẾ TOÁN</p>
            <div class="h-12"></div>
            <p class="font-semibold text-slate-700">Phòng Kế Toán LK</p>
          </div>
          <div>
            <p class="font-bold text-slate-800">ĐẠI DIỆN HÃNG</p>
            <div class="h-12"></div>
            <p class="font-semibold text-sky-900">Ban Giám Đốc Phân Phối</p>
          </div>
        </div>
      \`;

      document.getElementById('quotationPreviewModal').classList.remove('hidden');
      lucide.createIcons();
    }

    function closeQuotationPreviewModal() {
      document.getElementById('quotationPreviewModal').classList.add('hidden');
    }

    function renderQuotationTable() {
      const db = getDB();
      const tbody = document.getElementById('quotationTableTbody');
      if (db.quotations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="py-8 text-center text-slate-400">Chưa có báo giá nào được lưu. Nhấn "+ Tạo Báo Giá Mới"</td></tr>';
        return;
      }
      tbody.innerHTML = db.quotations.map(q => \`
        <tr class="hover:bg-slate-50">
          <td class="py-3 px-3 font-mono font-bold text-sky-800">\${q.code}</td>
          <td class="py-3 px-3 font-bold text-slate-800">\${escapeHtml(q.customerName)}</td>
          <td class="py-3 px-3 text-slate-500 font-mono">\${q.createdAt.substring(0, 10)}</td>
          <td class="py-3 px-3 text-slate-600">\${escapeHtml(q.creatorName)}</td>
          <td class="py-3 px-3 text-right font-mono font-bold text-sky-700 text-sm">\${formatVND(q.totalAmount)}</td>
          <td class="py-3 px-3 text-center"><span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Đã Lưu</span></td>
          <td class="py-3 px-3 text-center">
            <button onclick='openQuotationA4Preview(\${JSON.stringify(q)})' class="px-2.5 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded text-xs font-bold">
              Xem & In A4
            </button>
          </td>
        </tr>
      \`).join('');
    }

    /* AUDIT & SETTINGS */
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
      if (confirm("Khôi phục toàn bộ danh mục 65 sản phẩm gốc Lock&King & Takin?")) {
        const init = getInitialData();
        saveDB(init);
        showToast("Đã khôi phục dữ liệu gốc 65 model!");
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
</html>`;

fs.writeFileSync(path.join(__dirname, 'index.html'), htmlContent, 'utf-8');
console.log('index.html updated successfully with all 65 products and multi-tier pricing!');
