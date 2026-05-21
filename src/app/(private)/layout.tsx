// src/app/(private)/layout.tsx
interface PrivadoLayoutProps {
  children: React.ReactNode;
}

export default function PrivadoLayout({ children }: PrivadoLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main>{children}</main>
    </div>
  );
}