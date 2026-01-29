import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Grid,
  Paper
} from '@mui/material';
import {
  Person as PersonIcon,
  Message as MessageIcon,
  Functions as FunctionsIcon,
  Room as RoomIcon,
  PanTool as PanToolIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Save as SaveIcon,
  FolderOpen as FolderOpenIcon,
  LocationOn as LocationIcon,
  PlayArrow as PlayArrowIcon
} from '@mui/icons-material';
import ModelingCanvas from './components/ModelingCanvas';
import PropertiesPanel from './components/PropertiesPanel';
import ElementPalette from './components/ElementPalette';
import LocationInfoPanel from './components/LocationInfoPanel';
import TestPanel from './components/TestPanel';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [selectedElement, setSelectedElement] = useState(null);
  const [elements, setElements] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showTestPanel, setShowTestPanel] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleElementSelect = (element) => {
    setSelectedElement(element);
  };

  const handleAddElement = (elementType) => {
    const newElement = {
      id: `element-${Date.now()}`,
      type: elementType,
      position: { x: 100, y: 100 },
      size: { width: 120, height: 80 },
      text: `New ${elementType}`,
      properties: {}
    };

    // Add specific properties based on element type
    if (elementType === 'location') {
      newElement.size = { width: 300, height: 200 };
      newElement.text = 'Neuer Standort';
      newElement.properties = {
        locationType: 'physical',
        identifier: '',
        description: ''
      };
      setLocations([...locations, newElement]);
    } else if (elementType === 'location-transition') {
      newElement.text = 'Standortwechsel';
      newElement.properties = {
        sourceLocationId: null,
        targetLocationId: null,
        subjectId: null,
        transitionTime: 0,
        transitionEvent: null
      };
    } else if (elementType === 'subject') {
      newElement.properties = {
        locationId: null,
        isMobile: false,
        currentLocationId: null
      };
    } else if (elementType === 'spatial-subject') {
      newElement.properties = {
        position: { x: 0, y: 0, z: 0 },
        orientation: 0,
        perceptionRange: 100,
        locationId: null,
        isMobile: false,
        currentLocationId: null,
        startLocationId: null
      };
    } else if (elementType === 'function-state') {
      newElement.properties = {
        locationGuard: null,
        requiresLocation: false,
        isLocationTransition: false,
        targetLocationId: null,
        transitionTime: 0,
        transitionEvent: null
      };
    } else if (elementType === 'room-container') {
      newElement.size = { width: 300, height: 200 };
      newElement.properties = {
        roomType: 'physical',
        boundaries: 'walls',
        locationId: null
      };
    } else if (elementType === 'spatial-function-state') {
      newElement.properties = {
        requiredPosition: { x: 0, y: 0, z: 0 },
        spatialEffect: 'none',
        locationGuard: null,
        requiresLocation: false,
        isLocationTransition: false,
        targetLocationId: null,
        transitionTime: 0,
        transitionEvent: null
      };
    } else if (elementType === 'message' || elementType === 'spatial-message') {
      newElement.properties = {
        includesLocation: false,
        locationId: null,
        requiresSameLocation: false
      };
    }

    setElements([...elements, newElement]);
    setSelectedElement(newElement);
  };

  const handleUpdateElement = (updatedElement) => {
    // Wenn es sich um einen Standort handelt, aktualisieren wir die Standortliste
    if (updatedElement.type === 'location') {
      const updatedLocations = locations.map(location =>
        location.id === updatedElement.id ? updatedElement : location
      );
      setLocations(updatedLocations);
    }

    const updatedElements = elements.map(element =>
      element.id === updatedElement.id ? updatedElement : element
    );
    setElements(updatedElements);
    setSelectedElement(updatedElement);
  };

  const handleDeleteElement = (elementId) => {
    // Wenn es sich um einen Standort handelt, entfernen wir ihn aus der Standortliste
    const deletedLocation = locations.find(location => location.id === elementId);
    if (deletedLocation) {
      setLocations(locations.filter(location => location.id !== elementId));

      // Aktualisieren aller Elemente, die auf diesen Standort verweisen
      const updatedElements = elements.map(element => {
        if (element.properties) {
          if (element.properties.locationId === elementId) {
            return {
              ...element,
              properties: {
                ...element.properties,
                locationId: null
              }
            };
          }
          if (element.properties.startLocationId === elementId) {
            return {
              ...element,
              properties: {
                ...element.properties,
                startLocationId: null
              }
            };
          }
          if (element.properties.currentLocationId === elementId) {
            return {
              ...element,
              properties: {
                ...element.properties,
                currentLocationId: null
              }
            };
          }
          if (element.properties.locationGuard === elementId) {
            return {
              ...element,
              properties: {
                ...element.properties,
                locationGuard: null
              }
            };
          }
          if (element.properties.sourceLocationId === elementId) {
            return {
              ...element,
              properties: {
                ...element.properties,
                sourceLocationId: null
              }
            };
          }
          if (element.properties.targetLocationId === elementId) {
            return {
              ...element,
              properties: {
                ...element.properties,
                targetLocationId: null
              }
            };
          }
        }
        return element;
      });
      setElements(updatedElements);
    }

    const updatedElements = elements.filter(element => element.id !== elementId);
    setElements(updatedElements);
    setSelectedElement(null);
  };

  // Hilfsfunktion zum Erstellen eines Standortwechsels zwischen zwei Standorten
  const createLocationTransition = (subjectId, sourceLocationId, targetLocationId) => {
    const sourceLocation = locations.find(loc => loc.id === sourceLocationId);
    const targetLocation = locations.find(loc => loc.id === targetLocationId);

    if (!sourceLocation || !targetLocation) return;

    const transitionElement = {
      id: `transition-${Date.now()}`,
      type: 'location-transition',
      position: { x: 200, y: 200 },
      size: { width: 150, height: 80 },
      text: `Wechsel von ${sourceLocation.text} nach ${targetLocation.text}`,
      properties: {
        sourceLocationId,
        targetLocationId,
        subjectId,
        transitionTime: 0,
        transitionEvent: null
      }
    };

    setElements([...elements, transitionElement]);
  };

  // Hilfsfunktion zum Erstellen eines Funktionszustands mit Standortwechsel
  const createLocationTransitionFunction = (subjectId, sourceLocationId, targetLocationId) => {
    const sourceLocation = locations.find(loc => loc.id === sourceLocationId);
    const targetLocation = locations.find(loc => loc.id === targetLocationId);

    if (!sourceLocation || !targetLocation) return;

    const transitionFunction = {
      id: `function-${Date.now()}`,
      type: 'function-state',
      position: { x: 200, y: 200 },
      size: { width: 150, height: 80 },
      text: `Wechsle Standort zu ${targetLocation.text}`,
      properties: {
        isLocationTransition: true,
        sourceLocationId,
        targetLocationId,
        subjectId,
        transitionTime: 0,
        transitionEvent: 'Angekommen'
      }
    };

    setElements([...elements, transitionFunction]);
  };

  // Hilfsfunktion zum Erstellen eines Funktionszustands mit Standort-Guard
  const createLocationGuardFunction = (locationId) => {
    const location = locations.find(loc => loc.id === locationId);

    if (!location) return;

    const guardFunction = {
      id: `function-${Date.now()}`,
      type: 'function-state',
      position: { x: 200, y: 300 },
      size: { width: 150, height: 80 },
      text: `Aktion an ${location.text}`,
      properties: {
        requiresLocation: true,
        locationGuard: locationId
      }
    };

    setElements([...elements, guardFunction]);
  };

  // Hilfsfunktion zum Erstellen des Techniker-Maschine-Szenarios
  const createTechnicianMachineScenario = () => {
    // Standorte erstellen
    const workshopLocation = {
      id: `location-${Date.now()}-workshop`,
      type: 'location',
      position: { x: 50, y: 50 },
      size: { width: 300, height: 200 },
      text: 'Werkstatt',
      properties: {
        locationType: 'physical',
        identifier: 'Werkstatt',
        description: 'Standort des Technikers'
      }
    };

    const productionHallLocation = {
      id: `location-${Date.now()}-production`,
      type: 'location',
      position: { x: 400, y: 50 },
      size: { width: 300, height: 200 },
      text: 'Produktionshalle',
      properties: {
        locationType: 'physical',
        identifier: 'Produktionshalle #45125',
        description: 'Standort der Maschine'
      }
    };

    // Subjekte erstellen
    const technicianSubject = {
      id: `subject-${Date.now()}-technician`,
      type: 'subject',
      position: { x: 100, y: 300 },
      size: { width: 120, height: 80 },
      text: 'Techniker',
      properties: {
        locationId: workshopLocation.id,
        isMobile: true,
        currentLocationId: workshopLocation.id,
        startLocationId: workshopLocation.id
      }
    };

    const machineSubject = {
      id: `subject-${Date.now()}-machine`,
      type: 'subject',
      position: { x: 500, y: 300 },
      size: { width: 120, height: 80 },
      text: 'Maschine',
      properties: {
        locationId: productionHallLocation.id,
        isMobile: false,
        currentLocationId: productionHallLocation.id
      }
    };

    // Funktionszustände erstellen
    const receiveErrorMessage = {
      id: `function-${Date.now()}-receive`,
      type: 'function-state',
      position: { x: 100, y: 400 },
      size: { width: 150, height: 80 },
      text: 'Empfange Nachricht: Störung mit Ort',
      properties: {
        requiresLocation: false
      }
    };

    const changeLocation = {
      id: `function-${Date.now()}-change`,
      type: 'function-state',
      position: { x: 100, y: 500 },
      size: { width: 150, height: 80 },
      text: 'Wechsle Standort zu Produktionshalle',
      properties: {
        isLocationTransition: true,
        sourceLocationId: workshopLocation.id,
        targetLocationId: productionHallLocation.id,
        subjectId: technicianSubject.id,
        transitionTime: 30,
        transitionEvent: 'Angekommen'
      }
    };

    const sendArrivalMessage = {
      id: `function-${Date.now()}-arrival`,
      type: 'function-state',
      position: { x: 100, y: 600 },
      size: { width: 150, height: 80 },
      text: 'Sende Nachricht: Bin vor Ort',
      properties: {
        requiresLocation: true,
        locationGuard: productionHallLocation.id
      }
    };

    const repairFunction = {
      id: `function-${Date.now()}-repair`,
      type: 'function-state',
      position: { x: 100, y: 700 },
      size: { width: 150, height: 80 },
      text: 'Reparatur durchführen',
      properties: {
        requiresLocation: true,
        locationGuard: productionHallLocation.id
      }
    };

    const sendCompletionMessage = {
      id: `function-${Date.now()}-completion`,
      type: 'function-state',
      position: { x: 100, y: 800 },
      size: { width: 150, height: 80 },
      text: 'Sende Nachricht: Reparatur abgeschlossen',
      properties: {
        requiresLocation: true,
        locationGuard: productionHallLocation.id
      }
    };

    // Maschinen-Funktionszustände
    const sendErrorMessage = {
      id: `function-${Date.now()}-error`,
      type: 'function-state',
      position: { x: 500, y: 400 },
      size: { width: 150, height: 80 },
      text: 'Sende Nachricht "Störung @PH" an Techniker',
      properties: {
        requiresLocation: true,
        locationGuard: productionHallLocation.id
      }
    };

    const receiveArrivalMessage = {
      id: `function-${Date.now()}-receive-arrival`,
      type: 'function-state',
      position: { x: 500, y: 500 },
      size: { width: 150, height: 80 },
      text: 'Empfange: "Bin vor Ort"',
      properties: {
        requiresLocation: true,
        locationGuard: productionHallLocation.id
      }
    };

    const receiveCompletionMessage = {
      id: `function-${Date.now()}-receive-completion`,
      type: 'function-state',
      position: { x: 500, y: 600 },
      size: { width: 150, height: 80 },
      text: 'Empfange: "Reparatur abgeschlossen"',
      properties: {
        requiresLocation: true,
        locationGuard: productionHallLocation.id
      }
    };

    // Nachrichten erstellen
    const errorMessage = {
      id: `message-${Date.now()}-error`,
      type: 'message',
      position: { x: 300, y: 400 },
      size: { width: 120, height: 60 },
      text: 'Störung @PH',
      properties: {
        includesLocation: true,
        locationId: productionHallLocation.id,
        requiresSameLocation: false
      }
    };

    const arrivalMessage = {
      id: `message-${Date.now()}-arrival`,
      type: 'message',
      position: { x: 300, y: 550 },
      size: { width: 120, height: 60 },
      text: 'Bin vor Ort',
      properties: {
        includesLocation: false,
        requiresSameLocation: true
      }
    };

    const completionMessage = {
      id: `message-${Date.now()}-completion`,
      type: 'message',
      position: { x: 300, y: 700 },
      size: { width: 120, height: 60 },
      text: 'Reparatur abgeschlossen',
      properties: {
        includesLocation: false,
        requiresSameLocation: true
      }
    };

    // Alle Elemente hinzufügen
    setLocations([workshopLocation, productionHallLocation]);
    setElements([
      technicianSubject, machineSubject,
      receiveErrorMessage, changeLocation, sendArrivalMessage, repairFunction, sendCompletionMessage,
      sendErrorMessage, receiveArrivalMessage, receiveCompletionMessage,
      errorMessage, arrivalMessage, completionMessage
    ]);

    // Testpanel anzeigen
    setShowTestPanel(true);
  };

  return (
    <div className="app-container">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            S-BPM mit räumlicher Dimension
          </Typography>
          <Box ml={2}>
            <IconButton color="inherit" onClick={createTechnicianMachineScenario}>
              <FolderOpenIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box display="flex" height="calc(100vh - 64px)">
        <Box width={250} borderRight={1} borderColor="divider" overflow="auto">
          <ElementPalette onAddElement={handleAddElement} />
        </Box>

        <Box flexGrow={1} display="flex" flexDirection="column">
          <Paper square>
            <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary" centered>
              <Tab label="Modellierung" />
              <Tab label="Analyse & Tests" disabled={!showTestPanel} />
            </Tabs>
          </Paper>

          <Box flexGrow={1} position="relative" overflow="hidden">
            {tabValue === 0 && (
              <ModelingCanvas
                elements={elements}
                locations={locations}
                onElementSelect={handleElementSelect}
                onElementUpdate={handleUpdateElement}
                mode="integrated"
              />
            )}
            {tabValue === 1 && showTestPanel && (
              <Box p={2} height="100%" overflow="auto">
                <TestPanel
                  elements={elements}
                  locations={locations}
                />
              </Box>
            )}
          </Box>
        </Box>

        <Box width={320} borderLeft={1} borderColor="divider" overflow="auto" p={2}>
          {selectedElement ? (
            <PropertiesPanel
              selectedElement={selectedElement}
              onElementUpdate={handleUpdateElement}
              onElementDelete={handleDeleteElement}
              locations={locations}
            />
          ) : (
            <Box>
              <Typography variant="body2" color="textSecondary" paragraph>
                Wählen Sie ein Element aus, um Eigenschaften zu bearbeiten.
              </Typography>
              <Divider style={{ margin: '16px 0' }} />
              <LocationInfoPanel
                locations={locations}
                elements={elements}
              />
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
}

export default App;
