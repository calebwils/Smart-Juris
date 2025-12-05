import React, { useState, useEffect } from 'react';
import { Scale, Search, MessageSquare, FileText, ArrowRight, Shield, Zap, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LandingProps {
  onEnter: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onEnter }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { language, setLanguage, t } = useLanguage();

  const heroImages = [
    "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-purple-50 font-sans text-slate-800">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <Scale className="w-8 h-8 text-primary-600" />
          <span className="text-xl font-bold tracking-wide text-purple-900">{t('common.appName')}</span>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-purple-800">
          <a href="#features" className="hover:text-primary-600 transition-colors">{t('nav.features')}</a>
          <a href="#ohada" className="hover:text-primary-600 transition-colors">{t('nav.ohada')}</a>
          <a href="#pricing" className="hover:text-primary-600 transition-colors">{t('nav.pricing')}</a>
          <button 
             onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
             className="flex items-center space-x-1 px-3 py-1 rounded-full border border-purple-200 hover:bg-purple-50"
          >
             <Globe className="w-4 h-4 text-primary-600" />
             <span className="uppercase">{language}</span>
          </button>
        </div>
        <button 
          onClick={onEnter}
          className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm shadow-md shadow-purple-200"
        >
          {t('nav.client_area')}
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-white pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((img, index) => (
            <div 
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url('${img}')` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-50/95 via-purple-100/90 to-white/40" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-purple-200 text-primary-700 text-xs font-medium mb-6 animate-fade-in-up shadow-sm">
              <Zap className="w-3 h-3 mr-2 text-gold-500" />
              {t('landing.new_version')}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight text-purple-950">
              {t('landing.hero_title')} <br />
              <span className="text-primary-600">{t('landing.hero_subtitle')}</span>
            </h1>
            <p className="text-lg md:text-xl text-purple-800 max-w-xl mb-10 leading-relaxed">
              {t('landing.hero_desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onEnter}
                className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary-500/30 transition-all transform hover:scale-105 flex items-center justify-center"
              >
                {t('landing.access_btn')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="px-8 py-4 bg-white hover:bg-purple-50 text-purple-900 rounded-xl font-bold text-lg border border-purple-200 shadow-sm transition-all flex items-center justify-center">
                {t('common.demo')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <div className="relative z-20 -mt-20 container mx-auto px-6 mb-20">
        <div className="bg-white rounded-2xl shadow-xl shadow-purple-900/5 border border-purple-100 p-8 grid md:grid-cols-3 gap-8 text-center animate-fade-in-up">
          <div className="p-4">
            <p className="text-4xl font-extrabold text-primary-600 mb-2">15h+</p>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t('landing.stats_saved')}</p>
          </div>
          <div className="p-4 md:border-l md:border-r border-purple-50">
            <p className="text-4xl font-extrabold text-primary-600 mb-2">98%</p>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t('landing.stats_precision')}</p>
          </div>
          <div className="p-4">
            <p className="text-4xl font-extrabold text-primary-600 mb-2">24/7</p>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t('landing.stats_avail')}</p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-purple-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-purple-900 mb-4">{t('landing.features_title')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('landing.features_desc')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Search className="w-8 h-8 text-primary-600" />}
              title={t('landing.feat_search')}
              description={t('landing.feat_search_desc')}
            />
            <FeatureCard 
              icon={<FileText className="w-8 h-8 text-primary-600" />}
              title={t('landing.feat_gen')}
              description={t('landing.feat_gen_desc')}
            />
            <FeatureCard 
              icon={<MessageSquare className="w-8 h-8 text-primary-600" />}
              title={t('landing.feat_chat')}
              description={t('landing.feat_chat_desc')}
            />
          </div>
        </div>
      </section>

      {/* OHADA Coverage */}
      <section id="ohada" className="py-20 bg-white border-y border-purple-100">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mb-6">
                <Globe className="w-10 h-10 text-primary-600" />
              </div>
              <h2 className="text-3xl font-bold text-purple-900 mb-6">{t('landing.ohada_title')}</h2>
              <p className="text-gray-600 text-lg mb-6">
                {t('landing.ohada_desc')}
              </p>
              
              <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                <h4 className="font-bold text-purple-900 mb-4">{t('landing.countries_covered')} (17) :</h4>
                <div className="flex flex-wrap gap-2">
                  {['Bénin', 'Burkina Faso', 'Cameroun', 'Centrafrique', 'Comores', 'Congo', 'Côte d\'Ivoire', 'Gabon', 'Guinée', 'Guinée-Bissau', 'Guinée Équatoriale', 'Mali', 'Niger', 'RDC', 'Sénégal', 'Tchad', 'Togo'].map((country) => (
                    <span key={country} className="px-3 py-1 bg-white text-primary-700 text-sm rounded-full border border-purple-100 shadow-sm">
                      {country}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
               <div className="relative w-full max-w-md aspect-square rounded-full bg-gradient-to-tr from-purple-200 to-primary-100 opacity-50 blur-3xl absolute"></div>
               <img 
                 src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Africa_OHADA_members.svg/1200px-Africa_OHADA_members.svg.png" 
                 alt="Carte OHADA" 
                 className="relative z-10 max-h-96 drop-shadow-xl hover:scale-105 transition-transform duration-500"
               />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-purple-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-purple-900 mb-6">{t('landing.security_title')}</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Shield className="w-6 h-6 text-primary-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{t('landing.encryption')}</h3>
                    <p className="text-gray-600">{t('landing.encryption_desc')}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Globe className="w-6 h-6 text-primary-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{t('landing.hosting')}</h3>
                    <p className="text-gray-600">{t('landing.hosting_desc')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-primary-200 rounded-full opacity-50 blur-3xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80" 
                alt="Security" 
                className="relative rounded-2xl shadow-2xl border-4 border-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-950 text-purple-200 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Scale className="w-6 h-6 text-primary-400" />
              <span className="text-lg font-bold text-white">{t('common.appName')}</span>
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">{t('nav.legal')}</a>
              <a href="#" className="hover:text-white transition-colors">{t('nav.privacy')}</a>
              <a href="#" className="hover:text-white transition-colors">{t('nav.contact')}</a>
            </div>
            <div className="text-sm mt-4 md:mt-0">
              &copy; 2024 Smart Juris LegalTech.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-2xl border border-purple-100 shadow-xl shadow-purple-100 hover:shadow-2xl hover:shadow-purple-200 transition-all duration-300 group">
    <div className="mb-6 bg-purple-50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-primary-50 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-purple-900 mb-3">{title}</h3>
    <p className="text-gray-500 leading-relaxed">
      {description}
    </p>
  </div>
);