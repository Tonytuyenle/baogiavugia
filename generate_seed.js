const fs = require('fs');
const path = require('path');

const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, 'real_catalog.json'), 'utf-8'));

// Build categories
const categories = [
  { id: 'cat-chao', code: 'CHAO', name: 'Chảo & Chảo Sâu' },
  { id: 'cat-noi', code: 'NOI-BO-NOI', name: 'Nồi & Bộ Nồi Inox' },
  { id: 'cat-ap-suat', code: 'NOI-TANG-AP', name: 'Nồi Áp Suất & Tăng Áp' },
  { id: 'cat-am-binh', code: 'AM-BINH', name: 'Ấm Đun & Bình Thủy' },
  { id: 'cat-dien', code: 'DO-DIEN', name: 'Đồ Điện Gia Dụng & Sưởi' }
];

// Map category name to categoryId
function getCatId(catName) {
  if (catName.includes('CHẢO')) return 'cat-chao';
  if (catName.includes('TĂNG ÁP')) return 'cat-ap-suat';
  if (catName.includes('NỒI')) return 'cat-noi';
  if (catName.includes('ẤM')) return 'cat-am-binh';
  if (catName.includes('ĐỒ ĐIỆN')) return 'cat-dien';
  return 'cat-chao';
}

const formattedProducts = catalog.map((p, idx) => {
  return {
    id: 'p-' + p.stt,
    stt: p.stt,
    canonicalCode: p.canonicalCode,
    name: p.name,
    brand: p.brand,
    categoryId: getCatId(p.categoryName),
    categoryName: p.categoryName,
    unit: p.unit,
    // REAL PRICES FROM LOCK&KING OFFICIAL SHEET
    nppOnlinePrice: p.nppOnlinePrice, // Giá NPP Online (vốn NPP)
    facebookPrice: p.facebookPrice,     // Giá bán lẻ Facebook
    tmdtPrice: p.tmdtPrice,             // Giá sàn TMĐT (Shopee/Lazada/TikTok)
    retailPrice: p.retailPrice,         // Giá niêm yết
    profitNPP: p.profitNPP,             // Lợi nhuận NPP
    profitPct: p.profitPct,             // % LN NPP / Facebook
    // Backwards compatibility mappings for older fields
    dealerPrice: p.facebookPrice,
    distributorPrice: p.nppOnlinePrice,
    costPrice: p.nppOnlinePrice,
    status: 'ACTIVE',
    updatedAt: '2026-09-05T08:00:00Z',
    updatedBy: 'admin'
  };
});

// Build 10 real aliases
const aliases = [
  { id: 'al-1', aliasCode: 'LK-30NC', targetCode: 'LK-30NC1', aliasType: 'OLD_CODE', notes: 'Mã nồi luộc gà cũ chuyển sang bản chuẩn LK-30NC1' },
  { id: 'al-2', aliasCode: 'LK-32NC', targetCode: 'LK-32NC1', aliasType: 'OLD_CODE', notes: 'Mã nồi luộc gà 32 cũ chuyển sang LK-32NC1' },
  { id: 'al-3', aliasCode: 'LK-3020', targetCode: 'LK-3020A', aliasType: 'OLD_CODE', notes: 'Mã nồi lẻ 20 cũ chuyển sang LK-3020A' },
  { id: 'al-4', aliasCode: 'LK-3018', targetCode: 'LK-3018A', aliasType: 'OLD_CODE', notes: 'Mã nồi lẻ 18 cũ chuyển sang LK-3018A' },
  { id: 'al-5', aliasCode: 'LK-2606', targetCode: 'LK-2606A', aliasType: 'OLD_CODE', notes: 'Mã chảo cạn cũ chuyển sang LK-2606A' },
  { id: 'al-6', aliasCode: 'LK-2202', targetCode: 'LK-2202A', aliasType: 'OLD_CODE', notes: 'Mã chảo Titan vàng 22 cũ sang LK-2202A' },
  { id: 'al-7', aliasCode: 'LK3003', targetCode: 'LK-3003', aliasType: 'TYPO_COMMON', notes: 'Lỗi gõ thiếu gạch nối mã chảo cạn titanium 30cm' },
  { id: 'al-8', aliasCode: 'LK-2808S', targetCode: 'LK-2808S(VK)', aliasType: 'OLD_CODE', notes: 'Mã chảo sâu vung kính 28cm' },
  { id: 'al-9', aliasCode: 'TK-0318', targetCode: 'TK-0318A', aliasType: 'OLD_CODE', notes: 'Mã nồi táo Takin 18 cũ sang TK-0318A' },
  { id: 'al-10', aliasCode: 'TK-0348', targetCode: 'TK-0348A', aliasType: 'OLD_CODE', notes: 'Mã bộ nồi Táo Takin 3 món cũ sang TK-0348A' }
];

fs.writeFileSync(path.join(__dirname, 'seed_data.json'), JSON.stringify({ categories, products: formattedProducts, aliases }, null, 2), 'utf-8');
console.log('Seed data generated successfully!');
