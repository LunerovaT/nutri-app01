// foods.js – databáze potravin rozdělená do skupin
// Všechny hodnoty kJ jsou pro 100 g syrového stavu potraviny.

// ─────────────────────────────────────────────
// SACHARIDY
// ─────────────────────────────────────────────

// Snídaně sladká: pouze vločky a pseudoobiloviny (dle excelu)
export const breakfastGrainCarbs = [
  { id: "vlocky",     name: "Ovesné vločky",             kj: 1562 },
  { id: "spald_vl",   name: "Špaldové vločky",           kj: 1474 },
  { id: "ryz_vl",     name: "Rýžové vločky",             kj: 1474 },
  { id: "jahly",      name: "Jáhly",                     kj: 1530 },
  { id: "musli",      name: "Müsli bez přidaného cukru", kj: 1513 },
];

// Oběd s masem + večeře teplá: bez čočky
export const mainGrainCarbs = [
  { id: "kuskus",      name: "Kuskus",                           kj: 1450 },
  { id: "kuskus_cz",   name: "Celozrnný kuskus",                 kj: 1454 },
  { id: "bulgur",      name: "Bulgur",                           kj: 1436 },
  { id: "amarant",     name: "Amarant",                          kj: 1553 },
  { id: "pohanka",     name: "Pohanka",                          kj: 1473 },
  { id: "quinoa",      name: "Quinoa",                           kj: 1541 },
  { id: "ryze_bila",   name: "Rýže bílá (jasmínová, basmati)",   kj: 1505 },
  { id: "ryze_cz",     name: "Celozrnná rýže",                   kj: 1566 },
  { id: "test_sem",    name: "Těstoviny semolinové",             kj: 1482 },
  { id: "test_cz",     name: "Celozrnné těstoviny",              kj: 1478 },
  { id: "bataty",      name: "Batáty",                           kj: 314  },
  { id: "brambory",    name: "Brambory",                         kj: 371  },
  { id: "tortilla_cz", name: "Celozrnná tortilla",               kj: 1100 },
];

// Oběd bezmasý: jako mainGrainCarbs + luštěniny
export const vegLunchGrainCarbs = [
  ...mainGrainCarbs,
  { id: "cocka",      name: "Čočka",          kj: 1290 },
  { id: "cocka_cerv", name: "Čočka červená",  kj: 1260 },
  { id: "hrach",      name: "Hrách",          kj: 1270 },
  { id: "fazole",     name: "Fazole",         kj: 1270 },
  { id: "cizrna",     name: "Cizrna",         kj: 1520 },
];

// Pečivo pro slaná jídla
export const breadCarbs = [
  { id: "toast_cz",    name: "Toastový chléb celozrnný",           kj: 1074 },
  { id: "chleb_konz",  name: "Chléb konzumní",                     kj: 1020 },
  { id: "chleb_zitn",  name: "Chléb žitný",                        kj: 1010 },
  { id: "knack_zitn",  name: "Knäckebrot žitný",                   kj: 1486 },
  { id: "knack",       name: "Knäckebrot",                         kj: 1500 },
  { id: "rohlik_gr",   name: "Rohlík grahamový",                   kj: 1323 },
  { id: "rohlik_bily", name: "Rohlík bílý",                        kj: 1202 },
  { id: "bageta_vz",   name: "Bageta vícezrnná",                   kj: 1144 },
  { id: "kaiserka",    name: "Kaiserka cereální",                  kj: 1100 },
  { id: "chleb_slun",  name: "Chléb slunečnicový (žitnopšeničný)", kj: 1088 },
  { id: "tortilla_cz", name: "Celozrnná tortilla",                 kj: 1100 },
];

// ─────────────────────────────────────────────
// BÍLKOVINY
// ─────────────────────────────────────────────

