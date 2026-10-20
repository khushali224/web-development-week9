import { ArrowLeft, ArrowUpRight, BriefcaseBusiness } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import InputField from '../components/InputField.jsx';
import Button from '../components/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage, isDemoMode } from '../services/api.js';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState('');
  async function submit(event) {
    event.preventDefault(); setError(''); setSuccess('');
    if (form.password.length < 8) return setError('Choose a password with at least 8 characters.');
    setBusy(true);
    try {
      const user = await register(form);
      if (user) navigate('/dashboard', { replace: true });
      else setSuccess('Account created. Please sign in to continue.');
    } catch (requestError) { setError(getErrorMessage(requestError, 'Unable to create your account. Please try again.')); }
    finally { setBusy(false); }
  }
  return <section className="auth-page"><div className="auth-card">
    <Link to="/" className="auth-back"><ArrowLeft size={15} /> Back home</Link>
    <div className="auth-icon"><BriefcaseBusiness size={20} /></div><span className="eyebrow"><span className="eyebrow-line" />A good place to begin</span>
    <h1>Make space<br />for what’s next.</h1><p className="auth-intro">Create your account and start finding work that feels like you.</p>
    <form className="auth-form" onSubmit={submit}><InputField id="register-name" label="Full name" required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><InputField id="register-email" label="Email address" type="email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><InputField id="register-password" label="Password" type="password" minLength={8} required autoComplete="new-password" hint="At least 8 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      {error && <div className="field-error form-error" role="alert">{error}</div>}{success && <div className="success-box">{success}</div>}
      <Button type="submit" disabled={busy}>{busy ? 'Creating account…' : 'Create account'} <ArrowUpRight size={16} /></Button>
    </form>
    {isDemoMode && <div className="demo-callout">Demo mode is on. Your sample account stays in this browser.</div>}
    <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
  </div><div className="auth-aside register-aside"><div className="auth-aside-mark">✳</div><blockquote>Good things grow when you give yourself the room to try.</blockquote><span>— A little Launchpad wisdom</span><div className="aside-orbit orbit-one" /><div className="aside-orbit orbit-two" /></div></section>;
}
