import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function ReportEmergency() {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const isMobile = window.innerWidth <= 768;

  const emergencyTypes = [
    { value: 'Accident', label: '🚗 Road Accident' },
    { value: 'Fire', label: '🔥 Fire' },
    { value: 'Flood', label: '🌊 Flood' },
    { value: 'Earthquake', label: '🌍 Earthquake' },
    { value: 'Medical', label: '🏥 Medical Emergency' },
    { value: 'Crime', label: '👮 Crime' },
    { value: 'Other', label: '❓ Other' },
  ];

  const handleSubmit = async () => {
    if (!type || !description || !location) {
      alert('Please fill all fields!');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'emergencies'), {
        type, description, location,
        status: 'pending',
        reportedBy: auth.currentUser.email,
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
    } catch (err) {
      alert('Error: ' + err.message);
    }
    setLoading(false);
  };

  if (submitted) return (
    <div style={styles.successContainer}>
      <div style={{ ...styles.successBox, padding: isMobile ? '30px 20px' : '50px', margin: isMobile ? '20px' : '0' }}>
        <div style={styles.successIcon}>✅</div>
        <h2 style={{ ...styles.successTitle, fontSize: isMobile ? '18px' : '24px' }}>Emergency Reported!</h2>
        <p style={styles.successMsg}>Your emergency has been reported. Help is on the way. Stay calm and stay safe.</p>
        <button style={styles.btn} onClick={() => { setSubmitted(false); setType(''); setDescription(''); setLocation(''); }}>
          Report Another Emergency
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ ...styles.container, padding: isMobile ? '15px 12px' : '30px' }}>
      <div style={styles.bgCircle} />

      <div style={styles.header}>
        <p style={styles.headerTag}>EMERGENCY REPORTING</p>
        <h2 style={{ ...styles.headerTitle, fontSize: isMobile ? '20px' : '28px' }}>Report an Emergency</h2>
        <p style={styles.headerSub}>Fill in the details below. Help will be dispatched immediately.</p>
      </div>

      <div style={{ ...styles.formGrid, gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr' }}>

        {/* Form */}
        <div style={styles.formBox}>
          <p style={styles.sectionLabel}>SELECT EMERGENCY TYPE</p>
          <div style={{ ...styles.typeGrid, gridTemplateColumns: isMobile ? 'repeat(4, 1fr)' : 'repeat(4, 1fr)' }}>
            {emergencyTypes.map((t) => (
              <div
                key={t.value}
                style={{
                  ...styles.typeCard,
                  border: type === t.value ? '1px solid #e94560' : '1px solid rgba(255,255,255,0.08)',
                  background: type === t.value ? 'rgba(233,69,96,0.15)' : 'rgba(255,255,255,0.03)',
                }}
                onClick={() => setType(t.value)}
              >
                <span style={styles.typeIcon}>{t.label.split(' ')[0]}</span>
                <p style={{ ...styles.typeLabel, color: type === t.value ? '#e94560' : '#8892a4' }}>
                  {t.label.split(' ').slice(1).join(' ')}
                </p>
              </div>
            ))}
          </div>

          <p style={styles.sectionLabel}>YOUR LOCATION</p>
          <div style={styles.inputWrapper}>
            <span>📍</span>
            <input
              style={styles.input}
              type="text"
              placeholder="Enter your exact location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <p style={styles.sectionLabel}>DESCRIPTION</p>
          <textarea
            style={styles.textarea}
            placeholder="Describe the emergency in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button style={styles.btn} onClick={handleSubmit} disabled={loading}>
            {loading ? '⏳ Submitting...' : '🚨 Report Emergency Now'}
          </button>
        </div>

        {/* Info Panel */}
        <div style={styles.infoPanel}>
          <div style={styles.infoCard}>
            <p style={styles.infoTitle}>⚡ Emergency Hotlines</p>
            {[
              { label: 'Rescue 1122', number: '1122', color: '#e94560' },
              { label: 'Police', number: '15', color: '#3498db' },
              { label: 'Edhi Foundation', number: '115', color: '#2ecc71' },
              { label: 'Fire Brigade', number: '16', color: '#f39c12' },
              { label: 'Ambulance', number: '1122', color: '#9b59b6' },
            ].map((h, i) => (
              <div key={i} style={styles.hotlineRow}>
                <span style={styles.hotlineLabel}>{h.label}</span>
                <span style={{ ...styles.hotlineNumber, color: h.color }}>{h.number}</span>
              </div>
            ))}
          </div>

          <div style={styles.infoCard}>
            <p style={styles.infoTitle}>📋 What Happens Next?</p>
            {[
              'Your report is received instantly',
              'Nearest unit is dispatched',
              'You receive status updates',
              'Help arrives at your location',
            ].map((step, i) => (
              <div key={i} style={styles.stepRow}>
                <div style={styles.stepNum}>{i + 1}</div>
                <p style={styles.stepText}>{step}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: { overflowY: 'auto', background: 'linear-gradient(135deg, #0a0a0f 0%, #0d0d1a 100%)', position: 'relative' },
  bgCircle: { position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(233,69,96,0.06), transparent)', top: '-100px', right: '-100px', pointerEvents: 'none' },
  header: { marginBottom: '20px' },
  headerTag: { color: '#e94560', fontSize: '11px', letterSpacing: '4px', fontFamily: 'Orbitron, sans-serif', marginBottom: '8px' },
  headerTitle: { color: '#fff', fontFamily: 'Orbitron, sans-serif', fontWeight: '700', marginBottom: '8px' },
  headerSub: { color: '#8892a4', fontSize: '13px' },
  formGrid: { display: 'grid', gap: '15px' },
  formBox: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px' },
  sectionLabel: { color: '#8892a4', fontSize: '11px', letterSpacing: '3px', fontFamily: 'Orbitron, sans-serif', marginBottom: '12px', marginTop: '20px' },
  typeGrid: { display: 'grid', gap: '8px', marginBottom: '10px' },
  typeCard: { borderRadius: '10px', padding: '10px 6px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' },
  typeIcon: { fontSize: '20px', display: 'block', marginBottom: '4px' },
  typeLabel: { fontSize: '10px', fontWeight: '600', letterSpacing: '0.5px' },
  inputWrapper: { display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 15px', marginBottom: '5px' },
  input: { flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '14px', fontFamily: 'Rajdhani, sans-serif' },
  textarea: { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 15px', color: '#fff', fontSize: '14px', fontFamily: 'Rajdhani, sans-serif', height: '100px', resize: 'none', outline: 'none', boxSizing: 'border-box', marginBottom: '5px' },
  btn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #e94560, #c0392b)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '700', letterSpacing: '1px', fontFamily: 'Rajdhani, sans-serif', marginTop: '15px', boxShadow: '0 4px 20px rgba(233,69,96,0.4)' },
  infoPanel: { display: 'flex', flexDirection: 'column', gap: '15px' },
  infoCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px' },
  infoTitle: { color: '#e94560', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', marginBottom: '15px' },
  hotlineRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  hotlineLabel: { color: '#8892a4', fontSize: '13px' },
  hotlineNumber: { fontSize: '18px', fontWeight: '700', fontFamily: 'Orbitron, sans-serif' },
  stepRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' },
  stepNum: { width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(233,69,96,0.2)', border: '1px solid #e94560', color: '#e94560', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', flexShrink: 0 },
  stepText: { color: '#8892a4', fontSize: '13px' },
  successContainer: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0f, #0d0d1a)' },
  successBox: { textAlign: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(46,204,113,0.3)', borderRadius: '16px', maxWidth: '400px', width: '100%' },
  successIcon: { fontSize: '60px', marginBottom: '20px' },
  successTitle: { color: '#2ecc71', fontFamily: 'Orbitron, sans-serif', marginBottom: '15px' },
  successMsg: { color: '#8892a4', fontSize: '14px', lineHeight: 1.6, marginBottom: '25px' },
};

export default ReportEmergency;