import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(13, 62, 134, 0.45)' },
  
  // ✅ HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
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

  scrollContent: { 
    paddingHorizontal: 20, 
    paddingBottom: 120 
  },

  // ✅ NOTE CARD
  noteCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(13, 62, 134, 0.08)',
    gap: 12,
  },
  noteIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(13, 62, 134, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteText: { 
    flex: 1,
    color: '#1A1A2E', 
    fontSize: 13, 
    lineHeight: 20, 
    fontWeight: '500',
    fontFamily: 'Montserrat-Medium',
  },

  // ✅ POLICY CARD
  policyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    padding: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderLeftWidth: 6,
    borderLeftColor: '#0D3E86',
    borderWidth: 1,
    borderColor: 'rgba(13, 62, 134, 0.06)',
  },
  
  // ✅ CARD HEADER
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  
  headerTextContainer: {
    flex: 1,
  },
  
  policyTitle: { 
    fontSize: 17, 
    fontWeight: '700', 
    color: '#1A1A2E',
    fontFamily: 'Montserrat-Bold',
  },
  
  ruleCountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  ruleCountText: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Montserrat-Medium',
  },
  
  // ✅ RULES LIST
  rulesContainer: {
    paddingLeft: 4,
  },
  
  ruleItem: { 
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingRight: 4,
  },
  
  ruleBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 7,
    marginRight: 12,
    flexShrink: 0,
  },
  
  ruleText: {
    flex: 1,
    fontSize: 14,
    color: '#2D3748',
    lineHeight: 22,
    fontFamily: 'Montserrat-Regular',
  },

  // ✅ FOOTER
  footer: {
    marginTop: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(249, 250, 252, 0.28)',
    borderRadius: 12,
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Montserrat-Medium',
    opacity: 0.9,
  },

  // ✅ BOTTOM TAB
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
    paddingHorizontal: 5,
  },
  tabItem: { 
    alignItems: 'center', 
    flex: 1 
  },
  tabLabel: { 
    fontSize: 11, 
    marginTop: 4, 
    color: '#ccc',
    fontWeight: '600',
  },
});