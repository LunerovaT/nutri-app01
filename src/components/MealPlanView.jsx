// MealPlanView.jsx – kompletní verze se 4 sloupci potravin
export default function MealPlanView({ plan, onReset, onNewClient }) {
  return (
    <div style={s.page}>
      {/* HLAVIČKA */}
      <div style={s.header}>
        <div>
          <h2 style={s.clientName}>🥗 Jídelníček: {plan.clientName}</h2>
          <p style={s.subtitle}>
            Cílový příjem:{' '}
            <strong>
              {plan.targetKcal} kcal / {plan.targetKj} kJ denně
            </strong>
          </p>
        </div>
        <div style={s.headerBtns}>
          <button onClick={onReset} style={s.outlineBtn}>
            ← Seznam klientů
          </button>
          <button onClick={onNewClient} style={s.solidBtn}>
            + Nový klient
          </button>
        </div>
      </div>

      {/* SOUHRN */}
      <div style={s.summaryGrid}>
        {plan.energyMode === 'calculate' && (
          <SummaryCard title="📊 Energetika">
            <Row
              label="BMR"
              value={`${plan.bmrKcal} kcal / ${plan.bmrKj} kJ`}
            />
            <Row
              label="TDEE (vč. DIT)"
              value={`${plan.tdeeKcal} kcal / ${plan.tdeeKj} kJ`}
            />
            <Row
              label="Cílový příjem"
              value={`${plan.targetKcal} kcal / ${plan.targetKj} kJ`}
              highlight
            />
          </SummaryCard>
        )}
        <SummaryCard title="🥩 Makroživiny / den">
          <Row label="Bílkoviny" value={`${plan.macros.protein} g`} />
          <Row label="Sacharidy" value={`${plan.macros.carbs} g`} />
          <Row label="Tuky" value={`${plan.macros.fat} g`} />
        </SummaryCard>
        <SummaryCard title="ℹ️ Jak číst jídelníček">
          <p style={s.legendText}>
            Z každého sloupce vyberte <strong>jednu potravinu</strong>. Při
            výběru více potravin z jednoho sloupce upravte jejich množství
            úměrně — celkový příjem energie ze skupiny musí zůstat stejný.
          </p>
        </SummaryCard>
      </div>

      {/* JÍDLA */}
      {plan.mealPlan.map((meal) => (
        <MealCard key={meal.key} meal={meal} />
      ))}

      <div style={s.bottomBtns}>
        <button onClick={onReset} style={s.outlineBtn}>
          ← Seznam klientů
        </button>
        <button onClick={onNewClient} style={s.solidBtn}>
          + Nový klient
        </button>
      </div>
    </div>
  );
}

function MealCard({ meal }) {
  // Zjistíme které sloupce mají data
  const hasCarbs =
    (meal.carbOptions?.length ?? 0) > 0 && (meal.energyCarbs ?? 0) > 0;
  const hasProt =
    (meal.protOptions?.length ?? 0) > 0 && (meal.energyProt ?? 0) > 0;
  const hasFat =
    (meal.fatOptions?.length ?? 0) > 0 && (meal.energyFat ?? 0) > 0;
  const hasFrVeg =
    (meal.frVegOptions?.length ?? 0) > 0 && (meal.energyFrVeg ?? 0) > 0;

  const activeCols = [hasCarbs, hasProt, hasFat, hasFrVeg].filter(
    Boolean,
  ).length;
  const colWidth = activeCols > 0 ? `${Math.floor(100 / activeCols)}%` : '100%';

  return (
    <div style={s.mealCard}>
      <div style={s.mealHeader}>
        <span style={s.mealName}>{meal.name}</span>
        <span style={s.mealMeta}>
          {meal.totalKcal} kcal · {meal.totalKj} kJ
        </span>
      </div>

      <div style={s.columns}>
        {hasCarbs && (
          <FoodColumn
            title="🍞 Sacharidy"
            items={meal.carbOptions}
            color="#b5541b"
            bgColor="#fdf1e8"
            energyKj={meal.energyCarbs}
            width={colWidth}
            borderRight
          />
        )}
        {hasProt && (
          <FoodColumn
            title="🥩 Bílkoviny"
            items={meal.protOptions}
            color="#2d6a4f"
            bgColor="#e8f5ee"
            energyKj={meal.energyProt}
            width={colWidth}
            borderRight={hasFat || hasFrVeg}
          />
        )}
        {hasFat && (
          <FoodColumn
            title="🥑 Tuky"
            items={meal.fatOptions}
            color="#7b4fa6"
            bgColor="#f3edf8"
            energyKj={meal.energyFat}
            width={colWidth}
            borderRight={hasFrVeg}
          />
        )}
        {hasFrVeg && (
          <FoodColumn
            title={meal.frVegLabel === 'Ovoce' ? '🍓 Ovoce' : '🥦 Zelenina'}
            items={meal.frVegOptions}
            color="#1a6b8a"
            bgColor="#e8f4f8"
            energyKj={meal.energyFrVeg}
            width={colWidth}
            borderRight={false}
          />
        )}
      </div>
    </div>
  );
}

