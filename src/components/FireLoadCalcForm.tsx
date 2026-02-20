
import React, { useState } from 'react';
import { Button } from './ui/Button';
import { ExportPdfButton } from './ExportPdfButton';
import { FireLoadCalcPdf } from '../pdf/FireLoadCalcPdf';

interface Props {
  onCancel: () => void;
}

interface MaterialRow {
  id: string;
  material: string;
  pesoKg: number;
  poderCalorifico: number; // Kcal/kg
}

interface ExtintorDef {
  cantidad: string;
  marca: string;
  capacidad: string;
  agenteExtintor: string;
  potencialCertificado: string;
  potencialNecesario: string;
}

interface FireLoadState {
  superficieM2: number;
  tipoRiesgo: number; // 1–7
  sectorIncendio: string;
  nroSectores: number;
  materials: MaterialRow[];
  extintor: ExtintorDef;
  usoSeleccionado: number | null;
  usoM2Custom: number;
  nUnidadesSalida: number;
}

const PODER_CALORIFICO_MADERA = 4400; // Kcal/kg

const tiposRiesgo = [
  { value: 1, label: 'Riesgo 1= Explosivo' },
  { value: 2, label: 'Riesgo 2= Inflamable' },
  { value: 3, label: 'Riesgo 3= Muy Combustible' },
  { value: 4, label: 'Riesgo 4= Combustible' },
  { value: 5, label: 'Riesgo 5= Poco Combustible' },
  { value: 6, label: 'Riesgo 6= Incombustible' },
  { value: 7, label: 'Riesgo 7= Refractarios' },
];

const defaultMaterials = (): MaterialRow[] =>
  Array.from({ length: 6 }, (_, i) => ({
    id: String(i + 1),
    material: '',
    pesoKg: 0,
    poderCalorifico: 0,
  }));

// Clase A — valores del Dec. 351/79 Anexo 7
const claseA: { rango: string; r1: string; r2: string; r3: string; r4: string; r5: string }[] = [
  { rango: 'Hasta 15 kg/m²',       r1: '--', r2: '--', r3: '1A', r4: '1A', r5: '1A' },
  { rango: 'Desde 16 a 30 kg/m²',  r1: '--', r2: '--', r3: '2A', r4: '1A', r5: '1A' },
  { rango: 'Desde 31 a 60 kg/m²',  r1: '--', r2: '--', r3: '3A', r4: '2A', r5: '1A' },
  { rango: 'Desde 61 a 100 kg/m²', r1: '--', r2: '--', r3: '6A', r4: '4A', r5: '3A' },
  { rango: 'Más de 100 kg/m²',     r1: 'A determinar', r2: 'A determinar', r3: 'A determinar', r4: 'A determinar', r5: 'A determinar' },
];

// Clase B
const claseB: { rango: string; r1: string; r2: string; r3: string; r4: string; r5: string }[] = [
  { rango: 'Hasta 15 kg/m²',       r1: '--',  r2: '6B',  r3: '4B',  r4: '--', r5: '--' },
  { rango: 'Desde 16 a 30 kg/m²',  r1: '--',  r2: '8B',  r3: '6B',  r4: '--', r5: '--' },
  { rango: 'Desde 31 a 60 kg/m²',  r1: '--',  r2: '10B', r3: '8B',  r4: '--', r5: '--' },
  { rango: 'Desde 61 a 100 kg/m²', r1: '--',  r2: '20B', r3: '10B', r4: '--', r5: '--' },
  { rango: 'Más de 100 kg/m²',     r1: 'A determinar', r2: 'A determinar', r3: 'A determinar', r4: 'A determinar', r5: 'A determinar' },
];

// Tabla de extintores disponibles según tipo
const tablaExtintores = [
  { tipo: 'Polvo químico ABC', peso: '10 KG',  valor: '6A - 40B - C' },
  { tipo: 'Polvo químico ABC', peso: '5 KG',   valor: '3A - 20B - C' },
  { tipo: 'Polvo químico ABC', peso: '2.5 KG', valor: '1A - 2B - C' },
  { tipo: 'Polvo químico ABC', peso: '1 KG',   valor: '1A - 3B - C' },
  { tipo: 'Anhídrido Carbónico', peso: '2 KG',   valor: '2 BC' },
  { tipo: 'Anhídrido Carbónico', peso: '3.5 KG', valor: '3 BC' },
  { tipo: 'Anhídrido Carbónico', peso: '5 KG',   valor: '5 BC' },
  { tipo: 'Anhídrido Carbónico', peso: '6 KG',   valor: '6 BC' },
  { tipo: 'Anhídrido Carbónico', peso: '10 KG',  valor: '10 BC' },
  { tipo: 'Acetato de potasio – Clase K', peso: '6 y 10 L', valor: '2A - K' },
  { tipo: 'HCFC',             peso: '8 KG',  valor: '1A - 10B - C' },
  { tipo: 'Espuma AB',        peso: '10 L',  valor: '2A - 20B' },
];

// Uso / Ocupación
const usoOcupacion: { uso: string; m2: number }[] = [
  { uso: 'a) Salas de asambleas, auditorios, salas de conciertos, salas de baile', m2: 1 },
  { uso: 'b) Edificios educacionales, templos', m2: 2 },
  { uso: 'c) Lugares de trabajo, teatros, patios y terrazas destinadas a comedores', m2: 3 },
  { uso: 'd) Salones de billar, canchas de bolos y bochas, gimnasios, pistas de patinaje, albergues transitorios y alojamiento', m2: 5 },
  { uso: 'e) Edificio de escritorios y oficinas, bancos, bibliotecas, clínicas, salas, dormitorios, casas de baile', m2: 8 },
  { uso: 'f) Viviendas privadas y colectivas', m2: 12 },
  { uso: 'g) Edificios industriales; el número de ocupantes será declarado por el propietario según su destino uso', m2: 16 },
  { uso: 'h) Salas de juego', m2: 2 },
  { uso: 'i) Grandes tiendas, supermercados, planta baja y 1er. subsuelo', m2: 3 },
  { uso: 'j) Grandes tiendas, supermercados, pisos superiores', m2: 8 },
  { uso: 'k) Hoteles, planta baja y restaurantes', m2: 3 },
  { uso: 'l) Hoteles, pisos superiores', m2: 20 },
  { uso: 'm) Depósitos', m2: 30 },
];

// ── TABLA 1: Carga de fuego por tipo de local (kg madera/m²) ──────────────────
const tabla1: { destino: string; carga: number }[] = [
  { destino: 'Dormitorio (placard incluido)', carga: 24.4 },
  { destino: 'Comedor', carga: 16.6 },
  { destino: 'Pasillos', carga: 4.9 },
  { destino: 'Cocina', carga: 5.9 },
  { destino: 'Sala de estar', carga: 19.0 },
  { destino: 'Garaje', carga: 31.2 },
  { destino: 'Guardarropa (2,7 m² promedio)', carga: 24.9 },
  { destino: 'Ropero (1,5 m² promedio)', carga: 57.1 },
  { destino: 'Placard cocina (1,5 m²)', carga: 19.5 },
  { destino: 'Oficina', carga: 21.8 },
  { destino: 'Oficina de recepción', carga: 12.2 },
  { destino: 'Oficina de ficheros', carga: 35.9 },
  { destino: 'Clasificación de documentos', carga: 202.6 },
  { destino: 'Oficina jurídica', carga: 82.5 },
  { destino: 'Centro de documentación', carga: 122.6 },
];

