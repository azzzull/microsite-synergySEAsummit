
export const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-xl p-4 ${className}`} style={{background: "var(--color-navy-dark)", border: "none", color: "var(--color-navy)"}}>{children}</div>
);
