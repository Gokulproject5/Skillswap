import "./globals.css";
import { ReduxProvider } from "@/redux/Provider";

export const metadata = {
  title: "SkillSwap ",
  description:
    "Connect with professionals to exchange and enhance your high-value skills.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SkillSwap ",
  },
};

export const viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={` h-full antialiased`}>
      <body
        className={` min-h-full bg-gray-100 inter flex flex-col overflow-x-clip`}
      >
        <ReduxProvider>

          {children}

        </ReduxProvider>
      </body>
    </html>
  );
}
