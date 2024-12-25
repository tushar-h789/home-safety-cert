import React from "react";
import { getCertificateById } from "../actions";
import SingleEntryNotFound from "@/components/single-entry-notfound";
import EditCustomerForm from "../../customers/[customer_id]/_components/edit-user-from";

export default async function CertificateDetailsPage({
  params,
}: {
  params: {
    certificates_id: string;
  };
}) {
  // Extract the correct parameter name from the URL
  const { certificates_id } = params;

  // Check if the certificate ID is available before proceeding
  if (!certificates_id || typeof certificates_id !== "string" || certificates_id.trim() === "") {
    console.error("Invalid certificate ID provided. Certificate ID must be a non-empty string.");
    return <SingleEntryNotFound entryId="undefined" name="certificate" />;
  }

  // Fetch the certificate using the ID
  try {
    const certificate = await getCertificateById(certificates_id);

    if (!certificate) {
      return <SingleEntryNotFound entryId={certificates_id} name="certificate" />;
    }

    return (
      <>
        <EditCustomerForm user={certificate} /> {/* Ensure this user prop is of the right type */}
      </>
    );
  } catch (error) {
    console.error("Error fetching certificate:", error);
    return <SingleEntryNotFound entryId={certificates_id} name="certificate" />;
  }
}
