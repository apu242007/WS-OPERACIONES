
export interface SignatureData {
  data: string;
  timestamp: string;
  name?: string;
}

export enum ViewState {
  LANDING = 'LANDING',
  LIST = 'LIST',
  FORM_DAILY = 'FORM_DAILY',
  FORM_OUTSOURCED = 'FORM_OUTSOURCED',
  FORM_FOAM = 'FORM_FOAM',
  FORM_INERTIA = 'FORM_INERTIA',
  FORM_SHIFT_CHANGE = 'FORM_SHIFT_CHANGE',
  FORM_SLING_INSPECTION = 'FORM_SLING_INSPECTION',
  FORM_SWABBING = 'FORM_SWABBING',
  FORM_QHSE = 'FORM_QHSE',
  FORM_TRANSPORT_CHECKLIST = 'FORM_TRANSPORT_CHECKLIST',
  FORM_WORKOVER_CHECKLIST = 'FORM_WORKOVER_CHECKLIST',
  FORM_TOOL_MOVEMENT = 'FORM_TOOL_MOVEMENT',
  FORM_CABLE_WORK = 'FORM_CABLE_WORK',
  FORM_PULLING_CHECKLIST = 'FORM_PULLING_CHECKLIST',
  FORM_MAINTENANCE_REPORT = 'FORM_MAINTENANCE_REPORT',
  FORM_FBU_CHECKLIST = 'FORM_FBU_CHECKLIST',
  FORM_CIRCUIT_BREAKER = 'FORM_CIRCUIT_BREAKER',
  FORM_FACILITY_INSPECTION = 'FORM_FACILITY_INSPECTION',
  FORM_VEHICLE_INSPECTION = 'FORM_VEHICLE_INSPECTION',
  FORM_STILSON_INSPECTION = 'FORM_STILSON_INSPECTION',
  FORM_STILSON_CONTROL = 'FORM_STILSON_CONTROL',
  FORM_FIRST_AID = 'FORM_FIRST_AID',
  FORM_FOAM_TEST = 'FORM_FOAM_TEST',
  FORM_BUMP_TEST = 'FORM_BUMP_TEST',
  FORM_IND_CONTROL = 'FORM_IND_CONTROL',
  FORM_THICKNESS_MEASUREMENT = 'FORM_THICKNESS_MEASUREMENT',
  FORM_FORKLIFT_INSPECTION = 'FORM_FORKLIFT_INSPECTION',
  FORM_FORKLIFT_LIFTING_PLAN = 'FORM_FORKLIFT_LIFTING_PLAN',
  FORM_TORQUE_REGISTER = 'FORM_TORQUE_REGISTER',
  FORM_PLATFORM_INSPECTION = 'FORM_PLATFORM_INSPECTION',
  FORM_WELCOME_SIGN = 'FORM_WELCOME_SIGN',
  FORM_ELECTRICAL_CHECKLIST = 'FORM_ELECTRICAL_CHECKLIST',
  FORM_ELECTRICAL_TOOL_CHECKLIST = 'FORM_ELECTRICAL_TOOL_CHECKLIST',
  FORM_CUSTOMER_PROPERTY_CUSTODY = 'FORM_CUSTOMER_PROPERTY_CUSTODY',
  FORM_IPCR = 'FORM_IPCR',
  FORM_ACCUMULATOR_TEST = 'FORM_ACCUMULATOR_TEST',
  FORM_PERFORMANCE_EVALUATION = 'FORM_PERFORMANCE_EVALUATION',
  FORM_BOP_CONNECTION = 'FORM_BOP_CONNECTION',
  FORM_MANAGERIAL_VISIT = 'FORM_MANAGERIAL_VISIT',
  FORM_TOWER_PRESSURE = 'FORM_TOWER_PRESSURE',
  FORM_MAST_ASSEMBLY_ROLES = 'FORM_MAST_ASSEMBLY_ROLES',
  FORM_PRE_ASSEMBLY_CHECKLIST = 'FORM_PRE_ASSEMBLY_CHECKLIST',
  FORM_WASTE_SIGN = 'FORM_WASTE_SIGN',
  FORM_WELL_FILLING = 'FORM_WELL_FILLING',
  FORM_OIL_CHANGE = 'FORM_OIL_CHANGE',
  FORM_MECHANICAL_CHECKLIST = 'FORM_MECHANICAL_CHECKLIST',
  FORM_FLARE_CHECKLIST = 'FORM_FLARE_CHECKLIST',
  FORM_EMERGENCY_DRILL = 'FORM_EMERGENCY_DRILL',
  FORM_DAILY_INSPECTION_CAT_I = 'FORM_DAILY_INSPECTION_CAT_I',
  FORM_DROPPED_OBJECTS = 'FORM_DROPPED_OBJECTS',
  FORM_TUBING_MEASUREMENT = 'FORM_TUBING_MEASUREMENT',
  FORM_LOCATION_HANDOVER = 'FORM_LOCATION_HANDOVER'
}

// Common Types
export type ChecklistRowData = { id: string; value: 'si' | 'no' | null; observation: string };

// Daily Report
export interface TimeEntry { id: string; from: string; to: string; hours: string; timeClass: string; tariff: string; detail: string; }
export interface DailyMetadata { date: string; client: string; field: string; province: string; rigNumber: string; well: string; reportNumber: string; objective: string; companyInfo: string; }
export interface DailyReport { id: string; metadata: DailyMetadata; entries: TimeEntry[]; }

