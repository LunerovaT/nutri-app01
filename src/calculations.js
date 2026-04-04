import {
  getFoodGroupsForMealType,
  mealEnergyRatios,
  mealTypeOptions,
} from './data/mealConfig';

export { mealTypeOptions, mealEnergyRatios } from './data/mealConfig';

// ─────────────────────────────────────────────
// KONVERZE
// ─────────────────────────────────────────────
export const KCAL_TO_KJ = 4.184;
export function kcalToKj(kcal) {
  return Math.round(kcal * KCAL_TO_KJ);
}
export function kjToKcal(kj) {
  return Math.round(kj / KCAL_TO_KJ);
}

// ─────────────────────────────────────────────
// 1. BMR v kJ (Mifflin-St Jeor)
// ─────────────────────────────────────────────
export function calculateBMR(weight, height, age, gender) {
  if (gender === 'male') {
    return (
      (88.362 + 13.397 * weight + 4.799 * height - 5.677 * age) * KCAL_TO_KJ
    );
  } else {
    return (
      (447.593 + 9.247 * weight + 3.098 * height - 4.33 * age) * KCAL_TO_KJ
    );
  }
}

// ─────────────────────────────────────────────
// 2. PRACOVNÍ AKTIVITA
// ─────────────────────────────────────────────
export const jobActivityOptions = [
  {
    value: 'sedentary',
    label: 'Sedavá práce (kancelář, programátor, řidič)',
    palWork: 1.2,
  },
  {
    value: 'light',
    label: 'Lehká práce (učitel, obchodní zástupce, prodavač)',
    palWork: 1.5,
  },
  {
    value: 'moderate',
    label: 'Středně náročná (řemeslník, kuchař, zdravotní sestra)',
    palWork: 1.8,
  },
  {
    value: 'heavy',
    label: 'Těžká fyzická práce (stavebnictví, zemědělství, stěhování)',
    palWork: 2.2,
  },
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
  { value: 'none', label: 'Žádná sportovní aktivita', met: 0 },
  { value: 'walk_slow', label: 'Chůze pomalá (< 4 km/h)', met: 2.8 },
  { value: 'walk_mod', label: 'Chůze střední tempo (4–5 km/h)', met: 3.8 },
  { value: 'walk_brisk', label: 'Chůze svižná (5–6 km/h)', met: 4.8 },
  { value: 'nordic_walk', label: 'Nordic walking', met: 4.8 },
  { value: 'hike', label: 'Turistika / hiking', met: 6.0 },
  { value: 'jog', label: 'Jogging (pomalý běh)', met: 7.5 },
  { value: 'run_mod', label: 'Běh střední tempo (8–9 km/h)', met: 9.3 },
  { value: 'run_fast', label: 'Běh rychlý (10–12 km/h)', met: 11.0 },
  { value: 'run_comp', label: 'Běh závodní / intervalový', met: 13.0 },
  { value: 'bike_leisure', label: 'Kolo rekreační (< 16 km/h)', met: 4.0 },
  { value: 'bike_mod', label: 'Kolo střední tempo (16–19 km/h)', met: 6.8 },
  { value: 'bike_fast', label: 'Kolo rychlé (20–22 km/h)', met: 10.0 },
  { value: 'bike_stat', label: 'Spinningové / stacionární kolo', met: 8.0 },
  {
    value: 'weights_light',
    label: 'Posilovna – lehká váha (8–15 opakování)',
    met: 3.5,
  },
  {
    value: 'weights_mod',
    label: 'Posilovna – střední zátěž (dřepy, mrtvý tah)',
    met: 5.0,
  },
  {
    value: 'weights_heavy',
    label: 'Posilovna – těžká váha / kulturistika',
    met: 6.0,
  },
  { value: 'circuit', label: 'Kruhový trénink', met: 7.5 },
  { value: 'hiit', label: 'HIIT / intervalový trénink', met: 8.5 },
  { value: 'crossfit', label: 'CrossFit / funkční trénink', met: 9.0 },
  { value: 'kettlebell', label: 'Kettlebell', met: 9.8 },
  { value: 'swim_slow', label: 'Plavání rekreační', met: 5.8 },
  { value: 'swim_mod', label: 'Plavání střední tempo', met: 8.0 },
  { value: 'swim_fast', label: 'Plavání rychlé / soutěžní', met: 10.0 },
  { value: 'water_aerobic', label: 'Aqua aerobik', met: 5.5 },
  { value: 'football', label: 'Fotbal', met: 7.0 },
  { value: 'basketball', label: 'Basketbal', met: 6.5 },
  { value: 'volleyball', label: 'Volejbal (rekreační)', met: 3.0 },
  { value: 'tennis_single', label: 'Tenis – dvouhra', met: 8.0 },
  { value: 'tennis_double', label: 'Tenis – čtyřhra', met: 6.0 },
  { value: 'badminton', label: 'Badminton (rekreační)', met: 5.5 },
  { value: 'badminton_comp', label: 'Badminton (soutěžní)', met: 7.0 },
  {
    value: 'martial_arts',
    label: 'Bojové sporty (karate, judo, box…)',
    met: 10.3,
  },
  { value: 'yoga', label: 'Jóga / pilates', met: 2.8 },
  { value: 'yoga_power', label: 'Jóga silová / hot jóga', met: 4.0 },
  { value: 'dance_mod', label: 'Tanec (aerobní, salsa, zumba…)', met: 5.0 },
  { value: 'dance_vig', label: 'Tanec (intenzivní, soutěžní)', met: 7.3 },
  { value: 'ski_alpine', label: 'Lyžování sjezdové', met: 6.3 },
  { value: 'ski_nordic', label: 'Běžky', met: 9.0 },
  { value: 'ice_skate', label: 'Bruslení na ledě', met: 7.0 },
  { value: 'rowing', label: 'Veslování / veslovací trenažér', met: 7.5 },
  { value: 'elliptical', label: 'Eliptický trenažér', met: 5.0 },
  { value: 'jump_rope', label: 'Skákání přes švihadlo', met: 11.0 },
  { value: 'aerobic_class', label: 'Aerobik / step aerobik', met: 7.3 },
  { value: 'climbing', label: 'Horolezectví / bouldering', met: 8.0 },
];

