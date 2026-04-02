// calculations.js – kompletní verze
// Přesná replika logiky excelu:
// - energie v kJ
// - gramáže přes energii porce (ne přes gramy makroživin)
// - 4 skupiny potravin: sacharidy, bílkoviny, tuky, ovoce/zelenina
// - 12 typů jídel (sladká/slaná varianta pro každé jídlo)
// - podíly energie z listu "Rozpočet"
// - databáze potravin z jednotlivých listů excelu

// ─────────────────────────────────────────────
// KONVERZE
// ─────────────────────────────────────────────
export const KCAL_TO_KJ = 4.184;
export function kcalToKj(kcal) { return Math.round(kcal * KCAL_TO_KJ); }
export function kjToKcal(kj)   { return Math.round(kj / KCAL_TO_KJ); }

// ─────────────────────────────────────────────
// 1. BMR v kJ
// ─────────────────────────────────────────────
export function calculateBMR(weight, height, age, gender) {
  if (gender === "male") {
    return (88.362 + 13.397 * weight + 4.799 * height - 5.677 * age) * KCAL_TO_KJ;
  } else {
    return (447.593 + 9.247 * weight + 3.098 * height - 4.330 * age) * KCAL_TO_KJ;
  }
}

// ─────────────────────────────────────────────
// 2. PRACOVNÍ AKTIVITA
// ─────────────────────────────────────────────
export const jobActivityOptions = [
  { value: "sedentary", label: "Sedavá práce (kancelář, programátor, řidič)",                palWork: 1.2 },
  { value: "light",     label: "Lehká práce (učitel, obchodní zástupce, prodavač)",          palWork: 1.5 },
  { value: "moderate",  label: "Středně náročná (řemeslník, kuchař, zdravotní sestra)",      palWork: 1.8 },
  { value: "heavy",     label: "Těžká fyzická práce (stavebnictví, zemědělství, stěhování)", palWork: 2.2 },
];

export function calculateBasePAL(jobActivity) {
  const job = jobActivityOptions.find((o) => o.value === jobActivity);
  const palWork = job ? job.palWork : 1.2;
  return (8 * 1.0 + 8 * palWork + 8 * 1.4) / 24;
}

// ─────────────────────────────────────────────
// 3. SPORT (MET) – výsledek v kJ/den
// ─────────────────────────────────────────────
export const sportOptions = [
  { value: "none",       label: "Žádný sport",                      met: 0   },
  { value: "walking",    label: "Svižná chůze",                     met: 4.0 },
  { value: "cycling",    label: "Kolo (rekreační)",                  met: 6.0 },
  { value: "swimming",   label: "Plavání",                          met: 7.0 },
  { value: "running",    label: "Běh (střední tempo)",              met: 8.0 },
  { value: "gym",        label: "Posilovna / silový trénink",       met: 5.5 },
  { value: "hiit",       label: "HIIT / kruhový trénink",          met: 8.5 },
  { value: "yoga",       label: "Jóga / pilates",                   met: 3.0 },
  { value: "team_sport", label: "Týmový sport (fotbal, volejbal…)", met: 7.5 },
  { value: "crossfit",   label: "CrossFit",                         met: 9.0 },
];

export function calculateSportKjPerDay(sportType, daysPerWeek, minutesPerSession, weight) {
  if (sportType === "none" || !daysPerWeek || !minutesPerSession) return 0;
  const sport = sportOptions.find((s) => s.value === sportType);
  if (!sport || sport.met === 0) return 0;
  const kcalPerSession = sport.met * weight * (minutesPerSession / 60);
  return (kcalPerSession * KCAL_TO_KJ * daysPerWeek) / 7;
}

// ─────────────────────────────────────────────
// 4. TDEE v kJ (včetně DIT 10 %)
// ─────────────────────────────────────────────
export function calculateTDEE(bmrKj, basePAL, sportKjPerDay) {
  return (bmrKj * basePAL + sportKjPerDay) * 1.1;
}

