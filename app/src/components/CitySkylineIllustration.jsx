import React from "react";

const CitySkylineIllustration = ({ className }) => {
  const baseClasses = "absolute bottom-0 left-0 w-full h-120 pointer-events-none select-none overflow-hidden";
  const containerClasses = className ? `${baseClasses} ${className}` : baseClasses;

  return (
    <div className={containerClasses}>
      <svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax slice" className="w-full h-full opacity-70">
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
          <pattern id="windows-kio" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
             <rect x="2" y="2" width="12" height="4" fill="#e0e7ff" opacity="0.4" />
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

        {/* CAPA 1: Sierra de Madrid (Colinas al fondo) */}
        <path d="M0,300 L0,180 Q150,150 300,190 T700,160 T1200,180 L1200,300 Z" fill="#c7d2fe" opacity="0.2" />

        {/* CAPA 2: Rascacielos Distantes (Bloques genéricos de relleno) */}
        <g fill="url(#grad-back)">
          <rect x="80" y="120" width="70" height="180" />
          <polygon points="180,300 180,100 200,80 220,100 220,300" />
          <rect x="350" y="130" width="90" height="170" />
          <rect x="520" y="140" width="80" height="160" />
          <polygon points="920,300 920,110 950,90 980,110 980,300" />
          <rect x="1050" y="120" width="80" height="180" />
        </g>

        {/* CAPA 3: Edificios Medios y Pirulí */}
        <g fill="url(#grad-mid)">
          {/* Edificio España (Escalonado) */}
          <rect x="30" y="120" width="60" height="170" />
          <rect x="15" y="170" width="15" height="120" />
          <rect x="90" y="170" width="15" height="120" />

          {/* Bloques genéricos */}
          <rect x="320" y="160" width="70" height="140" />
          <polygon points="500,300 500,140 540,110 580,140 580,300" />
          <rect x="980" y="150" width="80" height="150" />
          <rect x="1100" y="130" width="70" height="170" />

          {/* El Pirulí (Torrespaña) */}
          <rect x="445" y="100" width="10" height="190" />
          <polygon points="435,100 465,100 455,120 445,120" />
          <ellipse cx="450" cy="95" rx="25" ry="8" />
          <line x1="450" y1="95" x2="450" y2="40" stroke="url(#grad-mid)" strokeWidth="3" />
          <circle cx="450" cy="40" r="3" fill="#ef4444" className="animate-pulse" />
        </g>

        {/* CAPA 4: ICONOS FRONTALES DE MADRID */}
        <g fill="url(#grad-front)">
          
          {/* 1. TORRES KIO (Plaza Castilla) */}
          {/* Torre Izquierda (Se inclina hacia la derecha) */}
          <polygon points="120,290 180,290 220,130 160,130" />
          <polygon points="120,290 180,290 220,130 160,130" fill="url(#windows-kio)" />
          {/* Torre Derecha (Se inclina hacia la izquierda) */}
          <polygon points="280,290 340,290 300,130 240,130" />
          <polygon points="280,290 340,290 300,130 240,130" fill="url(#windows-kio)" />

          {/* 2. CUATRO TORRES BUSINESS AREA */}
          
          {/* Torre Emperador (Curva superior) */}
          <path d="M540,290 L600,290 L600,100 Q565,50 540,50 Z" />
          <path d="M540,290 L600,290 L600,100 Q565,50 540,50 Z" fill="url(#windows1)" />

          {/* Torre de Cristal (La más alta, cúpula en diamante) */}
          <polygon points="620,290 680,290 680,70 650,30 620,60" />
          <polygon points="620,290 680,290 680,70 650,30 620,60" fill="url(#windows2)" />

          {/* Torre PwC (Cilíndrica/Rectangular perfecta) */}
          <rect x="700" y="60" width="60" height="230" />
          <rect x="700" y="60" width="60" height="230" fill="url(#windows1)" />

          {/* Torre Cepsa (Pilares y puentes) */}
          {/* Pilar izquierdo */}
          <rect x="780" y="50" width="15" height="240" />
          <rect x="780" y="50" width="15" height="240" fill="url(#windows2)" />
          {/* Pilar derecho */}
          <rect x="825" y="50" width="15" height="240" />
          <rect x="825" y="50" width="15" height="240" fill="url(#windows2)" />
          {/* Puentes (Arriba, Medio, Abajo) */}
          <rect x="795" y="50" width="30" height="20" />
          <rect x="795" y="50" width="30" height="20" fill="url(#windows1)" />
          
          <rect x="795" y="130" width="30" height="25" />
          <rect x="795" y="130" width="30" height="25" fill="url(#windows1)" />

          <rect x="795" y="210" width="30" height="80" />
          <rect x="795" y="210" width="30" height="80" fill="url(#windows1)" />

          {/* Torre Caleido (Forma de T invertida) */}
          <rect x="875" y="150" width="40" height="140" />
          <rect x="875" y="150" width="40" height="140" fill="url(#windows2)" />
          <rect x="860" y="250" width="70" height="40" />
          <rect x="860" y="250" width="70" height="40" fill="url(#windows1)" />
        </g>

        {/* CAPA 5: Arboleda de la Castellana */}
        <g fill="#111827" opacity="0.95">
          <circle cx="110" cy="285" r="18" /> <circle cx="130" cy="280" r="24" /> <circle cx="155" cy="285" r="16" />
          <circle cx="400" cy="280" r="20" /> <circle cx="425" cy="285" r="15" />
          <circle cx="680" cy="285" r="18" /> <circle cx="705" cy="275" r="26" /> <circle cx="735" cy="285" r="18" />
          <circle cx="950" cy="280" r="22" /> <circle cx="975" cy="285" r="15" />
        </g>

        {/* CAPA 6: M-30 / Carretera y Farolas */}
        <rect x="0" y="290" width="1200" height="10" fill="#020617" />
        <line x1="0" y1="295" x2="1200" y2="295" stroke="#fbbf24" strokeDasharray="15,15" strokeWidth="1" opacity="0.5" />
        
        <g stroke="#334155" strokeWidth="2" fill="none">
          <path d="M60,290 L60,265 Q70,265 70,270" />
          <circle cx="70" cy="270" r="2.5" fill="#fef08a" stroke="none" filter="drop-shadow(0 0 3px rgba(254,240,138,0.8))" />
          <path d="M480,290 L480,265 Q490,265 490,270" />
          <circle cx="490" cy="270" r="2.5" fill="#fef08a" stroke="none" filter="drop-shadow(0 0 3px rgba(254,240,138,0.8))" />
          <path d="M1050,290 L1050,265 Q1060,265 1060,270" />
          <circle cx="1060" cy="270" r="2.5" fill="#fef08a" stroke="none" filter="drop-shadow(0 0 3px rgba(254,240,138,0.8))" />
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