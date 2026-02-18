
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { 
  AppState, ViewState, DailyReport, OutsourcedReport, FoamSystemReport, InertiaReport, 
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
} from './types';
import { checkConnection } from './services/api';
import { DailyOperationsForm } from './components/DailyOperationsForm';
import { OutsourcedOperationsForm } from './components/OutsourcedOperationsForm';
import { FoamSystemForm } from './components/FoamSystemForm';
import { InertiaCalcForm } from './components/InertiaCalcForm';
import { ShiftChangeForm } from './components/ShiftChangeForm';
import { SlingInspectionForm } from './components/SlingInspectionForm';
import { SwabbingReportForm } from './components/SwabbingReportForm';
import { QHSEReportForm } from './components/QHSEReportForm';
import { TransportChecklistForm } from './components/TransportChecklistForm';
import { WorkoverChecklistForm } from './components/WorkoverChecklistForm';
import { ToolMovementForm } from './components/ToolMovementForm';
import { CableWorkReportForm } from './components/CableWorkReportForm';
import { PullingChecklistForm } from './components/PullingChecklistForm';
import { MaintenanceReportForm } from './components/MaintenanceReportForm';
import { FBUChecklistForm } from './components/FBUChecklistForm';
import { CircuitBreakerForm } from './components/CircuitBreakerForm';
import { FacilityInspectionForm } from './components/FacilityInspectionForm';
import { VehicleInspectionForm } from './components/VehicleInspectionForm';
import { StilsonInspectionForm } from './components/StilsonInspectionForm';
import { StilsonControlForm } from './components/StilsonControlForm';
import { FirstAidInspectionForm } from './components/FirstAidInspectionForm';
import { FoamTestForm } from './components/FoamTestForm';
import { BumpTestForm } from './components/BumpTestForm';
import { INDControlForm } from './components/INDControlForm';
import { ThicknessMeasurementForm } from './components/ThicknessMeasurementForm';
import { ForkliftInspectionForm } from './components/ForkliftInspectionForm';
import { ForkliftLiftingPlanForm } from './components/ForkliftLiftingPlanForm';
import { TorqueRegisterForm } from './components/TorqueRegisterForm';
import { PlatformInspectionForm } from './components/PlatformInspectionForm';
import { WelcomeSignForm } from './components/WelcomeSignForm';
import { ElectricalChecklistForm } from './components/ElectricalChecklistForm';
import { ElectricalToolChecklistForm } from './components/ElectricalToolChecklistForm';
import { CustomerPropertyCustodyForm } from './components/CustomerPropertyCustodyForm';
import { IPCRForm } from './components/IPCRForm';
import { AccumulatorTestForm } from './components/AccumulatorTestForm';
import { PerformanceEvaluationForm } from './components/PerformanceEvaluationForm';
import { BOPConnectionForm } from './components/BOPConnectionForm';
import { ManagerialVisitForm } from './components/ManagerialVisitForm';
import { TowerPressureForm } from './components/TowerPressureForm';
import { MastAssemblyRolesForm } from './components/MastAssemblyRolesForm';
import { PreAssemblyChecklistForm } from './components/PreAssemblyChecklistForm';
import { WasteClassificationSignForm } from './components/WasteClassificationSignForm';
import { WellFillingForm } from './components/WellFillingForm';
import { OilChangeForm } from './components/OilChangeForm';
import { MechanicalChecklistForm } from './components/MechanicalChecklistForm';
import { FlareChecklistForm } from './components/FlareChecklistForm';
import { EmergencyDrillForm } from './components/EmergencyDrillForm';
import { DailyInspectionCatIForm } from './components/DailyInspectionCatIForm';
import { DroppedObjectsForm } from './components/DroppedObjectsForm';
import { TubingMeasurementForm } from './components/TubingMeasurementForm';
import { ATSForm } from './components/ATSForm';
import { LocationHandoverForm } from './components/LocationHandoverForm';
import { InspectionFrequencyForm } from './components/InspectionFrequencyForm';
import { AdminDashboard } from './components/AdminDashboard';

import { 
  dailyReportService, outsourcedService, foamService, inertiaService, shiftChangeService, 
  slingService, swabbingService, qhseService, transportService, workoverService, 
  toolMovementService, cableWorkService, pullingService, maintenanceService, fbuService, 
  circuitBreakerService, facilityService, vehicleInspectionService, stilsonService, 
  stilsonControlService, firstAidService, foamTestService, bumpTestService, indControlService, 
  thicknessService, forkliftService, forkliftLiftingPlanService, torqueRegisterService, 
  platformInspectionService, welcomeSignService, electricalChecklistService, electricalToolChecklistService,
  customerCustodyService, ipcrService, accumulatorTestService, performanceEvaluationService, bopConnectionService,
  managerialVisitService, towerPressureService, mastAssemblyRolesService, preAssemblyChecklistService, wasteSignService,
  wellFillingService, oilChangeService, mechanicalChecklistService, flareChecklistService, emergencyDrillService, dailyInspectionCatIService,
  droppedObjectsService, tubingMeasurementService, locationHandoverService
} from './services/api';

