import AboutHomeCert from "./_components/about-home-cert";
import ContactForm from "./_components/contact-form";
import HeroSection from "./_components/hero-section";
import HomeSafetySolutions from "./_components/home-safety-solutions";
import PricingPlans from "./_components/pricing-plans";
import Services from "./_components/services";

export default function Home() {
  return (
    <div className="overflow-hidden">
      <section id="home">
        <HeroSection />
      </section>
      <HomeSafetySolutions />
      <section id="about">
        <AboutHomeCert />
      </section>
      <section id="pricing">
        <PricingPlans />
      </section>
      <section id="contact">
        <ContactForm />
      </section>
      <section id="services">
        <Services />
      </section>
    </div>
  );
}
