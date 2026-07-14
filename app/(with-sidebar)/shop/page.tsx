import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

const products = [
  {
    name: "Paper Lantern Journal",
    price: "$24",
    blurb:
      "A linen-bound notebook for sketches, notes, and the small sparks that keep a practice alive.",
    tag: "Studio essential",
  },
  {
    name: "Cedar Desk Mat",
    price: "$38",
    blurb:
      "A warm, tactile surface for tools, tea, and the rituals of making things by hand.",
    tag: "Desk ritual",
  },
  {
    name: "Pressed Herb Kit",
    price: "$18",
    blurb:
      "A collection of thoughtful little tools for preserving moments, notes, and fragments.",
    tag: "Curated object",
  },
  {
    name: "Evening Green Candle",
    price: "$28",
    blurb:
      "A slow-burning candle with a quiet scent profile designed for late work and softer evenings.",
    tag: "Slow living",
  },
    {
    name: "Pressed Kit",
    price: "$18",
    blurb:
      "A collection of thoughtful little tools for preserving moments, notes, and fragments.",
    tag: "Curated object",
  },
  {
    name: "Evening Joy Candle",
    price: "$28",
    blurb:
      "A slow-burning candle with a quiet scent profile designed for late work and softer evenings.",
    tag: "Slow living",
  },
  {
    name: "Pressed Koli Kit",
    price: "$18",
    blurb:
      "A collection of thoughtful little tools for preserving moments, notes, and fragments.",
    tag: "Curated object",
  },
  {
    name: "Evening Light Candle",
    price: "$28",
    blurb:
      "A slow-burning candle with a quiet scent profile designed for late work and softer evenings.",
    tag: "Slow living",
  }
];

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.45),_transparent_55%)] px-4 py-8 text-foreground md:px-8 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <section className="rounded-[2rem] border border-border/70 bg-background/80 p-6 shadow-sm backdrop-blur md:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                Little Scribbs
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  A creative studio creating products and experiences.
                </h1>
                <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                  We design, publish, and create experiences around reading,
                  writing, and intentional living. Our work is inspired by the
                  things we love, the people we meet, and the stories we tell.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-border/80 bg-muted/40 p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">
                Placeholder storefront
              </p>
              <p className="mt-1">
                Products shown here are examples for the visual direction.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.name}
              className="group flex h-full flex-col justify-between rounded-[1.5rem] border border-border/70 bg-background/80 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                    {product.tag}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {product.price}
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-semibold tracking-tight">
                    {product.name}
                  </h2>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {product.blurb}
                  </p>
                </div>
              </div>

              <button className="mt-6 inline-flex items-center justify-between rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted">
                Add to bag
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </button>
            </article>
          ))}
        </section>

        {/* Footer */}
        <footer className="border-t border-border/70 bg-background/40 -mx-4 -mb-8 px-4 py-12 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12">
          <div className="mx-auto max-w-6xl">
            {/* Newsletter Section */}

            {/* Links & Contact */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {/* Shop */}
              <div className="grid items-end">
                <div className="md:col-span-1">
                  <h3 className="font-medium mb-4 uppercase text-xs tracking-wider">
                    Join the Club
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Get 10% off your first order, plus occasional notes on
                    reading, writing, creativity and life from the Little
                    Scribbs studio.
                  </p>
                </div>
                <form
                  action="https://littlescribbs.substack.com/"
                  method="get"
                  target="_blank"
                  className="flex gap-2 "
                >
                  <button className="h-14 rounded-md bg-codeRed px-4 py-2 text-sm font-medium text-white whitespace-nowrap">
                    Join
                  </button>
                </form>
              </div>

              {/* Information */}
              <div>
                <h4 className="font-medium mb-4 uppercase text-xs tracking-wider">
                  Information
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="#" className="hover:text-foreground">
                      Terms & Conditions
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground">
                      Shipping & Returns
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground">
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div className="md:col-span-2">
                <h4 className="font-medium mb-4 uppercase text-xs tracking-wider">
                  Contact
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  If you have any questions regarding your order, products or
                  our service, we'd love to hear from you.
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Email:</strong>{" "}
                    <a
                      href="mailto:hello@littlescribbs.co"
                      className="hover:text-foreground"
                    >
                      hello@littlescribbs.co
                    </a>
                  </p>
                  <p>
                    <strong className="text-foreground">Phone:</strong>
                    +234 907-370-0932
                  </p>
                  <p>
                    <strong className="text-foreground">Address:</strong> Abuja,
                    Nigeria
                  </p>
                  <p>
                    <strong className="text-foreground">Hours:</strong> Mon–Fri
                    9AM–6PM, Sat 11AM–4PM
                  </p>
                </div>
              </div>
            </div>

            {/* Socials & Copyright */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-t border-border/70 pt-6">
              <p className="text-xs text-muted-foreground">
                © 2026 The Little Scribbs Creative Studios Ltd. All Rights
                Reserved.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com/littlescribbs.co"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Instagram
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  TikTok
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Facebook
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
