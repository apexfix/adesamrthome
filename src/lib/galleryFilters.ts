import type { InstallationProject } from "@/lib/installationProjects";

export type GalleryParams = Record<string, string | string[] | undefined>;

export function selectGallery(projects: InstallationProject[], params: GalleryParams) {
  const models = [...new Set(projects.map(project => project.category).filter(Boolean))];
  const suburbs = [...new Set(projects.map(project => project.suburb).filter(Boolean))];
  const read = (value: string | string[] | undefined, options: string[]) => {
    if (value === undefined || value === "") return null;
    if (typeof value !== "string" || value.length > 100) return undefined;
    return options.find(option => option.toLowerCase() === value.trim().toLowerCase());
  };
  const model = read(params.model, models);
  const suburb = read(params.suburb, suburbs);
  const valid = model !== undefined && suburb !== undefined;
  const results = valid ? projects.filter(project =>
    (!model || project.category === model) && (!suburb || project.suburb === suburb)) : [];
  return { valid, model, suburb, models, suburbs, results, filtered: Boolean(model || suburb) };
}
