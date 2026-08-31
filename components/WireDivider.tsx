export default function WireDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`wire-divider ${className}`}
      viewBox="0 0 1200 28"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M0,14 C 100,2 150,26 250,14 C 350,2 400,26 500,14 C 600,2 650,26 750,14 C 850,2 900,26 1000,14 C 1080,4 1120,24 1200,14" />
    </svg>
  );
}
