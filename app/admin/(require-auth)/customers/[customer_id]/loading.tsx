import { LoadingSpinner } from "@/components/loading-spinner";




export default function Loading() {
  return (
    <div className="min-h-[100vh] flex justify-center items-center">
      <LoadingSpinner className="text-primary" size="large" />
    </div>
  );
}
