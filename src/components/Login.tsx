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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isRegister && !name)) {
      setError('Please fill in all required fields.');
      return;
    }

    const loggedUser: User = {
      id: isRegister ? `user-${Date.now()}` : 'user-student',
      name: isRegister ? name : 'Kritika Singh',
      email: email,
      role: isRegister ? role : 'student',
      isPremium: false,
      institution: isRegister ? institution : 'SRMU',
      studyHistory: ['Computer Science', 'Machine Learning', 'Constitutional Law'],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${isRegister ? name : 'Kritika'}`
    };

    onLoginSuccess(loggedUser);
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden" id="login-container-root">
      <div 
        className="absolute inset-0 z-0 pointer-events-none bg-cover bg-center bg-no-repeat opacity-100 transition-all duration-500"
        style={{ backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQ4rrGXHHvCZB_2_GODAKhdiTEwlGqZtSxWwJEJzklcYNnz6y4Saiez4o&s=10')` }}
      />
      <div className="absolute inset-0 bg-slate-950/20 z-0 pointer-events-none" />

      <div className="absolute top-4 left-4 flex items-center space-x-2 z-10 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/40 shadow-xs">
        <div className="p-2 bg-violet-600 rounded-lg text-white">
          <BookOpen className="h-5 w-5" />
        </div>
        <span className="font-sans text-lg font-bold tracking-tight text-slate-900">Notify</span>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-violet-600/90 text-white text-xs font-bold tracking-wide shadow-md backdrop-blur-md border border-violet-500/30">
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-amber-300" />
            <span>Collab & Learn with Peers</span>
          </div>
        </div>
        <h2 className="text-3xl font-sans font-black tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
          {isRegister ? 'Create your account' : 'Welcome back to Notify'}
        </h2>
        <p className="mt-2 text-sm font-semibold text-slate-100 drop-shadow-[0_1.5px_4px_rgba(0,0,0,0.7)] max-w-sm mx-auto">
          {isRegister ? 'Join the leading academic notes sharing hub' : 'Access your notes, collaborative documents & revisions'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-2xl py-8 px-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/60 rounded-3xl sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit} id="login-form">
            {isRegister && (
              <>
                <div>
                  <label htmlFor="reg-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Full Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      id="reg-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-9 block w-full rounded-xl border border-slate-200 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition"
                      placeholder="e.g. Priya Sharma"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-role" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Professional Status
                  </label>
                  <select
                    id="reg-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="mt-1 block w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition bg-white"
                  >
                    <option value="student">Student</option>
                    <option value="professional">Professional</option>
                    <option value="educator">Educator</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="reg-inst" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Institution / University
                  </label>
                  <input
                    id="reg-inst"
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition"
                    placeholder="e.g. Stanford University"
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 block w-full rounded-xl border border-slate-200 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition"
                  placeholder="name@university.edu"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 block w-full rounded-xl border border-slate-200 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {!isRegister && (
              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-slate-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-slate-600">
                    Remember me
                  </label>
                </div>

                <a href="#forgot" className="font-medium text-violet-600 hover:text-violet-500">
                  Forgot password?
                </a>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                id="login-btn"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition cursor-pointer"
              >
                {isRegister ? 'Register Account' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center text-xs text-slate-400 uppercase tracking-wider">
                <span>Or Continue With</span>
              </div>
            </div>

            <div className="mt-4 flex flex-col space-y-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('educator@harvard.edu');
                  setName('Dr. Ishaan Sen');
                  setInstitution('Harvard University');
                  setRole('educator');
                  setIsRegister(false);
                }}
                className="w-full flex items-center justify-center space-x-2 py-2 px-4 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                <LogIn className="h-3.5 w-3.5 text-slate-400" />
                <span>Quick Sign in as  (Educator)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('student@notify.edu');
                  setName('Kritika Singh');
                  setInstitution('SRMU');
                  setRole('student');
                  setIsRegister(false);
                }}
                className="w-full flex items-center justify-center space-x-2 py-2 px-4 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                <LogIn className="h-3.5 w-3.5 text-slate-400" />
                <span>Quick Sign in as Kritika (Student)</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              id="switch-auth-mode-btn"
              onClick={() => setIsRegister(!isRegister)}
              className="text-sm font-medium text-violet-600 hover:text-violet-500 transition"
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register free"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
