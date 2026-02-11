import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(13, 62, 134, 0.45)' },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: { fontSize: 24, color: '#fff', fontWeight: 'bold' },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },

  // Pinaganda ang Note Card
  noteCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 10, // Mas mataas na shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderLeftWidth: 8,
    borderLeftColor: '#0D3E86', // Blue side border
  },
  noteText: { color: '#0D3E86', fontSize: 14, textAlign: 'center', lineHeight: 20, fontWeight: '500' },

  // Updated Policy Card na may side color
  policyCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 18,
    flexDirection: 'row', // Para sa side border
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  sideBar: {
    width: 10, // Makapal na kulay sa gilid
    height: '100%',
  },
  cardContent: {
    flex: 1,
    padding: 20,
  },
  policyTitle: { fontSize: 18, fontWeight: 'bold', color: '#0D3E86', marginBottom: 12 },
  ruleItem: { fontSize: 14, color: '#4A6FA5', marginBottom: 8, fontWeight: '500' },

  // Bottom Tab (Consistent sa Home/Courses)
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
  tabLabel: { fontSize: 11, marginTop: 4, color: '#ccc' },
});