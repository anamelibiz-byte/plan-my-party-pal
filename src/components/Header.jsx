import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PartyPopper, Menu, X, LogOut, User, Home, Store, BookOpen, Info, Mail, ChevronDown, Music } from 'lucide-react';
import { useTier } from '../context/TierContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isMobileResourcesOpen, setIsMobileResourcesOpen] = useState(false);
  const { userName } = useTier();
  const navigate = useNavigate();
  const resourcesRef = useRef(null);

  useEffect(() => {
    const checkLoginStatus = () => {
      const email = localStorage.getItem('pp_user_email');
      const guestMode = localStorage.getItem('pp_guest_mode') === 'true';
      setUserEmail(email);
      setIsLoggedIn(!!email && !guestMode);
    };

    checkLoginStatus();
    // storage fires across tabs; pp-auth-change fires within the same tab
    window.addEventListener('storage', checkLoginStatus);
    window.addEventListener('pp-auth-change', checkLoginStatus);
    // Fallback poll every 500ms to catch any missed updates
    const interval = setInterval(checkLoginStatus, 500);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('pp-auth-change', checkLoginStatus);
      clearInterval(interval);
    };
  }, []);

  // Close resources dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (resourcesRef.current && !resourcesRef.current.contains(e.target)) {
        setIsResourcesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('pp_user_email');
    localStorage.removeItem('pp_user_tier');
    localStorage.removeItem('pp_guest_mode');
    window.dispatchEvent(new Event('pp-auth-change'));
    setIsMenuOpen(false);
    navigate('/');
  };

  const closeAll = () => {
    setIsMenuOpen(false);
    setIsResourcesOpen(false);
    setIsMobileResourcesOpen(false);
  };

  const ResourcesDropdown = () => (
    <div
      ref={resourcesRef}
      className="relative"
    >
      <button
        onClick={() => setIsResourcesOpen(prev => !prev)}
        className="flex items-center gap-1.5 text-white hover:text-pink-100 transition-colors font-semibold"
        aria-expanded={isResourcesOpen}
        aria-haspopup="true"
      >
        Resources
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${isResourcesOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isResourcesOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
          <Link
            to="/song"
            onClick={() => setIsResourcesOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
          >
            <Music size={15} className="text-pink-500" />
            🎵 Birthday Song
          </Link>
          <Link
            to="/vendors"
            onClick={() => setIsResourcesOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
          >
            <Store size={15} className="text-pink-400" />
            Find Vendors
          </Link>
          <Link
            to="/blog"
            onClick={() => setIsResourcesOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
          >
            <BookOpen size={15} className="text-pink-400" />
            Blog
          </Link>
          <Link
            to="/about"
            onClick={() => setIsResourcesOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
          >
            <Info size={15} className="text-purple-400" />
            About Us
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsResourcesOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
          >
            <Mail size={15} className="text-rose-400" />
            Contact
          </Link>
        </div>
      )}
    </div>
  );

  const NavLinks = ({ mobile = false }) => {
    const linkClass = mobile
      ? 'block px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors'
      : 'text-white hover:text-pink-100 transition-colors font-semibold';

    const buttonClass = mobile
      ? 'block w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors'
      : 'flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all font-semibold';

    if (isLoggedIn) {
      return (
        <>
          <Link to="/app" className={linkClass} onClick={closeAll}>
            {mobile && <Home className="inline mr-2" size={18} />}
            My Parties
          </Link>
          <Link to="/vendors" className={linkClass} onClick={closeAll}>
            {mobile && <Store className="inline mr-2" size={18} />}
            Find Vendors
          </Link>
          <Link to="/account" className={linkClass} onClick={closeAll}>
            {mobile && <User className="inline mr-2" size={18} />}
            Account
          </Link>
          <button onClick={handleLogout} className={buttonClass}>
            <LogOut size={18} />
            Logout
          </button>
        </>
      );
    } else {
      return (
        <>
          <Link
            to="/app?auth=required"
            className={mobile ? linkClass : 'text-white hover:text-pink-100 transition-colors font-semibold'}
            onClick={closeAll}
          >
            {mobile && <User className="inline mr-2" size={18} />}
            Login
          </Link>
          <Link
            to="/app"
            className={mobile
              ? 'block px-4 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-bold transition-all'
              : 'px-6 py-2 bg-white text-pink-600 rounded-lg font-bold hover:bg-pink-50 transition-all shadow-lg'}
            onClick={closeAll}
          >
            Start Planning
          </Link>
        </>
      );
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center hover:opacity-90 transition-opacity" onClick={closeAll}>
            <img src="/images/party-plann-icon.png" alt="Party Plann" className="h-10 sm:h-12" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <ResourcesDropdown />
            <NavLinks mobile={false} />
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed top-16 right-0 bottom-0 w-64 bg-gradient-to-b from-pink-500 to-rose-500 shadow-2xl z-50 md:hidden overflow-y-auto">
            <nav className="flex flex-col gap-1 p-4">
              {userEmail && (
                <div className="px-4 py-3 mb-2 bg-white/10 rounded-lg">
                  <p className="text-xs text-pink-100 mb-1">
                    {userName ? 'Welcome back' : 'Signed in as'}
                  </p>
                  <p className="text-sm text-white font-semibold truncate">
                    {userName || userEmail}
                  </p>
                </div>
              )}

              {/* Mobile Resources Section */}
              <div>
                <button
                  onClick={() => setIsMobileResourcesOpen(prev => !prev)}
                  className="w-full flex items-center justify-between px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors font-semibold"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen size={18} />
                    Resources
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${isMobileResourcesOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isMobileResourcesOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    <Link
                      to="/song"
                      onClick={closeAll}
                      className="flex items-center gap-2 px-4 py-2.5 text-white/90 hover:bg-white/10 rounded-lg transition-colors text-sm"
                    >
                      <Music size={15} />
                      🎵 Birthday Song
                    </Link>
                    <Link
                      to="/vendors"
                      onClick={closeAll}
                      className="flex items-center gap-2 px-4 py-2.5 text-white/90 hover:bg-white/10 rounded-lg transition-colors text-sm"
                    >
                      <Store size={15} />
                      Find Vendors
                    </Link>
                    <Link
                      to="/blog"
                      onClick={closeAll}
                      className="flex items-center gap-2 px-4 py-2.5 text-white/90 hover:bg-white/10 rounded-lg transition-colors text-sm"
                    >
                      <BookOpen size={15} />
                      Blog
                    </Link>
                    <Link
                      to="/about"
                      onClick={closeAll}
                      className="flex items-center gap-2 px-4 py-2.5 text-white/90 hover:bg-white/10 rounded-lg transition-colors text-sm"
                    >
                      <Info size={15} />
                      About Us
                    </Link>
                    <Link
                      to="/contact"
                      onClick={closeAll}
                      className="flex items-center gap-2 px-4 py-2.5 text-white/90 hover:bg-white/10 rounded-lg transition-colors text-sm"
                    >
                      <Mail size={15} />
                      Contact
                    </Link>
                  </div>
                )}
              </div>

              <NavLinks mobile={true} />
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
