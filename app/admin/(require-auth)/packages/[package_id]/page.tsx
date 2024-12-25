
import { getPackageById } from "../actions";
import EditPackageForm from "./_components/edit-package-form";

export default async function EditPackagePage({
  params: { package_id },
}: {
  params: {
    package_id: string;
  };
}) {
  const packageData = await getPackageById(package_id);

  if (!packageData.success || !packageData.data) {
    return <div>Package not found or an error occurred.</div>;
  }
  return <EditPackageForm packageDetails={packageData.data} />;
}
