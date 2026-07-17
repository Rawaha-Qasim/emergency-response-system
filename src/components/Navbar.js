import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

function Navbar({ currentPage, setCurrentPage, user, role, notifications, setNotifications }) {
   const [showNotif, setShowNotif] = useState(false);
   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth <= 768);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

const [menuOpen, setMenuOpen] = useState(false);
    const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '⬡' },
    { id: 'report', label: 'Report Emergency', icon: '🆘' },
    { id: 'hospitals', label: 'Hospitals', icon: '🏥' },
    { id: 'police', label: 'Police & Rescue', icon: '👮' },
    { id: 'tracking', label: 'Live Tracking', icon: '📍' },
    { id: 'alerts', label: 'Alerts', icon: '📢' },
    { id: 'admin', label: 'Admin Panel', icon: '⚙️' },
    { id: 'profile', label: 'My Profile', icon: '👤' },
  ].filter(item => item.id !== 'admin' || role === 'admin');

  
  if (isMobile) {
  return (
    <>
      <div style={styles.mobileTopBar}>
        <div style={styles.mobileLogo}>
          <span>🚨</span>
          <h2 style={styles.mobileLogoText}>ERS</h2>
        </div>
        <div style={styles.mobileRight}>
          <span style={styles.mobileUser}>{user?.email?.split('@')[0]}</span>
          <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div style={styles.mobileMenu}>
          {navItems.map((item) => (
            <div
              key={item.id}
              style={{
                ...styles.mobileMenuItem,
                background: currentPage === item.id ? 'rgba(233,69,96,0.15)' : 'transparent',
                borderLeft: currentPage === item.id ? '3px solid #e94560' : '3px solid transparent',
                color: currentPage === item.id ? '#e94560' : '#fff',
              }}
              onClick={() => { setCurrentPage(item.id); setMenuOpen(false); }}
            >
              <span style={styles.mobileMenuIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
          <div style={styles.mobileMenuLogout} onClick={() => signOut(auth)}>
            <span>🚪</span>
            <span>Logout</span>
          </div>
        </div>
      )}

      <div style={styles.bottomNav}>
        {navItems.slice(0, 5).map((item) => (
          <div
            key={item.id}
            style={{
              ...styles.bottomNavItem,
              color: currentPage === item.id ? '#e94560' : '#555',
            }}
            onClick={() => setCurrentPage(item.id)}
          >
            <span style={styles.bottomNavIcon}>{item.icon}</span>
            <span style={styles.bottomNavLabel}>{item.label}</span>
          </div>
        ))}
      </div>
    </>
  );
}
  return (
    <div style={styles.sidebar}>
      <div style={styles.logoSection}>
        <div style={styles.logoIcon}>🚨</div>
        <div>
          <h2 style={styles.logoText}>ERS</h2>
          <p style={styles.logoSub}>Emergency Response</p>
        </div>
      </div>

      <div style={styles.userSection}>
        <div style={styles.userAvatar}>{user?.email?.charAt(0).toUpperCase()}</div>
        <div>
          <p style={styles.userName}>{role === 'admin' ? 'Administrator' : 'Citizen'}</p>
          <p style={styles.userEmail}>{user?.email?.split('@')[0]}</p>
        </div>
        <div style={styles.onlineDot} />
      </div>

      <div style={styles.divider} />

      <nav style={styles.nav}>
        {navItems.map((item) => (
          <div
            key={item.id}
            style={{
              ...styles.navItem,
              background: currentPage === item.id
                ? 'linear-gradient(90deg, rgba(233,69,96,0.2), transparent)'
                : 'transparent',
              borderLeft: currentPage === item.id ? '3px solid #e94560' : '3px solid transparent',
            }}
            onClick={() => setCurrentPage(item.id)}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            <span style={{ color: currentPage === item.id ? '#e94560' : '#8892a4' }}>{item.label}</span>
            {currentPage === item.id && <div style={styles.activeDot} />}
          </div>
        ))}
      </nav>

      <div style={styles.divider} />

      <button style={styles.logout} onClick={() => signOut(auth)}>
        <span>🚪</span> Logout
      </button>
        <div style={{ position: 'relative', margin: '0 20px 10px' }}>
  <button style={styles.notifBtn} onClick={() => setShowNotif(!showNotif)}>
    🔔 Notifications
    {notifications.length > 0 && (
      <span style={styles.notifBadge}>{notifications.length}</span>
    )}
  </button>
  {showNotif && (
    <div style={styles.notifDropdown}>
      {notifications.length === 0 ? (
        <p style={styles.notifEmpty}>No notifications</p>
      ) : (
        notifications.map((n, i) => (
          <div key={i} style={styles.notifItem}>
            <p style={styles.notifMsg}>{n.message}</p>
            <p style={styles.notifTime}>{n.time}</p>
          </div>
        ))
      )}
      <button style={styles.clearBtn} onClick={() => setNotifications([])}>Clear All</button>
    </div>
  )}
</div>
      <p style={styles.version}>v1.0.0 — Pakistan ERS</p>
    </div>
  );
}

const styles = {
  sidebar: {
    width: '240px',
    minWidth: '240px',
    background: 'linear-gradient(180deg, #0d0d1a 0%, #0a0a0f 100%)',
    borderRight: '1px solid rgba(233,69,96,0.2)',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    padding: '20px 0',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0 20px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  logoIcon: { fontSize: '28px' },
  logoText: {
    fontFamily: 'Orbitron, sans-serif',
    color: '#e94560',
    fontSize: '20px',
    letterSpacing: '4px',
    lineHeight: 1,
  },
  logoSub: { color: '#8892a4', fontSize: '10px', letterSpacing: '2px', marginTop: '2px' },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '15px 20px',
    position: 'relative',
  },
  userAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #e94560, #0f3460)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
    flexShrink: 0,
  },
  userName: { color: '#fff', fontSize: '13px', fontWeight: '600' },
  userEmail: { color: '#8892a4', fontSize: '11px' },
  onlineDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#2ecc71',
    position: 'absolute',
    right: '20px',
    boxShadow: '0 0 6px #2ecc71',
  },
  divider: { height: '1px', background: 'rgba(255,255,255,0.05)', margin: '10px 0' },
  nav: { flex: 1, padding: '10px 0', overflowY: 'auto' },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: 'Rajdhani, sans-serif',
    fontWeight: '600',
    letterSpacing: '0.5px',
    transition: 'all 0.2s',
    position: 'relative',
  },
  navIcon: { fontSize: '16px', width: '20px', textAlign: 'center' },
  activeDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#e94560',
    position: 'absolute',
    right: '15px',
    boxShadow: '0 0 6px #e94560',
  },
  logout: {
    margin: '10px 20px',
    padding: '10px',
    background: 'rgba(233,69,96,0.1)',
    border: '1px solid rgba(233,69,96,0.3)',
    color: '#e94560',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: 'Rajdhani, sans-serif',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    letterSpacing: '1px',
  },
    notifBtn: { width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontFamily: 'Rajdhani, sans-serif', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' },
    notifBadge: { background: '#e94560', color: '#fff', borderRadius: '50%', padding: '2px 7px', fontSize: '11px', fontWeight: '700' },
    notifDropdown: { position: 'absolute', bottom: '45px', left: '0', right: '0', background: '#0d0d1a', border: '1px solid rgba(233,69,96,0.3)', borderRadius: '10px', padding: '10px', zIndex: 999, maxHeight: '250px', overflowY: 'auto' },
    notifItem: { padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    notifMsg: { color: '#fff', fontSize: '12px', marginBottom: '3px' },
    notifTime: { color: '#8892a4', fontSize: '10px' },
    notifEmpty: { color: '#8892a4', fontSize: '12px', textAlign: 'center', padding: '10px 0' },
    clearBtn: { width: '100%', marginTop: '8px', padding: '6px', background: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.3)', color: '#e94560', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontFamily: 'Rajdhani, sans-serif', fontWeight: '600' },
    version: { color: '#333', fontSize: '10px', textAlign: 'center', padding: '10px', letterSpacing: '1px' },
    mobileTopBar: {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '12px 20px', background: '#0d0d1a',
  borderBottom: '1px solid rgba(233,69,96,0.2)', 
  position: 'sticky', top: 0, zIndex: 100,
},
mobileLogo: { display: 'flex', alignItems: 'center', gap: '8px' },
mobileLogoText: { fontFamily: 'Orbitron, sans-serif', color: '#e94560', fontSize: '18px', letterSpacing: '3px' },
mobileRight: { display: 'flex', alignItems: 'center', gap: '12px' },
mobileUser: { color: '#8892a4', fontSize: '13px' },
hamburger: { background: 'none', border: '1px solid rgba(233,69,96,0.3)', color: '#e94560', fontSize: '18px', cursor: 'pointer', borderRadius: '6px', padding: '4px 10px' },
mobileMenu: {
  position: 'fixed', top: '52px', left: 0, right: 0,
  background: '#0d0d1a', borderBottom: '1px solid rgba(233,69,96,0.2)',
  zIndex: 99, padding: '10px 0',
},
mobileMenuItem: {
  display: 'flex', alignItems: 'center', gap: '12px',
  padding: '14px 20px', cursor: 'pointer', fontSize: '15px',
  fontFamily: 'Rajdhani, sans-serif', fontWeight: '600',
},
mobileMenuIcon: { fontSize: '18px', width: '24px' },
mobileMenuLogout: {
  display: 'flex', alignItems: 'center', gap: '12px',
  padding: '14px 20px', cursor: 'pointer', fontSize: '15px',
  color: '#e94560', fontFamily: 'Rajdhani, sans-serif', fontWeight: '600',
  borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '5px',
},
bottomNav: {
  position: 'fixed', bottom: 0, left: 0, right: 0,
  background: '#0d0d1a', borderTop: '1px solid rgba(233,69,96,0.2)',
  display: 'flex', justifyContent: 'space-around', alignItems: 'center',
  padding: '8px 0', zIndex: 100,
},
bottomNavItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer', flex: 1 },
bottomNavIcon: { fontSize: '20px' },
bottomNavLabel: { fontSize: '10px', fontFamily: 'Rajdhani, sans-serif', fontWeight: '600' },
};

export default Navbar;