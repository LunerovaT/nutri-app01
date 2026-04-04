// mealConfig.js – konfigurace typů jídel, podíly energie a přiřazení skupin potravin

import {
  breakfastGrainCarbs,
  mainGrainCarbs,
  vegLunchGrainCarbs,
  breadCarbs,
  breakfastDairyProtein,
  snackDairyProtein,
  dinner2DairyProtein,
  savoryProtein,
  savoryProteinNoEgg,
  meatProtein,
  dinnerMeatProtein,
  vegProtein,
  spreadFat,
  nutFat,
  dinner2NutFat,
  cookingFat,
  lunchMeatCookingFat,
  fruit,
  lightVeg,
  snackLightVeg,
  mainVeg,
} from './foods';

// ─────────────────────────────────────────────
// TYPY JÍDEL (pro UI formulář)
// ─────────────────────────────────────────────
export const mealTypeOptions = {
  breakfast: [
    { value: 'breakfast_sweet', label: '🍓 Snídaně sladká' },
    { value: 'breakfast_savory', label: '🥚 Snídaně slaná' },
  ],
  snack1: [
    { value: 'snack1_sweet', label: '🍎 Přesnídávka sladká' },
    { value: 'snack1_savory', label: '🥙 Přesnídávka slaná' },
  ],
  lunch: [
    { value: 'lunch_meat', label: '🥩 Oběd s masem' },
    { value: 'lunch_veg', label: '🥦 Oběd bezmasý' },
  ],
  snack2: [
    { value: 'snack2_sweet', label: '🍊 Svačina sladká' },
    { value: 'snack2_savory', label: '🥒 Svačina slaná' },
  ],
  dinner: [
    { value: 'dinner_warm', label: '🍲 Večeře teplá' },
    { value: 'dinner_cold', label: '🥗 Večeře studená' },
  ],
  dinner2: [
    { value: 'dinner2', label: '🥛 Druhá večeře' },
    { value: 'dinner2_veg', label: '🥬 Druhá večeře zeleninová' },
  ],
};

// ─────────────────────────────────────────────
// PODÍLY ENERGIE SKUPIN POTRAVIN (dle listu "Rozpočet" v excelu)
// ─────────────────────────────────────────────
export const mealEnergyRatios = {
  breakfast_sweet: {
    carbs: 0.45,
    prot: 0.26,
    fat: 0.17,
    frVeg: 0.12,
    frVegLabel: 'Ovoce',
  },
  breakfast_savory: {
    carbs: 0.5,
    prot: 0.25,
    fat: 0.18,
    frVeg: 0.07,
    frVegLabel: 'Zelenina',
  },
  snack1_sweet: {
    carbs: 0.0,
    prot: 0.5,
    fat: 0.0,
    frVeg: 0.5,
    frVegLabel: 'Ovoce',
  },
  snack1_savory: {
    carbs: 0.48,
    prot: 0.23,
    fat: 0.2,
    frVeg: 0.09,
    frVegLabel: 'Zelenina',
  },
  lunch_meat: {
    carbs: 0.48,
    prot: 0.27,
    fat: 0.21,
    frVeg: 0.04,
    frVegLabel: 'Zelenina',
  },
  lunch_veg: {
    carbs: 0.48,
    prot: 0.27,
    fat: 0.21,
    frVeg: 0.04,
    frVegLabel: 'Zelenina',
  },
  snack2_sweet: {
    carbs: 0.0,
    prot: 0.5,
    fat: 0.0,
    frVeg: 0.5,
    frVegLabel: 'Ovoce',
  },
  snack2_savory: {
    carbs: 0.48,
    prot: 0.23,
    fat: 0.2,
    frVeg: 0.09,
    frVegLabel: 'Zelenina',
  },
  dinner_warm: {
    carbs: 0.54,
    prot: 0.22,
    fat: 0.18,
    frVeg: 0.06,
    frVegLabel: 'Zelenina',
  },
  dinner_cold: {
    carbs: 0.5,
    prot: 0.25,
    fat: 0.19,
    frVeg: 0.06,
    frVegLabel: 'Zelenina',
  },
  dinner2: { carbs: 0.0, prot: 0.7, fat: 0.3, frVeg: 0.0, frVegLabel: '' },
  dinner2_veg: {
    carbs: 0.0,
    prot: 0.5,
    fat: 0.2,
    frVeg: 0.3,
    frVegLabel: 'Zelenina',
  },
};

// ─────────────────────────────────────────────
// PŘIŘAZENÍ SKUPIN POTRAVIN K TYPU JÍDLA
// ─────────────────────────────────────────────
export function getFoodGroupsForMealType(mealType) {
  switch (mealType) {
    case 'breakfast_sweet':
      return {
        carbGroup: breakfastGrainCarbs,
        protGroup: breakfastDairyProtein,
        fatGroup: nutFat,
        frVegGroup: fruit,
      };

    case 'breakfast_savory':
      return {
        carbGroup: breadCarbs,
        protGroup: savoryProteinNoEgg,
        fatGroup: spreadFat,
        frVegGroup: lightVeg,
      };

    case 'snack1_sweet':
    case 'snack2_sweet':
      return {
        carbGroup: [],
        protGroup: snackDairyProtein,
        fatGroup: [],
        frVegGroup: fruit,
      };

    case 'snack1_savory':
    case 'snack2_savory':
      return {
        carbGroup: breadCarbs,
        protGroup: savoryProteinNoEgg,
        fatGroup: spreadFat,
        frVegGroup: snackLightVeg,
      };

    case 'lunch_meat':
      return {
        carbGroup: mainGrainCarbs,
        protGroup: meatProtein,
        fatGroup: lunchMeatCookingFat,
        frVegGroup: mainVeg,
      };

    case 'lunch_veg':
      return {
        carbGroup: vegLunchGrainCarbs,
        protGroup: vegProtein,
        fatGroup: cookingFat,
        frVegGroup: mainVeg,
      };

    case 'dinner_warm':
      return {
        carbGroup: mainGrainCarbs,
        protGroup: [...dinnerMeatProtein, ...vegProtein],
        fatGroup: cookingFat,
        frVegGroup: mainVeg,
      };

    case 'dinner_cold':
      return {
        carbGroup: breadCarbs,
        protGroup: savoryProtein,
        fatGroup: spreadFat,
        frVegGroup: lightVeg,
      };

    case 'dinner2':
      return {
        carbGroup: [],
        protGroup: dinner2DairyProtein,
        fatGroup: dinner2NutFat,
        frVegGroup: [],
      };

    case 'dinner2_veg':
      return {
        carbGroup: [],
        protGroup: savoryProteinNoEgg,
        fatGroup: spreadFat,
        frVegGroup: snackLightVeg,
      };

    default:
      return {
        carbGroup: breakfastGrainCarbs,
        protGroup: breakfastDairyProtein,
        fatGroup: nutFat,
        frVegGroup: fruit,
      };
  }
}
