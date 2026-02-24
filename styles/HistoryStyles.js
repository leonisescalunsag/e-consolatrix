import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(13, 62, 134, 0.55)' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: { fontSize: 26, color: '#fff', fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },
  
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 8,
  },
  sideAccent: { width: 12, height: '100%' },
  
  cardBody: { 
    flex: 1, 
    paddingVertical: 25,
    paddingHorizontal: 35, // MAS MALAPAD NA PADDING PARA SA SQUARE LOOK
  },
  
  cardTitleCentered: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0D3E86',
    textAlign: 'center',
    marginBottom: 10,
  },
  
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  schoolLogo: { width: 90, height: 90 },

  cardTextJustified: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    textAlign: 'justify', // ITO ANG MAGPAPANTAY SA GILID
  },

  cardHeaderSmallCentered: {
    fontSize: 15,
    color: '#0D3E86',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },

  missionItem: { 
    flexDirection: 'row', 
    marginBottom: 12, 
    alignItems: 'flex-start' 
  },
  bulletNumber: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#0D3E86', 
    width: 25 
  },
  missionText: { 
    flex: 1, 
    fontSize: 14, 
    color: '#444', 
    lineHeight: 20, 
    textAlign: 'justify' // Pantay din ang Mission list para professional
  },

 bottomTab: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 85,
    backgroundColor: '#11418a98',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  tabItem: { alignItems: 'center', flex: 1 },
  tabLabel: { fontSize: 11, marginTop: 4, fontWeight: '500' },
});