"use client";

import React from "react";
import GoogleMap from "../google-map"; // Assuming GoogleMap is correctly implemented
import FacebookIcon from "../../_components/icons/facebook-icon";
import TwitterIcon from "../../_components/icons/twitter-icon";
import InstagramIcon from "../../_components/icons/instagram-icon";
import MessageIcon from "../../_components/icons/message-icon";
import ClockIcon from "../../_components/icons/clock-icon";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ArrowIcon from "@/app/(site)/_components/icons/arrow-icon";

// Zod schema validation
const schema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  phoneNumber: z
    .string()
    .regex(/^\+?\d{10,14}$/, { message: "Phone number must be valid" }),
  email: z.string().email({ message: "Email must be a valid email address" }),
  zipCode: z.string().regex(/^\d{5}$/, { message: "Zip code must be 5 digits" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" })
    .optional(),
});

export default function ContactPageForm() {
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

  return (
    <section className="">
      <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-32">
        <div className="mx-auto">
          <h2 className="">
            Let Us Help You Ensure <br /> Your Property is Safe and <br />{" "}
            Certified. Contact Us <br /> Today!
          </h2>
          <p className="text-para leading-8 my-3">
            Contact us today and let us take the headache out <br /> of property
            certifications. Our expert team ensures <br /> your property is safe
            and certified.
          </p>

          <div className="flex items-center gap-4 my-4">
            <FacebookIcon className="w-10 text-secondary border rounded-full hover:bg-secondary hover:text-primary ease-linear duration-100 p-2" />
            <TwitterIcon className="w-10 text-secondary border rounded-full hover:bg-secondary hover:text-primary ease-linear duration-100 p-2" />
            <InstagramIcon className="w-10 text-secondary border rounded-full hover:bg-secondary hover:text-primary ease-linear duration-100 p-2" />
          </div>
        </div>

        <div>
          {/* form */}
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
                <p className="text-red-600 text-sm min-h-[1rem]">
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
                <p className="text-red-600 text-sm min-h-[1rem]">
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
                <p className="text-red-600 text-sm min-h-[1rem]">
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
                <p className="text-red-600 text-sm min-h-[1rem]">
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
              <p className="text-red-600 text-sm min-h-[1rem]">
                {errors.message?.message?.toString()}
              </p>
            </div>

            <div className="flex justify-center md:justify-start">
              <button
                type="submit"
                className="uppercase bg-primary text-white font-semibold rounded-full px-20 py-3 shadow-lg select-none hover:bg-secondary flex items-center transition-all duration-100 ease-linear"
              >
                Submit Request
                <ArrowIcon className="ml-2 w-5 h-5 text-white" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* contact and map part */}
      <div className="relative w-full">
        {/* email info */}
        <div className="md:max-w-[80%] mx-auto bg-primary mt-20 p-5 md:rounded-full text-white relative mb-14 md:mb-0">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="flex items-center gap-4">
              <MessageIcon className="w-10 p-2 border rounded-full" />
              <div>
                <h3 className="text-2xl font-semibold text-white leading-10">
                  Email Address
                </h3>
                <p>info@homesafetycert.co.uk</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <MessageIcon className="w-10 p-2 border rounded-full" />
              <div>
                <h3 className="text-2xl font-semibold text-white leading-10">
                  Our Address
                </h3>
                <p>London, Great Britain, UK</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ClockIcon className="w-10 p-2 border rounded-full" />
              <div>
                <h3 className="text-2xl font-semibold text-white leading-10">
                  Open Hours
                </h3>
                <p>Mon - Fri: 08:00 - 18:00</p>
              </div>
            </div>
          </div>
        </div>

        {/* map section */}
      </div>
      </div>
        <div className=" w-full h-[500px] -mt-12 mb-[100px]">
          <GoogleMap />
        </div>
    </section>
  );
}
