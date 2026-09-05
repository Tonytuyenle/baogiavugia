const fs = require('fs');
const path = require('path');

const rawImportData = `Model	Tên sản phẩm	Thông số kỹ thuật	Thương hiệu/NCC	Giá nhập cũ	Giá nhập mới / áp dụng
LK-2202A	chảo cạn Titan vàng 22*5,5cm (2,2 mm) LK-2202A	CHẢO CẠN TITANIUM Chất liệu inox cao cấp Chất liệu inox 316 Kích thước 22*5.5cm, dày 2.2mm Chống dính bằng titanium (tạo kháng khuẩn tự nhiên) Đúc liền khối 5 lớp Tay cầm đinh tán chắc chắn	LOCK&KING	193,466 đ	204,786 đ
LK-2404S	Chảo sâu Titan vàng 24*8,5cm (2,3 mm) LK-2404S	CHẢO SÂU TITANIUM Chất liệu inox cao cấp Chất liệu inox 316 Kích thước 24*28,5cm, dày 2.3mm Chống dính bằng titanium (tạo kháng khuẩn tự nhiên) Đúc liền khối 5 lớp Nắp đậy tiện dụng Tay cầm đinh tán chắc chắn	LOCK&KING	251,705 đ	251,705 đ
LK-2433	Chảo Belly Lock&King	Chảo Belly Lock&King Chất liệu: Inox, Titanium  Khối lượng: 2 Kg  Kích thước: 24 Cm  Chống dính: Titanium bền bỉ  Chảo: 5 lớp liền khối  Phù hợp: Bếp từ, bếp gas, bếp halogen, bếp điện  Bảo hành: 12 Tháng.	LOCK&KING	298,559 đ	307,555 đ
LK-2466S	Chảo Titanium  ELITE Lock&King	Chảo Titanium Elite; Inox 316 kết hợp Titanium; đường kính 24 cm; khối lượng khoảng 1,9 kg; chống dính Titanium; cấu tạo 5 lớp liền khối; dùng cho bếp từ, gas, halogen và bếp điện; bảo hành 12 tháng.	LOCK&KING	288,664 đ	289,484 đ
LK-2606A	Chảo cạn Titanium Lock&king 26cm	Chảo cạn đường kính 26 cm, thành cao khoảng 5,5 cm; khối lượng khoảng 1,5 kg; Inox 316 phủ Nano Titanium; đáy từ 5 lớp liền khối; dùng cho bếp từ, gas, hồng ngoại và halogen; bảo hành 12 tháng.	LOCK&KING	242,251 đ	238,375 đ
LK-2633	Chảo Belly Lock&King Titanium 26cm	Chất liệu Inox 316 kết hợp Titanium; đường kính 26 cm; khối lượng khoảng 2 kg; chống dính Titanium; cấu tạo 5 lớp liền khối; kèm vung; dùng cho bếp từ, gas, halogen và bếp điện; bảo hành 12 tháng.	LOCK&KING	349,728 đ	350,676 đ
LK-2808	Chảo cạn Titan vàng 28*7cm (2,3 mm)	CHẢO CẠN TITANIUM Chất liệu inox cao cấp Chất liệu inox 316 Model: LK-2808 Chất liệu inox 316 Cao cấp Kích thước 28*7cm, dày 2.2mm Chống dính bằng titanium (tạo kháng khuẩn tự nhiên) Đúc liền khối 5 lớp Tay cầm đinh tán chắc chắn"	LOCK&KING	254,000 đ	267,721 đ
LK-2808S(VK)	Chảo sâu vung kính Titanium Lock&king 28cm	Chảo sâu lòng Titanium đường kính 28 cm, kèm vung kính; thân inox cao cấp; phủ Nano Titanium chống dính; đáy từ 5 lớp; dùng cho bếp từ, gas, điện, hồng ngoại và halogen.	LOCK&KING	320,736 đ	320,736 đ
LK-2808SA	Chảo sâu Titan vàng 28*9cm (2,3 mm) LK-2808SA	CHẢO SÂU TITANIUM Chất liệu inox cao cấp Chất liệu inox 316 Kích thước 28*9cm, dày 2.3mm Chống dính bằng titanium (tạo kháng khuẩn tự nhiên) Đúc liền khối 5 lớp Nắp đậy tiện dụng Tay cầm đinh tán chắc chắn	LOCK&KING	319,135 đ	319,135 đ
LK-2808SA KHÔNG NẮP	Chảo sâu Titan vàng 28*9cm (2,3 mm) LK-2808SA KHÔNG NẮP	CHẢO SÂU TITANIUM Chất liệu inox cao cấp Chất liệu inox 316 Kích thước 28*9cm, dày 2.3mm Chống dính bằng titanium (tạo kháng khuẩn tự nhiên) Đúc liền khối 5 lớp Nắp đậy tiện dụng Tay cầm đinh tán chắc chắn	LOCK&KING	300,792 đ	320,736 đ
LK-3003	Chảo cạn titanium Lock&King 30cm	Chảo cạn Titanium đường kính 30 cm; thân inox cao cấp; chống dính Titanium; đáy từ; dùng trên nhiều loại bếp. Chưa tìm thấy nguồn online khớp tuyệt đối Model, cần hãng xác nhận cấu tạo và khối lượng.	LOCK&KING	290,620 đ	291,830 đ
LK-3212	Chảo xào lớn	Tên sản phẩm: Chảo xào lớn Model: LK-3212 Chất liệu: Inox 316 Đóng gói: 4 chiếc/ thùng	LOCK&KING	476,000 đ	472,432 đ
LK-30NC1	Nồi luộc gà Lock&King size 30	Nồi luộc gà Inox cao cấp LOCK&KING LK-30NC1  Chất liệu: Inox cao cấp  Tay cầm: Quai đinh tán chắc chắn  Vung: Kính cường lực bền bỉ  Kích thước: 30 cm  Khối lượng: 3,1 kg  Sử dụng: Bếp từ, bếp ga, bếp Halogen, bếp điện  Bảo hành: 12 tháng	LOCK&KING	321,000 đ	336,906 đ
LK-32NC1	Nồi luộc gà Lock&King size 32	Nồi luộc gà Inox cao cấp LOCK&KING LK-32NC  Chất liệu: Inox cao cấp  Tay cầm: Quai đinh tán chắc chắn  Vung: Kính cường lực bền bỉ  Kích thước: 32 cm  Khối lượng: 3,5 kg  Sử dụng: Bếp từ, bếp ga, bếp Halogen, bếp điện  Bảo hành: 12 tháng	LOCK&KING	406,600 đ	400,473 đ
LK-336A	Bộ nồi 3 Lock&King ( 18,20,24 )	Bộ Nồi Inox 5 đáy Cao Cấp Lock&King LK-336A    Chất liệu: Inox Cao cấp  Sử dụng: Bếp từ, bếp ga, bếp Halogen, bếp điện  Công nghệ: Đáy 5 lớp chống phồng  Quai: Đinh tán chắc chắn  Kích thước: 18 – 20 – 24 cm  Khối lượng: 6kg	LOCK&KING	411,695 đ	411,881 đ
LK-3018A	Nồi lẻ Lock&king 18	Nồi Inox 5 Đáy Cao Cấp Lock&King LK-3018A   Chất liệu: Inox cao cấp  Tay cầm: Quai đinh tán chắc chắn  Vung: Kính cường lực bền bỉ  Kích thước: 18 cm  Khối lượng: 1,65 kg  Sử dụng: Bếp từ, bếp ga, bếp Halogen, bếp điện  Bảo hành: 12 tháng	LOCK&KING	133,495 đ	131,000 đ
LK-3020A	Nồi lẻ Lock&king 20	Nồi Inox 5 Đáy Cao Cấp Lock&King LK-3020A    Chất liệu: Inox cao cấp  Tay cầm: Quai đinh tán chắc chắn  Vung: Kính cường lực bền bỉ  Kích thước: 20 cm  Khối lượng: 2 kg  Sử dụng: Bếp từ, bếp ga, bếp Halogen, bếp điện  Bảo hành: 12 tháng	LOCK&KING	149,800 đ	148,885 đ
LK-3024	Nồi lẻ Lock&king 24	Nồi Inox 5 Đáy Cao Cấp Lock&King LK-3024   Chất liệu: Inox cao cấp  Tay cầm: Quai đinh tán chắc chắn  Vung: Kính cường lực bền bỉ  Kích thước: 20 cm  Khối lượng: 2 kg  Sử dụng: Bếp từ, bếp ga, bếp Halogen, bếp điện  Bảo hành: 12 tháng	LOCK&KING	187,505 đ	183,215 đ
LK-3116	16*9CM Quánh liền khối titan (2.2mm) LK-3116	Quánh Titanium Cao Cấp Thương hiệu: Lock&King Model: LK-3116 Màu sắc: Nâu bạc Chất liệu: Inox 316, Titanium Đúc liền khối 5 lớp Thể tích: 1.8 Lít Trọng lượng: 1.3 Kg Phù hợp mọi loại bếp. Bắt nhiệt nhanh, tiết kiệm thời gian An toàn cho sức khỏe	LOCK&KING	242,533 đ	236,683 đ
LK-3118	18*10CM Nồi lẻ kèm nắp (2.3mm) LK-3118	Tên sản phẩm: Nồi Titanium Cao Cấp Thương hiệu: Lock&King Model: LK- 3118 Màu sắc: Nâu bạc Chất liệu: Inox 316, Titanium Đúc liền khối 5 lớp Thể tích: 2.5 Lít Trọng lượng: 1.3Kg Phù hợp mọi loại bếp. Bắt nhiệt nhanh, tiết kiệm thời gian An toàn cho sức khỏe	LOCK&KING	277,181 đ	265,000 đ
LK-3120	20*12CM Nồi lẻ kèm nắp (2.3mm) LK-3120	Tên sản phẩm: Nồi Titanium Cao Cấp Thương hiệu: Lock&King Model: LK- 3120 Màu sắc: Nâu bạc Chất liệu: Inox 316, Titanium Đúc liền khối 5 lớp Thể tích: 3.6 Lít Trọng lượng: 1.7Kg Phù hợp mọi loại bếp. Bắt nhiệt nhanh, tiết kiệm thời gian An toàn cho sức khỏe	LOCK&KING	310,810 đ	297,124 đ
LK-3124	24*14CM Nồi lẻ kèm nắp (2.3mm) LK-3124	Nồi Titanium Cao Cấp Thương hiệu: Lock&King Model: LK- 3124 Màu sắc: Nâu bạc Chất liệu: Inox 316, Titanium Đúc liền khối 5 lớp Thể tích: 6.3 Lít Trọng lượng: 2.3Kg Phù hợp mọi loại bếp. Bắt nhiệt nhanh, tiết kiệm thời gian An toàn cho sức khỏe	LOCK&KING	371,952 đ	359,737 đ
LK-3338	18+20+24CM Bộ nồi 3 liền khối kèm nắp (2.3mm) LK-3338	Tên sản phẩm: Bộ Nồi 3 Món Titanium Cao Cấp Thương hiệu: Lock&King Model: LK-3338 Màu sắc: Nâu bạc Chất liệu: Inox 316, Titanium Đúc liền khối 5 lớp Thể tích: 2.5 - 3.6 - 6.3 Lít Kích thước: 18 - 20 - 24 cm Trọng lượng: 5.9Kg Phù hợp mọi loại bếp. Bắt nhiệt nhanh, tiết kiệm thời gian An toàn cho sức khỏe	LOCK&KING	923,257 đ	883,000 đ
LK-3386A	Bộ nồi 3 Inox 5 đáy Lock&king (18.20.24) (1t/4c)	Bộ 3 nồi inox cao cấp kích thước 18–20–24 cm; đáy từ 5 lớp chống phồng; quai đinh tán; dùng cho bếp từ, gas, halogen và bếp điện. Thông số đối chiếu theo dòng LK-3386A, cần hãng xác nhận hậu tố A.	LOCK&KING	459,339 đ	453,015 đ
LK-3568A	Bộ nồi 5 Inox 5 đáy Lock&king (Q16.18.20.24.C24) (1t/2c)	Bộ 5 món kích thước 16–18–20–24–24 cm; inox cao cấp; đáy 5 lớp chống phồng; quai đinh tán; khối lượng khoảng 6 kg; dùng cho bếp từ, gas, halogen và bếp điện.	LOCK&KING	827,064 đ	815,667 đ
LK-3122	22*13.5CM Nồi áp suất kèm xửng hấp đa năng (1.8mm) LK-3122	Nồi tăng áp Đa Năng Cao Cấp Thương hiệu: Lock&King Model: LK-3122 Màu sắc: Bạc xanh Chất liệu: Inox 316 Đúc liền khối 5 lớp Trọng lượng: 3.3 Kg Phù hợp mọi loại bếp. Bắt nhiệt nhanh, tiết kiệm thời gian An toàn cho sức khỏe	LOCK&KING	368,000 đ	357,441 đ
LK-3126	26*14CM Nồi áp suất kèm xửng hấp đa năng (1.8mm) LK-3126	Nồi tăng áp Đa Năng Cao Cấp Thương hiệu: Lock&King Model: LK-3126 Màu sắc: Bạc xanh Chất liệu: Inox 316 Đúc liền khối 5 lớp Trọng lượng: 3.3 Kg Phù hợp mọi loại bếp. Bắt nhiệt nhanh, tiết kiệm thời gian An toàn cho sức khỏe	LOCK&KING	406,600 đ	387,848 đ
LK-1035	Ấm đun nước LK-1035	Ấm đun nước Còi báo hiệu sôi thông minh * Thông tin sản phẩm* - Chất liệu: Inox 304 - Model: LK-1035 - Dung Tích: 3,5L - Cấu tạo: 3 lớp - Đường kính miệng trên: 10cm  - Đường kính đáy: 22cm - Chiều cao thành ấm: 15cm - Chiều cao có tay cầm: 25cm - Chiều dài (cả ấm và vòi): 25cm - Trọng lượng: 1,6kg - Xuất xứ: Trung Quốc	LOCK&KING	217,057 đ	217,057 đ
LK-1038	Ấm đun nước LK-1038	Ấm đun nước * Thông tin sản phẩm* - Chất liệu: Inox 304 - Model: LK-1038 - Dung Tích: 3,8L - Cấu tạo: 3 lớp - Đường kính miệng trên: 10cm  - Đường kính đáy: 22cm - Chiều cao thành ấm: 15cm - Chiều cao có tay cầm: 25cm - Chiều dài (cả ấm và vòi): 25cm - Trọng lượng: 1,6kg - Xuất xứ: Trung Quốc	LOCK&KING	235,094 đ	235,094 đ
LK-92	Nồi chiên không dầu Lock&king	Nồi chiên không dầu LOCK&KING  Model: LK-92  Dung tích: 9,2L  Công suất: 1800W  Điện áp: 220v/50Hz  Kích thước: 704x410x413mm  Trọng lượng 15,2 kg	LOCK&KING	727,600 đ	727,600 đ
LK-586	Sưởi gốm thấp	Máy Sưởi Gốm Lock&King  Model: LK-586  Công suất: 2000W  Điện áp: 220v/50Hz  Chất liệu: Nhựa PP, gốm  Kích thước: 65*27cm	LOCK&KING	366,857 đ	366,857 đ
LK-588	Sưởi gốm thân cao	Máy Sưởi Gốm Lock&King   Model: LK-588   Công suất: 2000W  Điện áp: 220v/50Hz   Chất liệu: Nhựa PP,   gốm Kích thước: 93x24cm	LOCK&KING	468,762 đ	468,762 đ
LK-668	Tủ sấy quần áo cao cấp Lock&king 1500W	TỦ SẤY QUẦN ÁO CAO CẤP LOCK&KING 1500W -Công suất: 1500W - Điện áp: 220V- 50Hz - Trọng lượng sấy tối đa: 20kg - Hẹn giờ thông minh: 30-180 (phút) - Bảng điều khiển: Núm vặn  - Công nghệ sấy: Cộng hưởng nhiệt PTC làm khô tĩnh học - Kích thước: 160*90*46cm - inox: 16 thanh phi 19 - Nhựa: Nguyên sinh - Có bánh xe, thuận tiện di chuyển	LOCK&KING	395,900 đ	395,900 đ
LK-688	Tủ sấy quần áo cao cấp Lock&king 2400W	TỦ SẤY QUẦN ÁO CAO CẤP LOCK&KING 2400W -Công suất: 2400W - Điện áp: 220V- 50Hz - Trọng lượng sấy tối đa: 50kg - Hẹn giờ thông minh: 30-180 (phút) - Bảng điều khiển: Núm vặn  - Công nghệ sấy: Cộng hưởng nhiệt PTC làm khô tĩnh học - Kích thước: 180*100*48cm - inox: 16 thanh phi 25,5 độ dày 0.4, chất liệu inox 201 - Nhựa: Nguyên sinh - Có bánh xe, thuận tiện di chuyển	LOCK&KING	727,600 đ	727,600 đ
LK-1003	Bộ đèn sưởi 3 bóng Lock&King	-Tên sản phẩm: Đèn sưới nhà tắm 3 bóng cao cấp Lock&King -Model: LK-1003 -Điện áp: 230/50Hz -Công suất: 825w -Kích thước sản phẩm: 25x24x48 cm -Kích thước bao bì: 25.5x25.5x51 cm -Loại Bóng: Bóng vàng -Năm sản xuất: Ghi trên tem bảo hành -Sản xuất tại: Việt Nam	LOCK&KING	167,990 đ	167,990 đ
LK-1030	Bình thủy điện 3L Lock&King (4c/t)	Bình thủy điện dung tích 3 lít; chức năng đun sôi và giữ ấm nước; quy cách 4 chiếc/thùng theo dữ liệu nội bộ. Chưa tìm thấy nguồn online khớp Model LK-1030, cần hãng xác nhận công suất và điện áp.	LOCK&KING	785,427 đ	795,408 đ
LK-1033	Bộ đèn sưởi 3 bóng Lock&King	-Tên sản phẩm: Đèn sưới nhà tắm 3 bóng cao cấp Lock&King -Model: LK-1033 -Điện áp: 230/50Hz -Công suất: 825w -Kích thước sản phẩm: 51.8x23.5x21.4 cm -Kích thước bao bì: 57x26x26 cm -Loại Bóng: Bóng mờ -Năm sản xuất: Ghi trên tem bảo hành -Sản xuất tại: Việt Nam	LOCK&KING	306,020 đ	306,020 đ
LK-1050	Bình Thủy Điện Lock&King LK-1050	Tên sản phẩm: Bình Thủy Điện Thương hiệu: Lock&King Model: LK-1050 Chức năng: Đun – giữ ấm nước Màu sắc: Màu be Chất liệu: Nhựa PP, Thủy tinh, Inox 304 Công suất: 1200W Dung tích: 5 lít Trọng lượng: 2,8 kg Tính năng nổi bật: Có chế độ khóa thông minh Giữ ấm lên đến 48h Lấy nước tự động Tiết kiệm thời gian Khử Clo – an toàn cho sức khỏe	LOCK&KING	659,323 đ	668,157 đ
LK-1068	Ấm siêu tốc LK-1068	Ấm siêu tốc An toàn cho sức khỏe Model: LK-1068 Chất liệu: inox 304 Điện áp: 220 -240V Dung tích: 1,7L Công suất: 1850 -2200W Tần suất: 50-60Hz Xuất xứ: Trung Quốc	LOCK&KING	256,800 đ	259,549 đ
LK-4026A	Nồi Nấu Chậm Lock&King LK-4026A	Nồi Nấu Chậm Nấu triệu món ngon • Model: LK-4026  • Điện áp: 220V/50Hz  • Công suất: 170W – siêu tiết kiệm điện.  • Dung tích: 4.0L – nấu được lượng lớn thức ăn.  • Chất liệu lòng nồi: gốm Ceramic cao cấp giữ nhiệt tốt.  • Vỏ nồi: nhựa PP an toàn cho sức khỏe người sử dụng  • Chức năng: nấu cháo, hầm xương, kho cá, nấu chè, nấu thức ăn cho bé…  • 3 chế độ: Low – High – Warm -Quy cách: 2 chiếc/1 kiện	LOCK&KING	356,667 đ	350,000 đ
LK-4160	Nồi áp suất điện Lock&King LK-4160	Nồi áp suất điện Lock&King LK-4160 Tên sản phẩm: Nồi áp suất điện Model: LK-4160 Thương hiệu: Lock&King Điện áp: 220V 50Hz Công suất: 1000W Dung tích: 6L Công dụng: Sử dụng trong gia đình Quy chuẩn áp dụng: QCVN 4:2009/BKHCN và sửa đổi 1:2016 QCVN 4:2009/BKHCN Khối lượng tịnh: 4,7 kg Năm sản xuất: 2025	LOCK&KING	828,486 đ	828,486 đ
LK-4161	Nồi áp suất điện Lock&King LK-4161	Nồi áp suất điện Lock&King LK-4161 Tên sản phẩm: Nồi áp suất điện Lock&King LK-4161 Tên sản phẩm: Nồi áp suất điện Model: LK-4161 Điện áp: 220V 50Hz Công suất: 1000W Dung tích: 6L Công dụng: Sử dụng trong gia đình Quy chuẩn áp dụng: QCVN 4:2009/BKHCN và sửa đổi 1:2016 QCVN 4:2009/BKHCN Khối lượng tịnh: 4,5 kg Năm sản xuất: 2025 Quy cách đóng gói: 1 chiếc / 1 hộp, 2 hộp / thùng carton	LOCK&KING	672,571 đ	672,571 đ
LK-4208A	Nồi Nấu Chậm Lock&King LK-4208A	Nồi Nấu Chậm Nấu triệu món ngon • Model: LK-4208A • Điện áp: 220V/50Hz  • Công suất: 170W – siêu tiết kiệm điện.  • Dung tích: 4.2L – nấu được lượng lớn thức ăn.  • Chất liệu lòng nồi: gốm Ceramic cao cấp giữ nhiệt tốt.  • Vỏ nồi: nhựa PP an toàn cho sức khỏe người sử dụng  • Chức năng: nấu cháo, hầm xương, kho cá, nấu chè, nấu thức ăn cho bé…  • 3 chế độ: Low – High – Warm -Quy cách: 2 chiếc/1 kiện	LOCK&KING	405,581 đ	399,987 đ
LK-4209	Nồi Nấu Chậm Lock&King LK-4209	Nồi Nấu Chậm Nấu triệu món ngon • Model: LK-4209 • Điện áp: 220V/50Hz  • Công suất: 170W – siêu tiết kiệm điện.  • Dung tích: 4.2L – nấu được lượng lớn thức ăn.  • Chất liệu lòng nồi: gốm Ceramic cao cấp giữ nhiệt tốt.  • Vỏ nồi: nhựa PP an toàn cho sức khỏe người sử dụng  • Chức năng: nấu cháo, hầm xương, kho cá, nấu chè, nấu thức ăn cho bé…  • 3 chế độ: Low – High – Warm -Quy cách: 2 chiếc/1 kiện	LOCK&KING	387,583 đ	389,541 đ
LK-5301	Sưởi để bàn	"Quạt Sưởi Để Bàn Lock&King LK-5301 • Model: LK-5301 • Điện áp: 220V/50Hz  • Công suất: 1500W – siêu tiết kiệm điện. • Kích thước: 260x290mm • Chất liệu lõi sưởi: gốm cao cấp - tránh làm khô da • Vỏ: nhựa PP cứng cáp, an toàn cho sức khỏe người sử dụng  • Chức năng: Sưởi ấm cho gia đình  • 6 chế độ: Quạt - Ấm 1 - Ấm 2,   Quạt đèn - Ấm 1+đèn - Ấm 2+đèn -Quy cách: 4 chiếc/1 kiện "	LOCK&KING	468,762 đ	468,762 đ
LK-6015	Nồi Nấu Đa Năng Lock&King	Tên sản phẩm: Nồi Nấu Đa Năng  • Thương hiệu: Lock&King • Model: LK-6015 • Chức năng: Nấu ăn trong gia đình • Màu sắc: Xanh lá nhạt • Chất liệu: Nhựa PP, Inox 304 • Công suất: 1600W • Dung tích: 1,5 lít • Trọng lượng: 1,1 kg • Tính năng nổi bật: • Làm nóng nhanh • Có thể nấu và hấp • Nấu nhiều món cùng lúc • Tiết kiệm thời gian • An toàn cho sức khỏe	LOCK&KING	200,752 đ	200,752 đ
LK-6201	Nồi nấu lẩu đi kèm xửng hấp	Nồi nấu lẩu đi kèm xửng hấp, không có chức năng nấu cơm và nướng.  Hiệu: LOCK&KING,  Model: LK-6201;  Công suất 1500W,  Điện áp: 220V/50Hz;  Dung tích: 6.2L; hàng mới 100%	LOCK&KING	536,019 đ	550,047 đ
LK-7812	Máy làm sữa hạt Lock&King	Tên sản phẩm: Máy làm sữa hạt Thương hiệu: Lock&King Model: LK-7812 Điện áp định mức: 220V Tần số: 50Hz Công suất nấu: 800W Công suất xay: 200W Các chức năng chính: - Sữa đậu nành - Cháo - Súp - Sinh tố - Đun nước - Giữ ấm	LOCK&KING	540,095 đ	545,604 đ
LK-9014	Nồi chiên không dầu Lock&king	NỒI CHIÊN KHÔNG DẦU CHIÊN VẠN MÓN NGON -Nhãn hiệu: LOCK&KING, - Model: LK-9014 -Công suất: 1800W,  -Điện áp: 220V; 50Hz -Dung tích: 14L, - Điều khiển cơ. -Xuất xứ: TQ SX 2025,  - hàng mới 100%."	LOCK&KING	936,250 đ	936,250 đ
TK-2201	chảo cạn Titan vàng 22*5,5cm (2,2 mm) TK-2201	Chảo cạn Lock&King Chất liệu inox 316 Cao cấp Kích thước 22*5.5cm, dày 2.2mm Chống dính bằng titanium (tạo kháng khuẩn tự nhiên) Đúc liền khối 5 lớp Tay cầm đinh tán chắc chắn	TAKIN	193,466 đ	203,634 đ
TK-2662	26*6.5CM Chảo cạn titan-TK-2662 (2.2mm)	CHẢO CẠN TITAN VÀNG TAKIN SIZE 26 VÂN SAO BIỂN Model: TK-2662 Chất liệu inox 316 Cao cấp Kích thước 26*6.5cm, dày 2.2mm Chống dính bằng titanium (tạo kháng khuẩn tự nhiên) Đúc liền khối 5 lớp Tay cầm đinh tán chắc chắn Quy cách: 1 chiếc/ hộp	TAKIN	224,425 đ	238,375 đ
TK-2882C	Chảo cạn Titan vàng 28*7cm (2,3 mm)	Chảo chiên Titanium Pro size 28  Model: TK-2882C  Chất liệu inox 316 Cao cấp  Kích thước 28*7cm, dày 2.2mm  Chống dính bằng titanium (tạo kháng khuẩn tự nhiên)  Đúc liền khối 5 lớp  Tay cầm đinh tán chắc chắn	TAKIN	260,876 đ	266,199 đ
TK-3030C	Chảo cạn Titan vàng 30*7cm (2,3 mm)	Chảo chiên Titanium Pro size 30  Model: TK-3030C  Chất liệu inox 316 Cao cấp  Kích thước 30*7.5cm, dày 2.2mm  Chống dính bằng titanium (tạo kháng khuẩn tự nhiên)  Đúc liền khối 5 lớp  Tay cầm đinh tán chắc chắn	TAKIN	281,257 đ	290,175 đ
TK-036A	Bộ nồi Takin 3 món 5 đáy inox cao cấp	BỘ NỒI 3 MÓN 5 LỚP INOX CAO CẤP TAKIN  Model: TK-036A  Số món: 3 món  Chất liệu: Inox 304 cao cấp  Đáy nồi cấu tạo 5 lớp  Kích thước đường kính: 18-20-24cm  Xuất xứ: Trung Quốc Quy cách: 4 bộ/1 thùng	TAKIN	440,229 đ	433,985 đ
TK-0318A	Nồi táo inox cao cấp size18	NỒI TÁO LẺ SIZE 18 TAKIN CAO CẤP  Chất liệu: Inox  Model: TK-0318A  Size: 18cm  Xuất xứ: Trung Quốc Quy cách: 8 chiếc/1 thùng	TAKIN	134,514 đ	133,166 đ
TK-0320	Nồi táo inox cao cấp size20	NỒI TÁO LẺ SIZE 20 TAKIN CAO CẤP  Chất liệu: Inox  Model: TK-0320  Size: 18cm  Xuất xứ: Trung Quốc Quy cách: 8 chiếc/1 thùng	TAKIN	149,800 đ	149,800 đ
TK-0324	Nồi táo inox cao cấp size24	NỒI TÁO LẺ SIZE 24 TAKIN CAO CẤP  Chất liệu: Inox  Model: TK-0324  Size: 24cm  Xuất xứ: Trung Quốc Quy cách: 8 chiếc/1 thùng	TAKIN	188,524 đ	188,524 đ
TK-0348A	Bộ nồi Táo Takin 3 món inox cao cấp	BỘ NỒI TÁO 3 MÓN TAKIN CAO CẤP  Model: TK-0348A  Số món: 3 món  Chất liệu: Inox 304 cao cấp  Đáy nồi cấu tạo 5 lớp  Kích thước đường kính: 18-20-24cm Quy cách: 4 bộ/1 thùng	TAKIN	474,876 đ	492,000 đ
TK-0369	Bộ nồi Takin 3 món 5 đáy inox cao cấp	Bộ nồi inox 5 đáy cao cấp Takin TK-0369     – Bộ 3 nồi 5 đáy chất liệu inox 304 bền đẹp, dễ vệ sinh    – Dùng để nấu ăn trong gia đình    – Đường kính 18cm/2L, 20cm/3L và 24cm/7L.    – Tay cầm quai tán chắc chắn chịu lực tốt lên đến 50kg; nắp kính trong suốt dễ quan sát.    – Nồi dùng được trên mọi loại bếp: bếp gas, bếp hồng ngoại và bếp từ.	TAKIN	419,848 đ	419,848 đ
TK-0488	Bộ nồi Takin 4 món 5 đáy inox cao cấp	Bộ nồi Takin 4 món 5 đáy inox cao cấp Model: TK-0488  Số món: 4 món  Chất liệu: Inox 304 cao cấp  Đáy nồi cấu tạo 5 lớp Kích thước đường kính: 18x20x24x24cm  Xuất xứ: Trung Quốc	TAKIN	672,571 đ	672,571 đ
TK-0126	26*14CM Nồi áp suất kèm xửng hấp đa năng (1.8mm) TK 0126	NỒI TĂNG ÁP ĐIỆN ĐA NĂNG Thương hiệu: Takin Model: TK 0126 Màu sắc: Bạc xanh Chất liệu: Inox 316 Trọng lượng: 3.3 Kg Phù hợp mọi loại bếp. Bắt nhiệt nhanh, tiết kiệm thời gian An toàn cho sức khỏe	TAKIN	417,810 đ	404,910 đ
TK-468	Sưởi gốm thấp	MÁY SƯỞI GỐM THÂN THẤP TAKIN CAO CẤP Model: TK-468  Công suất: 2000W  Điện áp: 220v/50Hz  Chất liệu: Nhựa PP,  gốm Kích thước: 65*27cm Quy cách: 4 chiếc/1 thùng	TAKIN	366,857 đ	366,857 đ
TK-469	Sưởi gốm thân cao	MÁY SƯỞI GỐM THÂN CAO TAKIN CAO CẤP Model: TK-469 Công suất: 2000W Điện áp: 220v/50Hz Chất liệu: Nhựa PP, gốm Kích thước: 93x24cm Quy cách: 4 chiếc/1 thùng	TAKIN	468,762 đ	468,762 đ
TK-1002	Bộ đèn sưởi 2 bóng Takin	ĐÈN SƯỞI 2 BÓNG VÀNG TAKIN CAO CẤP -Nhãn hiệu: TAKIN -Model: TK-1002 -Điện áp: 230V / 50Hz -Công suất: 825W -Kích thước sản phẩm: 48 × 25 × 23 cm -Kích thước bao bì: 50 × 25,5 × 24 cm -Năm sản xuất: Ghi trên tem bảo hành -Sản xuất tại: Việt Nam" Quy cách: 1 chiếc/1 thùng	TAKIN	128,400 đ	128,400 đ
TK-1003	Bộ đèn sưởi 3 bóng Takin	ĐÈN SƯỞI 3 BÓNG VÀNG TAKIN CAO CẤP -Nhãn hiệu: TAKIN -Model: TK-1003 -Điện áp: 230V / 50Hz -Công suất: 825W -Kích thước sản phẩm: 48 × 25 × 23 cm -Kích thước bao bì: 50 × 25,5 × 24 cm -Năm sản xuất: Ghi trên tem bảo hành -Sản xuất tại: Việt Nam Quy cách: 1 chiếc/1 thùng	TAKIN	157,290 đ	157,290 đ`;

