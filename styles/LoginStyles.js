import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  flex1: { 
    flex: 1 
  },
  // Full background image setup
  backgroundImage: { 
    flex: 1, 
    width: '100%', 
    height: '100%' 
  },
  gradientOverlay: {
    flex: 1,
    backgroundColor: 'rgba(13, 62, 134, 0.4)', // Semi-transparent blue para sa school theme
  },
  centerContent: {
    flexGrow: 1, // Sinisiguro na laging nasa gitna
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 40, // Dagdag space para sa scroll
  },
  // White container sa gitna na may Red-Blue Glow Shadow
  loginCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Halos solid white para malinis
    borderRadius: 30, // Mas rounder, mas modern
    padding: 30,
    alignItems: 'center',
    
    // --- RED-BLUE GLOW SETTINGS ---
    borderWidth: 1.5, // Para lilitaw yung kulay kahit sa Android
    borderColor: '#ff0404', // Indigo/Purple mix (Red + Blue glow)
    elevation: 20, // Para sa Android depth
    shadowColor: '#ff1010', 
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    // --------------------------------
  },
  logo: {
    width: 110, // Nilakihan natin from 85 to 110
    height: 110, // Nilakihan natin from 85 to 110
    marginBottom: 15,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0D3E86',
    marginBottom: 25,
  },
  blueText: {
    color: '#0033FF',
  },
  inputGroup: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: 55,
    backgroundColor: '#fff',
    borderRadius: 15, // Match sa card roundness
    paddingHorizontal: 15,
    color: '#333',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#0f3bff8a', // Yung blue border na gusto mo
  },
  loginButton: {
    width: '100%',
    height: 55,
    backgroundColor: '#0D3E86',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    // Konting shadow din sa button para pro tingnan
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  registerLink: {
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
    fontSize: 14,
  },
});