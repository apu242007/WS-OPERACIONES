import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { StilsonInspectionReport, StilsonStatus } from '../types';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';

interface Props {
  report: StilsonInspectionReport;
}

const ITEMS_LIST = [
  "QUIJADA MOVIL", "RESORTES INTERNOS", "TUERCA DE FIJACIÓN",
  "MANGO LATERAL", "QUIJADA FIJA", "ESTADO DEL CUERPO DE LA LLAVE",
  "ALMACENAMIENTO DE LA LLAVE"
];
const WEEKS = ['w1', 'w2', 'w3', 'w4'] as const;

const s = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 8, padding: 16, backgroundColor: '#fff' },
  tableHeader: {
    flexDirection: 'row', backgroundColor: '#e5e7eb', borderTop: '1pt solid #000',
    borderBottom: '1pt solid #000', fontFamily: 'Helvetica-Bold', fontSize: 7,
    alignItems: 'center',
  },
  subHeader: {
    flexDirection: 'row', backgroundColor: '#f3f4f6', borderBottom: '1pt solid #000',
    fontFamily: 'Helvetica-Bold', fontSize: 6.5, alignItems: 'center',
  },
  row: { flexDirection: 'row', borderBottom: '0.5pt solid #d1d5db', minHeight: 14, alignItems: 'center' },
  descCell: { width: 120, paddingHorizontal: 3, paddingVertical: 1, borderRight: '0.5pt solid #9ca3af', fontSize: 7, fontFamily: 'Helvetica-Bold', backgroundColor: '#f9fafb' },
  weekGroup: { flex: 1, flexDirection: 'row' },
  statusCell: { flex: 1, textAlign: 'center', borderRight: '0.3pt solid #d1d5db', fontSize: 7, fontFamily: 'Helvetica-Bold', paddingVertical: 1 },
  weekHeader: { flex: 1, borderRight: '0.5pt solid #9ca3af', textAlign: 'center', paddingVertical: 2, fontSize: 7 },
  inspectorRow: { flexDirection: 'row', borderBottom: '0.5pt solid #d1d5db', minHeight: 16, alignItems: 'center' },
  sigRow: { flexDirection: 'row', borderBottom: '0.5pt solid #d1d5db', minHeight: 40, alignItems: 'center' },
  legend: { textAlign: 'center', fontSize: 7, fontFamily: 'Helvetica-Bold', padding: 2, backgroundColor: '#f3f4f6', borderBottom: '0.5pt solid #000' },
  disclaimer: { textAlign: 'center', fontSize: 6.5, fontFamily: 'Helvetica-Bold', padding: 3, borderTop: '1pt solid #000', borderBottom: '1pt solid #000', marginTop: 4 },
  bottomRow: { flexDirection: 'row', marginTop: 6 },
  obsBox: { flex: 1, marginRight: 8 },
  obsLabel: { fontFamily: 'Helvetica-Bold', fontSize: 7.5, marginBottom: 2 },
  obsArea: { border: '0.5pt solid #d1d5db', borderRadius: 2, padding: 3, minHeight: 36, fontSize: 7 },
  oosBox: { width: 100, border: '0.5pt solid #d1d5db', borderRadius: 2, padding: 4 },
  oosTitle: { fontFamily: 'Helvetica-Bold', fontSize: 7.5, textAlign: 'center', borderBottom: '0.5pt solid #9ca3af', marginBottom: 4, paddingBottom: 2 },
  checkRow: { flexDirection: 'row', justifyContent: 'space-around' },
  checkItem: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  checkbox: { width: 8, height: 8, border: '1pt solid #000', marginRight: 2 },
  checkboxFilled: { width: 8, height: 8, border: '1pt solid #000', backgroundColor: '#000', marginRight: 2 },
});

const STATUS_COLORS: Record<string, string> = {
  C: '#dcfce7', NC: '#fee2e2', NA: '#f3f4f6',
};