// ── TABLA 2: Depósitos y establecimientos (Mcal/m²) ──────────────────────────
const tabla2: { destino: string; mcal: number; categoria: string }[] = [
  // 1) Depósitos
  { destino: 'Abonos artificiales', mcal: 40, categoria: 'Depósito' },
  { destino: 'Acumuladores', mcal: 200, categoria: 'Depósito' },
  { destino: 'Aceites en tambores', mcal: 4500, categoria: 'Depósito' },
  { destino: 'Alimentos', mcal: 200, categoria: 'Depósito' },
  { destino: 'Alquitrán de hulla', mcal: 800, categoria: 'Depósito' },
  { destino: 'Algodón de fardos', mcal: 300, categoria: 'Depósito' },
  { destino: 'Aparatos eléctricos', mcal: 40, categoria: 'Depósito' },
  { destino: 'Archivos de documentos', mcal: 400, categoria: 'Depósito' },
  { destino: 'Artículos de odontología', mcal: 80, categoria: 'Depósito' },
  { destino: 'Artículos de madera', mcal: 300, categoria: 'Depósito' },
  { destino: 'Asfalto', mcal: 800, categoria: 'Depósito' },
  { destino: 'Autos, partes de', mcal: 40, categoria: 'Depósito' },
  { destino: 'Azúcar', mcal: 2000, categoria: 'Depósito' },
  { destino: 'Vendas', mcal: 200, categoria: 'Depósito' },
  { destino: 'Bobinas de madera', mcal: 120, categoria: 'Depósito' },
  { destino: 'Bolsas de yute', mcal: 180, categoria: 'Depósito' },
  { destino: 'Bolsas de fibra sintética', mcal: 6000, categoria: 'Depósito' },
  { destino: 'Bolsas de papel', mcal: 3000, categoria: 'Depósito' },
  { destino: 'Barnices y afines', mcal: 600, categoria: 'Depósito' },
  { destino: 'Cables en bobinas de madera', mcal: 150, categoria: 'Depósito' },
  { destino: 'Café', mcal: 700, categoria: 'Depósito' },
  { destino: 'Caucho en bruto', mcal: 6800, categoria: 'Depósito' },
  { destino: 'Caucho, espuma de', mcal: 600, categoria: 'Depósito' },
  { destino: 'Caucho, objeto de', mcal: 1200, categoria: 'Depósito' },
  { destino: 'Cáñamo', mcal: 300, categoria: 'Depósito' },
  { destino: 'Cartón impregnado', mcal: 500, categoria: 'Depósito' },
  { destino: 'Cartón en hojas apiladas', mcal: 1000, categoria: 'Depósito' },
  { destino: 'Cartón, objeto de', mcal: 100, categoria: 'Depósito' },
  { destino: 'Cartón ondulado', mcal: 300, categoria: 'Depósito' },
  { destino: 'Celuloide', mcal: 800, categoria: 'Depósito' },
  { destino: 'Cereales en bolsas', mcal: 1600, categoria: 'Depósito' },
  { destino: 'Cereales en silos', mcal: 3200, categoria: 'Depósito' },
  { destino: 'Carbón', mcal: 2500, categoria: 'Depósito' },
  { destino: 'Chocolate', mcal: 800, categoria: 'Depósito' },
  { destino: 'Cigarrillos', mcal: 600, categoria: 'Depósito' },
  { destino: 'Ceras', mcal: 800, categoria: 'Depósito' },
  { destino: 'Ceras para pisos', mcal: 1200, categoria: 'Depósito' },
  { destino: 'Colas', mcal: 800, categoria: 'Depósito' },
  { destino: 'Canastos de mimbre', mcal: 40, categoria: 'Depósito' },
  { destino: 'Cordelería', mcal: 150, categoria: 'Depósito' },
  { destino: 'Colchones', mcal: 120, categoria: 'Depósito' },
  { destino: 'Cosmética, artículos de', mcal: 120, categoria: 'Depósito' },
  { destino: 'Crin animal', mcal: 150, categoria: 'Depósito' },
  { destino: 'Corcho', mcal: 200, categoria: 'Depósito' },
  { destino: 'Cuero', mcal: 400, categoria: 'Depósito' },
  { destino: 'Cuero, objetos de', mcal: 150, categoria: 'Depósito' },
  { destino: 'Cuero sintético', mcal: 400, categoria: 'Depósito' },
  { destino: 'Cuero sintético, objetos de', mcal: 200, categoria: 'Depósito' },
  { destino: 'Depósito de mercaderías', mcal: 100, categoria: 'Depósito' },
  { destino: 'Desechos de madera', mcal: 600, categoria: 'Depósito' },
  { destino: 'Desechos de trapos', mcal: 800, categoria: 'Depósito' },
  { destino: 'Desechos de papeles en fardos', mcal: 500, categoria: 'Depósito' },
  { destino: 'Desechos textiles', mcal: 200, categoria: 'Depósito' },
  { destino: 'Decorados de teatros', mcal: 250, categoria: 'Depósito' },
  { destino: 'Droguerías', mcal: 80, categoria: 'Depósito' },
  { destino: 'Dulces', mcal: 200, categoria: 'Depósito' },
  { destino: 'Escobas', mcal: 100, categoria: 'Depósito' },
  { destino: 'Encajes y puntillas', mcal: 150, categoria: 'Depósito' },
  { destino: 'Fibras de coco', mcal: 300, categoria: 'Depósito' },
  { destino: 'Fieltro', mcal: 200, categoria: 'Depósito' },
  { destino: 'Forrajes', mcal: 800, categoria: 'Depósito' },
  { destino: 'Flores artificiales', mcal: 40, categoria: 'Depósito' },
  { destino: 'Fósforos', mcal: 200, categoria: 'Depósito' },
  { destino: 'Gas licuado en cilindros de acero', mcal: 1500, categoria: 'Depósito' },
  { destino: 'Grasas', mcal: 4500, categoria: 'Depósito' },
  { destino: 'Harina en bolsas', mcal: 2000, categoria: 'Depósito' },
  { destino: 'Harina en silos', mcal: 3600, categoria: 'Depósito' },
  { destino: 'Heno en gavillas', mcal: 250, categoria: 'Depósito' },
  { destino: 'Hilos uso textil', mcal: 400, categoria: 'Depósito' },
  { destino: 'Huevos', mcal: 40, categoria: 'Depósito' },
  { destino: 'Impresos en estanterías', mcal: 400, categoria: 'Depósito' },
  { destino: 'Impresos en paletas', mcal: 2000, categoria: 'Depósito' },
  { destino: 'Juguetes', mcal: 200, categoria: 'Depósito' },
  { destino: 'Lanas', mcal: 450, categoria: 'Depósito' },
  { destino: 'Leche en polvo', mcal: 2500, categoria: 'Depósito' },
  { destino: 'Lino', mcal: 300, categoria: 'Depósito' },
  { destino: 'Lencería, ropas', mcal: 150, categoria: 'Depósito' },
  { destino: 'Libros', mcal: 500, categoria: 'Depósito' },
  { destino: 'Madera aplacada', mcal: 1000, categoria: 'Depósito' },
  { destino: 'Madera en bruto', mcal: 1500, categoria: 'Depósito' },
  { destino: 'Madera, viruta en silos', mcal: 500, categoria: 'Depósito' },
  { destino: 'Malta en silos', mcal: 3200, categoria: 'Depósito' },
  { destino: 'Manteca', mcal: 1000, categoria: 'Depósito' },
  { destino: 'Material de construcción', mcal: 200, categoria: 'Depósito' },
  { destino: 'Material de equipos de oficina', mcal: 200, categoria: 'Depósito' },
  { destino: 'Material eléctrico', mcal: 80, categoria: 'Depósito' },
  { destino: 'Materias sintéticas en bruto', mcal: 1400, categoria: 'Depósito' },
  { destino: 'Materias sintéticas en espuma', mcal: 300, categoria: 'Depósito' },
  { destino: 'Materias sintéticas, objetos de', mcal: 200, categoria: 'Depósito' },
  { destino: 'Medicamentos', mcal: 80, categoria: 'Depósito' },
  { destino: 'Melaza en toneles', mcal: 1200, categoria: 'Depósito' },
  { destino: 'Muebles', mcal: 200, categoria: 'Depósito' },
  { destino: 'Nitratos', mcal: 20, categoria: 'Depósito' },
  { destino: 'Nitrocelulosa en toneles', mcal: 250, categoria: 'Depósito' },
  { destino: 'Negro de humo en bolsas', mcal: 3000, categoria: 'Depósito' },
  { destino: 'Paja', mcal: 300, categoria: 'Depósito' },
  { destino: 'Pieles', mcal: 300, categoria: 'Depósito' },
  { destino: 'Piolines', mcal: 250, categoria: 'Depósito' },
  { destino: 'Papel en hojas apiladas', mcal: 2000, categoria: 'Depósito' },
  { destino: 'Papel, objetos de', mcal: 250, categoria: 'Depósito' },
  { destino: 'Papel en bobinas apiladas', mcal: 2400, categoria: 'Depósito' },
  { destino: 'Pastas alimenticias', mcal: 400, categoria: 'Depósito' },
  { destino: 'Placas de madera aglomerada', mcal: 1600, categoria: 'Depósito' },
  { destino: 'Puertas de madera', mcal: 420, categoria: 'Depósito' },
  { destino: 'Puertas en materia sintética', mcal: 1000, categoria: 'Depósito' },
  { destino: 'Productos químicos mezclados', mcal: 200, categoria: 'Depósito' },
  { destino: 'Productos de legías', mcal: 120, categoria: 'Depósito' },
  { destino: 'Radios, aparatos de', mcal: 50, categoria: 'Depósito' },
  { destino: 'Recipientes de materiales plásticos', mcal: 170, categoria: 'Depósito' },
  { destino: 'Resinas sintéticas en barriles', mcal: 1000, categoria: 'Depósito' },
  { destino: 'Resinas sintéticas en placas', mcal: 800, categoria: 'Depósito' },
  { destino: 'Revestimientos orgánicos de suelos', mcal: 1600, categoria: 'Depósito' },
  { destino: 'Refrigeradores', mcal: 80, categoria: 'Depósito' },
  { destino: 'Solventes', mcal: 800, categoria: 'Depósito' },
  { destino: 'Tabaco en bruto', mcal: 400, categoria: 'Depósito' },
  { destino: 'Tabaco manufacturado', mcal: 500, categoria: 'Depósito' },
  { destino: 'Tapices', mcal: 500, categoria: 'Depósito' },
  { destino: 'Televisores', mcal: 50, categoria: 'Depósito' },
  { destino: 'Telas y tejidos', mcal: 250, categoria: 'Depósito' },
  { destino: 'Telas de lino', mcal: 200, categoria: 'Depósito' },
  { destino: 'Vestimentas', mcal: 100, categoria: 'Depósito' },
  { destino: 'Ventanas de madera', mcal: 80, categoria: 'Depósito' },
  { destino: 'Ventanas de material plástico', mcal: 80, categoria: 'Depósito' },
  // 2) Establecimientos Comerciales o Públicos
  { destino: 'Agencia de viajes', mcal: 100, categoria: 'Comercial' },
  { destino: 'Alimentación, comercio de', mcal: 160, categoria: 'Comercial' },
  { destino: 'Almacén de calzado', mcal: 120, categoria: 'Comercial' },
  { destino: 'Alfombras, venta de', mcal: 200, categoria: 'Comercial' },
  { destino: 'Antigüedades, comercios', mcal: 160, categoria: 'Comercial' },
  { destino: 'Artículos para el hogar, venta de', mcal: 80, categoria: 'Comercial' },
  { destino: 'Artículos para deportes, venta de', mcal: 180, categoria: 'Comercial' },
  { destino: 'Armerías', mcal: 80, categoria: 'Comercial' },
  { destino: 'Asilos', mcal: 80, categoria: 'Comercial' },
  { destino: 'Bancos', mcal: 80, categoria: 'Comercial' },
  { destino: 'Bibliotecas', mcal: 400, categoria: 'Comercial' },
  { destino: 'Carnicerías, venta', mcal: 10, categoria: 'Comercial' },
  { destino: 'Cantinas', mcal: 60, categoria: 'Comercial' },
  { destino: 'Caucho, comercios de', mcal: 200, categoria: 'Comercial' },
  { destino: 'Cigarrerías', mcal: 120, categoria: 'Comercial' },
  { destino: 'Cines', mcal: 80, categoria: 'Comercial' },
  { destino: 'Cocheras', mcal: 50, categoria: 'Comercial' },
  { destino: 'Comercios de animales', mcal: 40, categoria: 'Comercial' },
  { destino: 'Comercios de granos', mcal: 150, categoria: 'Comercial' },
  { destino: 'Confiterías, venta', mcal: 100, categoria: 'Comercial' },
  { destino: 'Consultorio odontológico', mcal: 40, categoria: 'Comercial' },
  { destino: 'Cordelería, venta', mcal: 120, categoria: 'Comercial' },
  { destino: 'Correo', mcal: 100, categoria: 'Comercial' },
  { destino: 'Cuero, venta de artículos', mcal: 160, categoria: 'Comercial' },
  { destino: 'Droguerías (comercial)', mcal: 250, categoria: 'Comercial' },
  { destino: 'Electricidad, venta de artículos de', mcal: 300, categoria: 'Comercial' },
  { destino: 'Escuela', mcal: 60, categoria: 'Comercial' },
  { destino: 'Exposición de autos', mcal: 60, categoria: 'Comercial' },
  { destino: 'Exposición de máquinas', mcal: 20, categoria: 'Comercial' },
  { destino: 'Exposición de muebles', mcal: 120, categoria: 'Comercial' },
  { destino: 'Exposición de cuadros', mcal: 40, categoria: 'Comercial' },
  { destino: 'Flores, comercios de', mcal: 20, categoria: 'Comercial' },
  { destino: 'Farmacias', mcal: 200, categoria: 'Comercial' },
  { destino: 'Fotografía', mcal: 80, categoria: 'Comercial' },
  { destino: 'Gran tienda', mcal: 100, categoria: 'Comercial' },
  { destino: 'Guardería infantil', mcal: 100, categoria: 'Comercial' },
  { destino: 'Hospital', mcal: 80, categoria: 'Comercial' },
  { destino: 'Hotel', mcal: 80, categoria: 'Comercial' },
  { destino: 'Iglesias', mcal: 40, categoria: 'Comercial' },
  { destino: 'Instrumentos musicales', mcal: 60, categoria: 'Comercial' },
  { destino: 'Jardín de infantes', mcal: 60, categoria: 'Comercial' },
  { destino: 'Joyería', mcal: 80, categoria: 'Comercial' },
  { destino: 'Jugueterías', mcal: 120, categoria: 'Comercial' },
  { destino: 'Kioscos de diarios y revistas', mcal: 300, categoria: 'Comercial' },
  { destino: 'Librerías', mcal: 280, categoria: 'Comercial' },
  { destino: 'Máquinas de oficina, venta de', mcal: 80, categoria: 'Comercial' },
  { destino: 'Máquinas de coser, venta de', mcal: 60, categoria: 'Comercial' },
  { destino: 'Metales, comercios de', mcal: 80, categoria: 'Comercial' },
  { destino: 'Muebles, exposición y venta de', mcal: 120, categoria: 'Comercial' },
  { destino: 'Museos', mcal: 60, categoria: 'Comercial' },
  { destino: 'Papelería, negocio de', mcal: 160, categoria: 'Comercial' },
  { destino: 'Paraguas, venta de', mcal: 80, categoria: 'Comercial' },
  { destino: 'Pensionado', mcal: 80, categoria: 'Comercial' },
  { destino: 'Panadería, venta', mcal: 80, categoria: 'Comercial' },
  { destino: 'Pisos y revestimiento, venta de', mcal: 160, categoria: 'Comercial' },
  { destino: 'Quesería, comercios', mcal: 20, categoria: 'Comercial' },
  { destino: 'Radios y TV, negocios de', mcal: 100, categoria: 'Comercial' },
  { destino: 'Restaurantes', mcal: 80, categoria: 'Comercial' },
  { destino: 'Relojería', mcal: 80, categoria: 'Comercial' },
  { destino: 'Ropa, venta de', mcal: 140, categoria: 'Comercial' },
  { destino: 'Salón de peinados', mcal: 60, categoria: 'Comercial' },
  { destino: 'Salón de té', mcal: 80, categoria: 'Comercial' },
  { destino: 'Sombrererías', mcal: 120, categoria: 'Comercial' },
  { destino: 'Teatros', mcal: 80, categoria: 'Comercial' },
  { destino: 'Tintas y barnices, venta de', mcal: 320, categoria: 'Comercial' },
  { destino: 'Venta de bebidas alcohólicas', mcal: 160, categoria: 'Comercial' },
  { destino: 'Vinería', mcal: 40, categoria: 'Comercial' },
  { destino: 'Verdulería y frutería', mcal: 40, categoria: 'Comercial' },
  // 3) Oficinas
  { destino: 'Archivos (oficina)', mcal: 1000, categoria: 'Oficinas' },
  { destino: 'Bancos, oficinas', mcal: 180, categoria: 'Oficinas' },
  { destino: 'Oficinas comerciales', mcal: 180, categoria: 'Oficinas' },
  { destino: 'Oficinas técnicas', mcal: 140, categoria: 'Oficinas' },
  { destino: 'Oficinas de transporte', mcal: 80, categoria: 'Oficinas' },
  // 4) Vivienda
  { destino: 'Altillos', mcal: 140, categoria: 'Vivienda' },
  { destino: 'Departamentos particulares', mcal: 80, categoria: 'Vivienda' },
  { destino: 'Estacionamiento de autos (playa)', mcal: 70, categoria: 'Vivienda' },
  { destino: 'Garajes (vivienda)', mcal: 40, categoria: 'Vivienda' },
  { destino: 'Sótanos', mcal: 220, categoria: 'Vivienda' },
];

