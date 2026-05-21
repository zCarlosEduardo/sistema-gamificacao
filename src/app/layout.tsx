// src/app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Sistema de Gamificação",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="pt-BR" 
      className="h-full antialiased bg-gray-900 text-white"
      suppressHydrationWarning
    >
      <body className="h-full bg-gray-900 text-white antialiased">
        {children}
      </body>
    </html>
  );
}