// ─────────────────────────────────────────────
// 5. CÍLOVÝ PŘÍJEM
// ─────────────────────────────────────────────
export const goalOptions = [
  { value: "maintain", label: "Udržení hmotnosti (0 %)",        multiplier: 1.00 },
  { value: "lose_10",  label: "Redukce −10 %",                  multiplier: 0.90 },
  { value: "lose_15",  label: "Redukce −15 %",                  multiplier: 0.85 },
  { value: "lose_20",  label: "Redukce −20 %",                  multiplier: 0.80 },
  { value: "lose_25",  label: "Redukce −25 %",                  multiplier: 0.75 },
  { value: "gain_10",  label: "Nabírání svalové hmoty (+10 %)", multiplier: 1.10 },
];

export function calculateTargetKj(tdeeKj, goal) {
  const option = goalOptions.find((o) => o.value === goal);
  return Math.round(tdeeKj * (option ? option.multiplier : 1.0));
}

// ─────────────────────────────────────────────
// 6. MAKROŽIVINY v gramech
// 1 g bílkovin = 17 kJ, 1 g sacharidů = 17 kJ, 1 g tuku = 37 kJ
// ─────────────────────────────────────────────
export function calculateMacros(targetKj) {
  return {
    protein: Math.round((targetKj * 0.275) / 17),
    carbs:   Math.round((targetKj * 0.475) / 17),
    fat:     Math.round((targetKj * 0.20)  / 37),
  };
}

// ─────────────────────────────────────────────
// 7. TYPY JÍDEL
// ─────────────────────────────────────────────
// Každý typ má název, klíč a podíly energie skupin potravin.
// Hodnoty přesně z listu "Rozpočet" v excelu.

export const mealTypeOptions = {
  breakfast: [
    { value: "breakfast_sweet",  label: "🍓 Snídaně sladká"  },
    { value: "breakfast_savory", label: "🥚 Snídaně slaná"   },
  ],
  snack1: [
    { value: "snack1_sweet",  label: "🍎 Přesnídávka sladká" },
    { value: "snack1_savory", label: "🥙 Přesnídávka slaná"  },
  ],
  lunch: [
    { value: "lunch_meat", label: "🥩 Oběd s masem"   },
    { value: "lunch_veg",  label: "🥦 Oběd bezmasý"   },
  ],
  snack2: [
    { value: "snack2_sweet",  label: "🍊 Svačina sladká" },
    { value: "snack2_savory", label: "🥒 Svačina slaná"  },
  ],
  dinner: [
    { value: "dinner_warm", label: "🍲 Večeře teplá"   },
    { value: "dinner_cold", label: "🥗 Večeře studená" },
  ],
  dinner2: [
    { value: "dinner2",     label: "🥛 Druhá večeře"            },
    { value: "dinner2_veg", label: "🥬 Druhá večeře zeleninová" },
  ],
};

// Podíly energie skupin – přesně z listu "Rozpočet"
export const mealEnergyRatios = {
  breakfast_sweet:  { carbs: 0.45, prot: 0.26, fat: 0.17, frVeg: 0.12, frVegLabel: "Ovoce"    },
  breakfast_savory: { carbs: 0.50, prot: 0.25, fat: 0.18, frVeg: 0.07, frVegLabel: "Zelenina" },
  snack1_sweet:     { carbs: 0.00, prot: 0.50, fat: 0.00, frVeg: 0.50, frVegLabel: "Ovoce"    },
  snack1_savory:    { carbs: 0.48, prot: 0.23, fat: 0.20, frVeg: 0.09, frVegLabel: "Zelenina" },
  lunch_meat:       { carbs: 0.48, prot: 0.27, fat: 0.21, frVeg: 0.04, frVegLabel: "Zelenina" },
  lunch_veg:        { carbs: 0.48, prot: 0.27, fat: 0.21, frVeg: 0.04, frVegLabel: "Zelenina" },
  snack2_sweet:     { carbs: 0.00, prot: 0.50, fat: 0.00, frVeg: 0.50, frVegLabel: "Ovoce"    },
  snack2_savory:    { carbs: 0.48, prot: 0.23, fat: 0.20, frVeg: 0.09, frVegLabel: "Zelenina" },
  dinner_warm:      { carbs: 0.54, prot: 0.22, fat: 0.18, frVeg: 0.06, frVegLabel: "Zelenina" },
  dinner_cold:      { carbs: 0.50, prot: 0.25, fat: 0.19, frVeg: 0.06, frVegLabel: "Zelenina" },
  dinner2:          { carbs: 0.00, prot: 0.70, fat: 0.30, frVeg: 0.00, frVegLabel: ""         },
  dinner2_veg:      { carbs: 0.00, prot: 0.50, fat: 0.20, frVeg: 0.30, frVegLabel: "Zelenina" },
};

