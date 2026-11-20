const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

console.log('=== TẠO BIỂU MẪU EXCEL ĐIỀN SẢN PHẨM MỚI (CÔNG TY TNHH HỢP TÁC VŨ GIA) ===');

const wb = XLSX.utils.book_new();

// ================= SHEET 1: Nhap_Ma_Moi =================
const sheet1Aoa = [
  ['CÔNG TY TNHH HỢP TÁC VŨ GIA - BIỂU MẪU ĐIỀN THÔNG TIN SẢN PHẨM MỚI BỔ SUNG LÊN PHẦN MỀM'],
  ['(Quý khách/Anh/Chị chỉ cần điền thông tin các mã mới vào các dòng bên dưới. Cột màu xanh có sẵn công thức tự động tính)'],
  ['Quy tắc: Các cột có dấu (*) là bắt buộc. Sau khi điền xong, lưu file và gửi lại cho Trợ lý AI để cập nhật lên hệ thống.'],
  [],
  [
    'STT',
    'Mã Model (SKU) (*)',
    'Tên Sản Phẩm (*)',
    'Thương Hiệu (*)',
    'Nhóm Hàng / Phân Loại',
    'ĐVT',
    'Giá Vốn / Giá Nhập (VNĐ)',
    '[ONLINE] Giá NPP (VNĐ) (*)',
    '[ONLINE] Giá Facebook (VNĐ) (*)',
    '[ONLINE] Giá Sàn TMĐT (VNĐ)',
    '[ONLINE] Giá Niêm Yết (VNĐ)',
    'Lợi Nhuận NPP Online (VNĐ)',
    '% LN NPP / FB',
    '[OFFLINE] Giá NPP (VNĐ)',
    '[OFFLINE] Giá Đại Lý (VNĐ)',
    'Thông Số Kỹ Thuật / Đặc Điểm Nổi Bật',
    'Tên File Ảnh (Hoặc gửi sau)',
    'Ghi Chú Nghiệp Vụ'
  ]
];

// Tạo 25 dòng trống để người dùng nhập liệu
for (let i = 1; i <= 25; i++) {
  sheet1Aoa.push([
    i,   // A: STT
    '',  // B: Mã Model
    '',  // C: Tên Sản Phẩm
    'Lock&King', // D: Thương hiệu
    '',  // E: Phân loại
    'Chiếc', // F: ĐVT
    '',  // G: Giá vốn
    '',  // H: Giá NPP Online
    '',  // I: Giá Facebook
    '',  // J: Giá Sàn TMĐT
    '',  // K: Giá Niêm Yết
    '',  // L: Lợi nhuận NPP Online
    '',  // M: % LN
    '',  // N: Giá NPP Offline
    '',  // O: Giá Đại lý Offline
    '',  // P: Thông số kỹ thuật
    '',  // Q: File ảnh
    ''   // R: Ghi chú
  ]);
}

const ws1 = XLSX.utils.aoa_to_sheet(sheet1Aoa);

// Cài đặt công thức Excel tự động cho các cột J, K, L, M, O (dòng 6 đến dòng 30)
for (let r = 6; r <= 30; r++) {
  // J: Giá Sàn TMĐT = Nếu chưa nhập thì tự tính = Giá FB * 1.05 (làm tròn nghìn)
  ws1[`J${r}`] = { t: 'n', f: `IF(I${r}>0, ROUNDUP(I${r}*1.05, -3), "")` };

  // K: Giá Niêm Yết = Nếu chưa nhập thì tự tính = Giá Sàn TMĐT * 1.20 (làm tròn nghìn)
  ws1[`K${r}`] = { t: 'n', f: `IF(J${r}>0, ROUNDUP(J${r}*1.2, -3), IF(I${r}>0, ROUNDUP(I${r}*1.26, -3), ""))` };

  // L: Lợi Nhuận NPP Online = Giá FB (I) - Giá NPP Online (H)
  ws1[`L${r}`] = { t: 'n', f: `IF(AND(I${r}>0, H${r}>0), I${r}-H${r}, "")` };

  // M: % LN NPP / FB = Lợi Nhuận (L) / Giá FB (I)
  ws1[`M${r}`] = { t: 'n', f: `IF(AND(I${r}>0, L${r}<>""), L${r}/I${r}, "")`, z: '0.0%' };

  // O: Giá Đại Lý Offline = Nếu có Giá NPP Offline (N) thì = N * 1.2, nếu không thì lấy = H * 1.2
  ws1[`O${r}`] = { t: 'n', f: `IF(N${r}>0, ROUNDUP(N${r}*1.2, -3), IF(H${r}>0, ROUNDUP(H${r}*1.2, -3), ""))` };
}

