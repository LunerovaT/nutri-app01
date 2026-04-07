// pdf/styles.js – sdílené styly pro @react-pdf/renderer
import { StyleSheet, Font } from '@react-pdf/renderer';

const BASE = process.env.PUBLIC_URL || 'http://localhost:3000';

Font.register({
  family: 'Roboto',
  fonts: [
    { src: `${BASE}/fonts/Roboto-Regular.ttf`, fontWeight: 400 },
    { src: `${BASE}/fonts/Roboto-Bold.ttf`, fontWeight: 700 },
  ],
});
// ─── BARVY ────────────────────────────────────────────────────────────────────
export const C = {
  greenDark: '#2d6a4f',
  greenMid: '#40916c',
  greenLight: '#e8f5ee',
  greenBorder: '#c8e6d4',
  orange: '#b5541b',
  orangeLight: '#fdf1e8',
  purple: '#7b4fa6',
  purpleLight: '#f3edf8',
  blue: '#1a6b8a',
  blueLight: '#e8f4f8',
  teal: '#00796b',
  tealLight: '#e0f2f1',
  greyText: '#555555',
  greyLight: '#f7f7f7',
  greyMid: '#e0e0e0',
  greyDark: '#999999',
  black: '#1a1a1a',
  white: '#ffffff',
};

// ─── FONT HELPER ─────────────────────────────────────────────────────────────
// @react-pdf/renderer má zabudované: Roboto, Roboto-Bold, Roboto-Oblique
// Používáme je jako náhradu za Roboto – žádné soubory nejsou potřeba.
// Až budou fonty vyřešeny, stačí změnit F.normal → "Roboto" atd.
const F = {
  normal: 'Roboto',
  bold: 'Roboto',
  light: 'Roboto',
  medium: 'Roboto',
};

// ─── SDÍLENÉ STYLY ────────────────────────────────────────────────────────────
export const shared = StyleSheet.create({
  page: {
    fontFamily: F.normal,
    fontSize: 9,
    color: C.black,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: C.white,
  },

  // Nadpisy
  h1: {
    fontFamily: F.bold,
    fontSize: 22,
    color: C.greenDark,
    marginBottom: 2,
    lineHeight: 1.2,
  },
  h2: {
    fontFamily: F.bold,
    fontSize: 11,
    color: C.greenDark,
    marginBottom: 4,
    marginTop: 8,
    lineHeight: 1.3,
  },
  subtitle: {
    fontFamily: F.normal,
    fontSize: 11,
    color: C.greenMid,
    marginBottom: 2,
    lineHeight: 1.3,
  },
  body: {
    fontFamily: F.normal,
    fontSize: 9,
    color: C.greyText,
    lineHeight: 1.5,
    marginBottom: 4,
  },
  bodySmall: {
    fontFamily: F.normal,
    fontSize: 8,
    color: C.greyText,
    lineHeight: 1.5,
    marginBottom: 3,
  },
  small: {
    fontFamily: F.normal,
    fontSize: 7.5,
    color: C.greyDark,
    lineHeight: 1.4,
  },

  // Divider
  divider: {
    borderBottomWidth: 0.5,
    borderBottomColor: C.greyMid,
    borderBottomStyle: 'solid',
    marginTop: 4,
    marginBottom: 6,
  },
  dividerGreen: {
    borderBottomWidth: 0.5,
    borderBottomColor: C.greenBorder,
    borderBottomStyle: 'solid',
    marginTop: 0,
    marginBottom: 6,
  },

  // Karty
  card: {
    backgroundColor: C.white,
    borderWidth: 0.5,
    borderColor: C.greyMid,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 8,
  },
  cardTitle: {
    fontFamily: F.bold,
    fontSize: 8,
    color: C.greenDark,
    marginBottom: 4,
  },
  cardBody: {
    fontFamily: F.normal,
    fontSize: 8,
    color: C.greyText,
    lineHeight: 1.4,
  },

  // Informační text
  infoH1: {
    fontFamily: F.bold,
    fontSize: 15,
    color: C.greenDark,
    marginBottom: 6,
    lineHeight: 1.3,
  },
  infoH2: {
    fontFamily: F.bold,
    fontSize: 10,
    color: C.greenDark,
    marginBottom: 3,
    marginTop: 8,
    lineHeight: 1.3,
  },
  infoBody: {
    fontFamily: F.normal,
    fontSize: 9,
    color: C.greyText,
    lineHeight: 1.6,
    marginBottom: 4,
  },
  infoBullet: {
    fontFamily: F.normal,
    fontSize: 9,
    color: C.greyText,
    lineHeight: 1.5,
    marginBottom: 3,
    paddingLeft: 8,
  },

  // Souhrn tabulka
  summary_key: {
    fontFamily: F.bold,
    fontSize: 8.5,
    color: C.greenDark,
    lineHeight: 1.4,
  },
  summary_val: {
    fontFamily: F.normal,
    fontSize: 8.5,
    color: C.greyText,
    lineHeight: 1.4,
  },
});
