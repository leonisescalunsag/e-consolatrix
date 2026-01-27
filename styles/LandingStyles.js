import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const BUTTON_WIDTH = width - 80;
const KNOB_SIZE = 60;

export const SWIPE_CONSTANTS = {
  BUTTON_WIDTH,
  KNOB_SIZE,
  SWIPE_RANGE: BUTTON_WIDTH - KNOB_SIZE - 10,
};

export const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  backgroundImage: { 
    flex: 1, 
    width: '100%', 
    height: '100%' 
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 70,
  },
  headerSection: { 
    alignItems: 'center', 
    marginTop: 30 
  },
  logo: { 
    width: 110, 
    height: 110, 
    marginBottom: 15, 
    resizeMode: 'contain' 
  },
  brandTitle: { 
    fontSize: 42, 
    fontWeight: 'bold', 
    color: '#fff', 
    letterSpacing: 0.5 
  },
  blueText: { 
    color: '#0033FF' 
  },
  schoolFullName: { 
    fontSize: 13, 
    color: '#fff', 
    opacity: 0.8, 
    marginTop: 5, 
    fontWeight: '600' 
  },

  bottomSection: { 
    width: '100%', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  slogan: { 
    color: '#fff', 
    textAlign: 'center', 
    fontSize: 20, 
    fontStyle: 'italic', 
    paddingHorizontal: 40, 
    marginBottom: 35,
    lineHeight: 20,
    opacity: 0.9
  },

  // Swipe Button Styles
  swipeTrack: {
    width: BUTTON_WIDTH,
    height: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 35,
    justifyContent: 'center',
    paddingHorizontal: 5,
    overflow: 'hidden',
  },
  swipeFill: {
    position: 'absolute',
    left: 0,
    height: '100%',
    backgroundColor: 'rgba(59, 130, 246, 0.5)',
    borderRadius: 35,
  },
  swipeKnob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    backgroundColor: '#0033FF',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  knobLabel: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 14 
  },
  swipeGuideText: {
    position: 'absolute',
    right: 30,
    color: '#fff',
    fontSize: 18,
    opacity: 0.3,
  },

  // Figma Rectangle Dots
  paginationContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
    alignItems: 'center',
  },
  rectangleDot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff', 
    width: 25, // Starting width para sa interpolation
    marginHorizontal: 4, // Para hindi dikit-dikit
  }
});