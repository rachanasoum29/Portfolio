import { MediaFrame } from "@/components/MediaFrame";
import { popStyle } from "@/components/popStyle";
import type { PortfolioExperiment } from "@/lib/portfolio";

export function PlaygroundCard({
  experiment,
  span,
  aspect,
  soft = false,
  index = 0,
}: {
  experiment: PortfolioExperiment;
  span: string;
  aspect: string;
  soft?: boolean;
  index?: number;
}) {
  return (
    <article
      className={`pop group overflow-hidden border border-line transition-colors duration-300 hover:border-accent ${span}`}
      style={popStyle(index)}
    >
      <MediaFrame
        src={experiment.image}
        alt={experiment.title}
        framed={false}
        wash={soft}
        className={`aspect-video ${aspect}`}
      />
    </article>
  );
}