// Outsourced Report
export interface OutsourcedMetadata { date: string; sector: string; well: string; subContractor: string; jobDescription: string; objective: string; }
export interface OutsourcedReport { id: string; metadata: OutsourcedMetadata; rows: ChecklistRowData[]; signatures: Record<string, SignatureData>; }

// Foam System
export type FoamStatus = 'B' | 'R' | 'M' | 'N/C' | '';
export interface FoamSystemRow { id: string; equipment: string; date: string; well: string; pneumaticValve: string; fluidLevel: string; reliefValve: string; dischargeTime: string; observations: string; systemState: string; nextRevision: string; manometerStatus?: string; calibrationDate?: string; }
export interface FoamSystemReport { id: string; rows: FoamSystemRow[]; signature?: SignatureData; }

// Inertia
export interface InertiaMetadata { equipment: string; date: string; field: string; well: string; }
export interface InertiaData { towerHeight: number; blockHeight: number; linksHeight: number; toolStringLength: number; couplingHeight: number; workFloorHeight: number; inertia: number; }
export interface InertiaReport { id: string; metadata: InertiaMetadata; data: InertiaData; signature?: SignatureData; }

// Shift Change
export interface ShiftChangeMetadata { equipment: string; well: string; date: string; time: string; meetingType: string; coordinator: string; operation: string; topic: string; }
export interface OperationalAspects { htaWell: string; tbgWell: string; vbWell: string; tankLevel1: string; pmWell: string; tbgTower: string; vbScaffold: string; tankLevel2: string; pmScaffold: string; tbgScaffold: string; pumpFunc: string; tankLevel3: string; }
export interface ShiftChangeChecklist { [key: string]: boolean; }
export interface ShiftChangeReport { id: string; metadata: ShiftChangeMetadata; operational: OperationalAspects; checklist: ShiftChangeChecklist; observations: string; signatures: Record<string, SignatureData>; }

// Sling Inspection
export type SlingColor = 'Blanco' | 'Verde' | 'Azul' | 'Amarillo' | 'Rojo';
export type SlingCondition = 'B' | 'FS' | '';
export interface SlingInspectionRow { id: string; quantity: string; serviceDate: string; inspectionDate: string; lotNumber: string; certNumber: string; length: string; diameter: string; type: string; workingLoad: string; color: string; condition: string; location: string; observations: string; }
export interface SlingInspectionReport { id: string; rows: SlingInspectionRow[]; inspectorName: string; signature?: SignatureData; date: string; }

// Swabbing
export interface SwabbingMetadata { date: string; equipment: string; well: string; company: string; }
export interface SwabbingRow { id: string; timeFrom: string; timeTo: string; depth: string; fluidLevel: string; extractedLiters: string; accumulatedM3: string; waterCut: string; emulsion: string; sandMud: string; totalImpurities: string; chlorides: string; strokesPerHour: string; observations: string; }
export interface SwabbingReport { id: string; metadata: SwabbingMetadata; rows: SwabbingRow[]; signature?: SignatureData; }

// QHSE
export interface QHSEMetadata { reportDate: string; month: string; name: string; }
export interface QHSERow { id: number; item: number; description: string; meta: string; realized: string; detail1: string; detail2: string; detail3: string; }
export interface QHSEFooter { eqTck1: string; eqTck2: string; eqTck3: string; eqTck4: string; baseOperativa: string; }
export interface QHSEReport { id: string; metadata: QHSEMetadata; rows: QHSERow[]; footerStats: QHSEFooter; observations: string; pendingTasks: string; nextMonthCommitment: string; signature?: SignatureData; }

// Transport Checklist
export type TransportChecklistStatus = 'BIEN' | 'MAL' | null;
export interface TransportChecklistMetadata { date: string; equipment: string; well: string; }
export interface TransportChecklistRow { id: string; status: TransportChecklistStatus; observations: string; }
export interface TransportChecklistReport { id: string; metadata: TransportChecklistMetadata; rows: TransportChecklistRow[]; signature?: SignatureData; }

// Workover Checklist
export type WorkoverChecklistStatus = 'SI' | 'NO' | 'NA' | null;
export interface WorkoverChecklistMetadata { company: string; location: string; supervisor: string; operation: string; equipmentNumber: string; date: string; field: string; inspectedBy: string; }
export interface WorkoverChecklistRow { id: string; status: WorkoverChecklistStatus; }
export interface WorkoverObservation { id: string; observation: string; responsible: string; compliance: string; date: string; }
export interface WorkoverChecklistReport { id: string; metadata: WorkoverChecklistMetadata; rows: WorkoverChecklistRow[]; observations: WorkoverObservation[]; signature?: SignatureData; }

// Tool Movement
export interface ToolMovementMetadata { date: string; equipment: string; well: string; termFluid: string; }
export interface ToolMovementRow { id: string; tubingLength: string; steelVol: string; pumpVol: string; tankLevel: string; returnVol: string; observations: string; }
export interface ToolMovementReport { id: string; metadata: ToolMovementMetadata; rows: ToolMovementRow[]; signatures: Record<string, SignatureData>; }

