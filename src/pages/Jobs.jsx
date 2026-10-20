import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Bookmark, BriefcaseBusiness, ChevronLeft, ChevronRight, MapPin, Search } from 'lucide-react';
import JobCard from '../components/JobCard.jsx';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { api, demoJobs, isDemoMode, normalizeJobs, getErrorMessage } from '../services/api.js';

export default function Jobs() {
  const [params, setParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('launchpad_favorites') || '[]'));
  const [page, setPage] = useState(1);
  const query = params.get('search') || '';
  const [searchText, setSearchText] = useState(query);
  const location = params.get('location') || '';
  const type = params.get('type') || '';
  const category = params.get('category') || '';

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true); setError('');
      try {
        const response = isDemoMode ? demoJobs : normalizeJobs((await api.get('/api/jobs', { params: { search: query, location, type, category, page, limit: 6 } })).data);
        if (active) setJobs(response);
      } catch (requestError) { if (active) setError(getErrorMessage(requestError, 'Unable to load jobs. Please try again.')); }
      finally { if (active) setLoading(false); }
    }
    load();
    return () => { active = false; };
  }, [query, location, type, category, page]);

  const visibleJobs = useMemo(() => isDemoMode ? jobs.filter((job) => {
    const terms = `${job.title} ${job.company} ${(job.skills || []).join(' ')}`.toLowerCase();
    return (!query || terms.includes(query.toLowerCase())) &&
      (!location || job.location.toLowerCase().includes(location.toLowerCase())) &&
      (!type || job.type.toLowerCase() === type.toLowerCase()) &&
      (!category || terms.includes(category.split(' ')[0].toLowerCase()));
  }) : jobs, [jobs, query, location, type, category]);

  function updateFilter(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setPage(1); setParams(next);
  }
  function toggleFavorite(id) {
    const next = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id];
    setFavorites(next); localStorage.setItem('launchpad_favorites', JSON.stringify(next));
  }
  const savedOnly = params.get('saved') === 'true';
  const results = savedOnly ? visibleJobs.filter((job) => favorites.includes(job._id || job.id)) : visibleJobs;
  const hasFilters = query || location || type || category || savedOnly;

  useEffect(() => {
    if (searchText === query) return undefined;
    const timeout = setTimeout(() => updateFilter('search', searchText.trim()), 350);
    return () => clearTimeout(timeout);
  }, [searchText]);
  useEffect(() => {
    if (query !== searchText) setSearchText(query);
  }, [query]);

  return (
    <section className="page-section jobs-page">
      <div className="container">
        <div className="page-kicker"><span className="eyebrow"><span className="eyebrow-line" />Your next chapter</span></div>
        <div className="jobs-title-row"><div><h1>Find your <em>kind</em> of work.</h1><p>Opportunities for people who are ready to grow into what’s next.</p></div><button className={`saved-toggle ${savedOnly ? 'active' : ''}`} onClick={() => updateFilter('saved', savedOnly ? '' : 'true')}><Bookmark size={15} fill={savedOnly ? 'currentColor' : 'none'} /> Saved ({favorites.length})</button></div>
        <div className="filter-panel">
          <label className="filter-field"><Search size={17} /><input placeholder="Role, skill, or company" value={searchText} onChange={(event) => setSearchText(event.target.value)} /></label>
          <label className="filter-field"><MapPin size={17} /><select value={location} onChange={(event) => updateFilter('location', event.target.value)}><option value="">Any location</option><option>Remote</option><option>Bengaluru</option><option>Mumbai</option><option>Pune</option><option>Hyderabad</option></select></label>
          <label className="filter-field"><BriefcaseBusiness size={17} /><select value={type} onChange={(event) => updateFilter('type', event.target.value)}><option value="">All job types</option><option>Internship</option><option>Full-time</option><option>Part-time</option><option>Contract</option></select></label>
          {(query || category) && <button className="clear-filters" onClick={() => { setParams({}); setPage(1); }}>Clear filters</button>}
        </div>
        <div className="results-caption"><span>{loading ? 'Finding opportunities…' : `${results.length} ${results.length === 1 ? 'opportunity' : 'opportunities'}${hasFilters ? ' found' : ' to explore'}`}</span>{isDemoMode && <span className="demo-pill">DEMO LISTINGS</span>}</div>
        {loading ? <Loader label="Loading jobs..." /> : error ? <ErrorMessage onRetry={() => setPage((value) => value)}>{error}</ErrorMessage> : results.length ? <>
          <div className="job-grid">{results.map((job, index) => <JobCard key={job._id || job.id} job={job} index={index} onFavorite={toggleFavorite} favorite={favorites.includes(job._id || job.id)} />)}</div>
          {!isDemoMode && <div className="pagination"><button className="icon-button" aria-label="Previous page" disabled={page === 1} onClick={() => setPage((value) => value - 1)}><ChevronLeft size={18} /></button><span>Page {page}</span><button className="icon-button" aria-label="Next page" onClick={() => setPage((value) => value + 1)}><ChevronRight size={18} /></button></div>}
        </> : <div className="empty-state"><span className="empty-mark">⌕</span><h3>No jobs found</h3><p>Try adjusting your search or removing a filter.</p><button className="text-button" onClick={() => setParams({})}>Clear all filters</button></div>}
      </div>
    </section>
  );
}
