import Image from "next/image";

export function MediaFrame({
  src,
  alt,
  className = "",
  framed = true,
  wash = false,
}: {
  src: string;
  alt: string;
  className?: string;
  framed?: boolean;
  wash?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden ${wash ? "bg-surface" : "bg-background"} ${framed ? "border border-line" : ""} ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        sizes="(min-width: 1024px) 960px, 100vw"
        className="media-zoom object-cover"
      />
    </div>
  );
}
