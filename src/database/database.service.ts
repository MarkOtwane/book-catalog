import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { text } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { Pool, PoolClient } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private pool: Pool;

  constructor(private configService: ConfigService) {
    const host = this.configService.get<string>('DB_HOST');
    const port = this.configService.get<number>('DB_PORT');
    const user = this.configService.get<string>('DB_USERNAME');
    const password = this.configService.get<string>('DB_PASSWORD');
    const database = this.configService.get<string>('DB_NAME');

    if (!host || !port || !user || !password || !database) {
      throw new Error('Database configuration is missing or invalid');
    }

    this.pool = new Pool({
      host: host as string,
      port: port as number,
      user: user as string,
      password: password as string,
      database: database as string,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  async onModuleInit() {
    try {
      await this.pool.query('SELECT NOW()');
      this.logger.log('Database connection established successfully');

      await this.runMigrations();
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Failed to connect to database:', error.message);
        throw error;
      } else {
        this.logger.error('Failed to connect to database:', String(error));
        throw new Error(String(error));
      }
    }
  }
  runMigrations() {
    throw new Error('Method not implemented.');
  }

  async onModuleDestroy() {
    await this.pool.end();
    this.logger.log('Database connection pool closed');
  }

  getPool(): Pool {
    return this.pool;
  }

  async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  async query(text: string, params?: any[]) {
    const start = Date.now();
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Query failed: ${text}`, error.message);
        throw error;
      } else {
        this.logger.error(`Query failed: ${text}`, String(error));
        throw new Error(String(error));
      }
    }
      return res;
    } catch (error: any) {
      this.logger.error(`Query failed: ${text}`, error?.message || error);
      throw error;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Migration failed:', error.message);
        throw error;
      } else {
        this.logger.error('Migration failed:', String(error));
        throw new Error(String(error));
      }
    }
    try {
      const migrationPath = path.join(__dirname, 'migrations', 'init.sql');
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

      await this.pool.query(migrationSQL);
      this.logger.log('Database migrations completed successfully');
    } catch (error: any) {
      this.logger.error('Migration failed:', error?.message || error);
      throw error;
    }
  }
}
