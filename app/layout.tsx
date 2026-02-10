import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VoiceNote - كلامك منظم",
  description: "حول رسائلك الصوتية لنصوص منظمة",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
