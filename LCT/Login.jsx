
Action: file_editor create /app/frontend/src/pages/Login.jsx --file-text "import React, { useState } from \"react\";
import { Link, useNavigate, useSearchParams } from \"react-router-dom\";
import { useAuth } from \"@/context/AuthContext\";
import { Lock, Mail, Loader2, ArrowRight } from \"lucide-react\";

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(\"\");
  const [password, setPassword] = useState(\"\");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(\"\");

  const redirectPath = searchParams.get(\"redirect\") || \"\";
  const serviceKey = searchParams.get(\"service\") || \"\";

  // If already logged in, redirect away
  React.useEffect(() => {
    if (user) {
      if (user.role === \"admin\") {
        navigate(\"/admin\");
      } else {
        const path = redirectPath ? `/${redirectPath}${serviceKey ? `?service=${serviceKey}` : \"\"}` : \"/dashboard\";
        navigate(path);
      }
    }
  }, [user, navigate, redirectPath, serviceKey]);

  function formatApiErrorDetail(detail) {
    if (detail == null) return \"Something went wrong. Please try again.\";
    if (typeof detail === \"string\") return detail;
    if (Array.isArray(detail))
      return detail.map((e) => (e && typeof e.msg === \"string\" ? e.msg : JSON.stringify(e))).filter(Boolean).join(\" \");
    if (detail && typeof detail.msg === \"string\") return detail.msg;
    return String(detail);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError(\"Please fill in all fields.\");
      return;
    }

    setLoading(true);
    setError(\"\");

    try {
      await login(email, password);
      // Redirect is handled by useEffect on user state change
    } catch (err) {
      console.error(err);
      setError(formatApiErrorDetail(err.response?.data?.detail) || \"Invalid credentials. Please try again.\");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=\"relative min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-12\">
      {/* Background ambient blur */}
      <div className=\"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none\" />

      <div className=\"w-full max-w-md space-y-8 bg-[#121214] border border-white/10 p-8 rounded-xl shadow-2xl relative\">
        <div className=\"text-center space-y-2\">
          <h2 className=\"text-3xl font-bold tracking-tight text-white font-heading\">
            Welcome Back
          </h2>
          <p className=\"text-zinc-500 text-sm\">
            Sign in to manage your requests and explore dynamic prices
          </p>
        </div>

        {error && (
          <div
            data-testid=\"login-error-message\"
            className=\"bg-red-950/20 border border-red-500/30 text-red-400 p-3.5 rounded-lg text-xs sm:text-sm text-left font-medium\"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className=\"space-y-6 text-left\">
          {/* Email */}
          <div className=\"space-y-1.5\">
            <label className=\"text-xs font-bold uppercase tracking-wider text-zinc-400\">
              Email Address
            </label>
            <div className=\"relative\">
              <span className=\"absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500\">
                <Mail className=\"w-4 h-4\" />
              </span>
              <input
                type=\"email\"
                required
                disabled={loading}
                data-testid=\"login-email-input\"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=\"you@example.com\"
                className=\"w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors\"
              />
            </div>
          </div>

          {/* Password */}
          <div className=\"space-y-1.5\">
            <label className=\"text-xs font-bold uppercase tracking-wider text-zinc-400\">
              Password
            </label>
            <div className=\"relative\">
              <span className=\"absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500\">
                <Lock className=\"w-4 h-4\" />
              </span>
              <input
                type=\"password\"
                required
                disabled={loading}
                data-testid=\"login-password-input\"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=\"••••••••\"
                className=\"w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors\"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type=\"submit\"
            disabled={loading}
            data-testid=\"login-submit-button\"
            className=\"w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg shadow-blue-500/10\"
          >
            {loading ? (
              <>
                <Loader2 className=\"w-4 h-4 animate-spin\" />
                Authenticating...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className=\"w-4 h-4\" />
              </>
            )}
          </button>
        </form>

        <div className=\"text-center pt-4 border-t border-white/5 text-sm text-zinc-500\">
          New to LastChoiceTech?{\" \"}
          <Link
            to={`/register${redirectPath ? `?redirect=${redirectPath}` : \"\"}${serviceKey ? `${redirectPath ? \"&\" : \"?\"}service=${serviceKey}` : \"\"}`}
            data-testid=\"login-register-link\"
            className=\"text-blue-400 hover:text-blue-300 font-medium transition-colors\"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
"