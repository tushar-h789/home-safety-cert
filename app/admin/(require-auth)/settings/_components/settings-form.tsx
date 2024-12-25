"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Prisma } from "@prisma/client";
import { CalendarIcon, Clock, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useTransition } from "react";
import { updateSiteSettings } from "../actions";
import { SiteSettingsFormValues, siteSettingsSchema } from "../schema";
import { ContentLayout } from "@/app/admin/_components/content-layout";
import { useToast } from "@/hooks/use-toast";

export type SettingsWithRelation = Prisma.SiteSettingsGetPayload<{
  include: {
    user: {
      include: {
        address: true;
      };
    };
    openingDateTime: true;
  };
}>;

export default function SettingsForm({
  settings,
}: {
  settings: SettingsWithRelation | null;
}) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const { data: sessionData, status } = useSession();

  const form = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      email: "",
      phone1: "",
      phone2: "",
      whatsapp: "",
      websiteUrl: "",
      facebookUrl: "",
      twitterUrl: "",
      instagramUrl: "",
      address: {
        street: "",
        city: "",
        postcode: "",
      },

      openingDateTime: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "openingDateTime",
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        email: settings.email ?? "",
        phone1: settings.phone1 ?? "",
        phone2: settings.phone2 || "",
        whatsapp: settings.whatsapp || "",
        websiteUrl: settings.websiteUrl || "",
        facebookUrl: settings.facebookUrl || "",
        twitterUrl: settings.twitterUrl || "",
        instagramUrl: settings.instagramUrl || "",
        address: {
          street: settings.user?.address?.street || "",
          city: settings.user?.address?.city || "",
          postcode: settings.user?.address?.postcode || "",
        },

        openingDateTime: settings?.openingDateTime.map((time) => ({
          closingTime: time.closingTime,
          dayOfWeek: time.dayOfWeek,
          openingTime: time.openingTime,
        })),
      });
    }
  }, [form, settings]);

  function onSubmit(data: SiteSettingsFormValues) {
    if (status !== "authenticated" || !sessionData.user.id) {
      toast({
        title: "Error",
        description: "You must be logged in to update settings.",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      try {
        const result = await updateSiteSettings(data, sessionData.user.id);
        console.log("data", result);
        if (result.success) {
          toast({
            title: "Success",
            description: result.message,
            variant: "success",
          });
        } else {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error updating site settings:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    });
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>You must be logged in to view this page.</div>;
  }

  return (
    <ContentLayout title="Settings">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Site Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="contact@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="10 Downing Street" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="London" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.postcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postcode</FormLabel>
                    <FormControl>
                      <Input placeholder="SW1A 2AA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="07123 456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="07123 456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="07123 456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="facebookUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://www.facebook.com/yourpage"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="twitterUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://twitter.com/yourhandle"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instagramUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://www.instagram.com/yourprofile"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <h3 className="mb-4 font-semibold">Opening Hours</h3>

                {fields.length === 0 ? (
                  <div className="text-center p-6 bg-gray-100 rounded-md mb-4">
                    <div className="flex justify-center mb-4">
                      <Clock className="w-12 h-12 text-gray-400" />
                      <CalendarIcon className="w-12 h-12 text-gray-400 ml-2" />
                    </div>
                    <p className="text-gray-600 mb-4">No opening hours set</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Add your business hours to let customers know when
                      you&lsquo;re open.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        append({
                          dayOfWeek: "MONDAY",
                          openingTime: "",
                          closingTime: "",
                        })
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Opening Hours
                    </Button>
                  </div>
                ) : (
                  <>
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex items-center space-x-2 mb-4"
                      >
                        <FormField
                          control={form.control}
                          name={`openingDateTime.${index}.dayOfWeek`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select day" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {[
                                    "MONDAY",
                                    "TUESDAY",
                                    "WEDNESDAY",
                                    "THURSDAY",
                                    "FRIDAY",
                                    "SATURDAY",
                                    "SUNDAY",
                                  ].map((day) => (
                                    <SelectItem key={day} value={day}>
                                      {day}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`openingDateTime.${index}.openingTime`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`openingDateTime.${index}.closingTime`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => remove(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        append({
                          dayOfWeek: "MONDAY",
                          openingTime: "",
                          closingTime: "",
                        })
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Opening Hours
                    </Button>
                  </>
                )}
              </div>

              <LoadingButton
                type="submit"
                className="w-full"
                loading={isPending}
              >
                Save Settings
              </LoadingButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </ContentLayout>
  );
}
