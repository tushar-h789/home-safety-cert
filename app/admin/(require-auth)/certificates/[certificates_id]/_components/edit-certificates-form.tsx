// _components/edit-certificates-form.tsx
import React from "react";

// Define the type for the certificate object
type CertificateType = {
  id: string;
  serviceName: string;
  issuedBy: string;
  dateOfIssue: string;
  expiryDate?: string | null;
  userId: string;
};

// Component to edit the certificate
export default function EditCertificateForm({
  certificate,
}: {
  certificate: CertificateType; // Expecting a certificate object of type CertificateType
}) {
  return (
    <form>
      <h2>Edit Certificate</h2>
      <label>
        Service Name:
        <input
          type="text"
          defaultValue={certificate.serviceName} // Pre-fill with existing service name
          name="serviceName"
        />
      </label>
      <br />
      <label>
        Issued By:
        <input
          type="text"
          defaultValue={certificate.issuedBy} // Pre-fill with existing issuer
          name="issuedBy"
        />
      </label>
      <br />
      <label>
        Date of Issue:
        <input
          type="date"
          defaultValue={certificate.dateOfIssue} // Pre-fill with existing issue date
          name="dateOfIssue"
        />
      </label>
      <br />
      <label>
        Expiry Date:
        <input
          type="date"
          defaultValue={certificate.expiryDate ?? ""} // Pre-fill with existing expiry date or empty
          name="expiryDate"
        />
      </label>
      <br />
      <button type="submit">Update Certificate</button> 
    </form>
  );
}
