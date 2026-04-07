// pdf/blocks/MealBlock.jsx – jídelníček: všechna jídla se sloupci potravin
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { C, shared } from '../styles';

// ─── KONFIGURACE SLOUPCŮ ──────────────────────────────────────────────────────
const COL_DEFS = [
  {
    key: 'carbOptions',
    energyKey: 'energyCarbs',
    label: 'Sacharidy',
    color: C.orange,
    bg: C.orangeLight,
  },
  {
    key: 'protOptions',
    energyKey: 'energyProt',
    label: 'Bílkoviny',
    color: C.greenDark,
    bg: C.greenLight,
  },
  {
    key: 'fatOptions',
    energyKey: 'energyFat',
    label: 'Tuky',
    color: C.purple,
    bg: C.purpleLight,
  },
  {
    key: 'frVegOptions',
    energyKey: 'energyFrVeg',
    label: null,
    color: C.blue,
    bg: C.blueLight,
  },
];

// ─── LOKÁLNÍ STYLY ────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  mealCard: {
    marginBottom: 10,
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: C.greyMid,
    borderStyle: 'solid',
  },
  mealHeader: {
    backgroundColor: C.greenDark,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  mealName: {
    fontFamily: 'Roboto',
    fontWeight: 700,
    fontSize: 10,
    color: C.white,
  },
  mealKcal: {
    fontFamily: 'Roboto',
    fontWeight: 400,
    fontSize: 8,
    color: C.greenBorder,
  },
  // Sloupce potravin
  columnsRow: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    borderRightWidth: 0.5,
    borderRightColor: C.greyMid,
    borderRightStyle: 'solid',
  },
  columnLast: {
    flex: 1,
  },
  colHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 5,
  },
  colHeaderTitle: {
    fontFamily: 'Roboto',
    fontWeight: 700,
    fontSize: 7.5,
  },
  colHeaderKj: {
    fontFamily: 'Roboto',
    fontWeight: 400,
    fontSize: 7,
  },
  foodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3.5,
    borderTopWidth: 0.3,
    borderTopColor: C.greyMid,
    borderTopStyle: 'solid',
  },
  foodRowAlt: {
    backgroundColor: C.greyLight,
  },
  foodName: {
    fontFamily: 'Roboto',
    fontWeight: 400,
    fontSize: 7.5,
    color: C.black,
    flex: 1,
    paddingRight: 4,
  },
  foodGrams: {
    fontFamily: 'Roboto',
    fontWeight: 700,
    fontSize: 8,
  },
});

// ─── POMOCNÉ KOMPONENTY ───────────────────────────────────────────────────────
function FoodColumn({ foods, energyKj, title, color, bg, isLast }) {
  return (
    <View style={isLast ? s.columnLast : s.column}>
      {/* záhlaví sloupce */}
      <View style={[s.colHeader, { backgroundColor: bg }]}>
        <Text style={[s.colHeaderTitle, { color }]}>{title}</Text>
        <Text style={[s.colHeaderKj, { color }]}>{energyKj} kJ</Text>
      </View>

      {/* potraviny */}
      {foods.map((food, i) => (
        <View
          key={food.id}
          style={[s.foodRow, i % 2 === 1 ? s.foodRowAlt : {}]}
        >
          <Text style={s.foodName}>{food.name}</Text>
          <Text style={[s.foodGrams, { color }]}>{food.portionGrams} g</Text>
        </View>
      ))}
    </View>
  );
}

function MealCard({ meal }) {
  const frVegLabel = meal.frVegLabel || '';
  const frVegTitle =
    frVegLabel === 'Ovoce'
      ? '🍓 Ovoce'
      : frVegLabel
        ? `🥦 ${frVegLabel}`
        : null;

  // Aktivní sloupce: mají potraviny + nenulovou energii
  const activeCols = COL_DEFS.map((col) => ({
    ...col,
    label: col.key === 'frVegOptions' ? frVegTitle : col.label,
    foods: meal[col.key] ?? [],
    energy: meal[col.energyKey] ?? 0,
  })).filter((col) => col.foods.length > 0 && col.energy > 0 && col.label);

  if (activeCols.length === 0) return null;

  return (
    <View style={s.mealCard}>
      {/* Záhlaví jídla */}
      <View style={s.mealHeader}>
        <Text style={s.mealName}>{meal.name}</Text>
        <Text style={s.mealKcal}>
          {meal.totalKcal} kcal · {meal.totalKj} kJ
        </Text>
      </View>

      {/* Sloupce potravin */}
      <View style={s.columnsRow}>
        {activeCols.map((col, i) => (
          <FoodColumn
            key={col.key}
            foods={col.foods}
            energyKj={col.energy}
            title={col.label}
            color={col.color}
            bg={col.bg}
            isLast={i === activeCols.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

// ─── HLAVNÍ EXPORT ────────────────────────────────────────────────────────────
export function MealBlock({ plan }) {
  return (
    <View>
      <Text style={shared.h1}>Váš jídelníček</Text>
      <Text style={shared.bodySmall}>
        Z každého barevného sloupce vyberte jednu potravinu. Gramáže jsou
        uvedeny pro syrový stav potraviny.
      </Text>
      <View style={[shared.dividerGreen, { marginTop: 4, marginBottom: 10 }]} />

      {plan.mealPlan?.map((meal) => (
        <MealCard key={meal.key ?? meal.name} meal={meal} />
      ))}

      {/* Zápatí dokumentu */}
      <View style={[shared.divider, { marginTop: 8 }]} />
      <Text style={shared.small}>
        Jídelníček byl sestaven individuálně na základě vašich osobních údajů a
        cílů. Doporučujeme pravidelné konzultace s nutričním terapeutem pro
        optimální výsledky.
      </Text>
    </View>
  );
}
