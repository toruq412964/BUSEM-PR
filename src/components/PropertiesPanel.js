import React from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  Grid,
  Slider,
  FormControlLabel,
  Switch
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const PropertiesPanel = ({ selectedElement, onElementUpdate, onElementDelete, locations = [] }) => {
  if (!selectedElement) {
    return (
      <Box p={2}>
        <Typography variant="body1">Kein Element ausgewählt</Typography>
      </Box>
    );
  }

  const handleTextChange = (e) => {
    onElementUpdate({
      ...selectedElement,
      text: e.target.value
    });
  };

  const handleSizeChange = (dimension, value) => {
    onElementUpdate({
      ...selectedElement,
      size: {
        ...selectedElement.size,
        [dimension]: value
      }
    });
  };

  const handlePropertyChange = (property, value) => {
    onElementUpdate({
      ...selectedElement,
      properties: {
        ...selectedElement.properties,
        [property]: value
      }
    });
  };

  const handlePositionPropertyChange = (axis, value) => {
    onElementUpdate({
      ...selectedElement,
      properties: {
        ...selectedElement.properties,
        position: {
          ...selectedElement.properties.position,
          [axis]: value
        }
      }
    });
  };

  const handleRequiredPositionChange = (axis, value) => {
    onElementUpdate({
      ...selectedElement,
      properties: {
        ...selectedElement.properties,
        requiredPosition: {
          ...selectedElement.properties.requiredPosition,
          [axis]: value
        }
      }
    });
  };

  const renderCommonProperties = () => (
    <Box mb={3}>
      <Typography variant="h6" gutterBottom>
        Allgemeine Eigenschaften
      </Typography>
      <TextField
        fullWidth
        margin="normal"
        label="Name"
        value={selectedElement.text}
        onChange={handleTextChange}
      />
      <Box mt={2}>
        <Typography variant="subtitle2" gutterBottom>
          Größe
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Breite"
              type="number"
              value={selectedElement.size.width}
              onChange={(e) => handleSizeChange('width', parseInt(e.target.value))}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Höhe"
              type="number"
              value={selectedElement.size.height}
              onChange={(e) => handleSizeChange('height', parseInt(e.target.value))}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );

  const renderLocationProperties = () => (
    <Box mb={3}>
      <Typography variant="h6" gutterBottom>
        Standorteigenschaften
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>Standorttyp</InputLabel>
        <Select
          value={selectedElement.properties.locationType || 'physical'}
          onChange={(e) => handlePropertyChange('locationType', e.target.value)}
        >
          <MenuItem value="physical">Physischer Standort</MenuItem>
          <MenuItem value="virtual">Virtueller Standort</MenuItem>
          <MenuItem value="hybrid">Hybrider Standort</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        margin="normal"
        label="Identifikator"
        value={selectedElement.properties.identifier || ''}
        onChange={(e) => handlePropertyChange('identifier', e.target.value)}
        placeholder="z.B. Werkstatt, Produktionshalle #45125"
      />
      <TextField
        fullWidth
        margin="normal"
        label="Beschreibung"
        value={selectedElement.properties.description || ''}
        onChange={(e) => handlePropertyChange('description', e.target.value)}
        multiline
        rows={2}
      />
    </Box>
  );

  const renderSubjectLocationProperties = () => (
    <Box mb={3}>
      <Typography variant="h6" gutterBottom>
        Standortbezogene Eigenschaften
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>Standort</InputLabel>
        <Select
          value={selectedElement.properties.locationId || ''}
          onChange={(e) => handlePropertyChange('locationId', e.target.value)}
        >
          <MenuItem value="">Kein Standort</MenuItem>
          {locations.map(location => (
            <MenuItem key={location.id} value={location.id}>
              {location.text}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControlLabel
        control={
          <Switch
            checked={selectedElement.properties.isMobile || false}
            onChange={(e) => handlePropertyChange('isMobile', e.target.checked)}
            color="primary"
          />
        }
        label="Mobiles Subjekt (kann Standort wechseln)"
        style={{ marginTop: 16 }}
      />
      {selectedElement.properties.isMobile && (
        <FormControl fullWidth margin="normal">
          <InputLabel>Ausgangsstandort</InputLabel>
          <Select
            value={selectedElement.properties.startLocationId || ''}
            onChange={(e) => handlePropertyChange('startLocationId', e.target.value)}
          >
            <MenuItem value="">Kein Ausgangsstandort</MenuItem>
            {locations.map(location => (
              <MenuItem key={location.id} value={location.id}>
                {location.text}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );

  const renderLocationTransitionProperties = () => (
    <Box mb={3}>
      <Typography variant="h6" gutterBottom>
        Standortwechsel-Eigenschaften
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>Subjekt</InputLabel>
        <Select
          value={selectedElement.properties.subjectId || ''}
          onChange={(e) => handlePropertyChange('subjectId', e.target.value)}
        >
          <MenuItem value="">Kein Subjekt</MenuItem>
          {/* Hier würden die verfügbaren Subjekte angezeigt werden */}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Ausgangsstandort</InputLabel>
        <Select
          value={selectedElement.properties.sourceLocationId || ''}
          onChange={(e) => handlePropertyChange('sourceLocationId', e.target.value)}
        >
          <MenuItem value="">Kein Ausgangsstandort</MenuItem>
          {locations.map(location => (
            <MenuItem key={location.id} value={location.id}>
              {location.text}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Zielstandort</InputLabel>
        <Select
          value={selectedElement.properties.targetLocationId || ''}
          onChange={(e) => handlePropertyChange('targetLocationId', e.target.value)}
        >
          <MenuItem value="">Kein Zielstandort</MenuItem>
          {locations.map(location => (
            <MenuItem key={location.id} value={location.id}>
              {location.text}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        margin="normal"
        label="Transitzeit (Minuten)"
        type="number"
        value={selectedElement.properties.transitionTime || 0}
        onChange={(e) => handlePropertyChange('transitionTime', parseInt(e.target.value))}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Transitionsereignis"
        value={selectedElement.properties.transitionEvent || ''}
        onChange={(e) => handlePropertyChange('transitionEvent', e.target.value)}
        placeholder="z.B. Angekommen"
      />
    </Box>
  );

  const renderFunctionStateLocationProperties = () => (
    <Box mb={3}>
      <Typography variant="h6" gutterBottom>
        Standortbezogene Funktionseigenschaften
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={selectedElement.properties.requiresLocation || false}
            onChange={(e) => handlePropertyChange('requiresLocation', e.target.checked)}
            color="primary"
          />
        }
        label="Erfordert einen bestimmten Standort"
        style={{ marginTop: 16 }}
      />
      {selectedElement.properties.requiresLocation && (
        <FormControl fullWidth margin="normal">
          <InputLabel>Erforderlicher Standort</InputLabel>
          <Select
            value={selectedElement.properties.locationGuard || ''}
            onChange={(e) => handlePropertyChange('locationGuard', e.target.value)}
          >
            <MenuItem value="">Kein Standort</MenuItem>
            {locations.map(location => (
              <MenuItem key={location.id} value={location.id}>
                {location.text}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );

  const renderMessageLocationProperties = () => (
    <Box mb={3}>
      <Typography variant="h6" gutterBottom>
        Standortbezogene Nachrichteneigenschaften
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={selectedElement.properties.includesLocation || false}
            onChange={(e) => handlePropertyChange('includesLocation', e.target.checked)}
            color="primary"
          />
        }
        label="Enthält Standortinformationen"
        style={{ marginTop: 16 }}
      />
      {selectedElement.properties.includesLocation && (
        <FormControl fullWidth margin="normal">
          <InputLabel>Standort in Nachricht</InputLabel>
          <Select
            value={selectedElement.properties.locationId || ''}
            onChange={(e) => handlePropertyChange('locationId', e.target.value)}
          >
            <MenuItem value="">Kein Standort</MenuItem>
            {locations.map(location => (
              <MenuItem key={location.id} value={location.id}>
                {location.text}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      <FormControlLabel
        control={
          <Switch
            checked={selectedElement.properties.requiresSameLocation || false}
            onChange={(e) => handlePropertyChange('requiresSameLocation', e.target.checked)}
            color="primary"
          />
        }
        label="Erfordert gleichen Standort für Sender und Empfänger"
        style={{ marginTop: 16 }}
      />
    </Box>
  );

  const renderSpatialSubjectProperties = () => (
    <Box mb={3}>
      <Typography variant="h6" gutterBottom>
        Räumliche Eigenschaften
      </Typography>
      <Box mt={2}>
        <Typography variant="subtitle2" gutterBottom>
          Position
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="X"
              type="number"
              value={selectedElement.properties.position?.x || 0}
              onChange={(e) => handlePositionPropertyChange('x', parseInt(e.target.value))}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Y"
              type="number"
              value={selectedElement.properties.position?.y || 0}
              onChange={(e) => handlePositionPropertyChange('y', parseInt(e.target.value))}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Z"
              type="number"
              value={selectedElement.properties.position?.z || 0}
              onChange={(e) => handlePositionPropertyChange('z', parseInt(e.target.value))}
            />
          </Grid>
        </Grid>
      </Box>
      <Box mt={2}>
        <Typography variant="subtitle2" gutterBottom>
          Orientierung (Grad)
        </Typography>
        <Slider
          value={selectedElement.properties.orientation || 0}
          onChange={(e, value) => handlePropertyChange('orientation', value)}
          min={0}
          max={359}
          valueLabelDisplay="auto"
        />
      </Box>
      <Box mt={2}>
        <Typography variant="subtitle2" gutterBottom>
          Wahrnehmungsbereich
        </Typography>
        <Slider
          value={selectedElement.properties.perceptionRange || 100}
          onChange={(e, value) => handlePropertyChange('perceptionRange', value)}
          min={0}
          max={300}
          valueLabelDisplay="auto"
        />
      </Box>
      {renderSubjectLocationProperties()}
    </Box>
  );

  const renderRoomContainerProperties = () => (
    <Box mb={3}>
      <Typography variant="h6" gutterBottom>
        Raumeigenschaften
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>Raumtyp</InputLabel>
        <Select
          value={selectedElement.properties.roomType || 'physical'}
          onChange={(e) => handlePropertyChange('roomType', e.target.value)}
        >
          <MenuItem value="physical">Physischer Raum</MenuItem>
          <MenuItem value="virtual">Virtueller Raum</MenuItem>
          <MenuItem value="hybrid">Hybrider Raum</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Grenzen</InputLabel>
        <Select
          value={selectedElement.properties.boundaries || 'walls'}
          onChange={(e) => handlePropertyChange('boundaries', e.target.value)}
        >
          <MenuItem value="walls">Wände</MenuItem>
          <MenuItem value="virtual">Virtuelle Grenzen</MenuItem>
          <MenuItem value="open">Offene Grenzen</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Zugeordneter Standort</InputLabel>
        <Select
          value={selectedElement.properties.locationId || ''}
          onChange={(e) => handlePropertyChange('locationId', e.target.value)}
        >
          <MenuItem value="">Kein Standort</MenuItem>
          {locations.map(location => (
            <MenuItem key={location.id} value={location.id}>
              {location.text}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );

  const renderSpatialFunctionStateProperties = () => (
    <Box mb={3}>
      <Typography variant="h6" gutterBottom>
        Räumliche Funktionseigenschaften
      </Typography>
      <Box mt={2}>
        <Typography variant="subtitle2" gutterBottom>
          Erforderliche Position
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="X"
              type="number"
              value={selectedElement.properties.requiredPosition?.x || 0}
              onChange={(e) => handleRequiredPositionChange('x', parseInt(e.target.value))}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Y"
              type="number"
              value={selectedElement.properties.requiredPosition?.y || 0}
              onChange={(e) => handleRequiredPositionChange('y', parseInt(e.target.value))}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Z"
              type="number"
              value={selectedElement.properties.requiredPosition?.z || 0}
              onChange={(e) => handleRequiredPositionChange('z', parseInt(e.target.value))}
            />
          </Grid>
        </Grid>
      </Box>
      <FormControl fullWidth margin="normal">
        <InputLabel>Räumlicher Effekt</InputLabel>
        <Select
          value={selectedElement.properties.spatialEffect || 'none'}
          onChange={(e) => handlePropertyChange('spatialEffect', e.target.value)}
        >
          <MenuItem value="none">Kein Effekt</MenuItem>
          <MenuItem value="block">Blockiert Bewegung</MenuItem>
          <MenuItem value="slow">Verlangsamt Bewegung</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Eigenschaften
      </Typography>
      <Divider />
      <Box mt={2}>
        {renderCommonProperties()}

        {selectedElement.type === 'location' && renderLocationProperties()}
        {selectedElement.type === 'subject' && renderSubjectLocationProperties()}
        {selectedElement.type === 'location-transition' && renderLocationTransitionProperties()}
        {selectedElement.type === 'function-state' && renderFunctionStateLocationProperties()}
        {(selectedElement.type === 'message' || selectedElement.type === 'spatial-message') && renderMessageLocationProperties()}

        {selectedElement.type === 'spatial-subject' && renderSpatialFunctionStateProperties()}
        {selectedElement.type === 'room-container' && renderRoomContainerProperties()}
        {selectedElement.type === 'spatial-function-state' && renderSpatialFunctionStateProperties()}

        <Box mt={4} mb={2}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DeleteIcon />}
            onClick={() => onElementDelete(selectedElement.id)}
            fullWidth
          >
            Element löschen
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PropertiesPanel;
