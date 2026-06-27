import Link from "next/link";

const links = [
  { href: "#overview", label: "Overview" },
  { href: "#platform", label: "Platform" },
  { href: "#certification", label: "Certification" },
  { href: "#download", label: "Download" },
];

export default function MonarchNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(0,0,0,0.85)] backdrop-blur-xl border-b border-[rgba(201,162,77,0.08)] py-6 px-6 md:px-12 lg:px-[60px] flex items-center justify-between">
      <Link href="/" className="font-serif text-[22px] tracking-widest3 text-gold">
        MONARCH
      </Link>

      <div className="hidden md:flex items-center gap-10">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-[12px] uppercase tracking-widest4 text-grey hover:text-gold transition-colors duration-300"
          >
            {link.label}
          </a>
        ))}
      </div>

      <Link
        href="/request-access"
        className="text-[11px] uppercase tracking-widest4 text-gold border border-[rgba(139,110,47,1)] px-6 py-2.5 transition-all duration-400 hover:bg-gold hover:text-black"
      >
        Request Access
      </Link>
    </nav>
  );
}
