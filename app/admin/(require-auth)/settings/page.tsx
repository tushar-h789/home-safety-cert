import SettingsForm from "./_components/settings-form";
import { getSettings } from "./actions";

export default async function AdminSettingsForm() {
  const settings = await getSettings();

  return (
    <>
      <SettingsForm settings={settings} />
    </>
  );
}
