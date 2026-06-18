export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full flex flex-col bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">
      <main className="flex-1">{children}</main>
    </div>
  );
}