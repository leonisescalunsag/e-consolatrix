import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // ✅ CONTAINER
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  
  // ✅ BACKGROUND IMAGE
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  
  // ✅ GRADIENT OVERLAY
  gradientOverlay: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  
  // ✅ HEADER
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  
  // ✅ BELL WITH BADGE
  bellContainer: {
    position: 'relative',
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    backgroundColor: '#FF0000',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0D3E86',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Bold',
    paddingHorizontal: 3,
  },
  
  // ✅ BRAND CARD
  brandCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(6, 37, 177, 0.93)',
    borderRadius: 20,
    padding: 16,
    marginTop: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
  },
  brandLogo: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginRight: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 4,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  brandSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontFamily: 'Montserrat-Medium',
    marginTop: 2,
  },
  
  // ✅ NOTIFICATION CONTAINER
  notifContainerWrapper: {
    width: '100%',
    marginBottom: 8,
  },
  notifContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  notifHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  notifHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  notifHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A2E',
    fontFamily: 'Montserrat-Bold',
  },
  notifViewAll: {
    fontSize: 12,
    color: '#0D3E86',
    fontWeight: '600',
    fontFamily: 'Montserrat-Medium',
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  notifIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  notifContent: {
    flex: 1,
  },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notifTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A2E',
    fontFamily: 'Montserrat-Medium',
    flex: 1,
    marginRight: 8,
  },
  notifTime: {
    fontSize: 10,
    color: '#999',
    fontFamily: 'Montserrat-Regular',
  },
  notifDesc: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Montserrat-Regular',
    marginTop: 2,
  },
  notifBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 6,
  },
  notifBadgeText: {
    color: '#fff',
    fontSize: 7,
    fontWeight: '700',
    fontFamily: 'Montserrat-Bold',
  },
  
  // ✅ LIST CONTAINER
  listContainer: {
    paddingVertical: 12,
    paddingBottom: 120,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  
  // ✅ MENU CARD
  menuCard: {
    width: (width - 48) / 2,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  sideBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 5,
    height: '100%',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(13, 62, 134, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A2E',
    textAlign: 'center',
    fontFamily: 'Montserrat-Medium',
    lineHeight: 18,
  },
  
  // ✅ CHAT BUTTON
  chatButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0D3E86',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#0D3E86',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  
  // ✅ BOTTOM TAB
  bottomTab: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
    backdropFilter: 'blur(10px)',
  },
  tabItem: {
    alignItems: 'center',
    width: width / 6.2,
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
  
  // ✅ SIDEBAR MODAL - White background, gray menu items (Like screenshot)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
  },
  modalCloseArea: {
    flex: 1,
  },
  sidebarContainer: {
    width: width * 0.78,
    backgroundColor: '#1239e957',
    height: '100%',
    paddingTop: 40,
    paddingHorizontal: 16,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  sidebarBrandCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#E8E8E8',
  },
  sidebarLogoSmall: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  sidebarBrandText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffffff',
    fontFamily: 'Montserrat-Bold',
  },
  sidebarMenu: {
    flex: 1,
  },
  sidebarLinkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#F5F7FA',
  },
  sidebarLinkText: {
    fontSize: 15,
    color: '#1A1A2E',
    fontFamily: 'Montserrat-Medium',
  },
  divider: {
    height: 1,
    backgroundColor: '#e6e3e3d2',
    marginVertical: 10,
    
  },
  sidebarFooter: {
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#d7d6d6e9',
    paddingTop: 12,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#F5F7FA',
    marginTop: 4,
  },
  sidebarItemText: {
    fontSize: 15,
    color: '#1A1A2E',
    fontFamily: 'Montserrat-Medium',
    fontWeight: '500',
  },
});