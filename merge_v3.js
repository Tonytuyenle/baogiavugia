const fs = require('fs');
const path = require('path');

const rawNewData = `STT	Model	Tên sản phẩm	Giá nhập	Giá NPP Online	Giá NPP Offline	Giá Facebook
1	LK-30NC1	Nồi luộc gà Lock&King size 30	321,000 đ	414,000 đ	414,000 đ	750,000 đ
2	LK-32NC1	Nồi luộc gà Lock&King size 32	406,600 đ	470,000 đ	470,000 đ	830,000 đ
3	LK-336A	Bộ nồi 3 Lock&King ( 18,20,24 )	411,695 đ	540,000 đ	540,000 đ	990,000 đ
4	LK-3018	Nồi lẻ Lock&king 18	133,495 đ	170,000 đ	170,000 đ	295,000 đ
5	LK-3020	Nồi lẻ Lock&king 20	149,800 đ	185,000 đ	185,000 đ	315,000 đ
6	LK-3024	Nồi lẻ Lock&king 24	187,505 đ	230,000 đ	230,000 đ	395,000 đ
7	LK-92	Nồi chiên không dầu Lock&king	727,600 đ	835,000 đ	835,000 đ	1,590,000 đ
8	LK-9014	Nồi chiên không dầu Lock&king	936,250 đ	1,130,000 đ	1,130,000 đ	2,190,000 đ
9	LK-1068	Ấm siêu tốc LK-1068	256,800 đ	310,000 đ	340,000 đ	550,000 đ
10	LK-1035	Ấm đun nước LK-1035	217,057 đ	275,000 đ	275,000 đ	549,000 đ
11	LK-1038	Ấm đun nước LK-1038	235,094 đ	300,000 đ	300,000 đ	525,000 đ
12	LK-2808SA	Chảo sâu Titan vàng 28*9cm (2,3 mm) LK-2808SA	319,135 đ	431,000 đ	431,000 đ	760,000 đ
13	LK-2808SA KHÔNG NẮP	Chảo sâu Titan vàng 28*9cm (2,3 mm) LK-2808SA không nắp	300,792 đ	412,000 đ	412,000 đ	740,000 đ
14	LK-2202A	chảo cạn Titan vàng 22*5,5cm (2,2 mm) LK-2202A	193,466 đ	265,000 đ	265,000 đ	466,960 đ
15	LK-2404S	Chảo sâu Titan vàng 24*8,5cm (2,3 mm) LK-2404S	251,705 đ	360,000 đ	360,000 đ	649,000 đ
16	LK-2808	Chảo cạn Titan vàng 28*7cm (2,3 mm)	254,000 đ	351,000 đ	351,000 đ	630,000 đ
17	LK-3212	Chảo xào lớn	476,000 đ	645,000 đ	645,000 đ	1,290,000 đ
18	LK-1003	Bộ đèn sưởi 3 bóng Lock&King	167,990 đ	197,000 đ	197,000 đ	354,000 đ
19	LK-1033	Bộ đèn sưởi 3 bóng Lock&King	306,020 đ	372,000 đ	372,000 đ	669,600 đ
20	LK-588	Sưởi gốm thân cao	468,762 đ	585,000 đ	585,000 đ	1,050,000 đ
21	LK-586	Sưởi gốm thấp	366,857 đ	430,000 đ	430,000 đ	745,000 đ
22	LK-5301	Sưởi để bàn	468,762 đ	600,000 đ	600,000 đ	1,190,000 đ
23	LK-4208A	Nồi Nấu Chậm Lock&King LK-4208A	405,581 đ	510,000 đ	510,000 đ	950,000 đ
24	LK-4026A	Nồi Nấu Chậm Lock&King LK-4026A	356,667 đ	440,000 đ	440,000 đ	850,000 đ
25	LK-4209	Nồi Nấu Chậm Lock&King LK-4209	387,583 đ	510,000 đ	510,000 đ	950,000 đ
26	LK-688	Tủ sấy quần áo cao cấp Lock&king 2400W	727,600 đ	850,000 đ	850,000 đ	1,690,000 đ
27	LK-668	Tủ sấy quần áo cao cấp Lock&king 1500W	395,900 đ	460,000 đ	460,000 đ	920,000 đ
28	LK-3116	16*9CM Quánh liền khối titan (2.2mm) LK-3116	242,533 đ	325,000 đ	325,000 đ	689,000 đ
29	LK-3338	18+20+24CM Bộ nồi 3 liền khối kèm nắp (2.3mm) LK-3338	923,257 đ	1,100,000 đ	1,240,000 đ	2,090,000 đ
30	LK-3118	18*10CM Nồi lẻ kèm nắp (2.3mm) LK-3118	277,181 đ	340,000 đ	372,000 đ	650,000 đ
31	LK-3120	20*12CM Nồi lẻ kèm nắp (2.3mm) LK-3120	310,810 đ	390,000 đ	420,000 đ	740,000 đ
32	LK-3124	24*14CM Nồi lẻ kèm nắp (2.3mm) LK-3124	371,952 đ	460,000 đ	500,000 đ	880,000 đ
33	LK-3126	26*14CM Nồi áp suất kèm xửng hấp đa năng (1.8mm) LK-3126	406,600 đ	535,000 đ	535,000 đ	990,000 đ
34	LK-3122	22*13.5CM Nồi áp suất kèm xửng hấp đa năng (1.8mm) LK-3122	368,000 đ	470,000 đ	470,000 đ	820,000 đ
35	LK-6201	Nồi nấu lẩu đi kèm xửng hấp	536,019 đ	685,000 đ	685,000 đ	1,290,000 đ
36	LK-4160	Nồi áp suất điện Lock&King LK-4160	828,486 đ	1,000,000 đ	1,080,000 đ	1,880,000 đ
37	LK-4161	Nồi áp suất điện Lock&King LK-4161	672,571 đ	800,000 đ	850,000 đ	1,490,000 đ
38	LK-1050	Bình Thủy Điện Lock&King LK-1050	659,323 đ	780,000 đ	890,000 đ	1,495,000 đ
39	LK-6015	Nồi Nấu Đa Năng Lock&King	200,752 đ	260,000 đ	260,000 đ	490,000 đ
40	LK-7812	Máy làm sữa hạt Lock&King	540,095 đ	660,000 đ	710,000 đ	1,190,000 đ
41	TK-036	Bộ nồi Takin 3 món 5 đáy inox cao cấp	440,229 đ	495,000 đ	495,000 đ	891,000 đ
42	TK-0348	Bộ nồi Táo Takin 3 món inox cao cấp	474,876 đ	580,000 đ	580,000 đ	1,044,000 đ
43	TK-0318	Nồi táo inox cao cấp size18	134,514 đ	185,000 đ	185,000 đ	333,000 đ
44	TK-0320	Nồi táo inox cao cấp size20	149,800 đ	205,000 đ	205,000 đ	369,000 đ
45	TK-0324	Nồi táo inox cao cấp size24	188,524 đ	245,000 đ	245,000 đ	441,000 đ
46	TK-0369	Bộ nồi Takin 3 món 5 đáy inox cao cấp	419,848 đ	535,000 đ	535,000 đ	969,000 đ
47	TK-0488	Bộ nồi Takin 4 món 5 đáy inox cao cấp	672,571 đ	810,000 đ	810,000 đ	1,469,000 đ
48	TK-2882C	Chảo cạn Titan vàng 28*7cm (2,3 mm)	260,876 đ	351,000 đ	351,000 đ	630,000 đ
49	TK-3030C	Chảo cạn Titan vàng 30*7cm (2,3 mm)	281,257 đ	375,000 đ	375,000 đ	750,000 đ
50	TK-2662	26*6.5CM Chảo cạn titan-TK-2662 (2.2mm)	224,425 đ	320,000 đ	320,000 đ	590,000 đ
51	TK-0126	26*14CM Nồi áp suất kèm xửng hấp đa năng (1.8mm) TK 0126	417,810 đ	560,000 đ	560,000 đ	1,179,000 đ
52	TK-2201	chảo cạn Titan vàng 22*5,5cm (2,2 mm) TK-2201	193,466 đ	265,000 đ	265,000 đ	466,960 đ
53	TK-1002	Bộ đèn sưởi 2 bóng Takin	128,400 đ	158,000 đ	158,000 đ	270,000 đ
54	TK-1003	Bộ đèn sưởi 3 bóng Takin	157,290 đ	194,000 đ	194,000 đ	330,000 đ
55	TK-469	Sưởi gốm thân cao	468,762 đ	615,000 đ	615,000 đ	1,050,000 đ
56	TK-468	Sưởi gốm thấp	366,857 đ	452,000 đ	452,000 đ	900,000 đ
57	TK-0348A	Bộ nồi Táo inox Takin 5 lớp Tk0348A	474,916 đ	580,000 đ	580,000 đ	950,000 đ
58	LK-2633	Chảo Belly Lock&King Titanium 26cm	349,728 đ	450,000 đ	470,000 đ	850,000 đ
59	LM-TK-036A	Bộ nồi inox 5 đáy cao cấp	433,985 đ	515,000 đ	515,000 đ	990,000 đ
60	LK-3018A	Nồi táo Inox 5 đáy cao cấp Lock&King 18cm	134,773 đ	170,000 đ	170,000 đ	270,000 đ
61	LM-LK-3020A	Nồi táo Inox 5 đáy cao cấp Lock&King 20cm	148,885 đ	185,000 đ	185,000 đ	298,000 đ
62	LK-2606A	Chảo cạn Titanium Lock&king 26cm	242,251 đ	320,000 đ	320,000 đ	485,000 đ
63	LK-2808S(VK)	Chảo sâu vung kính Titanium Lock&king 28cm	320,736 đ	370,000 đ	370,000 đ	642,000 đ
64	LK-3386A	Bộ nồi 3 Inox 5 đáy Lock&king (18.20.24) (1t/4c)	459,339 đ	550,000 đ	550,000 đ	919,000 đ
65	LK-3568A	Bộ nồi 5 Inox 5 đáy Lock&king (Q16.18.20.24.C24) (1t/2c)	827,064 đ	960,000 đ	960,000 đ	1,655,000 đ
66	LK-2466S	Chảo Titanium  ELITE Lock&King	288,664 đ	390,000 đ	390,000 đ	690,000 đ
67	LK-3003	Chảo cạn titanium Lock&King 30cm	290,620 đ	375,000 đ	375,000 đ	750,000 đ
68	LK-2433	Chảo Belly Lock&King	298,559 đ	395,000 đ	410,000 đ	750,000 đ
69	LK-1030	Bình thủy điện 3L Lock&King (4c/t)	785,427 đ	1,020,000 đ	1,020,000 đ	1,890,000 đ`;

