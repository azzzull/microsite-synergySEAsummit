

export const Footer = () => (
  <footer className="w-full py-8 px-4 bg-[var(--color-navy-dark)] text-[var(--color-lightgrey)]">
    <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center sm:items-center gap-6">
      {/* Left: Logo & Text in separate columns */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4">
        {/* Logo Column */}
        <div className="flex-shrink-0">
          <img 
            src="/synergyseasummitlogo.png" 
            alt="Synergy SEA Summit Logo" 
            className="h-20 sm:h-26 w-auto"
          />
        </div>
        
        {/* Text Column */}
        <div className="flex flex-col items-center sm:items-start">
          <div className="font-bold text-lg sm:text-xl tracking-wide mb-1 text-center sm:text-left">Synergy SEA Summit 2025</div>
          <div className="text-xs sm:text-sm text-center sm:text-left">&copy; {new Date().getFullYear()} Synergy SEA Summit. All rights reserved.</div>
        </div>
      </div>
      
      {/* Right: Navigation Links */}
      <nav className="w-full sm:w-auto">
        {/* Mobile: 2 columns - left column left-aligned, right column right-aligned */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 sm:hidden max-w-xs mx-auto">
          <a href="/" className="navbar-link transition-colors duration-200 cursor-pointer hover:text-[var(--color-gold)] text-left">Home</a>
          <a href="/hall-of-fame" className="navbar-link transition-colors duration-200 cursor-pointer hover:text-[var(--color-gold)] text-right">Hall of Fame</a>
          <a href="/location" className="navbar-link transition-colors duration-200 cursor-pointer hover:text-[var(--color-gold)] text-left">Location</a>
          <a href="/register" className="navbar-link transition-colors duration-200 cursor-pointer hover:text-[var(--color-gold)] text-right">Register</a>
        </div>
        
        {/* Desktop: vertical stack */}
        <div className="hidden sm:flex flex-col gap-2 items-end">
          <a href="/" className="navbar-link transition-colors duration-200 cursor-pointer hover:text-[var(--color-gold)]">Home</a>
          <a href="/hall-of-fame" className="navbar-link transition-colors duration-200 cursor-pointer hover:text-[var(--color-gold)]">Hall of Fame</a>
          <a href="/location" className="navbar-link transition-colors duration-200 cursor-pointer hover:text-[var(--color-gold)]">Location</a>
          <a href="/register" className="navbar-link transition-colors duration-200 cursor-pointer hover:text-[var(--color-gold)]">Register</a>
        </div>
      </nav>
    </div>
  </footer>
);
