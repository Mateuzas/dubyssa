export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="container mx-auto px-4 py-8">
      <p className="text-muted-foreground">Product: {slug}</p>
      {/* TODO: Product detail view */}
    </div>
  );
}
