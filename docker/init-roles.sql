-- Runs once, automatically, the first time the local Postgres volume is created.
-- Sets up the two-role split that the multi-tenant isolation model depends on:
--
--   app_migrator  owns the schema/tables. Prisma Migrate connects as this role.
--                 Being the table owner, it is exempt from Row-Level Security
--                 by default (Postgres rule: owners bypass RLS unless the
--                 table has FORCE ROW LEVEL SECURITY) -- exactly what a
--                 migration/admin connection needs.
--
--   app_user      is what the running Next.js app connects as. It owns
--                 nothing, has NOSUPERUSER/NOBYPASSRLS, and only gets the
--                 privileges granted explicitly below. Every tenant table's
--                 RLS policy applies to it in full. If this app ever ships a
--                 SQL injection bug, the blast radius is "whatever RLS
--                 allows for the current session's organization", not the
--                 whole database.
--
-- Local dev passwords match .env.example; never reuse them anywhere real.

CREATE ROLE app_migrator LOGIN PASSWORD 'app_migrator_password' CREATEDB;
CREATE ROLE app_user LOGIN PASSWORD 'app_user_password' NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS;

ALTER DATABASE resto_saas OWNER TO app_migrator;

\connect resto_saas

ALTER SCHEMA public OWNER TO app_migrator;

GRANT CONNECT ON DATABASE resto_saas TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;

-- Any table app_migrator creates from now on (i.e. every Prisma migration)
-- automatically grants row-level CRUD to app_user. This is what lets a
-- future migration add a table without a separate "don't forget to GRANT"
-- step -- RLS policies are the actual boundary, this just lets app_user
-- reach the table at all.
ALTER DEFAULT PRIVILEGES FOR ROLE app_migrator IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;
