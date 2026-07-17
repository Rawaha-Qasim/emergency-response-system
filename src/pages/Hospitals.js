import React, { useState } from 'react';

function Hospitals() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const isMobile = window.innerWidth <= 768;

  const hospitals = [
    { name: 'Aga Khan University Hospital', location: 'Stadium Road, Karachi', beds: 700, available: 45, status: 'Available', type: 'Private', contact: '021-34930051', speciality: 'Multi-Specialty' },
    { name: 'Jinnah Postgraduate Medical Centre', location: 'Rafiqui H.J. Shaheed Road, Karachi', beds: 1800, available: 120, status: 'Available', type: 'Government', contact: '021-99201300', speciality: 'Trauma Center' },
    { name: 'Civil Hospital Karachi', location: 'Bunder Road, Karachi', beds: 1600, available: 80, status: 'Available', type: 'Government', contact: '021-99215740', speciality: 'General' },
    { name: 'Liaquat National Hospital', location: 'National Stadium Road, Karachi', beds: 500, available: 0, status: 'Full', type: 'Private', contact: '021-34412000', speciality: 'Cardiac Care' },
    { name: 'South City Hospital', location: 'Clifton, Karachi', beds: 200, available: 22, status: 'Available', type: 'Private', contact: '021-35871333', speciality: 'General' },
    { name: 'Indus Hospital', location: 'Korangi, Karachi', beds: 150, available: 10, status: 'Limited', type: 'NGO', contact: '021-35112709', speciality: 'Pediatrics' },
  ];

  const filters = ['All', 'Government', 'Private', 'NGO'];

  const filtered = hospitals.filter(h =>
    (filter === 'All' || h.type === filter) &&
    h.name.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (status) => {
    if (status === 'Available') return '#2ecc71';
    if (status === 'Limited') return '#f39c12';
    return '#e94560';
  };

  return (
    <div style={{ ...styles.container, padding: isMobile ? '15px 12px' : '30px' }}>
      <div style={styles.bgCircle} />

      {/* Header */}
      <div style={styles.header}>
        <p style={styles.headerTag}>MEDICAL FACILITIES</p>
        <h2 style={{ ...styles.headerTitle, fontSize: isMobile ? '20px' : '28px' }}>Hospitals Directory</h2>
        <p style={styles.headerSub}>Real-time availability of hospitals and medical centers</p>
      </div>

      {/* Stats Row */}
      <div style={{ ...styles.statsRow, gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? '10px' : '15px' }}>
        {[
          { label: 'Total Hospitals', value: hospitals.length, color: '#3498db' },
          { label: 'Available', value: hospitals.filter(h => h.status === 'Available').length, color: '#2ecc71' },
          { label: 'Limited', value: hospitals.filter(h => h.status === 'Limited').length, color: '#f39c12' },
          { label: 'Full', value: hospitals.filter(h => h.status === 'Full').length, color: '#e94560' },
        ].map((s, i) => (
          <div key={i} style={{ ...styles.statCard, borderTop: `2px solid ${s.color}` }}>
            <p style={{ ...styles.statValue, color: s.color, fontSize: isMobile ? '24px' : '32px' }}>{s.value}</p>
            <p style={styles.statLabel}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div style={{ ...styles.controls, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center' }}>
        <div style={styles.searchWrapper}>
          <span>🔍</span>
          <input
            style={styles.searchInput}
            placeholder="Search hospitals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
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
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Hospital Cards */}
      <div style={{ ...styles.grid, gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)' }}>
        {filtered.map((h, i) => (
          <div key={i} style={styles.card}>
            <div style={styles.cardTop}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={styles.hospitalName}>{h.name}</p>
                <p style={styles.hospitalLocation}>📍 {h.location}</p>
              </div>
              <span style={{ ...styles.statusBadge, backgroundColor: `${statusColor(h.status)}22`, color: statusColor(h.status), border: `1px solid ${statusColor(h.status)}44` }}>
                {h.status}
              </span>
            </div>

            <div style={{ ...styles.cardMid, gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)' }}>
              <div style={styles.infoItem}>
                <p style={styles.infoLabel}>TYPE</p>
                <p style={styles.infoValue}>{h.type}</p>
              </div>
              <div style={styles.infoItem}>
                <p style={styles.infoLabel}>SPECIALITY</p>
                <p style={styles.infoValue}>{h.speciality}</p>
              </div>
              <div style={styles.infoItem}>
                <p style={styles.infoLabel}>TOTAL BEDS</p>
                <p style={styles.infoValue}>{h.beds}</p>
              </div>
              <div style={styles.infoItem}>
                <p style={styles.infoLabel}>AVAILABLE</p>
                <p style={{ ...styles.infoValue, color: statusColor(h.status) }}>{h.available}</p>
              </div>
            </div>

            <div style={styles.barBg}>
              <div style={{
                ...styles.barFill,
                width: `${(h.available / h.beds) * 100}%`,
                backgroundColor: statusColor(h.status),
                boxShadow: `0 0 8px ${statusColor(h.status)}`,
              }} />
            </div>

            <div style={styles.cardBottom}>
              <span style={styles.contactText}>📞 {h.contact}</span>
              <button style={styles.callBtn}>Call Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { overflowY: 'auto', minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0f 0%, #0d0d1a 100%)', position: 'relative' },
  bgCircle: { position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(46,204,113,0.05), transparent)', top: '-100px', right: '-100px', pointerEvents: 'none' },
  header: { marginBottom: '20px' },
  headerTag: { color: '#2ecc71', fontSize: '11px', letterSpacing: '4px', fontFamily: 'Orbitron, sans-serif', marginBottom: '8px' },
  headerTitle: { color: '#fff', fontFamily: 'Orbitron, sans-serif', fontWeight: '700', marginBottom: '8px' },
  headerSub: { color: '#8892a4', fontSize: '13px' },
  statsRow: { display: 'grid', marginBottom: '15px' },
  statCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px 15px' },
  statValue: { fontWeight: '700', fontFamily: 'Orbitron, sans-serif', marginBottom: '4px' },
  statLabel: { color: '#8892a4', fontSize: '11px', letterSpacing: '1px' },
  controls: { display: 'flex', gap: '10px', marginBottom: '15px' },
  searchWrapper: { display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 15px', flex: 1 },
  searchInput: { flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '14px', fontFamily: 'Rajdhani, sans-serif' },
  filterRow: { display: 'flex', gap: '8px' },
  filterBtn: { padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontFamily: 'Rajdhani, sans-serif', fontWeight: '600' },
  grid: { display: 'grid', gap: '12px' },
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '15px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '10px' },
  hospitalName: { color: '#fff', fontSize: '14px', fontWeight: '700', marginBottom: '4px' },
  hospitalLocation: { color: '#8892a4', fontSize: '11px' },
  statusBadge: { padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap', flexShrink: 0 },
  cardMid: { display: 'grid', gap: '10px', marginBottom: '12px' },
  infoItem: {},
  infoLabel: { color: '#555', fontSize: '10px', letterSpacing: '1px', marginBottom: '3px' },
  infoValue: { color: '#fff', fontSize: '13px', fontWeight: '600' },
  barBg: { height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginBottom: '12px' },
  barFill: { height: '100%', borderRadius: '2px', transition: 'width 0.5s' },
  cardBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  contactText: { color: '#8892a4', fontSize: '12px' },
  callBtn: { padding: '7px 15px', background: 'rgba(46,204,113,0.15)', border: '1px solid rgba(46,204,113,0.3)', color: '#2ecc71', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontFamily: 'Rajdhani, sans-serif', fontWeight: '600' },
};

export default Hospitals;