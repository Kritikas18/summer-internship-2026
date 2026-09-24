import React, { useState } from 'react';
import { BookOpen, Key, Mail, User as UserIcon, LogIn, Sparkles } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('student@notify.edu');
  const [password, setPassword] = useState('password');
  const [name, setName] = useState('Kritika Singh');
  const [role, setRole] = useState<'student' | 'professional' | 'educator'>('student');
  const [institution, setInstitution] = useState('SRMU');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  setError("");

  if (!email || !password || (isRegister && !name)) {
    setError("Please fill in all required fields.");
    return;
  }

  try {
    const url = isRegister ? "/api/register" : "/api/login";

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
        institution,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      return;
    }

    onLoginSuccess(data);
  } catch {
    setError("Server Error");
  }
};

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#f6f4ff] px-4 py-10 sm:px-6 lg:px-8" id="login-container-root">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.30),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.26),_transparent_24%)]" />
      <div className="grid-pattern absolute inset-0 opacity-30" />

      <div className="relative mx-auto max-w-7xl">
        <div className="absolute left-4 top-4 z-20 inline-flex items-center gap-3 rounded-2xl border border-white/40 bg-white/75 px-4 py-2 shadow-[0_10px_28px_rgba(91,74,181,0.15)] backdrop-blur-xl">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-500 text-white shadow-lg shadow-violet-500/30">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-black tracking-tight text-slate-900">Notify</div>
            <div className="text-[9px] font-bold uppercase tracking-[0.22em] text-violet-500">Academic sphere</div>
          </div>
        </div>

        <div className="grid min-h-[calc(100vh-5rem)] items-center gap-8 pt-16 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative hidden lg:block">
            <div className="soft-float absolute -left-10 top-12 h-28 w-28 rounded-full bg-violet-300/35 blur-3xl" />
            <div className="soft-float absolute right-10 bottom-4 h-32 w-32 rounded-full bg-sky-300/35 blur-3xl" />

            <div className="relative overflow-hidden rounded-[32px] border border-white/45 bg-white/70 p-8 shadow-[0_30px_80px_rgba(76,55,163,0.18)] backdrop-blur-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-violet-700">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Collab & Learn with Peers
              </div>

              <h1 className="max-w-lg text-5xl font-black tracking-tight text-slate-900">
                Turn study notes into shared academic momentum.
              </h1>

              <p className="mt-5 max-w-md text-base leading-7 text-slate-600">
                Build smarter learning habits with collaborative notes, guided revision flows, premium study packs, and a network built for learners who care about results.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-violet-100 bg-violet-50/80 p-4 shadow-sm">
                  <div className="text-2xl font-black text-violet-700">12k+</div>
                  <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-500">notes shared</div>
                </div>
                <div className="rounded-2xl border border-sky-100 bg-sky-50/80 p-4 shadow-sm">
                  <div className="text-2xl font-black text-sky-700">9.2/10</div>
                  <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-sky-500">student rating</div>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4 shadow-sm">
                  <div className="text-2xl font-black text-emerald-700">4.8x</div>
                  <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-500">faster revision</div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {['AI summaries', 'Peer collaboration', 'Premium learning', 'Secure storage'].map((item) => (
                  <span key={item} className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <div className="hero-glow mx-auto max-w-md rounded-[30px] border border-white/60 bg-white/80 p-6 shadow-[0_30px_80px_rgba(88,74,174,0.18)] backdrop-blur-2xl sm:p-8">
              <div className="mb-5 text-center">
                <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-violet-700">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  {isRegister ? 'Create your account' : 'Welcome back'}
                </div>
                <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900">
                  {isRegister ? 'Join Notify' : 'Sign in to Notify'}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {isRegister ? 'Become part of a smarter academic network.' : 'Access your notes, documents, and peer revisions.'}
                </p>
              </div>

              {error && (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit} id="login-form">
                {isRegister && (
                  <>
                    <div>
                      <label htmlFor="reg-name" className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        Full Name
                      </label>
                      <div className="relative rounded-2xl border border-slate-200 bg-slate-50/70 focus-within:border-violet-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-violet-100 transition-all">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <UserIcon className="h-4 w-4" />
                        </div>
                        <input
                          id="reg-name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full rounded-2xl border-0 bg-transparent py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                          placeholder="e.g. Priya Sharma"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="reg-role" className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        Professional Status
                      </label>
                      <select
                        id="reg-role"
                        value={role}
                        onChange={(e) => setRole(e.target.value as any)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-2.5 px-3 text-sm text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                      >
                        <option value="student">Student</option>
                        <option value="professional">Professional</option>
                        <option value="educator">Educator</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="reg-inst" className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        Institution / University
                      </label>
                      <input
                        id="reg-inst"
                        type="text"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-2.5 px-3 text-sm text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                        placeholder="e.g. Stanford University"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label htmlFor="email" className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Email address
                  </label>
                  <div className="relative rounded-2xl border border-slate-200 bg-slate-50/70 focus-within:border-violet-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-violet-100 transition-all">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-2xl border-0 bg-transparent py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                      placeholder="name@university.edu"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Password
                  </label>
                  <div className="relative rounded-2xl border border-slate-200 bg-slate-50/70 focus-within:border-violet-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-violet-100 transition-all">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Key className="h-4 w-4" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-2xl border-0 bg-transparent py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {!isRegister && (
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <label className="inline-flex items-center gap-2">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                        defaultChecked
                      />
                      <span>Remember me</span>
                    </label>

                    <a href="#forgot" className="font-bold text-violet-600 hover:text-violet-500">
                      Forgot password?
                    </a>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    id="login-btn"
                    className="w-full rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 px-4 py-3 text-sm font-black text-white shadow-[0_18px_38px_rgba(109,92,214,0.32)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_45px_rgba(109,92,214,0.40)]"
                  >
                    {isRegister ? 'Create account' : 'Sign In'}
                  </button>
                </div>

                <div className="relative flex items-center py-1">
                  <div className="flex-grow border-t border-slate-200" />
                  <span className="mx-3 flex-shrink text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Or Continue With
                  </span>
                  <div className="flex-grow border-t border-slate-200" />
                </div>

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50"
                  >
                    <BookOpen className="h-4 w-4 text-violet-600" />
                    Quick Sign in as Educator
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50"
                  >
                    <UserIcon className="h-4 w-4 text-violet-600" />
                    Quick Sign in as Kritika
                  </button>
                </div>

                <div className="pt-1 text-center">
                  <button
                    type="button"
                    onClick={() => setIsRegister((prev) => !prev)}
                    className="text-sm font-bold text-violet-600 transition hover:text-violet-500"
                  >
                    {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register free"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
