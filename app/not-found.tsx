import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="grid min-h-[70vh] place-items-center px-5" style={{ background: "linear-gradient(180deg, var(--header-tint) 0%, var(--page) 45%)" }}>
        <div className="text-center">
          <p className="text-7xl font-extrabold tracking-tight text-[var(--accent)] sm:text-8xl">404</p>
          <h1 className="mt-4 text-2xl font-bold text-[var(--navy)]">Page not found</h1>
          <p className="mx-auto mt-3 max-w-md text-[var(--muted)]">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
          <div className="mt-8 flex justify-center gap-3">
            <a href="/" className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]">
              <Icon name="arrow-left" size={18} /> Back home
            </a>
            <a href="/#projects" className="inline-flex items-center gap-2 rounded-full border border-[var(--hairline)] bg-[var(--pill-bg)] px-5 py-2.5 text-sm font-semibold text-[var(--navy)] transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]">
              View projects
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
