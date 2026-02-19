import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { base } from './styles';

export interface MetaField {
  label: string;
  value?: string | null;
}

interface PdfMetadataProps {
  fields: MetaField[];
}

/**
 * Horizontal metadata bar (fecha, pozo, equipo, operador, …).
 * Renders up to 8 fields in a single bordered row.
 */
export const PdfMetadata: React.FC<PdfMetadataProps> = ({ fields }) => (
  <View style={base.metaRow}>
    {fields.map((f, i) => (
      <View
        key={i}
        style={i === fields.length - 1 ? base.metaCellLast : base.metaCell}
      >
        <Text style={base.metaLabel}>{f.label}</Text>
        <Text style={base.metaValue}>{f.value || '—'}</Text>
      </View>
    ))}
  </View>
);
