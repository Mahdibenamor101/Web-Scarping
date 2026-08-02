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

-- Same idea, but for sequences: a `SERIAL`/identity column (e.g.
-- Order.orderNumber, see the growth_features migration) implicitly owns a
-- sequence that Postgres does NOT cover under the table grant above --
-- INSERT on the table alone isn't enough, the role calling nextval() also
-- needs USAGE (to advance it) and SELECT (Prisma reads it back after
-- insert) directly on the sequence. Forgotten once already; see the
-- fix_order_number_sequence_grant migration for the same grant applied to
-- a database that was already provisioned before this line existed.
ALTER DEFAULT PRIVILEGES FOR ROLE app_migrator IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO app_user;
