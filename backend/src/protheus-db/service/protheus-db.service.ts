import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sql from 'mssql';

export interface ProtheusParamRow {
  FILIAL: string;
  PARAMETRO: string;
  DESCRICAO: string;
  CONTEUDO: string;
}

interface ProtheusDbConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  encrypt: boolean;
  trustServerCertificate: boolean;
}

// Aceita o formato de connection string do Prisma para SQL Server:
// sqlserver://host:port;database=DB;user=USER;password=PASS;...
function parseSqlServerUrl(url: string): ProtheusDbConfig {
  const withoutScheme = url.replace(/^sqlserver:\/\//i, '');
  const [authority, ...parts] = withoutScheme.split(';');
  const [host, portStr] = authority.split(':');

  const params = new Map<string, string>();
  for (const part of parts) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    params.set(part.slice(0, eq).trim().toLowerCase(), part.slice(eq + 1).trim());
  }

  const database = params.get('database');
  const user = params.get('user');
  const password = params.get('password');
  if (!host || !database || !user || !password) {
    throw new Error('DATABASE_URL_PROTHEUS inválida (esperado host, database, user e password)');
  }

  return {
    host,
    port: Number(portStr ?? params.get('port') ?? 1433),
    database,
    user,
    password,
    encrypt: (params.get('encrypt') ?? 'true') !== 'false',
    trustServerCertificate: (params.get('trustservercertificate') ?? 'false') === 'true',
  };
}

@Injectable()
export class ProtheusDbService implements OnModuleDestroy {
  private readonly logger = new Logger(ProtheusDbService.name);
  private pool: sql.ConnectionPool | null = null;

  constructor(private readonly config: ConfigService) {}

  private resolveConfig(): ProtheusDbConfig {
    const connectionUrl = this.config.get<string>('DATABASE_URL_PROTHEUS');
    if (connectionUrl) return parseSqlServerUrl(connectionUrl);

    const host = this.config.get<string>('PROTHEUS_DB_HOST');
    const database = this.config.get<string>('PROTHEUS_DB_DATABASE');
    const user = this.config.get<string>('PROTHEUS_DB_USER');
    const password = this.config.get<string>('PROTHEUS_DB_PASSWORD');
    if (!host || !database || !user || !password) {
      throw new Error(
        'Configuração do banco do Protheus incompleta (defina DATABASE_URL_PROTHEUS ou PROTHEUS_DB_HOST/DATABASE/USER/PASSWORD)',
      );
    }

    return {
      host,
      database,
      user,
      password,
      port: Number(this.config.get<string>('PROTHEUS_DB_PORT') ?? 1433),
      encrypt: this.config.get<string>('PROTHEUS_DB_ENCRYPT') !== 'false',
      trustServerCertificate: this.config.get<string>('PROTHEUS_DB_TRUST_CERT') === 'true',
    };
  }

  private async getPool(): Promise<sql.ConnectionPool> {
    if (this.pool?.connected) return this.pool;

    const { host, port, database, user, password, encrypt, trustServerCertificate } = this.resolveConfig();

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
