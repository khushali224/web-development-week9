import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUpRight, BriefcaseBusiness, CalendarDays, Check, MapPin } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, demoJobs, isDemoMode, getErrorMessage } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Modal from '../components/Modal.jsx';
import InputField from '../components/InputField.jsx';
import Button from '../components/Button.jsx';

export default function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '', resume: null, coverLetter: '' });
  const [formError, setFormError] = useState('');

  async function loadJob() {
    setLoading(true); setError('');
    try {
      const response = isDemoMode ? null : (await api.get(`/api/jobs/${id}`)).data;
      const found = isDemoMode ? demoJobs.find((item) => item._id === id) : response.job || response.data || response;
      if (!found) throw new Error('This opportunity could not be found.');
      setJob(found);
    } catch (requestError) { setError(getErrorMessage(requestError, 'Unable to load this job. Please try again.')); }
    finally { setLoading(false); }
  }
  useEffect(() => { loadJob(); }, [id]);

  async function submitApplication(event) {
    event.preventDefault(); setFormError(''); setMessage('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setFormError('Enter a valid email address.');
    if (!/^\+?[\d\s()-]{7,20}$/.test(form.phone)) return setFormError('Enter a valid phone number.');
    if (!form.resume || !form.resume.name.toLowerCase().endsWith('.pdf') || (form.resume.type && form.resume.type !== 'application/pdf')) return setFormError('Please upload a PDF resume.');
    if (form.coverLetter.trim().length < 20) return setFormError('Your cover letter must be at least 20 characters.');
    setSubmitting(true);
    try {
      const application = { jobId: id, name: form.name, email: form.email, phone: form.phone, resume: form.resume.name, coverLetter: form.coverLetter };
      if (isDemoMode) {
        const existing = JSON.parse(localStorage.getItem('launchpad_applications') || '[]');
        if (existing.some((item) => (item.jobId?._id || item.jobId) === id)) throw new Error('You have already applied to this opportunity.');
        localStorage.setItem('launchpad_applications', JSON.stringify([{ ...application, job, status: 'Applied', createdAt: new Date().toISOString() }, ...existing]));
      } else {
        const payload = new FormData();
        Object.entries(application).forEach(([key, value]) => payload.append(key, value));
        payload.set('resume', form.resume);
        await api.post('/api/applications', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setMessage('Your application has been submitted. Good luck!');
      setOpen(false);
    } catch (requestError) { setFormError(getErrorMessage(requestError, 'Unable to submit your application. Please try again.')); }
    finally { setSubmitting(false); }
  }

  if (loading) return <section className="page-section"><div className="container"><Loader label="Loading opportunity..." /></div></section>;
  if (error) return <section className="page-section"><div className="container"><ErrorMessage onRetry={loadJob}>{error}</ErrorMessage></div></section>;
  if (!job) return null;
  return (
    <section className="page-section detail-page"><div className="container">
      <Link to="/jobs" className="back-link"><ArrowLeft size={16} /> All opportunities</Link>
      <div className="detail-layout">
        <article className="detail-main">
          <div className="detail-company"><span className="company-mark mint">{(job.company || 'J')[0]}</span><div><strong>{job.company}</strong><span>Opportunity</span></div></div>
          <div className="detail-title-row"><div><span className="job-type-pill">{job.type}</span><h1>{job.title}</h1></div><button className="detail-share" onClick={() => navigator.clipboard?.writeText(window.location.href)} aria-label="Copy job link"><ArrowUpRight size={18} /></button></div>
          <div className="detail-meta"><span><MapPin size={16} />{job.location}</span><span><BriefcaseBusiness size={16} />{job.experience || 'All experience levels'}</span><span><CalendarDays size={16} />Posted {job.posted || 'recently'}</span></div>
          {message && <div className="success-box"><Check size={17} />{message}<Link to="/applications">View application</Link></div>}
          <div className="detail-section"><h2>A little about the role</h2><p>{job.description}</p></div>
          <div className="detail-section"><h2>What you’ll bring</h2><div className="detail-skills">{(job.skills || []).map((skill) => <span className="skill-chip" key={skill}>{skill}</span>)}</div></div>
        </article>
        <aside className="apply-card"><span className="eyebrow"><span className="eyebrow-line" />Your next step</span><h2>Sounds like<br />your kind of thing?</h2><div className="apply-facts"><div><span>Compensation</span><strong>{job.salary || 'Not listed'}</strong></div><div><span>Apply by</span><strong>{job.deadline || 'Open until filled'}</strong></div></div><Button className="apply-button" onClick={() => user ? setOpen(true) : navigate('/login', { state: { from: `/jobs/${id}` } })}>Apply for this role <ArrowUpRight size={16} /></Button><p className="apply-note">It only takes a few minutes to put yourself forward.</p></aside>
      </div>
      <Modal open={open} title="Make it yours." onClose={() => setOpen(false)}>
        <p className="modal-description">Apply for <strong>{job.title}</strong> at {job.company}. All fields are required.</p>
        <form className="application-form" onSubmit={submitApplication}>
          <InputField id="apply-name" label="Your name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <InputField id="apply-email" label="Email address" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <InputField id="apply-phone" label="Phone number" type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <label className="field" htmlFor="apply-resume"><span className="field-label">Resume (PDF only)</span><input className="input file-input" id="apply-resume" type="file" accept=".pdf,application/pdf" required onChange={(e) => setForm({ ...form, resume: e.target.files?.[0] || null })} /><span className="field-hint">PDF format, please.</span></label>
          <label className="field" htmlFor="cover-letter"><span className="field-label">Cover letter</span><textarea id="cover-letter" className="input textarea" required minLength={20} value={form.coverLetter} onChange={(e) => setForm({ ...form, coverLetter: e.target.value })} placeholder="A few words about why this role feels right..." /></label>
          {formError && <div className="field-error form-error" role="alert">{formError}</div>}
          <Button type="submit" disabled={submitting}>{submitting ? 'Sending…' : 'Submit application'} <ArrowUpRight size={15} /></Button>
        </form>
      </Modal>
    </div></section>
  );
}