function cleanPrice(str) {
  if (!str) return 0;
  return parseFloat(str.replace(/[^\d]/g, '')) || 0;
}

// Load previous catalog to keep TMDT & Listed prices if needed
let prevCatalog = [];
try {
  prevCatalog = JSON.parse(fs.readFileSync(path.join(__dirname, 'real_catalog.json'), 'utf-8'));
} catch (e) {}

const prevMap = new Map();
prevCatalog.forEach(p => {
  prevMap.set(p.canonicalCode.toUpperCase(), p);
});

const lines = rawNewData.split('\n').map(l => l.trim()).filter(l => l);
const mergedProducts = [];

for (let i = 1; i < lines.length; i++) {
  const parts = lines[i].split('\t').map(p => p.trim());
  if (parts.length >= 7) {
    const stt = parseInt(parts[0]);
    const model = parts[1];
    const name = parts[2];
    const importPrice = cleanPrice(parts[3]);
    const nppOnline = cleanPrice(parts[4]);
    const nppOffline = cleanPrice(parts[5]);
    const fbPrice = cleanPrice(parts[6]);

    // Brand detection
    let brand = 'Lock&King';
    if (model.startsWith('TK-') || model.startsWith('LM-TK-') || name.toUpperCase().includes('TAKIN')) {
      brand = 'Takin';
    }

    // Category detection
    let cat = 'CHẢO';
    const upName = name.toUpperCase();
    if (upName.includes('CHẢO') || upName.includes('QUÁNH')) cat = 'CHẢO';
    else if (upName.includes('ÁP SUẤT') || upName.includes('TĂNG ÁP')) cat = 'NỒI TĂNG ÁP';
    else if (upName.includes('NỒI') || upName.includes('BỘ NỒI') || upName.includes('HỘP')) cat = 'NỒI & BỘ NỒI';
    else if (upName.includes('ẤM') || upName.includes('BÌNH')) cat = 'ẤM & BÌNH';
    else if (upName.includes('SƯỞI') || upName.includes('TỦ SẤY') || upName.includes('LÀM SỮA') || upName.includes('CHIÊN') || upName.includes('ĐÈN SƯỞI') || upName.includes('NẤU CHẬM') || upName.includes('ĐA NĂNG') || upName.includes('LẨU')) cat = 'ĐỒ ĐIỆN';

    // Lookup previous TMDT and Listed Price if available, else standard multipliers
    const old = prevMap.get(model.toUpperCase());
    const tmdtPrice = old && old.tmdtPrice ? old.tmdtPrice : Math.round(fbPrice * 1.08 / 1000) * 1000;
    const retailPrice = old && old.retailPrice ? old.retailPrice : Math.round(fbPrice * 1.3 / 1000) * 1000;

    // Profit calculations
    const profitOnline = fbPrice - nppOnline;
    const profitPctOnline = fbPrice > 0 ? ((profitOnline / fbPrice) * 100).toFixed(1) + '%' : '0%';

    const profitOffline = fbPrice - nppOffline;
    const profitPctOffline = fbPrice > 0 ? ((profitOffline / fbPrice) * 100).toFixed(1) + '%' : '0%';

    const profitHangOnline = nppOnline - importPrice;
    const profitHangPctOnline = importPrice > 0 ? ((profitHangOnline / importPrice) * 100).toFixed(1) + '%' : '0%';

    mergedProducts.push({
      stt,
      canonicalCode: model,
      name,
      brand,
      categoryName: cat,
      unit: name.includes('Bộ') ? 'Bộ' : 'Cái',
      importPrice,        // GIÁ NHẬP (Cost / COGS)
      nppOnlinePrice: nppOnline,   // GIÁ NPP ONLINE
      nppOfflinePrice: nppOffline, // GIÁ NPP OFFLINE
      facebookPrice: fbPrice,      // GIÁ FACEBOOK
      tmdtPrice,          // GIÁ SÀN TMĐT
      retailPrice,        // GIÁ NIÊM YẾT
      profitOnline,
      profitPctOnline,
      profitOffline,
      profitPctOffline,
      profitHangOnline,
      profitHangPctOnline,
      // Default mappings
      costPrice: importPrice,
      dealerPrice: fbPrice,
      distributorPrice: nppOnline,
      status: 'ACTIVE',
      updatedAt: '2026-09-05T11:35:00Z',
      updatedBy: 'admin'
    });
  }
}

