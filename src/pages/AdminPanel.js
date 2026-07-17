import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';

function AdminPanel() {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'emergencies'), (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setEmergencies(data);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'emergencies', id), { status: newStatus });
    } catch (err) {
      console.error(err);
    }
  };

  const statusColor = (status) => {
    if (status === 'resolved') return '#2ecc71';
    if (status === 'responding') return '#f39c12';
    return '#e94560';
  };

  const typeIcon = (type) => {
    const icons = {
      Accident: '🚗', Fire: '🔥', Flood: '🌊', Earthquake: '🌍',
      Medical: '🏥', Crime: '👮', Other: '❓'
    };
    return icons[type] || '❓';
  };

  const filters = ['All', 'pending', 'responding', 'resolved'];
  const filtered = emergencies.filter(e => filter === 'All' || e.status === filter);

  return (
    <div style={{ ...styles.container, padding: isMobile ? '15px 12px' : '30px' }}>
      <div style={styles.bgCircle} />

      {/* Header */}
      <div style={styles.header}>
        <p style={styles.headerTag}>SYSTEM CONTROL</p>
        <h2 style={{ ...styles.headerTitle, fontSize: isMobile ? '18px' : '28px' }}>Admin Monitoring Dashboard</h2>
        <p style={styles.headerSub}>Monitor and manage all emergency reports</p>
      </div>

      {/* Stats */}
      <div style={{ ...styles.statsRow, gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? '10px' : '15px' }}>
        {[
          { label: 'Total Reports', value: emergencies.length, color: '#3498db' },
          { label: 'Pending', value: emergencies.filter(e => e.status === 'pending').length, color: '#e94560' },
          { label: 'Responding', value: emergencies.filter(e => e.status === 'responding').length, color: '#f39c12' },
          { label: 'Resolved', value: emergencies.filter(e => e.status === 'resolved').length, color: '#2ecc71' },
        ].map((s, i) => (
          <div key={i} style={{ ...styles.statCard, borderTop: `2px solid ${s.color}` }}>
            <p style={{ ...styles.statValue, color: s.color, fontSize: isMobile ? '24px' : '32px' }}>{s.value}</p>
            <p style={styles.statLabel}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ ...styles.filterRow, flexWrap: 'wrap' }}>
        {filters.map(f => (
          <button
            key={f}
            style={{
              ...styles.filterBtn,
              background: filter === f ? 'rgba(233,69,96,0.2)' : 'rgba(255,255,255,0.03)',
              border: filter === f ? '1px solid #e94560' : '1px solid rgba(255,255,255,0.08)',
              color: filter === f ? '#e94560' : '#8892a4',
            }}
            onClick={() => setFilter(f)}
          >
            {f === 'All' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={styles.tableBox}>
        <p style={styles.sectionLabel}>EMERGENCY REPORTS LOG</p>

        {loading ? (
          <p style={styles.emptyText}>Loading data...</p>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyBox}>
            <span style={styles.emptyIcon}>📭</span>
            <p style={styles.emptyText}>No emergency reports found.</p>
          </div>
        ) : isMobile ? (
          // Mobile Card View
          <div style={styles.cardList}>
            {filtered.map((e) => (
              <div key={e.id} style={styles.mobileCard}>
                <div style={styles.mobileCardTop}>
                  <span style={styles.mobileTypeText}>{typeIcon(e.type)} {e.type}</span>
                  <span style={{ ...styles.badge, backgroundColor: `${statusColor(e.status)}22`, color: statusColor(e.status), border: `1px solid ${statusColor(e.status)}44` }}>
                    {e.status}
                  </span>
                </div>
                <p style={styles.mobileLocation}>📍 {e.location}</p>
                <p style={styles.mobileDesc}>{e.description}</p>
                <p style={styles.mobileReporter}>👤 {e.reportedBy}</p>
                <div style={styles.mobileAction}>
                  <span style={styles.mobileActionLabel}>Update Status:</span>
                  <select
                    value={e.status}
                    onChange={(ev) => updateStatus(e.id, ev.target.value)}
                    style={styles.select}
                  >
                    <option value="pending">Pending</option>
                    <option value="responding">Responding</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Desktop Table View
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Location</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Reported By</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.id} style={styles.tr}>
                    <td style={styles.td}>
                      <span style={styles.typeCell}>{typeIcon(e.type)} {e.type}</span>
                    </td>
                    <td style={styles.td}>📍 {e.location}</td>
                    <td style={{ ...styles.td, maxWidth: '250px' }}>{e.description}</td>
                    <td style={styles.td}>{e.reportedBy}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, backgroundColor: `${statusColor(e.status)}22`, color: statusColor(e.status), border: `1px solid ${statusColor(e.status)}44` }}>
                        {e.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <select
                        value={e.status}
                        onChange={(ev) => updateStatus(e.id, ev.target.value)}
                        style={styles.select}
                      >
                        <option value="pending">Pending</option>
                        <option value="responding">Responding</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { overflowY: 'auto', minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0f 0%, #0d0d1a 100%)', position: 'relative' },
  bgCircle: { position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(155,89,182,0.06), transparent)', top: '-100px', right: '-100px', pointerEvents: 'none' },
  header: { marginBottom: '20px' },
  headerTag: { color: '#9b59b6', fontSize: '11px', letterSpacing: '4px', fontFamily: 'Orbitron, sans-serif', marginBottom: '8px' },
  headerTitle: { color: '#fff', fontFamily: 'Orbitron, sans-serif', fontWeight: '700', marginBottom: '8px' },
  headerSub: { color: '#8892a4', fontSize: '13px' },
  statsRow: { display: 'grid', marginBottom: '15px' },
  statCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px 15px' },
  statValue: { fontWeight: '700', fontFamily: 'Orbitron, sans-serif', marginBottom: '4px' },
  statLabel: { color: '#8892a4', fontSize: '11px', letterSpacing: '1px' },
  filterRow: { display: 'flex', gap: '8px', marginBottom: '15px' },
  filterBtn: { padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontFamily: 'Rajdhani, sans-serif', fontWeight: '600' },
  tableBox: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '15px' },
  sectionLabel: { color: '#9b59b6', fontSize: '11px', letterSpacing: '3px', fontFamily: 'Orbitron, sans-serif', marginBottom: '15px' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px 15px', color: '#8892a4', fontSize: '11px', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontFamily: 'Orbitron, sans-serif' },
  tr: { borderBottom: '1px solid rgba(255,255,255,0.04)' },
  td: { padding: '14px 15px', color: '#fff', fontSize: '13px' },
  typeCell: { fontWeight: '600' },
  badge: { padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },
  emptyBox: { textAlign: 'center', padding: '50px 0' },
  emptyIcon: { fontSize: '40px', display: 'block', marginBottom: '10px' },
  emptyText: { color: '#8892a4', fontSize: '14px' },
  select: { background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '6px 10px', fontSize: '12px', cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif' },
  // Mobile card styles
  cardList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  mobileCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '15px' },
  mobileCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  mobileTypeText: { color: '#fff', fontSize: '14px', fontWeight: '700' },
  mobileLocation: { color: '#8892a4', fontSize: '12px', marginBottom: '6px' },
  mobileDesc: { color: '#ccc', fontSize: '13px', marginBottom: '6px', lineHeight: 1.4 },
  mobileReporter: { color: '#8892a4', fontSize: '11px', marginBottom: '10px' },
  mobileAction: { display: 'flex', alignItems: 'center', gap: '10px' },
  mobileActionLabel: { color: '#8892a4', fontSize: '12px' },
};

export default AdminPanel;