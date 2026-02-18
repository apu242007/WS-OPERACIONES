
import React, { useState, useRef, useCallback } from 'react';
import { ElementType, LayoutElement } from '../../types';

interface WellLayoutEditorProps {
  value: LayoutElement[];
  onChange: (elements: LayoutElement[]) => void;
  readOnly?: boolean;
}

// ── CONFIGURACIÓN DE ELEMENTOS ───────────────────────────────────────────────

const ELEMENT_CONFIG: Record<ElementType, {
  label: string;
  icon: string;
  color: string;
  shape: 'square' | 'circle' | 'diamond';
  size: number;
}> = {
  bodega:      { label: 'Bodega',       icon: '□', color: '#6b7280', shape: 'square',  size: 24 },
  anclaje:     { label: 'Anclaje',      icon: '■', color: '#1f2937', shape: 'square',  size: 16 },
  fosa_quema:  { label: 'Fosa de quema',icon: '—', color: '#dc2626', shape: 'diamond', size: 20 },
  equipo:      { label: 'Equipo',       icon: '▣', color: '#2563eb', shape: 'square',  size: 32 },
  pozo:        { label: 'Pozo',         icon: '○', color: '#059669', shape: 'circle',  size: 20 },
};

// ── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────

export const WellLayoutEditor: React.FC<WellLayoutEditorProps> = ({
  value,
  onChange,
  readOnly = false,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // ── AGREGAR ELEMENTO ───────────────────────────────────────────────────────
  const addElement = useCallback((type: ElementType) => {
    const newEl: LayoutElement = {
      id: `${type}_${Date.now()}`,
      type,
      x: 45 + Math.random() * 10, // centro con pequeña variación
      y: 45 + Math.random() * 10,
      label: ELEMENT_CONFIG[type].label,
    };
    onChange([...value, newEl]);
  }, [value, onChange]);

  // ── ELIMINAR ELEMENTO ──────────────────────────────────────────────────────
  const removeElement = useCallback((id: string) => {
    onChange(value.filter(el => el.id !== id));
    setSelectedId(null);
  }, [value, onChange]);

  // ── DRAG START ─────────────────────────────────────────────────────────────
  const handleMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    if (readOnly) return;
    e.preventDefault();
    e.stopPropagation();
    setDragging(id);
    setSelectedId(id);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const el = value.find(v => v.id === id);
    if (!el) return;

    const elX = (el.x / 100) * rect.width;
    const elY = (el.y / 100) * rect.height;
    setDragOffset({
      x: e.clientX - rect.left - elX,
      y: e.clientY - rect.top - elY,
    });
  }, [readOnly, value]);

  // ── DRAG MOVE ──────────────────────────────────────────────────────────────
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || readOnly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((e.clientX - rect.left - dragOffset.x) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((e.clientY - rect.top - dragOffset.y) / rect.height) * 100));

    onChange(value.map(el => el.id === dragging ? { ...el, x, y } : el));
  }, [dragging, dragOffset, readOnly, value, onChange]);

  // ── DRAG END ───────────────────────────────────────────────────────────────
  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  // ── TOUCH SUPPORT ──────────────────────────────────────────────────────────
  const handleTouchStart = useCallback((e: React.TouchEvent, id: string) => {
    if (readOnly) return;
    e.preventDefault();
    setDragging(id);
    setSelectedId(id);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const el = value.find(v => v.id === id);
    if (!el) return;
    const touch = e.touches[0];

    setDragOffset({
      x: touch.clientX - rect.left - (el.x / 100) * rect.width,
      y: touch.clientY - rect.top - (el.y / 100) * rect.height,
    });
  }, [readOnly, value]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragging || readOnly) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];

    const x = Math.min(100, Math.max(0, ((touch.clientX - rect.left - dragOffset.x) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((touch.clientY - rect.top - dragOffset.y) / rect.height) * 100));

    onChange(value.map(el => el.id === dragging ? { ...el, x, y } : el));
  }, [dragging, dragOffset, readOnly, value, onChange]);

  // ── RENDER ELEMENTO ────────────────────────────────────────────────────────
  const renderElement = (el: LayoutElement) => {
    const config = ELEMENT_CONFIG[el.type];
    const isSelected = selectedId === el.id;
    const isDraggingThis = dragging === el.id;

    const shapeStyle: React.CSSProperties = {
      width: config.size,
      height: config.size,
      backgroundColor: config.color,
      borderRadius: config.shape === 'circle' ? '50%' :
                    config.shape === 'diamond' ? '0' : '2px',
      transform: config.shape === 'diamond' ? 'rotate(45deg)' : undefined,
      border: isSelected ? '2px solid #dc2626' : '2px solid transparent',
    };

    return (
      <div
        key={el.id}
        style={{
          position: 'absolute',
          left: `${el.x}%`,
          top: `${el.y}%`,
          transform: 'translate(-50%, -50%)',
          cursor: readOnly ? 'default' : isDraggingThis ? 'grabbing' : 'grab',
          zIndex: isDraggingThis ? 50 : isSelected ? 20 : 10,
          userSelect: 'none',
        }}
        onMouseDown={(e) => handleMouseDown(e, el.id)}
        onTouchStart={(e) => handleTouchStart(e, el.id)}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        <div style={shapeStyle} />
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: 2,
          fontSize: 9,
          whiteSpace: 'nowrap',
          color: '#374151',
          fontWeight: isSelected ? 600 : 400,
          backgroundColor: 'rgba(255,255,255,0.8)',
          padding: '0 2px',
          borderRadius: 2,
        }}>
          {el.label || config.label}
        </div>
        {/* Botón eliminar — solo visible si seleccionado y no readOnly */}
        {isSelected && !readOnly && (
          <button
            onClick={(e) => { e.stopPropagation(); removeElement(el.id); }}
            style={{
              position: 'absolute',
              top: -8,
              right: -8,
              width: 16,
              height: 16,
              borderRadius: '50%',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              fontSize: 10,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
            }}
          >
            ✕
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3">

      {/* TOOLBAR — elementos para agregar */}
      {!readOnly && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-xs font-semibold text-gray-500 self-center mr-1">
            Agregar:
          </span>
          {(Object.entries(ELEMENT_CONFIG) as [ElementType, typeof ELEMENT_CONFIG[ElementType]][]).map(([type, config]) => (
            <button
              key={type}
              onClick={() => addElement(type)}
              className="inline-flex items-center gap-1.5 px-2 py-1 bg-white border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-brand-red transition-colors"
            >
              <span style={{ color: config.color, fontSize: 14 }}>{config.icon}</span>
              {config.label}
            </button>
          ))}
          {value.length > 0 && (
            <button
              onClick={() => { onChange([]); setSelectedId(null); }}
              className="ml-auto inline-flex items-center gap-1 px-2 py-1 bg-red-50 border border-red-200 rounded-md text-xs text-red-600 hover:bg-red-100"
            >
              🗑️ Limpiar todo
            </button>
          )}
        </div>
      )}

      {/* CANVAS DEL LAY OUT */}
      <div className="relative">

        {/* Etiquetas de orientación */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-semibold text-gray-600">Norte</div>
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-semibold text-gray-600">Sur</div>
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-600">Oeste</div>
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-600">Este</div>

        {/* Área del mapa */}
        <div
          ref={canvasRef}
          className="relative border-2 border-gray-800 bg-white mx-8 my-6"
          style={{
            width: '100%',
            paddingBottom: '100%', // cuadrado perfecto
            cursor: readOnly ? 'default' : 'crosshair',
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={() => setSelectedId(null)}
        >
          {/* Grilla de fondo */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(156,163,175,0.2) 1px, transparent 1px),
                linear-gradient(90deg, rgba(156,163,175,0.2) 1px, transparent 1px)
              `,
              backgroundSize: '10% 10%',
            }}
          />

          {/* Cruz central de referencia */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-px h-full bg-gray-200 absolute left-1/2" />
            <div className="h-px w-full bg-gray-200 absolute top-1/2" />
          </div>

          {/* Elementos posicionados */}
          <div className="absolute inset-0">
            {value.map(renderElement)}
          </div>

          {/* Mensaje cuando está vacío */}
          {value.length === 0 && !readOnly && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-xs text-gray-400 text-center px-4">
                Usá los botones de arriba para agregar elementos al lay out
              </p>
            </div>
          )}
        </div>
      </div>

      {/* LEYENDA */}
      <div className="flex flex-wrap gap-3 p-2 text-xs text-gray-600">
        <span className="font-semibold">Referencias:</span>
        {(Object.entries(ELEMENT_CONFIG) as [ElementType, typeof ELEMENT_CONFIG[ElementType]][]).map(([type, config]) => (
          <span key={type} className="flex items-center gap-1">
            <span style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              backgroundColor: config.color,
              borderRadius: config.shape === 'circle' ? '50%' : 2,
              transform: config.shape === 'diamond' ? 'rotate(45deg)' : undefined,
            }} />
            {config.label}
          </span>
        ))}
      </div>

      {/* Instrucciones */}
      {!readOnly && (
        <p className="text-xs text-gray-400 text-center">
          Hacé clic en un elemento para seleccionarlo · Arrastralo para moverlo · ✕ para eliminarlo
        </p>
      )}
    </div>
  );
};
