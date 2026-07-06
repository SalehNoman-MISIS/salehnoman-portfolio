export const about = {
  bio: [
    "I'm a Data Science M.Sc. graduate from NUST MISIS (Honors / Red Diploma, GPA 5.0/5.0). I design and build the full pipeline — from resilient web scraping and data cleaning to machine-learning models and the apps that put them to work.",
    "My Master's thesis built a hybrid rule-based + ML engine that detected the Applicant Tracking System of every Fortune 500 company with 100% coverage. Day to day I lead multi-source job-data ingestion at a data company, and I previously built the official scraping-template library for a desktop web-automation platform.",
    "I work fluidly with AI coding assistants (Claude, GPT SDKs) to design agentic tooling and prototype quickly — moving faster without losing rigor. Fluent in English, native Arabic, working Russian.",
  ],
  facts: [
    "Based in Moscow, Russia",
    "6+ years across data, automation & IT",
    "Ships end-to-end, from scraper to UI",
  ],
} as const;

export const highlights = [
  { value: "5.0 / 5.0", label: "GPA — M.Sc. Data Science, Red Diploma (Honors)", icon: "award" },
  { value: "100%", label: "Fortune-500 ATS detection (500 / 500)", icon: "target" },
  { value: "8+", label: "Shipped projects — ML, scraping, full-stack, desktop", icon: "layers" },
  { value: "6+ yrs", label: "Across data, automation and IT support", icon: "clock" },
] as const;