function cleanPrice(str) {
  if (!str) return 0;
  return parseFloat(str.replace(/[^\d]/g, '')) || 0;
}

// Load current catalog v3
let catalogV3 = [];
try {
  catalogV3 = JSON.parse(fs.readFileSync(path.join(__dirname, 'real_catalog_v3.json'), 'utf-8'));
} catch (e) {}

const catalogMap = new Map();
catalogV3.forEach(item => {
  catalogMap.set(item.canonicalCode.toUpperCase(), item);
});

const lines = rawImportData.split('\n').map(l => l.trim()).filter(l => l);
const importMap = new Map();

for (let i = 1; i < lines.length; i++) {
  const parts = lines[i].split('\t').map(p => p.trim());
  if (parts.length >= 6) {
    const model = parts[0];
    const name = parts[1];
    const specs = parts[2];
    const brand = parts[3];
    const oldImport = cleanPrice(parts[4]);
    const newImport = cleanPrice(parts[5]);
    
    importMap.set(model.toUpperCase(), {
      model,
      name,
      specs,
      brand,
      oldImport,
      newImport,
      diff: newImport - oldImport,
      diffPct: oldImport > 0 ? (((newImport - oldImport) / oldImport) * 100).toFixed(2) : '0'
    });
  }
}

// Merge into full catalog
const updatedCatalog = [];
let countPriceIncreased = 0;
let countPriceDecreased = 0;
let countPriceUnchanged = 0;

