// src/data/allergens.js
// 14 legislativně závazných alergenů dle EU nařízení č. 1169/2011
// Každý alergen obsahuje seznam id potravin z foods.js které ho obsahují.
// Potraviny bez zastoupení v databázi mají ids: [] – připraveno pro budoucí rozšíření.

export const ALLERGENS = {
  1: {
    label:   "Obiloviny obsahující lepek",
    desc:    "pšenice (špalda, khorasan), žito, ječmen, oves",
    emoji:   "🌾",
    ids: [
      "toast_cz", "chleb_konz", "chleb_zitn", "knack_zitn", "knack",
      "rohlik_gr", "rohlik_bily", "bageta_vz", "kaiserka", "chleb_slun",
      "tortilla_cz", "vlocky", "spald_vl", "musli",
      "kuskus", "kuskus_cz", "bulgur", "test_sem", "test_cz",
    ],
  },
  2: {
    label: "Korýši a výrobky z nich",
    emoji: "🦞",
    ids:   ["krevety"],
  },
  3: {
    label: "Vejce a výrobky z nich",
    emoji: "🥚",
    ids:   ["vejce"],
  },
  4: {
    label: "Ryby a výrobky z nich",
    emoji: "🐟",
    ids: [
      "tunak_vl", "tunak_olej", "tunak_st",
      "sardinky", "zavinace",
      "treska", "makrela", "tilapie", "losos", "kapr", "pstruh",
    ],
  },
  5: {
    label: "Jádra podzemnice olejné (arašídy) a výrobky z nich",
    emoji: "🥜",
    ids:   ["arasidy"],
  },
  6: {
    label: "Sójové boby a výrobky z nich",
    emoji: "🫘",
    ids:   ["smakoun", "tofu", "tempeh", "robi", "soj_ol"],
  },
  7: {
    label: "Mléko a výrobky z něj (včetně laktózy)",
    emoji: "🥛",
    ids: [
      // Mléka
      "mleko_pol", "mleko_pl", "acidofil", "kefir", "kyska",
      // Jogurty a fermentované
      "jogurt_hol", "jogurt_niz", "jogurt_rec", "jogurt_27", "skyr", "ovofit",
      // Tvarohy
      "tvaroh_odt", "tvaroh_pol",
      // Sýry
      "syr_30", "syr_20", "syr_45", "cottage_l", "mozz_light",
      "parenica", "ostiepok", "taveny_syr", "tvaruzky",
      // Pomazánky a tuky
      "maslo", "maslo_82", "pom_maslo", "rama",
      "ricotta", "lucina", "gervais", "phil_orig", "phil_light",
      // Smetany
      "smet_12", "zak_smet",
      // Čokolády (mohou obsahovat mléko)
      "coko_70", "coko_50",
    ],
  },
  8: {
    label: "Skořápkové plody (ořechy)",
    desc:  "mandle, lískové, vlašské, kešu, pekanové, para, pistácie, makadamie",
    emoji: "🌰",
    ids:   ["vlassk_or", "mandle", "kesu", "liskove"],
  },
  9: {
    label: "Celer a výrobky z něj",
    emoji: "🥬",
    ids:   ["mrkev_mix"],   // "Mrkev, celer, petržel, ředkev" celer obsahuje
  },
  10: {
    label: "Hořčice a výrobky z ní",
    emoji: "🌿",
    ids:   [],  // v aktuální databázi není
  },
  11: {
    label: "Sezamová semena a výrobky z nich",
    emoji: "🌱",
    ids:   ["hummus"],  // hummus obsahuje tahini (sezamová pasta)
  },
  12: {
    label: "Oxid siřičitý a siřičitany (> 10 mg/kg nebo 10 mg/l)",
    emoji: "⚗️",
    ids:   [],  // v aktuální databázi není
  },
  13: {
    label: "Vlčí bob (lupina) a výrobky z něj",
    emoji: "🌼",
    ids:   [],  // v aktuální databázi není
  },
  14: {
    label: "Měkkýši a výrobky z nich",
    emoji: "🦑",
    ids:   [],  // v aktuální databázi není
  },
};

// ─── HELPER FUNKCE ────────────────────────────────────────────────────────────

/**
 * Vrátí set všech food id která jsou zakázána pro dané alergeny.
 * @param {number[]} selectedAllergens – pole čísel alergenů (např. [1, 7])
 * @returns {Set<string>} set zakázaných food id
 */
export function getForbiddenFoodIds(selectedAllergens) {
  const forbidden = new Set();
  for (const num of selectedAllergens) {
    const allergen = ALLERGENS[num];
    if (allergen) {
      allergen.ids.forEach((id) => forbidden.add(id));
    }
  }
  return forbidden;
}

/**
 * Vyfiltruje seznam potravin – odstraní ty které obsahují zakázané alergeny.
 * @param {object[]} foods       – pole potravin z foods.js
 * @param {Set<string>} forbidden – set zakázaných id
 * @returns {object[]} filtrované pole potravin
 */
export function filterFoodsByAllergens(foods, forbidden) {
  if (!forbidden || forbidden.size === 0) return foods;
  return foods.filter((food) => !forbidden.has(food.id));
}
