export const topStrengths = [
  { label: "Python & Data (pandas, scikit-learn)", value: 95 },
  { label: "Web Scraping (Playwright, Selenium)", value: 93 },
  { label: "AI-Assisted Development (Claude / GPT SDKs)", value: 92 },
  { label: "ETL & Data Engineering", value: 88 },
  { label: "Machine Learning (CatBoost / XGBoost)", value: 85 },
  { label: "Automation (RTILA, n8n)", value: 84 },
  { label: "Full-stack (Flask / FastAPI / React)", value: 82 },
  { label: "SQL & Databases", value: 80 },
] as const;

export const skillGroups = [
  { name: "Programming", icon: "code", items: ["Python", "JavaScript", "Java", "C#", "SQL"] },
  {
    name: "Data & ML",
    icon: "chart",
    items: ["pandas", "NumPy", "scikit-learn", "XGBoost", "CatBoost", "LightGBM", "SHAP", "Feature engineering", "Cross-validation", "F1 / precision / recall"],
  },
  {
    name: "AI & LLMs",
    icon: "sparkles",
    items: ["AI-assisted development (Claude & GPT SDKs)", "Agentic tooling", "Prompt engineering", "RAG-style pipelines"],
  },
  {
    name: "Scraping & Automation",
    icon: "spider",
    items: ["Playwright", "Selenium", "Scrapling", "BeautifulSoup", "RTILA Studio", "Anti-bot / stealth", "Pagination", "n8n"],
  },
  {
    name: "Web & Full-stack",
    icon: "layout",
    items: ["Flask", "FastAPI", "React", "Node.js / Express", "Supabase", "REST APIs", "Alpine.js"],
  },
  {
    name: "Data Engineering",
    icon: "database",
    items: ["ETL", "Normalization", "Deduplication", "Validation gates", "Freshness tracking", "Directus API", "Google Sheets API"],
  },
  { name: "Databases", icon: "server", items: ["PostgreSQL", "MongoDB", "Firebase", "SQLite", "Supabase"] },
  {
    name: "Tooling & IT",
    icon: "wrench",
    items: ["Git", "pytest", "GitHub Actions CI/CD", "PyInstaller", "Jupyter", "System administration", "Deployments", "Documentation"],
  },
] as const;

export const languages = [
  { name: "Arabic", level: "Native", dots: 5 },
  { name: "English", level: "Fluent · C1", dots: 5 },
  { name: "Russian", level: "Intermediate · B1", dots: 3 },
  { name: "Japanese", level: "Elementary · A1", dots: 1 },
] as const;
