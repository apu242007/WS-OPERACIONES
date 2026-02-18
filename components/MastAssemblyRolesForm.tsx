
import React, { useState } from 'react';
import { MastAssemblyRolesReport, MastAssemblyRolesMetadata, MastRoleRow } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: MastAssemblyRolesReport;
  onSave: (report: MastAssemblyRolesReport) => void;
  onCancel: () => void;
}

const FIXED_ROLES = [
  { pos: 1, func: 'Jefe de Equipo' },
  { pos: 2, func: 'Encargado de Turno' },
  { pos: 3, func: 'Maquinista' },
  { pos: 4, func: 'Enganchador' },
  { pos: 5, func: 'Boca de Pozo' },
  { pos: 6, func: 'Boca de Pozo' },
  { pos: 7, func: 'Apoyo 1 (Opcional)' },
  { pos: 8, func: 'Apoyo 2 (Opcional)' },
];

export const MastAssemblyRolesForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<MastAssemblyRolesMetadata>(initialData?.metadata || {
    date: new Date().toISOString().split('T')[0],
    equipment: '',
    location: ''
  });

  const [roles, setRoles] = useState<MastRoleRow[]>(() => {
    if (initialData?.roles && initialData.roles.length > 0) return initialData.roles;
    return FIXED_ROLES.map(role => ({
      id: crypto.randomUUID(),
      position: role.pos,
      functionName: role.func,
      personName: ''
    }));
  });

  const [section1Observations, setSection1Observations] = useState(initialData?.section1Observations || '');
  const [section2Observations, setSection2Observations] = useState(initialData?.section2Observations || '');
  const [signatures, setSignatures] = useState(initialData?.signatures || {});

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (id: string, name: string) => {
    setRoles(prev => prev.map(r => r.id === id ? { ...r, personName: name } : r));
  };

  const handleRoleSignatureChange = (id: string, dataUrl: string | undefined) => {
    setRoles(prev => prev.map(r => 
        r.id === id 
        ? { ...r, signature: dataUrl ? { data: dataUrl, timestamp: new Date().toISOString() } : undefined } 
        : r
    ));
  };

  const handleSupervisorSignatureChange = (dataUrl: string | undefined) => {
    setSignatures(prev => ({
      ...prev,
      supervisor: dataUrl ? { data: dataUrl, timestamp: new Date().toISOString() } : undefined
    }));
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
          <h1 className="font-black text-lg sm:text-xl uppercase leading-tight">DISTRIBUCION DE ROLES Y FUNCIONES DEL PERSONAL EN EL MONTAJE DEL MASTIL</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>IT-WWO-003-A3-0</div>
          <div className="text-xs font-normal mt-1">Revisión 00</div>
        </div>
      </div>

      {/* Alert / Prerequisite */}
      <div className="bg-yellow-50 border-b border-black p-4 text-center">
         <p className="font-bold text-red-700 uppercase animate-pulse">⚠️ Previo a realizar el montaje, se tendrá que dar lectura al ATS Nº 04</p>
         <p className="text-sm mt-1">En cada montaje del mástil, se distribuirán Roles y funciones a cada personal del turno, respetando el Organigrama y Lay Out establecido.</p>
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-black text-sm bg-gray-50 print:bg-transparent">
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2 w-16">FECHA:</span>
               <input type="date" name="date" value={metadata.date} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2 w-16">EQUIPO:</span>
               <input name="equipment" value={metadata.equipment} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent uppercase" />
            </div>
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2 w-20">LOCACIÓN:</span>
               <input name="location" value={metadata.location} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent uppercase" />
            </div>
         </div>
      </div>

      {/* Roles Grid (Mobile) / Table (Desktop) */}
      <div className="p-4 border-b border-black">
         <h3 className="font-bold mb-3 uppercase border-b border-black w-full pb-1">Asignación de Personal</h3>
         
         {/* Desktop Table View */}
         <div className="hidden sm:block overflow-x-auto">
            <table className="w-full border-collapse border border-black text-sm">
               <thead>
                  <tr className="bg-gray-200 border-b border-black text-center font-bold">
                     <th className="border-r border-black p-2 w-16">Personal</th>
                     <th className="border-r border-black p-2 w-48">Función</th>
                     <th className="border-r border-black p-2">Nombre y Apellido</th>
                     <th className="p-2 w-48">Firma</th>
                  </tr>
               </thead>
               <tbody>
                  {roles.map((row) => (
                     <tr key={row.id} className="border-b border-black hover:bg-gray-50 h-12">
                        <td className="border-r border-black p-2 text-center font-bold">{row.position}</td>
                        <td className="border-r border-black p-2 font-medium">{row.functionName}</td>
                        <td className="border-r border-black p-0">
                           <input 
                              className="w-full h-full px-2 outline-none bg-transparent text-center"
                              placeholder="Ingrese nombre..."
                              value={row.personName}
                              onChange={(e) => handleRoleChange(row.id, e.target.value)}
                           />
                        </td>
                        <td className="p-0 align-middle">
                           <div className="flex justify-center items-center h-full p-1">
                              <SignaturePad 
                                 label=""
                                 className="h-10 border-0 w-full"
                                 value={row.signature?.data}
                                 onChange={(val) => handleRoleSignatureChange(row.id, val)}
                              />
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* Mobile Cards View */}
         <div className="sm:hidden grid grid-cols-1 gap-3">
             {roles.map((row) => (
               <div key={row.id} className="border border-gray-300 rounded p-3 bg-gray-50">
                   <div className="flex justify-between items-center mb-2 border-b border-gray-200 pb-1">
                      <div className="font-bold text-gray-700">{row.functionName}</div>
                      <div className="bg-gray-200 px-2 py-0.5 rounded text-xs font-bold text-gray-600">#{row.position}</div>
                   </div>
                   <div className="mb-2">
                      <label className="block text-xs font-bold text-gray-500 mb-1">NOMBRE:</label>
                      <input 
                          className="w-full border border-gray-300 rounded p-2 text-sm bg-white" 
                          placeholder="Ingrese nombre..."
                          value={row.personName}
                          onChange={(e) => handleRoleChange(row.id, e.target.value)}
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">FIRMA:</label>
                      <div className="h-16 bg-white border border-gray-300 rounded overflow-hidden">
                         <SignaturePad 
                            label=""
                            className="h-full border-0 w-full"
                            value={row.signature?.data}
                            onChange={(val) => handleRoleSignatureChange(row.id, val)}
                         />
                      </div>
                   </div>
               </div>
             ))}
         </div>
         
         <div className="mt-4 text-xs italic text-gray-600 bg-gray-50 p-2 border border-gray-200 rounded">
            <strong>Aclaración:</strong> Tanto el personal de Mantenimiento, como así también el Supervisor de Campo y el personal de CMASySO pueden estar de apoyo en el montaje.
         </div>
      </div>

      {/* Section 1: Montaje 1º Tramo */}
      <div className="p-4 border-b border-black page-break-inside-avoid">
         <div className="bg-black text-white p-1 px-4 font-bold text-sm mb-2 rounded-sm inline-block">MONTAJE DE MÁSTIL 1º TRAMO</div>
         <div className="bg-red-50 border-l-4 border-red-500 p-2 text-xs italic mb-2">
            <strong>Nota:</strong> Cualquier miembro del equipo tiene la autoridad para detener la maniobra ante cualquier anomalía detectada.
         </div>
         <div className="border border-gray-300 p-2 rounded bg-gray-50 min-h-[150px]">
            <div className="text-xs font-bold text-gray-500 uppercase mb-1">Novedades / Observaciones 1º Tramo:</div>
            <textarea 
               className="w-full h-32 bg-transparent outline-none resize-none text-sm"
               placeholder="Registre aquí cualquier observación..."
               value={section1Observations}
               onChange={(e) => setSection1Observations(e.target.value)}
            />
         </div>
      </div>

      {/* Section 2: Montaje 2º Tramo */}
      <div className="p-4 page-break-inside-avoid">
         <div className="bg-black text-white p-1 px-4 font-bold text-sm mb-2 rounded-sm inline-block">MONTAJE DE MÁSTIL 2º TRAMO</div>
         <div className="text-xs mb-3 text-justify leading-relaxed">
            Una vez realizado el montaje del 2º tramo se coloca la/las <strong>traba (perno) manual del 2º tramo</strong>, posteriormente se comienza a tensionar los vientos de carga, y los contravientos (en corona y piso de enganche).
         </div>
         <div className="bg-red-50 border-l-4 border-red-500 p-2 text-xs italic mb-2">
            <strong>Nota:</strong> Cualquier miembro del equipo tiene la autoridad para detener la maniobra ante cualquier anomalía detectada.
         </div>
         <div className="border border-gray-300 p-2 rounded bg-gray-50 min-h-[150px]">
            <div className="text-xs font-bold text-gray-500 uppercase mb-1">Novedades / Observaciones 2º Tramo:</div>
            <textarea 
               className="w-full h-32 bg-transparent outline-none resize-none text-sm"
               placeholder="Registre aquí cualquier observación..."
               value={section2Observations}
               onChange={(e) => setSection2Observations(e.target.value)}
            />
         </div>
      </div>

      {/* Final Signature */}
      <div className="p-8 border-t border-black flex justify-center page-break-inside-avoid">
         <div className="text-center w-full max-w-xs">
             <div className="border-b border-black border-dashed mb-1 h-24 flex items-end justify-center">
                <SignaturePad 
                   label=""
                   className="h-full border-0 w-full"
                   value={signatures.supervisor?.data}
                   onChange={handleSupervisorSignatureChange}
                />
             </div>
             <div className="font-bold text-sm">Firma y Aclaración</div>
             <div className="text-xs font-bold text-gray-500">SUPERVISOR / JEFE DE EQUIPO</div>
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
               filename={`roles_montaje_${metadata.date}`}
               orientation="p"
               className="w-full"
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata, 
              roles,
              section1Observations,
              section2Observations,
              signatures 
            })} className="w-full sm:w-auto order-first sm:order-last">
             Guardar Registro
           </Button>
        </div>

    </div>
  );
};
