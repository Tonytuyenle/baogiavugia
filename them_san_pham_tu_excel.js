/**
 * SCRIPT TỰ ĐỘNG THÊM SẢN PHẨM MỚI TỪ FILE EXCEL LÊN PHẦN MỀM
 * CÔNG TY TNHH HỢP TÁC VŨ GIA
 *
 * Cách chạy:
 *   .\node.exe them_san_pham_tu_excel.js [duong_dan_file_excel]
 * (Mặc định đọc file 'MAU_THEM_SAN_PHAM_MOI_VU_GIA.xlsx' hoặc 'mau_them_san_pham_moi.xlsx')
 */

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const { execSync } = require('child_process');

const inputArg = process.argv[2];
let excelFilePath = inputArg ? path.resolve(inputArg) : path.join(__dirname, 'MAU_THEM_SAN_PHAM_MOI_VU_GIA.xlsx');
if (!fs.existsSync(excelFilePath)) {
  excelFilePath = path.join(__dirname, 'mau_them_san_pham_moi.xlsx');
}

if (!fs.existsSync(excelFilePath)) {
  console.error(`❌ LỖI: Không tìm thấy file Excel tại đường dẫn: ${excelFilePath}`);
  process.exit(1);
}

console.log(`\n========================================================================`);
console.log(`🚀 BẮT ĐẦU QUÁ TRÌNH NHẬP SẢN PHẨM MỚI TỪ FILE EXCEL VÀO PHẦN MỀM`);
console.log(`📂 Nguồn file: ${excelFilePath}`);
console.log(`========================================================================\n`);

// 1. Đọc file Excel
const wb = XLSX.readFile(excelFilePath);

let targetSheetName = wb.SheetNames[0];
if (wb.SheetNames.includes('Nhap_Ma_Moi')) {
  targetSheetName = 'Nhap_Ma_Moi';
}

console.log(`📑 Đang xử lý dữ liệu từ Sheet: [${targetSheetName}]`);
const ws = wb.Sheets[targetSheetName];
const rawRows = XLSX.utils.sheet_to_json(ws, { header: 1 });

if (!rawRows || rawRows.length < 2) {
  console.error(`❌ Sheet [${targetSheetName}] không có đủ dữ liệu để xử lý.`);
  process.exit(1);
}

// 2. Tìm dòng tiêu đề
let headerRowIdx = -1;
for (let i = 0; i < Math.min(15, rawRows.length); i++) {
  const row = rawRows[i] || [];
  const cells = row.map(c => String(c || '').trim().toLowerCase());
  if (cells.some(c => c.includes('model') || c.includes('sku') || c.includes('mã hàng')) && cells.some(c => c.includes('giá') || c.includes('tên'))) {
    headerRowIdx = i;
    break;
  }
}

if (headerRowIdx === -1) {
  console.error(`❌ Không tìm thấy dòng tiêu đề hợp lệ trong file Excel.`);
  process.exit(1);
}

const headerRow = rawRows[headerRowIdx].map(h => String(h || '').trim());
console.log(`📍 Dòng tiêu đề tại dòng ${headerRowIdx + 1}:`);

function findCol(keywords) {
  return headerRow.findIndex(h => {
    const s = h.toLowerCase();
    return keywords.some(k => s.includes(k.toLowerCase()));
  });
}

const colModel = findCol(['mã model', 'model', 'sku', 'mã sp', 'mã hàng']);
const colName = findCol(['tên sản phẩm', 'tên hàng', 'tên sp', 'tên']);
const colBrand = findCol(['thương hiệu', 'brand', 'hãng']);
const colCategory = findCol(['nhóm hàng', 'phân loại', 'nhóm', 'loại', 'danh mục']);
const colUnit = findCol(['đvt', 'đơn vị tính', 'đơn vị']);
const colCost = findCol(['giá vốn', 'giá nhập', 'vốn', 'nhập']);
const colNppOnline = findCol(['[online] giá npp', 'giá npp online', 'npp online', 'giá npp']);
const colFacebook = findCol(['[online] giá facebook', 'giá facebook', 'facebook', 'fb', 'giá bán fb']);
const colTmdt = findCol(['[online] giá sàn', 'giá sàn tmđt', 'sàn tmđt', 'tmđt']);
const colRetail = findCol(['[online] giá niêm yết', 'giá niêm yết', 'niêm yết']);
const colNppOffline = findCol(['[offline] giá npp', 'giá npp offline', 'npp offline']);
const colDealerOffline = findCol(['[offline] giá đại lý', 'giá đại lý offline', 'đại lý offline']);
const colSpecs = findCol(['thông số kỹ thuật', 'thông số', 'đặc điểm', 'specs']);
const colImage = findCol(['file ảnh', 'ảnh', 'hình ảnh', 'image']);
const colNote = findCol(['ghi chú', 'lý do', 'note']);

