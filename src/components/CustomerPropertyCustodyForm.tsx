
import React, { useState } from 'react';
import { CustomerPropertyCustodyReport, CustomerPropertyCustodyItem, CustomerPropertyCustodyMetadata } from '../types';
import { Button } from './ui/Button';
import { ExportPdfButton } from './ExportPdfButton';
import { CustomerPropertyCustodyPdf } from '../pdf/CustomerPropertyCustodyPdf';

interface Props {
  initialData?: CustomerPropertyCustodyReport;
  onSave: (report: CustomerPropertyCustodyReport) => void;
  onCancel: () => void;
}

const EmptyItem = (index: number): CustomerPropertyCustodyItem => ({
  id: crypto.randomUUID(),
  itemNumber: index + 1,
  entryDate: '',
  entryDocument: '',
  transportIn: '',
  receivingArea: '',
  client: '',
  clientContact: '',
  productCode: '',
  productDescription: '',
  serialNumber: '',
  receptionStatus: '',
  requiredTreatment: '',
  storageLocation: '',
  estimatedDeliveryDate: '',
  status: '',
  deliveryDescription: '',
  actualDeliveryDate: '',
  exitDocument: '',
  deliveryResponsible: '',
  transportOut: ''
});

export const CustomerPropertyCustodyForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<CustomerPropertyCustodyMetadata>(initialData?.metadata || {
    date: new Date().toISOString().split('T')[0],
    revision: '1'
  });

  const [items, setItems] = useState<CustomerPropertyCustodyItem[]>(() => {
    if (initialData?.items && initialData.items.length > 0) return initialData.items;
    return [
      EmptyItem(0),
      EmptyItem(1),
      EmptyItem(2)
    ];
  });

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (id: string, field: keyof CustomerPropertyCustodyItem, value: any) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addItem = () => {
    setItems(prev => [...prev, EmptyItem(prev.length)]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(prev => prev.filter(i => i.id !== id));
    }
  };

  return (
    <div id="print-area" className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none print:w-full font-sans text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:grid sm:grid-cols-12 border-b-2 border-black">
        <div className="col-span-3 p-4 border-b sm:border-b-0 sm:border-r-2 border-black flex flex-col items-center justify-center select-none">
             <div className="text-3xl font-black text-brand-red italic tracking-tighter">TACKER</div>
             <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-[-4px]">solutions</div>
        </div>
        <div className="col-span-6 p-4 flex flex-col items-center justify-center text-center border-b sm:border-b-0 sm:border-r-2 border-black bg-gray-50 sm:bg-white">
          <h1 className="font-black text-lg sm:text-xl uppercase leading-tight">CUSTODIA PROPIEDAD DEL CLIENTE</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col justify-center text-xs pl-4 border-black font-bold text-gray-600 bg-gray-50 sm:bg-white">
          <div className="mb-1 text-center border-b border-gray-300 pb-1">PGTAC011-A1-0</div>
          <div className="flex border-b border-gray-300 pb-1 mb-1">
             <span className="w-16 text-gray-500">Rev.</span>
             <span className="flex-1 text-center">{metadata.revision}</span>
          </div>
          <div className="flex items-center">
             <span className="w-16 text-gray-500">Fecha:</span>
             <input 
                type="date" 
                name="date"
                title="Fecha"
                value={metadata.date}
                onChange={handleMetadataChange}
                className="flex-1 text-center outline-none bg-transparent"
             />
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto w-full">
        <table className="w-full border-collapse border border-black min-w-[2000px] text-[10px]">
          <thead>
            <tr className="bg-gray-300 text-center font-bold border-b border-black h-8">
               <th className="border-r border-black p-0.5 w-8">Item</th>
               <th className="border-r border-black p-0.5 w-20">Fecha<br/>Ingreso</th>
               <th className="border-r border-black p-0.5 w-24">Documento<br/>ingreso</th>
               <th className="border-r border-black p-0.5 w-24">Transporte</th>
               <th className="border-r border-black p-0.5 w-24">Area que recibe</th>
               <th className="border-r border-black p-0.5 w-24">Cliente</th>
               <th className="border-r border-black p-0.5 w-24">Contacto<br/>Cliente</th>
               <th className="border-r border-black p-0.5 w-24">Código del<br/>producto</th>
               <th className="border-r border-black p-0.5 w-40">Descripción del producto<br/>recibido</th>
               <th className="border-r border-black p-0.5 w-24">serial</th>
               <th className="border-r border-black p-0.5 w-20">Estado<br/>(recepción)</th>
               <th className="border-r border-black p-0.5 w-24">Tratamiento<br/>requerido</th>
               <th className="border-r border-black p-0.5 w-24">Ubicación de<br/>Almacenaje</th>
               <th className="border-r border-black p-0.5 w-20">Fecha prevista<br/>de entrega</th>
               <th className="border-r border-black p-0.5 w-20">Estado</th>
               <th className="border-r border-black p-0.5 w-40">Descripción producto<br/>entregado</th>
               <th className="border-r border-black p-0.5 w-20">Fecha de<br/>entrega<br/>efectiva</th>
               <th className="border-r border-black p-0.5 w-24">Documento<br/>Egreso</th>
               <th className="border-r border-black p-0.5 w-24">Responsable<br/>de Entrega</th>
               <th className="border-r border-black p-0.5 w-24">Transporte</th>
               <th className="p-0.5 w-6 no-print"></th>
            </tr>
          </thead>
          <tbody>
             {items.map((row, index) => (
                <tr key={row.id} className="border-b border-black hover:bg-gray-50 h-8 text-center">
                   <td className="border-r border-black font-bold">{index + 1}</td>
                   <td className="border-r border-black p-0"><input type="date" title="Fecha Ingreso" className="w-full h-full p-0 text-center outline-none bg-transparent" value={row.entryDate} onChange={(e) => handleItemChange(row.id, 'entryDate', e.target.value)} /></td>
                   <td className="border-r border-black p-0"><input title="Documento Ingreso" className="w-full h-full p-0 text-center outline-none bg-transparent" value={row.entryDocument} onChange={(e) => handleItemChange(row.id, 'entryDocument', e.target.value)} /></td>
                   <td className="border-r border-black p-0"><input title="Transporte Entrada" className="w-full h-full p-0 text-center outline-none bg-transparent" value={row.transportIn} onChange={(e) => handleItemChange(row.id, 'transportIn', e.target.value)} /></td>
                   <td className="border-r border-black p-0"><input title="Área que Recibe" className="w-full h-full p-0 text-center outline-none bg-transparent" value={row.receivingArea} onChange={(e) => handleItemChange(row.id, 'receivingArea', e.target.value)} /></td>
                   <td className="border-r border-black p-0"><input title="Cliente" className="w-full h-full p-0 text-center outline-none bg-transparent" value={row.client} onChange={(e) => handleItemChange(row.id, 'client', e.target.value)} /></td>
                   <td className="border-r border-black p-0"><input title="Contacto Cliente" className="w-full h-full p-0 text-center outline-none bg-transparent" value={row.clientContact} onChange={(e) => handleItemChange(row.id, 'clientContact', e.target.value)} /></td>
                   <td className="border-r border-black p-0"><input title="Código Producto" className="w-full h-full p-0 text-center outline-none bg-transparent" value={row.productCode} onChange={(e) => handleItemChange(row.id, 'productCode', e.target.value)} /></td>
                   <td className="border-r border-black p-0"><input title="Descripción Producto" className="w-full h-full p-0 text-left pl-1 outline-none bg-transparent" value={row.productDescription} onChange={(e) => handleItemChange(row.id, 'productDescription', e.target.value)} /></td>
                   <td className="border-r border-black p-0"><input title="N° Serie" className="w-full h-full p-0 text-center outline-none bg-transparent" value={row.serialNumber} onChange={(e) => handleItemChange(row.id, 'serialNumber', e.target.value)} /></td>
                   <td className="border-r border-black p-0"><input title="Estado Recepción" className="w-full h-full p-0 text-center outline-none bg-transparent" value={row.receptionStatus} onChange={(e) => handleItemChange(row.id, 'receptionStatus', e.target.value)} /></td>
                   <td className="border-r border-black p-0"><input title="Tratamiento Requerido" className="w-full h-full p-0 text-center outline-none bg-transparent" value={row.requiredTreatment} onChange={(e) => handleItemChange(row.id, 'requiredTreatment', e.target.value)} /></td>
                   <td className="border-r border-black p-0"><input title="Ubicación Almacenaje" className="w-full h-full p-0 text-center outline-none bg-transparent" value={row.storageLocation} onChange={(e) => handleItemChange(row.id, 'storageLocation', e.target.value)} /></td>
                   <td className="border-r border-black p-0"><input type="date" title="Fecha Prevista Entrega" className="w-full h-full p-0 text-center outline-none bg-transparent" value={row.estimatedDeliveryDate} onChange={(e) => handleItemChange(row.id, 'estimatedDeliveryDate', e.target.value)} /></td>
                   <td className="border-r border-black p-0"><input title="Estado" className="w-full h-full p-0 text-center outline-none bg-transparent" value={row.status} onChange={(e) => handleItemChange(row.id, 'status', e.target.value)} /></td>
                   <td className="border-r border-black p-0"><input title="Descripción Producto Entregado" className="w-full h-full p-0 text-left pl-1 outline-none bg-transparent" value={row.deliveryDescription} onChange={(e) => handleItemChange(row.id, 'deliveryDescription', e.target.value)} /></td>
                   <td className="border-r border-black p-0"><input type="date" title="Fecha Entrega Efectiva" className="w-full h-full p-0 text-center outline-none bg-transparent" value={row.actualDeliveryDate} onChange={(e) => handleItemChange(row.id, 'actualDeliveryDate', e.target.value)} /></td>
                   <td className="border-r border-black p-0"><input title="Documento Egreso" className="w-full h-full p-0 text-center outline-none bg-transparent" value={row.exitDocument} onChange={(e) => handleItemChange(row.id, 'exitDocument', e.target.value)} /></td>
                   <td className="border-r border-black p-0"><input title="Responsable de Entrega" className="w-full h-full p-0 text-center outline-none bg-transparent" value={row.deliveryResponsible} onChange={(e) => handleItemChange(row.id, 'deliveryResponsible', e.target.value)} /></td>
                   <td className="border-r border-black p-0"><input title="Transporte Salida" className="w-full h-full p-0 text-center outline-none bg-transparent" value={row.transportOut} onChange={(e) => handleItemChange(row.id, 'transportOut', e.target.value)} /></td>
                   
                   <td className="p-0 text-center no-print">
                      <button onClick={() => removeItem(row.id)} className="text-gray-400 hover:text-red-500 font-bold">&times;</button>
                   </td>
                </tr>
             ))}
             <tr className="no-print">
                <td colSpan={21} className="p-1 text-center bg-gray-50 border border-black border-dashed">
                  <button onClick={addItem} className="text-brand-red font-bold text-xs uppercase hover:underline">
                    + Agregar Item
                  </button>
                </td>
             </tr>
          </tbody>
        </table>
        <p className="text-xs text-gray-400 mt-1 text-right">← Deslizá para ver más columnas →</p>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden p-4 space-y-4">
         {items.map((item, i) => (
           <div key={item.id} className="border border-gray-300 rounded-lg p-3 bg-gray-50 shadow-sm relative">
               <button 
                 onClick={() => removeItem(item.id)}
                 className="absolute top-2 right-2 text-red-500 font-bold p-1 no-print"
               >
                 ✕
               </button>
               <div className="font-bold text-sm mb-2 text-gray-800 border-b border-gray-200 pb-1">
                 ITEM #{i + 1}
               </div>

               <div className="space-y-3">
                 <div>
                   <label className="block text-[10px] font-bold text-gray-500 uppercase">Producto / Descripción</label>
                   <input 
                     title="Descripción Producto"
                     className="w-full border-b border-gray-400 bg-transparent py-1 text-sm font-medium"
                     value={item.productDescription}
                     onChange={(e) => handleItemChange(item.id, 'productDescription', e.target.value)}
                     placeholder="Descripción..."
                   />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-3">
                   <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase">Cantidad/Serial</label>
                      <input 
                        title="Cantidad/Serial"
                        className="w-full border-b border-gray-400 bg-transparent py-1 text-sm"
                        value={item.serialNumber}
                        onChange={(e) => handleItemChange(item.id, 'serialNumber', e.target.value)}
                      />
                   </div>
                   <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase">Estado Recep.</label>
                      <input 
                        title="Estado Recepción"
                        className="w-full border-b border-gray-400 bg-transparent py-1 text-sm"
                        value={item.receptionStatus}
                        onChange={(e) => handleItemChange(item.id, 'receptionStatus', e.target.value)}
                      />
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-3">
                    <div>
                       <label className="block text-[10px] font-bold text-gray-500 uppercase">Cliente</label>
                       <input 
                         title="Cliente"
                         className="w-full border-b border-gray-400 bg-transparent py-1 text-sm"
                         value={item.client}
                         onChange={(e) => handleItemChange(item.id, 'client', e.target.value)}
                       />
                    </div>
                    <div>
                       <label className="block text-[10px] font-bold text-gray-500 uppercase">Fecha Ingreso</label>
                       <input 
                         type="date"
                         title="Fecha Ingreso"
                         className="w-full border-b border-gray-400 bg-transparent py-1 text-sm"
                         value={item.entryDate}
                         onChange={(e) => handleItemChange(item.id, 'entryDate', e.target.value)}
                       />
                    </div>
                 </div>
               </div>
           </div>
         ))}
         <div className="no-print">
            <button onClick={addItem} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-bold uppercase text-xs hover:border-brand-red hover:text-brand-red transition-colors">
               + Agregar Item
            </button>
         </div>
      </div>

       {/* Actions */}
       <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-end p-4 sm:p-6 border-t border-gray-200 no-print bg-gray-50">
           <Button variant="secondary" onClick={onCancel} className="w-full sm:w-auto order-3 sm:order-1">
             Cancelar
           </Button>
           <Button variant="secondary" onClick={() => window.print()} className="w-full sm:w-auto order-2">
             🖨️ Imprimir
           </Button>
           <div className="w-full sm:w-auto order-1 sm:order-3">
             <ExportPdfButton 
               filename={`custodia_propiedad_${metadata.date}`}
               orientation="l"
               className="w-full"
               pdfComponent={<CustomerPropertyCustodyPdf report={{ id: initialData?.id ?? '', metadata, items }} />}
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata, 
              items
            })} className="w-full sm:w-auto order-first sm:order-last">
             Guardar Reporte
           </Button>
        </div>

    </div>
  );
};
