
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle, Settings } from 'lucide-react';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Shop from './pages/Shop';
import CustomRequest from './pages/CustomRequest';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Assets
import logo from './assets/Rwooga logo.png';

// Components
import Footer from './components/Footer';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCustomPrintingEnabled, setIsCustomPrintingEnabled] = useState(true);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('rwooga_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('rwooga_user');
    setUser(null);
    window.location.hash = '/';
  };

  // Initialize printing state from localStorage
  useEffect(() => {
    const storedValue = localStorage.getItem('rwooga_custom_printing');
    if (storedValue !== null) {
      setIsCustomPrintingEnabled(storedValue === 'true');
    }
  }, []);

  const togglePrinting = (val: boolean) => {
    setIsCustomPrintingEnabled(val);
    localStorage.setItem('rwooga_custom_printing', val.toString());
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen font-sans selection:bg-brand-cyan selection:text-white">
        {/* Navigation */}
        <nav className="fixed w-full z-50 bg-[#eef1f2] shadow-lg border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-24">
              <div className="flex items-center">
                <Link to="/" className="flex items-center" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  <img src={logo} alt="Rwooga" className="h-24 w-auto object-contain" />
                </Link>
              </div>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center space-x-8">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/about">About</NavLink>
                <NavLink to="/services">Services</NavLink>
                <NavLink to="/portfolio">Portfolio</NavLink>
                <NavLink to="/shop">Shop</NavLink>
                <NavLink to="/contact">Contact</NavLink>

                {isCustomPrintingEnabled && (
                  <Link
                    to="/custom-request"
                    className="bg-brand-cyan text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all shadow-xl shadow-cyan-900/40"
                  >
                    Custom Design
                  </Link>
                )}

                <div className="h-6 w-px bg-gray-200" />

                {user ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{user.role}</span>
                      <span className="text-sm font-bold text-brand-dark">{user.name}</span>
                    </div>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:text-brand-dark transition-colors">
                        <Settings size={20} />
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link to="/login" className="border border-brand-cyan text-brand-cyan px-8 py-3 rounded-full font-bold hover:bg-brand-cyan hover:text-white transition-all">
                      Login
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-brand-dark p-2"
                >
                  {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Nav Overlay */}
          {isMenuOpen && (
            <div className="md:hidden bg-[#eef1f2] border-t border-gray-100 animate-in slide-in-from-top duration-300">
              <div className="px-4 pt-2 pb-6 space-y-1">
                <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>Home</MobileNavLink>
                <MobileNavLink to="/about" onClick={() => setIsMenuOpen(false)}>About</MobileNavLink>
                <MobileNavLink to="/services" onClick={() => setIsMenuOpen(false)}>Services</MobileNavLink>
                <MobileNavLink to="/portfolio" onClick={() => setIsMenuOpen(false)}>Portfolio</MobileNavLink>
                <MobileNavLink to="/shop" onClick={() => setIsMenuOpen(false)}>Shop</MobileNavLink>
                <MobileNavLink to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</MobileNavLink>
                {isCustomPrintingEnabled && (
                  <MobileNavLink to="/custom-request" onClick={() => setIsMenuOpen(false)}>Custom Request</MobileNavLink>
                )}


                <div className="pt-4 mt-4 border-t border-gray-100 flex flex-col space-y-3">
                  {user ? (
                    <>
                      <div className="px-3 py-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{user.role}</p>
                        <p className="text-lg font-bold text-brand-dark">{user.name}</p>
                      </div>
                      {user.role === 'admin' && (
                        <MobileNavLink to="/admin" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</MobileNavLink>
                      )}
                      <button
                        onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                        className="w-full text-left px-3 py-4 text-lg font-semibold text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-3 py-4 text-lg font-semibold text-gray-700 hover:bg-gray-50 rounded-lg"
                      >
                        Login
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Content */}
        <main className="flex-grow pt-24">
          <Routes>
            <Route path="/" element={<Home isPrintingEnabled={isCustomPrintingEnabled} />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/custom-request" element={<CustomRequest isEnabled={isCustomPrintingEnabled} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin isEnabled={isCustomPrintingEnabled} onToggle={togglePrinting} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>

        <Footer />

        {/* Floating WhatsApp Button */}
        <a
          href="https://wa.me/250784269593"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
        >
          <span className="absolute right-full mr-4 bg-white text-gray-800 px-3 py-1 rounded-lg text-sm font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block">
            Chat with us!
          </span>
          <MessageCircle size={28} />
        </a>

      </div>
    </Router>
  );
};

// Helper Components
const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`font-medium transition-colors ${isActive ? 'text-brand-cyan' : 'text-gray-600 hover:text-brand-dark'}`}
    >
      {children}
    </Link>
  );
};

const MobileNavLink: React.FC<{ to: string; onClick: () => void; children: React.ReactNode }> = ({ to, onClick, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block px-3 py-4 text-lg font-semibold rounded-lg ${isActive ? 'bg-brand-cyan/10 text-brand-cyan' : 'text-gray-700 hover:bg-gray-50'}`}
    >
      {children}
    </Link>
  );
};

export default App;
