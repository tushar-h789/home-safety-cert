import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="min-h-[100vh] flex justify-center items-center">
      <Spinner className="text-primary" size="large" />
    </div>
  );
}
