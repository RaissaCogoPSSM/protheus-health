export interface CreateJobDto {
  name: string;
  description: string;
  schedule: string;
  status?: 'SUCCESS' | 'FAILED';
  lastRunAt?: string;
  nextRunAt?: string;
}
