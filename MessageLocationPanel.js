import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider,
  Alert,
  Tooltip,
  Chip
} from '@mui/material';
import { 
  LocationOn as LocationIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { canSendLocationMessage, getLocationMessageError } from '../utils/LocationGuards';

const MessageLocationPanel = ({ message, subjects, locations }) => {
  const [sender, setSender] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [messageStatus, setMessageStatus] = useState({ valid: true, message: null });

  // Finde Sender und Empfänger der Nachricht
  useEffect(() => {
    if (message && subjects && subjects.length > 0) {
      // In einer vollständigen Implementierung würden wir hier Sender und Empfänger basierend auf dem Prozessmodell ermitteln
      // Für diesen Prototyp nehmen wir einfach die ersten beiden Subjekte
      if (subjects.length >= 2) {
        setSender(subjects[0]);
        setReceiver(subjects[1]);
      } else if (subjects.length === 1) {
        setSender(subjects[0]);
      }
    }
  }, [message, subjects]);

  // Überprüfe den Nachrichtenstatus, wenn sich die Nachricht, Sender oder Empfänger ändern
  useEffect(() => {
    if (message && sender && receiver) {
      const canSend = canSendLocationMessage(message, sender, receiver);
      const errorMessage = getLocationMessageError(message, sender, receiver, locations);
      
      setMessageStatus({
        valid: canSend,
        message: errorMessage
      });
    }
  }, [message, sender, receiver, locations]);

  if (!message || !message.properties || !message.properties.includesLocation) {
    return null;
  }

  const locationInMessage = locations.find(loc => loc.id === message.properties.locationId);

  return (
    <Paper elevation={2} sx={{ p: 2, mt: 2, backgroundColor: '#f0f7ff' }}>
      <Box display="flex" alignItems="center" mb={1}>
        <LocationIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="subtitle1" fontWeight="bold">
          Standortinformation in Nachricht
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Box mb={2}>
        <Typography variant="body2" fontWeight="bold">
          Enthaltener Standort:
        </Typography>
        <Box display="flex" alignItems="center" mt={0.5}>
          <LocationIcon color="secondary" fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body2">
            {locationInMessage ? locationInMessage.text : 'Nicht definiert'}
          </Typography>
        </Box>
      </Box>
      
      {message.properties.requiresSameLocation && (
        <Box mb={2}>
          <Chip 
            icon={<InfoIcon />} 
            label="Erfordert gleichen Standort für Sender und Empfänger" 
            color="primary" 
            variant="outlined" 
            size="small"
          />
        </Box>
      )}
      
      {sender && receiver && (
        <>
          <Box mb={2}>
            <Typography variant="body2" fontWeight="bold">
              Sender:
            </Typography>
            <Box display="flex" alignItems="center">
              <Typography variant="body2" mr={1}>
                {sender.text}
              </Typography>
              <Chip 
                icon={<LocationIcon fontSize="small" />} 
                label={locations.find(loc => loc.id === sender.properties.currentLocationId)?.text || 'Kein Standort'} 
                size="small" 
                variant="outlined"
              />
            </Box>
          </Box>
          
          <Box mb={2}>
            <Typography variant="body2" fontWeight="bold">
              Empfänger:
            </Typography>
            <Box display="flex" alignItems="center">
              <Typography variant="body2" mr={1}>
                {receiver.text}
              </Typography>
              <Chip 
                icon={<LocationIcon fontSize="small" />} 
                label={locations.find(loc => loc.id === receiver.properties.currentLocationId)?.text || 'Kein Standort'} 
                size="small" 
                variant="outlined"
              />
            </Box>
          </Box>
          
          {messageStatus.message && (
            <Alert severity={messageStatus.valid ? "success" : "warning"} sx={{ mt: 1 }}>
              {messageStatus.message}
            </Alert>
          )}
        </>
      )}
      
      <Box mt={2}>
        <Typography variant="body2" color="textSecondary">
          <InfoIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
          Standortinformationen in Nachrichten ermöglichen die Übermittlung von Ortsdaten zwischen Subjekten.
        </Typography>
      </Box>
    </Paper>
  );
};

export default MessageLocationPanel;
