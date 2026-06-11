import Link from "next/link";
import { FOOTER_LINKS } from "@/lib/constants/navigation";

export function Footer() {
  return (
    <footer className="bg-navy-900 text-[#e8ecf8] px-10 pt-[72px] pb-12">
      <div className="max-w-[1120px] mx-auto">
        {/* Brand statement */}
        <div className="mb-12">
          <div className="flex items-center"></div>
          <p className="font-display italic text-[clamp(22px,2.8vw,36px)] text-[#e8ecf8] leading-snug max-w-[500px]">
            Communication Intelligence
            <br />
            for professionals, teams,
            <br />
            and relationships.
          </p>
        </div>

        {/* Nav columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-white/85 mb-3.5">
                {heading}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-white/55 hover:text-[#e8ecf8] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-white/[0.07] pt-6 flex flex-wrap justify-between items-center gap-4">
          <div>
            <p className="text-xs text-white/55">
              © 2026 Avertune. All rights reserved.
            </p>
            <p className="text-xs text-white/35 mt-0.5">
              Communication Intelligence for professionals, teams, and
              relationships.
            </p>
          </div>
          <div className="flex gap-2">
            {[
              {
                name: "facebook",
                link: "https://www.facebook.com/share/14dHpBYFpdV/",
                imgSrc: "/facebook_logo.png",
              },
              {
                name: "Instagram",
                link: "https://www.instagram.com/tryavertune",
                imgSrc: "/instagram_logo.png",
              },
              {
                name: "TikTok",
                link: "https://www.tiktok.com/@avertune",
                imgSrc: "tiktok_logo.webp",
              },
            ].map((app) => (
              <a
                key={app.name}
                href={app.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-md bg-white/[0.07] flex items-center justify-center hover:bg-white/[0.14] transition-all"
              >
                <img src={app.imgSrc} alt={app.name} className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
