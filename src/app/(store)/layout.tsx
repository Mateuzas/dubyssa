export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* TODO: Add store navigation header */}
      <main className="flex-1">{children}</main>
      {/* TODO: Add store footer */}
    </>
  );
}
