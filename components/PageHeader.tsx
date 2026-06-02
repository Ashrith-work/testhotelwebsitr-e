// Inner-page banner with title + breadcrumb-style subtitle over a dark image.
export default function PageHeader({
  title,
  subtitle,
  image,
}: {
  title: string;
  subtitle?: string;
  image?: string;
}) {
  // PLACEHOLDER background — replace `image` with a real photo when provided
  const bg =
    image ??
    "https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1600&q=80";
  return (
    <section
      className="relative flex h-64 items-center justify-center sm:h-72"
      style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-charcoal/60" />
      <div className="relative z-10 px-5 text-center">
        <h1 className="font-serif text-4xl text-white sm:text-5xl">{title}</h1>
        <span className="mx-auto mt-3 block h-[3px] w-16 rounded bg-gold" />
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-sm text-cream-light/85 sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
