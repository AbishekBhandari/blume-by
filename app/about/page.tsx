import Image from "next/image";
import WireDivider from "@/components/WireDivider";

function FlowerWreath() {
  // Small wire-style flowers scattered around the photo, echoing the same
  // hand-drawn curved-line language as the rest of the site — a wreath
  // instead of a plain ring.
  const flowers = [
    { angle: 0, radius: 152, scale: 1, color: "#D98A82" },
    { angle: 40, radius: 158, scale: 0.75, color: "#C99A4B" },
    { angle: 80, radius: 150, scale: 0.9, color: "#E07A3E" },
    { angle: 130, radius: 156, scale: 0.7, color: "#D98A82" },
    { angle: 175, radius: 150, scale: 1, color: "#C99A4B" },
    { angle: 220, radius: 158, scale: 0.8, color: "#E07A3E" },
    { angle: 265, radius: 150, scale: 0.75, color: "#D98A82" },
    { angle: 305, radius: 156, scale: 0.9, color: "#C99A4B" },
  ];
  const petalAngles = [0, 72, 144, 216, 288];

  return (
    <svg viewBox="0 0 320 320" className="absolute -inset-3 sm:-inset-6 -z-10" aria-hidden="true">
      {flowers.map(({ angle, radius, scale, color }, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 160 + radius * Math.cos(rad);
        const cy = 160 + radius * Math.sin(rad);
        return (
          <g key={i} transform={`translate(${cx},${cy}) scale(${scale})`}>
            {/* short wire stem reaching toward the photo */}
            <line
              x1="0"
              y1="0"
              x2={-14 * Math.cos(rad)}
              y2={-14 * Math.sin(rad)}
              stroke="#3D5A45"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {petalAngles.map((pAngle) => (
              <ellipse
                key={pAngle}
                cx="0"
                cy="-9"
                rx="4.5"
                ry="8"
                fill={color}
                transform={`rotate(${pAngle})`}
              />
            ))}
            <circle cx="0" cy="0" r="3.5" fill="#3A2E2A" />
          </g>
        );
      })}
    </svg>
  );
}

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="grid gap-10 md:grid-cols-[1fr_1.3fr] md:items-center">
        <div className="relative mx-auto w-full max-w-[220px] sm:max-w-xs">
          <FlowerWreath />
          <div className="relative aspect-square overflow-hidden rounded-full ring-4 ring-surface">
            <Image
              src="/binu-portrait.jpeg"
              alt="Binu, the maker behind Blume by Binu"
              fill
              sizes="(min-width: 768px) 320px, 60vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div>
          <h1 className="font-display text-4xl text-ink">About Blume by Binu</h1>
          <p className="mt-4 font-hand text-xl text-rose">meet the maker</p>
        </div>
      </div>

      <div className="mt-10">
        <p className="font-body leading-relaxed text-ink/70">
          Every flower here starts as a plain spool of fuzzy wire — no petals,
          no color, no shape. Binu twists each one by hand into something that
          looks like it was picked from a garden, but never wilts, never needs
          water, and lasts as long as you keep it.
        </p>
        <p className="mt-4 font-body leading-relaxed text-ink/70">
          What began as a small hobby on Instagram has grown into made-to-order
          bouquets, jar arrangements, and single stems for anyone who wants a
          bit of color that sticks around.
        </p>
      </div>

      <WireDivider className="my-10" />

      <h2 className="font-display text-2xl text-ink">Get in touch</h2>
      <p className="mt-3 font-body text-ink/70">
        For custom requests, questions about an order, or just to say hi —
        find Blume by Binu on{" "}
        <a
          href="https://www.instagram.com/blumebybinu/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-rose underline"
        >
          Instagram
        </a>{" "}
        or reach out over WhatsApp.
      </p>
    </section>
  );
}
