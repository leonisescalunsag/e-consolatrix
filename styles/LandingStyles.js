import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const BUTTON_WIDTH = width - 80;
const KNOB_SIZE = 65;

export const SWIPE_CONSTANTS = {
  BUTTON_WIDTH,
  KNOB_SIZE,
  SWIPE_RANGE: BUTTON_WIDTH - KNOB_SIZE - 10,
};

export const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { flex: 1 },
  gradientOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 80,
  },
  headerSection: { 
    alignItems: 'center', 
    width: '100%',
    paddingHorizontal: 20
  },
  logo: { 
    width: 130, 
    height: 130, 
    resizeMode: 'contain', 
    marginBottom: 10 
  },
  brandTitle: { 
    fontSize: 48, 
    fontWeight: 'bold', 
    color: '#fff', 
    textAlign: 'center' 
  },
  blueText: { color: '#3b82f6' },
  schoolFullName: { 
    fontSize: 12, 
    color: '#fff', 
    fontWeight: '600', 
    textAlign: 'center',
    opacity: 0.9,
    marginTop: 5
  },
  bottomSection: { 
    width: '100%', 
    alignItems: 'center',
    paddingBottom: 10
  },
  slogan: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
    fontStyle: 'italic',
    paddingHorizontal: 40,
    marginBottom: 40,
    lineHeight: 26,
  },
  swipeTrack: {
    width: BUTTON_WIDTH,
    height: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Transparent track para kitang kita ang background
    borderRadius: 40,
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  swipeFill: {
    position: 'absolute',
    left: 0,
    height: '100%',
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    borderRadius: 40,
  },
  swipeKnob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    backgroundColor: '#0033FF',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  knobLabel: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  swipeGuideText: { position: 'absolute', right: 30, color: '#fff', fontSize: 18, opacity: 0.3 },
  paginationContainer: { flexDirection: 'row', marginBottom: 25, gap: 10 },
  rectangleDot: { height: 6, borderRadius: 3, backgroundColor: '#fff' },
});