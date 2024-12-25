"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useRouter } from "next/navigation";

// Function to validate UK postcodes using a regex
const isValidUKPostcode = (postcode: string) => {
  const ukPostcodeRegex = /^([A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0AA)$/i;
  return ukPostcodeRegex.test(postcode);
};

// Custom function to validate phone numbers using libphonenumber-js
const isValidUKPhoneNumber = (phone: string) => {
  const parsedPhoneNumber = parsePhoneNumberFromString(phone, "GB");
  return parsedPhoneNumber?.isValid() ?? false;
};

// Zod schema with custom validation for UK phone number and postcode
const personalDetailsSchema = z.object({
  firstName: z.string().nonempty({ message: "Name is required" }),
  email: z.string().email("Invalid email address").nonempty({ message: "Email is required" }),
  phone: z
    .string()
    .nonempty({ message: "Phone number is required" })
    .refine((phone) => isValidUKPhoneNumber(phone), {
      message: "Invalid UK phone number",
    }),
  houseStreet: z.string().nonempty({ message: "House & Street is required" }),
  postCode: z
    .string()
    .nonempty({ message: "Post Code is required" })
    .refine((postCode) => isValidUKPostcode(postCode), {
      message: "Invalid UK postcode",
    }),
  city: z.literal("London", {
    errorMap: () => ({ message: "City must be London" }),
  }),
});

type PersonalDetailsFormData = z.infer<typeof personalDetailsSchema>;

const PersonalDetails = ({
  setCurrentStep,
}: {
  setCurrentStep: (step: number) => void;
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalDetailsFormData>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      firstName: "",
      email: "",
      phone: "",
      houseStreet: "",
      postCode: "",
      city: "London", // The city will be fixed to London, but this field can still be visible in the form
    },
  });

  const router = useRouter();

  const onSubmit = (data: PersonalDetailsFormData) => {
    console.log("Personal Details:", data);

    // Save form data to local storage
  localStorage.setItem("PersonalDetails", JSON.stringify(data));

    // Move to the next step
    setCurrentStep(2);
    router.push("/request-aquote?active_step=3");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-2xl">
      <h3 className="font-semibold text-lg mb-5">2. Personal Details</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* First Name */}
        <div className="mb-4">
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                className="w-full border p-2 mt-1"
                {...field}
                placeholder="Name"
              />
            )}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <input
                type="email"
                className="w-full border p-2 mt-1"
                {...field}
                placeholder="Email"
              />
            )}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="mb-4">
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                className="w-full border p-2 mt-1"
                {...field}
                placeholder="Phone"
              />
            )}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        {/* Address Section */}
        <div className="text-center py-4 border-inherit">
          <h4 className="bg-slate-200 inline px-3 py-1 rounded-full">Address</h4>
        </div>

        {/* House & Street */}
        <div className="mb-4">
          <Controller
            name="houseStreet"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                className="w-full border p-2 mt-1"
                {...field}
                placeholder="House & Street"
              />
            )}
          />
          {errors.houseStreet && (
            <p className="text-red-500 text-sm">{errors.houseStreet.message}</p>
          )}
        </div>

        {/* Post Code and City Fields */}
        <div className="flex items-center gap-4">
          {/* Post Code */}
          <div className="mb-4 w-1/2">
            <Controller
              name="postCode"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  className="w-full border p-2 mt-1"
                  {...field}
                  placeholder="Post Code"
                />
              )}
            />
            {errors.postCode && (
              <p className="text-red-500 text-sm">{errors.postCode.message}</p>
            )}
          </div>

          {/* City */}
          <div className="mb-4 w-1/2">
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  className="w-full border p-2 mt-1"
                  {...field}
                  placeholder="City"
                  value="London" // Set the input value to "London"
                  readOnly // Make the field read-only
                />
              )}
            />
            {/* {errors.city && (
              <p className="text-red-500 text-sm">{errors.city.message}</p>
            )} */}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
         className="bg-primary text-white px-4 py-2 rounded-full mt-4 uppercase border-2 shadow-lg hover:bg-transparent hover:text-primary ease-linear duration-100"
        >
          Next: Confirmation Details
        </button>
      </form>
    </div>
  );
};

export default PersonalDetails;
