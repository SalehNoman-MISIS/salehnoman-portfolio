/* One-off: export the current typed content into editable JSON under content/. */
import { writeFileSync, mkdirSync } from "node:fs";
import { site } from "../data/site";
import { about, highlights } from "../data/about";
import { topStrengths, skillGroups, languages } from "../data/skills";
import { experience } from "../data/experience";
import { education, honors, certifications } from "../data/education";
import { projects } from "../data/projects";
import { moreProjects } from "../data/more-projects";

mkdirSync("content", { recursive: true });
const w = (f: string, o: unknown) =>
  writeFileSync(`content/${f}.json`, JSON.stringify(o, null, 2) + "\n");

w("site", site);
w("about", { bio: about.bio, facts: about.facts, highlights });
w("skills", { topStrengths, skillGroups, languages });
w("experience", { experience });
w("education", { education, honors, certifications });
w("projects", { projects });
w("more-projects", { moreProjects });
console.log("✓ content/*.json written");