// Sladká snídaně: s plnotučným mlékem, bez polotučného
export const breakfastDairyProtein = [
  { id: "mleko_pl",   name: "Plnotučné mléko",              kj: 271 },
  { id: "jogurt_hol", name: "Jogurt holandského typu",      kj: 279 },
  { id: "jogurt_niz", name: "Jogurt nízkotučný",            kj: 170 },
  { id: "jogurt_rec", name: "Jogurt řecký (0 % tuku)",      kj: 241 },
  { id: "skyr",       name: "Skyr (0 % tuku)",              kj: 283 },
  { id: "kefir",      name: "Kefírové mléko / podmáslí 1,1%", kj: 165 },
  { id: "acidofil",   name: "Acidofilní mléko 3,6 %",       kj: 252 },
  { id: "kyska",      name: "Kyška",                        kj: 178 },
  { id: "tvaroh_odt", name: "Tvaroh odtučněný",             kj: 288 },
  { id: "tvaroh_pol", name: "Tvaroh polotučný",             kj: 362 },
  { id: "jogurt_27",  name: "Jogurt bílý 2,7 %",            kj: 285 },
  { id: "ovofit",     name: "Ovofit různé druhy",           kj: 330 },
];

// Sladké svačiny a přesnídávky: bez polotučného i plnotučného mléka
export const snackDairyProtein = [
  { id: "jogurt_hol", name: "Jogurt holandského typu",      kj: 279 },
  { id: "jogurt_niz", name: "Jogurt nízkotučný",            kj: 170 },
  { id: "jogurt_rec", name: "Jogurt řecký (0 % tuku)",      kj: 241 },
  { id: "skyr",       name: "Skyr (0 % tuku)",              kj: 283 },
  { id: "kefir",      name: "Kefírové mléko / podmáslí 1,1%", kj: 165 },
  { id: "acidofil",   name: "Acidofilní mléko 3,6 %",       kj: 252 },
  { id: "kyska",      name: "Kyška",                        kj: 178 },
  { id: "tvaroh_odt", name: "Tvaroh odtučněný",             kj: 288 },
  { id: "tvaroh_pol", name: "Tvaroh polotučný",             kj: 362 },
  { id: "jogurt_27",  name: "Jogurt bílý 2,7 %",            kj: 285 },
  { id: "ovofit",     name: "Ovofit různé druhy",           kj: 330 },
];

// Druhá večeře: bez plnotučného, polotučného mléka a ovofitu
export const dinner2DairyProtein = [
  { id: "jogurt_hol", name: "Jogurt holandského typu",      kj: 279 },
  { id: "jogurt_niz", name: "Jogurt nízkotučný",            kj: 170 },
  { id: "jogurt_rec", name: "Jogurt řecký (0 % tuku)",      kj: 241 },
  { id: "skyr",       name: "Skyr (0 % tuku)",              kj: 283 },
  { id: "kefir",      name: "Kefírové mléko / podmáslí 1,1%", kj: 165 },
  { id: "acidofil",   name: "Acidofilní mléko 3,6 %",       kj: 252 },
  { id: "kyska",      name: "Kyška",                        kj: 178 },
  { id: "tvaroh_odt", name: "Tvaroh odtučněný",             kj: 288 },
  { id: "tvaroh_pol", name: "Tvaroh polotučný",             kj: 362 },
  { id: "jogurt_27",  name: "Jogurt bílý 2,7 %",            kj: 285 },
];

