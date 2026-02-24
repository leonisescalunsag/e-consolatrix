import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  brandCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f62c7d7', 
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 25,
    marginBottom: 30,
    borderLeftWidth: 6,
    borderLeftColor: '#FF0000',
    borderBottomWidth: 4,
    borderBottomColor: '#FF0000',
  },
  brandLogo: {
    width: 90,
    height: 90,
    marginRight: 15,
  },
  brandTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  brandSub: {
    color: '#efefef',
    fontSize: 13,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  row: {
    justifyContent: 'space-between',
  },
  menuCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)', 
    width: (width / 2) - 30, 
    height: 160,
    borderRadius: 25,
    marginBottom: 20,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 8,
  },
  centeredLastCard: {
    
    marginLeft: ((width - 40) / 2) - (((width / 2) - 30) / 2),
  },
  sideBorder: {
    width: 8,
    height: '100%',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  iconCircle: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: '#EBF2FF', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0D3E86',
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
  tabItem: {
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalCloseArea: {
    flex: 1,
  },
  sidebarContainer: {
    width: '80%',
    height: '100%',
    backgroundColor: '#1754afcb',
    padding: 20,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
  },
  sidebarBrandCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 15,
    borderRadius: 20,
    marginBottom: 25,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FF0000',
    borderBottomWidth: 3,
    borderBottomColor: '#FF0000',
  },
  sidebarLogoSmall: {
    width: 80,
    height: 80,
    marginRight: 12,
    resizeMode: 'contain'
  },
  sidebarBrandText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  sidebarLinkBox: {
    backgroundColor: '#fff',
    padding: 17,
    borderRadius: 12,
    marginBottom: 16,
  },
  sidebarLinkText: {
    color: '#0D3E86',
    fontWeight: 'bold',
    fontSize: 15,
  },
  sidebarFooter: {
    marginTop: 'auto',
    marginBottom: 20,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,

  },
  sidebarItemText: {
    color: '#fff',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: 10,
  },
});