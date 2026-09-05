# Hướng Dẫn Sử Dụng Phần Mềm Quản Trị Giá Lock&King

Hệ thống quản trị giá sản phẩm Lock&King được xây dựng chuyên biệt nhằm giải quyết triệt để các vấn đề:
* Nhầm lẫn giữa mã cũ và mã mới (tự động nhận diện và cảnh báo chuyển đổi).
* Trôi nổi bảng giá cũ, mất dấu lịch sử điều chỉnh giá.
* Sai sót khi nhập Excel (cảnh báo lệch giá $> 10\%$, nhầm cột Đại lý vs NPP, mã trùng, giá $\le 0$).
* Xuất báo giá cho đối tác nhanh chóng, minh bạch công thức tính (CK dòng, CK tổng, VAT, vận chuyển), hỗ trợ in chuẩn A4 và xuất Excel.

---

## 1. Cách Khởi Động Phần Mềm

Bạn có 2 cách cực kỳ nhanh chóng để mở và sử dụng phần mềm:

* **Cách 1 (Nhanh nhất):** Nhấp đúp chuột trực tiếp vào file **`index.html`** hoặc file **`CHAY_PHAN_MEM.bat`**. Ứng dụng sẽ tự động mở trên trình duyệt web mặc định (Chrome, Edge, Cốc Cốc, Firefox).
* **Cách 2 (Chạy qua Local Server):** Mở terminal tại thư mục và gõ:
  ```powershell
  node server.js
  ```
  Sau đó truy cập: `http://localhost:3000`.

---

## 2. Các Chức Năng Chính

### 2.1. Tra Cứu Giá Siêu Tốc & Chuẩn Hóa Mã Hàng
* Nhấn phím tắt **`/`** hoặc **`F2`** trên bàn phím (hoặc nhấp chuột vào thanh tìm kiếm ở đầu trang).
* Nhập từ khóa: có thể là **Mã chuẩn** (ví dụ: `LK-30NC1`), **Mã cũ** (ví dụ: `LK-30NC`, `LK-3020`, `LK-2606`), hoặc **Mã viết liền** (ví dụ: `LK3003`).
* **Cơ chế bảo vệ:** Nếu nhập mã cũ, hệ thống lập tức hiển thị **nhãn cảnh báo màu vàng** kèm thông tin chuyển đổi: *“Mã LK-30NC đã được thay thế bằng mã chuẩn LK-30NC1”*.

### 2.2. Quản Lý Danh Mục & Giá Vốn Phân Quyền
* Vào menu **Danh Mục Sản Phẩm**.
* Mỗi sản phẩm có đầy đủ: Mã chuẩn duy nhất, tên, quy cách, màu sắc, đơn vị tính, giá niêm yết, giá đại lý, giá NPP, giá online, giá vốn.
* **Bảo mật giá vốn:** Cột Giá Vốn chỉ hiển thị với vai trò **Quản Trị Viên (Admin)** và **Kế Toán**. Khi chuyển sang vai trò **Nhân viên kinh doanh (Sales)** hoặc **Chỉ xem (Viewer)**, cột giá vốn tự động bị ẩn hoàn toàn.

### 2.3. Quản Lý Bảng Giá & Lịch Sử Phiên Bản (Không Ghi Đè)
* Vào menu **Bảng Giá & Lịch Sử**.
* Chọn xem theo từng loại giá: Giá Niêm Yết, Giá Đại Lý, Giá NPP, Giá Online, Giá Khuyến Mại.
* Khi nhấn **“Cập Nhật Giá Sản Phẩm”**, hệ thống lưu mức giá mới cùng thời điểm hiệu lực, người duyệt và lý do điều chỉnh.
* Mức giá cũ không bị xóa mà lưu thành lịch sử, hệ thống tự động tính tỷ lệ biến động ($\pm \%$) và mức chênh lệch (VNĐ).

