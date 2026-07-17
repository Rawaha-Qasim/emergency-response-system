import React, { useState } from 'react';

function Alerts() {
  const [filter, setFilter] = useState('All');
  const isMobile = window.innerWidth <= 768;

  const alerts = [
    { id: 1, title: 'Flash Flood Warning', message: 'Heavy rainfall expected in Karachi. Avoid low-lying areas and underpasses.', type: 'danger', area: 'Karachi', time: '10 mins ago' },
    { id: 2, title: 'Earthquake Alert', message: 'Magnitude 4.2 earthquake detected near Quetta. Aftershocks possible.', type: 'danger', area: 'Quetta', time: '25 mins ago' },
    { id: 3, title: 'Road Accident', message: 'Major accident on M2 Motorway. Traffic diverted, expect delays.', type: 'warning', area: 'Lahore', time: '1 hour ago' },
    { id: 4, title: 'Fire Emergency', message: 'Industrial fire reported in SITE area. Residents advised to stay indoors.', type: 'danger', area: 'Karachi', time: '2 hours ago' },
    { id: 5, title: 'All Clear', message: 'Flood situation normalized in Hyderabad. Normal operations resumed.', type: 'success', area: 'Hyderabad', time: '3 hours ago' },
    { id: 6, title: 'Heat Wave Alert', message: 'Extreme heat expected this week. Stay hydrated and avoid outdoor activity.', type: 'warning', area: 'Sindh', time: '5 hours ago' },
  ];

  const filters = ['All', 'danger', 'warning', 'success'];
  const filterLabels = { All: 'All', danger: 'Critical', warning: 'Warning', success: 'Resolved' };

  const typeColor = (type) => {
    if (type === 'danger') return '#e94560';
    if (type === 'warning') return '#f39c12';
    return '#2ecc71';
  };

  const typeIcon = (type) => {
    if (type === 'danger') return '🚨';
    if (type === 'warning') return '⚠️';
    return '✅';
  };

  const filtered = alerts.filter(a => filter === 'All' || a.type === filter);

  return (
    <div style={{ ...styles.container, padding: isMobile ? '15px 12px' : '30px' }}>
      <div style={styles.bgCircle} />

      {/* Header */}
      <div style={styles.header}>
        <p style={styles.headerTag}>BROADCAST SYSTEM</p>
        <h2 style={{ ...styles.headerTitle, fontSize: isMobile ? '20px' : '28px' }}>Emergency Alerts</h2>
        <p style={styles.headerSub}>Real-time alerts and broadcast notifications</p>
      </div>

      {/* Stats */}
      <div style={{ ...styles.statsRow, gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? '10px' : '15px' }}>
        {[
          { label: 'Total Alerts', value: alerts.length, color: '#3498db' },
          { label: 'Critical', value: alerts.filter(a => a.type === 'danger').length, color: '#e94560' },
          { label: 'Warnings', value: alerts.filter(a => a.type === 'warning').length, color: '#f39c12' },
          { label: 'Resolved', value: alerts.filter(a => a.type === 'success').length, color: '#2ecc71' },
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
            {filterLabels[f]}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div style={styles.alertList}>
        {filtered.map((a) => (
          <div key={a.id} style={{ ...styles.alertCard, borderLeft: `3px solid ${typeColor(a.type)}`, flexDirection: isMobile ? 'column' : 'row' }}>
            <div style={{ ...styles.iconBox, backgroundColor: `${typeColor(a.type)}22`, border: `1px solid ${typeColor(a.type)}44` }}>
              <span style={styles.alertIcon}>{typeIcon(a.type)}</span>
            </div>
            <div style={styles.alertBody}>
              <div style={{ ...styles.alertTop, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'flex-start', gap: isMobile ? '6px' : '10px' }}>
                <p style={styles.alertTitle}>{a.title}</p>
                <span style={{ ...styles.areaBadge, backgroundColor: `${typeColor(a.type)}22`, color: typeColor(a.type), border: `1px solid ${typeColor(a.type)}44` }}>
                  📍 {a.area}
                </span>
              </div>
              <p style={styles.alertMsg}>{a.message}</p>
              <p style={styles.alertTime}>🕐 {a.time}</p>
            </div>
          </div>
        ))}
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
  statsRow: { display: 'grid', marginBottom: '15px' },
  statCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px 15px' },
  statValue: { fontWeight: '700', fontFamily: 'Orbitron, sans-serif', marginBottom: '4px' },
  statLabel: { color: '#8892a4', fontSize: '11px', letterSpacing: '1px' },
  filterRow: { display: 'flex', gap: '8px', marginBottom: '15px' },
  filterBtn: { padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontFamily: 'Rajdhani, sans-serif', fontWeight: '600', letterSpacing: '0.5px' },
  alertList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  alertCard: { display: 'flex', gap: '15px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '15px' },
  iconBox: { width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  alertIcon: { fontSize: '18px' },
  alertBody: { flex: 1, minWidth: 0 },
  alertTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px', gap: '10px' },
  alertTitle: { color: '#fff', fontSize: '14px', fontWeight: '700' },
  areaBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap', flexShrink: 0 },
  alertMsg: { color: '#8892a4', fontSize: '13px', marginBottom: '8px', lineHeight: 1.5 },
  alertTime: { color: '#555', fontSize: '11px' },
};

export default Alerts;