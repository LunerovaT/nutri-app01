// pdf/NutriPdfDocument.jsx – hlavní PDF dokument
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { C, shared } from './styles';
import { getGoalMeta } from './texts';
import { CoverBlock } from './blocks/CoverBlock';
import { InfoBlock } from './blocks/InfoBlock';
import { MealBlock } from './blocks/MealBlock';

// ─── HEADER + FOOTER ─────────────────────────────────────────────────────────
const chrome = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 28,
    backgroundColor: C.greenDark,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerLeft: {
    fontFamily: 'Roboto',
    fontWeight: 700,
    fontSize: 10,
    color: C.white,
  },
  headerRight: {
    fontFamily: 'Roboto',
    fontWeight: 400,
    fontSize: 7.5,
    color: C.greenBorder,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 22,
    backgroundColor: C.greyLight,
    borderTopWidth: 0.4,
    borderTopColor: C.greyMid,
    borderTopStyle: 'solid',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  footerText: {
    fontFamily: 'Roboto',
    fontWeight: 300,
    fontSize: 7,
    color: C.greyDark,
  },
});

// ─── SDÍLENÁ STRÁNKA ─────────────────────────────────────────────────────────
function NutriPage({ clientName, goalLabel, children }) {
  return (
    <Page
      size="A4"
      style={[shared.page, { paddingTop: 44, paddingBottom: 32 }]}
    >
      {/* Header – fixní na každé stránce */}
      <View style={chrome.header} fixed>
        <Text style={chrome.headerLeft}>NutriApp</Text>
        <Text style={chrome.headerRight}>
          {clientName} · {goalLabel}
        </Text>
      </View>

      {/* Obsah stránky */}
      {children}

      {/* Footer – fixní na každé stránce */}
      <View style={chrome.footer} fixed>
        <Text style={chrome.footerText}>
          Jídelníček je sestaven individuálně. Konzultujte případné změny s
          nutričním terapeutem.
        </Text>
        <Text
          style={chrome.footerText}
          render={({ pageNumber, totalPages }) =>
            `Strana ${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </View>
    </Page>
  );
}

// ─── HLAVNÍ DOKUMENT ─────────────────────────────────────────────────────────
export function NutriPdfDocument({ plan, clientData }) {
  const meta = getGoalMeta(plan.goal);

  // Ochrana: nikdy nepředávej null/undefined do bloků
  const safeClientData = clientData ?? {};

  const pageProps = {
    clientName: plan.clientName,
    goalLabel: meta.label,
  };

  return (
    <Document
      title={`Jídelníček – ${plan.clientName}`}
      author="NutriApp"
      subject={`${meta.label} – ${plan.targetKcal} kcal / den`}
    >
      {/* Strana 1: titulek + antropometrie + energie + makroživiny */}
      <NutriPage {...pageProps}>
        <CoverBlock plan={plan} clientData={safeClientData} />
      </NutriPage>

      {/* Strana 2: informační text dle cíle */}
      <NutriPage {...pageProps}>
        <InfoBlock goal={plan.goal} />
      </NutriPage>

      {/* Strana 3+: jídelníček */}
      <NutriPage {...pageProps}>
        <MealBlock plan={plan} />
      </NutriPage>
    </Document>
  );
}
