/**
 * SCRIPT TỰ ĐỘNG CẬP NHẬT GIÁ BÁN & GIÁ NPP THEO TỪNG KÊNH TỪ FILE EXCEL LÊN PHẦN MỀM
 * Công ty TNHH Hợp tác Vũ Gia
 *
 * Cách chạy:
 *   node cap_nhat_gia_tu_excel.js [duong_dan_file_excel]
 * (Mặc định nếu không truyền đường dẫn sẽ dùng file 'mau_cap_nhat_gia_theo_kenh.xlsx')
 */

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const { execSync } = require('child_process');

const inputArg = process.argv[2];
const excelFilePath = inputArg ? path.resolve(inputArg) : path.join(__dirname, 'mau_cap_nhat_gia_theo_kenh.xlsx');

if (!fs.existsSync(excelFilePath)) {
  console.error(`❌ LỖI: Không tìm thấy file Excel tại đường dẫn: ${excelFilePath}`);
  process.exit(1);
}

console.log(`\n========================================================================`);
console.log(`🚀 BẮT ĐẦU CẬP NHẬT GIÁ BÁN & GIÁ NPP TỪ FILE EXCEL LÊN PHẦN MỀM`);
console.log(`📂 Nguồn file: ${excelFilePath}`);
console.log(`========================================================================\n`);

// 1. Đọc file Excel
const wb = XLSX.readFile(excelFilePath);

// Chọn sheet làm việc ưu tiên:
// Nếu sheet 'Mau_Dien_Nhanh_Vai_Ma' có dữ liệu dòng >= 6 thì dùng sheet đó
// Nếu không, dùng 'CapNhat_Gia_63_Model' hoặc sheet đầu tiên
let targetSheetName = wb.SheetNames[0];
if (wb.SheetNames.includes('Mau_Dien_Nhanh_Vai_Ma')) {
  const testRows = XLSX.utils.sheet_to_json(wb.Sheets['Mau_Dien_Nhanh_Vai_Ma'], { header: 1 });
  // Kiểm tra xem dòng 6 trở đi có mã nào được điền không
  let hasQuickRows = false;
  for (let i = 5; i < testRows.length; i++) {
    if (testRows[i] && String(testRows[i][1] || '').trim()) {
      hasQuickRows = true;
      break;
    }
  }
  if (hasQuickRows) {
    targetSheetName = 'Mau_Dien_Nhanh_Vai_Ma';
  } else if (wb.SheetNames.includes('CapNhat_Gia_63_Model')) {
    targetSheetName = 'CapNhat_Gia_63_Model';
  }
} else if (wb.SheetNames.includes('CapNhat_Gia_63_Model')) {
  targetSheetName = 'CapNhat_Gia_63_Model';
}

console.log(`📑 Đang xử lý dữ liệu từ Sheet: [${targetSheetName}]`);
const ws = wb.Sheets[targetSheetName];
const rawRows = XLSX.utils.sheet_to_json(ws, { header: 1 });

if (!rawRows || rawRows.length < 2) {
  console.error(`❌ Sheet [${targetSheetName}] không có đủ dữ liệu để xử lý.`);
  process.exit(1);
}

// 2. Tìm dòng tiêu đề cột (header row)
let headerRowIdx = -1;
for (let i = 0; i < Math.min(15, rawRows.length); i++) {
  const row = rawRows[i] || [];
  const cells = row.map(c => String(c || '').trim().toLowerCase());
  const filledCells = cells.filter(c => c.length > 0);
  if (filledCells.length >= 3) {
    const hasModel = cells.some(c => c.includes('model') || c.includes('mã model') || c.includes('mã sp') || c.includes('mã hàng') || c === 'mã' || c.includes('sku'));
    const hasPrice = cells.some(c => c.includes('giá') || c.includes('price') || c.includes('npp'));
    if (hasModel && (hasPrice || filledCells.length >= 5)) {
      headerRowIdx = i;
      break;
    }
  }
}

if (headerRowIdx === -1) {
  // Dự phòng tìm dòng có nhiều ô chứa từ khóa
  for (let i = 0; i < Math.min(15, rawRows.length); i++) {
    const row = rawRows[i] || [];
    const cells = row.map(c => String(c || '').trim().toLowerCase());
    if (cells.some(c => c.includes('model') || c.includes('mã')) && cells.some(c => c.includes('giá'))) {
      headerRowIdx = i;
      break;
    }
  }
}

if (headerRowIdx === -1) {
  console.error(`❌ Không tìm thấy dòng tiêu đề cột hợp lệ (chứa 'Mã Model', 'Giá NPP'...).`);
  process.exit(1);
}

const headerRow = rawRows[headerRowIdx].map(h => String(h || '').trim());
console.log(`📍 Dòng tiêu đề cột tại dòng ${headerRowIdx + 1}:`);

