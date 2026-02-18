
import { 
  DailyReport, OutsourcedReport, FoamSystemReport, InertiaReport, 
  ShiftChangeReport, SlingInspectionReport, SwabbingReport, QHSEReport,
  TransportChecklistReport, WorkoverChecklistReport, ToolMovementReport,
  CableWorkReport, PullingChecklistReport, MaintenanceReport, FBUChecklistReport,
  CircuitBreakerReport, FacilityInspectionReport, VehicleInspectionReport,
  StilsonInspectionReport, StilsonControlReport, FirstAidReport, FoamTestReport,
  BumpTestReport, INDControlReport, ThicknessReport, ForkliftReport, ForkliftLiftingPlanReport,
  TorqueReport, PlatformInspectionReport, WelcomeSignData, ElectricalChecklistReport,
  ElectricalToolChecklistReport, CustomerPropertyCustodyReport, IPCRReport, AccumulatorTestReport,
  PerformanceEvaluationReport, BOPConnectionReport, ManagerialVisitReport, TowerPressureReport,
  MastAssemblyRolesReport, PreAssemblyChecklistReport, WasteSignData, WellFillingReport, OilChangeReport,
  MechanicalChecklistReport, FlareChecklistReport, EmergencyDrillReport, DailyInspectionCatIReport,
  DroppedObjectsReport, TubingMeasurementReport, LocationHandoverReport
} from '../types';

import { supabase } from './supabaseClient';

// Helper to create a generic service for a report type
function createService<T extends { id: string }>(tableName: string) {
  return {
    getAll: async (userId?: string, isAdmin: boolean = false): Promise<T[]> => {
      try {
        let query = supabase.from(tableName).select('*').order('created_at', { ascending: false });
        
        // Filter by user_id if not admin and userId is provided
        // Note: RLS policies in Supabase should strictly enforce this, but adding it here
        // reduces payload size and clarifies intent.
        if (!isAdmin && userId) {
          query = query.eq('user_id', userId);
        }

        const { data, error } = await query;
        
        if (error) {
          if (error.code === 'PGRST205' || error.message?.includes('does not exist')) {
             console.error(`CRITICAL: Table '${tableName}' does not exist. Please run migration.sql in Supabase SQL Editor.`);
          } else {
             console.error(`Error fetching ${tableName}:`, error);
          }
          // Fallback for demo/dev if table doesn't exist
          const local = localStorage.getItem(tableName);
          return local ? JSON.parse(local) : [];
        }
        
        // For local storage fallback
        if (!data) return [];
        return data as T[];
      } catch (e) {
        console.error(e);
        const local = localStorage.getItem(tableName);
        return local ? JSON.parse(local) : [];
      }
    },
    save: async (item: T): Promise<void> => {
      try {
        const { error } = await supabase.from(tableName).upsert(item);
        if (error) {
           console.error(`Error saving to ${tableName}:`, error);
           if (error.code === 'PGRST205' || error.message?.includes('does not exist')) {
              alert(`Error: La tabla '${tableName}' no existe en la base de datos. Por favor contacte al soporte.`);
           }
           // Fallback to local storage
           const local = localStorage.getItem(tableName);
           const items = local ? JSON.parse(local) : [];
           const index = items.findIndex((i: any) => i.id === item.id);
           if (index >= 0) items[index] = item;
           else items.push(item);
           localStorage.setItem(tableName, JSON.stringify(items));
        }
      } catch (e) {
         // Fallback
         const local = localStorage.getItem(tableName);
         const items = local ? JSON.parse(local) : [];
         const index = items.findIndex((i: any) => i.id === item.id);
         if (index >= 0) items[index] = item;
         else items.push(item);
         localStorage.setItem(tableName, JSON.stringify(items));
      }
    }
  };
}

export const checkConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('daily_reports').select('count', { count: 'exact', head: true });
    return !error;
  } catch {
    return false;
  }
};