catalogV3.forEach((prod, idx) => {
  const importInfo = importMap.get(prod.canonicalCode.toUpperCase());
  if (importInfo) {
    prod.specs = importInfo.specs;
    prod.oldImportPrice = importInfo.oldImport;
    prod.newImportPrice = importInfo.newImport;
    prod.importPrice = importInfo.newImport; // Active import price
    prod.importPriceDiff = importInfo.diff;
    prod.importPriceDiffPct = importInfo.diffPct;

    if (importInfo.diff > 0) countPriceIncreased++;
    else if (importInfo.diff < 0) countPriceDecreased++;
    else countPriceUnchanged++;
  } else {
    prod.specs = prod.specs || 'Thông số tiêu chuẩn chính hãng';
    prod.oldImportPrice = prod.importPrice;
    prod.newImportPrice = prod.importPrice;
    prod.importPriceDiff = 0;
    prod.importPriceDiffPct = '0';
    countPriceUnchanged++;
  }

  // Update profits based on new import price
  prod.profitHangOnline = prod.nppOnlinePrice - prod.importPrice;
  prod.profitHangPctOnline = prod.importPrice > 0 ? ((prod.profitHangOnline / prod.importPrice) * 100).toFixed(1) + '%' : '0%';

  updatedCatalog.push(prod);
});

