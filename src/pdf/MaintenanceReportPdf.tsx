import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { MaintenanceReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';
import { PdfSignatures } from './PdfSignatures';
import { colors } from './styles';

interface Props {
  report: MaintenanceReport;
}

const RadioRow: React.FC<{ label: string; value: string | null; options: string[] }> = ({ label, value, options }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
    <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', minWidth: 140 }}>{label}</Text>
    <View style={{ flexDirection: 'row', gap: 10 }}>
      {options.map((opt) => (
        <View key={opt} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, borderWidth: 1, borderColor: colors.black, backgroundColor: value === opt ? colors.black : '#fff' }} />
          <Text style={{ fontSize: 7 }}>{opt}</Text>
        </View>
      ))}
    </View>
  </View>
);

export const MaintenanceReportPdf: React.FC<Props> = ({ report }) => {
  const { metadata, items, signatures } = report;

  return (
    <PdfDocument orientation="portrait">
      <PdfHeader title="SOLICITUD DE MANTENIMIENTO" code="POWSG001-A4-0" />

      <PdfFields columns={2} fields={[
        { label: 'SOLICITUD N°', value: metadata.reportNumber },
        { label: 'FECHA', value: metadata.date },
        { label: 'NOMBRE SUPERVISOR', value: metadata.supervisorName },
        { label: 'NOMBRE MECÁNICO', value: metadata.mechanicName },
        { label: 'EQUIPO', value: metadata.equipmentNumber?.toUpperCase() },
        { label: 'CLIENTE', value: metadata.client },
        { label: 'YACIMIENTO', value: metadata.field },
        { label: 'POZO', value: metadata.well },
      ]} />

      {/* Items */}
      {items.map((item, index) => (
        <View key={item.id} style={{ marginTop: 8, borderWidth: 2, borderColor: colors.black, padding: 6 }}>
          <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', marginBottom: 4, textDecoration: 'underline' }}>ÍTEM {index + 1}</Text>

          <View style={{ marginBottom: 4 }}>
            <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', marginBottom: 2, textTransform: 'uppercase' }}>Descripción de la Anomalía:</Text>
            <Text style={{ fontSize: 8, borderWidth: 1, borderColor: colors.black, padding: 3, minHeight: 36 }}>{item.anomalyDescription || ''}</Text>
          </View>

          <View style={{ marginBottom: 4 }}>
            <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', marginBottom: 2, textTransform: 'uppercase' }}>Mantenimiento Realizado:</Text>
            <Text style={{ fontSize: 8, borderWidth: 1, borderColor: colors.black, padding: 3, minHeight: 36 }}>{item.maintenancePerformed || ''}</Text>
          </View>

          <View style={{ backgroundColor: '#f5f5f5', padding: 4, borderWidth: 1, borderColor: colors.borderLight }}>
            <RadioRow label="El problema afectó la operación:" value={item.affectsOperation} options={['SI', 'NO']} />
            <RadioRow label="Prioridad:" value={item.priority} options={['Baja', 'Media', 'Alta']} />

            <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 6.5, fontFamily: 'Helvetica-Bold', marginBottom: 1 }}>Fecha Realización</Text>
                <Text style={{ fontSize: 7, borderWidth: 1, borderColor: colors.black, padding: 2 }}>{item.date || ''}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 6.5, fontFamily: 'Helvetica-Bold', marginBottom: 1 }}>Hora Inicio</Text>
                <Text style={{ fontSize: 7, borderWidth: 1, borderColor: colors.black, padding: 2 }}>{item.startTime || ''}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 6.5, fontFamily: 'Helvetica-Bold', marginBottom: 1 }}>Hora Finalización</Text>
                <Text style={{ fontSize: 7, borderWidth: 1, borderColor: colors.black, padding: 2 }}>{item.endTime || ''}</Text>
              </View>
            </View>
          </View>
        </View>
      ))}

      <PdfSignatures signatures={[
        { label: 'Firma Supervisor', data: signatures['supervisor']?.data, name: metadata.supervisorName },
        { label: 'Firma Mecánico', data: signatures['mechanic']?.data, name: metadata.mechanicName },
      ]} />
    </PdfDocument>
  );
};
