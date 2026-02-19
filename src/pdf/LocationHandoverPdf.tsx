import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { LocationHandoverReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';
import { PdfSignatures } from './PdfSignatures';
import { colors } from './styles';

interface Props {
  report: LocationHandoverReport;
}

export const LocationHandoverPdf: React.FC<Props> = ({ report }) => {
  const { metadata, schemeImage, observations, photos, signatures } = report;

  const typeLabel = metadata.type === 'RECIBO' ? 'RECIBO DE LOCACIÓN' : 'ENTREGA DE LOCACIÓN';

  return (
    <PdfDocument orientation="portrait">
      <PdfHeader title="RECIBO Y ENTREGA DE LOCACIÓN" code="PO-WSG-001-A2-0" subtitle="Revisión 00" />

      {/* Type indicator */}
      <View style={{ backgroundColor: metadata.type === 'RECIBO' ? '#1d4ed8' : '#cc0000', padding: 4, marginBottom: 4 }}>
        <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#ffffff', textAlign: 'center' }}>{typeLabel}</Text>
      </View>

      <PdfFields columns={2} fields={[
        { label: 'FECHA', value: metadata.date },
        { label: 'POZO', value: metadata.well },
        { label: 'EQUIPO', value: metadata.equipment?.toUpperCase() },
        { label: 'JEFE DE EQUIPO', value: metadata.rigManager },
        { label: 'COMPANY REP. / SUP.', value: metadata.companyRepresentative },
        { label: 'RESP. SERV. AL POZO', value: metadata.serviceResponsible },
      ]} />

      {/* Layout Scheme */}
      {schemeImage && (
        <View style={{ marginTop: 6 }}>
          <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 3 }}>
            Esquema Locación para equipos convencionales
          </Text>
          <Image src={schemeImage} style={{ width: '100%', maxHeight: 200, objectFit: 'contain', borderWidth: 1, borderColor: colors.borderLight }} />
        </View>
      )}

      {/* Observations */}
      <View style={{ marginTop: 6 }}>
        <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 2 }}>Observaciones:</Text>
        <Text style={{ fontSize: 8, borderWidth: 1, borderColor: colors.black, padding: 4, minHeight: 50 }}>{observations || ''}</Text>
      </View>

      {/* Photos */}
      {photos.length > 0 && (
        <View style={{ marginTop: 6 }}>
          <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 3 }}>Registro Fotográfico Adicional</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
            {photos.map((img, i) => (
              <Image key={i} src={img} style={{ width: '23%', height: 80, objectFit: 'cover', borderWidth: 1, borderColor: colors.borderLight }} />
            ))}
          </View>
        </View>
      )}

      <PdfSignatures signatures={[
        { label: 'Jefe de Equipo / Encargado de Turno', data: signatures['rigManager']?.data, name: metadata.rigManager },
        { label: 'Company Representative / Supervisor Instalación', data: signatures['companyRepresentative']?.data, name: metadata.companyRepresentative },
      ]} />
    </PdfDocument>
  );
};
