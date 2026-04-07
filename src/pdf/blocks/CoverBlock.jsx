import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { C, shared } from '../styles';
import { getGoalMeta } from '../texts';

// ─── LOKÁLNÍ STYLY ────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  card: {
    flex: 1,
    backgroundColor: C.white,
    borderWidth: 0.5,
    borderColor: C.greyMid,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 8,
  },
  cardTitleBar: {
    backgroundColor: C.greenLight,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginBottom: 6,
  },
  cardTitle: {
    fontFamily: 'Roboto',
    fontWeight: 700,
    fontSize: 7.5,
    color: C.greenDark,
  },
  // KV tabulka
  kvRow: {
    flexDirection: 'row',
    paddingVertical: 2,
    borderBottomWidth: 0.3,
    borderBottomColor: C.greyMid,
    borderBottomStyle: 'solid',
  },
  kvLastRow: {
    flexDirection: 'row',
    paddingVertical: 2,
  },
  kvKey: {
    fontFamily: 'Roboto',
    fontWeight: 400,
    fontSize: 7.5,
    color: C.greyText,
    width: '44%',
  },
  kvVal: {
    fontFamily: 'Roboto',
    fontWeight: 500,
    fontSize: 7.5,
    color: C.black,
    flex: 1,
  },
  // Energetický příjem
  bigKcal: {
    fontFamily: 'Roboto',
    fontWeight: 700,
    fontSize: 20,
    color: C.greenDark,
    marginTop: 4,
    lineHeight: 1.1,
  },
  bigKj: {
    fontFamily: 'Roboto',
    fontWeight: 400,
    fontSize: 10,
    color: C.greenMid,
    marginBottom: 2,
  },
  // Makroživiny – pruhy
  macroBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginBottom: 5,
  },
  macroLabel: {
    fontFamily: 'Roboto',
    fontWeight: 400,
    fontSize: 8,
    color: C.greyText,
  },
  macroValue: {
    fontFamily: 'Roboto',
    fontWeight: 700,
    fontSize: 9,
  },
  // Legenda
  legend: {
    fontFamily: 'Roboto',
    fontWeight: 400,
    fontSize: 7,
    color: C.greyDark,
    lineHeight: 1.4,
    marginTop: 4,
    borderTopWidth: 0.3,
    borderTopColor: C.greyMid,
    borderTopStyle: 'solid',
    paddingTop: 5,
  },
  // Cíl badge
  goalBadge: {
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  goalBadgeText: {
    fontFamily: 'Roboto',
    fontWeight: 700,
    fontSize: 8.5,
  },
});

// ─── POMOCNÉ KOMPONENTY ───────────────────────────────────────────────────────
function CardTitle({ children }) {
  return (
    <View style={s.cardTitleBar}>
      <Text style={s.cardTitle}>{children}</Text>
    </View>
  );
}

function KVTable({ pairs }) {
  return (
    <View>
      {pairs.map(([key, val], i) => (
        <View key={key} style={i === pairs.length - 1 ? s.kvLastRow : s.kvRow}>
          <Text style={s.kvKey}>{key}</Text>
          <Text style={s.kvVal}>{val}</Text>
        </View>
      ))}
    </View>
  );
}

function MacroBar({ label, value, color, bg }) {
  return (
    <View style={[s.macroBar, { backgroundColor: bg }]}>
      <Text style={s.macroLabel}>{label}</Text>
      <Text style={[s.macroValue, { color }]}>{value} g</Text>
    </View>
  );
}

