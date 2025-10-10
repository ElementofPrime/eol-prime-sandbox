export default function BackgroundDecor({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none -z-10 ${className}`}>
      <img
        src="/vines.svg.png"
        alt=""
        className="absolute top-6 left-[min(2rem,4vw)] w-36 sm:w-44 md:w-52 opacity-20 dark:opacity-25"
      />
      <img
        src="/tree.svg.png"
        alt=""
        className="absolute bottom-10 right-[min(2rem,4vw)] w-40 sm:w-48 md:w-56 opacity-18 dark:opacity-24"
      />
    </div>
  );
}
