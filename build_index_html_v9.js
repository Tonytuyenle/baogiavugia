const fs = require('fs');
const path = require('path');

const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, 'real_catalog_v4.json'), 'utf8'));

// Format currency
const formatVND = (val) => (val === null || val === undefined || isNaN(val)) ? '0 đ' : new Intl.NumberFormat('vi-VN').format(Math.round(val)) + ' đ';
const escapeHtml = (text) => text ? String(text).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m]) : '';

// Function to generate the A4 Landscape Printable / Exportable Table HTML
function generateCatalogPdfDocument(products, includeCost = true) {
  let lastBrand = '';
  let lastCat = '';
  let rowsHtml = '';
  const colCount = includeCost ? 18 : 15;
  const todayStr = new Date().toLocaleDateString('vi-VN');

  products.forEach((p, idx) => {
    const isLK = p.brand === 'Lock&King';

    // Brand section divider
    if (p.brand !== lastBrand) {
      lastBrand = p.brand;
      lastCat = '';
      rowsHtml += `
        <tr class="pdf-brand-row" style="background-color: #0f172a !important; color: #ffffff !important; page-break-inside: avoid; break-inside: avoid;">
          <td colspan="${colCount}" style="padding: 7px 12px; font-weight: 900; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid #1e293b; background-color: #0f172a !important; color: #ffffff !important;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="color: #f59e0b;">★</span>
              <span>${p.brand === 'Lock&King' ? 'PHẦN I – THƯƠNG HIỆU LOCK&KING (49 MODEL)' : 'PHẦN II – THƯƠNG HIỆU TAKIN (16 MODEL)'}</span>
            </div>
          </td>
        </tr>
      `;
    }

    // Category divider
    if (p.categoryName !== lastCat) {
      lastCat = p.categoryName;
      rowsHtml += `
        <tr class="pdf-category-row" style="background-color: #d97706 !important; color: #ffffff !important; page-break-inside: avoid; break-inside: avoid;">
          <td colspan="${colCount}" style="padding: 5px 12px; font-weight: 700; font-size: 10px; text-transform: uppercase; border: 1px solid #b45309; background-color: #d97706 !important; color: #ffffff !important;">
            NHÓM SẢN PHẨM: ${p.categoryName}
          </td>
        </tr>
      `;
    }

    const d = p.diffOnlineOffline || 0;
    let diffCell = '<span style="color: #94a3b8; font-size: 9px;">0 đ</span>';
    if (d > 0) {
      diffCell = `<span style="font-weight: 700; color: #78350f; background: #fef3c7; border: 1px solid #fde68a; padding: 1px 4px; border-radius: 3px; font-size: 9px;">+${formatVND(d)} (+${p.diffOnlineOfflinePct})</span>`;
    }

    const impDiff = p.importPriceDiff || 0;
    let diffImportCell = '<span style="color: #94a3b8; font-size: 9px;">0 đ</span>';
    if (impDiff > 0) {
      diffImportCell = `<span style="font-weight: 700; color: #b91c1c; background: #fef2f2; border: 1px solid #fecaca; padding: 1px 4px; border-radius: 3px; font-size: 9px;">+${formatVND(impDiff)} (+${p.importPriceDiffPct}%)</span>`;
    } else if (impDiff < 0) {
      diffImportCell = `<span style="font-weight: 700; color: #047857; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 1px 4px; border-radius: 3px; font-size: 9px;">${formatVND(impDiff)} (${p.importPriceDiffPct}%)</span>`;
    }

    // Image HTML with fallback
    const imgHtml = p.image ? `
      <img 
        src="${p.image}" 
        alt="${p.canonicalCode}" 
        style="width: 32px; height: 32px; object-fit: contain; border-radius: 4px; border: 1px solid #e2e8f0; background: #ffffff; padding: 1px; display: block; margin: 0 auto;"
        onerror="this.onerror=null; this.src='https://placehold.co/60x60/f1f5f9/94a3b8?text=' + encodeURIComponent('${p.canonicalCode}');"
      />
    ` : `
      <div style="width: 32px; height: 32px; border-radius: 4px; border: 1px dashed #cbd5e1; background: #f8fafc; display: flex; align-items: center; justify-content: center; margin: 0 auto; color: #94a3b8; font-size: 7px; font-weight: bold;">
        ${p.canonicalCode.substring(0, 6)}
      </div>
    `;

    rowsHtml += `
      <tr style="page-break-inside: avoid; break-inside: avoid; border-bottom: 1px solid #e2e8f0; font-size: 9.5px; ${idx % 2 === 1 ? 'background-color: #f8fafc;' : 'background-color: #ffffff;'}">
        <td style="padding: 4px 3px; text-align: center; color: #64748b; font-family: monospace; border: 1px solid #cbd5e1;">${p.stt || idx + 1}</td>
        <td style="padding: 4px 4px; font-family: monospace; font-weight: 700; border: 1px solid #cbd5e1; white-space: nowrap;">
          <span style="color: ${isLK ? '#0369a1' : '#c2410c'};">${p.canonicalCode}</span>
        </td>
        <td style="padding: 2px 2px; text-align: center; border: 1px solid #cbd5e1;">${imgHtml}</td>
        <td style="padding: 4px 6px; font-weight: 600; color: #1e293b; border: 1px solid #cbd5e1; max-width: 170px; line-height: 1.25;">${escapeHtml(p.name)}</td>
        
        <td class="pdf-cost-col" style="padding: 4px 4px; text-align: right; font-family: monospace; color: #64748b; border: 1px solid #cbd5e1; white-space: nowrap; ${includeCost ? '' : 'display: none;'}">${formatVND(p.oldImportPrice)}</td>
        <td class="pdf-cost-col" style="padding: 4px 4px; text-align: right; font-family: monospace; font-weight: 700; color: #be123c; border: 1px solid #cbd5e1; white-space: nowrap; ${includeCost ? '' : 'display: none;'}">${formatVND(p.newImportPrice)}</td>
        <td class="pdf-cost-col" style="padding: 4px 4px; text-align: center; border: 1px solid #cbd5e1; ${includeCost ? '' : 'display: none;'}">${diffImportCell}</td>

        <td style="padding: 4px 5px; text-align: right; font-family: monospace; font-weight: 900; color: #0284c7; background-color: #f0f9ff; border: 1px solid #cbd5e1; white-space: nowrap;">${formatVND(p.nppOnlinePrice)}</td>
        <td style="padding: 4px 5px; text-align: right; font-family: monospace; font-weight: 700; color: #1d4ed8; border: 1px solid #cbd5e1; white-space: nowrap;">${formatVND(p.facebookPrice)}</td>
        <td style="padding: 4px 4px; text-align: right; font-family: monospace; font-weight: 600; color: #7e22ce; border: 1px solid #cbd5e1; white-space: nowrap;">${formatVND(p.tmdtPrice)}</td>
        <td style="padding: 4px 4px; text-align: right; font-family: monospace; color: #64748b; border: 1px solid #cbd5e1; white-space: nowrap;">${formatVND(p.retailPrice)}</td>
        
        <td style="padding: 4px 5px; text-align: right; font-family: monospace; font-weight: 700; color: #047857; background-color: #ecfdf5; border: 1px solid #cbd5e1; white-space: nowrap;">+${formatVND(p.profitNPP)}</td>
        <td style="padding: 4px 4px; text-align: center; border: 1px solid #cbd5e1; background-color: #fffbeb;">
          <span style="font-family: monospace; font-weight: 800; color: #78350f; font-size: 9.5px;">${p.profitPct}</span>
        </td>
        
        <td style="padding: 4px 4px; text-align: right; font-family: monospace; color: #334155; border: 1px solid #cbd5e1; white-space: nowrap;">${formatVND(p.nppOfflinePrice)}</td>
        <td style="padding: 4px 3px; text-align: center; border: 1px solid #cbd5e1;">${diffCell}</td>
        <td style="padding: 4px 4px; text-align: right; font-family: monospace; font-weight: 600; color: #334155; border: 1px solid #cbd5e1; white-space: nowrap;">${formatVND(p.dealerOfflinePrice)}</td>
        <td style="padding: 4px 3px; text-align: center; border: 1px solid #cbd5e1;">
          <span style="font-family: monospace; font-weight: 700; color: #475569; font-size: 9px;">${p.dealerProfitRatio || '0%'}</span>
        </td>
        <td style="padding: 3px 5px; color: #475569; font-size: 8px; border: 1px solid #cbd5e1; line-height: 1.2; max-width: 130px;">${escapeHtml(p.specs ? p.specs.substring(0, 65) + (p.specs.length > 65 ? '...' : '') : '-')}</td>
      </tr>
    `;
  });

  return `
    <!-- HEADER LETTERHEAD -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 10px;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="width: 44px; height: 44px; background: #0f172a; color: #ffffff; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          LK
        </div>
        <div>
          <h1 style="font-size: 14px; font-weight: 900; color: #0f172a; text-transform: uppercase; margin: 0; letter-spacing: -0.2px;">CÔNG TY TNHH LOCK&KING VIỆT NAM</h1>
          <p style="font-size: 9.5px; color: #475569; margin: 2px 0 0 0;">Phân Phối Độc Quyền Thiết Bị Gia Dụng Cao Cấp Lock&King & Takin Chính Hãng</p>
          <p style="font-size: 8.5px; color: #94a3b8; margin: 1px 0 0 0;">Hotline: 1900 8888 | Website: lockking.vn | MST: 0109988776 | Trụ sở: Hà Nội & TP. Hồ Chí Minh</p>
        </div>
      </div>
      <div style="text-align: right; font-size: 9.5px;">
        <div style="display: inline-block; padding: 3px 8px; background: #f1f5f9; color: #0f172a; font-family: monospace; font-weight: 700; border-radius: 4px; border: 1px solid #cbd5e1;">
          BIỂU GIÁ: BG-ONLINE-2026
        </div>
        <p style="color: #64748b; margin: 3px 0 0 0;">Ngày xuất: <strong style="color: #0f172a;">${todayStr}</strong></p>
        <p style="color: #64748b; margin: 2px 0 0 0;">Quy mô: <strong>65 Model</strong> (49 Lock&King | 16 Takin)</p>
      </div>
    </div>

    <!-- DOCUMENT TITLE -->
    <div style="text-align: center; margin: 10px 0 12px 0;">
      <h2 style="font-size: 15px; font-weight: 900; color: #0f172a; text-transform: uppercase; margin: 0; letter-spacing: 0.5px;">
        BẢNG PHÂN LOẠI GIÁ – KÊNH NHÀ PHÂN PHỐI ONLINE
      </h2>
      <p style="font-size: 10px; color: #64748b; font-style: italic; margin: 2px 0 0 0;">
        (Áp dụng toàn quốc cho hệ thống Đại lý & NPP Online / Offline chính hãng)
      </p>
    </div>

    <!-- TABLE -->
    <table class="pdf-table" style="width: 100%; border-collapse: collapse; text-align: left; font-size: 9px; border: 1px solid #cbd5e1; margin-bottom: 12px;">
      <thead>
        <tr style="background-color: #0f172a !important; color: #ffffff !important;">
          <th style="padding: 6px 3px; text-align: center; color: #94a3b8; border: 1px solid #334155; width: 26px;">STT</th>
          <th style="padding: 6px 4px; color: #7dd3fc; border: 1px solid #334155; width: 68px;">Model</th>
          <th style="padding: 6px 2px; text-align: center; color: #e2e8f0; border: 1px solid #334155; width: 38px;">Hình Ảnh</th>
          <th style="padding: 6px 6px; color: #ffffff; border: 1px solid #334155;">Tên Sản Phẩm</th>
          
          <th class="pdf-cost-col" style="padding: 6px 4px; text-align: right; color: #cbd5e1; border: 1px solid #334155; width: 66px; ${includeCost ? '' : 'display: none;'}">Giá Vốn Cũ</th>
          <th class="pdf-cost-col" style="padding: 6px 4px; text-align: right; color: #fda4af; border: 1px solid #334155; width: 66px; ${includeCost ? '' : 'display: none;'}">Giá Vốn Mới</th>
          <th class="pdf-cost-col" style="padding: 6px 4px; text-align: center; color: #fcd34d; border: 1px solid #334155; width: 72px; ${includeCost ? '' : 'display: none;'}">Lệch Vốn</th>

          <th style="padding: 6px 5px; text-align: right; color: #7dd3fc; border: 1px solid #334155; width: 70px;">Giá NPP Online</th>
          <th style="padding: 6px 5px; text-align: right; color: #93c5fd; border: 1px solid #334155; width: 70px;">Giá Facebook</th>
          <th style="padding: 6px 4px; text-align: right; color: #d8b4fe; border: 1px solid #334155; width: 66px;">Giá TMĐT</th>
          <th style="padding: 6px 4px; text-align: right; color: #cbd5e1; border: 1px solid #334155; width: 66px;">Giá Niêm Yết</th>

          <th style="padding: 6px 5px; text-align: right; color: #6ee7b7; border: 1px solid #334155; width: 70px;">Lợi Nhuận NPP</th>
          <th style="padding: 6px 4px; text-align: center; color: #fcd34d; border: 1px solid #334155; width: 56px;">% LN / FB</th>

          <th style="padding: 6px 4px; text-align: right; color: #fed7aa; border: 1px solid #334155; width: 68px;">Giá NPP Off</th>
          <th style="padding: 6px 3px; text-align: center; color: #fcd34d; border: 1px solid #334155; width: 68px;">Lệch Off-On</th>
          <th style="padding: 6px 4px; text-align: right; color: #a7f3d0; border: 1px solid #334155; width: 68px;">Giá ĐL Offline</th>
          <th style="padding: 6px 3px; text-align: center; color: #a7f3d0; border: 1px solid #334155; width: 56px;">% LN ĐL</th>
          <th style="padding: 6px 5px; text-align: center; color: #94a3b8; border: 1px solid #334155; width: 85px;">Thông Số</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <!-- FOOTER & POLICIES -->
    <div style="page-break-inside: avoid; break-inside: avoid; border-top: 1px solid #cbd5e1; padding-top: 8px; margin-top: 6px; font-size: 9.5px; color: #475569;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div>
          <p style="font-weight: 700; color: #0f172a; margin: 0 0 3px 0;">CHÍNH SÁCH BÁN HÀNG & PHÂN PHỐI:</p>
          <p style="margin: 1px 0;">• Model <strong>LK-2633</strong> áp dụng giá Facebook chính thức là <strong>850.000 đ</strong>.</p>
          <p style="margin: 1px 0;">• % Lợi Nhuận NPP Online = (Giá FB - Giá NPP Online) / Giá FB.</p>
          <p style="margin: 1px 0;">• % Lợi Nhuận Đại Lý Offline = (Giá FB - Giá ĐL Offline) / Giá FB.</p>
        </div>
        <div style="text-align: right;">
          <p style="font-weight: 700; color: #0f172a; margin: 0 0 3px 0;">ĐIỀU KIỆN HIỆU LỰC:</p>
          <p style="margin: 1px 0;">• Hiệu lực từ ngày ký ban hành trên toàn quốc.</p>
          <p style="margin: 1px 0;">• Cam kết 100% hàng chính hãng mới xuất kho, bảo hành 12 tháng.</p>
          <p style="margin: 1px 0;">• Tiền tệ: VNĐ (Việt Nam Đồng). Đã bao gồm thuế theo quy định.</p>
        </div>
      </div>

      <!-- SIGNATURES -->
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; text-align: center; margin-top: 18px; padding-top: 6px;">
        <div>
          <p style="font-weight: 700; color: #0f172a; font-size: 10px; margin: 0;">NGƯỜI LẬP BIỂU</p>
          <p style="font-size: 8.5px; color: #94a3b8; font-style: italic; margin: 2px 0 0 0;">(Ký, ghi rõ họ tên)</p>
          <div style="height: 42px;"></div>
          <p style="font-weight: 700; color: #334155; font-size: 10px; margin: 0;">Nguyễn Văn Quản Lý</p>
        </div>
        <div>
          <p style="font-weight: 700; color: #0f172a; font-size: 10px; margin: 0;">KẾ TOÁN TRƯỞNG</p>
          <p style="font-size: 8.5px; color: #94a3b8; font-style: italic; margin: 2px 0 0 0;">(Ký, ghi rõ họ tên)</p>
          <div style="height: 42px;"></div>
          <p style="font-weight: 700; color: #334155; font-size: 10px; margin: 0;">Trần Thị Kiểm Soát</p>
        </div>
        <div>
          <p style="font-weight: 700; color: #0f172a; font-size: 10px; margin: 0;">TỔNG GIÁM ĐỐC DUYỆT</p>
          <p style="font-size: 8.5px; color: #94a3b8; font-style: italic; margin: 2px 0 0 0;">(Ký tên & đóng dấu)</p>
          <div style="height: 42px;"></div>
          <p style="font-weight: 800; color: #0369a1; font-size: 10px; margin: 0;">Lock&King Việt Nam</p>
        </div>
      </div>
    </div>
  `;
}

