const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Danh sách 8 mã biến động / cập nhật ngày 18/10/2026
const items = [
  {
    stt: 1,
    date: '18/10/2026',
    type: 'MÃ MỚI BỔ SUNG',
    group: '1. Bếp từ',
    code: 'LK-8920',
    name: 'Bếp từ đơn-  2000W',
    brand: 'Lock&King',
    category: 'Bếp từ',
    oldCost: 0,
    newCost: 556000,
    costDiff: 556000,
    oldNpp: 0,
    newNpp: 690000,
    nppDiff: 690000,
    nppDiffPct: 'Mới',
    fbPrice: 1290000,
    tmdtPrice: 1354500,
    retailPrice: 1626000,
    profitNpp: 600000,
    profitPct: '46.5%',
    note: 'Bếp từ đơn 2000W công nghệ mới, phím cảm ứng đa năng'
  },
  {
    stt: 2,
    date: '18/10/2026',
    type: 'MÃ MỚI BỔ SUNG',
    group: '1. Bếp từ',
    code: 'LK-8989',
    name: 'Bếp từ đơn -2200W',
    brand: 'Lock&King',
    category: 'Bếp từ',
    oldCost: 0,
    newCost: 650000,
    costDiff: 650000,
    oldNpp: 0,
    newNpp: 790000,
    nppDiff: 790000,
    nppDiffPct: 'Mới',
    fbPrice: 1490000,
    tmdtPrice: 1564500,
    retailPrice: 1878000,
    profitNpp: 700000,
    profitPct: '47.0%',
    note: 'Bếp từ đơn 2200W cao cấp mặt kính cường lực chịu nhiệt'
  },
  {
    stt: 3,
    date: '18/10/2026',
    type: 'MÃ MỚI BỔ SUNG',
    group: '1. Bếp từ',
    code: 'LK-8924',
    name: 'Bếp từ đơn -2400W',
    brand: 'Lock&King',
    category: 'Bếp từ',
    oldCost: 0,
    newCost: 715000,
    costDiff: 715000,
    oldNpp: 0,
    newNpp: 850000,
    nppDiff: 850000,
    nppDiffPct: 'Mới',
    fbPrice: 1590000,
    tmdtPrice: 1669500,
    retailPrice: 2004000,
    profitNpp: 740000,
    profitPct: '46.5%',
    note: 'Bếp từ đơn 2400W đun nấu siêu nhanh, bo mạch bền bỉ'
  },
  {
    stt: 4,
    date: '18/10/2026',
    type: 'MÃ MỚI BỔ SUNG',
    group: '2. Nồi cơm điện',
    code: 'LK-8818',
    name: 'Nồi cơm cao tần',
    brand: 'Lock&King',
    category: 'Nồi cơm điện',
    oldCost: 0,
    newCost: 1400000,
    costDiff: 1400000,
    oldNpp: 0,
    newNpp: 1790000,
    nppDiff: 1790000,
    nppDiffPct: 'Mới',
    fbPrice: 3400000,
    tmdtPrice: 3570000,
    retailPrice: 4284000,
    profitNpp: 1610000,
    profitPct: '47.4%',
    note: 'Nồi cơm cao tần IH gia nhiệt đa chiều hạt cơm chín đều thơm ngon'
  },
  {
    stt: 5,
    date: '18/10/2026',
    type: 'MÃ MỚI BỔ SUNG',
    group: '2. Nồi cơm điện',
    code: 'LK-8618',
    name: 'Nồi cơm tách đường',
    brand: 'Lock&King',
    category: 'Nồi cơm điện',
    oldCost: 0,
    newCost: 1043000,
    costDiff: 1043000,
    oldNpp: 0,
    newNpp: 1300000,
    nppDiff: 1300000,
    nppDiffPct: 'Mới',
    fbPrice: 2490000,
    tmdtPrice: 2614500,
    retailPrice: 3138000,
    profitNpp: 1190000,
    profitPct: '47.8%',
    note: 'Nồi cơm thông minh tích hợp công nghệ tách đường bảo vệ sức khỏe'
  },
  {
    stt: 6,
    date: '18/10/2026',
    type: 'MÃ MỚI BỔ SUNG',
    group: '4. Tủ sấy',
    code: 'LK-6886',
    name: 'Tủ sấy quần áo Model: LK 6886',
    brand: 'Lock&King',
    category: 'Tủ sấy',
    oldCost: 0,
    newCost: 620000,
    costDiff: 620000,
    oldNpp: 0,
    newNpp: 770000,
    nppDiff: 770000,
    nppDiffPct: 'Mới',
    fbPrice: 1490000,
    tmdtPrice: 1564500,
    retailPrice: 1878000,
    profitNpp: 720000,
    profitPct: '48.3%',
    note: 'Tủ sấy quần áo dung tích lớn, diệt khuẩn ion, gấp gọn tiện dụng'
  },
  {
    stt: 7,
    date: '18/10/2026',
    type: 'ĐIỀU CHỈNH TĂNG GIÁ',
    group: '3. Đèn Sưởi',
    code: 'LK-1003',
    name: 'Bộ đèn sưởi 3 bóng Model: LK-1003',
    brand: 'Lock&King',
    category: 'Đèn sưởi',
    oldCost: 133495,
    newCost: 160000,
    costDiff: 26505,
    oldNpp: 197000,
    newNpp: 210000,
    nppDiff: 130000,
    nppDiffPct: '+6.6%',
    fbPrice: 399000,
    tmdtPrice: 418950,
    retailPrice: 503000,
    profitNpp: 189000,
    profitPct: '47.4%',
    note: 'Điều chỉnh tăng: Giá NPP tăng +13.000đ (+6.6%), vốn tăng +26.505đ'
  },
  {
    stt: 8,
    date: '18/10/2026',
    type: 'ĐIỀU CHỈNH GIẢM GIÁ',
    group: '3. Đèn Sưởi',
    code: 'LK-1033',
    name: 'Bộ đèn sưởi 3 bóng Model: LK-1033',
    brand: 'Lock&King',
    category: 'Đèn sưởi',
    oldCost: 200000,
    newCost: 250000,
    costDiff: 50000,
    oldNpp: 372000,
    newNpp: 320000,
    nppDiff: -52000,
    nppDiffPct: '-14.0%',
    fbPrice: 620000,
    tmdtPrice: 651000,
    retailPrice: 782000,
    profitNpp: 300000,
    profitPct: '48.4%',
    note: 'Điều chỉnh giảm giá NPP: -52.000đ (-14.0%) để đẩy mạnh kích cầu mùa đông'
  }
];