// Xác định vị trí các cột
function findCol(keywords) {
  return headerRow.findIndex(h => {
    const s = h.toLowerCase();
    return keywords.some(k => s.includes(k.toLowerCase()));
  });
}

const colModel = findCol(['mã model', 'model', 'sku', 'mã sp', 'mã hàng']);
const colNppOnline = findCol(['[online] giá npp', 'giá npp online', 'npp online', 'giá npp (vnđ)', 'giá npp']);
const colFacebook = findCol(['[online] giá facebook', 'giá facebook', 'facebook', 'fb']);
const colTmdt = findCol(['[online] giá sàn', 'giá sàn tmđt', 'sàn tmđt', 'tmđt', 'shopee', 'tmdt']);
const colRetail = findCol(['[online] giá niêm yết', 'giá niêm yết', 'niêm yết', 'bán lẻ']);
const colNppOffline = findCol(['[offline] giá npp', 'giá npp offline', 'npp offline', 'npp gt']);
const colDealerOffline = findCol(['[offline] giá đại lý', 'giá đại lý offline', 'đại lý offline', 'đại lý gt']);
const colCost = findCol(['giá vốn', 'giá nhập', 'vốn', 'nhập', 'cost', 'import']);
const colNote = findCol(['ghi chú', 'lý do', 'note']);

console.log(`   - Cột Mã Model: index ${colModel} ("${headerRow[colModel] || ''}")`);
console.log(`   - Cột Giá NPP Online: index ${colNppOnline} ("${headerRow[colNppOnline] || ''}")`);
console.log(`   - Cột Giá Facebook: index ${colFacebook} ("${headerRow[colFacebook] || ''}")`);
console.log(`   - Cột Giá Sàn TMĐT: index ${colTmdt} ("${headerRow[colTmdt] || ''}")`);
console.log(`   - Cột Giá Niêm Yết: index ${colRetail} ("${headerRow[colRetail] || ''}")`);
console.log(`   - Cột Giá NPP Offline: index ${colNppOffline} ("${headerRow[colNppOffline] || ''}")`);
console.log(`   - Cột Giá Đại Lý Offline: index ${colDealerOffline} ("${headerRow[colDealerOffline] || ''}")`);
console.log(`   - Cột Giá Vốn / Nhập: index ${colCost} ("${headerRow[colCost] || ''}")`);

if (colModel === -1) {
  console.error(`❌ Không xác định được cột Mã Model / SKU.`);
  process.exit(1);
}

// 3. Đọc dữ liệu sản phẩm hiện tại từ index.html & real_catalog.json
const indexHtmlPath = path.join(__dirname, 'index.html');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

const startFn = indexHtml.indexOf('function getInitialData()');
const endFn = indexHtml.indexOf('function getDB()');
if (startFn === -1 || endFn === -1) {
  console.error(`❌ Không tìm thấy hàm getInitialData() trong index.html`);
  process.exit(1);
}

const fnCode = indexHtml.substring(startFn, endFn);
const fn = new Function(fnCode + '; return getInitialData();');
const initialData = fn();
const products = initialData.products;

// Parse numeric helper
function parsePrice(val) {
  if (val === undefined || val === null || val === '') return null;
  const num = parseFloat(String(val).replace(/[^\d.]/g, ''));
  return isNaN(num) || num <= 0 ? null : Math.round(num);
}

// 4. Duyệt các dòng dữ liệu và so sánh
const updates = [];
let totalRowsProcessed = 0;

