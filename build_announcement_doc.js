const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Đọc logo và chuyển sang base64
let logoBase64 = '';
const logoPath = path.join(__dirname, 'images', 'lock_and_king_logo.png');
if (fs.existsSync(logoPath)) {
  const buf = fs.readFileSync(logoPath);
  logoBase64 = `data:image/png;base64,${buf.toString('base64')}`;
}

// 2. Dữ liệu 8 sản phẩm ngày 18/10/2026
const products = [
  {
    stt: 1,
    code: 'LK-8920',
    name: 'Bếp từ đơn cảm ứng Lock&King 2000W',
    spec: 'Công suất 2000W, phím cảm ứng đa năng, mặt kính chịu nhiệt chống trầy',
    group: 'Bếp từ',
    unit: 'Chiếc',
    type: 'MÃ MỚI BỔ SUNG',
    typeClass: 'badge-new',
    nppPrice: 690000,
    fbPrice: 1290000,
    tmdtPrice: 1354500,
    retailPrice: 1626000,
    profit: 600000,
    profitPct: '46.5%'
  },
  {
    stt: 2,
    code: 'LK-8989',
    name: 'Bếp từ đơn cao cấp Lock&King 2200W',
    spec: 'Công suất 2200W, gia nhiệt siêu tốc, phím điều khiển Slider thông minh',
    group: 'Bếp từ',
    unit: 'Chiếc',
    type: 'MÃ MỚI BỔ SUNG',
    typeClass: 'badge-new',
    nppPrice: 790000,
    fbPrice: 1490000,
    tmdtPrice: 1564500,
    retailPrice: 1878000,
    profit: 700000,
    profitPct: '47.0%'
  },
  {
    stt: 3,
    code: 'LK-8924',
    name: 'Bếp từ đơn siêu công suất Lock&King 2400W',
    spec: 'Công suất 2400W đun sôi cực nhanh, mâm nhiệt kép, bo mạch chịu tải cao',
    group: 'Bếp từ',
    unit: 'Chiếc',
    type: 'MÃ MỚI BỔ SUNG',
    typeClass: 'badge-new',
    nppPrice: 850000,
    fbPrice: 1590000,
    tmdtPrice: 1669500,
    retailPrice: 2004000,
    profit: 740000,
    profitPct: '46.5%'
  },
  {
    stt: 4,
    code: 'LK-8818',
    name: 'Nồi cơm điện cao tần Lock&King (IH)',
    spec: 'Đốt nóng cảm ứng từ IH 360 độ hạt cơm dẻo ngọt, lòng nồi hợp kim 7 lớp',
    group: 'Nồi cơm điện',
    unit: 'Chiếc',
    type: 'MÃ MỚI BỔ SUNG',
    typeClass: 'badge-new',
    nppPrice: 1790000,
    fbPrice: 3400000,
    tmdtPrice: 3570000,
    retailPrice: 4284000,
    profit: 1610000,
    profitPct: '47.4%'
  },
  {
    stt: 5,
    code: 'LK-8618',
    name: 'Nồi cơm điện tách đường Lock&King',
    spec: 'Công nghệ phân giải & lọc tách tinh bột nhanh, bảo vệ sức khỏe, dung tích 1.8L',
    group: 'Nồi cơm điện',
    unit: 'Chiếc',
    type: 'MÃ MỚI BỔ SUNG',
    typeClass: 'badge-new',
    nppPrice: 1300000,
    fbPrice: 2490000,
    tmdtPrice: 2614500,
    retailPrice: 3138000,
    profit: 1190000,
    profitPct: '47.8%'
  },
  {
    stt: 6,
    code: 'LK-6886',
    name: 'Tủ sấy quần áo đa năng Lock&King LK-6886',
    spec: 'Sấy nhiệt đối lưu diệt khuẩn ion âm 99.9%, khung inox kép chịu lực 15-20kg',
    group: 'Tủ sấy',
    unit: 'Bộ',
    type: 'MÃ MỚI BỔ SUNG',
    typeClass: 'badge-new',
    nppPrice: 770000,
    fbPrice: 1490000,
    tmdtPrice: 1564500,
    retailPrice: 1878000,
    profit: 720000,
    profitPct: '48.3%'
  },
  {
    stt: 7,
    code: 'LK-1003',
    name: 'Bộ đèn sưởi nhà tắm 3 bóng Lock&King',
    spec: 'Bóng hồng ngoại mạ vàng chống chói, chống nước IPX4, sưởi ấm tức thì sau 3s',
    group: 'Đèn sưởi',
    unit: 'Bộ',
    type: 'ĐIỀU CHỈNH GIÁ',
    typeClass: 'badge-up',
    nppPrice: 210000,
    fbPrice: 399000,
    tmdtPrice: 418950,
    retailPrice: 503000,
    profit: 189000,
    profitPct: '47.4%'
  },
  {
    stt: 8,
    code: 'LK-1033',
    name: 'Bộ đèn sưởi nhà tắm cao cấp Lock&King',
    spec: '3 bóng hồng ngoại công suất 825W, công tắc đảo chiều thông minh, tỏa nhiệt đều',
    group: 'Đèn sưởi',
    unit: 'Bộ',
    type: 'GIẢM GIÁ ĐẶC BIỆT',
    typeClass: 'badge-down',
    nppPrice: 320000,
    fbPrice: 620000,
    tmdtPrice: 651000,
    retailPrice: 782000,
    profit: 300000,
    profitPct: '48.4%'
  }
];

