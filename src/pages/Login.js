import React, { useState } from 'react';
import { auth, db, googleProvider } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', result.user.uid), {
          name: '',
          email: result.user.email,
          role: 'citizen',
          createdAt: new Date().toISOString()
        });
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        name: user.displayName || '',
        email: user.email,
        role: 'citizen',
        createdAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };
  return (
    
    <div style={styles.container}>

      {/* Background Effects */}
      <div style={styles.bgCircle1} />
      <div style={styles.bgCircle2} />
      <div style={styles.bgCircle3} />

      {/* Left Side */}
      <div style={styles.leftPanel}>
        <div style={styles.logoArea}>
          <span style={styles.logoEmoji}>🚨</span>
          <h1 style={styles.logoTitle}>ERS</h1>
          <p style={styles.logoSub}>EMERGENCY RESPONSE SYSTEM</p>
        </div>
        <div style={styles.featureList}>
          {['Real-time Emergency Reporting', 'Live Location Tracking', 'Hospital & Ambulance Coordination', 'Police & Rescue Communication', 'Emergency Alert Broadcasting'].map((f, i) => (
            <div key={i} style={styles.featureItem}>
              <div style={styles.featureDot} />
              <p style={styles.featureText}>{f}</p>
            </div>
          ))}
        </div>
        <p style={styles.tagline}>Protecting Pakistan — One Response at a Time</p>
      </div>

      {/* Right Side - Form */}
      <div style={styles.rightPanel}>
        <div style={styles.formBox}>
          <div style={styles.formHeader}>
            <p style={styles.formTag}>SECURE ACCESS</p>
            <h2 style={styles.formTitle}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p style={styles.formSub}>{isLogin ? 'Sign in to your operator account' : 'Register as an operator'}</p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              ⚠️ {error.replace('Firebase: ', '').replace(/\(auth.*\)/, '')}
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>EMAIL ADDRESS</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>✉️</span>
              <input
                style={styles.input}
                type="email"
                placeholder="operator@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>PASSWORD</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>🔒</span>
              <input
                style={styles.input}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>
          </div>

          <button style={styles.btn} onClick={handleSubmit} disabled={loading}>
            {loading ? '⏳ Please wait...' : isLogin ? '🔐 Sign In' : '🚀 Create Account'}
          </button>

          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>OR</span>
            <div style={styles.dividerLine} />
          </div>

          <button style={styles.googleBtn} onClick={handleGoogleSignIn} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.85 2.09-1.81 2.73v2.27h2.92c1.71-1.57 2.69-3.88 2.69-6.64z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.92-2.27c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33C2.44 15.98 5.48 18 9 18z"/>
              <path fill="#FBBC05" d="M3.97 10.7c-.18-.54-.28-1.11-.28-1.7s.1-1.16.28-1.7V4.97H.96C.35 6.21 0 7.57 0 9s.35 2.79.96 4.03l3.01-2.33z"/>
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.97l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>

          <p style={styles.toggle} onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <span style={styles.toggleLink}>{isLogin ? 'Register here' : 'Sign in'}</span>
          </p>

          <p style={styles.footer}>🇵🇰 Pakistan Emergency Response System v1.0</p>
        </div>
      </div>

    </div>
  );
}

const styles = {
    container: { 
  display: 'flex', 
  flexDirection: window.innerWidth <= 768 ? 'column' : 'row',  // 👈 yeh change
  height: '100vh', 
  backgroundColor: '#0a0a0f', 
  position: 'relative', 
  overflow: 'auto'  // 👈 hidden ki jagah auto
  },
  bgCircle1: { position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(233,69,96,0.08), transparent)', top: '-100px', left: '-100px', pointerEvents: 'none' },
  bgCircle2: { position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,152,219,0.08), transparent)', bottom: '-100px', right: '30%', pointerEvents: 'none' },
  bgCircle3: { position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(46,204,113,0.06), transparent)', top: '40%', left: '30%', pointerEvents: 'none' },
  leftPanel: { 
  flex: 1, 
  display: window.innerWidth <= 768 ? 'none' : 'flex',  // 👈 mobile pe hide
  flexDirection: 'column', 
  justifyContent: 'center', 
  padding: '60px', 
  borderRight: '1px solid rgba(233,69,96,0.15)', 
  position: 'relative', 
  zIndex: 1 
  },
  logoArea: { marginBottom: '50px' },
  logoEmoji: { fontSize: '50px', display: 'block', marginBottom: '10px' },
  logoTitle: { fontFamily: 'Orbitron, sans-serif', fontSize: '52px', color: '#e94560', letterSpacing: '8px', lineHeight: 1, marginBottom: '8px' },
  logoSub: { color: '#8892a4', fontSize: '12px', letterSpacing: '4px', fontFamily: 'Orbitron, sans-serif' },
  featureList: { display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '50px' },
  featureItem: { display: 'flex', alignItems: 'center', gap: '12px' },
  featureDot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#e94560', boxShadow: '0 0 8px #e94560', flexShrink: 0 },
  featureText: { color: '#8892a4', fontSize: '15px', letterSpacing: '0.5px' },
  tagline: { color: '#333', fontSize: '13px', letterSpacing: '2px', fontStyle: 'italic' },
  rightPanel: { 
  width: window.innerWidth <= 768 ? '100%' : '480px',  // 👈 mobile pe full width
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  padding: '40px 20px',  // 👈 side padding kam
  position: 'relative', 
  zIndex: 1 
  },
  formBox: { width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(233,69,96,0.2)', borderRadius: '16px', padding: '40px', backdropFilter: 'blur(20px)' },
  formHeader: { marginBottom: '30px' },
  formTag: { color: '#e94560', fontSize: '11px', letterSpacing: '4px', fontFamily: 'Orbitron, sans-serif', marginBottom: '10px' },
  formTitle: { color: '#fff', fontSize: '28px', fontFamily: 'Orbitron, sans-serif', fontWeight: '700', marginBottom: '8px' },
  formSub: { color: '#8892a4', fontSize: '14px' },
  errorBox: { backgroundColor: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.3)', color: '#e94560', padding: '12px 15px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px' },
  inputGroup: { marginBottom: '20px' },
  label: { color: '#8892a4', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '8px', fontFamily: 'Orbitron, sans-serif' },
  inputWrapper: { display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 15px', gap: '10px', transition: 'border 0.2s' },
  inputIcon: { fontSize: '16px', flexShrink: 0 },
  input: { flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '15px', fontFamily: 'Rajdhani, sans-serif' },
  btn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #e94560, #c0392b)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '700', letterSpacing: '1px', fontFamily: 'Rajdhani, sans-serif', marginBottom: '20px', boxShadow: '0 4px 20px rgba(233,69,96,0.4)' },
  divider: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' },
  googleBtn: { width: '100%', padding: '12px', background: '#fff', color: '#1a1a2e', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '700', fontFamily: 'Rajdhani, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' },
  dividerLine: { flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' },
  dividerText: { color: '#555', fontSize: '12px' },
  toggle: { textAlign: 'center', color: '#8892a4', fontSize: '14px', cursor: 'pointer' },
  toggleLink: { color: '#e94560', fontWeight: '700' },
  footer: { textAlign: 'center', color: '#333', fontSize: '11px', marginTop: '25px', letterSpacing: '1px' },
};

export default Login;