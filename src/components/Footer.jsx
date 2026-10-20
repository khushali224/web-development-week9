import { ArrowUpRight, BriefcaseBusiness } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div><Link to="/" className="brand footer-brand"><span className="brand-icon"><BriefcaseBusiness size={17} /></span>launchpad<span className="brand-dot">.</span></Link><p>A little closer to work that feels like you.</p></div>
        <div className="footer-links"><Link to="/jobs">Explore jobs</Link><Link to="/register">Create account</Link><a href="mailto:hello@launchpad.example">Get in touch <ArrowUpRight size={13} /></a></div>
      </div>
      <div className="container footer-bottom"><span>© 2026 Launchpad. Built for what’s next.</span><span>Thoughtful work starts here.</span></div>
    </footer>
  );
}