// 1. Tạo Workbook Excel
const wb = XLSX.utils.book_new();

// SHEET 1: BẢNG THEO DÕI BIẾN ĐỘNG GIÁ CHI TIẾT
const sheet1Data = [
  ['CÔNG TY TNHH ĐẦU TƯ & THƯƠNG MẠI VŨ GIA'],
  ['BẢNG KÊ BIẾN ĐỘNG & ĐIỀU CHỈNH GIÁ SẢN PHẨM MỚI NHẤT (NGÀY 18/10/2026)'],
  ['Áp dụng cho 8 sản phẩm (6 mã mới bổ sung & 2 mã điều chỉnh giá nhập / giá NPP)'],
  [],
  [
    'STT',
    'Ngày Cập Nhật',
    'Loại Biến Động',
    'Nhóm Hàng',
    'Mã Model',
    'Tên Sản Phẩm',
    'Thương Hiệu',
    'Giá Vốn Cũ (VNĐ)',
    'Giá Vốn Mới (VNĐ)',
    'Chênh Lệch Vốn (VNĐ)',
    'Giá NPP Online Cũ (VNĐ)',
    'Giá NPP Online Mới (VNĐ)',
    'Chênh Lệch NPP (VNĐ)',
    '% Biến Động NPP',
    'Giá Facebook (VNĐ)',
    'Giá Sàn TMĐT (+5%)',
    'Giá Niêm Yết (+20%)',
    'Lợi Nhuận NPP (VNĐ)',
    '% LN NPP / FB',
    'Ghi Chú Nghiệp Vụ'
  ]
];

items.forEach(it => {
  sheet1Data.push([
    it.stt,
    it.date,
    it.type,
    it.group,
    it.code,
    it.name,
    it.brand,
    it.oldCost,
    it.newCost,
    it.costDiff,
    it.oldNpp,
    it.newNpp,
    it.nppDiff,
    it.nppDiffPct,
    it.fbPrice,
    it.tmdtPrice,
    it.retailPrice,
    it.profitNpp,
    it.profitPct,
    it.note
  ]);
});

const ws1 = XLSX.utils.aoa_to_sheet(sheet1Data);
ws1['!cols'] = [
  { wch: 6 },  // STT
  { wch: 14 }, // Ngày Cập Nhật
  { wch: 22 }, // Loại Biến Động
  { wch: 18 }, // Nhóm Hàng
  { wch: 16 }, // Mã Model
  { wch: 40 }, // Tên Sản Phẩm
  { wch: 14 }, // Thương Hiệu
  { wch: 18 }, // Giá Vốn Cũ
  { wch: 18 }, // Giá Vốn Mới
  { wch: 20 }, // Chênh Lệch Vốn
  { wch: 22 }, // Giá NPP Cũ
  { wch: 22 }, // Giá NPP Mới
  { wch: 20 }, // Chênh Lệch NPP
  { wch: 16 }, // % Biến Động NPP
  { wch: 18 }, // Giá FB
  { wch: 18 }, // Giá TMĐT
  { wch: 18 }, // Giá Niêm Yết
  { wch: 18 }, // Lợi Nhuận NPP
  { wch: 14 }, // % LN
  { wch: 65 }  // Ghi Chú
];
XLSX.utils.book_append_sheet(wb, ws1, 'BienDong_ChiTiet_18_10');

