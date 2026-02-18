import React, { useState, useMemo } from 'react';

interface ReportEntry {
  id: string; type: string; category: string; equipment: string; date: string; user: string;
}
interface Props { state: any; }

const EQUIPOS = ['tacker01','tacker05','tacker06','tacker07','tacker08','tacker10','tacker11','mase01','mase02','mase03','mase04'];

const FORM_MAP = [
  { key: 'reports',                        label: 'Parte Diario',                   cat: 'Reportes Operativos', eq: (r:any) => r.metadata?.equipment||r.equipment||'', dt: (r:any) => r.metadata?.date||r.date||r.created_at||'' },
  { key: 'cableWorkReports',               label: 'Trab. Cable',                    cat: 'Reportes Operativos', eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'inertiaReports',                 label: 'Cálculo Inercia',                cat: 'Reportes Operativos', eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'maintenanceReports',             label: 'Mantenimiento',                  cat: 'Reportes Operativos', eq: (r:any) => r.metadata?.equipment||r.equipmentNumber||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'oilChangeReports',               label: 'Cambio Aceite y Filtros',        cat: 'Reportes Operativos', eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'outsourcedReports',              label: 'Control Tercerizados',           cat: 'Reportes Operativos', eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'swabbingReports',                label: 'Inf. Pistoneo',                  cat: 'Reportes Operativos', eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'qhseReports',                    label: 'Inf. Mensual QHSE',              cat: 'Reportes Operativos', eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'thicknessReports',               label: 'Medición Espesores',             cat: 'Reportes Operativos', eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'toolMovementReports',            label: 'Mov. Herramientas',              cat: 'Reportes Operativos', eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'torqueReports',                  label: 'Registro de Torque',             cat: 'Reportes Operativos', eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'towerPressureReports',           label: 'Reg. Presiones Torre',           cat: 'Reportes Operativos', eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'tubingMeasurementReports',       label: 'Planilla Medición Tubing',       cat: 'Reportes Operativos', eq: (r:any) => r.metadata?.equipment||r.equipmentNumber||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'wellFillingReports',             label: 'Planilla Llenado Pozo',          cat: 'Reportes Operativos', eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'indControlReports',              label: 'Planilla IND',                   cat: 'Reportes Operativos', eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'bopConnectionReports',           label: 'Conexión de BOP',                cat: 'Checklists',          eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'electricalChecklistReports',     label: 'Check-List Eléctrico',           cat: 'Checklists',          eq: (r:any) => r.metadata?.equipmentNumber||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'electricalToolChecklistReports', label: 'Check-List Herr. Eléctricas',    cat: 'Checklists',          eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'fbuChecklistReports',            label: 'Check List FBU',                 cat: 'Checklists',          eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'flareChecklistReports',          label: 'Check List Flare Móvil',         cat: 'Checklists',          eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'mechanicalChecklistReports',     label: 'Check-List Mecánico',            cat: 'Checklists',          eq: (r:any) => r.metadata?.equipmentNumber||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'preAssemblyChecklistReports',    label: 'Checklist Pre-Montaje',          cat: 'Checklists',          eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'pullingChecklistReports',        label: 'Check Pulling',                  cat: 'Checklists',          eq: (r:any) => r.metadata?.equipmentNumber||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'transportChecklistReports',      label: 'Check Transp.',                  cat: 'Checklists',          eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'vehicleInspectionReports',       label: 'Check Vehículos',                cat: 'Checklists',          eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'workoverChecklistReports',       label: 'Check Workover',                 cat: 'Checklists',          eq: (r:any) => r.metadata?.equipmentNumber||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'dailyInspectionCatIReports',     label: 'Insp. Visual Diaria (Cat I)',    cat: 'Inspecciones',        eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'droppedObjectsReports',          label: 'Check Caída Objetos',            cat: 'Inspecciones',        eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'facilityInspectionReports',      label: 'Insp. Instalaciones',            cat: 'Inspecciones',        eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'firstAidReports',               label: 'Insp. Botiquín',                 cat: 'Inspecciones',        eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'forkliftReports',               label: 'Inspección Montacargas',         cat: 'Inspecciones',        eq: (r:any) => r.metadata?.forklift||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'forkliftLiftingPlanReports',     label: 'Plan de Izaje',                  cat: 'Inspecciones',        eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'platformInspectionReports',      label: 'Insp. Plataforma Elevadora',     cat: 'Inspecciones',        eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'slingInspectionReports',         label: 'Insp. Eslingas',                 cat: 'Inspecciones',        eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'stilsonInspectionReports',       label: 'Insp. Stilson',                  cat: 'Inspecciones',        eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'stilsonControlReports',          label: 'Control Stilsons',               cat: 'Inspecciones',        eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'accumulatorTestReports',         label: 'Prueba de Acumulador',           cat: 'QHSE',                eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'bumpTestReports',               label: 'Bump Test Multigas',             cat: 'QHSE',                eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'circuitBreakerReports',          label: 'Prueba Disyuntores',             cat: 'QHSE',                eq: (r:any) => r.metadata?.equipmentNumber||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'emergencyDrillReports',          label: 'Simulacro de Emergencia',        cat: 'QHSE',                eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'foamReports',                   label: 'Sist. Espumigeno',               cat: 'QHSE',                eq: (r:any) => r.rows?.[0]?.equipment||'', dt: (r:any) => r.rows?.[0]?.date||r.created_at||'' },
  { key: 'foamTestReports',               label: 'Prueba Espumígeno',              cat: 'QHSE',                eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'ipcrReports',                   label: 'IPCR',                           cat: 'QHSE',                eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'mastAssemblyRolesReports',       label: 'Roles Montaje Mástil',           cat: 'QHSE',                eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'shiftChangeReports',             label: 'Reunion C. Turno',               cat: 'QHSE',                eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'customerPropertyCustodyReports', label: 'Custodia Propiedad Cliente',     cat: 'Admin',               eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'locationHandoverReports',        label: 'Recibo y Entrega Locación',      cat: 'Admin',               eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'managerialVisitReports',         label: 'Visita Gerencial',               cat: 'Admin',               eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'performanceEvaluationReports',   label: 'Evaluación de Desempeño',        cat: 'Admin',               eq: (r:any) => r.metadata?.equipment||'', dt: (r:any) => r.metadata?.date||r.created_at||'' },
  { key: 'wasteSigns',                    label: 'Cartel Residuos',                cat: 'Admin',               eq: (_:any) => '', dt: (r:any) => r.created_at||'' },
  { key: 'welcomeSigns',                  label: 'Cartel Bienvenidos',             cat: 'Admin',               eq: (_:any) => '', dt: (r:any) => r.created_at||'' },
];