// Pre-render the catalog PDF content for instant preview
const prebuiltCatalogPdfHtml = generateCatalogPdfDocument(catalog, true);

// Modal HTML
const catalogPdfModalHtml = `
  <!-- ================= MODAL XUẤT FILE PDF BẢNG GIÁ 65 MÃ ================= -->
  <div id="catalogPdfModal" class="hidden fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 overflow-y-auto p-2 sm:p-4 flex items-start justify-center">
    <div class="bg-white rounded-2xl shadow-2xl max-w-[98vw] w-[1450px] overflow-hidden my-3 border border-slate-300 flex flex-col">
      
      <!-- MODAL TOP BAR -->
      <div class="p-3.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 no-print">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow">
            <i data-lucide="file-down" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-black text-sm text-white">Xuất File PDF – Bảng Phân Loại Giá NPP Online (65 Model)</h3>
              <span class="text-[10px] bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded font-bold">Khổ A4 Ngang</span>
            </div>
            <p class="text-[11px] text-slate-300">Giữ nguyên chuẩn form mẫu biểu của hãng • Đầy đủ hình ảnh sản phẩm • Tỷ lệ chuẩn A4 Landscape</p>
          </div>
        </div>

        <div class="flex items-center flex-wrap gap-2.5">
          <!-- Toggle Import Cost -->
          <label class="flex items-center gap-1.5 text-xs text-slate-200 cursor-pointer bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 select-none transition">
            <input type="checkbox" id="pdfIncludeImportCost" checked onchange="togglePdfImportCosts(this.checked)" class="rounded text-sky-500 focus:ring-0 w-3.5 h-3.5 cursor-pointer" />
            <span>Gồm Cột Giá Vốn & Lệch Nhập</span>
          </label>

          <!-- Tải PDF trực tiếp qua html2pdf -->
          <button type="button" onclick="downloadCatalogPdf()" class="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow transition">
            <i data-lucide="download" class="w-4 h-4"></i>
            <span>Tải File PDF (.pdf)</span>
          </button>

          <!-- In / Lưu PDF trình duyệt qua window.print -->
          <button type="button" onclick="printCatalogPdf()" class="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow transition" title="Mở hộp thoại in A4 Ngang của trình duyệt, chọn 'Lưu dưới dạng PDF' để xuất file vector sắc nét">
            <i data-lucide="printer" class="w-4 h-4"></i>
            <span>In / Lưu PDF Trình Duyệt</span>
          </button>

          <!-- Đóng -->
          <button type="button" onclick="closeCatalogPdfModal()" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg font-bold text-xs transition">✕</button>
        </div>
      </div>

      <!-- PREVIEW BODY (SCROLLABLE) -->
      <div class="p-4 sm:p-6 bg-slate-200/90 overflow-x-auto max-h-[80vh]">
        <!-- WRAPPER FOR PRINT & HTML2PDF -->
        <div id="printCatalogPdfContent" class="bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-slate-300 mx-auto text-slate-900" style="min-width: 1140px; max-width: 1350px;">
          ${prebuiltCatalogPdfHtml}
        </div>
      </div>

      <!-- MODAL FOOTER -->
      <div class="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between no-print text-xs text-slate-500 px-6">
        <div class="flex items-center gap-2">
          <i data-lucide="info" class="w-4 h-4 text-sky-600"></i>
          <span>Mẹo: Bấm <strong>"Tải File PDF (.pdf)"</strong> để tải trực tiếp file về máy, hoặc bấm <strong>"In / Lưu PDF Trình Duyệt"</strong> để in hoặc lưu vector PDF từ hệ điều hành.</span>
        </div>
        <button type="button" onclick="closeCatalogPdfModal()" class="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold text-xs">Đóng Cửa Sổ</button>
      </div>

    </div>
  </div>
`;

