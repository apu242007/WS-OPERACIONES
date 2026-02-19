import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { ElectricalToolChecklistReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfTable } from './PdfTable';
import { PdfSignatures } from './PdfSignatures';
import { colors } from './styles';

interface Props {
  report: ElectricalToolChecklistReport;
}

export const ElectricalToolChecklistPdf: React.FC<Props> = ({ report }) => {
  const { metadata, rows, observations, signatures } = report;

  const tableRows = rows.map((row, i) => [
    `${i + 1}. ${row.question}`,
    row.status === 'SI' ? 'X' : '',
    row.status === 'NO' ? 'X' : '',
    row.status === 'NA' ? 'X' : '',
  ]);

  return (
    <PdfDocument orientation="portrait">
      <PdfHeader title="CHECK LIST HERRAMIENTAS ELÉCTRICAS" code="POSGI001-A21-0" subtitle="REV: 0" />

      {/* Tool / Area fields */}
      <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: colors.black, marginBottom: 4 }}>
        <View style={{ flex: 1, flexDirection: 'row', borderRightWidth: 1, borderRightColor: colors.black, padding: 4, alignItems: 'center' }}>
          <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', marginRight: 4, textTransform: 'uppercase' }}>Herramienta:</Text>
          <Text style={{ fontSize: 8, flex: 1 }}>{metadata.toolName || ''}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', padding: 4, alignItems: 'center' }}>
          <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', marginRight: 4, textTransform: 'uppercase' }}>Área:</Text>
          <Text style={{ fontSize: 8, flex: 1 }}>{metadata.area || ''}</Text>
        </View>
      </View>

      <PdfTable
        headers={['ELEMENTOS A INSPECCIONAR', 'SI', 'NO', 'N.A']}
        rows={tableRows}
        colWidths={['76%', '8%', '8%', '8%']}
        centerCols={[1, 2, 3]}
      />

      {/* Observations */}
      <View style={{ marginTop: 6 }}>
        <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 2 }}>Observaciones:</Text>
        <Text style={{ fontSize: 8, borderWidth: 1, borderColor: colors.black, padding: 4, minHeight: 40 }}>{observations || ''}</Text>
      </View>

      {/* Two-column footer: REALIZÓ / REVISÓ */}
      <View style={{ flexDirection: 'row', marginTop: 10, gap: 8 }}>
        {/* REALIZÓ */}
        <View style={{ flex: 1, borderWidth: 1, borderColor: colors.black, padding: 6 }}>
          <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', textAlign: 'center', borderBottomWidth: 1, borderBottomColor: colors.black, paddingBottom: 2, marginBottom: 4 }}>REALIZÓ</Text>
          <View style={{ flexDirection: 'row', marginBottom: 3 }}>
            <Text style={{ fontSize: 6.5, fontFamily: 'Helvetica-Bold', width: 40 }}>NOMBRE:</Text>
            <Text style={{ fontSize: 7, flex: 1, borderBottomWidth: 1, borderBottomColor: colors.textMid }}>{metadata.inspectorName || ''}</Text>
          </View>
          <View style={{ flexDirection: 'row', marginBottom: 6 }}>
            <Text style={{ fontSize: 6.5, fontFamily: 'Helvetica-Bold', width: 40 }}>CARGO:</Text>
            <Text style={{ fontSize: 7, flex: 1, borderBottomWidth: 1, borderBottomColor: colors.textMid }}>{metadata.inspectorJobTitle || ''}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 2 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 6.5, fontFamily: 'Helvetica-Bold', marginBottom: 2 }}>FIRMA</Text>
              {signatures['inspector']?.data ? (
                // eslint-disable-next-line jsx-a11y/alt-text
                <></>
              ) : null}
              <View style={{ borderBottomWidth: 1, borderBottomColor: colors.black, height: 30 }} />
            </View>
            <View style={{ width: 60 }}>
              <Text style={{ fontSize: 6.5, fontFamily: 'Helvetica-Bold', marginBottom: 2 }}>FECHA</Text>
              <Text style={{ fontSize: 7, borderBottomWidth: 1, borderBottomColor: colors.black }}>{metadata.inspectorDate || ''}</Text>
            </View>
          </View>
        </View>

        {/* REVISÓ */}
        <View style={{ flex: 1, borderWidth: 1, borderColor: colors.black, padding: 6 }}>
          <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', textAlign: 'center', borderBottomWidth: 1, borderBottomColor: colors.black, paddingBottom: 2, marginBottom: 4 }}>REVISÓ</Text>
          <View style={{ flexDirection: 'row', marginBottom: 14 }}>
            <Text style={{ fontSize: 6.5, fontFamily: 'Helvetica-Bold', width: 52 }}>SUPERVISOR:</Text>
            <Text style={{ fontSize: 7, flex: 1, borderBottomWidth: 1, borderBottomColor: colors.textMid }}>{metadata.supervisorName || ''}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 2 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 6.5, fontFamily: 'Helvetica-Bold', marginBottom: 2 }}>FIRMA</Text>
              <View style={{ borderBottomWidth: 1, borderBottomColor: colors.black, height: 30 }} />
            </View>
            <View style={{ width: 60 }}>
              <Text style={{ fontSize: 6.5, fontFamily: 'Helvetica-Bold', marginBottom: 2 }}>FECHA</Text>
              <Text style={{ fontSize: 7, borderBottomWidth: 1, borderBottomColor: colors.black }}>{metadata.supervisorDate || ''}</Text>
            </View>
          </View>
        </View>
      </View>
    </PdfDocument>
  );
};