// Định dạng độ rộng cột cho Sheet 1
ws1['!cols'] = [
  { wch: 6 },  // A: STT
  { wch: 18 }, // B: Mã Model
  { wch: 38 }, // C: Tên Sản Phẩm
  { wch: 14 }, // D: Thương Hiệu
  { wch: 22 }, // E: Nhóm Hàng
  { wch: 10 }, // F: ĐVT
  { wch: 22 }, // G: Giá Vốn
  { wch: 24 }, // H: Giá NPP Online
  { wch: 24 }, // I: Giá Facebook
  { wch: 24 }, // J: Giá Sàn TMĐT
  { wch: 24 }, // K: Giá Niêm Yết
  { wch: 26 }, // L: Lợi Nhuận NPP Online
  { wch: 16 }, // M: % LN
  { wch: 24 }, // N: Giá NPP Offline
  { wch: 24 }, // O: Giá Đại Lý Offline
  { wch: 45 }, // P: Thông số kỹ thuật
  { wch: 25 }, // Q: File ảnh
  { wch: 30 }  // R: Ghi chú
];

XLSX.utils.book_append_sheet(wb, ws1, 'Nhap_Ma_Moi');

// ================= SHEET 2: Mau_Vi_Du_Dien_San_Pham =================
const sheet2Aoa = [
  ['VÍ DỤ THỰC TẾ CÁCH ĐIỀN SẢN PHẨM MỚI (THAM KHẢO)'],
  ['(Đây là các mã sản phẩm đã được bổ sung thành công vào phần mềm để Anh/Chị tham khảo cách điền)'],
  [],
  [
    'STT',
    'Mã Model (SKU)',
    'Tên Sản Phẩm',
    'Thương Hiệu',
    'Nhóm Hàng / Phân Loại',
    'ĐVT',
    'Giá Vốn / Giá Nhập (VNĐ)',
    '[ONLINE] Giá NPP (VNĐ)',
    '[ONLINE] Giá Facebook (VNĐ)',
    '[ONLINE] Giá Sàn TMĐT (VNĐ)',
    '[ONLINE] Giá Niêm Yết (VNĐ)',
    'Lợi Nhuận NPP (VNĐ)',
    '% LN NPP / FB',
    '[OFFLINE] Giá NPP (VNĐ)',
    '[OFFLINE] Giá Đại Lý (VNĐ)',
    'Thông Số Kỹ Thuật / Đặc Điểm Nổi Bật',
    'Tên File Ảnh',
    'Ghi Chú Nghiệp Vụ'
  ],
  [
    1,
    'LK-8920',
    'Bếp từ đơn cảm ứng Lock&King 2000W',
    'Lock&King',
    'Bếp từ',
    'Chiếc',
    556000,
    690000,
    1290000,
    1354500,
    1626000,
    600000,
    '46.5%',
    690000,
    828000,
    'Công suất 2000W, phím cảm ứng đa năng, mặt kính chịu nhiệt chống trầy, bảo hành 12 tháng',
    'LK-8920.png',
    'Mã mới bổ sung đợt tháng 10'
  ],
  [
    2,
    'LK-8989',
    'Bếp từ đơn cao cấp Lock&King 2200W',
    'Lock&King',
    'Bếp từ',
    'Chiếc',
    650000,
    790000,
    1490000,
    1564500,
    1878000,
    700000,
    '47.0%',
    790000,
    948000,
    'Công suất 2200W, phím điều khiển Slider thông minh, gia nhiệt siêu tốc',
    'LK-8989.png',
    'Mã mới bổ sung đợt tháng 10'
  ],
  [
    3,
    'LK-8818',
    'Nồi cơm điện cao tần Lock&King (IH)',
    'Lock&King',
    'Nồi cơm điện',
    'Chiếc',
    1400000,
    1790000,
    3400000,
    3570000,
    4284000,
    1610000,
    '47.4%',
    1790000,
    2148000,
    'Đốt nóng cảm ứng từ IH 360 độ hạt cơm dẻo ngọt, lòng nồi hợp kim 7 lớp',
    'LK-8818.png',
    'Mã mới bổ sung đợt tháng 10'
  ],
  [
    4,
    'LK-6886',
    'Tủ sấy quần áo công suất lớn Model: LK-6886',
    'Lock&King',
    'Tủ sấy',
    'Chiếc',
    620000,
    770000,
    1490000,
    1564500,
    1878000,
    720000,
    '48.3%',
    770000,
    924000,
    'Tủ khung inox chịu lực 30kg, sấy đối lưu 3D diệt khuẩn bằng nhiệt, hẹn giờ thông minh',
    'LK-6886.png',
    'Mã mới bổ sung đợt tháng 10'
  ]
];

const ws2 = XLSX.utils.aoa_to_sheet(sheet2Aoa);
ws2['!cols'] = ws1['!cols'];
XLSX.utils.book_append_sheet(wb, ws2, 'Mau_Vi_Du_Dien_San_Pham');

