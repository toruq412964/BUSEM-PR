# Analyse der Szenario-Anforderungen

## Übersicht des Szenarios
Das vom Benutzer beschriebene Szenario umfasst einen Prozess zwischen einem Techniker (Subjekt A) und einer Maschine (Subjekt B), die sich an unterschiedlichen Standorten befinden. Der Prozess beinhaltet einen Ortswechsel des Technikers und ortsabhängige Aktionen.

## Identifizierte räumliche Elemente

### Standorte
1. **Werkstatt** - Ausgangsstandort des Technikers
2. **Produktionshalle** - Standort der Maschine (mit spezifischer ID #45125)

### Subjekte mit Standortinformationen
1. **Techniker (Subjekt A)**
   - Startstandort: Werkstatt
   - Fähigkeit zum Ortswechsel

2. **Maschine (Subjekt B)**
   - Fester Standort: Produktionshalle #45125

### Räumliche Prozesselemente
1. **Ortsbezogene Nachrichten**
   - "Störung mit Ort" - enthält Standortinformation
   - "Bin vor Ort" - impliziert Standortinformation

2. **Ortswechsel als Prozessschritt**
   - "Wechsle Standort zu Produktionshalle"
   - Transitzeit oder Event "Angekommen" als Übergang

3. **Ortsabhängige Guards**
   - "Reparatur durchführen" nur möglich, wenn Ort == Produktionshalle

## Anforderungen an den Prototyp

1. **Erweiterung des Subjektmodells**
   - Hinzufügen von Standortattributen zu Subjekten
   - Unterscheidung zwischen stationären und mobilen Subjekten

2. **Erweiterung des Nachrichtenmodells**
   - Integration von Standortinformationen in Nachrichten
   - Visualisierung von ortsbezogenen Nachrichten

3. **Implementierung von Ortswechseln**
   - Modellierung von Ortswechseln als spezielle Funktionszustände
   - Berücksichtigung von Transitzeiten oder Ereignissen für den Abschluss eines Ortswechsels

4. **Implementierung von ortsabhängigen Guards**
   - Hinzufügen von Standortbedingungen zu Funktionszuständen
   - Visualisierung von Guards in der Benutzeroberfläche

5. **Visualisierung von Standorten**
   - Darstellung verschiedener Standorte im Modell
   - Visualisierung der aktuellen Position von Subjekten

6. **Prozessablauf mit räumlicher Dimension**
   - Integration der räumlichen Dimension in den Prozessablauf
   - Berücksichtigung von Standorten bei der Prozessausführung

## Notwendige Änderungen am Prototyp

1. **Datenmodell**
   - Erweiterung der Subjektklasse um Standortattribute
   - Erweiterung der Nachrichtenklasse um Standortattribute
   - Erweiterung der Funktionszustandsklasse um Standortbedingungen
   - Implementierung einer Standortklasse

2. **Benutzeroberfläche**
   - Hinzufügen von Standortinformationen zu Subjekten in der Benutzeroberfläche
   - Visualisierung von Standorten und Standortwechseln
   - Erweiterung des Eigenschafteneditors um Standortattribute
   - Implementierung einer Standortansicht

3. **Prozesslogik**
   - Implementierung von Standortwechseln als spezielle Funktionszustände
   - Integration von Standortbedingungen in die Prozessausführung
   - Berücksichtigung von Standorten bei der Nachrichtenübermittlung

4. **Beispielszenario**
   - Implementierung des beschriebenen Techniker-Maschine-Szenarios als Beispiel
   - Demonstration der räumlichen Dimension im Prozessablauf
