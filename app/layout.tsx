import "../styles/globals.css";
import NetworkStatusBanner from "./components/NetworkStatusBanner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white p-4">
        <NetworkStatusBanner />
        {children}
      </body>
    </html>
  );
}
