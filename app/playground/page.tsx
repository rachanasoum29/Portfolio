import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PlaygroundCard } from "@/components/PlaygroundCard";
import { SectionHeading } from "@/components/SectionHeading";
import { popStyle } from "@/components/popStyle";
import { experiments } from "@/data/playground";

const layouts = [
  { span: "lg:col-span-5", aspect: "lg:aspect-[4/5]" },
  { span: "lg:col-span-7", aspect: "lg:aspect-[16/10]" },
  { span: "lg:col-span-7", aspect: "lg:aspect-[16/9]" },
  { span: "lg:col-span-5", aspect: "lg:aspect-square" },
  { span: "lg:col-span-4", aspect: "lg:aspect-[3/4]" },
  { span: "lg:col-span-8", aspect: "lg:aspect-[2/1]" },
];

export const metadata: Metadata = {
  title: "Playground",
  description: "Interface experiments and layout studies.",
};

export default function PlaygroundPage() {
  return (
    <Container className="pt-16 pb-20 md:pt-24 md:pb-28 lg:pb-36">
      <div className="pop" style={popStyle(0)}>
        <SectionHeading
          label="Studio"
          title="Playground"
          titleAs="h1"
          intro="Studies in interface, motion, and layout. These experiments sit apart from project work. Images are placeholders."
        />
      </div>
      <div className="mt-14 grid grid-cols-1 gap-8 md:mt-20 lg:grid-cols-12 lg:items-start lg:gap-5">
        {experiments.map((experiment, index) => {
          const layout = layouts[index] ?? {
            span: "lg:col-span-6",
            aspect: "lg:aspect-video",
          };

          return (
            <PlaygroundCard
              key={experiment.number}
              experiment={experiment}
              span={layout.span}
              aspect={layout.aspect}
              soft={index % 2 === 0}
              index={index + 1}
            />
          );
        })}
      </div>
    </Container>
  );
}
