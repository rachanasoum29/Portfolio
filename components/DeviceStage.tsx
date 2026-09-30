import Image from "next/image";
import Link from "next/link";

const viewCaseClass =
  "group inline-flex min-h-11 items-center gap-2 rounded-full border border-accent bg-accent px-5 text-[0.75rem] font-medium uppercase tracking-[0.16em] text-on-accent transition-[background-color,translate] duration-200 hover:bg-accent-hover motion-safe:hover:-translate-y-0.5";

export function DeviceStage({
  src,
  title,
  year,
  href,
  number,
  summary,
  tech,
}: {
  src: string;
  title: string;
  year?: string;
  href: string;
  number?: string;
  summary?: string;
  tech?: string;
}) {
  return (
    <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-[#141211]">
      <PaperPlane />
      <div className="absolute top-4 right-4 z-30 flex flex-col items-end gap-2 sm:top-6 sm:right-6 sm:gap-3">
        <Link href={href} className={viewCaseClass}>
          View case
          <span aria-hidden="true" className="arrow-shift">
            ↗
          </span>
        </Link>
      </div>
      <div className="relative mx-auto flex w-full max-w-5xl items-end justify-center px-3 pt-28 pb-28 sm:px-8 sm:pt-24 sm:pb-36">
        <Phone src={src} title={title} />
        <Laptop src={src} title={title} />
      </div>
      {number ? (
        <div className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-[#141211] via-[#141211]/92 to-transparent px-5 pt-20 pb-5 sm:px-8 sm:pt-28 sm:pb-7">
          <div className="flex items-end justify-between gap-6">
            <p className="font-mono text-sm text-accent">{number}</p>
            {year ? (
              <p className="shrink-0 text-[11px] tracking-[0.16em] text-[#B8AAA6] sm:text-sm">{year}</p>
            ) : null}
          </div>
          <h2 className="mt-2 max-w-[14em] text-[clamp(1.6rem,3vw,2.6rem)] font-medium uppercase leading-[0.95] tracking-[-0.03em] text-[#FFF8F5]">
            {title}
          </h2>
          {tech ? (
            <p className="mt-3 max-w-xl font-mono text-[12px] leading-relaxed text-[#B8AAA6]">{tech}</p>
          ) : null}
          {summary ? (
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#D9CBC7]">{summary}</p>
          ) : null}
        </div>
      ) : year ? (
        <p className="absolute right-5 bottom-4 z-30 text-[11px] tracking-[0.16em] text-[#B8AAA6] sm:right-8 sm:bottom-6 sm:text-sm">
          {year}
        </p>
      ) : null}
    </div>
  );
}

function Phone({ src, title }: { src: string; title: string }) {
  return (
    <div className="relative z-20 w-[32%] max-w-[200px] translate-y-3 -rotate-[8deg]">
      <div className="rounded-[1.5rem] bg-[#1c1c1c] p-1.5 shadow-[0_22px_50px_rgba(0,0,0,0.45)] ring-1 ring-white/10 sm:rounded-[1.8rem] sm:p-2">
        <div className="relative aspect-[9/19] overflow-hidden rounded-[1.2rem] bg-black sm:rounded-[1.45rem]">
          <Image
            src={src}
            alt=""
            fill
            unoptimized
            sizes="200px"
            className="media-zoom object-cover object-left-top"
          />
          <span className="sr-only">{title} on a phone</span>
          <span aria-hidden="true" className="absolute top-1.5 left-1/2 h-3 w-10 -translate-x-1/2 rounded-full bg-black sm:h-4 sm:w-12" />
        </div>
      </div>
    </div>
  );
}

function Laptop({ src, title }: { src: string; title: string }) {
  return (
    <div className="relative z-10 -ml-[8%] w-[78%] max-w-[680px] rotate-[3deg]">
      <div className="rounded-t-xl bg-[#d5d6d8] p-1.5 shadow-[0_28px_60px_rgba(0,0,0,0.4)] sm:rounded-t-2xl sm:p-2">
        <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-black sm:rounded-lg">
          <Image
            src={src}
            alt=""
            fill
            unoptimized
            sizes="(min-width: 1024px) 680px, 80vw"
            className="media-zoom object-cover"
          />
          <span className="sr-only">{title} on a laptop</span>
          <span aria-hidden="true" className="absolute top-1 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-zinc-700" />
        </div>
      </div>
      <div aria-hidden="true" className="h-2 bg-[#c5c7ca] sm:h-3" />
      <div aria-hidden="true" className="relative mx-auto h-3 w-[108%] -translate-x-[3%] rounded-b-xl bg-[#b7b9bc] sm:h-4">
        <span className="absolute top-1 left-1/2 h-1.5 w-14 -translate-x-1/2 rounded-sm bg-[#a6a8ab] sm:w-20" />
      </div>
    </div>
  );
}

function PaperPlane() {
  return (
    <svg
      viewBox="0 0 88 64"
      aria-hidden="true"
      className="pointer-events-none absolute top-8 left-[6%] z-20 h-12 w-16 text-[#FFF8F5] sm:top-12 sm:h-16 sm:w-20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path d="M8 36c10-2 16-8 18-16" strokeDasharray="1.5 4" />
      <path d="M30 28 L78 10 L52 54 L42 36 Z" />
      <path d="M42 36 L78 10" />
    </svg>
  );
}
