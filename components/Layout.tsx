import React from 'react';
import { 
  Scale, LayoutDashboard, Search, MessageSquare, 
  Briefcase, Library, FileText, Settings, LogOut, 
  Menu, Bell, Activity, CreditCard, Users, Globe
} from 'lucide-react';
import { User, UserRole } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  user, activeTab, setActiveTab, onLogout, isMobileOpen, setIsMobileOpen 
}) => {
  const { t } = useLanguage();
  
  const menuItems = [
    { id: 'dashboard', label: t('sidebar.dashboard'), icon: LayoutDashboard },
    { id: 'search', label: t('sidebar.search'), icon: Search },
    { id: 'chat', label: t('sidebar.chat'), icon: MessageSquare },
    { id: 'cases', label: t('sidebar.cases'), icon: Briefcase },
    { id: 'library', label: t('sidebar.library'), icon: Library },
    { id: 'generator', label: t('sidebar.generator'), icon: FileText },
    { id: 'messages', label: t('sidebar.messages'), icon: Users },
    { id: 'subscription', label: t('sidebar.subscription'), icon: CreditCard },
  ];

  if (user.role === UserRole.ADMIN) {
    menuItems.push({ id: 'logs', label: t('sidebar.logs'), icon: Activity });
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar - Light Purple Theme */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-purple-50 border-r border-purple-100 text-slate-800 transform transition-transform duration-200 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-center h-16 border-b border-purple-100 bg-purple-50/50">
          <Scale className="w-8 h-8 text-purple-600 mr-2" />
          <span className="text-xl font-bold tracking-wide text-purple-900">Smart Juris</span>
        </div>

        <div className="p-4">
          <div className="flex items-center space-x-3 mb-6 p-3 bg-white rounded-xl shadow-sm border border-purple-100">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-lg font-bold text-purple-600">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-sm text-purple-900">{user.name}</p>
              <p className="text-xs text-purple-500">{user.role}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' 
                    : 'text-slate-600 hover:bg-purple-100 hover:text-purple-800'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 ${activeTab === item.id ? 'text-white' : 'text-purple-300'}`} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-purple-100 bg-purple-50">
          <button 
            onClick={onLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            {t('common.logout')}
          </button>
        </div>
      </aside>
    </>
  );
};

export const Header: React.FC<{ 
  title: string; 
  onMenuClick: () => void; 
}> = ({ title, onMenuClick }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <header className="bg-white shadow-sm border-b border-purple-50 h-16 flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center">
        <button 
          onClick={onMenuClick}
          className="p-2 rounded-md text-gray-500 lg:hidden hover:bg-purple-50 focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="ml-4 text-xl font-semibold text-gray-800">{title}</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
          className="flex items-center space-x-1 p-2 text-gray-400 hover:text-purple-600 transition-colors"
        >
          <Globe className="w-6 h-6" />
          <span className="text-xs font-bold uppercase">{language}</span>
        </button>
        <button className="p-2 text-gray-400 hover:text-purple-600 relative transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
          <Settings className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};