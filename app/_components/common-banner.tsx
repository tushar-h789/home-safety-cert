import React from "react";

interface CommonBannerProps {
  heading: string;
  firstPageName: string;
  secondPageName: string;
}

export default function CommonBanner({
  heading,
  firstPageName,
  secondPageName
}: CommonBannerProps) {
  return (
    <section className="relative">
      <div className="absolute inset-0 bg-primary opacity-80"></div>

      <div className="bg-[url('/images/about-bg.webp')] bg-cover bg-center py-24">
        <div className="container text-center text-white relative">
          <h2 className="font-bold text-5xl text-white">{heading}</h2>
          <p className="font-semibold py-2">
            {firstPageName} / <span className="text-secondary">{secondPageName}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
