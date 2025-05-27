interface BackgroundDecorProps {
  showVines?: boolean;
  showTree?: boolean;
  className?: string; // Optional for extra styling like animation etc.
}

export default function BackgroundDecor({
  showVines = true,
  showTree = true,
  className = '',
}: BackgroundDecorProps) {
  return (
    <div className={`absolute inset-0 z-0 pointer-events-none ${className}`}>
      {showTree && (
        <img
          src="/tree.svg.png"
          alt="Tree of Life"
          className="absolute bottom-0 right-0 w-64 opacity-20"
        />
      )}
      {showVines && (
        <img
          src="/vines.svg.png"
          alt="Decorative vines"
          className="absolute top-0 left-0 w-48 opacity-30"
        />
      )}
    </div>
  );
}