// Cable Work
export interface CableWorkMetadata { company: string; well: string; equipment: string; frameType: string; drumDiameter: string; drumType: string; pulleyDiameter: string; blockWeight: string; bsMeasureWeight: string; cableBrand: string; cableMeasureLength: string; construction: string; grade: string; reelNumber: string; serviceStartDate: string; retirementDate: string; linesNumber: string; change: string; stringChangeDepth: string; }
export interface CableWorkRow { id: string; date: string; runNumber: string; runDepth: string; operation: string; mudDensity: string; effectiveWeight: string; collarDiameter: string; collarWeight: string; excessWeight: string; collarLength: string; factorC: string; factorM: string; tonKmOperation: string; tonKmAccumLastRun: string; runLength: string; tonKmAccumLastCut: string; cutLength: string; remainingCableLength: string; }
export interface CableWorkReport { id: string; metadata: CableWorkMetadata; rows: CableWorkRow[]; }

// Pulling Checklist
export type PullingChecklistStatus = 'BIEN' | 'MAL' | 'NC' | null;
export interface PullingChecklistMetadata { company: string; equipmentNumber: string; field: string; location: string; date: string; equipmentResponsible: string; inspectedBy: string; operation: string; }
export interface PullingChecklistRow { id: string; status: PullingChecklistStatus; }
export interface PullingChecklistReport { id: string; metadata: PullingChecklistMetadata; rows: PullingChecklistRow[]; signature?: SignatureData; }

// Maintenance
export interface MaintenanceMetadata { reportNumber: string; supervisorName: string; mechanicName: string; equipmentNumber: string; date: string; client: string; field: string; well: string; }
export interface MaintenanceItem { id: string; anomalyDescription: string; maintenancePerformed: string; affectsOperation: 'SI' | 'NO' | null; priority: 'Baja' | 'Media' | 'Alta' | null; date: string; startTime: string; endTime: string; }
export interface MaintenanceReport { id: string; metadata: MaintenanceMetadata; items: MaintenanceItem[]; signatures: Record<string, SignatureData>; }

// FBU Checklist
export type FBUChecklistStatus = 'BIEN' | 'MAL' | 'NC' | null;
export interface FBUChecklistMetadata { company: string; fbuNumber: string; field: string; location: string; date: string; teamLeader: string; inspectedBy: string; operation: string; clientInspector: string; }
export interface FBUChecklistRow { id: string; status: FBUChecklistStatus; }
export interface FBUObservation { id: string; observation: string; responsible: string; compliance: string; date: string; }
export interface FBUChecklistReport { id: string; metadata: FBUChecklistMetadata; rows: FBUChecklistRow[]; observations: FBUObservation[]; signatures: Record<string, SignatureData>; }

// Circuit Breaker
export interface CircuitBreakerMetadata { date: string; electricianName: string; supervisorName: string; equipmentNumber: string; client: string; field: string; well: string; instrumentBrand: string; instrumentModel: string; instrumentSerial: string; }
export interface CircuitBreakerRow { id: string; category: string; description: string; voltage: string; amperage: string; sensitivityNominal: string; sensitivityMeasured: string; responseTime: string; observations: string; status?: 'BIEN' | 'REG' | 'MAL' | null; }
export interface NetworkAnalyzerData { v_r: string; i_r: string; v_s: string; i_s: string; v_t: string; i_t: string; freq: string; }
export interface CircuitBreakerReport { id: string; metadata: CircuitBreakerMetadata; rows: CircuitBreakerRow[]; analyzer: NetworkAnalyzerData; generalObservations: string; signatures: Record<string, SignatureData>; }

// Facility Inspection
export type FacilityInspectionStatus = 'SI' | 'NO' | 'NA' | null;
export interface FacilityInspectionMetadata { base: string; date: string; }
export interface FacilityInspectionRow { id: string; category: string; item: string; status: FacilityInspectionStatus; observations: string; }
export interface FacilityInspectionReport { id: string; metadata: FacilityInspectionMetadata; rows: FacilityInspectionRow[]; signatures: Record<string, SignatureData>; }

// Vehicle Inspection
export type VehicleInspectionStatus = 'BIEN' | 'MAL' | 'N/C' | null;
export interface VehicleInspectionMetadata { date: string; vehicle: string; mileage: string; greenCard: string; plate: string; lastServiceKms: string; soExpiration: string; internalNumber: string; vtvExpiration: string; routeExpiration: string; }
export interface VehicleInspectionRow { id: string; item: string; status: VehicleInspectionStatus; observations: string; }
export interface VehicleInspectionReport { id: string; metadata: VehicleInspectionMetadata; rows: VehicleInspectionRow[]; signature?: SignatureData; }

// Stilson Inspection
export type StilsonStatus = 'C' | 'NC' | 'NA' | null;
export interface StilsonInspectionMetadata { date: string; brand: string; serial: string; inches: string; outOfService: boolean | null; }
export interface StilsonItem { id: string; description: string; w1: StilsonStatus; w2: StilsonStatus; w3: StilsonStatus; w4: StilsonStatus; }
export interface StilsonWeekData { inspectorName?: string; signature?: SignatureData; }
export interface StilsonInspectionReport { id: string; metadata: StilsonInspectionMetadata; items: StilsonItem[]; weeks: { w1: StilsonWeekData; w2: StilsonWeekData; w3: StilsonWeekData; w4: StilsonWeekData; }; observations: string; }

// Stilson Control
export interface StilsonControlMetadata { equipment: string; month: string; location: string; }
export interface StilsonControlRow { id: string; date: string; timeFrom: string; responsible: string; activity: string; talon: string; gavilan: string; gripPoint: string; nuts: string; timeTo: string; observations: string; signature?: SignatureData; }
export interface StilsonControlReport { id: string; metadata: StilsonControlMetadata; rows: StilsonControlRow[]; }