for (let i = headerRowIdx + 1; i < rawRows.length; i++) {
  const row = rawRows[i];
  if (!row || row.length === 0) continue;

  const rawCode = String(row[colModel] || '').trim();
  if (!rawCode) continue;

  totalRowsProcessed++;
  const cleanCode = rawCode.toUpperCase().replace(/\s+/g, '');

  // Tìm sản phẩm khớp mã
  const p = products.find(prod => {
    const pc = String(prod.canonicalCode || '').toUpperCase().replace(/\s+/g, '');
    return pc === cleanCode;
  });

  if (!p) {
    console.warn(`⚠️ Dòng ${i + 1}: Mã [${rawCode}] không tồn tại trong danh mục 63 mã -> Bỏ qua.`);
    continue;
  }

  // Đọc các giá trị mới
  const newNppOn = colNppOnline !== -1 ? parsePrice(row[colNppOnline]) : null;
  const newFb = colFacebook !== -1 ? parsePrice(row[colFacebook]) : null;
  const newTmdt = colTmdt !== -1 ? parsePrice(row[colTmdt]) : null;
  const newRetail = colRetail !== -1 ? parsePrice(row[colRetail]) : null;
  const newNppOff = colNppOffline !== -1 ? parsePrice(row[colNppOffline]) : null;
  const newDlOff = colDealerOffline !== -1 ? parsePrice(row[colDealerOffline]) : null;
  const newCost = colCost !== -1 ? parsePrice(row[colCost]) : null;
  const note = colNote !== -1 && row[colNote] ? String(row[colNote]).trim() : '';

  const changes = [];

  // So sánh từng kênh
  if (newNppOn !== null && newNppOn !== p.nppOnlinePrice) {
    changes.push({
      channel: 'NPP Online',
      oldVal: p.nppOnlinePrice,
      newVal: newNppOn,
      diff: newNppOn - (p.nppOnlinePrice || 0)
    });
    p.oldNppOnlinePrice = p.nppOnlinePrice;
    p.nppOnlinePrice = newNppOn;
  }

  if (newFb !== null && newFb !== p.facebookPrice) {
    changes.push({
      channel: 'Facebook',
      oldVal: p.facebookPrice,
      newVal: newFb,
      diff: newFb - (p.facebookPrice || 0)
    });
    p.facebookPrice = newFb;
  }

  if (newTmdt !== null && newTmdt !== p.tmdtPrice) {
    changes.push({
      channel: 'Sàn TMĐT',
      oldVal: p.tmdtPrice,
      newVal: newTmdt,
      diff: newTmdt - (p.tmdtPrice || 0)
    });
    p.tmdtPrice = newTmdt;
  }

  if (newRetail !== null && newRetail !== p.retailPrice) {
    changes.push({
      channel: 'Niêm Yết',
      oldVal: p.retailPrice,
      newVal: newRetail,
      diff: newRetail - (p.retailPrice || 0)
    });
    p.retailPrice = newRetail;
  }

  if (newNppOff !== null && newNppOff !== p.nppOfflinePrice) {
    changes.push({
      channel: 'NPP Offline',
      oldVal: p.nppOfflinePrice || 0,
      newVal: newNppOff,
      diff: newNppOff - (p.nppOfflinePrice || 0)
    });
    p.nppOfflinePrice = newNppOff;
    // Nếu chưa có giá đại lý offline mới thì tự động tính x1.2
    if (newDlOff === null) {
      const autoDl = Math.round(newNppOff * 1.2);
      p.dealerOfflinePrice = autoDl;
    }
  }

  if (newDlOff !== null && newDlOff !== p.dealerOfflinePrice) {
    changes.push({
      channel: 'Đại Lý Offline',
      oldVal: p.dealerOfflinePrice || 0,
      newVal: newDlOff,
      diff: newDlOff - (p.dealerOfflinePrice || 0)
    });
    p.dealerOfflinePrice = newDlOff;
  }

  if (newCost !== null && newCost !== (p.newImportPrice || p.costPrice)) {
    const oldCost = p.newImportPrice || p.costPrice || 0;
    changes.push({
      channel: 'Giá Vốn',
      oldVal: oldCost,
      newVal: newCost,
      diff: newCost - oldCost
    });
    p.costPrice = newCost;
    p.newImportPrice = newCost;
    p.oldImportPrice = oldCost;
  }

  // Nếu có thay đổi ở bất kỳ kênh nào, tính toán lại lợi nhuận & ghi nhận
  if (changes.length > 0) {
    const fbPrice = p.facebookPrice || 0;
    const nppOn = p.nppOnlinePrice || 0;
    p.profitNPP = fbPrice - nppOn;
    p.profitPct = fbPrice > 0 ? (((fbPrice - nppOn) / fbPrice) * 100).toFixed(1) + '%' : '0.0%';
    p.nppOnlineProfitRatio = p.profitPct;

    if (p.dealerOfflinePrice && fbPrice > 0) {
      p.dealerProfitRatio = (((fbPrice - p.dealerOfflinePrice) / fbPrice) * 100).toFixed(1) + '%';
    }

    if (p.nppOfflinePrice !== undefined && nppOn > 0) {
      p.diffOnlineOffline = (p.nppOfflinePrice || 0) - nppOn;
      p.diffOnlineOfflinePct = ((p.diffOnlineOffline / nppOn) * 100).toFixed(1) + '%';
    }

    p.updatedAt = new Date().toISOString();

    updates.push({
      code: p.canonicalCode,
      name: p.name,
      changes,
      note
    });
  }
}

console.log(`\n📊 KẾT QUẢ ĐỐI SOÁT DỮ LIỆU:`);
console.log(`   - Tổng số dòng đã duyệt: ${totalRowsProcessed}`);
console.log(`   - Số sản phẩm có điều chỉnh giá: ${updates.length}`);

if (updates.length === 0) {
  console.log(`\n✅ TẤT CẢ MỨC GIÁ TRONG FILE ĐỀU TRÙNG KHỚP VỚI HỆ THỐNG. KHÔNG CÓ THAY ĐỔI NÀO CẦN CẬP NHẬT.`);
  process.exit(0);
}

