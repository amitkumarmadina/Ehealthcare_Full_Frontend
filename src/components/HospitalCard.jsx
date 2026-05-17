import React, { useState, useEffect, useRef } from 'react';
import { Star, StarHalf, ChevronLeft, ChevronRight, MapPin, ShieldCheck, Sparkles } from 'lucide-react';

const HospitalCard = ({ hospital, onSelect, isSelected }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = hospital.images?.length > 0 ? hospital.images : [hospital.image || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600"];
  
  const carouselRef = useRef(null);

  // Auto-slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [images.length]);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const renderStars = (rating) => {
    if (!rating) return <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-widest">New</span>;
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} size={12} className="text-yellow-400 fill-current" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarHalf key={i} size={12} className="text-yellow-400 fill-current" />);
      } else {
        stars.push(<Star key={i} size={12} className="text-gray-200 fill-current" />);
      }
    }
    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="text-[10px] font-black text-gray-400 ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <div 
      onClick={() => onSelect(hospital)}
      className={`group relative bg-white rounded-[32px] border-2 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-full ${
        isSelected ? 'border-indigo-600 shadow-2xl shadow-indigo-100 scale-[1.02]' : 'border-gray-50 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1'
      }`}
    >
      {/* IMAGE CAROUSEL SECTION */}
      <div className="relative h-64 overflow-hidden">
        <div 
          className="flex h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              loading="lazy"
              alt={`${hospital.name} view ${idx + 1}`}
              className="w-full h-full object-cover flex-shrink-0"
            />
          ))}
        </div>
        
        {/* OVERLAYS */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        
        {/* CAROUSEL CONTROLS */}
        {images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 backdrop-blur-lg text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/40"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 backdrop-blur-lg text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/40"
            >
              <ChevronRight size={20} />
            </button>
            {/* DOT INDICATORS */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, idx) => (
                <div 
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    idx === currentImageIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* TOP BADGE */}
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-2 shadow-sm border border-white">
            <ShieldCheck size={14} className="text-indigo-600" />
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-700">Verified</span>
          </div>
        </div>
      </div>

      {/* CONTENT MIDDLE SECTION */}
      <div className="p-6 flex-1 flex flex-col gap-4">
        <div className="space-y-1">
          <div className="flex justify-between items-start">
            <h3 className="font-black text-xl text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">
              {hospital.name}
            </h3>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin size={12} className="text-indigo-500" />
              <span className="text-xs font-bold">{hospital.city}</span>
            </div>
            {renderStars(hospital.rating)}
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="mt-auto space-y-4">
          <p className="text-xs text-gray-500 font-medium leading-relaxed truncate opacity-80">
            {hospital.address || "Modern medical facilities with expert care."}
          </p>

          <button 
            className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
              isSelected 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                : 'bg-gray-50 text-gray-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-xl group-hover:shadow-indigo-50'
            }`}
          >
            {isSelected ? (
              <>Selected Facility <ShieldCheck size={14} /></>
            ) : (
              <>Book Appointment <Sparkles size={14} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HospitalCard;
