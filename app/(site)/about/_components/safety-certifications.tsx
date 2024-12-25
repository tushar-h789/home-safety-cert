import React from "react";
import PhoneIcon from "../../_components/icons/phone-icon";

export default function SafetyCertification() {
  return (
    <section className="my-10">
      <div className="container w-full grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className=""></div>
        <div className="mr-5">
          <h2 className="font-semibold text-3xl text-heading leading-10">
            Introducing Home Safety Cert: Your Trusted Partner for Landlord
            Safety Certifications
          </h2>
          <div>
            <p className="text-para mt-5 leading-9">
              We are a team of professionals focused on providing landlord
              safety certifications in a hassle-free manner. Our services
              include Gas Safety Certificates, Electrical certification, Energy
              Performance Certificates, PAT testing, Fire Alarm Certificates,
              Fire Risk Assessments, and more. Our vetted experts have extensive
              experience in their respective fields.
              <br /> <br />
              Our customer-centric approach includes a rating system for
              tradespeople and a general safety check for potential hazards
              during each property visit. Our reminder service sends
              notifications when services are due, saving you time and hassle.
              We are constantly updating our system to make it easier for
              landlords and estate agents.
              <br />
              <br />
              We prioritize tenant safety and insurance claims, ensuring
              complete compliance and safety for your properties. Our services
              are hassle-free and require no contract or direct debit setup. We
              only charge when you agree to our services. Choose us for reliable
              and stress-free certification services.
              <br />
              <br />
            </p>
            <div className="border-l-4 border-spacing-x-10 border-primary">
              <p className="ml-4 text-para leading-9">
                As professionals, our utmost priority lies in valuing our
                service above revenue. Our growth hinges solely upon the
                recommendations we receive from satisfied clients like you. We
                toil diligently to ensure your happiness and contentment with
                our services.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 my-10">
            <PhoneIcon className="w-14 p-4 rounded-xl bg-secondary"/>
            <p className="text-para">Call Anytime: <span className="font-semibold text-heading text-xl">020 3488 4929</span></p>
          </div>
        </div>
      </div>
    </section>
  );
}
