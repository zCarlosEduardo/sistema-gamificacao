interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-full flex flex-col bg-gray-900 text-white">
      <main className="flex-1">{children}</main>
    </div>
  );
}