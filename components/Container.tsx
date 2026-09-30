export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full min-w-0 max-w-[1400px] px-5 sm:px-8 lg:px-14 ${className}`}
    >
      {children}
    </div>
  );
}
