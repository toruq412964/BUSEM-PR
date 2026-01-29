import React, { useState, useRef, useEffect } from 'react';
import { Box, Paper, Tooltip } from '@mui/material';
import { LocationOn, TransferWithinAStation } from '@mui/icons-material';

const ModelingCanvas = ({ elements, onElementSelect, onElementUpdate, mode, locations = [] }) => {
  const canvasRef = useRef(null);
  const [dragging, setDragging] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e, element) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setDragging(element.id);
    setOffset({
      x: x - element.position.x,
      y: y - element.position.y
    });
    onElementSelect(element);
    e.stopPropagation();
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const updatedElements = elements.map(element => {
      if (element.id === dragging) {
        return {
          ...element,
          position: {
            x: x - offset.x,
            y: y - offset.y
          }
        };
      }
      return element;
    });
    
    const updatedElement = updatedElements.find(element => element.id === dragging);
    onElementUpdate(updatedElement);
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const handleCanvasClick = () => {
    onElementSelect(null);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [dragging, offset]);

  // Hilfsfunktion zum Finden eines Standorts anhand seiner ID
  const getLocationById = (locationId) => {
    return locations.find(location => location.id === locationId);
  };

  // Hilfsfunktion zum Rendern von Standortinformationen für ein Element
  const renderLocationInfo = (element) => {
    if (!element.properties || !element.properties.locationId) return null;
    
    const location = getLocationById(element.properties.locationId);
    if (!location) return null;
    
    return (
      <div className="location-indicator">
        <LocationOn fontSize="small" color="secondary" />
        <span>{location.text}</span>
      </div>
    );
  };

  // Hilfsfunktion zum Rendern von Guards für Funktionszustände
  const renderGuards = (element) => {
    if (!element.properties || !element.properties.requiresLocation || !element.properties.locationGuard) return null;
    
    const location = getLocationById(element.properties.locationGuard);
    if (!location) return null;
    
    return (
      <div className="guard-indicator">
        <span>Guard: Ort = {location.text}</span>
      </div>
    );
  };

  const renderElement = (element) => {
    switch (element.type) {
      case 'location':
        return (
          <div 
            key={element.id}
            className="element location"
            style={{
              left: element.position.x,
              top: element.position.y,
              width: element.size.width,
              height: element.size.height
            }}
            onMouseDown={(e) => handleMouseDown(e, element)}
          >
            <div className="location-header">
              <LocationOn color="secondary" />
              <span>{element.text}</span>
            </div>
            <div className="location-identifier">
              {element.properties.identifier || ''}
            </div>
          </div>
        );
      
      case 'location-transition':
        const sourceLocation = getLocationById(element.properties.sourceLocationId);
        const targetLocation = getLocationById(element.properties.targetLocationId);
        
        return (
          <div 
            key={element.id}
            className="element location-transition"
            style={{
              left: element.position.x,
              top: element.position.y,
              width: element.size.width,
              height: element.size.height
            }}
            onMouseDown={(e) => handleMouseDown(e, element)}
          >
            <div className="transition-header">
              <TransferWithinAStation color="secondary" />
              <span>{element.text}</span>
            </div>
            <div className="transition-details">
              {sourceLocation && targetLocation && (
                <span>
                  {sourceLocation.text} → {targetLocation.text}
                </span>
              )}
              {element.properties.transitionTime > 0 && (
                <span className="transition-time">
                  {element.properties.transitionTime} Min.
                </span>
              )}
            </div>
          </div>
        );
      
      case 'subject':
        return (
          <Tooltip title={element.properties.isMobile ? "Mobiles Subjekt" : ""} arrow>
            <div 
              key={element.id}
              className={`element subject ${element.properties.isMobile ? 'mobile-subject' : ''}`}
              style={{
                left: element.position.x,
                top: element.position.y,
                width: element.size.width,
                height: element.size.height
              }}
              onMouseDown={(e) => handleMouseDown(e, element)}
            >
              {element.text}
              {renderLocationInfo(element)}
            </div>
          </Tooltip>
        );
      
      case 'spatial-subject':
        return (
          <Tooltip title={element.properties.isMobile ? "Mobiles räumliches Subjekt" : ""} arrow>
            <div 
              key={element.id}
              className={`element spatial-subject ${element.properties.isMobile ? 'mobile-subject' : ''}`}
              style={{
                left: element.position.x,
                top: element.position.y,
                width: element.size.width,
                height: element.size.height
              }}
              onMouseDown={(e) => handleMouseDown(e, element)}
            >
              {element.text}
              {renderLocationInfo(element)}
              {element.properties.perceptionRange && (
                <div 
                  className="perception-area"
                  style={{
                    left: element.size.width / 2,
                    top: element.size.height / 2,
                    width: element.properties.perceptionRange * 2,
                    height: element.properties.perceptionRange * 2,
                    transform: `translate(-50%, -50%)`
                  }}
                />
              )}
            </div>
          </Tooltip>
        );
      
      case 'function-state':
        const isLocationTransition = element.properties && element.properties.isLocationTransition;
        
        return (
          <div 
            key={element.id}
            className={`element function-state ${isLocationTransition ? 'location-transition-state' : ''}`}
            style={{
              left: element.position.x,
              top: element.position.y,
              width: element.size.width,
              height: element.size.height
            }}
            onMouseDown={(e) => handleMouseDown(e, element)}
          >
            {element.text}
            {renderGuards(element)}
            {isLocationTransition && (
              <div className="transition-indicator">
                <TransferWithinAStation fontSize="small" color="secondary" />
              </div>
            )}
          </div>
        );
      
      case 'spatial-function-state':
        const isSpatialLocationTransition = element.properties && element.properties.isLocationTransition;
        
        return (
          <div 
            key={element.id}
            className={`element spatial-function-state ${isSpatialLocationTransition ? 'location-transition-state' : ''}`}
            style={{
              left: element.position.x,
              top: element.position.y,
              width: element.size.width,
              height: element.size.height
            }}
            onMouseDown={(e) => handleMouseDown(e, element)}
          >
            {element.text}
            {renderGuards(element)}
            {isSpatialLocationTransition && (
              <div className="transition-indicator">
                <TransferWithinAStation fontSize="small" color="secondary" />
              </div>
            )}
          </div>
        );
      
      case 'message':
        return (
          <div 
            key={element.id}
            className={`element message ${element.properties.includesLocation ? 'location-message' : ''}`}
            style={{
              left: element.position.x,
              top: element.position.y,
              width: element.size.width,
              height: element.size.height
            }}
            onMouseDown={(e) => handleMouseDown(e, element)}
          >
            {element.text}
            {element.properties.includesLocation && renderLocationInfo(element)}
          </div>
        );
      
      case 'spatial-message':
        return (
          <div 
            key={element.id}
            className={`element spatial-message ${element.properties.includesLocation ? 'location-message' : ''}`}
            style={{
              left: element.position.x,
              top: element.position.y,
              width: element.size.width,
              height: element.size.height
            }}
            onMouseDown={(e) => handleMouseDown(e, element)}
          >
            {element.text}
            {element.properties.includesLocation && renderLocationInfo(element)}
          </div>
        );
      
      case 'room-container':
        return (
          <div 
            key={element.id}
            className="element room-container"
            style={{
              left: element.position.x,
              top: element.position.y,
              width: element.size.width,
              height: element.size.height
            }}
            onMouseDown={(e) => handleMouseDown(e, element)}
          >
            <div style={{ padding: '8px', fontWeight: 'bold' }}>
              {element.text}
            </div>
            {renderLocationInfo(element)}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Paper 
      ref={canvasRef}
      onClick={handleCanvasClick}
      style={{ 
        width: '100%', 
        height: '100%', 
        position: 'relative',
        backgroundColor: mode === 'spatial' ? '#f0f7ff' : (mode === 'location' ? '#f5f5f5' : '#ffffff')
      }}
    >
      {elements.map(renderElement)}
    </Paper>
  );
};

export default ModelingCanvas;
