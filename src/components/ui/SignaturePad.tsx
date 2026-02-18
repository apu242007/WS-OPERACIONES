import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from './Button';

interface Props {
  label: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  className?: string;
}

export const SignaturePad: React.FC<Props> = ({ label, value, onChange, disabled, className }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);

  const getCtx = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    return { canvas, ctx };
  };

  const initCanvas = useCallback(() => {
    const r = getCtx();
    if (!r) return;
    const { canvas, ctx } = r;
    const parent = canvas.parentElement;
    if (!parent) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();
    const w = rect.width - 32;
    const h = rect.height - 32;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;
    const timer = setTimeout(() => { initCanvas(); }, 50);
    return () => clearTimeout(timer);
  }, [isModalOpen, initCanvas]);

  useEffect(() => {
    if (!isModalOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const r = getCtx();
      if (!r) return;
      isDrawingRef.current = true;
      r.ctx.beginPath();
      r.ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
    };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!isDrawingRef.current) return;
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const r = getCtx();
      if (!r) return;
      r.ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
      r.ctx.stroke();
    };
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      isDrawingRef.current = false;
    };
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);
    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isModalOpen]);

  const startDrawing = (e: React.MouseEvent) => {
    const r = getCtx();
    if (!r) return;
    isDrawingRef.current = true;
    const rect = r.canvas.getBoundingClientRect();
    r.ctx.beginPath();
    r.ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawingRef.current) return;
    const r = getCtx();
    if (!r) return;
    const rect = r.canvas.getBoundingClientRect();
    r.ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    r.ctx.stroke();
  };

  const stopDrawing = () => { isDrawingRef.current = false; };

  const clearCanvas = () => {
    const r = getCtx();
    if (!r) return;
    r.ctx.clearRect(0, 0, r.canvas.width, r.canvas.height);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onChange(canvas.toDataURL('image/png'));
    setIsModalOpen(false);
  };

  const handleClearSignature = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Borrar la firma?')) onChange(undefined);
  };

  return (
    <div className="w-full">
      <div
        className={`relative group border-b border-black w-full mx-auto mb-2 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${className || 'h-24'} ${!value ? 'bg-gray-50 border-dashed border-gray-300' : ''}`}
        onClick={() => !disabled && setIsModalOpen(true)}
      >
        {value ? (
          <>
            <img src={value} alt="Firma" className="max-h-full max-w-full object-contain" />
            {!disabled && (
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity no-print">
                <button onClick={handleClearSignature} className="bg-white rounded-full p-1 shadow hover:text-red-600 border border-gray-200" title="Borrar firma">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <span className="text-gray-400 text-sm select-none">{disabled ? '(Sin firma)' : 'Tocar para firmar'}</span>
        )}
      </div>
      {label && <div className="text-sm font-semibold">{label}</div>}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg shrink-0">
              <h3 className="font-bold text-gray-800">Firmar: {label || 'Documento'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700" title="Cerrar">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="p-4 bg-gray-100 flex-1 touch-none select-none relative" style={{minHeight: '300px'}}>
              <canvas
                ref={canvasRef}
                className="bg-white shadow-sm border border-gray-300 rounded touch-none cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-between items-center bg-white rounded-b-lg shrink-0">
              <Button variant="ghost" onClick={clearCanvas}>Limpiar</Button>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button variant="primary" onClick={handleSave}>Guardar</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
