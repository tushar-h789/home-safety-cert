import React from "react";
import CalenderIcon from "./icons/calender-icon";
import DoorIcon from "./icons/door-icon";
import TodoIcon from "./icons/todo-icon";
import ClickBook from "./icons/click-book";

export default function Services() {
  const services = [
    {
      id: 1,
      icon: <ClickBook className="w-12 h-12 text-primary" />,
      step: "01",
      title: "Book your service",
      description:
        "Book our services via website or phone. Request a quote for fast, reliable service",
    },
    {
      id: 2,
      icon: <CalenderIcon className="w-14 h-14 text-primary" />,
      step: "02",
      title: "Schedule your service",
      description:
        "Book our services via website or phone. Request a quote for fast, reliable service",
    },
    {
      id: 3,
      icon: <DoorIcon className="w-14 h-14 text-primary font-bold text-3xl" />,
      step: "03",
      title: "We arrive on time",
      description:
        "Book our services via website or phone. Request a quote for fast, reliable service",
    },
    {
      id: 4,
      icon: <TodoIcon className="w-14 h-14 text-primary" />,
      step: "04",
      title: "Complete the service",
      description:
        "Book our services via website or phone. Request a quote for fast, reliable service",
    },
  ];

  return (
    <section className="container">
      <div className="my-20 md:my-32">
        <h2 className="text-heading text-3xl font-semibold text-center mt-20 leading-10">
          Get the Services You Need in Just a Few <br /> Easy Steps
        </h2>

        {/* card */}
        <div className="w-full flex items-center mt-16 mb-40">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {services.map((service) => (
              <div key={service.id} className=" text-center my-7">
                <div className="relative inline-block">
                  <div className="border p-12 shadow-lg rounded-full">
                    {service.icon}
                  </div>
                  <div className="bg-secondary inline-block px-2 py-1 rounded-full absolute top-8 -right-3">
                    {service.step}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium text-heading text-xl">
                    {service.title}
                  </h3>
                  <p className="text-para leading-7 mt-2">
                    {service.description.split("\n").map((line, index) => (
                      <span key={index}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
