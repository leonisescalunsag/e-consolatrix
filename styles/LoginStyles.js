import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  flex1: { 
    flex: 1 
  },
 
  backgroundImage: { 
    flex: 1, 
    width: '100%', 
    height: '100%' 
  },
  gradientOverlay: {
    flex: 1,
    backgroundColor: 'rgba(13, 62, 134, 0.4)', 
  },
  centerContent: {
    flexGrow: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 40, 
  },
  
  loginCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
    borderRadius: 30, 
    padding: 30,
    alignItems: 'center',
    
    
    borderWidth: 1.5, 
    borderColor: '#1a0cda9a', 
    elevation: 20, 
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    
  },
  logo: {
    width: 110, 
    height: 110, 
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
    borderRadius: 15, 
    paddingHorizontal: 15,
    color: '#333',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#0f3bff8a', 
  },
  loginButton: {
    width: '100%',
    height: 55,
    backgroundColor: '#0D3E86',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    
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