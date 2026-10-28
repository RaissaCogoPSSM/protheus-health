export interface CreateCustomizationDto {
  file: string;
  moduleId: string;
  description: string;
  author?: string;
  inProductionAt?: string;
}

export interface CreateChangelogDto {
  version: string;
  date: string;
  author?: string;
  description: string;
}
