const fs = require('fs');
const path = require('path');

const rawText = `PHẦN I – LOCK&KING									
CHẢO									
STT	Model	Hình ảnh	Tên sản phẩm	Giá NPP Online	Giá Facebook	Giá sàn TMĐT	Giá niêm yết	Lợi nhuận NPP	% LN NPP / Facebook
1	LK-2202A		chảo cạn Titan vàng 22*5,5cm (2,2 mm) LK-2202A	265,000 đ	466,960 đ	513,656 đ	607,048 đ	201,960 đ	43.2%
2	LK-2404S		Chảo sâu Titan vàng 24*8,5cm (2,3 mm) LK-2404S	360,000 đ	649,000 đ	700,920 đ	843,700 đ	289,000 đ	44.5%
3	LK-2433		Chảo Belly Lock&King	395,000 đ	750,000 đ	788,000 đ	790,000 đ	355,000 đ	47.3%
4	LK-2466S		Chảo Titanium  ELITE Lock&King	390,000 đ	690,000 đ	725,000 đ	990,000 đ	300,000 đ	43.5%
5	LK-2606A		Chảo cạn Titanium Lock&king 26cm	320,000 đ	590,000 đ	637,200 đ	767,000 đ	270,000 đ	45.8%
6	LK-2633		Chảo Belly Lock&King Titanium 26cm	450,000 đ	950,000 đ	961,200 đ	1,200,000 đ	500,000 đ	52.6%
7	LK-2808		Chảo cạn Titan vàng 28*7cm (2,3 mm)	351,000 đ	630,000 đ	680,400 đ	819,000 đ	279,000 đ	44.3%
8	LK-2808S(VK)		Chảo sâu vung kính Titanium Lock&king 28cm	370,000 đ	642,000 đ	675,000 đ	844,000 đ	272,000 đ	42.4%
9	LK-2808SA		Chảo sâu Titan vàng 28*9cm (2,3 mm) LK-2808SA	431,000 đ	760,000 đ	820,800 đ	988,000 đ	329,000 đ	43.3%
10	LK-2808SA KHÔNG NẮP		Chảo sâu Titan vàng 28*9cm (2,3 mm) LK-2808SA KHÔNG NẮP	412,000 đ	740,000 đ	799,200 đ	962,000 đ	328,000 đ	44.3%
11	LK-3003		Chảo cạn titanium Lock&King 30cm	375,000 đ	750,000 đ	788,000 đ	825,000 đ	375,000 đ	50.0%
12	LK-3212		Chảo xào lớn	645,000 đ	1,290,000 đ	1,380,300 đ	1,548,000 đ	645,000 đ	50.0%
									
NỒI & BỘ NỒI									
STT	Model	Hình ảnh	Tên sản phẩm	Giá NPP Online	Giá Facebook	Giá sàn TMĐT	Giá niêm yết	Lợi nhuận NPP	% LN NPP / Facebook
13	LK-30NC1		Nồi luộc gà Lock&King size 30	414,000 đ	750,000 đ	810,000 đ	975,000 đ	336,000 đ	44.8%
14	LK-32NC1		Nồi luộc gà Lock&King size 32	470,000 đ	830,000 đ	896,400 đ	1,079,000 đ	360,000 đ	43.4%
15	LK-336A		Bộ nồi 3 Lock&King ( 18,20,24 )	540,000 đ	990,000 đ	1,069,200 đ	1,287,000 đ	450,000 đ	45.5%
16	LK-3018A		Nồi lẻ Lock&king 18	170,000 đ	295,000 đ	324,500 đ	383,500 đ	125,000 đ	42.4%
17	LK-3020A		Nồi lẻ Lock&king 20	185,000 đ	315,000 đ	346,500 đ	409,500 đ	130,000 đ	41.3%
18	LK-3024		Nồi lẻ Lock&king 24	230,000 đ	395,000 đ	434,500 đ	513,500 đ	165,000 đ	41.8%
19	LK-3116		16*9CM Quánh liền khối titan (2.2mm) LK-3116	325,000 đ	689,000 đ	744,120 đ	895,700 đ	364,000 đ	52.8%
20	LK-3118		18*10CM Nồi lẻ kèm nắp (2.3mm) LK-3118	340,000 đ	779,000 đ	841,320 đ	1,012,700 đ	439,000 đ	56.4%
21	LK-3120		20*12CM Nồi lẻ kèm nắp (2.3mm) LK-3120	390,000 đ	889,000 đ	960,120 đ	1,155,700 đ	499,000 đ	56.1%
22	LK-3124		24*14CM Nồi lẻ kèm nắp (2.3mm) LK-3124	460,000 đ	1,049,000 đ	1,122,430 đ	1,258,800 đ	589,000 đ	56.1%
23	LK-3338		18+20+24CM Bộ nồi 3 liền khối kèm nắp (2.3mm) LK-3338	1,100,000 đ	2,090,000 đ	2,780,930 đ	3,118,800 đ	990,000 đ	47.4%
24	LK-3386A		Bộ nồi 3 Inox 5 đáy Lock&king (18.20.24) (1t/4c)	550,000 đ	990,000 đ	1,069,200 đ	1,287,000 đ	440,000 đ	44.4%
25	LK-3568A		Bộ nồi 5 Inox 5 đáy Lock&king (Q16.18.20.24.C24) (1t/2c)	960,000 đ	1,690,000 đ	1,808,300 đ	2,028,000 đ	730,000 đ	43.2%
									
NỒI TĂNG ÁP									
STT	Model	Hình ảnh	Tên sản phẩm	Giá NPP Online	Giá Facebook	Giá sàn TMĐT	Giá niêm yết	Lợi nhuận NPP	% LN NPP / Facebook
26	LK-3122		22*13.5CM Nồi áp suất kèm xửng hấp đa năng (1.8mm) LK-3122	470,000 đ	820,000 đ	885,600 đ	1,066,000 đ	350,000 đ	42.7%
27	LK-3126		26*14CM Nồi áp suất kèm xửng hấp đa năng (1.8mm) LK-3126	535,000 đ	990,000 đ	1,069,200 đ	1,287,000 đ	455,000 đ	46.0%
									
ẤM & BÌNH									
STT	Model	Hình ảnh	Tên sản phẩm	Giá NPP Online	Giá Facebook	Giá sàn TMĐT	Giá niêm yết	Lợi nhuận NPP	% LN NPP / Facebook
28	LK-1035		Ấm đun nước LK-1035	275,000 đ	549,000 đ	592,920 đ	713,700 đ	274,000 đ	49.9%
29	LK-1038		Ấm đun nước LK-1038	300,000 đ	525,000 đ	567,000 đ	682,500 đ	225,000 đ	42.9%
									
ĐỒ ĐIỆN									
STT	Model	Hình ảnh	Tên sản phẩm	Giá NPP Online	Giá Facebook	Giá sàn TMĐT	Giá niêm yết	Lợi nhuận NPP	% LN NPP / Facebook
30	LK-92		Nồi chiên không dầu Lock&king	835,000 đ	1,590,000 đ	1,701,300 đ	1,908,000 đ	755,000 đ	47.5%
31	LK-586		Sưởi gốm thấp	430,000 đ	745,000 đ	804,600 đ	968,500 đ	315,000 đ	42.3%
32	LK-588		Sưởi gốm thân cao	585,000 đ	1,050,000 đ	1,123,500 đ	1,260,000 đ	465,000 đ	44.3%
33	LK-668		Tủ sấy quần áo cao cấp Lock&king 1500W	460,000 đ	920,000 đ	993,600 đ	1,196,000 đ	460,000 đ	50.0%
34	LK-688		Tủ sấy quần áo cao cấp Lock&king 2400W	850,000 đ	1,690,000 đ	1,808,300 đ	2,028,000 đ	840,000 đ	49.7%
35	LK-1003		Bộ đèn sưởi 3 bóng Lock&King	197,000 đ	354,000 đ	389,400 đ	460,200 đ	157,000 đ	44.4%
36	LK-1030		Bình thủy điện 3L Lock&King (4c/t)	1,020,000 đ	1,890,000 đ	1,984,500 đ	2,063,000 đ	870,000 đ	46.0%
37	LK-1033		Bộ đèn sưởi 3 bóng Lock&King	372,000 đ	669,600 đ	723,168 đ	870,480 đ	297,600 đ	44.4%
38	LK-1050		Bình Thủy Điện Lock&King LK-1050	780,000 đ	1,495,000 đ	1,915,300 đ	2,148,000 đ	715,000 đ	47.8%
39	LK-1068		Ấm siêu tốc LK-1068	310,000 đ	599,000 đ	646,920 đ	778,700 đ	289,000 đ	48.2%
40	LK-4026A		Nồi Nấu Chậm Lock&King LK-4026A	440,000 đ	850,000 đ	918,000 đ	1,105,000 đ	410,000 đ	48.2%
41	LK-4160		Nồi áp suất điện Lock&King LK-4160	1,000,000 đ	2,350,000 đ	2,514,500 đ	2,820,000 đ	1,350,000 đ	57.4%
42	LK-4161		Nồi áp suất điện Lock&King LK-4161	800,000 đ	1,650,000 đ	1,765,500 đ	1,980,000 đ	850,000 đ	51.5%
43	LK-4208A		Nồi Nấu Chậm Lock&King LK-4208A	510,000 đ	950,000 đ	1,026,000 đ	1,235,000 đ	440,000 đ	46.3%
44	LK-4209		Nồi Nấu Chậm Lock&King LK-4209	510,000 đ	950,000 đ	1,026,000 đ	1,235,000 đ	440,000 đ	46.3%
45	LK-5301		Sưởi để bàn	600,000 đ	1,190,000 đ	1,273,300 đ	1,428,000 đ	590,000 đ	49.6%
46	LK-6015		Nồi Nấu Đa Năng Lock&King	260,000 đ	490,000 đ	539,000 đ	637,000 đ	230,000 đ	46.9%
47	LK-6201		Nồi nấu lẩu đi kèm xửng hấp	685,000 đ	1,290,000 đ	1,380,300 đ	1,548,000 đ	605,000 đ	46.9%
48	LK-7812		Máy làm sữa hạt Lock&King	660,000 đ	1,190,000 đ	1,444,500 đ	1,620,000 đ	530,000 đ	44.5%
49	LK-9014		Nồi chiên không dầu Lock&king	1,130,000 đ	2,190,000 đ	2,343,300 đ	2,628,000 đ	1,060,000 đ	48.4%
									
PHẦN II – TAKIN									
CHẢO									
STT	Model	Hình ảnh	Tên sản phẩm	Giá NPP Online	Giá Facebook	Giá sàn TMĐT	Giá niêm yết	Lợi nhuận NPP	% LN NPP / Facebook
50	TK-2201		chảo cạn Titan vàng 22*5,5cm (2,2 mm) TK-2201	265,000 đ	466,960 đ	491,000 đ	607,048 đ	201,960 đ	43.2%
51	TK-2662		26*6.5CM Chảo cạn titan-TK-2662 (2.2mm)	320,000 đ	590,000 đ	620,000 đ	767,000 đ	270,000 đ	45.8%
52	TK-2882C		Chảo cạn Titan vàng 28*7cm (2,3 mm)	351,000 đ	630,000 đ	662,000 đ	819,000 đ	279,000 đ	44.3%
53	TK-3030C		Chảo cạn Titan vàng 30*7cm (2,3 mm)	375,000 đ	750,000 đ	788,000 đ	825,000 đ	375,000 đ	50.0%
									
NỒI & BỘ NỒI									
STT	Model	Hình ảnh	Tên sản phẩm	Giá NPP Online	Giá Facebook	Giá sàn TMĐT	Giá niêm yết	Lợi nhuận NPP	% LN NPP / Facebook
54	TK-036A		Bộ nồi Takin 3 món 5 đáy inox cao cấp	495,000 đ	891,000 đ	936,000 đ	1,158,300 đ	396,000 đ	44.4%
55	TK-0318A		Nồi táo inox cao cấp size18	185,000 đ	333,000 đ	350,000 đ	432,900 đ	148,000 đ	44.4%
56	TK-0320		Nồi táo inox cao cấp size20	205,000 đ	369,000 đ	388,000 đ	479,700 đ	164,000 đ	44.4%
57	TK-0324		Nồi táo inox cao cấp size24	245,000 đ	441,000 đ	464,000 đ	573,300 đ	196,000 đ	44.4%
58	TK-0348A		Bộ nồi Táo Takin 3 món inox cao cấp	580,000 đ	1,044,000 đ	1,097,000 đ	1,252,800 đ	464,000 đ	44.4%
59	TK-0369		Bộ nồi Takin 3 món 5 đáy inox cao cấp	535,000 đ	969,000 đ	1,018,000 đ	1,259,700 đ	434,000 đ	44.8%
60	TK-0488		Bộ nồi Takin 4 món 5 đáy inox cao cấp	810,000 đ	1,469,000 đ	1,543,000 đ	1,762,800 đ	659,000 đ	44.9%
									
NỒI TĂNG ÁP									
STT	Model	Hình ảnh	Tên sản phẩm	Giá NPP Online	Giá Facebook	Giá sàn TMĐT	Giá niêm yết	Lợi nhuận NPP	% LN NPP / Facebook
61	TK-0126		26*14CM Nồi áp suất kèm xửng hấp đa năng (1.8mm) TK 0126	560,000 đ	1,179,000 đ	1,238,000 đ	1,414,800 đ	619,000 đ	52.5%
									
ĐỒ ĐIỆN									
STT	Model	Hình ảnh	Tên sản phẩm	Giá NPP Online	Giá Facebook	Giá sàn TMĐT	Giá niêm yết	Lợi nhuận NPP	% LN NPP / Facebook
62	TK-468		Sưởi gốm thấp	452,000 đ	900,000 đ	945,000 đ	1,170,000 đ	448,000 đ	49.8%
63	TK-469		Sưởi gốm thân cao	615,000 đ	1,050,000 đ	1,103,000 đ	1,260,000 đ	435,000 đ	41.4%
64	TK-1002		Bộ đèn sưởi 2 bóng Takin	158,000 đ	270,000 đ	284,000 đ	351,000 đ	112,000 đ	41.5%
65	TK-1003		Bộ đèn sưởi 3 bóng Takin	194,000 đ	330,000 đ	347,000 đ	429,000 đ	136,000 đ	41.2%`;

