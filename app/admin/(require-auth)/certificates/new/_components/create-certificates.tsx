import React, { useEffect, useState, useTransition } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Check, PlusIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import Select components
import { useToast } from "@/components/ui/use-toast";

import { CreateCertificateFormInput, createCertificateSchema } from "../schema";
import { createCertificate, getAllUsers } from "../../actions";

export default function CreateCertificate() {
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]); // Users state to store fetched users
  const { toast } = useToast();
  const [isLoadingUsers, setIsLoadingUsers] = useState(false); // Loading state for fetching users

  useEffect(() => {
    async function fetchUsers() {
      setIsLoadingUsers(true);
      try {
        const userList = await getAllUsers();
        // Ensure the name is never null
        const formattedUserList = userList.map((user) => ({
          ...user,
          name: user.name || "Unknown User",
        }));
        setUsers(formattedUserList);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load users.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingUsers(false);
      }
    }

    if (isDialogOpen) {
      fetchUsers();
    }
  }, [isDialogOpen, toast]);

  const form = useForm<CreateCertificateFormInput>({
    resolver: zodResolver(createCertificateSchema),
    defaultValues: {
      serviceName: "",
      issueDate: new Date(),
      expiryDate: undefined,
      issuedBy: "",
      userId: "",
    },
  });

  const onSubmit: SubmitHandler<CreateCertificateFormInput> = (data) => {
    startTransition(async () => {
      try {
        const submitData = {
          ...data,
          issueDate: data.issueDate,
          expiryDate: data.expiryDate || undefined,
        };

        const result = await createCertificate(submitData);
        if (result.success) {
          toast({
            title: "Success",
            description: result.message,
            variant: "success",
          });
          setDialogOpen(false);
          form.reset();
        } else {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unknown error occurred while creating the certificate.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="h-9 text-sm font-medium flex">
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Certificate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Create New Certificate</DialogTitle>
          <DialogDescription>Fill in the details below to add a new certificate to the system.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="serviceName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter service name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="issueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Issue Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => field.onChange(date)}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Expiry Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={(date) => field.onChange(date || undefined)}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="issuedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issued By</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter issuer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User ID</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingUsers ? (
                          <SelectItem value="loading" disabled>Loading users...</SelectItem>
                        ) : (
                          users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <LoadingButton loading={isPending} type="submit">
                <Check className="mr-2 h-4 w-4" />
                Create
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
