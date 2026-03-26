"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Building2, Package, Truck, Ruler } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Departments", href: "/departments", icon: Building2 },
  { name: "Users", href: "/users", icon: Users },
  { name: "Suppliers", href: "/suppliers", icon: Truck },
  { name: "Materials", href: "/materials", icon: Package },
  { name: "UOM", href: "/uom", icon: Ruler },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 border-r border-gray-200 bg-white shadow-sm ring-1 ring-gray-900/5 min-h-screen pt-4 pb-6 px-3 flex flex-col gap-6 relative z-10 hidden md:flex">
      <div className="flex items-center gap-2 px-3 mb-4">
        <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-sm">
          <Package className="w-4 h-4 text-gray-900" />
        </div>
        <span className="font-bold tracking-tight text-gray-900 line-clamp-1">Material<span className="text-indigo-600"> Request</span></span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        <div className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Main Menu</div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative",
                isActive
                  ? "text-gray-900 bg-indigo-50 shadow-sm border border-indigo-500/20"
                  : "text-gray-500 hover:text-gray-900 hover:bg-white/5"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
              )}
              <Icon className={clsx("w-5 h-5", isActive ? "text-indigo-600" : "text-slate-500 group-hover:text-gray-700 transition-colors")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}
