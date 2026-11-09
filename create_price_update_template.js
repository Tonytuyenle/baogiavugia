const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// 1. Đọc dữ liệu 63 sản phẩm từ index.html
const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
const start = indexHtml.indexOf('function getInitialData()');
const end = indexHtml.indexOf('function getDB()');
const fnCode = indexHtml.substring(start, end);
const fn = new Function(fnCode + '; return getInitialData();');
const data = fn();
const products = data.products;

const wb = XLSX.utils.book_new();

// ================= SHEET 1: CapNhat_Gia_63_Model =================
const sheet1Aoa = [
  ['CÔNG TY TNHH HỢP TÁC VŨ GIA - BIỂU MẪU CẬP NHẬT GIÁ BÁN & GIÁ NPP THEO TỪNG KÊNH'],
  ['(Chỉ cần chỉnh sửa mức giá của kênh cần cập nhật. Cột nào không đổi có thể giữ nguyên hoặc để trống)'],
  ['Ngày tạo biểu mẫu: 09/11/2026 | Quy mô danh mục chuẩn: 63 Model Lock&King & Takin'],
  [],
  [
    'STT',
    'Mã Model (*)',
    'Tên Sản Phẩm',
    'Thương Hiệu',
    'Phân Loại',
    'ĐVT',
    '[ONLINE] Giá NPP (VNĐ)',
    '[ONLINE] Giá Facebook (VNĐ)',
    '[ONLINE] Giá Sàn TMĐT (VNĐ)',
    '[ONLINE] Giá Niêm Yết (VNĐ)',
    '[OFFLINE] Giá NPP (VNĐ)',
    '[OFFLINE] Giá Đại Lý (VNĐ)',
    'Giá Vốn / Giá Nhập (VNĐ)',
    'Lợi Nhuận NPP Online (VNĐ)',
    '% LN NPP / FB',
    'Ghi Chú Nghiệp Vụ'
  ]
];

products.forEach((p, idx) => {
  const rowNum = idx + 6; // Dòng 1-based trong Excel (dòng dữ liệu bắt đầu từ 6)
  const stt = p.stt || (idx + 1);
  const nppOn = p.nppOnlinePrice || 0;
  const fb = p.facebookPrice || 0;
  const tmdt = p.tmdtPrice || 0;
  const ret = p.retailPrice || 0;
  const nppOff = p.nppOfflinePrice || nppOn;
  const dlOff = p.dealerOfflinePrice || Math.round(nppOff * 1.2);
  const cost = p.newImportPrice || p.costPrice || 0;
  const profit = fb - nppOn;
  const profitPct = fb > 0 ? ((profit / fb) * 100).toFixed(1) + '%' : '0.0%';

  sheet1Aoa.push([
    stt,
    p.canonicalCode,
    p.name,
    p.brand,
    p.categoryName,
    p.unit || 'Cái',
    nppOn,
    fb,
    tmdt,
    ret,
    nppOff,
    dlOff,
    cost,
    profit,
    profitPct,
    ''
  ]);
});

const ws1 = XLSX.utils.aoa_to_sheet(sheet1Aoa);

// Gán công thức Excel cho cột Lợi nhuận (cột N = H - G) và % LN (cột O = N / H)
products.forEach((p, idx) => {
  const r = idx + 6;
  // Cột N (Lợi nhuận NPP Online) = H (Facebook) - G (NPP Online)
  ws1['N' + r] = { t: 'n', f: `H${r}-G${r}`, v: (p.facebookPrice || 0) - (p.nppOnlinePrice || 0) };
  // Cột O (% LN NPP / FB) = N (Lợi Nhuận) / H (Facebook)
  const pctVal = p.facebookPrice > 0 ? ((p.facebookPrice - p.nppOnlinePrice) / p.facebookPrice) : 0;
  ws1['O' + r] = { t: 'n', f: `IF(H${r}>0, N${r}/H${r}, 0)`, z: '0.0%', v: pctVal };
});

ws1['!cols'] = [
  { wch: 6 },  // STT
  { wch: 16 }, // Mã Model
  { wch: 42 }, // Tên Sản Phẩm
  { wch: 14 }, // Thương Hiệu
  { wch: 16 }, // Phân Loại
  { wch: 10 }, // ĐVT
  { wch: 24 }, // [ONLINE] Giá NPP
  { wch: 24 }, // [ONLINE] Giá Facebook
  { wch: 24 }, // [ONLINE] Giá Sàn TMĐT
  { wch: 24 }, // [ONLINE] Giá Niêm Yết
  { wch: 24 }, // [OFFLINE] Giá NPP
  { wch: 24 }, // [OFFLINE] Giá Đại Lý
  { wch: 24 }, // Giá Vốn / Giá Nhập
  { wch: 26 }, // Lợi Nhuận NPP Online
  { wch: 16 }, // % LN NPP / FB
  { wch: 35 }  // Ghi Chú Nghiệp Vụ
];

