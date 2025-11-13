# Dokumentation: Erweiterung von subjektorientierten Prozessmodellen um eine räumliche Dimension

## Übersicht

Diese Dokumentation beschreibt die konzeptionelle Erweiterung von subjektorientierten Prozessmodellen (S-BPM) um eine räumliche Dimension und deren prototypische Implementierung in einem web-basierten Modellierungswerkzeug. Die Erweiterung ermöglicht die Modellierung von Prozessen, die in einem räumlichen Kontext stattfinden, und adressiert Fragen wie:

- In welchem räumlichen Kontext findet ein Prozess statt?
- Wie ist dieser Raum ausgestaltet?
- Wie verändert er sich im Rahmen des Prozessablaufes?
- Wo in diesem Raum befinden sich die beteiligten Akteure und Objekte zu gewissen Zeitpunkten?
- In welchen räumlichen Relationen zueinander stehen sie?

## Konzeptionelles Framework

### Grundlegende Erweiterungen

Die räumliche Erweiterung von S-BPM umfasst folgende Kernkonzepte:

1. **Standorte**: Physische oder virtuelle Orte, an denen Prozessaktivitäten stattfinden können.
2. **Räumliche Subjekte**: Subjekte mit Standortinformationen, die sich zwischen Standorten bewegen können.
3. **Standortwechsel**: Übergänge von Subjekten zwischen verschiedenen Standorten.
4. **Standortbezogene Guards**: Bedingungen, die den Standort eines Subjekts für die Ausführung einer Funktion voraussetzen.
5. **Standortbezogene Nachrichten**: Nachrichten, die Standortinformationen enthalten oder deren Übermittlung an Standortbedingungen geknüpft ist.

### Datenmodell

Das Datenmodell wurde um folgende Klassen und Eigenschaften erweitert:

- **Location**: Repräsentiert einen Standort mit Typ, Identifikator und Beschreibung.
- **Subject**: Erweitert um Standortattribute (locationId, isMobile, currentLocationId, startLocationId).
- **FunctionState**: Erweitert um standortbezogene Guards (locationGuard, requiresLocation) und Standortwechsel-Eigenschaften (isLocationTransition, targetLocationId, transitionTime, transitionEvent).
- **Message**: Erweitert um Standortinformationen (includesLocation, locationId, requiresSameLocation).
- **LocationTransition**: Spezielle Klasse für Standortwechsel mit Quell- und Zielstandort.

## Implementierung

### Architektur

Die Implementierung basiert auf einer React-Anwendung mit folgenden Hauptkomponenten:

1. **App**: Hauptkomponente, die das Gesamtlayout und die Verwaltung der Modellelemente steuert.
2. **ModelingCanvas**: Visualisiert die Prozessmodelle mit räumlichen Elementen.
3. **ElementPalette**: Bietet Zugriff auf die verschiedenen Modellelemente, einschließlich der neuen räumlichen Elemente.
4. **PropertiesPanel**: Ermöglicht die Bearbeitung von Elementeigenschaften, einschließlich räumlicher Attribute.
5. **LocationInfoPanel**: Zeigt standortbezogene Informationen für ausgewählte Elemente an.
6. **FunctionStateGuardPanel**: Visualisiert und validiert standortbezogene Guards für Funktionszustände.
7. **MessageLocationPanel**: Zeigt Standortinformationen in Nachrichten an und validiert standortbezogene Nachrichtenbedingungen.
8. **TestPanel**: Ermöglicht das Testen der räumlichen Funktionalitäten anhand des Techniker-Maschine-Szenarios.

### Ansichten

Der Prototyp bietet vier verschiedene Ansichten:

1. **Prozessansicht**: Zeigt die klassischen S-BPM-Elemente ohne räumliche Erweiterungen.
2. **Raumansicht**: Fokussiert auf räumliche Elemente wie räumliche Subjekte und Raumcontainer.
3. **Standortansicht**: Zeigt Standorte und Standortwechsel.
4. **Integrierte Ansicht**: Kombiniert alle Elemente in einer Gesamtansicht.

