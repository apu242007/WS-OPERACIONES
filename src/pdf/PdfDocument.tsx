import React from 'react';
import { Document, Page } from '@react-pdf/renderer';
import { base } from './styles';

interface PdfDocumentProps {
  children: React.ReactNode;
  orientation?: 'portrait' | 'landscape';
}

/**
 * Root wrapper for every react-pdf document.
 * Provides an A4 page with standard margins.
 */
export const PdfDocument: React.FC<PdfDocumentProps> = ({
  children,
  orientation = 'portrait',
}) => (
  <Document>
    <Page size="A4" orientation={orientation} style={base.page} wrap>
      {children}
    </Page>
  </Document>
);
