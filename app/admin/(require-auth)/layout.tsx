import AdminTopLoader from "@/app/_components/admin-top-loader";
import AdminPanelLayout from "../_components/admin-panel/admin-panel-layout";

import "../styles.css";
import NextAuthSessionProvider from "@/provider/session-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html lang="en" suppressHydrationWarning>
    // TODO: NEXT AUTH SESSION PROVIDER
    <div>
      <NextAuthSessionProvider>
        <AdminTopLoader />
        <AdminPanelLayout>{children}</AdminPanelLayout>
      </NextAuthSessionProvider>
    </div>
    // </html>
  );
}
