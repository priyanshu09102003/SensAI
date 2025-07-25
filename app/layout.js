import { Inter} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";



const inter = Inter({subsets: ["latin"]});
export const metadata = {
  title: "SensAI - Your AI powered Career Coach",
  description: "",
};

export default function RootLayout({ children }) {
  return (

    <ClerkProvider
    appearance={{
      baseTheme : dark
    }}>
        <html lang="en" suppressHydrationWarning>
          <body
            className={`${inter.className} `}
          >
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
              >

                <Header />
                <main className="min-h-screen">{children}</main>
                <Toaster richColors />


                <footer className = "bg-muted/50 py-8">
                    <div className="container mx-auto px-4 text-center text-gray-200">
                      <p> © Developed and Designed by Priyanshu</p>
                    </div>


                </footer>
                
                
              </ThemeProvider>
          </body>
        </html>
    </ClerkProvider>
  );
}
