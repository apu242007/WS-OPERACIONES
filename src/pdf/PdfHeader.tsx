import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { base } from './styles';

interface PdfHeaderProps {
  /** Main form title (e.g. "REGISTRO BUMP TEST EQUIPO MULTIGAS") */
  title: string;
  /** Optional document code (e.g. "IT-WWO-007-A2") */
  code?: string;
  /** Optional sub-title or company tagline shown under brand name */
  subtitle?: string;
}

/**
 * Standard 3-column header used in every TACKER form:
 *   [TACKER logo] | [Form title] | [Document code]
 */
export const PdfHeader: React.FC<PdfHeaderProps> = ({ title, code, subtitle }) => (
  <View style={base.headerRow}>
    {/* Left – brand */}
    <View style={base.headerLeft}>
      <Text style={base.brandName}>TACKER</Text>
      <Text style={base.brandSub}>{subtitle ?? 'SOLUTIONS'}</Text>
    </View>

    {/* Centre – form title */}
    <View style={base.headerCenter}>
      <Text style={base.formTitle}>{title}</Text>
    </View>

    {/* Right – document code */}
    <View style={base.headerRight}>
      {code ? <Text style={base.formCode}>{code}</Text> : null}
    </View>
  </View>
);