// ─────────────────────────────────────────────
// 8. ROZDĚLENÍ ENERGIE NA JÍDLA
// Podíly z listu "Jidelak": 20/10/35/10/20/5
// ─────────────────────────────────────────────
export function distributeMeals(targetKj, mealTypes) {
  const distribution = [
    { name: "Snídaně",      key: "breakfast", ratio: 0.20 },
    { name: "Přesnídávka",  key: "snack1",    ratio: 0.10 },
    { name: "Oběd",         key: "lunch",     ratio: 0.35 },
    { name: "Svačina",      key: "snack2",    ratio: 0.10 },
    { name: "Večeře",       key: "dinner",    ratio: 0.20 },
    { name: "Druhá večeře", key: "dinner2",   ratio: 0.05 },
  ];

  return distribution.map((meal) => {
    const totalKj  = Math.round(targetKj * meal.ratio);
    const mealType = mealTypes[meal.key] || Object.keys(mealEnergyRatios).find(k => k.startsWith(meal.key));
    const ratios   = mealEnergyRatios[mealType] || mealEnergyRatios.breakfast_sweet;

    return {
      ...meal,
      mealType,
      totalKj,
      totalKcal:    kjToKcal(totalKj),
      energyCarbs:  Math.round(totalKj * ratios.carbs),
      energyProt:   Math.round(totalKj * ratios.prot),
      energyFat:    Math.round(totalKj * ratios.fat),
      energyFrVeg:  Math.round(totalKj * ratios.frVeg),
      frVegLabel:   ratios.frVegLabel,
    };
  });
}

// ─────────────────────────────────────────────
// 9. VÝPOČET GRAMÁŽE PŘES ENERGII
// gramáž = (energie porce kJ / kJ na 100g) × 100
// Zaokrouhlení na 5 g
// ─────────────────────────────────────────────
export function calculatePortionByEnergy(foodKjPer100g, portionEnergyKj) {
  if (!foodKjPer100g || foodKjPer100g === 0 || portionEnergyKj === 0) return 0;
  const rawGrams = (portionEnergyKj / foodKjPer100g) * 100;
  return Math.round(rawGrams / 5) * 5;
}

// ─────────────────────────────────────────────
// 10. DATABÁZE POTRAVIN
// Hodnoty z excelu – energie v kJ na 100g
// ─────────────────────────────────────────────

// Sacharidy – pečivo (sdílené pro slaná jídla: snídaně, přesnídávka, svačina, večeře studená)
const breadCarbs = [
  { id: "toast_cz",     name: "Toastový chléb celozrnný",           kj: 1074 },
  { id: "chleb_konz",   name: "Chléb konzumní",                     kj: 1020 },
  { id: "chleb_zitn",   name: "Chléb žitný",                        kj: 1010 },
  { id: "knack_zitn",   name: "Knäckebrot žitný",                   kj: 1486 },
  { id: "knack",        name: "Knäckebrot",                         kj: 1500 },
  { id: "rohlik_gr",    name: "Rohlík grahamový",                   kj: 1323 },
  { id: "rohlik_bily",  name: "Rohlík bílý",                        kj: 1202 },
  { id: "bageta_vz",    name: "Bageta vícezrnná",                   kj: 1144 },
  { id: "kaiserka",     name: "Kaiserka cereální",                  kj: 1100 },
  { id: "chleb_slun",   name: "Chléb slunečnicový (žitnopšeničný)", kj: 1088 },
  { id: "chleb_bl",     name: "Chléb bezlepkový (Schar)",           kj: 1020 },
  { id: "tortilla_cz",  name: "Celozrnná tortilla",                 kj: 1100 },
];

