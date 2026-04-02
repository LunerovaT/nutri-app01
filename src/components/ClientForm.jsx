// ClientForm.jsx – kompletní verze s výběrem typů jídel
import { useState } from "react";
import { jobActivityOptions, sportOptions, goalOptions, mealTypeOptions } from "../calculations";

const initialState = {
  name: "", age: "", weight: "", height: "",
  gender: "female", goal: "maintain",
  energyMode: "calculate", manualKcal: "",
  jobActivity: "sedentary",
  sportType: "none", sportDays: "3", sportMinutes: "60",
  mealTypes: {
    breakfast: "breakfast_sweet",
    snack1:    "snack1_sweet",
    lunch:     "lunch_meat",
    snack2:    "snack2_sweet",
    dinner:    "dinner_warm",
    dinner2:   "dinner2",
  },
};

export default function ClientForm({ onSubmit }) {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMealTypeChange = (mealKey, value) => {
    setFormData((prev) => ({
      ...prev,
      mealTypes: { ...prev.mealTypes, [mealKey]: value },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.weight || !formData.height) {
      alert("Vyplňte prosím základní údaje o klientovi.");
      return;
    }
    if (formData.energyMode === "manual" && !formData.manualKcal) {
      alert("Zadejte prosím cílový energetický příjem v kcal.");
      return;
    }
    onSubmit(formData);
  };

  const isManual  = formData.energyMode === "manual";
  const showSport = formData.sportType !== "none";

  return (
    <div style={s.container}>
      <h2 style={s.heading}>📋 Údaje o klientovi</h2>
      <form onSubmit={handleSubmit} style={s.form}>

        <SectionTitle>Základní informace</SectionTitle>

        <Field label="Jméno klienta *">
          <input style={s.input} type="text" name="name"
            value={formData.name} onChange={handleChange} placeholder="Jana Nováková" />
        </Field>

        <div style={s.row}>
          <Field label="Věk *">
            <input style={s.input} type="number" name="age"
              value={formData.age} onChange={handleChange} min="10" max="100" placeholder="35" />
          </Field>
          <Field label="Hmotnost (kg) *">
            <input style={s.input} type="number" name="weight"
              value={formData.weight} onChange={handleChange} min="30" max="300" placeholder="68" />
          </Field>
          <Field label="Výška (cm) *">
            <input style={s.input} type="number" name="height"
              value={formData.height} onChange={handleChange} min="100" max="250" placeholder="165" />
          </Field>
        </div>

        <div style={s.row}>
          <Field label="Pohlaví *">
            <select style={s.input} name="gender" value={formData.gender} onChange={handleChange}>
              <option value="female">Žena</option>
              <option value="male">Muž</option>
            </select>
          </Field>
          <Field label="Cíl / redukce *">
            <select style={s.input} name="goal" value={formData.goal} onChange={handleChange}>
              {goalOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>
        </div>

        <SectionTitle>Energetický příjem</SectionTitle>

        <div style={s.toggleRow}>
          <button type="button"
            style={!isManual ? s.toggleActive : s.toggleInactive}
            onClick={() => setFormData(p => ({ ...p, energyMode: "calculate" }))}>
            🔢 Vypočítat automaticky
          </button>
          <button type="button"
            style={isManual ? s.toggleActive : s.toggleInactive}
            onClick={() => setFormData(p => ({ ...p, energyMode: "manual" }))}>
            ✏️ Zadat ručně
          </button>
        </div>

        {isManual ? (
          <div style={s.infoBox}>
            <p style={s.infoText}>Zadejte cílový denní příjem přímo v kcal.</p>
            <Field label="Cílový příjem (kcal / den) *">
              <input style={s.input} type="number" name="manualKcal"
                value={formData.manualKcal} onChange={handleChange} min="800" max="6000" placeholder="1800" />
            </Field>
          </div>
        ) : (
          <div style={s.infoBox}>
            <p style={s.infoText}>
              Energie se vypočítá z BMR upraveného o pracovní aktivitu a sport (MET metoda).
              Redukce se uplatní procentuálně z výsledného TDEE. Zahrnuto DIT 10 %.
            </p>
            <Field label="Typ zaměstnání *">
              <select style={s.input} name="jobActivity" value={formData.jobActivity} onChange={handleChange}>
                {jobActivityOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <Field label="Druh sportu">
              <select style={s.input} name="sportType" value={formData.sportType} onChange={handleChange}>
                {sportOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            {showSport && (
              <div style={s.row}>
                <Field label="Tréninků týdně">
                  <input style={s.input} type="number" name="sportDays"
                    value={formData.sportDays} onChange={handleChange} min="1" max="7" />
                </Field>
                <Field label="Délka tréninku (min)">
                  <input style={s.input} type="number" name="sportMinutes"
                    value={formData.sportMinutes} onChange={handleChange} min="15" max="300" />
                </Field>
              </div>
            )}
          </div>
        )}

        <SectionTitle>Složení jídelníčku</SectionTitle>
        <p style={s.infoText}>Vyberte variantu pro každé denní jídlo.</p>

        {Object.entries(mealTypeOptions).map(([mealKey, options]) => (
          <div key={mealKey} style={s.mealTypeRow}>
            <div style={s.mealTypeLabel}>
              {options[0].label.split(" ").slice(1, 2).join(" ")}
              {/* Zobrazíme jen název jídla bez emoji */}
              {mealKey === "breakfast" && "Snídaně"}
              {mealKey === "snack1"    && "Přesnídávka"}
              {mealKey === "lunch"     && "Oběd"}
              {mealKey === "snack2"    && "Svačina"}
              {mealKey === "dinner"    && "Večeře"}
              {mealKey === "dinner2"   && "Druhá večeře"}
            </div>
            <div style={s.mealTypeButtons}>
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  style={formData.mealTypes[mealKey] === opt.value ? s.mealBtnActive : s.mealBtnInactive}
                  onClick={() => handleMealTypeChange(mealKey, opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button type="submit" style={s.submitBtn}>
          Vytvořit jídelníček →
        </button>
      </form>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{
      marginTop: 8, marginBottom: 2, paddingBottom: 6,
      borderBottom: "2px solid #e8f5ee",
      fontWeight: 700, fontSize: 13, color: "#2d6a4f",
      textTransform: "uppercase", letterSpacing: 1,
    }}>{children}</div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 13, fontWeight: 600, color: "#444", flex: 1 }}>
      {label}{children}
    </label>
  );
}

const s = {
  container: { maxWidth: 600, margin: "40px auto", padding: 32, borderRadius: 14, background: "#fff", boxShadow: "0 2px 20px rgba(0,0,0,0.09)", fontFamily: "sans-serif" },
  heading:   { marginTop: 0, fontSize: 22, color: "#2d6a4f" },
  form:      { display: "flex", flexDirection: "column", gap: 14 },
  row:       { display: "flex", gap: 12, flexWrap: "wrap" },
  input:     { padding: "9px 11px", borderRadius: 7, border: "1px solid #d0d0d0", fontSize: 14, width: "100%", boxSizing: "border-box" },
  toggleRow: { display: "flex", gap: 10 },
  toggleActive:   { flex: 1, padding: 10, borderRadius: 8, border: "2px solid #2d6a4f", background: "#2d6a4f", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" },
  toggleInactive: { flex: 1, padding: 10, borderRadius: 8, border: "2px solid #ccc", background: "#fff", color: "#555", fontWeight: 600, fontSize: 14, cursor: "pointer" },
  infoBox:   { background: "#f7fbf8", border: "1px solid #d4ead9", borderRadius: 10, padding: 16, display: "flex", flexDirection: "column", gap: 12 },
  infoText:  { margin: 0, fontSize: 13, color: "#666", lineHeight: 1.5 },
  mealTypeRow: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", padding: "8px 0", borderBottom: "1px solid #f0f0f0" },
  mealTypeLabel: { fontSize: 13, fontWeight: 700, color: "#333", minWidth: 100 },
  mealTypeButtons: { display: "flex", gap: 8, flexWrap: "wrap" },
  mealBtnActive:   { padding: "6px 14px", borderRadius: 20, border: "2px solid #2d6a4f", background: "#2d6a4f", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" },
  mealBtnInactive: { padding: "6px 14px", borderRadius: 20, border: "2px solid #ccc", background: "#fff", color: "#555", fontWeight: 600, fontSize: 13, cursor: "pointer" },
  submitBtn: { marginTop: 8, padding: 14, background: "#2d6a4f", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer" },
};
