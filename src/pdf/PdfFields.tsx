import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { colors } from './styles';

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  // Outer wrapper — full-width bordered block
  block: {
    borderWidth: 1,
    borderColor: colors.black,
    marginTop: 6,
    marginBottom: 2,
  },

  // Each logical row of fields
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.black,
  },
  rowLast: {
    flexDirection: 'row',
  },

  // Individual field cell
  cell: {
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 5,
    paddingRight: 5,
    borderRightWidth: 1,
    borderRightColor: colors.black,
    justifyContent: 'center',
  },
  cellLast: {
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 5,
    paddingRight: 5,
    justifyContent: 'center',
    flex: 1,
  },

  // Text inside a cell
  label: {
    fontSize: 6,
    fontFamily: 'Helvetica-Bold',
    color: colors.textMid,
    textTransform: 'uppercase',
    marginBottom: 1,
  },
  value: {
    fontSize: 9,
    color: colors.textDark,
  },
});

// ─── Types ────────────────────────────────────────────────────────────────────
export interface FieldEntry {
  label: string;
  value?: string | null;
  /**
   * Percentage width as a string, e.g. '25%'.
   * When omitted the field takes equal share of the row.
   */
  width?: string;
}

export interface PdfFieldsProps {
  fields: FieldEntry[];
  /**
   * How many fields to place side-by-side per row.
   * Default: 4.
   */
  columns?: 2 | 3 | 4;
  /**
   * Optional title rendered as a section header above the block.
   */
  title?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

const EMPTY_FIELD: FieldEntry = { label: '', value: null };

// ─── Component ────────────────────────────────────────────────────────────────
export const PdfFields: React.FC<PdfFieldsProps> = ({
  fields,
  columns = 4,
  title,
}) => {
  // Pad last row so it always has `columns` cells for a clean grid
  const padded = [...fields];
  while (padded.length % columns !== 0) padded.push(EMPTY_FIELD);

  const rows = chunk(padded, columns);

  return (
    <View>
      {title && (
        <Text
          style={{
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
          }}
        >
          {title}
        </Text>
      )}

      <View style={s.block}>
        {rows.map((rowFields, ri) => {
          const isLast = ri === rows.length - 1;
          const defaultW = `${(100 / columns).toFixed(2)}%`;

          return (
            <View key={ri} style={isLast ? s.rowLast : s.row}>
              {rowFields.map((f, ci) => {
                const isLastCell = ci === rowFields.length - 1;
                const width = f.width ?? defaultW;

                // Last cell in a row gets no right border (block already has outer border)
                const cellStyle = isLastCell
                  ? [s.cellLast, { width }]
                  : [s.cell, { width }];

                return (
                  <View key={ci} style={cellStyle}>
                    <Text style={s.label}>{f.label}</Text>
                    <Text style={s.value}>{f.value || '—'}</Text>
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>
    </View>
  );
};