export function calculateSportKjPerDay(
  sportType,
  daysPerWeek,
  minutesPerSession,
  weight,
) {
  if (sportType === 'none' || !daysPerWeek || !minutesPerSession) return 0;
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
  { value: 'maintain', label: 'Udržení hmotnosti (0 %)', multiplier: 1.0 },
  { value: 'lose_10', label: 'Redukce −10 %', multiplier: 0.9 },
  { value: 'lose_15', label: 'Redukce −15 %', multiplier: 0.85 },
  { value: 'lose_20', label: 'Redukce −20 %', multiplier: 0.8 },
  { value: 'lose_25', label: 'Redukce −25 %', multiplier: 0.75 },
  {
    value: 'gain_10',
    label: 'Nabírání svalové hmoty (+10 %)',
    multiplier: 1.1,
  },
];

export function calculateTargetKj(tdeeKj, goal) {
  const option = goalOptions.find((o) => o.value === goal);
  return Math.round(tdeeKj * (option ? option.multiplier : 1.0));
}

// ─────────────────────────────────────────────
// 6. MAKROŽIVINY v gramech
// ─────────────────────────────────────────────
export function calculateMacros(targetKj) {
  return {
    protein: Math.round((targetKj * 0.275) / 17),
    carbs: Math.round((targetKj * 0.475) / 17),
    fat: Math.round((targetKj * 0.2) / 37),
  };
}

// ─────────────────────────────────────────────
// 7. ROZDĚLENÍ ENERGIE NA JÍDLA
// ─────────────────────────────────────────────
export function distributeMeals(targetKj, mealTypes, customRatios = {}) {
  const distribution = [
    { name: 'Snídaně', key: 'breakfast', ratio: 0.2 },
    { name: 'Přesnídávka', key: 'snack1', ratio: 0.1 },
    { name: 'Oběd', key: 'lunch', ratio: 0.35 },
    { name: 'Svačina', key: 'snack2', ratio: 0.1 },
    { name: 'Večeře', key: 'dinner', ratio: 0.2 },
    { name: 'Druhá večeře', key: 'dinner2', ratio: 0.05 },
  ];

  const results = [];

  for (const meal of distribution) {
    const totalKj = Math.round(targetKj * meal.ratio);
    const rawTypes = mealTypes[meal.key] || [`${meal.key}_sweet`];
    const typeList = Array.isArray(rawTypes) ? rawTypes : [rawTypes];

    if (typeList.length === 0) continue;

    // Každá varianta dostane PLNOU energii jídla – klient si vybere jednu z nich.
    const kjPerVariant = totalKj;

    for (const mealType of typeList) {
      const defaults =
        mealEnergyRatios[mealType] || mealEnergyRatios.breakfast_sweet;
      const custom = customRatios[mealType] || {};
      const ratios = {
        carbs: custom.carbs ?? defaults.carbs,
        prot: custom.prot ?? defaults.prot,
        fat: custom.fat ?? defaults.fat,
        frVeg: custom.frVeg ?? defaults.frVeg,
        frVegLabel: defaults.frVegLabel,
      };

      const variantLabel =
        mealTypeOptions[meal.key]?.find((o) => o.value === mealType)?.label ||
        mealType;

      results.push({
        ...meal,
        name:
          typeList.length > 1 ? `${meal.name} (${variantLabel})` : meal.name,
        key: `${meal.key}_${mealType}`,
        mealType,
        totalKj: kjPerVariant,
        totalKcal: kjToKcal(kjPerVariant),
        energyCarbs: Math.round(kjPerVariant * ratios.carbs),
        energyProt: Math.round(kjPerVariant * ratios.prot),
        energyFat: Math.round(kjPerVariant * ratios.fat),
        energyFrVeg: Math.round(kjPerVariant * ratios.frVeg),
        frVegLabel: ratios.frVegLabel,
      });
    }
  }

  return results;
}