function parsePrice(val) {
  if (val === undefined || val === null || val === '') return null;
  const num = parseFloat(String(val).replace(/[^\d.]/g, ''));
  return isNaN(num) || num <= 0 ? null : Math.round(num);
}

// 3. Đọc danh mục hiện tại từ real_catalog.json
const catalogPath = path.join(__dirname, 'real_catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const addedProducts = [];
const updatedProducts = [];

for (let i = headerRowIdx + 1; i < rawRows.length; i++) {
  const row = rawRows[i];
  if (!row || row.length === 0) continue;

  const rawCode = colModel !== -1 ? String(row[colModel] || '').trim() : '';
  if (!rawCode) continue;

  const rawName = colName !== -1 ? String(row[colName] || '').trim() : '';
  const brand = colBrand !== -1 && row[colBrand] ? String(row[colBrand]).trim() : (rawCode.toUpperCase().startsWith('TK') ? 'Takin' : 'Lock&King');
  const categoryName = colCategory !== -1 && row[colCategory] ? String(row[colCategory]).trim().toUpperCase() : 'ĐỒ ĐIỆN';
  const unit = colUnit !== -1 && row[colUnit] ? String(row[colUnit]).trim() : 'Chiếc';

  const cost = colCost !== -1 ? parsePrice(row[colCost]) : null;
  const nppOn = colNppOnline !== -1 ? parsePrice(row[colNppOnline]) : null;
  const fb = colFacebook !== -1 ? parsePrice(row[colFacebook]) : null;
  let tmdt = colTmdt !== -1 ? parsePrice(row[colTmdt]) : null;
  let retail = colRetail !== -1 ? parsePrice(row[colRetail]) : null;
  const nppOff = colNppOffline !== -1 ? parsePrice(row[colNppOffline]) : (nppOn || 0);
  let dlOff = colDealerOffline !== -1 ? parsePrice(row[colDealerOffline]) : null;

  const specs = colSpecs !== -1 && row[colSpecs] ? String(row[colSpecs]).trim() : (rawName || rawCode);
  let image = colImage !== -1 && row[colImage] ? String(row[colImage]).trim() : `images/${rawCode}.png`;
  if (image && !image.startsWith('images/') && !image.startsWith('data:') && !image.startsWith('http')) {
    image = 'images/' + image;
  }
  const note = colNote !== -1 && row[colNote] ? String(row[colNote]).trim() : '';

  // Tự động tính toán các tầng giá phụ nếu chưa điền
  if (fb && !tmdt) {
    tmdt = Math.ceil(Math.round(fb * 1.05) / 1000) * 1000;
  }
  if (tmdt && !retail) {
    retail = Math.ceil(Math.round(tmdt * 1.20) / 1000) * 1000;
  }
  if (nppOff && !dlOff) {
    dlOff = Math.round(nppOff * 1.20);
  }

  const profitNPP = (fb || 0) - (nppOn || 0);
  const profitPct = fb && fb > 0 ? ((profitNPP / fb) * 100).toFixed(1) + '%' : '0.0%';
  const dealerProfitRatio = dlOff && fb && fb > 0 ? (((fb - dlOff) / fb) * 100).toFixed(1) + '%' : '30.0%';

  // Kiểm tra mã đã có trong catalog chưa
  const cleanCode = rawCode.toUpperCase().replace(/\s+/g, '');
  let existing = catalog.find(p => p.canonicalCode.toUpperCase().replace(/\s+/g, '') === cleanCode);

  if (existing) {
    // Cập nhật sản phẩm có sẵn
    if (nppOn) { existing.oldNppOnlinePrice = existing.nppOnlinePrice; existing.nppOnlinePrice = nppOn; }
    if (fb) existing.facebookPrice = fb;
    if (tmdt) existing.tmdtPrice = tmdt;
    if (retail) existing.retailPrice = retail;
    if (nppOff) existing.nppOfflinePrice = nppOff;
    if (dlOff) existing.dealerOfflinePrice = dlOff;
    if (cost) { existing.oldImportPrice = existing.newImportPrice || cost; existing.newImportPrice = cost; }
    if (rawName) existing.name = rawName;
    if (specs) existing.specs = specs;
    if (image && image !== `images/${rawCode}.png`) existing.image = image;

    existing.profitNPP = (existing.facebookPrice || 0) - (existing.nppOnlinePrice || 0);
    existing.profitPct = existing.facebookPrice > 0 ? (((existing.profitNPP) / existing.facebookPrice) * 100).toFixed(1) + '%' : '0.0%';
    existing.nppOnlineProfitRatio = existing.profitPct;
    existing.updatedAt = new Date().toISOString();

    updatedProducts.push(existing);
  } else {
    // Thêm mã mới hoàn toàn
    const newProd = {
      stt: catalog.length + 1,
      canonicalCode: rawCode,
      image: image || `images/${rawCode}.png`,
      name: rawName || rawCode,
      brand: brand,
      categoryName: categoryName,
      unit: unit,
      nppOnlinePrice: nppOn || 0,
      facebookPrice: fb || 0,
      tmdtPrice: tmdt || 0,
      retailPrice: retail || 0,
      profitNPP: profitNPP,
      profitPct: profitPct,
      nppOnlineProfitRatio: profitPct,
      nppOfflinePrice: nppOff,
      diffOnlineOffline: (nppOff || 0) - (nppOn || 0),
      diffOnlineOfflinePct: nppOn > 0 ? ((((nppOff || 0) - nppOn) / nppOn) * 100).toFixed(1) + '%' : '0.0%',
      dealerOfflinePrice: dlOff || Math.round((nppOff || 0) * 1.2),
      dealerProfitRatio: dealerProfitRatio,
      oldImportPrice: cost || 0,
      newImportPrice: cost || 0,
      importPriceDiff: 0,
      importPriceDiffPct: '0.00',
      specs: specs,
      status: 'ACTIVE',
      updatedAt: new Date().toISOString(),
      oldNppOnlinePrice: 0,
      note: note
    };

    catalog.push(newProd);
    addedProducts.push(newProd);
  }
}

console.log(`\n📊 KẾT QUẢ XỬ LÝ:`);
console.log(`   - Số mã mới được thêm vào hệ thống: ${addedProducts.length}`);
console.log(`   - Số mã đã có được cập nhật giá: ${updatedProducts.length}`);

if (addedProducts.length === 0 && updatedProducts.length === 0) {
  console.log(`\n⚠️ Không tìm thấy dòng sản phẩm hợp lệ nào trong file Excel.`);
  process.exit(0);
}

// In danh sách mã mới
if (addedProducts.length > 0) {
  console.log(`\n✨ DANH SÁCH MÃ MỚI BỔ SUNG:`);
  addedProducts.forEach((p, idx) => {
    console.log(`   ${idx + 1}. [${p.canonicalCode}] - ${p.name} (${p.brand} | ${p.categoryName})`);
    console.log(`      • Giá NPP Online: ${p.nppOnlinePrice.toLocaleString('vi-VN')} đ | Giá FB: ${p.facebookPrice.toLocaleString('vi-VN')} đ | Lãi: ${p.profitNPP.toLocaleString('vi-VN')} đ (${p.profitPct})`);
    console.log(`      • Giá Sàn TMĐT: ${p.tmdtPrice.toLocaleString('vi-VN')} đ | Giá Niêm Yết: ${p.retailPrice.toLocaleString('vi-VN')} đ`);
  });
}

// Lưu real_catalog.json
fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf8');
console.log(`\n💾 Đã lưu real_catalog.json (Tổng số: ${catalog.length} sản phẩm).`);

// Cập nhật index.html
const indexPath = path.join(__dirname, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

const startFn = indexHtml.indexOf('function getInitialData()');
const pStart = indexHtml.indexOf('"products": [', startFn);
let nextIdx = indexHtml.indexOf('"aliases": [', pStart);
if (nextIdx === -1) nextIdx = indexHtml.indexOf('aliases:', pStart);
if (nextIdx === -1) nextIdx = indexHtml.indexOf('"customers": [', pStart);
const pEnd = indexHtml.lastIndexOf('],', nextIdx);

if (pStart !== -1 && pEnd !== -1) {
  const newProductsJson = '"products": ' + JSON.stringify(catalog, null, 8);
  indexHtml = indexHtml.substring(0, pStart) + newProductsJson + indexHtml.substring(pEnd + 1);

  const timeStampKey = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  const newStorageKey = `LOCK_KING_PMS_DATA_v50_NEW_PRODUCTS_${timeStampKey}`;
  indexHtml = indexHtml.replace(
    /const STORAGE_KEY = 'LOCK_KING_PMS_DATA[^']*';/,
    `const STORAGE_KEY = '${newStorageKey}';`
  );

  fs.writeFileSync(indexPath, indexHtml, 'utf8');
  console.log(`💾 Đã cập nhật index.html (STORAGE_KEY: ${newStorageKey}).`);
}

// Đồng bộ các file biểu giá hệ thống
const nodeBin = path.join(__dirname, 'node.exe');
try {
  execSync(`"${nodeBin}" generate_excel.js`, { stdio: 'inherit' });
  console.log('✅ Đã tạo lại bang_gia_chuan_lock_and_king_takin.xlsx thành công!');
} catch (e) {
  console.warn('Lỗi đồng bộ generate_excel.js:', e.message);
}

try {
  execSync(`"${nodeBin}" create_price_update_template.js`, { stdio: 'inherit' });
  console.log('✅ Đã cập nhật mẫu mau_cap_nhat_gia_theo_kenh.xlsx thành công!');
} catch (e) {
  console.warn('Lỗi đồng bộ create_price_update_template.js:', e.message);
}

console.log(`\n========================================================================`);
console.log(`🎉 HOÀN TẤT BỔ SUNG SẢN PHẨM MỚI LÊN PHẦN MỀM THÀNH CÔNG!`);
console.log(`========================================================================\n`);