// ================= SHEET 3: Huong_Dan_Su_Dung =================
const sheet3Aoa = [
  ['HƯỚNG DẪN ĐIỀN THÔNG TIN VÀ CẬP NHẬT MÃ MỚI LÊN PHẦN MỀM'],
  ['CÔNG TY TNHH HỢP TÁC VŨ GIA - PHẦN MỀM QUẢN TRỊ BẢNG GIÁ VŨ GIA'],
  [],
  ['1. CÁC THÔNG TIN CẦN THIẾT KHI THÊM SẢN PHẨM MỚI:'],
  ['Tên Cột', 'Bắt Buộc?', 'Ý Nghĩa & Gợi Ý Nhập Liệu'],
  ['Mã Model (SKU)', 'BẮT BUỘC (*)', 'Mã ký hiệu của sản phẩm (VD: LK-8920, LK-9014, TK-036A). Mã này là duy nhất.'],
  ['Tên Sản Phẩm', 'BẮT BUỘC (*)', 'Tên gọi đầy đủ hiển thị trên báo giá và website (VD: Bếp từ đơn 2000W, Nồi cơm tách đường 1.8L).'],
  ['Thương Hiệu', 'BẮT BUỘC (*)', 'Thương hiệu sản phẩm: Lock&King hoặc Takin.'],
  ['Nhóm Hàng / Phân Loại', 'Khuyến nghị', 'Nhóm danh mục (VD: Chảo, Nồi & Bộ nồi, Bếp từ, Nồi cơm điện, Đồ điện, Đèn sưởi, Tủ sấy...).'],
  ['Đơn Vị Tính', 'Tùy chọn', 'Chiếc, Cái, Bộ, Thùng... (Mặc định là Chiếc).'],
  ['Giá Vốn / Giá Nhập', 'Khuyến nghị', 'Giá vốn nhập hàng vào kho để quản lý biên lợi nhuận công ty.'],
  ['[ONLINE] Giá NPP', 'BẮT BUỘC (*)', 'Giá bán buôn phân phối cho các đối tác, nhà phân phối kênh Online.'],
  ['[ONLINE] Giá Facebook', 'BẮT BUỘC (*)', 'Giá bán lẻ mục tiêu trên kênh Online (Fanpage, Livestream, TikTok).'],
  ['[ONLINE] Giá Sàn TMĐT', 'Tự động tính', 'Mặc định tự tính = Giá FB x 105% (làm tròn nghìn). Bạn có thể tự gõ đè nếu có mức giá riêng.'],
  ['[ONLINE] Giá Niêm Yết', 'Tự động tính', 'Mặc định tự tính = Giá Sàn x 120% (làm tròn nghìn). Bạn có thể tự gõ đè nếu có mức giá riêng.'],
  ['Lợi Nhuận NPP Online', 'Tự động tính', 'Tự động tính = [Giá Facebook] - [Giá NPP Online].'],
  ['% LN NPP / FB', 'Tự động tính', 'Tự động tính = [Lợi Nhuận] / [Giá Facebook]. Đạt trung bình 40% - 48%.'],
  ['[OFFLINE] Giá NPP', 'Tùy chọn', 'Giá phân phối cho đại lý truyền thống/cửa hàng (Nếu để trống, hệ thống sẽ lấy bằng giá Online).'],
  ['[OFFLINE] Giá Đại Lý', 'Tự động tính', 'Mặc định tự tính = Giá NPP Offline x 120%.'],
  ['Thông Số Kỹ Thuật', 'Khuyến nghị', 'Công suất, dung tích, chất liệu, kích thước, quy cách đóng thùng, thời gian bảo hành...'],
  ['Tên File Ảnh', 'Tùy chọn', 'Tên file hình ảnh sản phẩm (Nếu chưa có ảnh thì có thể để trống và gửi ảnh bổ sung sau).'],
  [],
  ['2. QUY TRÌNH CẬP NHẬT LÊN PHẦN MỀM:'],
  ['Bước 1:', 'Mở Sheet "Nhap_Ma_Moi", điền thông tin các sản phẩm mới vào từng dòng.'],
  ['Bước 2:', 'Lưu file Excel (Ctrl + S).'],
  ['Bước 3:', 'Gửi file Excel này vào khung chat cho Trợ lý AI và nhắn: "Cập nhật các mã mới này lên phần mềm giúp tôi".'],
  ['Bước 4:', 'Trợ lý AI sẽ tự động: Thêm mã mới vào danh mục phần mềm, đồng bộ database, cập nhật web và xuất bảng giá Excel mới nhất!'],
  [],
  ['Ban Quản Trị Hệ Thống - Công ty TNHH Hợp tác Vũ Gia trân trọng hỗ trợ!']
];

const ws3 = XLSX.utils.aoa_to_sheet(sheet3Aoa);
ws3['!cols'] = [
  { wch: 26 },
  { wch: 18 },
  { wch: 75 }
];
XLSX.utils.book_append_sheet(wb, ws3, 'Huong_Dan_Su_Dung');

// Lưu file
const outPath1 = path.join(__dirname, 'MAU_THEM_SAN_PHAM_MOI_VU_GIA.xlsx');
XLSX.writeFile(wb, outPath1);
console.log('✅ Đã tạo thành công file: ' + outPath1);

// Tạo thêm bản copy tên không dấu
const outPath2 = path.join(__dirname, 'mau_them_san_pham_moi.xlsx');
XLSX.writeFile(wb, outPath2);
console.log('✅ Đã tạo bản sao: ' + outPath2);
