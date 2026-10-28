export interface CreateIntegrationDto {
  name: string;
  description: string;
  status?: 'OPERATIONAL' | 'UNSTABLE' | 'FAILED';
  lastFailureAt?: string;
}
