import Link from "next/link";

export default function NotFound() {
  return (
    <section aria-labelledby="not-found-title" className="mx-auto max-w-xl py-12 text-center sm:py-20">
      <h1 id="not-found-title" className="text-page-title font-bold text-navy">
        Page not found
      </h1>
      <p className="mt-4 text-body text-muted">
        We couldn&apos;t find that page or product. Check the address or browse the catalog to find what you need.
      </p>
      <Link href="/" className="mt-7 inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-5 py-3 text-body font-semibold text-white hover:bg-navy">
        Back to products
      </Link>
    </section>
  );
}
