export interface CreateFaqDto {
  slug: string;
  title: string;
  summary: string;
  moduleId?: string;
  steps: string[];
}
