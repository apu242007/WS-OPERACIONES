import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { IPCRReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { colors } from './styles';

interface Props {
  report: IPCRReport;
}

const EPP_GROUPS = [
  { title: 'Trab. en Altura', items: [{ id: 'arnes', label: 'Arnés integral' }, { id: 'doble_cabo', label: 'Doble cabo (c/abs)' }, { id: 'linea_vida', label: 'Línea de vida' }, { id: 'cabo_vida_auto', label: 'Cabo vida auto' }, { id: 'descensor', label: 'Descensor tipo 8' }, { id: 'silleta', label: 'Silleta' }, { id: 'cuerda', label: 'Cuerda semiestática' }, { id: 'casco_altura', label: 'Casco altura' }] },
  { title: 'Seguridad', items: [{ id: 'casco_seguridad', label: 'Casco seg. (Cl. E)' }, { id: 'casco_rescate', label: 'Casco rescate' }, { id: 'eslingas', label: 'Eslingas/Conect.' }, { id: 'anticaidas', label: 'Anticaídas retráct.' }] },
  { title: 'Ocular/Facial', items: [{ id: 'anteojos', label: 'Anteojos seg.' }, { id: 'antiparras', label: 'Antiparras' }, { id: 'careta_facial', label: 'Careta facial' }, { id: 'careta_esmerilador', label: 'Careta esmeril.' }, { id: 'mascara_visor', label: 'Másc. visor int.' }] },
  { title: 'Respiratoria', items: [{ id: 'barbijo', label: 'Barbijo descar.' }, { id: 'respirador_media', label: 'Resp. media cara' }, { id: 'respirador_full', label: 'Resp. full face' }, { id: 'filtros', label: 'Filtros gas/vapor' }, { id: 'era', label: 'ERA autónomo' }, { id: 'linea_aire', label: 'Aire línea/cascada' }, { id: 'escafandra', label: 'Escafandra' }] },
  { title: 'Indumentaria', items: [{ id: 'ropa_ignifuga', label: 'Ropa ignífuga' }, { id: 'ropa_trabajo', label: 'Ropa trabajo' }, { id: 'ropa_soldador', label: 'Ropa soldador' }, { id: 'ropa_impermeable', label: 'Ropa impermeable' }, { id: 'ropa_descartable', label: 'Ropa Tyvek' }, { id: 'ropa_termica', label: 'Ropa térmica' }, { id: 'traje_bombero', label: 'Traje bombero' }, { id: 'traje_hidrocarb', label: 'Traje hidrocarb.' }] },
  { title: 'Calzado', items: [{ id: 'botin', label: 'Botín c/puntera' }, { id: 'calzado_dielectrico', label: 'Calzado dieléct.' }, { id: 'botas_goma', label: 'Botas goma/PVC' }] },
  { title: 'Protec. Manos', items: [{ id: 'guantes_cuero', label: 'Guantes cuero' }, { id: 'guantes_impacto', label: 'Guantes impacto' }, { id: 'guantes_quimicos', label: 'Guantes químicos' }, { id: 'guantes_dielectricos', label: 'Guantes dieléct.' }, { id: 'guantes_anticorte', label: 'Guantes anticorte' }, { id: 'guantes_soldadura', label: 'Guantes soldad.' }, { id: 'guantes_descartables', label: 'Guantes descar.' }] },
  { title: 'Auditiva', items: [{ id: 'tapones', label: 'Tapones' }, { id: 'orejeras', label: 'Orejeras alta at.' }, { id: 'sist_combinados', label: 'Sist. combinados' }] },
  { title: 'Otros', items: [{ id: 'polainas', label: 'Polainas' }, { id: 'rodilleras', label: 'Rodilleras' }, { id: 'prot_solar', label: 'Prot. solar' }, { id: 'chaleco', label: 'Chaleco reflec.' }, { id: 'arnes_rescate', label: 'Arnés rescate' }] },
];

const getRiskColor = (risk: string): string => {
  const n = parseInt(risk);
  if (!n) return '#fff';
  if (n <= 4) return '#dcfce7';
  if (n <= 9) return '#fef9c3';
  if (n <= 16) return '#fed7aa';
  return '#fee2e2';
};

export const IPCRPdf: React.FC<Props> = ({ report }) => {
  const { metadata, rows, epp, signatures } = report;

  return (
    <PdfDocument orientation="landscape">
      {/* Blue Header */}
      <View style={{ backgroundColor: '#1e3a8a', flexDirection: 'row', alignItems: 'center', padding: 6, marginBottom: 6 }}>
        <Text style={{ color: '#fff', fontFamily: 'Helvetica-Bold', fontSize: 14, width: '25%', fontStyle: 'italic' }}>TACKER</Text>
        <Text style={{ color: '#fff', fontFamily: 'Helvetica-Bold', fontSize: 11, flex: 1, textAlign: 'center', textTransform: 'uppercase' }}>
          Identificación de Peligros y Control de Riesgos
        </Text>
      </View>

      {/* Metadata Grid */}
      <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: colors.black, marginBottom: 4 }}>
        {/* Left */}
        <View style={{ flex: 1, borderRightWidth: 1, borderColor: colors.black }}>
          {[
            ['Tarea / Actividad', metadata.task],
            ['Subtarea', metadata.subtask],
            ['Lugar ejecución', metadata.location],
            ['Fecha confección', metadata.creationDate],
            ['Fecha ejecución', metadata.executionDate],
          ].map(([label, value], i, arr) => (
            <View key={label} style={{ flexDirection: 'row', borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderColor: colors.borderLight, minHeight: 14 }}>
              <Text style={{ width: 100, fontSize: 6, fontFamily: 'Helvetica-Bold', backgroundColor: '#f3f4f6', padding: 2 }}>{label}:</Text>
              <Text style={{ flex: 1, fontSize: 7, padding: 2 }}>{value || ''}</Text>
            </View>
          ))}
          <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: colors.borderLight, minHeight: 14 }}>
            <View style={{ flex: 1, flexDirection: 'row', borderRightWidth: 1, borderColor: colors.borderLight, minHeight: 14 }}>
              <Text style={{ width: 50, fontSize: 6, fontFamily: 'Helvetica-Bold', backgroundColor: '#f3f4f6', padding: 2 }}>Revisión:</Text>
              <Text style={{ flex: 1, fontSize: 7, padding: 2 }}>{metadata.revision}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', minHeight: 14 }}>
              <Text style={{ width: 60, fontSize: 6, fontFamily: 'Helvetica-Bold', backgroundColor: '#f3f4f6', padding: 2 }}>Cant. Hojas:</Text>
              <Text style={{ flex: 1, fontSize: 7, padding: 2 }}>{metadata.sheet}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: colors.borderLight, gap: 16, padding: 2 }}>
            <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
              <Text style={{ fontSize: 6, fontFamily: 'Helvetica-Bold' }}>Tarea Crítica:</Text>
              {['SI', 'NO'].map(opt => (
                <View key={opt} style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, borderWidth: 1, borderColor: colors.black, backgroundColor: metadata.criticalTask === opt ? colors.black : '#fff' }} />
                  <Text style={{ fontSize: 6 }}>{opt}</Text>
                </View>
              ))}
            </View>
            <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
              <Text style={{ fontSize: 6, fontFamily: 'Helvetica-Bold' }}>Permiso Trabajo:</Text>
              {['SI', 'NO'].map(opt => (
                <View key={opt} style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, borderWidth: 1, borderColor: colors.black, backgroundColor: metadata.workPermit === opt ? colors.black : '#fff' }} />
                  <Text style={{ fontSize: 6 }}>{opt}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Right */}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: colors.borderLight, minHeight: 14 }}>
            <Text style={{ width: 80, fontSize: 6, fontFamily: 'Helvetica-Bold', backgroundColor: '#f3f4f6', padding: 2 }}>Equipo Evaluador:</Text>
            <Text style={{ flex: 1, fontSize: 7, padding: 2 }}>{metadata.evaluatorTeam}</Text>
            <View style={{ borderLeftWidth: 1, borderColor: colors.borderLight, flexDirection: 'row' }}>
              <Text style={{ fontSize: 6, fontFamily: 'Helvetica-Bold', backgroundColor: '#f3f4f6', padding: 2 }}>N° IPCR:</Text>
              <Text style={{ fontSize: 7, padding: 2, minWidth: 40 }}>{metadata.ipcrNumber}</Text>
            </View>
          </View>
          {[
            ['Res. 51/97', metadata.res5197],
            ['ART/Fecha', metadata.artDate],
            ['Resp. Seguridad', metadata.safetyResponsible],
            ['Contratista', metadata.contractor],
            ['Otros IPCR', metadata.otherIpcr],
          ].map(([label, value], i, arr) => (
            <View key={label} style={{ flexDirection: 'row', borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderColor: colors.borderLight, minHeight: 14 }}>
              <Text style={{ width: 80, fontSize: 6, fontFamily: 'Helvetica-Bold', backgroundColor: '#f3f4f6', padding: 2 }}>{label}:</Text>
              <Text style={{ flex: 1, fontSize: 7, padding: 2 }}>{value || ''}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Risk Table */}
      <View style={{ borderWidth: 1, borderColor: colors.black, marginBottom: 4 }}>
        {/* Group headers */}
        <View style={{ flexDirection: 'row', backgroundColor: '#1e3a8a' }}>
          <Text style={{ width: 90, fontSize: 5, fontFamily: 'Helvetica-Bold', color: '#fff', padding: 2, textAlign: 'center', borderRightWidth: 1, borderColor: '#3b82f6' }}>Tarea</Text>
          <Text style={{ width: 70, fontSize: 5, fontFamily: 'Helvetica-Bold', color: '#fff', padding: 2, textAlign: 'center', borderRightWidth: 1, borderColor: '#3b82f6' }}>Peligros</Text>
          <Text style={{ width: 14, fontSize: 5, fontFamily: 'Helvetica-Bold', color: '#fff', padding: 2, textAlign: 'center', borderRightWidth: 1, borderColor: '#3b82f6' }}></Text>
          <Text style={{ width: 56, fontSize: 5, fontFamily: 'Helvetica-Bold', color: '#fff', padding: 2, textAlign: 'center', borderRightWidth: 1, borderColor: '#3b82f6' }}>Riesgo Inicial</Text>
          <Text style={{ flex: 1, fontSize: 5, fontFamily: 'Helvetica-Bold', color: '#fff', padding: 2, textAlign: 'center', borderRightWidth: 1, borderColor: '#3b82f6' }}>Medidas de Control</Text>
          <Text style={{ width: 56, fontSize: 5, fontFamily: 'Helvetica-Bold', color: '#fff', padding: 2, textAlign: 'center' }}>Riesgo Residual</Text>
        </View>
        {/* Sub-headers */}
        <View style={{ flexDirection: 'row', backgroundColor: '#e5e7eb', borderBottomWidth: 1, borderColor: colors.black }}>
          <Text style={{ width: 46, fontSize: 5, fontFamily: 'Helvetica-Bold', padding: 2, borderRightWidth: 1, borderColor: colors.borderLight, textAlign: 'center' }}>Pasos actividad</Text>
          <Text style={{ width: 44, fontSize: 5, fontFamily: 'Helvetica-Bold', padding: 2, borderRightWidth: 1, borderColor: colors.borderLight, textAlign: 'center' }}>Sub Tarea</Text>
          <Text style={{ width: 38, fontSize: 5, fontFamily: 'Helvetica-Bold', padding: 2, borderRightWidth: 1, borderColor: colors.borderLight, textAlign: 'center' }}>Peligros</Text>
          <Text style={{ width: 32, fontSize: 5, fontFamily: 'Helvetica-Bold', padding: 2, borderRightWidth: 1, borderColor: colors.borderLight, textAlign: 'center' }}>Cat. pérdidas</Text>
          <Text style={{ width: 14, fontSize: 5, fontFamily: 'Helvetica-Bold', padding: 2, borderRightWidth: 1, borderColor: colors.borderLight, textAlign: 'center' }}>Legal</Text>
          <Text style={{ width: 14, fontSize: 5, fontFamily: 'Helvetica-Bold', padding: 2, borderRightWidth: 1, borderColor: colors.borderLight, textAlign: 'center' }}>Prob</Text>
          <Text style={{ width: 14, fontSize: 5, fontFamily: 'Helvetica-Bold', padding: 2, borderRightWidth: 1, borderColor: colors.borderLight, textAlign: 'center' }}>Sev</Text>
          <Text style={{ width: 16, fontSize: 5, fontFamily: 'Helvetica-Bold', padding: 2, backgroundColor: '#fef9c3', borderRightWidth: 1, borderColor: colors.borderLight, textAlign: 'center' }}>Nivel</Text>
          <Text style={{ flex: 1, fontSize: 5, fontFamily: 'Helvetica-Bold', padding: 2, borderRightWidth: 1, borderColor: colors.borderLight, textAlign: 'center' }}>Medidas Prevención</Text>
          <Text style={{ flex: 1, fontSize: 5, fontFamily: 'Helvetica-Bold', padding: 2, borderRightWidth: 1, borderColor: colors.borderLight, textAlign: 'center' }}>Medidas Mitigación</Text>
          <Text style={{ width: 14, fontSize: 5, fontFamily: 'Helvetica-Bold', padding: 2, borderRightWidth: 1, borderColor: colors.borderLight, textAlign: 'center' }}>Prob</Text>
          <Text style={{ width: 14, fontSize: 5, fontFamily: 'Helvetica-Bold', padding: 2, borderRightWidth: 1, borderColor: colors.borderLight, textAlign: 'center' }}>Sev</Text>
          <Text style={{ width: 16, fontSize: 5, fontFamily: 'Helvetica-Bold', padding: 2, backgroundColor: '#dcfce7', textAlign: 'center' }}>Nivel</Text>
        </View>
        {/* Data rows */}
        {rows.map((row, idx) => (
          <View key={row.id} style={{ flexDirection: 'row', borderBottomWidth: idx < rows.length - 1 ? 1 : 0, borderColor: colors.borderLight, minHeight: 28 }}>
            <Text style={{ width: 46, fontSize: 6, padding: 2, borderRightWidth: 1, borderColor: colors.borderLight }}>{row.activitySteps}</Text>
            <Text style={{ width: 44, fontSize: 6, padding: 2, borderRightWidth: 1, borderColor: colors.borderLight }}>{row.subTask}</Text>
            <Text style={{ width: 38, fontSize: 6, padding: 2, borderRightWidth: 1, borderColor: colors.borderLight }}>{row.hazards}</Text>
            <Text style={{ width: 32, fontSize: 6, padding: 2, borderRightWidth: 1, borderColor: colors.borderLight }}>{row.lossCategory}</Text>
            <Text style={{ width: 14, fontSize: 6, padding: 2, textAlign: 'center', borderRightWidth: 1, borderColor: colors.borderLight }}>{row.legalRequirement || ''}</Text>
            <Text style={{ width: 14, fontSize: 6, padding: 2, textAlign: 'center', borderRightWidth: 1, borderColor: colors.borderLight }}>{row.initialProb}</Text>
            <Text style={{ width: 14, fontSize: 6, padding: 2, textAlign: 'center', borderRightWidth: 1, borderColor: colors.borderLight }}>{row.initialSev}</Text>
            <Text style={{ width: 16, fontSize: 6, padding: 2, textAlign: 'center', fontFamily: 'Helvetica-Bold', backgroundColor: getRiskColor(row.initialRisk), borderRightWidth: 1, borderColor: colors.borderLight }}>{row.initialRisk}</Text>
            <Text style={{ flex: 1, fontSize: 6, padding: 2, borderRightWidth: 1, borderColor: colors.borderLight }}>{row.preventiveMeasures}</Text>
            <Text style={{ flex: 1, fontSize: 6, padding: 2, borderRightWidth: 1, borderColor: colors.borderLight }}>{row.mitigationMeasures}</Text>
            <Text style={{ width: 14, fontSize: 6, padding: 2, textAlign: 'center', borderRightWidth: 1, borderColor: colors.borderLight }}>{row.residualProb}</Text>
            <Text style={{ width: 14, fontSize: 6, padding: 2, textAlign: 'center', borderRightWidth: 1, borderColor: colors.borderLight }}>{row.residualSev}</Text>
            <Text style={{ width: 16, fontSize: 6, padding: 2, textAlign: 'center', fontFamily: 'Helvetica-Bold', backgroundColor: getRiskColor(row.residualRisk) }}>{row.residualRisk}</Text>
          </View>
        ))}
      </View>

      {/* EPP Section */}
      <View style={{ borderTopWidth: 1, borderColor: colors.black, backgroundColor: '#f3f4f6', padding: 3, marginBottom: 0 }}>
        <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', textAlign: 'center', textTransform: 'uppercase' }}>Elementos de Protección Personal (EPP)</Text>
      </View>
      <View style={{ flexDirection: 'row', borderWidth: 1, borderTopWidth: 0, borderColor: colors.black, marginBottom: 6 }}>
        {EPP_GROUPS.map((group, gi) => (
          <View key={gi} style={{ flex: 1, borderRightWidth: gi < EPP_GROUPS.length - 1 ? 1 : 0, borderColor: colors.borderLight }}>
            <Text style={{ fontSize: 5, fontFamily: 'Helvetica-Bold', textAlign: 'center', backgroundColor: '#f9fafb', padding: 2, borderBottomWidth: 1, borderColor: colors.borderLight }}>{group.title}</Text>
            <View style={{ padding: 2 }}>
              {group.items.map((item) => (
                <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 2, marginBottom: 1 }}>
                  <View style={{ width: 6, height: 6, borderWidth: 1, borderColor: colors.black, backgroundColor: epp[item.id] ? colors.black : '#fff', alignItems: 'center', justifyContent: 'center' }}>
                    {epp[item.id] && <Text style={{ fontSize: 4, color: '#fff', fontFamily: 'Helvetica-Bold' }}>X</Text>}
                  </View>
                  <Text style={{ fontSize: 5, color: '#374151' }}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Footer Signatures */}
      <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: colors.black }}>
        {/* Validación TACKER */}
        <View style={{ flex: 1, borderRightWidth: 1, borderColor: colors.black, padding: 6, alignItems: 'center' }}>
          <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 4 }}>Validación por TACKER S.A.</Text>
          <View style={{ height: 40 }} />
        </View>

        {/* Receiver */}
        <View style={{ flex: 1, borderRightWidth: 1, borderColor: colors.black, padding: 4, alignItems: 'center' }}>
          <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 4 }}>Apellido y Nombre / Legajo ó DNI</Text>
          {signatures.receiverName && <Text style={{ fontSize: 7, textAlign: 'center', marginBottom: 4 }}>{signatures.receiverName}</Text>}
          {signatures.receiver?.data ? (
            <Image src={signatures.receiver.data} style={{ width: 80, height: 36 }} />
          ) : (
            <View style={{ height: 36, width: 120, borderBottomWidth: 1, borderColor: colors.black }} />
          )}
          <Text style={{ fontSize: 6, color: colors.textMid, marginTop: 2 }}>Firma y Fecha de Recepción</Text>
        </View>

        {/* Approver & SHI */}
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <View style={{ flex: 1, borderBottomWidth: 1, borderColor: colors.black, padding: 4, alignItems: 'center' }}>
            <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 2 }}>Aprobó por la Contratista</Text>
            {signatures.approverName && <Text style={{ fontSize: 7, textAlign: 'center', marginBottom: 2 }}>{signatures.approverName}</Text>}
            {signatures.approver?.data ? (
              <Image src={signatures.approver.data} style={{ width: 70, height: 28 }} />
            ) : (
              <View style={{ height: 28, width: 100, borderBottomWidth: 1, borderColor: colors.black }} />
            )}
            <Text style={{ fontSize: 6, color: colors.textMid, marginTop: 2 }}>Firma y Fecha</Text>
          </View>
          <View style={{ flex: 1, padding: 4, alignItems: 'center' }}>
            <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 2 }}>Visado SHI / Matrícula</Text>
            {signatures.shiName && <Text style={{ fontSize: 7, textAlign: 'center', marginBottom: 2 }}>{signatures.shiName}</Text>}
            {signatures.shi?.data ? (
              <Image src={signatures.shi.data} style={{ width: 70, height: 28 }} />
            ) : (
              <View style={{ height: 28, width: 100, borderBottomWidth: 1, borderColor: colors.black }} />
            )}
            <Text style={{ fontSize: 6, color: colors.textMid, marginTop: 2 }}>Firma</Text>
          </View>
        </View>
      </View>
    </PdfDocument>
  );
};