// Slaná jídla: sýry, šunky, ryby, vejce (plný seznam pro studenou večeři a snídani slanou)
export const savoryProtein = [
  { id: "tvaroh_odt", name: "Tvaroh odtučněný",                  kj: 288  },
  { id: "tvaroh_pol", name: "Tvaroh polotučný",                  kj: 362  },
  { id: "syr_30",     name: "Tvrdé sýry 30 % tuku v sušině",     kj: 1101 },
  { id: "syr_20",     name: "Tvrdé sýry 20 % tuku v sušině",     kj: 954  },
  { id: "syr_45",     name: "Tvrdé sýry 45 % tuku v sušině",     kj: 1340 },
  { id: "cottage_l",  name: "Cottage sýr light",                 kj: 389  },
  { id: "mozz_light", name: "Mozzarella light",                  kj: 690  },
  { id: "sunka_kur",  name: "Šunka kuřecí / krůtí 92 % masa",    kj: 386  },
  { id: "sunka_vep",  name: "Šunka vepřová libová 92 % masa",    kj: 456  },
  { id: "tunak_vl",   name: "Tuňák ve vlastní šťávě",            kj: 420  },
  { id: "sardinky",   name: "Sardinky ve vlastní šťávě",         kj: 737  },
  { id: "vejce",      name: "Vejce",                             kj: 615  },
  { id: "tlacenka",   name: "Tlačenka",                          kj: 545  },
  { id: "zavinace",   name: "Zavináče",                          kj: 350  },
  { id: "parenica",   name: "Parenica / korbačíky neuzené",       kj: 1050 },
  { id: "ostiepok",   name: "Oštiepok",                          kj: 1250 },
  { id: "taveny_syr", name: "Tavený sýr",                        kj: 900  },
  { id: "tvaruzky",   name: "Tvarůžky",                          kj: 406  },
  { id: "tunak_olej", name: "Tuňák v oleji",                     kj: 820  },
];

// Slaná jídla bez vejce (snídaně slaná, přesnídávka slaná, svačina slaná, druhá večeře zeleninová)
export const savoryProteinNoEgg = savoryProtein.filter(f => f.id !== "vejce");

// Maso – oběd s masem (plný seznam)
export const meatProtein = [
  { id: "kure_prsa",  name: "Kuřecí / krůtí prsní řízky",    kj: 442 },
  { id: "kure_steh",  name: "Kuřecí stehenní řízky",         kj: 447 },
  { id: "vepr_kyta",  name: "Vepřová kýta libová",           kj: 540 },
  { id: "vepr_pan",   name: "Vepřová panenka",               kj: 569 },
  { id: "hov_zadni",  name: "Hovězí zadní (kýta)",           kj: 643 },
  { id: "hov_kl",     name: "Hovězí kližka / plec libová",   kj: 444 },
  { id: "hov_svic",   name: "Hovězí svíčková",               kj: 510 },
  { id: "hov_mlete",  name: "Hovězí mleté (do 10 % tuku)",   kj: 700 },
  { id: "kralik",     name: "Králík",                        kj: 443 },
  { id: "kure_jatr",  name: "Kuřecí játra",                  kj: 536 },
  { id: "tunak_st",   name: "Tuňák steak",                   kj: 603 },
  { id: "treska",     name: "Treska / mořský vlk filet",     kj: 289 },
  { id: "makrela",    name: "Makrela kuchaná",               kj: 745 },
  { id: "tilapie",    name: "Tilápie filet",                 kj: 380 },
  { id: "losos",      name: "Losos",                         kj: 837 },
  { id: "kapr",       name: "Kapr filety",                   kj: 452 },
  { id: "pstruh",     name: "Pstruh",                        kj: 498 },
  { id: "krevety",    name: "Krevety",                       kj: 347 },
];

// Maso – večeře teplá (omezená sada dle excelu)
export const dinnerMeatProtein = [
  { id: "kure_prsa",  name: "Kuřecí / krůtí prsní řízky",  kj: 442 },
  { id: "kure_steh",  name: "Kuřecí stehenní řízky",       kj: 447 },
  { id: "hov_mlete",  name: "Hovězí mleté (do 10 % tuku)", kj: 700 },
  { id: "tunak_st",   name: "Tuňák steak",                 kj: 603 },
  { id: "treska",     name: "Treska / mořský vlk filet",   kj: 289 },
  { id: "tilapie",    name: "Tilápie filet",               kj: 380 },
  { id: "losos",      name: "Losos",                       kj: 837 },
  { id: "krevety",    name: "Krevety",                     kj: 347 },
];

