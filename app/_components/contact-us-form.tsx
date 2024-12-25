"use client";

import { sendEmailToAdminAndCustomerAction } from "@/app/(site)/actions";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";

interface ContactUsFormProps {
  formClass?: string;
  inputClass?: string;
  buttonClass?: string;
  textareaClass?: string;
  errorTextClass?: string;
}

const contactFormSchema = z.object({
  name: z.string().min(1, { message: "Please enter your name" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  phone: z.string().min(1, { message: "Please enter your phone number" }),
  subject: z.string().min(1, { message: "Please provide a subject" }),
  message: z.string().min(1, { message: "Message is required" }),
});

export type ContactUsFormInputType = z.infer<typeof contactFormSchema>;

export default function ContactUsForm({
  errorTextClass = "text-red-600",
}: ContactUsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactUsFormInputType>({
    resolver: zodResolver(contactFormSchema),
  });
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const onSubmit: SubmitHandler<ContactUsFormInputType> = async (data) => {
    startTransition(async () => {
      const response = await sendEmailToAdminAndCustomerAction(data);
      toast({
        title: response.success ? "Success" : "Error",
        description: response.message,
        variant: response.success ? "success" : "destructive",
      });
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="sm:flex sm:space-x-6">
          <div className="flex-1">
            <Input
              {...register("name")}
              placeholder="Name"
              className="w-full bg-white border-gray-300"
            />
            {errors.name && (
              <p className={`mt-1 text-sm ${errorTextClass}`}>
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="flex-1">
            <Input
              {...register("email")}
              placeholder="Email Address"
              className="w-full bg-white border-gray-300"
            />
            {errors.email && (
              <p className={`mt-1 text-sm ${errorTextClass}`}>
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div className="sm:flex sm:space-x-6">
          <div className="flex-1">
            <Input
              {...register("phone")}
              placeholder="Phone Number"
              className="w-full bg-white border-gray-300"
            />
            {errors.phone && (
              <p className={`mt-1 text-sm ${errorTextClass}`}>
                {errors.phone.message}
              </p>
            )}
          </div>
          <div className="flex-1">
            <Input
              {...register("subject")}
              placeholder="Subject"
              className="w-full bg-white border-gray-300"
            />
            {errors.subject && (
              <p className={`mt-1 text-sm ${errorTextClass}`}>
                {errors.subject.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div>
        <Textarea
          {...register("message")}
          placeholder="Type your Message here..."
          className="w-full h-32 bg-white border-gray-300"
        />
        {errors.message && (
          <p className={`mt-1 text-sm ${errorTextClass}`}>
            {errors.message.message}
          </p>
        )}
      </div>

      <LoadingButton
        loading={isPending}
        disabled={isPending}
        type="submit"
        className="w-full bg-secondary text-black font-bold hover:bg-secondary/80 transition duration-300"
      >
        Submit
      </LoadingButton>
    </form>
  );
}
