import React from "react";
import Accordion from "./accordion";

export default function QuestionSection() {
  return (
    <section className="py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col justify-center md:items-start text-center md:text-left">
            <p className="uppercase text-para leading-9 font-medium mb-4">
              Have any Questions?
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold leading-8 md:leading-10">
              Recently Asked Questions
            </h2>
          </div>
          <div className="border-l border-black pl-4 md:pl-8">
            <p className="text-para leading-7">
              Discover answers to frequently asked questions regarding our
              landlord safety certifications and services. Clear any
              uncertainties and gain valuable insights.
            </p>
          </div>
        </div>

        <div className="mt-12 md:mt-16">
          <Accordion />
        </div>
      </div>
    </section>
  );
}