// ── TABLA 3: Cargas de fuego unitarias típicas ────────────────────────────────
const tabla3: { actividad: string; fabricacion: number | null; almacenamiento: number | null }[] = [
  { actividad: 'Abonos químicos',            fabricacion: 200,  almacenamiento: 200 },
  { actividad: 'Aceites comestibles',         fabricacion: 1000, almacenamiento: 18900 },
  { actividad: 'Aceites (mineral/vegetal/animal)', fabricacion: null, almacenamiento: 18900 },
  { actividad: 'Asfalto, manipulación de',    fabricacion: 800,  almacenamiento: 3400 },
  { actividad: 'Barnices',                    fabricacion: 5000, almacenamiento: 2500 },
  { actividad: 'Disolventes',                 fabricacion: null, almacenamiento: 3400 },
  { actividad: 'Laboratorios químicos',       fabricacion: 500,  almacenamiento: null },
  { actividad: 'Limpieza química',            fabricacion: 300,  almacenamiento: null },
  { actividad: 'Plásticos',                   fabricacion: 2000, almacenamiento: 5900 },
  { actividad: 'Artículos de plásticos',      fabricacion: 600,  almacenamiento: 800 },
  { actividad: 'Nitrocelulosa',               fabricacion: null, almacenamiento: 1100 },
  { actividad: 'Oficinas comerciales',        fabricacion: 800,  almacenamiento: null },
  { actividad: 'Oficinas técnicas',           fabricacion: 600,  almacenamiento: null },
  { actividad: 'Papel',                       fabricacion: 200,  almacenamiento: 10000 },
  { actividad: 'Papel, tratamiento – fabricación', fabricacion: 700, almacenamiento: null },
  { actividad: 'Artículos de perfumería',     fabricacion: 300,  almacenamiento: 500 },
  { actividad: 'Productos farmacéuticos',     fabricacion: 200,  almacenamiento: null },
  { actividad: 'Productos químicos combustibles', fabricacion: 300, almacenamiento: 1000 },
  { actividad: 'Resinas naturales',           fabricacion: 3000, almacenamiento: null },
  { actividad: 'Resinas sintéticas',          fabricacion: 3400, almacenamiento: 4200 },
  { actividad: 'Talleres de pintura',         fabricacion: 500,  almacenamiento: null },
  { actividad: 'Tintas',                      fabricacion: 200,  almacenamiento: 3000 },
  { actividad: 'Tintas de imprenta',          fabricacion: 700,  almacenamiento: 3000 },
  { actividad: 'Tintorerías',                 fabricacion: 500,  almacenamiento: null },
];

