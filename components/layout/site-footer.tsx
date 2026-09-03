import { SocialIcon } from "@/components/icons/social-icon";
import { PageContainer } from "@/components/layout/page-container";

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/", icon: "facebook" },
  { label: "Twitter", href: "https://twitter.com/", icon: "twitter" },
  { label: "Instagram", href: "https://www.instagram.com/", icon: "instagram" },
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-footer py-8 text-white sm:py-9">
      <PageContainer>
        <div className="grid grid-cols-2 gap-x-8 gap-y-7 sm:grid-cols-3">
          <section aria-labelledby="footer-filters">
            <h2 id="footer-filters" className="text-section-title font-semibold">
              Filters
            </h2>
            {/* Labels remain non-interactive until filtering is implemented. */}
            <ul className="mt-4 space-y-2 text-sm text-on-dark-muted">
              {["All", "Electronics", "Clothing", "Home"].map((category) => (
                <li key={category}>{category}</li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="footer-about">
            <h2 id="footer-about" className="text-section-title font-semibold">
              About Us
            </h2>
            <p className="mt-4 max-w-64 text-sm leading-relaxed text-on-dark-muted">
              WhatBytes Store is a frontend assignment demo for electronics,
              clothing, and home essentials.
            </p>
          </section>
          <nav aria-labelledby="footer-social" className="col-span-2 sm:col-span-1">
            <h2 id="footer-social" className="text-section-title font-semibold">
              Follow Us
            </h2>
            <ul className="mt-3 flex gap-1">
              {socialLinks.map(({ label, href, icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={`Visit ${label} (opens in a new tab)`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-11 items-center justify-center rounded-full transition-colors hover:bg-white/10"
                  >
                    <span className="flex size-8 items-center justify-center rounded-full bg-accent">
                      <SocialIcon name={icon} />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-8 text-caption text-on-dark-muted">
          © 2026 WhatBytes Store
        </p>
      </PageContainer>
    </footer>
  );
}
