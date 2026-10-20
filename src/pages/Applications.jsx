import { ArrowUpRight, BriefcaseBusiness } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api, isDemoMode, getErrorMessage } from '../services/api.js';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  async function load() {
    setLoading(true); setError('');
    try {
      const data = isDemoMode ? JSON.parse(localStorage.getItem('launchpad_applications') || '[]') : (await api.get('/api/applications/my')).data;
      setApplications(Array.isArray(data) ? data : data.applications || data.data || []);
    } catch (requestError) { setError(getErrorMessage(requestError, 'Unable to load your applications.')); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  return <section className="page-section applications-page"><div className="container"><span className="eyebrow"><span className="eyebrow-line" />Keep an eye on your next steps</span><h1>Your applications.</h1><p className="profile-intro">Every opportunity you’ve put yourself forward for, all in one place.</p>
    {loading ? <Loader label="Loading your applications..." /> : error ? <ErrorMessage onRetry={load}>{error}</ErrorMessage> : applications.length ? <div className="applications-list">{applications.map((item, index) => { const job = item.job || item.jobId || {}; return <article className="application-row" key={item._id || `${job.title}-${index}`}><span className="company-mark lavender">{(job.company || 'J')[0]}</span><div className="application-role"><strong>{job.title || item.jobTitle || 'Opportunity'}</strong><span>{job.company || item.company || 'Company'} · {job.location || 'Location not listed'}</span></div><span className={`status-pill status-${(item.status || 'Applied').toLowerCase()}`}>{item.status || 'Applied'}</span><span className="application-date">{item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recently'}</span>{job._id && <Link className="icon-button" to={`/jobs/${job._id}`} aria-label="View opportunity"><ArrowUpRight size={17} /></Link>}</article>; })}</div> : <div className="empty-state applications-empty"><span className="empty-mark"><BriefcaseBusiness size={25} /></span><h3>Your next step is out there.</h3><p>You haven’t applied to anything yet. Find an opportunity that feels right.</p><Link to="/jobs" className="button button-primary">Explore opportunities <ArrowUpRight size={15} /></Link></div>}
  </div></section>;
}
