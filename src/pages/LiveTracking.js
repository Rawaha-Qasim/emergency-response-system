import React, { useState, useEffect } from 'react';

function LiveTracking() {
  const [selected, setSelected] = useState(null);
  const [time, setTime] = useState(new Date());
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const units = [
    { id: 1, name: 'Ambulance A-01', type: 'Ambulance', status: 'Responding', location: 'Shahrah-e-Faisal', lat: '24.8607', lng: '67.0105', speed: '78 km/h', eta: '4 mins', color: '#e94560' },
    { id: 2, name: 'Police Unit P-07', type: 'Police', status: 'Patrolling', location: 'Clifton Block 5', lat: '24.8120', lng: '67.0300', speed: '45 km/h', eta: '—', color: '#3498db' },
    { id: 3, name: 'Fire Engine F-03', type: 'Fire', status: 'Responding', location: 'SITE Area', lat: '24.9200', lng: '67.0200', speed: '65 km/h', eta: '7 mins', color: '#f39c12' },
    { id: 4, name: 'Rescue Unit R-12', type: 'Rescue', status: 'Available', location: 'Gulshan-e-Iqbal', lat: '24.9215', lng: '67.0898', speed: '0 km/h', eta: '—', color: '#2ecc71' },
    { id: 5, name: 'Ambulance A-05', type: 'Ambulance', status: 'Available', location: 'North Nazimabad', lat: '24.9400', lng: '67.0600', speed: '0 km/h', eta: '—', color: '#2ecc71' },
    { id: 6, name: 'Police Unit P-15', type: 'Police', status: 'Responding', location: 'Korangi Road', lat: '24.8400', lng: '67.1200', speed: '90 km/h', eta: '2 mins', color: '#e94560' },
  ];

  const statusColor = (status) => {
    if (status === 'Available') return '#2ecc71';
    if (status === 'Patrolling') return '#3498db';
    return '#e94560';
  };

  const typeIcon = (type) => {
    if (type === 'Ambulance') return '🚑';
    if (type === 'Police') return '🚔';
    if (type === 'Fire') return '🚒';
    return '🚐';
  };

  return (
    <div style={{ ...styles.container, padding: isMobile ? '15px 12px' : '30px' }}>
      <div style={styles.bgCircle} />

      {/* Header */}
      <div style={{ ...styles.header, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '10px' : '0' }}>
        <div>
          <p style={styles.headerTag}>REAL-TIME MONITORING</p>
          <h2 style={{ ...styles.headerTitle, fontSize: isMobile ? '20px' : '28px' }}>Live Tracking</h2>
          <p style={styles.headerSub}>Monitor all active units in real-time</p>
        </div>
        <div style={{ ...styles.clockBox, textAlign: isMobile ? 'left' : 'right' }}>
          <p style={styles.clockLabel}>SYSTEM TIME</p>
          <p style={{ ...styles.clock, fontSize: isMobile ? '20px' : '28px' }}>{time.toLocaleTimeString('en-PK', { hour12: false })}</p>
          <p style={styles.clockDate}>{time.toLocaleDateString('en-PK', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ ...styles.statsRow, gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? '10px' : '15px' }}>
        {[
          { label: 'Total Units', value: units.length, color: '#3498db' },
          { label: 'Responding', value: units.filter(u => u.status === 'Responding').length, color: '#e94560' },
          { label: 'Patrolling', value: units.filter(u => u.status === 'Patrolling').length, color: '#3498db' },
          { label: 'Available', value: units.filter(u => u.status === 'Available').length, color: '#2ecc71' },
        ].map((s, i) => (
          <div key={i} style={{ ...styles.statCard, borderTop: `2px solid ${s.color}` }}>
            <p style={{ ...styles.statValue, color: s.color, fontSize: isMobile ? '24px' : '32px' }}>{s.value}</p>
            <p style={styles.statLabel}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div style={{ ...styles.mainGrid, gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr' }}>

        {/* Map */}
        <div style={styles.mapBox}>
          <div style={styles.mapHeader}>
            <p style={styles.mapTitle}>🗺️ LIVE MAP — KARACHI</p>
            <div style={styles.liveIndicator}>
              <div style={styles.liveDot} />
              <span style={styles.liveText}>LIVE</span>
            </div>
          </div>

          <div style={{ ...styles.mapArea, height: isMobile ? '220px' : '320px' }}>
            <div style={styles.mapGrid}>
              {Array.from({ length: 100 }).map((_, i) => (
                <div key={i} style={styles.mapCell} />
              ))}
            </div>

            {units.map((u) => (
              <div
                key={u.id}
                style={{
                  ...styles.mapDot,
                  backgroundColor: statusColor(u.status),
                  boxShadow: `0 0 12px ${statusColor(u.status)}`,
                  left: `${((parseFloat(u.lng) - 67.00) / 0.15) * 100}%`,
                  top: `${((24.96 - parseFloat(u.lat)) / 0.16) * 100}%`,
                  border: selected?.id === u.id ? '2px solid #fff' : '2px solid transparent',
                  transform: 'translate(-50%, -50%)',
                  width: isMobile ? '24px' : '28px',
                  height: isMobile ? '24px' : '28px',
                }}
                onClick={() => setSelected(u)}
                title={u.name}
              >
                <span style={{ ...styles.mapDotIcon, fontSize: isMobile ? '12px' : '14px' }}>{typeIcon(u.type)}</span>
              </div>
            ))}

            <div style={styles.mapLabel}>
              <p style={{ ...styles.mapLabelText, fontSize: isMobile ? '12px' : '18px' }}>KARACHI CITY</p>
              <p style={styles.mapLabelSub}>Sindh, Pakistan</p>
            </div>
          </div>

          <div style={styles.legend}>
            {[
              { label: 'Responding', color: '#e94560' },
              { label: 'Patrolling', color: '#3498db' },
              { label: 'Available', color: '#2ecc71' },
            ].map((l, i) => (
              <div key={i} style={styles.legendItem}>
                <div style={{ ...styles.legendDot, backgroundColor: l.color, boxShadow: `0 0 6px ${l.color}` }} />
                <span style={styles.legendText}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Units List */}
        <div style={{ ...styles.unitsList, maxHeight: isMobile ? 'none' : '500px' }}>
          <p style={styles.unitsTitle}>ACTIVE UNITS</p>
          {units.map((u) => (
            <div
              key={u.id}
              style={{
                ...styles.unitCard,
                border: selected?.id === u.id ? `1px solid ${statusColor(u.status)}` : '1px solid rgba(255,255,255,0.06)',
                background: selected?.id === u.id ? `${statusColor(u.status)}11` : 'rgba(255,255,255,0.03)',
              }}
              onClick={() => setSelected(selected?.id === u.id ? null : u)}
            >
              <div style={styles.unitTop}>
                <span style={styles.unitIcon}>{typeIcon(u.type)}</span>
                <div style={styles.unitInfo}>
                  <p style={styles.unitName}>{u.name}</p>
                  <p style={styles.unitLocation}>📍 {u.location}</p>
                </div>
                <div style={{ ...styles.unitStatusDot, backgroundColor: statusColor(u.status), boxShadow: `0 0 8px ${statusColor(u.status)}` }} />
              </div>

              {selected?.id === u.id && (
                <div style={styles.unitDetails}>
                  <div style={styles.detailGrid}>
                    {[
                      { label: 'STATUS', value: u.status, color: statusColor(u.status) },
                      { label: 'SPEED', value: u.speed, color: '#fff' },
                      { label: 'ETA', value: u.eta, color: '#f39c12' },
                      { label: 'TYPE', value: u.type, color: '#8892a4' },
                    ].map((d, i) => (
                      <div key={i} style={styles.detailItem}>
                        <p style={styles.detailLabel}>{d.label}</p>
                        <p style={{ ...styles.detailValue, color: d.color }}>{d.value}</p>
                      </div>
                    ))}
                  </div>
                  <div style={styles.coordRow}>
                    <span style={styles.coordText}>🌐 {u.lat}°N, {u.lng}°E</span>
                    <button style={styles.trackBtn}>Track Unit</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: { overflowY: 'auto', minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0f 0%, #0d0d1a 100%)', position: 'relative' },
  bgCircle: { position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,152,219,0.05), transparent)', top: '-100px', right: '-100px', pointerEvents: 'none' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
  headerTag: { color: '#3498db', fontSize: '11px', letterSpacing: '4px', fontFamily: 'Orbitron, sans-serif', marginBottom: '8px' },
  headerTitle: { color: '#fff', fontFamily: 'Orbitron, sans-serif', fontWeight: '700', marginBottom: '8px' },
  headerSub: { color: '#8892a4', fontSize: '13px' },
  clockBox: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px 15px' },
  clockLabel: { color: '#8892a4', fontSize: '10px', letterSpacing: '3px', fontFamily: 'Orbitron, sans-serif', marginBottom: '5px' },
  clock: { color: '#3498db', fontFamily: 'Orbitron, sans-serif', fontWeight: '700', letterSpacing: '3px' },
  clockDate: { color: '#555', fontSize: '11px', marginTop: '4px' },
  statsRow: { display: 'grid', marginBottom: '15px' },
  statCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px 15px' },
  statValue: { fontWeight: '700', fontFamily: 'Orbitron, sans-serif', marginBottom: '4px' },
  statLabel: { color: '#8892a4', fontSize: '11px', letterSpacing: '1px' },
  mainGrid: { display: 'grid', gap: '15px' },
  mapBox: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '15px' },
  mapHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  mapTitle: { color: '#8892a4', fontSize: '11px', letterSpacing: '3px', fontFamily: 'Orbitron, sans-serif' },
  liveIndicator: { display: 'flex', alignItems: 'center', gap: '6px' },
  liveDot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2ecc71', boxShadow: '0 0 8px #2ecc71' },
  liveText: { color: '#2ecc71', fontSize: '11px', fontFamily: 'Orbitron, sans-serif', letterSpacing: '2px' },
  mapArea: { position: 'relative', background: 'rgba(0,0,0,0.4)', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '12px' },
  mapGrid: { position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gridTemplateRows: 'repeat(10, 1fr)', opacity: 0.15 },
  mapCell: { border: '0.5px solid rgba(52,152,219,0.3)' },
  mapDot: { position: 'absolute', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, transition: 'all 0.3s' },
  mapDotIcon: {},
  mapLabel: { position: 'absolute', bottom: '10px', left: '10px' },
  mapLabelText: { color: 'rgba(255,255,255,0.2)', fontFamily: 'Orbitron, sans-serif', fontWeight: '700', letterSpacing: '4px' },
  mapLabelSub: { color: 'rgba(255,255,255,0.1)', fontSize: '10px', letterSpacing: '3px' },
  legend: { display: 'flex', gap: '15px', flexWrap: 'wrap' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '6px' },
  legendDot: { width: '8px', height: '8px', borderRadius: '50%' },
  legendText: { color: '#8892a4', fontSize: '12px' },
  unitsList: { display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' },
  unitsTitle: { color: '#3498db', fontSize: '11px', letterSpacing: '3px', fontFamily: 'Orbitron, sans-serif', marginBottom: '5px' },
  unitCard: { borderRadius: '10px', padding: '12px', cursor: 'pointer', transition: 'all 0.2s' },
  unitTop: { display: 'flex', alignItems: 'center', gap: '10px' },
  unitIcon: { fontSize: '20px', flexShrink: 0 },
  unitInfo: { flex: 1 },
  unitName: { color: '#fff', fontSize: '13px', fontWeight: '700', marginBottom: '3px' },
  unitLocation: { color: '#8892a4', fontSize: '11px' },
  unitStatusDot: { width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0 },
  unitDetails: { marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' },
  detailGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '10px' },
  detailItem: {},
  detailLabel: { color: '#555', fontSize: '10px', letterSpacing: '1px', marginBottom: '3px' },
  detailValue: { fontSize: '13px', fontWeight: '700' },
  coordRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  coordText: { color: '#555', fontSize: '10px' },
  trackBtn: { padding: '5px 12px', background: 'rgba(52,152,219,0.15)', border: '1px solid rgba(52,152,219,0.3)', color: '#3498db', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontFamily: 'Rajdhani, sans-serif', fontWeight: '600' },
};

export default LiveTracking;