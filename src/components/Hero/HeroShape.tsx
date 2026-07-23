/**
 * Decorative "coolshapes moon-13" gradient blob (from coolshapes.io), recoloured
 * to the Nidham logo palette (plum #6E1B45 / dark maroon #5C1638 / gold #C79A2E).
 * Purely ornamental — rendered aria-hidden and sized to fill its parent, which
 * handles positioning.
 *
 * The slow rotation is self-contained here: the whole <svg> spins once every 18s
 * on a linear loop about its own centre (default transform-origin), so the shape
 * auto-rotates wherever it is placed — the parent no longer owns the spin. Paused
 * under prefers-reduced-motion via `motion-reduce:animate-none`.
 */
export default function HeroShape() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 200 200"
      className="h-full w-full animate-[spin_18s_linear_infinite] motion-reduce:animate-none"
      aria-hidden="true"
    >
      <g clipPath="url(#cs_clip_1_moon-13)">
        <mask
          id="cs_mask_1_moon-13"
          style={{ maskType: "alpha" }}
          width="200"
          height="200"
          x="0"
          y="0"
          maskUnits="userSpaceOnUse"
        >
          <path
            fill="#fff"
            d="M0 0c0 55.228 44.772 100 100 100C44.772 100 0 144.772 0 200c55.228 0 100-44.772 100-100 0 55.228 44.772 100 100 100 0-55.22-44.758-99.987-99.976-100C155.242 99.987 200 55.22 200 0c-55.228 0-100 44.772-100 100C100 44.772 55.228 0 0 0z"
          />
        </mask>
        <g mask="url(#cs_mask_1_moon-13)">
          <path fill="#fff" d="M200 0H0v200h200V0z" />
          <path fill="#6E1B45" fillOpacity="0.5" d="M200 0H0v200h200V0z" />
          <g filter="url(#filter0_f_748_4444)">
            <ellipse cx="106" cy="22.5" fill="#C79A2E" rx="88" ry="49.5" />
            <ellipse cx="64.5" cy="155" fill="#9C2A5E" rx="64.5" ry="45" />
            <path fill="#5C1638" d="M218 126H100v120h118V126z" />
          </g>
        </g>
      </g>
      <defs>
        <filter
          id="filter0_f_748_4444"
          width="378"
          height="433"
          x="-80"
          y="-107"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_748_4444"
            stdDeviation="40"
          />
        </filter>
        <clipPath id="cs_clip_1_moon-13">
          <path fill="#fff" d="M0 0H200V200H0z" />
        </clipPath>
      </defs>
      <g style={{ mixBlendMode: "overlay" }} mask="url(#cs_mask_1_moon-13)">
        <path
          fill="gray"
          stroke="transparent"
          d="M200 0H0v200h200V0z"
          filter="url(#cs_noise_1_moon-13)"
        />
      </g>
      <defs>
        <filter
          id="cs_noise_1_moon-13"
          width="100%"
          height="100%"
          x="0%"
          y="0%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence
            baseFrequency="0.6"
            numOctaves="5"
            result="out1"
            seed="4"
          />
          <feComposite
            in="out1"
            in2="SourceGraphic"
            operator="in"
            result="out2"
          />
          <feBlend in="SourceGraphic" in2="out2" mode="overlay" result="out3" />
        </filter>
      </defs>
    </svg>
  );
}
