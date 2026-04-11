
import React, { useMemo } from 'react';
import { useStore } from '../context/Store';
import { TRANSLATIONS, CATEGORIES, FALLBACK_IMAGE } from '../constants';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Users, ArrowRight } from 'lucide-react';
import { Money } from '../components/Money';

export const Home: React.FC = () => {
  const { lang, projects, isPubliclyVisible } = useStore();
  const t = TRANSLATIONS[lang];

  // Logic to get latest 4 projects
  const latestProjects = useMemo(() => {
    return projects
      .filter(p => isPubliclyVisible(p))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4);
  }, [projects, isPubliclyVisible]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-brand-black">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800/30 via-black to-black"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
            {t.hero.title}
          </h1>
          <p className="text-lg md:text-2xl text-gray-400 mb-10 font-light">
            {t.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/projects" className="bg-brand-gold text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-500 transition shadow-lg shadow-brand-gold/20">
              {t.hero.cta}
            </Link>
            <Link to="/register-type" className="px-8 py-4 rounded-full font-bold text-lg border border-white/30 hover:bg-white/10 transition backdrop-blur-sm">
              {t.nav.register}
            </Link>
          </div>
        </div>
      </div>

      {/* Latest Projects Section */}
      <div className="py-20 bg-brand-black border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4">
           <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-2 text-white">{lang === 'en' ? 'Latest Opportunities' : 'أحدث الفرص'}</h2>
                <p className="text-gray-400">{lang === 'en' ? 'Fresh investment listings vetted by our experts.' : 'قوائم استثمار جديدة تم فحصها من قبل خبرائنا.'}</p>
              </div>
              <Link to="/projects" className="hidden md:flex items-center gap-2 text-brand-gold hover:text-white transition font-bold">
                 {lang === 'en' ? 'View All Projects' : 'عرض جميع المشاريع'} 
                 <ArrowRight size={20} className={lang === 'ar' ? 'rotate-180' : ''} />
              </Link>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestProjects.map(project => (
                <Link to={`/projects/${project.id}`} key={project.id} className="group bg-brand-gray/30 border border-white/10 hover:border-brand-gold/50 rounded-xl overflow-hidden transition-all hover:-translate-y-1 block relative shadow-lg hover:shadow-brand-gold/5">
                   {/* Image Cap */}
                   <div className="h-48 w-full relative overflow-hidden">
                     <img 
                       src={project.image} 
                       onError={(e) => { const target = e.target as HTMLImageElement; target.onerror = null; target.src = FALLBACK_IMAGE; }}
                       alt={project.name[lang]} 
                       className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-brand-gray/90 to-transparent"></div>
                     <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                        <span className="text-[10px] font-bold text-black bg-brand-gold px-2 py-1 rounded uppercase tracking-widest">{project.category[lang]}</span>
                     </div>
                   </div>

                   <div className="p-5 relative z-10">
                       <h3 className="text-lg font-bold mb-2 text-white group-hover:text-brand-gold transition line-clamp-1">{project.name[lang]}</h3>
                       <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">{project.descriptionShort[lang]}</p>
                       
                       <div className="space-y-3 pt-4 border-t border-white/5">
                          <div className="flex justify-between items-center text-sm">
                             <span className="text-gray-500">{lang === 'en' ? 'Capital' : 'رأس المال'}</span>
                             <Money value={project.capital} className="font-semibold text-gray-200 font-sans" />
                          </div>
                          <div className="flex justify-between items-center text-sm">
                             <span className="text-gray-500">{lang === 'en' ? 'Share' : 'الحصة'}</span>
                             <span className="font-semibold text-brand-gold font-sans">{project.shareOffered}%</span>
                          </div>
                       </div>
                   </div>
                </Link>
              ))}
           </div>

           <div className="mt-8 md:hidden flex justify-center">
              <Link to="/projects" className="flex items-center gap-2 text-brand-gold hover:text-white transition font-bold">
                 {lang === 'en' ? 'View All Projects' : 'عرض جميع المشاريع'} 
                 <ArrowRight size={20} className={lang === 'ar' ? 'rotate-180' : ''} />
              </Link>
           </div>
        </div>
      </div>

      {/* Stats / Trust Section */}
      <div className="bg-brand-dark py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <Shield className="w-12 h-12 text-brand-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">{lang === 'en' ? 'Identity Protection' : 'حماية الهوية'}</h3>
            <p className="text-gray-400 text-sm">{lang === 'en' ? 'Anonymous browsing until interest is confirmed.' : 'تصفح مجهول حتى تأكيد الاهتمام.'}</p>
          </div>
          <div className="p-6">
            <TrendingUp className="w-12 h-12 text-brand-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">{lang === 'en' ? 'Verified Deals' : 'صفقات موثقة'}</h3>
            <p className="text-gray-400 text-sm">{lang === 'en' ? 'All projects undergo strict admin review.' : 'تخضع جميع المشاريع لمراجعة إدارية صارمة.'}</p>
          </div>
          <div className="p-6">
            <Users className="w-12 h-12 text-brand-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">{lang === 'en' ? 'Direct Connection' : 'اتصال مباشر'}</h3>
            <p className="text-gray-400 text-sm">{lang === 'en' ? 'We bridge the gap between capital and opportunity.' : 'نحن نسد الفجوة بين رأس المال والفرصة.'}</p>
          </div>
        </div>
      </div>

      {/* Categories Scroller */}
      <div className="py-20 max-w-7xl mx-auto px-4 w-full">
        <h2 className="text-3xl font-bold mb-10 text-center">{lang === 'en' ? 'Explore Sectors' : 'استكشف القطاعات'}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {CATEGORIES.slice(0, 10).map((cat, idx) => {
            const count = projects.filter(p => p.category.en === cat.en && p.status === 'active').length;
            return (
              <Link to={`/projects?cat=${cat.en}`} key={idx} className="group relative overflow-hidden rounded-xl aspect-square bg-brand-gray border border-white/5 hover:border-brand-gold/50 transition flex items-center justify-center p-4 text-center">
                <div className="relative z-10 flex flex-col items-center">
                  <span className="font-semibold text-gray-300 group-hover:text-white transition">{cat[lang]}</span>
                  <span className="text-xs text-gray-500 mt-2 font-medium group-hover:text-brand-gold transition font-sans">({count})</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
              </Link>
            );
          })}
        </div>
        <div className="text-center mt-12">
          <Link to="/categories" className="text-brand-gold hover:underline underline-offset-4">
            {lang === 'en' ? 'View All Categories' : 'عرض جميع الفئات'}
          </Link>
        </div>
      </div>
    </div>
  );
};
