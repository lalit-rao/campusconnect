import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { X, Navigation, Clock, Star, MessageSquare, Eye } from 'lucide-react-native';
import Free3DView from './Free3DView';
import Campus3DModel from './Campus3DModel';
import { useState } from 'react';

type LocationModalProps = {
  location: {
    id: number;
    name: string;
    category: string;
    latitude: number;
    longitude: number;
  };
  onClose: () => void;
};

export default function LocationModal({ location, onClose }: LocationModalProps) {
  const { colors } = useTheme();
  const [showFree3D, setShowFree3D] = useState(false);
  const [show3DModel, setShow3DModel] = useState(false);
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: colors.cardBackground }]}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <X size={24} color={colors.text} />
          </TouchableOpacity>
          
          <Image
            source={{ 
              uri: 'https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
            }}
            style={styles.locationImage}
          />
          
          <View style={styles.locationInfo}>
            <Text style={[styles.locationName, { color: colors.text }]}>{location.name}</Text>
            <Text style={[styles.locationCategory, { color: colors.secondaryText }]}>
              {location.category}
            </Text>
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Clock size={20} color={colors.primary} style={styles.detailIcon} />
              <View>
                <Text style={[styles.detailLabel, { color: colors.secondaryText }]}>
                  Hours
                </Text>
                <Text style={[styles.detailText, { color: colors.text }]}>
                  8:00 AM - 10:00 PM
                </Text>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <Navigation size={20} color={colors.primary} style={styles.detailIcon} />
              <View>
                <Text style={[styles.detailLabel, { color: colors.secondaryText }]}>
                  Distance
                </Text>
                <Text style={[styles.detailText, { color: colors.text }]}>
                  0.5 miles from Student Center
                </Text>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <Star size={20} color={colors.primary} style={styles.detailIcon} />
              <View>
                <Text style={[styles.detailLabel, { color: colors.secondaryText }]}>
                  Rating
                </Text>
                <Text style={[styles.detailText, { color: colors.text }]}>
                  4.5 (120 reviews)
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.reviewsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Student Reviews</Text>
            
            <ScrollView style={styles.reviewsScroll}>
              <View style={[styles.reviewCard, { backgroundColor: colors.background }]}>
                <View style={styles.reviewHeader}>
                  <Image 
                    source={{ uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
                    style={styles.reviewerImage}
                  />
                  <View>
                    <Text style={[styles.reviewerName, { color: colors.text }]}>
                      Emma W.
                    </Text>
                    <View style={styles.starsRow}>
                      {[1, 2, 3, 4, 5].map((_, index) => (
                        <Star 
                          key={index} 
                          size={12} 
                          color={index < 4 ? colors.primary : colors.border} 
                          fill={index < 4 ? colors.primary : 'transparent'}
                        />
                      ))}
                    </View>
                  </View>
                </View>
                <Text style={[styles.reviewText, { color: colors.secondaryText }]}>
                  Great place to study! Quiet environment and helpful staff.
                </Text>
              </View>
              
              <View style={[styles.reviewCard, { backgroundColor: colors.background }]}>
                <View style={styles.reviewHeader}>
                  <Image 
                    source={{ uri: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
                    style={styles.reviewerImage}
                  />
                  <View>
                    <Text style={[styles.reviewerName, { color: colors.text }]}>
                      Michael T.
                    </Text>
                    <View style={styles.starsRow}>
                      {[1, 2, 3, 4, 5].map((_, index) => (
                        <Star 
                          key={index} 
                          size={12} 
                          color={index < 5 ? colors.primary : colors.border} 
                          fill={index < 5 ? colors.primary : 'transparent'}
                        />
                      ))}
                    </View>
                  </View>
                </View>
                <Text style={[styles.reviewText, { color: colors.secondaryText }]}>
                  Lots of resources available and the staff is very helpful. Highly recommend!
                </Text>
              </View>
            </ScrollView>
          </View>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
            >
              <Navigation size={16} color="white" />
              <Text style={styles.actionButtonText}>Get Directions</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.secondary }]}
              onPress={() => setShow3DModel(true)}
            >
              <Eye size={16} color="white" />
              <Text style={styles.actionButtonText}>3D Campus</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.reviewButton, { backgroundColor: colors.cardBackground, borderColor: colors.border, borderWidth: 1 }]}
          >
            <MessageSquare size={16} color={colors.text} />
            <Text style={[styles.reviewButtonText, { color: colors.text }]}>
              Add Review
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {show3DModel && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={show3DModel}
          onRequestClose={() => setShow3DModel(false)}
        >
          <View style={styles.streetViewContainer}>
            <TouchableOpacity
              style={styles.streetViewCloseButton}
              onPress={() => setShow3DModel(false)}
            >
              <X size={24} color="white" />
            </TouchableOpacity>
            <Campus3DModel
              selectedBuilding={location.name}
              onBuildingClick={(building) => {
                console.log('Building clicked:', building);
              }}
            />
          </View>
        </Modal>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
  },
  locationInfo: {
    marginBottom: 16,
  },
  locationName: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  locationCategory: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  detailsContainer: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailIcon: {
    marginRight: 16,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  detailText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  reviewsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 16,
  },
  reviewsScroll: {
    maxHeight: 200,
  },
  reviewCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewerImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  reviewerName: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginBottom: 4,
  },
  starsRow: {
    flexDirection: 'row',
  },
  reviewText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    flex: 0.48,
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  reviewButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  streetViewContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  streetViewCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: 'white',
  },
});