import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { base, colors } from './styles';

// ─── Extra per-cell styles ─────────────────────────────────────────────────
const extra = StyleSheet.create({
  approved: {
    color: colors.green,
    backgroundColor: colors.greenBg,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
  },
  failed: {
    color: colors.red,
    backgroundColor: colors.redBg,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
  },
  checkMark: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
});

export type CellStyle = 'approved' | 'failed' | 'normal';

export interface PdfTableProps {
  /** Column header labels */
  headers: string[];
  /** Data rows – each cell is a string value */
  rows: string[][];
  /**
   * Column widths as percentage strings, e.g. ['15%', '30%', '20%', ...].
   * If omitted, columns are equally distributed.
   */
  colWidths?: string[];
  /** Column indices that should be centred (header + data) */
  centerCols?: number[];
  /**
   * Per-cell style overrides keyed by `${rowIndex}-${colIndex}`.
   * Use 'approved' | 'failed' for coloured X cells.
   */
  cellStyles?: Record<string, CellStyle>;
}

/**
 * Generic table component for @react-pdf/renderer.
 *
 * • Auto page-break between rows (`wrap={false}` per row keeps rows intact).
 * • Alternating row background.
 * • Supports coloured "X" cells for pass/fail columns.
 */
export const PdfTable: React.FC<PdfTableProps> = ({
  headers,
  rows,
  colWidths,
  centerCols = [],
  cellStyles = {},
}) => {
  const colW = (i: number) =>
    colWidths?.[i] ?? `${(100 / headers.length).toFixed(2)}%`;

  return (
    <View style={base.table}>
      {/* ── Header row (fixed = repeat on every page) ── */}
      <View style={base.tableHeaderRow} fixed>
        {headers.map((h, i) => (
          <View
            key={i}
            style={[
              base.tableCellHeader,
              { width: colW(i) },
              centerCols.includes(i) ? base.cellCenter : {},
            ]}
          >
            <Text>{h}</Text>
          </View>
        ))}
      </View>

      {/* ── Data rows ── */}
      {rows.map((row, ri) => (
        <View
          key={ri}
          style={ri % 2 === 1 ? base.tableRowAlt : base.tableRow}
          wrap={false}
        >
          {row.map((cell, ci) => {
            const style = cellStyles[`${ri}-${ci}`] ?? 'normal';
            const isCenter = centerCols.includes(ci);

            // Coloured check-mark cells
            if (style === 'approved' || style === 'failed') {
              return (
                <View
                  key={ci}
                  style={[base.tableCell, { width: colW(ci), padding: 0 }]}
                >
                  <View style={style === 'approved' ? extra.approved : extra.failed}>
                    {cell ? <Text style={extra.checkMark}>{cell}</Text> : null}
                  </View>
                </View>
              );
            }

            return (
              <View
                key={ci}
                style={[
                  base.tableCell,
                  { width: colW(ci) },
                  isCenter ? base.cellCenter : {},
                ]}
              >
                <Text>{cell}</Text>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};
