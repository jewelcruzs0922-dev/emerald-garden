import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function BrandMark({ size = 32, ...props }: IconProps & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      {/* Badge follows currentColor — forest in the header, sage in the footer */}
      <circle cx="50" cy="50" r="49" fill="currentColor" />
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="#fff"
        strokeWidth="1.5"
        opacity="0.9"
      />
      <circle
        cx="50"
        cy="50"
        r="41.5"
        fill="none"
        stroke="#fff"
        strokeWidth="0.6"
        opacity="0.35"
      />
      <g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round">
        <path d="M50.5 70c-.5-7 3.5-11 2-18.5" strokeWidth="3" opacity="0.95" />
        <path d="M52 54c3.5-1.5 7.5-3.5 11-5.5" strokeWidth="1.8" opacity="0.85" />
        <path d="M49.5 59c-3.5-.6-7-1.8-10.5-3.2" strokeWidth="1.6" opacity="0.85" />
        <path d="M51.5 46c-.8-2.5-.4-5.5 1-8.5" strokeWidth="1.7" opacity="0.85" />
      </g>
      <path
        fill="#fff"
        d="M50 19.5c8.8 0 16.4 5.2 18.2 12.8 1 4.4-1.2 8.8-5.5 10.4l-25.4.2c-4.5-1.5-6.9-6-6.1-10.5C32.5 24.7 40.5 19.5 50 19.5z"
      />
      <path
        fill="#fff"
        d="M32.5 47c4.8-.2 8.6 2.6 9.2 6.6.6 4-2.4 7.6-6.9 8.3-4.7.7-9-2.1-9.8-6.3-.8-4.4 2.7-8.4 7.5-8.6z"
      />
      <path
        fill="#fff"
        d="M67 43.5c4.5.1 8 3.2 7.9 7.1-.2 4-3.9 7-8.2 6.7-4.4-.3-7.6-3.9-7.3-7.9.3-3.8 3.6-6.7 7.6-5.9z"
      />
      <path
        fill="#fff"
        d="M47.2 71c-.6-6.5 3.2-10.2 2.1-16.8-.7-4.4-3.4-6.7-2.6-11.2l4.8.6c-.7 3.6 1.5 5.7 2.2 9.6 1.2 6.4-2.4 10.2-1.9 16.7l-4.6 1.1z"
      />
      <path
        fill="#fff"
        d="M36.5 72.5h27c.7 0 1.2.6 1.1 1.3l-1.5 8.2c-.2 1-1 1.7-2 1.7H38.9c-1 0-1.8-.7-2-1.7l-1.5-8.2c-.1-.7.4-1.3 1.1-1.3z"
      />
      <rect x="33.5" y="69" width="33" height="4.5" rx="1.6" fill="#fff" />
      <path
        d="M41.5 84.7h5.2v1.8c0 .7-.5 1.2-1.2 1.2h-2.8c-.7 0-1.2-.5-1.2-1.2v-1.8zm11.8 0h5.2v1.8c0 .7-.5 1.2-1.2 1.2h-2.8c-.7 0-1.2-.5-1.2-1.2v-1.8z"
        fill="currentColor"
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
    <svg viewBox="0 0 70 14" fill="none" aria-hidden="true" {...props}>
      <path
        d="M2 3c10 8 20 9 30 4 8-4 15-3 22 3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M47 12.6 55.5 9 54 14.5"
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
