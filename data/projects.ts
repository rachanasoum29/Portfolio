export type Project = {
  number: string;
  slug: string;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  laptopImage?: string;
  mobileImage?: string;
  year: string;
  featured: boolean;
};

export const projects: Project[] = [
  {
    number: "01",
    slug: "gss-website",
    title: "GSS Website & Admin CMS",
    description:
      "A corporate website and a content system for updating pages, sections, and site copy from one place.",
    technologies: ["Next.js", "TypeScript", "Payload CMS", "PostgreSQL"],
    image: "/uploads/projects/1791353478751-9572b9776c1c.jpg",
    laptopImage: "/uploads/projects/1791353478751-9572b9776c1c.jpg",
    mobileImage: "/uploads/projects/1791353440846-8b048b2e4413.jpg",
    year: "2025 — 2026",
    featured: true,
  },
  {
    number: "02",
    slug: "student-management-api",
    title: "Student Management API",
    description:
      "A REST API for creating and retrieving student records, with protected routes for authenticated access.",
    technologies: ["Node.js", "Express.js", "MySQL", "JWT"],
    image: "/images/project-02.svg",
    year: "2025 — 2026",
    featured: true,
  },
  {
    number: "03",
    slug: "service-booking-system",
    title: "Service Booking System",
    description:
      "A booking application for scheduling services, with a React interface backed by a Spring Boot API.",
    technologies: ["Spring Boot", "PostgreSQL", "React"],
    image: "/images/project-03.svg",
    year: "2025 — 2026",
    featured: true,
  },
  {
    number: "04",
    slug: "flutter-todo-app",
    title: "Flutter To-Do App",
    description:
      "A mobile to-do application for adding, completing, and organizing tasks on a small screen.",
    technologies: ["Flutter", "Dart"],
    image: "/images/project-04.svg",
    year: "2025 — 2026",
    featured: false,
  },
];
