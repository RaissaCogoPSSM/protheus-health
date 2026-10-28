import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sql from 'mssql';

export interface ProtheusParamRow {
  FILIAL: string;
  PARAMETRO: string;
  DESCRICAO: string;
  CONTEUDO: string;
}

@Injectable()
export class ProtheusDbService implements OnModuleDestroy {
  private readonly logger = new Logger(ProtheusDbService.name);
  private pool: sql.ConnectionPool | null = null;

  constructor(private readonly config: ConfigService) {}

  private async getPool(): Promise<sql.ConnectionPool> {
    if (this.pool?.connected) return this.pool;

    const host = this.config.get<string>('PROTHEUS_DB_HOST');
    const database = this.config.get<string>('PROTHEUS_DB_DATABASE');
    const user = this.config.get<string>('PROTHEUS_DB_USER');
    const password = this.config.get<string>('PROTHEUS_DB_PASSWORD');
    if (!host || !database || !user || !password) {
      throw new Error(
        'Configuração do banco do Protheus incompleta (PROTHEUS_DB_HOST/DATABASE/USER/PASSWORD)',
      );
    }

    const port = Number(this.config.get<string>('PROTHEUS_DB_PORT') ?? 1433);
    const encrypt = this.config.get<string>('PROTHEUS_DB_ENCRYPT') !== 'false';
    const trustServerCertificate = this.config.get<string>('PROTHEUS_DB_TRUST_CERT') === 'true';

    this.pool = await new sql.ConnectionPool({
      server: host,
      port,
      database,
      user,
      password,
      options: { encrypt, trustServerCertificate },
    }).connect();

    this.logger.log(`Conectado ao banco do Protheus em ${host}:${port}/${database}`);
    return this.pool;
  }

  async getParameters(): Promise<ProtheusParamRow[]> {
    const pool = await this.getPool();
    const result = await pool.request().query<ProtheusParamRow>(`
      SELECT
        X6_FIL AS FILIAL,
        X6_VAR AS PARAMETRO,
        X6_DESCRIC AS DESCRICAO,
        X6_CONTEUD AS CONTEUDO
      FROM SX6010
      WHERE D_E_L_E_T_ = ''
      ORDER BY X6_VAR, X6_FIL
    `);
    return result.recordset;
  }

  async onModuleDestroy() {
    await this.pool?.close();
  }
}
