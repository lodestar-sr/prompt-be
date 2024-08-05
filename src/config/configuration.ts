import * as dotenv from 'dotenv';
import { get } from 'env-var';

dotenv.config();

export interface NestConfig {
  port: number;
}

export interface CorsConfig {
  enabled: boolean;
  origin?: string;
}

export interface SwaggerConfig {
  enabled: boolean;
  title: string;
  description: string;
  version: string;
  path: string;
}

export interface SecurityConfig {
  expiresIn: string;
  refreshIn: string;
  bcryptSaltRounds: number;
}

export interface RedisConfig {
  host: string;
  password: string;
  port: number;
}

export interface Config {
  nest: NestConfig;
  cors: CorsConfig;
  swagger: SwaggerConfig;
  security: SecurityConfig;
  redis: RedisConfig;
}

const config: Config = {
  nest: {
    port: get('PORT').default(8000).asIntPositive(),
  },
  cors: {
    enabled: get('CORS_ENABLED').default('true').asBoolStrict(),
    origin: get('CORS_ORIGIN').default('*').asString(),
  },
  swagger: {
    enabled: get('SWAGGER_ENABLED').default('true').asBoolStrict(),
    title: get('SWAGGER_TITLE').default('PMS').asString(),
    description: get('SWAGGER_DESCRIPTION')
      .default('The Swagger API for PMS')
      .asString(),
    version: get('SWAGGER_VERSION').default('1.0').asString(),
    path: get('SWAGGER_PATH').default('swagger').asString(),
  },
  security: {
    expiresIn: get('JWT_EXPIRES_IN').default('30m').asString(),
    refreshIn: get('JWT_REFRESH_IN').default('7d').asString(),
    bcryptSaltRounds: get('BCRYPT_SALT_ROUNDS').default(10).asIntPositive(),
  },
  redis: {
    host: get('REDIS_HOST').required().asString(),
    password: get('REDIS_PASSWORD').default('').asString(),
    port: get('REDIS_PORT').default(6379).asPortNumber(),
  },
};

export default (): Config => config;
