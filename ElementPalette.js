import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Typography,
  Box
} from '@mui/material';
import {
  Person as PersonIcon,
  Message as MessageIcon,
  Functions as FunctionsIcon,
  Room as RoomIcon,
  Visibility as VisibilityIcon,
  CompareArrows as CompareArrowsIcon,
  LocationOn as LocationIcon,
  TransferWithinAStation as TransferIcon
} from '@mui/icons-material';

const ElementPalette = ({ onAddElement }) => {
  const standardElements = [
    { type: 'subject', icon: <PersonIcon />, label: 'Subjekt' },
    { type: 'function-state', icon: <FunctionsIcon />, label: 'Funktionszustand' },
    { type: 'message', icon: <MessageIcon />, label: 'Nachricht' }
  ];

  const spatialElements = [
    { type: 'spatial-subject', icon: <PersonIcon color="primary" />, label: 'Räumliches Subjekt' },
    { type: 'spatial-function-state', icon: <FunctionsIcon color="primary" />, label: 'Räumlicher Funktionszustand' },
    { type: 'spatial-message', icon: <MessageIcon color="primary" />, label: 'Räumliche Nachricht' },
    { type: 'room-container', icon: <RoomIcon />, label: 'Raumcontainer' },
    { type: 'perception-area', icon: <VisibilityIcon />, label: 'Wahrnehmungsbereich' },
    { type: 'interaction-zone', icon: <CompareArrowsIcon />, label: 'Interaktionszone' }
  ];

  // Neue Elemente für das Techniker-Maschine-Szenario
  const locationElements = [
    { type: 'location', icon: <LocationIcon color="secondary" />, label: 'Standort' },
    { type: 'location-transition', icon: <TransferIcon color="secondary" />, label: 'Standortwechsel' }
  ];

  return (
    <Box>
      <Box p={2}>
        <Typography variant="h6">Elemente</Typography>
      </Box>
      <Divider />
      <Box p={1}>
        <Typography variant="subtitle2">Standard S-BPM</Typography>
      </Box>
      <List>
        {standardElements.map((element) => (
          <ListItem 
            button 
            key={element.type}
            onClick={() => onAddElement(element.type)}
          >
            <ListItemIcon>
              {element.icon}
            </ListItemIcon>
            <ListItemText primary={element.label} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box p={1}>
        <Typography variant="subtitle2">Räumliche Erweiterung</Typography>
      </Box>
      <List>
        {spatialElements.map((element) => (
          <ListItem 
            button 
            key={element.type}
            onClick={() => onAddElement(element.type)}
          >
            <ListItemIcon>
              {element.icon}
            </ListItemIcon>
            <ListItemText primary={element.label} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box p={1}>
        <Typography variant="subtitle2">Standort-Elemente</Typography>
      </Box>
      <List>
        {locationElements.map((element) => (
          <ListItem 
            button 
            key={element.type}
            onClick={() => onAddElement(element.type)}
          >
            <ListItemIcon>
              {element.icon}
            </ListItemIcon>
            <ListItemText primary={element.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ElementPalette;
