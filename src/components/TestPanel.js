import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { runAllTests } from './TestScenario';

const TestPanel = ({ locations, elements }) => {
  const [testResults, setTestResults] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [overallSuccess, setOverallSuccess] = useState(null);

  const handleRunTests = () => {
    console.log('Starte Tests...');

    // Wir fangen die Konsolenausgaben ab, um sie anzuzeigen
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;

    const logs = [];

    console.log = (...args) => {
      logs.push({ type: 'log', message: args.join(' ') });
      originalConsoleLog(...args);
    };

    console.error = (...args) => {
      logs.push({ type: 'error', message: args.join(' ') });
      originalConsoleError(...args);
    };

    // Tests ausführen
    const success = runAllTests(locations, elements);
    setOverallSuccess(success);

    // Konsolenfunktionen wiederherstellen
    console.log = originalConsoleLog;
    console.error = originalConsoleError;

    // Ergebnisse setzen
    setTestResults(logs);

    // Alle Testgruppen initial erweitern
    const initialExpanded = {};
    logs.forEach((log, index) => {
      if (log.message.startsWith('===') && !log.message.includes('ERFOLGREICH') && !log.message.includes('FEHLGESCHLAGEN')) {
        initialExpanded[index] = true;
      }
    });
    setExpanded(initialExpanded);
  };

  const handleToggleExpand = (index) => {
    setExpanded({
      ...expanded,
      [index]: !expanded[index]
    });
  };

  // Gruppiere die Logs nach Testgruppen
  const groupLogs = () => {
    if (!testResults) return [];

    const groups = [];
    let currentGroup = null;

    testResults.forEach((log, index) => {
      if (log.message.startsWith('=== Teste') || log.message.startsWith('=== Starte')) {
        if (currentGroup) {
          groups.push(currentGroup);
        }
        currentGroup = {
          title: log.message.replace(/===/g, '').trim(),
          logs: [log],
          startIndex: index
        };
      } else if (log.message.startsWith('=== Testergebnis') || log.message.startsWith('=== Gesamtergebnis')) {
        if (currentGroup) {
          currentGroup.logs.push(log);
          currentGroup.result = log.message.includes('ERFOLGREICH');
          groups.push(currentGroup);
          currentGroup = null;
        }
      } else if (currentGroup) {
        currentGroup.logs.push(log);
      }
    });

    if (currentGroup) {
      groups.push(currentGroup);
    }

    return groups;
  };

  const logGroups = groupLogs();

  return (
    <Box>
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Techniker-Maschine-Szenario Testen
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlayArrowIcon />}
            onClick={handleRunTests}
          >
            Tests ausführen
          </Button>
        </Box>

        <Typography variant="body2" paragraph>
          Dieser Test überprüft die korrekte Funktionsweise der räumlichen Erweiterung anhand des Techniker-Maschine-Szenarios.
          Es werden Standortwechsel, Standort-Guards und standortbezogene Nachrichten getestet.
        </Typography>

        {overallSuccess !== null && (
          <Alert severity={overallSuccess ? "success" : "error"} sx={{ mt: 2 }}>
            {overallSuccess
              ? "Alle Tests erfolgreich! Die räumliche Erweiterung funktioniert wie erwartet."
              : "Einige Tests sind fehlgeschlagen. Bitte überprüfen Sie die Details unten."}
          </Alert>
        )}
      </Paper>

      {logGroups.length > 0 && (
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Testergebnisse
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <List>
            {logGroups.map((group, groupIndex) => (
              <React.Fragment key={groupIndex}>
                <ListItem
                  button
                  onClick={() => handleToggleExpand(group.startIndex)}
                  sx={{
                    bgcolor: group.result === undefined
                      ? 'inherit'
                      : (group.result ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)')
                  }}
                >
                  <ListItemIcon>
                    {group.result === undefined
                      ? <PlayArrowIcon />
                      : (group.result ? <CheckCircleIcon color="success" /> : <ErrorIcon color="error" />)}
                  </ListItemIcon>
                  <ListItemText primary={group.title} />
                  {expanded[group.startIndex] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItem>

                <Collapse in={expanded[group.startIndex]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {group.logs.slice(1, -1).map((log, logIndex) => (
                      <ListItem key={logIndex} sx={{ pl: 4 }}>
                        <ListItemText
                          primary={log.message}
                          primaryTypographyProps={{
                            fontFamily: 'monospace',
                            color: log.type === 'error' ? 'error.main' : 'text.primary',
                            fontSize: '0.9rem'
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>

                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default TestPanel;
