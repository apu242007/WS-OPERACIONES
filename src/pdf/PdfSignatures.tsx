import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { base } from './styles';

export interface SignatureEntry {
  /** Label shown above the signature area */
  label: string;
  /** base64 data URI from the canvas pad, or undefined if not signed */
  data?: string | null;
  /** Signer's name shown below the image */
  name?: string | null;
}

interface PdfSignaturesProps {
  signatures: SignatureEntry[];
}

/**
 * Row of signature blocks at the bottom of a form.
 * Each block shows the role label, the drawn signature image and the name.
 */
export const PdfSignatures: React.FC<PdfSignaturesProps> = ({ signatures }) => (
  <View style={base.sigRow}>
    {signatures.map((sig, i) => (
      <View
        key={i}
        style={i === signatures.length - 1 ? base.sigBlockLast : base.sigBlock}
      >
        <Text style={base.sigLabel}>{sig.label}</Text>
        {sig.data ? (
          <Image style={base.sigImage} src={sig.data} />
        ) : (
          <View style={{ width: 80, height: 36 }} />
        )}
        {sig.name ? <Text style={base.sigName}>{sig.name}</Text> : null}
      </View>
    ))}
  </View>
);
