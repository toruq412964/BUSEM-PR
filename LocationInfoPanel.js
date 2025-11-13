import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Typography, Paper } from '@mui/material';
import FunctionStateGuardPanel from './FunctionStateGuardPanel';
import MessageLocationPanel from './MessageLocationPanel';

// Komponente für zusätzliche Informationen zu Standorten und Guards
const LocationInfoPanel = ({ selectedElement, elements, locations, onElementUpdate }) => {
  const [tabValue, setTabValue] = useState(0);
  const [subjects, setSubjects] = useState([]);

  // Finde alle Subjekte im Modell
  useEffect(() => {
    if (elements) {
      const modelSubjects = elements.filter(
        el => el.type === 'subject' || el.type === 'spatial-subject'
      );
      setSubjects(modelSubjects);
    }
  }, [elements]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Funktion zum Aktualisieren eines Subjekts
  const handleSubjectUpdate = (updatedSubject) => {
    if (onElementUpdate) {
      onElementUpdate(updatedSubject);
    }
  };

  // Wenn kein Element ausgewählt ist
  if (!selectedElement) {
    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="body1" color="textSecondary" align="center">
          Wählen Sie ein Element aus, um standortbezogene Informationen anzuzeigen.
        </Typography>
      </Paper>
    );
  }

  // Bestimme, welche Tabs angezeigt werden sollen
  const showGuardTab = selectedElement.type === 'function-state' || 
                       selectedElement.type === 'spatial-function-state';
  
  const showMessageTab = selectedElement.type === 'message' || 
                         selectedElement.type === 'spatial-message';

  // Wenn das Element keine standortbezogenen Informationen hat
  if (!showGuardTab && !showMessageTab) {
    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="body1" color="textSecondary" align="center">
          Dieses Element hat keine standortbezogenen Informationen.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="location info tabs">
          {showGuardTab && <Tab label="Standort-Guards" />}
          {showMessageTab && <Tab label="Standort-Nachrichten" />}
          <Tab label="Allgemeine Info" />
        </Tabs>
      </Box>
      
      {showGuardTab && tabValue === 0 && (
        <FunctionStateGuardPanel 
          functionState={selectedElement} 
          subjects={subjects} 
          locations={locations}
          onSubjectUpdate={handleSubjectUpdate}
        />
      )}
      
      {showMessageTab && tabValue === (showGuardTab ? 1 : 0) && (
        <MessageLocationPanel 
          message={selectedElement} 
          subjects={subjects} 
          locations={locations}
        />
      )}
      
      {tabValue === (showGuardTab && showMessageTab ? 2 : (showGuardTab || showMessageTab ? 1 : 0)) && (
        <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Standortbezogene Modellierung
          </Typography>
          <Typography variant="body2" paragraph>
            Die räumliche Erweiterung von S-BPM ermöglicht die Modellierung von Prozessen mit Standortbezug.
            Subjekte können sich an verschiedenen Standorten befinden und zwischen diesen wechseln.
          </Typography>
          <Typography variant="body2" paragraph>
            Funktionszustände können an bestimmte Standorte gebunden sein (Guards) und Nachrichten können
            Standortinformationen enthalten.
          </Typography>
          <Typography variant="body2">
            Verwenden Sie die Tabs oben, um spezifische standortbezogene Informationen für das ausgewählte Element anzuzeigen.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default LocationInfoPanel;
