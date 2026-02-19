import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { MastAssemblyRolesReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';
import { colors } from './styles';

interface Props {
  report: MastAssemblyRolesReport;
}

export const MastAssemblyRolesPdf: React.FC<Props> = ({ report }) => {
  const { metadata, roles, section1Observations, section2Observations, signatures } = report;

  return (
    <PdfDocument orientation="portrait">
      <PdfHeader
        title="DISTRIBUCIÓN DE ROLES Y FUNCIONES DEL PERSONAL EN EL MONTAJE DEL MÁSTIL"
        code="IT-WWO-003-A3-0"
        subtitle="Revisión 00"
      />

      {/* Alert Box */}
      <View style={{ backgroundColor: '#fefce8', borderWidth: 1, borderColor: '#f59e0b', borderLeftWidth: 4, borderLeftColor: '#ef4444', padding: 6, marginBottom: 6 }}>
        <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#b91c1c', textAlign: 'center', textTransform: 'uppercase', marginBottom: 2 }}>
          ⚠ Previo a realizar el montaje, se tendrá que dar lectura al ATS N° 04
        </Text>
        <Text style={{ fontSize: 7, color: '#374151', textAlign: 'center' }}>
          En cada montaje del mástil, se distribuirán Roles y funciones a cada personal del turno, respetando el Organigrama y Lay Out establecido.
        </Text>
      </View>

      <PdfFields columns={3} fields={[
        { label: 'FECHA', value: metadata.date },
        { label: 'EQUIPO', value: metadata.equipment?.toUpperCase() },
        { label: 'LOCACIÓN', value: metadata.location },
      ]} />

      {/* Roles Table */}
      <View style={{ marginTop: 8, borderWidth: 1, borderColor: colors.black }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', backgroundColor: colors.tableHeaderBg, borderBottomWidth: 1, borderColor: colors.black }}>
          <Text style={{ width: 30, fontSize: 7, fontFamily: 'Helvetica-Bold', padding: 3, textAlign: 'center', borderRightWidth: 1, borderColor: colors.black }}>N°</Text>
          <Text style={{ width: 120, fontSize: 7, fontFamily: 'Helvetica-Bold', padding: 3, textTransform: 'uppercase', borderRightWidth: 1, borderColor: colors.black }}>Función</Text>
          <Text style={{ flex: 1, fontSize: 7, fontFamily: 'Helvetica-Bold', padding: 3, textTransform: 'uppercase', borderRightWidth: 1, borderColor: colors.black }}>Nombre y Apellido</Text>
          <Text style={{ width: 80, fontSize: 7, fontFamily: 'Helvetica-Bold', padding: 3, textAlign: 'center', textTransform: 'uppercase' }}>Firma</Text>
        </View>

        {roles.map((row, idx) => (
          <View key={row.id} style={{ flexDirection: 'row', borderBottomWidth: idx < roles.length - 1 ? 1 : 0, borderColor: colors.borderLight, minHeight: 28, backgroundColor: idx % 2 === 0 ? '#fff' : colors.tableAltBg }}>
            <Text style={{ width: 30, fontSize: 8, padding: 4, textAlign: 'center', fontFamily: 'Helvetica-Bold', borderRightWidth: 1, borderColor: colors.borderLight }}>{row.position}</Text>
            <Text style={{ width: 120, fontSize: 8, padding: 4, borderRightWidth: 1, borderColor: colors.borderLight }}>{row.functionName}</Text>
            <Text style={{ flex: 1, fontSize: 8, padding: 4, borderRightWidth: 1, borderColor: colors.borderLight }}>{row.personName || ''}</Text>
            <View style={{ width: 80, padding: 2, alignItems: 'center', justifyContent: 'center' }}>
              {row.signature?.data ? (
                <Image src={row.signature.data} style={{ width: 60, height: 22 }} />
              ) : (
                <View style={{ height: 22, width: 60, borderBottomWidth: 1, borderColor: colors.black }} />
              )}
            </View>
          </View>
        ))}
      </View>

      {/* Clarification note */}
      <View style={{ marginTop: 4, padding: 4, backgroundColor: '#f9fafb', borderWidth: 1, borderColor: colors.borderLight }}>
        <Text style={{ fontSize: 6, color: colors.textMid, fontStyle: 'italic' }}>
          <Text style={{ fontFamily: 'Helvetica-Bold' }}>Aclaración:</Text> Tanto el personal de Mantenimiento, como así también el Supervisor de Campo y el personal de CMASySO pueden estar de apoyo en el montaje.
        </Text>
      </View>

      {/* Section 1 */}
      <View style={{ marginTop: 10 }}>
        <View style={{ backgroundColor: colors.black, padding: 4, marginBottom: 4 }}>
          <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#fff', textTransform: 'uppercase' }}>Montaje de Mástil 1º Tramo</Text>
        </View>
        <View style={{ borderLeftWidth: 4, borderColor: '#ef4444', paddingLeft: 6, marginBottom: 4, backgroundColor: '#fef2f2', padding: 4 }}>
          <Text style={{ fontSize: 7, fontStyle: 'italic', color: '#374151' }}>
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>Nota:</Text> Cualquier miembro del equipo tiene la autoridad para detener la maniobra ante cualquier anomalía detectada.
          </Text>
        </View>
        <View style={{ borderWidth: 1, borderColor: colors.borderLight, padding: 4, minHeight: 50 }}>
          <Text style={{ fontSize: 6, fontFamily: 'Helvetica-Bold', color: colors.textMid, textTransform: 'uppercase', marginBottom: 3 }}>Novedades / Observaciones 1º Tramo:</Text>
          <Text style={{ fontSize: 8 }}>{section1Observations || ''}</Text>
        </View>
      </View>

      {/* Section 2 */}
      <View style={{ marginTop: 10 }}>
        <View style={{ backgroundColor: colors.black, padding: 4, marginBottom: 4 }}>
          <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#fff', textTransform: 'uppercase' }}>Montaje de Mástil 2º Tramo</Text>
        </View>
        <Text style={{ fontSize: 7, color: '#374151', marginBottom: 4, lineHeight: 1.4 }}>
          Una vez realizado el montaje del 2º tramo se coloca la/las <Text style={{ fontFamily: 'Helvetica-Bold' }}>traba (perno) manual del 2º tramo</Text>, posteriormente se comienza a tensionar los vientos de carga, y los contravientos (en corona y piso de enganche).
        </Text>
        <View style={{ borderLeftWidth: 4, borderColor: '#ef4444', paddingLeft: 6, marginBottom: 4, backgroundColor: '#fef2f2', padding: 4 }}>
          <Text style={{ fontSize: 7, fontStyle: 'italic', color: '#374151' }}>
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>Nota:</Text> Cualquier miembro del equipo tiene la autoridad para detener la maniobra ante cualquier anomalía detectada.
          </Text>
        </View>
        <View style={{ borderWidth: 1, borderColor: colors.borderLight, padding: 4, minHeight: 50 }}>
          <Text style={{ fontSize: 6, fontFamily: 'Helvetica-Bold', color: colors.textMid, textTransform: 'uppercase', marginBottom: 3 }}>Novedades / Observaciones 2º Tramo:</Text>
          <Text style={{ fontSize: 8 }}>{section2Observations || ''}</Text>
        </View>
      </View>

      {/* Supervisor Signature */}
      <View style={{ marginTop: 20, alignItems: 'center' }}>
        <View style={{ width: 220, alignItems: 'center' }}>
          {signatures.supervisor?.data ? (
            <Image src={signatures.supervisor.data} style={{ width: 100, height: 50, marginBottom: 4 }} />
          ) : (
            <View style={{ height: 50, width: 220, borderBottomWidth: 1, borderColor: colors.black }} />
          )}
          <View style={{ width: 220, borderTopWidth: 1, borderColor: colors.black, paddingTop: 3 }}>
            <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', textAlign: 'center', textTransform: 'uppercase' }}>Supervisor / Jefe de Equipo</Text>
            <Text style={{ fontSize: 6, color: colors.textMid, textAlign: 'center' }}>Firma y Aclaración</Text>
          </View>
        </View>
      </View>
    </PdfDocument>
  );
};