// Identity map for tables
export const TABLE_MAP = {
  daily_reports: 'daily_reports',
  outsourced_reports: 'outsourced_reports',
  foam_reports: 'foam_reports',
  inertia_reports: 'inertia_reports',
  shift_change_reports: 'shift_change_reports',
  sling_reports: 'sling_reports',
  swabbing_reports: 'swabbing_reports',
  qhse_reports: 'qhse_reports',
  transport_checklist_reports: 'transport_checklist_reports',
  workover_checklist_reports: 'workover_checklist_reports',
  tool_movement_reports: 'tool_movement_reports',
  cable_work_reports: 'cable_work_reports',
  pulling_checklist_reports: 'pulling_checklist_reports',
  maintenance_reports: 'maintenance_reports',
  fbu_checklist_reports: 'fbu_checklist_reports',
  circuit_breaker_reports: 'circuit_breaker_reports',
  facility_inspection_reports: 'facility_inspection_reports',
  vehicle_inspection_reports: 'vehicle_inspection_reports',
  ipcr_reports: 'ipcr_reports',
  forklift_reports: 'forklift_reports',
  first_aid_reports: 'first_aid_reports',
  bump_test_reports: 'bump_test_reports',
  foam_test_reports: 'foam_test_reports',
  torque_reports: 'torque_reports',
  forklift_lifting_plan_reports: 'forklift_lifting_plan_reports',
  customer_custody_reports: 'customer_custody_reports',
  stilson_control_reports: 'stilson_control_reports',
  electrical_tool_checklist_reports: 'electrical_tool_checklist_reports',
  stilson_inspection_reports: 'stilson_inspection_reports',
  thickness_reports: 'thickness_reports',
  electrical_checklist_reports: 'electrical_checklist_reports',
  platform_inspection_reports: 'platform_inspection_reports',
  ind_control_reports: 'ind_control_reports',
  managerial_visit_reports: 'managerial_visit_reports',
  bop_connection_reports: 'bop_connection_reports',
  tower_pressure_reports: 'tower_pressure_reports',
  mechanical_checklists: 'mechanical_checklists',
  waste_signs: 'waste_signs',
  welcome_signs: 'welcome_signs',
  performance_evaluation_reports: 'performance_evaluation_reports',
  oil_change_reports: 'oil_change_reports',
  mast_assembly_roles_reports: 'mast_assembly_roles_reports',
  flare_checklists: 'flare_checklists',
  well_filling_reports: 'well_filling_reports',
  pre_assembly_checklist_reports: 'pre_assembly_checklist_reports',
  accumulator_test_reports: 'accumulator_test_reports',
  emergency_drills: 'emergency_drills',
  daily_inspections_cat_i: 'daily_inspections_cat_i',
  dropped_objects_reports: 'dropped_objects_reports',
  tubing_measurement_reports: 'tubing_measurement_reports',
  location_handover_reports: 'location_handover_reports'
};