function cleanPrice(str) {
  if (!str) return 0;
  return parseFloat(str.replace(/[^\d]/g, '')) || 0;
}

// Load existing catalog v4 for specs and import prices
const oldCatalog = JSON.parse(fs.readFileSync(path.join(__dirname, 'real_catalog_v4.json'), 'utf-8'));
const oldMap = new Map();
oldCatalog.forEach(p => {
  oldMap.set(p.canonicalCode.toUpperCase(), p);
});

let currentBrand = 'Lock&King';
let currentCategory = 'CHẢO';

const lines = rawText.split('\n').map(l => l.trim()).filter(l => l);
const newCatalog = [];

lines.forEach(line => {
  if (line.includes('PHẦN I – LOCK&KING') || line.includes('PHẦN I')) {
    currentBrand = 'Lock&King';
    return;
  }
  if (line.includes('PHẦN II – TAKIN') || line.includes('PHẦN II')) {
    currentBrand = 'Takin';
    return;
  }
  if (line === 'CHẢO' || line === 'NỒI & BỘ NỒI' || line === 'NỒI TĂNG ÁP' || line === 'ẤM & BÌNH' || line === 'ĐỒ ĐIỆN') {
    currentCategory = line;
    return;
  }
  if (line.startsWith('STT') || line.includes('BẢNG PHÂN LOẠI') || line.includes('phía trên') || line.includes('65 mã')) {
    return;
  }

  const parts = line.split('\t').map(p => p.trim());
  if (parts.length >= 7) {
    const stt = parseInt(parts[0]);
    if (isNaN(stt)) return;

    const model = parts[1];
    // parts[2] is image
    const name = parts[3];
    const nppOnlinePrice = cleanPrice(parts[4]);
    const facebookPrice = cleanPrice(parts[5]);
    const tmdtPrice = cleanPrice(parts[6]);
    const retailPrice = cleanPrice(parts[7]);
    const profitNPP = cleanPrice(parts[8]) || (facebookPrice - nppOnlinePrice);
    const profitPct = parts[9] ? parts[9].replace(/đ/g, '').trim() : (((facebookPrice - nppOnlinePrice) / facebookPrice) * 100).toFixed(1) + '%';

    // Find old record for specs, import prices, offline prices
    const existing = oldMap.get(model.toUpperCase()) || {};

    const nppOfflinePrice = existing.nppOfflinePrice || nppOnlinePrice;
    const diffOnlineOffline = nppOfflinePrice - nppOnlinePrice;
    const diffOnlineOfflinePct = nppOnlinePrice > 0 ? ((diffOnlineOffline / nppOnlinePrice) * 100).toFixed(1) + '%' : '0%';

    const dealerOfflinePrice = Math.round(nppOfflinePrice * 1.2);
    const dealerProfit = facebookPrice - dealerOfflinePrice;
    const dealerProfitRatio = facebookPrice > 0 ? ((dealerProfit / facebookPrice) * 100).toFixed(1) + '%' : '0%';

    newCatalog.push({
      stt,
      canonicalCode: model,
      name,
      brand: currentBrand,
      categoryName: currentCategory,
      unit: existing.unit || 'Cái',
      nppOnlinePrice,
      facebookPrice,
      tmdtPrice,
      retailPrice,
      profitNPP,
      profitPct,
      nppOnlineProfitRatio: profitPct,
      nppOfflinePrice,
      diffOnlineOffline,
      diffOnlineOfflinePct,
      dealerOfflinePrice,
      dealerProfitRatio,
      oldImportPrice: existing.oldImportPrice || existing.importPrice || 0,
      newImportPrice: existing.newImportPrice || existing.importPrice || 0,
      importPriceDiff: existing.importPriceDiff || 0,
      importPriceDiffPct: existing.importPriceDiffPct || '0',
      specs: existing.specs || 'Thông số tiêu chuẩn chính hãng',
      status: 'ACTIVE',
      updatedAt: '2026-09-05T12:15:00Z'
    });
  }
});

console.log('Parsed successfully:', newCatalog.length, 'products!');
console.log('Lock&King count:', newCatalog.filter(p => p.brand === 'Lock&King').length);
console.log('Takin count:', newCatalog.filter(p => p.brand === 'Takin').length);
console.log('Categories:', [...new Set(newCatalog.map(p => p.categoryName))]);

fs.writeFileSync(path.join(__dirname, 'real_catalog_v5_online.json'), JSON.stringify(newCatalog, null, 2), 'utf-8');
