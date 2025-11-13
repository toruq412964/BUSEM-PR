// Modellklassen für die räumliche Erweiterung von S-BPM
// Diese Datei definiert die Datenstrukturen für die verschiedenen Modellelemente

// Basisklasse für alle Modellelemente
class ModelElement {
  constructor(id, type, text, position, size) {
    this.id = id || `element-${Date.now()}`;
    this.type = type;
    this.text = text || '';
    this.position = position || { x: 0, y: 0 };
    this.size = size || { width: 100, height: 80 };
    this.properties = {};
  }
}

// Standort (Neu für das Techniker-Maschine-Szenario)
class Location extends ModelElement {
  constructor(id, text, position, size) {
    super(id, 'location', text, position, size || { width: 400, height: 300 });
    this.properties = {
      locationType: 'physical', // physical, virtual, hybrid
      identifier: '', // z.B. "Werkstatt", "Produktionshalle #45125"
      description: ''
    };
  }
}

// Subjekt (Standard S-BPM)
class Subject extends ModelElement {
  constructor(id, text, position, size) {
    super(id, 'subject', text, position, size);
    this.properties = {
      // Neu: Standortinformationen für Subjekte
      locationId: null, // Referenz auf einen Standort
      isMobile: false, // Kann das Subjekt den Standort wechseln?
      currentLocationId: null // Aktueller Standort während der Prozessausführung
    };
  }
}

// Räumliches Subjekt (Erweiterung)
class SpatialSubject extends ModelElement {
  constructor(id, text, position, size) {
    super(id, 'spatial-subject', text, position, size);
    this.properties = {
      position: { x: 0, y: 0, z: 0 },
      orientation: 0,
      perceptionRange: 100,
      // Neu: Erweiterte Standortinformationen
      locationId: null, // Referenz auf einen Standort
      isMobile: false, // Kann das Subjekt den Standort wechseln?
      currentLocationId: null, // Aktueller Standort während der Prozessausführung
      startLocationId: null // Ausgangsstandort des Subjekts
    };
  }
}

// Funktionszustand (Standard S-BPM)
class FunctionState extends ModelElement {
  constructor(id, text, position, size) {
    super(id, 'function-state', text, position, size);
    this.properties = {
      // Neu: Standortbezogene Guards
      locationGuard: null, // Bedingung für den Standort, z.B. "locationId === 'location-1'"
      requiresLocation: false // Erfordert dieser Zustand einen bestimmten Standort?
    };
  }
}

// Räumlicher Funktionszustand (Erweiterung)
class SpatialFunctionState extends ModelElement {
  constructor(id, text, position, size) {
    super(id, 'spatial-function-state', text, position, size);
    this.properties = {
      requiredPosition: { x: 0, y: 0, z: 0 },
      spatialEffect: 'none',
      // Neu: Erweiterte Standortbezogene Guards und Transitionen
      locationGuard: null, // Bedingung für den Standort
      requiresLocation: false, // Erfordert dieser Zustand einen bestimmten Standort?
      isLocationTransition: false, // Ist dieser Zustand ein Standortwechsel?
      targetLocationId: null, // Zielstandort bei einem Standortwechsel
      transitionTime: 0, // Zeit für den Standortwechsel in Minuten
      transitionEvent: null // Ereignis, das den Abschluss des Standortwechsels signalisiert
    };
  }
}

// Nachricht (Standard S-BPM)
class Message extends ModelElement {
  constructor(id, text, source, target, points) {
    super(id, 'message', text);
    this.source = source;
    this.target = target;
    this.points = points || [];
    this.properties = {
      // Neu: Standortinformationen in Nachrichten
      includesLocation: false, // Enthält die Nachricht Standortinformationen?
      locationId: null // Referenz auf einen Standort
    };
  }
}

// Räumliche Nachricht (Erweiterung)
class SpatialMessage extends ModelElement {
  constructor(id, text, source, target, points) {
    super(id, 'spatial-message', text);
    this.source = source;
    this.target = target;
    this.points = points || [];
    this.properties = {
      transmissionType: 'direct',
      range: 100,
      // Neu: Erweiterte Standortinformationen in Nachrichten
      includesLocation: false, // Enthält die Nachricht Standortinformationen?
      locationId: null, // Referenz auf einen Standort
      requiresSameLocation: false // Erfordert die Nachricht, dass Sender und Empfänger am gleichen Standort sind?
    };
  }
}

// Raumcontainer (Erweiterung)
class RoomContainer extends ModelElement {
  constructor(id, text, position, size) {
    super(id, 'room-container', text, position, size || { width: 300, height: 200 });
    this.properties = {
      roomType: 'physical',
      boundaries: 'walls',
      // Neu: Verknüpfung mit Standorten
      locationId: null // Referenz auf einen Standort
    };
  }
}

