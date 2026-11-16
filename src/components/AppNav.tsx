"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, FileText, LayoutDashboard, PlusCircle, Settings, Users } from "lucide-react";

const items = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/app/notes/new", label: "New note", icon: PlusCircle, exact: true },
  { href: "/app/notes", label: "Notes", icon: FileText },
  { href: "/app/handoffs", label: "Handoffs", icon: Users },
  { href: "/app/billing", label: "Billing", icon: CreditCard },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export function AppNav() {
  const path = usePathname();
  return (
    <nav aria-label="App" className="flex gap-1 overflow-x-auto lg:flex-col">
      {items.map((i) => {
        const active = i.exact ? path === i.href : path.startsWith(i.href) && !(i.href === "/app/notes" && path === "/app/notes/new");
        return (
          <Link
            key={i.href}
            href={i.href}
            aria-current={active ? "page" : undefined}
            className={`flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 text-sm transition ${active ? "bg-ink text-white" : "text-ink/70 hover:bg-mist"}`}
          >
            <i.icon className="h-4 w-4" aria-hidden /> {i.label}
          </Link>
        );
      })}
    </nav>
  );
}