// ─── KARTY ────────────────────────────────────────────────────────────────────
function AntroCard({ clientData, meta }) {
  const {
    weight = '',
    height = '',
    age = '',
    gender = 'female',
    jobLabel = '—',
    sportLabel = '',
    sportDays = '',
    sportMinutes = '',
  } = clientData ?? {};

  const genderLabel = gender === 'female' ? 'Žena' : 'Muž';

  let bmiStr = '—';
  try {
    const bmi = (
      parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2)
    ).toFixed(1);
    const cat =
      bmi < 18.5
        ? 'Podváha'
        : bmi < 25
          ? 'Norma'
          : bmi < 30
            ? 'Nadváha'
            : 'Obezita';
    bmiStr = `${bmi}  (${cat})`;
  } catch (_) {}

  const sportStr =
    sportLabel && !sportLabel.includes('Žádná')
      ? `${sportLabel}, ${sportDays}× týdně, ${sportMinutes} min`
      : 'Žádná sportovní aktivita';

  return (
    <View style={s.card}>
      <CardTitle>Antropometrie</CardTitle>
      <KVTable
        pairs={[
          ['Věk', `${age} let`],
          ['Pohlaví', genderLabel],
          ['Výška', `${height} cm`],
          ['Váha', `${weight} kg`],
          ['BMI', bmiStr],
        ]}
      />

      <View style={{ marginTop: 6 }}>
        <CardTitle>Zaměstnání</CardTitle>
        <Text style={s.kvVal}>{jobLabel}</Text>
      </View>

      <View style={{ marginTop: 6 }}>
        <CardTitle>Sport</CardTitle>
        <Text style={[s.kvVal, { fontSize: 7.5, color: C.greyText }]}>
          {sportStr}
        </Text>
      </View>

      <View style={{ marginTop: 6 }}>
        <CardTitle>Cíl</CardTitle>
        <View style={[s.goalBadge, { backgroundColor: meta.bg }]}>
          <Text style={[s.goalBadgeText, { color: meta.color }]}>
            {meta.label}
          </Text>
        </View>
      </View>
    </View>
  );
}

function EnergyCard({ plan }) {
  const { energyMode, bmrKcal, bmrKj, tdeeKcal, tdeeKj, targetKcal, targetKj } =
    plan;
  return (
    <View style={s.card}>
      <CardTitle>Energetický příjem</CardTitle>

      {energyMode === 'calculate' ? (
        <KVTable
          pairs={[
            ['BMR', `${bmrKcal} kcal  /  ${bmrKj} kJ`],
            ['TDEE (+ DIT)', `${tdeeKcal} kcal  /  ${tdeeKj} kJ`],
          ]}
        />
      ) : (
        <Text style={shared.bodySmall}>Zadáno manuálně</Text>
      )}

      <View style={{ marginTop: 8 }}>
        <CardTitle>Cílový denní příjem</CardTitle>
        <Text style={s.bigKcal}>{targetKcal} kcal</Text>
        <Text style={s.bigKj}>{targetKj} kJ</Text>
      </View>
    </View>
  );
}

function MacroCard({ plan }) {
  const { protein = '—', carbs = '—', fat = '—' } = plan.macros ?? {};
  return (
    <View style={s.card}>
      <CardTitle>Makroživiny / den</CardTitle>

      <View style={{ marginTop: 4 }}>
        <MacroBar
          label="🥩 Bílkoviny"
          value={protein}
          color={C.greenDark}
          bg={C.greenLight}
        />
        <MacroBar
          label="🍞 Sacharidy"
          value={carbs}
          color={C.orange}
          bg={C.orangeLight}
        />
        <MacroBar
          label="🥑 Tuky"
          value={fat}
          color={C.purple}
          bg={C.purpleLight}
        />
      </View>

      <Text style={s.legend}>
        Z každého sloupce vyberte jednu potravinu.{'\n'}
        Při výběru více upravte množství úměrně.
      </Text>
    </View>
  );
}

// ─── HLAVNÍ EXPORT ────────────────────────────────────────────────────────────
export function CoverBlock({ plan, clientData }) {
  const meta = getGoalMeta(plan.goal);

  return (
    <View>
      {/* Titulek */}
      <Text style={shared.subtitle}>Individuální jídelníček</Text>
      <Text style={shared.h1}>{plan.clientName}</Text>
      <View style={[shared.dividerGreen, { marginTop: 4, marginBottom: 10 }]} />

      {/* 3 karty */}
      <View style={s.row}>
        <AntroCard clientData={clientData} meta={meta} />
        <EnergyCard plan={plan} />
        <MacroCard plan={plan} />
      </View>
    </View>
  );
}