// First Aid
export interface FirstAidMetadata { equipmentBase: string; date: string; teamLeader: string; location: string; hseTech: string; clientRep: string; }
export interface FirstAidRow { id: string; quantity: string; unit: string; description: string; conditionB: boolean; conditionM: boolean; expiration: string; }
export interface FirstAidReport { id: string; metadata: FirstAidMetadata; rows: FirstAidRow[]; observations: string; signatures: Record<string, SignatureData>; }

// Foam Test
export interface FoamTestMetadata { date: string; time: string; equipment: string; well: string; hseSupervisor: string; fieldSupervisor: string; rigManager: string; shiftLeader: string; }
export interface FoamTestReport { id: string; metadata: FoamTestMetadata; activity: string; specsAndPerformance: string; conclusions: string; photoAnnex: string; images: string[]; signatures: Record<string, SignatureData>; }

// Bump Test
export interface BumpTestRow { id: string; date: string; brandModel: string; serialNumber: string; result: 'APROBADO' | 'FALLIDO' | null; responsible: string; }
export interface BumpTestReport { id: string; rows: BumpTestRow[]; }

// IND Control
export interface INDControlMetadata { date: string; equipment: string; }
export interface INDControlRow { id: string; itemNumber: number; element: string; description: string; validityMonths: number; identificationNumber: string; tag: string; inspectionDate: string; serviceDate: string; }
export interface INDControlReport { id: string; metadata: INDControlMetadata; rows: INDControlRow[]; }

// Thickness
export interface ThicknessMetadata { date: string; equipment: string; location: string; specificLocation: string; identification: string; responsible: string; instrumentCode: string; }
export interface ThicknessRow { id: string; pointLabel: string; measure0: string; measure90: string; measure180: string; measure270: string; isApt: boolean | null; }
export interface ThicknessReport { id: string; metadata: ThicknessMetadata; rows: ThicknessRow[]; observations: string; signatures: Record<string, SignatureData>; }

// Forklift Inspection
export type ForkliftStatus = 'N' | 'Co' | 'F' | 'V' | 'R' | 'L' | 'NC' | '';
export interface ForkliftMetadata { forklift: string; hourMeter: string; internalNumber: string; serialNumber: string; operator: string; date: string; licenseNumber: string; type: string; licenseExpiration: string; enablement: string; enablementExpiration: string; }
export interface ForkliftRow { id: string; category: string; item: string; status: ForkliftStatus; }
export interface ForkliftReport { id: string; metadata: ForkliftMetadata; rows: ForkliftRow[]; observations: string; signatures: Record<string, SignatureData>; }

// Forklift Lifting Plan
export interface LiftingPlanCheckItem { id: number; question: string; status: 'SI' | 'NO' | 'NA' | null; }
export interface ForkliftLiftingPlanReport { id: string; general: any; equipment: any; personnel: any; checklist: LiftingPlanCheckItem[]; sketch: string; signatures: { supervisor?: SignatureData; executor?: SignatureData }; }

// Torque
export interface TorqueMetadata { date: string; responsible1: string; equipment: string; responsible2: string; client: string; field: string; well: string; }
export interface TorqueRow { id: string; selection: 'ESPARRAGO' | 'BULON' | 'GRAMPA' | null; location: string; lubrication: 'SI' | 'NO' | null; recommendedTorque: string; appliedTorque: string; observations: string; }
export interface TorqueReport { id: string; metadata: TorqueMetadata; rows: TorqueRow[]; signatures: Record<string, SignatureData>; }

// Platform Inspection
export type PlatformStatus = 'N' | 'Co' | 'F' | 'V' | 'R' | 'L' | 'NC' | '';
export interface PlatformInspectionMetadata { date: string; brand: string; internalNumber: string; serialNumber: string; operator: string; loadCapacity: string; licenseNumber: string; type: string; expiration: string; location: string; certifyingEntity: string; }
export interface PlatformInspectionRow { id: string; category: string; item: string; status: PlatformStatus; }
export interface PlatformInspectionReport { id: string; metadata: PlatformInspectionMetadata; rows: PlatformInspectionRow[]; observations: string; signatures: Record<string, SignatureData>; }

// Welcome Sign
export interface WelcomeSignData { id: string; date: string; company: string; location: string; well: string; rigNumber: string; additionalText: string; }

// Electrical Checklist
export interface ElectricalChecklistMetadata { date: string; electricianName: string; supervisorName: string; equipmentNumber: string; client: string; field: string; well: string; }
export interface ElectricalChecklistRow { id: string; category: string; item: string; status: 'BIEN' | 'REG' | 'MAL' | null; }
export interface ElectricalChecklistReport { id: string; metadata: ElectricalChecklistMetadata; rows: ElectricalChecklistRow[]; analyzer: NetworkAnalyzerData; observations: string; signatures: Record<string, SignatureData>; }

// Electrical Tool Checklist
export interface ElectricalToolChecklistMetadata { toolName: string; area: string; inspectorName: string; inspectorJobTitle: string; inspectorDate: string; supervisorName: string; supervisorDate: string; }
export interface ElectricalToolChecklistRow { id: string; question: string; status: 'SI' | 'NO' | 'NA' | null; }
export interface ElectricalToolChecklistReport { id: string; metadata: ElectricalToolChecklistMetadata; rows: ElectricalToolChecklistRow[]; observations: string; signatures: Record<string, SignatureData>; }

