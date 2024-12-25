import Image from "next/image";
import homeSafetyAbout from "@/public/images/hero-1.webp";
import CorrectIcon from "@/app/(site)/_components/icons/correct-icon";
import ArrowIcon from "@/app/(site)/_components/icons/arrow-icon";

const listItems = [
  {
    icon: <CorrectIcon className="w-4 h-4" />,
    text: "Same & next day appointment",
  },
  {
    icon: <CorrectIcon className="w-4 h-4" />,
    text: "Fixed & instant price quote",
  },
  {
    icon: <CorrectIcon className="w-4 h-4" />,
    text: "Fixed & instant price quote",
  },
  {
    icon: <CorrectIcon className="w-4 h-4" />,
    text: "Fixed & instant price quote",
  },
  {
    icon: <CorrectIcon className="w-4 h-4" />,
    text: "Fixed & instant price quote",
  },
  {
    icon: <CorrectIcon className="w-4 h-4" />,
    text: "Fixed & instant price quote",
  },
];

export default function AboutHomeCert() {
  return (
    <section className="container md:mt-40 w-full">
      <div className="md:flex md:gap-5 justify-between mt-20 md:mt-40 mb-20">
        <div className="md:w-1/2 hidden lg:block">
          <Image
            src={homeSafetyAbout}
            alt="home safety about img"
            width={550}
            height={400}
          />
        </div>

        <div className="lg:w-1/2">
          <h2 className="text-heading font-semibold text-3xl leading-relaxed">
            About Home Safety Cert - Our <br /> Commitment to Safety and Service
          </h2>
          <p className="text-para leading-7 my-6">
            At Home Safety Cert, we specialize in landlord safety
            certifications. As per legal requirements, landlords must obtain
            various certificates to rent or sell a property. The majority of
            these certificates need annual revalidation. Managing these
            certifications has become increasingly challenging for landlords and
            estate agents due to complex laws and timelines. Our goal is to
            alleviate the burden of property certifications, providing you with
            peace of mind.
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 items-center leading-9 lg:leading-snug">
            {listItems.map((item, index) => (
              <li
                key={index}
                className={`flex items-center gap-2 text-primary font-medium md:font-semibold xl:text-lg`}
              >
                {item.icon}
                <p className="leading-loose">{item.text}</p>
              </li>
            ))}
          </ul>

          <div className="flex items-center">
            <button className="uppercase bg-primary text-white font-semibold rounded-full px-8 py-2 mt-8 md:mt-4 shadow-lg select-none hover:bg-secondary flex items-center transition-all duration-100 ease-linear">
              Buy Now
              <ArrowIcon className="ml-2 w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
