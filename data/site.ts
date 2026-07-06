/**
 * Global site metadata + contact info.
 * Edit these to update the name, tagline, links and SEO defaults site-wide.
 */
export const site = {
  name: "Saleh Noman",
  monogram: "SN",
  role: "Data Scientist · Data & Automation Engineer",
  tagline: "Web Scraping / ETL · Machine Learning · AI-Assisted Development",
  valueProp:
    "I build end-to-end machine-learning, web-scraping and ETL systems — and ship production tools fast with AI coding assistants.",
  description:
    "Saleh Noman — Data Scientist and Data & Automation Engineer (M.Sc. Data Science, NUST MISIS, Red Diploma). I design and build the full pipeline: resilient web scraping, ETL with real quality gates, ML models, and the apps that put them to work.",
  location: "Moscow, Russia",
  locationDetail: "Moscow, Russia (Dolgoprudny)",
  email: "salehnoman22@gmail.com",
  phone: "+7 900 159-71-98",
  /** Replace /public/headshot.png with your own square photo (~600×600) to use a real headshot. */
  headshot: "/headshot.png",
  links: {
    linkedin: "https://www.linkedin.com/in/salehnoman/",
    github: "https://github.com/SalehNoman-MISIS",
  },
  resume: {
    en: "/resume/Saleh_Noman_Resume_EN_Visual.pdf",
    ru: "/resume/Saleh_Noman_Resume_RU_Visual.pdf",
  },
  openTo:
    "Open to Data Science, ML Engineering, Data / Automation Engineering, Web Scraping, Full-stack and IT Support roles — Moscow and remote.",
} as const;

export const navLinks = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
] as const;
