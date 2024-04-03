import env from '#start/env';
import { defineConfig } from '@adonisjs/lucid';

const dbConfig = defineConfig({
  connection: 'mysql2',
  connections: {
    mysql2: {
      client: 'mysql2',
      connection: {
        port: env.get('DB_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
});

export default dbConfig;
