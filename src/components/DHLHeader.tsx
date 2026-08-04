const TRACKING_NUMBER = "DHLEX-7483921056";

export default function DHLHeader() {
  return (
    <>
      <div className="dhl-header">
        {/* Official DHL Express Logo reproduced as SVG */}
        <svg height="52" viewBox="0 0 260 56" xmlns="http://www.w3.org/2000/svg" aria-label="DHL Express">
          {/* D letter */}
          <path d="M2 4 H22 C40 4 48 16 48 28 C48 40 40 52 22 52 H2 Z M14 16 V40 H21 C30 40 33 36 33 28 C33 20 30 16 21 16 Z" fill="#D40511" />
          {/* H letter */}
          <path d="M54 4 H68 V24 H84 V4 H98 V52 H84 V34 H68 V52 H54 Z" fill="#D40511" />
          {/* L letter */}
          <path d="M104 4 H118 V40 H138 V52 H104 Z" fill="#D40511" />
          {/* Horizontal red stripes */}
          <rect x="144" y="4" width="114" height="6" rx="1" fill="#D40511" />
          <rect x="144" y="16" width="114" height="6" rx="1" fill="#D40511" />
          <rect x="144" y="28" width="114" height="6" rx="1" fill="#D40511" />
          <rect x="144" y="40" width="114" height="6" rx="1" fill="#D40511" />
          {/* EXPRESS text inside stripes area */}
          <text x="151" y="21" fontFamily="Arial Black, Arial, sans-serif" fontSize="11" fontWeight="900" fill="#FFCC00" letterSpacing="1.5">EXPRESS</text>
        </svg>
      </div>

      <div className="dhl-subheader">
        <span style={{ fontSize: 16 }}>📦</span>
        <span>Parcel awaiting customs clearance payment</span>
        <span style={{
          backgroundColor: "rgba(255,255,255,0.2)",
          border: "1px solid rgba(255,255,255,0.4)",
          borderRadius: 20,
          padding: "3px 12px",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.05em",
        }}>
          {TRACKING_NUMBER}
        </span>
      </div>
    </>
  );
}
