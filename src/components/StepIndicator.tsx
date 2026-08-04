interface StepIndicatorProps {
  currentStep: number; // 1, 2, or 3
}

const steps = [
  { number: 1, label: "DELIVERY" },
  { number: 2, label: "PAYMENT" },
  { number: 3, label: "CONFIRMATION" },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="step-indicator">
      {steps.map((step, index) => {
        const isActive = step.number === currentStep;
        const isCompleted = step.number < currentStep;
        const circleClass = isActive || isCompleted ? "active" : "inactive";
        const labelClass = isActive ? "active" : "inactive";

        return (
          <div key={step.number} style={{ display: "flex", alignItems: "center" }}>
            <div className="step-item">
              <div className={`step-circle ${circleClass}`}>
                {isCompleted ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3.5 3.5L13 4.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span className={`step-label ${labelClass}`}>{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`step-connector ${isCompleted ? "completed" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
