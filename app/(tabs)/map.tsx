import { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { ChevronDown, Navigation, Clock, Star, Layers, Box, Route } from 'lucide-react-native';
import LocationModal from '@/components/map/LocationModal';
import FreeMapView from '@/components/map/FreeMapView';
import Campus3DModel from '@/components/map/Campus3DModel';
import NavigationMapView from '@/components/map/NavigationMapView';

const filters = ['Libraries', 'Cafeterias', 'Departments', 'Dorms', 'Offices'];

// 📍 CHANGE MARKER POSITIONS HERE - Just modify latitude/longitude
const campusLocations = [
  { id: 1, name: 'Central Library', category: 'Libraries', latitude: 26.8429, longitude: 75.5644 },
  { id: 2, name: 'Food Court', category: 'Cafeterias', latitude: 26.8435, longitude: 75.5650 },
  { id: 3, name: 'Engineering Block', category: 'Departments', latitude: 26.8440, longitude: 75.5655 },
  { id: 4, name: 'Boys Hostel', category: 'Dorms', latitude: 26.8425, longitude: 75.5640 },
  { id: 5, name: 'Admin Block', category: 'Offices', latitude: 26.8430, longitude: 75.5645 },
  { id: 6, name: 'Medical Block', category: 'Departments', latitude: 26.8445, longitude: 75.5660 },
  { id: 7, name: 'Sports Complex', category: 'Offices', latitude: 26.8420, longitude: 75.5635 },
  { id: 8, name: 'Girls Hostel', category: 'Dorms', latitude: 26.8450, longitude: 75.5665 },
  
  // 🆕 ADD NEW MARKERS HERE:
  // { id: 9, name: 'New Building', category: 'Departments', latitude: 26.8455, longitude: 75.5670 },
];

export default function MapScreen() {
  const { colors } = useTheme();
  const [selectedCampus, setSelectedCampus] = useState('Manipal University Jaipur');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapType, setMapType] = useState('standard');
  const [view3D, setView3D] = useState(false);
  const [navigationMode, setNavigationMode] = useState(true);
  const [routeData, setRouteData] = useState(null);

  const filteredLocations = activeFilter === 'All'
    ? campusLocations
    : campusLocations.filter(loc => loc.category === activeFilter);

  // 🗺️ CHANGE MAP CENTER HERE
  const initialRegion = {
    latitude: 26.8435,    // Move map center up/down
    longitude: 75.5650,   // Move map center left/right  
    latitudeDelta: 0.008, // Zoom level (smaller = more zoomed in)
    longitudeDelta: 0.008,
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.campusSelector}>
          <Text style={[styles.campusText, { color: colors.text }]}>{selectedCampus}</Text>
          <ChevronDown size={20} color={colors.text} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.mapTypeButton, { backgroundColor: view3D ? '#ff6b6b' : colors.primary }]}
          onPress={() => {
            setView3D(!view3D);
          }}
        >
          <View style={styles.buttonContent}>
            <Box size={18} color="white" />
            <Text style={styles.buttonText}>3D View</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        {view3D ? (
          <Campus3DModel
            onBuildingClick={(building) => {
              const location = filteredLocations.find(loc => loc.name.includes(building.split(' ')[0]));
              if (location) setSelectedLocation(location);
            }}
          />
        ) : (
          <NavigationMapView
            latitude={initialRegion.latitude}
            longitude={initialRegion.longitude}
            onRouteCalculated={setRouteData}
          />
        )}
      </View>


      
      {navigationMode && routeData && (
        <View style={[styles.routeInfoContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.routeTitle, { color: colors.text }]}>Route Information</Text>
          <Text style={[styles.routeDetail, { color: colors.text }]}>Distance: {routeData.distance}m</Text>
          <Text style={[styles.routeDetail, { color: colors.text }]}>Walking time: ~{routeData.duration} minutes</Text>
        </View>
      )}

      {selectedLocation && (
        <LocationModal
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  campusSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(50,184,205,0.7)',
  },
  campusText: {
    marginRight: 8,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  filtersContainer: {
    paddingVertical: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  filtersScroll: {
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#666',
  },
  mapTypeButton: {
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  routeInfoContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  routeTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginBottom: 8,
  },
  routeDetail: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
});