// SHEET 2: BẢNG BÁO GIÁ NPP & BÁN LẺ DÀNH CHO KINH DOANH
const sheet2Data = [
  ['BẢNG BÁO GIÁ ÁP DỤNG CHO CÁC MÃ MỚI & THAY ĐỔI NGÀY 18/10/2026'],
  ['Hệ thống phân phối Vũ Gia - Thương hiệu Lock&King'],
  [],
  [
    'STT',
    'Nhóm Hàng',
    'Mã Model',
    'Tên Sản Phẩm',
    'ĐVT',
    'Giá NPP Online (VNĐ)',
    'Giá Bán Facebook (VNĐ)',
    'Giá Sàn TMĐT (VNĐ)',
    'Giá Niêm Yết Web/TT (VNĐ)',
    'Mức Lời NPP (VNĐ)',
    'Tỷ Suất LN NPP/FB (%)'
  ]
];

items.forEach(it => {
  sheet2Data.push([
    it.stt,
    it.group,
    it.code,
    it.name,
    'Cái / Bộ',
    it.newNpp,
    it.fbPrice,
    it.tmdtPrice,
    it.retailPrice,
    it.profitNpp,
    it.profitPct
  ]);
});

const ws2 = XLSX.utils.aoa_to_sheet(sheet2Data);
ws2['!cols'] = [
  { wch: 6 },
  { wch: 18 },
  { wch: 16 },
  { wch: 42 },
  { wch: 12 },
  { wch: 22 },
  { wch: 22 },
  { wch: 20 },
  { wch: 24 },
  { wch: 18 },
  { wch: 20 }
];
XLSX.utils.book_append_sheet(wb, ws2, 'Bao_Gia_Kinh_Doanh_8_Ma');

// Lưu file XLSX
const xlsxPath1 = path.join(__dirname, 'bang_gia_thay_doi_ngay_18_10_2026.xlsx');
XLSX.writeFile(wb, xlsxPath1);

const xlsxPath2 = path.join(__dirname, 'Nhat_Ky_Bien_Dong_Gia_Moi_Nhat_2026-10-18.xlsx');
XLSX.writeFile(wb, xlsxPath2);

// 2. Tạo File CSV (có UTF-8 BOM để Excel hiển thị tiếng Việt chuẩn 100%)
const csvHeaders = [
  'STT',
  'Ngay_Cap_Nhat',
  'Loai_Bien_Dong',
  'Nhom_Hang',
  'Ma_Model',
  'Ten_San_Pham',
  'Thuong_Hieu',
  'Gia_Von_Cu',
  'Gia_Von_Moi',
  'Chenh_Lech_Von',
  'Gia_NPP_Cu',
  'Gia_NPP_Moi',
  'Chenh_Lech_NPP',
  'Phan_Tram_Bien_Dong_NPP',
  'Gia_Facebook',
  'Gia_San_TMDT',
  'Gia_Niem_Yet',
  'Loi_Nhuan_NPP',
  'Phan_Tram_LN_NPP_FB',
  'Ghi_Chu'
];

let csvContent = '\uFEFF' + csvHeaders.join(',') + '\n';
items.forEach(it => {
  const row = [
    it.stt,
    `"${it.date}"`,
    `"${it.type}"`,
    `"${it.group}"`,
    `"${it.code}"`,
    `"${it.name.replace(/"/g, '""')}"`,
    `"${it.brand}"`,
    it.oldCost,
    it.newCost,
    it.costDiff,
    it.oldNpp,
    it.newNpp,
    it.nppDiff,
    `"${it.nppDiffPct}"`,
    it.fbPrice,
    it.tmdtPrice,
    it.retailPrice,
    it.profitNpp,
    `"${it.profitPct}"`,
    `"${it.note.replace(/"/g, '""')}"`
  ];
  csvContent += row.join(',') + '\n';
});

const csvPath = path.join(__dirname, 'bang_gia_thay_doi_ngay_18_10_2026.csv');
fs.writeFileSync(csvPath, csvContent, 'utf8');

console.log('SUCCESS: Generated all files successfully!');
console.log('1. ' + xlsxPath1);
console.log('2. ' + xlsxPath2);
console.log('3. ' + csvPath);
