import Link from "next/link";
import { BrandMark, LeafGlyph, SocialIcons } from "@/components/icons";

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/care", label: "Care Guide" },
  { href: "/journal", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer__row">
          <Link className="brand footer__brand" href="/">
            <span className="brand__mark">
              <BrandMark />
            </span>
            <span className="brand__text">
              <span className="brand__name">Leaf &amp; Root</span>
              <span className="brand__tag">Bonsai for a Greener Tomorrow</span>
            </span>
          </Link>

          <nav className="footer__nav" aria-label="Footer">
            <ul>
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="socials footer__social">
            <SocialIcons />
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {year} Leaf &amp; Root. All rights reserved.</p>
          <p className="footer__hand">
            Small trees. Big stories.
            <LeafGlyph width={20} height={20} />
          </p>
        </div>
      </div>
    </footer>
  );
}
