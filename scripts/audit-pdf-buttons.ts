import * as fs from 'fs';
import * as path from 'path';

const FORMS_DIR = path.join((process as any).cwd(), 'components');

const FORMS = [
  'DailyOperationsForm',
  'OutsourcedOperationsForm',
  'FoamSystemForm',
  'InertiaCalcForm',
  'ShiftChangeForm',
  'SlingInspectionForm',
  'SwabbingReportForm',
  'QHSEReportForm',
  'TransportChecklistForm',
  'WorkoverChecklistForm',
  'ToolMovementForm',
  'CableWorkReportForm',
  'PullingChecklistForm',
  'MaintenanceReportForm',
  'FBUChecklistForm',
  'CircuitBreakerForm',
  'FacilityInspectionForm',
  'VehicleInspectionForm',
  'StilsonInspectionForm',
  'StilsonControlForm',
  'FirstAidInspectionForm',
  'FoamTestForm',
  'BumpTestForm',
  'INDControlForm',
  'ThicknessMeasurementForm',
  'ForkliftInspectionForm',
  'ForkliftLiftingPlanForm',
  'TorqueRegisterForm',
  'PlatformInspectionForm',
  'WelcomeSignForm',
  'ElectricalChecklistForm',
  'ElectricalToolChecklistForm',
  'CustomerPropertyCustodyForm',
  'IPCRForm',
  'AccumulatorTestForm',
  'PerformanceEvaluationForm',
  'BOPConnectionForm',
  'ManagerialVisitForm',
  'TowerPressureForm',
  'MastAssemblyRolesForm',
  'PreAssemblyChecklistForm',
  'WasteClassificationSignForm',
  'WellFillingForm',
  'OilChangeForm',
  'MechanicalChecklistForm',
  'FlareChecklistForm',
  'EmergencyDrillForm',
  'DailyInspectionCatIForm',
  'DroppedObjectsForm',
  'TubingMeasurementForm',
];

// Checks a realizar en cada archivo
const CHECKS = [
  {
    id: 'file_exists',
    label: 'Archivo existe',
    test: (content: string | null) => content !== null,
  },
  {
    id: 'import_export_pdf_button',
    label: 'Importa ExportPdfButton',
    test: (content: string) => content.includes('ExportPdfButton'),
  },
  {
    id: 'print_area_id',
    label: 'Tiene id="print-area"',
    test: (content: string) => content.includes('id="print-area"'),
  },
  {
    id: 'export_pdf_button_used',
    label: 'Usa <ExportPdfButton',
    test: (content: string) => content.includes('<ExportPdfButton'),
  },
  {
    id: 'print_button',
    label: 'Tiene botón Imprimir (window.print)',
    test: (content: string) => content.includes('window.print()'),
  },
  {
    id: 'pdf_filename',
    label: 'Define filename (prop)',
    test: (content: string) => content.includes('filename='),
  },
  {
    id: 'pdf_orientation',
    label: 'Define orientation (prop)',
    test: (content: string) => content.includes('orientation='),
  },
  {
    id: 'no_print_class',
    label: 'Barra botones tiene clase no-print',
    test: (content: string) => content.includes('no-print'),
  },
];

interface FormResult {
  form: string;
  file: string;
  exists: boolean;
  checks: { id: string; label: string; passed: boolean }[];
  score: number;
  status: 'OK' | 'PARTIAL' | 'MISSING';
}

const auditForms = (): void => {
  const results: FormResult[] = [];

  for (const form of FORMS) {
    const filePath = path.join(FORMS_DIR, `${form}.tsx`);
    let content: string | null = null;

    if (fs.existsSync(filePath)) {
      content = fs.readFileSync(filePath, 'utf-8');
    }

    const checks = CHECKS.map(check => ({
      id: check.id,
      label: check.label,
      passed: content !== null ? check.test(content) : false,
    }));

    const passedCount = checks.filter(c => c.passed).length;
    const score = Math.round((passedCount / CHECKS.length) * 100);

    let status: 'OK' | 'PARTIAL' | 'MISSING';
    if (!content) {
      status = 'MISSING';
    } else if (score === 100) {
      status = 'OK';
    } else {
      status = 'PARTIAL';
    }

    results.push({
      form,
      file: `${form}.tsx`,
      exists: content !== null,
      checks,
      score,
      status,
    });
  }

  // ── IMPRIMIR REPORTE EN CONSOLA ──────────────────────────────────────────

  const ok = results.filter(r => r.status === 'OK');
  const partial = results.filter(r => r.status === 'PARTIAL');
  const missing = results.filter(r => r.status === 'MISSING');

  console.log('\n');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║          AUDITORÍA — BOTONES PDF E IMPRIMIR                 ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log(`\n✅ Completos:  ${ok.length}/50`);
  console.log(`⚠️  Parciales: ${partial.length}/50`);
  console.log(`❌ Faltantes:  ${missing.length}/50`);
  console.log('\n──────────────────────────────────────────────────────────────');

  // Formularios OK
  if (ok.length > 0) {
    console.log('\n✅ COMPLETOS (tienen todos los checks):');
    ok.forEach(r => console.log(`   ✓ ${r.form} (${r.score}%)`));
  }

  // Formularios parciales — mostrar qué les falta
  if (partial.length > 0) {
    console.log('\n⚠️  PARCIALES (faltan algunos checks):');
    partial.forEach(r => {
      const failing = r.checks.filter(c => !c.passed).map(c => c.label);
      console.log(`\n   ⚠ ${r.form} (${r.score}%)`);
      failing.forEach(f => console.log(`      ✗ Falta: ${f}`));
    });
  }

  // Formularios faltantes
  if (missing.length > 0) {
    console.log('\n❌ ARCHIVOS NO ENCONTRADOS:');
    missing.forEach(r => console.log(`   ✗ ${r.form}.tsx — archivo no encontrado en components/`));
  }

  // ── TABLA RESUMEN ────────────────────────────────────────────────────────
  console.log('\n──────────────────────────────────────────────────────────────');
  console.log('RESUMEN COMPLETO:\n');
  console.log('Formulario'.padEnd(40) + 'Estado'.padEnd(12) + 'Score');
  console.log('─'.repeat(60));
  results.forEach(r => {
    const icon = r.status === 'OK' ? '✅' : r.status === 'PARTIAL' ? '⚠️ ' : '❌';
    console.log(`${icon} ${r.form.padEnd(38)} ${r.status.padEnd(12)} ${r.score}%`);
  });

  // ── GUARDAR REPORTE JSON ─────────────────────────────────────────────────
  const reportPath = path.join((process as any).cwd(), 'pdf-audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({ 
    date: new Date().toISOString(),
    summary: { total: 50, ok: ok.length, partial: partial.length, missing: missing.length },
    results 
  }, null, 2));

  console.log(`\n📄 Reporte JSON guardado en: pdf-audit-report.json`);
  console.log('──────────────────────────────────────────────────────────────\n');

  // Exit code 1 si hay formularios incompletos
  if (partial.length > 0 || missing.length > 0) {
    (process as any).exit(1);
  }
};

auditForms();