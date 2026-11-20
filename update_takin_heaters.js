const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const XLSX = require('xlsx');

console.log('=== BẮT ĐẦU SỬA GIÁ 2 MÃ SƯỞI GỐM TAKIN VỀ BẰNG GIÁ LOCK&KING ===');

// 1. Đọc real_catalog.json
const catalogPath = path.join(__dirname, 'real_catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

// Lấy thông tin giá của 2 mã Lock&King tương ứng
const lk586 = catalog.find(x => x.canonicalCode === 'LK-586');
const lk588 = catalog.find(x => x.canonicalCode === 'LK-588');

if (!lk586 || !lk588) {
  console.error('❌ Không tìm thấy LK-586 hoặc LK-588 trong catalog!');
  process.exit(1);
}

console.log(`\n📋 Giá chuẩn Lock&King:`);
console.log(`- LK-586 (Sưởi gốm thấp): NPP ON=${lk586.nppOnlinePrice.toLocaleString('vi-VN')}đ | FB=${lk586.facebookPrice.toLocaleString('vi-VN')}đ | TMĐT=${lk586.tmdtPrice.toLocaleString('vi-VN')}đ | NY=${lk586.retailPrice.toLocaleString('vi-VN')}đ | NPP OFF=${lk586.nppOfflinePrice.toLocaleString('vi-VN')}đ | ĐL OFF=${lk586.dealerOfflinePrice.toLocaleString('vi-VN')}đ`);
console.log(`- LK-588 (Sưởi gốm cao):  NPP ON=${lk588.nppOnlinePrice.toLocaleString('vi-VN')}đ | FB=${lk588.facebookPrice.toLocaleString('vi-VN')}đ | TMĐT=${lk588.tmdtPrice.toLocaleString('vi-VN')}đ | NY=${lk588.retailPrice.toLocaleString('vi-VN')}đ | NPP OFF=${lk588.nppOfflinePrice.toLocaleString('vi-VN')}đ | ĐL OFF=${lk588.dealerOfflinePrice.toLocaleString('vi-VN')}đ`);

// Cập nhật TK-468 theo LK-586
const tk468 = catalog.find(x => x.canonicalCode === 'TK-468');
if (tk468) {
  tk468.oldNppOnlinePrice = tk468.nppOnlinePrice || 452000;
  tk468.nppOnlinePrice = lk586.nppOnlinePrice; // 430000
  tk468.facebookPrice = lk586.facebookPrice;   // 745000
  tk468.tmdtPrice = lk586.tmdtPrice;           // 783000
  tk468.retailPrice = lk586.retailPrice;       // 940000
  tk468.profitNPP = lk586.profitNPP;           // 315000
  tk468.profitPct = lk586.profitPct;           // 42.3%
  tk468.nppOnlineProfitRatio = lk586.nppOnlineProfitRatio;
  tk468.nppOfflinePrice = lk586.nppOfflinePrice; // 430000
  tk468.diffOnlineOffline = 0;
  tk468.diffOnlineOfflinePct = '0.0%';
  tk468.dealerOfflinePrice = lk586.dealerOfflinePrice; // 516000
  tk468.dealerProfitRatio = lk586.dealerProfitRatio;   // 30.7%
  tk468.updatedAt = new Date().toISOString();
  console.log(`\n✅ Đã cập nhật TK-468: NPP Online 452.000đ ➔ ${tk468.nppOnlinePrice.toLocaleString('vi-VN')}đ, FB 900.000đ ➔ ${tk468.facebookPrice.toLocaleString('vi-VN')}đ, TMĐT 945.000đ ➔ ${tk468.tmdtPrice.toLocaleString('vi-VN')}đ, NY 1.134.000đ ➔ ${tk468.retailPrice.toLocaleString('vi-VN')}đ, NPP Off 452.000đ ➔ ${tk468.nppOfflinePrice.toLocaleString('vi-VN')}đ, ĐL Off 542.400đ ➔ ${tk468.dealerOfflinePrice.toLocaleString('vi-VN')}đ`);
}

// Cập nhật TK-469 theo LK-588
const tk469 = catalog.find(x => x.canonicalCode === 'TK-469');
if (tk469) {
  tk469.oldNppOnlinePrice = tk469.nppOnlinePrice || 615000;
  tk469.nppOnlinePrice = lk588.nppOnlinePrice; // 585000
  tk469.facebookPrice = lk588.facebookPrice;   // 1050000
  tk469.tmdtPrice = lk588.tmdtPrice;           // 1103000
  tk469.retailPrice = lk588.retailPrice;       // 1324000
  tk469.profitNPP = lk588.profitNPP;           // 465000
  tk469.profitPct = lk588.profitPct;           // 44.3%
  tk469.nppOnlineProfitRatio = lk588.nppOnlineProfitRatio;
  tk469.nppOfflinePrice = lk588.nppOfflinePrice; // 585000
  tk469.diffOnlineOffline = 0;
  tk469.diffOnlineOfflinePct = '0.0%';
  tk469.dealerOfflinePrice = lk588.dealerOfflinePrice; // 702000
  tk469.dealerProfitRatio = lk588.dealerProfitRatio;   // 33.1%
  tk469.updatedAt = new Date().toISOString();
  console.log(`✅ Đã cập nhật TK-469: NPP Online 615.000đ ➔ ${tk469.nppOnlinePrice.toLocaleString('vi-VN')}đ, FB ${tk469.facebookPrice.toLocaleString('vi-VN')}đ (giữ nguyên), TMĐT ${tk469.tmdtPrice.toLocaleString('vi-VN')}đ (giữ nguyên), NY ${tk469.retailPrice.toLocaleString('vi-VN')}đ (giữ nguyên), NPP Off 615.000đ ➔ ${tk469.nppOfflinePrice.toLocaleString('vi-VN')}đ, ĐL Off 738.000đ ➔ ${tk469.dealerOfflinePrice.toLocaleString('vi-VN')}đ`);
}

// Lưu real_catalog.json
fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf8');
console.log(`💾 Đã lưu real_catalog.json.`);

// 2. Cập nhật index.html
const indexPath = path.join(__dirname, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

const startFn = indexHtml.indexOf('function getInitialData()');
const pStart = indexHtml.indexOf('"products": [', startFn);
let nextIdx = indexHtml.indexOf('"aliases": [', pStart);
if (nextIdx === -1) nextIdx = indexHtml.indexOf('aliases:', pStart);
if (nextIdx === -1) nextIdx = indexHtml.indexOf('"customers": [', pStart);
const pEnd = indexHtml.lastIndexOf('],', nextIdx);

if (pStart === -1 || pEnd === -1) {
  console.error('❌ Không tìm thấy vị trí "products": [...] trong index.html');
  process.exit(1);
}

const newProductsJson = '"products": ' + JSON.stringify(catalog, null, 8);
indexHtml = indexHtml.substring(0, pStart) + newProductsJson + indexHtml.substring(pEnd + 1);

// Nâng cấp STORAGE_KEY
const newStorageKey = 'LOCK_KING_PMS_DATA_v44_UPDATE_TAKIN_HEATERS_20261120';
indexHtml = indexHtml.replace(
  /const STORAGE_KEY = 'LOCK_KING_PMS_DATA[^']*';/,
  `const STORAGE_KEY = '${newStorageKey}';`
);

// Bổ sung TK-468, TK-469 vào LATEST_BATCH_CODES
const updatedLatestCodes = "const LATEST_BATCH_CODES = ['TK-468', 'TK-469', 'LK-30NC1', 'LK-32NC1', 'LK-2433', 'LK-2633', 'LK-3212', 'LK-1068', 'LK-4160', 'LK-4209', 'LK-6201', 'LK-7812', 'LK-1030', 'LK-1033', 'LK-5301'];";
indexHtml = indexHtml.replace(/const LATEST_BATCH_CODES = \[.*?\];/, updatedLatestCodes);

// Bổ sung vào latestBatchDefinitions
const newBatchDefinitionsStr = `const latestBatchDefinitions = [
        { code: 'TK-468', type: 'ĐIỀU CHỈNH GIẢM GIÁ', note: 'Sưởi gốm thấp Takin: Điều chỉnh về bằng giá LK-586 (NPP 430k, FB 745k, TMĐT 783k, NY 940k, ĐL 516k)' },
        { code: 'TK-469', type: 'ĐIỀU CHỈNH GIẢM GIÁ', note: 'Sưởi gốm thân cao Takin: Điều chỉnh về bằng giá LK-588 (NPP 585k, FB 1.050k, TMĐT 1.103k, NY 1.324k, ĐL 702k)' },
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
console.log(`💾 Đã cập nhật index.html (STORAGE_KEY: ${newStorageKey}).`);

// 3. Cập nhật generate_excel.js
let genExcelCode = fs.readFileSync('generate_excel.js', 'utf8');

// Bổ sung TK-468, TK-469 vào latestBatchCodes trong generate_excel.js
const genExcelBatchCodes = `const latestBatchCodes = [
  { code: 'TK-468', type: 'ĐIỀU CHỈNH GIẢM GIÁ', note: 'Sưởi gốm thấp Takin: Bằng giá LK-586 (NPP 430k, FB 745k, TMĐT 783k, NY 940k, ĐL 516k)' },
  { code: 'TK-469', type: 'ĐIỀU CHỈNH GIẢM GIÁ', note: 'Sưởi gốm cao Takin: Bằng giá LK-588 (NPP 585k, FB 1.050k, TMĐT 1.103k, NY 1.324k, ĐL 702k)' },
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

// Chạy generate_excel.js và create_price_update_template.js
const nodeBin = path.join(__dirname, 'node.exe');
execSync(`"${nodeBin}" generate_excel.js`, { stdio: 'inherit' });
console.log('✅ Đã tạo lại bang_gia_chuan_lock_and_king_takin.xlsx thành công!');

execSync(`"${nodeBin}" create_price_update_template.js`, { stdio: 'inherit' });
console.log('✅ Đã cập nhật mau_cap_nhat_gia_theo_kenh.xlsx thành công!');

console.log('\n========================================================================');
console.log('🎉 HOÀN TẤT ĐỒNG BỘ GIÁ 2 MÃ SƯỞI GỐM TAKIN VỀ BẰNG LOCK&KING 100%!');
console.log('========================================================================\n');
