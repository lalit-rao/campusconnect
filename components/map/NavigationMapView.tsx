import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

interface NavigationMapViewProps {
  latitude: number;
  longitude: number;
  onRouteCalculated?: (routeData: any) => void;
}

const NavigationMapView: React.FC<NavigationMapViewProps> = ({ 
  latitude, 
  longitude, 
  onRouteCalculated 
}) => {
  const mapHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
          #map { height: 100vh; width: 100vw; }
          .nav-controls {
            position: absolute;
            top: 15px;
            right: 15px;
            z-index: 1000;
            background: rgba(255,255,255,0.95);
            padding: 8px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            transition: all 0.3s ease;
            max-height: 70vh;
            overflow-y: auto;
          }
          .nav-controls.collapsed {
            width: auto;
            height: auto;
            padding: 8px;
            min-width: 80px;
          }
          .nav-controls.collapsed .nav-content {
            display: none;
          }
          .toggle-nav-btn {
            background: #32B8CD;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 10px 16px;
            cursor: pointer;
            font-size: 11px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            white-space: nowrap;
            width: 100%;
          }
          .nav-content {
            margin-top: 10px;
            min-width: 220px;
          }
          .nav-title {
            margin: 0 0 15px 0;
            font-size: 16px;
            font-weight: bold;
            color: #32B8CD;
            text-align: center;
            border-bottom: 2px solid #32B8CD;
            padding-bottom: 8px;
          }
          .control-button {
            display: block;
            width: 100%;
            margin: 6px 0;
            padding: 10px 16px;
            background: linear-gradient(135deg, #32B8CD, #2a9fb5);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.2s ease;
            box-shadow: 0 2px 6px rgba(50,184,205,0.3);
          }
          .control-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(50,184,205,0.4);
            background: linear-gradient(135deg, #2a9fb5, #238a9c);
          }
          .control-button.active { 
            background: linear-gradient(135deg, #ff6b6b, #e55555);
            box-shadow: 0 2px 6px rgba(255,107,107,0.3);
          }
          .route-info {
            margin-top: 15px;
            padding: 12px;
            background: linear-gradient(135deg, #f0f8ff, #e6f3ff);
            border-radius: 8px;
            font-size: 12px;
            border-left: 4px solid #32B8CD;
            display: none;
            max-height: 200px;
            overflow-y: auto;
          }
          .click-instruction {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            z-index: 1000;
            display: none;
          }
          .quick-actions {
            position: absolute;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            display: none;
            flex-direction: column;
            gap: 10px;
          }
          .quick-btn {
            background: rgba(255,255,255,0.95);
            border: none;
            border-radius: 25px;
            width: 50px;
            height: 50px;
            cursor: pointer;
            font-size: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transition: all 0.2s ease;
          }
          .quick-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(0,0,0,0.3);
          }
          .quick-btn.clear { background: #ff6b6b; color: white; }
          .quick-btn.recenter { background: #32B8CD; color: white; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        
        <div class="nav-controls collapsed" id="nav-controls">
          <button class="toggle-nav-btn" onclick="toggleNavMenu()">Navigation</button>
          <div class="nav-content">
            <h3 class="nav-title">Campus Navigation</h3>
            <button id="nav-mode-btn" class="control-button" onclick="toggleNavigationMode()">
              Start Navigation
            </button>
            <button class="control-button" onclick="clearRoute()">Clear Route</button>
            <button class="control-button" onclick="centerMap()">Center Map</button>
            
            <div id="route-info" class="route-info">
              <strong>📍 Route Details:</strong>
              <div id="distance-time"></div>
              <div id="directions"></div>
            </div>
          </div>
        </div>
        
        <div id="click-instruction" class="click-instruction">
          Click on the map to set your starting point
        </div>
        
        <div id="quick-actions" class="quick-actions">
          <button class="quick-btn clear" onclick="clearRoute()" title="Clear Route">✕</button>
          <button class="quick-btn recenter" onclick="centerMap()" title="Center Map">🏠</button>
        </div>

        <script>
          const map = L.map('map').setView([${latitude}, ${longitude}], 16);
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
          }).addTo(map);

          let navigationMode = false;
          let startPoint = null;
          let endPoint = null;
          let currentRoute = null;
          let startMarker = null;
          let endMarker = null;
          let clickCount = 0;

          function toggleNavigationMode() {
            navigationMode = !navigationMode;
            const btn = document.getElementById('nav-mode-btn');
            const instruction = document.getElementById('click-instruction');
            const quickActions = document.getElementById('quick-actions');
            
            if (navigationMode) {
              btn.textContent = 'Stop Navigation';
              btn.classList.add('active');
              instruction.style.display = 'block';
              instruction.textContent = 'Click on the map to set your starting point';
              map.getContainer().style.cursor = 'crosshair';
              clickCount = 0;
              quickActions.style.display = 'flex';
            } else {
              btn.textContent = 'Start Navigation';
              btn.classList.remove('active');
              instruction.style.display = 'none';
              map.getContainer().style.cursor = '';
              quickActions.style.display = 'none';
              clearRoute();
            }
          }

          function clearRoute() {
            if (currentRoute) {
              map.removeLayer(currentRoute);
              currentRoute = null;
            }
            if (startMarker) {
              map.removeLayer(startMarker);
              startMarker = null;
            }
            if (endMarker) {
              map.removeLayer(endMarker);
              endMarker = null;
            }
            startPoint = null;
            endPoint = null;
            clickCount = 0;
            document.getElementById('route-info').style.display = 'none';
            
            // Auto-collapse menu after clearing
            const controls = document.getElementById('nav-controls');
            const toggleBtn = controls.querySelector('.toggle-nav-btn');
            controls.classList.add('collapsed');
            toggleBtn.innerHTML = 'Navigation';
            
            if (navigationMode) {
              document.getElementById('click-instruction').textContent = 'Click on the map to set your starting point';
            }
          }

          function toggleNavMenu() {
            const controls = document.getElementById('nav-controls');
            const toggleBtn = controls.querySelector('.toggle-nav-btn');
            controls.classList.toggle('collapsed');
            
            if (controls.classList.contains('collapsed')) {
              toggleBtn.innerHTML = 'Navigation';
            } else {
              toggleBtn.innerHTML = 'Close';
            }
          }
          
          function centerMap() {
            map.setView([${latitude}, ${longitude}], 16);
          }

          map.on('click', function(e) {
            if (!navigationMode) return;
            
            const latlng = e.latlng;
            const instruction = document.getElementById('click-instruction');
            
            if (clickCount === 0) {
              // Set start point
              startPoint = latlng;
              
              if (startMarker) map.removeLayer(startMarker);
              startMarker = L.marker([latlng.lat, latlng.lng], {
                icon: L.divIcon({
                  html: '<div style="background: #00ff00; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold; border: 3px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.4);">A</div>',
                  className: 'start-marker',
                  iconSize: [30, 30],
                  iconAnchor: [15, 15]
                })
              }).addTo(map);
              
              clickCount = 1;
              instruction.textContent = 'Now click on your destination';
              
            } else if (clickCount === 1) {
              // Set end point
              endPoint = latlng;
              
              if (endMarker) map.removeLayer(endMarker);
              endMarker = L.marker([latlng.lat, latlng.lng], {
                icon: L.divIcon({
                  html: '<div style="background: #ff0000; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold; border: 3px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.4);">B</div>',
                  className: 'end-marker',
                  iconSize: [30, 30],
                  iconAnchor: [15, 15]
                })
              }).addTo(map);
              
              instruction.textContent = 'Calculating route...';
              calculateRoute();
            }
          });

          async function calculateRoute() {
            if (!startPoint || !endPoint) return;
            
            try {
              document.getElementById('click-instruction').textContent = 'Calculating best route...';
              
              // Try OSRM API first (free and accurate)
              const osrmUrl = \`https://router.project-osrm.org/route/v1/foot/\${startPoint.lng},\${startPoint.lat};\${endPoint.lng},\${endPoint.lat}?overview=full&geometries=geojson&steps=true\`;
              
              let routeCoords = [];
              let distance = 0;
              let duration = 0;
              let steps = [];
              
              try {
                const response = await fetch(osrmUrl);
                const data = await response.json();
                
                if (data.routes && data.routes.length > 0) {
                  const route = data.routes[0];
                  
                  // Convert coordinates from [lng, lat] to [lat, lng] for Leaflet
                  routeCoords = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
                  distance = route.distance;
                  duration = Math.ceil(route.duration / 60); // Convert to minutes
                  steps = route.legs[0].steps || [];
                  
                  console.log('OSRM route found:', { distance, duration, steps: steps.length });
                } else {
                  throw new Error('No route found');
                }
              } catch (osrmError) {
                console.log('OSRM failed, using fallback:', osrmError);
                // Fallback to straight line
                routeCoords = [
                  [startPoint.lat, startPoint.lng],
                  [endPoint.lat, endPoint.lng]
                ];
                distance = map.distance(startPoint, endPoint);
                duration = Math.ceil(distance / 83.33);
              }
              
              // Remove existing route
              if (currentRoute) map.removeLayer(currentRoute);
              
              // Draw the route
              currentRoute = L.polyline(routeCoords, {
                color: '#ff0000',
                weight: 5,
                opacity: 0.8,
                dashArray: steps.length > 0 ? '' : '10, 5' // Solid line for OSRM, dashed for fallback
              }).addTo(map);
              
              // Show route info
              const routeInfo = document.getElementById('route-info');
              routeInfo.style.display = 'block';
              document.getElementById('distance-time').innerHTML = 
                'Distance: ' + Math.round(distance) + 'm<br>' +
                'Walking time: ~' + duration + ' minutes' +
                (steps.length > 0 ? '<br><span style="color: green;">✓ Optimized route</span>' : '<br><span style="color: orange;">⚠ Direct route</span>');
              
              // Generate directions
              const directions = steps.length > 0 ? generateOSRMDirections(steps) : generateSimpleDirections(startPoint, endPoint);
              document.getElementById('directions').innerHTML = directions;
              
              // Fit map to route
              map.fitBounds(currentRoute.getBounds(), {padding: [20, 20]});
              
              // Auto-expand menu to show route details
              const controls = document.getElementById('nav-controls');
              const toggleBtn = controls.querySelector('.toggle-nav-btn');
              controls.classList.remove('collapsed');
              toggleBtn.innerHTML = '✕';
              
              document.getElementById('click-instruction').textContent = 'Route calculated! Use quick buttons to clear or recenter.';
              
              // Send route data to React Native
              const routeData = {
                distance: Math.round(distance),
                duration: duration,
                start: { lat: startPoint.lat, lng: startPoint.lng },
                end: { lat: endPoint.lat, lng: endPoint.lng },
                optimized: steps.length > 0
              };
              
              window.ReactNativeWebView?.postMessage(JSON.stringify({
                type: 'route_calculated',
                data: routeData
              }));
              
            } catch (error) {
              console.error('Route calculation failed:', error);
              document.getElementById('click-instruction').textContent = 'Route calculation failed. Try again.';
            }
          }

          function generateOSRMDirections(steps) {
            let directions = '<div style="margin-top: 10px; font-size: 12px;"><strong>Turn-by-turn Directions:</strong><br>';
            
            steps.forEach((step, index) => {
              const maneuver = step.maneuver;
              let instruction = '';
              
              switch (maneuver.type) {
                case 'depart':
                  instruction = 'Start your journey';
                  break;
                case 'arrive':
                  instruction = 'You have arrived at your destination';
                  break;
                case 'turn':
                  const modifier = maneuver.modifier;
                  if (modifier === 'left') instruction = 'Turn left';
                  else if (modifier === 'right') instruction = 'Turn right';
                  else if (modifier === 'sharp left') instruction = 'Sharp left turn';
                  else if (modifier === 'sharp right') instruction = 'Sharp right turn';
                  else if (modifier === 'slight left') instruction = 'Slight left';
                  else if (modifier === 'slight right') instruction = 'Slight right';
                  else instruction = 'Continue';
                  break;
                case 'continue':
                case 'straight':
                  instruction = 'Continue straight';
                  break;
                default:
                  instruction = 'Continue';
              }
              
              if (step.name && step.name !== '') {
                instruction += ' onto ' + step.name;
              }
              
              const distance = step.distance > 0 ? ' (' + Math.round(step.distance) + 'm)' : '';
              directions += (index + 1) + '. ' + instruction + distance + '<br>';
            });
            
            directions += '<em style="color: green;">✓ Optimized campus route</em></div>';
            return directions;
          }
          
          function generateSimpleDirections(start, end) {
            const latDiff = end.lat - start.lat;
            const lngDiff = end.lng - start.lng;
            
            let primaryDirection = '';
            let secondaryDirection = '';
            
            if (Math.abs(latDiff) > Math.abs(lngDiff)) {
              primaryDirection = latDiff > 0 ? 'North' : 'South';
              secondaryDirection = lngDiff > 0 ? 'East' : 'West';
            } else {
              primaryDirection = lngDiff > 0 ? 'East' : 'West';
              secondaryDirection = latDiff > 0 ? 'North' : 'South';
            }
            
            return '<div style="margin-top: 10px; font-size: 12px;">' +
              '<strong>Direct Route:</strong><br>' +
              '1. Head ' + primaryDirection + ' from your starting point<br>' +
              '2. Continue ' + primaryDirection + ' with slight ' + secondaryDirection + ' direction<br>' +
              '3. You will arrive at your destination<br>' +
              '<em style="color: orange;">⚠ Direct route - may not follow paths</em>' +
              '</div>';
          }

          // Add some campus landmarks for reference
          const landmarks = [
            { name: 'Admin Block', lat: 26.841718837035412, lng: 75.56593724436256 },  
            { name: 'Central Library', lat: 26.841607103645604, lng: 75.5653789474624 }, 
            { name: 'Academic Block 1 (AB1)', lat: 26.842631322258132, lng:  75.56406929772466 }, 
            { name: 'Office of Directorate of Academics', lat: 26.84290134198538, lng:  75.56479456192206 },  
            { name: 'Old Mess', lat: 26.843152739083536, lng:   75.56526937517359 }, 
            { name: 'Grand Staricase', lat: 26.842500967676585, lng:  75.56553547930358 },   
            { name: 'Cricket Gorund', lat: ${latitude + 0.002}, lng: ${longitude - 0.001} },
            { name: 'Subway Collage Entrace/Exit', lat: 26.841835225865857, lng:  75.5640066849882 },
            { name: 'Academic Block 2 (AB2)', lat: 26.843460001465015, lng:  75.56568157567682 },  
            { name: 'Sharda Pai Auditorium', lat: 26.84322103278864, lng:  75.56588654315959 },  
            { name: 'Dr. TMA Pai Auditorium', lat: 26.843287069578963, lng:  75.56669225036069 },  
            { name: 'Amphitheature', lat: 26.843242691258883, lng:  75.56621476735216 },
            { name: 'Academic Block 3 (AB3)', lat: 26.843666327743033, lng:  75.56425153178799 },  
            { name: 'Vasanti R. Pai Auditorium', lat: 26.844103733706767, lng:  75.56420223457084 },
            { name: 'Lecture Hall Complex', lat: 26.844227939101547, lng:  75.56480477570997 },  
            { name: 'FootBall Ground', lat: 26.844449619720386, lng:  75.56552465807518 },  
            { name: 'Lawn Tennis Court', lat: 26.845887691213367, lng:  75.56551191679316 },  
            { name: 'BasketBall Court', lat: 26.846228733146663, lng:  75.56503411875607 },  
            { name: 'Jogging Track', lat: 26.844830454690644, lng:  75.56416134100834 },   
            { name: 'VIP Gate Entrance/Exit', lat: 26.840764733879737, lng:  75.56624378135598 },
            { name: 'MUJ Main Entrace/Exit', lat: 26.841657165147833, lng:  75.56388664437306 },  
            { name: 'Labs and Workshop', lat: 26.84364282918138, lng:  75.5670570822261 },   
            { name: 'GHS Entrance/Exit', lat: 26.841374810086258, lng:  75.56345061607912 },  
            { name: 'Boys Hostel', lat: 26.841825509798007, lng:  75.56214707404301 },  
            { name: 'Hostel Mess', lat: 26.841253653942832, lng:  75.56154961727864 },  
            { name: 'Girls Hostel', lat: 26.84072692008524, lng:   75.56297501266175 },   
            { name: 'Joggers Park', lat: 26.84011387052196, lng:   75.56327708622183 },
            { name: 'Faculty Residency', lat:  26.839717500478816, lng:    75.563798311172 },  
            { name: 'Manipal Bus Stand', lat:  26.839121413427883, lng:     75.56531951965599 },
          ]; 

          landmarks.forEach(landmark => {
            L.circle([landmark.lat, landmark.lng], {
              color: '#32B8CD',
              fillColor: '#32B8CD',
              fillOpacity: 0.3,
              radius: 10
            }).addTo(map).bindPopup(landmark.name);
          });
        </script>
      </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.type === 'route_calculated' && onRouteCalculated) {
        onRouteCalculated(message.data);
      }
    } catch (error) {
      console.log('Error parsing message:', error);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ html: mapHTML }}
        style={styles.webview}
        javaScriptEnabled={true}
        onMessage={handleMessage}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
});

export default NavigationMapView;