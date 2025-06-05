import { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { ChevronDown, Navigation, Clock, Star } from 'lucide-react-native';
import LocationModal from '@/components/map/LocationModal';

const filters = ['Libraries', 'Cafeterias', 'Departments', 'Dorms', 'Offices'];

const campusLocations = [
  { id: 1, name: 'Main Library', category: 'Libraries', latitude: 37.7749, longitude: -122.4194 },
  { id: 2, name: 'Student Union', category: 'Cafeterias', latitude: 37.7750, longitude: -122.4184 },
  { id: 3, name: 'Science Building', category: 'Departments', latitude: 37.7752, longitude: -122.4174 },
  { id: 4, name: 'West Dormitory', category: 'Dorms', latitude: 37.7747, longitude: -122.4190 },
  { id: 5, name: 'Admin Office', category: 'Offices', latitude: 37.7745, longitude: -122.4180 },
];

export default function MapScreen() {
  const { colors } = useTheme();
  const [selectedCampus, setSelectedCampus] = useState('Main Campus');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState(null);

  const filteredLocations = activeFilter === 'All'
    ? campusLocations
    : campusLocations.filter(loc => loc.category === activeFilter);

  const initialRegion = {
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.campusSelector}>
          <Text style={[styles.campusText, { color: colors.text }]}>{selectedCampus}</Text>
          <ChevronDown size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
        >
          {filteredLocations.map((location) => (
            <Marker
              key={location.id}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude
              }}
              onPress={() => setSelectedLocation(location)}
            />
          ))}
        </MapView>
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === 'All' && { backgroundColor: colors.primary },
            ]}
            onPress={() => setActiveFilter('All')}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === 'All' && { color: 'white' },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                activeFilter === filter && { backgroundColor: colors.primary },
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter && { color: 'white' },
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

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
    justifyContent: 'center',
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
});
