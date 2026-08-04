export default function DHLLogo({ height = 48 }: { height?: number }) {
  return (
    <svg
      height={height}
      viewBox="0 0 200 60"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="DHL Express"
    >
      {/* D */}
      <path
        d="M0 8 H18 C32 8 38 16 38 30 C38 44 32 52 18 52 H0 Z M12 18 L12 42 H17 C24 42 26 38 26 30 C26 22 24 18 17 18 Z"
        fill="#D40511"
      />
      {/* H */}
      <path
        d="M44 8 H56 V26 H70 V8 H82 V52 H70 V36 H56 V52 H44 Z"
        fill="#D40511"
      />
      {/* L */}
      <path
        d="M88 8 H100 V42 H118 V52 H88 Z"
        fill="#D40511"
      />
      {/* Express lines */}
      <rect x="0" y="56" width="200" height="2" fill="#D40511" opacity="0.3" rx="1" />
      <rect x="0" y="59" width="200" height="1.5" fill="#D40511" opacity="0.2" rx="1" />
      {/* EXPRESS text */}
      <text x="130" y="38" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="800" fill="#D40511" letterSpacing="2">EXPRESS</text>
    </svg>
  );
}
