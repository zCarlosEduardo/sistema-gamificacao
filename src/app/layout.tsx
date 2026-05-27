import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme/theme-provider";

export const metadata = {
  title: "Ascend",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="h-full antialiased bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}