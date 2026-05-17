import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, Zap, BarChart2, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Invalid email format';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try { await login({ email, password }); navigate('/dashboard'); }
    catch { /* toast shown by context */ }
    finally { setIsLoading(false); }
  };

  const inputStyle = { paddingLeft: '2.75rem' };
  const inputClass = 'w-full pr-4 py-3 bg-zinc-800/60 border border-zinc-700/50 text-white rounded-xl text-sm placeholder-zinc-500 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';

  const features = [
    { icon: BarChart2,  text: 'Real-time lead analytics & reporting' },
    { icon: Users,      text: 'Collaborate across your sales team' },
    { icon: TrendingUp, text: 'Track conversion rates at a glance' },
  ];

  return (
    <div className="min-h-screen flex bg-zinc-950">
      <Toaster position="top-right" />

      {/* ── Left branding panel ─────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[46%] relative overflow-hidden items-center justify-center p-14"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #0f0f12 100%)' }}
      >
        <div className="absolute top-[-80px] left-[-80px] w-96 h-96 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-60px] right-[-60px] w-80 h-80 bg-violet-700/20 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65 }}
          className="relative z-10 max-w-sm"
        >
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-indigo-300" />
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">SmartLeads</span>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Close more deals,<br />
            <span className="text-indigo-400">faster.</span>
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed mb-10">
            Join thousands of sales professionals who manage their entire pipeline in one place.
          </p>

          <ul className="space-y-4">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="text-zinc-300 text-sm">{text}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* ── Right form panel ────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-zinc-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="w-full max-w-md"
        >
          {/* card */}
          <div
            className="rounded-2xl p-px shadow-2xl shadow-black/60"
            style={{ background: 'linear-gradient(145deg, rgba(99,102,241,0.5) 0%, rgba(99,102,241,0.08) 50%, rgba(124,58,237,0.3) 100%)' }}
          >
            <div className="rounded-2xl p-8" style={{ background: '#0e0e10' }}>

              {/* header */}
              <div className="mb-8">
                <div className="flex items-center gap-2.5 mb-6">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
                  >
                    <Zap className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-zinc-400 tracking-widest uppercase">SmartLeads</span>
                </div>
                <h2 className="text-[1.6rem] font-bold tracking-tight text-white mb-2">
                  Welcome back
                </h2>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Sign in to your account to continue
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Email */}
                <div>
                  <label htmlFor="login-email" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail className="w-4 h-4 text-zinc-500" />
                    </div>
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      style={inputStyle}
                      className={`${inputClass} ${errors.email ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                    />
                  </div>
                  {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="login-password" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="w-4 h-4 text-zinc-500" />
                    </div>
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                      className={`${inputClass} ${errors.password ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  id="login-submit"
                  className="w-full py-3 mt-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: isLoading ? '#4338ca' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    boxShadow: '0 4px 24px rgba(99,102,241,0.35)',
                  }}
                >
                  {isLoading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>
            </div>
          </div>

          <p className="mt-5 text-center text-sm text-zinc-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              Create account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
