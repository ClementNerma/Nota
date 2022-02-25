import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs'

const options: MikroOrmModuleSyncOptions = {
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  type: 'postgresql',
  host: process.env['DB_HOST'] ?? 'localhost',
  port: typeof process.env['DB_PORT'] === 'string' ? parseInt(process.env['DB_PORT']) : 5433,
  user: process.env['DB_USERNAME'] ?? 'noty-user',
  password: process.env['DB_PASSWORD'] ?? 'noty-password',
  dbName: process.env['DB_NAME'] ?? 'noty-db',
  validate: true,
  strict: true,
}

export default options
