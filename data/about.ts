import {
  siCss,
  siExpress,
  siFigma,
  siFlutter,
  siGit,
  siGithub,
  siHtml5,
  siMongodb,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siOpenjdk,
  siPostgresql,
  siPostman,
  siReact,
  siSpringboot,
  siTailwindcss,
  siTypescript,
  type SimpleIcon,
} from "simple-icons";

export type Skill = {
  name: string;
  icon: SimpleIcon;
};

export const skillGroups: { label: string; skills: Skill[] }[] = [
  {
    label: "Tool stack",
    skills: [
      { name: "Git", icon: siGit },
      { name: "GitHub", icon: siGithub },
      { name: "Postman", icon: siPostman },
      { name: "Figma", icon: siFigma },
    ],
  },
  {
    label: "Tech stack",
    skills: [
      { name: "HTML", icon: siHtml5 },
      { name: "CSS", icon: siCss },
      { name: "Java", icon: siOpenjdk },
      { name: "React", icon: siReact },
      { name: "Next.js", icon: siNextdotjs },
      { name: "TypeScript", icon: siTypescript },
      { name: "Tailwind CSS", icon: siTailwindcss },
      { name: "Node.js", icon: siNodedotjs },
      { name: "Express.js", icon: siExpress },
      { name: "Spring Boot", icon: siSpringboot },
      { name: "PostgreSQL", icon: siPostgresql },
      { name: "MySQL", icon: siMysql },
      { name: "MongoDB", icon: siMongodb },
      { name: "Flutter", icon: siFlutter },
    ],
  },
];

export const about = {
  paragraphs: [
    "I'm a web developer who enjoys turning ideas into simple, useful, and well-designed digital experiences.",
    "A fuller biography will replace this placeholder once personal details are added.",
  ],
  experience: [
    {
      role: "[ROLE]",
      organization: "[ORGANIZATION]",
      period: "[YEAR] — [YEAR]",
      summary: "[SHORT DESCRIPTION]",
    },
  ],
  education: [
    {
      program: "[PROGRAM]",
      institution: "[INSTITUTION]",
      period: "[YEAR] — [YEAR]",
    },
  ],
} as const;
