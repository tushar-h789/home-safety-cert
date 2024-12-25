"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Mail, Send, X } from "lucide-react";
import { OrderWithRelation } from "@/types/order";
import { EMAIL_ADDRESS } from "@/shared/data";
import { LoadingButton } from "@/components/ui/loading-button";
import { sendEmailToEngineerAction } from "../../../engineers/actions";
import { useToast } from "@/hooks/use-toast";

export default function SendEmailDialog({
  engineerEmail,
  orderDetails,
}: {
  engineerEmail: string;
  orderDetails: OrderWithRelation | null;
}) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    if (engineerEmail) setTo(engineerEmail);
  }, [engineerEmail]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const emailData = {
          subject: subject,
          receiver: engineerEmail,
          orderDetails: orderDetails,
          content: body,
        };

        await sendEmailToEngineerAction(emailData);

        // Show success toast
        toast({
          title: "Success",
          description: "Email sent successfully!",
          variant: "success",
        });

        // Reset form and close dialog
        resetForm();
        setOpen(false);
      } catch (error) {
        console.error("Error sending email:", error);

        // Show error toast
        toast({
          title: "Error",
          description: "Failed to send email. Please try again later.",
          variant: "destructive",
        });
      }
    });
  };

  const resetForm = () => {
    setFrom("");
    setTo("");
    setSubject("");
    setBody("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          disabled={!engineerEmail}
        >
          <Mail className="mr-2 h-4 w-4" />
          Send Email
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Compose New Email
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to send your email message.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Card className="p-4 mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="from" className="text-right font-semibold">
                  From
                </Label>
                <Input
                  id="from"
                  value={EMAIL_ADDRESS}
                  onChange={(e) => setFrom(e.target.value)}
                  className="col-span-3"
                  disabled
                  placeholder="your-email@example.com"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="to" className="text-right font-semibold">
                  To
                </Label>
                <Input
                  id="to"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="col-span-3"
                  placeholder="recipient@example.com"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right font-semibold">
                  Subject
                </Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter email subject"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="body" className="text-right font-semibold">
                  Message
                </Label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="col-span-3"
                  placeholder="Type your message here..."
                  rows={6}
                />
              </div>
            </div>
          </Card>
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              className="mr-2"
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <LoadingButton type="submit" loading={isPending}>
              {!isPending && <Send className="mr-2 h-4 w-4" />}
              Send Email
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