console.log(`Merged ${mergedProducts.length} items with Giá nhập and Giá NPP Offline!`);
fs.writeFileSync(path.join(__dirname, 'real_catalog_v3.json'), JSON.stringify(mergedProducts, null, 2), 'utf-8');

// Also create CSV
let csv = '\uFEFFSTT,Model,Tên Sản Phẩm,Thương Hiệu,Phân Loại,Giá Nhập (VNĐ),Giá NPP Online (VNĐ),Giá NPP Offline (VNĐ),Giá Facebook (VNĐ),Giá Sàn TMĐT (VNĐ),Giá Niêm Yết (VNĐ),LN NPP Online (VNĐ),% LN Online,LN NPP Offline (VNĐ),% LN Offline\n';
mergedProducts.forEach(p => {
  csv += `"${p.stt}","${p.canonicalCode}","${p.name.replace(/"/g, '""')}","${p.brand}","${p.categoryName}","${p.importPrice}","${p.nppOnlinePrice}","${p.nppOfflinePrice}","${p.facebookPrice}","${p.tmdtPrice}","${p.retailPrice}","${p.profitOnline}","${p.profitPctOnline}","${p.profitOffline}","${p.profitPctOffline}"\n`;
});
fs.writeFileSync(path.join(__dirname, 'bang_gia_chuan_lock_and_king_day_du.csv'), csv, 'utf-8');

