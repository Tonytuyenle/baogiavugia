const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== CẬP NHẬT HÌNH ẢNH & THÔNG SỐ LK-3012, LK-9001 ===');

// 1. Cập nhật real_catalog.json
const catalogPath = path.join(__dirname, 'real_catalog.json');
let catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const lk3012 = catalog.find(p => p.canonicalCode === 'LK-3012');
if (lk3012) {
  lk3012.image = 'images/LK-3012.png';
  lk3012.specs = 'Chảo xào BIGTITAN Model LK-3012. Kích thước (Size): 30 cm, sâu 10 cm. Chất liệu: Inox cao cấp, Titanium. Khối lượng: 2 Kg. Bảo hành: 12 tháng. Đúc liền khối, bắt từ nhanh, quy cách: 4 chiếc/thùng.';
  lk3012.updatedAt = new Date().toISOString();
  console.log('✅ Đã cập nhật LK-3012 trong real_catalog.json');
}

const lk9001 = catalog.find(p => p.canonicalCode === 'LK-9001');
if (lk9001) {
  lk9001.image = 'images/LK-9001.png';
  lk9001.specs = 'Miếng lót nồi silicone cao cấp Lock&King Model LK-9001, chất liệu silicone an toàn chịu nhiệt độ cao từ -40°C đến 230°C, bề mặt nan nan cách nhiệt chống trơn trượt, bảo vệ mặt bàn hiệu quả.';
  lk9001.updatedAt = new Date().toISOString();
  console.log('✅ Đã cập nhật LK-9001 trong real_catalog.json');
}

fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf8');
console.log('💾 Đã lưu real_catalog.json');

// 2. Cập nhật index.html
const indexPath = path.join(__dirname, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// A. Update products array in getInitialData()
const startFn = indexHtml.indexOf('function getInitialData()');
const pStart = indexHtml.indexOf('"products": [', startFn);
let nextIdx = indexHtml.indexOf('"aliases": [', pStart);
if (nextIdx === -1) nextIdx = indexHtml.indexOf('aliases:', pStart);
if (nextIdx === -1) nextIdx = indexHtml.indexOf('"customers": [', pStart);
const pEnd = indexHtml.lastIndexOf('],', nextIdx);

if (pStart === -1 || pEnd === -1) {
  console.error('❌ Không tìm thấy mảng "products" trong getInitialData()');
  process.exit(1);
}

const newProductsJson = '"products": ' + JSON.stringify(catalog, null, 8);
indexHtml = indexHtml.substring(0, pStart) + newProductsJson + indexHtml.substring(pEnd + 1);
console.log('✅ Đã thay thế mảng products trong index.html');

// B. Bump STORAGE_KEY
const newStorageKey = 'LOCK_KING_PMS_DATA_v51_IMAGES_LK3012_LK9001_' + new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
indexHtml = indexHtml.replace(
  /const STORAGE_KEY = 'LOCK_KING_PMS_DATA[^']*';/,
  `const STORAGE_KEY = '${newStorageKey}';`
);
console.log(`✅ Đã đổi STORAGE_KEY thành: ${newStorageKey}`);

// C. Update seedInventory
const invStart = indexHtml.indexOf('const seedInventory = [');
const invEnd = indexHtml.indexOf('];', invStart);
if (invStart !== -1 && invEnd !== -1) {
  const invJsonStr = indexHtml.substring(invStart + 'const seedInventory = '.length, invEnd + 1);
  let inv = JSON.parse(invJsonStr);

  // Remove existing LK-3012 and LK-9001 if present
  inv = inv.filter(i => !['LK-3012', 'LK-9001'].includes(i.id));

  const invItem3012 = {
    anh: 'images/LK-3012.png',
    id: 'LK-3012',
    ten_sp: 'Chảo xào BIGTITAN 30*10cm (4c/T)',
    brand: 'Lock&King',
    ton_dau: 0,
    nhap: 0,
    xuat: 0,
    ton_cuoi: 0
  };

  const invItem9001 = {
    anh: 'images/LK-9001.png',
    id: 'LK-9001',
    ten_sp: 'Lót nồi silicone cao cấp',
    brand: 'Lock&King',
    ton_dau: 0,
    nhap: 0,
    xuat: 0,
    ton_cuoi: 0
  };

  // Insert before Takin
  const takinInvIdx = inv.findIndex(i => i.brand === 'Takin' || i.id.startsWith('TK'));
  if (takinInvIdx !== -1) {
    inv.splice(takinInvIdx, 0, invItem3012, invItem9001);
  } else {
    inv.push(invItem3012, invItem9001);
  }

  const newInvJson = 'const seedInventory = ' + JSON.stringify(inv, null, 2) + ';';
  indexHtml = indexHtml.substring(0, invStart) + newInvJson + indexHtml.substring(invEnd + 2);
  console.log(`✅ Đã cập nhật seedInventory: tổng số ${inv.length} mã sản phẩm`);
}

// D. Update STORAGE_KEY_INVENTORY and parsed.length === 65
indexHtml = indexHtml.replace(
  /const STORAGE_KEY_INVENTORY = 'LOCK_KING_INVENTORY[^']*';/,
  `const STORAGE_KEY_INVENTORY = 'LOCK_KING_INVENTORY_65_${new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)}';`
);
indexHtml = indexHtml.replace(
  /parsed\.length === 63/g,
  'parsed.length === 65'
);

// E. Bump STORAGE_KEY_MEDIA_ASSETS
indexHtml = indexHtml.replace(
  /const STORAGE_KEY_MEDIA_ASSETS = 'LOCK_KING_MEDIA_ASSETS_DATA_v1';/,
  `const STORAGE_KEY_MEDIA_ASSETS = 'LOCK_KING_MEDIA_ASSETS_DATA_v2';`
);

fs.writeFileSync(indexPath, indexHtml, 'utf8');
console.log('💾 Đã lưu index.html');

console.log('=== HOÀN TẤT CẬP NHẬT HÌNH ẢNH VÀ THÔNG SỐ ===');
