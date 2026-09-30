export const adminNavItems = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/work", label: "Work" },
  { href: "/admin/playground", label: "Playground" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/footer", label: "Footer" },
  { href: "/admin/settings", label: "Settings" },
] as const;

export function isAdminNavActive(pathname: string, href: string, exact?: boolean) {
  if (exact) {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function adminTitleForPath(pathname: string) {
  const match = [...adminNavItems]
    .reverse()
    .find((item) =>
      "exact" in item && item.exact
        ? pathname === item.href
        : pathname === item.href || pathname.startsWith(`${item.href}/`),
    );

  if (match) {
    return match.label;
  }

  if (pathname.includes("/new")) {
    return "New";
  }

  if (pathname.includes("/edit")) {
    return "Edit";
  }

  return "Admin";
}
