import React, { useState } from 'react';
import { User, UserRole, CaseFile, ActivityLog, SubscriptionPlan } from './types';
import { Sidebar, Header } from './components/Layout';
import { Auth } from './components/Auth';
import { Landing } from './components/Landing';
import { LegalSearch, AIChat, DocGenerator } from './components/SmartFeatures';
import { CaseManager, Dashboard, Library, InternalMessaging, ActivityLogs, Subscription } from './components/Management';
import { MOCK_CASES, MOCK_LOGS } from './store/mockData';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

const AppContent: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const { language, setLanguage, t } = useLanguage();

  // Initialize with a default user to bypass login screen
  const [user, setUser] = useState<User | null>({
    id: 'demo-user',
    name: 'Maître Démo',
    email: 'demo@smartjuris.com',
    role: UserRole.LAWYER,
    subscription: SubscriptionPlan.PREMIUM
  });
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const [cases, setCases] = useState<CaseFile[]>(MOCK_CASES);
  const [logs, setLogs] = useState<ActivityLog[]>(MOCK_LOGS);

  const handleLogin = (name: string, role: UserRole) => {
    const newUser: User = {
      id: '1',
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@smartjuris.com`,
      role,
      subscription: SubscriptionPlan.PREMIUM
    };
    setUser(newUser);
    logActivity(newUser, 'Connexion', 'Utilisateur connecté');
  };

  const handleLogout = () => {
    if (user) logActivity(user, 'Déconnexion', 'Utilisateur déconnecté');
    setUser(null);
    setShowLanding(true);
    setActiveTab('dashboard');
  };

  const logActivity = (currentUser: User | null, action: string, details: string) => {
    const usr = currentUser || user;
    if (!usr) return;
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      userId: usr.id,
      userName: usr.name,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const addAiResponseToCase = (caseId: string, content: string, title?: string) => {
      setCases(prev => prev.map(c => {
          if (c.id === caseId) {
              return {
                  ...c,
                  aiResponses: [...c.aiResponses, {
                      query: title || 'Sauvegarde IA',
                      response: content,
                      date: new Date().toLocaleDateString()
                  }],
                  dateUpdated: new Date().toLocaleDateString()
              };
          }
          return c;
      }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return user && <Dashboard user={user} cases={cases} logs={logs} />;
      case 'search':
        return <LegalSearch 
            onLogActivity={(a, d) => logActivity(user, a, d)} 
            cases={cases}
            onAddToCase={(id, content) => addAiResponseToCase(id, content, t('cases.saved_ai'))}
        />;
      case 'chat':
        return <AIChat 
            onLogActivity={(a, d) => logActivity(user, a, d)} 
            cases={cases}
            onAddToCase={(id, content) => addAiResponseToCase(id, content, 'Chat Discussion')}
        />;
      case 'cases':
        return <CaseManager 
            cases={cases} 
            setCases={setCases} 
            onLogActivity={(a, d) => logActivity(user, a, d)} 
        />;
      case 'generator':
        return <DocGenerator 
            onLogActivity={(a, d) => logActivity(user, a, d)}
            cases={cases}
            onAddToCase={addAiResponseToCase}
        />;
      case 'library':
        return <Library />;
      case 'messages':
        return <InternalMessaging />;
      case 'subscription':
        return <Subscription />;
      case 'logs':
        return user?.role === UserRole.ADMIN ? <ActivityLogs logs={logs} /> : <div className="p-4 text-red-500">Accès non autorisé</div>;
      default:
        return <div className="p-4">Page en construction</div>;
    }
  };

  if (showLanding) {
    return <Landing onEnter={() => setShowLanding(false)} />;
  }

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar 
        user={user} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          title={activeTab === 'dashboard' ? t('sidebar.dashboard') : t(`sidebar.${activeTab}`)} 
          onMenuClick={() => setIsMobileOpen(true)}
        />
        
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;