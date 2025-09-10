

export const Footer = () => (
  <footer className="w-full py-10 px-6 bg-[var(--color-navy-dark)] text-[var(--color-lightgrey)]">
    <div className="container mx-auto flex justify-center sm:justify-start items-center">
      {/* Logo & Text */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4">
        {/* Logo Column */}
        <div className="flex-shrink-0">
          <img 
            src="/synergyseasummitlogo.png" 
            alt="Synergy SEA Summit Logo" 
            className="h-20 sm:h-22 w-auto"
          />
        </div>
        
        {/* Text Column */}
        <div className="flex flex-col items-center sm:items-start">
          <div className="font-bold text-lg sm:text-xl tracking-wide mb-1 text-center sm:text-left">Synergy SEA Summit 2025</div>
          <div className="text-xs sm:text-sm text-center sm:text-left">&copy; {new Date().getFullYear()} Synergy SEA Summit. All rights reserved.</div>
        </div>
      </div>
    </div>
  </footer>
);
