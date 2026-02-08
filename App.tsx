
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Menu, X, MessageCircle, Settings } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

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
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Checkout from './pages/Checkout';
import { authService } from './services/authService';

// Assets
import logo from './assets/Rwooga logo.png';

// Components
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCustomPrintingEnabled, setIsCustomPrintingEnabled] = useState(true);

  const { user, logout } = useAuth();
  const handleLogout = () => {
    logout();
    window.location.hash = '/login';
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
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex flex-col min-h-screen font-sans selection:bg-brand-primary selection:text-white">
        {/* Navigation */}
        <nav className="fixed w-full z-50 glass-card border-b border-white/10 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-24">
              <div className="flex items-center">
                <Link to="/" className="flex items-center group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  <img src={logo} alt="Rwooga" className="h-16 w-auto object-contain" />
                </Link>
              </div>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center space-x-10">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/about">About</NavLink>
                <NavLink to="/services">Services</NavLink>
                <NavLink to="/portfolio">Portfolio</NavLink>
                <NavLink to="/shop">Shop</NavLink>
                <NavLink to="/contact">Contact</NavLink>
                {user?.is_admin && (
                  <NavLink to="/admin">Admin</NavLink>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <div className="hidden md:block h-6 w-px bg-white/10 mx-4" />

                {isCustomPrintingEnabled && (
                  <Link
                    to="/custom-request"
                    className="glass-button-primary px-6 py-2.5 rounded-full font-bold text-sm shadow-lg hover:shadow-brand-primary/30 transition-all hidden md:flex items-center"
                  >
                    Custom Request
                  </Link>
                )}

                {user ? (
                  <div className="hidden md:flex items-center space-x-4">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{user.role}</span>
                      <span className="text-sm font-bold text-white">{user.name}</span>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="text-xs font-bold text-red-400 hover:text-red-500 transition-colors uppercase tracking-[0.2em] border-l border-white/10 pl-4 ml-4"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="hidden md:block">
                    <Link
                      to="/login"
                      className="text-sm font-bold text-brand-primary hover:text-white transition-all uppercase tracking-widest glass-card glass-card-hover px-6 py-2.5 rounded-full cursor-pointer"
                    >
                      Login
                    </Link>
                  </div>
                )}

                {/* Mobile Menu Button - Now inside the flex container */}
                <div className="md:hidden flex items-center">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-white p-2 hover:text-brand-primary transition-colors"
                  >
                    {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Nav Overlay */}
          {isMenuOpen && (
            <div className="md:hidden glass-card border-t border-white/10 animate-in slide-in-from-top duration-300">
              <div className="px-4 pt-2 pb-6 space-y-1">
                <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>Home</MobileNavLink>
                <MobileNavLink to="/about" onClick={() => setIsMenuOpen(false)}>About</MobileNavLink>
                <MobileNavLink to="/services" onClick={() => setIsMenuOpen(false)}>Services</MobileNavLink>
                <MobileNavLink to="/portfolio" onClick={() => setIsMenuOpen(false)}>Portfolio</MobileNavLink>
                <MobileNavLink to="/shop" onClick={() => setIsMenuOpen(false)}>Shop</MobileNavLink>
                <MobileNavLink to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</MobileNavLink>
                {isCustomPrintingEnabled && (
                  <MobileNavLink to="/custom-request" onClick={() => setIsMenuOpen(false)}>Custom Design</MobileNavLink>
                )}


                <div className="pt-4 mt-4 border-t border-white/10 flex flex-col space-y-3">
                  {user ? (
                    <>
                      <div className="px-3 py-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{user.role}</p>
                        <p className="text-xl font-bold text-white">{user.name}</p>
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
                        className="block px-3 py-4 text-lg font-semibold text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"
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
            <Route path="/contact" element={<Contact />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/verify-email/:email/:token" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/custom-request" element={<CustomRequest isEnabled={isCustomPrintingEnabled} />} />
              <Route path="/checkout" element={<Checkout />} />
            </Route>

            <Route element={<ProtectedRoute requiredRole="admin" />}>
              <Route path="/admin" element={<Admin user={user} handleLogout={handleLogout} isEnabled={isCustomPrintingEnabled} onToggle={togglePrinting} />} />
            </Route>
          </Routes>
        </main>

        <Footer />

        <WhatsAppButton />

      </div >
    </Router >
  );
};

const WhatsAppButton: React.FC = () => {
  const location = useLocation();
  const hidePaths = ['/login', '/signup'];

  if (hidePaths.includes(location.pathname)) {
    return null;
  }

  return (
    <a
      href="https://wa.me/250784269593"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
    >
      <span className="absolute right-full mr-4 bg-white text-gray-800 px-3 py-1 rounded-lg text-sm font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block">
        Chat with us!
      </span>
      {/* WhatsApp Icon SVG */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    </a>
  );
};

// Helper Components
const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`font-semibold text-sm uppercase tracking-widest transition-all ${isActive ? 'text-brand-primary' : 'text-gray-400 hover:text-white'}`}
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
      className={`block px-3 py-4 text-lg font-bold rounded-lg transition-all ${isActive ? 'bg-brand-primary/10 text-brand-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
    >
      {children}
    </Link>
  );
};

export default App;