// Client-side JavaScript code for PDF operations (pure JavaScript, will be inserted into index.html)
const clientPdfJsFunctions = `
    /* ================= CATALOG PDF EXPORT FUNCTIONS ================= */
    function openCatalogPdfModal() {
      renderCatalogPdfArea();
      document.getElementById('catalogPdfModal').classList.remove('hidden');
      safeLucideIcons();
    }

    function closeCatalogPdfModal() {
      document.getElementById('catalogPdfModal').classList.add('hidden');
    }

    function togglePdfImportCosts(show) {
      const costEls = document.querySelectorAll('.pdf-cost-col');
      costEls.forEach(el => {
        el.style.display = show ? '' : 'none';
      });
    }

    function setPrintOrientation(orientation, margin) {
      margin = margin || '5mm';
      let styleEl = document.getElementById('printPageOrientation');
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'printPageOrientation';
        document.head.appendChild(styleEl);
      }
      styleEl.innerHTML = '@media print { @page { size: A4 ' + orientation + '; margin: ' + margin + '; } }';
    }

    function printCatalogPdf() {
      setPrintOrientation('landscape', '5mm');
      document.body.classList.add('printing-catalog');
      document.body.classList.remove('printing-quotation');
      window.print();
      setTimeout(function() {
        document.body.classList.remove('printing-catalog');
      }, 1500);
    }

    function printQuotation() {
      setPrintOrientation('portrait', '10mm');
      document.body.classList.add('printing-quotation');
      document.body.classList.remove('printing-catalog');
      window.print();
      setTimeout(function() {
        document.body.classList.remove('printing-quotation');
      }, 1500);
    }

    function downloadCatalogPdf() {
      const element = document.getElementById('printCatalogPdfContent');
      if (!element) return;

      showToast('Đang tạo file PDF chất lượng cao (A4 Ngang), vui lòng chờ...');

      const opt = {
        margin: [5, 5, 5, 5],
        filename: 'Bang_Phan_Loai_Gia_LockKing_Takin_65_Model_' + new Date().toISOString().substring(0, 10) + '.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          scrollY: 0
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'landscape'
        },
        pagebreak: {
          mode: ['avoid-all', 'css', 'legacy']
        }
      };

      if (window.html2pdf) {
        html2pdf().set(opt).from(element).save().then(function() {
          showToast('Xuất file PDF thành công!');
        }).catch(function(err) {
          console.error('html2pdf error:', err);
          showToast('Đang chuyển sang in/lưu PDF trình duyệt...');
          printCatalogPdf();
        });
      } else {
        printCatalogPdf();
      }
    }

    function renderCatalogPdfArea() {
      const db = getDB();
      const area = document.getElementById('printCatalogPdfContent');
      if (!area) return;

      const includeCost = document.getElementById('pdfIncludeImportCost') ? document.getElementById('pdfIncludeImportCost').checked : true;
      const todayStr = new Date().toLocaleDateString('vi-VN');

      let lastBrand = '';
      let lastCat = '';
      let rowsHtml = '';
      const colCount = includeCost ? 18 : 15;

      db.products.forEach(function(p, idx) {
        const isLK = p.brand === 'Lock&King';

        // Brand section divider
        if (p.brand !== lastBrand) {
          lastBrand = p.brand;
          lastCat = '';
          rowsHtml += '<tr class="pdf-brand-row" style="background-color: #0f172a !important; color: #ffffff !important; page-break-inside: avoid; break-inside: avoid;">' +
            '<td colspan="' + colCount + '" style="padding: 7px 12px; font-weight: 900; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid #1e293b; background-color: #0f172a !important; color: #ffffff !important;">' +
              '<div style="display: flex; align-items: center; gap: 8px;">' +
                '<span style="color: #f59e0b;">★</span>' +
                '<span>' + (p.brand === 'Lock&King' ? 'PHẦN I – THƯƠNG HIỆU LOCK&KING (49 MODEL)' : 'PHẦN II – THƯƠNG HIỆU TAKIN (16 MODEL)') + '</span>' +
              '</div>' +
            '</td>' +
          '</tr>';
        }

        // Category divider
        if (p.categoryName !== lastCat) {
          lastCat = p.categoryName;
          rowsHtml += '<tr class="pdf-category-row" style="background-color: #d97706 !important; color: #ffffff !important; page-break-inside: avoid; break-inside: avoid;">' +
            '<td colspan="' + colCount + '" style="padding: 5px 12px; font-weight: 700; font-size: 10px; text-transform: uppercase; border: 1px solid #b45309; background-color: #d97706 !important; color: #ffffff !important;">' +
              'NHÓM SẢN PHẨM: ' + p.categoryName +
            '</td>' +
          '</tr>';
        }

        const d = p.diffOnlineOffline || 0;
        let diffCell = '<span style="color: #94a3b8; font-size: 9px;">0 đ</span>';
        if (d > 0) {
          diffCell = '<span style="font-weight: 700; color: #78350f; background: #fef3c7; border: 1px solid #fde68a; padding: 1px 4px; border-radius: 3px; font-size: 9px;">+' + formatVND(d) + ' (+' + p.diffOnlineOfflinePct + ')</span>';
        }

        const impDiff = p.importPriceDiff || 0;
        let diffImportCell = '<span style="color: #94a3b8; font-size: 9px;">0 đ</span>';
        if (impDiff > 0) {
          diffImportCell = '<span style="font-weight: 700; color: #b91c1c; background: #fef2f2; border: 1px solid #fecaca; padding: 1px 4px; border-radius: 3px; font-size: 9px;">+' + formatVND(impDiff) + ' (+' + p.importPriceDiffPct + '%)</span>';
        } else if (impDiff < 0) {
          diffImportCell = '<span style="font-weight: 700; color: #047857; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 1px 4px; border-radius: 3px; font-size: 9px;">' + formatVND(impDiff) + ' (' + p.importPriceDiffPct + '%)</span>';
        }

        // Image HTML with fallback
        const imgHtml = p.image ? 
          '<img src="' + p.image + '" alt="' + p.canonicalCode + '" style="width: 32px; height: 32px; object-fit: contain; border-radius: 4px; border: 1px solid #e2e8f0; background: #ffffff; padding: 1px; display: block; margin: 0 auto;" onerror="this.onerror=null; this.src=\\'https://placehold.co/60x60/f1f5f9/94a3b8?text=' + encodeURIComponent(p.canonicalCode) + '\\';" />' :
          '<div style="width: 32px; height: 32px; border-radius: 4px; border: 1px dashed #cbd5e1; background: #f8fafc; display: flex; align-items: center; justify-content: center; margin: 0 auto; color: #94a3b8; font-size: 7px; font-weight: bold;">' + p.canonicalCode.substring(0, 6) + '</div>';

        rowsHtml += '<tr style="page-break-inside: avoid; break-inside: avoid; border-bottom: 1px solid #e2e8f0; font-size: 9.5px; ' + (idx % 2 === 1 ? 'background-color: #f8fafc;' : 'background-color: #ffffff;') + '">' +
          '<td style="padding: 4px 3px; text-align: center; color: #64748b; font-family: monospace; border: 1px solid #cbd5e1;">' + (p.stt || idx + 1) + '</td>' +
          '<td style="padding: 4px 4px; font-family: monospace; font-weight: 700; border: 1px solid #cbd5e1; white-space: nowrap;">' +
            '<span style="color: ' + (isLK ? '#0369a1' : '#c2410c') + ';">' + p.canonicalCode + '</span>' +
          '</td>' +
          '<td style="padding: 2px 2px; text-align: center; border: 1px solid #cbd5e1;">' + imgHtml + '</td>' +
          '<td style="padding: 4px 6px; font-weight: 600; color: #1e293b; border: 1px solid #cbd5e1; max-width: 170px; line-height: 1.25;">' + escapeHtml(p.name) + '</td>' +
          
          '<td class="pdf-cost-col" style="padding: 4px 4px; text-align: right; font-family: monospace; color: #64748b; border: 1px solid #cbd5e1; white-space: nowrap; ' + (includeCost ? '' : 'display: none;') + '">' + formatVND(p.oldImportPrice) + '</td>' +
          '<td class="pdf-cost-col" style="padding: 4px 4px; text-align: right; font-family: monospace; font-weight: 700; color: #be123c; border: 1px solid #cbd5e1; white-space: nowrap; ' + (includeCost ? '' : 'display: none;') + '">' + formatVND(p.newImportPrice) + '</td>' +
          '<td class="pdf-cost-col" style="padding: 4px 4px; text-align: center; border: 1px solid #cbd5e1; ' + (includeCost ? '' : 'display: none;') + '">' + diffImportCell + '</td>' +

          '<td style="padding: 4px 5px; text-align: right; font-family: monospace; font-weight: 900; color: #0284c7; background-color: #f0f9ff; border: 1px solid #cbd5e1; white-space: nowrap;">' + formatVND(p.nppOnlinePrice) + '</td>' +
          '<td style="padding: 4px 5px; text-align: right; font-family: monospace; font-weight: 700; color: #1d4ed8; border: 1px solid #cbd5e1; white-space: nowrap;">' + formatVND(p.facebookPrice) + '</td>' +
          '<td style="padding: 4px 4px; text-align: right; font-family: monospace; font-weight: 600; color: #7e22ce; border: 1px solid #cbd5e1; white-space: nowrap;">' + formatVND(p.tmdtPrice) + '</td>' +
          '<td style="padding: 4px 4px; text-align: right; font-family: monospace; color: #64748b; border: 1px solid #cbd5e1; white-space: nowrap;">' + formatVND(p.retailPrice) + '</td>' +
          
          '<td style="padding: 4px 5px; text-align: right; font-family: monospace; font-weight: 700; color: #047857; background-color: #ecfdf5; border: 1px solid #cbd5e1; white-space: nowrap;">+' + formatVND(p.profitNPP) + '</td>' +
          '<td style="padding: 4px 4px; text-align: center; border: 1px solid #cbd5e1; background-color: #fffbeb;">' +
            '<span style="font-family: monospace; font-weight: 800; color: #78350f; font-size: 9.5px;">' + p.profitPct + '</span>' +
          '</td>' +
          
          '<td style="padding: 4px 4px; text-align: right; font-family: monospace; color: #334155; border: 1px solid #cbd5e1; white-space: nowrap;">' + formatVND(p.nppOfflinePrice) + '</td>' +
          '<td style="padding: 4px 3px; text-align: center; border: 1px solid #cbd5e1;">' + diffCell + '</td>' +
          '<td style="padding: 4px 4px; text-align: right; font-family: monospace; font-weight: 600; color: #334155; border: 1px solid #cbd5e1; white-space: nowrap;">' + formatVND(p.dealerOfflinePrice) + '</td>' +
          '<td style="padding: 4px 3px; text-align: center; border: 1px solid #cbd5e1;">' +
            '<span style="font-family: monospace; font-weight: 700; color: #475569; font-size: 9px;">' + (p.dealerProfitRatio || '0%') + '</span>' +
          '</td>' +
          '<td style="padding: 3px 5px; color: #475569; font-size: 8px; border: 1px solid #cbd5e1; line-height: 1.2; max-width: 130px;">' + escapeHtml(p.specs ? p.specs.substring(0, 65) + (p.specs.length > 65 ? '...' : '') : '-') + '</td>' +
        '</tr>';
      });

      area.innerHTML = '<!-- HEADER LETTERHEAD -->' +
        '<div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 10px;">' +
          '<div style="display: flex; align-items: center; gap: 12px;">' +
            '<div style="width: 44px; height: 44px; background: #0f172a; color: #ffffff; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">' +
              'LK' +
            '</div>' +
            '<div>' +
              '<h1 style="font-size: 14px; font-weight: 900; color: #0f172a; text-transform: uppercase; margin: 0; letter-spacing: -0.2px;">CÔNG TY TNHH LOCK&KING VIỆT NAM</h1>' +
              '<p style="font-size: 9.5px; color: #475569; margin: 2px 0 0 0;">Phân Phối Độc Quyền Thiết Bị Gia Dụng Cao Cấp Lock&King & Takin Chính Hãng</p>' +
              '<p style="font-size: 8.5px; color: #94a3b8; margin: 1px 0 0 0;">Hotline: 1900 8888 | Website: lockking.vn | MST: 0109988776 | Trụ sở: Hà Nội & TP. Hồ Chí Minh</p>' +
            '</div>' +
          '</div>' +
          '<div style="text-align: right; font-size: 9.5px;">' +
            '<div style="display: inline-block; padding: 3px 8px; background: #f1f5f9; color: #0f172a; font-family: monospace; font-weight: 700; border-radius: 4px; border: 1px solid #cbd5e1;">' +
              'BIỂU GIÁ: BG-ONLINE-2026' +
            '</div>' +
            '<p style="color: #64748b; margin: 3px 0 0 0;">Ngày xuất: <strong style="color: #0f172a;">' + todayStr + '</strong></p>' +
            '<p style="color: #64748b; margin: 2px 0 0 0;">Quy mô: <strong>65 Model</strong> (49 Lock&King | 16 Takin)</p>' +
          '</div>' +
        '</div>' +

        '<!-- DOCUMENT TITLE -->' +
        '<div style="text-align: center; margin: 10px 0 12px 0;">' +
          '<h2 style="font-size: 15px; font-weight: 900; color: #0f172a; text-transform: uppercase; margin: 0; letter-spacing: 0.5px;">' +
            'BẢNG PHÂN LOẠI GIÁ – KÊNH NHÀ PHÂN PHỐI ONLINE' +
          '</h2>' +
          '<p style="font-size: 10px; color: #64748b; font-style: italic; margin: 2px 0 0 0;">' +
            '(Áp dụng toàn quốc cho hệ thống Đại lý & NPP Online / Offline chính hãng)' +
          '</p>' +
        '</div>' +

        '<!-- TABLE -->' +
        '<table class="pdf-table" style="width: 100%; border-collapse: collapse; text-align: left; font-size: 9px; border: 1px solid #cbd5e1; margin-bottom: 12px;">' +
          '<thead>' +
            '<tr style="background-color: #0f172a !important; color: #ffffff !important;">' +
              '<th style="padding: 6px 3px; text-align: center; color: #94a3b8; border: 1px solid #334155; width: 26px;">STT</th>' +
              '<th style="padding: 6px 4px; color: #7dd3fc; border: 1px solid #334155; width: 68px;">Model</th>' +
              '<th style="padding: 6px 2px; text-align: center; color: #e2e8f0; border: 1px solid #334155; width: 38px;">Hình Ảnh</th>' +
              '<th style="padding: 6px 6px; color: #ffffff; border: 1px solid #334155;">Tên Sản Phẩm</th>' +
              
              '<th class="pdf-cost-col" style="padding: 6px 4px; text-align: right; color: #cbd5e1; border: 1px solid #334155; width: 66px; ' + (includeCost ? '' : 'display: none;') + '">Giá Vốn Cũ</th>' +
              '<th class="pdf-cost-col" style="padding: 6px 4px; text-align: right; color: #fda4af; border: 1px solid #334155; width: 66px; ' + (includeCost ? '' : 'display: none;') + '">Giá Vốn Mới</th>' +
              '<th class="pdf-cost-col" style="padding: 6px 4px; text-align: center; color: #fcd34d; border: 1px solid #334155; width: 72px; ' + (includeCost ? '' : 'display: none;') + '">Lệch Vốn</th>' +

              '<th style="padding: 6px 5px; text-align: right; color: #7dd3fc; border: 1px solid #334155; width: 70px;">Giá NPP Online</th>' +
              '<th style="padding: 6px 5px; text-align: right; color: #93c5fd; border: 1px solid #334155; width: 70px;">Giá Facebook</th>' +
              '<th style="padding: 6px 4px; text-align: right; color: #d8b4fe; border: 1px solid #334155; width: 66px;">Giá TMĐT</th>' +
              '<th style="padding: 6px 4px; text-align: right; color: #cbd5e1; border: 1px solid #334155; width: 66px;">Giá Niêm Yết</th>' +

              '<th style="padding: 6px 5px; text-align: right; color: #6ee7b7; border: 1px solid #334155; width: 70px;">Lợi Nhuận NPP</th>' +
              '<th style="padding: 6px 4px; text-align: center; color: #fcd34d; border: 1px solid #334155; width: 56px;">% LN / FB</th>' +

              '<th style="padding: 6px 4px; text-align: right; color: #fed7aa; border: 1px solid #334155; width: 68px;">Giá NPP Off</th>' +
              '<th style="padding: 6px 3px; text-align: center; color: #fcd34d; border: 1px solid #334155; width: 68px;">Lệch Off-On</th>' +
              '<th style="padding: 6px 4px; text-align: right; color: #a7f3d0; border: 1px solid #334155; width: 68px;">Giá ĐL Offline</th>' +
              '<th style="padding: 6px 3px; text-align: center; color: #a7f3d0; border: 1px solid #334155; width: 56px;">% LN ĐL</th>' +
              '<th style="padding: 6px 5px; text-align: center; color: #94a3b8; border: 1px solid #334155; width: 85px;">Thông Số</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>' +
            rowsHtml +
          '</tbody>' +
        '</table>' +

        '<!-- FOOTER & POLICIES -->' +
        '<div style="page-break-inside: avoid; break-inside: avoid; border-top: 1px solid #cbd5e1; padding-top: 8px; margin-top: 6px; font-size: 9.5px; color: #475569;">' +
          '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">' +
            '<div>' +
              '<p style="font-weight: 700; color: #0f172a; margin: 0 0 3px 0;">CHÍNH SÁCH BÁN HÀNG & PHÂN PHỐI:</p>' +
              '<p style="margin: 1px 0;">• Model <strong>LK-2633</strong> áp dụng giá Facebook chính thức là <strong>850.000 đ</strong>.</p>' +
              '<p style="margin: 1px 0;">• % Lợi Nhuận NPP Online = (Giá FB - Giá NPP Online) / Giá FB.</p>' +
              '<p style="margin: 1px 0;">• % Lợi Nhuận Đại Lý Offline = (Giá FB - Giá ĐL Offline) / Giá FB.</p>' +
            '</div>' +
            '<div style="text-align: right;">' +
              '<p style="font-weight: 700; color: #0f172a; margin: 0 0 3px 0;">ĐIỀU KIỆN HIỆU LỰC:</p>' +
              '<p style="margin: 1px 0;">• Hiệu lực từ ngày ký ban hành trên toàn quốc.</p>' +
              '<p style="margin: 1px 0;">• Cam kết 100% hàng chính hãng mới xuất kho, bảo hành 12 tháng.</p>' +
              '<p style="margin: 1px 0;">• Tiền tệ: VNĐ (Việt Nam Đồng). Đã bao gồm thuế theo quy định.</p>' +
            '</div>' +
          '</div>' +

          '<!-- SIGNATURES -->' +
          '<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; text-align: center; margin-top: 18px; padding-top: 6px;">' +
            '<div>' +
              '<p style="font-weight: 700; color: #0f172a; font-size: 10px; margin: 0;">NGƯỜI LẬP BIỂU</p>' +
              '<p style="font-size: 8.5px; color: #94a3b8; font-style: italic; margin: 2px 0 0 0;">(Ký, ghi rõ họ tên)</p>' +
              '<div style="height: 42px;"></div>' +
              '<p style="font-weight: 700; color: #334155; font-size: 10px; margin: 0;">Nguyễn Văn Quản Lý</p>' +
            '</div>' +
            '<div>' +
              '<p style="font-weight: 700; color: #0f172a; font-size: 10px; margin: 0;">KẾ TOÁN TRƯỞNG</p>' +
              '<p style="font-size: 8.5px; color: #94a3b8; font-style: italic; margin: 2px 0 0 0;">(Ký, ghi rõ họ tên)</p>' +
              '<div style="height: 42px;"></div>' +
              '<p style="font-weight: 700; color: #334155; font-size: 10px; margin: 0;">Trần Thị Kiểm Soát</p>' +
            '</div>' +
            '<div>' +
              '<p style="font-weight: 700; color: #0f172a; font-size: 10px; margin: 0;">TỔNG GIÁM ĐỐC DUYỆT</p>' +
              '<p style="font-size: 8.5px; color: #94a3b8; font-style: italic; margin: 2px 0 0 0;">(Ký tên & đóng dấu)</p>' +
              '<div style="height: 42px;"></div>' +
              '<p style="font-weight: 800; color: #0369a1; font-size: 10px; margin: 0;">Lock&King Việt Nam</p>' +
            '</div>' +
          '</div>' +
        '</div>';
    }
`;

