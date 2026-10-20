import { ArrowDown, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import JobCard from '../components/JobCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { api, demoJobs, isDemoMode, normalizeJobs, getErrorMessage } from '../services/api.js';

const categories = ['Design', 'Engineering', 'Marketing', 'Data & Analytics', 'Operations', 'Content'];

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');

  async function loadJobs() {
    setLoading(true); setError('');
    try {
      const result = isDemoMode ? demoJobs : normalizeJobs((await api.get('/api/jobs', { params: { limit: 3 } })).data);
      setJobs(result.slice(0, 3));
    } catch (requestError) { setError(getErrorMessage(requestError, 'Unable to load jobs. Please try again.')); }
    finally { setLoading(false); }
  }
  useEffect(() => { loadJobs(); }, []);

  function search(event) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('search', query.trim());
    if (location) params.set('location', location);
    if (type) params.set('type', type);
    window.location.href = `/jobs${params.size ? `?${params.toString()}` : ''}`;
  }

  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" />A better start to your next chapter</div>
            <h1>Your next thing<br />starts <span>somewhere.</span></h1>
            <p className="hero-description">Find thoughtful teams, meaningful internships, and work that makes you feel a little more like you.</p>
            <SearchBar query={query} setQuery={setQuery} location={location} setLocation={setLocation} type={type} setType={setType} onSubmit={search} />
            <div className="hero-footnote"><Sparkles size={14} /> Curated opportunities for early-career talent</div>
          </div>
          <div className="hero-art" aria-label="Abstract illustration of a rising sun over hills">
            <div className="sun-shape" /><div className="art-spark spark-one">✳</div><div className="art-spark spark-two">✳</div>
            <div className="hill hill-back" /><div className="hill hill-front" />
            <div className="floating-note"><span className="note-icon">↗</span><span><strong>Good things ahead</strong><small>One opportunity at a time</small></span></div>
            <div className="art-label">Make room<br />for possibility.</div>
          </div>
        </div>
        <div className="container hero-bottom"><span>GOOD WORK, GOOD PEOPLE, GOOD GROWTH.</span><a href="#opportunities">Scroll to explore <ArrowDown size={14} /></a></div>
      </section>

      <section className="section categories-section">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow"><span className="eyebrow-line" />Find your direction</span><h2>Start with what<br />moves you.</h2></div><p>Big plans start with a curious search. Explore the work you love, or the work you haven’t met yet.</p></div>
          <div className="category-grid">{categories.map((category, index) => <Link to={`/jobs?category=${encodeURIComponent(category)}`} className="category-tile" key={category}><span className={`category-number category-${index}`}>0{index + 1}</span><strong>{category}</strong><ArrowUpRight size={17} /></Link>)}</div>
        </div>
      </section>

      <section className="section opportunities-section" id="opportunities">
        <div className="container">
          <div className="section-heading jobs-heading"><div><span className="eyebrow"><span className="eyebrow-line" />A few good places to begin</span><h2>Fresh opportunities.</h2></div><Link to="/jobs" className="underlined-link">See all opportunities <ArrowRight size={16} /></Link></div>
          {loading ? <Loader label="Finding fresh opportunities..." /> : error ? <ErrorMessage onRetry={loadJobs}>{error}</ErrorMessage> : jobs.length ? <div className="job-grid">{jobs.map((job, index) => <JobCard key={job._id || job.id} job={job} index={index} />)}</div> : <div className="empty-state">No opportunities to show just yet.</div>}
          {isDemoMode && <p className="demo-note">Showing sample listings. Connect your Week 8 API in <code>.env</code> to load live jobs.</p>}
        </div>
      </section>
      <section className="closing-banner"><div className="container closing-inner"><span className="eyebrow"><span className="eyebrow-line" />The first step is yours</span><h2>Curiosity looks<br />good on you.</h2><Link to="/jobs" className="button button-light">Find your next thing <ArrowUpRight size={16} /></Link></div></section>
    </>
  );
}
