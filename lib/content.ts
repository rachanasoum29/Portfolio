// Shapes stored in the About JSON columns.

export type AboutSkillGroup = {
  label: string;
  skills: string[];
};

export type AboutExperience = {
  role: string;
  organization: string;
  period: string;
  summary: string;
};

export type AboutEducation = {
  program: string;
  institution: string;
  period: string;
};
