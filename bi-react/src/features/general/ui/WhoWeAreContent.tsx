import React from "react";
import { useStore } from "../../../context/Store";
import { useWhoWeAre } from "../hooks/useWhoWeAre";

export const WhoWeAreContent: React.FC = () => {
  const { lang } = useStore();
  const { data: response, isLoading, isError } = useWhoWeAre();

  return (
    <div className="max-w-5xl mx-auto px-4 py-20">
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold"></div>
        </div>
      ) : isError ? (
        <div className="text-center py-20">
          <p className="text-red-500">
            {lang === "en"
              ? "Failed to load content. Please try again later."
              : "فشل تحميل المحتوى. يرجى المحاولة مرة أخرى لاحقاً."}
          </p>
        </div>
      ) : (
        <div className="space-y-16">
          {/* Header Section */}
          <div className="text-center space-y-6">
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              {response?.data?.whoWeAreSettings?.title}
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              {response?.data?.whoWeAreSettings?.description}
            </p>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {response?.data?.items?.map((item) => (
              <div 
                key={item.id}
                className="bg-brand-gray/20 border border-white/5 p-8 rounded-3xl backdrop-blur-sm hover:border-brand-gold/30 transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-brand-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <img src={item.image} alt={item.title} className="w-10 h-10 object-contain" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
