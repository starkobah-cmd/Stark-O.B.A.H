import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowLeft, KeyRound, CheckCircle2, AlertCircle, Sparkles, Unlock, Mail, RefreshCw, HelpCircle, X } from 'lucide-react';
import { verifyAdminLogin } from '../utils/auth';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToSite: () => void;
  brandName?: string;
}

const FAILED_ATTEMPTS_KEY = 'netronomic_failed_logins';
const LOCKOUT_UNTIL_KEY = 'netronomic_lockout_until';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToSite, brandName = 'NETRONOMIC' }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Rate Limiting & Lockout State
  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    const saved = localStorage.getItem(FAILED_ATTEMPTS_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [lockoutUntil, setLockoutUntil] = useState<number>(() => {
    const saved = localStorage.getItem(LOCKOUT_UNTIL_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [remainingLockoutSeconds, setRemainingLockoutSeconds] = useState<number>(0);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Timer for lockout countdown
  useEffect(() => {
    if (lockoutUntil > Date.now()) {
      const interval = setInterval(() => {
        const diff = Math.ceil((lockoutUntil - Date.now()) / 1000);
        if (diff <= 0) {
          setLockoutUntil(0);
          setFailedAttempts(0);
          localStorage.removeItem(LOCKOUT_UNTIL_KEY);
          localStorage.removeItem(FAILED_ATTEMPTS_KEY);
          setRemainingLockoutSeconds(0);
          clearInterval(interval);
        } else {
          setRemainingLockoutSeconds(diff);
        }
      }, 1000);
      setRemainingLockoutSeconds(Math.ceil((lockoutUntil - Date.now()) / 1000));
      return () => clearInterval(interval);
    }
  }, [lockoutUntil]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Check if currently locked out
    if (lockoutUntil > Date.now()) {
      return;
    }

    const trimmedIdentifier = identifier.trim();
    const trimmedPassword = password.trim();

    if (!trimmedIdentifier || !trimmedPassword) {
      setErrorMsg('Please enter your username/email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyAdminLogin(trimmedIdentifier, trimmedPassword, rememberMe);
      if (result.success) {
        // Reset failed attempts on success
        localStorage.removeItem(FAILED_ATTEMPTS_KEY);
        localStorage.removeItem(LOCKOUT_UNTIL_KEY);
        setFailedAttempts(0);
        setLockoutUntil(0);

        setIsUnlocked(true);
        setTimeout(() => {
          onLoginSuccess();
        }, 1600);
      } else {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        localStorage.setItem(FAILED_ATTEMPTS_KEY, newAttempts.toString());

        if (newAttempts >= MAX_ATTEMPTS) {
          const lockoutTime = Date.now() + LOCKOUT_DURATION_MS;
          setLockoutUntil(lockoutTime);
          localStorage.setItem(LOCKOUT_UNTIL_KEY, lockoutTime.toString());
          setErrorMsg(`Too many failed attempts. Login locked for 15:00 minutes for security.`);
        } else {
          setErrorMsg(result.error || `Invalid credentials. ${MAX_ATTEMPTS - newAttempts} attempts remaining before temporary lockout.`);
        }
        setIsLoading(false);
      }
    } catch (err) {
      setErrorMsg('Authentication error. Please check your credentials.');
      setIsLoading(false);
    }
  };

  const isLockedOut = lockoutUntil > Date.now();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans selection:bg-sky-500 selection:text-white relative overflow-hidden">
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <AnimatePresence mode="wait">
        {isUnlocked ? (
          /* Unlocking / Opening Animation Screen */
          <motion.div
            key="unlock-animation"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-md text-center p-8 bg-slate-900/90 border border-sky-500/30 rounded-3xl backdrop-blur-xl shadow-2xl shadow-sky-500/20 relative z-20 space-y-6 overflow-hidden"
          >
            <motion.div
              animate={{
                scale: [1, 1.4, 1.2],
                opacity: [0.3, 0.7, 0.4],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-gradient-to-r from-sky-500/20 via-cyan-500/20 to-blue-500/20 blur-2xl pointer-events-none"
            />

            <div className="relative z-10 flex justify-center py-4">
              <motion.div
                initial={{ scale: 0.5, rotate: -45 }}
                animate={{ scale: [0.5, 1.25, 1], rotate: 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 15 }}
                className="relative"
              >
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-sky-400 via-cyan-400 to-indigo-500 p-1 shadow-2xl shadow-sky-400/40 flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center relative overflow-hidden">
                    <motion.div
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-tr from-sky-500/30 to-cyan-400/30"
                    />
                    <Unlock className="w-12 h-12 text-sky-400 relative z-10" />
                  </div>
                </div>

                <motion.div
                  animate={{ scale: [1, 1.3, 1], rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-3 -right-3 p-2 bg-sky-500/20 border border-sky-400/40 rounded-full backdrop-blur-md"
                >
                  <Sparkles className="w-5 h-5 text-sky-300" />
                </motion.div>

                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-2 -left-2 p-1.5 bg-cyan-500/20 border border-cyan-400/40 rounded-full backdrop-blur-md"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </motion.div>
              </motion.div>
            </div>

            <div className="relative z-10 space-y-2">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Access Granted
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-black text-white tracking-tight"
              >
                Welcome to {brandName} CMS
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xs font-semibold text-slate-400"
              >
                Initializing secure control panel...
              </motion.p>
            </div>

            <div className="relative z-10 pt-2">
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-sky-400 via-cyan-400 to-indigo-500 rounded-full shadow-lg shadow-sky-400/50"
                />
              </div>
            </div>
          </motion.div>
        ) : (
          /* Normal Login Form */
          <motion.div
            key="login-form"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-950 relative z-10 space-y-6"
          >
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 p-0.5 shadow-xl shadow-sky-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <ShieldCheck className="w-7 h-7 text-sky-400" />
                </div>
              </div>

              <div>
                <span className="px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[10px] font-black uppercase tracking-widest">
                  Protected Area
                </span>
                <h1 className="text-2xl font-black text-white tracking-tight mt-2">
                  {brandName} CMS Login
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your admin credentials to access the website control panel.
                </p>
              </div>
            </div>

            {/* Error or Lockout Alert */}
            {isLockedOut ? (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2.5"
              >
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 animate-pulse" />
                <div>
                  <p className="font-bold">Too many failed attempts.</p>
                  <p className="text-[11px] mt-0.5">
                    Login locked for <span className="font-mono underline">{formatTime(remainingLockoutSeconds)}</span> minutes for security.
                  </p>
                </div>
              </motion.div>
            ) : errorMsg ? (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </motion.div>
            ) : null}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Username or Email Address
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Authorized email or username"
                    disabled={isLockedOut}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold placeholder:text-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all disabled:opacity-50"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Admin Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] font-bold text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    disabled={isLockedOut}
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold placeholder:text-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all disabled:opacity-50"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="rememberMeCheckbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLockedOut}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-900 cursor-pointer disabled:opacity-50"
                />
                <label htmlFor="rememberMeCheckbox" className="text-xs text-slate-300 font-medium cursor-pointer select-none">
                  Remember this device (Keep signed in for 7 days)
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading || isLockedOut}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-slate-950 font-black text-xs shadow-lg shadow-sky-500/25 hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : isLockedOut ? (
                  <span>Locked ({formatTime(remainingLockoutSeconds)})</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Sign In to Admin Panel</span>
                  </>
                )}
              </button>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5 flex-1">
                  <p className="text-slate-300 font-semibold">Protected Administration</p>
                  <p className="text-slate-400 text-[11px]">
                    Default Username: <strong className="text-sky-400 font-mono">admin</strong> • Default Password: <strong className="text-sky-400 font-mono">admin123</strong>
                  </p>
                </div>
              </div>

              {/* Auto-fill button */}
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem(FAILED_ATTEMPTS_KEY);
                  localStorage.removeItem(LOCKOUT_UNTIL_KEY);
                  setLockoutUntil(0);
                  setFailedAttempts(0);
                  setErrorMsg('');
                  setIdentifier('admin');
                  setPassword('admin123');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-sky-500/20 text-sky-400 hover:text-sky-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Auto-Fill Admin Credentials (admin / admin123)</span>
              </button>
            </form>

            {/* Back to Public Site Link */}
            <div className="pt-2 text-center border-t border-slate-800">
              <button
                onClick={onBackToSite}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Public Website</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Forgot Password Action Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative"
            >
              <button
                onClick={() => setShowForgotModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800/50 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-400">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Password Reset Security</h3>
                  <p className="text-xs text-slate-400">Administrator verification protocol</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-3">
                <p>
                  For security reasons, password resets must be verified via your registered recovery email or manual environment configuration.
                </p>
                <p className="text-[11px] text-slate-400">
                  If you need emergency access recovery, please contact your systems administrator or verify credentials in your server environment variables.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-slate-950 font-bold text-xs hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-sky-500/20"
                >
                  Back to Login
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