// Standortwechsel (Neu für das Techniker-Maschine-Szenario)
class LocationTransition extends ModelElement {
  constructor(id, text, position, size) {
    super(id, 'location-transition', text, position, size);
    this.properties = {
      sourceLocationId: null, // Ausgangsstandort
      targetLocationId: null, // Zielstandort
      subjectId: null, // Subjekt, das den Standort wechselt
      transitionTime: 0, // Zeit für den Standortwechsel in Minuten
      transitionEvent: null // Ereignis, das den Abschluss des Standortwechsels signalisiert
    };
  }
}

// Wahrnehmungsbereich (Erweiterung)
class PerceptionArea extends ModelElement {
  constructor(id, text, position, size, subject) {
    super(id, 'perception-area', text, position, size);
    this.subject = subject;
    this.properties = {
      perceptionType: 'visual',
      range: 100
    };
  }
}

// Interaktionszone (Erweiterung)
class InteractionZone extends ModelElement {
  constructor(id, text, position, size) {
    super(id, 'interaction-zone', text, position, size);
    this.properties = {
      interactionType: 'collaboration',
      participants: [],
      // Neu: Standortbezug für Interaktionszonen
      locationId: null // Referenz auf einen Standort
    };
  }
}

// Prozessmodell
class ProcessModel {
  constructor(id, name) {
    this.id = id || `model-${Date.now()}`;
    this.name = name || 'Neues Modell';
    this.elements = [];
    this.spatialElements = [];
    this.connections = [];
    // Neu: Sammlung von Standorten
    this.locations = [];
  }

  addElement(element) {
    if (element.type === 'location') {
      this.locations.push(element);
    } else if (element.type.startsWith('spatial-') || element.type === 'room-container' || 
        element.type === 'perception-area' || element.type === 'interaction-zone' ||
        element.type === 'location-transition') {
      this.spatialElements.push(element);
    } else {
      this.elements.push(element);
    }
    return element;
  }

  removeElement(elementId) {
    this.elements = this.elements.filter(el => el.id !== elementId);
    this.spatialElements = this.spatialElements.filter(el => el.id !== elementId);
    this.locations = this.locations.filter(el => el.id !== elementId);
    this.connections = this.connections.filter(
      conn => conn.source !== elementId && conn.target !== elementId
    );
  }

  updateElement(updatedElement) {
    if (updatedElement.type === 'location') {
      this.locations = this.locations.map(el => 
        el.id === updatedElement.id ? updatedElement : el
      );
    } else if (updatedElement.type.startsWith('spatial-') || updatedElement.type === 'room-container' || 
        updatedElement.type === 'perception-area' || updatedElement.type === 'interaction-zone' ||
        updatedElement.type === 'location-transition') {
      this.spatialElements = this.spatialElements.map(el => 
        el.id === updatedElement.id ? updatedElement : el
      );
    } else {
      this.elements = this.elements.map(el => 
        el.id === updatedElement.id ? updatedElement : el
      );
    }
  }

  getAllElements() {
    return [...this.elements, ...this.spatialElements, ...this.locations];
  }

  // Neu: Hilfsmethoden für standortbezogene Operationen
  getLocationById(locationId) {
    return this.locations.find(location => location.id === locationId);
  }

  getElementsAtLocation(locationId) {
    return this.getAllElements().filter(element => 
      element.properties && element.properties.locationId === locationId
    );
  }

  // Neu: Methode zum Erstellen eines Standortwechsels
  createLocationTransition(subjectId, sourceLocationId, targetLocationId, transitionTime, transitionEvent) {
    const transition = new LocationTransition(
      `transition-${Date.now()}`,
      `Wechsel von ${this.getLocationById(sourceLocationId)?.text || sourceLocationId} nach ${this.getLocationById(targetLocationId)?.text || targetLocationId}`,
      { x: 100, y: 100 }
    );
    
    transition.properties.sourceLocationId = sourceLocationId;
    transition.properties.targetLocationId = targetLocationId;
    transition.properties.subjectId = subjectId;
    transition.properties.transitionTime = transitionTime || 0;
    transition.properties.transitionEvent = transitionEvent || null;
    
    return this.addElement(transition);
  }
}

export {
  ModelElement,
  Location,
  Subject,
  SpatialSubject,
  FunctionState,
  SpatialFunctionState,
  Message,
  SpatialMessage,
  RoomContainer,
  LocationTransition,
  PerceptionArea,
  InteractionZone,
  ProcessModel
};
