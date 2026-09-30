import Link from "next/link";
import { primaryButtonClass } from "@/components/linkStyles";

export function ArrowLink({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  return (
    <Link href={href} className={primaryButtonClass}>
      {children}
      <span aria-hidden="true" className="arrow-shift">
        ↗
      </span>
    </Link>
  );
}
