import { ArrowUpRight, Check } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import InputField from '../components/InputField.jsx';
import Button from '../components/Button.jsx';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', headline: user?.headline || '', location: user?.location || '' });
  const [saved, setSaved] = useState(false);
  function save(event) {
    event.preventDefault();
    const updated = { ...user, ...form };
    updateUser(updated);
    setSaved(true);
  }
  return <section className="page-section profile-page"><div className="container profile-container">
    <span className="eyebrow"><span className="eyebrow-line" />Make it yours</span><h1>A profile that feels like you.</h1><p className="profile-intro">A little about you helps the right opportunities find their way here.</p>
    <form className="profile-card" onSubmit={save}><div className="profile-avatar">{(form.name || 'Y')[0].toUpperCase()}</div><div className="profile-fields"><InputField id="profile-name" label="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><InputField id="profile-email" label="Email address" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><InputField id="profile-headline" label="A short headline" placeholder="e.g. Curious frontend developer" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} /><InputField id="profile-location" label="Location" placeholder="City or remote" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
      {saved && <div className="success-box"><Check size={16} />Your profile has been updated.</div>}<Button type="submit">Save changes <ArrowUpRight size={15} /></Button></div></form>
  </div></section>;
}
