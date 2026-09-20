import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/** The mark: a small bonsai — a cloud-canopy tree in a shallow pot. */
export function BrandMark({ size = 32, ...props }: IconProps & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      {/* Canopy: three soft lobes with a flat underside. */}
      <path
        d="M16 4.2c.9 0 1.8.3 2.5.9.8-.7 2-1.1 3.2-1.1 2.5 0 4.5 1.9 4.7 4.3 1.8.5 3 2 3 3.8 0 2.2-1.8 3.9-4 3.9H6.6c-2.2 0-4-1.7-4-3.9 0-1.8 1.2-3.3 3-3.8C5.8 5.9 7.8 4 10.3 4c1.2 0 2.4.4 3.2 1.1.7-.6 1.6-.9 2.5-.9z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      {/* Trunk and shallow pot. */}
      <path
        d="M16 15.2V22"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M9.6 22h12.8l-1.6 5.6H11.2z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LeafGlyph(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M3 21C3 12 9 5 21 4c0 12-7 17-15 17H3z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M3 21c3.4-6 8-9.6 14-11.4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Imperfect, hand-drawn underline used beneath eyebrow notes. */
export function RuleSquiggle(props: IconProps) {
  return (
    <svg viewBox="0 0 90 9" fill="none" aria-hidden="true" {...props}>
      <path
        d="M1 6.5C14 2.4 26 7.6 39 4.2 52 .8 64 7.4 78 3.6c4-1 8-1.2 11-.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ArrowSquiggle(props: IconProps) {
  return (
    <svg viewBox="0 0 70 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M2 3c10 8 20 9 30 4 8-4 15-3 22 3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M49 10 54 17 59 10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Healthy & well-cared for — a seedling rooted in rich soil. */
export function IconSeedling(props: IconProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M10.5 33h19" />
      <path d="M20 33V19.5" />
      <path d="M20 25c-6.6 0-11.6-4.7-12.4-11 6.8.2 11.9 4.8 12.4 11z" />
      <path d="M20 25c6.6 0 11.6-4.7 12.4-11-6.8.2-11.9 4.8-12.4 11z" />
    </svg>
  );
}

/** Safe shipping worldwide — a delivery van. */
export function IconDelivery(props: IconProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M4 13h16.5v12H4z" />
      <path d="M20.5 17h5.4l5.1 4.3V25H20.5z" />
      <circle cx="11" cy="27.5" r="2.6" />
      <circle cx="26" cy="27.5" r="2.6" />
    </svg>
  );
}

/** Support for every step — a heart cradled in cupped hands. */
export function IconSupport(props: IconProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M20 10.6c-1.9-2.6-5.6-2.1-5.6.8 0 2.4 3.2 4.3 5.6 6.1 2.4-1.8 5.6-3.7 5.6-6.1 0-2.9-3.7-3.4-5.6-.8z" />
      <path d="M8 22.6c0-2.2 1.8-4 4-4h2.2" />
      <path d="M8 22.6c0 5.2 5.4 9.4 12 9.4s12-4.2 12-9.4" />
      <path d="M32 22.6c0-2.2-1.8-4-4-4h-2.2" />
    </svg>
  );
}

/** Nature in your space — a potted tree. */
export function IconPottedTree(props: IconProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M20 27.5V15" />
      <path d="M20 21c-6.2 0-10.9-4.4-11.6-10.4 6.4.2 11.2 4.5 11.6 10.4z" />
      <path d="M20 21c6.2 0 10.9-4.4 11.6-10.4-6.4.2-11.2 4.5-11.6 10.4z" />
      <path d="M10.6 27.5h18.8" />
      <path d="M12.2 27.5h15.6l-1.7 6H13.9z" />
    </svg>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

export function IconHeart(props: IconProps) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 20s-7-4.4-7-9.5A3.9 3.9 0 0 1 12 7.6 3.9 3.9 0 0 1 19 10.5C19 15.6 12 20 12 20z" />
    </svg>
  );
}

export function IconBasket(props: IconProps) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M6 8h12l-1.2 11.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 8z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </svg>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M3 7h18M3 12h18M3 17h13" />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M4 12.5 9 17.5 20 6.5" />
    </svg>
  );
}

export function IconClose(props: IconProps) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

/** Tiny botanical leaf used beside form labels. */
export function IconLeafTiny(props: IconProps) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M4 20c0-8 6-14 16-15 0 11-6 16-13 16H4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M4 20c3-5 7-8 12-10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconPin(props: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

export function IconMail(props: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M4 6h16v12H4z" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function IconPhone(props: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M5 4h4l2 5-2.5 1.6a12 12 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1.1 1A16 16 0 0 1 4 5.1 1 1 0 0 1 5 4z" />
    </svg>
  );
}
