import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PartyPopper, Menu, X, LogOut, User, Home, Store } from 'lucide-react';
import { useTier } from '../context/TierContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { userName } = useTier();
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const email = localStorage.getItem('pp_user_email');
      const guestMode = localStorage.getItem('pp_guest_mode') === 'true';
      setUserEmail(email);
      setIsLoggedIn(!!email && !guestMode);
    };

    // Check on mount
    checkLoginStatus();

    // Listen for storage changes (when user enters email)
    window.addEventListener('storage', checkLoginStatus);

    // Also check periodically to catch localStorage changes in same tab
    const interval = setInterval(checkLoginStatus, 1000);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    // Clear all localStorage items related to user session
    localStorage.removeItem('pp_user_email');
    localStorage.removeItem('pp_user_tier');
    localStorage.removeItem('pp_guest_mode');

    // Close mobile menu if open
    setIsMenuOpen(false);

    // Redirect to landing page
    navigate('/');
  };

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
          <Link
            to="/app"
            className={linkClass}
            onClick={() => setIsMenuOpen(false)}
          >
            {mobile && <Home className="inline mr-2" size={18} />}
            My Parties
          </Link>
          <Link
            to="/vendors"
            className={linkClass}
            onClick={() => setIsMenuOpen(false)}
          >
            {mobile && <Store className="inline mr-2" size={18} />}
            Find Vendors
          </Link>
          <Link
            to="/account"
            className={linkClass}
            onClick={() => setIsMenuOpen(false)}
          >
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
            className={mobile ? linkClass : "text-white hover:text-pink-100 transition-colors font-semibold"}
            onClick={() => setIsMenuOpen(false)}
          >
            {mobile && <User className="inline mr-2" size={18} />}
            Login
          </Link>
          <Link
            to="/app"
            className={mobile ? "block px-4 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-bold transition-all" : "px-6 py-2 bg-white text-pink-600 rounded-lg font-bold hover:bg-pink-50 transition-all shadow-lg"}
            onClick={() => setIsMenuOpen(false)}
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
          <Link
            to="/"
            className="flex items-center gap-2 text-white font-bold text-xl hover:text-pink-100 transition-colors"
          >
            <PartyPopper size={28} />
            <span className="hidden sm:inline">Plan My Party Pal</span>
            <span className="sm:hidden">PMPP</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
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
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu Drawer */}
          <div className="fixed top-16 right-0 bottom-0 w-64 bg-gradient-to-b from-pink-500 to-rose-500 shadow-2xl z-50 md:hidden">
            <nav className="flex flex-col gap-2 p-4">
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
              <NavLinks mobile={true} />
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