// Customer Property
export interface CustomerPropertyCustodyMetadata { date: string; revision: string; }
export interface CustomerPropertyCustodyItem { id: string; itemNumber: number; entryDate: string; entryDocument: string; transportIn: string; receivingArea: string; client: string; clientContact: string; productCode: string; productDescription: string; serialNumber: string; receptionStatus: string; requiredTreatment: string; storageLocation: string; estimatedDeliveryDate: string; status: string; deliveryDescription: string; actualDeliveryDate: string; exitDocument: string; deliveryResponsible: string; transportOut: string; }
export interface CustomerPropertyCustodyReport { id: string; metadata: CustomerPropertyCustodyMetadata; items: CustomerPropertyCustodyItem[]; }

// IPCR
export interface IPCRMetadata { task: string; evaluatorTeam: string; ipcrNumber: string; subtask: string; location: string; res5197: string; artDate: string; creationDate: string; safetyResponsible: string; executionDate: string; revision: string; sheet: string; contractor: string; criticalTask: 'SI' | 'NO' | null; workPermit: 'SI' | 'NO' | null; otherIpcr: string; }
export interface IPCRRiskRow { id: string; activitySteps: string; subTask: string; hazards: string; lossCategory: string; legalRequirement: string | null; initialProb: string; initialSev: string; initialRisk: string; preventiveMeasures: string; checkPreventive: boolean; mitigationMeasures: string; checkMitigation: boolean; residualProb: string; residualSev: string; residualRisk: string; }
export interface IPCREPP { [key: string]: boolean; }
export interface IPCRSignatures { receiverName?: string; approverName?: string; shiName?: string; receiver?: SignatureData; approver?: SignatureData; shi?: SignatureData; }
export interface IPCRReport { id: string; metadata: IPCRMetadata; rows: IPCRRiskRow[]; epp: IPCREPP; signatures: IPCRSignatures; }

// Accumulator Test
export interface AccumulatorTestMetadata { date: string; client: string; field: string; well: string; rigNumber: string; mechanicName: string; shiftLeaderName: string; }
export interface AccumulatorPumpRow { id: string; type: string; startPressure: string; stopPressure: string; chargeTime: string; }
export interface AccumulatorBottleRow { id: string; bottleNumber: number; pressure: string; }
export interface AccumulatorTestReport { id: string; metadata: AccumulatorTestMetadata; pumps: AccumulatorPumpRow[]; bottles: AccumulatorBottleRow[]; reliefValvePressure: string; observations: string; signatures: Record<string, SignatureData>; }

// Performance Evaluation
export interface PerformanceEvaluationMetadata { date: string; evaluatedName: string; evaluatedPosition: string; evaluatedArea: string; evaluatorName: string; evaluatorPosition: string; evaluatorArea: string; }
export interface PerformanceEvaluationRow { id: string; category: string; question: string; score: number | null; }
export interface PerformanceEvaluationReport { id: string; metadata: PerformanceEvaluationMetadata; rows: PerformanceEvaluationRow[]; trainingNeeds: string; averageScore: string; signatures: Record<string, SignatureData>; }

// BOP Connection
export interface BOPConnectionMetadata { date: string; rigManagerName: string; rigNumber: string; shiftLeaderName: string; client: string; field: string; well: string; anularSerial: string; parcialSerial: string; }
export interface BOPItem { id: string; section: 'ANULAR' | 'PARCIAL' | 'TOTAL'; operation: 'OPEN' | 'CLOSE'; component: 'CONECTOR' | 'MANGUERA' | 'ESLINGA'; status: 'BUENO' | 'MALO' | null; }
export interface BOPConnectionReport { id: string; metadata: BOPConnectionMetadata; items: BOPItem[]; observations: string; signatures: Record<string, SignatureData>; }

// Managerial Visit
export interface ManagerialVisitMetadata { location: string; date: string; time: string; name: string; dni: string; position: string; workOrder: string; activityType: string; coordinator1: string; evaluatorPosition1: string; coordinator2: string; evaluatorPosition2: string; }
export interface ManagerialVisitItem { id: string; question: string; score: number | null; observation: string; }
export interface ManagerialVisitReport { id: string; metadata: ManagerialVisitMetadata; items: ManagerialVisitItem[]; conclusions: string; images: string[]; signatures: Record<string, SignatureData>; }

// Tower Pressure Report
export interface TowerPressureMetadata { date: string; equipment: string; }
export interface TowerPressureData { chassisLeveling: 'Correcto' | 'Incorrecto' | null; section1_initialPressure: string; section1_intermediatePressure: string; section1_finalPressure: string; section1_cylinderState: 'Correcto' | 'Incorrecto' | null; section1_pinsSafety: 'Correcto' | 'Incorrecto' | null; section2_pressure: string; section2_cylinderState: 'Correcto' | 'Incorrecto' | null; section2_mechanicalLocks: 'Correcto' | 'Incorrecto' | null; section2_pinsSafety: 'Correcto' | 'Incorrecto' | null; }
export interface TowerPressureReport { id: string; metadata: TowerPressureMetadata; data: TowerPressureData; observations: string; signature?: SignatureData; images?: string[]; }