// Sacharidy – obiloviny (pro sladká jídla a obědy)
const grainCarbs = [
  { id: "vlocky",       name: "Ovesné vločky",                      kj: 1562 },
  { id: "spald_vl",     name: "Špaldové vločky",                    kj: 1474 },
  { id: "ryz_vl",       name: "Rýžové vločky",                      kj: 1474 },
  { id: "jahly",        name: "Jáhly",                              kj: 1530 },
  { id: "musli",        name: "Müsli bez přidaného cukru",          kj: 1513 },
  { id: "kuskus",       name: "Kuskus",                             kj: 1450 },
  { id: "kuskus_cz",    name: "Celozrnný kuskus",                   kj: 1454 },
  { id: "bulgur",       name: "Bulgur",                             kj: 1436 },
  { id: "amarant",      name: "Amarant",                            kj: 1553 },
  { id: "pohanka",      name: "Pohanka",                            kj: 1473 },
  { id: "quinoa",       name: "Quinoa",                             kj: 1541 },
  { id: "ryze_bila",    name: "Rýže bílá (jasmínová, basmati)",     kj: 1505 },
  { id: "ryze_cz",      name: "Celozrnná rýže",                     kj: 1566 },
  { id: "test_sem",     name: "Těstoviny semolinové",               kj: 1482 },
  { id: "test_cz",      name: "Celozrnné těstoviny",                kj: 1478 },
  { id: "bataty",       name: "Batáty",                             kj: 314  },
  { id: "brambory",     name: "Brambory",                           kj: 371  },
  { id: "cocka",        name: "Čočka",                              kj: 1290 },
  { id: "cocka_cerv",   name: "Čočka červená",                      kj: 1260 },
];

// Bílkoviny – mléčné výrobky a lehké bílkoviny (snídaně, přesnídávky, svačiny)
const dairyProtein = [
  { id: "mleko_pol",    name: "Mléko polotučné",                    kj: 198  },
  { id: "jogurt_hol",   name: "Jogurt holandského typu",            kj: 279  },
  { id: "jogurt_niz",   name: "Jogurt nízkotučný",                  kj: 170  },
  { id: "jogurt_rec",   name: "Jogurt řecký (0 % tuku)",            kj: 241  },
  { id: "skyr",         name: "Skyr (0 % tuku)",                    kj: 283  },
  { id: "kefir",        name: "Kefírové mléko / podmáslí 1,1%",     kj: 165  },
  { id: "acidofil",     name: "Acidofilní mléko 3,6 %",             kj: 252  },
  { id: "kyska",        name: "Kyška",                              kj: 178  },
  { id: "tvaroh_odt",   name: "Tvaroh odtučněný",                   kj: 288  },
  { id: "tvaroh_pol",   name: "Tvaroh polotučný",                   kj: 362  },
  { id: "mleko_pl",     name: "Plnotučné mléko",                    kj: 271  },
  { id: "jogurt_27",    name: "Jogurt bílý 2,7 %",                  kj: 285  },
  { id: "ovofit",       name: "Ovofit různé druhy",                 kj: 330  },
];

