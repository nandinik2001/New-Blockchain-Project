import "./globals.css";
// import { inter } from "next/font/google";
// const inter = inter({ subsets: ["latin"] });

export const metadata = {
  title: "Where style meets life",
  description: "Fashionista",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >{children}</body>
    </html>
  );
}