export const StilsonInspectionPdf: React.FC<Props> = ({ report }) => {
  const { metadata, items, weeks, observations } = report;

  const fields = [
    { label: 'FECHA', value: metadata.date, width: '25%' },
    { label: 'MARCA', value: metadata.brand, width: '25%' },
    { label: 'ID / SERIAL', value: metadata.serial, width: '25%' },
    { label: 'PULGADAS', value: metadata.inches, width: '25%' },
  ];

  const getStatus = (itemId: string, week: typeof WEEKS[number]): StilsonStatus => {
    const item = items.find(i => i.id === itemId);
    return item ? item[week] : null;
  };

  return (
    <Document>
      <Page size="A4" orientation="portrait" style={s.page}>
        <PdfHeader title="INSPECCION DE LLAVE STILSON" code="IT-SGI-001-A2-0" />
        <PdfFields fields={fields} columns={4} />

        {/* Table header (week names) */}
        <View style={s.tableHeader}>
          <Text style={{ ...s.descCell, backgroundColor: '#e5e7eb' }}>DESCRIPCIÓN</Text>
          {WEEKS.map((w, i) => (
            <Text key={w} style={{ ...s.weekHeader }}>SEMANA #{i + 1}</Text>
          ))}
        </View>

        {/* Sub-header (C / NC / NA per week) */}
        <View style={s.subHeader}>
          <View style={{ width: 120, borderRight: '0.5pt solid #9ca3af' }} />
          {WEEKS.map(w => (
            <View key={w} style={s.weekGroup}>
              {(['C','NC','NA'] as StilsonStatus[]).map(type => (
                <Text key={String(type)} style={s.statusCell}>{type}</Text>
              ))}
            </View>
          ))}
        </View>

        {/* Item rows */}
        {items.map(item => (
          <View key={item.id} style={s.row}>
            <Text style={s.descCell}>{item.description}</Text>
            {WEEKS.map(w => (
              <View key={w} style={s.weekGroup}>
                {(['C','NC','NA'] as StilsonStatus[]).map(type => {
                  const active = getStatus(item.id, w) === type;
                  return (
                    <Text key={String(type)} style={{ ...s.statusCell, backgroundColor: active ? STATUS_COLORS[String(type)] : 'transparent', fontFamily: active ? 'Helvetica-Bold' : 'Helvetica' }}>
                      {active ? 'X' : ''}
                    </Text>
                  );
                })}
              </View>
            ))}
          </View>
        ))}

        <Text style={s.legend}>C= CONFORME     NC= NO CONFORME     NA= NO APLICA</Text>

        {/* Inspector row */}
        <View style={s.inspectorRow}>
          <Text style={{ ...s.descCell, fontSize: 6.5, backgroundColor: '#f9fafb' }}>NOMBRE Y APELLIDO</Text>
          {WEEKS.map(w => (
            <Text key={w} style={{ flex: 1, fontSize: 7, textAlign: 'center', borderRight: '0.3pt solid #d1d5db', paddingHorizontal: 2 }}>
              {weeks[w]?.inspectorName || ''}
            </Text>
          ))}
        </View>

        {/* Signature row */}
        <View style={s.sigRow}>
          <Text style={{ ...s.descCell, fontSize: 6.5, backgroundColor: '#f9fafb', alignSelf: 'center' }}>FIRMA</Text>
          {WEEKS.map(w => (
            <View key={w} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderRight: '0.3pt solid #d1d5db', height: 40 }}>
              {weeks[w]?.signature?.data
                ? <Image src={weeks[w].signature!.data!} style={{ width: 60, height: 32, objectFit: 'contain' }} />
                : null
              }
            </View>
          ))}
        </View>

        <Text style={s.disclaimer}>LA FIRMA DE ESTE REGISTRO EVIDENCIA QUE HE VERIFICADO LA LISTA Y CERTIFICO QUE ES SEGURA LA HERRAMIENTA</Text>

        <View style={s.bottomRow}>
          <View style={s.obsBox}>
            <Text style={s.obsLabel}>OBSERVACIONES:</Text>
            <View style={s.obsArea}><Text>{observations}</Text></View>
          </View>
          <View style={s.oosBox}>
            <Text style={s.oosTitle}>FUERA DE SERVICIO</Text>
            <View style={s.checkRow}>
              <View style={s.checkItem}>
                <View style={metadata.outOfService === true ? s.checkboxFilled : s.checkbox} />
                <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold' }}>SI</Text>
              </View>
              <View style={s.checkItem}>
                <View style={metadata.outOfService === false ? s.checkboxFilled : s.checkbox} />
                <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold' }}>NO</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