function fmt(n) {
  return n.toLocaleString('vi-VN') + ' đ';
}

const htmlRows = products.map(p => `
  <tr>
    <td class="text-center font-bold text-muted">${p.stt}</td>
    <td class="font-bold" style="white-space: nowrap;">
      <span class="code-tag">${p.code}</span>
    </td>
    <td>
      <div class="product-title">${p.name}</div>
      <div class="product-spec">${p.spec}</div>
    </td>
    <td class="text-center nowrap"><span class="group-tag">${p.group}</span></td>
    <td class="text-center nowrap"><span class="${p.typeClass}">${p.type}</span></td>
    <td class="text-center font-semibold text-muted nowrap">${p.unit}</td>
    <td class="text-right font-black price-highlight nowrap">${fmt(p.nppPrice)}</td>
    <td class="text-right font-bold text-fb nowrap">${fmt(p.fbPrice)}</td>
    <td class="text-right font-bold text-tmdt nowrap">${fmt(p.tmdtPrice)}</td>
    <td class="text-right font-semibold text-retail nowrap">${fmt(p.retailPrice)}</td>
    <td class="text-right font-black text-profit nowrap">+${fmt(p.profit)}</td>
    <td class="text-center font-black nowrap"><span class="text-profit-pct">${p.profitPct}</span></td>
  </tr>
`).join('');

const fullHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thông Báo Bảng Báo Giá Sản Phẩm Mới & Điều Chỉnh - Vũ Gia (Lock&King)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #0b2239;
      --primary-light: #164067;
      --accent-blue: #0284c7;
      --accent-gold: #b45309;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --bg-page: #f8fafc;
      --border-color: #cbd5e1;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      background-color: #e2e8f0;
      color: var(--text-main);
      -webkit-font-smoothing: antialiased;
      line-height: 1.35;
      font-size: 11.5px;
    }

    /* THANH CÔNG CỤ ĐIỀU HƯỚNG TRÊN CÙNG */
    .top-action-bar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: #0f172a;
      color: white;
      padding: 10px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .top-action-bar .brand-info {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 13px;
    }

    .top-action-bar .btn-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 14px;
      font-size: 12px;
      font-weight: 700;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .btn-print {
      background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
      color: white;
      box-shadow: 0 2px 6px rgba(2, 132, 199, 0.4);
    }
    .btn-print:hover { background: #0284c7; transform: translateY(-1px); }

    .btn-pdf {
      background: linear-gradient(135deg, #e11d48 0%, #be123c 100%);
      color: white;
      box-shadow: 0 2px 6px rgba(225, 29, 72, 0.4);
    }
    .btn-pdf:hover { background: #e11d48; transform: translateY(-1px); }

    .btn-excel {
      background: linear-gradient(135deg, #10b981 0%, #047857 100%);
      color: white;
      box-shadow: 0 2px 6px rgba(16, 185, 129, 0.4);
    }
    .btn-excel:hover { background: #059669; transform: translateY(-1px); }

    .btn-back {
      background: #334155;
      color: white;
    }
    .btn-back:hover { background: #475569; }

    /* KHUNG TỜ GIẤY THÔNG BÁO A4 KHỔ NGANG */
    .page-container {
      width: 100%;
      max-width: 1240px;
      margin: 20px auto 30px auto;
      background: white;
      padding: 24px 30px;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.08);
      position: relative;
    }

    /* HEADER LETTERHEAD */
    .letterhead {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid var(--primary);
      padding-bottom: 8px;
      margin-bottom: 10px;
    }

    .company-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .company-logo {
      height: 44px;
      max-width: 125px;
      object-fit: contain;
    }

    .company-details h1 {
      font-size: 13.5px;
      font-weight: 900;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: -0.2px;
      margin-bottom: 2px;
    }

    .company-details p {
      font-size: 10px;
      color: var(--text-muted);
      line-height: 1.3;
    }

    .company-details .web-links {
      font-size: 9.5px;
      color: var(--accent-blue);
      font-weight: 600;
      margin-top: 1px;
    }

    .doc-meta {
      text-align: right;
      font-size: 10px;
    }

    .doc-no-badge {
      display: inline-block;
      padding: 3px 8px;
      background: #e0f2fe;
      color: #0369a1;
      font-family: monospace;
      font-weight: 800;
      border-radius: 4px;
      border: 1px solid #bae6fd;
      font-size: 11px;
      margin-bottom: 3px;
    }

    .doc-meta-date {
      color: var(--text-muted);
      font-size: 10px;
    }

    /* DOCUMENT TITLE */
    .doc-header-block {
      text-align: center;
      margin: 6px 0 8px 0;
    }

    .main-title {
      font-size: 16px;
      font-weight: 900;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }

    .sub-title {
      font-size: 11px;
      color: var(--accent-blue);
      font-weight: 700;
      margin-bottom: 2px;
    }

    .doc-recipient {
      font-size: 11px;
      font-style: italic;
      color: #334155;
      font-weight: 600;
    }

    /* INTRO PARAGRAPH */
    .intro-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 3.5px solid var(--accent-blue);
      padding: 6px 10px;
      border-radius: 5px;
      font-size: 10px;
      color: #334155;
      line-height: 1.4;
      margin-bottom: 8px;
    }

    /* TABLE */
    .table-container {
      width: 100%;
      margin-bottom: 8px;
    }

    table.price-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9.5px;
      line-height: 1.25;
    }

    table.price-table thead th {
      background: var(--primary);
      color: white;
      font-weight: 800;
      text-transform: uppercase;
      font-size: 9px;
      padding: 6px 4px;
      border: 1px solid #1e3a5f;
      letter-spacing: 0.2px;
      vertical-align: middle;
      text-align: center;
    }

    table.price-table thead th.th-highlight {
      background: #0284c7;
      color: #ffffff;
    }

    table.price-table tbody tr {
      border-bottom: 1px solid #e2e8f0;
    }

    table.price-table tbody tr:nth-child(even) {
      background-color: #f8fafc;
    }

    table.price-table tbody td {
      padding: 4.5px 5px;
      border: 1px solid #cbd5e1;
      vertical-align: middle;
    }

    .code-tag {
      font-family: monospace;
      font-weight: 800;
      color: #0369a1;
      background: #f0f9ff;
      padding: 1px 4px;
      border-radius: 3px;
      border: 1px solid #bae6fd;
      display: inline-block;
      font-size: 10px;
    }

    .product-title {
      font-weight: 800;
      color: #0f172a;
      font-size: 10px;
    }

    .product-spec {
      font-size: 8.5px;
      color: #64748b;
      margin-top: 1px;
    }

    .group-tag {
      font-size: 8.5px;
      font-weight: 700;
      color: #475569;
      background: #f1f5f9;
      padding: 1px 5px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      display: inline-block;
    }

    .badge-new {
      font-size: 8px;
      font-weight: 800;
      color: #065f46;
      background: #d1fae5;
      padding: 1.5px 5px;
      border-radius: 3px;
      border: 1px solid #a7f3d0;
      display: inline-block;
    }

    .badge-up {
      font-size: 8px;
      font-weight: 800;
      color: #92400e;
      background: #fef3c7;
      padding: 1.5px 5px;
      border-radius: 3px;
      border: 1px solid #fde68a;
      display: inline-block;
    }

    .badge-down {
      font-size: 8px;
      font-weight: 800;
      color: #9f1239;
      background: #ffe4e6;
      padding: 1.5px 5px;
      border-radius: 3px;
      border: 1px solid #fecdd3;
      display: inline-block;
    }

    .price-highlight {
      color: #0369a1;
      font-size: 10.5px;
      background: #f0f9ff;
    }

    .text-fb { color: #1e40af; }
    .text-tmdt { color: #d97706; }
    .text-retail { color: #475569; }
    .text-profit { color: #059669; }
    .text-profit-pct {
      color: #047857;
      font-weight: 900;
      background: #ecfdf5;
      border-radius: 3px;
      padding: 1.5px 4px;
      display: inline-block;
      border: 1px solid #a7f3d0;
      font-size: 9px;
    }

    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .font-bold { font-weight: 700; }
    .font-black { font-weight: 900; }
    .text-muted { color: var(--text-muted); }
    .nowrap { white-space: nowrap; }

    /* 4 STRATEGIC BENEFIT ITEMS */
    .benefit-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
      margin-bottom: 8px;
    }

    .benefit-item {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 5px;
      padding: 5px 8px;
      font-size: 9px;
    }

    .benefit-title {
      font-weight: 800;
      color: var(--primary);
      display: flex;
      align-items: center;
      gap: 4px;
      margin-bottom: 2px;
      font-size: 9.5px;
    }

    .benefit-desc {
      color: var(--text-muted);
      line-height: 1.3;
    }

    /* POLICIES & TERMS */
    .terms-box {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 5px;
      padding: 6px 10px;
      font-size: 9px;
      margin-bottom: 8px;
      line-height: 1.35;
    }

    .terms-title {
      font-weight: 800;
      color: var(--primary);
      text-transform: uppercase;
      font-size: 9px;
      margin-bottom: 2px;
      letter-spacing: 0.2px;
    }

    .terms-box ul {
      margin-left: 15px;
      color: #334155;
    }

    /* SIGNATURES */
    .signatures-block {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      text-align: center;
      margin-top: 6px;
      padding-top: 2px;
    }

    .sign-col .title {
      font-weight: 800;
      color: var(--primary);
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.2px;
    }

    .sign-col .sub {
      font-size: 8.5px;
      color: var(--text-muted);
      font-style: italic;
      margin-top: 1px;
    }

    .sign-col .stamp-area {
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }

    /* CON DẤU ĐỎ MÔ PHỎNG */
    .stamp-badge {
      width: 50px;
      height: 50px;
      border: 1.5px dashed #dc2626;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #dc2626;
      font-weight: 900;
      font-size: 5.5px;
      text-transform: uppercase;
      text-align: center;
      line-height: 1.1;
      padding: 1px;
      transform: rotate(-10deg);
      opacity: 0.9;
      background: rgba(254, 226, 226, 0.25);
    }

    .sign-col .signer-name {
      font-weight: 800;
      color: var(--primary);
      font-size: 10px;
      margin-top: 1px;
    }

    /* FOOTER */
    .doc-footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 4px;
      margin-top: 6px;
      display: flex;
      justify-content: space-between;
      color: #94a3b8;
      font-size: 8px;
    }

    /* PRINT STYLES CHO A4 LANDSCAPE CHUẨN XÁC 1 TRANG DUY NHẤT */
    @media print {
      @page {
        size: A4 landscape;
        margin: 5mm 8mm 4mm 8mm;
      }

      body {
        background: white !important;
        color: black !important;
        font-size: 9px !important;
      }

      .top-action-bar {
        display: none !important;
      }

      .page-container {
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        border-radius: 0 !important;
      }

      .letterhead {
        border-bottom-width: 1.5px !important;
        padding-bottom: 5px !important;
        margin-bottom: 6px !important;
      }

      .company-logo {
        height: 38px !important;
      }

      .main-title {
        font-size: 14px !important;
        margin-bottom: 1px !important;
      }

      .sub-title {
        font-size: 10px !important;
      }

      .doc-header-block {
        margin: 4px 0 5px 0 !important;
      }

      .intro-box {
        padding: 4px 8px !important;
        font-size: 8.5px !important;
        margin-bottom: 5px !important;
      }

      table.price-table {
        font-size: 8.5px !important;
      }

      table.price-table thead th {
        padding: 4px 3px !important;
        font-size: 8px !important;
      }

      table.price-table tbody td {
        padding: 3px 4px !important;
      }

      .benefit-grid {
        gap: 5px !important;
        margin-bottom: 5px !important;
      }

      .benefit-item {
        padding: 3.5px 6px !important;
        font-size: 8px !important;
      }

      .benefit-title {
        font-size: 8.5px !important;
      }

      .terms-box {
        padding: 4px 8px !important;
        font-size: 8px !important;
        margin-bottom: 5px !important;
      }

      .stamp-area {
        height: 40px !important;
      }

      .stamp-badge {
        width: 44px !important;
        height: 44px !important;
        font-size: 5px !important;
      }

      .signer-name {
        font-size: 9.5px !important;
      }

      /* Đảm bảo 1 trang hoàn chỉnh */
      html, body, .page-container {
        height: 100% !important;
        page-break-inside: avoid !important;
        page-break-after: avoid !important;
      }
    }
  </style>
</head>
<body>

  <!-- TOP ACTION TOOLBAR -->
  <div class="top-action-bar">
    <div class="brand-info">
      <span style="font-size: 16px;">🏢</span>
      <div>
        <strong style="color: #38bdf8;">CÔNG TY TNHH HỢP TÁC VŨ GIA</strong>
        <span style="color: #94a3b8; margin-left: 8px;">| Thông Báo Biểu Giá Khách Hàng (18/10/2026)</span>
      </div>
    </div>
    <div class="btn-group">
      <button class="btn btn-print" onclick="window.print()">
        <span>🖨️</span> In / Lưu PDF (A4 Ngang)
      </button>
      <a href="thong_bao_bang_gia_18_10_2026.pdf" target="_blank" class="btn btn-pdf">
        <span>📄</span> Xem File PDF
      </a>
      <a href="bang_gia_thay_doi_ngay_18_10_2026.xlsx" download class="btn btn-excel">
        <span>📊</span> Tải File Excel
      </a>
      <a href="index.html" class="btn btn-back">
        <span>⬅️</span> Về Phần Mềm
      </a>
    </div>
  </div>

  <!-- A4 LANDSCAPE CONTAINER -->
  <div class="page-container">

    <!-- LETTERHEAD -->
    <div class="letterhead">
      <div class="company-left">
        ${logoBase64 ? `<img src="${logoBase64}" alt="Lock&King Logo" class="company-logo">` : `<img src="images/lock_and_king_logo.png" alt="Lock&King Logo" class="company-logo">`}
        <div class="company-details">
          <h1>CÔNG TY TNHH HỢP TÁC VŨ GIA</h1>
          <p><strong>Địa chỉ:</strong> 230 Lacasta, Khu đô thị Văn Phú, P. Phú La, Q. Hà Đông, TP. Hà Nội</p>
          <p><strong>Hotline / Zalo:</strong> 098.666.9958 - 098.333.6898 &nbsp;|&nbsp; <strong>Email:</strong> vugiaco.ltd@gmail.com</p>
          <p class="web-links">Hệ thống Website: Locknking.com &bull; Locknking.vn &bull; Locknking.kr</p>
        </div>
      </div>
      <div class="doc-meta">
        <div class="doc-no-badge">Số: 1810/2026/TB-VG</div>
        <div class="doc-meta-date">Hà Nội, ngày 18 tháng 10 năm 2026</div>
        <div style="color: #0369a1; font-weight: 700; margin-top: 1px;">Hiệu lực: Từ 18/10/2026</div>
      </div>
    </div>

    <!-- DOCUMENT HEADER TITLE -->
    <div class="doc-header-block">
      <h2 class="main-title">THÔNG BÁO BẢNG BÁO GIÁ SẢN PHẨM</h2>
      <div class="sub-title">V/v: Ra Mắt 6 Sản Phẩm Mới & Điều Chỉnh Biểu Giá Phân Phối Kênh NPP - Kênh Bán Lẻ Năm 2026</div>
      <div class="doc-recipient">Kính gửi: Quý Khách Hàng, Quý Đối Tác, Quý Nhà Phân Phối & Quý Đại Lý trên toàn quốc</div>
    </div>

    <!-- INTRO STATEMENT -->
    <div class="intro-box">
      Công ty TNHH Hợp tác Vũ Gia xin gửi lời chào trân trọng và lời chúc hợp tác thành công tới Quý Khách hàng. Nhằm mở rộng dải sản phẩm gia dụng cao cấp phục vụ mùa bán lẻ Thu - Đông 2026 và tối ưu biên độ lợi nhuận cho hệ thống phân phối, Công ty TNHH Hợp tác Vũ Gia trân trọng thông báo <strong>bổ sung 6 model mới</strong> và <strong>điều chỉnh giá 2 model đèn sưởi Lock&King</strong> với các mức giá ưu đãi đặc biệt như sau:
    </div>

    <!-- MAIN PRODUCT PRICING TABLE -->
    <div class="table-container">
      <table class="price-table">
        <thead>
          <tr>
            <th style="width: 28px;">STT</th>
            <th style="width: 76px;">Mã Model</th>
            <th>Tên Sản Phẩm & Quy Cách Kỹ Thuật</th>
            <th style="width: 72px;">Nhóm Hàng</th>
            <th style="width: 90px;">Loại Biến Động</th>
            <th style="width: 38px;">ĐVT</th>
            <th class="th-highlight" style="width: 95px;">Giá NPP</th>
            <th style="width: 88px;">Giá Facebook</th>
            <th style="width: 88px;">Giá Sàn TMĐT</th>
            <th style="width: 88px;">Giá Niêm Yết</th>
            <th style="width: 90px;">Mức Lời NPP</th>
            <th style="width: 65px;">% LN / FB</th>
          </tr>
        </thead>
        <tbody>
          ${htmlRows}
        </tbody>
      </table>
    </div>

    <!-- 4 STRATEGIC BENEFITS -->
    <div class="benefit-grid">
      <div class="benefit-item">
        <div class="benefit-title">💎 Biên Độ Lợi Nhuận Cao</div>
        <div class="benefit-desc">Mức chiết khấu hấp dẫn đạt từ <strong>46.5% - 48.4%</strong>, đảm bảo NPP thu về từ <strong>189.000đ - 1.610.000đ / sản phẩm</strong>.</div>
      </div>
      <div class="benefit-item">
        <div class="benefit-title">🛡️ Bảo Hành Chính Hãng</div>
        <div class="benefit-desc">Bảo hành 12 - 24 tháng theo tiêu chuẩn Lock&King. Đổi mới 100% trong 7 ngày nếu phát sinh lỗi từ nhà sản xuất.</div>
      </div>
      <div class="benefit-item">
        <div class="benefit-title">🚚 Giao Hàng Siêu Tốc</div>
        <div class="benefit-desc">Xuất kho 24h - 48h tại Hà Nội & TP.HCM. Hỗ trợ giao chành xe tải an toàn, tiết kiệm chi phí đến các tỉnh thành.</div>
      </div>
      <div class="benefit-item">
        <div class="benefit-title">📈 Hỗ Trợ Truyền Thông</div>
        <div class="benefit-desc">Cung cấp trọn gói hình ảnh chụp studio, video clip thực tế, mẫu bài đăng phục vụ bán lẻ Facebook, TikTok, Sàn TMĐT.</div>
      </div>
    </div>

    <!-- TERMS & CONDITIONS -->
    <div class="terms-box">
      <div class="terms-title">ĐIỀU KHOẢN VÀ CHÍNH SÁCH BÁN HÀNG CHUNG</div>
      <ul>
        <li><strong>Thời gian hiệu lực:</strong> Biểu giá trên chính thức có hiệu lực áp dụng từ ngày <strong>18/10/2026</strong> cho đến khi có thông báo bằng văn bản mới nhất.</li>
        <li><strong>Quy định bán lẻ:</strong> Quý đối tác và Đại lý cam kết tuân thủ chính sách giá sàn niêm yết trên các kênh mạng xã hội và sàn thương mại điện tử để đảm bảo môi trường kinh doanh minh bạch và bảo vệ tối đa quyền lợi chung của toàn hệ thống.</li>
        <li><strong>Phương thức thanh toán:</strong> Thanh toán chuyển khoản trước khi xuất kho hoặc theo điều khoản bảo lãnh công nợ trong hợp đồng phân phối.</li>
      </ul>
    </div>

    <!-- SIGNATURES BLOCK (3 COLUMNS) -->
    <div class="signatures-block">
      <div class="sign-col">
        <div class="title">NGƯỜI LẬP THÔNG BÁO</div>
        <div class="sub">(Ký và ghi rõ họ tên)</div>
        <div class="stamp-area"></div>
        <div class="signer-name">Phòng Kinh Doanh Vũ Gia</div>
      </div>

      <div class="sign-col">
        <div class="title">KẾ TOÁN TRƯỞNG</div>
        <div class="sub">(Ký và ghi rõ họ tên)</div>
        <div class="stamp-area"></div>
        <div class="signer-name">Nguyễn Thị Nguyệt</div>
      </div>

      <div class="sign-col">
        <div class="title">GIÁM ĐỐC ĐIỀU HÀNH</div>
        <div class="sub">(Ký tên và đóng dấu)</div>
        <div class="stamp-area">
          <div class="stamp-badge">
            <span>CÔNG TY TNHH</span>
            <span style="font-size: 5px; margin: 0.5px 0;">HỢP TÁC</span>
            <span style="font-size: 6.5px; font-weight: 900; color: #b91c1c;">VŨ GIA</span>
            <span style="font-size: 4px; margin-top: 0.5px;">★ HÀ NỘI ★</span>
          </div>
        </div>
        <div class="signer-name" style="color: #0369a1;">Lê Quang Tuyến</div>
      </div>
    </div>

    <!-- FOOTER NOTE -->
    <div class="doc-footer">
      <span>Lock&King Vietnam - Giải pháp gia dụng thông minh & chất lượng cao cho gia đình Việt</span>
      <span>Mã tài liệu: TB-BG-20261018-01 &bull; Áp dụng từ 18/10/2026</span>
    </div>

  </div>

</body>
</html>
`;

const htmlPath = path.join(__dirname, 'thong_bao_bang_gia_18_10_2026.html');
fs.writeFileSync(htmlPath, fullHtml, 'utf8');
console.log('SUCCESS: Written HTML document to ' + htmlPath);

// 3. Xuất file PDF tự động bằng Chrome hoặc Edge headless (khổ Landscape chuẩn)
const pdfPath = path.join(__dirname, 'thong_bao_bang_gia_18_10_2026.pdf');
const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
];

let browserExec = chromePaths.find(p => fs.existsSync(p));
if (browserExec) {
  try {
    const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
    const cmd = `"${browserExec}" --headless --disable-gpu --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf="${pdfPath}" "${fileUrl}"`;
    console.log('Running browser command to generate PDF: ' + cmd);
    execSync(cmd, { stdio: 'inherit' });
    if (fs.existsSync(pdfPath)) {
      console.log('SUCCESS: Generated PDF at ' + pdfPath + ' (size: ' + fs.statSync(pdfPath).size + ' bytes)');
    } else {
      console.log('WARNING: PDF file was not created by browser command.');
    }
  } catch (err) {
    console.error('Error generating PDF via browser:', err.message);
  }
} else {
  console.log('No Chrome/Edge executable found for automated PDF export.');
}
