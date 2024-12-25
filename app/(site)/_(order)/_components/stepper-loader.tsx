import React from "react";

export default function StepperLoader() {
  return (
    <div className="py-8">
      {/* Mobile Skeleton */}
      <div className="sm:hidden px-4">
        <div className="flex items-center justify-between">
          <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="flex flex-col items-end">
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Desktop Skeleton */}
      <div className="hidden sm:flex items-center justify-center">
        <div className="flex w-full max-w-3xl items-center justify-between">
          {[1, 2, 3].map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 animate-pulse">
                  <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                </div>
                <div className="mt-2 w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              {index < 2 && (
                <div className="h-1 flex-1 bg-gray-200 rounded-full animate-pulse mx-4"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
