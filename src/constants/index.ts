export const CATEGORIES = [
  'Frontend',
  'Backend',
  'AI',
  'Mobile',
  'DevOps',
] as const;

export type Category = (typeof CATEGORIES)[number];
