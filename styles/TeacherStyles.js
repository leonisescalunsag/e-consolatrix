import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  gradientOverlay: { flex: 1, backgroundColor: 'rgba(13, 61, 134, 0.43)' },
  
  headerWrapper: {
    marginTop: 20,
    marginHorizontal: 20,
    height: 110,
    position: 'relative',
    marginBottom: 10,
  },
  headerRedAccent: {
    position: 'absolute',
    left: -4, top: 4, width: '100%', height: '100%',
    
  },
  headerBlueBox: {
    flex: 1, backgroundColor: 'rgba(6, 37, 177, 0.93)',
    borderRadius: 20, flexDirection: 'row',
    alignItems: 'center', paddingHorizontal: 15,
  },
  headerLogo: { width: 80, height: 80, resizeMode: 'contain' },
  headerTitle: { color: '#FFFFFF', fontSize: 25, fontWeight: '800' },
  headerSub: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 12 },
  
  // ✅ FILTER SECTION
  filterSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
    zIndex: 10,
  },
  
  pickerWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#0D3E86',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    marginTop: 10,
    marginHorizontal: 3,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(13, 62, 134, 0.08)',
  },
  
  pickerLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    marginTop: 6,
    gap: 6,
  },
  pickerLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    fontFamily: 'Montserrat-Medium',
    letterSpacing: 0.3,
  },
  
  picker: {
    height: 50,
    color: '#1A1A2E',
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    marginTop: -4,
  },
  
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
    marginRight: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  clearBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Montserrat-Medium',
    marginLeft: 4,
  },

  // ✅ LIST CONTENT - adjusted padding
  listContent: {
    paddingHorizontal: 0,
    paddingBottom: 120,
  },

  teacherCard: {
    backgroundColor: '#fffffff5',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 15,
    elevation: 8,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.15, 
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(13, 62, 134, 0.1)',
    position: 'relative',
    overflow: 'hidden',
  },
  
  cardIconContainer: {
    marginRight: 15,
    backgroundColor: '#EBF2FF',
    borderRadius: 30,
    padding: 5,
    elevation: 3,
    shadowColor: '#0D3E86',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  
  cardInfo: {
    flex: 1,
  },
  
  teacherName: { 
    fontSize: 17, 
    fontWeight: '700', 
    color: '#1E293B',
    marginBottom: 4,
  },
  
  teacherPos: { 
    fontSize: 12, 
    color: '#0D3E86', 
    fontWeight: '700', 
    marginBottom: 4,
    backgroundColor: 'rgba(13, 62, 134, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  
  teacherCourse: { 
    fontSize: 11, 
    color: '#64748B', 
    fontStyle: 'italic',
  },

  emptyContainer: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 60,
    paddingHorizontal: 20,
  },
  emptyText: { 
    color: '#FFFFFF', 
    fontSize: 15, 
    textAlign: 'center', 
    opacity: 0.9, 
    marginTop: 15, 
    fontWeight: '600' 
  },

  bottomTab: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 85,
    backgroundColor: '#144081b7',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 5,
  },
  tabItem: { 
    alignItems: 'center', 
    width: width / 6.2 
  },
  tabLabel: { 
    fontSize: 11, 
    marginTop: 5, 
    fontWeight: '600' 
  },
});