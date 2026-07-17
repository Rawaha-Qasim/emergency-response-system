import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ReportEmergency from './pages/ReportEmergency';
import Hospitals from './pages/Hospitals';
import Police from './pages/Police';
import LiveTracking from './pages/LiveTracking';
import Alerts from './pages/Alerts';
import AdminPanel from './pages/AdminPanel';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('citizen');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role || 'citizen');
          } else {
            setRole('citizen');
          }
        } catch (err) {
          console.error(err);
          setRole('citizen');
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'emergencies'),
      where('reportedBy', '==', user.email)
    );
    let isFirst = true;
    const unsub = onSnapshot(q, (snapshot) => {
      if (isFirst) { isFirst = false; return; }
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'modified') {
          const data = change.doc.data();
          setNotifications(prev => [...prev, {
            id: change.doc.id,
            message: `Your ${data.type} report status changed to: ${data.status}`,
            time: new Date().toLocaleTimeString()
          }]);
        }
      });
    });
    return () => unsub();
  }, [user]);

  if (loading) return <div style={{color: '#fff', textAlign: 'center', marginTop: '50px'}}>Loading...</div>;

  if (!user) return <Login />;

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard user={user} setCurrentPage={setCurrentPage} />;
      case 'report': return <ReportEmergency />;
      case 'hospitals': return <Hospitals />;
      case 'police': return <Police />;
      case 'tracking': return <LiveTracking />;
      case 'alerts': return <Alerts />;
      case 'admin': return role === 'admin' ? <AdminPanel /> : <Dashboard user={user} setCurrentPage={setCurrentPage} />;
      case 'profile': return <Profile />;
      default: return <Dashboard user={user} setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', backgroundColor: '#0a0a0f', minHeight: '100vh' }}>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} user={user} role={role} notifications={notifications} setNotifications={setNotifications} />
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: isMobile ? '70px' : '0' }}>
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
