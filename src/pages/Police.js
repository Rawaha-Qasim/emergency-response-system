import React, { useState } from 'react';

function Police() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const isMobile = window.innerWidth <= 768;

  const units = [
    { name: 'Karachi Central Police', location: 'M.A. Jinnah Road, Karachi', units: 45, available: 12, status: 'Available', type: 'Police', contact: '021-99212000', speciality: 'Crime Control' },
    { name: 'Rescue 1122 Karachi', location: 'Gulshan-e-Iqbal, Karachi', units: 30, available: 8, status: 'Available', type: 'Rescue', contact: '1122', speciality: 'Emergency Rescue' },
    { name: 'Rangers Headquarters', location: 'Faisal Cantonment, Karachi', units: 200, available: 50, status: 'Available', type: 'Rangers', contact: '021-99333000', speciality: 'Security' },
    { name: 'Traffic Police HQ', location: 'Clifton, Karachi', units: 80, available: 0, status: 'Busy', type: 'Police', contact: '021-99333111', speciality: 'Traffic Control' },
    { name: 'Fire Brigade Karachi', location: 'Soldier Bazaar, Karachi', units: 25, available: 5, status: 'Limited', type: 'Fire', contact: '16', speciality: 'Fire Fighting' },
    { name: 'Anti-Violent Crime Cell', location: 'Garden, Karachi', units: 60, available: 20, status: 'Available', type: 'Police', contact: '021-99212100', speciality: 'Crime Investigation' },
  ];

  const filters = ['All', 'Police', 'Rescue', 'Rangers', 'Fire'];

  const filtered = units.filter(u =>
    (filter === 'All' || u.type === filter) &&
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (status) => {
    if (status === 'Available') return '#2ecc71';
    if (status === 'Limited') return '#f39c12';
    return '#e94560';
  };

  const typeColor = (type) => {
    if (type === 'Police') return '#3498db';
    if (type === 'Rescue') return '#2ecc71';
    if (type === 'Rangers') return '#9b59b6';
    if (type === 'Fire') return '#e94560';
    return '#f39c12';
  };

  const typeIcon = (type) => {
    if (type === 'Police') return '👮';
    if (type === 'Rescue') return '🚑';
    if (type === 'Rangers') return '🪖';
    if (type === 'Fire') return '🚒';
    return '🛡️';
  };

  return (
    <div style={{ ...styles.container, padding: isMobile ? '15px 12px' : '30px' }}>
      <div style={styles.bgCircle} />

      {/* Header */}
      <div style={styles.header}>
        <p style={styles.headerTag}>LAW ENFORCEMENT & RESCUE</p>
        <h2 style={{ ...styles.headerTitle, fontSize: isMobile ? '20px' : '28px' }}>Police & Rescue Units</h2>
        <p style={styles.headerSub}>Real-time status of law enforcement and rescue units</p>
      </div>

      {/* Stats Row */}
      <div style={{ ...styles.statsRow, gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? '10px' : '15px' }}>
        {[
          { label: 'Total Units', value: units.length, color: '#3498db' },
          { label: 'Available', value: units.filter(u => u.status === 'Available').length, color: '#2ecc71' },
          { label: 'Limited', value: units.filter(u => u.status === 'Limited').length, color: '#f39c12' },
          { label: 'Busy', value: units.filter(u => u.status === 'Busy').length, color: '#e94560' },
        ].map((s, i) => (
          <div key={i} style={{ ...styles.statCard, borderTop: `2px solid ${s.color}` }}>
            <p style={{ ...styles.statValue, color: s.color, fontSize: isMobile ? '24px' : '32px' }}>{s.value}</p>
            <p style={styles.statLabel}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div style={{ ...styles.controls, flexDirection: isMobile ? 'column' : 'row' }}>
        <div style={styles.searchWrapper}>
          <span>🔍</span>
          <input
            style={styles.searchInput}
            placeholder="Search units..."
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

      {/* Unit Cards */}
      <div style={{ ...styles.grid, gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)' }}>
        {filtered.map((u, i) => (
          <div key={i} style={{ ...styles.card, borderLeft: `3px solid ${typeColor(u.type)}` }}>
            <div style={styles.cardTop}>
              <div style={{ ...styles.cardTopLeft, flex: 1, minWidth: 0 }}>
                <div style={{ ...styles.typeIconBox, backgroundColor: `${typeColor(u.type)}22`, border: `1px solid ${typeColor(u.type)}44` }}>
                  <span style={styles.typeIcon}>{typeIcon(u.type)}</span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={styles.unitName}>{u.name}</p>
                  <p style={styles.unitLocation}>📍 {u.location}</p>
                </div>
              </div>
              <span style={{ ...styles.statusBadge, backgroundColor: `${statusColor(u.status)}22`, color: statusColor(u.status), border: `1px solid ${statusColor(u.status)}44` }}>
                {u.status}
              </span>
            </div>

            <div style={{ ...styles.cardMid, gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)' }}>
              <div style={styles.infoItem}>
                <p style={styles.infoLabel}>TYPE</p>
                <p style={{ ...styles.infoValue, color: typeColor(u.type) }}>{u.type}</p>
              </div>
              <div style={styles.infoItem}>
                <p style={styles.infoLabel}>SPECIALITY</p>
                <p style={styles.infoValue}>{u.speciality}</p>
              </div>
              <div style={styles.infoItem}>
                <p style={styles.infoLabel}>TOTAL UNITS</p>
                <p style={styles.infoValue}>{u.units}</p>
              </div>
              <div style={styles.infoItem}>
                <p style={styles.infoLabel}>AVAILABLE</p>
                <p style={{ ...styles.infoValue, color: statusColor(u.status) }}>{u.available}</p>
              </div>
            </div>

            <div style={styles.barBg}>
              <div style={{
                ...styles.barFill,
                width: `${(u.available / u.units) * 100}%`,
                backgroundColor: statusColor(u.status),
                boxShadow: `0 0 8px ${statusColor(u.status)}`,
              }} />
            </div>

            <div style={styles.cardBottom}>
              <span style={styles.contactText}>📞 {u.contact}</span>
              <button style={{ ...styles.callBtn, borderColor: `${typeColor(u.type)}44`, color: typeColor(u.type), backgroundColor: `${typeColor(u.type)}15` }}>
                Contact Unit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { overflowY: 'auto', minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0f 0%, #0d0d1a 100%)', position: 'relative' },
  bgCircle: { position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,152,219,0.05), transparent)', top: '-100px', right: '-100px', pointerEvents: 'none' },
  header: { marginBottom: '20px' },
  headerTag: { color: '#3498db', fontSize: '11px', letterSpacing: '4px', fontFamily: 'Orbitron, sans-serif', marginBottom: '8px' },
  headerTitle: { color: '#fff', fontFamily: 'Orbitron, sans-serif', fontWeight: '700', marginBottom: '8px' },
  headerSub: { color: '#8892a4', fontSize: '13px' },
  statsRow: { display: 'grid', marginBottom: '15px' },
  statCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px 15px' },
  statValue: { fontWeight: '700', fontFamily: 'Orbitron, sans-serif', marginBottom: '4px' },
  statLabel: { color: '#8892a4', fontSize: '11px', letterSpacing: '1px' },
  controls: { display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' },
  searchWrapper: { display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 15px', flex: 1, minWidth: '200px' },
  searchInput: { flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '14px', fontFamily: 'Rajdhani, sans-serif' },
  filterRow: { display: 'flex', gap: '8px' },
  filterBtn: { padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontFamily: 'Rajdhani, sans-serif', fontWeight: '600' },
  grid: { display: 'grid', gap: '12px' },
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '15px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '8px' },
  cardTopLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  typeIconBox: { width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  typeIcon: { fontSize: '18px' },
  unitName: { color: '#fff', fontSize: '13px', fontWeight: '700', marginBottom: '3px' },
  unitLocation: { color: '#8892a4', fontSize: '11px' },
  statusBadge: { padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap', flexShrink: 0 },
  cardMid: { display: 'grid', gap: '10px', marginBottom: '12px' },
  infoItem: {},
  infoLabel: { color: '#555', fontSize: '10px', letterSpacing: '1px', marginBottom: '3px' },
  infoValue: { color: '#fff', fontSize: '13px', fontWeight: '600' },
  barBg: { height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginBottom: '12px' },
  barFill: { height: '100%', borderRadius: '2px', transition: 'width 0.5s' },
  cardBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  contactText: { color: '#8892a4', fontSize: '12px' },
  callBtn: { padding: '6px 14px', border: '1px solid', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontFamily: 'Rajdhani, sans-serif', fontWeight: '600' },
};

export default Police;