const AppContent = () => {
  const { user, isAdmin, role, loading, signOut } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'error' | 'checking'>('checking');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [state, setState] = useState<AppState>({
    currentView: ViewState.LIST,
    // Active Forms
    activeReport: null,
    activeOutsourcedReport: null,
    activeFoamReport: null,
    activeInertiaReport: null,
    activeShiftChangeReport: null,
    activeSlingInspectionReport: null,
    activeSwabbingReport: null,
    activeQHSEReport: null,
    activeTransportChecklistReport: null,
    activeWorkoverChecklistReport: null,
    activeToolMovementReport: null,
    activeCableWorkReport: null,
    activePullingChecklistReport: null,
    activeMaintenanceReport: null,
    activeFBUChecklistReport: null,
    activeCircuitBreakerReport: null,
    activeFacilityInspectionReport: null,
    activeVehicleInspectionReport: null,
    activeStilsonInspectionReport: null,
    activeStilsonControlReport: null,
    activeFirstAidReport: null,
    activeFoamTestReport: null,
    activeBumpTestReport: null,
    activeINDControlReport: null,
    activeThicknessReport: null,
    activeForkliftReport: null,
    activeForkliftLiftingPlanReport: null,
    activeTorqueReport: null,
    activePlatformInspectionReport: null,
    activeWelcomeSign: null,
    activeElectricalChecklistReport: null,
    activeElectricalToolChecklistReport: null,
    activeCustomerPropertyCustodyReport: null,
    activeIPCRReport: null,
    activeAccumulatorTestReport: null,
    activePerformanceEvaluationReport: null,
    activeBOPConnectionReport: null,
    activeManagerialVisitReport: null,
    activeTowerPressureReport: null,
    activeMastAssemblyRolesReport: null,
    activePreAssemblyChecklistReport: null,
    activeWasteSign: null,
    activeWellFillingReport: null,
    activeOilChangeReport: null,
    activeMechanicalChecklistReport: null,
    activeFlareChecklistReport: null,
    activeEmergencyDrillReport: null,
    activeDailyInspectionCatIReport: null,
    activeDroppedObjectsReport: null,
    activeTubingMeasurementReport: null,
    activeLocationHandoverReport: null,

    // Lists
    reports: [],
    outsourcedReports: [],
    foamReports: [],
    inertiaReports: [],
    shiftChangeReports: [],
    slingInspectionReports: [],
    swabbingReports: [],
    qhseReports: [],
    transportChecklistReports: [],
    workoverChecklistReports: [],
    toolMovementReports: [],
    cableWorkReports: [],
    pullingChecklistReports: [],
    maintenanceReports: [],
    fbuChecklistReports: [],
    circuitBreakerReports: [],
    facilityInspectionReports: [],
    vehicleInspectionReports: [],
    stilsonInspectionReports: [],
    stilsonControlReports: [],
    firstAidReports: [],
    foamTestReports: [],
    bumpTestReports: [],
    indControlReports: [],
    thicknessReports: [],
    forkliftReports: [],
    forkliftLiftingPlanReports: [],
    torqueReports: [],
    platformInspectionReports: [],
    welcomeSigns: [],
    electricalChecklistReports: [],
    electricalToolChecklistReports: [],
    customerPropertyCustodyReports: [],
    ipcrReports: [],
    accumulatorTestReports: [],
    performanceEvaluationReports: [],
    bopConnectionReports: [],
    managerialVisitReports: [],
    towerPressureReports: [],
    mastAssemblyRolesReports: [],
    preAssemblyChecklistReports: [],
    wasteSigns: [],
    wellFillingReports: [],
    oilChangeReports: [],
    mechanicalChecklistReports: [],
    flareChecklistReports: [],
    emergencyDrillReports: [],
    dailyInspectionCatIReports: [],
    droppedObjectsReports: [],
    tubingMeasurementReports: [],
    locationHandoverReports: []
  });

  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    checkConnection().then(connected => {
      setConnectionStatus(connected ? 'connected' : 'error');
    });
  }, []);

  // Load all data
  useEffect(() => {
    if (state.currentView === ViewState.LIST && user) {
       const loadData = async () => {
          try {
            const userId = user.id;
            const results = await Promise.allSettled([
              dailyReportService.getAll(userId, isAdmin),           // 0
              outsourcedService.getAll(userId, isAdmin),            // 1
              fbuService.getAll(userId, isAdmin),                   // 2
              facilityService.getAll(userId, isAdmin),              // 3
              circuitBreakerService.getAll(userId, isAdmin),        // 4
              foamService.getAll(userId, isAdmin),                  // 5
              inertiaService.getAll(userId, isAdmin),               // 6
              shiftChangeService.getAll(userId, isAdmin),           // 7
              slingService.getAll(userId, isAdmin),                 // 8
              swabbingService.getAll(userId, isAdmin),              // 9
              qhseService.getAll(userId, isAdmin),                  // 10
              transportService.getAll(userId, isAdmin),             // 11
              workoverService.getAll(userId, isAdmin),              // 12
              toolMovementService.getAll(userId, isAdmin),          // 13
              cableWorkService.getAll(userId, isAdmin),             // 14
              pullingService.getAll(userId, isAdmin),               // 15
              maintenanceService.getAll(userId, isAdmin),           // 16
              vehicleInspectionService.getAll(userId, isAdmin),     // 17
              stilsonService.getAll(userId, isAdmin),               // 18
              stilsonControlService.getAll(userId, isAdmin),        // 19
              firstAidService.getAll(userId, isAdmin),              // 20
              foamTestService.getAll(userId, isAdmin),              // 21
              bumpTestService.getAll(userId, isAdmin),              // 22
              indControlService.getAll(userId, isAdmin),            // 23
              thicknessService.getAll(userId, isAdmin),             // 24
              forkliftService.getAll(userId, isAdmin),              // 25
              forkliftLiftingPlanService.getAll(userId, isAdmin),   // 26
              torqueRegisterService.getAll(userId, isAdmin),        // 27
              platformInspectionService.getAll(userId, isAdmin),    // 28
              electricalChecklistService.getAll(userId, isAdmin),   // 29
              electricalToolChecklistService.getAll(userId, isAdmin), // 30
              customerCustodyService.getAll(userId, isAdmin),       // 31
              ipcrService.getAll(userId, isAdmin),                  // 32
              accumulatorTestService.getAll(userId, isAdmin),       // 33
              performanceEvaluationService.getAll(userId, isAdmin), // 34
              bopConnectionService.getAll(userId, isAdmin),         // 35
              managerialVisitService.getAll(userId, isAdmin),       // 36
              towerPressureService.getAll(userId, isAdmin),         // 37
              mastAssemblyRolesService.getAll(userId, isAdmin),     // 38
              preAssemblyChecklistService.getAll(userId, isAdmin),  // 39
              welcomeSignService.getAll(userId, isAdmin),           // 40
              wasteSignService.getAll(userId, isAdmin),             // 41
              wellFillingService.getAll(userId, isAdmin),           // 42
              oilChangeService.getAll(userId, isAdmin),             // 43
              mechanicalChecklistService.getAll(userId, isAdmin),   // 44
              flareChecklistService.getAll(userId, isAdmin),        // 45
              emergencyDrillService.getAll(userId, isAdmin),        // 46
              dailyInspectionCatIService.getAll(userId, isAdmin),   // 47
              droppedObjectsService.getAll(userId, isAdmin),        // 48
              tubingMeasurementService.getAll(userId, isAdmin),     // 49
              locationHandoverService.getAll(userId, isAdmin),      // 50
            ]);

            const getVal = <T,>(result: PromiseSettledResult<T[]>): T[] => {
                if (result.status === 'fulfilled') return result.value;
                console.error("Failed to load table:", result.reason);
                return [];
            };

            setState(prev => ({
                ...prev,
                reports: getVal(results[0]),
                outsourcedReports: getVal(results[1]),
                fbuChecklistReports: getVal(results[2]),
                facilityInspectionReports: getVal(results[3]),
                circuitBreakerReports: getVal(results[4]),
                foamReports: getVal(results[5]),
                inertiaReports: getVal(results[6]),
                shiftChangeReports: getVal(results[7]),
                slingInspectionReports: getVal(results[8]),
                swabbingReports: getVal(results[9]),
                qhseReports: getVal(results[10]),
                transportChecklistReports: getVal(results[11]),
                workoverChecklistReports: getVal(results[12]),
                toolMovementReports: getVal(results[13]),
                cableWorkReports: getVal(results[14]),
                pullingChecklistReports: getVal(results[15]),
                maintenanceReports: getVal(results[16]),
                vehicleInspectionReports: getVal(results[17]),
                stilsonInspectionReports: getVal(results[18]),
                stilsonControlReports: getVal(results[19]),
                firstAidReports: getVal(results[20]),
                foamTestReports: getVal(results[21]),
                bumpTestReports: getVal(results[22]),
                indControlReports: getVal(results[23]),
                thicknessReports: getVal(results[24]),
                forkliftReports: getVal(results[25]),
                forkliftLiftingPlanReports: getVal(results[26]),
                torqueReports: getVal(results[27]),
                platformInspectionReports: getVal(results[28]),
                electricalChecklistReports: getVal(results[29]),
                electricalToolChecklistReports: getVal(results[30]),
                customerPropertyCustodyReports: getVal(results[31]),
                ipcrReports: getVal(results[32]),
                accumulatorTestReports: getVal(results[33]),
                performanceEvaluationReports: getVal(results[34]),
                bopConnectionReports: getVal(results[35]),
                managerialVisitReports: getVal(results[36]),
                towerPressureReports: getVal(results[37]),
                mastAssemblyRolesReports: getVal(results[38]),
                preAssemblyChecklistReports: getVal(results[39]),
                welcomeSigns: getVal(results[40]),
                wasteSigns: getVal(results[41]),
                wellFillingReports: getVal(results[42]),
                oilChangeReports: getVal(results[43]),
                mechanicalChecklistReports: getVal(results[44]),
                flareChecklistReports: getVal(results[45]),
                emergencyDrillReports: getVal(results[46]),
                dailyInspectionCatIReports: getVal(results[47]),
                droppedObjectsReports: getVal(results[48]),
                tubingMeasurementReports: getVal(results[49]),
                locationHandoverReports: getVal(results[50]),
            }));
          } catch (e) {
             console.error("Critical Error loading data", e);
          }
       };
       loadData();
    }
  }, [state.currentView, user, isAdmin]);

  const goToList = () => {
    setState(s => ({ ...s, currentView: ViewState.LIST }));
    closeSidebar();
  };

  // Helper to save and go back
  const handleSave = async (service: any, data: any) => {
    try {
      // Inject user_id into data
      const dataWithUser = {
        ...data,
        user_id: user?.id
      };
      await service.save(dataWithUser);
      alert('Guardado exitosamente');
      goToList();
    } catch (e) {
      console.error(e);
      alert('Error al guardar');
    }
  };

  // --- New form handlers ---
  const handleStartNewWelcomeSign = () => { setState(s => ({ ...s, currentView: ViewState.FORM_WELCOME_SIGN, activeWelcomeSign: null })); closeSidebar(); };
  const handleStartNewWasteSign = () => { setState(s => ({ ...s, currentView: ViewState.FORM_WASTE_SIGN, activeWasteSign: null })); closeSidebar(); };
  const handleStartNewBumpTest = () => { setState(s => ({ ...s, currentView: ViewState.FORM_BUMP_TEST, activeBumpTestReport: null })); closeSidebar(); };
  const handleStartNewInertia = () => { setState(s => ({ ...s, currentView: ViewState.FORM_INERTIA, activeInertiaReport: null })); closeSidebar(); };
  const handleStartNewFBUChecklist = () => { setState(s => ({ ...s, currentView: ViewState.FORM_FBU_CHECKLIST, activeFBUChecklistReport: null })); closeSidebar(); };
  const handleStartNewPullingChecklist = () => { setState(s => ({ ...s, currentView: ViewState.FORM_PULLING_CHECKLIST, activePullingChecklistReport: null })); closeSidebar(); };
  const handleStartNewTransportChecklist = () => { setState(s => ({ ...s, currentView: ViewState.FORM_TRANSPORT_CHECKLIST, activeTransportChecklistReport: null })); closeSidebar(); };
  const handleStartNewVehicleInspection = () => { setState(s => ({ ...s, currentView: ViewState.FORM_VEHICLE_INSPECTION, activeVehicleInspectionReport: null })); closeSidebar(); };
  const handleStartNewWorkoverChecklist = () => { setState(s => ({ ...s, currentView: ViewState.FORM_WORKOVER_CHECKLIST, activeWorkoverChecklistReport: null })); closeSidebar(); };
  const handleStartNewElectrical = () => { setState(s => ({ ...s, currentView: ViewState.FORM_ELECTRICAL_CHECKLIST, activeElectricalChecklistReport: null })); closeSidebar(); };
  const handleStartNewElectricalTool = () => { setState(s => ({ ...s, currentView: ViewState.FORM_ELECTRICAL_TOOL_CHECKLIST, activeElectricalToolChecklistReport: null })); closeSidebar(); };
  const handleStartNewStilsonControl = () => { setState(s => ({ ...s, currentView: ViewState.FORM_STILSON_CONTROL, activeStilsonControlReport: null })); closeSidebar(); };
  const handleStartNewOutsourced = () => { setState(s => ({ ...s, currentView: ViewState.FORM_OUTSOURCED, activeOutsourcedReport: null })); closeSidebar(); };
  const handleStartNewCustomerPropertyCustody = () => { setState(s => ({ ...s, currentView: ViewState.FORM_CUSTOMER_PROPERTY_CUSTODY, activeCustomerPropertyCustodyReport: null })); closeSidebar(); };
  const handleStartNewIPCR = () => { setState(s => ({ ...s, currentView: ViewState.FORM_IPCR, activeIPCRReport: null })); closeSidebar(); };
  const handleStartNewAccumulatorTest = () => { setState(s => ({ ...s, currentView: ViewState.FORM_ACCUMULATOR_TEST, activeAccumulatorTestReport: null })); closeSidebar(); };
  const handleStartNewPerformanceEvaluation = () => { setState(s => ({ ...s, currentView: ViewState.FORM_PERFORMANCE_EVALUATION, activePerformanceEvaluationReport: null })); closeSidebar(); };
  const handleStartNewBOPConnection = () => { setState(s => ({ ...s, currentView: ViewState.FORM_BOP_CONNECTION, activeBOPConnectionReport: null })); closeSidebar(); };
  const handleStartNewManagerialVisit = () => { setState(s => ({ ...s, currentView: ViewState.FORM_MANAGERIAL_VISIT, activeManagerialVisitReport: null })); closeSidebar(); };
  const handleStartNewTowerPressure = () => { setState(s => ({ ...s, currentView: ViewState.FORM_TOWER_PRESSURE, activeTowerPressureReport: null })); closeSidebar(); };
  const handleStartNewMastAssemblyRoles = () => { setState(s => ({ ...s, currentView: ViewState.FORM_MAST_ASSEMBLY_ROLES, activeMastAssemblyRolesReport: null })); closeSidebar(); };
  const handleStartNewPreAssemblyChecklist = () => { setState(s => ({ ...s, currentView: ViewState.FORM_PRE_ASSEMBLY_CHECKLIST, activePreAssemblyChecklistReport: null })); closeSidebar(); };
  const handleStartNewWellFilling = () => { setState(s => ({ ...s, currentView: ViewState.FORM_WELL_FILLING, activeWellFillingReport: null })); closeSidebar(); };
  const handleStartNewOilChange = () => { setState(s => ({ ...s, currentView: ViewState.FORM_OIL_CHANGE, activeOilChangeReport: null })); closeSidebar(); };
  const handleStartNewMechanicalChecklist = () => { setState(s => ({ ...s, currentView: ViewState.FORM_MECHANICAL_CHECKLIST, activeMechanicalChecklistReport: null })); closeSidebar(); };
  const handleStartNewFlareChecklist = () => { setState(s => ({ ...s, currentView: ViewState.FORM_FLARE_CHECKLIST, activeFlareChecklistReport: null })); closeSidebar(); };
  const handleStartNewEmergencyDrill = () => { setState(s => ({ ...s, currentView: ViewState.FORM_EMERGENCY_DRILL, activeEmergencyDrillReport: null })); closeSidebar(); };
  const handleStartNewDailyInspectionCatI = () => { setState(s => ({ ...s, currentView: ViewState.FORM_DAILY_INSPECTION_CAT_I, activeDailyInspectionCatIReport: null })); closeSidebar(); };
  const handleStartNewDroppedObjects = () => { setState(s => ({ ...s, currentView: ViewState.FORM_DROPPED_OBJECTS, activeDroppedObjectsReport: null })); closeSidebar(); };
  const handleStartNewTubingMeasurement = () => { setState(s => ({ ...s, currentView: ViewState.FORM_TUBING_MEASUREMENT, activeTubingMeasurementReport: null })); closeSidebar(); };
  const handleStartNewATS = () => { setState(s => ({ ...s, currentView: ViewState.FORM_ATS, activeATSReport: null })); closeSidebar(); };
  const handleStartNewLocationHandover = () => { setState(s => ({ ...s, currentView: ViewState.FORM_LOCATION_HANDOVER, activeLocationHandoverReport: null })); closeSidebar(); };
  const handleOpenInspectionFrequency = () => { setState(s => ({ ...s, currentView: ViewState.FORM_INSPECTION_FREQUENCY })); closeSidebar(); };
  const handleStartNewQHSE = () => { setState(s => ({ ...s, currentView: ViewState.FORM_QHSE, activeQHSEReport: null })); closeSidebar(); };
  const handleStartNewSwabbing = () => { setState(s => ({ ...s, currentView: ViewState.FORM_SWABBING, activeSwabbingReport: null })); closeSidebar(); };
  const handleStartNewFirstAid = () => { setState(s => ({ ...s, currentView: ViewState.FORM_FIRST_AID, activeFirstAidReport: null })); closeSidebar(); };
  const handleStartNewSlingInspection = () => { setState(s => ({ ...s, currentView: ViewState.FORM_SLING_INSPECTION, activeSlingInspectionReport: null })); closeSidebar(); };
  const handleStartNewFacilityInspection = () => { setState(s => ({ ...s, currentView: ViewState.FORM_FACILITY_INSPECTION, activeFacilityInspectionReport: null })); closeSidebar(); };
  const handleStartNewPlatform = () => { setState(s => ({ ...s, currentView: ViewState.FORM_PLATFORM_INSPECTION, activePlatformInspectionReport: null })); closeSidebar(); };
  const handleStartNewStilson = () => { setState(s => ({ ...s, currentView: ViewState.FORM_STILSON_INSPECTION, activeStilsonInspectionReport: null })); closeSidebar(); };
  const handleStartNewForklift = () => { setState(s => ({ ...s, currentView: ViewState.FORM_FORKLIFT_INSPECTION, activeForkliftReport: null })); closeSidebar(); };
  const handleStartNewMaintenance = () => { setState(s => ({ ...s, currentView: ViewState.FORM_MAINTENANCE_REPORT, activeMaintenanceReport: null })); closeSidebar(); };
  const handleStartNewThickness = () => { setState(s => ({ ...s, currentView: ViewState.FORM_THICKNESS_MEASUREMENT, activeThicknessReport: null })); closeSidebar(); };
  const handleStartNewToolMovement = () => { setState(s => ({ ...s, currentView: ViewState.FORM_TOOL_MOVEMENT, activeToolMovementReport: null })); closeSidebar(); };
  const handleStartNewDaily = () => { setState(s => ({ ...s, currentView: ViewState.FORM_DAILY, activeReport: null })); closeSidebar(); };
  const handleStartNewLiftingPlan = () => { setState(s => ({ ...s, currentView: ViewState.FORM_FORKLIFT_LIFTING_PLAN, activeForkliftLiftingPlanReport: null })); closeSidebar(); };
  const handleStartNewINDControl = () => { setState(s => ({ ...s, currentView: ViewState.FORM_IND_CONTROL, activeINDControlReport: null })); closeSidebar(); };
  const handleStartNewCircuitBreaker = () => { setState(s => ({ ...s, currentView: ViewState.FORM_CIRCUIT_BREAKER, activeCircuitBreakerReport: null })); closeSidebar(); };
  const handleStartNewFoamTest = () => { setState(s => ({ ...s, currentView: ViewState.FORM_FOAM_TEST, activeFoamTestReport: null })); closeSidebar(); };
  const handleStartNewTorque = () => { setState(s => ({ ...s, currentView: ViewState.FORM_TORQUE_REGISTER, activeTorqueReport: null })); closeSidebar(); };
  const handleStartNewShiftChange = () => { setState(s => ({ ...s, currentView: ViewState.FORM_SHIFT_CHANGE, activeShiftChangeReport: null })); closeSidebar(); };
  const handleStartNewFoam = () => { setState(s => ({ ...s, currentView: ViewState.FORM_FOAM, activeFoamReport: null })); closeSidebar(); };
  const handleStartNewCableWork = () => { setState(s => ({ ...s, currentView: ViewState.FORM_CABLE_WORK, activeCableWorkReport: null })); closeSidebar(); };

  const renderContent = () => {
    switch (state.currentView) {
      case ViewState.DASHBOARD: return <AdminDashboard state={state} />;
      case ViewState.LIST:
        return (
          <div className="p-8 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Panel Principal</h2>
            <p className="text-gray-600">Seleccione una opción del menú lateral para comenzar un nuevo formulario o ver reportes existentes.</p>
          </div>
        );
      case ViewState.FORM_DAILY: return <DailyOperationsForm initialData={state.activeReport || undefined} onSave={(d) => handleSave(dailyReportService, d)} onCancel={goToList} />;
      case ViewState.FORM_OUTSOURCED: return <OutsourcedOperationsForm initialData={state.activeOutsourcedReport || undefined} onSave={(d) => handleSave(outsourcedService, d)} onCancel={goToList} />;
      case ViewState.FORM_FOAM: return <FoamSystemForm initialData={state.activeFoamReport || undefined} onSave={(d) => handleSave(foamService, d)} onCancel={goToList} />;
      case ViewState.FORM_INERTIA: return <InertiaCalcForm initialData={state.activeInertiaReport || undefined} onSave={(d) => handleSave(inertiaService, d)} onCancel={goToList} />;
      case ViewState.FORM_SHIFT_CHANGE: return <ShiftChangeForm initialData={state.activeShiftChangeReport || undefined} onSave={(d) => handleSave(shiftChangeService, d)} onCancel={goToList} />;
      case ViewState.FORM_SLING_INSPECTION: return <SlingInspectionForm initialData={state.activeSlingInspectionReport || undefined} onSave={(d) => handleSave(slingService, d)} onCancel={goToList} />;
      case ViewState.FORM_SWABBING: return <SwabbingReportForm initialData={state.activeSwabbingReport || undefined} onSave={(d) => handleSave(swabbingService, d)} onCancel={goToList} />;
      case ViewState.FORM_QHSE: return <QHSEReportForm initialData={state.activeQHSEReport || undefined} onSave={(d) => handleSave(qhseService, d)} onCancel={goToList} />;
      case ViewState.FORM_TRANSPORT_CHECKLIST: return <TransportChecklistForm initialData={state.activeTransportChecklistReport || undefined} onSave={(d) => handleSave(transportService, d)} onCancel={goToList} />;
      case ViewState.FORM_WORKOVER_CHECKLIST: return <WorkoverChecklistForm initialData={state.activeWorkoverChecklistReport || undefined} onSave={(d) => handleSave(workoverService, d)} onCancel={goToList} />;
      case ViewState.FORM_TOOL_MOVEMENT: return <ToolMovementForm initialData={state.activeToolMovementReport || undefined} onSave={(d) => handleSave(toolMovementService, d)} onCancel={goToList} />;
      case ViewState.FORM_CABLE_WORK: return <CableWorkReportForm initialData={state.activeCableWorkReport || undefined} onSave={(d) => handleSave(cableWorkService, d)} onCancel={goToList} />;
      case ViewState.FORM_PULLING_CHECKLIST: return <PullingChecklistForm initialData={state.activePullingChecklistReport || undefined} onSave={(d) => handleSave(pullingService, d)} onCancel={goToList} />;
      case ViewState.FORM_MAINTENANCE_REPORT: return <MaintenanceReportForm initialData={state.activeMaintenanceReport || undefined} onSave={(d) => handleSave(maintenanceService, d)} onCancel={goToList} />;
      case ViewState.FORM_FBU_CHECKLIST: return <FBUChecklistForm initialData={state.activeFBUChecklistReport || undefined} onSave={(d) => handleSave(fbuService, d)} onCancel={goToList} />;
      case ViewState.FORM_CIRCUIT_BREAKER: return <CircuitBreakerForm initialData={state.activeCircuitBreakerReport || undefined} onSave={(d) => handleSave(circuitBreakerService, d)} onCancel={goToList} />;
      case ViewState.FORM_FACILITY_INSPECTION: return <FacilityInspectionForm initialData={state.activeFacilityInspectionReport || undefined} onSave={(d) => handleSave(facilityService, d)} onCancel={goToList} />;
      case ViewState.FORM_VEHICLE_INSPECTION: return <VehicleInspectionForm initialData={state.activeVehicleInspectionReport || undefined} onSave={(d) => handleSave(vehicleInspectionService, d)} onCancel={goToList} />;
      case ViewState.FORM_STILSON_INSPECTION: return <StilsonInspectionForm initialData={state.activeStilsonInspectionReport || undefined} onSave={(d) => handleSave(stilsonService, d)} onCancel={goToList} />;
      case ViewState.FORM_STILSON_CONTROL: return <StilsonControlForm initialData={state.activeStilsonControlReport || undefined} onSave={(d) => handleSave(stilsonControlService, d)} onCancel={goToList} />;
      case ViewState.FORM_FIRST_AID: return <FirstAidInspectionForm initialData={state.activeFirstAidReport || undefined} onSave={(d) => handleSave(firstAidService, d)} onCancel={goToList} />;
      case ViewState.FORM_FOAM_TEST: return <FoamTestForm initialData={state.activeFoamTestReport || undefined} onSave={(d) => handleSave(foamTestService, d)} onCancel={goToList} />;
      case ViewState.FORM_BUMP_TEST: return <BumpTestForm initialData={state.activeBumpTestReport || undefined} onSave={(d) => handleSave(bumpTestService, d)} onCancel={goToList} />;
      case ViewState.FORM_IND_CONTROL: return <INDControlForm initialData={state.activeINDControlReport || undefined} onSave={(d) => handleSave(indControlService, d)} onCancel={goToList} />;
      case ViewState.FORM_THICKNESS_MEASUREMENT: return <ThicknessMeasurementForm initialData={state.activeThicknessReport || undefined} onSave={(d) => handleSave(thicknessService, d)} onCancel={goToList} />;
      case ViewState.FORM_FORKLIFT_INSPECTION: return <ForkliftInspectionForm initialData={state.activeForkliftReport || undefined} onSave={(d) => handleSave(forkliftService, d)} onCancel={goToList} />;
      case ViewState.FORM_FORKLIFT_LIFTING_PLAN: return <ForkliftLiftingPlanForm initialData={state.activeForkliftLiftingPlanReport || undefined} onSave={(d) => handleSave(forkliftLiftingPlanService, d)} onCancel={goToList} />;
      case ViewState.FORM_TORQUE_REGISTER: return <TorqueRegisterForm initialData={state.activeTorqueReport || undefined} onSave={(d) => handleSave(torqueRegisterService, d)} onCancel={goToList} />;
      case ViewState.FORM_PLATFORM_INSPECTION: return <PlatformInspectionForm initialData={state.activePlatformInspectionReport || undefined} onSave={(d) => handleSave(platformInspectionService, d)} onCancel={goToList} />;
      case ViewState.FORM_WELCOME_SIGN: return <WelcomeSignForm initialData={state.activeWelcomeSign || undefined} onSave={(d) => handleSave(welcomeSignService, d)} onCancel={goToList} />;
      case ViewState.FORM_ELECTRICAL_CHECKLIST: return <ElectricalChecklistForm initialData={state.activeElectricalChecklistReport || undefined} onSave={(d) => handleSave(electricalChecklistService, d)} onCancel={goToList} />;
      case ViewState.FORM_ELECTRICAL_TOOL_CHECKLIST: return <ElectricalToolChecklistForm initialData={state.activeElectricalToolChecklistReport || undefined} onSave={(d) => handleSave(electricalToolChecklistService, d)} onCancel={goToList} />;
      case ViewState.FORM_CUSTOMER_PROPERTY_CUSTODY: return <CustomerPropertyCustodyForm initialData={state.activeCustomerPropertyCustodyReport || undefined} onSave={(d) => handleSave(customerCustodyService, d)} onCancel={goToList} />;
      case ViewState.FORM_IPCR: return <IPCRForm initialData={state.activeIPCRReport || undefined} onSave={(d) => handleSave(ipcrService, d)} onCancel={goToList} />;
      case ViewState.FORM_ACCUMULATOR_TEST: return <AccumulatorTestForm initialData={state.activeAccumulatorTestReport || undefined} onSave={(d) => handleSave(accumulatorTestService, d)} onCancel={goToList} />;
      case ViewState.FORM_PERFORMANCE_EVALUATION: return <PerformanceEvaluationForm initialData={state.activePerformanceEvaluationReport || undefined} onSave={(d) => handleSave(performanceEvaluationService, d)} onCancel={goToList} />;
      case ViewState.FORM_BOP_CONNECTION: return <BOPConnectionForm initialData={state.activeBOPConnectionReport || undefined} onSave={(d) => handleSave(bopConnectionService, d)} onCancel={goToList} />;
      case ViewState.FORM_MANAGERIAL_VISIT: return <ManagerialVisitForm initialData={state.activeManagerialVisitReport || undefined} onSave={(d) => handleSave(managerialVisitService, d)} onCancel={goToList} />;
      case ViewState.FORM_TOWER_PRESSURE: return <TowerPressureForm initialData={state.activeTowerPressureReport || undefined} onSave={(d) => handleSave(towerPressureService, d)} onCancel={goToList} />;
      case ViewState.FORM_MAST_ASSEMBLY_ROLES: return <MastAssemblyRolesForm initialData={state.activeMastAssemblyRolesReport || undefined} onSave={(d) => handleSave(mastAssemblyRolesService, d)} onCancel={goToList} />;
      case ViewState.FORM_PRE_ASSEMBLY_CHECKLIST: return <PreAssemblyChecklistForm initialData={state.activePreAssemblyChecklistReport || undefined} onSave={(d) => handleSave(preAssemblyChecklistService, d)} onCancel={goToList} />;
      case ViewState.FORM_WASTE_SIGN: return <WasteClassificationSignForm initialData={state.activeWasteSign || undefined} onSave={(d) => handleSave(wasteSignService, d)} onCancel={goToList} />;
      case ViewState.FORM_WELL_FILLING: return <WellFillingForm initialData={state.activeWellFillingReport || undefined} onSave={(d) => handleSave(wellFillingService, d)} onCancel={goToList} />;
      case ViewState.FORM_OIL_CHANGE: return <OilChangeForm initialData={state.activeOilChangeReport || undefined} onSave={(d) => handleSave(oilChangeService, d)} onCancel={goToList} />;
      case ViewState.FORM_MECHANICAL_CHECKLIST: return <MechanicalChecklistForm initialData={state.activeMechanicalChecklistReport || undefined} onSave={(d) => handleSave(mechanicalChecklistService, d)} onCancel={goToList} />;
      case ViewState.FORM_FLARE_CHECKLIST: return <FlareChecklistForm initialData={state.activeFlareChecklistReport || undefined} onSave={(d) => handleSave(flareChecklistService, d)} onCancel={goToList} />;
      case ViewState.FORM_EMERGENCY_DRILL: return <EmergencyDrillForm initialData={state.activeEmergencyDrillReport || undefined} onSave={(d) => handleSave(emergencyDrillService, d)} onCancel={goToList} />;
      case ViewState.FORM_DAILY_INSPECTION_CAT_I: return <DailyInspectionCatIForm initialData={state.activeDailyInspectionCatIReport || undefined} onSave={(d) => handleSave(dailyInspectionCatIService, d)} onCancel={goToList} />;
      case ViewState.FORM_DROPPED_OBJECTS: return <DroppedObjectsForm initialData={state.activeDroppedObjectsReport || undefined} onSave={(d) => handleSave(droppedObjectsService, d)} onCancel={goToList} />;
      case ViewState.FORM_TUBING_MEASUREMENT: return <TubingMeasurementForm initialData={state.activeTubingMeasurementReport || undefined} onSave={(d) => handleSave(tubingMeasurementService, d)} onCancel={goToList} />;
      case ViewState.FORM_ATS: return <ATSForm initialData={state.activeATSReport || undefined} onSave={(d) => handleSave(atsService, d)} onCancel={goToList} />;
      case ViewState.FORM_LOCATION_HANDOVER: return <LocationHandoverForm initialData={state.activeLocationHandoverReport || undefined} onSave={(d) => handleSave(locationHandoverService, d)} onCancel={goToList} />;
      case ViewState.FORM_INSPECTION_FREQUENCY: return <InspectionFrequencyForm onCancel={goToList} />;
      default:
        return <div className="p-8 text-gray-500">Seleccione una opción del menú.</div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-brand-red border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans relative">
      {/* OVERLAY — solo visible en mobile cuando sidebar está abierto */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden no-print"
          onClick={closeSidebar}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed md:relative inset-y-0 left-0 z-40
        w-72 md:w-64 bg-white border-r border-gray-200
        flex flex-col flex-shrink-0
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        no-print
      `}>
        {/* Header del sidebar */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="h-8 w-8 bg-brand-red rounded flex items-center justify-center text-white font-bold text-sm">WS</div>
            <span className="font-bold text-lg tracking-tight">OPERACIONES</span>
          </div>
          {/* Botón cerrar — solo en mobile */}
          <button
            onClick={closeSidebar}
            title="Cerrar menú"
            aria-label="Cerrar menú"
            className="md:hidden p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
          <p className="text-xs font-semibold text-gray-700 truncate">{user.email}</p>
          <span className={`text-[10px] uppercase font-bold tracking-wider mt-1 inline-block ${
            isAdmin ? 'text-brand-red' : 'text-gray-500'
          }`}>
            {isAdmin ? 'Administrador' : 'Operador'}
          </span>
        </div>

        {/* Estado conexión */}
        <div className="px-6 py-2 border-b border-gray-100 bg-white flex items-center gap-2 text-xs font-semibold">
          <div className={`w-2 h-2 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500' :
            connectionStatus === 'error' ? 'bg-red-500 animate-pulse' : 'bg-gray-400'
          }`}></div>
          <span>{
            connectionStatus === 'connected' ? 'Online' :
            connectionStatus === 'error' ? 'Error Conexión' : 'Verificando...'
          }</span>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto flex-1">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Panel</div>
          <button
            onClick={goToList}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${state.currentView === ViewState.LIST ? 'bg-red-50 text-brand-red' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            📋 Mis Reportes
          </button>
          {isAdmin && (
            <button
              onClick={() => { setState(s => ({ ...s, currentView: ViewState.DASHBOARD })); closeSidebar(); }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${state.currentView === ViewState.DASHBOARD ? 'bg-red-50 text-brand-red' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              📊 Dashboard Admin
            </button>
          )}

          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2 px-2">Cartelería</div>
          <button onClick={handleStartNewWelcomeSign} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">🎨 Cartel de Bienvenidos</button>
          <button onClick={handleStartNewWasteSign} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">♻️ Cartel Residuos</button>

          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2 px-2">Nuevo Formulario</div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4 mb-2 px-2">📋 Reportes Operativos</div>
          <button onClick={handleStartNewCableWork} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Trab. Cable</button>
          <button onClick={handleStartNewDaily} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Parte Diario</button>
          <button onClick={handleStartNewINDControl} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Planilla IND</button>
          <button onClick={handleStartNewInertia} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Calculo Inercia</button>
          <button onClick={handleStartNewMaintenance} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Mantenimiento</button>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4 mb-2 px-2">📋 Reportes Operativos</div>
          <button onClick={handleStartNewOilChange} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Cambio Aceite y Filtros</button>
          <button onClick={handleStartNewOutsourced} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Control Tercerizados</button>
          <button onClick={handleStartNewSwabbing} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Inf. Pistoneo</button>
          <button onClick={handleStartNewQHSE} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Inf. Mensual QHSE</button>
          <button onClick={handleStartNewMaintenance} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Mantenimiento</button>
          <button onClick={handleStartNewThickness} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Medición Espesores</button>
          <button onClick={handleStartNewToolMovement} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Mov. Herramientas</button>
          <button onClick={handleStartNewDaily} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Parte Diario</button>
          <button onClick={handleStartNewINDControl} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Planilla IND</button>
          <button onClick={handleStartNewWellFilling} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Planilla Llenado Pozo</button>
          <button onClick={handleStartNewTubingMeasurement} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Planilla Medición Tubing</button>
          <button onClick={handleStartNewTorque} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Registro de Torque</button>
          <button onClick={handleStartNewTowerPressure} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Reg. Presiones Torre</button>
          <button onClick={handleStartNewCableWork} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Trab. Cable</button>
          <button onClick={handleStartNewInertia} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Calculo Inercia</button>

          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4 mb-2 px-2">✅ Checklists</div>
          <button onClick={handleStartNewBOPConnection} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Conexión de BOP</button>
          <button onClick={handleStartNewFBUChecklist} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Check List FBU</button>
          <button onClick={handleStartNewFlareChecklist} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Check List Flare Móvil</button>
          <button onClick={handleStartNewMechanicalChecklist} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Check-List Mecánico</button>
          <button onClick={handleStartNewElectrical} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Check-List Eléctrico</button>
          <button onClick={handleStartNewElectricalTool} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Check-List Herr. Eléctricas</button>
          <button onClick={handleStartNewPreAssemblyChecklist} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Checklist Pre-Montaje</button>
          <button onClick={handleStartNewPullingChecklist} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Check Pulling</button>
          <button onClick={handleStartNewTransportChecklist} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Check Transp.</button>
          <button onClick={handleStartNewVehicleInspection} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Check Vehículos</button>
          <button onClick={handleStartNewWorkoverChecklist} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Check Workover</button>

          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4 mb-2 px-2">🔍 Inspecciones</div>
          <button onClick={handleStartNewStilsonControl} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Control Stilsons</button>
          <button onClick={handleStartNewDroppedObjects} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Check Caída Objetos</button>
          <button onClick={handleStartNewFirstAid} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Insp. Botiquín</button>
          <button onClick={handleStartNewSlingInspection} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Insp. Eslingas</button>
          <button onClick={handleStartNewFacilityInspection} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Insp. Instalaciones</button>
          <button onClick={handleStartNewPlatform} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Insp. Plataforma Elevadora</button>
          <button onClick={handleStartNewStilson} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Insp. Stilson</button>
          <button onClick={handleStartNewDailyInspectionCatI} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Insp. Visual Diaria (Cat I)</button>
          <button onClick={handleStartNewForklift} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Inspección Montacargas</button>
          <button onClick={handleStartNewLiftingPlan} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Plan de Izaje Montacarga</button>

          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4 mb-2 px-2">⚠️ QHSE / Seguridad</div>
          <button onClick={handleStartNewATS} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ ATS</button>
          <button onClick={handleStartNewBumpTest} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Bump Test Multigas</button>
          <button onClick={handleStartNewEmergencyDrill} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Simulacro de Emergencia</button>
          <button onClick={handleStartNewIPCR} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Identificación Peligros IPCR</button>
          <button onClick={handleStartNewMastAssemblyRoles} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Roles Montaje Mástil</button>
          <button onClick={handleStartNewShiftChange} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Reunion C. Turno</button>
          <button onClick={handleStartNewFoam} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Sist. Espumigeno</button>
          <button onClick={handleStartNewAccumulatorTest} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Prueba de Acumulador</button>
          <button onClick={handleStartNewCircuitBreaker} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Prueba Disyuntores</button>
          <button onClick={handleStartNewFoamTest} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Prueba Espumígeno</button>

          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4 mb-2 px-2">📊 Registros / Admin</div>
          <button onClick={handleStartNewCustomerPropertyCustody} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Custodia Propiedad del Cliente</button>
          <button onClick={handleStartNewPerformanceEvaluation} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Evaluación de Desempeño</button>
          <button onClick={handleStartNewLocationHandover} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Recibo y Entrega Locación</button>
          <button onClick={handleStartNewManagerialVisit} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Visita Gerencial</button>
          <button onClick={handleStartNewPerformanceEvaluation} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">➕ Evaluación de Desempeño</button>

          <button onClick={handleOpenInspectionFrequency} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700">📋 Frec. Mínima de Inspección</button>

          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2 px-2">Sistema</div>
          <button onClick={signOut} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50">🚪 Cerrar Sesión</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden print:overflow-visible h-full bg-gray-50">
        
        {/* HEADER MOBILE — solo visible en mobile */}
        <div className="md:hidden sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 no-print">
          <button
            onClick={() => setSidebarOpen(true)}
            title="Abrir menú"
            aria-label="Abrir menú"
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-brand-red rounded flex items-center justify-center text-white font-bold text-xs">WS</div>
            <span className="font-semibold text-sm tracking-tight">OPERACIONES</span>
          </div>
          {/* Indicador de conexión en mobile */}
          <div className="ml-auto flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' :
              connectionStatus === 'error' ? 'bg-red-500 animate-pulse' : 'bg-gray-400'
            }`}></div>
            <span className="text-xs text-gray-500">
              {connectionStatus === 'connected' ? 'Online' : connectionStatus === 'error' ? 'Error' : '...'}
            </span>
          </div>
        </div>

        <div className="w-full max-w-[1920px] mx-auto py-8 px-2 md:px-4 print:p-0 print:max-w-none">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

// Wrapper with AuthProvider
export const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);
