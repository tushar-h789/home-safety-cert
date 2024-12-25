"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useOrderStore from "@/hooks/use-order-store";
import { useEffect } from "react";
import { z } from "zod";
import RequiredIndicator from "@/custom/required-indicator";
import { parsePhoneNumberFromString } from "libphonenumber-js"; // Import phone number parsing function

// Function to validate UK postCodes using a regex
const isValidUKPostcode = (postCode: string) => {
  const ukPostcodeRegex = /^([A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0AA)$/i;
  return ukPostcodeRegex.test(postCode);
};

// Custom function to validate phone numbers using libphonenumber-js
const isValidUKPhoneNumber = (phone: string) => {
  const parsedPhoneNumber = parsePhoneNumberFromString(phone, "GB");
  return parsedPhoneNumber?.isValid() ?? false;
};

const personalDetailsSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().refine(isValidUKPhoneNumber, {
    message: "Invalid UK phone number",
  }),
  houseStreet: z.string().nonempty("Street address is required"),
  city: z.literal("London", {
    errorMap: () => ({ message: "City must be London" }),
  }),
  postCode: z.string().refine(isValidUKPostcode, {
    message: "Invalid UK postCode",
  }),
});

type PersonalDetailsFormInput = z.infer<typeof personalDetailsSchema>;

interface PersonalDetailsProps {
  setCurrentStep: (step: number) => void;
}

export default function PersonalDetails({
  setCurrentStep,
}: PersonalDetailsProps) {
  const { customerDetails, setCustomerDetails } = useOrderStore();

  const form = useForm<PersonalDetailsFormInput>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      houseStreet: "",
      city: "London",
      postCode: "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (customerDetails) {
      reset({
        name: customerDetails.name,
        email: customerDetails.email ?? "",
        phone: customerDetails.phone ?? "",
        houseStreet: customerDetails.houseStreet ?? "",
        city: "London",
        postCode: customerDetails.postCode ?? "",
      });
    }
  }, [reset, customerDetails]);

  const onPersonalDetailsSubmit = async (data: PersonalDetailsFormInput) => {
    setCustomerDetails({
      name: data.name,
      email: data.email,
      phone: data.phone,
      houseStreet: data.houseStreet,
      city: data.city,
      postCode: data.postCode,
    });

    // Move to the next step in the order process
    setCurrentStep(2);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-2xl">
      <Form {...form}>
        <form
          className="space-y-8 mx-auto"
          onSubmit={form.handleSubmit(onPersonalDetailsSubmit)}
        >
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Personal Details</h2>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phone <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="houseStreet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Street <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Street address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        City <RequiredIndicator />
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Postcode <RequiredIndicator />
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Postcode" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button type="submit" className="w-full mt-6">
              Next: Confirmation Details
            </Button>
          </Card>
        </form>
      </Form>
    </div>
  );
}
