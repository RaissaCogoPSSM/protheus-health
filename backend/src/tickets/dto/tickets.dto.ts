export interface CreateTicketDto {
  number: string;
  title: string;
  category: 'FIX' | 'IMPROVEMENT';
  target: 'TOTVS' | 'CONSULTANCY';
  status?: 'OPEN' | 'IN_PROGRESS' | 'WAITING_TOTVS' | 'DONE';
  openedAt?: string;
}
