const fs = require('fs');
const path = require('path');

const updateDatabaseConfig = () => {
  const options = {
    'development': {
      'username': process.env.PSQL_USER || 'docker',
      'password': process.env.PSQL_PASSWORD || 'postgres',
      'database': process.env.PSQL_DATABASE || 'sandbox',
      'host': process.env.PSQL_HOST || '127.0.0.1',
      'dialect': 'postgres',
    },
    'test': {
      'username': process.env.PSQL_USER || 'docker',
      'password': process.env.PSQL_PASSWORD || 'postgres',
      'database': process.env.PSQL_DATABASE_TEST || 'test',
      'host': process.env.PSQL_HOST || '127.0.0.1',
      'dialect': 'postgres',
    },
    'production': {
      'username': process.env.PSQL_USER,
      'password': process.env.PSQL_PASSWORD,
      'database': process.env.PSQL_DATABASE,
      'host': process.env.PSQL_HOST,
      'dialect': 'postgres',
    }
  };

  fs.writeFileSync(path.join(__dirname, '../psql/config.json'), JSON.stringify(options));
  // eslint-disable-next-line no-console
  console.log('Postgres config updated');
};

updateDatabaseConfig();
