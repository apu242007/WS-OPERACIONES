import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { PdfDocument } from './PdfDocument';
import { colors } from './styles';

interface Props {}

const NFPA_IMAGE_URL =
  'https://raw.githubusercontent.com/apu242007/WS-OPERACIONES/main/src/1721314043890.jpg';

export const NFPAGuidePdf: React.FC<Props> = () => {
  return (
    <PdfDocument orientation="landscape">
      {/* Title */}
      <View style={{ backgroundColor: '#1e3a8a', padding: 8, marginBottom: 8 }}>
        <Text style={{ color: '#fff', fontFamily: 'Helvetica-Bold', fontSize: 14, textAlign: 'center', textTransform: 'uppercase' }}>
          Guía de Clasificaciones NFPA 704
        </Text>
      </View>

      {/* NFPA Image */}
      <View style={{ alignItems: 'center' }}>
        <Image src={NFPA_IMAGE_URL} style={{ width: '100%', maxHeight: 480, objectFit: 'contain' }} />
      </View>

      {/* Footer note */}
      <View style={{ marginTop: 8, padding: 4, borderTopWidth: 1, borderColor: colors.borderLight }}>
        <Text style={{ fontSize: 7, color: colors.textMid, textAlign: 'center', fontStyle: 'italic' }}>
          Este cuadro es solamente para referencia. Para las especificaciones completas, consulta la norma 704 de la NFPA.
        </Text>
      </View>
    </PdfDocument>
  );
};
