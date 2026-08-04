import { useState } from "react";
import DeliveryPage from "./pages/DeliveryPage";
import PaymentPage from "./pages/PaymentPage";
import OTPPage from "./pages/OTPPage";

type Step = "delivery" | "payment" | "otp" | "success";

interface DeliveryData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

interface PaymentData {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export default function App() {
  const [step, setStep] = useState<Step>("delivery");
  const [_deliveryData, setDeliveryData] = useState<DeliveryData | null>(null);
  const [_paymentData, setPaymentData] = useState<PaymentData | null>(null);

  const handleDeliveryNext = (data: DeliveryData) => {
    setDeliveryData(data);
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaymentNext = (data: PaymentData) => {
    setPaymentData(data);
    setStep("otp");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOTPSuccess = () => {
    setStep("success");
  };

  return (
    <div style={{ fontFamily: "'Inter', Arial, sans-serif" }}>
      {step === "delivery" && (
        <DeliveryPage onNext={handleDeliveryNext} />
      )}
      {step === "payment" && (
        <PaymentPage onNext={handlePaymentNext} />
      )}
      {(step === "otp" || step === "success") && (
        <OTPPage onSuccess={handleOTPSuccess} />
      )}
    </div>
  );
}
