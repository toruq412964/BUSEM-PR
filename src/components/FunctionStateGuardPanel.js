import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Alert,
  Tooltip,
  Button
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  LocationOn as LocationIcon,
  TransferWithinAStation as TransferIcon
} from '@mui/icons-material';
import { canExecuteFunctionAtLocation, getLocationGuardError, performLocationTransition } from './LocationGuards';

const FunctionStateGuardPanel = ({ functionState, subjects, locations, onSubjectUpdate }) => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [guardStatus, setGuardStatus] = useState({ valid: true, message: null });

  // Finde das Subjekt, das diesen Funktionszustand ausführt
  useEffect(() => {
    if (functionState && subjects && subjects.length > 0) {
      // In einer vollständigen Implementierung würden wir hier das Subjekt basierend auf dem Prozessmodell ermitteln
      // Für diesen Prototyp nehmen wir einfach das erste Subjekt
      setSelectedSubject(subjects[0]);
    }
  }, [functionState, subjects]);

  // Überprüfe den Guard-Status, wenn sich der Funktionszustand oder das Subjekt ändert
  useEffect(() => {
    if (functionState && selectedSubject) {
      const canExecute = canExecuteFunctionAtLocation(functionState, selectedSubject);
      const errorMessage = getLocationGuardError(functionState, selectedSubject, locations);

      setGuardStatus({
        valid: canExecute,
        message: errorMessage
      });
    }
  }, [functionState, selectedSubject, locations]);

  // Funktion zum Durchführen eines Standortwechsels
  const handleLocationTransition = () => {
    if (!selectedSubject || !functionState || !functionState.properties || !functionState.properties.locationGuard) {
      return;
    }

    const updatedSubject = performLocationTransition(selectedSubject, functionState.properties.locationGuard);
    if (onSubjectUpdate) {
      onSubjectUpdate(updatedSubject);
      setSelectedSubject(updatedSubject);
    }
  };

  if (!functionState || !functionState.properties) {
    return null;
  }

  const requiresLocation = functionState.properties.requiresLocation;
  const requiredLocation = locations.find(loc => loc.id === functionState.properties.locationGuard);

  if (!requiresLocation && !functionState.properties.isLocationTransition) {
    return null;
  }

  return (
    <Paper elevation={2} sx={{ p: 2, mt: 2, backgroundColor: guardStatus.valid ? '#f0f7f0' : '#fff7f0' }}>
      <Box display="flex" alignItems="center" mb={1}>
        {functionState.properties.isLocationTransition ? (
          <TransferIcon color="secondary" sx={{ mr: 1 }} />
        ) : guardStatus.valid ? (
          <CheckCircleIcon color="success" sx={{ mr: 1 }} />
        ) : (
          <WarningIcon color="warning" sx={{ mr: 1 }} />
        )}
        <Typography variant="subtitle1" fontWeight="bold">
          {functionState.properties.isLocationTransition ? 'Standortwechsel' : 'Standort-Guard'}
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {functionState.properties.isLocationTransition ? (
        // Anzeige für Standortwechsel
        <>
          <Box mb={2}>
            <Typography variant="body2" fontWeight="bold">
              Zielstandort:
            </Typography>
            <Box display="flex" alignItems="center" mt={0.5}>
              <LocationIcon color="secondary" fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2">
                {locations.find(loc => loc.id === functionState.properties.targetLocationId)?.text || 'Nicht definiert'}
              </Typography>
            </Box>
          </Box>

          {selectedSubject && (
            <Box mb={2}>
              <Typography variant="body2" fontWeight="bold">
                Subjekt:
              </Typography>
              <Typography variant="body2">
                {selectedSubject.text}
              </Typography>

              <Typography variant="body2" fontWeight="bold" mt={1}>
                Aktueller Standort:
              </Typography>
              <Box display="flex" alignItems="center" mt={0.5}>
                <LocationIcon color="primary" fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2">
                  {locations.find(loc => loc.id === selectedSubject.properties.currentLocationId)?.text || 'Nicht definiert'}
                </Typography>
              </Box>
            </Box>
          )}

          {functionState.properties.transitionTime > 0 && (
            <Box mb={2}>
              <Typography variant="body2" fontWeight="bold">
                Transitzeit:
              </Typography>
              <Typography variant="body2">
                {functionState.properties.transitionTime} Minuten
              </Typography>
            </Box>
          )}

          {functionState.properties.transitionEvent && (
            <Box mb={2}>
              <Typography variant="body2" fontWeight="bold">
                Abschlussereignis:
              </Typography>
              <Typography variant="body2">
                {functionState.properties.transitionEvent}
              </Typography>
            </Box>
          )}

          <Button
            variant="contained"
            color="secondary"
            startIcon={<TransferIcon />}
            fullWidth
            onClick={handleLocationTransition}
            disabled={!selectedSubject || !selectedSubject.properties.isMobile}
          >
            Standortwechsel durchführen
          </Button>
        </>
      ) : (
        // Anzeige für Standort-Guard
        <>
          <Box mb={2}>
            <Typography variant="body2" fontWeight="bold">
              Erforderlicher Standort:
            </Typography>
            <Box display="flex" alignItems="center" mt={0.5}>
              <LocationIcon color="secondary" fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2">
                {requiredLocation ? requiredLocation.text : 'Nicht definiert'}
              </Typography>
            </Box>
          </Box>

          {selectedSubject && (
            <Box mb={2}>
              <Typography variant="body2" fontWeight="bold">
                Ausführendes Subjekt:
              </Typography>
              <Typography variant="body2">
                {selectedSubject.text}
              </Typography>

              <Typography variant="body2" fontWeight="bold" mt={1}>
                Aktueller Standort:
              </Typography>
              <Box display="flex" alignItems="center" mt={0.5}>
                <LocationIcon color="primary" fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2">
                  {locations.find(loc => loc.id === selectedSubject.properties.currentLocationId)?.text || 'Nicht definiert'}
                </Typography>
              </Box>
            </Box>
          )}

          {guardStatus.message && (
            <Alert severity={guardStatus.valid ? "success" : "warning"} sx={{ mt: 1 }}>
              {guardStatus.message}
            </Alert>
          )}

          {!guardStatus.valid && selectedSubject && selectedSubject.properties.isMobile && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<TransferIcon />}
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleLocationTransition}
            >
              Zu erforderlichem Standort wechseln
            </Button>
          )}
        </>
      )}
    </Paper>
  );
};

export default FunctionStateGuardPanel;
