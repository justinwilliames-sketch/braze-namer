export default function Flame({
  className = "w-8 h-8",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M16 4.5c1.2 3.1 0 5.3-1.6 7.2-1.8 2.2-4 4-4 7.6 0 4.3 3.2 7.2 6.6 7.2 3.6 0 6.8-2.8 6.8-7.1 0-3-1.8-5-3.2-7 1 .5 2.4 1.7 3.2 3.1-.2-5.2-4.6-8.5-7.8-11Z"
        fill="currentColor"
      />
    </svg>
  );
}
