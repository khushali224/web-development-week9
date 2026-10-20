import { Search } from 'lucide-react';
import Button from './Button.jsx';

export default function SearchBar({ query, setQuery, location, setLocation, type, setType, onSubmit }) {
  return (
    <form className="search-panel" onSubmit={onSubmit}>
      <label className="search-input-wrap"><Search size={19} /><span className="sr-only">Search roles or companies</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Job title, skill, or company" />
      </label>
      <label className="search-select"><span className="sr-only">Location</span>
        <select value={location} onChange={(event) => setLocation(event.target.value)}><option value="">Any location</option><option>Remote</option><option>Bengaluru</option><option>Mumbai</option><option>Pune</option><option>Hyderabad</option></select>
      </label>
      <label className="search-select"><span className="sr-only">Job type</span>
        <select value={type} onChange={(event) => setType(event.target.value)}><option value="">All types</option><option>Internship</option><option>Full-time</option><option>Part-time</option><option>Contract</option></select>
      </label>
      <Button type="submit"><Search size={16} /> Find jobs</Button>
    </form>
  );
}
