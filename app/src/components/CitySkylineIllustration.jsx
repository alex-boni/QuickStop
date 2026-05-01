import React from "react";

const CitySkylineIllustration = ({ className }) => {
  // Clases por defecto que combinamos con las que se le pasen por props
  const baseClasses = "absolute bottom-0 left-0 w-full h-80 pointer-events-none select-none overflow-hidden";
  const containerClasses = className ? `${baseClasses} ${className}` : baseClasses;

  return (
    <div className={containerClasses}>
      <svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax slice" className="w-full h-full opacity-80">
        <defs>
          {/* Patrones de ventanas */}
          <pattern id="windows1" width="16" height="20" patternUnits="userSpaceOnUse">
            <rect x="2" y="2" width="4" height="6" fill="#fef08a" opacity="0.9" />
            <rect x="10" y="2" width="4" height="6" fill="#e0e7ff" opacity="0.2" />
            <rect x="2" y="12" width="4" height="6" fill="#e0e7ff" opacity="0.1" /> 
            <rect x="10" y="12" width="4" height="6" fill="#fef08a" opacity="0.6" />
          </pattern>
          <pattern id="windows2" width="24" height="12" patternUnits="userSpaceOnUse">
            <rect x="2" y="2" width="20" height="4" fill="#e0e7ff" opacity="0.3" />
          </pattern>

          {/* Degradados */}
          <linearGradient id="grad-back" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#4338ca" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="grad-mid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#312e81" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="grad-front" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3730a3" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* CAPA 1: Colinas */}
        <path d="M0,300 L0,180 Q200,140 400,190 T900,160 T1200,190 L1200,300 Z" fill="#c7d2fe" opacity="0.2" />

        {/* CAPA 2: Rascacielos Distantes */}
        <g fill="url(#grad-back)">
          <rect x="80" y="100" width="70" height="200" />
          <polygon points="180,300 180,80 200,60 220,80 220,300" />
          <rect x="250" y="130" width="90" height="170" />
          <rect x="400" y="70" width="60" height="230" />
          <line x1="430" y1="70" x2="430" y2="20" stroke="url(#grad-back)" strokeWidth="2" />
          <rect x="520" y="140" width="110" height="160" />
          <polygon points="700,300 700,90 730,90 730,300" />
          <rect x="800" y="110" width="80" height="190" />
          <rect x="950" y="60" width="70" height="240" />
          <polygon points="1050,300 1050,110 1080,90 1110,110 1110,300" />
        </g>

        {/* CAPA 3: Edificios Medios */}
        <g fill="url(#grad-mid)">
          <rect x="30" y="150" width="60" height="150" />
          <rect x="130" y="100" width="80" height="200" />
          <polygon points="130,100 170,70 210,100" />
          <rect x="320" y="160" width="70" height="140" />
          <rect x="450" y="110" width="90" height="190" />
          
          <rect x="600" y="80" width="70" height="220" />
          <line x1="635" y1="80" x2="635" y2="30" stroke="url(#grad-mid)" strokeWidth="4" />
          <circle cx="635" cy="30" r="3" fill="#ef4444" className="animate-pulse" />
          
          <rect x="730" y="140" width="100" height="160" />
          <rect x="880" y="150" width="80" height="150" />
          <rect x="1100" y="130" width="70" height="170" />
        </g>

        {/* CAPA 4: Edificios Frontales */}
        <g fill="url(#grad-front)">
          <rect x="-10" y="180" width="100" height="120" />
          <rect x="-10" y="180" width="100" height="120" fill="url(#windows2)" />
          
          <rect x="170" y="120" width="100" height="180" />
          <rect x="170" y="120" width="100" height="180" fill="url(#windows1)" />
          
          <rect x="360" y="170" width="120" height="130" />
          <rect x="360" y="170" width="120" height="130" fill="url(#windows2)" />
          
          <polygon points="530,300 530,90 610,120 610,300" />
          <polygon points="530,300 530,90 610,120 610,300" fill="url(#windows1)" opacity="0.7"/>

          <rect x="780" y="130" width="120" height="170" />
          <rect x="780" y="130" width="120" height="170" fill="url(#windows1)" />
          
          <rect x="1000" y="160" width="110" height="140" />
          <rect x="1000" y="160" width="110" height="140" fill="url(#windows2)" />
        </g>

        {/* CAPA 5: Arboleda */}
        <g fill="#111827" opacity="0.95">
          <circle cx="110" cy="285" r="18" /> <circle cx="130" cy="280" r="24" /> <circle cx="155" cy="285" r="16" />
          <circle cx="300" cy="280" r="20" /> <circle cx="325" cy="285" r="15" />
          <circle cx="680" cy="285" r="18" /> <circle cx="705" cy="275" r="26" /> <circle cx="735" cy="285" r="18" />
          <circle cx="950" cy="280" r="22" /> <circle cx="975" cy="285" r="15" />
        </g>

        {/* CAPA 6: Carretera y Farolas */}
        <rect x="0" y="290" width="1200" height="10" fill="#020617" />
        <line x1="0" y1="295" x2="1200" y2="295" stroke="#fbbf24" strokeDasharray="15,15" strokeWidth="1" opacity="0.5" />
        
        <g stroke="#334155" strokeWidth="2" fill="none">
          <path d="M60,290 L60,265 Q70,265 70,270" />
          <circle cx="70" cy="270" r="2.5" fill="#fef08a" stroke="none" filter="drop-shadow(0 0 3px rgba(254,240,138,0.8))" />
          <path d="M420,290 L420,265 Q430,265 430,270" />
          <circle cx="430" cy="270" r="2.5" fill="#fef08a" stroke="none" filter="drop-shadow(0 0 3px rgba(254,240,138,0.8))" />
          <path d="M800,290 L800,265 Q810,265 810,270" />
          <circle cx="810" cy="270" r="2.5" fill="#fef08a" stroke="none" filter="drop-shadow(0 0 3px rgba(254,240,138,0.8))" />
        </g>

        {/* CAPA 7: Tráfico */}
        <g className="animate-traffic-slow">
          <rect x="1300" y="292" width="18" height="5" rx="2" fill="#ef4444" />
          <rect x="1750" y="292" width="22" height="6" rx="2" fill="#6366f1" />
          <rect x="2200" y="293" width="16" height="4" rx="1" fill="#cbd5e1" />
        </g>
        <g className="animate-traffic-fast">
          <rect x="1500" y="293" width="15" height="4" rx="1.5" fill="#fbbf24" />
          <rect x="2000" y="292" width="20" height="5" rx="2" fill="#10b981" />
          <rect x="2500" y="292" width="18" height="5" rx="2" fill="#ef4444" />
        </g>
      </svg>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes moveTraffic {
          from { transform: translateX(0); }
          to { transform: translateX(-3000px); }
        }
        .animate-traffic-slow {
          animation: moveTraffic 25s linear infinite;
        }
        .animate-traffic-fast {
          animation: moveTraffic 16s linear infinite;
        }
      `}} />
    </div>
  );
};

export default CitySkylineIllustration;