// Read the base index.html
let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// 1. Add html2pdf library to head if not present
if (!html.includes('html2pdf.bundle.min.js')) {
  html = html.replace(
    '<script src="https://unpkg.com/lucide@latest"></script>',
    '<script src="https://unpkg.com/lucide@latest"></script>\n  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>'
  );
  console.log('1. Added html2pdf.js to head');
}

// 2. Add print CSS if not present
if (!html.includes('body.printing-catalog')) {
  const oldPrint = `@media print {
      body * { visibility: hidden; }
      #printQuotationArea, #printQuotationArea * { visibility: visible; }
      #printQuotationArea { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 15px; background: white; }
      .no-print { display: none !important; }
      @page { size: A4; margin: 12mm; }
    }`;

  const newPrint = `@media print {
      body * { visibility: hidden !important; }
      
      /* In Báo Giá Khách Hàng (A4 Dọc) */
      body.printing-quotation #printQuotationArea,
      body.printing-quotation #printQuotationArea * {
        visibility: visible !important;
      }
      body.printing-quotation #printQuotationArea {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 10mm !important;
        background: white !important;
      }

      /* In Bảng Phân Loại Giá 65 Model (A4 Ngang) */
      body.printing-catalog #printCatalogPdfContent,
      body.printing-catalog #printCatalogPdfContent * {
        visibility: visible !important;
      }
      body.printing-catalog #printCatalogPdfContent {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 4mm !important;
        background: white !important;
        box-shadow: none !important;
        border: none !important;
      }

      .no-print { display: none !important; }
      
      tr {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }
      thead {
        display: table-header-group !important;
      }
      tfoot {
        display: table-footer-group !important;
      }
    }

    /* PDF Table Tweaks */
    .pdf-table th, .pdf-table td {
      border: 1px solid #cbd5e1 !important;
    }
    .pdf-brand-row td {
      background-color: #0f172a !important;
      color: #ffffff !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .pdf-category-row td {
      background-color: #d97706 !important;
      color: #ffffff !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }`;

  html = html.replace(oldPrint, newPrint);
  console.log('2. Updated print CSS');
}

