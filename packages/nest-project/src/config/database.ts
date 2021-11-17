import { join } from 'path';

export default {
  type: 'mysql',
  host: 'localhost',
  port: 3009,
  username: 'root',
  password: '123456',
  database: 'nest',
  entities: [join(__dirname, '../', '**/**.entity{.ts,.js')],
  synchronize: true,
};
