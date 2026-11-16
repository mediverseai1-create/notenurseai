import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function Shell({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <>
      <SiteHeader dark={dark} />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}

export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <section className="bg-ink text-white">
      <div className="container-x py-20 md:py-28">
        <p className="eyebrow !text-leaf">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl">{title}</h1>
        {children && <div className="mt-6 max-w-2xl text-lg text-white/70">{children}</div>}
      </div>
    </section>
  );
}
