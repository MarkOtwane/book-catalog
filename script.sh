#!/bin/bash

echo "Set up the database"

#create database
psql -U postgres -h localhost -c "CREATE DATABASE bookcatalog"

#RUN migrations
psql -U postgres -h localhost -d bookcatalog -f src/database/migrations/schema.sql

#CREATE stored procedures
psql -U postgres -h localhost -d bookcatalog -f src/database/procedures/pp_create_book.sql
psql -U postgres -h localhost -d bookcatalog -f src/database/procedures/pp_get_books.sql
psql -U postgres -h localhost -d bookcatalog -f src/database/procedures/pp_update_books.sql
psql -U postgres -h localhost -d bookcatalog -f src/database/procedures/pp_delete_books.sql



echo "Database setup complete"

echo "You can run: npm run start:dev"