XLSX.utils.book_append_sheet(wb, ws1, 'CapNhat_Gia_63_Model');

// ================= SHEET 2: Mau_Dien_Nhanh_Vai_Ma =================
const sheet2Aoa = [
  ['MẪU ĐIỀN NHANH - CẬP NHẬT GIÁ CHO MỘT VÀI MÃ SẢN PHẨM'],
  ['(Dành cho trường hợp chỉ thay đổi giá của 1 vài mã: Bạn chỉ cần điền Mã Model và cột giá cần đổi)'],
  ['Hệ thống sẽ chỉ cập nhật những mã và những cột giá có dữ liệu trên sheet này.'],
  [],
  [
    'STT',
    'Mã Model (*)',
    'Tên Sản Phẩm (Tùy chọn)',
    'Thương Hiệu',
    'Phân Loại',
    'ĐVT',
    '[ONLINE] Giá NPP (VNĐ)',
    '[ONLINE] Giá Facebook (VNĐ)',
    '[ONLINE] Giá Sàn TMĐT (VNĐ)',
    '[ONLINE] Giá Niêm Yết (VNĐ)',
    '[OFFLINE] Giá NPP (VNĐ)',
    '[OFFLINE] Giá Đại Lý (VNĐ)',
    'Giá Vốn / Giá Nhập (VNĐ)',
    'Lợi Nhuận NPP Online (VNĐ)',
    '% LN NPP / FB',
    'Ghi Chú Nghiệp Vụ'
  ]
];

