import "./globals.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import TanStackProvider from "../components/TanStackProvider/TanStackProvider";
import { ReactNode } from "react";

export const metadata = {
  title: "NoteHub",
  description: "A simple and efficient note management app.",
};

interface RootLayoutProps {
  children: ReactNode;
  modal?: ReactNode;
}

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <TanStackProvider>
          <Header />
          {children}
          {modal ?? null}
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}