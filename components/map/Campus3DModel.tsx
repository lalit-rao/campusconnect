import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

interface Campus3DModelProps {
  selectedBuilding?: string;
  onBuildingClick?: (building: string) => void;
}

const Campus3DModel: React.FC<Campus3DModelProps> = ({ selectedBuilding, onBuildingClick }) => {
  const html3D = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { margin: 0; padding: 0; overflow: hidden; font-family: Arial, sans-serif; }
          #streetview { width: 100vw; height: 100vh; }
          .controls {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            background: rgba(255,255,255,0.95);
            color: #333;
            padding: 16px;
            border-top: 1px solid #E0E0E0;
            border-radius: 12px 12px 0 0;
            transition: all 0.3s ease;
            max-height: 60vh;
            overflow-y: auto;
          }
          .controls.collapsed {
            padding: 12px 16px;
            max-height: 60px;
          }
          .controls.collapsed .menu-content {
            display: none;
          }
          .toggle-btn {
            background: #32B8CD;
            color: white;
            border: none;
            border-radius: 8px;
            width: 100%;
            height: 40px;
            cursor: pointer;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            margin-bottom: 10px;
          }
          .menu-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 8px;
          }
          .menu-title {
            margin: 0 0 15px 0;
            font-size: 16px;
            font-weight: bold;
            color: #32B8CD;
            text-align: center;
            border-bottom: 2px solid #32B8CD;
            padding-bottom: 8px;
          }
          .btn {
            padding: 12px 16px;
            background: linear-gradient(135deg, #32B8CD, #2a9fb5);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.2s ease;
            box-shadow: 0 2px 6px rgba(50,184,205,0.3);
            text-align: center;
          }
          .btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(50,184,205,0.4);
            background: linear-gradient(135deg, #2a9fb5, #238a9c);
          }
          .location-info {
            margin-top: 15px;
            padding: 12px;
            background: linear-gradient(135deg, #f0f8ff, #e6f3ff);
            border-radius: 8px;
            font-size: 12px;
            border-left: 4px solid #32B8CD;
          }
          .current-location {
            font-weight: bold;
            color: #32B8CD;
            margin-top: 5px;
          }
        </style>
      </head>
      <body>
        <div class="controls collapsed" id="controls">
          <button class="toggle-btn" onclick="toggleMenu()">
            <span id="toggle-text">📍 Select Campus Location</span>
          </button>
          <div class="menu-content">
            <button class="btn" onclick="goToMainGate()">Main Gate</button>
            <button class="btn" onclick="goToEngineering()">VIP Gate and Dome</button>
            <button class="btn" onclick="goToHostel()">Hostel Area</button>
            <button class="btn" onclick="goToCafeteria()">Main Road</button>
            <button class="btn" onclick="goToLowerGroundAB2()">Lower Ground AB2</button>
            <button class="btn" onclick="goToREcreationalBlock()">GHS Recreational Block</button>
            <button class="btn" onclick="goToREcreationalBlock()">Department of Hotel Mangement</button>
            <button class="btn" onclick="goToFacultyofDesing()">Faculty of Design</button>
            <button class="btn" onclick="goToGHSReceptionandMess()">GHS Reception and Mess</button>
            <button class="btn" onclick="goToGrandStaricase()">GradnStairs</button>
            <button class="btn" onclick="goToBasketBallCourt()">Basket Ball Court</button>
            <button class="btn" onclick="goToDomeCafe()">Dome Cafeteria</button>
            <div class="location-info">
              <strong>📍 Current View:</strong>
              <div id="current-location" class="current-location">Campus Overview</div>
            </div>
          </div>
        </div>
        
        <iframe 
          id="streetview"
          src="https://www.google.com/maps/embed?pb=!4v1759948287633!6m8!1m7!1sfz7S2bbN5f-4cEZV1MKqfg!2m2!1d26.84151480744702!2d75.56381664697473!3f58.59922933756116!4f-19.201312639214578!5f0.7820865974627469'
        },
          width="100%" 
          height="100%" 
          style="border:0;" 
          allowfullscreen="" 
          loading="lazy" 
          referrerpolicy="no-referrer-when-downgrade">
        </iframe>
        
        <script>
          const locations = {
            mainGate: {
              name: 'Main Gate',
              embed: 'https://www.google.com/maps/embed?pb=!4v1703123456789!6m8!1m7!1sCAoSLEFGMVFpcE5fVXJHVkVqVkVqVkVqVkVqVkVqVkVqVkVqVkVqVkVqVkVq!2m2!1d26.8420!2d75.5635!3f0!4f0!5f0.7820865974627469'
            },
            library: {
              name: 'Central Library',
              embed: 'https://www.google.com/maps/embed?pb=!4v1703123456790!6m8!1m7!1sCAoSLEFGMVFpcE5fVXJHVkVqVkVqVkVqVkVqVkVqVkVqVkVqVkVqVkVqVkVq!2m2!1d26.8429!2d75.5644!3f90!4f0!5f0.7820865974627469'
            },
            engineering: {
              name: 'Engineering Block',
              embed: 'https://www.google.com/maps/embed?pb=!4v1703123456791!6m8!1m7!1sCAoSLEFGMVFpcE5fVXJHVkVqVkVqVkVqVkVqVkVqVkVqVkVqVkVqVkVqVkVq!2m2!1d26.8440!2d75.5655!3f180!4f0!5f0.7820865974627469'
            },
            admin: {
              name: 'Admin Block',
              embed: 'https://www.google.com/maps/embed?pb=!4v1703123456792!6m8!1m7!1sCAoSLEFGMVFpcE5fVXJHVkVqVkVqVkVqVkVqVkVqVkVqVkVqVkVqVkVqVkVq!2m2!1d26.8430!2d75.5645!3f270!4f0!5f0.7820865974627469'
            },
            hostel: {
              name: 'Hostel Area',
              embed: 'https://www.google.com/maps/embed?pb=!4v1759941846669!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQzhxNjNNd1FF!2m2!1d26.84380912325838!2d75.56521189929356!3f122.55006135198802!4f-18.73368227857479!5f0.7820865974627469'
            },
            cafeteria: {
              name: 'Main Road',
              embed: 'https://www.google.com/maps/embed?pb=!4v1759948287633!6m8!1m7!1sfz7S2bbN5f-4cEZV1MKqfg!2m2!1d26.84151480744702!2d75.56381664697473!3f58.59922933756116!4f-19.201312639214578!5f0.7820865974627469'
            },
            LowerGroundAB2: {
              name: 'Lower Ground AB2',
              embed: 'https://www.google.com/maps/embed?pb=!4v1759948528735!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQzhxLVdrMlFF!2m2!1d26.84385521744164!2d75.56523428433832!3f260.41994934867483!4f-10.207942830008108!5f0.7820865974627469'
            },
            RecreationalBlock: {
              name: 'Recreational Block GHS',
              embed: 'https://www.google.com/maps/embed?pb=!4v1759948832604!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQzhxNFBRU3c.!2m2!1d26.84390425775052!2d75.56522744446389!3f349.49365492362824!4f5.509892711999541!5f0.7820865974627469'
            },
            DepartmentHotelMangenemt: {
              name: 'Recreational Block GHS',
              embed: 'https://www.google.com/maps/embed?pb=!4v1759948832604!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQzhxNFBRU3c.!2m2!1d26.84390425775052!2d75.56522744446389!3f349.49365492362824!4f5.509892711999541!5f0.7820865974627469'
            },
            FacultyofDesing: {
              name: 'Recreational Block GHS',
              embed: 'https://www.google.com/maps/embed?pb=!4v1759949216639!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQzhxNTJwNmdF!2m2!1d26.84393605572861!2d75.5652323300885!3f27.307312972441878!4f-10.57108423277137!5f0.7820865974627469'
            },
            GHSRecptionandMess: {
              name: 'Recreational Block GHS',
              embed: 'https://www.google.com/maps/embed?pb=!4v1759949388629!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQzhxNjNESFE.!2m2!1d26.84375770453294!2d75.56517885469745!3f206.51646906875254!4f-22.124741672395274!5f0.7820865974627469'
            },
            GrandStaricase: {
              name: 'Grand Staricase',
              embed: 'https://www.google.com/maps/embed?pb=!4v1759949538670!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ2NyTnIzMVFF!2m2!1d26.84385521744164!2d75.56523428433832!3f64.80102086523675!4f-10.17179305206578!5f0.7820865974627469'
            },
            BasketBallCourt: {
              name: 'Basket Ball Court',
              embed: 'https://www.google.com/maps/embed?pb=!4v1759949795647!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQzhxLTJrVWc.!2m2!1d26.84428344433788!2d75.56487656736392!3f32.59262930362079!4f-22.168335048660964!5f0.7820865974627469'
            },
            DomeCafe: {
              name: 'Dome Cafeteria',
              embed: 'https://www.google.com/maps/embed?pb=!4v1759949934362!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJREVwc09FVnc.!2m2!1d26.8416752565646!2d75.56582828625186!3f114.18337501379462!4f-11.377141541099974!5f0.7820865974627469'
            }
          };
          
          function changeLocation(locationKey) {
            const location = locations[locationKey];
            const iframe = document.getElementById('streetview');
            const currentLocation = document.getElementById('current-location');
            
            iframe.src = location.embed;
            currentLocation.textContent = location.name;
            
            // Notify React Native
            window.ReactNativeWebView?.postMessage(JSON.stringify({
              type: 'buildingClick',
              building: location.name
            }));
          }
          
          function toggleMenu() {
            const controls = document.getElementById('controls');
            const toggleText = document.getElementById('toggle-text');
            controls.classList.toggle('collapsed');
            
            if (controls.classList.contains('collapsed')) {
              toggleText.textContent = '📍 Select Campus Location';
            } else {
              toggleText.textContent = '✕ Close Menu';
            }
          }
          
          function goToMainGate() { changeLocation('mainGate'); }
          function goToLibrary() { changeLocation('library'); }
          function goToEngineering() { changeLocation('engineering'); }
          function goToAdmin() { changeLocation('admin'); }
          function goToHostel() { changeLocation('hostel'); }
          function goToCafeteria() { changeLocation('cafeteria'); }
          function goToLowerGroundAB2() { changeLocation('LowerGroundAB2'); }
          function goToREcreationalBlock() { changeLocation('RecreationalBlock'); }
          function goToDepartmentHotelMangenemt() { changeLocation('DepartmentHotelMangenemt'); }
          function goToFacultyofDesing() { changeLocation('FacultyofDesing'); }
          function goToGHSReceptionandMess() { changeLocation('GHSRecptionandMess'); }
          function goToGrandStaricase() { changeLocation('GrandStaricase'); }
          function goToBasketBallCourt() { changeLocation('BasketBallCourt'); }
          function goToDomeCafe() { changeLocation('DomeCafe'); }
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        source={{ html: html3D }}
        style={styles.webview}
        javaScriptEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'buildingClick' && onBuildingClick) {
              onBuildingClick(data.building);
            }
          } catch (error) {
            console.log('Error parsing 3D view message:', error);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
});

export default Campus3DModel;