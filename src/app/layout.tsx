import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";
import AuthContext from "./context/AuthContext";

const inter = Inter({ subsets: ["latin"] });


// can be moved to seperate file--> head.tsx

export const metadata: Metadata = {
  title: "Dine-In",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
  modal,
  // modaltwo,
}: Readonly<{
  children: React.ReactNode;
  
  modal: React.ReactNode;
  // modaltwo: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <main className="bg-gray-100 min-h-screen w-screen">
        <AuthContext>
          <main className="max-w-screen-2xl m-auto bg-white">
            <NavBar/>
            {children}
            {modal} 
            {/* default = null  | login */}
          </main>
        </AuthContext>
      </main>
      </body>
    </html>
  );
}
