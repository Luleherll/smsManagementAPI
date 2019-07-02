const { dbConnection } = require("../config");

module.exports = {
  createDbQuery: database => `DO $do$
 DECLARE _db TEXT := '${database}';
  _user TEXT := '${dbConnection().user}';
   _password TEXT := '${dbConnection().password}';
    BEGIN CREATE EXTENSION IF NOT EXISTS dblink;
     IF EXISTS (SELECT 1 FROM pg_database WHERE datname = _db)
      THEN RAISE NOTICE 'Database already exists'; ELSE PERFORM
       dblink_connect('host=${dbConnection()
         .host} user=' || _user || ' password=' || _password || ' dbname=' || current_database());
        PERFORM dblink_exec('CREATE DATABASE ' || _db); END IF; END $do$`,
  createUserTableQuery: database =>
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
        `,

  createMessagesTableQuery: database => `
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
        `,
  createContactsTableQuery: database => `
      CREATE TABLE IF NOT EXISTS contacts
(
  name character varying(255),
  "number" numeric,
  owner integer,
  id serial NOT NULL,
  CONSTRAINT contacts_owner_fkey FOREIGN KEY (owner)
      REFERENCES users (user_id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);
ALTER TABLE contacts
  OWNER TO postgres;
      `,
  insertData: (table, fieldsArray, returnValue) => {
    let fields = "",
      values = "";
    fieldsArray.forEach((field, index) => {
      (fields += `, ${field}`), (values += `, $${index + 1}`);
    });
    return `INSERT INTO ${table}(${fields.slice(2)}) VALUES(${values.slice(
      2
    )}) RETURNING ${returnValue};`;
  },
  updateData: (table, fieldsArray, conditionsArray, returnValue) => {
    let fields = "",
      conditions = "";
    fieldsArray.forEach(
      (field, index) => (fields += `, ${field} = $${index + 1}`)
    );
    conditionsArray.forEach(
      (c, index) =>
        (conditions += `${c} = $${index + 1 + fieldsArray.length} and `)
    );
    return `UPDATE ${table} SET ${fields.slice(2)} WHERE ${conditions.slice(
      0,
      -5
    )} RETURNING ${returnValue};`;
  },
  dropMessagesTable: database => `DROP TABLE IF EXISTS messages`,
  dropUserTable: database => `DROP TABLE IF EXISTS users`,
  dropContactsTable: database => `DROP TABLE IF EXISTS contacts`
};
