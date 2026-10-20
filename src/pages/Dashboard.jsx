import { ArrowRight, ArrowUpRight, BriefcaseBusiness, CheckCircle2, Clock3, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api, isDemoMode, getErrorMessage } from '../services/api.js';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  async function load() {
    setLoading(true); setError('');
    try {
      const data = isDemoMode ? JSON.parse(localStorage.getItem('launchpad_applications') || '[]') : (await api.get('/api/applications/my')).data;
      const list = Array.isArray(data) ? data : data.applications || data.data || [];
      setApplications(list);
    } catch (requestError) { setError(getErrorMessage(requestError, 'Unable to load your applications.')); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  const count = (status) => applications.filter((item) => (item.status || 'Applied').toLowerCase() === status.toLowerCase()).length;
  const stats = [
    { label: 'Applications sent', value: applications.length, icon: <BriefcaseBusiness size={17} />, style: 'stat-peach' },
    { label: 'In review', value: count('Pending') + count('Applied'), icon: <Clock3 size={17} />, style: 'stat-lavender' },
    { label: 'Shortlisted', value: count('Shortlisted'), icon: <Sparkles size={17} />, style: 'stat-mint' },
    { label: 'Offers', value: count('Selected'), icon: <CheckCircle2 size={17} />, style: 'stat-blue' },
  ];
  return <section className="page-section dashboard-page"><div className="container">
    <div className="dashboard-welcome"><div><span className="eyebrow"><span className="eyebrow-line" />Your Launchpad</span><h1>Good morning, {user?.name?.split(' ')[0] || 'there'}<span className="welcome-spark">✳</span></h1><p>Your next step is closer than it feels.</p></div><Link to="/jobs" className="button button-primary">Find opportunities <ArrowUpRight size={16} /></Link></div>
    <div className="stats-grid">{stats.map((stat) => <article className={`stat-card ${stat.style}`} key={stat.label}><div className="stat-icon">{stat.icon}</div><strong>{stat.value}</strong><span>{stat.label}</span></article>)}</div>
    <div className="dashboard-content"><section className="dashboard-table-wrap"><div className="dashboard-section-head"><div><span className="eyebrow"><span className="eyebrow-line" />Your progress</span><h2>Recent applications</h2></div><Link to="/applications" className="underlined-link">View all <ArrowRight size={15} /></Link></div>
      {loading ? <Loader label="Loading your applications..." /> : error ? <ErrorMessage onRetry={load}>{error}</ErrorMessage> : applications.length ? <div className="table-scroll"><table><thead><tr><th>Opportunity</th><th>Company</th><th>Applied</th><th>Status</th></tr></thead><tbody>{applications.slice(0, 5).map((item, index) => { const job = item.job || item.jobId || {}; return <tr key={item._id || `${job.title}-${index}`}><td><strong>{job.title || item.jobTitle || 'Opportunity'}</strong><small>{job.location || 'Location not listed'}</small></td><td>{job.company || item.company || '—'}</td><td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : 'Recently'}</td><td><span className={`status-pill status-${(item.status || 'Applied').toLowerCase()}`}>{item.status || 'Applied'}</span></td></tr>; })}</tbody></table></div> : <div className="dashboard-empty"><span className="empty-mark">✳</span><h3>Your story starts with one application.</h3><p>Find an opportunity that feels right and take the first step.</p><Link to="/jobs" className="text-button">Explore opportunities <ArrowRight size={14} /></Link></div>}
    </section><aside className="dashboard-tip"><span className="eyebrow"><span className="eyebrow-line" />A gentle reminder</span><div className="tip-spark">✳</div><h3>You don’t have to have it all figured out.</h3><p>Every application is a chance to learn more about what you want. Keep showing up for the possibilities.</p><Link to="/profile">Make your profile yours <ArrowUpRight size={15} /></Link></aside></div>
  </div></section>;
}