// Rostlinné bílkoviny (oběd bezmasý, večeře teplá)
export const vegProtein = [
  { id: "vejce",   name: "Vejce",                kj: 615 },
  { id: "smakoun", name: "Šmakoun",              kj: 920 },
  { id: "tofu",    name: "Tofu natural / uzené", kj: 318 },
  { id: "tempeh",  name: "Tempeh",              kj: 820 },
  { id: "robi",    name: "Robi plátky",          kj: 590 },
];

// ─────────────────────────────────────────────
// TUKY
// ─────────────────────────────────────────────

// Pomazánky (pro pečivo – slaná jídla)
export const spreadFat = [
  { id: "maslo",      name: "Máslo 82%",               kj: 3051 },
  { id: "pom_maslo",  name: "Pomazánkové máslo",        kj: 1280 },
  { id: "rama",       name: "Rama classic",             kj: 2220 },
  { id: "flora",      name: "Flora original",           kj: 1665 },
  { id: "ricotta",    name: "Ricotta",                  kj: 505  },
  { id: "lucina",     name: "Lučina čistá / palouček",  kj: 1105 },
  { id: "gervais",    name: "Gervais original",         kj: 760  },
  { id: "phil_orig",  name: "Philadelphia original",    kj: 910  },
  { id: "phil_light", name: "Philadelphia light",       kj: 603  },
  { id: "avokado",    name: "Avokádo",                  kj: 662  },
  { id: "hummus",     name: "Hummus",                   kj: 740  },
];

// Ořechy a čokoláda (sladká snídaně)
export const nutFat = [
  { id: "vlassk_or", name: "Vlašské ořechy",            kj: 2757 },
  { id: "mandle",    name: "Mandle neloupané",           kj: 2408 },
  { id: "kesu",      name: "Kešu",                      kj: 2314 },
  { id: "liskove",   name: "Lískové ořechy",            kj: 2630 },
  { id: "arasidy",   name: "Arašídy / arašídové máslo", kj: 2630 },
  { id: "coko_70",   name: "Hořká čokoláda 70% Lindt",  kj: 2450 },
  { id: "coko_50",   name: "Hořká čokoláda 50% Orion",  kj: 2280 },
];

// Ořechy bez čokolády (druhá večeře)
export const dinner2NutFat = [
  { id: "vlassk_or", name: "Vlašské ořechy",            kj: 2757 },
  { id: "mandle",    name: "Mandle neloupané",           kj: 2408 },
  { id: "kesu",      name: "Kešu",                      kj: 2314 },
  { id: "liskove",   name: "Lískové ořechy",            kj: 2630 },
  { id: "arasidy",   name: "Arašídy / arašídové máslo", kj: 2630 },
];

// Oleje a vaření – bez anglické slaniny (bezmasý oběd, večeře teplá)
export const cookingFat = [
  { id: "repk_ol",  name: "Řepkový olej",          kj: 3696 },
  { id: "oliv_ol",  name: "Olivový olej",           kj: 3696 },
  { id: "soj_ol",   name: "Sójový olej",            kj: 3696 },
  { id: "slun_ol",  name: "Slunečnicový olej",      kj: 3696 },
  { id: "maslo_82", name: "Máslo 82%",              kj: 3051 },
  { id: "sadlo",    name: "Vepřové sádlo",          kj: 3696 },
  { id: "smet_12",  name: "Smetana 12%",            kj: 494  },
  { id: "zak_smet", name: "Zakysaná smetana 16%",   kj: 720  },
];

// Oleje a vaření + anglická slanina (oběd s masem)
export const lunchMeatCookingFat = [
  ...cookingFat,
  { id: "angl_sl", name: "Anglická slanina", kj: 1600 },
];

// ─────────────────────────────────────────────
// OVOCE A ZELENINA
// ─────────────────────────────────────────────

