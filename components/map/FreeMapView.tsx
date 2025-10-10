import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';

interface FreeMapViewProps {
  latitude: number;
  longitude: number;
  locations: Array<{
    id: number;
    name: string;
    category: string;
    latitude: number;
    longitude: number;
  }>;
  onLocationPress: (location: any) => void;
}

const FreeMapView: React.FC<FreeMapViewProps> = ({ latitude, longitude, locations, onLocationPress }) => {
  const mapHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script src="https://unpkg.com/osmbuildings@3.2.3/dist/OSMBuildings-Leaflet.js"></script>
        <style>
          body { margin: 0; padding: 0; }
          #map { height: 100vh; width: 100vw; }
          .custom-popup { font-family: Arial, sans-serif; text-align: center; }
          .popup-button { 
            background: #32B8CD; 
            color: white; 
            border: none; 
            padding: 8px 16px; 
            border-radius: 4px; 
            cursor: pointer; 
            margin-top: 8px;
          }
          .map-controls {
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 1000;
            background: white;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          }
          .control-button {
            display: block;
            width: 100%;
            margin: 5px 0;
            padding: 8px;
            background: #32B8CD;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <div class="map-controls">
          <button class="control-button" onclick="toggle3D()">Toggle 3D</button>
          <button class="control-button" onclick="focusCampus()">Campus View</button>
          <button class="control-button" onclick="showNavigation()">Navigate</button>
        </div>
        
        <div id="navigation-panel" style="
          position: absolute;
          top: 20px;
          left: 20px;
          background: white;
          padding: 15px;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          z-index: 1001;
          min-width: 250px;
          display: none;
        ">
          <h3 style="margin: 0 0 10px 0; color: #333;">Campus Navigation</h3>
          
          <label style="display: block; margin: 5px 0; font-weight: bold;">From:</label>
          <select id="from-location" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            <option value="">Select starting point</option>
          </select>
          
          <label style="display: block; margin: 10px 0 5px 0; font-weight: bold;">To:</label>
          <select id="to-location" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            <option value="">Select destination</option>
          </select>
          
          <div style="margin-top: 15px;">
            <button onclick="calculateRoute()" style="background: #32B8CD; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; margin-right: 5px;">Get Route</button>
            <button onclick="clearRoute()" style="background: #ff6b6b; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; margin-right: 5px;">Clear</button>
            <button onclick="hideNavigation()" style="background: #666; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">X</button>
          </div>
          
          <div id="route-info" style="margin-top: 10px; padding: 10px; background: #f0f8ff; border-radius: 5px; display: none;">
            <strong>Route Details:</strong>
            <div id="distance-time"></div>
            <div id="directions"></div>
          </div>
        </div>
        <script>
          const map = L.map('map').setView([${latitude}, ${longitude}], 17);
          let buildings3D;
          let is3DEnabled = false;
          
          const streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
          }).addTo(map);

          const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles © Esri',
            maxZoom: 18
          });

          function init3DBuildings() {
            if (!buildings3D) {
              buildings3D = new OSMBuildings(map).load();
              buildings3D.style({
                color: '#E8E0D4',
                wallColor: '#D4C4B0',
                roofColor: '#C4B49A',
                shadows: true
              });
            }
          }

          function toggle3D() {
            if (!is3DEnabled) {
              init3DBuildings();
              map.setZoom(18);
              is3DEnabled = true;
            } else {
              if (buildings3D) {
                buildings3D.remove();
                buildings3D = null;
              }
              is3DEnabled = false;
            }
          }

          function focusCampus() {
            map.setView([${latitude}, ${longitude}], 17);
            if (is3DEnabled && buildings3D) {
              buildings3D.load();
            }
          }

          const baseMaps = {
            "Street Map": streetMap,
            "Satellite": satellite
          };

          L.control.layers(baseMaps).addTo(map);

          const campusBounds = [
            [26.8410, 75.5620],
            [26.8460, 75.5680]
          ];
          
          L.rectangle(campusBounds, {
            color: '#32B8CD',
            weight: 2,
            fillOpacity: 0.1
          }).addTo(map).bindPopup('Manipal University Jaipur Campus');

          const locations = ${JSON.stringify(locations)};
          
          // 🎨 CUSTOMIZE YOUR MARKERS HERE
          const buildingIcons = {
            'Libraries': '📚',
            'Cafeterias': '🍽️', 
            'Departments': '🎓',
            'Dorms': '🏠',
            'Offices': '🏛️'
          };
          
          // 🎨 CUSTOMIZE MARKER COLORS BY CATEGORY
          const markerColors = {
            'Libraries': '#8B4513',     // Brown
            'Cafeterias': '#FF6347',    // Orange
            'Departments': '#4682B4',   // Blue  
            'Dorms': '#9370DB',         // Purple
            'Offices': '#228B22'        // Green
          };
          
          locations.forEach(location => {
            const icon = buildingIcons[location.category] || '📍';
            const color = markerColors[location.category] || '#32B8CD';
            
            // 🎨 CUSTOMIZE MARKER STYLE HERE
            const customIcon = L.divIcon({
              html: \`
                <div style="
                  background: \${color}; 
                  color: white; 
                  border-radius: 50%; 
                  width: 35px; 
                  height: 35px; 
                  display: flex; 
                  align-items: center; 
                  justify-content: center; 
                  font-size: 18px; 
                  border: 3px solid white; 
                  box-shadow: 0 3px 8px rgba(0,0,0,0.4);
                  cursor: pointer;
                  transition: all 0.3s ease;
                " 
                onmouseover="this.style.transform='scale(1.2)'" 
                onmouseout="this.style.transform='scale(1)'"
                >\${icon}</div>
              \`,
              className: 'custom-marker',
              iconSize: [35, 35],
              iconAnchor: [17, 17]
            });
            
            const marker = L.marker([location.latitude, location.longitude], { icon: customIcon })
              .addTo(map)
              .bindPopup(\`
                <div class="custom-popup" style="min-width: 200px;">
                  <div style="background: \${color}; color: white; padding: 8px; margin: -8px -8px 8px -8px; border-radius: 4px 4px 0 0;">
                    <b>\${location.name}</b>
                  </div>
                  <p style="margin: 5px 0; color: #666;">\${location.category}</p>
                  <p style="margin: 5px 0; font-size: 12px; color: #999;">Manipal University Jaipur</p>
                  <button class="popup-button" onclick="window.ReactNativeWebView.postMessage(JSON.stringify(location))" 
                    style="background: \${color}; width: 100%; margin-top: 10px;">
                    🎯 Navigate Here
                  </button>
                </div>
              \`, {
                maxWidth: 250,
                className: 'custom-popup-container'
              });
          });

          let currentRoute = null;
          let routeControl = null;
          
          // Populate navigation dropdowns
          function populateDropdowns() {
            const fromSelect = document.getElementById('from-location');
            const toSelect = document.getElementById('to-location');
            
            locations.forEach(location => {
              const option1 = document.createElement('option');
              option1.value = JSON.stringify({lat: location.latitude, lng: location.longitude, name: location.name});
              option1.textContent = location.name;
              fromSelect.appendChild(option1);
              
              const option2 = document.createElement('option');
              option2.value = JSON.stringify({lat: location.latitude, lng: location.longitude, name: location.name});
              option2.textContent = location.name;
              toSelect.appendChild(option2);
            });
          }
          
          function showNavigation() {
            document.getElementById('navigation-panel').style.display = 'block';
          }
          
          function hideNavigation() {
            document.getElementById('navigation-panel').style.display = 'none';
            clearRoute();
          }
          
          function calculateRoute() {
            const fromSelect = document.getElementById('from-location');
            const toSelect = document.getElementById('to-location');
            
            if (!fromSelect.value || !toSelect.value) {
              alert('Please select both starting point and destination');
              return;
            }
            
            const from = JSON.parse(fromSelect.value);
            const to = JSON.parse(toSelect.value);
            
            // Clear existing route
            clearRoute();
            
            // Create route line
            const routeCoords = [from, to];
            currentRoute = L.polyline(routeCoords, {
              color: '#ff0000',
              weight: 4,
              opacity: 0.8,
              dashArray: '10, 5'
            }).addTo(map);
            
            // Add start and end markers
            const startMarker = L.marker([from.lat, from.lng], {
              icon: L.divIcon({
                html: '<div style="background: #00ff00; color: white; border-radius: 50%; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">S</div>',
                className: 'route-marker',
                iconSize: [25, 25],
                iconAnchor: [12, 12]
              })
            }).addTo(map).bindPopup('Start: ' + from.name);
            
            const endMarker = L.marker([to.lat, to.lng], {
              icon: L.divIcon({
                html: '<div style="background: #ff0000; color: white; border-radius: 50%; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">E</div>',
                className: 'route-marker',
                iconSize: [25, 25],
                iconAnchor: [12, 12]
              })
            }).addTo(map).bindPopup('Destination: ' + to.name);
            
            // Calculate distance
            const distance = map.distance([from.lat, from.lng], [to.lat, to.lng]);
            const walkingTime = Math.ceil(distance / 83.33); // Average walking speed 5km/h = 83.33 m/min
            
            // Show route info
            document.getElementById('route-info').style.display = 'block';
            document.getElementById('distance-time').innerHTML = 
              'Distance: ' + Math.round(distance) + 'm<br>' +
              'Walking time: ~' + walkingTime + ' minutes';
            
            // Simple directions
            const directions = generateDirections(from, to);
            document.getElementById('directions').innerHTML = directions;
            
            // Fit map to route
            map.fitBounds(currentRoute.getBounds(), {padding: [20, 20]});
            
            // Store route markers for cleanup
            currentRoute.startMarker = startMarker;
            currentRoute.endMarker = endMarker;
          }
          
          function generateDirections(from, to) {
            const latDiff = to.lat - from.lat;
            const lngDiff = to.lng - from.lng;
            
            let direction = '';
            if (Math.abs(latDiff) > Math.abs(lngDiff)) {
              direction = latDiff > 0 ? 'Head North' : 'Head South';
            } else {
              direction = lngDiff > 0 ? 'Head East' : 'Head West';
            }
            
            return '<div style="margin-top: 10px;">' +
              '<strong>Directions:</strong><br>' +
              '1. ' + direction + ' from ' + from.name + '<br>' +
              '2. Walk straight to ' + to.name + '<br>' +
              '3. You have arrived at your destination!' +
              '</div>';
          }
          
          function clearRoute() {
            if (currentRoute) {
              map.removeLayer(currentRoute);
              if (currentRoute.startMarker) map.removeLayer(currentRoute.startMarker);
              if (currentRoute.endMarker) map.removeLayer(currentRoute.endMarker);
              currentRoute = null;
            }
            document.getElementById('route-info').style.display = 'none';
          }
          
          // Initialize dropdowns
          populateDropdowns();
          
          setTimeout(() => {
            toggle3D();
          }, 1000);
        </script>
      </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    try {
      const location = JSON.parse(event.nativeEvent.data);
      onLocationPress(location);
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

export default FreeMapView;