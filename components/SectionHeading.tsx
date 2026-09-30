type SectionHeadingProps = {
  index?: string;
  label?: string;
  title: string;
  titleAs?: "h1" | "h2";
  size?: "display" | "label";
  intro?: string;
  id?: string;
  className?: string;
};

export function SectionHeading({
  index,
  label,
  title,
  titleAs = "h2",
  size = "display",
  intro,
  id,
  className = "",
}: SectionHeadingProps) {
  const Title = titleAs;

  return (
    <header className={className}>
      {index ? <p className="font-mono text-[13px] text-accent-text">{index}</p> : null}
      {label ? (
        <p
          className={`${index ? "mt-3" : ""} text-[11px] font-medium uppercase tracking-[0.22em] text-muted`}
        >
          {label}
        </p>
      ) : null}
      <Title
        id={id}
        className={
          size === "display"
            ? "mt-5 max-w-full text-[clamp(2.4rem,11vw,7rem)] font-medium uppercase leading-[0.86] tracking-[-0.045em]"
            : `${index || label ? "mt-3" : ""} text-[11px] font-medium uppercase tracking-[0.22em] text-muted`
        }
      >
        {title}
      </Title>
      {intro ? (
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">{intro}</p>
      ) : null}
    </header>
  );
}
