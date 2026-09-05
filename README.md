# Bảng Giá & Phần Mềm Quản Trị Phân Phối Lock&King & Takin

Hệ thống bảng giá chuẩn chính quy và ứng dụng web quản trị biểu giá, phân loại tầng giá đa kênh cho 65 mã model gia dụng cao cấp thương hiệu **Lock&King** và **Takin**.

---

## 🌟 Các Tính Năng Nổi Bật

1. **Bảng Phân Loại Giá 65 Model (Đầy Đủ Ảnh & Thông Số)**:
   - 49 Model thương hiệu **Lock&King** chính hãng.
   - 16 Model thương hiệu **Takin** chính hãng.
   - Hiển thị hình ảnh thumbnail sắc nét, xem ảnh phóng to chi tiết.
   - Model **LK-2633** chuẩn hóa giá Facebook chính thức là **850.000 đ**.

2. **Phân Quyền Đa Kênh Tức Thì**:
   - **Sale Online**: Tự động lọc chỉ hiển thị các cột Kênh Online (Giá NPP Online, Giá Facebook, Giá Sàn TMĐT, Giá Niêm Yết, Lợi Nhuận NPP, % LN/FB). Ẩn hoàn toàn giá vốn và kênh offline.
   - **Sale Offline**: Tự động lọc chỉ hiển thị các cột Kênh Offline (Giá NPP Offline, Giá Đại Lý Offline x120%, % LN Đại Lý). Ẩn hoàn toàn giá vốn và kênh online.
   - **Admin / Kế toán**: Toàn quyền xem và chỉnh sửa tất cả 18–20 cột dữ liệu (Giá nhập cũ, giá nhập mới, chênh lệch giá vốn, giá online, giá offline).

3. **Xuất File PDF Khổ A4 Ngang Chuẩn Mẫu Hãng**:
   - Tùy chọn lọc theo thương hiệu: **Lock&King (49 model)**, **Takin (16 model)**, hoặc **Cả 2 (65 model)**.
   - **Engine phân trang độc lập (Multi-page Engine)**: Tải đủ 100% tất cả các trang, không bị giới hạn số trang.
   - **Giữ nguyên toàn vẹn Head & Foot**:
     - *Head*: Tiêu đề công ty, logo LK, hotline, website, MST, biểu giá, ngày xuất và lặp lại hàng tiêu đề cột trên tất cả các trang.
     - *Foot*: Chính sách bán hàng & phân phối thương mại kèm 3 khối chữ ký chính thức (*Người lập biểu*, *Kế toán trưởng*, *Tổng giám đốc duyệt*).
   - Tỷ lệ chuẩn A4 landscape 1040px, viền nét rõ ràng, không tràn viền.

4. **Xuất File Excel Chuẩn Form Mẫu**:
   - Giữ nguyên letterhead công ty, dòng phân tách thương hiệu và danh mục.
   - Dữ liệu số thực (`Number`) cho phép tính toán trực tiếp.
   - Tự động lọc cột dữ liệu theo phân quyền người dùng.

5. **Chỉnh Sửa Dữ Liệu Từng Mã & Ghi Nhật Ký (Audit Log)**:
   - Nút sửa trực tiếp trên từng dòng sản phẩm.
   - Tự động tính toán tức thời lợi nhuận và biên độ giá.
   - Lưu trữ an toàn trong LocalStorage và tự động ghi log thay đổi.

---

## 🚀 Hướng Dẫn Khởi Chạy

Chỉ cần nhấp đúp chuột vào tệp:
```cmd
CHAY_PHAN_MEM.bat
```
Hoặc mở trực tiếp tệp `index.html` trên bất kỳ trình duyệt web hiện đại nào (Chrome, Edge, Firefox, Cốc Cốc).

---

## 📁 Cấu Trúc Thư Mục

* `index.html`: Ứng dụng Single-Page Web chính hoàn chỉnh.
* `images/`: Thư mục ảnh sản phẩm chính hãng các model Lock&King & Takin.
* `CHAY_PHAN_MEM.bat`: Trình khởi động ứng dụng một chạm.
* `server.js`: Máy chủ HTTP cục bộ nhẹ phục vụ ứng dụng.
* `bang_gia_chuan_lock_and_king_day_du.xlsx`: File Excel bảng giá chuẩn gốc 49 mã Lock&King.
* `bang_gia_chuan_lock_and_king_takin.xlsx`: File Excel bảng giá chuẩn gốc 16 mã Takin.
* `bang_gia_so_sanh_gia_nhap_cu_moi.xlsx`: Bảng so sánh giá nhập cũ và mới.
* `HUONG_DAN_SU_DUNG.md`: Tài liệu hướng dẫn sử dụng chi tiết cho nhân viên kinh doanh và quản lý.

---
*Bản quyền thuộc VU GIA COOPERATIVE COMPANY LIMITED | 230 Lacasta, Van Phu Urban Area, Kien Hung Ward, Ha Noi | Websites: Locknking.com - Locknking.vn - Locknking.kr*