// 3. Add PDF button in Sidebar Nav
if (!html.includes('Xuất File PDF (65 Mã)</span>')) {
  const sidebarTarget = `<button onclick="navigateTab('products')" id="nav-products" class="nav-item w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition">
          <i data-lucide="package" class="w-4 h-4 text-emerald-400"></i>
          <span class="flex-1 text-left">Bảng Giá Online (65 Mã)</span>
          <span id="badgeProductCount" class="text-[10px] bg-slate-800 text-sky-300 px-2 py-0.5 rounded-full font-bold">65</span>
        </button>`;

  const sidebarReplacement = `<button onclick="navigateTab('products')" id="nav-products" class="nav-item w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition">
          <i data-lucide="package" class="w-4 h-4 text-emerald-400"></i>
          <span class="flex-1 text-left">Bảng Giá Online (65 Mã)</span>
          <span id="badgeProductCount" class="text-[10px] bg-slate-800 text-sky-300 px-2 py-0.5 rounded-full font-bold">65</span>
        </button>

        <button onclick="openCatalogPdfModal()" class="nav-item w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-rose-300 hover:bg-rose-950/60 hover:text-white transition">
          <i data-lucide="file-down" class="w-4 h-4 text-rose-400"></i>
          <span class="flex-1 text-left">Xuất File PDF (65 Mã)</span>
          <span class="text-[9px] bg-rose-900/80 text-rose-200 border border-rose-700 px-1.5 py-0.5 rounded font-bold">PDF</span>
        </button>`;

  html = html.replace(sidebarTarget, sidebarReplacement);
  console.log('3. Added PDF button to Sidebar');
}