### Funktionalitäten

Die implementierten Funktionalitäten umfassen:

1. **Standortverwaltung**: Erstellen, Bearbeiten und Löschen von Standorten.
2. **Subjektlokalisierung**: Zuweisen von Standorten zu Subjekten und Kennzeichnung mobiler Subjekte.
3. **Standortwechsel**: Modellierung von Übergängen zwischen Standorten mit Transitzeiten und Ereignissen.
4. **Standort-Guards**: Definition von standortabhängigen Bedingungen für Funktionszustände.
5. **Standortbezogene Nachrichten**: Integration von Standortinformationen in Nachrichten.
6. **Validierung**: Überprüfung der Einhaltung von Standortbedingungen.
7. **Testen**: Automatisierte Tests für räumliche Funktionalitäten.

## Beispielszenario: Techniker-Maschine

Das implementierte Beispielszenario demonstriert die räumlichen Erweiterungen anhand eines Prozesses zwischen einem Techniker und einer Maschine:

### Standorte
- **Werkstatt**: Ausgangsstandort des Technikers
- **Produktionshalle**: Standort der Maschine (mit ID #45125)

### Subjekte
- **Techniker**: Mobiles Subjekt, startet in der Werkstatt
- **Maschine**: Stationäres Subjekt in der Produktionshalle

### Prozessablauf
1. Die Maschine sendet eine Störungsmeldung mit Standortinformation an den Techniker.
2. Der Techniker empfängt die Nachricht und wechselt den Standort zur Produktionshalle.
3. Nach Ankunft sendet der Techniker eine "Bin vor Ort"-Nachricht an die Maschine.
4. Der Techniker führt die Reparatur durch (nur möglich am Standort der Maschine).
5. Der Techniker sendet eine Abschlussmeldung an die Maschine.

### Räumliche Aspekte
- **Standortwechsel**: Der Techniker wechselt von der Werkstatt zur Produktionshalle.
- **Standort-Guards**: Die Reparatur kann nur durchgeführt werden, wenn der Techniker sich in der Produktionshalle befindet.
- **Standortbezogene Nachrichten**: Die Störungsmeldung enthält Standortinformationen, während die "Bin vor Ort"-Nachricht erfordert, dass Sender und Empfänger am gleichen Standort sind.

## Testen und Validierung

Der Prototyp enthält ein integriertes Testsystem, das die korrekte Funktionsweise der räumlichen Erweiterungen überprüft:

1. **Standortüberprüfung**: Testet, ob Subjekte sich an den richtigen Standorten befinden.
2. **Guard-Validierung**: Überprüft, ob Funktionszustände nur an den vorgesehenen Standorten ausgeführt werden können.
3. **Standortwechsel-Tests**: Validiert die korrekte Durchführung von Standortwechseln.
4. **Nachrichtenübermittlung**: Testet die Einhaltung von Standortbedingungen bei der Nachrichtenübermittlung.

## Fazit und Ausblick

Die implementierte räumliche Erweiterung von S-BPM ermöglicht die Modellierung von Prozessen mit explizitem räumlichen Bezug. Dies ist besonders relevant für Szenarien wie Mensch-Maschine-Teams (HMT), in denen die räumliche Dimension eine wesentliche Rolle spielt.

Zukünftige Erweiterungen könnten folgende Aspekte umfassen:

1. **Dynamische Raumveränderungen**: Modellierung von Veränderungen der Raumstruktur während des Prozessablaufs.
2. **Räumliche Simulation**: Simulation der Bewegung von Subjekten im Raum.
3. **3D-Visualisierung**: Dreidimensionale Darstellung der räumlichen Prozessmodelle.
4. **Integration mit Positionierungssystemen**: Anbindung an reale Positionsdaten aus IoT-Geräten oder Indoor-Positionierungssystemen.

Die entwickelte Erweiterung bietet eine solide Grundlage für die weitere Forschung und Entwicklung im Bereich der räumlichen Prozessmodellierung und kann als Ausgangspunkt für domänenspezifische Anpassungen dienen.
