import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { OilChangeReport, OilChangeSection } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';
import { PdfTable } from './PdfTable';
import { PdfSignatures } from './PdfSignatures';
import { colors } from './styles';

interface Props {
  report: OilChangeReport;
}

const SectionBlock: React.FC<{ section: OilChangeSection }> = ({ section }) => {
  const tableRows = section.items.map(row => [
    row.item || '',
    row.status === 'SI' ? 'X' : '',
    row.status === 'NO' ? 'X' : '',
    row.partsOrLiters || '',
  ]);

  return (
    <View style={{ marginBottom: 8, borderWidth: 1, borderColor: colors.black }}>
      {/* Section title + meters */}
      <View style={{ backgroundColor: colors.tableHeaderBg, borderBottomWidth: 1, borderColor: colors.black, padding: 3, flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', flex: 1 }}>
          {section.title}
        </Text>
        <Text style={{ fontSize: 7, color: colors.textMid }}>
          Horómetro: <Text style={{ fontFamily: 'Helvetica-Bold' }}>{section.hourMeter || '___'}</Text>
          {'   '}Hs. Próx. Mant: <Text style={{ fontFamily: 'Helvetica-Bold' }}>{section.maintenanceHours || '___'}</Text>
        </Text>
      </View>
      <PdfTable
        headers={['ÍTEM', 'SI', 'NO', 'CANT/LTS']}
        rows={tableRows}
        colWidths={['60%', '12%', '12%', '16%']}
        centerCols={[1, 2, 3]}
      />
      {section.observations ? (
        <View style={{ padding: 3, borderTopWidth: 1, borderColor: colors.borderLight }}>
          <Text style={{ fontSize: 6.5, color: colors.textMid, fontFamily: 'Helvetica-Bold' }}>Observaciones: </Text>
          <Text style={{ fontSize: 7 }}>{section.observations}</Text>
        </View>
      ) : null}
    </View>
  );
};

export const OilChangePdf: React.FC<Props> = ({ report }) => {
  const { metadata, sections, signatures } = report;

  return (
    <PdfDocument orientation="landscape">
      <PdfHeader title="CAMBIO DE ACEITE Y FILTROS" code="IT-WSM-004-A1" subtitle="Revisión 00" />

      <PdfFields
        columns={3}
        fields={[
          { label: 'MECÁNICO 1',   value: metadata.mechanic1 },
          { label: 'MECÁNICO 2',   value: metadata.mechanic2 },
          { label: 'FECHA',        value: metadata.date },
          { label: 'EQUIPO',       value: metadata.equipment?.toUpperCase() },
          { label: 'CLIENTE',      value: metadata.client },
          { label: 'YACIMIENTO',   value: metadata.field },
          { label: 'POZO',         value: metadata.well },
        ]}
      />

      <View style={{ marginTop: 6, flexDirection: 'row', gap: 6 }}>
        {sections.map(section => (
          <View key={section.id} style={{ flex: 1 }}>
            <SectionBlock section={section} />
          </View>
        ))}
      </View>

      <PdfSignatures signatures={[
        { label: 'FIRMA MECÁNICO',    data: signatures['mechanic']?.data },
        { label: 'FIRMA SUPERVISOR',  data: signatures['supervisor']?.data },
      ]} />
    </PdfDocument>
  );
};
