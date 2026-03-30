// MealPlanView.jsx – aktualizovaná verze
// Změna: přibyla dvě tlačítka – "← Seznam klientů" a "＋ Nový klient"

export default function MealPlanView({ plan, onReset, onNewClient }) {
  return (
    <div style={s.page}>

      {/* ── HLAVIČKA ─────────────────────────────────── */}
      <div style={s.header}>
        <div>
          <h2 style={s.clientName}>🥗 Jídelníček pro: {plan.clientName}</h2>
          <p style={s.subtitle}>
            Cílový příjem: <strong>{plan.targetCalories} kcal / den</strong>
          </p>
        </div>

        {/* Navigační tlačítka */}
        <div style={s.headerButtons}>
          <button onClick={onReset} style={s.listBtn}>
            ← Seznam klientů
          </button>
          <button onClick={onNewClient} style={s.newClientBtn}>
            + Nový klient
          </button>
        </div>
      </div>

      {/* ── SOUHRN VÝPOČTU ────────────────────────────── */}
      <div style={s.summaryGrid}>

        {plan.energyMode === "calculate" && (
          <SummaryCard title="📊 Energetika">
            <Row label="BMR"               value={`${plan.bmr} kcal`} />
            <Row label="Pracovní PAL"      value={plan.basePAL} />
            <Row label="Sport (prům./den)" value={`${plan.sportKcalPerDay} kcal`} />
            <Row label="TDEE"              value={`${plan.tdee} kcal`} />
            <Row label="Cílový příjem"     value={`${plan.targetCalories} kcal`} highlight />
          </SummaryCard>
        )}

        <SummaryCard title="🥩 Makroživiny / den">
          <Row label="Bílkoviny" value={`${plan.macros.protein} g`} />
          <Row label="Sacharidy" value={`${plan.macros.carbs} g`} />
          <Row label="Tuky"      value={`${plan.macros.fat} g`} />
        </SummaryCard>

        <SummaryCard title="ℹ️ Jak číst jídelníček">
          <p style={s.legendText}>
            U každého jídla najdete dva sloupce. <strong>Vlevo</strong> jsou
            zdroje bílkovin s gramáží, <strong>vpravo</strong> zdroje sacharidů.
            Klient si potraviny kombinuje podle chuti – vždy jednu z levého
            a jednu z pravého sloupce.
          </p>
        </SummaryCard>
      </div>

      {/* ── JÍDLA ────────────────────────────────────── */}
      {plan.mealPlan.map((meal) => (
        <MealCard key={meal.key} meal={meal} />
      ))}

      {/* Tlačítka i na konci stránky pro pohodlí */}
      <div style={s.bottomButtons}>
        <button onClick={onReset} style={s.listBtn}>
          ← Seznam klientů
        </button>
        <button onClick={onNewClient} style={s.newClientBtn}>
          + Nový klient
        </button>
      </div>

    </div>
  );
}

// ── Karta jednoho jídla ──────────────────────────────────────────────────────
function MealCard({ meal }) {
  return (
    <div style={s.mealCard}>
      <div style={s.mealHeader}>
        <span style={s.mealName}>{meal.name}</span>
        <span style={s.mealMacros}>
          {meal.calories} kcal &nbsp;·&nbsp;
          B: {meal.protein} g &nbsp;·&nbsp;
          S: {meal.carbs} g &nbsp;·&nbsp;
          T: {meal.fat} g
        </span>
      </div>

      <div style={s.columns}>
        <div style={s.column}>
          <div style={{ ...s.columnHeader, ...s.columnHeaderProtein }}>
            🥩 Zdroje bílkovin
          </div>
          {meal.proteinOptions.map((food) => (
            <FoodRow key={food.id} food={food} accentColor="#2d6a4f" />
          ))}
        </div>

        <div style={s.column}>
          <div style={{ ...s.columnHeader, ...s.columnHeaderCarbs }}>
            🍞 Zdroje sacharidů
          </div>
          {meal.carbOptions.map((food) => (
            <FoodRow key={food.id} food={food} accentColor="#b5541b" />
          ))}
        </div>
      </div>
    </div>
  );
}

function FoodRow({ food, accentColor }) {
  return (
    <div style={s.foodRow}>
      <span style={s.foodName}>{food.name}</span>
      <span style={{ ...s.foodGrams, color: accentColor }}>
        {food.portionGrams} g
      </span>
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
      <span style={highlight ? s.summaryValueBold : s.summaryValue}>{value}</span>
    </div>
  );
}

// ── Styly ────────────────────────────────────────────────────────────────────
const s = {
  page: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "20px 16px 60px",
    fontFamily: "sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    flexWrap: "wrap",
    gap: 12,
  },
  clientName: { margin: 0, color: "#2d6a4f", fontSize: 22 },
  subtitle:   { margin: "4px 0 0", color: "#555", fontSize: 14 },

  headerButtons: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  listBtn: {
    padding: "9px 18px",
    background: "transparent",
    border: "2px solid #2d6a4f",
    color: "#2d6a4f",
    borderRadius: 8,
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 14,
    whiteSpace: "nowrap",
  },
  newClientBtn: {
    padding: "9px 18px",
    background: "#2d6a4f",
    border: "2px solid #2d6a4f",
    color: "#fff",
    borderRadius: 8,
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 14,
    whiteSpace: "nowrap",
  },
  bottomButtons: {
    display: "flex",
    gap: 10,
    justifyContent: "center",
    marginTop: 32,
    flexWrap: "wrap",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
    marginBottom: 28,
  },
  summaryCard: {
    background: "#fff",
    border: "1px solid #e0ece4",
    borderRadius: 10,
    padding: "14px 16px",
  },
  summaryTitle: {
    fontWeight: 700,
    fontSize: 13,
    color: "#2d6a4f",
    marginBottom: 10,
    paddingBottom: 6,
    borderBottom: "1px solid #e8f5ee",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    padding: "3px 0",
  },
  summaryLabel:     { color: "#666" },
  summaryValue:     { fontWeight: 600, color: "#333" },
  summaryValueBold: { fontWeight: 700, color: "#2d6a4f" },
  legendText:       { margin: 0, fontSize: 13, color: "#555", lineHeight: 1.6 },

  mealCard: {
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #e0ece4",
    marginBottom: 16,
    overflow: "hidden",
  },
  mealHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    background: "#f0f8f3",
    flexWrap: "wrap",
    gap: 6,
  },
  mealName:   { fontWeight: 700, fontSize: 15, color: "#1a3d2b" },
  mealMacros: { fontSize: 12, color: "#666" },

  columns: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
  },
  column: {},
  columnHeader: {
    padding: "8px 14px",
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  columnHeaderProtein: {
    background: "#e8f5ee",
    color: "#2d6a4f",
    borderRight: "1px solid #d0e8d8",
  },
  columnHeaderCarbs: {
    background: "#fdf1e8",
    color: "#b5541b",
  },

  foodRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "7px 14px",
    borderBottom: "1px solid #f2f2f2",
    fontSize: 13,
  },
  foodName:  { color: "#333", flex: 1, paddingRight: 8 },
  foodGrams: { fontWeight: 700, whiteSpace: "nowrap", fontSize: 13 },
};