// 5. In bảng chi tiết các thay đổi
console.log(`\n========================================================================`);
console.log(`📋 CHI TIẾT CÁC MÃ SẢN PHẨM ĐƯỢC CẬP NHẬT GIÁ:`);
console.log(`========================================================================`);

updates.forEach((u, idx) => {
  console.log(`\n${idx + 1}. [${u.code}] - ${u.name}${u.note ? ' (' + u.note + ')' : ''}`);
  u.changes.forEach(c => {
    const sign = c.diff > 0 ? '+' : '';
    const diffFmt = sign + c.diff.toLocaleString('vi-VN') + ' đ';
    const oldFmt = c.oldVal.toLocaleString('vi-VN') + ' đ';
    const newFmt = c.newVal.toLocaleString('vi-VN') + ' đ';
    console.log(`   • Kênh [${c.channel}]: ${oldFmt} ➔ ${newFmt} (${diffFmt})`);
  });
});

// 6. Ghi đè vào real_catalog.json
const catalogPath = path.join(__dirname, 'real_catalog.json');
fs.writeFileSync(catalogPath, JSON.stringify(products, null, 2), 'utf8');
console.log(`\n💾 Đã lưu danh mục mới vào real_catalog.json (${products.length} sản phẩm).`);

// 7. Ghi đè vào getInitialData() trong index.html và nâng cấp STORAGE_KEY
const timeStampKey = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
const newStorageKey = `LOCK_KING_PMS_DATA_v41_EXCEL_UPDATE_${timeStampKey}`;

// Tìm vùng "products": [ ... ] trong index.html
const pStartIdx = indexHtml.indexOf('"products": [', startFn);
if (pStartIdx === -1) {
  console.error(`❌ Không tìm thấy "products": [ trong index.html`);
  process.exit(1);
}

// Tìm vị trí kết thúc của mảng products (trước "aliases" hoặc "customers")
let nextIdx = indexHtml.indexOf('"aliases": [', pStartIdx);
if (nextIdx === -1) nextIdx = indexHtml.indexOf('aliases:', pStartIdx);
if (nextIdx === -1) nextIdx = indexHtml.indexOf('"customers": [', pStartIdx);
if (nextIdx === -1) nextIdx = indexHtml.indexOf('customers:', pStartIdx);
if (nextIdx === -1) {
  console.error(`❌ Không tìm thấy điểm kết thúc mảng products trong index.html`);
  process.exit(1);
}

// Tìm dấu đóng ngoặc ] của products
const pEndIdx = indexHtml.lastIndexOf('],', nextIdx);
if (pEndIdx === -1) {
  console.error(`❌ Không tìm thấy vị trí đóng ngoặc mảng products`);
  process.exit(1);
}

const newProductsJson = '"products": ' + JSON.stringify(products, null, 8);

let updatedHtml = indexHtml.substring(0, pStartIdx) + newProductsJson + indexHtml.substring(pEndIdx + 1);

// Cập nhật STORAGE_KEY để trình duyệt tự động cập nhật ngay khi mở
updatedHtml = updatedHtml.replace(
  /const STORAGE_KEY = 'LOCK_KING_PMS_DATA[^']*';/,
  `const STORAGE_KEY = '${newStorageKey}';`
);

fs.writeFileSync(indexHtmlPath, updatedHtml, 'utf8');
console.log(`💾 Đã cập nhật database và STORAGE_KEY (${newStorageKey}) trong index.html.`);

// 8. Chạy lại generate_excel.js để đồng bộ các file Excel và CSV xuất báo cáo
try {
  console.log(`🔄 Đang đồng bộ lại các file biểu giá hệ thống (generate_excel.js)...`);
  execSync('node generate_excel.js', { stdio: 'inherit' });
  console.log(`✅ Đồng bộ biểu giá Excel chuẩn thành công!`);
} catch (err) {
  console.warn(`⚠️ Lỗi khi chạy generate_excel.js: ${err.message}`);
}

// 9. Cập nhật lại chính file mẫu mau_cap_nhat_gia_theo_kenh.xlsx để giữ giá mới nhất
try {
  execSync('node create_price_update_template.js', { stdio: 'inherit' });
  console.log(`✅ Đã cập nhật lại file mẫu mau_cap_nhat_gia_theo_kenh.xlsx với dữ liệu giá mới nhất!`);
} catch (err) {
  console.warn(`⚠️ Lỗi khi chạy create_price_update_template.js: ${err.message}`);
}

console.log(`\n========================================================================`);
console.log(`🎉 HOÀN TẤT CẬP NHẬT ${updates.length} MÃ SẢN PHẨM THÀNH CÔNG LÊN PHẦN MỀM!`);
console.log(`========================================================================\n`);
