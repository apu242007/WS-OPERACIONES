import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { colors } from './styles';

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  // Section title above the checklist
  sectionTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: colors.textDark,
    textTransform: 'uppercase',
    backgroundColor: colors.tableHeaderBg,
    borderWidth: 1,
    borderColor: colors.black,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: 6,
  },

  // Outer wrapper — wraps header row + all item rows
  table: {
    borderLeftWidth: 1,
    borderLeftColor: colors.black,
    borderTopWidth: 1,
    borderTopColor: colors.black,
    marginTop: 2,
  },

  // Column-header row (DESCRIPCIÓN | OK | NA | X | OBS)
  headerRow: {
    flexDirection: 'row',
    backgroundColor: colors.tableHeaderBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.black,
    minHeight: 18,
  },
  headerDesc: {
    flex: 1,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 4,
    paddingRight: 4,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.black,
    fontFamily: 'Helvetica-Bold',
    fontSize: 7,
    textTransform: 'uppercase',
  },
  headerStatus: {
    width: 22,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 2,
    paddingRight: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.black,
    fontFamily: 'Helvetica-Bold',
    fontSize: 7,
    textTransform: 'uppercase',
  },
  headerObs: {
    width: 90,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 4,
    paddingRight: 4,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.black,
    fontFamily: 'Helvetica-Bold',
    fontSize: 7,
    textTransform: 'uppercase',
  },

  // Data row wrapper (for multi-column layout, holds N item-groups per row)
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.black,
    minHeight: 18,
  },
  dataRowAlt: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.black,
    minHeight: 18,
    backgroundColor: colors.tableAltBg,
  },

  // A single item-group (desc + ok + na + x + obs) that sits inside a dataRow
  itemGroup: {
    flexDirection: 'row',
    flex: 1,
  },
  itemGroupDivider: {
    flexDirection: 'row',
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: colors.black,
  },

  // Cells inside each item-group
  cellDesc: {
    flex: 1,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 4,
    paddingRight: 4,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.black,
    fontSize: 7.5,
    color: colors.textDark,
  },
  cellStatus: {
    width: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.black,
    fontSize: 8,
  },
  cellObs: {
    width: 90,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 4,
    paddingRight: 4,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.black,
    fontSize: 7,
    color: colors.textMid,
  },

  // Status mark colours
  markOK: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: colors.green,
  },
  markX: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: colors.red,
  },
  markNA: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    color: colors.textMid,
  },
});

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ChecklistItem {
  label: string;
  status?: 'OK' | 'NA' | 'X' | null;
  observations?: string | null;
}

export interface PdfChecklistProps {
  /** Optional section title rendered above the checklist table */
  title?: string;
  items: ChecklistItem[];
  /**
   * How many item columns to lay out side-by-side per row.
   * Default: 1 (single column).
   */
  columns?: 1 | 2 | 3;
  /** Whether to show the OBSERVACIONES column. Default: true */
  showObservations?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

const EMPTY_ITEM: ChecklistItem = { label: '', status: null, observations: null };

// ─── Component ────────────────────────────────────────────────────────────────
export const PdfChecklist: React.FC<PdfChecklistProps> = ({
  title,
  items,
  columns = 1,
  showObservations = true,
}) => {
  // Pad to a full multiple of `columns` so every row has the same # of groups
  const padded = [...items];
  while (padded.length % columns !== 0) padded.push(EMPTY_ITEM);

  const rows = chunk(padded, columns);

  // Build the header row (repeated `columns` times side-by-side)
  const headerGroup = (isFirst: boolean) => (
    <View style={isFirst ? s.itemGroup : s.itemGroupDivider} key={isFirst ? 'h0' : 'hn'}>
      <Text style={s.headerDesc}>DESCRIPCIÓN</Text>
      <Text style={s.headerStatus}>OK</Text>
      <Text style={s.headerStatus}>NA</Text>
      <Text style={s.headerStatus}>X</Text>
      {showObservations && <Text style={s.headerObs}>OBSERVACIONES</Text>}
    </View>
  );

  const itemGroupView = (item: ChecklistItem, isFirst: boolean) => (
    <View style={isFirst ? s.itemGroup : s.itemGroupDivider}>
      <Text style={s.cellDesc}>{item.label}</Text>
      <View style={s.cellStatus}>
        {item.status === 'OK' ? <Text style={s.markOK}>✓</Text> : <Text> </Text>}
      </View>
      <View style={s.cellStatus}>
        {item.status === 'NA' ? <Text style={s.markNA}>—</Text> : <Text> </Text>}
      </View>
      <View style={s.cellStatus}>
        {item.status === 'X' ? <Text style={s.markX}>✗</Text> : <Text> </Text>}
      </View>
      {showObservations && (
        <Text style={s.cellObs}>{item.observations || ''}</Text>
      )}
    </View>
  );

  return (
    <View>
      {title && <Text style={s.sectionTitle}>{title}</Text>}
      <View style={s.table}>
        {/* Column headers */}
        <View style={s.headerRow} fixed>
          {Array.from({ length: columns }).map((_, ci) => headerGroup(ci === 0))}
        </View>

        {/* Data rows */}
        {rows.map((rowItems, ri) => {
          const isAlt = ri % 2 === 1;
          return (
            <View key={ri} style={isAlt ? s.dataRowAlt : s.dataRow} wrap={false}>
              {rowItems.map((item, ci) => itemGroupView(item, ci === 0))}
            </View>
          );
        })}
      </View>
    </View>
  );
};