console.log(`Updated ${updatedCatalog.length} products!`);
console.log(`Import Price Changes: ${countPriceIncreased} increased, ${countPriceDecreased} decreased, ${countPriceUnchanged} unchanged.`);

fs.writeFileSync(path.join(__dirname, 'real_catalog_v4.json'), JSON.stringify(updatedCatalog, null, 2), 'utf-8');

// Also create Excel and CSV comparing old vs new import price
const XLSX = require('xlsx');
const rows = [
  ['STT', 'Model', 'Tên Sản Phẩm', 'Thương Hiệu', 'Thông Số Kỹ Thuật', 'Giá Nhập Cũ (VNĐ)', 'Giá Nhập Mới / Áp Dụng (VNĐ)', 'Chênh Lệch (VNĐ)', '% Biến Động', 'Giá NPP Online (VNĐ)', 'Giá NPP Offline (VNĐ)', 'Giá Facebook (VNĐ)']
];

updatedCatalog.forEach((p, idx) => {
  rows.push([
    idx + 1,
    p.canonicalCode,
    p.name,
    p.brand,
    p.specs || '',
    p.oldImportPrice,
    p.newImportPrice,
    p.importPriceDiff,
    (p.importPriceDiff > 0 ? '+' : '') + p.importPriceDiffPct + '%',
    p.nppOnlinePrice,
    p.nppOfflinePrice,
    p.facebookPrice
  ]);
});

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet(rows);
ws['!cols'] = [
  { wch: 6 }, { wch: 22 }, { wch: 40 }, { wch: 14 }, { wch: 50 },
  { wch: 18 }, { wch: 22 }, { wch: 16 }, { wch: 14 }, { wch: 18 }, { wch: 18 }, { wch: 18 }
];

XLSX.utils.book_append_sheet(wb, ws, 'SoSanhGiaNhap');
XLSX.writeFile(wb, path.join(__dirname, 'bang_gia_so_sanh_gia_nhap_cu_moi.xlsx'));
console.log('Created bang_gia_so_sanh_gia_nhap_cu_moi.xlsx successfully!');
