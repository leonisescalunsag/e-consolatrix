import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(13, 62, 134, 0.45)' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 25, // In-adjust ko sa 25 para match sa Home
    paddingBottom: 20,
  },
  headerTitle: { 
    fontSize: 22, 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  listPadding: { 
    paddingHorizontal: 20, 
    paddingBottom: 120 
  },
  sectionHeader: { 
    marginTop: 25, 
    marginBottom: 15 
  },
  sectionTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  courseCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Match sa menuCard ng Home
    borderRadius: 25, // Match sa Home menuCard
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    overflow: 'hidden',
    paddingRight: 15,
    elevation: 8,
  },
  colorBar: { 
    width: 8, // Match sa sideBorder ng Home
    height: '100%' 
  },
  cardInfo: { 
    flex: 1, 
    padding: 15 
  },
  courseCode: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 2 
  },
  courseName: { 
    fontSize: 13, 
    color: '#0D3E86', // Ginawa kong blue para match sa menuTitle ng Home
    lineHeight: 18 
  },
  // IDENTICAL BOTTOM TAB SA HOME.JSX
  bottomTab: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 85,
    backgroundColor: '#11418a98', // Saktong color mo bro
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
  },
});