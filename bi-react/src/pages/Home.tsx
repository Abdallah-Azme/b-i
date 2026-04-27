import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../context/Store';
import { FALLBACK_IMAGE } from '../constants';
import { Link } from '@tanstack/react-router';
import { ArrowRight, CheckCircle2, TrendingUp, Shield } from 'lucide-react';
import { Money } from '../components/Money';
import { useHomePage } from '@/features/general/hooks/useHomePage';
import { Logo } from '@/components/Logo';

export const Home: React.FC = () => {
  const { lang } = useStore();
  const { t } = useTranslation();

  const { data: homeResponse, isLoading, isError } = useHomePage();
  const homeData = homeResponse?.data;

  useEffect(() => {
    if (homeData) {
      document.title = `${homeData.website_name} | ${homeData.website_header.title}`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', homeData.project_brief);
      } else {
        const meta = document.createElement('meta');
        meta.name = "description";
        meta.content = homeData.project_brief;
        document.head.appendChild(meta);
      }
    }
  }, [homeData]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-brand-black">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-brand-gold/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-brand-gold font-medium animate-pulse tracking-widest uppercase text-xs">{t('common.loading')}</p>
      </div>
    );
  }

  if (isError || !homeData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-brand-black text-center px-4">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <Shield className="text-red-500 w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">{t('common.error')}</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">{t('common.errorDesc')}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-gold-gradient text-black px-10 py-3 rounded-full font-bold hover-scale shadow-lg shadow-brand-gold/20"
        >
          {t('common.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-brand-black z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-gold/10 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-brand-gold/5 blur-[150px] rounded-full animate-pulse delay-1000"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-black to-black"></div>
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-8 animate-fade-in-up">
          {/* Logo & Brand */}
          <div className="flex flex-col items-center mb-4">
            <div className="relative group">
               <div className="absolute -inset-4 bg-brand-gold/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition duration-500"></div>
               <Logo src={homeData.logo_url || undefined} className="w-24 h-24 relative z-10 mb-4" />
            </div>
            <span className="text-brand-gold font-bold tracking-[0.3em] uppercase text-sm mb-2 drop-shadow-glow">
              {homeData.website_name}
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-[1.1] bg-clip-text text-transparent bg-gold-gradient py-2">
            {homeData.website_header.title}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-6 font-light max-w-3xl mx-auto leading-relaxed">
            {homeData.website_header.description}
          </p>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl max-w-2xl mx-auto mb-10 transform hover:scale-[1.02] transition duration-500 shadow-2xl">
             <p className="text-gray-400 italic text-lg leading-relaxed">
               "{homeData.project_brief}"
             </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-4">
            <Link to="/projects" className="bg-gold-gradient text-black px-10 py-5 rounded-full font-black text-xl hover-scale glow-on-hover transition duration-300 shadow-2xl shadow-brand-gold/30 min-w-[200px]">
              {t('hero.cta')}
            </Link>
            <Link to="/register-type" className="px-10 py-5 rounded-full font-bold text-xl border-2 border-white/20 hover:bg-white/10 hover-scale transition duration-300 backdrop-blur-sm min-w-[200px] text-white">
              {t('nav.register')}
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
           <div className="w-1 h-12 rounded-full bg-gradient-to-b from-brand-gold to-transparent"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-brand-dark py-24 relative border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          {homeData.features.map((feature, idx) => (
            <div 
              key={feature.id} 
              className="group p-8 glass-card border-white/5 hover:border-brand-gold/30 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-brand-gold/5 blur-3xl group-hover:bg-brand-gold/10 transition duration-500 rounded-full"></div>
              
              <div className="w-20 h-20 mb-8 bg-brand-black rounded-3xl flex items-center justify-center border border-white/10 group-hover:border-brand-gold/50 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                <img src={feature.image} alt="" className="w-12 h-12 object-contain group-hover:scale-110 transition duration-500" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-brand-gold transition">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed text-base">
                {feature.description}
              </p>
              
              <div className="mt-6 flex items-center gap-2 text-brand-gold/50 group-hover:text-brand-gold transition duration-500">
                <CheckCircle2 size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">{t('common.verified')}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Projects Section */}
      <section className="py-24 bg-brand-black relative">
        <div className="max-w-7xl mx-auto px-4">
           <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 mb-4">
                   <TrendingUp size={14} className="text-brand-gold" />
                   <span className="text-[10px] font-bold text-brand-gold uppercase tracking-tighter">Live Market</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-4 text-white tracking-tight">{t('home.latestOpportunities')}</h2>
                <p className="text-gray-400 text-lg max-w-2xl">{t('home.latestOpportunitiesDesc')}</p>
              </div>
              <Link to="/projects" className="group flex items-center gap-3 text-brand-gold hover:text-white transition-all font-black text-lg">
                 <span>{t('home.viewAllProjects')}</span>
                 <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center group-hover:bg-brand-gold group-hover:text-black transition duration-300">
                   <ArrowRight size={20} className={lang === 'ar' ? 'rotate-180' : ''} />
                 </div>
              </Link>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {homeData.latest_opportunities.map(opportunity => (
                <Link 
                  to="/projects/$id" 
                  params={{ id: opportunity.id.toString() }} 
                  key={opportunity.id} 
                  className="group glass-card border-white/10 hover:border-brand-gold/50 rounded-2xl overflow-hidden transition-all duration-500 hover-scale block relative shadow-2xl hover:shadow-brand-gold/10"
                >
                   {/* Image Cap */}
                   <div className="h-64 w-full relative overflow-hidden">
                     <img 
                       src={opportunity.image} 
                       onError={(e) => { const target = e.target as HTMLImageElement; target.onerror = null; target.src = FALLBACK_IMAGE; }}
                       alt={opportunity.company_name} 
                       className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" 
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/20 to-transparent opacity-80"></div>
                     
                     <div className="absolute top-4 left-4">
                        <span className="backdrop-blur-md bg-black/40 text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/10 uppercase tracking-widest">
                           {opportunity.opportunity_number}
                        </span>
                     </div>

                     <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                        <span className="text-[10px] font-black text-black bg-brand-gold px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg">
                          {opportunity.category.name}
                        </span>
                        <div className="flex gap-1">
                           <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse"></div>
                           <span className="text-[10px] font-bold text-white uppercase tracking-widest">{opportunity.status.label}</span>
                        </div>
                     </div>
                   </div>

                   <div className="p-6 relative z-10">
                       <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-brand-gold transition line-clamp-1">
                         {opportunity.company_name}
                       </h3>
                       <p className="text-gray-400 text-sm mb-6 font-medium tracking-wide">
                         {opportunity.goal.label}
                       </p>
                       
                       <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                          <div className="flex flex-col gap-1">
                             <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{t('common.capital')}</span>
                             <Money value={opportunity.investment_required} className="text-lg font-black text-white font-sans" />
                          </div>
                          <div className="flex flex-col gap-1 items-end">
                             <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{t('common.share')}</span>
                             <span className="text-lg font-black text-brand-gold font-sans">
                               {opportunity.sale_percentage ?? 0}%
                             </span>
                          </div>
                       </div>
                   </div>
                </Link>
              ))}
           </div>
        </div>
      </section>

      {/* Categories Scroller */}
      <section className="py-24 bg-brand-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-gold/5 blur-[150px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">{t('common.exploreSectors')}</h2>
            <div className="w-24 h-1 bg-brand-gold mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {homeData.sections.map((section) => (
              <Link 
                to="/projects" 
                search={{ cat: String(section.id) }} 
                key={section.id} 
                className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-brand-black border border-white/5 hover:border-brand-gold/50 transition-all duration-500 flex flex-col items-center justify-center p-6 text-center hover:shadow-2xl hover:shadow-brand-gold/5"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition duration-500 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-gold/10 group-hover:scale-110 transition duration-500 border border-white/5">
                     <span className="text-2xl font-black text-brand-gold/30 group-hover:text-brand-gold transition">{section.name.charAt(0)}</span>
                  </div>
                  <div>
                    <span className="text-xl font-bold text-gray-200 group-hover:text-white transition block mb-1">
                      {section.name}
                    </span>
                    <span className="text-xs text-brand-gold/60 font-black group-hover:text-brand-gold transition font-sans tracking-widest uppercase">
                      {section.opportunities_count} {t('common.opportunities')}
                    </span>
                  </div>
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-gold/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link to="/categories" className="inline-flex items-center gap-2 text-brand-gold hover:text-white transition-all font-bold text-lg border-b-2 border-brand-gold/20 hover:border-brand-gold pb-1">
              <span>{t('common.viewAllCategories')}</span>
              <ArrowRight size={20} className={lang === 'ar' ? 'rotate-180' : ''} />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-20 bg-brand-black">
        <div className="max-w-5xl mx-auto px-4 text-center">
           <div className="glass-card p-12 rounded-[40px] border-white/5 shadow-inner">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-tight">
                {lang === 'en' ? 'Ready to explore the next big opportunity?' : 'هل أنت مستعد لاستكشاف الفرصة الكبيرة التالية؟'}
              </h2>
              <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
                {homeData.project_brief}
              </p>
              <div className="flex flex-wrap justify-center gap-8">
                 <div className="flex items-center gap-3">
                    <Shield className="text-brand-gold" />
                    <span className="font-bold text-white">Verified</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <Shield className="text-brand-gold" />
                    <span className="font-bold text-white">Secure</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <Shield className="text-brand-gold" />
                    <span className="font-bold text-white">Anonymous</span>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};
