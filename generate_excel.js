const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Đọc toàn bộ danh sách 56 sản phẩm từ index.html để có đầy đủ giá nhập mới và các thông số
const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
const start = indexHtml.indexOf('function getInitialData()');
const end = indexHtml.indexOf('function getDB()');
const fnCode = indexHtml.substring(start, end);
const fn = new Function(fnCode + '; return getInitialData();');
const data = fn();
const products = data.products;

// SHEET 1: BẢNG GIÁ CHUẨN 56 MÃ LOCK&KING & TAKIN (43 Lock&King + 13 Takin)
const rowsSheet1 = [
  ['STT', 'Thương Hiệu', 'Phân Loại', 'Model (Mã Sản Phẩm)', 'Tên Sản Phẩm', 'Giá NPP Online (VNĐ)', 'Giá Facebook (VNĐ)', 'Giá Sàn TMĐT (VNĐ)', 'Giá Niêm Yết (VNĐ)', 'Lợi Nhuận NPP (VNĐ)', '% LN NPP / Facebook']
];

products.forEach((p, idx) => {
  rowsSheet1.push([
    p.stt || (idx + 1),
    p.brand,
    p.categoryName,
    p.canonicalCode,
    p.name,
    p.nppOnlinePrice,
    p.facebookPrice,
    p.tmdtPrice,
    p.retailPrice,
    p.profitNPP,
    p.profitPct
  ]);
});

const wb = XLSX.utils.book_new();
const ws1 = XLSX.utils.aoa_to_sheet(rowsSheet1);

ws1['!cols'] = [
  { wch: 6 },  // STT
  { wch: 14 }, // Thương Hiệu
  { wch: 18 }, // Phân Loại
  { wch: 22 }, // Model
  { wch: 45 }, // Tên Sản Phẩm
  { wch: 20 }, // Giá NPP Online
  { wch: 18 }, // Giá Facebook
  { wch: 18 }, // Giá Sàn TMĐT
  { wch: 18 }, // Giá Niêm Yết
  { wch: 18 }, // Lợi Nhuận NPP
  { wch: 18 }  // % LN
];

XLSX.utils.book_append_sheet(wb, ws1, 'Bang_Gia_Chuan_56_Ma');

// SHEET 2: BẢNG CHÊNH LỆCH TẦNG GIÁ (VỐN NHẬP - NPP ONLINE - FACEBOOK - SÀN TMĐT - NIÊM YẾT)
const rowsSheet2 = [
  ['STT', 'Thương Hiệu', 'Phân Loại', 'Model (Mã Sản Phẩm)', 'Tên Sản Phẩm', 'Giá Nhập Hiện Tại (VNĐ)', 'Giá NPP Online (VNĐ)', 'Giá Facebook (Làm Tròn Nghìn)', 'Lợi Nhuận FB vs NPP Online (VNĐ)', '% Biên LN FB / NPP Online', 'Giá Sàn TMĐT (+5%/+8% FB, Tròn Nghìn)', 'Chênh Lệch TMĐT vs FB (VNĐ)', '% Biên Độ TMĐT vs FB', 'Giá Niêm Yết (+20% TMĐT, Tròn Nghìn)']
];

products.forEach((p, idx) => {
  const stt = p.stt || (idx + 1);
  const importPrice = p.newImportPrice || p.oldImportPrice || 0;
  const nppOnline = p.nppOnlinePrice || 0;

  // 1. Facebook: làm tròn tăng đầu nghìn đuôi 000, tính biên LN so với giá NPP Online
  const fbRaw = p.facebookPrice || 0;
  const fbRound = Math.ceil(fbRaw / 1000) * 1000;
  const fbProfit = fbRound - nppOnline;
  const fbMarginPct = fbRound > 0 ? ((fbProfit / fbRound) * 100).toFixed(1) + '%' : '0%';

  // 2. TMĐT: 5 mã đặc biệt (LK-3212, LK-2633, LK-2433, LK-3122, LK-3126) tăng 8%, các mã còn lại tăng 5% so với FB, làm tròn tăng đầu nghìn đuôi 000
  const is8Pct = ['LK-3212', 'LK-2633', 'LK-2433', 'LK-3122', 'LK-3126'].includes(p.canonicalCode);
  const tmdtRate = is8Pct ? 0.08 : 0.05;
  const tmdtRound = Math.ceil(Math.round(fbRound * (1 + tmdtRate)) / 1000) * 1000;
  const tmdtDiff = tmdtRound - fbRound;
  const tmdtDiffPct = fbRound > 0 ? ((tmdtDiff / fbRound) * 100).toFixed(1) + '%' : '0%';

  // 3. Niêm yết: tăng 20% so với TMĐT, làm tròn tăng đầu nghìn đuôi 000
  const retailRaw = tmdtRound * 1.20;
  const retailRound = Math.ceil(Math.round(retailRaw) / 1000) * 1000;
  const retailDiff = retailRound - tmdtRound;
  const retailDiffPct = tmdtRound > 0 ? ((retailDiff / tmdtRound) * 100).toFixed(1) + '%' : '0%';

  rowsSheet2.push([
    stt,
    p.brand,
    p.categoryName,
    p.canonicalCode,
    p.name,
    importPrice,
    nppOnline,
    fbRound,
    fbProfit,
    fbMarginPct,
    tmdtRound,
    tmdtDiff,
    tmdtDiffPct,
    retailRound
  ]);
});