// Mast Assembly Roles Report
export interface MastAssemblyRolesMetadata { date: string; equipment: string; location: string; }
export interface MastRoleRow { id: string; position: number; functionName: string; personName: string; signature?: SignatureData; }
export interface MastAssemblyRolesReport { 
  id: string; 
  metadata: MastAssemblyRolesMetadata; 
  roles: MastRoleRow[]; 
  section1Observations: string; 
  section2Observations: string; 
  signatures: { supervisor?: SignatureData; };
}

// Pre-Assembly Checklist Report
export interface PreAssemblyChecklistMetadata { date: string; well: string; equipment: string; }
export interface PreAssemblyChecklistItem { id: number; question: string; status: 'SI' | 'NO' | null; observation: string; }
export interface PreAssemblyChecklistReport { id: string; metadata: PreAssemblyChecklistMetadata; items: PreAssemblyChecklistItem[]; signatures: Record<string, SignatureData>; images?: string[]; }

// Waste Classification Sign
export type WasteType = 'AMARILLO' | 'AZUL' | 'ROJO' | 'VERDE';
export interface WasteSignData {
  id: string;
  date: string;
  company: string;
  location: string;
  type: WasteType;
  customItems?: string[];
}

// Well Filling Report (Planilla de Llenado de Pozo)
export interface WellFillingMetadata { date: string; well: string; equipment: string; }
export interface WellFillingTechData {
  tubPerf: { diameter: string; displacementDry: string; displacementWet: string };
  barra: { diameter: string; displacementDry: string; displacementWet: string };
  tubing: { diameter: string; displacementDry: string; displacementWet: string };
  portamecha: { diameter: string; innerDiameter: string; displacementDry: string; displacementWet: string };
}
export interface WellFillingRow {
  id: string;
  shotNumber: string;
  tankVolume: string;
  calcVol: string;
  calcTotal: string;
  measVol: string;
  measTotal: string;
  barrelTrend: string;
  observations: string;
}
export interface WellFillingReport {
  id: string;
  metadata: WellFillingMetadata;
  techData: WellFillingTechData;
  rows: WellFillingRow[];
  signatures: Record<string, SignatureData>;
}

// Oil Change Report
export interface OilChangeMetadata { 
  mechanic1: string; 
  mechanic2: string; 
  equipment: string; 
  date: string; 
  client: string; 
  field: string; 
  well: string; 
}
export interface OilChangeRow {
  id: string;
  item: string;
  status: 'SI' | 'NO' | null;
  partsOrLiters: string;
}
export interface OilChangeSection {
  id: string;
  title: string;
  items: OilChangeRow[];
  observations: string;
  hourMeter: string;
  maintenanceHours: string;
  customFields?: Record<string, string>; // For Usina #, etc
}
export interface OilChangeReport {
  id: string;
  metadata: OilChangeMetadata;
  sections: OilChangeSection[];
  signatures: Record<string, SignatureData>;
}

// Mechanical Checklist (Check-List Mecánico)
export interface MechanicalChecklistMetadata {
  mechanicName: string;
  supervisorName: string;
  equipmentNumber: string;
  date: string;
  client: string;
  field: string;
  well: string;
}
export interface MechanicalChecklistStoppedItem {
  id: string;
  section: string;
  name: string;
  level: string; // Nivel
  litersAdded: string; // Lts Agreg.
  hours: string; // Horas
}
export interface MechanicalChecklistRunningItem {
  id: string;
  section: string;
  name: string;
  value: string; // °C/PSI
  state: 'OK' | 'Bajo' | 'Alto' | null;
}
export interface MechanicalChecklistReport {
  id: string;
  metadata: MechanicalChecklistMetadata;
  stoppedItems: MechanicalChecklistStoppedItem[];
  runningItems: MechanicalChecklistRunningItem[];
  observations: string;
  signatures: Record<string, SignatureData>;
}

// Flare Checklist (Check List Flare Móvil)
export interface FlareChecklistMetadata {
  location: string;
  date: string;
  user: string;
  nextMaintenance: string;
}
export interface FlareChecklistRow {
  id: string;
  description: string;
  status: 'B' | 'M' | null;
  observations: string;
}
export interface FlareChecklistReport {
  id: string;
  metadata: FlareChecklistMetadata;
  rows: FlareChecklistRow[];
  observations: string;
  signatures: Record<string, SignatureData>;
}

// Emergency Drill (Simulacros de Emergencia)
export interface EmergencyDrillMetadata {
  date: string; equipment?: string;
  performedBy: string;
  location: string;
  type: string;
  businessUnit: 'MASE' | 'Workover' | 'Pulling' | 'Base Operativa' | 'Base Herramientas' | 'Fábrica' | '';
  participants: string;
  observers: string;
  startTime: string;
  endTime: string;
  site: string; // "Sitio" field at bottom
}
export interface EmergencyDrillData {
  objectives: string[]; // Selected options
  aspectsToReview: string[]; // Selected options
  scenarioDescription: string;
  resourcesUsed: string[]; // Selected options
  // Evaluation
  resourceAdequacy: 'Bien' | 'Regular' | 'Mal' | null;
  locationSuitability: 'Bien' | 'Regular' | 'Mal' | null; // "Ubicación del Simulacro" treated as status
  soundAlarm: 'Bien' | 'Regular' | 'Mal' | null;
  visualAlarm: 'Bien' | 'Regular' | 'Mal' | null;
  meetingPoints: 'Bien' | 'Regular' | 'Mal' | null;
  personnelDirectedCorrectly: boolean | null; // Yes/No
  phoneCommunication: 'Bien' | 'Regular' | 'Mal' | null;
  // Timings
  alarmTime: string;
  communicationTime: string;
  meetingTime: string;
  actionStartTime: string;
  // Results
  responseTimeStatus: 'Bien' | 'Regular' | 'Mal' | null;
  drillDevelopmentStatus: 'Bien' | 'Regular' | 'Mal' | null;
  observations: string;
  finalResult: 'Bien' | 'Regular' | 'Mal' | null;
  improvements: string;
}
export interface EmergencyDrillReport {
  id: string;
  metadata: EmergencyDrillMetadata;
  data: EmergencyDrillData;
  images: string[];
  signature?: SignatureData;
}

