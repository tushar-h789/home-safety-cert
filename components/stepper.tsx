import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface StepperProps {
  activeStep: number;
  steps: Array<{ label: string; link: string; disabled?: boolean }>;
  paymentCompleted: boolean;
}

export default function Stepper({
  activeStep,
  steps,
  paymentCompleted,
}: StepperProps) {
  const router = useRouter();

  const handleCircleClick = () => {
    if (activeStep > 1) {
      router.push(steps[activeStep - 2].link);
    }
  };

  return (
    <div className="py-8">
      {/* Mobile Stepper */}
      <div className="sm:hidden px-4">
        <div className="flex items-center justify-between">
          <div
            className="relative w-20 h-20 cursor-pointer"
            onClick={handleCircleClick}
            aria-label="Go to previous step"
          >
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#E6E6E6"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                strokeDasharray={`${(activeStep / steps.length) * 283}, 283`}
                className="text-primary"
                transform="rotate(-90 50 50)"
              />
              <text
                x="50"
                y="50"
                dy="0.35em"
                textAnchor="middle"
                fill="currentColor"
                className="text-2xl font-semibold"
              >
                {activeStep} of {steps.length}
              </text>
            </svg>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xl font-semibold text-gray-800">
              {steps[activeStep - 1]?.label}
            </span>
            {activeStep < steps.length ? (
              <Link
                href={steps[activeStep].link}
                className="text-sm text-primary hover:underline"
              >
                Next: {steps[activeStep]?.label}
              </Link>
            ) : (
              <span className="text-sm text-gray-500">Completed</span>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Stepper */}
      <div className="hidden sm:flex items-center justify-center">
        <div className="flex w-full max-w-3xl items-center justify-between">
          {steps.map((step, index) => {
            const isActive = index + 1 === activeStep;
            const isCompleted =
              index + 1 < activeStep ||
              (index + 1 === activeStep && paymentCompleted);
            const isLastStep = index === steps.length - 1;

            return (
              <React.Fragment key={index}>
                {step.disabled && !isCompleted ? (
                  <div className="flex flex-col items-center opacity-50 cursor-not-allowed">
                    <div
                      className={`relative flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-muted-foreground`}
                    >
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <span className="mt-2 text-sm font-medium">
                      {step.label}
                    </span>
                  </div>
                ) : (
                  <Link
                    href={step.link}
                    className={`flex flex-col items-center group ${
                      step.disabled ? 'pointer-events-none' : ''
                    }`}
                  >
                    <div
                      className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                        isCompleted
                          ? "bg-primary text-white"
                          : isActive
                          ? "bg-primary text-white"
                          : "bg-primary/20 text-muted-foreground"
                      } group-hover:bg-primary group-hover:text-white transition-all`}
                    >
                      {isCompleted ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <span className="mt-2 text-sm font-medium group-hover:text-primary transition-all">
                      {step.label}
                    </span>
                  </Link>
                )}
                {!isLastStep && (
                  <div
                    className={`h-1 flex-1 ${
                      isCompleted ? "bg-primary" : "bg-primary/20 rounded-full"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}