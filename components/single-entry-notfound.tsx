import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const startsWithVowel = (str: string) => /^[aeiou]/i.test(str);

const getIndefiniteArticle = (word: string) =>
  startsWithVowel(word) ? "an" : "a";

export default function SingleEntryNotFound({
  entryId,
  name,
}: {
  entryId: string;
  name: string;
}) {
  const lowercaseName = name.toLowerCase();
  const capitalizedName = capitalize(name);
  const pluralName = lowercaseName.endsWith("s")
    ? lowercaseName
    : `${lowercaseName}s`;
  const indefiniteArticle = getIndefiniteArticle(lowercaseName);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-lg h-screen">
      <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        {capitalizedName} Not Found
      </h2>
      <p className="text-gray-600 text-center mb-4">
        We couldn&apos;t find {indefiniteArticle} {lowercaseName} with the ID:{" "}
        <span className="font-semibold">{entryId}</span>
      </p>
      <p className="text-gray-600 text-center">
        Please check the ID and try again, or contact support if you believe
        this is an error.
      </p>
      <Link href={`/admin/${pluralName}`} className="mt-5">
        <Button>Return to {capitalize(pluralName)} List</Button>
      </Link>
    </div>
  );
}