// Bílkoviny – sýry, šunky a ryby (slaná jídla)
const savoryProtein = [
  { id: "tvaroh_odt",   name: "Tvaroh odtučněný",                   kj: 288  },
  { id: "tvaroh_pol",   name: "Tvaroh polotučný",                   kj: 362  },
  { id: "syr_30",       name: "Tvrdé sýry 30 % tuku v sušině",      kj: 1101 },
  { id: "syr_20",       name: "Tvrdé sýry 20 % tuku v sušině",      kj: 954  },
  { id: "syr_45",       name: "Tvrdé sýry 45 % tuku v sušině",      kj: 1340 },
  { id: "cottage_l",    name: "Cottage sýr light",                  kj: 389  },
  { id: "mozz_light",   name: "Mozzarella light",                   kj: 690  },
  { id: "sunka_kur",    name: "Šunka kuřecí/ krůtí 92 % masa",      kj: 386  },
  { id: "sunka_vep",    name: "Šunka vepřová libová 92 % masa",     kj: 456  },
  { id: "tunak_vl",     name: "Tuňák ve vlastní šťávě",             kj: 420  },
  { id: "sardinky",     name: "Sardinky ve vlastní šťávě",          kj: 737  },
  { id: "vejce",        name: "Vejce",                              kj: 615  },
  { id: "tlacenka",     name: "Tlačenka",                           kj: 545  },
  { id: "zavinace",     name: "Zavináče",                           kj: 350  },
  { id: "parenica",     name: "Parenica/ korbačíky neuzené",        kj: 1050 },
  { id: "ostiepok",     name: "Oštiepok",                          kj: 1250 },
  { id: "taveny_syr",   name: "Tavený sýr",                        kj: 900  },
  { id: "tvaruzky",     name: "Tvarůžky",                          kj: 406  },
  { id: "tunak_olej",   name: "Tuňák v oleji",                     kj: 820  },
];

// Bílkoviny – maso a ryby (obědy, teplé večeře)
const meatProtein = [
  { id: "kure_prsa",    name: "Kuřecí/ krůtí prsní řízky",         kj: 442  },
  { id: "kure_steh",    name: "Kuřecí stehenní řízky",             kj: 447  },
  { id: "vepr_kyta",    name: "Vepřová kýta libová",               kj: 540  },
  { id: "vepr_pan",     name: "Vepřová panenka",                   kj: 569  },
  { id: "hov_zadni",    name: "Hovězí zadní (kýta)",               kj: 643  },
  { id: "hov_kl",       name: "Hovězí kližka/ plec libová",        kj: 444  },
  { id: "hov_svic",     name: "Hovězí svíčková",                   kj: 510  },
  { id: "hov_mlete",    name: "Hovězí mleté (do 10 % tuku)",       kj: 700  },
  { id: "kralik",       name: "Králík",                            kj: 443  },
  { id: "kure_jatr",    name: "Kuřecí játra",                      kj: 536  },
  { id: "tunak_st",     name: "Tuňák steak",                       kj: 603  },
  { id: "treska",       name: "Treska/ mořský vlk filet",          kj: 289  },
  { id: "makrela",      name: "Makrela kuchaná",                   kj: 745  },
  { id: "tilapie",      name: "Tilápie filet",                     kj: 380  },
  { id: "losos",        name: "Losos",                             kj: 837  },
  { id: "kapr",         name: "Kapr filety",                       kj: 452  },
  { id: "pstruh",       name: "Pstruh",                            kj: 498  },
  { id: "krevety",      name: "Krevety",                           kj: 347  },
];

// Bílkoviny – bezmasé alternativy (obědy bezmasé, teplé večeře)
const vegProtein = [
  { id: "vejce",        name: "Vejce",                             kj: 615  },
  { id: "smakoun",      name: "Šmakoun",                           kj: 920  },
  { id: "tofu",         name: "Tofu natural/ uzené",               kj: 318  },
  { id: "tempeh",       name: "Tempeh",                            kj: 820  },
  { id: "robi",         name: "Robi plátky",                       kj: 590  },
];

