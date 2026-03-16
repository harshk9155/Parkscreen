import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../Services/api';
import styles from './AuthPage.module.css';

export default function RegisterPage() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) { setError('Please fill all fields.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    setError('');
    try {
      await registerUser(email, password);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.leftBg} />
        <div className={styles.rings}>
          {[1,2,3,4,5].map((i) => <div key={i} className={styles.ring} />)}
        </div>
        <div className={styles.leftLogo}>ParkScreen</div>
        <div className={styles.leftContent}>
          <div className={styles.badge}>
            <div className={styles.badgeDot} />
            Start your health journey
          </div>
          <h2 className={styles.leftHeading}>
            Monitor your<br /><em>neurological</em><br />health over time
          </h2>
          <p className={styles.leftDesc}>
            Track your typing patterns across multiple sessions
            and see your trend over time. Early screening matters.
          </p>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.formWrap}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <span>Park<span style={{ color: 'var(--teal)' }}>Screen</span></span>
          </div>

          <h1 className={styles.title}>Create account</h1>
          <p className={styles.subtitle}>Begin your neurological health monitoring</p>

          {error && <div className={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className={styles.group}>
              <label className={styles.label}>Full name</label>
              <input type="text" className={styles.input}
                placeholder="John Doe"
                value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className={styles.group}>
              <label className={styles.label}>Email address</label>
              <input type="email" className={styles.input}
                placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className={styles.group}>
              <label className={styles.label}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd ? 'text' : 'password'}
                  className={styles.input}
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: '44px' }}
                />
                <button type="button" className={styles.eyeBtn}
                  onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? 'Creating account...' : 'Create My Account'}
            </button>
          </form>

          <p className={styles.switchText}>
            Already have an account?{' '}
            <Link to="/login" className={styles.switchLink}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}