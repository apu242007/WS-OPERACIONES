import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { TransportChecklistReport } from '../types';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';

interface Props {
  report: TransportChecklistReport;
}

const SECTIONS = [
  { title: "Verificar elementos de seguridad y herramientas.", items: ["Matafuegos cargados","Botiquín de primeros auxilios","Balizas","Cinturón de seguridad","Barra de remolque","Gato para cambiar cubierta","Cubierta de auxilio","Triángulos reflectantes de estacionamiento.","Cadenas (zonas de hielo)","Pala"] },
  { title: "Verificar sistema de transmisión", items: ["Cardan y crucetas.","Caja de velocidades."] },
  { title: "Verificar sistema eléctrico.", items: ["Baterías y su ajuste.","Alternador. Revisar su correa.","Revisar y calibrar luces altas y bajas.","Luz de posición traseras y delanteras.","Luz de freno.","Luces de giro.","Baliza rotativa.","Luz de cabina.","Luz de retroceso.","Alarma sonora de retroceso."] },
  { title: "Verificar Sistema de Frenos", items: ["Tanque de aire y circuito. Verificar correas.","Funcionamiento válvula de regulación del sistema neumático","Funcionamiento de freno.","Funcionamiento de freno de estacionamiento.","Pulmones."] },
  { title: "Verificar estado de Cabina y sus elementos", items: ["Limpieza Vidrios","Limpieza y posiciones Espejos retrovisores","Posición Asiento y su cinturón de seguridad.","Funcionamiento del limpia parabrisas.","Funcionamiento de climatizador.","Funcionamiento de indicadores en tablero.(Presión de aceite, Amperímetro, Temperatura del agua)","Funcionamiento de desempañador.","Funcionamiento de bocina.","Recorrido pedal de embrague","Pedales de freno y acelerado","Freno de mano","Limpieza del interior de cabina","Ajuste de puertas y ventas","Hermeticidad de cabina.","Calcomanías de advertencia uso cinturón de seguridad","Accionamiento de dirección.","Pantalla contra sol.","Luz de tablero."] },
  { title: "Ruedas", items: ["Estado de cubiertas. (incluido auxilio)","Presión de aire. (incluido auxilio)","Reapretar ruedas."] },
  { title: "Documentación", items: ["Autorización para circular.","Vigencia de revisión técnica","Vigencia carnet de conductor y categoría","Vigencia de seguro.","Curso de manejo defensivo del conductor.","Patente al día."] },
  { title: "Motor", items: ["Combustible. Volúmenes y tapas de tanques.","Radiador y liquido refrigerante.","Correas de ventilador.","Circuito de lubricación y volúmenes.","Filtros de aire, aceite y combustible.","Sistema de escape.","Accionamiento de embrague.","Sistema de arranque.","Sistema hidráulico."] },
  { title: "Parte inferior del equipo", items: ["Existencia de elementos sueltos.","Manifestaciones de fugas o perdidas de fluidos","Ajuste de tuercas de apoyo de patas hidráulicas."] },
  { title: "Parte exterior del Equipo", items: ["Elementos que obstruyan el radiador.","Elementos sueltos o que puedan desprenderse durante maniobras o traslado.","Chapa patente."] },
  { title: "Suspensión y dirección", items: ["Caja y extremos de dirección.","Amortiguadores.","Elásticos."] },
];