// Tạo 15 dòng trống có công thức sẵn để người dùng điền nhanh
for (let i = 1; i <= 15; i++) {
  sheet2Aoa.push([i, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
}

const ws2 = XLSX.utils.aoa_to_sheet(sheet2Aoa);
// Gán công thức mẫu cho dòng 6 và 7
[6, 7, 8, 9, 10, 11, 12, 13, 14, 15].forEach(r => {
  ws2['N' + r] = { t: 'n', f: `IF(AND(H${r}>0, G${r}>0), H${r}-G${r}, "")` };
  ws2['O' + r] = { t: 'n', f: `IF(AND(H${r}>0, N${r}<>""), N${r}/H${r}, "")`, z: '0.0%' };
});

ws2['!cols'] = ws1['!cols'];
XLSX.utils.book_append_sheet(wb, ws2, 'Mau_Dien_Nhanh_Vai_Ma');

// ================= SHEET 3: Huong_Dan_Su_Dung =================
const sheet3Aoa = [
  ['HƯỚNG DẪN SỬ DỤNG BIỂU MẪU CẬP NHẬT GIÁ PHÂN PHỐI & BÁN LẺ'],
  ['CÔNG TY TNHH HỢP TÁC VŨ GIA - PHẦN MỀM QUẢN TRỊ BẢNG GIÁ VŨ GIA'],
  [],
  ['1. CÁC KÊNH GIÁ TRONG PHẦN MỀM VÀ QUY TẮC TÍNH TOÁN:'],
  ['Tên Cột Trên Excel', 'Ý Nghĩa Nghiệp Vụ', 'Kênh Áp Dụng', 'Ghi Chú & Công Thức Liên Quan'],
  ['Mã Model (*)', 'Mã SKU nhận diện sản phẩm duy nhất', 'Toàn bộ', 'BẮT BUỘC ĐÚNG (VD: LK-2202A, LK-8920, TK-036A). Hệ thống dùng mã này để cập nhật đúng sản phẩm.'],
  ['[ONLINE] Giá NPP (VNĐ)', 'Giá bán cho Nhà Phân Phối / Đại lý online', 'Kênh Online', 'Giá giao buôn cho đối tác bán hàng trực tuyến / chạy quảng cáo.'],
  ['[ONLINE] Giá Facebook (VNĐ)', 'Giá bán lẻ đề xuất trên Facebook', 'Kênh Bán Lẻ', 'Mức giá bán lẻ mục tiêu trên Fanpage / Livestream / TikTok.'],
  ['[ONLINE] Giá Sàn TMĐT (VNĐ)', 'Giá bán lẻ trên Sàn TMĐT', 'Shopee, TikTok Shop, Lazada', 'Thường cao hơn Facebook khoảng 5% - 8% để bù chi phí sàn thương mại.'],
  ['[ONLINE] Giá Niêm Yết (VNĐ)', 'Giá niêm yết chính thức', 'Website / Showroom', 'Giá công bố chính thức, thường cao hơn sàn TMĐT khoảng 20%.'],
  ['[OFFLINE] Giá NPP (VNĐ)', 'Giá bán cho NPP truyền thống', 'Kênh GT / Offline', 'Giá giao cho các Nhà phân phối tỉnh, đại lý phân phối khu vực.'],
  ['[OFFLINE] Giá Đại Lý (VNĐ)', 'Giá bán cho Điểm bán / Đại lý cấp 2', 'Kênh GT / Điểm Bán', 'Thường được tính tự động = [Giá NPP Offline] x 120%.'],
  ['Giá Vốn / Giá Nhập (VNĐ)', 'Giá vốn nhập hàng vào kho', 'Quản trị nội bộ', 'Dùng để tính tỷ suất sinh lời gộp và kiểm soát giá vốn.'],
  ['Lợi Nhuận NPP Online', 'Mức lãi gộp của NPP khi bán FB', 'Kênh Online', 'Tự động tính = [Giá Facebook] - [Giá NPP Online].'],
  ['% LN NPP / FB', 'Tỷ suất lợi nhuận NPP trên giá FB', 'Kênh Online', 'Tự động tính = [Lợi Nhuận] / [Giá Facebook]. Đạt trung bình 40% - 48%.'],
  [],
  ['2. QUY TẮC ĐIỀN DỮ LIỆU:'],
  ['- Trường hợp cập nhật nhiều mã hoặc rà soát lại toàn bộ: Sử dụng Sheet "CapNhat_Gia_63_Model". Bạn có thể sửa trực tiếp số tiền ở bất kỳ cột kênh nào.'],
  ['- Trường hợp chỉ cập nhật 1 hoặc vài mã cụ thể: Bạn có thể dùng Sheet "Mau_Dien_Nhanh_Vai_Ma", chỉ cần gõ Mã Model và điền giá mới vào cột cần thay đổi.'],
  ['- Cột nào KHÔNG thay đổi giá: Bạn giữ nguyên giá cũ hoặc để trống ô đó, phần mềm sẽ tự động giữ nguyên mức giá hiện tại.'],
  ['- Không sửa đổi giá trị cột "Mã Model (*)" để tránh bị lệch mã sản phẩm.'],
  [],
  ['3. CÁCH ĐẨY DỮ LIỆU LÊN PHẦN MỀM (2 CÁCH TIỆN LỢI):'],
  ['Cách 1 (Nhanh nhất - Nhờ Trợ Lý AI):', 'Sau khi điền xong và lưu file Excel này, bạn chỉ cần gửi file vào khung chat cho Antigravity AI và nhắn "Cập nhật giá từ file này lên phần mềm giúp tôi". AI sẽ tự động đọc file, đối soát giá cũ - mới và cập nhật toàn bộ database trong 5 giây!'],
  ['Cách 2 (Tự thao tác trên Web phần mềm):', 'Mở phần mềm index.html -> Chọn Tab "Nhập Bảng Giá Từ Excel" (Tab 5) -> Kéo thả hoặc nhấp chọn file này -> Hệ thống sẽ hiển thị bảng đối soát -> Nhấn nút "Phê duyệt & Cập nhật" để hoàn tất.'],
  [],
  ['Mọi thắc mắc kỹ thuật vui lòng liên hệ Ban Quản Trị Hệ Thống - Công ty TNHH Hợp tác Vũ Gia.']
];

const ws3 = XLSX.utils.aoa_to_sheet(sheet3Aoa);
ws3['!cols'] = [
  { wch: 32 },
  { wch: 38 },
  { wch: 28 },
  { wch: 65 }
];
XLSX.utils.book_append_sheet(wb, ws3, 'Huong_Dan_Su_Dung');

// Lưu file
const outPath = path.join(__dirname, 'mau_cap_nhat_gia_theo_kenh.xlsx');
XLSX.writeFile(wb, outPath);
console.log('SUCCESS: Đã tạo thành công file: ' + outPath);

// Lưu thêm bản tên viết hoa ngắn gọn để tiện tải về
const outPath2 = path.join(__dirname, 'BANG_CAP_NHAT_GIA_THEO_KENH.xlsx');
XLSX.writeFile(wb, outPath2);
console.log('SUCCESS: Đã tạo bản sao: ' + outPath2);