// Daily Inspection Visual Cat I
export interface DailyInspectionCatIMetadata {
  date: string;
  well: string;
  equipment: string;
}
export type DailyInspectionStatus = 'OK' | 'NA' | 'X' | null;
export interface DailyInspectionCatIRow {
  id: string;
  itemNumber: string;
  description: string;
  status: DailyInspectionStatus;
  comments: string;
  category: string; // 'I'
}
export interface DailyInspectionCatIAdditionalRow {
  id: string;
  description: string;
  checked: boolean;
  observation: string;
}
export interface DailyInspectionCatIReport {
  id: string;
  metadata: DailyInspectionCatIMetadata;
  rows: DailyInspectionCatIRow[];
  additionalRows: DailyInspectionCatIAdditionalRow[];
  images: string[];
  signatures: Record<string, SignatureData>;
}

// Dropped Objects Checklist
export interface DroppedObjectsMetadata {
  date: string;
  equipment: string;
  well: string;
}
export interface DroppedObjectsRow {
  id: string;
  description: string;
  status: 'SI' | 'NO' | null;
  observations: string;
}
export interface DroppedObjectsReport {
  id: string;
  metadata: DroppedObjectsMetadata;
  rows: DroppedObjectsRow[];
  signatures: Record<string, SignatureData>;
}

// Tubing Measurement Report
export interface TubingMeasurementReport {
  id: string;
  metadata: {
    grado: string;
    diametro: string;
    nPieza: string;
    equipo: string;
    fecha: string;
    pozo: string;
    observations: string;
    carreraZtoTopeFinal: string;
    htaCbNumero: string;
  };
  tubos: number[]; // array of 19 lengths
  poolHerramientas: { id: string; herramienta: string; metros: number }[];
  specs: any | null; // Selected spec row from TUBING_SPECS
  calculados: {
    totalMetros: number;
    cantidadTubos: number;
    pesoTotalKg: number;
    totalVolumeLts: number;
    totalPoolMetros: number;
  };
  signatures: {
    inspector: { name?: string; data?: string; timestamp?: string };
    supervisor: { name?: string; data?: string; timestamp?: string };
  };
  created_at?: string;
}

// Location Handover Report (Recibo y Entrega de Locación)
export type ElementType = 'bodega' | 'anclaje' | 'fosa_quema' | 'equipo' | 'pozo';

export interface LayoutElement {
  id: string;
  type: ElementType;
  x: number; // porcentaje 0-100
  y: number; // porcentaje 0-100
  label?: string;
}

export interface LocationHandoverMetadata {
  type: 'RECIBO' | 'ENTREGA';
  date: string;
  well: string;
  equipment: string;
  companyRepresentative: string;
  rigManager: string;
  serviceResponsible: string;
}
export interface LocationHandoverReport {
  id: string;
  metadata: LocationHandoverMetadata;
  schemeImage: string | null;
  layoutElements?: LayoutElement[];
  observations: string;
  photos: string[];
  signatures: Record<string, SignatureData>;
}

export interface AppState {
  currentView: ViewState;
  
  // Active Forms
  activeReport: DailyReport | null;
  activeOutsourcedReport: OutsourcedReport | null;
  activeFoamReport: FoamSystemReport | null;
  activeInertiaReport: InertiaReport | null;
  activeShiftChangeReport: ShiftChangeReport | null;
  activeSlingInspectionReport: SlingInspectionReport | null;
  activeSwabbingReport: SwabbingReport | null;
  activeQHSEReport: QHSEReport | null;
  activeTransportChecklistReport: TransportChecklistReport | null;
  activeWorkoverChecklistReport: WorkoverChecklistReport | null;
  activeToolMovementReport: ToolMovementReport | null;
  activeCableWorkReport: CableWorkReport | null;
  activePullingChecklistReport: PullingChecklistReport | null;
  activeMaintenanceReport: MaintenanceReport | null;
  activeFBUChecklistReport: FBUChecklistReport | null;
  activeCircuitBreakerReport: CircuitBreakerReport | null;
  activeFacilityInspectionReport: FacilityInspectionReport | null;
  activeVehicleInspectionReport: VehicleInspectionReport | null;
  activeStilsonInspectionReport: StilsonInspectionReport | null;
  activeStilsonControlReport: StilsonControlReport | null;
  activeFirstAidReport: FirstAidReport | null;
  activeFoamTestReport: FoamTestReport | null;
  activeBumpTestReport: BumpTestReport | null;
  activeINDControlReport: INDControlReport | null;
  activeThicknessReport: ThicknessReport | null;
  activeForkliftReport: ForkliftReport | null;
  activeForkliftLiftingPlanReport: ForkliftLiftingPlanReport | null;
  activeTorqueReport: TorqueReport | null;
  activePlatformInspectionReport: PlatformInspectionReport | null;
  activeWelcomeSign: WelcomeSignData | null;
  activeElectricalChecklistReport: ElectricalChecklistReport | null;
  activeElectricalToolChecklistReport: ElectricalToolChecklistReport | null;
  activeCustomerPropertyCustodyReport: CustomerPropertyCustodyReport | null;
  activeIPCRReport: IPCRReport | null;
  activeAccumulatorTestReport: AccumulatorTestReport | null;
  activePerformanceEvaluationReport: PerformanceEvaluationReport | null;
  activeBOPConnectionReport: BOPConnectionReport | null;
  activeManagerialVisitReport: ManagerialVisitReport | null;
  activeTowerPressureReport: TowerPressureReport | null;
  activeMastAssemblyRolesReport: MastAssemblyRolesReport | null;
  activePreAssemblyChecklistReport: PreAssemblyChecklistReport | null;
  activeWasteSign: WasteSignData | null;
  activeWellFillingReport: WellFillingReport | null;
  activeOilChangeReport: OilChangeReport | null;
  activeMechanicalChecklistReport: MechanicalChecklistReport | null;
  activeFlareChecklistReport: FlareChecklistReport | null;
  activeEmergencyDrillReport: EmergencyDrillReport | null;
  activeDailyInspectionCatIReport: DailyInspectionCatIReport | null;
  activeDroppedObjectsReport: DroppedObjectsReport | null;
  activeTubingMeasurementReport: TubingMeasurementReport | null;
  activeLocationHandoverReport: LocationHandoverReport | null;

