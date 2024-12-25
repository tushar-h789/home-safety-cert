
const Stepper = ({ currentStep, handleStepChange, stepsCompleted  }: { currentStep: number, handleStepChange: (step: number) => void, stepsCompleted: number; }) => {
  const steps = [
    "Service Details",
    "Personal Details",
    "Confirmation",
    "Payment Details",
  ];

  // Labels for step numbers
  const stepLabels = ["First step", "Second step", "Third step", "Fourth step"];

  return (
    <div className="w-full">
    <div className="bg-white shadow-2xl p-6 rounded-md">
      <h3 className="text-xl font-semibold border-b pb-2 mb-8">
        Order Completion
      </h3>
      <ul className="flex flex-col space-y-5 relative">
        {steps.map((label, index) => (
          <li
            key={index}
            className={`relative flex items-start space-x-4 ${
              index > currentStep ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }`}
            onClick={() => {
              if (index <= stepsCompleted) {
                handleStepChange(index);
              } else {
                alert("Please complete the previous steps first.");
              }
            }}
          >
            <div className="flex flex-col items-center">
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                  index <= currentStep
                    ? "bg-green-500 text-white border-green-500"
                    : "border-gray-300"
                }`}
              >
                {index + 1}
              </span>

              {index < steps.length - 1 && <div className="w-px h-20 bg-gray-300"></div>}
            </div>

            <div>
              <div className="text-sm text-gray-500">{stepLabels[index]}</div>
              <div className={index <= currentStep ? "font-bold" : "text-gray-500"}>
                {label}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
};

export default Stepper;
