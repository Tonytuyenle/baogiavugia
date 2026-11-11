const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const XLSX = require('xlsx');

console.log('=== BẮT ĐẦU CẬP NHẬT 11 MÃ KÊNH ONLINE THEO THÔNG BÁO NGÀY 10/11/2026 ===');

// 1. Dữ liệu chuẩn xác 100% từ Thông báo điều chỉnh giá kênh online Lock&King ngày 10/11/2026
const onlinePriceUpdates = [
  {
    stt: 1,
    code: 'LK-2433',
    name: 'Chảo Belly Lock&King',
    oldNppOnlinePrice: 395000,
    nppOnlinePrice: 380000,
    facebookPrice: 690000,
    profitPctExpected: '44.93%',
    tmdtPrice: 724500,
    retailPrice: 869000
  },
  {
    stt: 2,
    code: 'LK-2633',
    name: 'Chảo Belly Lock&King Titanium 26cm',
    oldNppOnlinePrice: 450000,
    nppOnlinePrice: 430000,
    facebookPrice: 790000,
    profitPctExpected: '45.57%',
    tmdtPrice: 829500,
    retailPrice: 995000
  },
  {
    stt: 3,
    code: 'LK-3212',
    name: 'Chảo xào lớn',
    oldNppOnlinePrice: 645000,
    nppOnlinePrice: 600000,
    facebookPrice: 1090000,
    profitPctExpected: '44.95%',
    tmdtPrice: 1144500,
    retailPrice: 1373000
  },
  {
    stt: 4,
    code: 'LK-1068',
    name: 'Ấm siêu tốc LK-1068',
    oldNppOnlinePrice: 310000,
    nppOnlinePrice: 280000,
    facebookPrice: 490000,
    profitPctExpected: '42.86%',
    tmdtPrice: 514500,
    retailPrice: 617000
  },
  {
    stt: 5,
    code: 'LK-4160',
    name: 'Nồi áp suất điện Lock&King LK-4160',
    oldNppOnlinePrice: 1000000,
    nppOnlinePrice: 980000,
    facebookPrice: 1790000,
    profitPctExpected: '45.25%',
    tmdtPrice: 1879500,
    retailPrice: 2255000
  },
  {
    stt: 6,
    code: 'LK-4209',
    name: 'Nồi Nấu Chậm Lock&King LK-4209',
    oldNppOnlinePrice: 510000,
    nppOnlinePrice: 485000,
    facebookPrice: 870000,
    profitPctExpected: '44.25%',
    tmdtPrice: 913500,
    retailPrice: 1096000
  },
  {
    stt: 7,
    code: 'LK-6201',
    name: 'Nồi nấu lẩu đi kèm xửng hấp',
    oldNppOnlinePrice: 685000,
    nppOnlinePrice: 660000,
    facebookPrice: 1190000,
    profitPctExpected: '44.54%',
    tmdtPrice: 1249500,
    retailPrice: 1499000
  },
  {
    stt: 8,
    code: 'LK-7812',
    name: 'Máy làm sữa hạt Lock&King',
    oldNppOnlinePrice: 660000,
    nppOnlinePrice: 575000,
    facebookPrice: 999000,
    profitPctExpected: '42.44%',
    tmdtPrice: 1048950,
    retailPrice: 1259000
  },
  {
    stt: 9,
    code: 'LK-1030',
    name: 'Bình thủy điện 3L Lock&King (4c/t)',
    oldNppOnlinePrice: 1020000,
    nppOnlinePrice: 960000,
    facebookPrice: 1690000,
    profitPctExpected: '43.20%',
    tmdtPrice: 1774500,
    retailPrice: 2129000
  },
  {
    stt: 10,
    code: 'LK-1033',
    name: 'Bộ đèn sưởi 3 bóng Lock&King',
    oldNppOnlinePrice: 320000,
    nppOnlinePrice: 310000,
    facebookPrice: 595000,
    profitPctExpected: '47.90%',
    tmdtPrice: 624750,
    retailPrice: 750000
  },
  {
    stt: 11,
    code: 'LK-5301',
    name: 'Sưởi để bàn',
    oldNppOnlinePrice: 600000,
    nppOnlinePrice: 550000,
    facebookPrice: 995000,
    profitPctExpected: '44.72%',
    tmdtPrice: 1044750,
    retailPrice: 1254000
  }
];

