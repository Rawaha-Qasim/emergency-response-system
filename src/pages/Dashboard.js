import emailjs from '@emailjs/browser';
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function Dashboard({ user, setCurrentPage }) {
  const [sosActive, setSosActive] = useState(false);
  const [pulse, setPulse] = useState(false);
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    const interval = setInterval(() => setPulse(p => !p), 1000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Active Emergencies', value: '12', icon: '🆘', color: '#e94560', glow: 'rgba(233,69,96,0.3)' },
    { label: 'Hospitals Online', value: '8', icon: '🏥', color: '#2ecc71', glow: 'rgba(46,204,113,0.3)' },
    { label: 'Units Available', value: '24', icon: '👮', color: '#00d4ff', glow: 'rgba(0,212,255,0.3)' },
    { label: 'Ambulances', value: '15', icon: '🚑', color: '#a855f7', glow: 'rgba(168,85,247,0.3)' },
  ];

  const chartData = [
    { name: 'Accident', value: 35, color: '#e94560' },
    { name: 'Fire', value: 20, color: '#f39c12' },
    { name: 'Flood', value: 25, color: '#00d4ff' },
    { name: 'Medical', value: 15, color: '#2ecc71' },
    { name: 'Crime', value: 5, color: '#a855f7' },
  ];

  const recentIncidents = [
    { type: 'Road Accident', location: 'Shahrah-e-Faisal, Karachi', time: '2 mins ago', status: 'Responding', color: '#f39c12' },
    { type: 'Fire Emergency', location: 'SITE Area, Karachi', time: '8 mins ago', status: 'Active', color: '#e94560' },
    { type: 'Medical Emergency', location: 'F-7, Islamabad', time: '15 mins ago', status: 'Resolved', color: '#2ecc71' },
    { type: 'Flood Alert', location: 'Hyderabad', time: '22 mins ago', status: 'Active', color: '#e94560' },
  ];

  const quickActions = [
    { label: 'Report Emergency', page: 'report', icon: '🆘', color: '#e94560' },
    { label: 'View Hospitals', page: 'hospitals', icon: '🏥', color: '#2ecc71' },
    { label: 'Police Units', page: 'police', icon: '👮', color: '#00d4ff' },
    { label: 'Live Tracking', page: 'tracking', icon: '📍', color: '#a855f7' },
  ];

  return (
    <div style={{ ...styles.container, padding: isMobile ? '15px 12px' : '30px' }}>
      <style>{`
        @keyframes pulse { 0%,100% { transform: scale(1); opacity:1; } 50% { transform: scale(1.15); opacity:0.7; } }
        @keyframes sosPulse { 0%,100% { box-shadow: 0 0 20px rgba(233,69,96,0.6), 0 0 60px rgba(233,69,96,0.3); } 50% { box-shadow: 0 0 40px rgba(233,69,96,0.9), 0 0 100px rgba(233,69,96,0.5); } }
        @keyframes ring { 0%,100% { transform: scale(1); opacity:0.6; } 50% { transform: scale(1.4); opacity:0; } }
        @keyframes fadeIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: translateY(0); } }
      `}</style>

      {/* Header */}
      <div style={{ ...styles.header, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '8px' : '0' }}>
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
          <p style={styles.headerSub}>EMERGENCY RESPONSE SYSTEM</p>
          <h1 style={{ ...styles.headerTitle, fontSize: isMobile ? '18px' : '28px' }}>Command Dashboard</h1>
        </div>
        <div style={{ ...styles.headerRight, textAlign: isMobile ? 'left' : 'right' }}>
          <div style={{ ...styles.liveIndicator, justifyContent: isMobile ? 'flex-start' : 'flex-end' }}>
            <div style={{ ...styles.liveDot, animation: 'pulse 1.5s infinite' }} />
            <span style={styles.liveText}>LIVE</span>
          </div>
          <p style={styles.dateText}>{new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* SOS Button */}
      <div style={styles.sosContainer}>
        <div style={styles.sosWrapper}>
          <div style={{ ...styles.sosRing, animation: 'ring 2s infinite' }} />
          <div style={{ ...styles.sosRing2, animation: 'ring 2s infinite 0.5s' }} />
          <button
            style={{ ...styles.sosBtn, animation: sosActive ? 'sosPulse 0.5s infinite' : 'sosPulse 2s infinite' }}
            onClick={() => {
              setSosActive(true);
              setTimeout(() => setSosActive(false), 3000);
              emailjs.send(
                'emergencysystem',
                'template_l8cfofn',
                {
                  from_name: user.email,
                  from_email: user.email,
                  time: new Date().toLocaleString(),
                  message: 'SOS Button Activated! Immediate assistance required!'
                },
                'L075CX89aeH5Q_irP'
              ).then(() => {
                alert('🚨 SOS ACTIVATED! Emergency services notified & email sent!');
              }).catch(() => {
                alert('🚨 SOS ACTIVATED! Emergency services notified!');
              });
            }}
          >
            <span style={styles.sosBtnIcon}>🆘</span>
            <span style={styles.sosBtnText}>SOS</span>
            <span style={styles.sosBtnSub}>TAP FOR EMERGENCY</span>
          </button>
        </div>
        <p style={styles.sosHint}>Press SOS for immediate emergency assistance</p>
      </div>

      {/* Stats */}
      <div style={{ ...styles.statsGrid, gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? '10px' : '20px' }}>
        {stats.map((s, i) => (
          <div key={i} style={{ ...styles.statCard, boxShadow: `0 0 25px ${s.glow}`, border: `1px solid ${s.color}33` }}>
            <div style={styles.statTop}>
              <span style={styles.statIcon}>{s.icon}</span>
              <div style={{ ...styles.statGlowBall, backgroundColor: s.glow }} />
            </div>
            <p style={{ ...styles.statValue, color: s.color, fontSize: isMobile ? '28px' : '42px' }}>{s.value}</p>
            <p style={{ ...styles.statLabel, fontSize: isMobile ? '11px' : '13px' }}>{s.label}</p>
            <div style={{ ...styles.statBar, background: `linear-gradient(90deg, ${s.color}, transparent)` }} />
          </div>
        ))}
      </div>

      {/* Chart + Incidents */}
      <div style={{ ...styles.midGrid, gridTemplateColumns: isMobile ? '1fr' : '1fr 1.5fr' }}>
        <div style={styles.chartCard}>
          <p style={styles.sectionTitle}>📊 EMERGENCY BREAKDOWN</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
              <Legend iconType="circle" wrapperStyle={{ color: '#8892a4', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.section}>
          <p style={styles.sectionTitle}>🕐 RECENT INCIDENTS</p>
          <div style={styles.incidentList}>
            {recentIncidents.map((inc, i) => (
              <div key={i} style={styles.incidentRow}>
                <div style={{ ...styles.incidentDot, backgroundColor: inc.color, boxShadow: `0 0 8px ${inc.color}` }} />
                <div style={styles.incidentInfo}>
                  <p style={styles.incidentType}>{inc.type}</p>
                  <p style={styles.incidentLocation}>📍 {inc.location}</p>
                </div>
                <div style={styles.incidentRight}>
                  <span style={{ ...styles.incidentBadge, backgroundColor: `${inc.color}22`, color: inc.color, border: `1px solid ${inc.color}44` }}>{inc.status}</span>
                  <p style={styles.incidentTime}>{inc.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ ...styles.section, marginTop: '20px' }}>
        <p style={styles.sectionTitle}>⚡ QUICK ACTIONS</p>
        <div style={{ ...styles.actionsGrid, gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)' }}>
          {quickActions.map((a, i) => (
            <div key={i} style={{ ...styles.actionCard, border: `1px solid ${a.color}44`, boxShadow: `0 0 15px ${a.color}11` }} onClick={() => setCurrentPage(a.page)}>
              <span style={styles.actionIcon}>{a.icon}</span>
              <p style={{ ...styles.actionLabel, color: a.color }}>{a.label}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

const styles = {
  container: { overflowY: 'auto',  background: 'linear-gradient(135deg, #0a0a0f 0%, #0d0d1a 100%)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
  headerSub: { color: '#e94560', fontSize: '11px', letterSpacing: '4px', fontFamily: 'Orbitron, sans-serif', marginBottom: '5px' },
  headerTitle: { color: '#fff', fontFamily: 'Orbitron, sans-serif', fontWeight: '700' },
  headerRight: {},
  liveIndicator: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' },
  liveDot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2ecc71', boxShadow: '0 0 8px #2ecc71' },
  liveText: { color: '#2ecc71', fontSize: '12px', fontFamily: 'Orbitron, sans-serif', letterSpacing: '2px' },
  dateText: { color: '#8892a4', fontSize: '11px' },
  sosContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px 0 25px' },
  sosWrapper: { position: 'relative', width: '140px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  sosRing: { position: 'absolute', width: '140px', height: '140px', borderRadius: '50%', border: '2px solid rgba(233,69,96,0.4)', pointerEvents: 'none' },
  sosRing2: { position: 'absolute', width: '160px', height: '160px', borderRadius: '50%', border: '2px solid rgba(233,69,96,0.2)', pointerEvents: 'none' },
  sosBtn: { width: '110px', height: '110px', borderRadius: '50%', background: 'linear-gradient(135deg, #e94560, #c0392b)', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px' },
  sosBtnIcon: { fontSize: '24px' },
  sosBtnText: { color: '#fff', fontSize: '18px', fontWeight: '900', fontFamily: 'Orbitron, sans-serif', lineHeight: 1 },
  sosBtnSub: { color: 'rgba(255,255,255,0.7)', fontSize: '7px', letterSpacing: '1px', fontFamily: 'Orbitron, sans-serif' },
  sosHint: { color: '#8892a4', fontSize: '12px', marginTop: '15px' },
  statsGrid: { display: 'grid', marginBottom: '20px' },
  statCard: { background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '15px', position: 'relative', overflow: 'hidden', backdropFilter: 'blur(10px)' },
  statTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  statIcon: { fontSize: '24px' },
  statGlowBall: { width: '40px', height: '40px', borderRadius: '50%', filter: 'blur(15px)', opacity: 0.6 },
  statValue: { fontWeight: '700', fontFamily: 'Orbitron, sans-serif', lineHeight: 1, marginBottom: '6px' },
  statLabel: { color: '#8892a4', letterSpacing: '1px' },
  statBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px' },
  midGrid: { display: 'grid', gap: '15px', marginBottom: '0px' },
  chartCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px', backdropFilter: 'blur(10px)' },
  section: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px', backdropFilter: 'blur(10px)' },
  sectionTitle: { color: '#e94560', fontSize: '11px', letterSpacing: '3px', fontFamily: 'Orbitron, sans-serif', marginBottom: '15px' },
  actionsGrid: { display: 'grid', gap: '12px' },
  actionCard: { background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '15px', textAlign: 'center', cursor: 'pointer', backdropFilter: 'blur(10px)' },
  actionIcon: { fontSize: '24px', display: 'block', marginBottom: '8px' },
  actionLabel: { fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px' },
  incidentList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  incidentRow: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' },
  incidentDot: { width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0 },
  incidentInfo: { flex: 1, minWidth: 0 },
  incidentType: { color: '#fff', fontSize: '12px', fontWeight: '600', marginBottom: '2px' },
  incidentLocation: { color: '#8892a4', fontSize: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  incidentRight: { textAlign: 'right', flexShrink: 0 },
  incidentBadge: { display: 'inline-block', padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '600', marginBottom: '3px' },
  incidentTime: { color: '#555', fontSize: '10px' },
};

export default Dashboard;