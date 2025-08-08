export type Filetype =
  | File
  | { type: string; source: string; originalName: string; size: number };
