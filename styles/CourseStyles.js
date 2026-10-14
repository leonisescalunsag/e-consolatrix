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
  
  // HEADER - improved
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 25, 
    paddingBottom: 20,
  },
  headerTitle: { 
    fontSize: 24, 
    color: '#fff', 
    fontWeight: '800',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  
  listPadding: { 
    paddingHorizontal: 20, 
    paddingBottom: 120 
  },
  
  // SECTION HEADER - improved with gradient look
  sectionHeader: { 
    marginTop: 25, 
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '800',
    backgroundColor: 'rgba(13, 62, 134, 0.6)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    letterSpacing: 0.5,
  },
  // Decorative element for section header
  sectionAccent: {
    width: 40,
    height: 4,
    backgroundColor: '#FFD700',
    marginLeft: 10,
    borderRadius: 2,
  },
  
  // COURSE CARD - completely redesigned
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20, 
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
    paddingRight: 15,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(13, 62, 134, 0.1)',
    position: 'relative',
  },
  
  // Color bar - wider and more prominent
  colorBar: { 
    width: 12, 
    height: '100%',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  
  // Icon container (new)
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(13, 62, 134, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  
  cardInfo: { 
    flex: 1, 
    paddingVertical: 18,
    paddingHorizontal: 15,
  },
  
  // Course code with background
  courseCode: { 
    fontSize: 20, 
    fontWeight: '800', 
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  
  // Course name with better typography
  courseName: { 
    fontSize: 13, 
    color: '#2D3748', 
    lineHeight: 18,
    fontWeight: '500',
  },
  
  // Department badge (for additional info)
  deptBadge: {
    position: 'absolute',
    top: 10,
    right: 45,
    backgroundColor: 'rgba(13, 62, 134, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  deptBadgeText: {
    fontSize: 10,
    color: '#0D3E86',
    fontWeight: '600',
  },
  
  // Bottom tab
  bottomTab: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 85,
    backgroundColor: '#11418ac4', 
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 5,
    backdropFilter: 'blur(10px)',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
    color: '#fff',
  },
});