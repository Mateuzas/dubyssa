export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* TODO: Admin sidebar navigation */}
      <main className="flex-1 p-6">{children}</main>
    </>
  );
}