### 2.4. Nhập Bảng Giá Từ Excel / CSV (Smart Excel Importer)
* Vào menu **Nhập Giá Từ Excel**.
* Nhấp vào khung tải lên và chọn file **`mau_bang_gia_lock_and_king.csv`** có sẵn trong thư mục (hoặc nhấn nút *"Tải File Excel Mẫu"* để tạo file mới).
* Hệ thống chạy bộ lọc kiểm tra 12 quy tắc:
  * **Lỗi chặn (Màu đỏ):** Mã sản phẩm không tồn tại trong danh mục, giá $\le 0$, mã trùng trong file $\rightarrow$ Khóa nút duyệt, yêu cầu sửa file.
  * **Cảnh báo (Màu vàng):** Giá tăng/giảm đột biến $> 10\%$, cảnh báo nghi ngờ nhầm cột (Giá Đại lý thấp hơn Giá NPP), mã cũ tự động nhận diện $\rightarrow$ Yêu cầu xác nhận trước khi áp dụng.
* Khi đạt chuẩn, nhấn nút **“Phê Duyệt & Áp Dụng Bảng Giá”** để cập nhật đồng loạt vào hệ thống trong một giao dịch an toàn.

### 2.5. Lập & Xuất Báo Giá Chuyên Nghiệp
* Vào menu **Tạo Báo Giá Mới**.
* Chọn Đại lý / Khách hàng (hệ thống tự động áp dụng loại giá và % chiết khấu mặc định của khách hàng đó).
* Thêm các sản phẩm vào báo giá, nhập số lượng, điều chỉnh chiết khấu dòng nếu cần.
* Hệ thống tính toán minh bạch:
  $$\text{Thành tiền trước CK} \rightarrow \text{Chiết khấu toàn đơn} \rightarrow \text{Thuế VAT} \rightarrow \text{Phí vận chuyển} \rightarrow \text{Tổng thanh toán}$$
* Nhấn **“Xem Trước Mẫu In A4 & Lưu Báo Giá”**:
  * Hiển thị bảng báo giá chuyên nghiệp mang thương hiệu Lock&King Việt Nam.
  * Có đầy đủ điều khoản giao hàng, thanh toán, bảo hành 12 tháng và 3 chữ ký (Người lập, Kế toán, Giám đốc).
  * Nhấn **“In Bản Cứng / Lưu PDF”** để in hoặc lưu file PDF khổ A4 không bị vỡ layout.
  * Nhấn **“Xuất Excel”** để tạo file `.xlsx` gửi đối tác.
* **Cơ chế chống trôi giá (Price Drift):** Nếu giá trong hệ thống bị thay đổi sau khi báo giá được tạo, hệ thống sẽ bật cảnh báo đỏ nhắc nhở kiểm tra lại giá mới.

### 2.6. Nhật Ký Hệ Thống (Audit Log) & Phân Quyền
* Vào menu **Nhật Ký Hệ Thống** để xem toàn bộ lịch sử thao tác: Ai làm gì, lúc mấy giờ, giá cũ là bao nhiêu, giá mới là bao nhiêu.
* Ở góc dưới thanh bên trái (Sidebar), bạn có thể chuyển đổi nhanh giữa 4 vai trò để kiểm tra:
  * **Admin:** Toàn quyền thêm, sửa, xóa, duyệt bảng giá Excel, xem giá vốn.
  * **Sales:** Tra cứu, lập báo giá; không sửa giá gốc, không xem giá vốn.
  * **Accountant:** Kiểm tra giá, đối chiếu lịch sử, xem giá vốn, xuất báo cáo.
  * **Viewer:** Chỉ được tra cứu dữ liệu; các nút sửa/xóa/nhập đều bị ẩn.

---

## 3. Lưu Trữ Dữ Liệu & Sao Lưu
* Toàn bộ dữ liệu sản phẩm, quy tắc chuyển đổi mã, bảng giá và báo giá được tự động lưu trữ trong trình duyệt (LocalStorage).
* Bạn có thể vào menu **Cấu Hình & Sao Lưu** $\rightarrow$ nhấn **“Xuất File Sao Lưu (.JSON)”** để lưu giữ bản backup hoặc nhập vào máy tính khác.
* Nút **“Khôi phục dữ liệu mẫu gốc”** cho phép bạn đặt lại dữ liệu demo của Lock&King bất cứ lúc nào.