const ws2 = XLSX.utils.aoa_to_sheet(rowsSheet2);
ws2['!cols'] = [
  { wch: 6 },  // STT
  { wch: 14 }, // Thương Hiệu
  { wch: 18 }, // Phân Loại
  { wch: 18 }, // Model
  { wch: 45 }, // Tên Sản Phẩm
  { wch: 22 }, // Giá Nhập
  { wch: 20 }, // NPP Online
  { wch: 24 }, // Giá FB (tròn)
  { wch: 22 }, // Lãi FB vs Nhập
  { wch: 22 }, // % Biên LN FB vs Nhập
  { wch: 26 }, // Giá Sàn TMĐT (+5%)
  { wch: 22 }, // Chênh TMĐT vs FB
  { wch: 20 }, // % Biên độ TMĐT vs FB
  { wch: 28 }, // Giá Niêm Yết (+20%)
  { wch: 24 }, // Chênh NY vs TMĐT
  { wch: 22 }  // % Biên độ NY vs TMĐT
];

XLSX.utils.book_append_sheet(wb, ws2, 'ChenhLech_Gia_FB_TMDT_NY');


// SHEET 3: BẢNG THỐNG KÊ BIẾN ĐỘNG GIÁ NPP ONLINE
const oldNppMap = {
  "LK-2202A": 260000,
  "LK-2433": 410000,
  "LK-2606A": 310000,
  "LK-2633": 470000,
  "LK-2808": 341000,
  "LK-2808SA KHÔNG NẮP": 412000,
  "LK-3003": 360000,
  "LK-3212": 645000,
  "LK-30NC1": 399000,
  "LK-32NC1": 455000,
  "LK-336A": 540000,
  "LK-3018A": 170000,
  "LK-3020A": 185000,
  "LK-3024": 230000,
  "LK-3116": 325000,
  "LK-3118": 372000,
  "LK-3120": 420000,
  "LK-3124": 500000,
  "LK-3338": 1240000,
  "LK-3386A": 530000,
  "LK-3568A": 940000,
  "LK-3122": 460000,
  "LK-3126": 525000,
  "LK-1038": 300000,
  "LK-92": 835000,
  "LK-586": 430000,
  "LK-588": 585000,
  "LK-668": 460000,
  "LK-688": 850000,
  "LK-1003": 197000,
  "LK-1030": 1020000,
  "LK-1033": 372000,
  "LK-1050": 890000,
  "LK-1068": 340000,
  "LK-4160": 1080000,
  "LK-4161": 850000,
  "LK-4208A": 510000,
  "LK-4209": 510000,
  "LK-5301": 600000,
  "LK-6015": 260000,
  "LK-6201": 685000,
  "LK-7812": 710000,
  "LK-9014": 1130000,
  "TK-2201": 260000,
  "TK-2662": 310000,
  "TK-2882C": 341000,
  "TK-3030C": 360000,
  "TK-036A": 515000,
  "TK-0324": 245000,
  "TK-0348A": 580000,
  "TK-0369": 535000,
  "TK-0488": 810000,
  "TK-468": 452000,
  "TK-469": 615000,
  "TK-1002": 158000,
  "TK-1003": 194000
};

const rowsSheet3 = [
  ['STT', 'Thương Hiệu', 'Phân Loại', 'Model (Mã Sản Phẩm)', 'Tên Sản Phẩm', 'Giá NPP Cũ (VNĐ)', 'Giá Điều Chỉnh Mới (VNĐ)', 'Chênh Lệch (VNĐ)', '% Tăng/Giảm', 'Trạng Thái', 'Giá Facebook (VNĐ)', 'Giá Sàn TMĐT (VNĐ)']
];

products.forEach((p, idx) => {
  const stt = p.stt || (idx + 1);
  const oldNpp = oldNppMap[p.canonicalCode] !== undefined ? oldNppMap[p.canonicalCode] : (p.nppOnlinePrice || 0);
  const newNpp = p.nppOnlinePrice || 0;
  const diff = newNpp - oldNpp;
  const diffPct = oldNpp > 0 ? ((diff / oldNpp) * 100).toFixed(1) + '%' : '0.0%';
  const statusStr = diff > 0 ? 'Tăng giá' : (diff < 0 ? 'Giảm giá' : 'Giữ nguyên');

  rowsSheet3.push([
    stt,
    p.brand,
    p.categoryName,
    p.canonicalCode,
    p.name,
    oldNpp,
    newNpp,
    diff,
    diffPct,
    statusStr,
    p.facebookPrice || 0,
    p.tmdtPrice || 0
  ]);
});

const ws3 = XLSX.utils.aoa_to_sheet(rowsSheet3);
ws3['!cols'] = [
  { wch: 6 },  // STT
  { wch: 14 }, // Thương Hiệu
  { wch: 18 }, // Phân Loại
  { wch: 20 }, // Model
  { wch: 45 }, // Tên Sản Phẩm
  { wch: 22 }, // Giá NPP Cũ
  { wch: 22 }, // Giá NPP Mới
  { wch: 18 }, // Chênh Lệch
  { wch: 14 }, // %
  { wch: 14 }, // Trạng Thái
  { wch: 20 }, // Giá FB
  { wch: 20 }  // Giá TMĐT
];

XLSX.utils.book_append_sheet(wb, ws3, 'BienDong_Gia_NPP');

const outPath = path.join(__dirname, 'bang_gia_chuan_lock_and_king_takin.xlsx');
XLSX.writeFile(wb, outPath);
console.log('Created bang_gia_chuan_lock_and_king_takin.xlsx with 3 sheets successfully!');
