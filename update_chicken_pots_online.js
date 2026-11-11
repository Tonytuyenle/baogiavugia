const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const XLSX = require('xlsx');

console.log('=== BẮT ĐẦU CẬP NHẬT 2 MÃ NỒI LUỘC GÀ CHO KÊNH ONLINE ===');

// 1. Dữ liệu chuẩn xác 100% từ Thông báo điều chỉnh giá nồi luộc gà Lock&King (LK-30NC1 & LK-32NC1)
const chickenPotsUpdates = [
  {
    stt: 1,
    code: 'LK-30NC1',
    name: 'Nồi luộc gà Lock&King size 30',
    oldNppOnlinePrice: 414000,
    nppOnlinePrice: 390000,
    facebookPrice: 690000,
    profitNPP: 300000,
    profitPct: '43.5%', // (690.000 - 390.000) / 690.000 = 43.48% -> trong thông báo làm tròn 43,5%
    tmdtPrice: 725000,   // 690.000 * 1.05 = 724.500 -> làm tròn nghìn = 725.000
    tmdtProfitPct: '46.2%',
    retailPrice: 870000  // 725.000 * 1.2 = 870.000
  },
  {
    stt: 2,
    code: 'LK-32NC1',
    name: 'Nồi luộc gà Lock&King size 32',
    oldNppOnlinePrice: 470000,
    nppOnlinePrice: 450000,
    facebookPrice: 810000,
    profitNPP: 360000,
    profitPct: '44.4%', // (810.000 - 450.000) / 810.000 = 44.44% -> trong thông báo làm tròn 44,4%
    tmdtPrice: 851000,   // 810.000 * 1.05 = 850.500 -> làm tròn nghìn = 851.000
    tmdtProfitPct: '47.1%',
    retailPrice: 1021000 // 851.000 * 1.2 = 1.021.200 -> làm tròn nghìn = 1.021.000
  }
];

