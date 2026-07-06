import projectsData from "@/content/projects.json";

/**
 * Project case studies. The live source is content/projects.json (editable via
 * the /admin panel). Gallery `file` values live under public/screenshots/<slug>/.
 */
export type GalleryItem = { file: string; alt: string; caption?: string };
export type Project = {
  slug: string;
  title: string;
  order: number;
  featured: boolean;
  category: string;
  year?: string;
  oneLiner: string;
  summary: string;
  tech: string[];
  problem: string;
  approach: string;
  results: string;
  metrics: { value: string; label: string }[];
  highlights: string[];
  links: { github?: string; demo?: string };
  repoVisibility: "public" | "private";
  thumb: string;
  gallery: GalleryItem[];
  deepDive: string[];
};

export const projects: Project[] = projectsData.projects as unknown as Project[];
export const projectsByOrder = [...projects].sort((a, b) => a.order - b.order);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
