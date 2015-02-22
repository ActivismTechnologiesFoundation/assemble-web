# assemble-web
Desktop / Mobile Web App

## Database Setup
- Ensure postgres is installed 
Run in PSQL terminal (assuming logged in as user with top-level permissions): 
`CREATE ROLE assemble WITH PASSWORD 'assemble'
 ALTER ROLE assemble WITH SUPERUSER
 CREATE DATABASE assemble WITH OWNER assemble
 CREATE DATABASE assemble_test WITH OWNER assemble`

