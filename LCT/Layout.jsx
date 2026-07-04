
Action: file_editor create /app/frontend/src/components/Layout.jsx --file-text "import React from \"react\";
import { Link, useNavigate, useLocation } from \"react-router-dom\";
import { useAuth } from \"@/context/AuthContext\";
import { LogOut, User, LayoutDashboard, Settings, Menu, X, ArrowRight, Phone, Mail } from \"lucide-react\";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate(\"/\");
  };

  const navItems = [
    { name: \"Home\", path: \"/\", testId: \"nav-home\" },
    { name: \"Services\", path: \"/services\", testId: \"nav-services\" },
    { name: \"Past Projects\", path: \"/portfolio\", testId: \"nav-portfolio\" },
    { name: \"About Us\", path: \"/about\", testId: \"nav-about\" },
  ];

  const logoUrl = \"https://customer-assets.emergentagent.com/job_ab9b035c-6550-4b11-9765-a7bbf827fb79/artifacts/ee1luuew_logo%20LCT.png\";

  return (
    <div className=\"min-h-screen bg-[#080808] text-white font-sans flex flex-col selection:bg-orange-500 selection:text-white\">
      {/* Navigation Header */}
      <header className=\"sticky top-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/10 transition-all duration-300\">
        <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
          <div className=\"flex items-center justify-between h-20\">
            {/* Logo and Brand */}
            <div className=\"flex items-center\">
              <Link to=\"/\" className=\"flex items-center gap-3 group\" data-testid=\"nav-logo\">
                <img
                  src={logoUrl}
                  alt=\"LastChoiceTech Logo\"
                  className=\"h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105\"
                  onError={(e) => {
                    // Fallback in case of image load error
                    e.target.style.display = 'none';
                  }}
                />
                <div className=\"flex flex-col\">
                  <span className=\"text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors\">
                    LastChoiceTech
                  </span>
                  <span className=\"text-[10px] font-semibold text-orange-500 uppercase tracking-widest leading-none\">
                    Services
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Nav Items */}
            <nav className=\"hidden md:flex items-center gap-8\">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    data-testid={item.testId}
                    className={`text-sm font-medium transition-all duration-200 relative py-1 ${
                      isActive
                        ? \"text-blue-400\"
                        : \"text-zinc-400 hover:text-white\"
                    }`}
                  >
                    {item.name}
                    {isActive && (
                      <span className=\"absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-orange-500 rounded-full\" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Auth Buttons / Dashboard Access */}
            <div className=\"hidden md:flex items-center gap-4\">
              {user ? (
                <div className=\"flex items-center gap-4\">
                  {user.role === \"admin\" ? (
                    <Link
                      to=\"/admin\"
                      data-testid=\"nav-admin\"
                      className=\"flex items-center gap-2 text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors border border-orange-500/20 px-3 py-1.5 rounded-lg bg-orange-950/20\"
                    >
                      <Settings className=\"w-4 h-4 animate-spin-slow\" />
                      Admin Control
                    </Link>
                  ) : (
                    <Link
                      to=\"/dashboard\"
                      data-testid=\"nav-dashboard\"
                      className=\"flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors border border-blue-500/20 px-3 py-1.5 rounded-lg bg-blue-950/20\"
                    >
                      <LayoutDashboard className=\"w-4 h-4\" />
                      Client Dashboard
                    </Link>
                  )}
                  <span className=\"text-zinc-500 text-sm\">|</span>
                  <span className=\"text-sm font-medium flex items-center gap-1 text-zinc-300\">
                    <User className=\"w-4 h-4 text-blue-500\" />
                    {user.name.split(\" \")[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    data-testid=\"nav-logout\"
                    className=\"flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-red-400 transition-colors border border-white/5 hover:border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-950/10\"
                  >
                    <LogOut className=\"w-4 h-4\" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className=\"flex items-center gap-4\">
                  <Link
                    to=\"/login\"
                    data-testid=\"nav-login\"
                    className=\"text-sm font-medium text-zinc-400 hover:text-white transition-colors\"
                  >
                    Login
                  </Link>
                  <Link
                    to=\"/register\"
                    data-testid=\"nav-signup\"
                    className=\"flex items-center gap-1 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-500/10\"
                  >
                    Sign Up
                    <ArrowRight className=\"w-4 h-4\" />
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className=\"flex items-center md:hidden\">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className=\"text-zinc-400 hover:text-white p-2\"
                aria-label=\"Toggle menu\"
              >
                {mobileMenuOpen ? <X className=\"w-6 h-6\" /> : <Menu className=\"w-6 h-6\" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className=\"md:hidden bg-zinc-950 border-b border-white/10 px-4 pt-2 pb-6 space-y-3\">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  data-testid={item.testId + \"-mobile\"}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? \"text-blue-400 bg-blue-950/20 border-l-2 border-blue-500\"
                      : \"text-zinc-400 hover:text-white hover:bg-zinc-900\"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            <div className=\"h-px bg-white/5 my-4\" />
            {user ? (
              <div className=\"space-y-3 px-3\">
                <div className=\"text-sm font-medium text-zinc-300 flex items-center gap-2\">
                  <User className=\"w-4 h-4 text-blue-500\" />
                  Logged in as {user.name}
                </div>
                {user.role === \"admin\" ? (
                  <Link
                    to=\"/admin\"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid=\"nav-admin-mobile\"
                    className=\"flex items-center gap-2 text-sm font-medium text-orange-400 hover:text-orange-300 py-1\"
                  >
                    <Settings className=\"w-4 h-4 animate-spin-slow\" />
                    Admin Control
                  </Link>
                ) : (
                  <Link
                    to=\"/dashboard\"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid=\"nav-dashboard-mobile\"
                    className=\"flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 py-1\"
                  >
                    <LayoutDashboard className=\"w-4 h-4\" />
                    Client Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  data-testid=\"nav-logout-mobile\"
                  className=\"flex items-center gap-2 w-full text-left text-sm font-medium text-zinc-400 hover:text-red-400 py-1\"
                >
                  <LogOut className=\"w-4 h-4\" />
                  Logout
                </button>
              </div>
            ) : (
              <div className=\"flex flex-col gap-3 px-3\">
                <Link
                  to=\"/login\"
                  data-testid=\"nav-login-mobile\"
                  onClick={() => setMobileMenuOpen(false)}
                  className=\"text-center text-sm font-medium text-zinc-400 hover:text-white py-2\"
                >
                  Login
                </Link>
                <Link
                  to=\"/register\"
                  data-testid=\"nav-signup-mobile\"
                  onClick={() => setMobileMenuOpen(false)}
                  className=\"text-center text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg\"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className=\"flex-grow\">
        {children}
      </main>

      {/* Beautiful Footer with Startup Identity */}
      <footer className=\"bg-[#0b0b0c] border-t border-white/5 py-16 mt-auto\">
        <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
          <div className=\"grid grid-cols-1 md:grid-cols-4 gap-12\">
            {/* Branding Column */}
            <div className=\"col-span-1 md:col-span-2\">
              <div className=\"flex items-center gap-3 mb-4\">
                <img src={logoUrl} alt=\"LCT Logo\" className=\"h-10 w-auto\" />
                <div>
                  <h3 className=\"font-bold text-lg tracking-tight\">LastChoiceTech</h3>
                  <p className=\"text-xs text-orange-500 uppercase tracking-widest font-semibold leading-none\">Services</p>
                </div>
              </div>
              <p className=\"text-zinc-400 text-sm max-w-sm mb-6 leading-relaxed\">
                Empowering businesses with top-tier digital transformation and supporting students with cutting-edge academic excellence. One Solution. Endless Possibilities.
              </p>
              <div className=\"flex flex-col gap-2 text-sm text-zinc-500\">
                <p>© {new Date().getFullYear()} LastChoiceTech Services. All rights reserved.</p>
                <p className=\"text-xs\">DESIGN • DEVELOP • DELIVER</p>
              </div>
            </div>

            {/* Quick Links Column */}
            <div>
              <h4 className=\"font-semibold text-white mb-4 text-sm uppercase tracking-wider\">Navigation</h4>
              <ul className=\"space-y-2 text-sm text-zinc-400\">
                <li><Link to=\"/\" className=\"hover:text-blue-400 transition-colors\">Home</Link></li>
                <li><Link to=\"/services\" className=\"hover:text-blue-400 transition-colors\">Services</Link></li>
                <li><Link to=\"/portfolio\" className=\"hover:text-blue-400 transition-colors\">Past Projects</Link></li>
                <li><Link to=\"/about\" className=\"hover:text-blue-400 transition-colors\">About Us</Link></li>
              </ul>
            </div>

            {/* Contact Information Column */}
            <div>
              <h4 className=\"font-semibold text-white mb-4 text-sm uppercase tracking-wider\">Connect with Us</h4>
              <ul className=\"space-y-3 text-sm text-zinc-400\">
                <li className=\"flex items-start gap-2\">
                  <Phone className=\"w-4 h-4 text-orange-500 shrink-0 mt-0.5\" />
                  <div className=\"flex flex-col gap-1\">
                    <span>+91 7006328209</span>
                    <span>+91 9103519800</span>
                    <span>+91 7051542143</span>
                  </div>
                </li>
                <li className=\"flex items-center gap-2\">
                  <Mail className=\"w-4 h-4 text-blue-400 shrink-0\" />
                  <a href=\"mailto:lastchoicetechservice@gmail.com\" className=\"hover:text-white transition-colors\">
                    lastchoicetechservice@gmail.com
                  </a>
                </li>
                <li className=\"flex items-center gap-2 mt-4\">
                  <a
                    href=\"https://instagram.com/lastchoicetechservices\"
                    target=\"_blank\"
                    rel=\"noopener noreferrer\"
                    className=\"text-zinc-400 hover:text-pink-500 transition-colors text-xs flex items-center gap-1.5 border border-white/5 px-2.5 py-1 rounded bg-white/5\"
                  >
                    <span>Instagram: lastchoicetechservices</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
"