import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  
  // ✅ LOADING CONTAINER
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Montserrat-Medium',
  },
  
  // ✅ HEADER - with gradient effect
  header: {
    backgroundColor: '#0D3E86',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  
  // ✅ SEARCH BAR
  searchBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRadius: 15,
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: '#FFFFFF',
    fontSize: 15,
  },
  
  // ✅ TABS
  tabScroll: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#F1F5F9',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  activeTabButton: {
    backgroundColor: '#0D3E86',
    borderColor: '#0D3E86',
    elevation: 4,
  },
  tabText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 13,
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  
  // ✅ NEWS LIST
  newsList: {
    padding: 15,
    paddingBottom: 100,
  },
  
  // ✅ NEWS CARD
  newsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(13, 62, 134, 0.05)',
  },
  
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  
  categoryText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  textContainer: {
    flex: 1,
    marginLeft: 15,
  },
  
  newsTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  
  newsDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 12,
  },
  
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  
  metaText: {
    fontSize: 11,
    color: '#64748B',
    marginLeft: 4,
    marginRight: 10,
    fontWeight: '500',
  },

  // ✅ EMPTY STATE
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94a3b8',
    marginTop: 10,
    fontFamily: 'Montserrat-Medium',
  },
  emptySubtext: {
    fontSize: 13,
    color: '#cbd5e1',
    marginTop: 4,
    fontFamily: 'Montserrat-Regular',
  },

  // ✅ BOTTOM TAB
  bottomTab: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 85,
    backgroundColor: '#144081db',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tabItem: { 
    alignItems: 'center', 
    width: width / 6.2 
  },
  tabLabel: { 
    color: '#fff', 
    fontSize: 11, 
    marginTop: 5, 
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  // ✅ ADD THESE STYLES AT THE BOTTOM OF NewsStyles.js

// News Card Preview
newsPreview: {
  fontSize: 13,
  color: '#64748B',
  lineHeight: 18,
  marginBottom: 10,
  fontFamily: 'Montserrat-Regular',
},

// Read More
readMoreContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  alignSelf: 'flex-start',
  backgroundColor: 'rgba(13, 62, 134, 0.06)',
  paddingHorizontal: 12,
  paddingVertical: 4,
  borderRadius: 12,
},
readMoreText: {
  fontSize: 12,
  color: '#0D3E86',
  fontWeight: '600',
  fontFamily: 'Montserrat-Medium',
},

// ✅ MODAL STYLES
modalOverlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.5)',
},
modalBackdrop: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
},
modalContainer: {
  width: '90%',
  maxHeight: '80%',
  backgroundColor: '#FFFFFF',
  borderRadius: 24,
  padding: 24,
  elevation: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.25,
  shadowRadius: 20,
},
modalCloseBtn: {
  position: 'absolute',
  top: 12,
  right: 12,
  zIndex: 10,
  backgroundColor: '#F5F5F5',
  borderRadius: 20,
  padding: 4,
},
modalCategoryBadge: {
  paddingHorizontal: 14,
  paddingVertical: 4,
  borderRadius: 20,
  alignSelf: 'flex-start',
  marginBottom: 12,
},
modalCategoryText: {
  fontSize: 12,
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
},
modalTitle: {
  fontSize: 22,
  fontWeight: '800',
  color: '#1A1A2E',
  fontFamily: 'Montserrat-Bold',
  marginBottom: 8,
  lineHeight: 28,
},
modalDateRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  marginBottom: 16,
},
modalDate: {
  fontSize: 13,
  color: '#64748B',
  fontFamily: 'Montserrat-Medium',
},
modalDescriptionContainer: {
  maxHeight: 400,
},
modalDescription: {
  fontSize: 15,
  color: '#2D3748',
  lineHeight: 24,
  fontFamily: 'Montserrat-Regular',
  textAlign: 'justify',
},
});