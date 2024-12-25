"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import RatingIcon from "@/app/(site)/_components/icons/reating-icon";
import ArrowIcon from "@/app/(site)/_components/icons/arrow-icon";
// import { RatingIcon, ArrowIcon } from 'lucide-react';
import ContactUsForm from '../../_components/contact-us-form'

// Zod schema validation
const schema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  phoneNumber: z
    .string()
    .regex(/^\+?\d{10,14}$/, { message: "Phone number must be valid" }),
  email: z.string().email({ message: "Email must be a valid email address" }),
  zipCode: z
    .string()
    .regex(/^\d{5}$/, { message: "Zip code must be 5 digits" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" })
    .optional(),
});

const ContactForm = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: any) => {
    // console.log("Form data submitted:", data);
    alert("Form submitted successfully!");
  };

  useEffect(() => {
    if (emblaApi) {
      // console.log(emblaApi.slideNodes());
    }
  }, [emblaApi]);

  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 ">
      <div className="bg-primary py-10 px-4 md:px-8">
        <div className="text-center text-white">
          <h2 className="pt-10 pb-5 md:text-4xl text-white">
            Hear From Our Satisfied <br /> Customers
          </h2>

          <div className="embla" ref={emblaRef}>
            <div className="embla__container">
              {[1, 2, 3].map((index) => (
                <div key={index} className="embla__slide select-none">
                  <RatingIcon className="w-16 md:w-20 text-center text-secondary mx-auto" />
                  <p className="text-[#E0E0E0] leading-7 md:leading-8 mx-4 md:mx-10 text-base md:text-lg pb-4">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab
                    consequuntur placeat ullam amet aperiam voluptates magni est
                    sapiente molestias libero tenetur exercitationem maiores,
                    impedit voluptate porro, eum magnam et expedita.
                  </p>
                  <p className="text-[#E0E0E0] pb-8 md:pb-16">
                    <strong className="text-secondary">
                      Justin Timberlake
                    </strong>{" "}
                    London, Great Britain, UKLondon
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-secondary py-10 px-4 md:px-8">
        <div className="max-w-lg mx-auto">
          <h2 className="text-heading text-2xl md:text-4xl font-semibold text-center mb-8">
            Get in Touch with Us
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter your name"
                />
                <p className="text-red-600 text-sm min-h-[1.5rem]">
                  {errors.name?.message?.toString()}
                </p>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  {...register("phoneNumber")}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter your phone number"
                />
                <p className="text-red-600 text-sm min-h-[1.5rem]">
                  {errors.phoneNumber?.message?.toString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter your email"
                />
                <p className="text-red-600 text-sm min-h-[1.5rem]">
                  {errors.email?.message?.toString()}
                </p>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Zip Code</label>
                <input
                  type="text"
                  {...register("zipCode")}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter your zip code"
                />
                <p className="text-red-600 text-sm min-h-[1.5rem]">
                  {errors.zipCode?.message?.toString()}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Message</label>
              <textarea
                {...register("message")}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your message (optional)"
                rows={4}
              ></textarea>
              <p className="text-red-600 text-sm min-h-[1.5rem]">
                {errors.message?.message?.toString()}
              </p>
            </div>

            <div className="flex justify-center md:justify-start">
              <button
                type="submit"
                className="uppercase bg-primary text-white font-semibold rounded-full px-6 py-2 shadow-lg select-none hover:bg-secondary flex items-center transition-all duration-100 ease-linear"
              >
                Submit Request
                <ArrowIcon className="ml-2 w-5 h-5 text-white" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
