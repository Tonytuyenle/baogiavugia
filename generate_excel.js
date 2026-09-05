const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'real_catalog.json'), 'utf-8'));

// Format data for sheet
const rows = [
  ['STT', 'Thương Hiệu', 'Phân Loại', 'Model (Mã Sản Phẩm)', 'Tên Sản Phẩm', 'Giá NPP Online (VNĐ)', 'Giá Facebook (VNĐ)', 'Giá Sàn TMĐT (VNĐ)', 'Giá Niêm Yết (VNĐ)', 'Lợi Nhuận NPP (VNĐ)', '% LN NPP / Facebook']
];

products.forEach(p => {
  rows.push([
    p.stt,
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
const ws = XLSX.utils.aoa_to_sheet(rows);

// Set column widths
ws['!cols'] = [
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

XLSX.utils.book_append_sheet(wb, ws, 'Bang_Gia_LockKing_Takin');
XLSX.writeFile(wb, path.join(__dirname, 'bang_gia_chuan_lock_and_king_takin.xlsx'));
console.log('Created bang_gia_chuan_lock_and_king_takin.xlsx successfully!');