export const fruit = [
  { id: "ananas",     name: "Ananas",                          kj: 218  },
  { id: "banan",      name: "Banán",                           kj: 371  },
  { id: "boruvky",    name: "Borůvky kanadské",                kj: 235  },
  { id: "broskve",    name: "Broskve",                         kj: 160  },
  { id: "grapefr",    name: "Grapefruit",                      kj: 138  },
  { id: "hrozny",     name: "Hrozny",                          kj: 281  },
  { id: "hrusky",     name: "Hrušky zelené",                   kj: 218  },
  { id: "jablka",     name: "Jablka",                          kj: 218  },
  { id: "kaki",       name: "Kaki",                            kj: 276  },
  { id: "maliny",     name: "Maliny",                          kj: 151  },
  { id: "mandarinky", name: "Mandarinky",                      kj: 197  },
  { id: "mango",      name: "Mango",                           kj: 272  },
  { id: "meloun",     name: "Meloun vodní",                    kj: 126  },
  { id: "merunky",    name: "Meruňky",                         kj: 180  },
  { id: "nektarinky", name: "Nektarinky",                      kj: 180  },
  { id: "ostuziny",   name: "Ostružiny",                       kj: 151  },
  { id: "pomeranc",   name: "Pomeranč",                        kj: 197  },
  { id: "svestky",    name: "Švestky",                         kj: 188  },
  { id: "tresne",     name: "Třešně / višně",                  kj: 243  },
  { id: "dzem",       name: "Džem různé druhy",                kj: 1100 },
  { id: "dzem_lc",    name: "Džem se sníženým obsahem cukru",  kj: 550  },
];

// Lehká zelenina – slaná snídaně, studená večeře
export const lightVeg = [
  { id: "cin_zeli",  name: "Čínské zelí / hlávkový salát", kj: 55   },
  { id: "kedlubna",  name: "Kedlubna",                     kj: 109  },
  { id: "okurka",    name: "Okurka salátová",              kj: 59   },
  { id: "papr_cerv", name: "Paprika červená",              kj: 131  },
  { id: "papr_bila", name: "Paprika bílá",                 kj: 84   },
  { id: "rajcata",   name: "Rajčata",                      kj: 71   },
  { id: "rukola",    name: "Rukola / špenát",              kj: 97   },
  { id: "ajvar",     name: "Ajvar",                        kj: 280  },
  { id: "sus_houby", name: "Sušené houby",                 kj: 1000 },
  { id: "naklicena", name: "Naklíčená čočka",              kj: 150  },
];

// Lehká zelenina + mrkev – slaná přesnídávka, slaná svačina, druhá večeře zeleninová
export const snackLightVeg = [
  ...lightVeg,
  { id: "mrkev_mix", name: "Mrkev, celer, petržel, ředkev", kj: 155 },
];

// Hlavní zelenina – obědy a teplé večeře
export const mainVeg = [
  { id: "cuketa",    name: "Cuketa",                           kj: 71   },
  { id: "cin_zeli",  name: "Čínské zelí / hlávkový salát",     kj: 55   },
  { id: "dyne",      name: "Dýně hokkaido",                    kj: 105  },
  { id: "kedlubna",  name: "Kedlubna",                         kj: 109  },
  { id: "lilek",     name: "Lilek",                            kj: 88   },
  { id: "mrkev_mix", name: "Mrkev, celer, petržel, ředkev",    kj: 155  },
  { id: "okurka",    name: "Okurka salátová",                  kj: 59   },
  { id: "porek",     name: "Pórek",                            kj: 130  },
  { id: "papr_cerv", name: "Paprika červená",                  kj: 131  },
  { id: "papr_bila", name: "Paprika bílá",                     kj: 84   },
  { id: "rajcata",   name: "Rajčata",                          kj: 71   },
  { id: "rukola",    name: "Rukola / špenát",                  kj: 97   },
  { id: "brokolice", name: "Brokolice",                        kj: 150  },
  { id: "cibule",    name: "Cibule",                           kj: 167  },
  { id: "kukurice",  name: "Kukuřice cukrová",                 kj: 360  },
  { id: "ajvar",     name: "Ajvar",                            kj: 280  },
  { id: "sus_houby", name: "Sušené houby",                     kj: 1000 },
  { id: "naklicena", name: "Naklíčená čočka",                  kj: 150  },
];
