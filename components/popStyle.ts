export function popStyle(index: number) {
  return { animationDelay: `${index * 80}ms` };
}

export function popOnScroll(index: number) {
  const start = index * 6;
  return {
    animationDelay: `${index * 80}ms`,
    animationRange: `entry ${start}% cover ${24 + start}%`,
  };
}
