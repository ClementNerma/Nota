import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs'
import { CONFIG } from './config'

const options: MikroOrmModuleSyncOptions = {
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  type: 'postgresql',
  host: CONFIG.DB_HOST,
  port: CONFIG.DB_PORT,
  user: CONFIG.DB_USERNAME,
  password: CONFIG.DB_PASSWORD,
  dbName: CONFIG.DB_NAME,
  validate: true,
  strict: true,
}

export default options
