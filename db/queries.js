const { dbConnection } = require("../config");

module.exports = {
  createDbQuery: (database) => (`DO $do$
 DECLARE _db TEXT := '${database}';
  _user TEXT := '${dbConnection().user}';
   _password TEXT := '${dbConnection().password}';
    BEGIN CREATE EXTENSION IF NOT EXISTS dblink;
     IF EXISTS (SELECT 1 FROM pg_database WHERE datname = _db)
      THEN RAISE NOTICE 'Database already exists'; ELSE PERFORM
       dblink_connect('host=${dbConnection().host} user=' || _user || ' password=' || _password || ' dbname=' || current_database());
        PERFORM dblink_exec('CREATE DATABASE ' || _db); END IF; END $do$`),
  createUserTableQuery: (database) => (
    `CREATE TABLE IF NOT EXISTS users
        (
          user_id serial NOT NULL,
          name character varying(255),
          "number" numeric,
          password character varying(20),
          CONSTRAINT users_number_key UNIQUE (number),
          CONSTRAINT users_user_id_key UNIQUE (user_id)
        )
        WITH (
          OIDS=FALSE
        );
        ALTER TABLE users
          OWNER TO postgres;
        `),

  createMessagesTableQuery: (database) => (`
        CREATE TABLE IF NOT EXISTS messages
        (
          _id integer NOT NULL,
          sender integer,
          receiver integer,
          body character varying,
          status boolean,
          CONSTRAINT messages_receiver_fkey FOREIGN KEY (receiver)
              REFERENCES users (user_id) MATCH SIMPLE
              ON UPDATE CASCADE ON DELETE CASCADE,
          CONSTRAINT messages_sender_fkey FOREIGN KEY (sender)
              REFERENCES users (user_id) MATCH SIMPLE
              ON UPDATE CASCADE ON DELETE CASCADE
        )
        WITH (
          OIDS=FALSE
        );
        ALTER TABLE messages
          OWNER TO postgres;
        `),
  insertUser: `INSERT INTO users(name, number, password) VALUES($1, $2, $3) RETURNING user_id;`,
  dropMessagesTable: (database) => (`DROP TABLE IF EXISTS messages`),
  dropUserTable: (database) => (`DROP TABLE IF EXISTS users`)
};