// Generate Excel
const XLSX = require('xlsx');
const rows = [
  ['STT', 'Model', 'Tên Sản Phẩm', 'Thương Hiệu', 'Phân Loại', 'Giá Nhập (VNĐ)', 'Giá NPP Online (VNĐ)', 'Giá NPP Offline (VNĐ)', 'Giá Facebook (VNĐ)', 'Giá Sàn TMĐT (VNĐ)', 'Giá Niêm Yết (VNĐ)', 'Lợi Nhuận NPP Online', '% LN Online', 'Lợi Nhuận NPP Offline', '% LN Offline']
];
mergedProducts.forEach(p => {
  rows.push([
    p.stt, p.canonicalCode, p.name, p.brand, p.categoryName,
    p.importPrice, p.nppOnlinePrice, p.nppOfflinePrice, p.facebookPrice, p.tmdtPrice, p.retailPrice,
    p.profitOnline, p.profitPctOnline, p.profitOffline, p.profitPctOffline
  ]);
});
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet(rows);
ws['!cols'] = [
  { wch: 6 }, { wch: 22 }, { wch: 45 }, { wch: 14 }, { wch: 16 },
  { wch: 16 }, { wch: 18 }, { wch: 18 }, { wch: 16 }, { wch: 16 }, { wch: 16 },
  { wch: 18 }, { wch: 14 }, { wch: 18 }, { wch: 14 }
];
XLSX.utils.book_append_sheet(wb, ws, 'BangGiaDayDu');
XLSX.writeFile(wb, path.join(__dirname, 'bang_gia_chuan_lock_and_king_day_du.xlsx'));
console.log('Created bang_gia_chuan_lock_and_king_day_du.xlsx successfully!');
