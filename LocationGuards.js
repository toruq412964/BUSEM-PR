// Hilfsfunktionen für die Validierung von Standort-Guards in Funktionszuständen
// Diese Datei enthält Funktionen zur Überprüfung von Standortbedingungen

/**
 * Prüft, ob ein Subjekt sich an einem bestimmten Standort befindet
 * @param {Object} subject - Das Subjekt
 * @param {string} locationId - ID des zu prüfenden Standorts
 * @returns {boolean} - true, wenn das Subjekt sich am angegebenen Standort befindet
 */
export const isSubjectAtLocation = (subject, locationId) => {
  if (!subject || !subject.properties) return false;
  return subject.properties.currentLocationId === locationId;
};

/**
 * Prüft, ob ein Funktionszustand an einem bestimmten Standort ausgeführt werden kann
 * @param {Object} functionState - Der Funktionszustand
 * @param {Object} subject - Das ausführende Subjekt
 * @returns {boolean} - true, wenn der Funktionszustand ausgeführt werden kann
 */
export const canExecuteFunctionAtLocation = (functionState, subject) => {
  if (!functionState || !functionState.properties || !subject || !subject.properties) return true;
  
  // Wenn der Funktionszustand keinen Standort erfordert, kann er überall ausgeführt werden
  if (!functionState.properties.requiresLocation) return true;
  
  // Wenn der Funktionszustand einen bestimmten Standort erfordert, prüfen wir, ob das Subjekt dort ist
  if (functionState.properties.locationGuard) {
    return isSubjectAtLocation(subject, functionState.properties.locationGuard);
  }
  
  return true;
};

/**
 * Generiert eine Fehlermeldung, wenn ein Funktionszustand nicht ausgeführt werden kann
 * @param {Object} functionState - Der Funktionszustand
 * @param {Object} subject - Das ausführende Subjekt
 * @param {Array} locations - Liste aller verfügbaren Standorte
 * @returns {string|null} - Fehlermeldung oder null, wenn keine Fehler vorliegen
 */
export const getLocationGuardError = (functionState, subject, locations) => {
  if (!functionState || !functionState.properties || !subject || !subject.properties) return null;
  
  if (functionState.properties.requiresLocation && functionState.properties.locationGuard) {
    if (!isSubjectAtLocation(subject, functionState.properties.locationGuard)) {
      const requiredLocation = locations.find(loc => loc.id === functionState.properties.locationGuard);
      const currentLocation = locations.find(loc => loc.id === subject.properties.currentLocationId);
      
      return `Dieser Funktionszustand erfordert den Standort "${requiredLocation ? requiredLocation.text : 'Unbekannt'}", 
              aber ${subject.text} befindet sich aktuell an "${currentLocation ? currentLocation.text : 'Unbekannt'}".`;
    }
  }
  
  return null;
};

/**
 * Führt einen Standortwechsel für ein Subjekt durch
 * @param {Object} subject - Das Subjekt, das den Standort wechselt
 * @param {string} targetLocationId - ID des Zielstandorts
 * @returns {Object} - Das aktualisierte Subjekt
 */
export const performLocationTransition = (subject, targetLocationId) => {
  if (!subject || !subject.properties) return subject;
  
  // Prüfen, ob das Subjekt mobil ist
  if (!subject.properties.isMobile) {
    console.warn(`Subjekt ${subject.text} ist nicht mobil und kann den Standort nicht wechseln.`);
    return subject;
  }
  
  // Standort aktualisieren
  return {
    ...subject,
    properties: {
      ...subject.properties,
      currentLocationId: targetLocationId
    }
  };
};

/**
 * Prüft, ob eine Nachricht mit Standortinformationen korrekt übermittelt werden kann
 * @param {Object} message - Die Nachricht
 * @param {Object} sender - Das sendende Subjekt
 * @param {Object} receiver - Das empfangende Subjekt
 * @returns {boolean} - true, wenn die Nachricht übermittelt werden kann
 */
export const canSendLocationMessage = (message, sender, receiver) => {
  if (!message || !message.properties) return true;
  
  // Wenn die Nachricht erfordert, dass Sender und Empfänger am gleichen Standort sind
  if (message.properties.requiresSameLocation) {
    if (!sender || !sender.properties || !receiver || !receiver.properties) return false;
    
    return sender.properties.currentLocationId === receiver.properties.currentLocationId;
  }
  
  return true;
};

/**
 * Generiert eine Fehlermeldung, wenn eine Nachricht nicht übermittelt werden kann
 * @param {Object} message - Die Nachricht
 * @param {Object} sender - Das sendende Subjekt
 * @param {Object} receiver - Das empfangende Subjekt
 * @param {Array} locations - Liste aller verfügbaren Standorte
 * @returns {string|null} - Fehlermeldung oder null, wenn keine Fehler vorliegen
 */
export const getLocationMessageError = (message, sender, receiver, locations) => {
  if (!message || !message.properties) return null;
  
  if (message.properties.requiresSameLocation) {
    if (!sender || !sender.properties || !receiver || !receiver.properties) return null;
    
    if (sender.properties.currentLocationId !== receiver.properties.currentLocationId) {
      const senderLocation = locations.find(loc => loc.id === sender.properties.currentLocationId);
      const receiverLocation = locations.find(loc => loc.id === receiver.properties.currentLocationId);
      
      return `Diese Nachricht erfordert, dass Sender und Empfänger am gleichen Standort sind, 
              aber ${sender.text} befindet sich an "${senderLocation ? senderLocation.text : 'Unbekannt'}" und 
              ${receiver.text} befindet sich an "${receiverLocation ? receiverLocation.text : 'Unbekannt'}".`;
    }
  }
  
  return null;
};
