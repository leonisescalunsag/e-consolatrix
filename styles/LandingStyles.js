import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { 
    flex: 1,
    width: '100%',
    height: '100%',
    paddingTop: 50,
   },
  
  // TOP GRADIENT (dark blue to transparent)
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
    zIndex: 1,
  },
  
  // BOTTOM GRADIENT (transparent to dark blue)
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
    zIndex: 1,
  },
  
  // MAIN CONTENT CONTAINER
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 80,
    zIndex: 2,
  },

  headerSection: { 
    alignItems: 'center', 
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  
  brandTitle: { 
    fontSize: 50, 
    fontWeight: 'bold', 
    color: '#fff', 
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,4.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 1,
    marginTop: 12,
  },
  
  blueText: { 
    color: '#3b82f6' 
  },
  
  schoolFullName: { 
    fontSize: 14, 
    color: '#ffffff', 
    fontWeight: '600', 
    textAlign: 'center',
    opacity: 0.9,
    marginTop: 5,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.5,
    lineHeight: 22,
  },
  
  bottomSection: { 
    width: '100%', 
    alignItems: 'center',
    paddingBottom: 10,
  },
  
  // ✅ AUTO-SLIDING TEXT STYLES
  slidingContainer: {
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 10,
    minHeight: 100,
    justifyContent: 'center',
    minHeight: 120,
  },
  slideTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
    fontFamily: 'Montserrat-Bold',
    letterSpacing: 0.5,
  },
  slideSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: 'Montserrat-Medium',
  },
  slideDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'Montserrat-Regular',
    paddingHorizontal: 10,
  },
  
  // Slide Dots Indicator
  slideDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    gap: 8,
  },
  slideDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  slideDotActive: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  
  // EXPLORE BUTTON STYLES - REMAIN UNCHANGED
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0033FF',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 50,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: 15,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginRight: 10,
  },
  exploreIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exploreIcon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  eNote: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 10,
  },

  // ✅ SECRET INPUT STYLES
secretInputContainer: {
  position: 'absolute',
  bottom: 100,
  alignSelf: 'center',
  width: '85%',
  backgroundColor: 'rgba(0,0,0,0.5)',
  borderRadius: 16,
  padding: 12,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.2)',
  backdropFilter: 'blur(10px)',
  zIndex: 50,
},
secretInputWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
},

secretInput: {
  flex: 1,
  color: '#fff',
  fontSize: 15,
  fontFamily: 'Montserrat-Medium',
  paddingVertical: 4,
},
secretHint: {
  color: 'rgba(255,255,255,0.4)',
  fontSize: 10,
  textAlign: 'center',
  marginTop: 6,
  fontFamily: 'Montserrat-Regular',
},
});