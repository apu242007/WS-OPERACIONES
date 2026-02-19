import { StyleSheet } from '@react-pdf/renderer';

// ─── Color palette ────────────────────────────────────────────────────────────
export const colors = {
  black:         '#000000',
  tableHeaderBg: '#D1D5DB', // gray-200
  tableAltBg:    '#F9FAFB', // gray-50
  white:         '#FFFFFF',
  textDark:      '#111827', // gray-900
  textMid:       '#4B5563', // gray-600
  textLight:     '#6B7280', // gray-500
  brand:         '#DC2626', // red-600
  green:         '#15803D',
  greenBg:       '#DCFCE7',
  red:           '#B91C1C',
  redBg:         '#FEE2E2',
  borderLight:   '#D1D5DB',
} as const;

// ─── Shared stylesheet ────────────────────────────────────────────────────────
export const base = StyleSheet.create({
  // Page
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#FFFFFF',
    color: '#111827',
  },

  // ── Header ────────────────────────────────────────────────────────────────
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
  },
  headerLeft: {
    width: '25%',
    borderRightWidth: 2,
    borderRightColor: '#000000',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 8,
    paddingRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    width: '50%',
    borderRightWidth: 2,
    borderRightColor: '#000000',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 8,
    paddingRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    width: '25%',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 8,
    paddingRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#DC2626',
  },
  brandSub: {
    fontSize: 6,
    color: '#6B7280',
    letterSpacing: 2,
    marginTop: -2,
  },
  formTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
  },
  formCode: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#4B5563',
  },

  // ── Metadata bar ──────────────────────────────────────────────────────────
  metaRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#000000',
    marginTop: 6,
    marginBottom: 6,
  },
  metaCell: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 5,
    paddingRight: 5,
    borderRightWidth: 1,
    borderRightColor: '#000000',
  },
  metaCellLast: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 5,
    paddingRight: 5,
  },
  metaLabel: {
    fontSize: 6,
    fontFamily: 'Helvetica-Bold',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: 9,
    color: '#111827',
    marginTop: 1,
  },

  // ── Table ─────────────────────────────────────────────────────────────────
  table: {
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#000000',
    borderLeftWidth: 1,
    borderLeftColor: '#000000',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#D1D5DB',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    minHeight: 22,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    minHeight: 22,
  },
  tableRowAlt: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    minHeight: 22,
    backgroundColor: '#F9FAFB',
  },
  tableCell: {
    borderRightWidth: 1,
    borderRightColor: '#000000',
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 4,
    paddingRight: 4,
    justifyContent: 'center',
    fontSize: 8,
  },
  tableCellHeader: {
    borderRightWidth: 1,
    borderRightColor: '#000000',
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 4,
    paddingRight: 4,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },
  cellCenter: {
    alignItems: 'center',
    textAlign: 'center',
  },

  // ── Signatures ────────────────────────────────────────────────────────────
  sigRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  sigBlock: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 6,
    paddingRight: 6,
    marginRight: 8,
    minHeight: 60,
  },
  sigBlockLast: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 6,
    paddingRight: 6,
    minHeight: 60,
  },
  sigLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  sigImage: {
    width: 80,
    height: 36,
    objectFit: 'contain',
  },
  sigName: {
    fontSize: 8,
    color: '#374151',
    marginTop: 4,
    textAlign: 'center',
  },
});