// ─────────────────────────────────────────────
// 8. VÝPOČET GRAMÁŽE PŘES ENERGII
// ─────────────────────────────────────────────
export function calculatePortionByEnergy(foodKjPer100g, portionEnergyKj) {
  if (!foodKjPer100g || foodKjPer100g === 0 || portionEnergyKj === 0) return 0;
  const rawGrams = (portionEnergyKj / foodKjPer100g) * 100;
  return Math.round(rawGrams / 5) * 5;
}

// ─────────────────────────────────────────────
// 9. GENEROVÁNÍ JÍDELNÍČKU
// ─────────────────────────────────────────────
export function generateMealPlan(clientData) {
  const weight = parseFloat(clientData.weight);
  const height = parseFloat(clientData.height);
  const age = parseFloat(clientData.age);

  let bmrKj, basePAL, sportKjPerDay, tdeeKj, targetKj;

  if (clientData.energyMode === 'manual') {
    targetKj = kcalToKj(parseInt(clientData.manualKcal, 10));
  } else {
    bmrKj = calculateBMR(weight, height, age, clientData.gender);
    basePAL = calculateBasePAL(clientData.jobActivity);
    sportKjPerDay = calculateSportKjPerDay(
      clientData.sportType,
      parseInt(clientData.sportDays, 10),
      parseInt(clientData.sportMinutes, 10),
      weight,
    );
    tdeeKj = calculateTDEE(bmrKj, basePAL, sportKjPerDay);
    targetKj = calculateTargetKj(tdeeKj, clientData.goal);
  }

  if (clientData.overrideKj && parseInt(clientData.overrideKj) > 0) {
    targetKj = parseInt(clientData.overrideKj);
  }

  const macros = calculateMacros(targetKj);
  const meals = distributeMeals(
    targetKj,
    clientData.mealTypes || {
      breakfast: ['breakfast_sweet'],
      snack1: ['snack1_sweet'],
      lunch: ['lunch_meat'],
      snack2: ['snack2_sweet'],
      dinner: ['dinner_warm'],
      dinner2: ['dinner2'],
    },
    clientData.customRatios || {},
  );

  const mealPlan = meals.map((meal) => {
    const { carbGroup, protGroup, fatGroup, frVegGroup } =
      getFoodGroupsForMealType(meal.mealType);
    return {
      ...meal,
      carbOptions: carbGroup.map((f) => ({
        ...f,
        portionGrams: calculatePortionByEnergy(f.kj, meal.energyCarbs),
      })),
      protOptions: protGroup.map((f) => ({
        ...f,
        portionGrams: calculatePortionByEnergy(f.kj, meal.energyProt),
      })),
      fatOptions: fatGroup.map((f) => ({
        ...f,
        portionGrams: calculatePortionByEnergy(f.kj, meal.energyFat),
      })),
      frVegOptions: frVegGroup.map((f) => ({
        ...f,
        portionGrams: calculatePortionByEnergy(f.kj, meal.energyFrVeg),
      })),
    };
  });

  return {
    clientName: clientData.name,
    energyMode: clientData.energyMode,
    goal: clientData.goal,
    bmrKj: bmrKj ? Math.round(bmrKj) : null,
    bmrKcal: bmrKj ? kjToKcal(bmrKj) : null,
    tdeeKj: tdeeKj ? Math.round(tdeeKj) : null,
    tdeeKcal: tdeeKj ? kjToKcal(tdeeKj) : null,
    targetKj,
    targetKcal: kjToKcal(targetKj),
    macros,
    mealPlan,
  };
}
