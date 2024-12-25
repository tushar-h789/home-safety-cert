import React from "react";
import { getEngineerById } from "../actions";
import SingleEntryNotFound from "@/components/single-entry-notfound";
import EditCustomerForm from "../../customers/[customer_id]/_components/edit-user-from";

export default async function EditEngineerPage({
  params,
}: {
  params: {
    engineer_id: string;
  };
}) {
  const { engineer_id } = params;

  if (!engineer_id || typeof engineer_id !== "string" || engineer_id.trim() === "") {
    console.error("Engineer ID is invalid or missing");
    return <SingleEntryNotFound entryId={engineer_id} name="engineer" />;
  }

  try {
    const engineer = await getEngineerById(engineer_id);

    if (!engineer) {
      return <SingleEntryNotFound entryId={engineer_id} name="engineer" />;
    }

    return (
      <>
        <EditCustomerForm user={engineer} />
      </>
    );
  } catch (error) {
    console.error("Error fetching engineer:", error);
    return <SingleEntryNotFound entryId={engineer_id} name="engineer" />;
  }
}