// 2. Cập nhật real_catalog.json
const catalogPath = path.join(__dirname, 'real_catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

console.log(`\n1. Cập nhật real_catalog.json...`);

chickenPotsUpdates.forEach(u => {
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
  p.profitNPP = u.profitNPP;
  p.profitPct = u.profitPct;
  p.nppOnlineProfitRatio = u.profitPct;

  // Cập nhật chênh lệch Online vs Offline
  if (p.nppOfflinePrice !== undefined) {
    p.diffOnlineOffline = p.nppOfflinePrice - u.nppOnlinePrice;
    p.diffOnlineOfflinePct = u.nppOnlinePrice > 0 ? ((p.diffOnlineOffline / u.nppOnlinePrice) * 100).toFixed(1) + '%' : '0.0%';
  }

  // Cập nhật tỷ lệ lợi nhuận đại lý offline so với giá bán lẻ facebook
  if (p.dealerOfflinePrice && u.facebookPrice > 0) {
    p.dealerProfitRatio = (((u.facebookPrice - p.dealerOfflinePrice) / u.facebookPrice) * 100).toFixed(1) + '%';
  }

  p.updatedAt = '2026-11-12T00:00:00.000Z';

  console.log(`   ✅ [${u.code}] ${p.name}: NPP Cũ ${u.oldNppOnlinePrice.toLocaleString('vi-VN')}đ ➔ Mới ${u.nppOnlinePrice.toLocaleString('vi-VN')}đ | FB: ${u.facebookPrice.toLocaleString('vi-VN')}đ | TMĐT: ${u.tmdtPrice.toLocaleString('vi-VN')}đ | NY: ${u.retailPrice.toLocaleString('vi-VN')}đ | LN: ${u.profitNPP.toLocaleString('vi-VN')}đ (${u.profitPct})`);
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
const newStorageKey = 'LOCK_KING_PMS_DATA_v43_ONLINE_CHICKEN_POTS_20261111';
indexHtml = indexHtml.replace(
  /const STORAGE_KEY = 'LOCK_KING_PMS_DATA[^']*';/,
  `const STORAGE_KEY = '${newStorageKey}';`
);

// C. Cập nhật LATEST_BATCH_CODES
const updatedLatestCodes = "const LATEST_BATCH_CODES = ['LK-30NC1', 'LK-32NC1', 'LK-2433', 'LK-2633', 'LK-3212', 'LK-1068', 'LK-4160', 'LK-4209', 'LK-6201', 'LK-7812', 'LK-1030', 'LK-1033', 'LK-5301'];";
indexHtml = indexHtml.replace(/const LATEST_BATCH_CODES = \[.*?\];/, updatedLatestCodes);

// D. Cập nhật latestBatchDefinitions trong exportLatestBatchExcel()
const newBatchDefinitionsStr = `const latestBatchDefinitions = [
        { code: 'LK-30NC1', type: 'ĐIỀU CHỈNH GIẢM GIÁ', note: 'Nồi luộc gà size 30: Giá NPP giảm -24.000đ (-5.8%), tăng biên LN Facebook lên 43.5%, TMĐT lên 46.2%' },
        { code: 'LK-32NC1', type: 'ĐIỀU CHỈNH GIẢM GIÁ', note: 'Nồi luộc gà size 32: Giá NPP giảm -20.000đ (-4.3%), tăng biên LN Facebook lên 44.4%, TMĐT lên 47.1%' },
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

// 4. Cập nhật generate_excel.js
console.log(`\n3. Đồng bộ generate_excel.js...`);
let genExcelCode = fs.readFileSync('generate_excel.js', 'utf8');

// Cập nhật oldNppMap
chickenPotsUpdates.forEach(u => {
  const reg = new RegExp(`("${u.code}":\\s*)\\d+`);
  if (reg.test(genExcelCode)) {
    genExcelCode = genExcelCode.replace(reg, `$1${u.oldNppOnlinePrice}`);
  }
});

// Cập nhật latestBatchCodes
const genExcelBatchCodes = `const latestBatchCodes = [
  { code: 'LK-30NC1', type: 'ĐIỀU CHỈNH GIẢM GIÁ', note: 'Nồi luộc gà size 30: Giảm -24.000đ (-5.8%), LN FB 43.5%, TMĐT 46.2%' },
  { code: 'LK-32NC1', type: 'ĐIỀU CHỈNH GIẢM GIÁ', note: 'Nồi luộc gà size 32: Giảm -20.000đ (-4.3%), LN FB 44.4%, TMĐT 47.1%' },
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

// 6. Tạo file Excel chuyên biệt ghi nhận điều chỉnh 2 mã nồi luộc gà
console.log(`\n5. Tạo file Excel BANG_DIEU_CHINH_GIA_NOI_LUOC_GA_ONLINE_12_11_2026.xlsx...`);
const wbNotice = XLSX.utils.book_new();

const sheetNoticeData = [
  ['VU GIA COOPERATIVE COMPANY LIMITED'],
  ['THÔNG BÁO ĐIỀU CHỈNH GIÁ NỒI LUỘC GÀ LOCK&KING: LK-30NC1 & LK-32NC1'],
  ['(Áp dụng từ ngày 12/11/2026 cho kênh Online | Đơn vị tiền tệ: VNĐ)'],
  [],
  [
    'STT',
    'Mã SKU',
    'Tên Sản Phẩm',
    'Giá NPP Cũ (VNĐ)',
    'Giá NPP Điều Chỉnh (VNĐ)',
    'Mức Giảm (VNĐ)',
    '% Giảm Giá',
    'Giá Bán Facebook (VNĐ)',
    'Biên LN Facebook (%)',
    'Giá Sàn TMĐT (+5% FB, Tròn Nghìn)',
    'Biên LN Sàn TMĐT (%)',
    'Giá Niêm Yết (+20% TMĐT, Tròn Nghìn)'
  ]
];

chickenPotsUpdates.forEach((u, i) => {
  const diffNpp = u.nppOnlinePrice - u.oldNppOnlinePrice;
  const diffPct = ((diffNpp / u.oldNppOnlinePrice) * 100).toFixed(2) + '%';

  sheetNoticeData.push([
    i + 1,
    u.code,
    u.name,
    u.oldNppOnlinePrice,
    u.nppOnlinePrice,
    diffNpp,
    diffPct,
    u.facebookPrice,
    u.profitPct,
    u.tmdtPrice,
    u.tmdtProfitPct,
    u.retailPrice
  ]);
});

sheetNoticeData.push([]);
sheetNoticeData.push(['Ghi chú nghiệp vụ:']);
sheetNoticeData.push(['• Biên LN (%) = (Giá bán − Giá NPP điều chỉnh) / Giá bán.']);
sheetNoticeData.push(['• Giá sàn TMĐT = Giá bán Facebook × 105% (làm tròn lên hàng nghìn); biên LN sàn chưa trừ phí sàn.']);
sheetNoticeData.push(['• Không áp dụng chiết khấu: Giá điều chỉnh đã là giá ưu đãi, không tính vào doanh số hưởng chiết khấu.']);
sheetNoticeData.push([]);
sheetNoticeData.push(['', '', '', '', '', '', '', '', '', 'Hà Nội, ngày 11 tháng 11 năm 2026']);
sheetNoticeData.push(['', '', '', '', '', '', '', '', '', 'CÔNG TY TNHH HỢP TÁC VŨ GIA']);

const wsNotice = XLSX.utils.aoa_to_sheet(sheetNoticeData);

wsNotice['!cols'] = [
  { wch: 6 },  // STT
  { wch: 16 }, // Mã SKU
  { wch: 38 }, // Tên Sản Phẩm
  { wch: 18 }, // Giá NPP Cũ
  { wch: 22 }, // Giá NPP Mới
  { wch: 16 }, // Giảm giá
  { wch: 14 }, // % Giảm
  { wch: 22 }, // Giá FB
  { wch: 20 }, // Biên LN FB
  { wch: 26 }, // Giá TMĐT
  { wch: 20 }, // Biên LN TMĐT
  { wch: 26 }  // Giá Niêm Yết
];

XLSX.utils.book_append_sheet(wbNotice, wsNotice, 'DieuChinh_NoiLuocGa_Online');
XLSX.writeFile(wbNotice, path.join(__dirname, 'BANG_DIEU_CHINH_GIA_NOI_LUOC_GA_ONLINE_12_11_2026.xlsx'));
console.log('✅ Đã xuất file BANG_DIEU_CHINH_GIA_NOI_LUOC_GA_ONLINE_12_11_2026.xlsx thành công!');

console.log('\n========================================================================');
console.log('🎉 HOÀN TẤT CẬP NHẬT 2 MÃ NỒI LUỘC GÀ CHO KÊNH ONLINE THÀNH CÔNG 100%!');
console.log('========================================================================\n');
