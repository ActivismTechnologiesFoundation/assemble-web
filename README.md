# assemble-web
Desktop / Mobile Web App

## Database Setup
- Ensure postgres is installed 
Run in PSQL terminal (assuming logged in as user with top-level permissions):<br/>
`CREATE ROLE assemble WITH PASSWORD 'assemble'`<br/>
`ALTER ROLE assemble WITH LOGIN`<br/>
`CREATE DATABASE assemble WITH OWNER assemble`<br/>
`CREATE DATABASE assemble_test WITH OWNER assemble`<br/>

