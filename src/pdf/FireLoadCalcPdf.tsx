import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { colors, base } from './styles';

// ── Types ──────────────────────────────────────────────────────────────────────
interface MaterialRow {
  id: string;
  material: string;
  pesoKg: number;
  poderCalorifico: number;
}

interface ExtintorDef {
  cantidad: string;
  marca: string;
  capacidad: string;
  agenteExtintor: string;
  potencialCertificado: string;
  potencialNecesario: string;
}

export interface FireLoadState {
  superficieM2: number;
  tipoRiesgo: number;
  sectorIncendio: string;
  nroSectores: number;
  materials: MaterialRow[];
  extintor: ExtintorDef;
  usoSeleccionado: number | null;
  usoM2Custom: number;
  nUnidadesSalida: number;
}

export interface FireLoadCalculados {
  totalPesoKg: number;
  totalCalorias: number;
  pesoMadera: number;
  qf: number;
  qfTotal: number;
  clasificacionLabel: string;
  potA: string;
  potB: string;
  extintoresSug: number;
  usoM2: number;
  nFactorOcupacion: number;
  nPersonasOcup20: number;
}

interface Props {
  state: FireLoadState;
  calculados: FireLoadCalculados;
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    ...base.page,
    paddingHorizontal: 28,
    paddingVertical: 22,
    fontSize: 8,
  },
  // Header
  headerRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 6,
  },
  headerLogoBlock: {
    width: '16%',
    borderRightWidth: 1,
    borderColor: '#000',
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogoText: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#cc1a1a',
    letterSpacing: 1,
  },
  headerLogoSub: {
    fontSize: 7,
    color: '#888',
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  headerTitleBlock: {
    width: '68%',
    borderRightWidth: 1,
    borderColor: '#000',
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#cc1a1a',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  headerRefBlock: {
    width: '16%',
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRefText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#555',
    textAlign: 'center',
  },
  // Section header
  sectionHeader: {
    backgroundColor: '#0369a1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 0,
  },
  sectionHeaderText: {
    color: '#fff',
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionBody: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderTopWidth: 0,
    padding: 6,
    marginBottom: 6,
  },
  // Metadata grid
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaItem: {
    width: '25%',
    paddingRight: 6,
    marginBottom: 4,
  },
  metaLabel: {
    fontSize: 6,
    color: '#888',
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    marginBottom: 1,
  },
  metaValue: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#0c4a6e',
    borderBottomWidth: 1,
    borderColor: '#aaa',
    paddingBottom: 1,
  },
  // Table styles
  tableRow: { flexDirection: 'row' },
  thBlue: {
    backgroundColor: '#0369a1',
    color: '#fff',
    fontFamily: 'Helvetica-Bold',
    fontSize: 7,
    textAlign: 'center',
    paddingVertical: 3,
    paddingHorizontal: 4,
    borderWidth: 0.5,
    borderColor: '#025585',
  },
  td: {
    fontSize: 7,
    textAlign: 'center',
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderWidth: 0.5,
    borderColor: '#ddd',
  },
  tdLeft: {
    fontSize: 7,
    textAlign: 'left',
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderWidth: 0.5,
    borderColor: '#ddd',
  },
  tdHighlight: {
    fontSize: 7,
    textAlign: 'center',
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderWidth: 0.5,
    borderColor: '#ddd',
    backgroundColor: '#e0f2fe',
    color: '#0c4a6e',
    fontFamily: 'Helvetica-Bold',
  },
  tfootRow: {
    flexDirection: 'row',
    backgroundColor: '#0369a1',
  },
  tfootCell: {
    color: '#fff',
    fontFamily: 'Helvetica-Bold',
    fontSize: 7,
    textAlign: 'center',
    paddingVertical: 3,
    paddingHorizontal: 4,
    borderWidth: 0.5,
    borderColor: '#025585',
  },
  // Formula box
  formulaBox: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 3,
    padding: 6,
    marginBottom: 4,
  },
  formulaLabel: {
    fontSize: 6,
    color: '#888',
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  formulaValue: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#0c4a6e',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  formulaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 2,
  },
  formulaText: { fontSize: 7, color: '#555' },
  // Result box
  resultBox: {
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  resultLabel: {
    fontSize: 7,
    color: '#fff',
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    marginBottom: 3,
    opacity: 0.8,
  },
  resultValue: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: '#fff',
  },
  resultSub: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#fff',
    marginTop: 2,
  },
  // Two-column layout
  twoCol: { flexDirection: 'row', gap: 6 },
  colLeft: { flex: 1 },
  colRight: { flex: 1 },
  // Extintor grid
  extGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  extItem: {
    width: '50%',
    paddingRight: 6,
    marginBottom: 4,
  },
  extLabel: {
    fontSize: 6,
    color: '#888',
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    marginBottom: 1,
  },
  extValue: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#0c4a6e',
    borderBottomWidth: 1,
    borderColor: '#aaa',
    paddingBottom: 1,
    textTransform: 'uppercase',
  },
  // Calc box
  calcBox: {
    backgroundColor: '#e0f2fe',
    borderWidth: 1,
    borderColor: '#7dd3fc',
    borderRadius: 3,
    padding: 6,
    alignItems: 'center',
    flex: 1,
    marginRight: 4,
  },
  calcBoxLabel: {
    fontSize: 6,
    color: '#555',
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    marginBottom: 2,
    textAlign: 'center',
  },
  calcBoxValue: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#0c4a6e',
  },
  calcBoxUnit: {
    fontSize: 7,
    color: '#555',
    marginTop: 1,
  },
  footer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    paddingTop: 4,
    textAlign: 'center',
    fontSize: 6,
    color: '#aaa',
  },
});