  // Lists
  reports: DailyReport[];
  outsourcedReports: OutsourcedReport[];
  foamReports: FoamSystemReport[];
  inertiaReports: InertiaReport[];
  shiftChangeReports: ShiftChangeReport[];
  slingInspectionReports: SlingInspectionReport[];
  swabbingReports: SwabbingReport[];
  qhseReports: QHSEReport[];
  transportChecklistReports: TransportChecklistReport[];
  workoverChecklistReports: WorkoverChecklistReport[];
  toolMovementReports: ToolMovementReport[];
  cableWorkReports: CableWorkReport[];
  pullingChecklistReports: PullingChecklistReport[];
  maintenanceReports: MaintenanceReport[];
  fbuChecklistReports: FBUChecklistReport[];
  circuitBreakerReports: CircuitBreakerReport[];
  facilityInspectionReports: FacilityInspectionReport[];
  vehicleInspectionReports: VehicleInspectionReport[];
  stilsonInspectionReports: StilsonInspectionReport[];
  stilsonControlReports: StilsonControlReport[];
  firstAidReports: FirstAidReport[];
  foamTestReports: FoamTestReport[];
  bumpTestReports: BumpTestReport[];
  indControlReports: INDControlReport[];
  thicknessReports: ThicknessReport[];
  forkliftReports: ForkliftReport[];
  forkliftLiftingPlanReports: ForkliftLiftingPlanReport[];
  torqueReports: TorqueReport[];
  platformInspectionReports: PlatformInspectionReport[];
  welcomeSigns: WelcomeSignData[];
  electricalChecklistReports: ElectricalChecklistReport[];
  electricalToolChecklistReports: ElectricalToolChecklistReport[];
  customerPropertyCustodyReports: CustomerPropertyCustodyReport[];
  ipcrReports: IPCRReport[];
  accumulatorTestReports: AccumulatorTestReport[];
  performanceEvaluationReports: PerformanceEvaluationReport[];
  bopConnectionReports: BOPConnectionReport[];
  managerialVisitReports: ManagerialVisitReport[];
  towerPressureReports: TowerPressureReport[];
  mastAssemblyRolesReports: MastAssemblyRolesReport[];
  preAssemblyChecklistReports: PreAssemblyChecklistReport[];
  wasteSigns: WasteSignData[];
  wellFillingReports: WellFillingReport[];
  oilChangeReports: OilChangeReport[];
  mechanicalChecklistReports: MechanicalChecklistReport[];
  flareChecklistReports: FlareChecklistReport[];
  emergencyDrillReports: EmergencyDrillReport[];
  dailyInspectionCatIReports: DailyInspectionCatIReport[];
  droppedObjectsReports: DroppedObjectsReport[];
  tubingMeasurementReports: TubingMeasurementReport[];
  locationHandoverReports: LocationHandoverReport[];
}

export interface ATSRow { id: string; descripcion: string; peligros: string; riesgos: string; recomendaciones: string; }
export interface ATSMetadata { numero: string; revision: string; fecha: string; sector: string; tarea: string; elaboradoPor: string; funcionElab: string; revisadoPor: string; funcionRev: string; aprobadoPor: string; funcionApro: string; }
export interface ATSEpp { casco: boolean; guantesPVC: boolean; barbijos: boolean; otrosEpp1: string; bloqueoRotulado: boolean; zapatoSeguridad: boolean; arnesSeguridad: boolean; proteccionRespiratoria: boolean; otrosEpp2: string; anteojos: boolean; proteccionFacial: boolean; proteccionAuditiva: boolean; otrosEpp3: string; guantessCuero: boolean; detectorGases: boolean; caretaSoldador: boolean; guantesDielectricos: boolean; permisoTrabajo: boolean; extintores: string; }
export interface ATSReport { id: string; metadata: ATSMetadata; epp: ATSEpp; rows: ATSRow[]; }
