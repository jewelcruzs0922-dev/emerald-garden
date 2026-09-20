import Link from "next/link";
import type { ComponentProps } from "react";
import { BrandMark } from "@/components/icons";

type LinkProps = ComponentProps<typeof Link>;

interface BrandProps {
  /** Make the brand a link (default: true). Pass `false` for a non-link wrapper. */
  linked?: boolean;
  /** Additional props forwarded to the underlying `<Link>` when `linked` is true. */
  linkProps?: Partial<LinkProps>;
  /** Click handler (e.g. closing a mobile nav on navigate). */
  onClick?: LinkProps["onClick"];
}

export default function Brand({ linked = true, linkProps, onClick }: BrandProps) {
  const inner = (
    <>
      <span className="brand__mark">
        <BrandMark />
      </span>
      <span className="brand__text">
        <span className="brand__name">Emerald Garden</span>
        <span className="brand__tag">Bonsai for a Greener Tomorrow</span>
      </span>
    </>
  );

  if (!linked) return <span className="brand">{inner}</span>;

  return (
    <Link className="brand" href="/" onClick={onClick} {...linkProps}>
      {inner}
    </Link>
  );
}
