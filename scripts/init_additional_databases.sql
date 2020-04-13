DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT *
      FROM   pg_catalog.pg_roles
      WHERE  rolname = 'postgres') THEN

      CREATE USER postgres SUPERUSER LOGIN PASSWORD 'postgres';
   END IF;
END
$do$;

CREATE DATABASE test;
GRANT ALL PRIVILEGES ON DATABASE test TO docker;
