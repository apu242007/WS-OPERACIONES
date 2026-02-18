
import React from 'react';
import { Button } from './ui/Button';

interface Props {
  onEnter: () => void;
}

export const LandingPage: React.FC<Props> = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-2">
           <div className="h-8 w-8 bg-brand-red rounded flex items-center justify-center text-white font-bold text-sm shadow-sm">WS</div>
           <span className="font-bold text-xl tracking-tight text-gray-900">OPERACIONES</span>
        </div>
        <Button onClick={onEnter} size="sm" variant="primary">
          Acceso Plataforma
        </Button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex items-center relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-bl from-gray-50 to-white -z-10 transform skew-x-12 translate-x-20"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-center w-full">
          
          {/* Text Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-brand-red text-xs font-semibold uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
              Nueva Versión 2.0
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
              Control Total de sus <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-brand-dark">
                Operaciones de Campo
              </span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
              La plataforma estándar para la digitalización de partes diarios, checklists y reportes operativos. Potenciado con tecnología moderna para maximizar la eficiencia en el pozo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button onClick={onEnter} size="lg" className="w-full sm:w-auto shadow-xl shadow-brand-red/20 hover:scale-105 transition-transform duration-200">
                Ingresar al Sistema
              </Button>
            </div>
            
            <div className="pt-8 flex items-center gap-6 border-t border-gray-100">
               <div>
                  <div className="text-2xl font-bold text-gray-900">15k+</div>
                  <div className="text-xs text-gray-500 uppercase font-semibold">Reportes/Mes</div>
               </div>
               <div className="h-8 w-px bg-gray-200"></div>
               <div>
                  <div className="text-2xl font-bold text-gray-900">99.9%</div>
                  <div className="text-xs text-gray-500 uppercase font-semibold">Uptime</div>
               </div>
            </div>
          </div>
          
          {/* Visual Representation */}
          <div className="relative hidden md:block group perspective-1000">
             <div className="relative bg-white border border-gray-200 rounded-xl shadow-2xl p-6 rotate-y-12 group-hover:rotate-0 transition-all duration-700 ease-out transform">
                {/* Header of Mock UI */}
                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-400">PDF</span>
                     </div>
                     <div className="space-y-1">
                        <div className="h-2 bg-gray-200 rounded w-24"></div>
                        <div className="h-2 bg-gray-100 rounded w-16"></div>
                     </div>
                   </div>
                   <div className="h-6 w-20 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-[10px] font-bold text-green-700 uppercase">Aprobado</span>
                   </div>
                </div>
                {/* Body of Mock UI */}
                <div className="space-y-4">
                   <div className="flex justify-between gap-4">
                      <div className="h-20 bg-gray-50 rounded border border-gray-100 flex-1 p-3 space-y-2">
                         <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                         <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                      </div>
                      <div className="h-20 bg-gray-50 rounded border border-gray-100 flex-1 p-3 space-y-2">
                         <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                         <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                      </div>
                   </div>
                   <div className="h-40 bg-gray-50 rounded border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 gap-2">
                      <svg className="w-8 h-8 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      <span className="text-xs font-medium">Registro de Actividad</span>
                   </div>
                   <div className="flex justify-end pt-2">
                      <div className="h-8 w-32 bg-brand-red rounded shadow-lg shadow-brand-red/30"></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="bg-gray-50 py-20 border-t border-gray-200">
         <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold text-gray-900 mb-4">Herramientas diseñadas para el campo</h2>
               <p className="text-gray-600 max-w-2xl mx-auto">
                 Cada funcionalidad ha sido pensada para reducir la carga administrativa de los Encargados de turnos y Jefes de Equipos.
               </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Feature 1 */}
               <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                 <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-2xl mb-6 text-brand-red">
                   📄
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-3">Partes Diarios</h3>
                 <p className="text-gray-600 leading-relaxed">
                   Carga intuitiva de tiempos, actividades y recursos. Cálculos automáticos de horas y validación de datos en tiempo real.
                 </p>
               </div>

               {/* Feature 3 (Now Feature 2) */}
               <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                 <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-6 text-blue-600">
                   📊
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-3">Reportes PDF</h3>
                 <p className="text-gray-600 leading-relaxed">
                   Motor de generación de documentos pixel-perfect. Exportación inmediata lista para imprimir o enviar por correo electrónico.
                 </p>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-gray-900">OPERACIONES WS</span>
              <span className="text-gray-400">|</span>
              <span className="text-sm text-gray-500">by Jorge Castro</span>
           </div>
           <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Todos los derechos reservados.
           </div>
        </div>
      </footer>
    </div>
  );
};
