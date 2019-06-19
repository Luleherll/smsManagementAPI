module.exports = {
  JWT_SECRET: 'smsmanagersecret',
  dbConnection: () => ({
    user:  'postgres',
    password: 'databasepassword',
    port: 5432,
    host: 'localhost',
    database: process.env.DB_NAME || 'smsmanager'
  }),
  ADMIN_DB: 'postgres',
  UNIQUE_CONSTRAINT_CODE: '23505'
};
