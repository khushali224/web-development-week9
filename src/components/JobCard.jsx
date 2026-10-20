import { ArrowUpRight, Bookmark, BriefcaseBusiness, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const colors = ['peach', 'lavender', 'mint', 'blue'];

export default function JobCard({ job, index = 0, onFavorite, favorite = false }) {
  const id = job._id || job.id;
  return (
    <article className="job-card">
      <div className="job-card-top">
        <div className={`company-mark ${colors[index % colors.length]}`}>{(job.company || 'J')[0]}</div>
        <button className={`icon-button bookmark ${favorite ? 'is-favorite' : ''}`} aria-label={favorite ? 'Remove saved job' : 'Save job'} onClick={() => onFavorite?.(id)}>
          <Bookmark size={18} fill={favorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="job-company">{job.company}</div>
      <h3><Link to={`/jobs/${id}`}>{job.title}</Link></h3>
      <div className="job-meta"><span><MapPin size={14} />{job.location}</span><span><BriefcaseBusiness size={14} />{job.type}</span></div>
      <div className="skill-list">{(job.skills || []).slice(0, 3).map((skill) => <span className="skill-chip" key={skill}>{skill}</span>)}</div>
      <div className="job-card-footer"><span className="salary">{job.salary || 'Compensation not listed'}</span><Link className="card-link" to={`/jobs/${id}`} aria-label={`View ${job.title}`}>View <ArrowUpRight size={15} /></Link></div>
    </article>
  );
}