// ── Helpers ────────────────────────────────────────────────────────────────────
function getClasColor(label: string): string {
  if (label === 'LEVE')  return '#ca8a04';
  if (label === 'COMÚN') return '#ea580c';
  return '#b91c1c';
}

// ── Component ──────────────────────────────────────────────────────────────────
export const FireLoadCalcPdf: React.FC<Props> = ({ state, calculados }) => {
  const {
    totalPesoKg, totalCalorias, pesoMadera, qf, qfTotal,
    clasificacionLabel, potA, potB, extintoresSug,
    usoM2, nFactorOcupacion, nPersonasOcup20,
  } = calculados;

  const clasColor = getClasColor(clasificacionLabel);
  const tiposRiesgoLabel = ['', 'Explosivo', 'Inflamable', 'Muy Combustible', 'Combustible', 'Poco Combustible', 'Incombustible', 'Refractarios'];

  return (
    <Document>
      <Page size="A4" orientation="portrait" style={s.page} wrap>

        {/* ── HEADER ── */}
        <View style={s.headerRow} fixed>
          <View style={s.headerLogoBlock}>
            <Text style={s.headerLogoText}>TACKER</Text>
            <Text style={s.headerLogoSub}>solutions</Text>
          </View>
          <View style={s.headerTitleBlock}>
            <Text style={s.headerTitle}>Determinación de la Carga de Fuego</Text>
          </View>
          <View style={s.headerRefBlock}>
            <Text style={s.headerRefText}>Dec. 351/79{'\n'}Anexo VII</Text>
          </View>
        </View>

        {/* ── DATOS PRINCIPALES ── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionHeaderText}>Datos Principales</Text>
        </View>
        <View style={[s.sectionBody, { marginBottom: 6 }]}>
          <View style={s.metaGrid}>
            <View style={s.metaItem}>
              <Text style={s.metaLabel}>Superficie (m²)</Text>
              <Text style={s.metaValue}>{state.superficieM2}</Text>
            </View>
            <View style={s.metaItem}>
              <Text style={s.metaLabel}>Tipo de Riesgo</Text>
              <Text style={s.metaValue}>R{state.tipoRiesgo} — {tiposRiesgoLabel[state.tipoRiesgo] ?? 'N/A'}</Text>
            </View>
            <View style={s.metaItem}>
              <Text style={s.metaLabel}>Sector de Incendio</Text>
              <Text style={s.metaValue}>{state.sectorIncendio || '—'}</Text>
            </View>
            <View style={s.metaItem}>
              <Text style={s.metaLabel}>N° de Sectores</Text>
              <Text style={s.metaValue}>{state.nroSectores}</Text>
            </View>
          </View>
        </View>

        {/* ── TABLA MATERIALES ── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionHeaderText}>Cálculo Carga de Fuego — Decreto 351/79</Text>
        </View>
        <View style={[s.sectionBody, { paddingHorizontal: 0, paddingTop: 0 }]}>
          {/* Table header */}
          <View style={s.tableRow}>
            <Text style={[s.thBlue, { width: '6%' }]}>N°</Text>
            <Text style={[s.thBlue, { width: '36%', textAlign: 'left' }]}>Materiales</Text>
            <Text style={[s.thBlue, { width: '16%' }]}>Peso Kg "P"</Text>
            <Text style={[s.thBlue, { width: '22%' }]}>Poder Calorífico "K" Kcal/Kg</Text>
            <Text style={[s.thBlue, { width: '20%' }]}>Calorías "Q" Kcal</Text>
          </View>
          {state.materials.map((row, idx) => {
            const Q = row.pesoKg * row.poderCalorifico;
            return (
              <View key={row.id} style={[s.tableRow, { backgroundColor: idx % 2 === 0 ? '#fff' : '#f0f9ff' }]}>
                <Text style={[s.td, { width: '6%', color: '#aaa', fontFamily: 'Helvetica-Bold' }]}>{idx + 1}</Text>
                <Text style={[s.tdLeft, { width: '36%' }]}>{row.material || '—'}</Text>
                <Text style={[s.td, { width: '16%', fontFamily: 'Helvetica-Bold' }]}>{row.pesoKg > 0 ? row.pesoKg.toLocaleString('es-AR') : '—'}</Text>
                <Text style={[s.td, { width: '22%', fontFamily: 'Helvetica-Bold' }]}>{row.poderCalorifico > 0 ? row.poderCalorifico.toLocaleString('es-AR') : '—'}</Text>
                <Text style={[s.tdHighlight, { width: '20%' }]}>{Q > 0 ? Q.toLocaleString('es-AR') : '—'}</Text>
              </View>
            );
          })}
          {/* Footer totals */}
          <View style={s.tfootRow}>
            <Text style={[s.tfootCell, { width: '42%', textAlign: 'right' }]}>Total Peso en Kg =</Text>
            <Text style={[s.tfootCell, { width: '16%' }]}>{totalPesoKg.toLocaleString('es-AR')}</Text>
            <Text style={[s.tfootCell, { width: '22%', textAlign: 'right' }]}>Qm =</Text>
            <Text style={[s.tfootCell, { width: '20%', fontSize: 9 }]}>{totalCalorias.toLocaleString('es-AR')} Kcal</Text>
          </View>
        </View>

        {/* ── FÓRMULAS + CLASIFICACIÓN ── */}
        <View style={s.twoCol}>
          <View style={s.colLeft}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionHeaderText}>Fórmulas</Text>
            </View>
            <View style={[s.sectionBody, { gap: 4 }]}>
              {/* Pem */}
              <View style={s.formulaBox}>
                <Text style={s.formulaLabel}>Peso Eq. en Madera (Pem)</Text>
                <View style={s.formulaRow}>
                  <Text style={s.formulaText}>Qm = {totalCalorias.toLocaleString('es-AR')} Kcal  ÷  4400 Kcal/Kg</Text>
                </View>
                <View style={[s.formulaRow, { marginTop: 4 }]}>
                  <Text style={s.formulaText}>Pem = </Text>
                  <Text style={s.formulaValue}>{pesoMadera.toFixed(2)}</Text>
                  <Text style={s.formulaText}> Kg</Text>
                </View>
              </View>
              {/* Qf */}
              <View style={s.formulaBox}>
                <Text style={s.formulaLabel}>Carga de Fuego (Qf)</Text>
                <View style={s.formulaRow}>
                  <Text style={s.formulaText}>Pem ÷ Superficie = {pesoMadera.toFixed(2)} ÷ {state.superficieM2}</Text>
                </View>
                <View style={[s.formulaRow, { marginTop: 4 }]}>
                  <Text style={s.formulaText}>Qf = </Text>
                  <Text style={s.formulaValue}>{qf.toFixed(2)}</Text>
                  <Text style={s.formulaText}> Kg/m²</Text>
                </View>
              </View>
              {/* Qf Total */}
              <View style={s.formulaBox}>
                <Text style={s.formulaLabel}>Carga de Fuego Total (Qf Total)</Text>
                <View style={s.formulaRow}>
                  <Text style={s.formulaText}>Qf × N° Sectores = {qf.toFixed(2)} × {state.nroSectores}</Text>
                </View>
                <View style={[s.formulaRow, { marginTop: 4 }]}>
                  <Text style={s.formulaText}>Qf Total = </Text>
                  <Text style={[s.formulaValue, { fontSize: 16 }]}>{qfTotal.toFixed(2)}</Text>
                  <Text style={s.formulaText}> Kg/m²</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={s.colRight}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionHeaderText}>Clasificación</Text>
            </View>
            <View style={[s.sectionBody, { gap: 4 }]}>
              {/* Classification table */}
              <View style={s.tableRow}>
                <Text style={[s.tdLeft, { flex: 1, borderWidth: 0.5, borderColor: qfTotal < 60 ? '#ca8a04' : '#ddd' }]}>Qf &lt; 60 kg/m²</Text>
                <Text style={[s.td, { width: '35%', backgroundColor: '#fbbf24', color: '#78350f', fontFamily: 'Helvetica-Bold', borderWidth: qfTotal < 60 ? 2 : 0.5, borderColor: qfTotal < 60 ? '#ca8a04' : '#ddd' }]}>LEVE</Text>
              </View>
              <View style={s.tableRow}>
                <Text style={[s.tdLeft, { flex: 1, borderWidth: 0.5, borderColor: (qfTotal >= 60 && qfTotal < 120) ? '#ea580c' : '#ddd' }]}>60 ≤ Qf &lt; 120 kg/m²</Text>
                <Text style={[s.td, { width: '35%', backgroundColor: '#ea580c', color: '#fff', fontFamily: 'Helvetica-Bold', borderWidth: (qfTotal >= 60 && qfTotal < 120) ? 2 : 0.5, borderColor: (qfTotal >= 60 && qfTotal < 120) ? '#c2410c' : '#ddd' }]}>COMÚN</Text>
              </View>
              <View style={s.tableRow}>
                <Text style={[s.tdLeft, { flex: 1, borderWidth: 0.5, borderColor: qfTotal >= 120 ? '#b91c1c' : '#ddd' }]}>Qf ≥ 120 kg/m²</Text>
                <Text style={[s.td, { width: '35%', backgroundColor: '#b91c1c', color: '#fff', fontFamily: 'Helvetica-Bold', borderWidth: qfTotal >= 120 ? 2 : 0.5, borderColor: qfTotal >= 120 ? '#991b1b' : '#ddd' }]}>MAYOR</Text>
              </View>
              {/* Result box */}
              <View style={[s.resultBox, { backgroundColor: clasColor, marginTop: 8 }]}>
                <Text style={s.resultLabel}>Resultado</Text>
                <Text style={s.resultValue}>{clasificacionLabel}</Text>
                <Text style={s.resultSub}>{qfTotal.toFixed(2)} kg/m²</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── POTENCIAL EXTINTOR ── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionHeaderText}>Potencial Extintor — Anexo 7, Dec. 351/79</Text>
        </View>
        <View style={[s.sectionBody, { marginBottom: 6 }]}>
          <View style={[s.twoCol, { gap: 12 }]}>
            <View style={{ flex: 1 }}>
              <View style={s.tableRow}>
                <Text style={[s.thBlue, { flex: 1 }]}>Clase</Text>
                <Text style={[s.thBlue, { flex: 2 }]}>Potencial Requerido</Text>
              </View>
              <View style={s.tableRow}>
                <Text style={[s.tdHighlight, { flex: 1, fontFamily: 'Helvetica-Bold' }]}>A</Text>
                <Text style={[s.tdHighlight, { flex: 2, fontSize: 10 }]}>{potA}</Text>
              </View>
              <View style={s.tableRow}>
                <Text style={[s.tdHighlight, { flex: 1, fontFamily: 'Helvetica-Bold' }]}>B</Text>
                <Text style={[s.tdHighlight, { flex: 2, fontSize: 10 }]}>{potB}</Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.formulaLabel, { marginBottom: 4 }]}>Distancia máxima al extintor</Text>
              <View style={s.tableRow}>
                <Text style={[s.tdLeft, { flex: 1 }]}>Clase A</Text>
                <Text style={[s.td, { width: '40%', fontFamily: 'Helvetica-Bold' }]}>20 m</Text>
              </View>
              <View style={s.tableRow}>
                <Text style={[s.tdLeft, { flex: 1 }]}>Clase B</Text>
                <Text style={[s.td, { width: '40%', fontFamily: 'Helvetica-Bold' }]}>9–15 m</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── EXTINTOR SELECCIONADO ── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionHeaderText}>Extintor Definitivo Seleccionado</Text>
        </View>
        <View style={[s.sectionBody, { marginBottom: 6 }]}>
          <View style={[s.twoCol, { gap: 12, marginBottom: 4 }]}>
            <View style={{ flex: 1 }}>
              <Text style={s.formulaLabel}>Cantidad sugerida (1 x 200 m²)</Text>
              <Text style={[s.formulaValue, { fontSize: 16 }]}>{extintoresSug} extintor(es)</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.formulaLabel}>Potencial Clase A / Clase B</Text>
              <Text style={[s.metaValue, { fontSize: 9 }]}>{potA} / {potB}</Text>
            </View>
          </View>
          <View style={s.extGrid}>
            {([
              { label: 'Cantidad',                    v: state.extintor.cantidad },
              { label: 'Marca',                       v: state.extintor.marca },
              { label: 'Capacidad c/ext.',             v: state.extintor.capacidad },
              { label: 'Agente Extintor',              v: state.extintor.agenteExtintor },
              { label: 'Potencial s/ Certificado',    v: state.extintor.potencialCertificado },
              { label: 'Potencial Necesario',         v: state.extintor.potencialNecesario },
            ] as { label: string; v: string }[]).map(({ label, v }) => (
              <View key={label} style={s.extItem}>
                <Text style={s.extLabel}>{label}</Text>
                <Text style={s.extValue}>{v || '—'}</Text>
              </View>
            ))}
          </View>
          <View style={{ backgroundColor: '#0369a1', borderRadius: 3, padding: 6, marginTop: 4 }}>
            <Text style={{ color: '#fff', fontFamily: 'Helvetica-Bold', fontSize: 8, textAlign: 'center' }}>
              TOTAL EXTINTORES × SECTOR DE INCENDIO: {parseInt(state.extintor.cantidad) || 0}
            </Text>
          </View>
        </View>

        {/* ── FACTOR DE OCUPACIÓN ── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionHeaderText}>Factor de Ocupación y Medios de Salida</Text>
        </View>
        <View style={[s.sectionBody, { marginBottom: 6 }]}>
          <View style={[s.twoCol, { gap: 8 }]}>
            <View style={s.calcBox}>
              <Text style={s.calcBoxLabel}>Unidades de Salida</Text>
              <Text style={s.calcBoxValue}>{state.nUnidadesSalida}</Text>
              <Text style={s.calcBoxUnit}>u.a.s.</Text>
            </View>
            <View style={s.calcBox}>
              <Text style={s.calcBoxLabel}>m² por uso/persona</Text>
              <Text style={s.calcBoxValue}>{usoM2}</Text>
              <Text style={s.calcBoxUnit}>m²</Text>
            </View>
            <View style={s.calcBox}>
              <Text style={s.calcBoxLabel}>N Factor de Ocupación</Text>
              <Text style={s.calcBoxValue}>{nFactorOcupacion}</Text>
              <Text style={s.calcBoxUnit}>personas</Text>
            </View>
            <View style={[s.calcBox, { marginRight: 0, backgroundColor: '#dcfce7', borderColor: '#86efac' }]}>
              <Text style={s.calcBoxLabel}>Con 20% libre circ.</Text>
              <Text style={[s.calcBoxValue, { color: '#14532d' }]}>{nPersonasOcup20}</Text>
              <Text style={s.calcBoxUnit}>personas</Text>
            </View>
          </View>
          {state.nUnidadesSalida > 0 && state.nUnidadesSalida < 3 && (
            <Text style={{ fontSize: 6, color: '#888', marginTop: 4, fontFamily: 'Helvetica-Oblique' }}>
              * Cuando n sea menor a 3 u.a.s., bastará con una sola vía de escape.
            </Text>
          )}
        </View>

        {/* ── FOOTER ── */}
        <Text style={s.footer} fixed>
          GENERADO POR WS OPERACIONES — DECRETO 351/79 — TODOS LOS DERECHOS RESERVADOS
        </Text>
      </Page>
    </Document>
  );
};
