import { Metadata } from "next";
import "./globals.scss";
import layout from "./layout.module.scss";
export const metadata: Metadata = {
  title: "Moonlight Masqurade",
  description: "A NewHayo Prom",
};
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import LogoutBasic from "@/components/Logout";

const inter = Inter({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={inter.className}>
      <body>
        <p
          style={{
            fontSize: "1rem",
            color: "white",
            fontWeight: "bold",
            backgroundColor: "rgb(150, 0, 0)",
            border: "1px solid rgb(175, 0, 0)",
            letterSpacing: "0",
            textTransform: "uppercase",
            padding: "0.25rem 0.5rem",
            borderRadius: "0.5rem",
            marginTop: "0.25rem",
            width: "100%",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          SOFTWARE IN BETA, EXPECT ERRORS
        </p>
        <div className={layout.header}>
          <a href="/" style={{ textDecoration: "none", color: "black" }}>
            <h1>
              Moonlight <br />
              <i>Masquerade</i>
            </h1>
            <p>
              <i>— a NewHayo Prom</i>
            </p>
          </a>
        </div>

        <Toaster position="bottom-left" />
        <div className={layout.mainn}>
          <main>{children}</main>
        </div>

        <footer className={layout.footer}>
          <h3>
            Moonlight Masquerade,
            <br /> <i>A NewHayo Prom</i>
          </h3>
          <p>
            Software Developed by
            <em> Prawich Thawansakdivudhi</em>
          </p>
          <LogoutBasic>Logout</LogoutBasic>
        </footer>
      </body>
    </html>
  );
}