// 4. Add PDF button in Top Header
if (!html.includes('title="Xuất toàn bộ bảng giá 65 mã kèm hình ảnh ra file PDF"')) {
  const headerTarget = `<div class="flex items-center space-x-3 ml-4">
          <a href="bang_gia_so_sanh_gia_nhap_cu_moi.xlsx" download class="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 rounded-lg text-xs font-bold transition">
            <i data-lucide="file-spreadsheet" class="w-3.5 h-3.5"></i>
            <span>Tải Excel Bảng Phân Loại Giá Online (65 Mã)</span>
          </a>`;

  const headerReplacement = `<div class="flex items-center space-x-3 ml-4">
          <button onclick="openCatalogPdfModal()" class="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-100 rounded-lg text-xs font-bold transition shadow-sm" title="Xuất toàn bộ bảng giá 65 mã kèm hình ảnh ra file PDF">
            <i data-lucide="file-down" class="w-3.5 h-3.5 text-rose-600"></i>
            <span>Xuất File PDF (65 Mã)</span>
          </button>

          <a href="bang_gia_so_sanh_gia_nhap_cu_moi.xlsx" download class="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 rounded-lg text-xs font-bold transition">
            <i data-lucide="file-spreadsheet" class="w-3.5 h-3.5"></i>
            <span>Tải Excel (65 Mã)</span>
          </a>`;

  html = html.replace(headerTarget, headerReplacement);
  console.log('4. Added PDF button to Top Header');
}