// 2. Cập nhật real_catalog.json
const catalogPath = path.join(__dirname, 'real_catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

console.log(`\n1. Cập nhật real_catalog.json (${catalog.length} sản phẩm)...`);

onlinePriceUpdates.forEach(u => {
  const p = catalog.find(x => x.canonicalCode === u.code);
  if (!p) {
    console.error(`❌ Không tìm thấy mã [${u.code}] trong real_catalog.json`);
    return;
  }

  p.oldNppOnlinePrice = u.oldNppOnlinePrice;
  p.nppOnlinePrice = u.nppOnlinePrice;
  p.facebookPrice = u.facebookPrice;
  p.tmdtPrice = u.tmdtPrice;
  p.retailPrice = u.retailPrice;

  const profit = u.facebookPrice - u.nppOnlinePrice;
  p.profitNPP = profit;
  const calcPct = ((profit / u.facebookPrice) * 100).toFixed(2) + '%';
  p.profitPct = calcPct;
  p.nppOnlineProfitRatio = calcPct;

  // Cập nhật chênh lệch Online vs Offline
  if (p.nppOfflinePrice !== undefined) {
    p.diffOnlineOffline = p.nppOfflinePrice - u.nppOnlinePrice;
    p.diffOnlineOfflinePct = u.nppOnlinePrice > 0 ? ((p.diffOnlineOffline / u.nppOnlinePrice) * 100).toFixed(1) + '%' : '0.0%';
  }

  // Cập nhật tỷ lệ lợi nhuận đại lý offline so với giá bán lẻ facebook
  if (p.dealerOfflinePrice && u.facebookPrice > 0) {
    p.dealerProfitRatio = (((u.facebookPrice - p.dealerOfflinePrice) / u.facebookPrice) * 100).toFixed(1) + '%';
  }

  p.updatedAt = '2026-11-10T08:00:00.000Z';

  console.log(`   ✅ [${u.code}] ${p.name}: NPP Cũ ${u.oldNppOnlinePrice.toLocaleString('vi-VN')}đ ➔ Mới ${u.nppOnlinePrice.toLocaleString('vi-VN')}đ | FB: ${u.facebookPrice.toLocaleString('vi-VN')}đ | TMĐT: ${u.tmdtPrice.toLocaleString('vi-VN')}đ | NY: ${u.retailPrice.toLocaleString('vi-VN')}đ | LN: ${profit.toLocaleString('vi-VN')}đ (${calcPct})`);
});

fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf8');
console.log(`💾 Đã ghi đè thành công real_catalog.json.`);

// 3. Cập nhật index.html
console.log(`\n2. Cập nhật index.html...`);
const indexPath = path.join(__dirname, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// A. Thay thế products trong getInitialData()
const startFn = indexHtml.indexOf('function getInitialData()');
const pStart = indexHtml.indexOf('"products": [', startFn);
let nextIdx = indexHtml.indexOf('"aliases": [', pStart);
if (nextIdx === -1) nextIdx = indexHtml.indexOf('aliases:', pStart);
if (nextIdx === -1) nextIdx = indexHtml.indexOf('"customers": [', pStart);
const pEnd = indexHtml.lastIndexOf('],', nextIdx);

if (pStart === -1 || pEnd === -1) {
  console.error('❌ Không xác định được vị trí "products": [...] trong index.html');
  process.exit(1);
}

const newProductsJson = '"products": ' + JSON.stringify(catalog, null, 8);
indexHtml = indexHtml.substring(0, pStart) + newProductsJson + indexHtml.substring(pEnd + 1);

// B. Nâng cấp STORAGE_KEY
const newStorageKey = 'LOCK_KING_PMS_DATA_v42_ONLINE_11MODELS_20261110';
indexHtml = indexHtml.replace(
  /const STORAGE_KEY = 'LOCK_KING_PMS_DATA[^']*';/,
  `const STORAGE_KEY = '${newStorageKey}';`
);

// C. Cập nhật LATEST_BATCH_CODES
const updatedLatestCodes = "const LATEST_BATCH_CODES = ['LK-2433', 'LK-2633', 'LK-3212', 'LK-1068', 'LK-4160', 'LK-4209', 'LK-6201', 'LK-7812', 'LK-1030', 'LK-1033', 'LK-5301'];";
indexHtml = indexHtml.replace(/const LATEST_BATCH_CODES = \[.*?\];/, updatedLatestCodes);

// D. Cập nhật latestBatchDefinitions trong exportLatestBatchExcel()
const newBatchDefinitionsStr = `const latestBatchDefinitions = [
        { code: 'LK-2433', type: 'ĐIỀU CHỈNH GIẢM GIÁ', note: 'Chảo Belly Lock&King: Giá NPP giảm -15.000đ (-3.8%), tăng biên LN NPP lên 44.93%' },
        { code: 'LK-2633', type: 'ĐIỀU CHỈNH GIẢM GIÁ', note: 'Chảo Belly Titanium 26cm: Giá NPP giảm -20.000đ (-4.4%), tăng biên LN NPP lên 45.57%' },
        { code: 'LK-3212', type: 'ĐIỀU CHỈNH GIẢM GIÁ', note: 'Chảo xào lớn: Giá NPP giảm -45.000đ (-7.0%), tăng biên LN NPP lên 44.95%' },
        { code: 'LK-1068', type: 'ĐIỀU CHỈNH GIẢM GIÁ', note: 'Ấm siêu tốc LK-1068: Giá NPP giảm -30.000đ (-9.7%), tăng biên LN NPP lên 42.86%' },
        { code: 'LK-4160', type: 'ĐIỀU CHỈNH GIẢM GIÁ', note: 'Nồi áp suất điện LK-4160: Giá NPP giảm -20.000đ (-2.0%), tăng biên LN NPP lên 45.25%' },
        { code: 'LK-4209', type: 'ĐIỀU CHỈNH GIẢM GIÁ', note: 'Nồi Nấu Chậm LK-4209: Giá NPP giảm -25.000đ (-4.9%), tăng biên LN NPP lên 44.25%' },
        { code: 'LK-6201', type: 'ĐIỀU CHỈNH GIẢM GIÁ', note: 'Nồi lẩu kèm xửng hấp LK-6201: Giá NPP giảm -25.000đ (-3.6%), tăng biên LN NPP lên 44.54%' },
        { code: 'LK-7812', type: 'ĐIỀU CHỈNH GIẢM GIÁ', note: 'Máy làm sữa hạt LK-7812: Giá NPP giảm -85.000đ (-12.9%), tăng biên LN NPP lên 42.44%' },
        { code: 'LK-1030', type: 'ĐIỀU CHỈNH GIẢM GIÁ', note: 'Bình thủy điện 3L LK-1030: Giá NPP giảm -60.000đ (-5.9%), tăng biên LN NPP lên 43.20%' },
        { code: 'LK-1033', type: 'ĐIỀU CHỈNH GIẢM GIÁ', note: 'Bộ đèn sưởi 3 bóng LK-1033: Giá NPP giảm -10.000đ (-3.1%), tăng biên LN NPP lên 47.90%' },
        { code: 'LK-5301', type: 'ĐIỀU CHỈNH GIẢM GIÁ', note: 'Sưởi để bàn LK-5301: Giá NPP giảm -50.000đ (-8.3%), tăng biên LN NPP lên 44.72%' }
      ];`;

indexHtml = indexHtml.replace(/const latestBatchDefinitions = \[[\s\S]*?\];/, newBatchDefinitionsStr);

fs.writeFileSync(indexPath, indexHtml, 'utf8');
console.log(`💾 Đã cập nhật thành công index.html (STORAGE_KEY: ${newStorageKey}).`);

// 4. Đồng bộ generate_excel.js
console.log(`\n3. Đồng bộ generate_excel.js và biểu giá chuẩn...`);
let genExcelCode = fs.readFileSync('generate_excel.js', 'utf8');

// Cập nhật oldNppMap trong generate_excel.js
onlinePriceUpdates.forEach(u => {
  const reg = new RegExp(`("${u.code}":\\s*)\\d+`);
  if (reg.test(genExcelCode)) {
    genExcelCode = genExcelCode.replace(reg, `$1${u.oldNppOnlinePrice}`);
  }
});

// Cập nhật latestBatchCodes trong generate_excel.js
const genExcelBatchCodes = `const latestBatchCodes = [
  { code: 'LK-2433', type: 'ĐIỀU CHỈNH GIẢM GIÁ', note: 'Chảo Belly: Giảm -15.000đ (-3.8%), LN NPP 44.93%' },
  { code: 'LK-2633', type: 'ĐIỀU CHỈNH GIẢM GIÁ', note: 'Chảo Belly 26cm: Giảm -20.000đ (-4.4%), LN NPP 45.57%' },
  { code: 'LK-3212', type: 'ĐIỀU CHỈNH GIẢM GIÁ', note: 'Chảo xào lớn: Giảm -45.000đ (-7.0%), LN NPP 44.95%' },
  { code: 'LK-1068', type: 'ĐIỀU CHỈNH GIẢM GIÁ', note: 'Ấm siêu tốc: Giảm -30.000đ (-9.7%), LN NPP 42.86%' },
  { code: 'LK-4160', type: 'ĐIỀU CHỈNH GIẢM GIÁ', note: 'Nồi áp suất điện: Giảm -20.000đ (-2.0%), LN NPP 45.25%' },
  { code: 'LK-4209', type: 'ĐIỀU CHỈNH GIẢM GIÁ', note: 'Nồi nấu chậm: Giảm -25.000đ (-4.9%), LN NPP 44.25%' },
  { code: 'LK-6201', type: 'ĐIỀU CHỈNH GIẢM GIÁ', note: 'Nồi lẩu xửng hấp: Giảm -25.000đ (-3.6%), LN NPP 44.54%' },
  { code: 'LK-7812', type: 'ĐIỀU CHỈNH GIẢM GIÁ', note: 'Máy làm sữa hạt: Giảm -85.000đ (-12.9%), LN NPP 42.44%' },
  { code: 'LK-1030', type: 'ĐIỀU CHỈNH GIẢM GIÁ', note: 'Bình thủy điện 3L: Giảm -60.000đ (-5.9%), LN NPP 43.20%' },
  { code: 'LK-1033', type: 'ĐIỀU CHỈNH GIẢM GIÁ', note: 'Bộ đèn sưởi 3 bóng: Giảm -10.000đ (-3.1%), LN NPP 47.90%' },
  { code: 'LK-5301', type: 'ĐIỀU CHỈNH GIẢM GIÁ', note: 'Sưởi để bàn: Giảm -50.000đ (-8.3%), LN NPP 44.72%' }
];`;

genExcelCode = genExcelCode.replace(/const latestBatchCodes = \[[\s\S]*?\];/, genExcelBatchCodes);
fs.writeFileSync('generate_excel.js', genExcelCode, 'utf8');

// Chạy generate_excel.js
execSync('node generate_excel.js', { stdio: 'inherit' });
console.log('✅ Đã tạo lại bang_gia_chuan_lock_and_king_takin.xlsx thành công!');

// 5. Cập nhật biểu mẫu create_price_update_template.js
console.log(`\n4. Cập nhật file mẫu Excel mau_cap_nhat_gia_theo_kenh.xlsx...`);
execSync('node create_price_update_template.js', { stdio: 'inherit' });
console.log('✅ Đã cập nhật mau_cap_nhat_gia_theo_kenh.xlsx thành công!');

// 6. Tạo file Excel chuyên biệt ghi nhận đợt điều chỉnh giá kênh Online ngày 10/11/2026
console.log(`\n5. Tạo file Excel BANG_DIEU_CHINH_GIA_ONLINE_10_11_2026.xlsx...`);
const wbNotice = XLSX.utils.book_new();

const sheetNoticeData = [
  ['CÔNG TY TNHH HỢP TÁC VŨ GIA'],
  ['BẢNG TỔNG HỢP CHI TIẾT ĐIỀU CHỈNH GIÁ KÊNH ONLINE'],
  ['(Kèm theo Thông báo điều chỉnh giá kênh Online áp dụng từ ngày 10/11/2026)'],
  [],
  [
    'STT',
    'Mã Model (SKU)',
    'Tên Sản Phẩm',
    'Phân Loại',
    'Giá NPP Cũ (VNĐ)',
    'Giá NPP Mới (VNĐ)',
    'Mức Giảm Giá (VNĐ)',
    '% Giảm Giá',
    'Giá Bán Facebook (VNĐ)',
    'Giá Sàn TMĐT (+5% FB)',
    'Giá Niêm Yết (+20% TMĐT)',
    'Lợi Nhuận NPP (VNĐ)',
    '% LN NPP / Facebook'
  ]
];

onlinePriceUpdates.forEach((u, i) => {
  const p = catalog.find(x => x.canonicalCode === u.code);
  const diffNpp = u.nppOnlinePrice - u.oldNppOnlinePrice;
  const diffPct = ((diffNpp / u.oldNppOnlinePrice) * 100).toFixed(2) + '%';
  const profit = u.facebookPrice - u.nppOnlinePrice;

  sheetNoticeData.push([
    i + 1,
    u.code,
    u.name,
    p ? p.categoryName : '',
    u.oldNppOnlinePrice,
    u.nppOnlinePrice,
    diffNpp,
    diffPct,
    u.facebookPrice,
    u.tmdtPrice,
    u.retailPrice,
    profit,
    u.profitPctExpected
  ]);
});

sheetNoticeData.push([]);
sheetNoticeData.push(['', '', '', '', '', '', '', '', '', '', 'Hà Nội, ngày 10 tháng 11 năm 2026']);
sheetNoticeData.push(['', '', '', '', '', '', '', '', '', '', 'CHỦ TỊCH HĐQT']);
sheetNoticeData.push(['', '', '', '', '', '', '', '', '', '', 'VŨ CÔNG TÂM']);

const wsNotice = XLSX.utils.aoa_to_sheet(sheetNoticeData);

wsNotice['!cols'] = [
  { wch: 6 },  // STT
  { wch: 16 }, // Mã Model
  { wch: 40 }, // Tên Sản Phẩm
  { wch: 18 }, // Phân Loại
  { wch: 20 }, // Giá NPP Cũ
  { wch: 20 }, // Giá NPP Mới
  { wch: 20 }, // Giảm giá
  { wch: 14 }, // % Giảm
  { wch: 22 }, // Giá FB
  { wch: 22 }, // Giá TMĐT
  { wch: 22 }, // Giá NY
  { wch: 20 }, // Lợi nhuận NPP
  { wch: 20 }  // % LN NPP
];

XLSX.utils.book_append_sheet(wbNotice, wsNotice, 'DieuChinh_Gia_Online_10_11_2026');
XLSX.writeFile(wbNotice, path.join(__dirname, 'BANG_DIEU_CHINH_GIA_ONLINE_10_11_2026.xlsx'));
console.log('✅ Đã xuất file BANG_DIEU_CHINH_GIA_ONLINE_10_11_2026.xlsx thành công!');

console.log('\n========================================================================');
console.log('🎉 HOÀN TẤT CẬP NHẬT 11 MÃ KÊNH ONLINE LÊN HỆ THỐNG VÀ PHẦN MỀM 100%!');
console.log('========================================================================\n');
