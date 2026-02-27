import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata = {
  title: "CJ Chien | Photographer & Programmer",
  description: "Portfolio of CJ Chien, featuring photography and pottery.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* 導覽列：包含漢堡選單與滾動隱藏功能 */}
        <NavBar />
        {children}
      </body>
    </html>
  );
}
