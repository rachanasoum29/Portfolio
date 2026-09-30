import type { SimpleIcon } from "simple-icons";

export function SkillMark({
  icon,
  name,
  index = 0,
}: {
  icon: SimpleIcon;
  name: string;
  index?: number;
}) {
  return (
    <span
      className="skill-mark inline-flex size-11 items-center justify-center"
      title={name}
      style={{
        animationDelay: `${index * 45}ms`,
        animationRange: `entry ${index * 1.5}% cover ${18 + index * 1.5}%`,
      }}
    >
      <svg viewBox="0 0 24 24" className="size-8" role="img" aria-label={name}>
        <path d={icon.path} fill={markColor(icon.hex)} />
      </svg>
    </span>
  );
}

function markColor(hex: string) {
  const value = Number.parseInt(hex, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;

  return luminance < 48 ? "#FFFFFF" : `#${hex}`;
}
