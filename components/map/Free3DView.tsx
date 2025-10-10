import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

interface Free3DViewProps {
  latitude: number;
  longitude: number;
  locationName: string;
}

const Free3DView: React.FC<Free3DViewProps> = ({ latitude, longitude, locationName }) => {
  // 🔑 REPLACE WITH YOUR MAPBOX TOKEN (FREE - Get from mapbox.com)
  const MAPBOX_TOKEN = 'pk.eyJ1IjoidmVlcmpuNjgwNSIsImEiOiJjbWdndW5sdHkwMWRuMmtzNzFxbXNuaDJxIn0.XHZlN1I06ZS2B33CGMc7Hg';
  
  const mapHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script src="https://unpkg.com/osmbuildings@3.2.3/dist/OSMBuildings-Leaflet.js"></script>
        <style>
          body { margin: 0; padding: 0; background: #000; }
          #map { height: 100vh; width: 100vw; }
          .info-panel {
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 15px;
            border-radius: 10px;
            font-family: Arial, sans-serif;
            z-index: 1000;
            max-width: 250px;
          }
          .controls {
            position: absolute;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
          }
          .control-btn {
            display: block;
            margin: 5px 0;
            padding: 10px 15px;
            background: #32B8CD;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="info-panel">
          <h3>${locationName}</h3>
          <p>Manipal University Jaipur</p>
          <p>3D Campus View</p>
        </div>
        <div class="controls">
          <button class="control-btn" onclick="toggleView()">Switch View</button>
          <button class="control-btn" onclick="resetView()">Reset</button>
        </div>
        <div id='map'></div>
        <script>
          const map = L.map('map', {
            center: [${latitude}, ${longitude}],
            zoom: 19,
            zoomControl: false
          });
          
          let currentView = 'satellite';
          
          const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles © Esri',
            maxZoom: 20
          }).addTo(map);
          
          const street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
          });
          
          const buildings = new OSMBuildings(map).load();
          buildings.style({
            color: '#E8E0D4',
            wallColor: '#D4C4B0',
            roofColor: '#C4B49A',
            shadows: true,
            outline: true
          });
          
          const marker = L.marker([${latitude}, ${longitude}], {
            icon: L.divIcon({
              html: '<div style="background: #FF0000; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">📍</div>',
              className: 'custom-marker',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })
          }).addTo(map);
          
          function toggleView() {
            if (currentView === 'satellite') {
              map.removeLayer(satellite);
              street.addTo(map);
              currentView = 'street';
            } else {
              map.removeLayer(street);
              satellite.addTo(map);
              currentView = 'satellite';
            }
          }
          
          function resetView() {
            map.setView([${latitude}, ${longitude}], 19);
          }
          
          map.addControl(L.control.zoom({ position: 'topleft' }));
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        source={{ html: mapHTML }}
        style={styles.webview}
        javaScriptEnabled={true}
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

export default Free3DView;