// Tuky – mazané (snídaně, svačiny, studená večeře)
const spreadFat = [
  { id: "maslo",        name: "Máslo 82%",                         kj: 3051 },
  { id: "pom_maslo",    name: "Pomazánkové máslo",                 kj: 1280 },
  { id: "rama",         name: "Rama classic",                      kj: 2220 },
  { id: "flora",        name: "Flora original",                    kj: 1665 },
  { id: "ricotta",      name: "Ricotta",                           kj: 505  },
  { id: "lucina",       name: "Lučina čistá/ palouček",            kj: 1105 },
  { id: "gervais",      name: "Gervais original",                  kj: 760  },
  { id: "phil_orig",    name: "Philadelphia original",             kj: 910  },
  { id: "phil_light",   name: "Philadelphia light",                kj: 603  },
  { id: "avokado",      name: "Avokádo",                           kj: 662  },
  { id: "hummus",       name: "Hummus",                            kj: 740  },
];

// Tuky – ořechy (sladká snídaně)
const nutFat = [
  { id: "vlassk_or",    name: "Vlašské ořechy",                    kj: 2757 },
  { id: "mandle",       name: "Mandle neloupané",                  kj: 2408 },
  { id: "kesu",         name: "Kešu",                              kj: 2314 },
  { id: "liskove",      name: "Lískové ořechy",                    kj: 2630 },
  { id: "arasidy",      name: "Arašídy/ arašídové máslo",          kj: 2630 },
  { id: "coko_70",      name: "Hořká čokoláda 70% Lindt",          kj: 2450 },
  { id: "coko_50",      name: "Hořká čokoláda 50% Orion",          kj: 2280 },
];

// Tuky – oleje a živočišné tuky (obědy, teplé večeře)
const cookingFat = [
  { id: "repk_ol",      name: "Řepkový olej",                      kj: 3696 },
  { id: "oliv_ol",      name: "Olivový olej",                      kj: 3696 },
  { id: "soj_ol",       name: "Sójový olej",                       kj: 3696 },
  { id: "slun_ol",      name: "Slunečnicový olej",                 kj: 3696 },
  { id: "maslo_82",     name: "Máslo 82%",                         kj: 3051 },
  { id: "sadlo",        name: "Vepřové sádlo",                     kj: 3696 },
  { id: "smet_12",      name: "Smetana 12%",                       kj: 494  },
  { id: "zak_smet",     name: "Zakysaná smetana 16%",              kj: 720  },
  { id: "angl_sl",      name: "Anglická slanina",                  kj: 1600 },
];

// Ovoce (sladká jídla)
const fruit = [
  { id: "ananas",       name: "Ananas",                            kj: 218  },
  { id: "banan",        name: "Banán",                             kj: 371  },
  { id: "boruvky",      name: "Borůvky kanadské",                  kj: 235  },
  { id: "broskve",      name: "Broskve",                           kj: 160  },
  { id: "grapefr",      name: "Grapefruit",                        kj: 138  },
  { id: "hrozny",       name: "Hrozny",                            kj: 281  },
  { id: "hrusky",       name: "Hrušky zelené",                     kj: 218  },
  { id: "jablka",       name: "Jablka",                            kj: 218  },
  { id: "kaki",         name: "Kaki",                              kj: 276  },
  { id: "maliny",       name: "Maliny",                            kj: 151  },
  { id: "mandarinky",   name: "Mandarinky",                        kj: 197  },
  { id: "mango",        name: "Mango",                             kj: 272  },
  { id: "meloun",       name: "Meloun vodní",                      kj: 126  },
  { id: "merunky",      name: "Meruňky",                           kj: 180  },
  { id: "nektarinky",   name: "Nektarinky",                        kj: 180  },
  { id: "ostuziny",     name: "Ostružiny",                         kj: 151  },
  { id: "pomeranc",     name: "Pomeranč",                          kj: 197  },
  { id: "svestky",      name: "Švestky",                           kj: 188  },
  { id: "tresne",       name: "Třešně/ višně",                     kj: 243  },
  { id: "dzem",         name: "Džem různé druhy",                  kj: 1100 },
  { id: "dzem_lc",      name: "Džem se sníženým obsahem cukru",    kj: 550  },
];

