const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Đọc toàn bộ danh sách 65 sản phẩm từ index.html để có đầy đủ giá nhập mới và các thông số
const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
const start = indexHtml.indexOf('function getInitialData()');
const end = indexHtml.indexOf('function getDB()');
const fnCode = indexHtml.substring(start, end);
const fn = new Function(fnCode + '; return getInitialData();');
const data = fn();
const products = data.products;

// SHEET 1: BẢNG GIÁ CHUẨN 65 MÃ LOCK&KING & TAKIN
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

XLSX.utils.book_append_sheet(wb, ws1, 'Bang_Gia_Chuan_65_Ma');

// SHEET 2: BẢNG CHÊNH LỆCH TẦNG GIÁ (VỐN NHẬP - NPP ONLINE - FACEBOOK - SÀN TMĐT - NIÊM YẾT)
const rowsSheet2 = [
  ['STT', 'Thương Hiệu', 'Phân Loại', 'Model (Mã Sản Phẩm)', 'Tên Sản Phẩm', 'Giá Nhập Hiện Tại (VNĐ)', 'Giá NPP Online (VNĐ)', 'Giá Facebook (Làm Tròn Nghìn)', 'Lợi Nhuận FB vs NPP Online (VNĐ)', '% Biên LN FB / NPP Online', 'Giá Sàn TMĐT (+5% FB, Tròn Nghìn)', 'Chênh Lệch TMĐT vs FB (VNĐ)', '% Biên Độ TMĐT vs FB', 'Giá Niêm Yết (+15% TMĐT, Tròn Nghìn)']
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

  // 2. TMĐT: tăng 5% so với FB, làm tròn tăng đầu nghìn đuôi 000
  const tmdtRaw = fbRound * 1.05;
  const tmdtRound = Math.ceil(tmdtRaw / 1000) * 1000;
  const tmdtDiff = tmdtRound - fbRound;
  const tmdtDiffPct = fbRound > 0 ? ((tmdtDiff / fbRound) * 100).toFixed(1) + '%' : '0%';

  // 3. Niêm yết: tăng 15% so với TMĐT, làm tròn tăng đầu nghìn đuôi 000
  const retailRaw = tmdtRound * 1.15;
  const retailRound = Math.ceil(retailRaw / 1000) * 1000;
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
  { wch: 28 }, // Giá Niêm Yết (+15%)
  { wch: 24 }, // Chênh NY vs TMĐT
  { wch: 22 }  // % Biên độ NY vs TMĐT
];

XLSX.utils.book_append_sheet(wb, ws2, 'ChenhLech_Gia_FB_TMDT_NY');

const outPath = path.join(__dirname, 'bang_gia_chuan_lock_and_king_takin.xlsx');
XLSX.writeFile(wb, outPath);
console.log('Created bang_gia_chuan_lock_and_king_takin.xlsx with 2 sheets successfully!');
