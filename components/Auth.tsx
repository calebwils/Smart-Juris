import React, { useState } from 'react';
import { Scale, Lock, Mail, User as UserIcon } from 'lucide-react';
import { UserRole } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface AuthProps {
  onLogin: (name: string, role: UserRole) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.LAWYER);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userName = name || email.split('@')[0];
    onLogin(userName, role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8 text-center bg-primary-600 text-white">
          <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-1">{t('common.appName')}</h1>
          <p className="text-primary-100">{t('landing.hero_subtitle')}</p>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
            {isLogin ? t('common.login') : t('common.signup')}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('common.name')}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder={t('common.email')}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder={t('common.password')}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {!isLogin && (
               <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('common.role')}</label>
                  <select 
                    value={role} 
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full border rounded-lg p-2"
                  >
                      {Object.values(UserRole).map((r) => (
                          <option key={r} value={r}>{r}</option>
                      ))}
                  </select>
               </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 transition-colors shadow-lg"
            >
              {isLogin ? t('common.login') : t('common.signup')}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-600 hover:underline font-medium"
            >
              {isLogin ? t('common.no_account') : t('common.has_account')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};