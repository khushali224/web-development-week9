import { BriefcaseBusiness, Menu, X } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Button from './Button.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  function signOut() { logout(); setOpen(false); navigate('/'); }
  const close = () => setOpen(false);
  return (
    <header className="site-header">
      <nav className="navbar container" aria-label="Main navigation">
        <Link to="/" className="brand" onClick={close}><span className="brand-icon"><BriefcaseBusiness size={17} /></span>launchpad<span className="brand-dot">.</span></Link>
        <button className="mobile-menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X /> : <Menu />}</button>
        <div className={`nav-links ${open ? 'nav-open' : ''}`}>
          <NavLink to="/jobs" onClick={close}>Find jobs</NavLink>
          {user && <NavLink to="/dashboard" onClick={close}>Dashboard</NavLink>}
          {user ? <>
            <NavLink to="/applications" onClick={close}>Applications</NavLink>
            <NavLink to="/profile" onClick={close}>Profile</NavLink>
            <button className="nav-signout" onClick={signOut}>Sign out</button>
          </> : <>
            <NavLink to="/login" onClick={close}>Log in</NavLink>
            <Button className="nav-cta" onClick={() => { close(); navigate('/register'); }}>Create account <span aria-hidden="true">↗</span></Button>
          </>}
        </div>
      </nav>
    </header>
  );
}