const CAT_COLOR: Record<string,string> = {
  'Reportes Operativos':'bg-blue-100 text-blue-800','Checklists':'bg-green-100 text-green-800',
  'Inspecciones':'bg-purple-100 text-purple-800','QHSE':'bg-orange-100 text-orange-800','Admin':'bg-gray-100 text-gray-700',
};
const CAT_ICON: Record<string,string> = {
  'Reportes Operativos':'📋','Checklists':'✅','Inspecciones':'🔍','QHSE':'⚠️','Admin':'📊',
};
const PAGE_SIZE = 25;

export const AdminDashboard: React.FC<Props> = ({ state }) => {
  const [fEq,setFEq]=useState(''); const [fType,setFType]=useState(''); const [fCat,setFCat]=useState('');
  const [fFrom,setFFrom]=useState(''); const [fTo,setFTo]=useState(''); const [fUser,setFUser]=useState('');
  const [pg,setPg]=useState(1);

  const all = useMemo(()=>{
    const arr: ReportEntry[]=[];
    for(const f of FORM_MAP){
      for(const r of (state[f.key]||[])){
        arr.push({ id:r.id||Math.random().toString(), type:f.label, category:f.cat,
          equipment:(f.eq(r)||'').toLowerCase().trim(), date:f.dt(r)||'', user:r.user_email||r.userId||'' });
      }
    }
    return arr.sort((a,b)=>b.date.localeCompare(a.date));
  },[state]);

  const byType = useMemo(()=>{
    const m:Record<string,number>={};
    for(const e of all) m[e.type]=(m[e.type]||0)+1;
    return Object.entries(m).sort((a,b)=>b[1]-a[1]);
  },[all]);

  const byEq = useMemo(()=>{
    const m:Record<string,number>={};
    for(const e of all){ if(e.equipment) m[e.equipment]=(m[e.equipment]||0)+1; }
    return Object.entries(m).sort((a,b)=>b[1]-a[1]);
  },[all]);

  const filtered = useMemo(()=> all.filter(e=>{
    if(fEq && e.equipment!==fEq) return false;
    if(fType && e.type!==fType) return false;
    if(fCat && e.category!==fCat) return false;
    if(fFrom && e.date.slice(0,10)<fFrom) return false;
    if(fTo && e.date.slice(0,10)>fTo) return false;
    if(fUser && !e.user.toLowerCase().includes(fUser.toLowerCase())) return false;
    return true;
  }),[all,fEq,fType,fCat,fFrom,fTo,fUser]);

  const pages = Math.ceil(filtered.length/PAGE_SIZE);
  const rows = filtered.slice((pg-1)*PAGE_SIZE, pg*PAGE_SIZE);
  const reset = ()=>{ setFEq('');setFType('');setFCat('');setFFrom('');setFTo('');setFUser('');setPg(1); };

  return (
    <div className="p-4 space-y-5 max-w-7xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-black text-gray-800 uppercase">📊 Dashboard Administrador</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">{all.length} registros totales</span>
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {Object.entries(CAT_ICON).map(([cat,icon])=>{
          const count=all.filter(e=>e.category===cat).length;
          const active=fCat===cat;
          return <div key={cat} onClick={()=>{setFCat(active?'':cat);setPg(1);}}
            className={`p-3 rounded-xl border-2 cursor-pointer transition-all select-none ${active?'border-brand-red bg-red-50 shadow-md':'border-gray-200 bg-white hover:border-gray-300'}`}>
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-2xl font-black text-gray-800">{count}</div>
            <div className="text-[10px] font-bold text-gray-500 uppercase leading-tight mt-0.5">{cat}</div>
          </div>;
        })}
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="font-bold text-xs text-gray-500 mb-3 uppercase tracking-wider">Formularios más usados (top 10)</div>
        <div className="space-y-1.5">
          {byType.slice(0,10).map(([type,count])=>{
            const max=byType[0]?.[1]||1;
            return <div key={type} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-50 rounded px-1 py-0.5"
              onClick={()=>{setFType(fType===type?'':type);setPg(1);}}>
              <div className="w-44 truncate text-gray-600 font-medium">{type}</div>
              <div className="flex-1 bg-gray-100 rounded-full h-3.5 overflow-hidden">
                <div className={`h-full rounded-full ${fType===type?'bg-brand-red':'bg-red-300'}`} style={{width:`${(count/max)*100}%`}}/>
              </div>
              <div className="w-7 text-right font-bold text-gray-700">{count}</div>
            </div>;
          })}
        </div>
      </div>

      {/* Equipo pills */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="font-bold text-xs text-gray-500 mb-3 uppercase tracking-wider">Actividad por equipo</div>
        <div className="flex flex-wrap gap-2">
          {byEq.length===0 && <span className="text-xs text-gray-400">Sin datos</span>}
          {byEq.map(([eq,count])=>(
            <div key={eq} onClick={()=>{setFEq(fEq===eq?'':eq);setPg(1);}}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer border-2 select-none transition-all
                ${fEq===eq?'bg-brand-red text-white border-brand-red':'bg-gray-50 text-gray-700 border-gray-200 hover:border-brand-red hover:text-brand-red'}`}>
              {eq.toUpperCase()} <span className="opacity-60 font-normal">({count})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-bold text-xs text-gray-500 uppercase tracking-wider">Filtros</div>
          <button onClick={reset} className="text-xs text-red-500 hover:text-red-700 font-bold">✕ Limpiar todo</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <select value={fEq} onChange={e=>{setFEq(e.target.value);setPg(1);}} className="border border-gray-300 rounded-lg p-2 text-xs outline-none bg-white">
            <option value="">Todos los equipos</option>
            {EQUIPOS.map(e=><option key={e} value={e}>{e.toUpperCase()}</option>)}
          </select>
          <select value={fCat} onChange={e=>{setFCat(e.target.value);setPg(1);}} className="border border-gray-300 rounded-lg p-2 text-xs outline-none bg-white">
            <option value="">Todas las categorías</option>
            {Object.keys(CAT_ICON).map(c=><option key={c} value={c}>{c}</option>)}
          </select>
          <select value={fType} onChange={e=>{setFType(e.target.value);setPg(1);}} className="border border-gray-300 rounded-lg p-2 text-xs outline-none bg-white">
            <option value="">Todos los formularios</option>
            {FORM_MAP.map(f=><option key={f.key} value={f.label}>{f.label}</option>)}
          </select>
          <input type="date" value={fFrom} onChange={e=>{setFFrom(e.target.value);setPg(1);}} className="border border-gray-300 rounded-lg p-2 text-xs outline-none" title="Desde"/>
          <input type="date" value={fTo} onChange={e=>{setFTo(e.target.value);setPg(1);}} className="border border-gray-300 rounded-lg p-2 text-xs outline-none" title="Hasta"/>
          <input type="text" value={fUser} onChange={e=>{setFUser(e.target.value);setPg(1);}} placeholder="Buscar usuario..." className="border border-gray-300 rounded-lg p-2 text-xs outline-none"/>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
          <div className="font-bold text-sm text-gray-700">{filtered.length} registros encontrados</div>
          {pages>1 && <div className="flex items-center gap-1.5 text-xs">
            <button onClick={()=>setPg(1)} disabled={pg===1} className="px-2 py-1 rounded border border-gray-300 disabled:opacity-30">«</button>
            <button onClick={()=>setPg(p=>Math.max(1,p-1))} disabled={pg===1} className="px-2 py-1 rounded border border-gray-300 disabled:opacity-30">‹</button>
            <span className="text-gray-600 font-medium px-1">{pg} / {pages}</span>
            <button onClick={()=>setPg(p=>Math.min(pages,p+1))} disabled={pg===pages} className="px-2 py-1 rounded border border-gray-300 disabled:opacity-30">›</button>
            <button onClick={()=>setPg(pages)} disabled={pg===pages} className="px-2 py-1 rounded border border-gray-300 disabled:opacity-30">»</button>
          </div>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-3 font-bold text-gray-500 uppercase tracking-wider w-28">Fecha</th>
                <th className="text-left p-3 font-bold text-gray-500 uppercase tracking-wider">Formulario</th>
                <th className="text-left p-3 font-bold text-gray-500 uppercase tracking-wider">Categoría</th>
                <th className="text-left p-3 font-bold text-gray-500 uppercase tracking-wider w-28">Equipo</th>
                <th className="text-left p-3 font-bold text-gray-500 uppercase tracking-wider">Usuario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.length===0
                ? <tr><td colSpan={5} className="text-center p-10 text-gray-400">Sin registros con los filtros aplicados</td></tr>
                : rows.map((e,i)=>(
                  <tr key={e.id+i} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-mono text-gray-600">{e.date?e.date.slice(0,10):'-'}</td>
                    <td className="p-3 font-medium text-gray-800">{e.type}</td>
                    <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${CAT_COLOR[e.category]||'bg-gray-100 text-gray-600'}`}>{CAT_ICON[e.category]} {e.category}</span></td>
                    <td className="p-3 uppercase font-bold text-gray-700">{e.equipment||<span className="text-gray-300 font-normal">-</span>}</td>
                    <td className="p-3 text-gray-500 truncate max-w-[160px]">{e.user||<span className="text-gray-300">-</span>}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
