import Link from "next/link";
import WireDivider from "@/components/WireDivider";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

function TigerLilyIllustration() {
  // A hand-drawn-style tiger lily — her favorite flower — built from the
  // same curved-line wire language as the divider. Six recurved
  // (backward-curling) petals in tiger-lily orange with dark speckles,
  // and long stamens with anthers at the tips.
  const petalAngles = [0, 60, 120, 180, 240, 300];

  return (
    <svg viewBox="0 0 400 400" className="h-auto w-full max-w-md" aria-hidden="true">
      <line
        x1="200"
        y1="220"
        x2="175"
        y2="380"
        stroke="#3D5A45"
        strokeWidth="4"
        strokeLinecap="round"
        pathLength="1"
        className="hero-flower-draw"
        style={{ "--draw-delay": "0s" } as React.CSSProperties}
      />

      <g className="hero-flower-sway">
        {petalAngles.map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const tipX = 200 + 95 * Math.cos(rad);
          const tipY = 220 + 95 * Math.sin(rad) * 0.9;
          // Recurved tip: the petal end curls back toward the center,
          // which is the tiger lily's signature silhouette.
          const curlX = 200 + 130 * Math.cos(rad);
          const curlY = 220 + 130 * Math.sin(rad) * 0.9;
          const delay = `${0.35 + i * 0.12}s`;

          return (
            <g key={angle}>
              <path
                d={`M200,220 Q ${200 + 60 * Math.cos(rad)},${220 + 60 * Math.sin(rad) * 0.9} ${tipX},${tipY} Q ${curlX},${curlY} ${200 + 70 * Math.cos(rad)},${220 + 70 * Math.sin(rad) * 0.9 - 10}`}
                fill="none"
                stroke="#E07A3E"
                strokeWidth="9"
                strokeLinecap="round"
                pathLength="1"
                className="hero-flower-draw"
                style={{ "--draw-delay": delay } as React.CSSProperties}
              />
              {/* speckles near the petal throat, like a real tiger lily —
                  they bloom in just after their petal finishes drawing */}
              <circle
                cx={200 + 45 * Math.cos(rad)}
                cy={220 + 45 * Math.sin(rad) * 0.9}
                r="2.5"
                fill="#3A2E2A"
                className="hero-flower-bloom"
                style={{ "--draw-delay": `${0.35 + i * 0.12 + 0.5}s` } as React.CSSProperties}
              />
              <circle
                cx={200 + 60 * Math.cos(rad)}
                cy={220 + 60 * Math.sin(rad) * 0.9}
                r="2"
                fill="#3A2E2A"
                className="hero-flower-bloom"
                style={{ "--draw-delay": `${0.35 + i * 0.12 + 0.55}s` } as React.CSSProperties}
              />
            </g>
          );
        })}

        {/* long curved stamens with anthers at the tips */}
        {[20, 90, 160, 230].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x2 = 200 + 55 * Math.cos(rad);
          const y2 = 220 + 55 * Math.sin(rad) * 0.7;
          const delay = `${1.3 + i * 0.1}s`;
          return (
            <g key={angle}>
              <path
                d={`M200,220 Q ${200 + 20 * Math.cos(rad)},${220 + 20 * Math.sin(rad)} ${x2},${y2}`}
                fill="none"
                stroke="#C99A4B"
                strokeWidth="2"
                strokeLinecap="round"
                pathLength="1"
                className="hero-flower-draw"
                style={{ "--draw-delay": delay } as React.CSSProperties}
              />
              <ellipse
                cx={x2}
                cy={y2}
                rx="5"
                ry="3"
                fill="#8B4A2B"
                className="hero-flower-bloom"
                style={{ "--draw-delay": `${1.3 + i * 0.1 + 0.15}s` } as React.CSSProperties}
              />
            </g>
          );
        })}

        <circle
          cx="200"
          cy="220"
          r="10"
          fill="#C99A4B"
          className="hero-flower-bloom"
          style={{ "--draw-delay": "0.3s" } as React.CSSProperties}
        />
      </g>

      <path
        d="M120,330 Q145,310 170,325"
        fill="none"
        stroke="#3D5A45"
        strokeWidth="3"
        strokeLinecap="round"
        pathLength="1"
        className="hero-flower-draw"
        style={{ "--draw-delay": "0.15s" } as React.CSSProperties}
      />
    </svg>
  );
}

export default function HomePage() {
  const featured = products.slice(0, 3);

  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div>
          <p className="font-hand text-2xl text-rose">handmade, one twist at a time</p>
          <h1 className="mt-2 font-display text-5xl leading-tight text-ink md:text-6xl">
            Flowers that never wilt, wired by hand.
          </h1>
          <p className="mt-6 max-w-md font-body text-ink/70">
            Every stem in a Blume by Binu bouquet is shaped from fuzzy wire-
            twisted, bent, and finished by hand. No water needed, no petals
            fall, just a small bit of garden that lasts.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              href="/shop"
              className="rounded-full bg-green px-6 py-3 font-body text-sm font-medium text-bg transition hover:bg-green-dark"
            >
              Shop the collection
            </Link>
            <Link
              href="/checkout"
              className="rounded-full border border-green px-6 py-3 font-body text-sm font-medium text-green transition hover:bg-green/5"
            >
              Request a custom piece
            </Link>
          </div>
        </div>
        <div className="flex justify-center">
          <TigerLilyIllustration />
        </div>
      </section>

      <WireDivider />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-3xl text-ink">A few favorites</h2>
        <p className="mt-2 font-body text-ink/60">
          A small taste of what's in the shop right now.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
