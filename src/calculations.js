// calculations.js – aktualizovaná verze
// Změny oproti minulé verzi:
//   1. Cíl (goal) je nově v procentech redukce/navýšení místo pevných kcal
//   2. Reálná databáze potravin rozdělená do 4 skupin (snídaně/oběd × bílkoviny/sacharidy)
//   3. Funkce getFoodGroupsForMeal přiřadí správnou skupinu každému jídlu

// ─────────────────────────────────────────────
// 1. BMR (Harris-Benedict, revidovaná verze)
// ─────────────────────────────────────────────
export function calculateBMR(weight, height, age, gender) {
  if (gender === "male") {
    return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  } else {
    return 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age;
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
// 3. SPORT (MET metoda)
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

export function calculateSportCaloriesPerDay(sportType, daysPerWeek, minutesPerSession, weight) {
  if (sportType === "none" || !daysPerWeek || !minutesPerSession) return 0;
  const sport = sportOptions.find((s) => s.value === sportType);
  if (!sport || sport.met === 0) return 0;
  const kcalPerSession = sport.met * weight * (minutesPerSession / 60);
  return (kcalPerSession * daysPerWeek) / 7;
}

// ─────────────────────────────────────────────
// 4. TDEE
// ─────────────────────────────────────────────
export function calculateTDEEDetailed(bmr, basePAL, sportCaloriesPerDay) {
  return bmr * basePAL + sportCaloriesPerDay;
}

// ─────────────────────────────────────────────
// 5. CÍLOVÝ PŘÍJEM – procentuální redukce/navýšení
// ─────────────────────────────────────────────
// Místo pevného deficitu −500 kcal nyní pracujeme s procentuálním
// násobičem. Terapeut zvolí například "Redukce −15 %" a aplikace
// vynásobí TDEE hodnotou 0.85.

export const goalOptions = [
  { value: "maintain", label: "Udržení hmotnosti (0 %)",        multiplier: 1.00 },
  { value: "lose_10",  label: "Redukce −10 %",                  multiplier: 0.90 },
  { value: "lose_15",  label: "Redukce −15 %",                  multiplier: 0.85 },
  { value: "lose_20",  label: "Redukce −20 %",                  multiplier: 0.80 },
  { value: "lose_25",  label: "Redukce −25 %",                  multiplier: 0.75 },
  { value: "gain_10",  label: "Nabírání svalové hmoty (+10 %)", multiplier: 1.10 },
];

export function calculateTargetCalories(tdee, goal) {
  const option = goalOptions.find((o) => o.value === goal);
  const multiplier = option ? option.multiplier : 1.0;
  return Math.round(tdee * multiplier);
}

// ─────────────────────────────────────────────
// 6. MAKROŽIVINY
// ─────────────────────────────────────────────
export function calculateMacros(targetCalories) {
  return {
    protein: Math.round((targetCalories * 0.30) / 4),
    carbs:   Math.round((targetCalories * 0.45) / 4),
    fat:     Math.round((targetCalories * 0.25) / 9),
  };
}

// ─────────────────────────────────────────────
// 7. DENNÍ JÍDLA
// ─────────────────────────────────────────────
export function distributeMeals(targetCalories) {
  const distribution = [
    { name: "Snídaně",           key: "breakfast", ratio: 0.25 },
    { name: "Svačina",           key: "snack1",    ratio: 0.10 },
    { name: "Oběd",              key: "lunch",     ratio: 0.35 },
    { name: "Odpolední svačina", key: "snack2",    ratio: 0.10 },
    { name: "Večeře",            key: "dinner",    ratio: 0.20 },
  ];
  return distribution.map((meal) => ({
    ...meal,
    calories: Math.round(targetCalories * meal.ratio),
    protein:  Math.round((targetCalories * meal.ratio * 0.30) / 4),
    carbs:    Math.round((targetCalories * meal.ratio * 0.45) / 4),
    fat:      Math.round((targetCalories * meal.ratio * 0.25) / 9),
  }));
}

// ─────────────────────────────────────────────
// 8. DATABÁZE POTRAVIN
// ─────────────────────────────────────────────
// Hodnoty jsou na 100 g (nebo 100 ml) potraviny.
// ⚠️  ZKONTROLUJ a uprav hodnoty dle svých nutričních tabulek!
//
// Databáze je rozdělena do 4 skupin:
//   breakfastProtein – bílkoviny pro snídani + svačiny
//   breakfastCarbs   – sacharidy pro snídani + svačiny
//   lunchProtein     – bílkoviny pro oběd + večeři
//   lunchCarbs       – sacharidy pro oběd + večeři

export const foodDatabase = {

  // ── SNÍDANĚ / SVAČINY – BÍLKOVINY ──────────────────────────────────────────
  breakfastProtein: [
    { id: "camembert_linea",    name: "Camembert Linea Président",              kcal: 218, protein: 19.0, carbs: 0.5, fat: 15.0 },
    { id: "cottage",            name: "Cottage",                                kcal: 98,  protein: 11.0, carbs: 3.4, fat: 4.3  },
    { id: "cottage_light",      name: "Cottage light",                          kcal: 72,  protein: 11.5, carbs: 3.0, fat: 1.5  },
    { id: "hermel_figura",      name: "Hermelín Figura",                        kcal: 198, protein: 20.0, carbs: 0.5, fat: 13.0 },
    { id: "jogurt_hollandia",   name: "Jogurt bílý Hollandia",                  kcal: 61,  protein: 3.8,  carbs: 5.2, fat: 2.8  },
    { id: "jogurt_milko_skyr",  name: "Jogurt bílý Milko + SKYR",              kcal: 57,  protein: 8.5,  carbs: 4.5, fat: 0.2  },
    { id: "kefir",              name: "Kefír bílý",                             kcal: 52,  protein: 3.3,  carbs: 4.8, fat: 1.8  },
    { id: "lucina",             name: "Lučina",                                 kcal: 228, protein: 8.5,  carbs: 3.5, fat: 19.5 },
    { id: "lucina_linie",       name: "Lučina linie",                           kcal: 133, protein: 9.5,  carbs: 4.2, fat: 8.5  },
    { id: "maslo",              name: "Máslo",                                  kcal: 740, protein: 0.7,  carbs: 0.7, fat: 82.0 },
    { id: "mozzarella",         name: "Mozzarella",                             kcal: 280, protein: 19.0, carbs: 1.0, fat: 22.0 },
    { id: "mozzarella_light",   name: "Mozzarella light",                       kcal: 168, protein: 18.0, carbs: 1.5, fat: 10.0 },
    { id: "olma_drink",         name: "Olma drink",                             kcal: 55,  protein: 3.5,  carbs: 5.5, fat: 1.8  },
    { id: "milbona_drink",      name: "Milbona drink",                          kcal: 52,  protein: 3.3,  carbs: 5.0, fat: 1.5  },
    { id: "ovofit",             name: "Ovofit tvarohový dezert",                kcal: 88,  protein: 7.5,  carbs: 9.0, fat: 2.2  },
    { id: "philadelphia_light", name: "Philadelphia light",                     kcal: 148, protein: 7.5,  carbs: 4.5, fat: 11.0 },
    { id: "syr_30",             name: "Sýr 30%",                                kcal: 272, protein: 28.0, carbs: 0.5, fat: 17.5 },
    { id: "vesela_krava",       name: "Sýr tavený nízkotučný – Veselá kráva fit", kcal: 155, protein: 12.0, carbs: 9.0, fat: 7.0 },
    { id: "sunka_drubezi",      name: "Šunka drůbeží",                          kcal: 107, protein: 16.5, carbs: 1.5, fat: 3.8  },
    { id: "sunka_vepro",        name: "Šunka vepřová (Dulano, 96 % masa)",      kcal: 99,  protein: 17.5, carbs: 0.5, fat: 3.0  },
    { id: "cream_spread",       name: "Sýrová pomazánka Cream spread light – LIDL", kcal: 130, protein: 9.0, carbs: 5.0, fat: 8.0 },
    { id: "tunak_snidane",      name: "Tuňák ve vlastní šťávě",                 kcal: 116, protein: 26.0, carbs: 0.0, fat: 1.0  },
    { id: "tvaroh_mekky",       name: "Tvaroh měkký",                           kcal: 85,  protein: 13.5, carbs: 3.5, fat: 1.8  },
    { id: "tvaroh_polotucny",   name: "Tvaroh polotučný",                       kcal: 114, protein: 14.5, carbs: 4.0, fat: 4.5  },
    { id: "tvaroh_svacinka",    name: "Tvarohová svačinka Milko",               kcal: 92,  protein: 9.5,  carbs: 8.0, fat: 2.5  },
    { id: "tvaruzky_snidane",   name: "Tvarůžky",                               kcal: 97,  protein: 29.0, carbs: 0.5, fat: 0.6  },
    { id: "vejce_snidane",      name: "Vejce celé (1 vejce = 50 g)",            kcal: 155, protein: 13.0, carbs: 1.1, fat: 11.0 },
  ],

  // ── SNÍDANĚ / SVAČINY – SACHARIDY ──────────────────────────────────────────
  breakfastCarbs: [
    { id: "cerealie_bonavita",  name: "Celozrnné cereálie Bonavita",             kcal: 358, protein: 11.0, carbs: 65.0, fat: 5.0  },
    { id: "dalamánek",          name: "Dalamánek celozrnný",                     kcal: 240, protein: 9.0,  carbs: 44.0, fat: 2.5  },
    { id: "chleb_bily",         name: "Chléb bílý",                              kcal: 265, protein: 8.0,  carbs: 52.0, fat: 1.8  },
    { id: "chleb_zitn",         name: "Chléb tmavý žitný",                       kcal: 220, protein: 7.0,  carbs: 42.0, fat: 1.5  },
    { id: "chleb_penam_vecer",  name: "Chléb Penam večerní",                     kcal: 235, protein: 7.5,  carbs: 44.0, fat: 2.0  },
    { id: "chleb_tastino",      name: "Chléb Tastino (Lidl)",                    kcal: 228, protein: 7.0,  carbs: 43.0, fat: 1.8  },
    { id: "chleb_penam_fit",    name: "Chléb Penam Fit",                         kcal: 218, protein: 8.5,  carbs: 38.0, fat: 2.5  },
    { id: "kaiserka",           name: "Kaiserka",                                kcal: 280, protein: 9.0,  carbs: 55.0, fat: 2.0  },
    { id: "knackebrot",         name: "Knäckebrot",                              kcal: 350, protein: 10.0, carbs: 65.0, fat: 3.0  },
    { id: "musli_mixit_prot",   name: "Müsli MIXIT – proteinové A. Ondry",       kcal: 380, protein: 18.0, carbs: 50.0, fat: 10.0 },
    { id: "musli_mixit_plavky", name: "Müsli MIXIT – do plavek",                kcal: 365, protein: 10.0, carbs: 58.0, fat: 8.0  },
    { id: "musli_emco",         name: "Müsli Emco bez cukru",                   kcal: 370, protein: 11.0, carbs: 57.0, fat: 8.5  },
    { id: "vlocky",             name: "Ovesné vločky",                           kcal: 372, protein: 13.0, carbs: 59.0, fat: 7.0  },
    { id: "toustak_tmavy",      name: "Toustový chléb tmavý",                   kcal: 248, protein: 8.5,  carbs: 44.0, fat: 3.5  },
    { id: "toustak_protein",    name: "Toustový chléb proteinový Penam",        kcal: 245, protein: 14.0, carbs: 35.0, fat: 5.0  },
  ],

  // ── OBĚD / VEČEŘE – BÍLKOVINY ──────────────────────────────────────────────
  lunchProtein: [
    { id: "hermel_figura_ob",   name: "Hermelín – Figura",                       kcal: 198, protein: 20.0, carbs: 0.5, fat: 13.0 },
    { id: "hovezi_vepro",       name: "Hovězí / vepřové maso",                  kcal: 175, protein: 26.0, carbs: 0.0, fat: 7.5  },
    { id: "kapr",               name: "Kapr pečený",                             kcal: 162, protein: 22.0, carbs: 0.0, fat: 8.0  },
    { id: "kralik",             name: "Králík",                                  kcal: 136, protein: 21.0, carbs: 0.0, fat: 5.5  },
    { id: "kure_kruta",         name: "Kuřecí / krůtí prsa",                    kcal: 160, protein: 31.0, carbs: 0.0, fat: 3.5  },
    { id: "losos_steak",        name: "Losos steak",                             kcal: 208, protein: 20.0, carbs: 0.0, fat: 13.0 },
    { id: "makrela_uzena",      name: "Makrela uzená",                           kcal: 232, protein: 23.0, carbs: 0.0, fat: 15.0 },
    { id: "morsky_vlk",         name: "Mořský vlk",                              kcal: 105, protein: 19.5, carbs: 0.0, fat: 2.8  },
    { id: "tvaruzky_obed",      name: "Olomoucké tvarůžky",                      kcal: 97,  protein: 29.0, carbs: 0.5, fat: 0.6  },
    { id: "pangasius",          name: "Pangasius",                               kcal: 83,  protein: 15.0, carbs: 0.0, fat: 2.5  },
    { id: "pstruh",             name: "Pstruh",                                  kcal: 119, protein: 20.5, carbs: 0.0, fat: 4.0  },
    { id: "pstruh_losos",       name: "Pstruh lososovitý",                       kcal: 135, protein: 21.0, carbs: 0.0, fat: 5.5  },
    { id: "rybi_file",          name: "Rybí filé",                               kcal: 90,  protein: 18.5, carbs: 0.0, fat: 1.8  },
    { id: "sardinky",           name: "Sardinky ve vlastní šťávě",               kcal: 135, protein: 23.0, carbs: 0.0, fat: 5.0  },
    { id: "tofu",               name: "Sójové tofu",                             kcal: 76,  protein: 8.0,  carbs: 1.9, fat: 4.8  },
    { id: "smakoun",            name: "Šmakoun",                                 kcal: 220, protein: 14.0, carbs: 4.0, fat: 16.0 },
    { id: "teleci",             name: "Telecí kýta",                             kcal: 130, protein: 23.0, carbs: 0.0, fat: 4.0  },
    { id: "tunak_obed",         name: "Tuňák ve vlastní šťávě",                  kcal: 116, protein: 26.0, carbs: 0.0, fat: 1.0  },
    { id: "vejce_obed",         name: "Vejce celé",                              kcal: 155, protein: 13.0, carbs: 1.1, fat: 11.0 },
  ],

  // ── OBĚD / VEČEŘE – SACHARIDY ──────────────────────────────────────────────
  // ⚠️ Gramáže se počítají vždy ze syrové hmotnosti, ale při vaření se
  // mění objem. "Vařené" položky jsou tu pro orientaci klienta – terapeut
  // si může vybrat, jakou formu zadá.
  lunchCarbs: [
    { id: "bataty",             name: "Batáty (vařené)",                         kcal: 86,  protein: 1.6,  carbs: 20.0, fat: 0.1 },
    { id: "bramborova_kase",    name: "Bramborová kaše",                         kcal: 90,  protein: 2.0,  carbs: 18.0, fat: 1.5 },
    { id: "brambory_varene",    name: "Brambory vařené",                         kcal: 87,  protein: 1.9,  carbs: 20.0, fat: 0.1 },
    { id: "bulgur_syrovy",      name: "Bulgur syrový",                           kcal: 342, protein: 12.0, carbs: 70.0, fat: 1.3 },
    { id: "bulgur_vareny",      name: "Bulgur vařený",                           kcal: 83,  protein: 3.1,  carbs: 18.0, fat: 0.2 },
    { id: "jahly_syrove",       name: "Jáhly syrové",                            kcal: 378, protein: 11.0, carbs: 73.0, fat: 4.2 },
    { id: "jahly_varene",       name: "Jáhly vařené",                            kcal: 119, protein: 3.5,  carbs: 23.0, fat: 1.0 },
    { id: "kroupy_surove",      name: "Kroupy syrové",                           kcal: 352, protein: 9.5,  carbs: 74.0, fat: 1.5 },
    { id: "kroupy_varene",      name: "Kroupy vařené",                           kcal: 123, protein: 2.3,  carbs: 28.0, fat: 0.4 },
    { id: "kuskus_syrovy",      name: "Kuskus syrový",                           kcal: 376, protein: 13.0, carbs: 73.0, fat: 1.8 },
    { id: "kuskus_vareny",      name: "Kuskus vařený",                           kcal: 112, protein: 3.8,  carbs: 23.0, fat: 0.2 },
    { id: "lusteniny_surove",   name: "Luštěniny syrové",                        kcal: 340, protein: 22.0, carbs: 57.0, fat: 1.5 },
    { id: "lusteniny_varene",   name: "Luštěniny vařené",                        kcal: 116, protein: 8.0,  carbs: 19.0, fat: 0.5 },
    { id: "pohanka_syrova",     name: "Pohanka syrová",                          kcal: 343, protein: 13.0, carbs: 72.0, fat: 3.4 },
    { id: "ryze_syrova",        name: "Rýže syrová",                             kcal: 365, protein: 7.0,  carbs: 79.0, fat: 0.7 },
    { id: "ryze_varena",        name: "Rýže vařená",                             kcal: 130, protein: 2.7,  carbs: 28.0, fat: 0.3 },
    { id: "testoviny_surove",   name: "Těstoviny syrové",                        kcal: 350, protein: 13.0, carbs: 68.0, fat: 2.0 },
    { id: "testoviny_varene",   name: "Těstoviny vařené",                        kcal: 131, protein: 5.0,  carbs: 25.0, fat: 1.1 },
  ],
};

// ─────────────────────────────────────────────
// 9. PŘIŘAZENÍ POTRAVIN K JÍDLU
// ─────────────────────────────────────────────
// Snídaně a obě svačiny → skupina "breakfast"
// Oběd a večeře         → skupina "lunch"

export function getFoodGroupsForMeal(mealKey) {
  const breakfastMeals = ["breakfast", "snack1", "snack2"];
  if (breakfastMeals.includes(mealKey)) {
    return { proteinGroup: foodDatabase.breakfastProtein, carbGroup: foodDatabase.breakfastCarbs };
  } else {
    return { proteinGroup: foodDatabase.lunchProtein,     carbGroup: foodDatabase.lunchCarbs     };
  }
}

// ─────────────────────────────────────────────
// 10. GRAMÁŽE
// ─────────────────────────────────────────────
export function calculatePortionSize(food, targetMacroGrams, macroKey) {
  const macroPer100g = food[macroKey];
  if (!macroPer100g || macroPer100g === 0) return 0;
  return Math.round(((targetMacroGrams / macroPer100g) * 100) / 5) * 5;
}

// ─────────────────────────────────────────────
// 11. GENEROVÁNÍ JÍDELNÍČKU
// ─────────────────────────────────────────────
export function generateMealPlan(clientData) {
  const weight = parseFloat(clientData.weight);
  const height = parseFloat(clientData.height);
  const age    = parseFloat(clientData.age);

  let bmr, basePAL, sportKcalPerDay, tdee, targetCalories;

  if (clientData.energyMode === "manual") {
    targetCalories = parseInt(clientData.manualKcal, 10);
  } else {
    bmr             = calculateBMR(weight, height, age, clientData.gender);
    basePAL         = calculateBasePAL(clientData.jobActivity);
    sportKcalPerDay = calculateSportCaloriesPerDay(
      clientData.sportType,
      parseInt(clientData.sportDays, 10),
      parseInt(clientData.sportMinutes, 10),
      weight
    );
    tdee           = calculateTDEEDetailed(bmr, basePAL, sportKcalPerDay);
    targetCalories = calculateTargetCalories(tdee, clientData.goal);
  }

  const macros   = calculateMacros(targetCalories);
  const meals    = distributeMeals(targetCalories);

  const mealPlan = meals.map((meal) => {
    const { proteinGroup, carbGroup } = getFoodGroupsForMeal(meal.key);
    return {
      ...meal,
      proteinOptions: proteinGroup.map((food) => ({
        ...food,
        portionGrams: calculatePortionSize(food, meal.protein, "protein"),
      })),
      carbOptions: carbGroup.map((food) => ({
        ...food,
        portionGrams: calculatePortionSize(food, meal.carbs, "carbs"),
      })),
    };
  });

  return {
    clientName:      clientData.name,
    energyMode:      clientData.energyMode,
    goal:            clientData.goal,
    bmr:             bmr             ? Math.round(bmr)                 : null,
    basePAL:         basePAL         ? Math.round(basePAL * 100) / 100 : null,
    sportKcalPerDay: sportKcalPerDay ? Math.round(sportKcalPerDay)     : null,
    tdee:            tdee            ? Math.round(tdee)                : null,
    targetCalories,
    macros,
    mealPlan,
  };
}
