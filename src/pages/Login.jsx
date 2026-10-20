import { ArrowLeft, ArrowUpRight, BriefcaseBusiness } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import InputField from '../components/InputField.jsx';
import Button from '../components/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage, isDemoMode } from '../services/api.js';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); setError(''); setBusy(true);
    try { await login(form.email, form.password); navigate(location.state?.from?.pathname || location.state?.from || '/dashboard', { replace: true }); }
    catch (requestError) { setError(getErrorMessage(requestError, 'Unable to sign in. Please try again.')); }
    finally { setBusy(false); }
  }
  return <section className="auth-page"><div className="auth-card">
    <Link to="/" className="auth-back"><ArrowLeft size={15} /> Back home</Link>
    <div className="auth-icon"><BriefcaseBusiness size={20} /></div><span className="eyebrow"><span className="eyebrow-line" />Welcome back</span>
    <h1>Good to see<br />you again.</h1><p className="auth-intro">Sign in to pick up where your next chapter begins.</p>
    <form className="auth-form" onSubmit={submit}><InputField id="login-email" label="Email address" type="email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><InputField id="login-password" label="Password" type="password" required autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      {error && <div className="field-error form-error" role="alert">{error}</div>}
      <Button type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'} <ArrowUpRight size={16} /></Button>
    </form>
    {isDemoMode && <div className="demo-callout">Demo mode is on. Enter any email and password to explore the candidate dashboard.</div>}
    <p className="auth-switch">New to Launchpad? <Link to="/register">Create an account</Link></p>
  </div><div className="auth-aside"><div className="auth-aside-mark">“</div><blockquote>Your path doesn’t need to look like anyone else’s. It just needs to feel like yours.</blockquote><span>— A little Launchpad wisdom</span><div className="aside-orbit orbit-one" /><div className="aside-orbit orbit-two" /></div></section>;
}
