
import React, { useRef, useState, useEffect } from 'react';
import { Button } from './Button';

interface Props {
  label: string;
  value?: string; // Base64 string
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  className?: string;
}

export const SignaturePad: React.FC<Props> = ({ label, value, onChange, disabled, className }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize canvas context settings when modal opens
  useEffect(() => {
    if (isModalOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Handle resizing logic
      const resizeCanvas = () => {
        const parent = canvas.parentElement;
        if (parent) {
           // Make canvas fit the modal width
           canvas.style.width = '100%';
           canvas.style.height = '100%';
           
           // Set actual internal dimensions based on CSS dimensions * pixel ratio
           const dpr = window.devicePixelRatio || 1;
           const rect = canvas.getBoundingClientRect();
           
           canvas.width = rect.width * dpr;
           canvas.height = rect.height * dpr;
           
           if (ctx) {
             ctx.scale(dpr, dpr);
             ctx.strokeStyle = '#000000';
             ctx.lineWidth = 2;
             ctx.lineCap = 'round';
           }
        }
      };

      // Initial resize
      resizeCanvas();
      
      // Listen for window resize
      window.addEventListener('resize', resizeCanvas);

      // --- Touch Event Handlers ---
      // We need native listeners to support 'passive: false' to prevent scrolling while signing
      const handleTouchStart = (e: TouchEvent) => {
        if (e.target === canvas) {
          e.preventDefault();
          const touch = e.touches[0];
          const rect = canvas.getBoundingClientRect();
          setIsDrawing(true);
          ctx?.beginPath();
          ctx?.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
        }
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (isDrawing && e.target === canvas) {
          e.preventDefault();
          const touch = e.touches[0];
          const rect = canvas.getBoundingClientRect();
          ctx?.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
          ctx?.stroke();
        }
      };

      const handleTouchEnd = (e: TouchEvent) => {
        if (e.target === canvas) {
          e.preventDefault();
          setIsDrawing(false);
        }
      };

      // Attach native listeners
      canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
      canvas.addEventListener('touchend', handleTouchEnd);

      return () => {
        window.removeEventListener('resize', resizeCanvas);
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isModalOpen, isDrawing]);

  const getCoordinates = (e: React.MouseEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDrawing(true);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoordinates(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onChange(dataUrl);
    setIsModalOpen(false);
  };

  const handleClearSignature = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('¿Está seguro de borrar la firma?')) {
      onChange(undefined);
    }
  };

  return (
    <div className="w-full">
       {/* Display Area */}
       <div 
         className={`relative group border-b border-black w-full mx-auto mb-2 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${className || 'h-24'} ${!value ? 'bg-gray-50 border-dashed border-gray-300' : ''}`}
         onClick={() => !disabled && setIsModalOpen(true)}
       >
         {value ? (
           <>
             <img src={value} alt="Firma" className="max-h-full max-w-full object-contain" />
             {!disabled && (
               <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity no-print">
                  <button 
                    onClick={handleClearSignature}
                    className="bg-white rounded-full p-1 shadow hover:text-red-600 border border-gray-200"
                    title="Borrar firma"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
               </div>
             )}
           </>
         ) : (
           <span className="text-gray-400 text-sm select-none">
             {disabled ? '(Sin firma)' : 'Tocar para firmar'}
           </span>
         )}
       </div>
       {label && <div className="text-sm font-semibold">{label}</div>}
       
       {/* Modal for Drawing */}
       {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
           <div className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">
             <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg shrink-0">
               <h3 className="font-bold text-gray-800">Firmar: {label || 'Documento'}</h3>
               <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path></svg>
               </button>
             </div>
             
             <div className="p-4 bg-gray-100 flex-1 flex justify-center overflow-hidden touch-none select-none min-h-[300px] relative">
                <canvas 
                  ref={canvasRef}
                  className="bg-white shadow-sm border border-gray-300 rounded touch-none cursor-crosshair w-full h-full block absolute inset-0"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
             </div>
             
             <div className="p-4 border-t border-gray-200 flex justify-between items-center bg-white rounded-b-lg shrink-0">
               <Button variant="ghost" onClick={clearCanvas}>
                 Limpiar
               </Button>
               <div className="flex gap-2">
                 <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                   Cancelar
                 </Button>
                 <Button variant="primary" onClick={handleSave}>
                   Guardar
                 </Button>
               </div>
             </div>
           </div>
         </div>
       )}
    </div>
  );
};