// Zelenina – lehká (snídaně slaná, přesnídávka slaná, svačina slaná, večeře studená)
const lightVeg = [
  { id: "cin_zeli",     name: "Čínské zelí/ hlávkový salát",       kj: 55   },
  { id: "kedlubna",     name: "Kedlubna",                          kj: 109  },
  { id: "okurka",       name: "Okurka salátová",                   kj: 59   },
  { id: "papr_cerv",    name: "Paprika červená",                   kj: 131  },
  { id: "papr_bila",    name: "Paprika bílá",                      kj: 84   },
  { id: "rajcata",      name: "Rajčata",                           kj: 71   },
  { id: "rukola",       name: "Rukola/ špenát",                    kj: 97   },
  { id: "ajvar",        name: "Ajvar",                             kj: 280  },
  { id: "sus_houby",    name: "Sušené houby",                      kj: 1000 },
  { id: "naklicena",    name: "Naklíčená čočka",                   kj: 150  },
  { id: "mrkev_mix",    name: "Mrkev, celer, petržel, ředkev",     kj: 155  },
];

// Zelenina – hlavní jídla (obědy, teplé večeře)
const mainVeg = [
  { id: "cuketa",       name: "Cuketa",                            kj: 71   },
  { id: "cin_zeli",     name: "Čínské zelí/ hlávkový salát",       kj: 55   },
  { id: "dyne",         name: "Dýně hokkaido",                     kj: 105  },
  { id: "kedlubna",     name: "Kedlubna",                          kj: 109  },
  { id: "lilek",        name: "Lilek",                             kj: 88   },
  { id: "mrkev_mix",    name: "Mrkev, celer, petržel, ředkev",     kj: 155  },
  { id: "okurka",       name: "Okurka salátová",                   kj: 59   },
  { id: "porek",        name: "Pórek",                             kj: 130  },
  { id: "papr_cerv",    name: "Paprika červená",                   kj: 131  },
  { id: "papr_bila",    name: "Paprika bílá",                      kj: 84   },
  { id: "rajcata",      name: "Rajčata",                           kj: 71   },
  { id: "rukola",       name: "Rukola/ špenát",                    kj: 97   },
  { id: "brokolice",    name: "Brokolice",                         kj: 150  },
  { id: "cibule",       name: "Cibule",                            kj: 167  },
  { id: "kukurice",     name: "Kukuřice cukrová",                  kj: 360  },
  { id: "ajvar",        name: "Ajvar",                             kj: 280  },
  { id: "sus_houby",    name: "Sušené houby",                      kj: 1000 },
  { id: "naklicena",    name: "Naklíčená čočka",                   kj: 150  },
];

// ─────────────────────────────────────────────
// 11. PŘIŘAZENÍ SKUPIN POTRAVIN K TYPU JÍDLA
// ─────────────────────────────────────────────
export function getFoodGroupsForMealType(mealType) {
  switch (mealType) {
    case "breakfast_sweet":
      return { carbGroup: grainCarbs,  protGroup: dairyProtein, fatGroup: nutFat,     frVegGroup: fruit    };
    case "breakfast_savory":
      return { carbGroup: breadCarbs,  protGroup: savoryProtein, fatGroup: spreadFat, frVegGroup: lightVeg };
    case "snack1_sweet":
    case "snack2_sweet":
      return { carbGroup: [],          protGroup: dairyProtein, fatGroup: [],          frVegGroup: fruit    };
    case "snack1_savory":
    case "snack2_savory":
      return { carbGroup: breadCarbs,  protGroup: savoryProtein, fatGroup: spreadFat, frVegGroup: lightVeg };
    case "lunch_meat":
      return { carbGroup: grainCarbs,  protGroup: meatProtein,  fatGroup: cookingFat, frVegGroup: mainVeg  };
    case "lunch_veg":
      return { carbGroup: grainCarbs,  protGroup: vegProtein,   fatGroup: cookingFat, frVegGroup: mainVeg  };
    case "dinner_warm":
      return { carbGroup: grainCarbs,  protGroup: [...vegProtein, ...meatProtein.filter(f => ["kure_prsa","kure_steh","hov_mlete","tunak_st","treska","tilapie","losos","krevety"].includes(f.id))],
               fatGroup: cookingFat, frVegGroup: mainVeg };
    case "dinner_cold":
      return { carbGroup: breadCarbs,  protGroup: savoryProtein, fatGroup: spreadFat, frVegGroup: lightVeg };
    case "dinner2":
      return { carbGroup: [],          protGroup: dairyProtein, fatGroup: nutFat,     frVegGroup: []       };
    case "dinner2_veg":
      return { carbGroup: [],          protGroup: savoryProtein, fatGroup: spreadFat, frVegGroup: mainVeg  };
    default:
      return { carbGroup: grainCarbs,  protGroup: dairyProtein, fatGroup: nutFat,     frVegGroup: fruit    };
  }
}

