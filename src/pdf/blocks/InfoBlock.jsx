// pdf/blocks/InfoBlock.jsx – informační text dle cíle (str. 2)
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { C, shared } from '../styles';
import { getInfoText } from '../texts';

const s = StyleSheet.create({
  summaryTable: {
    borderWidth: 0.5,
    borderColor: C.greenBorder,
    borderStyle: 'solid',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.4,
    borderBottomColor: C.greenBorder,
    borderBottomStyle: 'solid',
    backgroundColor: C.greenLight,
  },
  summaryRowLast: {
    flexDirection: 'row',
    backgroundColor: C.greenLight,
  },
  summaryKey: {
    fontFamily: 'Roboto',
    fontWeight: 700,
    fontSize: 8.5,
    color: C.greenDark,
    width: '28%',
    padding: 6,
  },
  summaryVal: {
    fontFamily: 'Roboto',
    fontWeight: 400,
    fontSize: 8.5,
    color: C.greyText,
    flex: 1,
    padding: 6,
  },
});

export function InfoBlock({ goal }) {
  const info = getInfoText(goal);

  return (
    <View>
      <Text style={shared.infoH1}>{info.title}</Text>
      <View style={shared.dividerGreen} />

      <Text style={shared.infoBody}>{info.intro}</Text>
      <Text style={shared.infoBody}>{info.intro2}</Text>

      {info.sections.map((sec) => (
        <View key={sec.title}>
          <Text style={shared.infoH2}>{sec.title}</Text>
          <Text style={shared.infoBody}>{sec.body}</Text>
          {sec.bullets.map((b, i) => (
            <Text key={i} style={shared.infoBullet}>
              • {b}
            </Text>
          ))}
        </View>
      ))}

      {info.summary.text && (
        <Text style={s.summaryIntro}>{info.summary.text}</Text>
      )}
      {/* Souhrnná tabulka */}
      <View style={{ marginTop: 12 }}>
        <View style={shared.dividerGreen} />
        <Text style={shared.infoH2}>{info.summary.title}</Text>
        <View style={s.summaryTable}>
          {info.summary.items.map(([key, val], i) => (
            <View
              key={key}
              style={
                i === info.summary.items.length - 1
                  ? s.summaryRowLast
                  : s.summaryRow
              }
            >
              <Text style={s.summaryKey}>{key}</Text>
              <Text style={s.summaryVal}>{val}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
