

export const Footer = () => (
  <footer className="w-full py-8 px-4 bg-[var(--color-navy-dark)] text-[var(--color-lightgrey)]">
    <div className="container mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
      {/* Left: Logo & Copyright */}
      <div className="flex flex-col items-start">
        <div className="font-bold text-lg tracking-wide mb-2">Synergy SEA Summit 2025</div>
        <div className="text-xs">&copy; {new Date().getFullYear()} Synergy SEA Summit. All rights reserved.</div>
      </div>
      {/* Right: Navigation Links (stacked) */}
      <nav className="flex flex-col gap-2 justify-end w-full sm:w-auto items-end">
        <a href="/" className="navbar-link transition-colors duration-200 cursor-pointer hover:text-[var(--color-gold)]">Home</a>
        <a href="/hall-of-fame" className="navbar-link transition-colors duration-200 cursor-pointer hover:text-[var(--color-gold)]">Hall of Fame</a>
        <a href="/location" className="navbar-link transition-colors duration-200 cursor-pointer hover:text-[var(--color-gold)]">Location</a>
        <a href="/register" className="navbar-link transition-colors duration-200 cursor-pointer hover:text-[var(--color-gold)]">Register</a>
      </nav>
    </div>
  </footer>
);