const s = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 7, padding: 14, backgroundColor: '#fff' },
  tableHead: {
    flexDirection: 'row', backgroundColor: '#e5e7eb',
    borderTop: '1pt solid #000', borderBottom: '1pt solid #000',
    fontFamily: 'Helvetica-Bold', fontSize: 7.5, minHeight: 16, alignItems: 'center',
  },
  sectionRow: {
    flexDirection: 'row', backgroundColor: '#f3f4f6',
    borderBottom: '0.5pt solid #9ca3af', minHeight: 13, alignItems: 'center',
  },
  sectionText: { fontSize: 7, fontFamily: 'Helvetica-Bold', paddingHorizontal: 3 },
  itemRow: { flexDirection: 'row', borderBottom: '0.3pt solid #d1d5db', minHeight: 12, alignItems: 'center' },
  descCell: { flex: 1, paddingHorizontal: 3, paddingVertical: 1, borderRight: '0.3pt solid #d1d5db', fontSize: 7 },
  statusCell: { width: 24, paddingHorizontal: 2, paddingVertical: 1, borderRight: '0.3pt solid #d1d5db', textAlign: 'center', fontSize: 7, fontFamily: 'Helvetica-Bold' },
  obsCell: { width: 90, paddingHorizontal: 3, paddingVertical: 1, fontSize: 6.5 },
  sigBox: { marginTop: 12, alignItems: 'center' },
  sigLine: { width: 160, height: 36, borderBottom: '1pt solid #000', marginBottom: 3 },
  sigImage: { width: 130, height: 36, objectFit: 'contain' },
  sigLabel: { fontSize: 8, fontFamily: 'Helvetica-Bold', textAlign: 'center' },
});

export const TransportChecklistPdf: React.FC<Props> = ({ report }) => {
  const { metadata, rows, signature } = report;
  const rowMap = Object.fromEntries(rows.map(r => [r.id, r]));

  const fields = [
    { label: 'FECHA', value: metadata.date, width: '33%' },
    { label: 'EQUIPO', value: metadata.equipment?.toUpperCase(), width: '33%' },
    { label: 'POZO', value: metadata.well, width: '34%' },
  ];

  return (
    <Document>
      <Page size="A4" orientation="portrait" style={s.page}>
        <PdfHeader title="CHECK LIST DE EQUIPO AUTOTRANSPORTABLE" code="POWWO001-A1-2" />
        <PdfFields fields={fields} columns={3} />

        <View style={s.tableHead}>
          <Text style={{ ...s.descCell, flex: 1, fontFamily: 'Helvetica-Bold' }}>DESCRIPCIÓN</Text>
          <Text style={{ ...s.statusCell, fontFamily: 'Helvetica-Bold' }}>BIEN</Text>
          <Text style={{ ...s.statusCell, fontFamily: 'Helvetica-Bold' }}>MAL</Text>
          <Text style={{ ...s.obsCell }}>OBSERVACIONES</Text>
        </View>

        {SECTIONS.map((section, idx) => (
          <React.Fragment key={idx}>
            <View style={s.sectionRow}>
              <Text style={{ ...s.sectionText, flex: 1 }}>{section.title}</Text>
            </View>
            {section.items.map(item => {
              const row = rowMap[item];
              const bienBg = row?.status === 'BIEN' ? '#dcfce7' : '#fff';
              const malBg = row?.status === 'MAL' ? '#fee2e2' : '#fff';
              return (
                <View key={item} style={s.itemRow}>
                  <Text style={s.descCell}>{item}</Text>
                  <Text style={{ ...s.statusCell, backgroundColor: bienBg, color: bienBg !== '#fff' ? '#166534' : '#374151' }}>
                    {row?.status === 'BIEN' ? 'X' : ''}
                  </Text>
                  <Text style={{ ...s.statusCell, backgroundColor: malBg, color: malBg !== '#fff' ? '#991b1b' : '#374151' }}>
                    {row?.status === 'MAL' ? 'X' : ''}
                  </Text>
                  <Text style={s.obsCell}>{row?.observations ?? ''}</Text>
                </View>
              );
            })}
          </React.Fragment>
        ))}

        <View style={s.sigBox}>
          {signature?.data
            ? <Image src={signature.data} style={s.sigImage} />
            : <View style={s.sigLine} />
          }
          <Text style={s.sigLabel}>Elabora: Firma y Aclaración</Text>
        </View>
      </Page>
    </Document>
  );
};