function getClasificacion(qf: number): { label: string; bg: string; text: string } {
  if (qf < 60)  return { label: 'LEVE',   bg: 'bg-yellow-400', text: 'text-yellow-900' };
  if (qf < 120) return { label: 'COMÚN',  bg: 'bg-orange-500', text: 'text-white' };
  return              { label: 'MAYOR',   bg: 'bg-red-700',    text: 'text-white' };
}

function getPotencialRow(qfTotal: number) {
  if (qfTotal <= 15)  return 0;
  if (qfTotal <= 30)  return 1;
  if (qfTotal <= 60)  return 2;
  if (qfTotal <= 100) return 3;
  return 4;
}

function getRiesgoCol(riesgo: number): keyof typeof claseA[0] {
  const map: Record<number, keyof typeof claseA[0]> = { 1: 'r1', 2: 'r2', 3: 'r3', 4: 'r4', 5: 'r5' };
  return map[riesgo] ?? 'r3';
}

export const FireLoadCalcForm: React.FC<Props> = ({ onCancel }) => {
  const [refOpen, setRefOpen] = useState(false);
  const [refTab, setRefTab] = useState<'tabla1' | 'tabla2' | 'tabla3'>('tabla1');
  const [refSearch, setRefSearch] = useState('');

  const [s, setS] = useState<FireLoadState>({
    superficieM2: 100,
    tipoRiesgo: 2,
    sectorIncendio: 'BOCA DE POZO',
    nroSectores: 1,
    materials: defaultMaterials(),
    extintor: { cantidad: '', marca: '', capacidad: '', agenteExtintor: '', potencialCertificado: '', potencialNecesario: '' },
    usoSeleccionado: null,
    usoM2Custom: 30,
    nUnidadesSalida: 100,
  });

  // ── Cálculos ────────────────────────────────────────────────────
  const totalPesoKg   = s.materials.reduce((a, r) => a + (r.pesoKg || 0), 0);
  const totalCalorias = s.materials.reduce((a, r) => a + (r.pesoKg * r.poderCalorifico), 0); // Kcal
  const pesoMadera    = totalCalorias / PODER_CALORIFICO_MADERA;  // kg equiv madera
  const qf            = s.superficieM2 > 0 ? pesoMadera / s.superficieM2 : 0;  // kg/m²
  const qfTotal       = qf * s.nroSectores;
  const clasificacion = getClasificacion(qfTotal);
  const riesgoCol     = getRiesgoCol(s.tipoRiesgo <= 5 ? s.tipoRiesgo : 3);
  const potRow        = getPotencialRow(qfTotal);
  const potA          = claseA[potRow]?.[riesgoCol] ?? 'A determinar';
  const potB          = claseB[potRow]?.[riesgoCol] ?? 'A determinar';
  const extintoresSug = s.superficieM2 > 0 ? Math.ceil(s.superficieM2 / 200) : 0;

  // Factor de ocupación
  const usoM2 = s.usoSeleccionado !== null ? usoOcupacion[s.usoSeleccionado].m2 : s.usoM2Custom;
  const nFactorOcupacion = usoM2 > 0 && s.superficieM2 > 0 ? Math.ceil(s.superficieM2 / usoM2) : 0;
  const nPersonasOcup20  = Math.floor(nFactorOcupacion * 0.8);

  const setMat = (idx: number, field: keyof MaterialRow, val: string | number) =>
    setS(prev => ({ ...prev, materials: prev.materials.map((r, i) => i === idx ? { ...r, [field]: val } : r) }));

  const addRow = () =>
    setS(prev => ({ ...prev, materials: [...prev.materials, { id: String(prev.materials.length + 1), material: '', pesoKg: 0, poderCalorifico: 0 }] }));

  const removeRow = (idx: number) =>
    setS(prev => ({ ...prev, materials: prev.materials.filter((_, i) => i !== idx) }));

  // ── Estilos helpers ─────────────────────────────────────────────
  const thBlue  = 'px-2 py-2 text-xs font-bold uppercase tracking-wide text-white text-center border border-sky-700 bg-sky-700';
  const thGray  = 'px-2 py-1.5 text-xs font-bold text-white text-center border border-gray-600 bg-gray-700';
  const td      = 'px-2 py-1.5 text-xs text-center border border-gray-200';
  const inputSm = 'w-full outline-none bg-transparent border-b border-gray-300 focus:border-brand-red px-1 py-0.5 text-xs';

  return (
    <div id="print-area" className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none font-sans text-xs">

      {/* ══ HEADER ══════════════════════════════════════════════ */}
      <div className="flex flex-col sm:grid sm:grid-cols-12 border-b-2 border-black">
        <div className="col-span-2 p-3 border-b sm:border-b-0 sm:border-r-2 border-black flex flex-col items-center justify-center select-none">
          <div className="text-2xl font-black text-brand-red italic tracking-tighter">TACKER</div>
          <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">solutions</div>
        </div>
        <div className="col-span-8 p-3 flex items-center justify-center text-center border-b sm:border-b-0 sm:border-r-2 border-black">
          <h1 className="font-black text-lg uppercase text-brand-red">Determinación de la Carga de Fuego</h1>
        </div>
        <div className="col-span-2 p-3 flex flex-col items-center justify-center font-bold text-xs text-gray-600 text-center">
          <div>Dec. 351/79</div>
          <div>Anexo VII</div>
        </div>
      </div>

      {/* ══ DATOS PRINCIPALES ═══════════════════════════════════ */}
      <div className="bg-sky-100 border-b border-black">
        <div className="bg-sky-700 text-white text-[10px] font-bold uppercase px-4 py-1 tracking-wide">Datos Principales</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2 px-4 py-3">
          <div>
            <div className="text-[9px] font-bold uppercase text-gray-500">Superficie (m²)</div>
            <input id="sup" title="Superficie m²" type="number" placeholder="100"
              className="border-b border-gray-500 outline-none bg-transparent text-sm font-bold py-0.5 w-full"
              value={s.superficieM2 || ''} onChange={e => setS(p => ({ ...p, superficieM2: parseFloat(e.target.value) || 0 }))} />
          </div>
          <div>
            <div className="text-[9px] font-bold uppercase text-gray-500">Tipo de Riesgo</div>
            <select id="riesgo" title="Tipo de Riesgo"
              className="border-b border-gray-500 outline-none bg-transparent text-xs font-bold py-0.5 w-full"
              value={s.tipoRiesgo} onChange={e => setS(p => ({ ...p, tipoRiesgo: parseInt(e.target.value) }))}>
              {tiposRiesgo.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              <option value={0}>N.P.= No permitido</option>
            </select>
          </div>
          <div>
            <div className="text-[9px] font-bold uppercase text-gray-500">Sector de Incendio</div>
            <input id="sector" title="Sector de Incendio" placeholder="Ej: BOCA DE POZO"
              className="border-b border-gray-500 outline-none bg-transparent text-sm font-bold py-0.5 w-full uppercase"
              value={s.sectorIncendio} onChange={e => setS(p => ({ ...p, sectorIncendio: e.target.value }))} />
          </div>
          <div>
            <div className="text-[9px] font-bold uppercase text-gray-500">N° de Sectores de Incendio</div>
            <input id="nroSect" title="N° de Sectores" type="number" placeholder="1"
              className="border-b border-gray-500 outline-none bg-transparent text-sm font-bold py-0.5 w-full"
              value={s.nroSectores || ''} onChange={e => setS(p => ({ ...p, nroSectores: parseInt(e.target.value) || 1 }))} />
          </div>
        </div>
      </div>

      {/* ══ TABLA MATERIALES ════════════════════════════════════ */}
      <div className="border-b border-black">
        <div className="bg-sky-700 text-white text-[10px] font-bold uppercase px-4 py-1 tracking-wide">
          Cálculo Carga de Fuego Total Kg/m² — Decreto 351/79 Anexos 1-2-3-4-5-6-7
        </div>
        <div className="overflow-x-auto px-2 py-2">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-sky-700">
                <th className={`${thBlue} w-6`}>N°</th>
                <th className={`${thBlue} text-left`}>Materiales</th>
                <th className={`${thBlue} w-28`}>Peso en Kg "P"</th>
                <th className={`${thBlue} w-36`}>Poder Calorífico "K" Kcal/Kg</th>
                <th className={`${thBlue} w-36`}>Cant. de Calorías "Q" Kcal</th>
                <th className={`${thBlue} w-6 no-print`}></th>
              </tr>
            </thead>
            <tbody>
              {s.materials.map((row, idx) => {
                const Q = row.pesoKg * row.poderCalorifico;
                return (
                  <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-sky-50'}>
                    <td className={`${td} font-bold text-gray-400`}>{idx + 1}</td>
                    <td className="px-2 py-1 border border-gray-200">
                      <input title={`Material ${idx + 1}`} placeholder="Nombre del material"
                        className={inputSm} value={row.material}
                        onChange={e => setMat(idx, 'material', e.target.value)} />
                    </td>
                    <td className="px-2 py-1 border border-gray-200">
                      <input title={`Peso kg ${idx + 1}`} type="number" placeholder="0"
                        className={`${inputSm} text-right font-bold`} value={row.pesoKg || ''}
                        onChange={e => setMat(idx, 'pesoKg', parseFloat(e.target.value) || 0)} />
                    </td>
                    <td className="px-2 py-1 border border-gray-200">
                      <input title={`K calorífico ${idx + 1}`} type="number" step="1" placeholder="0"
                        className={`${inputSm} text-right font-bold`} value={row.poderCalorifico || ''}
                        onChange={e => setMat(idx, 'poderCalorifico', parseFloat(e.target.value) || 0)} />
                    </td>
                    <td className={`${td} font-bold text-sky-800 bg-sky-50`}>{Q > 0 ? Q.toLocaleString('es-AR') : '—'}</td>
                    <td className="px-1 border border-gray-200 text-center no-print">
                      <button title="Eliminar fila" aria-label="Eliminar fila"
                        onClick={() => removeRow(idx)}
                        className="text-red-400 hover:text-red-700 font-bold text-sm leading-none">×</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-sky-700 text-white font-bold text-xs">
                <td className="px-2 py-2 border border-sky-600 text-right" colSpan={2}>Total Peso en Kg =</td>
                <td className="px-2 py-2 border border-sky-600 text-center">{totalPesoKg.toLocaleString('es-AR')}</td>
                <td className="px-2 py-2 border border-sky-600 text-right">Qm =</td>
                <td className="px-2 py-2 border border-sky-600 text-center text-base">{totalCalorias.toLocaleString('es-AR')} <span className="text-[10px] font-normal">Kcal</span></td>
                <td className="border border-sky-600 no-print"></td>
              </tr>
            </tfoot>
          </table>
          <div className="mt-1.5 no-print flex items-center gap-3">
            <button title="Agregar material" aria-label="Agregar material" onClick={addRow}
              className="text-[10px] px-2 py-1 rounded border border-sky-400 text-sky-700 hover:bg-sky-50 font-semibold">
              + Agregar material
            </button>
            <span className="text-[10px] text-gray-400">Nota: Agregar más filas si es necesario</span>
          </div>
        </div>
      </div>

      {/* ══ FÓRMULAS + CLASIFICACIÓN ════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-b border-black">

        {/* Fórmulas */}
        <div className="p-4 border-r border-black space-y-3">
          {/* Pem */}
          <div className="bg-gray-50 border border-gray-200 rounded p-3">
            <div className="text-[9px] font-bold uppercase text-gray-500 mb-1">Fórmula Peso Eq. en Madera (Pem)</div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
              <span>Total de Calorías (Qm) =</span>
              <span className="font-black text-sky-700">{totalCalorias.toLocaleString('es-AR')} Kcal</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mt-1">
              <span>Peso Madera (Kcal/Kg) = {PODER_CALORIFICO_MADERA}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs">Pem =</span>
              <span className="font-black text-sky-800 text-base bg-sky-100 px-2 rounded">{pesoMadera.toFixed(2)}</span>
              <span className="text-xs">Kg</span>
            </div>
          </div>

          {/* Qf */}
          <div className="bg-gray-50 border border-gray-200 rounded p-3">
            <div className="text-[9px] font-bold uppercase text-gray-500 mb-1">Fórmula Carga de Fuego (Qf)</div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
              <span>Kg madera equivalente / Superficie del Sector m²</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs">{pesoMadera.toFixed(2)} ÷ {s.superficieM2} =</span>
              <span className="font-black text-sky-800 text-base bg-sky-100 px-2 rounded">{qf.toFixed(2)}</span>
              <span className="text-xs">Kg/m²</span>
            </div>
          </div>

          {/* Qf Total */}
          <div className="bg-gray-50 border border-gray-200 rounded p-3">
            <div className="text-[9px] font-bold uppercase text-gray-500 mb-1">Fórmula Carga de Fuego Total Sectores (Qf Total)</div>
            <div className="text-xs text-gray-600">Qf × Cantidad de Sectores</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs">{qf.toFixed(2)} × {s.nroSectores} =</span>
              <span className="font-black text-sky-800 text-xl bg-sky-100 px-2 rounded">{qfTotal.toFixed(2)}</span>
              <span className="text-xs">Kg/m²</span>
            </div>
          </div>
        </div>

        {/* Clasificación */}
        <div className="p-4 flex flex-col gap-3">
          <div className="text-[9px] font-bold uppercase text-gray-500">Clasificación Qf — Nota: Elegir según la Qf</div>

          <table className="w-full text-xs border-collapse">
            <tbody>
              <tr className={`border border-gray-200 ${qfTotal < 60 ? 'ring-2 ring-yellow-500' : ''}`}>
                <td className="px-3 py-1.5 border border-gray-200 text-gray-700">Qf &lt; 60 kg/m²</td>
                <td className="px-3 py-1.5 border border-gray-200 bg-yellow-400 text-yellow-900 font-black text-center">LEVE</td>
              </tr>
              <tr className={`border border-gray-200 ${qfTotal >= 60 && qfTotal < 120 ? 'ring-2 ring-orange-500' : ''}`}>
                <td className="px-3 py-1.5 border border-gray-200 text-gray-700">60 kg/m² &lt; Qf &lt; 120 Kg/m²</td>
                <td className="px-3 py-1.5 border border-gray-200 bg-orange-500 text-white font-black text-center">COMÚN</td>
              </tr>
              <tr className={`border border-gray-200 ${qfTotal >= 120 ? 'ring-2 ring-red-700' : ''}`}>
                <td className="px-3 py-1.5 border border-gray-200 text-gray-700">120 kg/m² &lt; Qf</td>
                <td className="px-3 py-1.5 border border-gray-200 bg-red-700 text-white font-black text-center">MAYOR</td>
              </tr>
            </tbody>
          </table>

          <div className="text-[9px] text-gray-500 font-bold uppercase">Clasificación Básica de Cargas de Fuego (Qf)</div>

          {/* Resultado */}
          <div className={`rounded-lg p-4 text-center ${clasificacion.bg}`}>
            <div className="text-[10px] text-white/70 uppercase font-semibold mb-1">Resultado</div>
            <div className={`text-4xl font-black ${clasificacion.text}`}>{clasificacion.label}</div>
            <div className={`text-sm font-bold mt-1 ${clasificacion.text}`}>{qfTotal.toFixed(2)} kg/m²</div>
          </div>
        </div>
      </div>

      {/* ══ POTENCIAL EXTINTOR ══════════════════════════════════ */}
      <div className="border-b border-black">
        <div className="bg-sky-700 text-white text-[10px] font-bold uppercase px-4 py-1 tracking-wide">
          Potencial Extintor Anexo 7 — Dec. 351/79
        </div>
        <div className="px-4 py-2 text-[10px] text-gray-600 space-y-0.5 bg-gray-50 border-b border-gray-200">
          <div>1- Clase A: Fuegos sobre combustibles sólidos, como ser madera, papel, telas, gomas, plásticos y otros.</div>
          <div>2- Clase B: Fuegos sobre líquidos inflamables, grasas, pinturas, ceras, gases y otros.</div>
          <div>3- Clase C: Fuegos sobre materiales, instalaciones o equipos sometidos a la acción de la corriente eléctrica.</div>
          <div>4- Clase D: Fuegos sobre metales combustibles, como ser el magnesio, titanio, potasio, sodio y otros.</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          {/* Clase A */}
          <div>
            <div className="text-[10px] font-bold uppercase text-gray-600 mb-1 border-b pb-0.5">Fuegos Clase A</div>
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr>
                  <th className={thGray}>Carga de Fuego</th>
                  {[1,2,3,4,5].map(r => (
                    <th key={r} className={`${thGray} ${r === (s.tipoRiesgo <= 5 ? s.tipoRiesgo : 3) ? 'bg-yellow-500 text-gray-900' : ''}`}>
                      {r}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {claseA.map((row, idx) => (
                  <tr key={idx} className={idx === potRow ? 'bg-yellow-50 font-bold' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-2 py-1 border border-gray-200 text-gray-700">{row.rango}</td>
                    {[row.r1, row.r2, row.r3, row.r4, row.r5].map((v, vi) => (
                      <td key={vi} className={`${td} ${vi + 1 === (s.tipoRiesgo <= 5 ? s.tipoRiesgo : 3) ? 'bg-yellow-100 font-black text-yellow-800' : ''}`}>{v}</td>
                    ))}
                  </tr>
                ))}
                <tr className="bg-gray-200 text-gray-700 text-[10px]">
                  <td className="px-2 py-1 border border-gray-300 font-bold" colSpan={6}>A determinar en cada caso</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Clase B */}
          <div>
            <div className="text-[10px] font-bold uppercase text-gray-600 mb-1 border-b pb-0.5">Fuegos Clase B</div>
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr>
                  <th className={thGray}>Carga de Fuego</th>
                  {[1,2,3,4,5].map(r => (
                    <th key={r} className={`${thGray} ${r === (s.tipoRiesgo <= 5 ? s.tipoRiesgo : 3) ? 'bg-yellow-500 text-gray-900' : ''}`}>
                      {r}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {claseB.map((row, idx) => (
                  <tr key={idx} className={idx === potRow ? 'bg-yellow-50 font-bold' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-2 py-1 border border-gray-200 text-gray-700">{row.rango}</td>
                    {[row.r1, row.r2, row.r3, row.r4, row.r5].map((v, vi) => (
                      <td key={vi} className={`${td} ${vi + 1 === (s.tipoRiesgo <= 5 ? s.tipoRiesgo : 3) ? 'bg-yellow-100 font-black text-yellow-800' : ''}`}>{v}</td>
                    ))}
                  </tr>
                ))}
                <tr className="bg-gray-200 text-gray-700 text-[10px]">
                  <td className="px-2 py-1 border border-gray-300 font-bold" colSpan={6}>A determinar en cada caso</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pot. Ext. necesario */}
        <div className="px-4 pb-4">
          <table className="border-collapse text-xs">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className={thGray}></th>
                <th className={thGray}>Fuego Clase A</th>
                <th className={thGray}>Fuego Clase B</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border border-gray-200 font-bold text-gray-700">Pot. Ext. necesario en el sector de incendio</td>
                <td className="px-3 py-1.5 border border-gray-200 text-center font-black text-sky-700 bg-sky-50 text-base">{potA}</td>
                <td className="px-3 py-1.5 border border-gray-200 text-center font-black text-sky-700 bg-sky-50 text-base">{potB}</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border border-gray-200 font-bold text-gray-700">Distancia Máxima a recorrer hasta el extintor</td>
                <td className={td}>20 m</td>
                <td className={td}>9–15 m</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ══ CANTIDAD EXTINTORES ═════════════════════════════════ */}
      <div className="border-b border-black">
        <div className="bg-sky-700 text-white text-[10px] font-bold uppercase px-4 py-1 tracking-wide">
          Cálculo Cantidad de Extintores Necesarios
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">

          {/* Izquierda */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label htmlFor="areaRiesgo" className="text-[10px] font-bold uppercase text-gray-500 w-36">Área de riesgo m² =</label>
              <span className="font-black text-sky-700 text-base">{s.superficieM2} m²</span>
              <span className="text-[10px] text-gray-400">(= Superficie del Sector)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase text-gray-500 w-36">200 m²</span>
              <span className="font-black text-sky-700 text-2xl bg-sky-100 px-4 py-1 rounded">{extintoresSug}</span>
              <span className="text-[10px] text-gray-400">Extintor(es)</span>
            </div>

            <div className="mt-3">
              <div className="text-[10px] font-bold uppercase text-gray-600 mb-2">Selección Definitiva — Cantidad de Extintores</div>
              <div className="text-[10px] font-bold uppercase text-gray-500 mb-1 bg-sky-100 px-2 py-1 rounded">Extintor 1</div>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { label: 'Cantidad',                      field: 'cantidad'           as const },
                  { label: 'Marca',                         field: 'marca'              as const },
                  { label: 'Capacidad c/ext.',              field: 'capacidad'          as const },
                  { label: 'Agente extintor',               field: 'agenteExtintor'     as const },
                  { label: 'Potencial extintor s/ cert.',   field: 'potencialCertificado' as const },
                  { label: 'Pot. Extintor Necesario',       field: 'potencialNecesario' as const },
                ] as { label: string; field: keyof ExtintorDef }[]).map(({ label, field }) => (
                  <div key={field}>
                    <div className="text-[9px] font-bold uppercase text-gray-400">{label}</div>
                    <input id={`ext-${field}`} title={label}
                      className="border-b border-gray-300 outline-none text-xs py-0.5 focus:border-brand-red bg-transparent w-full uppercase"
                      value={s.extintor[field]}
                      onChange={e => setS(p => ({ ...p, extintor: { ...p.extintor, [field]: e.target.value } }))} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-2 bg-sky-700 text-white rounded p-2 text-xs font-bold">
              TOTAL EXTINTORES × SECTOR DE INCENDIO: <span className="text-xl ml-2">{parseInt(s.extintor.cantidad) || 0}</span>
            </div>
          </div>

          {/* Derecha — Tabla de extintores */}
          <div>
            <div className="text-[10px] font-bold uppercase text-gray-600 mb-2">Tipos de Extintores Disponibles</div>
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-gray-700 text-white">
                  <th className={thGray + ' text-left'}>Tipo</th>
                  <th className={thGray}>Peso</th>
                  <th className={thGray}>Valor</th>
                </tr>
              </thead>
              <tbody>
                {tablaExtintores.map((e, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-2 py-1 border border-gray-200 text-gray-700">{e.tipo}</td>
                    <td className={`${td} font-bold`}>{e.peso}</td>
                    <td className={`${td} font-bold text-sky-700`}>{e.valor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-1 text-[9px] text-gray-400 text-right">www.bomberos.org.blognot.com.ar</div>
          </div>
        </div>
      </div>

      {/* ══ FACTOR DE OCUPACIÓN ═════════════════════════════════ */}
      <div className="border-b border-black">
        <div className="bg-sky-700 text-white text-[10px] font-bold uppercase px-4 py-1 tracking-wide">
          Cálculos de Medios de Salida y Factor de Ocupación
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">

          {/* Izquierda */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[9px] font-bold uppercase text-gray-500">n (Cant. de unidades de salida)</div>
                <div className="flex items-center gap-2 mt-1">
                  <input id="nUAS" title="Unidades de salida" type="number"
                    className="w-24 border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-brand-red"
                    value={s.nUnidadesSalida} onChange={e => setS(p => ({ ...p, nUnidadesSalida: parseInt(e.target.value) || 0 }))} />
                  <span className="text-[10px] text-gray-400">u.a.s.</span>
                </div>
                <div className="text-[9px] text-gray-400 mt-1">Cuando n sea menor a 3 u.a.s., bastará con una sola vía de escape</div>
              </div>
              <div>
                <div className="text-[9px] font-bold uppercase text-gray-500">N (Factor de Ocupación) — metros cuadrados</div>
                <div className="flex items-center gap-2 mt-1">
                  <input id="m2uso" title="m² por uso" type="number"
                    className="w-24 border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-brand-red"
                    value={usoM2} onChange={e => { setS(p => ({ ...p, usoSeleccionado: null, usoM2Custom: parseFloat(e.target.value) || 1 })); }} />
                  <span className="text-[10px] text-gray-400">uso*</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-sky-50 border border-sky-200 rounded p-3 text-center">
                <div className="text-[9px] font-bold uppercase text-gray-500">N Factor de Ocupación</div>
                <div className="text-2xl font-black text-sky-700">{nFactorOcupacion}</div>
                <div className="text-[9px] text-gray-400">personas</div>
              </div>
              <div className="bg-sky-50 border border-sky-200 rounded p-3 text-center">
                <div className="text-[9px] font-bold uppercase text-gray-500">Considerando el 20% libre para circulación</div>
                <div className="text-2xl font-black text-sky-700">{nPersonasOcup20}</div>
                <div className="text-[9px] text-gray-400">personas</div>
              </div>
            </div>
          </div>

          {/* Tabla uso */}
          <div>
            <div className="text-[10px] font-bold uppercase text-gray-600 mb-1">USO — m² por persona (click para seleccionar)</div>
            <div className="overflow-y-auto max-h-56 border border-gray-200 rounded">
              <table className="w-full text-xs border-collapse">
                <thead className="sticky top-0 bg-gray-700 text-white">
                  <tr>
                    <th className={`${thGray} text-left`}>USO</th>
                    <th className={thGray}>m²</th>
                  </tr>
                </thead>
                <tbody>
                  {usoOcupacion.map((item, idx) => (
                    <tr key={idx} onClick={() => setS(p => ({ ...p, usoSeleccionado: idx, usoM2Custom: item.m2 }))}
                      className={`cursor-pointer transition-colors ${s.usoSeleccionado === idx ? 'bg-sky-200 font-bold' : idx % 2 === 0 ? 'bg-white hover:bg-sky-50' : 'bg-gray-50 hover:bg-sky-50'}`}>
                      <td className="px-2 py-1.5 border border-gray-200 leading-snug">{item.uso}</td>
                      <td className="px-2 py-1.5 border border-gray-200 text-center font-bold text-sky-700">{item.m2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ══ TABLAS DE REFERENCIA (colapsable) ══════════════════════ */}
      <div className="border-b border-black no-print">
        <button
          title="Tablas de Referencia Dec. 351/79"
          aria-label="Tablas de Referencia Dec. 351/79"
          onClick={() => setRefOpen(o => !o)}
          className="w-full flex items-center justify-between bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold uppercase px-4 py-2 tracking-wide transition-colors">
          <span>📚 Tablas de Referencia — Dec. 351/79 (Ing. Mario E. Rosato)</span>
          <span className="text-sm">{refOpen ? '▲' : '▼'}</span>
        </button>

        {refOpen && (
          <div className="p-4 bg-amber-50">
            {/* Tabs */}
            <div className="flex gap-1 mb-3">
              {(['tabla1', 'tabla2', 'tabla3'] as const).map(t => (
                <button key={t} title={t} aria-label={t}
                  onClick={() => { setRefTab(t); setRefSearch(''); }}
                  className={`px-3 py-1 rounded text-[10px] font-bold uppercase border transition-colors ${
                    refTab === t ? 'bg-amber-700 text-white border-amber-700' : 'bg-white text-amber-700 border-amber-400 hover:bg-amber-100'
                  }`}>
                  {t === 'tabla1' ? 'TABLA 1 — kg madera/m²' : t === 'tabla2' ? 'TABLA 2 — Mcal/m²' : 'TABLA 3 — MJ/m²'}
                </button>
              ))}
            </div>

            {/* Descripción */}
            <div className="text-[10px] text-amber-800 mb-3 bg-amber-100 px-3 py-2 rounded border border-amber-300">
              {refTab === 'tabla1' && 'Carga de fuego estimada en base a estadísticas de locales semejantes con el mismo destino (kg de madera/m²).'}
              {refTab === 'tabla2' && 'Datos válidos para almacenajes de material con 1 metro de altura, depósitos, establecimientos comerciales, oficinas y vivienda (Mcal/m²).'}
              {refTab === 'tabla3' && 'Cargas de fuego unitarias típicas por actividad — Fabricación (MJ/m²) y Almacenamiento (MJ/m³). Ref: "Fundamentos de Protección Estructural Contra Incendios" — Ing. Mario E. Rosato.'}
            </div>

            {/* Buscador */}
            <div className="mb-2">
              <input
                title="Buscar en tabla"
                aria-label="Buscar en tabla"
                placeholder={refTab === 'tabla3' ? 'Buscar actividad…' : 'Buscar destino / material…'}
                value={refSearch}
                onChange={e => setRefSearch(e.target.value)}
                className="border border-amber-400 rounded px-3 py-1 text-xs outline-none focus:border-amber-600 bg-white w-full sm:w-80"
              />
            </div>

            {/* TABLA 1 */}
            {refTab === 'tabla1' && (() => {
              const rows = tabla1.filter(r => r.destino.toLowerCase().includes(refSearch.toLowerCase()));
              return (
                <div className="overflow-x-auto max-h-64 overflow-y-auto border border-amber-200 rounded">
                  <table className="w-full border-collapse text-xs">
                    <thead className="sticky top-0 bg-amber-700 text-white">
                      <tr>
                        <th className="px-3 py-2 text-left font-bold border border-amber-600">Destino / Local</th>
                        <th className="px-3 py-2 text-center font-bold border border-amber-600 whitespace-nowrap">Carga de Fuego (kg madera/m²)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-amber-50'}>
                          <td className="px-3 py-1.5 border border-amber-100 text-gray-700">{r.destino}</td>
                          <td className="px-3 py-1.5 border border-amber-100 text-center font-bold text-amber-700">{r.carga}</td>
                        </tr>
                      ))}
                      {rows.length === 0 && <tr><td colSpan={2} className="text-center py-4 text-gray-400">Sin resultados</td></tr>}
                    </tbody>
                  </table>
                </div>
              );
            })()}

            {/* TABLA 2 */}
            {refTab === 'tabla2' && (() => {
              const cats = ['Depósito', 'Comercial', 'Oficinas', 'Vivienda'];
              const q = refSearch.toLowerCase();
              const rows = tabla2.filter(r => r.destino.toLowerCase().includes(q) || r.categoria.toLowerCase().includes(q));
              const catColors: Record<string, string> = { 'Depósito': 'bg-blue-100 text-blue-800', 'Comercial': 'bg-green-100 text-green-800', 'Oficinas': 'bg-purple-100 text-purple-800', 'Vivienda': 'bg-orange-100 text-orange-800' };
              return (
                <div>
                  {!refSearch && (
                    <div className="flex gap-1 mb-2 flex-wrap">
                      {cats.map(c => <span key={c} className={`px-2 py-0.5 rounded text-[10px] font-bold ${catColors[c]}`}>{c}</span>)}
                    </div>
                  )}
                  <div className="overflow-x-auto max-h-64 overflow-y-auto border border-amber-200 rounded">
                    <table className="w-full border-collapse text-xs">
                      <thead className="sticky top-0 bg-amber-700 text-white">
                        <tr>
                          <th className="px-3 py-2 text-left font-bold border border-amber-600">Destino / Material</th>
                          <th className="px-2 py-2 text-center font-bold border border-amber-600">Categoría</th>
                          <th className="px-3 py-2 text-center font-bold border border-amber-600 whitespace-nowrap">Mcal/m²</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((r, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-amber-50'}>
                            <td className="px-3 py-1.5 border border-amber-100 text-gray-700">{r.destino}</td>
                            <td className="px-2 py-1.5 border border-amber-100 text-center"><span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${catColors[r.categoria] ?? ''}`}>{r.categoria}</span></td>
                            <td className="px-3 py-1.5 border border-amber-100 text-center font-bold text-amber-700">{r.mcal.toLocaleString('es-AR')}</td>
                          </tr>
                        ))}
                        {rows.length === 0 && <tr><td colSpan={3} className="text-center py-4 text-gray-400">Sin resultados</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}

            {/* TABLA 3 */}
            {refTab === 'tabla3' && (() => {
              const rows = tabla3.filter(r => r.actividad.toLowerCase().includes(refSearch.toLowerCase()));
              return (
                <div className="overflow-x-auto max-h-64 overflow-y-auto border border-amber-200 rounded">
                  <table className="w-full border-collapse text-xs">
                    <thead className="sticky top-0 bg-amber-700 text-white">
                      <tr>
                        <th className="px-3 py-2 text-left font-bold border border-amber-600">Actividad</th>
                        <th className="px-3 py-2 text-center font-bold border border-amber-600 whitespace-nowrap">Fabricación (MJ/m²)</th>
                        <th className="px-3 py-2 text-center font-bold border border-amber-600 whitespace-nowrap">Almacenamiento (MJ/m³)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-amber-50'}>
                          <td className="px-3 py-1.5 border border-amber-100 text-gray-700">{r.actividad}</td>
                          <td className="px-3 py-1.5 border border-amber-100 text-center font-bold text-amber-700">{r.fabricacion !== null ? r.fabricacion.toLocaleString('es-AR') : '—'}</td>
                          <td className="px-3 py-1.5 border border-amber-100 text-center font-bold text-amber-700">{r.almacenamiento !== null ? r.almacenamiento.toLocaleString('es-AR') : '—'}</td>
                        </tr>
                      ))}
                      {rows.length === 0 && <tr><td colSpan={3} className="text-center py-4 text-gray-400">Sin resultados</td></tr>}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* ══ LEYENDA RIESGOS ═════════════════════════════════════ */}
      <div className="bg-gray-50 border-b border-black px-4 py-3">
        <div className="text-[9px] font-bold uppercase text-gray-500 mb-2">Clasificación de Riesgos</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[10px]">
          {tiposRiesgo.map(r => (
            <div key={r.value} className={`px-2 py-0.5 rounded font-semibold ${s.tipoRiesgo === r.value ? 'bg-sky-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
              {r.label}
            </div>
          ))}
          <div className="px-2 py-0.5 rounded font-semibold bg-white border border-gray-200 text-gray-600">N.P. = No permitido</div>
        </div>
      </div>

      {/* ══ FOOTER ══════════════════════════════════════════════ */}
      <div className="px-6 py-2 bg-gray-100 text-[9px] text-gray-400 text-center border-b border-gray-200">
        GENERADO POR WS OPERACIONES — DECRETO 351/79 — TODOS LOS DERECHOS RESERVADOS — SE PROHÍBE SU REPRODUCCIÓN RÉPLICA.
      </div>

      {/* ══ ACCIONES ════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-end p-4 border-t border-gray-200 no-print bg-gray-50">
        <Button variant="secondary" onClick={onCancel} className="w-full sm:w-auto">Cerrar</Button>
        <Button variant="secondary" onClick={() => window.print()} className="w-full sm:w-auto">🖨️ Imprimir</Button>
        <div className="w-full sm:w-auto">
          <ExportPdfButton
            filename="calculo_carga_de_fuego"
            orientation="p"
            className="w-full"
            pdfComponent={
              <FireLoadCalcPdf
                state={s}
                calculados={{
                  totalPesoKg,
                  totalCalorias,
                  pesoMadera,
                  qf,
                  qfTotal,
                  clasificacionLabel: clasificacion.label,
                  potA,
                  potB,
                  extintoresSug,
                  usoM2,
                  nFactorOcupacion,
                  nPersonasOcup20,
                }}
              />
            }
          />
        </div>
      </div>
    </div>
  );
};
