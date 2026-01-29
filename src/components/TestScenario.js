// Testskript für das Techniker-Maschine-Szenario
// Dieses Skript testet die Funktionalität der räumlichen Erweiterung anhand des Beispielszenarios

import { 
  canExecuteFunctionAtLocation, 
  isSubjectAtLocation, 
  performLocationTransition,
  canSendLocationMessage
} from './LocationGuards';

// Testfunktion für das Szenario
export const testTechnicianMachineScenario = (locations, elements) => {
  console.log('=== Teste Techniker-Maschine-Szenario ===');
  
  // Finde die relevanten Elemente
  const workshopLocation = locations.find(loc => loc.text === 'Werkstatt');
  const productionHallLocation = locations.find(loc => loc.text === 'Produktionshalle');
  
  if (!workshopLocation || !productionHallLocation) {
    console.error('Standorte nicht gefunden!');
    return false;
  }
  
  const technician = elements.find(el => el.text === 'Techniker');
  const machine = elements.find(el => el.text === 'Maschine');
  
  if (!technician || !machine) {
    console.error('Subjekte nicht gefunden!');
    return false;
  }
  
  const repairFunction = elements.find(el => el.text === 'Reparatur durchführen');
  
  if (!repairFunction) {
    console.error('Reparatur-Funktionszustand nicht gefunden!');
    return false;
  }
  
  // Test 1: Techniker ist initial in der Werkstatt
  console.log('Test 1: Techniker ist initial in der Werkstatt');
  const technicianInWorkshop = isSubjectAtLocation(technician, workshopLocation.id);
  console.log(`Techniker in Werkstatt: ${technicianInWorkshop}`);
  
  // Test 2: Maschine ist in der Produktionshalle
  console.log('Test 2: Maschine ist in der Produktionshalle');
  const machineInProductionHall = isSubjectAtLocation(machine, productionHallLocation.id);
  console.log(`Maschine in Produktionshalle: ${machineInProductionHall}`);
  
  // Test 3: Reparatur kann nicht durchgeführt werden, da Techniker nicht in der Produktionshalle ist
  console.log('Test 3: Reparatur kann nicht durchgeführt werden, da Techniker nicht in der Produktionshalle ist');
  const canRepairInitially = canExecuteFunctionAtLocation(repairFunction, technician);
  console.log(`Kann Reparatur durchführen: ${canRepairInitially}`);
  
  // Test 4: Techniker wechselt den Standort zur Produktionshalle
  console.log('Test 4: Techniker wechselt den Standort zur Produktionshalle');
  const updatedTechnician = performLocationTransition(technician, productionHallLocation.id);
  const technicianInProductionHall = isSubjectAtLocation(updatedTechnician, productionHallLocation.id);
  console.log(`Techniker in Produktionshalle nach Standortwechsel: ${technicianInProductionHall}`);
  
  // Test 5: Reparatur kann jetzt durchgeführt werden
  console.log('Test 5: Reparatur kann jetzt durchgeführt werden');
  const canRepairAfterMove = canExecuteFunctionAtLocation(repairFunction, updatedTechnician);
  console.log(`Kann Reparatur durchführen nach Standortwechsel: ${canRepairAfterMove}`);
  
  // Gesamtergebnis
  const success = technicianInWorkshop && machineInProductionHall && !canRepairInitially && 
                  technicianInProductionHall && canRepairAfterMove;
  
  console.log(`=== Testergebnis: ${success ? 'ERFOLGREICH' : 'FEHLGESCHLAGEN'} ===`);
  return success;
};

// Funktion zum Testen der Nachrichtenübermittlung
export const testLocationMessages = (locations, elements) => {
  console.log('=== Teste Standortbezogene Nachrichten ===');
  
  // Finde die relevanten Elemente
  const workshopLocation = locations.find(loc => loc.text === 'Werkstatt');
  const productionHallLocation = locations.find(loc => loc.text === 'Produktionshalle');
  
  if (!workshopLocation || !productionHallLocation) {
    console.error('Standorte nicht gefunden!');
    return false;
  }
  
  const technician = elements.find(el => el.text === 'Techniker');
  const machine = elements.find(el => el.text === 'Maschine');
  
  if (!technician || !machine) {
    console.error('Subjekte nicht gefunden!');
    return false;
  }
  
  // Finde die Nachrichten
  const errorMessage = elements.find(el => el.text === 'Störung @PH');
  const arrivalMessage = elements.find(el => el.text === 'Bin vor Ort');
  
  if (!errorMessage || !arrivalMessage) {
    console.error('Nachrichten nicht gefunden!');
    return false;
  }
  
  // Test 1: Fehlermeldung kann gesendet werden, auch wenn Subjekte an unterschiedlichen Orten sind
  console.log('Test 1: Fehlermeldung kann gesendet werden, auch wenn Subjekte an unterschiedlichen Orten sind');
  const canSendError = canSendLocationMessage(errorMessage, machine, technician);
  console.log(`Kann Fehlermeldung senden: ${canSendError}`);
  
  // Test 2: "Bin vor Ort" kann nicht gesendet werden, wenn Techniker nicht in der Produktionshalle ist
  console.log('Test 2: "Bin vor Ort" kann nicht gesendet werden, wenn Techniker nicht in der Produktionshalle ist');
  const canSendArrivalInitially = canSendLocationMessage(arrivalMessage, technician, machine);
  console.log(`Kann "Bin vor Ort" senden (initial): ${canSendArrivalInitially}`);
  
  // Test 3: Techniker wechselt den Standort zur Produktionshalle
  console.log('Test 3: Techniker wechselt den Standort zur Produktionshalle');
  const updatedTechnician = performLocationTransition(technician, productionHallLocation.id);
  
  // Test 4: "Bin vor Ort" kann jetzt gesendet werden
  console.log('Test 4: "Bin vor Ort" kann jetzt gesendet werden');
  const canSendArrivalAfterMove = canSendLocationMessage(arrivalMessage, updatedTechnician, machine);
  console.log(`Kann "Bin vor Ort" senden (nach Standortwechsel): ${canSendArrivalAfterMove}`);
  
  // Gesamtergebnis
  const success = canSendError && !canSendArrivalInitially && canSendArrivalAfterMove;
  
  console.log(`=== Testergebnis: ${success ? 'ERFOLGREICH' : 'FEHLGESCHLAGEN'} ===`);
  return success;
};

// Haupttestfunktion
export const runAllTests = (locations, elements) => {
  console.log('=== Starte Tests für das Techniker-Maschine-Szenario ===');
  
  const scenarioSuccess = testTechnicianMachineScenario(locations, elements);
  const messagesSuccess = testLocationMessages(locations, elements);
  
  const overallSuccess = scenarioSuccess && messagesSuccess;
  
  console.log(`=== Gesamtergebnis: ${overallSuccess ? 'ALLE TESTS ERFOLGREICH' : 'TESTS FEHLGESCHLAGEN'} ===`);
  return overallSuccess;
};