function FoodColumn({
  title,
  items,
  color,
  bgColor,
  energyKj,
  width,
  borderRight,
}) {
  return (
    <div
      style={{ width, borderRight: borderRight ? '1px solid #f0f0f0' : 'none' }}
    >
      <div style={{ ...s.colHeader, background: bgColor, color }}>
        <span>{title}</span>
        <span style={s.colEnergy}>{energyKj} kJ</span>
      </div>
      {items.map((food) => (
        <div key={food.id} style={s.foodRow}>
          <span style={s.foodName}>{food.name}</span>
          <span style={{ ...s.foodGrams, color }}>{food.portionGrams} g</span>
        </div>
      ))}
    </div>
  );
}

function SummaryCard({ title, children }) {
  return (
    <div style={s.summaryCard}>
      <div style={s.summaryTitle}>{title}</div>
      {children}
    </div>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div style={s.summaryRow}>
      <span style={s.summaryLabel}>{label}</span>
      <span
        style={
          highlight
            ? { ...s.summaryValue, color: '#2d6a4f', fontWeight: 700 }
            : s.summaryValue
        }
      >
        {value}
      </span>
    </div>
  );
}

const s = {
  page: {
    maxWidth: 1000,
    margin: '0 auto',
    padding: '20px 16px 60px',
    fontFamily: 'sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 12,
  },
  clientName: { margin: 0, color: '#2d6a4f', fontSize: 22 },
  subtitle: { margin: '4px 0 0', color: '#555', fontSize: 14 },
  headerBtns: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  outlineBtn: {
    padding: '9px 18px',
    background: 'transparent',
    border: '2px solid #2d6a4f',
    color: '#2d6a4f',
    borderRadius: 8,
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: 14,
  },
  solidBtn: {
    padding: '9px 18px',
    background: '#2d6a4f',
    border: '2px solid #2d6a4f',
    color: '#fff',
    borderRadius: 8,
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: 14,
  },
  bottomBtns: {
    display: 'flex',
    gap: 10,
    justifyContent: 'center',
    marginTop: 32,
    flexWrap: 'wrap',
  },

  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 14,
    marginBottom: 28,
  },
  summaryCard: {
    background: '#fff',
    border: '1px solid #e0ece4',
    borderRadius: 10,
    padding: '14px 16px',
  },
  summaryTitle: {
    fontWeight: 700,
    fontSize: 13,
    color: '#2d6a4f',
    marginBottom: 10,
    paddingBottom: 6,
    borderBottom: '1px solid #e8f5ee',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 13,
    padding: '3px 0',
  },
  summaryLabel: { color: '#666' },
  summaryValue: { fontWeight: 600, color: '#333' },
  legendText: { margin: 0, fontSize: 13, color: '#555', lineHeight: 1.6 },

  mealCard: {
    background: '#fff',
    borderRadius: 12,
    border: '1px solid #e0ece4',
    marginBottom: 16,
    overflow: 'hidden',
  },
  mealHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    background: '#f0f8f3',
    flexWrap: 'wrap',
    gap: 6,
  },
  mealName: { fontWeight: 700, fontSize: 15, color: '#1a3d2b' },
  mealMeta: { fontSize: 13, color: '#666' },
  columns: { display: 'flex', flexWrap: 'nowrap', overflowX: 'auto' },

  colHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  colEnergy: { fontSize: 11, fontWeight: 600, opacity: 0.8 },
  foodRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '7px 12px',
    borderBottom: '1px solid #f5f5f5',
    fontSize: 13,
  },
  foodName: { color: '#333', flex: 1, paddingRight: 8, fontSize: 12 },
  foodGrams: { fontWeight: 700, whiteSpace: 'nowrap', fontSize: 13 },
};
