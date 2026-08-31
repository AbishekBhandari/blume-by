import WireDivider from "@/components/WireDivider";

export default function Footer() {
  return (
    <footer className="mt-24 bg-green text-bg">
      <WireDivider className="bg-bg" />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-display text-xl">Blume by Binu</p>
            <p className="mt-2 font-body text-sm text-bg/70">
              Handmade fuzzy wire flowers, twisted one stem at a time.
            </p>
          </div>
          <div>
            <p className="font-body text-sm uppercase tracking-wide text-gold">
              Reach us
            </p>
            <p className="mt-2 font-body text-sm text-bg/70">
              <a
                href="https://www.instagram.com/blumebybinu/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-bg"
              >
                @blumebybinu
              </a>{" "}
              on Instagram, or WhatsApp — number on the About page.
            </p>
          </div>
          <div>
            <p className="font-body text-sm uppercase tracking-wide text-gold">
              Care note
            </p>
            <p className="mt-2 font-body text-sm text-bg/70">
              Keep away from direct heat. Dust gently with a soft brush.
            </p>
          </div>
        </div>
        <p className="mt-10 font-body text-xs text-bg/50">
          © {new Date().getFullYear()} Blume by Binu. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
