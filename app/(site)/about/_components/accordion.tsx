import React from "react";
import {
  Accordion as UiAccordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AccordionComponent: React.FC = () => {
  const accordion = [
    {
      id: "1",
      accordionQuestion: "What safety certifications do you offer?",
      accordionAnswer:
        "At Home Safety Cert, we offer a range of safety certifications for landlords and estate agents. Our services include Gas Safety Certificate (CP12), Electrical certification or periodic inspection, Energy Performance Certificate (EPC), PAT testing, Emergency Light Certificate, Fire Alarm Certificate, Fire Risk Assessment, and full compliance services for HMO landlords.",
    },
    {
      id: "2",
      accordionQuestion: "How long does it take to complete a safety certification?",
      accordionAnswer:
        "The duration of a safety certification inspection depends on the type of certification required and the size of the property. Typically, it takes between 1-3 hours to complete a certification inspection.",
    },
    {
      id: "3",
      accordionQuestion: "What is the cost of a safety certification?",
      accordionAnswer:
        "The cost of certification varies depending on the property size and type. Contact us for a detailed quote.",
    },
    {
      id: "4",
      accordionQuestion: "Do I need a safety certification for every property I own?",
      accordionAnswer:
        "Yes, each property you own will need its own safety certifications as per legal requirements.",
    },
    {
      id: "5",
      accordionQuestion: "What happens if I don't get a safety certification?",
      accordionAnswer:
        "Failure to get the necessary certifications can result in fines or legal actions. Additionally, tenants' safety may be at risk.",
    },
    {
      id: "6",
      accordionQuestion: "How do I book a safety certification with Home Safety Cert?",
      accordionAnswer:
        "You can book a safety certification with us by phone, email, or through our website. Our friendly team will guide you through the process and answer any questions you may have.",
    },
    {
      id: "7",
      accordionQuestion: "What happens during a safety certification inspection?",
      accordionAnswer:
        "A qualified professional will visit your property to perform various checks to ensure compliance with legal safety standards.",
    },
    {
      id: "8",
      accordionQuestion: "How often do I need to renew my safety certification?",
      accordionAnswer:
        "Renewal intervals vary by certification type. For instance, gas safety certificates need renewing every year, while electrical certificates may last up to 5 years.",
    },
    {
      id: "9",
      accordionQuestion: "What if I have a problem with my safety certification?",
      accordionAnswer:
        "If you have any issues with your safety certification, please contact us immediately. Our team will work with you to resolve any problems and ensure your compliance and safety.",
    },
    {
      id: "10",
      accordionQuestion: "Are your tradespeople qualified and insured?",
      accordionAnswer:
        "Yes, all of our tradespeople are fully qualified, certified, and insured to carry out safety inspections.",
    },
  ];

  // Splitting the accordion items into two parts for two columns
  const firstColumnItems = accordion.slice(0, Math.ceil(accordion.length / 2));
  const secondColumnItems = accordion.slice(Math.ceil(accordion.length / 2));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* First column with half of the accordion items */}
      <div>
        <UiAccordion type="single" collapsible>
          {firstColumnItems.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="text-lg font-medium hover:no-underline	">
                {item.accordionQuestion}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600 mt-2">
                {item.accordionAnswer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </UiAccordion>
      </div>

      {/* Second column with the remaining accordion items */}
      <div>
        <UiAccordion type="single" collapsible>
          {secondColumnItems.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="text-lg font-medium hover:no-underline">
                {item.accordionQuestion}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600 mt-2">
                {item.accordionAnswer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </UiAccordion>
      </div>
    </div>
  );
};

export default AccordionComponent;