export const dailyReportService = createService<DailyReport>(TABLE_MAP.daily_reports);
export const outsourcedService = createService<OutsourcedReport>(TABLE_MAP.outsourced_reports);
export const foamService = createService<FoamSystemReport>(TABLE_MAP.foam_reports);
export const inertiaService = createService<InertiaReport>(TABLE_MAP.inertia_reports);
export const shiftChangeService = createService<ShiftChangeReport>(TABLE_MAP.shift_change_reports);
export const slingService = createService<SlingInspectionReport>(TABLE_MAP.sling_reports);
export const swabbingService = createService<SwabbingReport>(TABLE_MAP.swabbing_reports);
export const qhseService = createService<QHSEReport>(TABLE_MAP.qhse_reports);
export const transportService = createService<TransportChecklistReport>(TABLE_MAP.transport_checklist_reports);
export const workoverService = createService<WorkoverChecklistReport>(TABLE_MAP.workover_checklist_reports);
export const toolMovementService = createService<ToolMovementReport>(TABLE_MAP.tool_movement_reports);
export const cableWorkService = createService<CableWorkReport>(TABLE_MAP.cable_work_reports);
export const pullingService = createService<PullingChecklistReport>(TABLE_MAP.pulling_checklist_reports);
export const maintenanceService = createService<MaintenanceReport>(TABLE_MAP.maintenance_reports);
export const fbuService = createService<FBUChecklistReport>(TABLE_MAP.fbu_checklist_reports);
export const circuitBreakerService = createService<CircuitBreakerReport>(TABLE_MAP.circuit_breaker_reports);
export const facilityService = createService<FacilityInspectionReport>(TABLE_MAP.facility_inspection_reports);
export const vehicleInspectionService = createService<VehicleInspectionReport>(TABLE_MAP.vehicle_inspection_reports);
export const stilsonService = createService<StilsonInspectionReport>(TABLE_MAP.stilson_inspection_reports);
export const stilsonControlService = createService<StilsonControlReport>(TABLE_MAP.stilson_control_reports);
export const firstAidService = createService<FirstAidReport>(TABLE_MAP.first_aid_reports);
export const foamTestService = createService<FoamTestReport>(TABLE_MAP.foam_test_reports);
export const bumpTestService = createService<BumpTestReport>(TABLE_MAP.bump_test_reports);
export const indControlService = createService<INDControlReport>(TABLE_MAP.ind_control_reports);
export const thicknessService = createService<ThicknessReport>(TABLE_MAP.thickness_reports);
export const forkliftService = createService<ForkliftReport>(TABLE_MAP.forklift_reports);
export const forkliftLiftingPlanService = createService<ForkliftLiftingPlanReport>(TABLE_MAP.forklift_lifting_plan_reports);
export const torqueRegisterService = createService<TorqueReport>(TABLE_MAP.torque_reports);
export const platformInspectionService = createService<PlatformInspectionReport>(TABLE_MAP.platform_inspection_reports);
export const welcomeSignService = createService<WelcomeSignData>(TABLE_MAP.welcome_signs);
export const electricalChecklistService = createService<ElectricalChecklistReport>(TABLE_MAP.electrical_checklist_reports);
export const electricalToolChecklistService = createService<ElectricalToolChecklistReport>(TABLE_MAP.electrical_tool_checklist_reports);
export const customerCustodyService = createService<CustomerPropertyCustodyReport>(TABLE_MAP.customer_custody_reports);
export const ipcrService = createService<IPCRReport>(TABLE_MAP.ipcr_reports);
export const accumulatorTestService = createService<AccumulatorTestReport>(TABLE_MAP.accumulator_test_reports);
export const performanceEvaluationService = createService<PerformanceEvaluationReport>(TABLE_MAP.performance_evaluation_reports);
export const bopConnectionService = createService<BOPConnectionReport>(TABLE_MAP.bop_connection_reports);
export const managerialVisitService = createService<ManagerialVisitReport>(TABLE_MAP.managerial_visit_reports);
export const towerPressureService = createService<TowerPressureReport>(TABLE_MAP.tower_pressure_reports);
export const mastAssemblyRolesService = createService<MastAssemblyRolesReport>(TABLE_MAP.mast_assembly_roles_reports);
export const preAssemblyChecklistService = createService<PreAssemblyChecklistReport>(TABLE_MAP.pre_assembly_checklist_reports);
export const wasteSignService = createService<WasteSignData>(TABLE_MAP.waste_signs);
export const wellFillingService = createService<WellFillingReport>(TABLE_MAP.well_filling_reports);
export const oilChangeService = createService<OilChangeReport>(TABLE_MAP.oil_change_reports);
export const mechanicalChecklistService = createService<MechanicalChecklistReport>(TABLE_MAP.mechanical_checklists);
export const flareChecklistService = createService<FlareChecklistReport>(TABLE_MAP.flare_checklists);
export const emergencyDrillService = createService<EmergencyDrillReport>(TABLE_MAP.emergency_drills);
export const dailyInspectionCatIService = createService<DailyInspectionCatIReport>(TABLE_MAP.daily_inspections_cat_i);
export const droppedObjectsService = createService<DroppedObjectsReport>(TABLE_MAP.dropped_objects_reports);
export const tubingMeasurementService = createService<TubingMeasurementReport>(TABLE_MAP.tubing_measurement_reports);
export const locationHandoverService = createService<LocationHandoverReport>(TABLE_MAP.location_handover_reports);
