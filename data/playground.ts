export type Experiment = {
  number: string;
  title: string;
  description: string;
  technology: string;
  image: string;
};

export const experiments: Experiment[] = [
  {
    number: "01",
    title: "UI Animation",
    description:
      "A study in timing and easing, and how a small motion can make a state change easier to follow.",
    technology: "CSS",
    image: "/images/play-01.svg",
  },
  {
    number: "02",
    title: "Interactive Card",
    description:
      "A component that responds to the pointer while the content stays readable and still.",
    technology: "React",
    image: "/images/play-02.svg",
  },
  {
    number: "03",
    title: "Landing Page Experiment",
    description:
      "A layout test for type scale, spacing, and a single call to action.",
    technology: "Next.js",
    image: "/images/play-03.svg",
  },
  {
    number: "04",
    title: "Loading Animation",
    description:
      "A quiet loading state that holds the layout while content is on its way.",
    technology: "CSS",
    image: "/images/play-04.svg",
  },
  {
    number: "05",
    title: "Micro Interaction",
    description:
      "Button, toggle, and hover details practiced at a small scale.",
    technology: "TypeScript",
    image: "/images/play-05.svg",
  },
  {
    number: "06",
    title: "Creative React Component",
    description:
      "An interface experiment for trying a composition before it belongs in a project.",
    technology: "React",
    image: "/images/play-06.svg",
  },
];