// ─────────────────────────────────────────────
// 12. GENEROVÁNÍ JÍDELNÍČKU
// ─────────────────────────────────────────────
export function generateMealPlan(clientData) {
  const weight = parseFloat(clientData.weight);
  const height = parseFloat(clientData.height);
  const age    = parseFloat(clientData.age);

  let bmrKj, basePAL, sportKjPerDay, tdeeKj, targetKj;

  if (clientData.energyMode === "manual") {
    targetKj = kcalToKj(parseInt(clientData.manualKcal, 10));
  } else {
    bmrKj         = calculateBMR(weight, height, age, clientData.gender);
    basePAL       = calculateBasePAL(clientData.jobActivity);
    sportKjPerDay = calculateSportKjPerDay(
      clientData.sportType,
      parseInt(clientData.sportDays, 10),
      parseInt(clientData.sportMinutes, 10),
      weight
    );
    tdeeKj   = calculateTDEE(bmrKj, basePAL, sportKjPerDay);
    targetKj = calculateTargetKj(tdeeKj, clientData.goal);
  }

  const macros = calculateMacros(targetKj);
  const meals  = distributeMeals(targetKj, clientData.mealTypes || {
    breakfast: "breakfast_sweet",
    snack1:    "snack1_sweet",
    lunch:     "lunch_meat",
    snack2:    "snack2_sweet",
    dinner:    "dinner_warm",
    dinner2:   "dinner2",
  });

  const mealPlan = meals.map((meal) => {
    const { carbGroup, protGroup, fatGroup, frVegGroup } = getFoodGroupsForMealType(meal.mealType);
    return {
      ...meal,
      carbOptions:  carbGroup.map((f)  => ({ ...f, portionGrams: calculatePortionByEnergy(f.kj, meal.energyCarbs)  })),
      protOptions:  protGroup.map((f)  => ({ ...f, portionGrams: calculatePortionByEnergy(f.kj, meal.energyProt)   })),
      fatOptions:   fatGroup.map((f)   => ({ ...f, portionGrams: calculatePortionByEnergy(f.kj, meal.energyFat)    })),
      frVegOptions: frVegGroup.map((f) => ({ ...f, portionGrams: calculatePortionByEnergy(f.kj, meal.energyFrVeg)  })),
    };
  });

  return {
    clientName:  clientData.name,
    energyMode:  clientData.energyMode,
    goal:        clientData.goal,
    bmrKj:       bmrKj  ? Math.round(bmrKj)  : null,
    bmrKcal:     bmrKj  ? kjToKcal(bmrKj)    : null,
    tdeeKj:      tdeeKj ? Math.round(tdeeKj) : null,
    tdeeKcal:    tdeeKj ? kjToKcal(tdeeKj)   : null,
    targetKj,
    targetKcal:  kjToKcal(targetKj),
    macros,
    mealPlan,
  };
}
