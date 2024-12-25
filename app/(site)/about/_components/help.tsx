import { Button } from "@/components/ui/button";
import React from "react";
import ArrowIcon from "../../_components/icons/arrow-icon";

export default function HelpSection() {
  return (
    <section className="bg-primary opacity-80">
      <div className="container text-white">
        <div className="pt-24 text-center">
          <h2 className="text-5xl text-white">
            How Can We Help You?
          </h2>
          <p className="leading-8 my-6 w-2/3 text-center mx-auto">
            Home Safety Cert collaborates with vetted professionals who are
            registered with official UK bodies. Our tradespeople are highly
            skilled and experienced in their respective fields. We value
            customer feedback to ensure the best hassle-free experience for you.
          </p>
        </div>
        <div className="mx-auto text-center  pb-20">
          <Button
            variant="outline"
            className="uppercase rounded-full hover:bg-secondary text-secondary hover:text-white gap-3 border-2 hover:border-secondary "
          >
            Request a quote
            <ArrowIcon className="w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
