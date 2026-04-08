import { useState, useEffect } from 'react';
import {
  jobActivityOptions,
  sportOptions,
  goalOptions,
  mealTypeOptions,
  mealEnergyRatios,
} from '../calculations';
import { ALLERGENS } from '../data/allergens';

const initialState = {
  name: '',
  age: '',
  weight: '',
  height: '',
  gender: 'female',
  goal: 'maintain',
  energyMode: 'calculate',
  manualKcal: '',
  overrideKj: '',
  jobActivity: 'sedentary',
  sportType: 'none',
  sportDays: '3',
  sportMinutes: '60',
  allergens: [],  // čísla alergenů dle EU (1–14)
  // Typy jídel – lze vybrat více variant najednou (pole hodnot)
  mealTypes: {
    breakfast: ['breakfast_sweet'],
    snack1: ['snack1_sweet'],
    lunch: ['lunch_meat'],
    snack2: ['snack2_sweet'],
    dinner: ['dinner_warm'],
    dinner2: ['dinner2'],
  },
  // Vlastní procenta skupin potravin pro každý typ jídla
  // null = použít výchozí hodnoty z calculations.js
  customRatios: {},
};

export default function ClientForm({ onSubmit, initialData = null, isEditing = false }) {
  const [formData, setFormData] = useState(() =>
    initialData ? { ...initialState, ...initialData } : initialState
  );

  // Resetuj formulář při změně initialData (editace vs. nový klient)
  useEffect(() => {
    setFormData(initialData ? { ...initialState, ...initialData } : initialState);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  function RatioField({ label, value, onChange }) {
    return (
      <label
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          fontSize: 12,
          fontWeight: 600,
          color: '#555',
          flex: 1,
          minWidth: 80,
        }}
      >
        {label}
        <input
          type="number"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            padding: '6px 8px',
            borderRadius: 6,
            border: '1px solid #d0d0d0',
            fontSize: 13,
            width: '100%',
            boxSizing: 'border-box',
          }}
        />
      </label>
    );
  }
  // Přepínání variant jídla – podporuje výběr 0, 1 nebo více variant
  // Přepínání alergenů
  const handleAllergenToggle = (num) => {
    setFormData((prev) => {
      const current = prev.allergens || [];
      const exists  = current.includes(num);
      return {
        ...prev,
        allergens: exists
          ? current.filter((n) => n !== num)
          : [...current, num],
      };
    });
  };

  const handleMealTypeToggle = (mealKey, value) => {
    setFormData((prev) => {
      const current = prev.mealTypes[mealKey] || [];
      const exists = current.includes(value);
      const updated = exists
        ? current.filter((v) => v !== value) // odebrat
        : [...current, value]; // přidat
      return { ...prev, mealTypes: { ...prev.mealTypes, [mealKey]: updated } };
    });
  };

  // Změna vlastního procenta skupiny potravin
  const handleRatioChange = (mealTypeKey, group, value) => {
    setFormData((prev) => {
      const existing = prev.customRatios[mealTypeKey] || {};
      return {
        ...prev,
        customRatios: {
          ...prev.customRatios,
          [mealTypeKey]: { ...existing, [group]: parseFloat(value) || 0 },
        },
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.age ||
      !formData.weight ||
      !formData.height
    ) {
      alert('Vyplňte prosím základní údaje o klientovi.');
      return;
    }
    if (formData.energyMode === 'manual' && !formData.manualKcal) {
      alert('Zadejte prosím cílový energetický příjem v kcal.');
      return;
    }
    onSubmit(formData);
  };

  const isManual = formData.energyMode === 'manual';
  const showSport = formData.sportType !== 'none';

  return (
    <div style={s.container}>
      <h2 style={s.heading}>{isEditing ? "✏️ Upravit klienta" : "📋 Nový klient"}</h2>
      <form onSubmit={handleSubmit} style={s.form}>
        <SectionTitle>Základní informace</SectionTitle>

        <Field label="Jméno klienta *">
          <input
            style={s.input}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Jana Nováková"
          />
        </Field>

        <div style={s.row}>
          <Field label="Věk *">
            <input
              style={s.input}
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="10"
              max="100"
              placeholder="35"
            />
          </Field>
          <Field label="Hmotnost (kg) *">
            <input
              style={s.input}
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              min="30"
              max="300"
              placeholder="68"
            />
          </Field>
          <Field label="Výška (cm) *">
            <input
              style={s.input}
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              min="100"
              max="250"
              placeholder="165"
            />
          </Field>
        </div>

        <div style={s.row}>
          <Field label="Pohlaví *">
            <select
              style={s.input}
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="female">Žena</option>
              <option value="male">Muž</option>
            </select>
          </Field>
          <Field label="Cíl / redukce *">
            <select
              style={s.input}
              name="goal"
              value={formData.goal}
              onChange={handleChange}
            >
              {goalOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <SectionTitle>Energetický příjem</SectionTitle>

        <div style={s.toggleRow}>
          <button
            type="button"
            style={!isManual ? s.toggleActive : s.toggleInactive}
            onClick={() =>
              setFormData((p) => ({ ...p, energyMode: 'calculate' }))
            }
          >
            🔢 Vypočítat automaticky
          </button>
          <button
            type="button"
            style={isManual ? s.toggleActive : s.toggleInactive}
            onClick={() => setFormData((p) => ({ ...p, energyMode: 'manual' }))}
          >
            ✏️ Zadat ručně
          </button>
        </div>

        {isManual ? (
          <div style={s.infoBox}>
            <p style={s.infoText}>Zadejte cílový denní příjem přímo v kcal.</p>
            <Field label="Cílový příjem (kcal / den) *">
              <input
                style={s.input}
                type="number"
                name="manualKcal"
                value={formData.manualKcal}
                onChange={handleChange}
                min="800"
                max="6000"
                placeholder="1800"
              />
            </Field>
          </div>
        ) : (
          <div style={s.infoBox}>
            <p style={s.infoText}>
              Energie se vypočítá z BMR upraveného o pracovní aktivitu a sport
              (MET metoda). Redukce se uplatní procentuálně z výsledného TDEE.
              Zahrnuto DIT 10 %.
            </p>
            <Field label="Typ zaměstnání *">
              <select
                style={s.input}
                name="jobActivity"
                value={formData.jobActivity}
                onChange={handleChange}
              >
                {jobActivityOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Druh sportu">
              <select
                style={s.input}
                name="sportType"
                value={formData.sportType}
                onChange={handleChange}
              >
                {sportOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
            {showSport && (
              <div style={s.row}>
                <Field label="Tréninků týdně">
                  <input
                    style={s.input}
                    type="number"
                    name="sportDays"
                    value={formData.sportDays}
                    onChange={handleChange}
                    min="1"
                    max="7"
                  />
                </Field>
                <Field label="Délka tréninku (min)">
                  <input
                    style={s.input}
                    type="number"
                    name="sportMinutes"
                    value={formData.sportMinutes}
                    onChange={handleChange}
                    min="15"
                    max="300"
                  />
                </Field>
              </div>
            )}
          </div>
        )}

        <SectionTitle>Složení jídelníčku</SectionTitle>
        <SectionTitle>Energetický příjem – upřesnění</SectionTitle>
        <div style={s.infoBox}>
          <p style={s.infoText}>
            Volitelné: pokud chcete přepsat automaticky vypočtený příjem,
            zadejte hodnotu v kJ. Pole nechte prázdné pro použití výpočtu.
          </p>
          <Field label="Přepsat EP na (kJ / den) – volitelné">
            <input
              style={s.input}
              type="number"
              name="overrideKj"
              value={formData.overrideKj}
              onChange={handleChange}
              min="2000"
              max="25000"
              placeholder="např. 9000"
            />
          </Field>
        </div>

        <SectionTitle>Složení jídelníčku</SectionTitle>
        <p style={{ ...s.infoText, margin: 0 }}>
          Vyberte varianty pro každé jídlo. Lze zvolit žádnou, jednu nebo více
          variant. U každé varianty lze upravit procentuální podíly skupin
          potravin.
        </p>

        {Object.entries(mealTypeOptions).map(([mealKey, options]) => {
          const selectedTypes = formData.mealTypes[mealKey] || [];
          const mealName = {
            breakfast: 'Snídaně',
            snack1: 'Přesnídávka',
            lunch: 'Oběd',
            snack2: 'Svačina',
            dinner: 'Večeře',
            dinner2: 'Druhá večeře',
          }[mealKey];
          return (
            <div key={mealKey} style={s.mealSection}>
              <div style={s.mealSectionTitle}>{mealName}</div>

              {/* Tlačítka pro výběr variant */}
              <div style={s.mealTypeButtons}>
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    style={
                      selectedTypes.includes(opt.value)
                        ? s.mealBtnActive
                        : s.mealBtnInactive
                    }
                    onClick={() => handleMealTypeToggle(mealKey, opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Editovatelná procenta pro každou vybranou variantu */}
              {selectedTypes.map((typeKey) => {
                const defaults = mealEnergyRatios[typeKey] || {};
                const custom = formData.customRatios[typeKey] || {};
                const hasCarbs = defaults.carbs > 0;
                const hasFat = defaults.fat > 0;
                const hasFrVeg = defaults.frVeg > 0;
                return (
                  <div key={typeKey} style={s.ratioBox}>
                    <div style={s.ratioTitle}>
                      {options.find((o) => o.value === typeKey)?.label} – podíly
                      energie skupin:
                    </div>
                    <div style={s.ratioRow}>
                      {hasCarbs && (
                        <RatioField
                          label="🍞 Sacharidy %"
                          value={Math.round(
                            (custom.carbs ?? defaults.carbs) * 100,
                          )}
                          onChange={(v) =>
                            handleRatioChange(typeKey, 'carbs', v / 100)
                          }
                        />
                      )}
                      <RatioField
                        label="🥩 Bílkoviny %"
                        value={Math.round((custom.prot ?? defaults.prot) * 100)}
                        onChange={(v) =>
                          handleRatioChange(typeKey, 'prot', v / 100)
                        }
                      />
                      {hasFat && (
                        <RatioField
                          label="🥑 Tuky %"
                          value={Math.round((custom.fat ?? defaults.fat) * 100)}
                          onChange={(v) =>
                            handleRatioChange(typeKey, 'fat', v / 100)
                          }
                        />
                      )}
                      {hasFrVeg && (
                        <RatioField
                          label={`${defaults.frVegLabel} %`}
                          value={Math.round(
                            (custom.frVeg ?? defaults.frVeg) * 100,
                          )}
                          onChange={(v) =>
                            handleRatioChange(typeKey, 'frVeg', v / 100)
                          }
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* ALERGENY */}
        <SectionTitle>Alergeny klienta</SectionTitle>
        <div style={s.infoBox}>
          <p style={s.infoText}>
            Zaškrtněte alergeny klienta. Dotčené potraviny budou automaticky vyřazeny z jídelníčku.
          </p>
          <div style={s.allergenGrid}>
            {Object.entries(ALLERGENS).map(([num, allergen]) => {
              const isActive = (formData.allergens || []).includes(Number(num));
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleAllergenToggle(Number(num))}
                  style={isActive ? s.allergenBtnActive : s.allergenBtnInactive}
                  title={allergen.desc || allergen.label}
                >
                  <span style={s.allergenEmoji}>{allergen.emoji}</span>
                  <span style={s.allergenNum}>{num}</span>
                  <span style={s.allergenLabel}>{allergen.label}</span>
                  {allergen.ids.length === 0 && (
                    <span style={s.allergenNone}> (není v DB)</span>
                  )}
                </button>
              );
            })}
          </div>
          {(formData.allergens || []).length > 0 && (
            <p style={{ ...s.infoText, color: '#b5541b', marginTop: 8, marginBottom: 0 }}>
              ⚠️ Vyřazeno {(formData.allergens || []).length} skupin alergenů
            </p>
          )}
        </div>

        <button type="submit" style={s.submitBtn}>
          {isEditing ? "Uložit změny →" : "Vytvořit jídelníček →"}
        </button>
      </form>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div
      style={{
        marginTop: 8,
        marginBottom: 2,
        paddingBottom: 6,
        borderBottom: '2px solid #e8f5ee',
        fontWeight: 700,
        fontSize: 13,
        color: '#2d6a4f',
        textTransform: 'uppercase',
        letterSpacing: 1,
      }}
    >
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        fontSize: 13,
        fontWeight: 600,
        color: '#444',
        flex: 1,
      }}
    >
      {label}
      {children}
    </label>
  );
}

const s = {
  container: {
    maxWidth: 600,
    margin: '40px auto',
    padding: 32,
    borderRadius: 14,
    background: '#fff',
    boxShadow: '0 2px 20px rgba(0,0,0,0.09)',
    fontFamily: 'sans-serif',
  },
  heading: { marginTop: 0, fontSize: 22, color: '#2d6a4f' },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  row: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  input: {
    padding: '9px 11px',
    borderRadius: 7,
    border: '1px solid #d0d0d0',
    fontSize: 14,
    width: '100%',
    boxSizing: 'border-box',
  },
  toggleRow: { display: 'flex', gap: 10 },
  toggleActive: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: '2px solid #2d6a4f',
    background: '#2d6a4f',
    color: '#fff',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
  },
  toggleInactive: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: '2px solid #ccc',
    background: '#fff',
    color: '#555',
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
  },
  infoBox: {
    background: '#f7fbf8',
    border: '1px solid #d4ead9',
    borderRadius: 10,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  infoText: { margin: 0, fontSize: 13, color: '#666', lineHeight: 1.5 },
  mealTypeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
    padding: '8px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  mealTypeLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: '#333',
    minWidth: 100,
  },
  mealTypeButtons: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  mealBtnActive: {
    padding: '6px 14px',
    borderRadius: 20,
    border: '2px solid #2d6a4f',
    background: '#2d6a4f',
    color: '#fff',
    fontWeight: 700,
    fontSize: 13,
    cursor: 'pointer',
  },
  mealBtnInactive: {
    padding: '6px 14px',
    borderRadius: 20,
    border: '2px solid #ccc',
    background: '#fff',
    color: '#555',
    fontWeight: 600,
    fontSize: 13,
    cursor: 'pointer',
  },
  submitBtn: {
    marginTop: 8,
    padding: 14,
    background: '#2d6a4f',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
  },
  allergenGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 8,
    marginTop: 4,
  },
  allergenBtnActive: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 12px',
    background: '#fdf1e8',
    border: '2px solid #b5541b',
    borderRadius: 8,
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
  },
  allergenBtnInactive: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 12px',
    background: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: 8,
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
  },
  allergenEmoji: {
    fontSize: 16,
    flexShrink: 0,
  },
  allergenNum: {
    fontWeight: 700,
    fontSize: 12,
    color: '#b5541b',
    flexShrink: 0,
    minWidth: 16,
  },
  allergenLabel: {
    fontSize: 11,
    color: '#333',
    lineHeight: 1.3,
    flex: 1,
  },
  allergenNone: {
    fontSize: 10,
    color: '#aaa',
    fontStyle: 'italic',
  },

  mealSection: { padding: '10px 0', borderBottom: '1px solid #f0f0f0' },
  mealSectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: '#333',
    marginBottom: 8,
  },
  ratioBox: {
    background: '#f7fbf8',
    border: '1px solid #d4ead9',
    borderRadius: 8,
    padding: '10px 12px',
    marginTop: 8,
  },
  ratioTitle: {
    fontSize: 12,
    color: '#2d6a4f',
    fontWeight: 600,
    marginBottom: 8,
  },
  ratioRow: { display: 'flex', gap: 8, flexWrap: 'wrap' },
};
