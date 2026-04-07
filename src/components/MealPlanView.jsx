// MealPlanView.jsx – responzivní verze s accordion mobile layoutem
import { useState, useEffect } from 'react';
import PdfExportButton from './PdfExportButton';

// ─── BREAKPOINT HOOK ─────────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 700);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
}

// ─── HLAVNÍ KOMPONENTA ────────────────────────────────────────────────────────
export default function MealPlanView({ plan, clientData, onReset, onNewClient }) {
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
          <button onClick={onReset} style={s.outlineBtn}>← Seznam klientů</button>
          <button onClick={onNewClient} style={s.solidBtn}>+ Nový klient</button>
          <PdfExportButton plan={plan} clientData={clientData} />
        </div>
      </div>

      {/* SOUHRN */}
      <div style={s.summaryGrid}>
        {plan.energyMode === 'calculate' && (
          <SummaryCard title="📊 Energetika">
            <Row label="BMR"            value={`${plan.bmrKcal} kcal / ${plan.bmrKj} kJ`} />
            <Row label="TDEE (vč. DIT)" value={`${plan.tdeeKcal} kcal / ${plan.tdeeKj} kJ`} />
            <Row label="Cílový příjem"  value={`${plan.targetKcal} kcal / ${plan.targetKj} kJ`} highlight />
          </SummaryCard>
        )}
        <SummaryCard title="🥩 Makroživiny / den">
          <Row label="Bílkoviny" value={`${plan.macros.protein} g`} />
          <Row label="Sacharidy"  value={`${plan.macros.carbs} g`} />
          <Row label="Tuky"      value={`${plan.macros.fat} g`} />
        </SummaryCard>
        <SummaryCard title="ℹ️ Jak číst jídelníček">
          <p style={s.legendText}>
            Z každého sloupce vyberte <strong>jednu potravinu</strong>. Při výběru více
            potravin z jednoho sloupce upravte jejich množství úměrně.
          </p>
        </SummaryCard>
      </div>

      {/* JÍDLA */}
      {plan.mealPlan.map((meal) => (
        <MealCard key={meal.key} meal={meal} />
      ))}

      <div style={s.bottomBtns}>
        <button onClick={onReset} style={s.outlineBtn}>← Seznam klientů</button>
        <button onClick={onNewClient} style={s.solidBtn}>+ Nový klient</button>
        <PdfExportButton plan={plan} clientData={clientData} />
      </div>
    </div>
  );
}

// ─── MEAL CARD ────────────────────────────────────────────────────────────────
function MealCard({ meal }) {
  const isMobile = useIsMobile();
  const [openSection, setOpenSection] = useState(null);

  const cols = [
    { key: 'carbOptions',  energy: meal.energyCarbs,  title: '🍞 Sacharidy', color: '#b5541b', bg: '#fdf1e8' },
    { key: 'protOptions',  energy: meal.energyProt,   title: '🥩 Bílkoviny', color: '#2d6a4f', bg: '#e8f5ee' },
    { key: 'fatOptions',   energy: meal.energyFat,    title: '🥑 Tuky',      color: '#7b4fa6', bg: '#f3edf8' },
    {
      key: 'frVegOptions',
      energy: meal.energyFrVeg,
      title: meal.frVegLabel === 'Ovoce' ? '🍓 Ovoce' : '🥦 Zelenina',
      color: '#1a6b8a',
      bg: '#e8f4f8',
    },
  ].filter((col) => (meal[col.key]?.length ?? 0) > 0 && (col.energy ?? 0) > 0);

  return (
    <div style={s.mealCard}>
      {/* Záhlaví jídla */}
      <div style={s.mealHeader}>
        <span style={s.mealName}>{meal.name}</span>
        <span style={s.mealMeta}>{meal.totalKcal} kcal · {meal.totalKj} kJ</span>
      </div>

      {isMobile ? (
        // ── MOBILE: Accordion ──────────────────────────────────────────────
        <div>
          {cols.map((col) => {
            const isOpen = openSection === col.key;
            return (
              <div key={col.key}>
                <button
                  onClick={() => setOpenSection(isOpen ? null : col.key)}
                  style={{
                    ...s.accordionHeader,
                    background: isOpen ? col.bg : '#fff',
                    color: col.color,
                  }}
                >
                  <span style={s.accordionTitle}>{col.title}</span>
                  <span style={s.accordionRight}>
                    <span style={s.accordionKj}>{col.energy} kJ</span>
                    <span style={{
                      ...s.accordionChevron,
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}>
                      ▾
                    </span>
                  </span>
                </button>

                {isOpen && (
                  <div style={{ background: col.bg }}>
                    {meal[col.key].map((food, i) => (
                      <div
                        key={food.id}
                        style={{
                          ...s.foodRow,
                          background: i % 2 === 0 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)',
                        }}
                      >
                        <span style={s.foodName}>{food.name}</span>
                        <span style={{ ...s.foodGrams, color: col.color }}>
                          {food.portionGrams} g
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        // ── DESKTOP: Sloupce vedle sebe ────────────────────────────────────
        <div style={s.columns}>
          {cols.map((col, i) => (
            <FoodColumn
              key={col.key}
              title={col.title}
              items={meal[col.key]}
              color={col.color}
              bgColor={col.bg}
              energyKj={col.energy}
              width={`${Math.floor(100 / cols.length)}%`}
              borderRight={i < cols.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── DESKTOP: FOOD COLUMN ─────────────────────────────────────────────────────
function FoodColumn({ title, items, color, bgColor, energyKj, width, borderRight }) {
  return (
    <div style={{ width, borderRight: borderRight ? '1px solid #f0f0f0' : 'none' }}>
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

// ─── HELPER KOMPONENTY ────────────────────────────────────────────────────────
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
      <span style={highlight ? { ...s.summaryValue, color: '#2d6a4f', fontWeight: 700 } : s.summaryValue}>
        {value}
      </span>
    </div>
  );
}

// ─── STYLY ────────────────────────────────────────────────────────────────────
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

  // Souhrn
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

  // Meal karta
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

  // Desktop sloupce
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

  // Sdílené food row
  foodRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 14px',
    borderBottom: '1px solid rgba(0,0,0,0.04)',
    fontSize: 13,
  },
  foodName: { color: '#333', flex: 1, paddingRight: 8, fontSize: 12 },
  foodGrams: { fontWeight: 700, whiteSpace: 'nowrap', fontSize: 13 },

  // Mobile accordion
  accordionHeader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    border: 'none',
    borderBottom: '1px solid #f0f0f0',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background 0.15s ease',
  },
  accordionTitle: {
    fontWeight: 700,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  accordionRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
  },
  accordionKj: {
    fontSize: 12,
    fontWeight: 600,
    opacity: 0.7,
  },
  accordionChevron: {
    fontSize: 18,
    transition: 'transform 0.2s ease',
    display: 'inline-block',
    lineHeight: 1,
  },
};
