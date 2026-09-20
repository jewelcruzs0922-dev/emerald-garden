import Link from "next/link";
import { LeafGlyph } from "@/components/icons";
import Brand from "@/components/Brand";
import { NAV_LINKS } from "@/lib/seo";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer__row">
          <Brand linkProps={{ className: "brand footer__brand" }} />

          <nav className="footer__nav" aria-label="Footer">
            <ul>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="footer__bottom">
          <p>&copy; {year} Emerald Garden. All rights reserved.</p>
          <p className="footer__hand">
            Small trees. Big stories.
            <LeafGlyph width={20} height={20} />
          </p>
        </div>
      </div>
    </footer>
  );
}
