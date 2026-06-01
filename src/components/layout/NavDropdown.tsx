import Link from "next/link";
import type { NavItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface NavDropdownProps {
  item: NavItem;
}

export function NavDropdown({ item }: NavDropdownProps) {
  if (!item.items && !item.sections) {
    return (
      <Link
        href={item.href ?? "#"}
        className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm text-navy-500 hover:bg-violet-50 hover:text-violet-500 transition-colors"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="group relative">
      <button className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm text-navy-500 hover:bg-violet-50 hover:text-violet-500 transition-colors">
        {item.label}
        <svg
          className="w-2.5 h-2.5 transition-transform group-hover:rotate-180"
          viewBox="0 0 10 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <path d="M1 1l4 4 4-4" />
        </svg>
      </button>

      <div
        className={cn(
          "absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 translate-y-[-6px]",
          "bg-white border border-navy-900/[0.08] rounded-2xl shadow-lg p-3 z-[100]",
          "opacity-0 invisible pointer-events-none",
          "group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto group-hover:translate-y-0",
          "transition-all duration-150",
          item.items
            ? "min-w-[500px] grid grid-cols-2 gap-1.5"
            : "min-w-[240px]",
        )}
      >
        {/* Grid-style items */}
        {item.items?.map((dd) => (
          <Link
            key={dd.href}
            href={dd.href}
            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-violet-50 transition-colors"
          >
            <div>
              <strong className="block text-[13px] font-medium text-navy-800 mb-0.5">
                {dd.label}
              </strong>
              <span className="text-xs text-navy-400">{dd.description}</span>
            </div>
          </Link>
        ))}

        {/* Section-style items */}
        {item.sections?.map((section) => (
          <div key={section.title}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-navy-400 px-3.5 pt-1.5 pb-1">
              {section.title}
            </p>
            {section.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-3.5 py-2 rounded-md text-[13px] text-navy-500 hover:bg-violet-50 hover:text-violet-500 transition-colors"
              ></Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
