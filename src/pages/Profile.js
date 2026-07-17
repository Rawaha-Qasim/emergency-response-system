import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { updatePassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';

function Profile() {
  const user = auth.currentUser;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [myReports, setMyReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const isMobile = window.innerWidth <= 768;

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setPhone(data.phone || '');
          setCity(data.city || '');
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadProfile();
  }, [user.uid]);

  // Load user's emergency reports
  useEffect(() => {
    const loadReports = async () => {
      try {
        const q = query(collection(db, 'emergencies'), where('reportedBy', '==', user.email));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setMyReports(data);
      } catch (err) {
        console.error(err);
      }
      setLoadingReports(false);
    };
    loadReports();
  }, [user.email]);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await setDoc(doc(db, 'users', user.uid), { name, phone, city }, { merge: true });
      setMessage('✅ Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      setMessage('❌ Error: ' + err.message);
    }
    setSaving(false);
  };

  const statusColor = (status) => {
    if (status === 'resolved') return '#2ecc71';
    if (status === 'responding') return '#f39c12';
    return '#e94560';
  };

  const typeIcon = (type) => {
    const icons = { Accident: '🚗', Fire: '🔥', Flood: '🌊', Earthquake: '🌍', Medical: '🏥', Crime: '👮', Other: '❓' };
    return icons[type] || '❓';
  };

  return (
    <div style={{ ...styles.container, padding: isMobile ? '15px 12px' : '30px' }}>
      <div style={styles.bgCircle} />

      {/* Header */}
      <div style={styles.header}>
        <p style={styles.headerTag}>ACCOUNT SETTINGS</p>
        <h2 style={{ ...styles.headerTitle, fontSize: isMobile ? '20px' : '28px' }}>My Profile</h2>
        <p style={styles.headerSub}>Manage your account information and view your activity</p>
      </div>

      <div style={{ ...styles.mainGrid, gridTemplateColumns: isMobile ? '1fr' : '1fr 1.5fr' }}>

        {/* Profile Card */}
        <div style={styles.profileCard}>
          <div style={styles.avatarBox}>
            <div style={styles.avatar}>{user.email.charAt(0).toUpperCase()}</div>
            <p style={styles.email}>{user.email}</p>
            <span style={styles.roleBadge}>👤 Citizen</span>
          </div>

          <div style={styles.divider} />

          {message && (
            <div style={{ ...styles.messageBox, color: message.startsWith('✅') ? '#2ecc71' : '#e94560', borderColor: message.startsWith('✅') ? '#2ecc71' : '#e94560' }}>
              {message}
            </div>
          )}

          <div style={styles.fieldGroup}>
            <label style={styles.label}>FULL NAME</label>
            {editing ? (
              <input style={styles.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" />
            ) : (
              <p style={styles.fieldValue}>{name || 'Not set'}</p>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>PHONE NUMBER</label>
            {editing ? (
              <input style={styles.input} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="03XX-XXXXXXX" />
            ) : (
              <p style={styles.fieldValue}>{phone || 'Not set'}</p>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>CITY</label>
            {editing ? (
              <input style={styles.input} value={city} onChange={(e) => setCity(e.target.value)} placeholder="Karachi, Lahore, etc." />
            ) : (
              <p style={styles.fieldValue}>{city || 'Not set'}</p>
            )}
          </div>

          {editing ? (
            <div style={styles.btnRow}>
              <button style={styles.saveBtn} onClick={handleSave} disabled={saving}>
                {saving ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
              <button style={styles.cancelBtn} onClick={() => setEditing(false)}>Cancel</button>
            </div>
          ) : (
            <button style={styles.editBtn} onClick={() => setEditing(true)}>✏️ Edit Profile</button>
          )}
        </div>

        {/* Activity / Reports */}
        <div style={styles.activityCard}>
          <p style={styles.sectionLabel}>MY EMERGENCY REPORTS</p>

          {loadingReports ? (
            <p style={styles.emptyText}>Loading...</p>
          ) : myReports.length === 0 ? (
            <div style={styles.emptyBox}>
              <span style={styles.emptyIcon}>📭</span>
              <p style={styles.emptyText}>You haven't reported any emergencies yet.</p>
            </div>
          ) : (
            <div style={{ ...styles.reportsList, maxHeight: isMobile ? 'none' : '380px' }}>
              {myReports.map((r) => (
                <div key={r.id} style={{ ...styles.reportRow, flexDirection: isMobile ? 'column' : 'row' }}>
                  <div style={{ ...styles.reportTopRow, display: isMobile ? 'flex' : 'contents' }}>
                    <div style={styles.reportIconBox}>
                      <span style={styles.reportIcon}>{typeIcon(r.type)}</span>
                    </div>
                    {isMobile && (
                      <span style={{ ...styles.statusBadge, backgroundColor: `${statusColor(r.status)}22`, color: statusColor(r.status), border: `1px solid ${statusColor(r.status)}44`, marginLeft: 'auto' }}>
                        {r.status}
                      </span>
                    )}
                  </div>
                  <div style={styles.reportInfo}>
                    <p style={styles.reportType}>{r.type}</p>
                    <p style={styles.reportLocation}>📍 {r.location}</p>
                    <p style={styles.reportDesc}>{r.description}</p>
                    <p style={styles.reportTime}>
                    🕐 {r.createdAt ? new Date(r.createdAt.seconds * 1000).toLocaleString() : 'N/A'}
                    </p>
                    <div style={styles.timeline}>
                    {['pending', 'responding', 'resolved'].map((step, i) => {
                        const steps = ['pending', 'responding', 'resolved'];
                        const current = steps.indexOf(r.status);
                        const done = i <= current;
                        return (
                        <div key={step} style={styles.timelineStep}>
                            <div style={{...styles.timelineDot, backgroundColor: done ? '#e94560' : '#333'}} />
                            <p style={{...styles.timelineLabel, color: done ? '#fff' : '#555'}}>{step}</p>
                        </div>
                        );
                    })}
                    </div>
                  </div>
                  {!isMobile && (
                    <span style={{ ...styles.statusBadge, backgroundColor: `${statusColor(r.status)}22`, color: statusColor(r.status), border: `1px solid ${statusColor(r.status)}44` }}>
                      {r.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Stats Summary */}
          <div style={{ ...styles.summaryRow, gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(3, 1fr)' }}>
            {[
              { label: 'Total Reports', value: myReports.length, color: '#3498db' },
              { label: 'Resolved', value: myReports.filter(r => r.status === 'resolved').length, color: '#2ecc71' },
              { label: 'Pending', value: myReports.filter(r => r.status !== 'resolved').length, color: '#f39c12' },
            ].map((s, i) => (
              <div key={i} style={{ ...styles.summaryCard, borderTop: `2px solid ${s.color}` }}>
                <p style={{ ...styles.summaryValue, color: s.color, fontSize: isMobile ? '22px' : '28px' }}>{s.value}</p>
                <p style={styles.summaryLabel}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: { overflowY: 'auto', minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0f 0%, #0d0d1a 100%)', position: 'relative' },
  bgCircle: { position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(233,69,96,0.06), transparent)', top: '-100px', right: '-100px', pointerEvents: 'none' },
  header: { marginBottom: '20px' },
  headerTag: { color: '#e94560', fontSize: '11px', letterSpacing: '4px', fontFamily: 'Orbitron, sans-serif', marginBottom: '8px' },
  headerTitle: { color: '#fff', fontFamily: 'Orbitron, sans-serif', fontWeight: '700', marginBottom: '8px' },
  headerSub: { color: '#8892a4', fontSize: '13px' },
  mainGrid: { display: 'grid', gap: '15px' },
  profileCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px' },
  avatarBox: { textAlign: 'center', marginBottom: '15px' },
  avatar: { width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(135deg, #e94560, #0f3460)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '700', color: '#fff', margin: '0 auto 12px' },
  email: { color: '#fff', fontSize: '14px', fontWeight: '600', marginBottom: '8px', wordBreak: 'break-all' },
  roleBadge: { display: 'inline-block', padding: '4px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', backgroundColor: 'rgba(52,152,219,0.15)', color: '#3498db', border: '1px solid rgba(52,152,219,0.3)' },
  divider: { height: '1px', background: 'rgba(255,255,255,0.06)', margin: '20px 0' },
  messageBox: { padding: '10px 15px', borderRadius: '8px', border: '1px solid', fontSize: '13px', marginBottom: '15px', background: 'rgba(255,255,255,0.03)' },
  fieldGroup: { marginBottom: '18px' },
  label: { color: '#8892a4', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '6px', fontFamily: 'Orbitron, sans-serif' },
  fieldValue: { color: '#fff', fontSize: '15px', fontWeight: '600' },
  input: { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '14px', fontFamily: 'Rajdhani, sans-serif', outline: 'none', boxSizing: 'border-box' },
  btnRow: { display: 'flex', gap: '10px', marginTop: '10px' },
  saveBtn: { flex: 1, padding: '12px', background: 'linear-gradient(135deg, #2ecc71, #27ae60)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', fontFamily: 'Rajdhani, sans-serif' },
  cancelBtn: { flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#8892a4', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', fontFamily: 'Rajdhani, sans-serif' },
  editBtn: { width: '100%', padding: '12px', marginTop: '10px', background: 'linear-gradient(135deg, #e94560, #c0392b)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', fontFamily: 'Rajdhani, sans-serif', boxShadow: '0 4px 20px rgba(233,69,96,0.4)' },
  activityCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px' },
  sectionLabel: { color: '#e94560', fontSize: '11px', letterSpacing: '3px', fontFamily: 'Orbitron, sans-serif', marginBottom: '15px' },
  reportsList: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', overflowY: 'auto' },
  reportRow: { display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', padding: '14px' },
  reportTopRow: { width: '100%', alignItems: 'center', marginBottom: '8px' },
  reportIconBox: { width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  reportIcon: { fontSize: '18px' },
  reportInfo: { flex: 1, minWidth: 0 },
  reportType: { color: '#fff', fontSize: '14px', fontWeight: '700', marginBottom: '2px' },
  reportLocation: { color: '#8892a4', fontSize: '12px', marginBottom: '2px' },
  reportDesc: { color: '#555', fontSize: '12px' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap', flexShrink: 0 },
  summaryRow: { display: 'grid', gap: '12px' },
  summaryCard: { background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '15px', textAlign: 'center' },
  summaryValue: { fontWeight: '700', fontFamily: 'Orbitron, sans-serif', marginBottom: '4px' },
  summaryLabel: { color: '#8892a4', fontSize: '11px', letterSpacing: '1px' },
  emptyBox: { textAlign: 'center', padding: '40px 0' },
  emptyIcon: { fontSize: '40px', display: 'block', marginBottom: '10px' },
  emptyText: { color: '#8892a4', fontSize: '14px' },
  reportTime: { color: '#666', fontSize: '11px', marginTop: '3px' },
  timeline: { display: 'flex', alignItems: 'center', gap: '5px', marginTop: '8px' },
  timelineStep: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' },
  timelineDot: { width: '10px', height: '10px', borderRadius: '50%' },
  timelineLabel: { fontSize: '9px', letterSpacing: '1px' },
};

export default Profile;