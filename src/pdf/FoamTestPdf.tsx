import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { FoamTestReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';
import { PdfSignatures } from './PdfSignatures';
import { colors } from './styles';

interface Props {
  report: FoamTestReport;
}

const SectionBox: React.FC<{ title: string; text: string; minH?: number }> = ({ title, text, minH = 60 }) => (
  <View style={{ marginTop: 6 }}>
    <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 2, color: colors.textMid }}>
      {title}
    </Text>
    <Text style={{ fontSize: 8, borderWidth: 1, borderColor: colors.black, padding: 4, minHeight: minH }}>
      {text || ''}
    </Text>
  </View>
);

export const FoamTestPdf: React.FC<Props> = ({ report }) => {
  const { metadata, activity, specsAndPerformance, conclusions, photoAnnex, images, signatures } = report;

  return (
    <PdfDocument orientation="portrait">
      <PdfHeader title="INFORME DE PRUEBA DE SISTEMA DE ESPUMÍGENO" code="ITSGI011-A1-0" />

      <PdfFields
        columns={2}
        fields={[
          { label: 'FECHA',                   value: metadata.date },
          { label: 'HORA',                    value: metadata.time },
          { label: 'EQUIPO',                  value: metadata.equipment?.toUpperCase() },
          { label: 'POZO',                    value: metadata.well },
          { label: 'SUPERVISOR HS&E',         value: metadata.hseSupervisor },
          { label: 'SUPERVISOR DE CAMPO',     value: metadata.fieldSupervisor },
          { label: 'JEFE DE EQUIPO',          value: metadata.rigManager },
          { label: 'ENCARGADO DE TURNO',      value: metadata.shiftLeader },
        ]}
      />

      <View style={{ marginTop: 6, backgroundColor: colors.tableHeaderBg, padding: 4, textAlign: 'center' }}>
        <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase' }}>
          INFORME DE ACTIVIDAD
        </Text>
      </View>

      <SectionBox title="1. ACTIVIDAD DESARROLLADA" text={activity} />
      <SectionBox title="2. ESPECIFICACIONES TÉCNICAS DEL EQUIPAMIENTO Y RENDIMIENTO" text={specsAndPerformance} />
      <SectionBox title="3. CONCLUSIÓN Y OBSERVACIONES" text={conclusions} />
      <SectionBox title="4. DESCRIPCIÓN DE ANEXO FOTOGRÁFICO" text={photoAnnex} minH={40} />

      {images && images.length > 0 && (
        <View style={{ marginTop: 6 }}>
          <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 4, color: colors.textMid }}>
            5. REGISTRO FOTOGRÁFICO
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
            {images.map((img, i) => (
              <Image
                key={i}
                src={img}
                style={{ width: '48%', height: 120, objectFit: 'cover', borderWidth: 1, borderColor: colors.borderLight }}
              />
            ))}
          </View>
        </View>
      )}

      <PdfSignatures signatures={[
        { label: 'SUPERVISOR HS&E',  data: signatures['hseSupervisor']?.data },
        { label: 'JEFE DE EQUIPO',   data: signatures['rigManager']?.data },
      ]} />
    </PdfDocument>
  );
};