// 5. Add PDF button in Tab 1 Dashboard Header
if (!html.includes('Xuất PDF Bảng Giá</button>')) {
  const dashTarget = `<div class="flex items-center gap-2">
              <button onclick="navigateTab('products')" class="px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5">
                <i data-lucide="package" class="w-3.5 h-3.5"></i> Xem Bảng Giá 65 Mã
              </button>`;

  const dashReplacement = `<div class="flex items-center gap-2">
              <button onclick="openCatalogPdfModal()" class="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5">
                <i data-lucide="file-down" class="w-3.5 h-3.5"></i> Xuất PDF Bảng Giá
              </button>
              <button onclick="navigateTab('products')" class="px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5">
                <i data-lucide="package" class="w-3.5 h-3.5"></i> Xem Bảng Giá 65 Mã
              </button>`;

  html = html.replace(dashTarget, dashReplacement);
  console.log('5. Added PDF button to Dashboard');
}

// 6. Add PDF button in Tab 2 Products Header
if (!html.includes('Xuất File PDF (Chuẩn Mẫu & Ảnh)</span>')) {
  const prodTarget = `<div class="flex items-center gap-2">
              <a href="bang_gia_so_sanh_gia_nhap_cu_moi.xlsx" download class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5">
                <i data-lucide="file-spreadsheet" class="w-3.5 h-3.5"></i> Tải Excel Bảng Phân Loại Giá (65 Mã)
              </a>
            </div>`;

  const prodReplacement = `<div class="flex items-center gap-2">
              <button onclick="openCatalogPdfModal()" class="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5 transition" title="Xuất toàn bộ bảng phân loại giá ra file PDF giữ nguyên form mẫu và hình ảnh">
                <i data-lucide="file-down" class="w-4 h-4"></i>
                <span>Xuất File PDF (Chuẩn Mẫu & Ảnh)</span>
              </button>
              <a href="bang_gia_so_sanh_gia_nhap_cu_moi.xlsx" download class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5">
                <i data-lucide="file-spreadsheet" class="w-3.5 h-3.5"></i> Tải Excel Bảng Phân Loại Giá (65 Mã)
              </a>
            </div>`;

  html = html.replace(prodTarget, prodReplacement);
  console.log('6. Added PDF button to Tab 2 Products Header');
}

// 7. Update window.print() in quotation modal
html = html.replace('onclick="window.print()" class="px-3 py-1.5 bg-sky-600', 'onclick="printQuotation()" class="px-3 py-1.5 bg-sky-600');

// 8. Inject #catalogPdfModal HTML
if (!html.includes('id="catalogPdfModal"')) {
  const modalTarget = `      <div class="p-3 bg-slate-100 border-t border-slate-200 flex justify-end no-print">
        <button onclick="closeQuotationPreviewModal()" class="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold text-xs">Đóng Cửa Sổ</button>
      </div>
    </div>
  </div>`;

  html = html.replace(modalTarget, modalTarget + '\n' + catalogPdfModalHtml);
  console.log('7. Injected #catalogPdfModal with pre-rendered table');
}

// 9. Inject Client-side JS Functions
if (!html.includes('function openCatalogPdfModal()')) {
  const jsTarget = `    function closeQuotationPreviewModal() {
      document.getElementById('quotationPreviewModal').classList.add('hidden');
    }`;

  html = html.replace(jsTarget, jsTarget + '\n' + clientPdfJsFunctions);
  console.log('8. Injected client-side PDF functions');
}

fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
console.log('SUCCESS: index.html updated with complete PDF export feature!');
