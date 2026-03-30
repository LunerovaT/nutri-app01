// ClientForm.jsx – aktualizovaná verze
// Změna: cíl klienta nyní používá goalOptions s procentuální redukcí

import { useState } from "react";
import { jobActivityOptions, sportOptions, goalOptions } from "../calculations";

const initialState = {
  name:         "",
  age:          "",
  weight:       "",
  height:       "",
  gender:       "female",
  goal:         "maintain",
  energyMode:   "calculate",
  manualKcal:   "",
  jobActivity:  "sedentary",
  sportType:    "none",
  sportDays:    "3",
  sportMinutes: "60",
};

export default function ClientForm({ onSubmit }) {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleModeSwitch = (mode) => {
    setFormData((prev) => ({ ...prev, energyMode: mode }));
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
          <Field label="Věk (roky) *">
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
          {/* Cíl – nyní načtený z goalOptions v calculations.js */}
          <Field label="Cíl / redukce *">
            <select style={s.input} name="goal" value={formData.goal} onChange={handleChange}>
              {goalOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </Field>
        </div>

        <SectionTitle>Energetický příjem</SectionTitle>

        <div style={s.toggleRow}>
          <button type="button"
            style={!isManual ? s.toggleActive : s.toggleInactive}
            onClick={() => handleModeSwitch("calculate")}>
            🔢 Vypočítat automaticky
          </button>
          <button type="button"
            style={isManual ? s.toggleActive : s.toggleInactive}
            onClick={() => handleModeSwitch("manual")}>
            ✏️ Zadat ručně
          </button>
        </div>

        {isManual && (
          <div style={s.infoBox}>
            <p style={s.infoText}>
              Zadejte cílový denní energetický příjem přímo v kcal. Aplikace
              z něj automaticky vypočítá makroživiny a gramáže potravin.
            </p>
            <Field label="Cílový energetický příjem (kcal / den) *">
              <input style={s.input} type="number" name="manualKcal"
                value={formData.manualKcal} onChange={handleChange}
                min="800" max="6000" placeholder="např. 1800" />
            </Field>
          </div>
        )}

        {!isManual && (
          <div style={s.infoBox}>
            <p style={s.infoText}>
              Energie se vypočítá z BMR upraveného o pracovní aktivitu
              a průměrný denní sportovní výdej (MET metoda).
              Redukce se pak uplatní procentuálně z výsledného TDEE.
            </p>

            <Field label="Typ zaměstnání / pracovní aktivita *">
              <select style={s.input} name="jobActivity"
                value={formData.jobActivity} onChange={handleChange}>
                {jobActivityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </Field>

            <Field label="Druh sportu">
              <select style={s.input} name="sportType"
                value={formData.sportType} onChange={handleChange}>
                {sportOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </Field>

            {showSport && (
              <div style={s.row}>
                <Field label="Počet tréninků týdně">
                  <input style={s.input} type="number" name="sportDays"
                    value={formData.sportDays} onChange={handleChange} min="1" max="7" />
                </Field>
                <Field label="Délka tréninku (minuty)">
                  <input style={s.input} type="number" name="sportMinutes"
                    value={formData.sportMinutes} onChange={handleChange} min="15" max="300" />
                </Field>
              </div>
            )}
          </div>
        )}

        <button type="submit" style={s.button}>
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
    }}>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{
      display: "flex", flexDirection: "column", gap: 5,
      fontSize: 13, fontWeight: 600, color: "#444", flex: 1,
    }}>
      {label}
      {children}
    </label>
  );
}

const s = {
  container: {
    maxWidth: 580, margin: "40px auto", padding: "32px",
    borderRadius: 14, background: "#fff",
    boxShadow: "0 2px 20px rgba(0,0,0,0.09)", fontFamily: "sans-serif",
  },
  heading:  { marginTop: 0, fontSize: 22, color: "#2d6a4f" },
  form:     { display: "flex", flexDirection: "column", gap: 14 },
  row:      { display: "flex", gap: 12, flexWrap: "wrap" },
  input: {
    padding: "9px 11px", borderRadius: 7, border: "1px solid #d0d0d0",
    fontSize: 14, width: "100%", boxSizing: "border-box",
  },
  toggleRow:      { display: "flex", gap: 10 },
  toggleActive:   {
    flex: 1, padding: "10px", borderRadius: 8,
    border: "2px solid #2d6a4f", background: "#2d6a4f",
    color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
  },
  toggleInactive: {
    flex: 1, padding: "10px", borderRadius: 8,
    border: "2px solid #ccc", background: "#fff",
    color: "#555", fontWeight: 600, fontSize: 14, cursor: "pointer",
  },
  infoBox: {
    background: "#f7fbf8", border: "1px solid #d4ead9",
    borderRadius: 10, padding: "16px",
    display: "flex", flexDirection: "column", gap: 12,
  },
  infoText: { margin: 0, fontSize: 13, color: "#666", lineHeight: 1.5 },
  button: {
    marginTop: 4, padding: "14px", background: "#2d6a4f",
    color: "#fff", border: "none", borderRadius: 8,
    fontSize: 15, fontWeight: 700, cursor: "pointer",
  },
};
